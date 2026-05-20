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
import DemoRequestDrawer from "./AddRequest";
import UpdateStatusModal from "./UpdateStatusModal";
import CommentBox from "../../assets/message-2.png";
import Notes from "../../assets/notes.png"
const DemoRequests = () => {

  const { getDemoRequests, loading, getAgentsDropdown, updateDemoRequestStatus, addDemoRequestComment,getDemoRequestStatus,deleteDemoRequest} = useSubscription();
  const { adminDetails, agents, getAllAgents, assignStaff } = useRole();
  const dropdownRef = useRef(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
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
  const [commentError, setCommentError] = useState("")

  const [openDrawer, setOpenDrawer] = useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [statusConfig, setStatusConfig] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);


  useEffect(() => {
  const fetchStatuses = async () => {
    const res = await getDemoRequestStatus();

    if (res.success) {
      setStatusConfig(res.data);
    }
  };

  fetchStatuses();
}, []);

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
    setTableLoading(true);
    const res = await getDemoRequests(page, size, search);

    if (res?.success) {
      setData(res.data.demoRequestList || []);
      setTotalItems(res.data.totalItems);
      setTotalPages(res.data.totalPages);
      setPageSize(res.data.pageSize)
      // setComments(res.data.demoRequestList.demoRequestComments || [])
    }
    // setTableLoading(false);
    setTimeout(() => {
      setTableLoading(false);
    }, 400);


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
  console.log("selectedItem", selectedItem)
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
      setShowModal(false);
      setDropdownValue("");
      setModalType("success");
      setMessage("Updated Successfully");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);

        // setDropdownValue("");
        // setShowModal(false);

      }, 1500);
      fetchData();
    } else {

      setAssignError(res.message || "Failed");
    }
  };
  useEffect(() => {
    const container = document.getElementById("commentsBox");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [comments]);
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setCommentError("Please enter comment");
      return;
    }

    const res = await addDemoRequestComment(
      selectedItem?.requestId,
      commentText
    );

    if (res?.success) {
      setShowModal(false);

      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setCommentText("");
        setShowCommentModal(false);


      }, 1500);

      const updated = await getDemoRequests(page, size, search);

      const updatedItem = updated?.data?.demoRequestList?.find(
        (i) => i.requestId === selectedItem.requestId
      );

      setComments(updatedItem?.demoRequestComments || []);

      // setCommentText("");

    } else {

      setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);



      }, 1500);
    }
  };
  const handleDeleteDemoRequest = async () => {
  if (!selectedItem?.requestId) return;

  setDeleteLoading(true);

  const res = await deleteDemoRequest(selectedItem.requestId);

  if (res.success) {

    setModalType("success");
    setMessage(res.message || "Deleted Successfully");
    setShowSuccess(true);

    setShowDeleteModal(false);
    setOpenMenu(null);

    fetchData();

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  } else {

    setModalType("error");
    setMessage(res.message || "Failed to delete");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);
  }

  setDeleteLoading(false);
};
  //   const handleAddComment = async () => {
  //   if (!commentText) return;

  //   const res = await addDemoRequestComment(
  //     selectedItem?.requestId,
  //     commentText
  //   );

  //   if (res?.success) {

  //     // 🔥 instant UI update
  //     setComments((prev) => [
  //       ...prev,
  //       {
  //         comment: commentText,
  //         createdBy: "You",
  //         createdAtDate: new Date().toLocaleDateString(),
  //         createdAtTime: new Date().toLocaleTimeString()
  //       }
  //     ]);

  //     setCommentText("");

  //   } else {
  //     alert(res?.message);
  //   }
  // };

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


          </div>

          <div className="flex items-center justify-between mb-6">

            {/* Left side card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300 w-full max-w-xs">
              <p className="text-gray-500 text-sm font-gilroy">DemoRequestCount</p>
              <h2 className="text-2xl font-bold mt-2">{totalItems || 0}</h2>
            </div>

            {/* Right side button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => setOpenDrawer(true)}>
              Add Request
            </button>

          </div>
          <div className="flex justify-end">
            <div className="relative w-64 mb-3">
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

                  {tableLoading ? (


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

                 data.map((item, index) => {
  //                 const allowedStatuses =
  //   statusConfig.find(
  //     (s) => s.currentStatus === item.demoRequestStatus
  //   )?.allowedStatuses || [];

  // const canAssignStaff =
  //   allowedStatuses.some(
  //     (s) => s.key === "ASSIGNED"
  //   );
  //   console.log("canAssignStaff",canAssignStaff)
                  return(

                  
                      
                      <tr key={item.requestId} className="text-[13px] hover:bg-gray-50">

                        <td className="px-4 py-2 ">
                          {(page - 1) * size + index + 1}
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left">
                          {item.name || "----"}
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left ">
                          {item.organization || "----"}
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left">
                          {item.requestedDate || "----"}
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left">
                          {item.assignedTo === null
                            ? "Un Assigned"
                            : item.assignedTo?.trim() === ""
                              ? "N/A"
                              : item.assignedTo}
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left">
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
                              {/* <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowModal(true);
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              >
                                Assign Staff
                              </button> */}
{item?.canAssignStaff && (
  <button
    onClick={() => {
      setSelectedItem(item);
      setShowModal(true);
      setOpenMenu(null);
    }}
    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
  >
    Assign Staff
  </button>
)}

                              {/* <button
  disabled={!canAssignStaff}
  onClick={() => {
    if (!canAssignStaff) return;

    setSelectedItem(item);
    setShowModal(true);
    setOpenMenu(null);
  }}
  className={`w-full text-left px-4 py-2 text-sm
    ${
      canAssignStaff
        ? "hover:bg-gray-100 cursor-pointer"
        : "opacity-50 cursor-not-allowed text-gray-400"
    }`}
>
  Assign Staff
</button> */}
                              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSelectedId(item.requestId);
                                  setSelectedItem(item);
                                  setOpenStatusModal(true);
                                }}
                              >
                                Change Status
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setComments(item.demoRequestComments || []);
                                  setShowCommentModal(true);
                                }}
                              >
                                Add Comments
                              </button>
                               <button
  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 cursor-pointer"
  onClick={() => {
    setSelectedItem(item);
    setShowDeleteModal(true);
    setOpenMenu(null);
  }}
