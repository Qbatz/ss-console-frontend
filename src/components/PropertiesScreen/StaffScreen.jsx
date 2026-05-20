import React, { useState, useRef, useEffect } from "react";
import swap from "../../assets/arrowswap.png";
import { useOwners } from "../../Context/OwnersContext";
import ErrorMessage  from "../../components/ErrorMessage/ErrorMessage";
import Toast from "../../components/SuccessModal/ToastDesign";
import Eye from "../../assets/eye.png";
import EyeClose from "../../assets/EyeIcon.png";
import Arrow from "../../assets/direction-down 01.png";
import { useHostel } from "../../Context/HostelListContext";
import Circle from "../../assets/menucircle.png"


const StaffScreen = ({ hostelData, refreshHostel, }) => {
  const masters = hostelData?.masters || [];
  const staffs = hostelData?.staffs || [];
  const owner = hostelData?.owner;

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
  tableColumns: owner?.tableColumns || [],
},
    ...(masters || []).map(m => ({
      ...m,
      email: m.email || m.emailId // 🔥 normalize
    })),
  ];
  const { updateTableColumns, resetTableColumns,resetUserPin } = useHostel();
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
  const menuRef = useRef(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [selectedModule, setSelectedModule] = useState("");
  const [showResetPinModal, setShowResetPinModal] = useState(false);
  const [pinError,setPinError] = useState("")

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

  if (openMenuIndex === index) {
    setOpenMenuIndex(null);
    return;
  }

  const viewportHeight = window.innerHeight;

  const menuHeight = 120;

  const spaceBelow = viewportHeight - rect.bottom;
setMenuPos({

  top:
    spaceBelow < menuHeight
      ? rect.top - menuHeight
      : rect.bottom + 5,

  left: rect.right - 10,

});
  // setMenuPos({

  //   top:
  //     spaceBelow < menuHeight
  //       ? rect.top - menuHeight
  //       : rect.bottom + 5,

  //   left: rect.right - 170,

  // });

  setOpenMenuIndex(index);

};
  // const handleMenuClick = (index, event) => {
  //   const rect = event.currentTarget.getBoundingClientRect();

  //   // same row click → toggle close
  //   if (openMenuIndex === index) {
  //     setOpenMenuIndex(null);
  //     return;
  //   }

  //   setMenuPos({
  //     top: rect.bottom + window.scrollY,
  //     left: rect.right + window.scrollX,
  //   });

  //   setOpenMenuIndex(index);
  // };
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
      moduleName: selectedUser?.tableColumns[0]?.moduleName,
      columns: selectedColumns.map((col, index) => ({
        order: index + 1,
        fieldName: col.fieldName,
        isSelected: col.selected,
      })),
    };

    const res = await updateTableColumns(payload);

    if (res.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);
      refreshHostel()
      setTimeout(() => {
        setShowSuccess(false);
        setShowDrawer(false);

      }, 1500);
      

    } else {
      console.log(res.message);
    }
  };
  console.log("selectedUser", selectedUser)

  const handleResetColumns = async () => {
    const payload = {
      hostelId: hostelData?.hostelId,
      userId: selectedUser?.userId,
      moduleName: selectedUser?.tableColumns[0]?.moduleName,
    };

    const res = await resetTableColumns(payload);

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        refreshHostel();
        // setShowDrawer(false);
      }, 1500);


    } else {
      console.log(res.message);
    }
  };
  const handleResetPin = async () => {

  const res = await resetUserPin(
    selectedUser?.userId
  );

  if (res.success) {

    setModalType("success");
    setMessage(res.data);
    setShowSuccess(true);

    setShowResetPinModal(false);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  } else {

   
setPinError(res.message)
    

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
                            <img src={Circle} className="w-5 h-5" />
                          </button>

                        </div>


                        {openMenuIndex !== null && menuPos && (
                          <div
                            ref={menuRef}
                           className="fixed z-50 w-44 bg-white border border-gray-200 rounded-xl shadow bg-white overflow-hidden"
                            style={{
                              top: menuPos.top,
                              left: menuPos.left,
                             transform: "translateX(-100%)",
marginLeft: "-8px",
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

                                const defaultModule =
                                  selectedUser?.tableColumns?.[0];

                                setSelectedModule(defaultModule?.moduleName || "");

                                setSelectedColumns(defaultModule?.columns || []);

                                setShowDrawer(true);
                                setOpenMenuIndex(null);
                              }}
                            >
                              Table Customization
                            </button>


                           {/* <button
  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
  onMouseDown={(e) => {
    e.preventDefault();

    setShowResetPinModal(true);

    setTimeout(() => {
      setOpenMenuIndex(null);
    }, 0);
  }}
>
  Reset Pin
</button> */}
<button
  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
  onClick={() => {

    setShowResetPinModal(true);

    setOpenMenuIndex(null);

  }}
>
  Reset Pin
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
                            <img src={Circle} className="w-5 h-5" />
                          </button>
                        </div>
                        {/* {openMenuIndex !== null && menuPos && (
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
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setShowResetModal(true);
                                setOpenMenuIndex(null);
                                setCurrentPassword("");
                              }}
                            >
                              Reset Password
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
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
                        )} */}
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
              <ErrorMessage message={newPasswordError} type="error" />
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
              <ErrorMessage message={conformPasswordError} type="error" />
            )}
            {/* New Password */}


            {finalError && (
              <ErrorMessage message={finalError} type="error" />
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

    {/* DRAWER */}
    <div className="w-[400px] bg-white h-screen shadow-xl flex flex-col">

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          <span className="font-semibold text-[20px] text-gray-800">
            Customize Tabs
          </span>

          {selectedUser?.tableColumns?.length > 0 && (
            <button
              onClick={() => {

                const updated = selectedColumns.map(col => ({
                  ...col,
                  selected: !isAllSelected,
                }));

                setSelectedColumns(updated);

              }}
              className="text-blue-600 text-sm font-medium cursor-pointer"
            >
              ✓ {isAllSelected ? "Unselect all" : "Select all"}
            </button>
          )}

        </div>

        {/* MODULE */}
        <div className="mb-4">

          <label className="text-[12px] font-medium text-gray-600 mb-1 block text-left">
            Module
          </label>

          <select
            value={selectedModule || ""}
            onChange={(e) => {

              const moduleName = e.target.value;

              setSelectedModule(moduleName);

              const moduleData =
                selectedUser?.tableColumns?.find(
                  item => item.moduleName === moduleName
                );

              setSelectedColumns(moduleData?.columns || []);

            }}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white outline-none"
          >

            {selectedUser?.tableColumns?.length > 0 ? (

              selectedUser?.tableColumns?.map((item) => (
                <option
                  key={item.tableColumnId}
                  value={item.moduleName}
                >
                  {item.moduleName}
                </option>
              ))

            ) : (

              <option value="" disabled>
                No modules available
              </option>

            )}

          </select>

        </div>

        {/* SEARCH */}
        {selectedUser?.tableColumns?.length > 0 && (
          <input
            type="text"
            placeholder="Search"
            className="border px-3 py-2 rounded-lg mb-4 w-full outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        {/* EMPTY STATE */}
        {selectedColumns?.length === 0 ? (

          <div className="border border-dashed border-gray-300 rounded-xl h-[260px] flex flex-col items-center justify-center bg-gray-50">

            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-2xl">
              📂
            </div>

            <p className="text-gray-700 font-medium text-sm">
              No Columns Found
            </p>

            <p className="text-gray-400 text-xs mt-1 text-center px-6">
              No table columns are available for the selected module.
            </p>

          </div>

        ) : (

          <div className="space-y-2">

                  {(selectedColumns || [])
                    .map((col, index) => ({ ...col, originalIndex: index }))
                    .filter(col =>
                      col.fieldName.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((col, i) => (
                      <div
                        key={col.fieldName}
                        className="flex items-center gap-3"
                        draggable
                        onDragStart={() => setDragIndex(col.originalIndex)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {

                          if (dragIndex === null) return;

                          const newItems = [...selectedColumns];

                          const [draggedItem] = newItems.splice(dragIndex, 1);

                          newItems.splice(col.originalIndex, 0, draggedItem);

                          const updated = newItems.map((item, index) => ({
                            ...item,
                            order: index + 1,
                          }));

                          setSelectedColumns(updated);
                          setDragIndex(null);
                        }}
                      >

                        <span className="cursor-grab active:cursor-grabbing">
                          ☰
                        </span>

                        <input
                          type="checkbox"
                          checked={col.selected}
                          onChange={(e) => {

                            const updated = [...selectedColumns];

                            updated[col.originalIndex].selected =
                              e.target.checked;

                            setSelectedColumns(updated);
                          }}
                        />

                        <span>{col.fieldName}</span>

                      </div>
                    ))}

                </div>

        )}

      </div>

      {/* FOOTER */}
      {selectedUser?.tableColumns?.length > 0 && (
        <div className="p-4 border-t flex justify-between">

          <button
            onClick={handleResetColumns}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
          >
            Reset
          </button>

          <button
            onClick={handleSaveColumns}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
          >
            Save
          </button>

        </div>
      )}

    </div>
  </div>
)}
      {showResetPinModal && (
  <div
    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
         onClick={() => {
      setShowResetPinModal(false);
      setPinError("");
    }}
  >

    <div
      className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-lg font-semibold text-gray-800 mb-2 text-left">
        Reset PIN
      </h2>

      <p className="text-sm text-gray-500 mb-6 text-left">
        Are you sure you want to reset PIN for{" "}
        <span className="font-medium">
          {selectedUser?.fullName}
        </span>
        ?
      </p>
  {pinError && (
              <ErrorMessage message={pinError} type="error" />
            )}
      <div className="flex justify-end gap-3">

        <button
          className="px-4 py-2 border rounded-lg cursor-pointer"
          // onClick={() => setShowResetPinModal(false) setPinError("")}
            onClick={() => {
      setShowResetPinModal(false);
      setPinError("");
    }}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg cursor-pointer"
          onClick={handleResetPin}
        >
          OK
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
};

export default StaffScreen;