import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Circle from "../../assets/menucircle.png";
import { useSubscription } from "../../Context/SubscriptionContext";
import { useRole } from "../../Context/RoleContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import Arrow from "../../assets/direction-down 01.png";
import ArrowRight from "../../assets/arrow-right.png";
import Search from "../../assets/Search.png";

const DemoRequests = () => {

  const { getDemoRequests, loading, getAgentsDropdown } = useSubscription();
  const { adminDetails, agents, getAllAgents, assignStaff } = useRole();
  const dropdownRef = useRef(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownValue, setDropdownValue] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [assignError, setAssignError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [pageSize, setPageSize] = useState("")
  const [agentList, setAgentList] = useState([])
  useEffect(() => {
    const fetchAgents = async () => {
      const res = await getAgentsDropdown();
      if (res.success) {

        setAgentList(res.data)
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-btn")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  console.log("agentList", agentList)
  useEffect(() => {
    getAllAgents()
  }, [])
  const fetchData = async () => {
    const res = await getDemoRequests(page, size, search);

    if (res?.success) {
      setData(res.data.demoRequestList || []);
      setTotalItems(res.data.totalItems);
      setTotalPages(res.data.totalPages);
      setPageSize(res.data.pageSize)
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size, search]);

  const start = totalItems === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);


  const getStatus = (item) => {
    if (item.demoRequestStatus === "COMPLETED") {
      return { text: "Converted", color: "green" };
    }
    if (item.isAssigned) {
      return { text: "In Progress", color: "yellow" };
    }
    return { text: "New", color: "yellow" };
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-btn")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAssignStaff = async () => {
    if (!dropdownValue) {
      setAssignError("Please Select Agent");
      return;
    }

    const res = await assignStaff(
      selectedItem.requestId,
      dropdownValue
    );
    console.log("Response", res);


    if (res.success) {
      setModalType("success");
      setMessage("Updated Successfully");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);

        setDropdownValue("");
        setShowModal(false);
        fetchData();
      }, 1500);

    } else {

      setAssignError(res.message || "Failed");
    }
  };

  return (
    <DashboardLayout>
      <>
        <Toast
          show={showSuccess}
          message={message}
          type={modalType}

        />
        <div className="p-6 pt-1">



          <div className="flex justify-between items-center mb-3">

            <h1 className="text-lg font-semibold font-inter">
              DemoRequests
            </h1>
            {/* Icon */}
            <div className="relative w-64">
              <img
                src={Search}
                alt="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              />

              {/* Input */}
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="w-full border border-gray-300 pl-9 pr-4 py-2 rounded-lg text-sm"
              />

            </div>
          </div>


          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-230px)]">

            <div className="max-h-[420px] overflow-y-auto">

              <table className="w-full text-sm">


                <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Organization</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Assigned Staff</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Status</th>
                    {/* <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Conversion</th> */}
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Actions</th>
                  </tr>
                </thead>


                <tbody className="divide-y divide-gray-200">

                  {loading ? (


                    Array.from({ length: size }).map((_, i) => (
                      <tr key={i} className="animate-pulse">


                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-6"></div>
                        </td>


                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </td>


                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </td>

                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </td>


                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </td>


                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </td>


                        <td className="px-4 py-2">
                          <div className="h-5 bg-gray-200 rounded w-6"></div>
                        </td>

                      </tr>
                    ))

                  ) : data.length > 0 ? (

                    data.map((item, index) => (
                      <tr key={item.requestId} className="text-[13px] hover:bg-gray-50">

                        <td className="px-4 py-2">
                          {(page - 1) * size + index + 1}
                        </td>

                        <td className="px-4 py-2 text-[12px]">
                          {item.name || "----"}
                        </td>

                        <td className="px-4 py-2 text-[12px]">
                          {item.organization || "----"}
                        </td>

                        <td className="px-4 py-2 text-[12px]">
                          {item.requestedDate || "----"}
                        </td>

                        <td className="px-4 py-2 text-[12px]">
                          {item.assignedTo || "Un Assigned"}
                        </td>

                        <td className="px-4 py-2 text-[12px]">
                          {item.demoRequestStatus}
                        </td>

                        <td className="px-4 py-2 relative">

                          <img
                            src={Circle}
                            alt="menu"
                            className="w-5 h-5 cursor-pointer menu-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu({
                                id: item.requestId,
                                x: e.clientX,
                                y: e.clientY
                              });
                            }}
                          />

                          {openMenu?.id === item.requestId && (
                            <div
                              className="fixed w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-[99999]"
                              style={{
                                top: openMenu.y + 5,
                                left: openMenu.x - 120
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowModal(true);
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Assign Staff
                              </button>
                            </div>
                          )}

                        </td>

                      </tr>
                    ))

                  ) : (

                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-400">
                        No Data Found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>


          <div className="flex justify-between items-center px-4 py-3 text-sm">

            <span>
              Total Record Count :
              <span className="text-blue-600 ml-1">{pageSize}</span>
            </span>

            <div className="flex items-center gap-4">


              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1"
              >

                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>


              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <img src={ArrowRight} className="w-[15px] h-[15px]" />
              </button>


              <span className="border px-3 py-1 rounded bg-gray-50">
                {page}
              </span>


              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <img src={ArrowRight} className="w-[15px] h-[15px] scale-x-[-1]" />
              </button>


              <span className="text-gray-400">
                {start} - {end}
              </span>

            </div>

          </div>

        </div>
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
            onClick={() => {
              setShowModal(false);
              setAssignError("");
              setDropdownValue("");
            }}
          >
            <div
              className="bg-white rounded-xl w-[400px] p-6"
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="text-lg font-semibold mb-4 text-left">
                Assign Staff<span className="text-red-500"> *</span>
              </h2>

              {/* 🔽 CUSTOM DROPDOWN */}
              <div className="relative mb-4" ref={dropdownRef}>

                {/* Selected box */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(!openDropdown);
                    setAssignError("")
                  }}
                  className="w-full border-1 border-gray-300 rounded-xl px-4 py-2 flex justify-between items-center cursor-pointer text-left"
                >
                  <span className="text-sm">
                    {agentList.find(a => a.agentId === dropdownValue)?.agentName || "Select Staff"}
                  </span>
                  {/* <span>▾</span> */}
                  <img src={Arrow} className="w-[25px] h-[25px]" />
                </div>

                {/* Dropdown list */}
                {openDropdown && (
                  <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border max-h-44 overflow-y-auto z-[9999] text-left">

                    {agentList.map((agent) => (
                      <div
                        key={agent.agentId}
                        onClick={() => {
                          setDropdownValue(agent.agentId);
                          setOpenDropdown(false);
                        }}
                        className={`px-4 py-2 cursor-pointer text-sm
                  ${dropdownValue === agent.agentId
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
              {assignError && (
                <ErrorMessage message={assignError} type="error" />
              )}
              {/* BUTTONS */}
              <div className="flex justify-end gap-3">

                <button
                  onClick={() => {
                    setShowModal(false);
                    setAssignError("");
                    setDropdownValue("");
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAssignStaff}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>

              </div>

            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
};

export default DemoRequests;