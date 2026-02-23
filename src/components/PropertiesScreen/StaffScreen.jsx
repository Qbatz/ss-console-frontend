import React,{useState,useRef,useEffect}from "react";
import swap from "../../assets/arrowswap.png";
import { useOwners } from "../../Context/OwnersContext";
import ErrorMeesage from "../../components/ErrorMessage/ErrorMessage";
import Toast from "../../components/SuccessModal/ToastDesign";
import Eye from "../../assets/eye.png";
import EyeClose from "../../assets/EyeIcon.png"

const StaffScreen = ({ hostelData }) => {
  const masters = hostelData?.masters || [];
  const staffs = hostelData?.staffs || [];
  const { changeOwnerPassword } = useOwners();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
const [showResetModal, setShowResetModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [menuPos, setMenuPos] = useState(null);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [newPasswordError,setNewPasswordError] = useState("")
const [conformPasswordError,setConformPasswordError] = useState("")
const [finalError,setFinalError] = useState("")
const [showCurrent, setShowCurrent] = useState(false);
const [showNew, setShowNew] = useState(false);
 const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
const menuRef = useRef(null);
console.log("selectedUser",selectedUser)
useEffect(() => {
  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenuIndex(null);   
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
const handleClose=()=>{
  setShowResetModal(false)
  setFinalError("")
  setNewPassword("")
  setCurrentPassword("")
  setConformPasswordError("")
  setNewPasswordError("")
}

const handleMenuClick = (index, event) => {
  const rect = event.currentTarget.getBoundingClientRect();

  // same row click → toggle close
  if (openMenuIndex === index) {
    setOpenMenuIndex(null);
    return;
  }

  setMenuPos({
    top: rect.bottom + window.scrollY,
    left: rect.right + window.scrollX,
  });

  setOpenMenuIndex(index);
};
const handleChangePassword = async () => {
    let hasError = false;
  if ( !newPassword) {
    setNewPasswordError("Please Enter NewPassword");
     hasError = true;
  }
   if (!currentPassword) {
    setConformPasswordError("Please enter Confirm Password");
    hasError = true;
  }
 if (hasError) return;
  const res = await changeOwnerPassword({
    userId: selectedUser?.userId,
    password: newPassword,
    confirmPassword: currentPassword,
  });

  if (res.success) {
    // alert(res.message);
 setModalType("success");
        setMessage(res.message);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
    setShowResetModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConformPasswordError("")
    setNewPasswordError("")
   
  } else {
    setFinalError(res.message);
  }
};
  return (
    <div className="p-4 space-y-6">
 <Toast
              show={showSuccess}
              message={message}
              type={modalType}
            />
    
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Masters</p>
         
        </div>

        <div className="border border-[#E6E8F0] rounded-xl overflow-hidden">

          {/* SCROLL AREA */}
          <div className="max-h-[250px] overflow-y-auto">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-[#F1F3F7] text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">USER NAME</th>
                  <th className="px-4 py-3 text-left">MAIL</th>
                  <th className="px-4 py-3 text-left">MOBILE NO</th>
                  <th className="px-4 py-3 text-left">PROFILE LAST UPDATED</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-200">

                {masters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No Masters Found
                    </td>
                  </tr>
                ) : (
                  masters.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-left">
                        {item.fullName || item.firstName}
                      </td>

                      <td className="px-4 py-3 text-left">
                        {item.email || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-left">
                        {item.mobileNo || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-left">
                        {item.updatedAt || "—"}
                      </td>

                    <td className="px-4 py-3 text-left relative">
  <div className="flex justify-end gap-3">

    <button className="text-gray-400 hover:text-gray-600">
      ⧉
    </button>

<button
  onClick={(e) => {
    handleMenuClick(i, e);
    setSelectedUser(item);   // ✅ store clicked user
  }}
  className="text-gray-400 hover:text-gray-600 cursor-pointer"
>
  ⋮
</button>

  </div>

 
{openMenuIndex !== null && menuPos && (
  <div
    ref={menuRef}
    className="fixed z-50 w-44 bg-white border border-gray-200 rounded-lg shadow-lg"
    style={{
      top: menuPos.top,
      left: menuPos.left,
      transform: "translateX(-100%)",
    }}
  >
    <button
      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
      onClick={() => {
        setShowResetModal(true);
        setOpenMenuIndex(null);
        setCurrentPassword(""); 
        
      }}
    >
      Reset Password
    </button>
  </div>
)}
</td>
                    </tr>
                    
                  ))
                )}

              </tbody>

            </table>
          </div>
        </div>
      </div>


      
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Users</p>
          {/* <span className="text-gray-400 cursor-pointer">⌄</span> */}
        </div>

        <div className="border border-[#E6E8F0] rounded-xl overflow-hidden">

          {/* SCROLL AREA */}
          <div className="max-h-[300px] overflow-y-auto">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-[#F1F3F7] text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">USER NAME</th>
                  <th className="px-4 py-3 text-left">ROLE ASSIGN</th>
                  <th className="px-4 py-3 text-left">MAIL</th>
                  <th className="px-4 py-3 text-left">MOBILE NO</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-200">

                {staffs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No Staffs Found
                    </td>
                  </tr>
                ) : (
                  staffs.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">

                      <td className="px-4 py-3 font-medium text-left">
                        {item.fullName || item.firstName}
                      </td>

                      <td className="px-4 py-3 text-left">
                        {item.role || "—"}
                      </td>

                      <td className="px-4 py-3 text-left">
                        {item.email || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-left">
                        {item.mobileNo || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-left">
                        <div className="flex justify-end gap-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            ⧉
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            ⋮
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        </div>
      </div>
{showResetModal && (
  <div
    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    onClick={handleClose}
  >
    <div
      className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Reset Password for {selectedUser?.fullName}
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        This will generate a new temporary password and invalidate the
        current login credentials.
      </p>

      {/* Current Password */}
      <div className="mb-6 text-left">
        <label className="text-sm font-medium">
          New Password  <span className="text-red">*</span>
        </label>

        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
           onChange={(e) => {
  setNewPassword(e.target.value);
  setNewPasswordError(""); 
  setFinalError("")
}}
            placeholder="Enter new password"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 pr-10"
          />

          {/* <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showNew ? "🙈" : "👁"}
          </button> */}
          <button
  type="button"
  onClick={() => setShowNew(!showNew)}
  className="absolute right-3 top-1/2 -translate-y-1/2"
>
  <img
    src={showNew ? Eye : EyeClose}
    alt="toggle"
    className="w-5 h-5 opacity-70"
  />
</button>
        </div>
      </div>
       {newPasswordError && (
                <ErrorMeesage message={newPasswordError} type="error" />
              )}
      <div className="mb-4 text-left">
        <label className="text-sm font-medium">
          Confirm Password  <span className="text-red">*</span>
        </label>

        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            // onChange={(e) => setCurrentPassword(e.target.value)}
                      onChange={(e) => {
  setCurrentPassword(e.target.value);
  setConformPasswordError(""); 
  setFinalError("")
}}
            placeholder="Please Enter Current Password"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 pr-10"
          />

         <button
  type="button"
  onClick={() => setShowCurrent(!showCurrent)}
  className="absolute right-3 top-1/2 -translate-y-1/2"
>
  <img
    src={showCurrent ? Eye : EyeClose}
    alt="toggle"
    className="w-5 h-5 opacity-70"
  />
</button>
        </div>
      </div>
 {conformPasswordError && (
                <ErrorMeesage message={conformPasswordError} type="error" />
              )}
      {/* New Password */}
      

    {finalError && (
                <ErrorMeesage message={finalError} type="error" />
              )}
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border rounded-lg"
          onClick={handleClose}
        >
          Cancel
        </button>

        <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg"  onClick={handleChangePassword}>
          Continue
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default StaffScreen;