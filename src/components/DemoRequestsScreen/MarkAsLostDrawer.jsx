import React, { useState,useEffect } from "react";
import { useSubscription } from "../../Context/SubscriptionContext";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const MarkAsLostDrawer = ({
  open,
  onClose,
  selectedItem,fetchData

}) => {
  const { getDropReasons,dropDemoRequest} = useSubscription();
   const [dropReasons, setDropReasons] = useState([]);
    const [openDropReason, setOpenDropReason] =
    useState(false);
    const [dropreasonError,setDropReasonError] = useState("")
    const [modalType, setModalType] = useState("success");
      const [showSuccess, setShowSuccess] = useState(false);
      const [message, setMessage] = useState("");
const handleClose = () => {

  setSelectedReason("");

  setComments("");

  setOpenDropReason(false);
  setDropReasonError("")

  onClose()

};
   useEffect(() => {
 
   const fetchDropReasons = async () => {
 
     const res = await getDropReasons();
 
     if (res.success) {
 
       setDropReasons(res.data);
 
     }
 
   };
 
   fetchDropReasons();
 
 }, []);

 

  const [selectedReason, setSelectedReason] =
    useState("");

  const [comments, setComments] =
    useState("");


 const handleSubmit = async () => {

  if (!selectedReason) {

    setDropReasonError(
      "Drop Reason is required"
    );

    return;

  }

  const payload = {

    comments: comments,

    dropReason: selectedReason

  };

  const res =
    await dropDemoRequest(
      selectedItem?.requestId,
      payload
    );

if (res?.success) {

  setModalType("success");

  setMessage(
    res.message
  );

  setShowSuccess(true);

  fetchData();

  setTimeout(() => {

    setShowSuccess(false);

    handleClose();

  }, 1500);

}else {

    setModalType("error");

    setMessage(
      res.message
    );

    setShowSuccess(true);

    setTimeout(() => {

      setShowSuccess(false);

    }, 1500);

  }

};
  if (!open) return null;

  return (
    <>
 <Toast
          show={showSuccess}
          message={message}
          type={modalType}

        />
    <div className="fixed inset-0 z-[99999]">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* DRAWER */}
      <div
        className="
          fixed
          top-3
          right-3
          bottom-3
          w-[520px]
          bg-white
          rounded-2xl
          shadow-2xl
          flex
          flex-col
          overflow-hidden
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

          <div>

            <h2 className="text-[20px] font-semibold text-left">
              Mark as Lost
            </h2>

            <p className="text-[12px] text-gray-500 mt-1">
              Update request as dropped
            </p>

          </div>

          <button
            onClick={handleClose}
            className="text-red-500 text-lg cursor-pointer"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

        

          {/* STATUS */}
          <div className="mb-5">

            <label className="block text-sm font-medium mb-2 text-left">

              Update Lead Status
              <span className="text-red-500">
                *
              </span>

            </label>

            <div
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                text-sm
                bg-[#F9FAFB]
                text-left
              "
            >
              Dropped Lost
            </div>

          </div>

          {/* DROP REASON */}
          <div className="mt-4">

    <label className="block text-sm font-medium mb-2 text-left">
      Drop Reason <span className="text-red-500">*</span>
    </label>

   <div className="relative">

  {/* SELECT BOX */}
  <div
    onClick={() =>
      setOpenDropReason(!openDropReason)
    }
    className="
      w-full
      border
      border-gray-300
      rounded-xl
      px-4
      py-3
      text-sm
      cursor-pointer
      flex
      items-center
      justify-between
      bg-white
    "
  >

  <span>

  {selectedReason
    ? dropReasons.find(
        (x) =>
          x.key === selectedReason
      )?.value
    : "Select Drop Reason"}

</span>

    <span>⌄</span>

  </div>

  {/* DROPDOWN */}
  {openDropReason && (
    <div
      className="
        absolute
        top-full
        left-0
        mt-1
        w-full
        bg-white
        border
        border-gray-300
        rounded-xl
        shadow-lg
        max-h-[220px]
        overflow-y-auto
        z-[9999] text-left
      "
    >

      {dropReasons.map((item) => (

        <div
          key={item.key}
        onClick={() => {

  setSelectedReason(
    item.key
  );

  setOpenDropReason(false);
  setDropReasonError("")

}}
          className="
            px-4
            py-3
            text-sm
            cursor-pointer
            hover:bg-gray-100
          "
        >
          {item.value}
        </div>

      ))}

    </div>
  )}

</div>

  </div>
  {dropreasonError && (

  

    <ErrorMessage
      message={dropreasonError}
      type="error"
    />

 

)}

          {/* COMMENTS */}
          <div className="mt-4">

            <label className="block text-sm font-medium mb-2 text-left">

              Additional Comments
              

            </label>

            <textarea
              value={comments}
              onChange={(e) =>
                setComments(e.target.value)
              }
              placeholder="Type comments here..."
              className="
                w-full
                h-[130px]
                border
                border-gray-300
                rounded-xl
                p-4
                resize-none
                outline-none
                text-sm
                placeholder:text-gray-400
                focus:border-blue-500
              "
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">

          <button
            onClick={handleClose}
            className="
              px-5
              py-2
              border
              border-gray-300
              rounded-lg
              hover:bg-gray-50
            "
          >
            Cancel
          </button>

          <button
           onClick={handleSubmit}
            className="
              px-6
              py-2
              rounded-lg
              text-white
              transition-all bg-blue-600 hover:bg-blue-700"

            
             
                
          >
            Submit
          </button>

        </div>

      </div>

    </div>
    </>

  );

};

export default MarkAsLostDrawer;