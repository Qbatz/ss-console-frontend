import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Arrow from "../../assets/arrow-right.png";
import { useHostel } from "../../Context/HostelListContext";
import Toast from "../SuccessModal/ToastDesign";
import Search from "../../assets/Search.png";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";
import Circle from "../../assets/menucircle.png";
import OwnerImg from "../../assets/ownerimg.png";
import call from "../../assets/call.png";
import location from "../../assets/locationGrey.png";
import team from "../../assets/team.png";
import refreshWhite from "../../assets/refreshWhite.png";
import refresh from "../../assets/RefreshButton.png";
import Filter from "../../assets/Filter.png"
const TenantRecurring = () => {
  const { getRecurringHostels, generateRecurringInvoice, loading, errorMsg, getRecurringByHostelId, bulkGenerateRecurring } = useHostel();
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Recurring");
  console.log("errorMsg", errorMsg)
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const [data, setData] = useState([]);
  console.log("data", data)
  const [filterOptions, setFilterOptions] = useState([]);
  const [filter, setFilter] = useState("TODAY");
  console.log("filter", filter)
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [recurringDetails, setRecurringDetails] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [historySize, setHistorySize] = useState(5);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkReason, setBulkReason] = useState("");
  const [bulkDesc, setBulkDesc] = useState("");
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [systemFilter, setSystemFilter] = useState("");
  const [openSystemDropdown, setOpenSystemDropdown] = useState(false);
  const [appliedFilterType, setAppliedFilterType] = useState("");
  const [appliedSystemFilter, setAppliedSystemFilter] = useState("");
  const [errorTable, setErrorTable] = useState("")
  const [recurringPending, setRecurringPending] = useState({
    recurringPendingCount: 0,
    subscriptionExpiredCount: 0
  });

  const [resStatusOptions, setResStatusOptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  console.log("selectedItem", selectedItem)
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item.hostelId));
    }
  };
  // const fetchRecurring = async () => {

  //   const res = await getRecurringHostels(
  //     page,
  //     size,
  //     search,
  //     filter
  //   );

  //   if (res?.success) {

  //     setData(res.data.hostelList || []);
  //     setTotalItems(res.data.totalItems);
  //     setTotalPages(res.data.totalPages);
  //     setFilterOptions(res.data.filterOptions || []);
  //     setRecurringPending(res.data || [])
  //   }

  // };
  const fetchRecurring = async () => {
    setErrorTable("");
    const res = await getRecurringHostels(
      page,
      size,
      search,
      filter,
      statusFilter,
      // systemFilter // 👈 pass here
      appliedSystemFilter
    );

    if (res?.success) {
      setErrorTable("")
      const response = res.data;

      setData(response.hostelList || []);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
      setFilterOptions(response.filterOptions || []);
      setResStatusOptions(response.statusFilterOptions || []);
      setAppliedFilterType(response.appliedFilterType);
      setRecurringPending({
        recurringPendingCount: response.recurringPendingCount || 0,
        subscriptionExpiredCount: response.subscriptionExpiredCount || 0
      });
    }
    else {
      console.log("res.message", res.message)
      setData([]);
      setErrorTable(res.message)
    }
  };
  //   const fetchRecurring = async () => {
  //   const res = await getRecurringHostels(
  //     page,
  //     size,
  //     search,
  //     filter,
  //     statusFilter // ✅ add this also
  //   );

  //   if (res?.success) {
  //     const response = res.data;

  //     setData(response.hostelList || []);
  //     setTotalItems(response.totalItems);
  //     setTotalPages(response.totalPages);

  //     setFilterOptions(response.filterOptions || []);
  //     setResStatusOptions(response.statusFilterOptions || []);

  //     // ✅ ONLY counts store pannunga
  //     setRecurringPending({
  //       recurringPendingCount: response.recurringPendingCount || 0,
  //       subscriptionExpiredCount: response.subscriptionExpiredCount || 0
  //     });
  //   }
  // };
  // useEffect(()=>{
  //   fetchRecurring();
  // },[page,size,filter,search]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (showFilterDrawer) {
      // reset filters
      setFilter("TODAY");          // default
      setStatusFilter("ALL");      // default

      // close dropdowns
      setOpenFilter(false);
      setOpenStatusFilter(false);
    }
  }, [showFilterDrawer]);
  const handleOpenDetails = async (item, page = 0) => {
    setSelectedItem(item);
    console.log("setSelectedItem", selectedItem)
    setShowDetailsModal(true);

    const res = await getRecurringByHostelId(
      item.hostelId,
      page,
      historySize
    );

    if (res?.success) {
      setRecurringDetails(res.data);
      setHistoryTotalPages(res.data.totalPages || 1);
      setHistoryPage(page);
    }
  };
  console.log("selectedItem?.currentPeriodStartDate", selectedItem?.activeTenantCount);
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const parts = dateStr.split("/"); // ["24","03","2026"]

    if (parts.length !== 3) return dateStr;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS month 0-based
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  const formatFullDate = (dateStr) => {
    if (!dateStr) return "";

    const parts = dateStr.split("/"); // DD/MM/YYYY

    if (parts.length !== 3) return dateStr;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    return date.toLocaleDateString("en-US", {
      month: "short",   // 👉 May
      day: "numeric",   // 👉 1
      year: "numeric"   // 👉 2026
    });
  };
  //   const handleOpenDetails = async (item) => {
  //     console.log("item",item)
  //   setSelectedItem(item);
  //   setShowDetailsModal(true);

  //   const res = await getRecurringByHostelId(item.hostelId);

  //   if (res?.success) {
  //     setRecurringDetails(res.data);
  //   }
  // };
  useEffect(() => {

    const delay = setTimeout(() => {
      fetchRecurring();
    }, 400);

    return () => clearTimeout(delay);

  }, [page, size, filter, search, statusFilter, appliedSystemFilter]);
  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);

  const handleGenerate = async (ids = []) => {

    const res = await bulkGenerateRecurring(ids);
    if (res?.success) {


      setModalType("success");
      setMessage(res?.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
      fetchRecurring();

    }
    else {

      setMessage(res?.message);
      setModalType("error");

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

    }

  };
  //   const handleGenerate = async (item) => {

  //   const res = await generateRecurringInvoice(
  //     item.hostelId,
  //     item.recurringDay
  //   );

  //   if (res?.success) {
  //     fetchRecurring();
  //   }

  // };

  return (

    <DashboardLayout>
      {(errorMsg === false || errorMsg === "Access Restricted") ? (

        <div className="flex flex-col items-center justify-center h-[400px] gap-4">

          <img
            src={LoginImg}
            alt="Access Restricted"
            className="w-64 object-contain"
          />

          <p className="text-red-600 text-lg font-medium">
            {errorMsg}
          </p>

        </div>

      ) : (

        <>

          <Toast
            show={showSuccess}
            message={message}
            type={modalType}

          />

          <div className="border-b border-gray-300 mb-6 pb-2">
            <h1 className="text-xl font-semibold text-left">
              Recurring Monitor
            </h1>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-xl font-semibold mt-1">{totalItems}</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-sm text-gray-500">Recurring Pending</p>
              <p className="text-xl font-semibold mt-1">{recurringPending?.recurringPendingCount || 0}</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-sm text-gray-500">Subscription Expired</p>
              <p className="text-xl font-semibold mt-1">{recurringPending?.subscriptionExpiredCount || 0}</p>
            </div>

          </div>

          <p className="text-xs text-blue-500 mb-4 text-left">
            Based upon last 30 Days
          </p>
          {/* 
                   <div className="flex justify-between items-center mb-4">

            <div ref={dropdownRef} className="relative w-40">

              <button
                onClick={() => setOpenFilter(!openFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center cursor-pointer"
              >
                {filterOptions.find(f => f.key === filter)?.label || "today"}
                <span>▾</span>
              </button>

              {openFilter && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-50 max-h-40 overflow-y-auto">

                  {filterOptions.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => {
                        setFilter(item.key);
                        setPage(1);
                        setOpenFilter(false);
                      }}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
          ${filter === item.key ? "bg-blue-600 text-white" : ""}`}
                    >
                      {item.label}
                    </div>
                  ))}

                </div>
              )}

            </div>
  
            <div className="relative">
              <img
                src={Search}
                alt="Search"
                className="absolute left-3 top-2.5 w-4 h-4"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-medium leading-[150%] w-56"
              />
            </div>

          </div> */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-2 flex-wrap">

              {/* All Properties */}
              {/* <button className="border border-blue-500 text-blue-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                All Properties ▾
              </button> */}

              {/* This Month */}
              <div ref={dropdownRef} className="relative w-40">

                {/* <button
                  onClick={() => setOpenFilter(!openFilter)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center cursor-pointer"
                > */}
                <button
                  onClick={() => !showFilterDrawer && setOpenFilter(!openFilter)}
                  disabled={showFilterDrawer}
                  className={`border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center
    ${showFilterDrawer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
                >
                  {filterOptions.find(f => f.key === filter)?.label || "today"}
                  <span>▾</span>
                </button>

                {openFilter && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-50 max-h-40 overflow-y-auto">

                    {filterOptions.map((item) => (
                      <div
                        key={item.key}
                        onClick={() => {
                          setFilter(item.key);
                          setPage(1);
                          setOpenFilter(false);
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
          ${filter === item.key ? "bg-blue-600 text-white" : ""}`}
                      >
                        {item.label}
                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* Cycle */}
              {/* <button className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                ⚙ Cycle: 2 → 1
              </button> */}
              <div className="relative w-40">

                {/* <button
    onClick={() => setOpenStatusFilter(!openStatusFilter)}
    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center cursor-pointer"
  > */}
                <button
                  onClick={() => !showFilterDrawer && setOpenStatusFilter(!openStatusFilter)}
                  disabled={showFilterDrawer}
                  className={`border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center
    ${showFilterDrawer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
                >
                  {
                    resStatusOptions.find(s => s.key === statusFilter)?.label || "All"
                  }
                  <span>▾</span>
                </button>

                {openStatusFilter && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-50">

                    {resStatusOptions.map((item) => (
                      <div
                        key={item.key}
                        onClick={() => {
                          setStatusFilter(item.key);
                          setPage(1);
                          setOpenStatusFilter(false);
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
            ${statusFilter === item.key ? "bg-blue-600 text-white" : ""}
          `}
                      >
                        {item.label}
                      </div>
                    ))}

                  </div>
                )}
              </div>
              <img src={Filter} className="w-4 h-4 cursor-pointer" onClick={() => setShowFilterDrawer(true)} />

            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2">

              {/* Refresh */}
              <button
                onClick={fetchRecurring}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                ⟳
              </button>

              {/* Search */}
              <div className="relative">
                <img
                  src={Search}
                  className="absolute left-3 top-2.5 w-4 h-4"
                />
                <input
                  type="text"
                  placeholder="Search Properties..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-56"
                />
              </div>

            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex justify-between items-center bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg mb-3">


              <div className="flex items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  checked={selectedIds.length === data.length}
                  onChange={handleSelectAll}
                />

                <span className="text-blue-600 font-medium">
                  {selectedIds.length} properties selected
                </span>

                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                  Cycle: 2 → 1
                </span>

                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
                  Recurring: All
                </span>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2">

                <button
                  onClick={() => setShowBulkModal(true)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 cursor-pointer"

                >
                  ⟳ Bulk Generate Recurring
                </button>

                <button
                  onClick={() => setSelectedIds([])}
                  className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm cursor-pointer"
                >
                  ✕ Clear
                </button>

              </div>

            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            <div className="max-h-[400px]  overflow-x-auto overflow-y-auto">

              <table className="w-max min-w-full table-fixed text-sm text-left">

                <thead className="bg-[#F8F9FF] text-gray-600 text-xs uppercase sticky top-0 z-40">
                  <tr>
                    <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">ID</th>
                    <th className="px-4 py-3 sticky left-[80px] bg-[#F8F9FF] z-50 w-[100px]">Property</th>
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Mobile No</th>
                    {/* <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Sub Status</th> */}
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Recurring Status</th>
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Region / City</th>
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Billing Cycle</th>
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Recurring mode</th>
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Tenant Count</th>
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Sub Status</th>
                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>


                <tbody className="divide-y divide-gray-200">

                  {loading ? (


                    Array.from({ length: size }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))

                  ) : errorTable ? (
                    <tr>
                      <td colSpan="7">
                        <div className="flex items-center justify-center h-[100px] text-red-500 font-medium">
                          {errorTable}
                        </div>
                      </td>
                    </tr>
                  ) : data.length > 0 ? (

                    data.map((item, index) => (
                      <tr key={item.hostelId}>
                        {/* <td className="px-4 py-3">
                          {(page - 1) * size + index + 1}
                        </td> */}
                        {/* <td className="px-4 py-3 flex items-center gap-2">
  <input
    type="checkbox"
    checked={selectedIds.includes(item.hostelId)}
    onChange={() => handleSelect(item.hostelId)}
  />

  <span>
    {(page - 1) * size + index + 1}
  </span>
</td> */}
                        <td className="px-4 py-2 sticky left-0 bg-white z-30 w-[80px] group-hover:bg-gray-50 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.hostelId)}
                            onChange={() => handleSelect(item.hostelId)}
                            disabled={item.recurringStatus}
                            className={item.recurringStatus ? "cursor-not-allowed opacity-50" : "cursor-pointer"}

                          />

                          <span>
                            {(page - 1) * size + index + 1}
                          </span>
                        </td>


                        <td className="px-4 py-2 sticky left-[80px] bg-white z-30 w-[260px] group-hover:bg-gray-50">
                          <div className="flex items-center gap-3">

                            {/* Avatar */}
                            {item.ownerInfo?.profilePic ? (
                              <img
                                src={item.ownerInfo.profilePic}
                                className="w-8 h-8 rounded-full object-cover"
                                alt="owner"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                                {item?.initials || "NA"}
                              </div>
                            )}

                            {/* Text */}
                            <div className="flex flex-col">
                              <span className="text-[13px] font-semibold text-gray-900 text-left">
                                {item.hostelName}
                              </span>
                              <span className="text-[11px] text-gray-500 text-left">
                                {item.ownerInfo?.fullName || "----"}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.mobile}
                        </td>


                        <td className="px-4 py-2 text-left text-[12px] whitespace-nowrap">
                          <span
                            className={`font-medium
    ${item.recurringStatus
                                ? "text-green-600"
                                : "text-orange-500"
                              }`}
                          >
                            {item.recurringStatus ? "Generated" : "Blocked"}
                          </span>
                        </td>

                        <td
                          className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap"
                          onMouseEnter={(e) => {
                            setTooltip({
                              text: item.fullAddress,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          {item.city} , {item.state}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.billingStartDay}to{item.billingEndDay} of Month
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.recurringMode || "----"}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.activeTenantCount || 0}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.recurringStatus ? (
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                              Generated
                            </span>
                          ) : (
                            <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
                              Not Generated
                            </span>
                          )}
                        </td>

                        {/* <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          <button
                            disabled={item.recurringStatus || filter === "UP_COMING"}
                            onClick={() => handleGenerate(item)}
                            className={`px-3 py-1 rounded-lg text-xs text-white
          ${item.recurringStatus || filter === "UP_COMING"
                                ? "bg-gray-400"
                                : "bg-blue-600 hover:bg-blue-700"
                              }`}
                          >
                            Generate
                          </button>
                        </td> */}
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {!item.recurringStatus ? (
                            <button
                              // disabled={filter === "UP_COMING"}
                              // onClick={() => handleGenerate(item)}
                              // onClick={() => {
                              //   setSelectedItem(item);
                              //   setShowDetailsModal(true);
                              // }}
                              //                               onClick={() => {
                              //   setSelectedItem(item);
                              //   setShowDetailsModal(true);


                              //   getRecurringByHostelId(item.hostelId);
                              // }}
                              onClick={() => handleOpenDetails(item)}
                              className="px-3 py-1 rounded-lg text-xs text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer"

                            >
                              Generate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenDetails(item)}
                              className="px-3 py-1 rounded-lg text-xs border border-gray-300 text-blue-600 bg-white hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                            >
                              👁 View Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))

                  ) : (

                    <tr>

                      <td colSpan="7" className="text-center py-6">
                        {errorTable ? (
                          <span className="text-red-500 font-medium">
                            {errorTable}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            No Data Found
                          </span>
                        )}
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>
              {tooltip && (
                <div
                  className="fixed z-[99999] pointer-events-none"
                  style={{
                    top: tooltip.y + 5,
                    left: tooltip.x + 10
                  }}
                >
                  <div className="bg-white text-gray-600 text-xs rounded-xl px-4 py-3 shadow-lg border border-gray-200 max-w-xs break-words">
                    {tooltip.text}
                  </div>

                  {/* Arrow */}
                  <div className="w-3 h-3 bg-white rotate-45 ml-4 -mt-1 border-l border-b border-gray-200"></div>
                </div>
              )}

            </div>

            {/* Footer Pagination */}


          </div>
          <div className="flex items-center justify-between px-6 py-3  text-sm text-gray-500">

            <span>
              Total Record Count :
              <span className="text-blue-600 ml-1">{size}</span>
            </span>

            <div className="flex items-center gap-4">

              {/* Page size */}
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              {/* Prev */}
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-2"
              >
                <img src={Arrow} className="w-4 h-4 cursor-pointer" />
              </button>

              {/* Current Page */}
              <span className="border px-2 py-1 rounded bg-gray-50">
                {page}
              </span>

              {/* Next */}
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-2"
              >
                <img src={Arrow} className="w-4 h-4 rotate-180 cursor-pointer" />
              </button>

              {/* Range */}
              <span className="text-gray-400">
                {start} - {end}
              </span>

            </div>

          </div>
          {showDetailsModal && selectedItem && (
            <div className="fixed inset-0 z-[9999] flex justify-end">


              <div
                className="fixed inset-0 bg-black/10 backdrop-blur-[0px]"
                onClick={() => setShowDetailsModal(false)}
              ></div>


              <div className="relative z-[10000] flex items-center">
                <div className="w-[420px] h-[calc(100%-40px)] my-5 mr-5 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col animate-slideIn">


                  <div className="flex justify-between items-start p-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {selectedItem.initials}
                      </div>

                      <div className="text-left">
                        <p className="font-semibold text-sm">
                          {selectedItem.hostelName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedItem.hostelId}
                        </p>
                      </div>
                    </div>

                    <button className="cursor-pointer" onClick={() => setShowDetailsModal(false)}>✕</button>
                  </div>


                  <div className="flex-1 overflow-y-auto p-5 text-xs">


                    {/* <div className="mb-4 space-y-2">
                      <p className="font-semibold text-gray-500 text-[11px]">
                        PROPERTY INFO
                      </p>

                      <p><img src={location} className="w-4 h-4"/> {selectedItem.city}, {selectedItem.state}</p>
                      <p> <img src={call} className="w-4 h-4"/> {selectedItem.mobile}</p>
                      <p><img src={OwnerImg} className="w-4 h-4"/> {selectedItem.ownerInfo?.fullName}</p>
                      <p><img src={team} className="w-4 h-4"/> Active Tenants: 42</p>
                    </div> */}
                    <div className="mb-4">
                      <p className="font-semibold text-gray-400 text-[11px] mb-3 text-left">
                        PROPERTY INFO
                      </p>

                      <div className="space-y-3 text-[13px]">

                        {/* Location */}
                        <div className="flex items-center gap-3">
                          <img src={location} className="w-4 h-4 opacity-60" />
                          <span className="text-gray-500 w-28 text-left">Location</span>
                          <span className="font-medium text-gray-800 text-left">
                            {selectedItem.city}, {selectedItem.state}
                          </span>
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center gap-3">
                          <img src={call} className="w-4 h-4 opacity-60" />
                          <span className="text-gray-500 w-28 text-left">Mobile</span>
                          <span className="font-medium text-gray-800 text-left">
                            {selectedItem.mobile}
                          </span>
                        </div>

                        {/* Owner */}
                        <div className="flex items-center gap-3">
                          <img src={OwnerImg} className="w-4 h-4 opacity-60" />
                          <span className="text-gray-500 w-28 text-left">Owner</span>
                          <span className="font-medium text-gray-800 text-left">
                            {selectedItem.ownerInfo?.fullName}
                          </span>
                        </div>

                        {/* Active Tenants */}
                        <div className="flex items-center gap-3">
                          <img src={team} className="w-4 h-4 opacity-60" />
                          <span className="text-gray-500 w-28 text-left">Active Tenants</span>
                          <span className="font-medium text-gray-800 text-left">
                            {selectedItem?.activeTenantCount || "N/A"}
                          </span>
                        </div>

                      </div>
                    </div>


                    {/* <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-500 text-[11px] mb-2 font-semibold">
                        BILLING RULE
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-400">Billing Method</p>
                          <p className="font-medium">Monthly Recurring</p>
                        </div>

                        <div>
                          <p className="text-gray-400">Billing Cycle</p>
                          <p className="font-medium">2 → 1</p>
                        </div>

                        <div>
                          <p className="text-gray-400">Current Period</p>
                          <p className="font-medium">Apr 2 → May 1</p>
                        </div>

                        <div>
                          <p className="text-gray-400">Next Recurring</p>
                          <p className="font-medium">May 1, 2026</p>
                        </div>
                      </div>
                    </div> */}
                    <div className="bg-[#F7F8FA] border border-gray-200 rounded-xl p-5 mb-4">

                      <p className="text-gray-400 text-[11px] font-semibold tracking-wide mb-4 text-left">
                        BILLING RULE
                      </p>

                      <div className="grid grid-cols-2 gap-y-5 gap-x-10 text-[13px] text-left">

                        {/* Billing Method */}
                        <div>
                          <p className="text-gray-400 mb-1">Billing Method</p>
                          <p className="font-medium text-gray-800">  {recurringDetails?.billingType || "N/A"}</p>
                        </div>

                        {/* Billing Cycle */}
                        <div>
                          <p className="text-gray-400 mb-1">Billing Cycle</p>
                          <p className="font-medium text-gray-800">{recurringDetails?.billingStartDay} → {recurringDetails?.billingEndDay}</p>
                        </div>

                        {/* Current Period */}
                        <div>
                          <p className="text-gray-400 mb-1">Current Period</p>
                          <p className="font-medium text-black">
                            {formatDate(recurringDetails?.currentPeriodStartDate)} →{" "}
                            {formatDate(recurringDetails?.currentPeriodEndDate)}
                          </p>
                        </div>

                        {/* Next Recurring */}
                        <div>
                          <p className="text-gray-400 mb-1">Next Recurring</p>
                          <p className="font-medium text-gray-800">
                            {formatFullDate(recurringDetails?.nextRecurringDate)}
                          </p>
                        </div>

                        {/* Last Recurring (NEW row like design) */}
                        <div>
                          <p className="text-gray-400 mb-1">Last Recurring</p>
                          <p className="font-medium text-gray-800">{formatFullDate(recurringDetails?.lastRecurringDate)}</p>
                        </div>

                      </div>
                    </div>

                    {/* STATUS BADGES */}
                    <div className="flex gap-2 mb-3">

                      {/* Subscription Status */}
                      <span
                        className={`px-2 py-1 text-xs rounded-full
      ${selectedItem?.isSubscriptionActive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {selectedItem?.recurringStatus ? "Active" : "Expired"}
                      </span>

                      {/* Recurring Status */}
                      <span
                        className={`px-2 py-1 text-xs rounded-full
      ${selectedItem?.recurringStatus
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                          }`}
                      >
                        {selectedItem?.recurringStatus ? "Generated" : "Pending"}
                      </span>

                    </div>

                    {/* ALERT */}
                    {!selectedItem.recurringStatus && (
                      <div className="bg-orange-100 text-orange-600 text-xs p-3 rounded-lg mb-4 text-left">
                        Recurring invoices were not generated for this property.
                        Subscription is expired.
                      </div>
                    )}

                    {/* HISTORY TABLE */}
                    <div>
                      <p className="text-gray-500 text-[11px] font-semibold mb-2 text-left">
                        RECURRING HISTORY — LAST 5 MONTHS
                      </p>

                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50 text-gray-500">
                            <tr>
                              <th className="p-2 text-left">Month</th>
                              <th className="p-2 text-left">Cycle</th>
                              <th className="p-2 text-left">Inv</th>
                              <th className="p-2 text-left">By</th>
                              <th className="p-2 text-left">Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {recurringDetails?.recurringHistory?.length > 0 ? (
                              recurringDetails.recurringHistory.map((item) => (
                                <tr key={item.trackerId}>

                                  <td className="p-2 text-start">
                                    {item.recurringCreatedAtDate}
                                  </td>

                                  <td className="p-2 text-start">
                                    {item.creationMonth - 1} → {item.creationMonth}
                                  </td>

                                  <td className="p-2 text-start">
                                    {item.invoiceGeneratedCount}
                                  </td>

                                  <td className="p-2 text-start">
                                    {item.createdBy || "N/A"}
                                  </td>

                                  <td className="p-2 text-start">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs
              ${item.recurringMode === "AUTOMATIC"
                                          ? "bg-green-100 text-green-600"
                                          : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                      {item.recurringMode}
                                    </span>
                                  </td>

                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-400">
                                  No History Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                      </div>
                      {recurringDetails?.totalItems > historySize && (
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">

                          {/* Left - Total Count */}
                          <span>
                            Total Record Count :
                            <span className="text-blue-600 ml-1">
                              {recurringDetails?.totalItems || 0}
                            </span>
                          </span>

                          {/* Right Controls */}
                          <div className="flex items-center gap-3">

                            {/* Page Size */}
                            <select
                              value={historySize}
                              onChange={(e) => {
                                const newSize = Number(e.target.value);
                                setHistorySize(newSize);
                                handleOpenDetails(selectedItem, 0);
                              }}
                              className="border rounded px-2 py-1 text-xs"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                            </select>

                            {/* Prev */}
                            <button
                              onClick={() =>
                                handleOpenDetails(selectedItem, Math.max(historyPage - 1, 0))
                              }
                              disabled={historyPage === 0}
                              className="px-1 disabled:opacity-40"
                            >
                              <img src={Arrow} className="w-3 h-3" />
                            </button>

                            {/* Current Page */}
                            <span className="border px-2 py-1 rounded bg-gray-50 text-black">
                              {historyPage + 1}
                            </span>

                            {/* Next */}
                            <button
                              onClick={() =>
                                handleOpenDetails(
                                  selectedItem,
                                  Math.min(historyPage + 1, historyTotalPages - 1)
                                )
                              }
                              disabled={historyPage >= historyTotalPages - 1}
                              className="px-1 disabled:opacity-40"
                            >
                              <img src={Arrow} className="w-3 h-3 rotate-180" />
                            </button>

                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* FOOTER (fixed bottom) */}
                  {/* <div className="p-4 border-t flex justify-between">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-4 py-2 border rounded-lg text-sm"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => handleGenerate(selectedItem)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      🔄 Generate Recurring
                    </button>
                  </div> */}
                  {!selectedItem?.recurringStatus && (
                    <div className="p-4 border-t border-gray-300 flex justify-end gap-2">

                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer"
                      >
                        Close
                      </button>

                      {/* Show only if BOTH are false */}

                      <button
                        // onClick={() => handleGenerate(selectedItem)}
                        onClick={() => handleGenerate([selectedItem.hostelId])}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-[12px] flex items-center gap-2 cursor-pointer"
                      >
                        <img src={refreshWhite} className="w-4 h-4" />
                        Generate Recurring
                      </button>


                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {showBulkModal && (
        <div className="fixed inset-0 z-[9999] flex justify-end">

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setShowBulkModal(false)}
          ></div>

          {/* RIGHT DRAWER */}
          <div className="relative z-[10000] flex items-center">
            <div className="w-[520px] h-[calc(100%-40px)] my-5 mr-5 bg-white rounded-xl shadow-xl border border-gray-300 flex flex-col animate-slideIn">

              {/* HEADER */}
              <div className="flex justify-between items-center p-5 border-b border-gray-300">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-left">
                  <img src={refresh} className="w-5 h-5" /> Bulk Generate Recurring
                </h2>
                <button onClick={() => setShowBulkModal(false)}>✕</button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto p-5 text-sm">

                <p className="text-gray-500 mb-4 text-left">
                  Generate recurring invoices for selected properties. Bulk action applies
                  to properties with the same billing cycle.
                </p>

                {/* SUMMARY */}
                <div className="grid grid-cols-3 gap-3 mb-4">

                  <div className="border border-gray-200 rounded-lg p-3 text-left">
                    <p className="text-gray-400 text-xs">Properties</p>
                    <p className="font-semibold text-lg">{selectedIds.length}</p>
                    <p className="text-xs text-gray-400">Selected</p>
                  </div>

                  {/* <div className="border border-gray-200 rounded-lg p-3 text-left">
                    <p className="text-gray-400 text-xs">Billing Cycle</p>
                    <p className="font-semibold text-lg">2 → 1</p>
                    <p className="text-xs text-gray-400">Common</p>
                  </div> */}

                  <div className="border border-gray-200 rounded-lg p-3 text-left">
                    <p className="text-gray-400 text-xs">Total Tenants</p>
                    <p className="font-semibold text-lg">
                      {
                        data
                          .filter(d => selectedIds.includes(d.hostelId))
                          .reduce((total, item) => total + (item.activeTenantCount || 0), 0)
                      }
                    </p>
                    <p className="text-xs text-gray-400">Invoices</p>
                  </div>

                </div>

                {/* PROPERTY LIST */}
                {/* <div className="border border-gray-200 rounded-lg p-3 mb-4 max-h-[160px] overflow-y-auto">
                  <p className="text-xs text-gray-400 mb-2 text-left">
                    PROPERTIES TO BE PROCESSED
                  </p>

                  {data
                    .filter(d => selectedIds.includes(d.hostelId))
                    .map((item) => (
                      <div key={item.hostelId} className="flex justify-between py-1">
                        <span>{item.hostelName}</span>
                        <span className="text-gray-400 text-xs">{item.activeTenantCount || 0} tenants </span>
                      </div>
                    ))}
                </div> */}
                <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden">

                  {/* Header */}
                  <div className="bg-gray-50 px-4 py-2 border-b  border-gray-300">
                    <p className="text-xs text-gray-400 text-left tracking-wide">
                      PROPERTIES TO BE PROCESSED
                    </p>
                  </div>

                  {/* List */}
                  <div className="max-h-[180px] overflow-y-auto">

                    {data
                      .filter(d => selectedIds.includes(d.hostelId))
                      .map((item) => (
                        <div
                          key={item.hostelId}
                          className="flex justify-between items-center px-4 py-3 border-b border-gray-300 "
                        >

                          {/* LEFT */}
                          <div className="flex items-center gap-3">

                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-semibold bg-blue-500">
                              {item.initials || "NA"}
                            </div>

                            {/* Text */}
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium text-gray-800">
                                {item.hostelName}
                              </span>

                              <span className="text-xs text-gray-400">
                                {item.hostelId?.slice(0, 6) || "SM0000"} • {item.city || "—"}
                              </span>
                            </div>

                          </div>

                          {/* RIGHT */}
                          <div className="text-sm text-gray-400">
                            {item.activeTenantCount || 0} tenants
                          </div>

                        </div>
                      ))}

                  </div>
                </div>

                {/* REASON */}
                <div className="mb-3">
                  <p className="text-sm mb-1 text-left">
                    Reason <span className="text-red-500">*</span>
                  </p>
                  <select
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    className="w-full border  border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select a reason</option>
                    <option value="manual">Manual</option>
                    <option value="retry">Retry</option>
                  </select>
                </div>

                {/* DESCRIPTION */}
                <div className="mb-3 text-left">
                  <p className="text-sm mb-1">Description</p>
                  <textarea
                    value={bulkDesc}
                    onChange={(e) => setBulkDesc(e.target.value)}
                    className="w-full border  border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Explain why..."
                  />
                </div>

                {/* ALERT */}
                <div className="bg-orange-100 text-orange-600 text-xs p-3 rounded-lg mb-3">
                  This will create invoices for {selectedIds.length} properties
                </div>

                {/* CONFIRM */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={confirmBulk}
                    onChange={(e) => setConfirmBulk(e.target.checked)}
                  />
                  <span>
                    I confirm generating recurring invoices manually
                  </span>
                </div>

              </div>

              {/* FOOTER */}
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  Cancel
                </button>

                {/* <button
                  disabled={!confirmBulk || !bulkReason}
                  className={`px-4 py-2 rounded-lg text-sm text-white flex items-center justify-center gap-2
    ${confirmBulk && bulkReason
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  <img src={refreshWhite} className="w-4 h-4" />
                  Generate
                </button> */}
                <button
                  // disabled={!confirmBulk || !bulkReason}
                  onClick={async () => {
                    const res = await bulkGenerateRecurring(selectedIds);

                    if (res?.success) {
                      setShowBulkModal(false);
                      setSelectedIds([]);
                      setConfirmBulk(false);
                      setBulkReason("");
                      setBulkDesc("");

                      setModalType("success");
                      setMessage(res?.data || "Bulk Generated Successfully");
                      setShowSuccess(true);

                      setTimeout(() => setShowSuccess(false), 1500);

                      fetchRecurring();
                    } else {
                      setModalType("error");
                      setMessage(res?.message || "Failed");
                      setShowSuccess(true);

                      setTimeout(() => setShowSuccess(false), 1500);
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center justify-center gap-2 bg-blue-700"
                // ${confirmBulk && bulkReason
                //   ? "bg-blue-600 hover:bg-blue-700"
                //   : "bg-gray-300 cursor-not-allowed"
                // }`}
                >
                  <img src={refreshWhite} className="w-4 h-4" />
                  Generate
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-[9999] flex justify-end">


          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setShowFilterDrawer(false)}
          ></div>


          <div className="relative z-[10000] flex items-center">
            <div className="w-[380px] h-[calc(100%-40px)] my-5 mr-5 bg-white shadow-xl border border-gray-300 flex flex-col animate-slideInRight rounded-xl">        {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b">
                <p className="font-semibold flex items-center gap-2">
                  ⚙ Filter
                </p>
                <button onClick={() => {
                  setShowFilterDrawer(false);
                  setSystemFilter("");
                }}>✕</button>
              </div>


              <div className="flex-1 p-4 space-y-4 text-sm">


                {/* <div>
  <label className="text-gray-500 text-xs">System Filter</label>

<select
  value={systemFilter || ""}
  onChange={(e) => setSystemFilter(e.target.value)}
  className="w-full border rounded-lg px-3 py-2 mt-1"
  
>
  <option value="" disabled>
    Select Day
  </option>


  {Array.from({ length: 31 }, (_, i) => (
    <option key={i + 1} value={i + 1} >
      {i + 1}
    </option>
  ))}

</select>
</div> */}

                <div className="relative">
                  <label className="text-gray-500 text-xs">System Filter</label>

                  {/* BUTTON */}
                  <div
                    onClick={() => setOpenSystemDropdown(!openSystemDropdown)}
                    className="w-full border rounded-lg px-3 py-2 mt-1 flex justify-between items-center cursor-pointer"
                  >
                    {systemFilter || "Select Day"}
                    <span>▾</span>
                  </div>

                  {/* DROPDOWN */}
                  {openSystemDropdown && (
                    <div className="absolute mt-1 w-full bg-white border rounded-lg shadow z-50 max-h-40 overflow-y-auto text-left">

                      {Array.from({ length: 31 }, (_, i) => (
                        <div
                          key={i + 1}
                          onClick={() => {
                            setSystemFilter(i + 1);
                            setOpenSystemDropdown(false);
                          }}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
            ${systemFilter === i + 1 ? "bg-blue-600 text-white" : ""}
          `}
                        >
                          {i + 1}
                        </div>
                      ))}

                    </div>
                  )}
                </div>


              </div>


              <div className="p-4 border-t flex justify-between gap-2">

                <button
                  onClick={() => {
                    setStatusFilter("ALL");
                    setSystemFilter("");
                    setAppliedSystemFilter("");
                    setPage(1);
                  }}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Reset
                </button>

                <button
                  onClick={() => {
                    setPage(1);
                    setAppliedSystemFilter(systemFilter);
                    setShowFilterDrawer(false);

                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  Apply Filters
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TenantRecurring;