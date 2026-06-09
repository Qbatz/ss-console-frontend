import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";

/* ── dummy data ── */
const DUMMY_TICKETS = [
  { id: "#ST-2025-001", subject: "Unable to add tenant",                    type: "General Query",   raisedBy: "Anish Raj",     property: "Laksha Ladies Hostel", priority: "Low",    status: "Active" },
  { id: "#ST-2025-002", subject: "Need WhatsApp invoice option",            type: "Feature Request", raisedBy: "Rahul Dev",     property: "Sunrise PG",           priority: "Low",    status: "Active" },
  { id: "#ST-2025-003", subject: "Electricity amount mismatch while tenan…",type: "Complaint",       raisedBy: "Priya Mohan",   property: "Moksha Ladies Hostel", priority: "Low",    status: "Active" },
  { id: "#ST-2025-004", subject: "App crashes on payment screen",           type: "Bug/Issue",       raisedBy: "Rajesh Kannan", property: "SRK Coliving",         priority: "Medium", status: "Active" },
  { id: "#ST-2025-005", subject: "Need bulk upload for tenants",            type: "Requirement",     raisedBy: "Ravi Kumar",    property: "roomsearch.in",        priority: "High",   status: "Active" },
  { id: "#ST-2025-006", subject: "Payment entry not saving",                type: "Bug/Issue",       raisedBy: "David",         property: "LakeView Hostel",      priority: "High",   status: "Active" },
  { id: "#ST-2025-012", subject: "Need GST invoice copy",                   type: "Clarification",   raisedBy: "Raj Prasanna",  property: "SRK Coliving",         priority: "High",   status: "Active" },
  { id: "#ST-2025-011", subject: "Complaint about mobile sync delay",       type: "Complaint",       raisedBy: "Hari Krishnan", property: "BlueMoon Inn",         priority: "Medium", status: "Active" },
  { id: "#ST-2025-010", subject: "Requesting dark mode",                    type: "Feature Request", raisedBy: "Sahul",         property: "SRK Gent's Hostel",   priority: "Medium", status: "Active" },
  { id: "#ST-2025-009", subject: "Tenant receipt PDF issue",                type: "Bug/Issue",       raisedBy: "Vinoth Kumar",  property: "Ganesh Men's Hostel", priority: "High",   status: "Active" },
];

const PRIORITY_STYLES = {
  Low:    { dot: "bg-green-500",  text: "text-green-600",  bg: "" },
  Medium: { dot: "bg-blue-500",   text: "text-blue-600",   bg: "" },
  High:   { dot: "bg-red-500",    text: "text-red-600",    bg: "" },
};

const STATUS_OPTIONS  = ["Active", "Inactive", "Resolved", "Pending"];
const MONTH_OPTIONS   = ["This Month", "Last Month", "Last 3 Months", "Last 6 Months"];
const DATE_OPTIONS    = ["Last 30 Days", "Last 7 Days", "Last 90 Days", "Custom"];

