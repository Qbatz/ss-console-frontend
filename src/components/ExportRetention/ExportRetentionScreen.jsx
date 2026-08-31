import React, { useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";

const ExportRetention = () => {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("This Month");
  const [openMenu, setOpenMenu] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const exportData = [
    {
      id: 1,
      exportId: "INV-10025",
      createdAt: "05 Apr 2026",
      type: "Invoice",
      generatedBy: "Admin",
      fileSize: "245 KB",
      retention: "22 days",
      status: "Success",
    },
    {
      id: 2,
      exportId: "INV-10024",
      createdAt: "05 Apr 2026",
      type: "Recurring Invoice",
      generatedBy: "Manager",
      fileSize: "245 KB",
      retention: "22 days",
      status: "Pending",
    },
    {
      id: 3,
      exportId: "INV-10012",
      createdAt: "05 Apr 2026",
      type: "Invoice",
      generatedBy: "Sriram R",
      fileSize: "1.2 MB",
      retention: "22 days",
      status: "Success",
    },
    {
      id: 4,
      exportId: "INV-10025",
      createdAt: "05 Apr 2026",
      type: "Recurring Invoice",
      generatedBy: "Sriram R",
      fileSize: "455 KB",
      retention: "22 days",
      status: "Success",
    },
    {
      id: 5,
      exportId: "INV-10025",
      createdAt: "05 Apr 2026",
      type: "Invoice",
      generatedBy: "Priya M",
      fileSize: "245 KB",
      retention: "22 days",
      status: "Success",
    },
    {
      id: 6,
      exportId: "EXP-00582",
      createdAt: "05 Apr 2026",
      type: "Tenant Export",
      generatedBy: "Sriram R",
      fileSize: "230 KB",
      retention: "22 days",
      status: "Success",
    },
    {
      id: 7,
      exportId: "INV-10012",
      createdAt: "05 Apr 2026",
      type: "Invoice",
      generatedBy: "Priya M",
      fileSize: "245 KB",
      retention: "22 days",
      status: "Success",
    },
    {
      id: 8,
      exportId: "EXP-00582",
      createdAt: "05 Apr 2026",
      type: "Tenant Export",
      generatedBy: "Priya M",
      fileSize: "924 KB",
      retention: "22 days",
      status: "Success",
    },
    {
      id: 9,
      exportId: "INV-10012",
      createdAt: "05 Apr 2026",
      type: "Wise Report",
      generatedBy: "Sriram R",
      fileSize: "245 KB",
      retention: "22 days",
      status: "Failed",
    },
    {
      id: 10,
      exportId: "INV-10025",
      createdAt: "05 Apr 2026",
      type: "Invoice",
      generatedBy: "Sriram R",
      fileSize: "245 KB",
      retention: "Expired",
      status: "Success",
    },
  ];

  const filteredData = exportData.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleRefresh = () => {
    console.log("Refresh");
  };

  const handleCleanup = () => {
    console.log("Cleanup All");
  };

  const handleDownload = (item) => {
    console.log("Download Invoice", item);
    setOpenMenu(null);
  };

  const handleViewDetails = (item) => {
    console.log("View Details", item);
    setOpenMenu(null);
  };

  const handleRemove = (item) => {
    console.log("Remove Stored File", item);
    setOpenMenu(null);
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-white px-5 py-4">

        {/* ================= HEADER ================= */}
        <div className="border-b border-gray-200 pb-2 mb-4">
          <h1 className="text-[15px] font-medium text-[#1f2937]">
            Export Retention
          </h1>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">

          {/* Card 1 */}
          <div className="border border-[#e5e7eb] rounded-lg px-3 py-3 h-[69px]">
            <p className="text-[10px] text-[#6b7280] mb-1">
              Total Stored Files
            </p>

            <p className="text-[18px] leading-none font-medium text-[#111827]">
              12,482
            </p>
          </div>

          {/* Card 2 */}
          <div className="border border-[#e5e7eb] rounded-lg px-3 py-3 h-[69px]">
            <p className="text-[10px] text-[#6b7280] mb-1">
              Storage Used
            </p>

            <p className="text-[18px] leading-none font-medium text-[#111827]">
              6.4 GB
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-[#e5e7eb] rounded-lg px-3 py-3 h-[69px]">
            <p className="text-[10px] text-[#6b7280] mb-1">
              Exports Last 30 Days
            </p>

            <p className="text-[18px] leading-none font-medium text-[#111827]">
              3,240
            </p>
          </div>

          {/* Card 4 */}
          <div className="border border-[#e5e7eb] rounded-lg px-3 py-3 h-[69px]">
            <p className="text-[10px] text-[#6b7280] mb-1">
              Duplicate Exports
            </p>

            <p className="text-[18px] leading-none font-medium text-[#111827]">
              1,184
            </p>
          </div>

        </div>

        {/* ================= FILTER SECTION ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">

          <div className="flex items-center gap-2">

            {/* Month */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="
                h-[29px]
                px-3
                pr-8
                border
                border-[#d9dee7]
                rounded-md
                bg-white
                text-[10px]
                text-[#374151]
                outline-none
                cursor-pointer
              "
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
            </select>

            {/* Filter */}
            <button
              className="
                h-[29px]
                px-3
                border
                border-[#d9dee7]
                rounded-md
                bg-white
                text-[10px]
                text-[#374151]
                flex
                items-center
                gap-1.5
                hover:bg-gray-50
                cursor-pointer
              "
            >
              Filter

              <span className="text-[11px]">
                ♡
              </span>
            </button>

          </div>

          <div className="flex items-center gap-2">

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="
                w-[29px]
                h-[29px]
                rounded-md
                bg-[#315cec]
                text-white
                flex
                items-center
                justify-center
                hover:bg-[#2648c9]
                cursor-pointer
              "
            >
              ↻
            </button>

            {/* Search */}
            <div className="relative">

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-[165px]
                  h-[29px]
                  border
                  border-[#d9dee7]
                  rounded-md
                  pl-3
                  pr-8
                  text-[10px]
                  outline-none
                  focus:border-[#315cec]
                "
              />

              <span
                className="
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  text-[#111827]
                  text-[15px]
                "
              >
                ⌕
              </span>

            </div>

          </div>
        </div>

        {/* ================= CLEANUP ALERT ================= */}
        <div
          className="
            bg-[#fff5f5]
            border
            border-[#ffe3e3]
            rounded-lg
            px-3
            py-2
            mb-3
            flex
            items-center
            justify-between
          "
        >

          <div className="flex items-center gap-2">

            <div
              className="
                w-[22px]
                h-[22px]
                rounded-md
                bg-[#c5161d]
                text-white
                flex
                items-center
                justify-center
                text-[11px]
              "
            >
              ×
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#c5161d]">
                Storage Cleanup
              </p>

              <p className="text-[8px] text-[#6b7280] mt-0.5">
                Last action : Aug 10, 2026 · 09:42 AM
              </p>
            </div>

          </div>

          <button
            onClick={handleCleanup}
            className="
              bg-[#cc3338]
              hover:bg-[#b8272c]
              text-white
              text-[10px]
              font-medium
              px-4
              py-2
              rounded-md
              cursor-pointer
            "
          >
            Cleanup All
          </button>

        </div>

        {/* ================= TABLE ================= */}
        <div
          className="
            border
            border-[#e2e5eb]
            rounded-lg
            overflow-hidden
            bg-white
          "
        >

          <div className="overflow-x-auto">

            <table className="w-full text-[10px] table-fixed">

              <thead className="bg-[#f5f7fb]">

                <tr className="border-b border-[#e2e5eb]">

                  <th className="w-[40px] px-2 py-2 text-center">
                    <input type="checkbox" />
                  </th>

                  <th className="w-[85px] px-2 py-2 text-left font-medium text-[#6b7280] whitespace-nowrap">
                    EXPORT ↓
                  </th>

                  <th className="w-[95px] px-2 py-2 text-left font-medium text-[#6b7280] whitespace-nowrap">
                    CREATED AT
                  </th>

                  <th className="w-[105px] px-2 py-2 text-left font-medium text-[#6b7280] whitespace-nowrap">
                    TYPE ↓
                  </th>

                  <th className="w-[125px] px-2 py-2 text-left font-medium text-[#6b7280] whitespace-nowrap">
                    GENERATED BY
                  </th>

                  <th className="w-[100px] px-2 py-2 text-left font-medium text-[#6b7280] whitespace-nowrap">
                    FILE SIZE
                  </th>

                  <th className="w-[115px] px-2 py-2 text-left font-medium text-[#6b7280] whitespace-nowrap">
                    RETENTION
                  </th>

                  <th className="w-[100px] px-2 py-2 text-left font-medium text-[#6b7280] whitespace-nowrap">
                    STATUS
                  </th>

                  <th className="w-[60px] px-2 py-2 text-center font-medium text-[#6b7280] whitespace-nowrap">
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredData.map((item) => (

                  <tr
                    key={item.id}
                    className="
                      border-b
                      border-[#e5e7eb]
                      hover:bg-[#fafbff]
                    "
                  >

                    {/* Checkbox */}
                    <td className="px-2 py-2 text-center">
                      <input type="checkbox" />
                    </td>

                    {/* Export */}
                    <td className="px-2 py-2 font-medium text-[#263238] whitespace-nowrap">
                      {item.exportId}
                    </td>

                    {/* Created At */}
                    <td className="px-2 py-2 text-[#263238] whitespace-nowrap">
                      {item.createdAt}
                    </td>

                    {/* Type */}
                    <td
                      className="px-2 py-2 truncate"
                      title={item.type}
                    >
                      {item.type}
                    </td>

                    {/* Generated By */}
                    <td
                      className="px-2 py-2 truncate"
                      title={item.generatedBy}
                    >
                      {item.generatedBy}
                    </td>

                    {/* File Size */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      {item.fileSize}
                    </td>

                    {/* Retention */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      {item.retention}
                    </td>

                    {/* Status */}
                    <td className="px-2 py-2">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1
                          px-2
                          py-[2px]
                          rounded-full
                          text-[9px]
                          font-medium

                          ${
                            item.status === "Success"
                              ? "bg-[#ecfdf3] text-[#16803c]"
                              : item.status === "Pending"
                              ? "bg-[#fff8e6] text-[#d99a00]"
                              : "bg-[#fff0f1] text-[#dc2635]"
                          }
                        `}
                      >

                        <span
                          className={`
                            w-[5px]
                            h-[5px]
                            rounded-full

                            ${
                              item.status === "Success"
                                ? "bg-[#16803c]"
                                : item.status === "Pending"
                                ? "bg-[#f4ae00]"
                                : "bg-[#dc2635]"
                            }
                          `}
                        />

                        {item.status}

                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-2 py-2 relative">

                      <div className="flex justify-center">

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              openMenu === item.id
                                ? null
                                : item.id
                            );
                          }}
                          className="
                            w-6
                            h-6
                            rounded-md
                            flex
                            items-center
                            justify-center
                            hover:bg-gray-100
                            cursor-pointer
                            text-[#374151]
                          "
                        >
                          ⋮
                        </button>

                      </div>

                      {/* Dropdown */}
                      {openMenu === item.id && (

                        <div
                          className="
                            absolute
                            right-8
                            top-8
                            z-[9999]
                            w-[110px]
                            bg-white
                            border
                            border-[#e5e7eb]
                            rounded-md
                            shadow-[0_5px_20px_rgba(0,0,0,0.12)]
                            overflow-hidden
                          "
                        >

                          <button
                            onClick={() =>
                              handleDownload(item)
                            }
                            className="
                              w-full
                              px-2
                              py-2
                              text-left
                              text-[9px]
                              text-[#4b5563]
                              hover:bg-[#f5f7fb]
                              cursor-pointer
                            "
                          >
                            Download Invoice
                          </button>

                          <button
                            onClick={() =>
                              handleViewDetails(item)
                            }
                            className="
                              w-full
                              px-2
                              py-2
                              text-left
                              text-[9px]
                              text-[#4b5563]
                              hover:bg-[#f5f7fb]
                              cursor-pointer
                            "
                          >
                            View Details
                          </button>

                          <button
                            onClick={() =>
                              handleRemove(item)
                            }
                            className="
                              w-full
                              px-2
                              py-2
                              text-left
                              text-[9px]
                              text-red-500
                              hover:bg-red-50
                              cursor-pointer
                            "
                          >
                            Remove Stored File
                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= FOOTER ================= */}
          <div
            className="
              flex
              items-center
              justify-between
              px-2
              py-2
              bg-white
            "
          >

            {/* Total */}
            <div className="text-[10px] text-[#111827]">
              Total Record Count :
              <span className="text-[#315cec] ml-1 font-medium">
                {filteredData.length}
              </span>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">

              <select
                value={rowsPerPage}
                onChange={(e) =>
                  setRowsPerPage(Number(e.target.value))
                }
                className="
                  h-[24px]
                  px-2
                  border
                  border-[#d1d5db]
                  rounded-md
                  text-[9px]
                  outline-none
                  cursor-pointer
                "
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((prev) => Math.max(1, prev - 1))
                }
                className="
                  text-[#315cec]
                  disabled:text-[#b9c8f8]
                  text-[16px]
                  cursor-pointer
                  disabled:cursor-not-allowed
                "
              >
                ‹
              </button>

              <button
                className="
                  w-[24px]
                  h-[24px]
                  border
                  border-[#d1d5db]
                  rounded-md
                  text-[9px]
                  bg-white
                "
              >
                {page}
              </button>

              <span className="text-[10px] text-[#374151]">
                1 - {filteredData.length}
              </span>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="
                  text-[#315cec]
                  text-[16px]
                  cursor-pointer
                "
              >
                ›
              </button>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ExportRetention;