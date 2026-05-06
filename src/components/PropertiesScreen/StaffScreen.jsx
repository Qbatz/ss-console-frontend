import React, { useState, useRef, useEffect } from "react";
import swap from "../../assets/arrowswap.png";
import { useOwners } from "../../Context/OwnersContext";
import ErrorMeesage from "../../components/ErrorMessage/ErrorMessage";
import Toast from "../../components/SuccessModal/ToastDesign";
import Eye from "../../assets/eye.png";
import EyeClose from "../../assets/EyeIcon.png";
import Arrow from "../../assets/direction-down 01.png";
import { useHostel } from "../../Context/HostelListContext";


const StaffScreen = ({ hostelData, refreshHostel, }) => {
  const masters = hostelData?.masters || [];
  const staffs = hostelData?.staffs || [];
  const owner = hostelData?.owner ;

  // const mastersList = [
  //   {
  //     fullName: owner?.fullName,
  //     email: owner?.emailId,
  //     mobileNo: owner?.mobile,
  //     updatedAt: "—",
  //     userId: owner?.ownerId,
  //     isOwner: true,
  //   },
  //   ...(masters || []),
  // ];
  const mastersList = [
  {
    fullName: owner?.fullName,
    email: owner?.emailId,
    mobileNo: owner?.mobileNo,
    updatedAt: "—",
    userId: owner?.userId,
    isOwner: true,
  },
  ...(masters || []).map(m => ({
    ...m,
    email: m.email || m.emailId // 🔥 normalize
  })),
];
const { updateTableColumns,resetTableColumns } = useHostel();
  const { changeOwnerPassword } = useOwners();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("")
  const [conformPasswordError, setConformPasswordError] = useState("")
  const [finalError, setFinalError] = useState("")
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showColumnsModal, setShowColumnsModal] = useState(false);
// const [selectedColumns, setSelectedColumns] = useState([]);
  const menuRef = useRef(null);
  const [showDrawer, setShowDrawer] = useState(false);
const [selectedColumns, setSelectedColumns] = useState([]);
const [search, setSearch] = useState("");
const [dragIndex, setDragIndex] = useState(null);

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
  const handleClose = () => {
    setShowResetModal(false)
    setFinalError("")
    setNewPassword("")
    setCurrentPassword("")
    setConformPasswordError("")
    setNewPasswordError("")
  }
  const isAllSelected =
  selectedColumns.length > 0 &&
  selectedColumns.every(col => col.selected);

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
    if (!newPassword) {
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
  const handleSaveColumns = async () => {
  const payload = {
    hostelId: hostelData?.hostelId,
    userId: selectedUser?.userId,
    moduleName:selectedUser?.tableColumns[0]?.moduleName,
    columns: selectedColumns.map((col, index) => ({
      order: index + 1,
      fieldName: col.fieldName,
      isSelected: col.selected,
    })),
  };

  const res = await updateTableColumns(payload);

  if (res.success) {
     refreshHostel();
    setShowDrawer(false);
  } else {
    console.log(res.message);
  }
};
console.log("selectedUser",selectedUser)
const handleResetColumns = async () => {
  const payload = {
    hostelId: hostelData?.hostelId,
    userId: selectedUser?.userId,
    moduleName:selectedUser?.tableColumns[0]?.moduleName,
  };

  const res = await resetTableColumns(payload);

  if (res.success) {
    refreshHostel();
    
  } else {
    console.log(res.message);
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
                  {/* <th className="px-4 py-3 text-left">USER NAME</th> */}
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      USER NAME
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  {/* <th className="px-4 py-3 text-left">MAIL</th> */}
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      Mail
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  {/* <th className="px-4 py-3 text-left">MOBILE NO</th> */}
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      MOBILE NO
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  {/* <th className="px-4 py-3 text-left">PROFILE LAST UPDATED</th> */}
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      PROFILE LAST UPDATED
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ACTIONS</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-200">

                {(!owner && masters.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No Masters Found
                    </td>
                  </tr>
                ) : (
                  mastersList.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.fullName || item.firstName}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.email || "N/A"}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.mobileNo || "N/A"}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.updatedAt || "—"}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px] relative">
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
           <button
  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
  onClick={() => {
    const tenantColumns =
      selectedUser?.tableColumns?.find(
        t => t.moduleName === selectedUser?.tableColumns[0]?.moduleName
      )?.columns || [];

    setSelectedColumns(tenantColumns);
    setShowDrawer(true);
    setOpenMenuIndex(null);
  }}
