import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import swap from "../../assets/arrowswap.png";
import { useOwners } from "../../Context/OwnersContext";
import LoginImg from "../../assets/LoginImg.png";
import { useNavigate, useLocation } from "react-router-dom";
import { usePermission } from "../../Utils/permissionHelper";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import Menucircle from "../../assets/menucircle.png";
import Arrow from "../../assets/direction-down 01.png";
import AssignStaffModal from "../PropertiesScreen/AssignStaffDesign";


const Proprietors = () => {

  const { owners, totalItems, totalPages, loading, getOwners, accessError, getOwnerById, updateOwnerMobile, deleteOwner,ownerCount,activeCount ,changeOwnerPassword } = useOwners();
  const navigate = useNavigate();
 
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Owners");
  const location = useLocation();
  const isBackNavigation = location.state?.skipApi || false;
  const isFirstLoad = useRef(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [expiryFilter, setExpiryFilter] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("ALL");
const [propertyFilter, setPropertyFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("JOINING_DATE");
  const [direction, setDirection] = useState("desc");
  const [skipFirstApi, setSkipFirstApi] = useState(location.state?.skipApi || false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
  top: 0,
  left: 0,
});
const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [newPasswordError, setNewPasswordError] = useState("");
const [confirmPasswordError, setConfirmPasswordError] = useState("");
const [finalError, setFinalError] = useState("");

const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  console.log("owners", owners)


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

 
  useEffect(() => {

  
  if (isBackNavigation) {
    setPage(1);
    setSize(10);
    setExpiryFilter("ALL");
    setSearch("");
    setSortBy("JOINING_DATE");
    setDirection("desc");

    getOwners({
      page: 1,
      size: 10,
      name: "",
      sortBy: "JOINING_DATE",
      direction: "desc"
    });

    // state clear pannum
    navigate(location.pathname, { replace: true });

    return;
  }

  // 🔥 normal flow
  const filters = getFilterParams();

  getOwners({
    page,
    size,
    name: debouncedSearch,
    sortBy,
    direction,
    ...filters
  });

}, [page, size, debouncedSearch, sortBy, direction, filterType]);

const handleResetPassword = async () => {

  let hasError = false;

  setNewPasswordError("");
  setConfirmPasswordError("");
  setFinalError("");

  if (!newPassword) {
    setNewPasswordError("Please enter new password");
    hasError = true;
  }

  if (!confirmPassword) {
    setConfirmPasswordError("Please enter confirm password");
    hasError = true;
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    setFinalError("Password mismatch");
    hasError = true;
  }

  if (hasError) return;

  const res = await changeOwnerPassword({
    userId: selectedOwner?.ownerId,
    password: newPassword,
    confirmPassword: confirmPassword,
  });

  if (res.success) {

    setModalType("success");
    setMessage(res.message);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

    setShowResetPasswordModal(false);

    setNewPassword("");
    setConfirmPassword("");

  } else {

    setFinalError(res.message);

  }
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowFilterDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);
  // useEffect(() => {

  //   if (skipFirstApi) {
  //     setSkipFirstApi(false);
  //     return;
  //   }

  //   const filters = getFilterParams();

  //   getOwners({
  //     page,
  //     size,
  //     name: debouncedSearch,
  //     sortBy,
  //     direction,
  //     ...filters
  //   });

  // }, [page, size, debouncedSearch, sortBy, direction, expiryFilter]);
  // useEffect(() => {
  //   if (location.state?.skipApi) {
  //     navigate(location.pathname, { replace: true });
  //   }
  // }, []);

  // useEffect(() => {
  //   const filters = getFilterParams();

  //   getOwners({
  //     page,
  //     size,
  //     name: debouncedSearch,
  //     sortBy,
  //     direction,
  //     ...filters
  //   });
  // }, [page, size, debouncedSearch, sortBy, direction, expiryFilter]);


  // const getFilterParams = () => {
  //   if (expiryFilter === "EXPIRED") {
  //     return { isPropertiesExpired: true, isAboutToExpire: undefined };
  //   }

  //   if (expiryFilter === "ABOUT_TO_EXPIRE") {
  //     return { isPropertiesExpired: undefined, isAboutToExpire: true };
  //   }

  //   return { isPropertiesExpired: undefined, isAboutToExpire: undefined };
  // };
const getFilterParams = () => {

  switch (filterType) {

    case "EXPIRED":
      return {
        isPropertiesExpired: true
      };

    case "ABOUT_TO_EXPIRE":
      return {
        isAboutToExpire: true
      };

    case "ACTIVE":
      return {
        isActive: true
      };

    // case "INACTIVE":
    //   return {
    //     isActive: false
    //   };

    case "NO_PROPERTIES":
      return {
        hasNoProperties: true
      };

    default:
      return {};

  }

};


  console.log("page", page);
  console.log("owners", owners);
  const handleSort = (key) => {
    if (sortBy === key) {
      setDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setDirection("asc");
    }
    setPage(1);
  };
  const handleOwnerClick = async (item) => {

    const res = await getOwnerById(item.ownerId);

    if (res?.success) {

     navigate(`/ProprietorsOverview/${item.ownerId}`);

    }

  };
  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);
  const handleUpdate = async () => {

   if (!mobile) {
  setError("Please enter mobile number");
  return;
}

if (!/^[6-9]\d{9}$/.test(mobile)) {
  setError("Enter valid mobile number");
  return;
}

    const res = await updateOwnerMobile(
      selectedOwner.ownerId,
      mobile
    );

    if (res?.success) {
      setShowModal(false);
      setError("");

      // refresh table
      getOwners({
        page,
        size,
        name: search,
        sortBy,
        direction,
        ...getFilterParams()
      });

    } else {
      setError(res?.message);
    }
  };
  useEffect(() => {
  if (showDeleteModal) {
    setError("");
  }
}, [showDeleteModal]);
  const handleDelete = async () => {

    const res = await deleteOwner(selectedOwner.ownerId);

    if (res?.success) {

      setShowDeleteModal(false);

     
      getOwners({
        page,
        size,
        name: search,
        sortBy,
        direction,
        ...getFilterParams()
      });

    } else {
     
      setError(res?.message)
    }
  };
  return (
    <DashboardLayout>
 <Toast
        show={showSuccess}
        message={message}
        type={modalType}
      />
      {(canRead === false || accessError === "Access Restricted") ? (

        <div className="flex flex-col items-center justify-center h-[400px] gap-4">

          <img
            src={LoginImg}
            alt="Access Restricted"
            className="w-64 object-contain"
          />

          <p className="text-red-600 text-lg font-medium">
            {accessError}
          </p>

        </div>

      ) : (

        <div className="p-4 space-y-4">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Proprietors</h2>

            <button className="text-blue-600 flex items-center gap-1 text-sm font-medium">
              ➕ Add Proprietor
            </button>
          </div>


          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="border border-gray-300 rounded-xl p-4 bg-white">
              <p className="text-gray-500 text-sm">Total Proprietors</p>
              <p className="text-xl font-semibold mt-1">{ownerCount}</p>
            </div>

            <div className="border border-gray-300 rounded-xl p-4 bg-white">
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-xl font-semibold mt-1">{activeCount}</p>
            </div>

          </div>


          {/* Filter Row */}
          <div className="flex justify-between items-center">

           <div className="relative">

  {/* SELECT BUTTON */}
  <button
    onClick={() =>
      setShowFilterDropdown(!showFilterDropdown)
    }
    className="
      border border-gray-300
      px-3 py-2
      rounded-lg
      text-xs
      font-sans
      bg-white
      min-w-[180px]
      text-left
      flex justify-between items-center
    "
  >
    <span>{filterType}</span>

    <img src={Arrow} className="w-5 h-5"/>
  </button>

  <div className="relative" ref={dropdownRef}>
  {showFilterDropdown && (

    <div
      className="
        absolute z-50 mt-1
        w-full
        bg-white
        border border-gray-200
        rounded-xl
        shadow-lg
        max-h-[180px]
        overflow-y-auto
      "
    >

      {[
        "ALL",
        "EXPIRED",
        "ABOUT_TO_EXPIRE",
        "ACTIVE",
        // "INACTIVE",
        "NO_PROPERTIES"
      ].map((item) => (

        <div
          key={item}
          onClick={() => {
            setFilterType(item);
            setPage(1);
            setShowFilterDropdown(false);
          }}
          className="
            px-3 py-2
            text-xs
            cursor-pointer
            hover:bg-blue-50
          "
        >
          {item}
        </div>

      ))}

    </div>

  )}
  </div>

</div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPage(1);

                  const filters = getFilterParams();

                  getOwners({
                    page: 1,
                    size,
                    name: search,
                    sortBy,
                    direction,
                    ...filters
                  });
                }}


                className="bg-blue-600 text-white p-2 rounded-md"
              >
                ⟳
              </button>


              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />


            </div>

          </div>


          {/* Table Card */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col">

            <div className="max-h-[350px] overflow-y-auto">

              <table className="min-w-full text-sm">

                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>

                    <th className="px-4 py-3  text-[12px] font-semibold text-left">
                      <div className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("JOINING_DATE")}>
                        ID
                        <img src={swap} className="w-3 h-3" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-left text-[12px] font-semibold">
                      <div className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("OWNER_NAME")}>
                        Name
                        <img src={swap} className="w-3 h-3" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-left text-[12px] font-semibold">
                      <div className="flex items-center gap-1">
                        Mail
                        <img src={swap} className="w-3 h-3" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-left text-[12px] font-semibold">
                      <div className="flex items-center gap-1">
                        Mobile
                        <img src={swap} className="w-3 h-3" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-left text-[12px] font-semibold">
                      <div className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("HOSTEL_COUNT")}>
                        Props
                        <img src={swap} className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold">
                      <div className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("HOSTEL_COUNT")}>
                         Relational Agent
                        <img src={swap} className="w-3 h-3" />
                      </div>
                    </th>

                    {/* <th className="px-4 py-3 text-left text-[12px] font-semibold">
      Plan Status
    </th> */}

                    <th className="px-4 py-3 text-left text-[12px] font-semibold">
                      <div className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("LATEST_ACTIVITY")}>
                        Last Action
                        <img src={swap} className="w-3 h-3" />
                      </div>
                    </th>

                    {/* <th className="px-4 py-3 text-left text-[12px] font-semibold">
      Status
    </th> */}

                    <th className="px-4 py-3 text-left text-[12px] font-semibold">
                      Actions
                    </th>

                  </tr>
                </thead>



                <tbody>

                  {loading ? (
                    [...Array(6)].map((_, i) => (
                      <tr key={i} className="border-b border-gray-300 animate-pulse">

                        {/* Owner ID */}
                        <td className="px-4 py-2">
                          <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-2">
                          <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        </td>

                        {/* Email / Placeholder */}
                        <td className="px-4 py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </td>

                        {/* Mobile */}
                        <td className="px-4 py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </td>

                        {/* Properties */}
                        <td className="px-4 py-2">
                          <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </td>

                        {/* Last Activity */}
                        <td className="px-4 py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-2">
                          <div className="h-4 w-6 bg-gray-200 rounded"></div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    owners?.map((item, i) => (

                      <tr key={i} className="border-b border-gray-300 hover:bg-gray-50">

                        {/* <td className="px-4 py-1 text-[12px] text-left">
          {item.ownerId?.slice(0, 6)}
        </td> */}
                        <td className="px-4 py-1">
                          {(page - 1) * size + i + 1}
                        </td>

                        {/* <td className="px-4 py-1 text-blue-600 text-[12px] text-left">
          {item.fullName}
        </td> */}
                        <td
                          className="px-4 py-1 text-blue-600 text-[12px] text-left cursor-pointer hover:underline"
                          onClick={() => handleOwnerClick(item)}
                        >
                          {item.fullName}
                        </td>

                        <td className="px-4 py-1 text-[12px] text-left">
                          {item.emailId}
                        </td>

                        <td className="px-4 py-1 text-[12px] text-left">
                          {item.mobileNo}
                        </td>

                        <td className="px-4 py-1 text-blue-600 text-[12px] text-left">
                          {item.noOfProperties}
                        </td>
                        
                         <td className="px-4 py-2 text-center text-[12px] text-left whitespace-nowrap">
  {item?.relationalAgents?.[0]?.agentName || "----"}
</td>
                        <td className="px-4 py-1 text-[12px] text-left">
                          {item.lastActivityDate}
                        </td>

                        <td className="px-4 py-1 relative">

        <button
  onClick={(e) => {

    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    const menuHeight = 100;

    const spaceBelow = viewportHeight - rect.bottom;

    setMenuPosition({

      top:
        spaceBelow < menuHeight
          ? rect.top - menuHeight
          : rect.bottom + 15,

      left: rect.right - 130,

    });

    setOpenMenuId(
      openMenuId === item.ownerId ? null : item.ownerId
    );

  }}
  className={`
    p-1.5 rounded-full
    transition-all duration-150
    active:scale-90

    ${
      openMenuId === item.ownerId
        ? "bg-[#EEF2FF]"
        : "hover:bg-gray-100"
    }
  `}
>
  <img
    src={Menucircle}
    className={`
      w-5 h-5 cursor-pointer
      transition-transform duration-150
      ${
        openMenuId === item.ownerId
          ? "scale-110"
          : ""
      }
    `}
  />
</button>

                          {openMenuId === item.ownerId && (
                          <div
  className="fixed w-35 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]"
  style={{
    top: menuPosition.top,
    left: menuPosition.left,
  }}
>

                              <button
                                onClick={() => {
                                  setSelectedOwner(item);
                                  setMobile(item.mobileNo);
                                  setShowModal(true);
                                  setOpenMenuId(null);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
  onClick={() => {
    setSelectedOwner(item);
    setShowAssignModal(true);
    setOpenMenuId(null);
  }}
  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
>
  Assign Staff
</button>
                              <button
                                onClick={() => {
                                  setSelectedOwner(item);
                                  setShowDeleteModal(true);
                                  setOpenMenuId(null);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 cursor-pointer"
                              >
                                Delete
                              </button>
        <button
  onClick={() => {
    setSelectedOwner(item);
    setShowResetPasswordModal(true);
    setOpenMenuId(null);
  }}
  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
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


            {/* Pagination */}
           

          </div>
 <div className="flex justify-between items-center px-4 py-3  text-sm">

              <span className="text-gray-600">
                Total Record Count :
                <span className="text-blue-600 font-medium">{owners?.length || 0}</span>
              </span>

              <div className="flex items-center gap-3">

                <select
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border rounded-md px-2 py-1 text-sm cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>


               <button
  disabled={page <= 1}
  onClick={() => setPage(p => p - 1)}
  className={`
    px-2
    py-1
    rounded

    ${
      page <= 1
        ? "text-gray-300 cursor-not-allowed"
        : "text-textDark hover:bg-cardBg cursor-pointer"
    }
  `}
>
  &#8249;
</button>

<span
  className="
    border
    border-borderSoft
    px-3
    py-1
    rounded-card
    bg-cardBg
    text-cardTitle
    font-medium
  "
>
  {page}
</span>

<button
  disabled={page >= totalPages}
  onClick={() => setPage(p => p + 1)}
  className={`
    px-2
    py-1
    rounded

    ${
      page >= totalPages
        ? "text-gray-300 cursor-not-allowed"
        : "text-textDark hover:bg-cardBg cursor-pointer"
    }
  `}
>
  &#8250;
</button>


              </div>

            </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-5 w-[350px]">

            <h2 className="text-sm font-semibold mb-3 text-left">
              Update Mobile Number
            </h2>

            <input
  type="text"
  value={mobile}
  onChange={(e) => {

    // only numbers
    const value = e.target.value.replace(/\D/g, "");

    // max 10 digits
    if (value.length <= 10) {
      setMobile(value);
    }

    setError("");

  }}
  placeholder="Enter mobile number"
  className="w-full border rounded px-3 py-2 text-sm mb-2"
/>

            {/* {error && (
        <p className="text-red-500 text-xs mb-2">{error}</p>
      )} */}
            {error && (
              <ErrorMessage message={error} type="error" />
            )}


            <div className="flex justify-end gap-2 mt-3">

              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="px-3 py-1 border rounded text-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm cursor-pointer"
              >
                Update
              </button>

            </div>

          </div>
        </div>
      )}
      {showDeleteModal && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => {
      setShowDeleteModal(false);
      setError("");
    }}
  >
    <div
      className="bg-white rounded-xl p-5 w-[350px]"
      onClick={(e) => e.stopPropagation()}   // 🔥 inside click close aagadhu
    >
      <h2 className="text-sm font-semibold mb-2">
        Delete Owner
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Are you sure you want to delete this owner?
      </p>
{error && (
              <ErrorMessage message={error} type="error" />
            )}
      <div className="flex justify-end gap-2">

        <button
          onClick={() => {
            setShowDeleteModal(false);
            setError("");
          }}
          className="px-3 py-1 border rounded text-sm cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
        >
          Delete
        </button>

      </div>
    </div>
  </div>
)}
{showResetPasswordModal && (
<div
  className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  onClick={() => {
    setShowResetPasswordModal(false);

    setNewPassword("");
    setConfirmPassword("");

    setNewPasswordError("");
    setConfirmPasswordError("");
    setFinalError("");
  }}
>

  <div
  className="bg-white rounded-3xl w-[500px] p-5 shadow-2xl relative"
  onClick={(e) => e.stopPropagation()}
>

      <h2 className="text-[22px] font-semibold text-gray-800 mb-3 text-left">
        Reset Password for {selectedOwner?.fullName}
      </h2>

      <p className="text-gray-500 text-[15px] mb-8 leading-7 text-left">
        This will generate a new temporary password and invalidate the current login credentials.
      </p>

      {/* New Password */}
      <div className="mb-6">

        <label className="block text-[15px] font-medium mb-2 text-left">
          New Password <span className="text-red-500">*</span>
        </label>

        <div className="relative">

          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            // onChange={(e) => setNewPassword(e.target.value)}
                      onChange={(e) => {
  setNewPassword(e.target.value);
  setNewPasswordError("");
  setFinalError("")
}}
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[16px] outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            👁
          </button>

        </div>
 {newPasswordError && (
              <ErrorMessage message={newPasswordError} type="error" />
            )}
      </div>

      {/* Confirm Password */}
      <div className="mb-8">

        <label className="block text-[15px] font-medium mb-2 text-left">
          Confirm Password <span className="text-red-500">*</span>
        </label>

        <div className="relative">

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
  setConfirmPassword(e.target.value);
  setConfirmPasswordError("");
  setFinalError("")
}}
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[16px] outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            👁
          </button>

        </div>
{confirmPasswordError && (
              <ErrorMessage message={confirmPasswordError} type="error" />
            )}
      </div>

      {/* Buttons */}
      {finalError && (
              <ErrorMessage message={finalError} type="error" />
            )}
      <div className="flex justify-end gap-4">

        <button
        onClick={() => {
  setShowResetPasswordModal(false);

  setNewPassword("");
  setConfirmPassword("");

  setNewPasswordError("");
  setConfirmPasswordError("");
  setFinalError("");
}}
          className="px-8 py-3 border border-gray-300 rounded-2xl text-[16px] font-medium hover:bg-gray-50"
        >
          Cancel
        </button>

        <button onClick={handleResetPassword }
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[16px] font-medium"
        >
          Continue
        </button>

      </div>

    </div>

  </div>
)}
<AssignStaffModal
  show={showAssignModal}
  onClose={() => setShowAssignModal(false)}
  selectedHostel={selectedOwner}
  setModalType={setModalType}
  setMessage={setMessage}
  setShowSuccess={setShowSuccess}
  refreshData={() => {
    getOwners({
      page,
      size,
      name: search,
      sortBy,
      direction,
      ...getFilterParams(),
    });
  }}
/>
    </DashboardLayout>
  );
};

export default Proprietors;
