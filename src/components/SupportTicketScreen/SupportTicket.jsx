import React, { useState,useEffect,useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Filter,
  Plus,
  ListFilter,
} from "lucide-react";
import { createPortal } from "react-dom";
import CreateTicketModal from "./CreateTicketModal";
import UpdateSupportStatusModal from "./SupportUpdateStatusModal";
import { useSupportTickets } from "../../Context/SupportTicketsContext";
import Arrow from "../../assets/arrow-right.png";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import FilterArrow from "../../assets/direction-down 01.png";

const SupportTicket = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const {getAllSupportTickets} = useSupportTickets();

const [commentText, setCommentText] = useState("");
const [showCreateModal, setShowCreateModal] = useState(false);
const [showUpdateStatus, setShowUpdateStatus] =useState(false);
const [tickets, setTickets] = useState([]);
const [page, setPage] = useState(1);
const [size, setSize] = useState(10);
const [search, setSearch] = useState("");
const [status, setStatus] = useState("");
// const [startDate, setStartDate] = useState("");
// const [endDate, setEndDate] = useState("");
const [agentId, setAgentId] = useState("");
const [totalCount, setTotalCount] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [searchInput, setSearchInput] = useState("");
const [resData,setResData] = useState([])
const { RangePicker } = DatePicker;

const [dateRange, setDateRange] =
  useState([]);

const [openStatusDropdown, setOpenStatusDropdown] =
  useState(false);

const [openAgentDropdown, setOpenAgentDropdown] = useState(false);

const statusDropdownRef =
  useRef(null);

const agentDropdownRef =
  useRef(null);


const statusList = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];
const startDate =
  dateRange?.[0]
    ? dayjs(dateRange[0]).format(
        "DD-MM-YYYY"
      )
    : "";

