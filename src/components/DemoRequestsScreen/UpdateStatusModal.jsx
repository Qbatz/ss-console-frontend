import React, { useState, useEffect, useRef } from "react";
import { useSubscription } from "../../Context/SubscriptionContext";
import Arrow from "../../assets/direction-down 01.png";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import { usePlan } from "../../Context/PlanContexts";

const UpdateStatusModal = ({ open, onClose, demoRequestId, refreshList, currentStatus,currentStatusMobile }) => {
  const { updateDemoRequestStatus, getAgentsDropdown, getDemoRequestStatus, getDemoRequests,getDemoType,getDropReasons,getOwnerByMobile } = useSubscription();
   const { getPlansDropdown } = usePlan();
  const [statusList, setStatusList] = useState([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [demoTypes, setDemoTypes] = useState([]);
  const [dropReasons, setDropReasons] = useState([]);
  const [ownerLoading, setOwnerLoading] =
  useState(false);
  const [openOwnerDropdown, setOpenOwnerDropdown] =
  useState(false);
  const [openDropReason, setOpenDropReason] =
  useState(false);
  const [plans, setPlans] = useState([]);
const [openPlanDropdown, setOpenPlanDropdown] = useState(false);
const [showOwnerDropdown, setShowOwnerDropdown] =
  useState(false);
  useEffect(() => {

  const fetchPlans = async () => {

    const res = await getPlansDropdown();

    if (res.success) {

      setPlans(
        res.data?.otherPlans || []
      );

    }

  };

  fetchPlans();

}, []);
  useEffect(() => {

  const fetchDropReasons = async () => {

    const res = await getDropReasons();

    if (res.success) {

      setDropReasons(res.data);

    }

  };

  fetchDropReasons();

}, []);
useEffect(() => {

  const fetchDemoTypes = async () => {

    const res = await getDemoType();

    if (res.success) {

      setDemoTypes(res.data);

    }

  };

  fetchDemoTypes();

}, []);
  useEffect(() => {
    const fetchStatus = async () => {
      const res = await getDemoRequestStatus();
      if (res.success) {
        setStatusList(res.data);
      }
    };

    fetchStatus();
  }, []);
  const filteredStatuses =
    statusList.find(
      (item) => item.currentStatus === currentStatus
    )?.allowedStatuses || [];
  console.log("setStatusList", statusList)

  // const [form, setForm] = useState({
  //   demoRequestStatus: "",
  //   comments: "",
  //   presentedBy: "",
  //   presentedAt: "",
  //   agentId: ""
  // });
const [form, setForm] = useState({
  demoRequestStatus: "",
  comments: "",
  presentedBy: "",
  presentedAt: "",
  agentId: "",

  demoDate: "",
  fromTime: "",
  toTime: "",
  demoType: "",
  demoLink: "",

  ownerMobileNumber:
    currentStatusMobile || "",

  ownerParentId: "",
  ownerName: ""
});

  const [agents, setAgents] = useState([]);
  const [errors, setErrors] = useState({});
  const [agentList, setAgentList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const dropdownRef = useRef(null);
  const [updateError, setUpdateError] = useState("")
const [ownerData, setOwnerData] =
  useState(null);
  console.log("selectedAgent", selectedAgent)
  useEffect(() => {

  if (open) {

    setForm((prev) => ({
      ...prev,
      ownerMobileNumber:
        currentStatusMobile || ""
    }));

  }

}, [open, currentStatusMobile]);
useEffect(() => {

  const fetchOwner = async () => {

    if (
      form.demoRequestStatus ===
        "TRIAL_STARTED" &&
      form.ownerMobileNumber?.length >= 10
    ) {

      setOwnerLoading(true);

      const res =
        await getOwnerByMobile(
          form.ownerMobileNumber
        );

      if (res?.success) {

        const owners =
          res.data || [];

        setOwnerData(owners);

        if (owners.length > 0) {

         setForm((prev) => ({
  ...prev,
  ownerParentId: "",
  ownerName: ""
}));

        }

      } else {

        setOwnerData([]);

      }

      setOwnerLoading(false);

    } else {

      setOwnerData([]);

    }

  };

  fetchOwner();

}, [
  form.demoRequestStatus,
  form.ownerMobileNumber
]);
  const resetForm = () => {
    setForm({
      demoRequestStatus: "",
      comments: "",
      presentedBy: "",
      presentedAt: "",
      agentId: ""
    });

    setSelectedStatus("");
    setSelectedAgent("");
    setOpenDropdown(false);
    setOpenStatus(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    const fetchAgents = async () => {
      const res = await getAgentsDropdown();
      if (res.success) {
        setAgentList(res.data);
      }
    };

    fetchAgents();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // const formatDateTime = (dateTime) => {
  //   if (!dateTime) return "";
  //   const d = new Date(dateTime);
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const year = d.getFullYear();
  //   const hours = String(d.getHours()).padStart(2, "0");
  //   const minutes = String(d.getMinutes()).padStart(2, "0");
  //   return `${day}-${month}-${year} ${hours}:${minutes}`;
  // };

  const validate = () => {

    let err = {};

    // Status validation
    if (!form.demoRequestStatus) {
      err.demoRequestStatus = "Status is required";
    }


    if (
      form.demoRequestStatus === "ASSIGNED" &&
      !form.agentId
    ) {
      err.agentId = "Agent is required";
    }
if (
  form.demoRequestStatus ===
    "TRIAL_STARTED"
) {

  if (!form.ownerMobileNumber) {

    err.ownerMobileNumber =
      "Please enter mobile number";

  }

  else if (
    form.ownerMobileNumber.length < 10
  ) {

    err.ownerMobileNumber =
      "Please enter valid mobile number";

  }

  else if (
    ownerData?.length > 0 &&
    !form.ownerParentId
  ) {

    err.ownerParentId =
      "Please select owner";

  }

}
    // COMPLETED -> presentedBy required
    if (
      form.demoRequestStatus === "DEMO_COMPLETED" &&
      !form.presentedBy
    ) {
      err.presentedBy = "Agent is required";
    }

    // COMPLETED -> presentedAt required
    if (
      form.demoRequestStatus === "DEMO_COMPLETED" &&
      !form.presentedAt
    ) {
      err.presentedAt = "Presented date is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };
  // const handleSubmit = async () => {
  //   if (!validate()) return;

  //   let payload = {
  //     demoRequestStatus: form.demoRequestStatus,
  //     comments: form.comments,
  //   };

  //   // ASSIGNED
  //   if (form.demoRequestStatus === "ASSIGNED") {

  //     payload.agentId = form.agentId;
  //   }

  //   // COMPLETED
  //   if (form.demoRequestStatus === "COMPLETED") {

  //     payload.presentedBy = form.presentedBy;

  //     payload.presentedAt = formatDateTime(
  //       form.presentedAt
  //     );
  //   }

  //   const res = await updateDemoRequestStatus(
  //     demoRequestId,
  //     payload
  //   );

  //   if (res.success) {
  //     setModalType("success");
  //     setMessage(res?.message);
  //     setShowSuccess(true);
  //     await refreshList();

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //       resetForm();

  //       onClose();



  //     }, 1500);



  //   }
  //   else {

  //   }
  // };
//   const handleSubmit = async () => {

//   if (!validate()) return;

//   let payload = {
//     demoRequestStatus: form.demoRequestStatus,
//     comments: form.comments,
//   };

//   // ASSIGNED
//   if (form.demoRequestStatus === "ASSIGNED") {

//     payload.agentId = form.agentId;

//   }

//   // COMPLETED
//   if (form.demoRequestStatus === "COMPLETED") {

//     payload.presentedBy = form.presentedBy;

//     payload.presentedAt = formatDateTime(
//       form.presentedAt
//     );

//   }

//   // DEMO SCHEDULED
//   if (form.demoRequestStatus === "DEMO_SCHEDULED") {

//     payload.agentId = form.agentId;

//     payload.demoFrom = `${form.demoDate}T${form.fromTime}:00`;

//     payload.demoTo = `${form.demoDate}T${form.toTime}:00`;

//     payload.demoType = form.demoType;

//     payload.demoMeetLink = form.demoLink;

//   }

//   console.log("payload", payload);

//   const res = await updateDemoRequestStatus(
//     demoRequestId,
//     payload
//   );

//   if (res.success) {

//     setModalType("success");

//     setMessage(res?.message);

//     setShowSuccess(true);

//     await refreshList();

//     setTimeout(() => {

//       setShowSuccess(false);

//       resetForm();

//       onClose();

//     }, 1500);

//   }

// };
const formatDateTime = (dateTime) => {

  if (!dateTime) return "";

  const d = new Date(dateTime);

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const year = d.getFullYear();

  const hours = String(
    d.getHours()
  ).padStart(2, "0");

  const minutes = String(
    d.getMinutes()
  ).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;

};

const formatDemoDateTime = (date, time) => {

  if (!date || !time) return "";

  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year} ${time}`;

};

const handleSubmit = async () => {

  if (!validate()) return;

  let payload = {
    demoRequestStatus: form.demoRequestStatus,
    comments: form.comments,
    
  };

  // ASSIGNED
  if (form.demoRequestStatus === "ASSIGNED") {

    payload.agentId = form.agentId;

  }

  // COMPLETED
  if (form.demoRequestStatus === "DEMO_COMPLETED") {

    payload.presentedBy = form.presentedBy;

    payload.presentedAt = formatDateTime(
      form.presentedAt
    );

  }


  // DEMO SCHEDULED
  if (form.demoRequestStatus === "DEMO_SCHEDULED") {

    payload.agentId = form.agentId;

  payload.demoFrom = formatDemoDateTime(
  form.demoDate,
  form.fromTime
);

payload.demoTo = formatDemoDateTime(
  form.demoDate,
  form.toTime
);

    payload.demoType = form.demoType;

    payload.demoMeetLink = form.demoLink;

  }
if (form.demoRequestStatus === "DROPPED") {

  payload.dropReason = form.dropReason;

}
if (
  form.demoRequestStatus ===
  "TRIAL_STARTED"
) {

  payload.parentId =
    form.ownerParentId;

}
//   if (form.demoRequestStatus === "CONVERTED") {

//   payload.planCode = form.planCode;

// }

  const res = await updateDemoRequestStatus(
    demoRequestId,
    payload
  );

  if (res.success) {

    setModalType("success");

    setMessage(res?.message);

    setShowSuccess(true);

    await refreshList();

    setTimeout(() => {

      setShowSuccess(false);

      resetForm();

      onClose();

    }, 1500);

  } else {

    setModalType("error");

    setMessage(
      res?.message || "Failed to update status"
    );

    setShowSuccess(true);
    setTimeout(() => {

      setShowSuccess(false);

    

    }, 1500);

  }

};
  // const handleSubmit = async () => {
  //   if (!validate()) return;

  //   const payload = {
  //     ...form,
  //     presentedAt:
  //       form.demoRequestStatus === "COMPLETED"
  //         ? formatDateTime(form.presentedAt)
  //         : ""
  //   };

  //   const res = await updateDemoRequestStatus(demoRequestId, payload);

  //   if (res.success) {
  //      await refreshList();
  //     onClose();

  //   }
  // };

  if (!open) return null;

  return (
    <>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
     <div className="fixed inset-0 z-[9999]">

  {/* Overlay */}
  <div
    className="absolute inset-0 bg-black/40"
    onClick={handleClose}
  />

  {/* Drawer */}
  <div className="fixed top-3 right-3 bottom-3 w-[420px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

      <h2 className="text-[16px] font-semibold">
        Update Status
      </h2>

      <button
        onClick={handleClose}
        className="text-red-500 text-lg cursor-pointer"
      >
        ✕
      </button>

    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto px-5 py-4">

      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
      Select Status<span className="text-red-500">*</span>
    </label>
      <div className="relative mt-2">

        <div
          onClick={() => setOpenStatus(!openStatus)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer"
        >
          <span className="text-sm ">
            {
              filteredStatuses.find(
                (s) => s.key === selectedStatus
              )?.value || "Select Status"
            }
          </span>
        </div>

        {openStatus && (
          <div className="absolute mt-2 w-full bg-white border rounded-xl shadow max-h-40 overflow-y-auto z-50 text-left">

            {filteredStatuses.map((item) => (
              <div
                key={item.key}
                onClick={() => {

                  let updatedForm = {
                    ...form,
                    demoRequestStatus: item.key
                  };

                  setSelectedAgent("");

                  updatedForm = {
                    ...updatedForm,
                    presentedBy: "",
                    agentId: ""
                  };

                  setSelectedStatus(item.key);

                  setForm(updatedForm);

                  setErrors({
                    ...errors,
                    demoRequestStatus: ""
                  });

                  setOpenStatus(false);

                }}
                className={`px-4 py-3 cursor-pointer text-sm
                  ${
                    selectedStatus === item.key
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {item.value}
              </div>
            ))}

          </div>
        )}

      </div>

      {errors.demoRequestStatus && (
        <ErrorMessage
          message={errors.demoRequestStatus}
          type="error"
        />
      )}

       {form.demoRequestStatus === "DEMO_SCHEDULED" && (

  <div className="space-y-5">

  {/* Demo Date */}
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
      Demo Date <span className="text-red-500">*</span>
    </label>

    <div className="relative">

      <input
        type="date"
        name="demoDate"
        value={form.demoDate}
        onChange={handleChange}
        className="w-full h-[52px] border border-gray-300 rounded-2xl px-4 text-sm outline-none focus:border-blue-500"
      />

    </div>

  </div>

  {/* Time */}
  <div className="grid grid-cols-2 gap-4">

    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
        From Time <span className="text-red-500">*</span>
      </label>

      <input
        type="time"
        name="fromTime"
        value={form.fromTime}
        onChange={handleChange}
        className="w-full h-[52px] border border-gray-300 rounded-2xl px-4 text-sm outline-none focus:border-blue-500"
      />

    </div>

    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
        To Time <span className="text-red-500">*</span>
      </label>

      <input
        type="time"
        name="toTime"
        value={form.toTime}
        onChange={handleChange}
        className="w-full h-[52px] border border-gray-300 rounded-2xl px-4 text-sm outline-none focus:border-blue-500"
      />

    </div>

  </div>

  {/* Demo Type */}
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
      Demo Type <span className="text-red-500">*</span>
    </label>

   <select
  name="demoType"
  value={form.demoType}
  onChange={handleChange}
  className="w-full h-[52px] border border-gray-300 rounded-2xl px-4 text-sm outline-none focus:border-blue-500"
>

  <option value="">
    Select Demo Type
  </option>

  {demoTypes.map((item) => (

    <option
      key={item.key}
      value={item.key}
    >
      {item.value}
    </option>

  ))}

</select>

  </div>

  {/* Link */}
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
      Demo Platform / Link
    </label>

    <input
      type="text"
      name="demoLink"
      value={form.demoLink}
      onChange={handleChange}
      placeholder="https://zoom.com/..."
      className="w-full h-[52px] border border-gray-300 rounded-2xl px-4 text-sm outline-none focus:border-blue-500"
    />

  </div>

</div>

)}
{form.demoRequestStatus === "DROPPED" && (
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
      {form.dropReason
        ? dropReasons.find(
            (x) => x.key === form.dropReason
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

            setForm({
              ...form,
              dropReason: item.key
            });

            setOpenDropReason(false);

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
)}
{/* {form.demoRequestStatus === "CONVERTED" && (

  <div className="mt-4">

    <label className="block text-sm font-medium mb-2 text-left">
      Plan Code <span className="text-red-500">*</span>
    </label>

    <div className="relative">

      
      <div
        onClick={() =>
          setOpenPlanDropdown(!openPlanDropdown)
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
          {form.planCode
            ? plans.find(
                (x) =>
                  x.planCode === form.planCode
              )?.planCode
            : "Select Plan"}
        </span>

        <span>⌄</span>

      </div>

   
      {openPlanDropdown && (
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
            z-[9999]
          "
        >

          {plans.map((item) => (

            <div
              key={item.planId}
              onClick={() => {

                setForm({
                  ...form,
                  planCode: item.planCode
                });

                setOpenPlanDropdown(false);

              }}
              className="
                px-4
                py-3
                text-sm
                cursor-pointer
                hover:bg-gray-100
              "
            >
              {item.planCode}
            </div>

          ))}

        </div>
      )}

    </div>

  </div>

)} */}
{form.demoRequestStatus ===
  "TRIAL_STARTED" && (

  <div className="mt-4">

    <label
      className="
        block
        text-sm
        font-medium
        text-gray-700
        mb-2
        text-left
      "
    >
      Mobile Number
      <span className="text-red-500">
        *
      </span>
    </label>

    <input
  type="text"
  value={form.ownerMobileNumber}
onChange={(e) => {

  const value =
    e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

  setForm((prev) => ({
    ...prev,

    ownerMobileNumber: value,

    // CLEAR OLD SELECTED OWNER
    ownerParentId: "",
    ownerName: ""
  }));

  setErrors((prev) => ({
    ...prev,
    ownerParentId: "",
    ownerMobileNumber: ""
  }));

}}
  placeholder="Enter Mobile Number"
  className="
    w-full
    h-[52px]
    border
    border-gray-300
    rounded-2xl
    px-4
    text-sm
    outline-none
    focus:border-blue-500
  "
/>
{errors.ownerMobileNumber && (

  <ErrorMessage
    message={errors.ownerMobileNumber}
    type="error"
  />

)}

 {/* {ownerData && (

  <div
    className="
      mt-2
      border
      border-borderSoft
      rounded-xl
      bg-white
      shadow-sm
      overflow-hidden
    "
  >

    <button
      type="button"
      className="
        w-full
        px-4
        py-3
        flex
        items-center
        justify-between
        hover:bg-cardBg
        transition-all
      "
      onClick={() => {

        setForm({
          ...form,
          ownerName:
            ownerData?.fullName || ""
        });

      }}
    >

      <div className="text-left">

        <p
          className="
            text-sm
            font-medium
            text-headingDark
          "
        >
          {ownerData?.fullName || "N/A"}
        </p>

        <p
          className="
            text-xs
            text-textDark/60
            mt-1
          "
        >
          {ownerData?.emailId || "N/A"}
        </p>

      </div>

    </button>

  </div>

)} */}
{/* OWNER DROPDOWN */}
{/* OWNER LIST */}
{ownerLoading ? (

  <div
    className="
      mt-2
      text-center
      text-sm
      text-gray-500
    "
  >
    Loading...
  </div>

) : form.ownerMobileNumber?.length >= 10 ? (

  ownerData?.length > 0 ? (

    <div
      className="
        mt-3
        border
        border-borderSoft
        rounded-2xl
        overflow-hidden
        bg-white
        shadow-sm
      "
    >

      {ownerData.map((owner, index) => (

        <div
          key={index}
          onClick={() => {

  setForm((prev) => ({
    ...prev,

    ownerName:
      owner?.fullName || "",

    ownerParentId:
      owner?.parentId || ""
  }));

  setErrors((prev) => ({
    ...prev,
    ownerParentId: ""
  }));

}}
          className={`
            px-4
            py-3
            cursor-pointer
            transition-all
            border-b
            border-borderSoft

            ${
              form.ownerParentId ===
              owner?.parentId
                ? "bg-primarySoft border-l-4 border-primaryBlue"
                : "hover:bg-cardBg"
            }
          `}
        >

          <p
            className="
              text-sm
              font-medium
              text-headingDark
            "
          >
            {owner?.fullName || "N/A"}
          </p>

          <p
            className="
              text-xs
              text-textDark/60
              mt-1
            "
          >
            {owner?.emailId || "N/A"}
          </p>

        </div>

      ))}

    </div>

  ) : (

    <div
      className="
        mt-2
        border
        border-red-200
        bg-red-50
        rounded-2xl
        px-4
        py-3
        text-sm
        text-red-500
        font-medium
      "
    >
      No Data Found
    </div>

  )

) : null}
{errors.ownerParentId && (

  <ErrorMessage
    message={errors.ownerParentId}
    type="error"
  />

)}
  </div>

)}
      <textarea
        name="comments"
        placeholder="Comments"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-xl p-3 mt-4 text-sm h-28 resize-none"
      />

      {/* AGENT */}
      {(form.demoRequestStatus === "ASSIGNED" ||
        form.demoRequestStatus === "DEMO_COMPLETED") && (

        <div className="relative mt-4" ref={dropdownRef}>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(!openDropdown);
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer"
          >

            <span className="text-sm">
              {
                agentList.find(
                  a => a.agentId === selectedAgent
                )?.agentName || "Select Agent"
              }
            </span>

            <img src={Arrow} className="w-5 h-5" />

          </div>

          {openDropdown && (
            <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border max-h-44 overflow-y-auto z-[9999]">

              {agentList.map((agent) => (
                <div
                  key={agent.agentId}
                  onClick={() => {

                    setSelectedAgent(agent.agentId);

                    setForm({
                      ...form,

                      ...(form.demoRequestStatus === "ASSIGNED" && {
                        agentId: agent.agentId
                      }),

                      ...(form.demoRequestStatus === "DEMO_COMPLETED" && {
                        presentedBy: agent.agentId
                      })

                    });

                    setErrors({
                      ...errors,
                      agentId: "",
                      presentedBy: ""
                    });

                    setOpenDropdown(false);

                  }}
                  className={`px-4 py-3 cursor-pointer text-sm
                    ${
                      selectedAgent === agent.agentId
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {agent.agentName}
                </div>
              ))}

            </div>
          )}

        </div>

      )}

      {errors.agentId && (
        <ErrorMessage
          message={errors.agentId}
          type="error"
        />
      )}

      {/* DATETIME */}
      {form.demoRequestStatus === "DEMO_COMPLETED" && (
        <>
          <input
            type="datetime-local"
            name="presentedAt"
            value={form.presentedAt}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 mt-4"
          />

          {errors.presentedAt && (
            <ErrorMessage
              message={errors.presentedAt}
              type="error"
            />
          )}
        </>
      )}
  

    </div>

    {/* Footer */}
    <div className="border-t border-gray-200 p-4 flex justify-end gap-3">

      <button
        onClick={handleClose}
        className="px-5 py-2 border rounded-xl"
      >
        Cancel
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-5 py-2 rounded-xl"
      >
        Update
      </button>

    </div>

  </div>

</div>
    </>
  );
};

export default UpdateStatusModal;