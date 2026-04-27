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
import Filter from "../../assets/Filter.png";
import Monthlycalendar from "../../assets/monthCalendar.png";
import MonthBlue from "../../assets/monthBlue.png";
import CalendarView from "./CalendarView";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import buildingWhite from "../../assets/buildingsWhite.png";
import Avatar from "../../assets/AvatarFrame.png";
import Building from "../../assets/buildings.png";
import ArrowDrop from "../../assets/direction-down 01.png";


const TenantRecurring = () => {
  const { getRecurringHostels, generateRecurringInvoice, loading, errorMsg, getRecurringByHostelId, bulkGenerateRecurring, getTenantRecurring, generateTenantRecurring, getRecurringByTenantId } = useHostel();
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Recurring");
  console.log("errorMsg", errorMsg)
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const [data, setData] = useState([]);
  console.log("data", data)
  const [filterOptions, setFilterOptions] = useState([]);
  const [filter, setFilter] = useState("TODAY");
  const [billingModelFilterBy, setBillingModelFilterBy] = useState("ALL");
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
  const [billingModelOptions, setBillingModelOptions] = useState([]);
  console.log("billingModelOptions", billingModelOptions)
  const [errorTable, setErrorTable] = useState("")
  const [viewType, setViewType] = useState("table");
  const [generateError, setGenrateError] = useState("")
  const [totalTenants, setTotalTenants] = useState("")
  const [isTableView, setIsTableView] = useState(false); // default FALSE
  const [expandedHostel, setExpandedHostel] = useState(null);
  const [selectedHostels, setSelectedHostels] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showCustomerTable, setShowCustomerTable] = useState(false);
  const [openHostelDropdown, setOpenHostelDropdown] = useState(false);
  const tableRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [recurringPending, setRecurringPending] = useState({
    recurringPendingCount: 0,
    subscriptionExpiredCount: 0
  });

  const [resStatusOptions, setResStatusOptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [hostelBasedTrue, setHostelBasedTrue] = useState([])
  const [openCustomerDropdown, setOpenCustomerDropdown] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);

  console.log("selectedItem", selectedItem)


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
    const res = await getTenantRecurring(
      page,
      size,
      search,
      filter,
      statusFilter,
      billingModelFilterBy,
      appliedSystemFilter,
      isTableView
    );

    if (res?.success) {
      setErrorTable("")
      const response = res.data;
      console.log("statusfilter", response.statusFilterOptions);

      setData(response.customerList || []);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
      setTotalTenants(response)
      setFilterOptions(response.filterOptions || []);
      setResStatusOptions(response.statusFilterOptions || []);
      setBillingModelOptions(response?.billingModelFilterOptions || []);
      setAppliedFilterType(response.appliedFilterType);
      setRecurringPending({
        recurringPendingCount: response.recurringPendingCount || 0,
        subscriptionExpiredCount: response.subscriptionExpiredCount || 0
      });
      setHostelBasedTrue(response?.hostelList)
    }
    else {
      console.log("res.message", res.message)
      setData([]);
      setErrorTable(res.message)
      setHostelBasedTrue([])
    }
  };
  useEffect(() => {
    fetchRecurring();
  }, [page, size, filter, search, statusFilter, appliedSystemFilter, billingModelFilterBy, isTableView]);
  const filteredCustomers = search
    ? selectedCustomers.filter(cust => {
      const value = search.toLowerCase();

      return (
        cust.fullName?.toLowerCase().includes(value) ||
        cust.mobile?.includes(value) ||
        cust.customerId?.toLowerCase().includes(value)
      );
    })
    : selectedCustomers;
  console.log("filteredCustomers", filteredCustomers)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setOpenStatusFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  useEffect(() => {
    const handleScroll = () => setOpenCustomerDropdown(null);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleOpenDetails = async (item, page = 0) => {
    setSelectedItem(item);
    console.log("setSelectedItem", selectedItem)
    setShowDetailsModal(true);

    const res = await getRecurringByTenantId(
      item.customerId,
      page,
      historySize
    );

    if (res?.success) {
      setRecurringDetails(res.data);
      setHistoryTotalPages(res.data.totalPages || 1);
      setHistoryPage(page);
    }
  };
  const handleHostelSelect = (hostelId) => {
    setSelectedHostels((prev) =>
      prev.includes(hostelId)
        ? prev.filter((id) => id !== hostelId)
        : [...prev, hostelId]
    );
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
  const hostelOptions = hostelBasedTrue || [];
  //   const handleOpenDetails = async (item) => {
  //     console.log("item",item)
  //   setSelectedItem(item);
  //   setShowDetailsModal(true);

  //   const res = await getRecurringByHostelId(item.hostelId);

  //   if (res?.success) {
  //     setRecurringDetails(res.data);
  //   }
  // };
  // const displayData = isTableView
  // ? hostelBasedTrue.filter((item) =>
  //     selectedHostels.length > 0
  //       ? selectedHostels.includes(item.hostelId)
  //       : true
  //   )
  // : data;
  const displayData = (isTableView ? hostelBasedTrue : data).filter(item => {
    const value = search.toLowerCase();

    return (
      item.hostelName?.toLowerCase().includes(value) ||
      item.fullName?.toLowerCase().includes(value)
    );
  });
  const getId = (item) => isTableView ? item.hostelId : item.customerId;
  const handleSelect = (item) => {
    const id = getId(item);

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };
  const handleToggleHostel = (hostelId) => {
    setExpandedHostel(prev => prev === hostelId ? null : hostelId);
  };
  const handleSelectAll = () => {
    const ids = displayData.map((item) => getId(item));

    if (selectedIds.length === ids.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ids);
    }
  };
  // useEffect(() => {

  //   const delay = setTimeout(() => {
  //     fetchRecurring();
  //   }, 400);

  //   return () => clearTimeout(delay);

  // }, [page, size, filter, search, statusFilter, appliedSystemFilter, billingModelFilterBy, isTableView]);
  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);

  const handleGenerate = async (ids = []) => {

    const res = await generateTenantRecurring(ids);
    if (res?.success) {


      setModalType("success");
      setMessage(res?.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
      setData(prev =>
        prev.map(item =>
          ids.includes(item.customerId)
            ? { ...item, recurringStatus: true }
            : item
        )
      );


      setSelectedCustomers(prev =>
        prev.map(item =>
          ids.includes(item.customerId)
            ? { ...item, recurringStatus: true }
            : item
        )
      );
      fetchRecurring();


    }
    else {

      setMessage(res?.message);
      setModalType("error");
      setGenrateError(res?.message)

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
      {(errorMsg === false || errorMsg === "Access Restricted" || !canRead) ? (

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


          <div className="border-b border-gray-300 mb-6 pb-2 flex items-center justify-between">


            <h1 className="text-xl font-semibold">
              Tenant Recurring
            </h1>

            {/* 
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-300">


              <button
                onClick={() => setViewType("table")}
                className={`p-2 rounded-md cursor-pointer ${viewType === "table" ? "bg-white shadow-sm" : ""
                  }`}
              >
                <img src={buildingWhite} className="w-4 h-4" />
              </button>


              <button className="p-2 rounded-md cursor-pointer">
                <img src={Avatar} className="w-4 h-4" />
              </button>

            </div> */}
            <div className="flex items-center bg-blue-600 p-[2px] rounded-full border border-gray-300 w-fit">

              {/* TABLE VIEW */}
              <button
                // onClick={() => setIsTableView(false) setShowCustomerTable(false)}
                onClick={() => {
                  setIsTableView(false)
                  setShowCustomerTable(false)
                  setSelectedCustomers([])

                }}
                className={`p-2 rounded-full transition-all duration-200
      ${!isTableView ? "bg-white shadow-sm" : ""}
    `}
              >
                <img
                  src={!isTableView ? Building : buildingWhite}
                  className="w-4 h-4 cursor-pointer"
                />
              </button>

              {/* AVATAR VIEW */}
              <button
                onClick={() => setIsTableView(true)}
                className={`p-2 rounded-full transition-all duration-200
      ${isTableView ? "bg-white shadow-sm " : ""}
    `}
              >
                <img
                  src={isTableView ? Avatar : Avatar}
                  className={`w-4 h-4 cursor-pointer ${!isTableView ? "opacity-60" : ""}`}
                />
              </button>

            </div>

          </div>

          <div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <p className="text-sm text-gray-500">Total Tenant</p>
                <p className="text-xl font-semibold mt-1">{totalTenants.totalTenants}</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <p className="text-sm text-gray-500">Billing Today</p>
                <p className="text-xl font-semibold mt-1">{totalTenants.billingToday}</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <p className="text-sm text-gray-500">Due Tomorrow</p>
                <p className="text-xl font-semibold mt-1">{totalTenants.billingTomorrow}</p>
              </div>

            </div>

            {/* <p className="text-xs text-blue-500 mb-4 text-left">
            Based upon last 30 Days
          </p> */}
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



              <div className="flex items-end gap-4 flex-wrap">

                {/* Day Filter */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Day Filter</label>

                  <div ref={dropdownRef} className="relative w-40">


                    <button
                      onClick={() => !showFilterDrawer && setOpenFilter(!openFilter)}
                      disabled={showFilterDrawer}
                      className={`border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center
    ${showFilterDrawer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
                    >
                      {filterOptions.find(f => f.key === filter)?.label || "today"}
                      <img src={ArrowDrop} className="w-5 h-5" />
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
                </div>

                {/* Status Filter */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Status Filter</label>

                  <div ref={statusDropdownRef} className="relative w-40">


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
                      <img src={ArrowDrop} className="w-5 h-5" />
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
                </div>

                {/* Billing Mode */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Billing Mode</label>

                  <select
                    value={billingModelFilterBy}
                    onChange={(e) => {
                      setBillingModelFilterBy(e.target.value);
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer w-40"
                  >
                    {billingModelOptions?.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="flex items-center gap-2">


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
            {!showCustomerTable && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-visible">

                <div
                  ref={tableRef}
                  className="max-h-[400px] overflow-x-auto overflow-y-visible relative"
                >

                  <table className="w-max min-w-full table-fixed text-sm text-left">

                    <thead className="bg-[#F8F9FF] text-gray-600 text-xs uppercase sticky top-0 z-40">
                      <tr>
                        <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">ID</th>
                        <th className="px-4 py-3 sticky left-[80px] bg-[#F8F9FF] z-50 w-[100px]">Property</th>
                        <th className=" py-3 w-[150px] whitespace-nowrap text-left">Tenant Name</th>
                        {/* <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Sub Status</th> */}
                        <th className="py-3 w-[150px] whitespace-nowrap text-left">Sub Status</th>
                        <th className="py-3 w-[150px] whitespace-nowrap text-left">Region / City</th>
                        <th className="py-3 w-[150px] whitespace-nowrap text-left">Billing Schedule</th>
                        <th className="py-3 w-[150px] whitespace-nowrap text-left">Billingmodel</th>
                        <th className="py-3 w-[150px] whitespace-nowrap text-left">Recurring mode</th>
                        {/* <th className="px-4 py-3 w-[150px] whitespace-nowrap">Tenant Count</th> */}
                        <th className="py-3 w-[150px] whitespace-nowrap text-left">Recurring Status</th>
                        <th className="py-3 w-[150px] whitespace-nowrap text-left">Actions</th>
                      </tr>
                    </thead>


                    <tbody className="divide-y divide-gray-200">

                      {loading ? (

                        Array.from({ length: size }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            {Array.from({ length: 9 }).map((_, j) => (
                              <td key={j} className="px-4 py-3">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                              </td>
                            ))}
                          </tr>
                        ))

                      ) : errorTable ? (

                        <tr>
                          <td colSpan="10" className="text-center text-red-500 py-4">
                            {errorTable}
                          </td>
                        </tr>

                      ) : (isTableView ? hostelBasedTrue : data)?.length > 0 ? (

                        (isTableView ? hostelBasedTrue : data).map((item, index) => {

                          const id = isTableView ? item.hostelId : item.customerId;

                          return (
                            <React.Fragment key={id}>

                              {/* 🔹 MAIN ROW */}
                              <tr>
                                <td className="px-4 py-2 sticky left-0 bg-white z-40 w-[80px] flex items-center gap-2 text-[12px]">

                                  {!isTableView && (
                                    <input
                                      type="checkbox"
                                      checked={selectedIds.includes(id)}
                                      disabled={item.recurringStatus}
                                      className={`cursor-pointer ${item.recurringStatus ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                      onChange={() => {
                                        if (item.recurringStatus) return;
                                        handleSelect(item);
                                      }}
                                    />
                                  )}

                                  {(page - 1) * size + index + 1}
                                </td>

                                <td className="px-4 py-2 sticky left-[80px] bg-white z-30 w-[260px] text-[12px]">
                                  <div className="flex items-center gap-2">

                                    {/* 🔽 dropdown trigger */}
                                    {isTableView && (
                                      <button className="cursor-pointer"
                                        onClick={(e) => {
                                          const rect = e.currentTarget.getBoundingClientRect();

                                          setDropdownPosition({
                                            top: rect.bottom + window.scrollY,
                                            left: rect.left
                                          });

                                          setSelectedHostel(item);

                                          setOpenCustomerDropdown(
                                            prev => prev === item.hostelId ? null : item.hostelId
                                          );
                                        }}
                                      >
                                        <img src={ArrowDrop} className="w-5 h-5" />
                                      </button>
                                    )}

                                    <div className="relative">

                                      <span className="font-semibold">
                                        {item.hostelName}
                                      </span>

                                      {/* DROPDOWN */}
                                      {openCustomerDropdown && (
                                        <div
                                          className="fixed w-64 bg-white border rounded-lg shadow-lg z-[99999]"
                                          style={{
                                            top: dropdownPosition.top,
                                            left: dropdownPosition.left
                                          }}
                                        >
                                          {/* LIST */}
                                          <div className="max-h-48 overflow-y-auto">
                                            {selectedHostel?.customerList?.map((cust) => (
                                              <div
                                                key={cust.customerId}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={selectedCustomers.some(c => c.customerId === cust.customerId)}
                                                  className="cursor-pointer"
                                                  onChange={() => {
                                                    setSelectedCustomers(prev =>
                                                      prev.some(c => c.customerId === cust.customerId)
                                                        ? prev.filter(c => c.customerId !== cust.customerId)
                                                        : [...prev, cust]
                                                    );

                                                  }}
                                                />
                                                <span>{cust.fullName}</span>
                                              </div>
                                            ))}
                                          </div>

                                          {/* FOOTER */}
                                          <div className="flex justify-between items-center p-2 border-t bg-white">
                                            <button
                                              onClick={() => setOpenCustomerDropdown(null)}
                                              className="text-gray-500 text-sm cursor-pointer"
                                            >
                                              Cancel
                                            </button>

                                            <button
                                              onClick={() => {
                                                setShowCustomerTable(true);
                                                setOpenCustomerDropdown(null);
                                              }}
                                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                                            >
                                              Done
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                    </div>

                                  </div>
                                </td>

                                <td className="text-left text-[12px]">{isTableView ? "--" : item.fullName}</td>

                                {/* <td className="text-[12px]">
                                  {isTableView
                                    ? "--"
                                    : item.recurringStatus ? "Generated" : "Blocked"}
                                </td> */}
                                                             <td className="text-[12px]">
  {item.isSubscriptionActive ? "Active" : "Blocked"}
</td>

                                <td className="text-left text-[12px]">
                                  {isTableView
                                    ? item.city
                                    : `${item.HostelCity}, ${item.HostelState}`}
                                </td>

                                <td className="text-left ml-3 text-[12px]">
                                  {isTableView
                                    ? item.billingType
                                    : `${item.billingStartDay} → ${item.billingEndDay}`}
                                </td>

                                <td className="text-[12px]">{item.billingModel || "--"}</td>

                                <td className="text-[12px]">{isTableView ? "--" : item.recurringMode || "--"}</td>

                                {/* <td className="text-[12px]">
                                  {isTableView
                                    ? (item.isSubscriptionActive ? "Active" : "Inactive")
                                    : (item.recurringStatus ? "Generated" : "Not Generated")}
                                </td> */}
                                {/* <td className="text-[12px]">
  {item.isSubscriptionActive ? "Active" : "Inactive"}
</td> */}

                                <td className="text-[12px]">
                                  {isTableView
                                    ? "--"
                                    : item.recurringStatus ? "Generated" : "Not Generated"}
                                </td>

                                <td>
                                  {!isTableView ? (
                                    !item.recurringStatus ? (
                                      <button
                                        onClick={() => handleOpenDetails(item)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
                                      >
                                        Generate
                                      </button>
                                    ) : (
                                      // <button
                                      //   onClick={() => handleOpenDetails(item)}
                                      //   className="px-3 py-1 border text-blue-600 rounded cursor-pointer"
                                      // >
                                      //   View
                                      // </button>
                                      <button
                                        onClick={() => handleOpenDetails(item)}
                                        className="px-3 py-1 rounded-lg text-xs border border-gray-300 text-blue-600 bg-white hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                                      >
                                        👁 View Details
                                      </button>
                                    )
                                  ) : "--"}
                                </td>

                              </tr>

                              {/* 🔽 EXPANDED CUSTOMER TABLE */}
                              {isTableView && expandedHostel === item.hostelId && (
                                <tr>
                                  <td colSpan="10" className="bg-gray-50 p-4">

                                    <table className="w-full border rounded text-sm">

                                      <thead className="bg-gray-100 text-xs">
                                        <tr>
                                          <th className="px-3 py-2">ID</th>
                                          <th className="px-3 py-2">Tenant</th>
                                          <th className="px-3 py-2">Status</th>
                                          <th className="px-3 py-2">Billing</th>
                                          <th className="px-3 py-2">Action</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {item.customerList?.map((cust, i) => (

                                          <tr key={cust.customerId} className="border-t">

                                            <td className="px-4 py-2 sticky left-0 bg-white z-40 w-[80px] flex items-center gap-2">
                                              <input
                                                type="checkbox"
                                                checked={selectedIds.includes(id)}
                                                onChange={() => handleSelect(item)}
                                              />
                                              {(page - 1) * size + index + 1}
                                            </td>

                                            <td>{cust.fullName}</td>

                                            <td>
                                              {cust.recurringStatus ? "Generated" : "Pending"}
                                            </td>

                                            <td>
                                              {cust.billingStartDay} → {cust.billingEndDay}
                                            </td>

                                            <td>
                                              {!cust.recurringStatus ? (
                                                <button
                                                  onClick={() => handleOpenDetails(cust)}
                                                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                                                >
                                                  Generate
                                                </button>
                                              ) : (
                                                <button

                                                  onClick={() => handleOpenDetails(cust)}
                                                  className="px-2 py-1 text-xs border text-blue-600 rounded"
                                                >
                                                  View
                                                </button>
                                              )}
                                            </td>

                                          </tr>

                                        ))}
                                      </tbody>

                                    </table>

                                  </td>
                                </tr>
                              )}

                            </React.Fragment>
                          );
                        })

                      ) : (

                        <tr>
                          <td colSpan="10" className="text-center py-6 text-gray-400">
                            No Data Found
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
            )}
            {showCustomerTable && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">

                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-sm">Selected Customers</h3>

                  <button
                    onClick={() => {
                      setShowCustomerTable(false);
                      setSelectedCustomers([]);
                    }}
                    className="text-sm border border-gray-200 px-3 py-1 rounded cursor-pointer"
                  >
                    Back
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">


                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Select</th>
                        <th className="p-2">Property</th>
                        <th className="p-2">Tenant Name</th>
                        <th className="p-2">Subscription Status</th>
                        <th className="p-2">Recurring Status</th>
                        <th className="p-2">Billing Schedule</th>

                        <th className="p-2">Billing</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((cust) => (
                          <tr key={cust.customerId} className="border-t border-gray-200">

                            <td className="p-2">
                              {/* <input
                  type="checkbox"
                  checked={selectedIds.includes(cust.customerId)}
                  onChange={() => {
                    setSelectedIds(prev =>
                      prev.includes(cust.customerId)
                        ? prev.filter(id => id !== cust.customerId)
                        : [...prev, cust.customerId]
                    );
                  }}
                /> */}
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(cust.customerId)}
                                disabled={cust.recurringStatus}   // ✅ disable condition
                                className={`cursor-pointer ${cust.recurringStatus ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                onChange={() => {
                                  if (cust.recurringStatus) return; // safety

                                  setSelectedIds(prev =>
                                    prev.includes(cust.customerId)
                                      ? prev.filter(id => id !== cust.customerId)
                                      : [...prev, cust.customerId]
                                  );
                                }}
                              />
                            </td>
                            <td>{cust.hostelName}</td>
                            <td>{cust.fullName}</td>
                            {/* <td>
                              {cust.recurringStatus ? "Generated" : "Pending"}
                            </td> */}
                            <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                              {cust.isSubscriptionActive ? (
                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                                  Active
                                </span>
                              ) : (
                                <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
                                  Blocked
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                              {cust.recurringStatus ? (
                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                                  Generated
                                </span>
                              ) : (
                                <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
                                  Not Generated
                                </span>
                              )}
                            </td>
                            <td>
                              {cust.billingStartDay} → {cust.billingEndDay}
                            </td>

                            {/* <td>
                              {cust.billingStartDay} → {cust.billingEndDay}
                            </td> */}
                            <td>
                              {cust.billingModel}
                            </td>

                            <td>
                              {!cust.recurringStatus ? (
                                <button
                                  onClick={() => handleOpenDetails(cust)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs cursor-pointer"
                                >
                                  Generate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleOpenDetails(cust)}
                                  className="px-2 py-1 border text-blue-600 rounded text-xs cursor-pointer"
                                >
                                  View
                                </button>
                              )}
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-400">
                            No Customers Selected
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>



              </div>
            )}
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
          </div>

          {viewType === "calendar" && (
            <CalendarView data={data} />
          )}
          {showDetailsModal && selectedItem && (
            <div className="fixed inset-0 z-[9999] flex justify-end">


              <div
                className="fixed inset-0 bg-black/10 backdrop-blur-[0px]"
                onClick={() => {
                  setShowDetailsModal(false);
                  setGenrateError("");
                }}
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
                          {selectedItem.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedItem.customerId}
                        </p>
                      </div>
                    </div>

                    <button className="cursor-pointer" onClick={() => {
                      setShowDetailsModal(false);
                      setGenrateError("");
                    }}>✕</button>
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
                            {selectedItem.HostelFullAddress}
                          </span>
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center gap-3">
                          <img src={call} className="w-4 h-4 opacity-60" />
                          <span className="text-gray-500 w-28 text-left">Mobile</span>
                          <span className="font-medium text-gray-800 text-left">
                            {selectedItem.HostelMobile}
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
                              {/* <th className="p-2 text-left">Inv</th> */}
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
                                    {item.cycleStartDay} → {item.cycleEndDay}
                                  </td>

                                  {/* <td className="p-2 text-start">
                                    {item.invoiceGeneratedCount}
                                  </td> */}

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
                  {generateError && (
                    <ErrorMessage message={generateError} type="error" />
                  )}
                  {!selectedItem?.recurringStatus && (
                    <div className="p-4 border-t border-gray-300 flex justify-end gap-2">

                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setGenrateError("");
                        }}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer"
                      >
                        Close
                      </button>

                      {/* Show only if BOTH are false */}

                      <button
                        // onClick={() => handleGenerate(selectedItem)}
                        onClick={() => handleGenerate([selectedItem.customerId])}
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
            // onClick={() => setShowBulkModal(false)}
            onClick={() => {
              setShowBulkModal(false);
              setGenrateError("");
            }}
          ></div>

          {/* RIGHT DRAWER */}
          <div className="relative z-[10000] flex items-center">
            <div className="w-[520px] h-[calc(100%-40px)] my-5 mr-5 bg-white rounded-xl shadow-xl border border-gray-300 flex flex-col animate-slideIn">

              {/* HEADER */}
              <div className="flex justify-between items-center p-5 border-b border-gray-300">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-left">
                  <img src={refresh} className="w-5 h-5" /> Bulk Generate Recurring
                </h2>
                <button onClick={() => {
                  setShowBulkModal(false);
                  setGenrateError("");
                }}>✕</button>
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
              {generateError && (
                <ErrorMessage message={generateError} type="error" />
              )}
              {/* FOOTER */}
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowBulkModal(false);
                    setGenrateError("");
                  }}
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
                    const res = await generateTenantRecurring(selectedIds);

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
                      setData(prev =>
                        prev.map(item =>
                          ids.includes(selectedIds)
                            ? { ...item, recurringStatus: true }
                            : item
                        )
                      );


                      setSelectedCustomers(prev =>
                        prev.map(item =>
                          ids.includes(item.customerId)
                            ? { ...item, recurringStatus: true }
                            : item
                        )
                      );
                      fetchRecurring();
                    } else {
                      setModalType("error");
                      setMessage(res?.message || "Failed");
                      setGenrateError(res?.message)
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