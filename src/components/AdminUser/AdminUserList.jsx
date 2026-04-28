import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Search from "../../assets/Search.png";
import AddAdmin from "./AddAdmin";
import { useRole } from "../../Context/RoleContext";
import { useNavigate } from "react-router-dom";
import swap from "../../assets/arrowswap.png";
import LoginImg from "../../assets/LoginImg.png";
import Add from "../../assets/add_admin.png";
import Frame from "../../assets/Frame.png";
import DownArrow from "../../assets/dropdownImg.png";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";



const IamAdminUser = () => {
  const navigate = useNavigate();
  const { getAdminDetails, loading, agents, getAllAgents, accessError, deactivateAgent, reactivateAgent, getAgentDetails, getAgentRoles, agentRoles, updateAdminRole } = useRole();

  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("ACTIVE");
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [roleError, setRoleError] = useState("")


  console.log("agents", agents)

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  useEffect(() => {
    getAgentRoles()
  }, [])
  console.log("agentRoles", agentRoles)
  useEffect(() => {
    getAllAgents()
  }, [])
  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await getAdminDetails();

      if (res.success) {
        setAdmin(res.data);
      } else {
        console.log(res.message);
      }
    };

    fetchAdmin();
  }, []);
  const activeAgents = agents?.activeAgents || [];
  const inactiveAgents = agents?.inActiveAgents
    || [];
  let filteredAgents = [];

  if (status === "ACTIVE") {
    filteredAgents = activeAgents;
  } else if (status === "INACTIVE") {
    filteredAgents = inactiveAgents
      ;
  } else {
    filteredAgents = [...activeAgents, ...inactiveAgents];
  }
  console.log("accessError", accessError)
  const adminList = Array.isArray(admin) ? admin : [admin];
  const handleDeactivate = async (agentId) => {

    const res = await deactivateAgent(agentId);

    if (res.success) {

      setShowSuccess(true)
      setModalType("success");
      setMessage(res.message);
      setTimeout(() => {
        setShowSuccess(false)
      }, 1000)
    }
    else {

      setShowSuccess(true)
      setModalType("error");
      setMessage(res.message);
      setTimeout(() => {
        setShowSuccess(false)
      }, 1000)
    }

  };
  const handleOpenDetails = async (user) => {
    const res = await getAgentDetails(user.agentId);

    if (res?.success) {
      setAgentDetails(res.data);
      setShowDetailsModal(true);
    } else {
      alert(res.message);
    }
  };
  const handleUpdateRole = async () => {
    if (!selectedRoleId) {
      setRoleError("Please select a role");
      return;
    }

    // 🔥 No changes check
    if (Number(selectedRoleId) === selectedUser.roleId) {
      setRoleError("No changes detected");
      return;
    }

    const payload = {
      roleId: Number(selectedRoleId)
    };

    const res = await updateAdminRole(
      selectedUser.agentId,
      payload
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);
      await getAllAgents();

      setTimeout(() => setShowSuccess(false), 1500);
    } else {
      setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 1500);
    }
  };
  // const handleUpdateRole = async () => {
  //   if (!selectedRoleId) {
  //     setRoleError("Please select a role");
  //     return
  //   }

  //   const payload = {
  //     roleId: Number(selectedRoleId)
  //   };

  //   const res = await updateAdminRole(
  //     selectedUser.agentId,
  //     payload
  //   );

  //   if (res?.success) {
  //     setModalType("success");
  //     setMessage(res.message);
  //     setShowSuccess(true);   
  //       await getAllAgents();
  //     setTimeout(() => setShowSuccess(false), 1500);
  //   } else {
  //     setModalType("error");
  //     setMessage(res.message);
  //     setShowSuccess(true);   
  //     setTimeout(() => setShowSuccess(false), 1500);
  //   }






  // };

  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      {accessError === "Access Restricted" ? (

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
        <>
          <div className="w-full  space-y-6">

            <div className="px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center lg:text-left">
                IAM- Admin User
              </h2>

              <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3">
                <button className="flex items-center gap-2 bg-[#1E45E10D] text-blue-600 text-sm font-medium px-3 py-2 rounded-2xl hover:underline w-full sm:w-auto justify-center">
                  <img
                    src={Frame}
                    alt="Frame"
                    className="w-6 h-6 object-contain"
                  />

                  Recent Activity
                </button>

                <button className="flex items-center gap-2 text-blue-600 text-sm px-4 py-2 rounded-lg  transition w-full sm:w-auto justify-center"
                  onClick={() => setOpen(true)}>
                  <img
                    src={Add}
                    alt="Add"
                    className="w-6 h-6 object-contain"
                  /> Add Admin User
                </button>
              </div>
            </div>


            <div className="px-2 md:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-auto">
                {/* <select className="appearance-none border  border-gray-200 rounded-lg px-3 py-2 text-sm bg-white w-full md:w-auto">

                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select> */}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white w-full md:w-auto"
                >

                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <img
                  src={DownArrow}
                  alt="down"
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 object-contain cursor-pointer"
                />
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full border  border-gray-200 rounded-lg pl-4 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
                  <img src={Search} alt="Search"
                    className="w-4 h-4 object-contain" />
                </span>
              </div>
            </div>

            {/* Table Section */}
            <div className="px-2 md:px-4">
              <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm relative">

                {loading && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* ⭐ Fixed height container */}
                <div className="max-h-[400px] overflow-y-auto">

                  <table className="min-w-full text-sm">

                    {/* Header */}
                    <thead className="bg-[#F8F9FF] text-xs font-semibold text-gray-500 sticky top-0 z-10">
                      <tr>
                        {/* <th className="px-6 py-3 text-left">NAME</th> */}
                        <th className="px-4 py-3 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1 font-semibold text-xs uppercase text-[#6B7280] font-inter">
                            NAME
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>
                        <th className="px-2 py-3 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1 font-semibold text-xs uppercase text-[#6B7280] font-inter">
                            EMAIL
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>
                        <th className="px-2 py-3 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1 font-semibold text-xs uppercase text-[#6B7280] font-inter">
                            Role
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>
                        <th className="px-2 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-xs uppercase text-[#6B7280] font-inter whitespace-nowrap">
                            LAST ACTION
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>
                        {/* <th className="px-2 py-3 text-left">
                <div className="flex items-center gap-1 font-semibold text-xs uppercase text-[#6B7280] font-inter whitespace-nowrap">
                CREATED ON
                  <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                </div>
              </th> */}

                        {/* <th className="px-2 py-3 text-left font-semibold text-xs uppercase text-[#6B7280] font-inter">STATUS</th> */}
                        <th className="px-2 py-3 text-left font-semibold text-xs uppercase text-[#6B7280] font-inter">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAgents?.length > 0 ? (
                        filteredAgents.map((user, index) => (
                          <tr
                            // key={index}
                            key={user.agentId}
                            className="border-b last:border-0 hover:bg-gray-50 border-gray-300"
                          >
                            {/* <td className="px-4 py-1 text-left font-semibold text-xs whitespace-nowrap text-blue-700">
                              {user?.fullName}
                            </td> */}

                            <td
                              onClick={() => navigate(`/iam-user/${user.agentId}`)}
                              className="px-4 py-1 text-left font-semibold text-xs whitespace-nowrap text-blue-700 cursor-pointer hover:underline"
                            >
                              {user?.fullName}
                            </td>

                            <td className="px-2 py-1 text-left font-semibold text-xs whitespace-nowrap">
                              {user?.email}
                            </td>

                            <td className="px-2 py-1 text-left font-semibold text-xs whitespace-nowrap">
                              {user?.roleName || "N/A"}
                            </td>

                            <td className="px-2 py-1 text-left font-semibold text-xs whitespace-nowrap">
                              {user?.lastActiveDate} {user?.lastActiveTime}
                            </td>

                            {/* <td className="px-2 py-2 text-left font-medium text-xs whitespace-nowrap">
                {user?.createdDate || "-"}
              </td> */}

                            {/* <td className="px-2 py-4">
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active
                </span>
              </td> */}

                            {/* <td
                              className="px-1 py-4 text-gray-500 cursor-pointer"
                            onClick={() => handleDeactivate(user.agentId)}
                            >
                              ⋮
                            </td> */}
                            {/* <td className="px-1 py-4  relative">

                              <span
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpen(menuOpen === user.agentId ? null : user.agentId);
                                }}
                              >
                                ⋮
                              </span>

                              {menuOpen === user.agentId && (
                                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">

                                  <button
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setConfirmOpen(true);
                                      setMenuOpen(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                  >
                                    Deactivate
                                  </button>

                                </div>
                              )}

                            </td> */}
                            <td className="px-1 py-4 relative">
                              <span
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const spaceBelow = window.innerHeight - rect.bottom;
                                  const dropdownHeight = 70; // approx height

                                  const openUp = spaceBelow < dropdownHeight;

                                  setDropdownPosition({
                                    top: openUp
                                      ? rect.top + window.scrollY - dropdownHeight
                                      : rect.bottom + window.scrollY,
                                    left: rect.right - 140 // adjust width
                                  });

                                  setMenuOpen(menuOpen === user.agentId ? null : user.agentId);
                                }}
                              >
                                ⋮
                              </span>

                              {menuOpen === user.agentId && (
                                <div
                                  className="fixed w-36 bg-white border rounded-lg shadow-lg z-[9999]"
                                  style={{
                                    top: dropdownPosition.top,
                                    left: dropdownPosition.left
                                  }}
                                >


                                  {status !== "INACTIVE" ? (
                                    <button
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setConfirmOpen(true);
                                        setMenuOpen(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                      Deactivate
                                    </button>
                                  ) : (
                                    /* INACTIVE → show reactivate */
                                    // <button
                                    //   onClick={async () => {
                                    //     const res = await reactivateAgent(user.agentId);

                                    //     if (res.success) {
                                    //       alert(res.message);
                                    //     } else {
                                    //       alert(res.message);
                                    //     }

                                    //     setMenuOpen(null);
                                    //   }}
                                    //   className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-green-600"
                                    // >
                                    //   Reactivate
                                    // </button>
                                    <button
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setShowReactivateModal(true);
                                        setMenuOpen(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-green-600"
                                    >
                                      Reactivate
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleOpenDetails(user)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-green-600 cursor-pointer"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setSelectedRoleId(user.roleId); // current role set
                                      setShowEditModal(true);
                                      setMenuOpen(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  >
                                    Edit
                                  </button>


                                </div>

                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        !loading && (
                          <tr>
                            <td colSpan="7" className="text-center py-6 text-gray-400">
                              No Admin Found
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
            {showReactivateModal && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setShowReactivateModal(false)}
                ></div>

                {/* Modal Box */}
                <div className="relative bg-white rounded-xl shadow-xl w-[350px] p-5 z-[10000]">

                  <h2 className="text-lg font-semibold mb-2">
                    Reactivate Agent
                  </h2>

                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to reactivate this agent?
                  </p>

                  <div className="flex justify-end gap-2">

                    {/* Cancel */}
                    <button
                      onClick={() => setShowReactivateModal(false)}
                      className="px-4 py-2 border rounded-lg text-sm"
                    >
                      Cancel
                    </button>

                    {/* Confirm */}
                    <button
                      onClick={async () => {
                        const res = await reactivateAgent(selectedUser.agentId);

                        if (res.success) {

                          setModalType("success");
                          setMessage(res.message);
                        } else {
                          setModalType("error");
                          setShowSuccess(true);
                          setMessage(res.message);
                        }
                        setShowSuccess(true);

                        setTimeout(() => setShowSuccess(false), 1500);

                        setShowReactivateModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Yes, Reactivate
                    </button>

                  </div>
                </div>
              </div>
            )}

            {confirmOpen && (
              <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
                onClick={() => setConfirmOpen(false)}
              >
                <div
                  className="bg-white rounded-xl w-[400px] p-6"
                  onClick={(e) => e.stopPropagation()}
                >


                  <h2 className="text-xl font-semibold mb-4 text-left">
                    Deactivate User
                  </h2>


                  <p className="text-sm text-gray-800 mb-6 text-left">
                    Are you sure you want to deactivate this admin user?
                  </p>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3">

                    <button
                      onClick={() => setConfirmOpen(false)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      No
                    </button>

                    <button
                      onClick={() => {
                        handleDeactivate(selectedUser.agentId);
                        setConfirmOpen(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Yes
                    </button>

                  </div>

                </div>
              </div>
            )}
            {/* {showDetailsModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">

   
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowDetailsModal(false)}
    ></div>

  
    <div className="relative bg-white rounded-2xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto p-6 z-[10000]">

     
      <div className="flex justify-between items-center mb-5 border-b pb-3">
        <h2 className="text-xl font-semibold">Agent Details</h2>
        <button
          onClick={() => setShowDetailsModal(false)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>

     
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
          {agentDetails?.initials}
        </div>
        <div>
          <p className="font-semibold text-base">
            {agentDetails?.fullName}
          </p>
          <p className="text-sm text-gray-500">
            {agentDetails?.roleName}
          </p>
        </div>
      </div>

   
      <div className="grid grid-cols-2 gap-3 text-sm mb-5">

        <div>
          <p className="text-gray-500 text-left">Email</p>
          <p className="font-medium">{agentDetails?.email || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500 ">Mobile</p>
          <p className="font-medium">{agentDetails?.mobile || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500 text-left">Created By</p>
          <p className="font-medium text-left">{agentDetails?.createdBy || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500 text-left">Created Date</p>
          <p className="font-medium text-left">
            {agentDetails?.createdAtDate} {agentDetails?.createdAtTime}
          </p>
        </div>

      </div>

   
      <div>
        <h3 className="font-semibold mb-3 text-left">Recent Activities</h3>

        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">

          {agentDetails?.agentActivities?.length > 0 ? (
            agentDetails.agentActivities.map((activity, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">
                    {activity.activityType}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.description}
                  </p>
                </div>

                <div className="text-xs text-gray-400 text-right">
                  <p>{activity.createdAtDate}</p>
                  <p>{activity.createdAtTime}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No activities found</p>
          )}

        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => setShowDetailsModal(false)}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)} */}
            {showDetailsModal && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowDetailsModal(false)}
                ></div>

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] overflow-y-auto z-[10000]">

                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
                    <h2 className="text-lg font-semibold">Agent Details</h2>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="hover:text-gray-200 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-6">

                    {/* Profile */}
                    <div className="flex items-center gap-4 mb-6">

                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {agentDetails?.initials || "NA"}
                      </div>

                      <div>
                        <p className="font-semibold text-lg text-gray-900">
                          {agentDetails?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {agentDetails?.roleName}
                        </p>
                      </div>

                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">

                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-blue-400 text-xs mb-1">Email</p>
                        <p className="font-medium text-gray-800">
                          {agentDetails?.email || "-"}
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-3">
                        <p className="text-purple-400 text-xs mb-1">Mobile</p>
                        <p className="font-medium text-gray-800">
                          {agentDetails?.mobile || "-"}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-green-500 text-xs mb-1">Created By</p>
                        <p className="font-medium text-gray-800">
                          {agentDetails?.createdBy || "-"}
                        </p>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-3">
                        <p className="text-orange-400 text-xs mb-1">Created Date</p>
                        <p className="font-medium text-gray-800">
                          {agentDetails?.createdAtDate}{" "}
                          <span className="text-gray-400 text-xs">
                            {agentDetails?.createdAtTime}
                          </span>
                        </p>
                      </div>

                    </div>

                    {/* Activities */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-800">
                        Recent Activities
                      </h3>

                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">

                        {agentDetails?.agentActivities?.length > 0 ? (
                          agentDetails.agentActivities.map((activity, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 border-l-4 border-blue-500 rounded-lg p-3 flex justify-between items-center hover:shadow-sm transition"
                            >
                              <div>
                                <p className="font-medium text-sm text-gray-800">
                                  {activity.activityType}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {activity.description}
                                </p>
                              </div>

                              <div className="text-xs text-gray-400 text-right">
                                <p>{activity.createdAtDate}</p>
                                <p>{activity.createdAtTime}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm text-center py-6">
                            No activities found
                          </p>
                        )}

                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-right">
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm"
                      >
                        Close
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
          <AddAdmin isOpen={open} onClose={() => setOpen(false)} />

        </>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowEditModal(false);
              setRoleError("");
              setSelectedRoleId("");
            }}
          ></div>

          {/* Modal */}
          <div
            className="bg-white rounded-xl shadow-xl w-[350px] p-5 z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-lg font-semibold mb-4 text-left">
              Edit Role
            </h2>

            {/* DROPDOWN */}
            <select
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                setRoleError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            >
              <option value="">Select Role</option>

              {agentRoles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {roleError && (
              <ErrorMessage message={roleError} type="error" />
            )}
            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setRoleError("");
                  setSelectedRoleId("");
                }}
                className="px-4 py-2 border rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default IamAdminUser;