>
  Delete
</button>
                            </div>
                          )}

                        </td>

                      </tr>
                 )})

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
              <span className="text-blue-600 ml-1">{data.length || 0}</span>
            </span>

            <div className="flex items-center gap-4">


              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1 cursor-pointer"
              >

                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>


              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="cursor-pointer"
              >
                <img src={ArrowRight} className="w-[15px] h-[15px]" />
              </button>


              <span className="border px-3 py-1 rounded bg-gray-50">
                {page}
              </span>


              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer"
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

                    {/* {agentList.map((agent) => (
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
                    ))} */}
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
                        {agent.agentName?.trim() || "Name not entered"}
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
      <DemoRequestDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        fetchData={fetchData}
      />
      <UpdateStatusModal
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        demoRequestId={selectedId}
        refreshList={fetchData}
        currentStatus={selectedItem?.demoRequestStatus}
      />
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">

          {/* Overlay */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setShowCommentModal(false);
              setCommentError("");
              setCommentText("")

            }}
          ></div>

          {/* Modal */}
          <div
            className="relative bg-white rounded-xl w-[420px] shadow-xl z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">

              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <img src={Notes} className="w-4 h-4" />
                Internal Notes
              </h2>

              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setCommentError("");
                  setCommentText("");
                }}
                className="text-red-500 text-lg cursor-pointer"
              >
                ✕
              </button>

            </div>

            {/* BODY */}
            <div className="p-5">

              <label className="text-xs text-gray-500 mb-1 block text-left">
                Additional Comments <span className="text-red-500">*</span>
              </label>

              {/* TEXTAREA */}
              <textarea
                placeholder="Comment here"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setCommentError("");
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 resize-none"
              />

              {/* ADD BUTTON */}
              {commentError && (
                <ErrorMessage message={commentError} type="error" />
              )}
              <div className="flex justify-end mt-3" >
                <button onClick={handleAddComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
                >
                  ➤ Add
                </button>
              </div>

              {/* COMMENTS LIST */}
              <p className="text-[11px] text-gray-400 mt-5 mb-2 text-left">
                ALL COMMENTS
              </p>

              <div className="space-y-4 max-h-[100px] overflow-y-auto">

                {comments.map((item, index) => (
                  <div key={item.demoRequestCommentsId} className="flex gap-3">

                    {/* LEFT ICON + LINE */}
                    <div className="flex flex-col items-center">

                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <img src={CommentBox} className="w-4 h-4" />
                      </div>

                      {index !== comments.length - 1 && (
                        <div className="w-[1px] flex-1 bg-gray-300 mt-1"></div>
                      )}
                    </div>


                    <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-300">


                      <p className="text-sm font-medium text-gray-800 text-left">
                        {item.comment}
                      </p>


                      <p className="text-xs text-gray-500 mt-1 text-left">
                        {item.createdAtDate} , {item.createdAtTime}
                      </p>


                      <p className="text-xs text-gray-400 text-left">
                        Added by {item.createdBy}
                      </p>

                    </div>
                  </div>
                ))}

              </div>

            </div>



          </div>
        </div>
      )}
      {showDeleteModal && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
    onClick={() => {
      setShowDeleteModal(false);
    }}
  >
    <div
      className="bg-white rounded-xl w-[380px] p-6"
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-lg font-semibold text-left mb-2">
        Delete Demo Request
      </h2>

      <p className="text-sm text-gray-500 text-left mb-6">
        Are you sure you want to delete this demo request?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteDemoRequest}
          disabled={deleteLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          {deleteLoading ? "Deleting..." : "Delete"}
        </button>

      </div>

    </div>
  </div>
)}
    </DashboardLayout>
  );
};

export default DemoRequests;