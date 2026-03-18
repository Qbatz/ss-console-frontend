import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Search from "../../assets/Search.png";
import AddAdmin from "./AddAdmin";
import { useRole } from "../../Context/RoleContext";
import swap from "../../assets/arrowswap.png";
import LoginImg from "../../assets/LoginImg.png";
import Add from "../../assets/add_admin.png";
import Frame from "../../assets/Frame.png";
import DownArrow from "../../assets/dropdownImg.png"



const IamAdminUser = () => {
  const { getAdminDetails, loading, agents, getAllAgents, accessError, deactivateAgent } = useRole();

  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  console.log("agents", agents)

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
  console.log("accessError", accessError)
  const adminList = Array.isArray(admin) ? admin : [admin];
  const handleDeactivate = async (agentId) => {

    const res = await deactivateAgent(agentId);

    if (res.success) {
      alert(res.message);
    } else {
      alert(res.message);
    }

  };

  return (
    <DashboardLayout>
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
                <select className="appearance-none border  border-gray-200 rounded-lg px-3 py-2 text-sm bg-white w-full md:w-auto">

                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <img
                  src={DownArrow}
                  alt="down"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 object-contain"
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
                      {agents?.length > 0 ? (
                        agents.map((user, index) => (
                          <tr
                            // key={index}
                            key={user.agentId}
                            className="border-b last:border-0 hover:bg-gray-50 border-gray-300"
                          >
                            <td className="px-4 py-1 text-left font-semibold text-xs whitespace-nowrap text-blue-700">
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
                            <td className="px-1 py-4  relative">

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

          </div>
          <AddAdmin isOpen={open} onClose={() => setOpen(false)} />

        </>
      )}

    </DashboardLayout>
  );
};

export default IamAdminUser;