>
  Table Customization
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
                  {/* <th className="px-4 py-3 text-left">USER NAME</th> */}
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      USER NAME
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  {/* <th className="px-4 py-3 text-left">ROLE ASSIGN</th> */}
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      ROLE ASSIGN
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      Mail
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                      Mobile number
                      <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ACTIONS</th>
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

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.fullName || item.firstName}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.role || "—"}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.emailId || "N/A"}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        {item.mobileNo || "N/A"}
                      </td>

                      <td className="px-4 py-2 text-left font-medium text-[12px]">
                        <div className="flex justify-end gap-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            ⧉
                          </button>
                          {/* <button className="text-gray-400 hover:text-gray-600">
                            ⋮
                          </button> */}
                          <button
                            onClick={(e) => {
                              handleMenuClick(i + 1000, e);
                              setSelectedUser(item);
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
       <button
  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
  onClick={() => {
    const tenantColumns =
      selectedUser?.tableColumns?.find(
        t => t.moduleName === selectedUser?.tableColumns[0]?.moduleName
      )?.columns || [];

    setSelectedColumns(tenantColumns);
    setShowDrawer(true);
    setOpenMenuIndex(null);
  }}
>
  Table Customization
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
      {showResetModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2 text-left">
              Reset Password for {selectedUser?.fullName}
            </h2>

            <p className="text-sm text-gray-500 mb-6  text-left">
              This will generate a new temporary password and invalidate the
              current login credentials.
            </p>

            {/* Current Password */}
            <div className="mb-6 text-left">
              <label className="text-left font-medium text-[12px]">
                New Password  <span className="text-red-500">*</span>
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
              <label className="text-left font-medium text-[12px]">
                Confirm Password  <span className="text-red-500">*</span>
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

              <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg" onClick={handleChangePassword}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
{/* BODY */}
{showDrawer && (
  <div className="fixed inset-0 z-50 flex">

    {/* BACKDROP */}
    <div
      className="flex-1 bg-black/30"
      onClick={() => setShowDrawer(false)}
    ></div>

    {/* RIGHT DRAWER */}
    <div className="w-[400px] bg-white h-screen shadow-xl flex flex-col">

      {/* HEADER */}
      <div className="px-5 py-4 border-b flex justify-between items-center">
        <h2 className="text-[16px] font-semibold">Customize Tabs</h2>
        <button onClick={() => setShowDrawer(false)}>✕</button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4">

        <div className="flex justify-between mb-3">
          <span className="font-medium">Customize Tabs</span>

        <button
  onClick={() => {
    const updated = selectedColumns.map(col => ({
      ...col,
      selected: !isAllSelected, // 🔥 toggle
    }));
    setSelectedColumns(updated);
  }}
  className="text-blue-600 text-sm font-medium"
>
  ✓ {isAllSelected ? "Unselect all" : "Select all"}
</button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-2 rounded mb-3 w-full"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LIST */}
        <div className="space-y-2">
         {(selectedColumns || [])
  .map((col, index) => ({ ...col, originalIndex: index })) // 🔥 keep original index
  .filter(col =>
    col.fieldName.toLowerCase().includes(search.toLowerCase())
  )
  .map((col, i) => (
    <div
      key={col.fieldName}
      className="flex items-center gap-3"
      draggable
      onDragStart={() => setDragIndex(col.originalIndex)} // 🔥 FIX
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        if (dragIndex === null) return;

        const newItems = [...selectedColumns];

        const [draggedItem] = newItems.splice(dragIndex, 1);
        newItems.splice(col.originalIndex, 0, draggedItem); // 🔥 FIX

        const updated = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        setSelectedColumns(updated);
        setDragIndex(null);
      }}
    >
      <span className="cursor-grab active:cursor-grabbing">☰</span>

      <input
        type="checkbox"
        checked={col.selected}
        onChange={(e) => {
          const updated = [...selectedColumns];
          updated[col.originalIndex].selected = e.target.checked; // 🔥 FIX
          setSelectedColumns(updated);
        }}
      />

      <span>{col.fieldName}</span>
    </div>
  ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t flex justify-between">
        <button
         onClick={handleResetColumns}
        >
          Reset
        </button>

        <button
          onClick={handleSaveColumns}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default StaffScreen;