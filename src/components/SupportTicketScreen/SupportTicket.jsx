import React, { useState,useEffect } from "react";
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

const SupportTicket = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

const [commentText, setCommentText] = useState("");
const [showCreateModal, setShowCreateModal] = useState(false);

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
  const tickets = [
    {
      id: "#ST-2025-001",
      subject: "Unable to add tenant",
      type: "General Query",
      raisedBy: "Anish Raj",
      property: "Laksha Ladies Hostel",
      priority: "Low",
      color: "bg-green-500",
    },
    {
      id: "#ST-2025-002",
      subject: "Need WhatsApp invoice option",
      type: "Feature Request",
      raisedBy: "Rahul Dev",
      property: "Sunrise PG",
      priority: "Medium",
      color: "bg-blue-500",
    },
    {
      id: "#ST-2025-003",
      subject: "Electricity amount mismatch while tenant checkout",
      type: "Complaint",
      raisedBy: "Priya Mohan",
      property: "Moksha Ladies Hostel",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-004",
      subject: "App crashes during billing",
      type: "Bug/Issue",
      raisedBy: "Rajesh Kannan",
      property: "SRK Coliving",
      priority: "Medium",
      color: "bg-blue-500",
    },
    {
      id: "#ST-2025-005",
      subject: "Need custom invoice design",
      type: "Requirement",
      raisedBy: "Ravi Kumar",
      property: "roomsearch.in",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-006",
      subject: "Payment entry not saving",
      type: "Bug/Issue",
      raisedBy: "David",
      property: "LakeView Hostel",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-007",
      subject: "Payment entry not saving",
      type: "Bug/Issue",
      raisedBy: "David",
      property: "LakeView Hostel",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-008",
      subject: "Payment entry not saving",
      type: "Bug/Issue",
      raisedBy: "David",
      property: "LakeView Hostel",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-009",
      subject: "Payment entry not saving",
      type: "Bug/Issue",
      raisedBy: "David",
      property: "LakeView Hostel",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-010",
      subject: "Payment entry not saving",
      type: "Bug/Issue",
      raisedBy: "David",
      property: "LakeView Hostel",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-011",
      subject: "Payment entry not saving",
      type: "Bug/Issue",
      raisedBy: "David",
      property: "LakeView Hostel",
      priority: "High",
      color: "bg-red-500",
    },
    {
      id: "#ST-2025-012",
      subject: "Payment entry not saving",
      type: "Bug/Issue",
      raisedBy: "David",
      property: "LakeView Hostel",
      priority: "High",
      color: "bg-red-500",
    },
  ];

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
                transition
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
              value: "246",
            },
            {
              title: "New Today",
              value: "0",
            },
            {
              title: "Contacted",
              value: "132",
            },
            {
              title: "Demo Scheduled",
              value: "09",
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

        {/* TABLE SECTION */}
         <div className="p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                className="
                  h-10 px-4 rounded-xl
                  bg-[#eef2ff]
                  text-[#3b5bfd]
                  border border-[#dbe2ff]
                  text-sm font-medium
                  flex items-center gap-2
                "
              >
                Active
                <ChevronDown size={15} />
              </button>

              <button
                className="
                  h-10 px-4 rounded-xl border border-[#e5e7eb]
                  text-sm text-[#374151]
                  flex items-center gap-2
                "
              >
                This Month
                <ChevronDown size={15} />
              </button>

              <button
                className="
                  h-10 px-4 rounded-xl border border-[#e5e7eb]
                  text-sm text-[#374151]
                  flex items-center gap-2
                "
              >
                Filter
                <Filter size={15} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* SEARCH */}
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
                  className="
                    w-full bg-transparent outline-none
                    text-sm text-gray-700
                    placeholder:text-gray-400
                  "
                />
              </div>

              <button
                className="
                  h-10 px-4 rounded-xl border border-[#e5e7eb]
                  text-sm text-[#374151]
                  flex items-center gap-2
                "
              >
                Last 30 Days
                <ChevronDown size={15} />
              </button>
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
      "TYPE",
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
                {tickets.map((item, index) => (
                  <tr
                   key={index}
  className="border-b border-[#edf0f7] hover:bg-[#fafbff] group"
                  >
   <td className="px-5 py-2 text-sm font-medium text-[#374151] whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-[#fafbff]">
  {item.id}
</td>

                    <td className="px-5 py-2 text-sm text-[#111827] min-w-[230px] relative text-left">
                      <div className="truncate max-w-[250px]">
                        {item.subject}
                      </div>

                    </td>

                    <td className="px-5 py-2 text-sm text-[#4b5563] whitespace-nowrap text-left">
                      {item.type}
                    </td>

                    <td className="px-5 py-2 text-sm font-medium text-[#374151] whitespace-nowrap text-left">
                      {item.raisedBy}
                    </td>

                    <td className="px-5 py-2 text-sm font-medium text-[#374151] whitespace-nowrap text-left">
                      {item.property}
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
                          className={`w-2 h-2 rounded-full ${item.color}`}
                        />

                        {item.priority}
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
                ))}
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
            <p className="text-sm text-[#4b5563]">
              Total Record Count :
              <span className="text-[#3b5bfd] font-semibold ml-1">
                40
              </span>
            </p>

            <div className="flex items-center gap-3">
              <select
                className="
                  h-9 px-3 rounded-lg border border-[#e5e7eb]
                  text-sm outline-none
                "
              >
                <option>20</option>
              </select>

              <div className="flex items-center gap-3 text-sm">
                <button className="text-[#3b5bfd]">{`<`}</button>

                <button
                  className="
                    h-8 w-8 rounded-lg
                    border border-[#dbe2ff]
                    text-[#3b5bfd]
                  "
                >
                  1
                </button>

                <span className="text-[#6b7280]">- 10</span>

                <button className="text-[#3b5bfd]">{`>`}</button>
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
    </DashboardLayout>
  );
};

export default SupportTicket;