/* ── tiny reusable dropdown ── */
const FilterDropdown = ({ value, options, onChange, accent = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-3 py-[7px] rounded-lg border text-sm font-medium cursor-pointer
          transition-all duration-150
          ${accent
            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}
        `}
      >
        {value}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[38px] left-0 min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden animate-fadeIn">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors cursor-pointer
                ${value === opt ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── main component ── */
const SupportTicket = () => {
  const [statusFilter, setStatusFilter]= useState("Active");
  const [monthFilter, setMonthFilter] = useState("This Month");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [searchText, setSearchText] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  /* close menu on outside click */
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* sort + filter */
  let data = DUMMY_TICKETS.filter((t) =>
    t.subject.toLowerCase().includes(searchText.toLowerCase()) ||
    t.raisedBy.toLowerCase().includes(searchText.toLowerCase()) ||
    t.property.toLowerCase().includes(searchText.toLowerCase())
  );

  if (sortCol) {
    data = [...data].sort((a, b) => {
      const av = a[sortCol] ?? ""; const bv = b[sortCol] ?? "";
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  const totalPages = Math.ceil(data.length / pageSize);
  const paged = data.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => (
    <span className="ml-1 opacity-50 text-[10px]">
      {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  
  const stats = [
    { label: "Total Leads",      value: 246 },
    { label: "New Today",        value: 0   },
    { label: "Contacted",        value: 132 },
    { label: "Demo Scheduled",   value: "09"},
  ];

  return (
    <DashboardLayout>
      <div className="flex-col-layout gap-4">

       
        <div className="flex-between">
          <h1 className="text-xl font-semibold font-inter">Support Tickets</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              IAM Users
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Ticket
            </button>
          </div>
        </div>

        {/* ── stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-common p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
              <h2 className="text-[28px] font-bold text-gray-800 leading-none">{s.value}</h2>
            </div>
          ))}
        </div>

        {/* ── based on label ── */}
        <p className="text-xs text-gray-400 flex items-center gap-1 -mt-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
          Based upon last 30 Days
        </p>

        
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} accent />
          <FilterDropdown value={monthFilter}  options={MONTH_OPTIONS}  onChange={setMonthFilter} />

          
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-[7px] rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-blue-400 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2M9 16h6" />
            </svg>
            Filter
          </button>

         
          <div className="flex-1" />

          {/* search */}
          <div className="relative">
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-[7px] border border-gray-300 rounded-lg text-sm font-medium w-56 outline-none focus:border-blue-500"
            />
          </div>

          {/* date filter */}
          <FilterDropdown value={dateFilter} options={DATE_OPTIONS} onChange={setDateFilter} />
        </div>

        
        <div
          className="card-common flex flex-col"
          style={{ maxHeight: "calc(100vh - 230px)", overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto", overflowY: "auto", flex: 1, minHeight: 0 }}>
            <table className="w-full min-w-[900px] text-sm text-left">

             
              <thead className="table-header sticky top-0 z-[50]">
                <tr>
                  <th className="px-4 py-3 w-[130px] whitespace-nowrap cursor-pointer" onClick={() => handleSort("id")}>
                    TICKET ID <SortIcon col="id" />
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("subject")}>
                    SUBJECT <SortIcon col="subject" />
                  </th>
                  <th className="px-4 py-3 w-[140px] whitespace-nowrap">TYPE</th>
                  <th className="px-4 py-3 w-[140px] whitespace-nowrap cursor-pointer" onClick={() => handleSort("raisedBy")}>
                    RAISED BY <SortIcon col="raisedBy" />
                  </th>
                  <th className="px-4 py-3 w-[180px] whitespace-nowrap cursor-pointer" onClick={() => handleSort("property")}>
                    PROPERTY NAME <SortIcon col="property" />
                  </th>
                  <th className="px-4 py-3 w-[100px] whitespace-nowrap">PRIORITY</th>
                  <th className="px-4 py-3 w-[80px] text-center sticky right-0 bg-[#F8F9FF]">ACTIONS</th>
                </tr>
              </thead>

              {/* tbody */}
              <tbody className="divide-y divide-gray-100">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No tickets found</td>
                  </tr>
                ) : (
                  paged.map((ticket) => {
                    const p = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.Low;
                    return (
                      <tr key={ticket.id} className="group hover:bg-gray-50 text-[13px]">

                        {/* ticket id */}
                        <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">{ticket.id}</td>

                        {/* subject with tooltip */}
                        <td className="px-4 py-3 max-w-[260px]">
                          <span
                            className="block truncate cursor-default"
                            onMouseEnter={(e) => {
                              const r = e.currentTarget.getBoundingClientRect();
                              setTooltip({ visible: true, text: ticket.subject, x: r.left, y: r.bottom + 6 });
                            }}
                            onMouseLeave={() => setTooltip((p) => ({ ...p, visible: false }))}
                          >
                            {ticket.subject}
                          </span>
                        </td>

                        {/* type */}
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{ticket.type}</td>

                        {/* raised by */}
                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{ticket.raisedBy}</td>

                        {/* property */}
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{ticket.property}</td>

                        {/* priority */}
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${p.text}`}>
                            <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                            {ticket.priority}
                          </span>
                        </td>

                        {/* actions */}
                        <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-gray-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              const spaceBelow = window.innerHeight - rect.bottom;
                              setMenuPos({
                                top: spaceBelow < 100 ? rect.top - 90 : rect.bottom + 6,
                                left: rect.right - 140,
                              });
                              setOpenMenu(openMenu === ticket.id ? null : ticket.id);
                            }}
                            className="p-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                          >
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="5"  r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="19" r="1.5" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── pagination ── */}
          <div className="flex-between px-4 py-2 border-t border-gray-100 text-sm bg-white shrink-0">
            <span className="text-gray-500">
              Total Record Count : <span className="text-blue-600 font-semibold">{data.length}</span>
            </span>
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer outline-none"
              >
                {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>

              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-2 py-1 rounded ${page <= 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
              >&#8249;</button>

              <span className="border border-gray-200 px-3 py-1 rounded-lg bg-gray-50 font-medium">{page}</span>

              <span className="text-gray-400">{page} - {totalPages || 1}</span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-2 py-1 rounded ${page >= totalPages ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
              >&#8250;</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── tooltip ── */}
      {tooltip.visible && (
        <div
          className="tooltip-common"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* ── context menu via portal ── */}
      {openMenu && createPortal(
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            width: "150px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 999999,
          }}
        >
          {["View", "Edit", "Assign", "Close Ticket"].map((action) => (
            <button
              key={action}
              onClick={() => setOpenMenu(null)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer
                ${action === "Close Ticket"
                  ? "hover:bg-red-50 text-red-600"
                  : "hover:bg-gray-50 text-gray-700"}`}
            >
              {action}
            </button>
          ))}
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
};

export default SupportTicket;