const endDate =
  dateRange?.[1]
    ? dayjs(dateRange[1]).format(
        "DD-MM-YYYY"
      )
    : "";
    useEffect(() => {

  const handleClickOutside = (
    event
  ) => {

    if (
      statusDropdownRef.current &&
      !statusDropdownRef.current.contains(
        event.target
      )
    ) {

      setOpenStatusDropdown(false);

    }

    if (
      agentDropdownRef.current &&
      !agentDropdownRef.current.contains(
        event.target
      )
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

useEffect(() => {

  const timer = setTimeout(() => {

    setSearch(searchInput);

    setPage(1);

  }, 500);

  return () => clearTimeout(timer);

}, [searchInput]);
useEffect(() => {

  fetchTickets();

}, [
  page,
  size,
  search,
  status,
  startDate,
  endDate,
  agentId,
]);

const fetchTickets =
  async () => {

    const res =
      await getAllSupportTickets({
        page,
        size,
        name: search,
        startDate,
        endDate,
        status,
        agentId,
      });

    if (res.success) {

      const responseData =
  res?.data || {};

setTickets(
  responseData?.supportTicketList || []
);

setTotalCount(
  responseData?.totalItems || 0
);
setTotalPages(
  responseData?.totalPages || 0
);
setResData(responseData)

    }

  };

const [allComments, setAllComments] =
  useState([
    {
      comment:
        "Customer reported payment issue during checkout.",
      createdAtDate: "10-06-2026",
      createdAtTime: "02:30 PM",
      createdBy: "Admin",
    },
  ]);
const [menuPosition, setMenuPosition] = useState({
  index: null,
  top: 0,
  left: 0,
  direction: "down",
});
const [showAssignDrawer, setShowAssignDrawer] =
  useState(false);

const [dropdownValue, setDropdownValue] =
  useState("");

const [openDropdown, setOpenDropdown] =
  useState(false);

const [assignError, setAssignError] =
  useState("");

const agentList = [
  {
    agentId: 1,
    agentName: "Rahul",
  },
  {
    agentId: 2,
    agentName: "David",
  },
  {
    agentId: 3,
    agentName: "Anish",
  },
];

const handleMenuToggle = (e, index) => {
  if (menuPosition.index === index) {
    setMenuPosition({ index: null, top: 0, left: 0 });
    return;
  }

  const rect = e.currentTarget.getBoundingClientRect();
  const menuHeight = 130;
  const spaceBottom = window.innerHeight - rect.bottom;
  const direction = spaceBottom < menuHeight ? "up" : "down";

  setMenuPosition({
    index,
    left: rect.right - 160,           // ✅ no scrollX — fixed positioning
    top: direction === "up"
      ? rect.top - menuHeight - 4     // ✅ no scrollY
      : rect.bottom + 4,
    direction,
  });
};
useEffect(() => {
  const handleClickOutside = () => setMenuPosition({ index: null, top: 0, left: 0 });
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);
  

  return (
    <DashboardLayout>
      <div className="w-full bg-[#f8f9fc] min-h-screen p-3 sm:p-5">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <h1 className="text-[22px] font-semibold text-[#1f2937]">
            Support Tickets
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="
                h-10 px-4 rounded-xl border border-[#dbe2ff]
                bg-[#eef2ff] text-[#3b5bfd]
                text-sm font-medium
                flex items-center gap-2
                hover:bg-[#e2e8ff]
                transition
              "
            >
              <ListFilter size={16} />
              IAM Users
            </button>

            <button onClick={() =>
    setShowCreateModal(true)
  }
              className="
                h-10 px-4 rounded-xl
                bg-[#3b5bfd]
                text-white text-sm font-medium
                flex items-center gap-2
                hover:bg-[#2948e6]
                transition cursor-pointer
              "
            >
              <Plus size={16} />
              Create Ticket
            </button>
          </div>
        </div>

        {/* STATS */}
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

  {[
    {
      title: "Total Leads",
      value: resData?.totalLeads || 0,
    },
    {
      title: "New Today",
      value: resData?.newToday || 0,
    },
    {
      title: "Contacted",
      value: resData?.contacted || 0,
    },
    {
      title: "Demo Scheduled",
      value: resData?.demoScheduled || 0,
    },
  ].map((item, index) => (

    <div
      key={index}
      className="
        bg-white rounded-2xl border border-[#edf0f7]
        p-5 shadow-sm
      "
    >

      <p className="text-[13px] text-[#6b7280] mb-2">
        {item.title}
      </p>

      <h2 className="text-[30px] font-bold text-[#111827] leading-none">
        {item.value}
      </h2>

    </div>

  ))}

</div>

        {/* LAST 30 DAYS */}
        <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-6">
          <div className="w-2 h-2 rounded-full bg-[#3b5bfd]" />
          Based upon last 30 Days
        </div>

         <div className=" flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            

            <div className="flex flex-col sm:flex-row gap-3">
             
             
<div className="flex flex-wrap gap-3 mb-5">

  
  <RangePicker
    value={dateRange}
    inputReadOnly={true}
    format="DD-MM-YYYY"
    onChange={(dates) => {

      setDateRange(
        dates || []
      );

      setPage(1);

    }}
    className="
      h-[40px]
      rounded-xl
    "
  />

  {/* STATUS FILTER */}
  <div
    className="
      relative
      min-w-[180px]
    "
    ref={statusDropdownRef}
  >

    <div
      onClick={() => {

        setOpenStatusDropdown(
          !openStatusDropdown
        );

        setOpenAgentDropdown(
          false
        );

      }}
      className="
        h-[40px]
        px-4
        border border-[#e5e7eb]
        rounded-xl
        bg-white
        flex items-center
        justify-between
        cursor-pointer
      "
    >

      <span className="text-sm">
        {status || "All Status"}
      </span>

      <img
        src={FilterArrow}
        className="w-4 h-4"
      />

    </div>

    {openStatusDropdown && (

      <div
        className="
          absolute
          top-full
          left-0
          mt-2
          w-full
          bg-white
          border border-[#e5e7eb]
          rounded-xl
          shadow-xl
          z-[9999]
          overflow-hidden
        "
      >

        <div
          onClick={() => {

            setStatus("");

            setPage(1);

            setOpenStatusDropdown(
              false
            );

          }}
          className="
            px-4 py-3
            text-sm
            hover:bg-[#f8f9fc]
            cursor-pointer
          "
        >
          All Status
        </div>

        {statusList.map((item) => (

          <div
            key={item}
            onClick={() => {

              setStatus(item);

              setPage(1);

              setOpenStatusDropdown(
                false
              );

            }}
            className="
              px-4 py-3
              text-sm
              hover:bg-[#f8f9fc]
              cursor-pointer
            "
          >
            {item}
          </div>

        ))}

      </div>

    )}

  </div>

  {/* AGENT FILTER */}
  <div
    className="
      relative
      min-w-[180px]
    "
    ref={agentDropdownRef}
  >

    <div
      onClick={() => {

        setOpenAgentDropdown(
          !openAgentDropdown
        );

        setOpenStatusDropdown(
          false
        );

      }}
      className="
        h-[40px]
        px-4
        border border-[#e5e7eb]
        rounded-xl
        bg-white
        flex items-center
        justify-between
        cursor-pointer
      "
    >

      <span className="text-sm truncate">

        {
          agentList.find(
            (a) =>
              a.agentId === agentId
          )?.agentName ||
          "All Agents"
        }

      </span>

      <img
        src={FilterArrow}
        className="w-4 h-4"
      />

    </div>

    {openAgentDropdown && (

      <div
        className="
          absolute
          top-full
          left-0
          mt-2
          w-full
          bg-white
          border border-[#e5e7eb]
          rounded-xl
          shadow-xl
          z-[9999]
          overflow-hidden
          max-h-[220px]
          overflow-y-auto
        "
      >

        <div
          onClick={() => {

            setAgentId("");

            setPage(1);

            setOpenAgentDropdown(
              false
            );

          }}
          className="
            px-4 py-3
            text-sm
            hover:bg-[#f8f9fc]
            cursor-pointer
          "
        >
          All Agents
        </div>

        {agentList.map((agent) => (

          <div
            key={agent.agentId}
            onClick={() => {

              setAgentId(
                agent.agentId
              );

              setPage(1);

              setOpenAgentDropdown(
                false
              );

            }}
            className="
              px-4 py-3
              text-sm
              hover:bg-[#f8f9fc]
              cursor-pointer
            "
          >
            {agent.agentName}
          </div>

        ))}

      </div>

    )}

  </div>

</div>
 <div
                className="
                  h-10 w-full sm:w-[240px]
                  border border-[#e5e7eb]
                  rounded-xl
                  px-3
                  flex items-center gap-2
                "
              >
                <Search size={17} className="text-gray-400" />

 <input
  type="text"
  placeholder="Search..."
  value={searchInput}
  onChange={(e) =>
    setSearchInput(e.target.value)
  }
  className="
    w-full bg-transparent outline-none
    text-sm text-gray-700
    placeholder:text-gray-400
  "
/>
              </div>
              {/* <button
                className="
                  h-10 px-4 rounded-xl border border-[#e5e7eb]
                  text-sm text-[#374151]
                  flex items-center gap-2
                "
              >
                Last 30 Days
                <ChevronDown size={15} />
              </button> */}
            </div>
          </div>
        <div className="bg-white border border-[#edf0f7] rounded-2xl shadow-sm relative">
          
        <div
  className="
    table-scroll
    relative
    overflow-auto
    max-h-[420px]
    rounded-2xl
  "
>
            <table className="min-w-[1100px] w-full border-separate border-spacing-0">
       <thead className="sticky top-0 z-40">
  <tr>

    <th
      className="
        sticky top-0 left-0 z-50
        bg-[#f8f9fc]
        px-5 py-4
        text-left text-[12px]
        font-semibold text-[#6b7280]
        whitespace-nowrap
        border-b border-[#edf0f7]
      "
    >
      TICKET ID
    </th>

    {[
      "SUBJECT",
      "QUERY TYPE",
      "RAISED BY",
      "PROPERTY NAME",
      "PRIORITY",
    ].map((head, i) => (
      <th
        key={i}
        className="
          sticky top-0 z-30
          bg-[#f8f9fc]
          px-5 py-4
          text-left text-[12px]
          font-semibold text-[#6b7280]
          whitespace-nowrap
          border-b border-[#edf0f7]
        "
      >
        {head}
      </th>
    ))}

    <th
      className="
        sticky top-0 right-0 z-50
        bg-[#f8f9fc]
        px-5 py-4
        text-left text-[12px]
        font-semibold text-[#6b7280]
        whitespace-nowrap
        border-b border-[#edf0f7]
      "
    >
      ACTIONS
    </th>

  </tr>
</thead>

            <tbody>

  {tickets?.length > 0 ? (

    tickets.map(
      (item, index) => (

        <tr
          key={index}
          className="
            border-b border-[#edf0f7]
            hover:bg-[#fafbff]
            group
          "
        >

          <td className="px-5 py-2 text-xs font-medium text-[#374151] whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-[#fafbff]">
            {item.ticketId}
          </td>

          <td className="px-5 py-2 text-xs text-[#111827] min-w-[230px] text-left">
            <div className="truncate max-w-[250px]">
              {item.subject}
            </div>
          </td>

          <td className="px-5 py-2 text-xs text-[#4b5563] whitespace-nowrap text-left">
            {item.queryType}
          </td>

          <td className="px-5 py-2 text-xs font-medium text-[#374151] whitespace-nowrap text-left">
            {item.raisedBy}
          </td>

          <td className="px-5 py-2 text-xs font-medium text-[#374151] whitespace-nowrap text-left">
            {item.hostelName}
          </td>

          <td className="px-5 py-2 whitespace-nowrap text-left">

            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1 rounded-full
                text-xs font-medium
                bg-[#f9fafb]
              "
            >

              <div
                className={`
                  w-2 h-2 rounded-full

                  ${
                    item.priority ===
                    "HIGH"
                      ? "bg-red-500"
                      : item.priority ===
                        "MEDIUM"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }
                `}
              />

              {item.priority || "N/A"}

            </div>

          </td>

             <td className="sticky right-0 z-20 bg-white group-hover:bg-[#fafbff] px-5 py-2 relative overflow-visible">
                      <button
 onClick={(e) => { e.stopPropagation(); handleMenuToggle(e, index); }}
  className="
    h-8 w-8 rounded-lg
    hover:bg-[#f3f4f6]
    flex items-center justify-center
  "
>
  <MoreVertical size={18} />
</button>

  {menuPosition.index === index &&
  createPortal(
    <div
      style={{
  position: "fixed",   // ✅ change "absolute" → "fixed"
  top: menuPosition.top,
  left: menuPosition.left,
}}
      className="
        z-[9999]
        bg-white
        border border-[#e5e7eb]
        rounded-xl
        shadow-xl
        w-[150px]
        overflow-hidden
      "
    >
      {[
        "Add Notes",
        "Update Status",
        "Assign Staff",
      ].map((menu, idx) => (
       <button
  key={idx}
  onClick={() => {

  if (menu === "Add Notes") {
    setShowCommentModal(true);
  }

  if (menu === "Assign Staff") {
    setShowAssignDrawer(true);
  }
  if (menu === "Update Status") {
  setShowUpdateStatus(true);
}

  setMenuPosition({
    index: null,
    top: 0,
    left: 0,
    direction: "down",
  });
}}
  className="
    w-full text-left px-3 py-2.5
    text-sm text-[#374151]
    hover:bg-[#f8f9fc]
  "
>
  {menu}
</button>
      ))}
    </div>,
    document.body
  )}
                    </td>

        </tr>

      )
    )

  ) : (

    <tr>

      <td
        colSpan={7}
        className="
          py-10
          text-center
          text-sm
          text-gray-500
        "
      >
        No Support Tickets Found
      </td>

    </tr>

  )}

</tbody>
            </table>
          </div>

          {/* FOOTER */}
        
        </div>
   <div
  className="
    p-4
    flex flex-col sm:flex-row
    items-start sm:items-center
    justify-between
    gap-4
  "
>

  {/* TOTAL COUNT */}
  <p className="text-sm text-[#4b5563]">
    Total Record Count :
    <span className="text-[#3b5bfd] font-semibold ml-1">
      {tickets?.length}
    </span>
  </p>

  {/* PAGINATION */}
  <div className="flex items-center gap-3">

    {/* PAGE SIZE */}
    <select
      value={size}
      onChange={(e) => {

        setSize(
          Number(e.target.value)
        );

        setPage(1);

      }}
      className="
        h-9 px-3 rounded-lg
        border border-[#e5e7eb]
        text-sm outline-none
      "
    >

      <option value={10}>
        10
      </option>

      <option value={20}>
        20
      </option>

      <option value={50}>
        50
      </option>

    </select>

    
    <div className="flex items-center gap-3 text-sm">

    
      <button
        disabled={page === 1}
        onClick={() =>
          setPage((prev) => prev - 1)
        }
        className={`
          ${
            page === 1
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer"
          }
        `}
      >

        <img
          src={Arrow}
          className="
            w-[15px]
            h-[15px]
          "
        />

      </button>

    
      <button
        className="
          h-8
          min-w-8
          px-3
          rounded-lg
          border border-[#dbe2ff]
          text-[#3b5bfd]
          font-medium
        "
      >
        {page}
      </button>

      {/* RANGE */}
     <div className="flex items-center gap-2">

  {/* CURRENT PAGE */}
  {/* <button
    className="
      h-8
      min-w-8
      px-3
      rounded-lg
      border border-[#dbe2ff]
      text-[#3b5bfd]
      font-medium
    "
  >
    {page}
  </button> */}
   <span className="text-[#6b7280] font-medium">
    {page}
  </span>

  <span className="text-[#9ca3af]">
    -
  </span>

  {/* TOTAL PAGES */}
  <span className="text-[#6b7280] font-medium">
    {totalPages}
  </span>

</div>

      {/* NEXT */}
      <button
        disabled={
          page >= totalPages
        }
        onClick={() =>
          setPage((prev) => prev + 1)
        }
        className={`
          ${
            page >= totalPages
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer"
          }
        `}
      >

        <img
          src={Arrow}
          className="
            w-[15px]
            h-[15px]
            scale-x-[-1]
          "
        />

      </button>

    </div>

  </div>

</div>
      </div>
      {showCommentModal && (
  <div className="fixed inset-0 z-[99999]">

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => {
        setShowCommentModal(false);
        setCommentText("");
      }}
    />

    {/* DRAWER */}
    <div
      className="
        fixed top-3 right-3 bottom-3
        w-[420px]
        bg-white
        rounded-2xl
        shadow-2xl
        flex flex-col
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">

        <h2 className="text-[16px] font-semibold">
          Internal Notes
        </h2>

        <button
          onClick={() => {
            setShowCommentModal(false);
            setCommentText("");
          }}
          className="text-red-500 text-lg"
        >
          ✕
        </button>

      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col px-5 py-4 overflow-hidden">

        {/* INPUT */}
        <label className="text-xs text-gray-500 mb-2 text-left">
          Additional Comments
        </label>

        <div className="border border-gray-300 rounded-xl p-3">

          <textarea
            placeholder="Comment here"
            value={commentText}
            onChange={(e) =>
              setCommentText(e.target.value)
            }
            className="
              w-full
              h-24
              resize-none
              outline-none
              text-sm
            "
          />

        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-end mt-3">

          <button
            onClick={() => {
              if (!commentText.trim()) return;

              setAllComments((prev) => [
                ...prev,
                {
                  comment: commentText,
                  createdAtDate: "10-06-2026",
                  createdAtTime: "03:45 PM",
                  createdBy: "Admin",
                },
              ]);

              setCommentText("");
            }}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5 py-2
              rounded-lg
              text-sm
            "
          >
            Add
          </button>

        </div>

        {/* COMMENTS */}
        <p className="text-[11px] text-gray-400 mt-5 mb-3 text-left">
          ALL COMMENTS
        </p>

        <div className="flex-1 overflow-y-auto pr-1 space-y-5">

          {allComments.map((item, index) => (

            <div
              key={index}
              className="border-b border-gray-100 pb-4"
            >

              <p className="text-sm font-semibold text-left">
                {item.comment}
              </p>

              <p className="text-xs text-gray-500 mt-1 text-left">
                {item.createdAtDate} ,
                {" "}
                {item.createdAtTime}
              </p>

              <p className="text-xs text-gray-400 mt-2 text-left">
                Added by {item.createdBy}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>
)}
{showAssignDrawer && (
  <div className="fixed inset-0 z-[99999]">

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => {
        setShowAssignDrawer(false);
        setDropdownValue("");
        setAssignError("");
        setCommentText("");
      }}
    />

    {/* DRAWER */}
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
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

        <div>

          <h2 className="text-[18px] font-semibold text-left">
            Assign Staff
          </h2>

          <p className="text-[12px] text-gray-500 mt-1">
            Select staff for this support ticket
          </p>

        </div>

        <button
          onClick={() => {
            setShowAssignDrawer(false);
            setDropdownValue("");
            setAssignError("");
            setCommentText("");
          }}
          className="text-red-500 text-lg cursor-pointer"
        >
          ✕
        </button>

      </div>

      {/* BODY */}
      <div className="flex-1 px-5 py-5 overflow-y-auto">

        {/* DROPDOWN LABEL */}
        <label className="text-[13px] font-medium text-left block mb-2">
          Assign Staff
          <span className="text-red-500">*</span>
        </label>

        {/* DROPDOWN */}
        <div className="relative">

          <div
            onClick={() =>
              setOpenDropdown(!openDropdown)
            }
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

            <span className="text-sm">

              {
                agentList.find(
                  (a) =>
                    a.agentId === dropdownValue
                )?.agentName || "Select Staff"
              }

            </span>

            <ChevronDown size={18} />

          </div>

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

              {agentList.map((agent) => (

                <div
                  key={agent.agentId}
                  onClick={() => {
                    setDropdownValue(
                      agent.agentId
                    );

                    setOpenDropdown(false);

                    setAssignError("");
                  }}
                  className={`
                    px-4 py-3
                    text-sm
                    cursor-pointer
                    transition-all
                    text-left

                    ${
                      dropdownValue ===
                      agent.agentId
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }
                  `}
                >

                  {agent.agentName}

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ERROR */}
        {assignError && (

          <p className="text-red-500 text-xs mt-2 text-left">
            {assignError}
          </p>

        )}

        {/* COMMENTS */}
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
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              className="
                w-full
                h-[110px]
                resize-none
                outline-none
                text-sm
                placeholder:text-gray-400
              "
            />

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-200 px-5 py-4 flex justify-end gap-3">

        <button
          onClick={() => {
            setShowAssignDrawer(false);
            setDropdownValue("");
            setAssignError("");
            setCommentText("");
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
          onClick={() => {

            if (!dropdownValue) {
              setAssignError(
                "Please select staff"
              );
              return;
            }

            setShowAssignDrawer(false);

            setDropdownValue("");
            setCommentText("");
          }}
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
<CreateTicketModal
  open={showCreateModal}
  onClose={() =>
    setShowCreateModal(false)
  }
/>
<UpdateSupportStatusModal
  open={showUpdateStatus}
  onClose={() =>
    setShowUpdateStatus(false)
  }
/>
    </DashboardLayout>
  );
};

export default SupportTicket;