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
import Notes from "../../assets/notes.png";
import  DemoRequestOverview from "../DemoRequestsScreen/DemoRequestOverview";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import MarkAsLostDrawer from "./MarkAsLostDrawer";
import { useNavigate, useLocation } from "react-router-dom";

const DemoRequests = () => {

  const { getDemoRequests, loading, getAgentsDropdown, updateDemoRequestStatus, addDemoRequestComment,getDemoRequestStatus,deleteDemoRequest,getDemoRequestComments} = useSubscription();
  const { adminDetails, agents, getAllAgents, assignStaff } = useRole();
  const dropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const navigate = useNavigate();
const agentDropdownRef = useRef(null);
  const { RangePicker } = DatePicker;
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
const [openOverview, setOpenOverview] = useState(false);

// const [startDate, setStartDate] = useState("");
// const [endDate, setEndDate] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [agentFilter, setAgentFilter] = useState("");
const [openStatusDropdown, setOpenStatusDropdown] = useState(false);

const [openAgentDropdown, setOpenAgentDropdown] = useState(false);
const [demoData,setDemoData] = useState({})
const [allComments, setAllComments] =
  useState([]);

const [dateRange, setDateRange] = useState([]);
const [showMarkLostDrawer, setShowMarkLostDrawer] =
  useState(false);
const startDate = dateRange?.[0]
  ? dayjs(dateRange[0]).format("DD-MM-YYYY")
  : "";

const endDate = dateRange?.[1]
  ? dayjs(dateRange[1]).format("DD-MM-YYYY")
  : "";

  const fetchAllComments = async (
  requestId
) => {

  const res =
    await getDemoRequestComments(
      requestId
    );

  if (res?.success) {

    setAllComments(
    res?.data?.demoRequestComments ||
    res?.data ||
    []
  );

  }

};


  useEffect(() => {
  const fetchStatuses = async () => {
    const res = await getDemoRequestStatus();

    if (res.success) {
      setStatusConfig(res.data);
    }
  };

  fetchStatuses();
}, []);
console.log("statusConfig",statusConfig)
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

    // STATUS
    if (
      statusDropdownRef.current &&
      !statusDropdownRef.current.contains(event.target)
    ) {

      setOpenStatusDropdown(false);

    }

    // AGENT
    if (
      agentDropdownRef.current &&
      !agentDropdownRef.current.contains(event.target)
    ) {

      setOpenAgentDropdown(false);

    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setOpenDropdown(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
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
  // const dropdownRef = useRef(null);

useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {

      setOpenAgentDropdown(false);

    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);
  const fetchData = async () => {

  setTableLoading(true);

  const res = await getDemoRequests(
  page,
  size,
  search,
  startDate,
  endDate,
  statusFilter,
  agentFilter
);

  if (res?.success) {

    setData(res.data.demoRequestList || []);
    setTotalItems(res.data.totalItems);
    setTotalPages(res.data.totalPages);
    setPageSize(res.data.pageSize);
    setDemoData(res.data)

  }

  setTimeout(() => {
    setTableLoading(false);
  }, 400);

};
  // const fetchData = async () => {
  //   setTableLoading(true);
  //   const res = await getDemoRequests(page, size, search);

  //   if (res?.success) {
  //     setData(res.data.demoRequestList || []);
  //     setTotalItems(res.data.totalItems);
  //     setTotalPages(res.data.totalPages);
  //     setPageSize(res.data.pageSize)
  //     // setComments(res.data.demoRequestList.demoRequestComments || [])
  //   }
  //   // setTableLoading(false);
  //   setTimeout(() => {
  //     setTableLoading(false);
  //   }, 400);


  // };

  // useEffect(() => {
  //   fetchData();
  // }, [page, size, search]);
  useEffect(() => {
  fetchData();
}, [
  page,
  size,
  search,
  startDate,
  endDate,
  statusFilter,
  agentFilter
]);

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
      dropdownValue,
      commentText
      
    );
    console.log("Response", res);


    if (res.success) {
      setShowModal(false);
      setDropdownValue("");
      setModalType("success");
      setMessage("Updated Successfully");
      setShowSuccess(true);
setCommentText("")
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
      // fetchData()
      fetchAllComments()

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

        <button
  onClick={() => setOpenDrawer(true)}
  className="
    flex
    items-center
    gap-2
    text-[#315CEC]
    font-medium
    text-sm
    cursor-pointer
  "
>

  {/* PLUS ICON */}
  <div
    className="
      w-5
      h-5
      rounded-full
      bg-[#315CEC]
      text-white
      flex
      items-center
      justify-center
      text-[14px]
      font-semibold
    "
  >
    +
  </div>

  <span>Create Demo</span>

</button>


          </div>

   <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-5
    gap-4
    mb-6
  "
>

  {[
    {
      title1: "Total Leads",
      value1: demoData?.totalLeads || 0,
      title2: "New Today",
      value2: demoData?.newToday || 0,
    },
    {
      title1: "New",
      value1: demoData?.new  || 0,
      title2: "Assigned",
      value2:  demoData?.assigned || 0,
    },
    {
      title1: "Contacted",
      value1: demoData?.contacted || 0,
      title2: "Demo Scheduled",
      value2: demoData?.demoScheduled || 0,
    },
    {
      title1: "Demo Completed",
      value1: demoData?.demoCompleted || 0,
      title2: "Trial Started",
      value2: demoData?.trialStarted || 0,
    },
    {
      title1: "Converted",
      value1: demoData?.converted || 0,
      title2: "Dropped",
      value2: demoData?.dropped || 0,
    },
  ].map((item, index) => (

    <div
      key={index}
      className="
        bg-white
        border
        border-borderSoft
        rounded-card
        shadow-card
        p-5
        min-h-[150px]
        flex
        flex-col
        justify-between
      "
    >

      {/* TOP */}
      <div>

        <p
          className="
            text-cardTitle
            text-textDark/60
            font-inter
            text-center
          "
        >
          {item.title1}
        </p>

        <h2
          className="
            text-sectionTitle
            font-bold
            text-headingDark
            text-center
            mt-2
          "
        >
          {item.value1}
        </h2>

      </div>

      {/* DIVIDER */}
      <div
        className="
          border-t
          border-borderSoft
          my-4
        "
      />

      {/* BOTTOM */}
      <div>

        <p
          className="
            text-cardTitle
            text-textDark/60
            font-inter
            text-center
          "
        >
          {item.title2}
        </p>

        <h2
          className="
            text-sectionTitle
            font-bold
            text-headingDark
            text-center
            mt-2
          "
        >
          {item.value2}
        </h2>

      </div>

    </div>

  ))}

</div>
<p
  className="
    text-[11px]
    text-primaryBlue
    flex
    items-center
    gap-1
    font-medium mb-5
  "
>
  <span className="text-[10px]">ⓘ</span>

  Based On Current Month
</p>
<div className="flex flex-wrap gap-3 mb-5">

  
  <RangePicker
  value={dateRange}
  inputReadOnly={true}
  format="DD-MM-YYYY"
  onChange={(dates) => {
    setDateRange(dates || []);
    setPage(1);
  }}
  className="h-[36px] rounded-lg"
/>
 
  {/* <select
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[180px]"
  >
    <option value="">All Status</option>

    {statusConfig.map((item) => (
      <option
        key={item.currentStatus}
        value={item.currentStatus}
      >
        {item.currentStatus}
      </option>
    ))}
  </select> */}
 <div className="relative min-w-[180px]" ref={statusDropdownRef }>

  <div
    onClick={() => {

      setOpenStatusDropdown(!openStatusDropdown);

      setOpenAgentDropdown(false);

    }}
    className="border border-gray-300 rounded-lg px-3 py-1 cursor-pointer bg-white flex justify-between items-center h-[36px]"
  >
    <span className="text-sm truncate">
      {statusFilter || "All Status"}
    </span>

    <img src={Arrow} className="w-4 h-4" />
  </div>

  {openStatusDropdown && (
    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] max-h-[220px] overflow-y-auto">

      <div
        onClick={() => {
          setStatusFilter("");
          setOpenStatusDropdown(false);
        }}
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
      >
        All Status
      </div>

      {statusConfig?.map((item) => (
        <div
          key={item.currentStatus}
          onClick={() => {
            setStatusFilter(item.currentStatus);
            setOpenStatusDropdown(false);
            setPage(1);
          }}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-left"
        >
          {item.currentStatus}
        </div>
      ))}

    </div>
  )}

</div>

 
  <div className="relative min-w-[180px]"  ref={agentDropdownRef }>

  
    <div
      onClick={() =>
        setOpenAgentDropdown(!openAgentDropdown)
      }
      className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer bg-white flex justify-between items-center"
    >
      <span className="text-sm truncate">
        {
          agentList.find(
            (a) => a.agentId === agentFilter
          )?.agentName || "All Agents"
        }
      </span>

      <img src={Arrow} className="w-4 h-4"/>
    </div>

   
    {openAgentDropdown && (
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
          rounded-lg
          shadow-xl
          max-h-[220px]
          overflow-y-auto
          z-[9999]
        "
      >

       
        <div
          onClick={() => {
            setAgentFilter("");
            setOpenAgentDropdown(false);
          }}
          className="
            px-3
            py-2
            hover:bg-gray-100
            cursor-pointer
            text-sm
            border-b
          "
        >
          All Agents
        </div>

        
        {agentList.map((agent) => (
          <div
            key={agent.agentId}
            onClick={() => {
              setAgentFilter(agent.agentId);
              setOpenAgentDropdown(false);
            }}
            className="
              px-3
              py-2
              hover:bg-gray-100
              cursor-pointer
              text-sm
              break-words text-left
            "
          >
            {agent.agentName}
          </div>
        ))}

      </div>
    )}

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

</div>
 
<div
  className="
    bg-white
    rounded-xl
    shadow-sm
    border
    border-gray-200
    flex
    flex-col
    max-h-[calc(100vh-230px)]

    overflow-hidden
  "
>

  {/* TABLE SCROLL */}
<div
  className="
    overflow-x-auto
    overflow-y-auto
    max-h-[420px]

    [&::-webkit-scrollbar]:w-[10px]
    [&::-webkit-scrollbar]:h-[10px]

    [&::-webkit-scrollbar-track]:bg-[#EEF4FF]
    [&::-webkit-scrollbar-track]:rounded-full

    [&::-webkit-scrollbar-thumb]:bg-[#C9DAFF]
    [&::-webkit-scrollbar-thumb]:rounded-full

    [&::-webkit-scrollbar-thumb]:border-[2px]
    [&::-webkit-scrollbar-thumb]:border-solid
    [&::-webkit-scrollbar-thumb]:border-[#EEF4FF]

    hover:[&::-webkit-scrollbar-thumb]:bg-[#B7CCFF]
  "
>

    <table className="min-w-max text-sm">

      {/* HEADER */}
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-40">

        <tr>

          <th
            className="
              sticky
              left-0
              z-30
              bg-gray-100
              px-4
              py-3
              w-[70px]
              min-w-[70px]
            "
          >
            ID
          </th>

          <th
            className="
              sticky
              left-[70px]
              z-30
              bg-gray-100
              px-4
              py-3
              w-[180px]
              min-w-[180px]
              max-w-[180px] text-left
            "
          >
            NAME
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            MOBILE NO
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            ORGANIZATION
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            REGION/CITY
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            SOURCE
          </th>
          <th className="px-4 py-3 text-left whitespace-nowrap">
            Owner Name
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            REQUESTED DATE
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            PRESENTED AT
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            ASSIGNED STAFF
          </th>

          <th className="px-4 py-3 text-left whitespace-nowrap">
            STATUS
          </th>

          {/* <th className="px-4 py-3 text-left whitespace-nowrap">
            CONVERSION RESULT
          </th> */}

          <th className="px-4 py-3 text-left whitespace-nowrap">
            ACTIONS
          </th>

        </tr>

      </thead>

      {/* BODY */}
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

                  
                      
                     <tr key={item.requestId} className="group text-[13px] hover:bg-gray-50">

 <td className="sticky left-0 z-20 bg-white group-hover:bg-gray-50 px-4 py-2 w-[70px] min-w-[70px]">
  {(page - 1) * size + index + 1}
</td>

<td className="sticky left-[70px] z-20 bg-white group-hover:bg-gray-50 px-4 py-2 w-[180px] min-w-[180px] max-w-[180px] text-left">
  <button
    onClick={() => {
      setSelectedItem(item);
      setOpenOverview(true);
    }}
    className="text-blue-600 hover:underline cursor-pointer"
  >
    {item.name || "----"}
  </button>
</td>
                         {/* <td className="px-4 py-2 text-[12px] text-left">
                          {item.contactNo || "----"}
                        </td> */}
                        <td className="px-4 py-2 text-[12px] text-left">
  <div className="flex flex-col">
    
    <span>
      {item.contactNo || "----"}
    </span>

    {item.emailId && (
      <span className="text-[11px] text-gray-500 whitespace-nowrap">
        {item.emailId}
      </span>
    )}

  </div>
</td>

                        <td className="px-4 py-2 text-[12px] text-left ">
                          {item.organization || "----"}
                        </td>
    <td className="px-4 py-2 text-[12px] text-left overflow-visible">
  {item.city ? (
    <div className="relative inline-block">
      
      <span className="peer cursor-pointer">
        {item.city}
      </span>

      <div className="absolute left-0 bottom-6 z-[9999] hidden peer-hover:block bg-black text-white text-[11px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
        {item.city}
        {item.state ? `, ${item.state}` : ""}
        {item.country ? `, ${item.country}` : ""}
      </div>

    </div>
  ) : (
    "----"
  )}
</td>
 <td className="px-4 py-2 text-[12px] text-left ">
                          {item.source || "----"}
                        </td>
   <td
  className="
    px-4
    py-2
    text-tableCell
    text-left
    font-medium
  "
>

  {item?.isOwnerDeleted === true ? (

    <span className="text-dangerRed">
      Owner Deleted
    </span>

  ) : (

   <span
  className="
    text-primaryBlue
    cursor-pointer
    hover:underline
  "
  onClick={() => {

    // navigate(
    //   `/ProprietorsOverview/${item?.owner?.ownerId}`
    // );
    navigate(
  `/ProprietorsOverview/${item?.owner?.ownerId}`,
  {
    state: {
      from: location.pathname
    }
  }
);

  }}
>
  {item?.owner?.fullName || "-"}
</span>

  )}

</td>

                        {/* <td className="px-4 py-2 text-[12px] text-left">
                          {item.requestedDate || "----"}
                        </td> */}
                        {/* <td className="px-4 py-2 text-[12px] text-left">
  <div className="flex flex-col">

    <span>
      {item.requestedDate || "----"}
    </span>

    <span className="text-[11px] text-gray-500">
      {item.requestedTime || "----"}
    </span>

  </div>
</td> */}

<td className="px-4 py-2 text-[12px] text-left">
  {(item.requestedDate || item.requestedTime) ? (
    <div className="flex flex-col">

      {item.requestedDate && (
        <span>{item.requestedDate}</span>
      )}

      {item.requestedTime && (
        <span className="text-[11px] text-gray-500">
          {item.requestedTime}
        </span>
      )}

    </div>
  ) : (
    "----"
  )}
</td>

                      {/* <td className="px-4 py-2 text-[12px] text-left">
  <div className="flex flex-col">

    <span>
      {item.presentedAtDate || "----"}
    </span>

    <span className="text-[11px] text-gray-500">
      {item.presentedAtTime || "----"}
    </span>

  </div>
</td> */}
<td className="px-4 py-2 text-[12px] text-left">
  {(item.presentedAtDate || item.presentedAtTime) ? (
    <div className="flex flex-col">

      {item.presentedAtDate && (
        <span>{item.presentedAtDate}</span>
      )}

      {item.presentedAtTime && (
        <span className="text-[11px] text-gray-500">
          {item.presentedAtTime}
        </span>
      )}

    </div>
  ) : (
    "----"
  )}
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
                         {/* <td className="px-4 py-2 text-[12px] text-left">
                          {item.convertedToPlanName || "----"}
                        </td> */}

                       <td className="px-4 py-2 relative">

  <button
  onClick={(e) => {

    e.stopPropagation();

    const rect =
      e.currentTarget.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight;

    const menuHeight = 180;

    const spaceBelow =
      viewportHeight - rect.bottom;

    const openUpwards =
      spaceBelow < menuHeight;

    setOpenMenu({

      id:
        openMenu?.id === item.requestId
          ? null
          : item.requestId,

      x: rect.right - 145,

      y: openUpwards
        ? rect.top - menuHeight + 40
        : rect.bottom + 8,

    });

  }}
  className={`
    p-2 rounded-full
    transition-all duration-200

    ${
      openMenu?.id === item.requestId
        ? "bg-[#EEF2FF] scale-110"
        : "hover:bg-gray-100"
    }
  `}
>

  <img
    src={Circle}
    alt="menu"
    className={`
      w-5 h-5 transition-all duration-200 cursor-pointer

      ${
        openMenu?.id === item.requestId
          ? "animate-pulse"
          : ""
      }
    `}
  />

</button>

  {openMenu?.id === item.requestId && (

   <div
  className="fixed w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-[99999] overflow-hidden"
  style={{
    top: openMenu.y,
    left: openMenu.x,
  }}
>
 <button
        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={async () => {

  setSelectedItem(item);

  await fetchAllComments(
    item.requestId
  );

  setShowCommentModal(true);

  setOpenMenu(null);

}}
      >
        Add Notes
      </button>
      {item?.canAssignStaff && (
        <button
          // onClick={() => {
          //   setSelectedItem(item);
          //   setShowModal(true);
          //   setOpenMenu(null);
          // }}
          onClick={() => {
  setSelectedItem(item);

  const currentAgent = agentList.find(
    (a) => a.agentName?.trim() === item.assignedTo?.trim()
  );

  setDropdownValue(currentAgent?.agentId || "");
  setShowModal(true);
  setOpenMenu(null);
}}
          className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          
          {item?.assignedTo ? "ReAssign Staff" : "Assign Staff "}
        </button>
      )}
{item?.demoRequestStatus !==
  "CONVERTED" && (

  <button
    className="
      w-full
      text-left
      px-4
      py-2.5
      text-sm
      hover:bg-gray-50
      transition-colors
      cursor-pointer
    "
    onClick={() => {

      setSelectedId(
        item.requestId
      );

      setSelectedItem(item);

      setOpenStatusModal(true);

      setOpenMenu(null);

    }}
  >
    Change Status
  </button>

)}
      {/* <button
        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => {
          setSelectedId(item.requestId);
          setSelectedItem(item);
          setOpenStatusModal(true);
          setOpenMenu(null);
        }}
      >
        Change Status
      </button> */}
{item?.canMarkDropped && (

  <button
    onClick={() => {

      setSelectedItem(item);

      setShowMarkLostDrawer(true);

      setOpenMenu(null);

    }}
    className="
      w-full
      text-left
      px-4
      py-2.5
      text-sm
      hover:bg-red-50
      text-red-500
      transition-colors
      cursor-pointer
    "
  >
    Mark as Lost
  </button>

)}
     

      <button
        className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
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
                <option value={100}>100</option>
              </select>


              {/* <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="cursor-pointer"
              >
                <img src={ArrowRight} className="w-[15px] h-[15px]" />
              </button> */}
<button
  disabled={page === 1 || data.length === 0}
  onClick={() => setPage((p) => p - 1)}
 className={`
  ${
    page === 1 || data.length === 0
      ? "opacity-40 cursor-not-allowed"
      : "cursor-pointer"
  }
`}
>
  <img
    src={ArrowRight}
    className="w-[15px] h-[15px]"
  />
</button>

              <span className="border px-3 py-1 rounded bg-gray-50">
                {page}
              </span>


              {/* <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer"
              >
                <img src={ArrowRight} className="w-[15px] h-[15px] scale-x-[-1]" />
              </button> */}
              <button
  disabled={
    page >= totalPages ||
    data.length === 0
  }
  onClick={() => setPage((p) => p + 1)}
  className={`
  ${
    page >= totalPages || data.length === 0
      ? "opacity-40 cursor-not-allowed"
      : "cursor-pointer"
  }
`}
>
  <img
    src={ArrowRight}
    className="w-[15px] h-[15px] scale-x-[-1]"
  />
</button>


              <span className="text-gray-400">
                {page} - {totalPages}
              </span>

            </div>

          </div>

        </div>
        {showModal && (
  <div className="fixed inset-0 z-[9999]">

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => {
        setShowModal(false);
        setAssignError("");
        setDropdownValue("");
        setCommentText("")
      }}
    />

    
    <div
      className="
        fixed
        top-3
        right-3
        bottom-3
        w-[420px]
        bg-white
        rounded-2xl
        shadow-2xl
        flex
        flex-col
        overflow-hidden
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

        <div>
          <h2 className="text-[18px] font-semibold text-left">
           {selectedItem?.assignedTo
    ? "Reassign Staff"
    : "Assign Staff"}
          </h2>

          <p className="text-[12px] text-gray-500 mt-1">
            Select agent for this request
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(false);
            setAssignError("");
            setDropdownValue("");
            setCommentText("")
          }}
          className="text-red-500 text-lg cursor-pointer"
        >
          ✕
        </button>

      </div>

      {/* BODY */}
      <div className="flex-1 px-5 py-5 overflow-y-auto">

        <label className="text-[13px] font-medium text-left block mb-2">
          Assign Staff <span className="text-red-500">*</span>
        </label>

        {/* CUSTOM DROPDOWN */}
        <div
          className="relative"
          ref={dropdownRef}
        >

          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(!openDropdown);
              setAssignError("");
            }}
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              flex
              justify-between
              items-center
              cursor-pointer
              bg-white
            "
          >

            {/* <span className="text-sm ">

              {
                agentList.find(
                  (a) => a.agentId === dropdownValue
                )?.agentName || "Select Staff"
              }

            </span> */}
            <span className="text-sm">
  {
    agentList.find(
      (a) => a.agentId === dropdownValue
    )?.agentName ||
    selectedItem?.assignedTo ||
    "Select Staff"
  }
</span>

            <img
              src={Arrow}
              className="w-5 h-5"
            />

          </div>

          {/* DROPDOWN */}
          {openDropdown && (

            <div
              className="
                absolute
                mt-2
                w-full
                bg-white
                rounded-xl
                shadow-xl
                border
                max-h-60
                overflow-y-auto
                z-[9999]
              "
            >
{/* 
              {agentList.map((agent) => (

                <div
                  key={agent.agentId}
                  onClick={() => {
                    setDropdownValue(agent.agentId);
                    setOpenDropdown(false);
                  }}
                  className={`
                    px-4 py-3 text-sm cursor-pointer transition-all text-left

                    ${
                      dropdownValue === agent.agentId
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }
                  `}
                >

                  {agent.agentName?.trim() ||
                    "Name not entered"}

                </div>

              ))} */}
              {agentList.map((agent) => {
  const isAssignedAgent =
    agent.agentName?.trim() === selectedItem?.assignedTo?.trim();

  return (
    <div
      key={agent.agentId}
      onClick={() => {
        setDropdownValue(agent.agentId);
        setOpenDropdown(false);
      }}
      className={`
        px-4 py-3 text-sm cursor-pointer transition-all text-left

        ${
          dropdownValue === agent.agentId
            ? "bg-blue-600 text-white"
            : isAssignedAgent
            ? "bg-yellow-100 border-l-4 border-yellow-500 font-semibold"
            : "hover:bg-gray-100"
        }
      `}
    >
      <div className="flex justify-between items-center">
        <span>{agent.agentName?.trim() || "Name not entered"}</span>

        {isAssignedAgent && (
          <span className="text-[10px] text-yellow-700">
            Current
          </span>
        )}
      </div>
    </div>
  );
})}

            </div>

          )}

        </div>

        {/* ERROR */}
        {assignError && (
          <div className="mt-2">
            <ErrorMessage
              message={assignError}
              type="error"
            />
          </div>
        )}

<div className="mt-5">

  <label className="text-[13px] font-medium text-left block mb-2">
    Additional Comments
  </label>

  <div
    className="
      border border-gray-300
      rounded-xl
      p-3
      bg-white
    "
  >

    <textarea
      placeholder="Type your comments here..."
      value={commentText}
      onChange={(e) => {
        setCommentText(e.target.value);
      }}
      className="
        w-full
        h-[110px]
        resize-none
        outline-none
        text-sm
        placeholder:text-gray-400
      "
    />

    {/* TOOLBAR */}
    <div className="flex justify-end gap-3 mt-2 text-gray-400 text-sm">

      <button className="font-semibold">
        B
      </button>

      <button className="italic">
        I
      </button>

      <button className="underline">
        U
      </button>

    </div>

  </div>

</div>
      </div>

    
      <div className="border-t border-gray-200 px-5 py-4 flex justify-end gap-3">

        <button
          onClick={() => {
            setShowModal(false);
            setAssignError("");
            setDropdownValue("");
            setCommentText("")
          }}
          className="
            px-4 py-2
            border border-gray-300
            rounded-lg
            text-sm
            hover:bg-gray-50
          "
        >
          Cancel
        </button>

        <button
          onClick={handleAssignStaff}
          className="
            px-5 py-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-lg
            text-sm
          "
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
        currentStatusMobile={selectedItem?.contactNo}
      />
{showCommentModal && (
  <div className="fixed inset-0 z-[9999]">

   
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => {
        setShowCommentModal(false);
        setCommentError("");
        setCommentText("");
        
      }}
    />

   
    <div
      className="fixed top-3 right-3 bottom-3 w-[420px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >

    
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

        <h2 className="flex items-center gap-2 text-[16px] font-semibold">
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

     
      <div className="flex-1 flex flex-col px-5 py-4 overflow-hidden">

      
        <label className="text-xs text-gray-500 mb-2 block text-left">
          Additional Comments <span className="text-red-500">*</span>
        </label>

        
        <div className="border border-gray-300 rounded-xl p-3">

          <textarea
            placeholder="Comment here"
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              setCommentError("");
            }}
            className="w-full text-sm h-24 resize-none outline-none"
          />

        
          <div className="flex justify-end gap-3 mt-2 text-gray-400 text-sm">
            <button>B</button>
            <button>I</button>
            <button>U</button>
          </div>

        </div>

        {commentError && (
          <ErrorMessage message={commentError} type="error" />
        )}

        
        <div className="flex justify-end mt-3">
          <button
            onClick={handleAddComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm cursor-pointer flex items-center gap-2"
          >
            ➤ Add
          </button>
        </div>

      
        <p className="text-[11px] text-gray-400 mt-5 mb-3 text-left">
          ALL COMMENTS
        </p>

       
        <div className="flex-1 overflow-y-auto pr-1">

          <div className="space-y-5">

            {allComments.map((item, index) => (

              <div
                key={item.demoRequestCommentsId}
                className="flex gap-3"
              >

                
                <div className="flex flex-col items-center">

                  <div className="w-9 h-9 rounded-full bg-[#EEF3FF] flex items-center justify-center border border-[#DCE6FF]">
                    <img src={CommentBox} className="w-4 h-4" />
                  </div>

                  {index !== allComments.length - 1 && (
                    <div className="w-[1px] flex-1 bg-gray-200 mt-1"></div>
                  )}

                </div>

               
                <div className="flex-1">

                  <p className="text-sm font-semibold text-gray-800 text-left">
                    {item.comment}
                  </p>

                  <p className="text-xs text-gray-500 mt-1 text-left">
                    {item.createdAtDate} , {item.createdAtTime}
                  </p>

                  <p className="text-xs text-gray-400 mt-2 text-left">
                    Added by {item.createdBy}
                  </p>

                </div>

              </div>

            ))}

          </div>

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
<DemoRequestOverview
  open={openOverview}
  onClose={() => setOpenOverview(false)}
  selectedItem={selectedItem}
  commentText={commentText}
  setCommentText={setCommentText}
  handleAddComment={handleAddComment}
  allComments={allComments}
fetchAllComments={fetchAllComments}
  onAssignStaff={() => {

    setOpenOverview(false);

    setTimeout(() => {
      setShowModal(true);
    }, 200);

  }}
/>
<MarkAsLostDrawer
  open={showMarkLostDrawer}
  onClose={() =>
    setShowMarkLostDrawer(false)
  }
  fetchData={fetchData}
  selectedItem={selectedItem}
  dropReasons={
    statusConfig?.find(
      (item) =>
        item.currentStatus ===
        "DROPPED"
    )?.dropReasons || []
  }
/>
    </DashboardLayout>
  );
};

export default DemoRequests;