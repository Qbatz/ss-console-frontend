import React, { useMemo, useState,useEffect,useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import {
  ChevronDown,
  Search,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { useKyc } from "../../Context/KYCContext";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const PropertiesUsingKYC = () => {
     const {loading, getHostelKYCList,getHostelKYCDetails } = useKyc();
     const { RangePicker } = DatePicker;
  const [status, setStatus] = useState("Status");
  const [period, setPeriod] = useState("THIS_MONTH");
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  console.log(selectedProperty,"selectedProperty")
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [totalItems, setTotalItems] = useState(0);
const [totalPages, setTotalPages] = useState(1);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 const [properties, setProperties] = useState([]);
 const [debouncedSearch, setDebouncedSearch] = useState("");
const lastRequestRef = useRef("");
const [dateRange, setDateRange] = useState([]);
const [dateFilters, setDateFilters] = useState([]);

const [tenantList, setTenantList] = useState([]);
const [tenantLoading, setTenantLoading] = useState(false);
const [tenantSearch, setTenantSearch] = useState("");
const [tenantPage, setTenantPage] = useState(1);
const [tenantPageSize, setTenantPageSize] = useState(10);
const [tenantTotalPages, setTenantTotalPages] = useState(1);
const [tenantTotalItems, setTenantTotalItems] = useState(0);
const [tenantDateFilter, setTenantDateFilter] = useState("THIS_MONTH");
const [tenantDateRange, setTenantDateRange] = useState([]);
const [tenantKycStatus, setTenantKycStatus] = useState("");
const [tenantDateFilters, setTenantDateFilters] = useState([]);
const [tenantKycStatuses, setTenantKycStatuses] = useState([]);

const loadHostels = async () => {
  try {

    let isEnabled;

    if (status === "Enabled") {
      isEnabled = true;
    } else if (status === "Disabled") {
      isEnabled = false;
    }

    // Dropdown value itself is API key
    const dateFilter = period;

    let startDate;
    let endDate;

    if (
      period === "CUSTOM" &&
      dateRange?.length === 2
    ) {
      startDate = dateRange[0]?.format("DD-MM-YYYY");
      endDate = dateRange[1]?.format("DD-MM-YYYY");
    }

    const requestKey = JSON.stringify({
      page: currentPage,
      size: pageSize,
      search: debouncedSearch,
      isEnabled,
      dateFilter,
      startDate,
      endDate,
    });

    if (lastRequestRef.current === requestKey) {
      console.log("Duplicate API call prevented");
      return;
    }

    lastRequestRef.current = requestKey;

    console.log("HOSTEL KYC API CALL:", {
      page: currentPage,
      size: pageSize,
      search: debouncedSearch,
      isEnabled,
      dateFilter,
      startDate,
      endDate,
    });

    const result = await getHostelKYCList(
      currentPage,
      pageSize,
      debouncedSearch,
      isEnabled,
      dateFilter,
      startDate,
      endDate
    );

    if (!result?.success) {
      setProperties([]);
      setTotalItems(0);
      setTotalPages(1);
      return;
    }

    const data = result?.data;

    // API response date filters
    setDateFilters(data?.dateFilters || []);

    const hostelList = data?.hostelList || [];

    const formattedProperties = hostelList.map(
      (item) => ({
        id: item?.hostelId || "",
        name: item?.hostelName || "",
        phone: item?.mobile || "",
        avatar: item?.initials || "",
        mainImage: item?.mainImage || null,
        tenants: item?.totalTenants ?? 0,
        verified: item?.totalVerifiedTenants ?? 0,

        kycStatus: item?.kycEnableStatus
          ? "Enabled"
          : "Disabled",

        updated:
          item?.lastUpdatedDate &&
          item?.lastUpdatedTime
            ? `${item.lastUpdatedDate}, ${item.lastUpdatedTime}`
            : "-",

        ...item,
      })
    );

    setProperties(formattedProperties);

    setTotalItems(data?.totalItems ?? 0);
    setTotalPages(data?.totalPages ?? 1);

  } catch (error) {

    console.error(
      "Load Hostel KYC Error:",
      error
    );

    setProperties([]);
    setTotalItems(0);
    setTotalPages(1);

  }
};





useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);




useEffect(() => {
  loadHostels();
}, [
  currentPage,
  pageSize,
  debouncedSearch,
  status,
  period,dateRange
]);
const loadTenantKYC = async (
  hostelId,
  page = 1,
  size = tenantPageSize,
  searchValue = "",
  kycStatus = tenantKycStatus,
  dateFilter = tenantDateFilter,
  dateRangeValue = tenantDateRange
) => {
  try {
    if (!hostelId) {
      console.error("Missing hostelId");
      return;
    }

    setTenantLoading(true);

    let startDate;
    let endDate;

    // CUSTOM date
    if (
      dateFilter === "CUSTOM" &&
      dateRangeValue?.length === 2
    ) {
      startDate = dateRangeValue[0]?.format(
        "DD-MM-YYYY"
      );

      endDate = dateRangeValue[1]?.format(
        "DD-MM-YYYY"
      );
    }

    console.log("TENANT API PARAMS:", {
      hostelId,
      page: page - 1,
      size,
      searchValue,
      kycStatus,
      dateFilter,
      startDate,
      endDate,
    });

    const result = await getHostelKYCDetails(
      hostelId,
      page - 1,
      size,
      searchValue,
      kycStatus,
      dateFilter,
      startDate,
      endDate
    );

    console.log("TENANT KYC RESULT:", result);

    if (!result?.success) {
      setTenantList([]);
      setTenantTotalItems(0);
      setTenantTotalPages(1);
      return;
    }

    const data = result?.data;

    setTenantDateFilters(
      data?.dateFilters || []
    );

    setTenantKycStatuses(
      data?.kycStatus || []
    );

    const tenants =
      data?.hostel?.tenants || [];

    const formattedTenants = tenants.map(
      (tenant) => ({
        tenantId:
          tenant?.customerId || "",

        tenantName:
          tenant?.fullName || "-",

        joinDate:
          tenant?.joiningDate || "-",

        billingCycle:
          tenant?.billingCycleStart &&
          tenant?.billingCycleEnd
            ? `${tenant.billingCycleStart} - ${tenant.billingCycleEnd}`
            : "-",

        submittedOn:
          tenant?.latestRequestDate &&
          tenant?.latestRequestTime
            ? `${tenant.latestRequestDate}, ${tenant.latestRequestTime}`
            : "-",

        kycStatus:
          tenant?.kycDetailsStatus ||
          "NOT_AVAILABLE",

        canSendReminder:
          tenant?.canSendReminder ?? false,

        canApproveKyc:
          tenant?.canApproveKyc ?? false,

        ...tenant,
      })
    );

    setTenantList(formattedTenants);

    setTenantTotalItems(
      data?.totalItems ?? 0
    );

    setTenantTotalPages(
      data?.totalPages ?? 1
    );

  } catch (error) {
    console.error(
      "Load Tenant KYC Error:",
      error
    );

    setTenantList([]);
    setTenantTotalItems(0);
    setTenantTotalPages(1);

  } finally {
    setTenantLoading(false);
  }
};
const handleView = async (property) => {
  console.log("VIEW CLICKED:", property);
  console.log("HOSTEL ID:", property?.hostelId);
  console.log("HOSTEL ID FROM ID:", property?.id);
  console.log(
    "getHostelKYCDetails:",
    getHostelKYCDetails
  );

  setSelectedProperty(property);
  setIsDrawerOpen(true);

  setTenantPage(1);
  setTenantSearch("");
  setTenantList([]);

  await loadTenantKYC(
    property?.hostelId || property?.id,
    1,
    tenantPageSize,
    ""
  );
};


const closeDrawer = () => {
  setIsDrawerOpen(false);
  setSelectedProperty(null);
};

//   const properties = [
//     {
//       id: "SM7626",
//       name: "Laksha Ladies Hostel",
//       phone: "+91 98654 87475",
//       avatar: "LH",
//       tenants: 80,
//       verified: 79,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM3574",
//       name: "Sunrise PG",
//       phone: "+91 98654 87475",
//       avatar: "SP",
//       tenants: 87,
//       verified: 50,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM7004",
//       name: "Moksha Ladies Hostel",
//       phone: "+91 98654 87475",
//       avatar: "MH",
//       tenants: 78,
//       verified: 64,
//       kycStatus: "Disabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM5764",
//       name: "SRK Coliving",
//       phone: "+91 98654 87475",
//       avatar: "SC",
//       tenants: 80,
//       verified: 74,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM7643",
//       name: "roomsearch.in",
//       phone: "+91 98654 87475",
//       avatar: "RS",
//       tenants: 91,
//       verified: 91,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM7564",
//       name: "LakeView Hostel",
//       phone: "+91 98654 87475",
//       avatar: "LH",
//       tenants: 80,
//       verified: 66,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM7665",
//       name: "BlueMoon Inn",
//       phone: "+91 98654 87475",
//       avatar: "BI",
//       tenants: 78,
//       verified: 49,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM7994",
//       name: "Sunrise PG",
//       phone: "+91 98654 87475",
//       avatar: "SP",
//       tenants: 80,
//       verified: 80,
//       kycStatus: "Disabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM7699",
//       name: "SRK Gent’s Hostel",
//       phone: "+91 98654 87475",
//       avatar: "SH",
//       tenants: 80,
//       verified: 62,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//     {
//       id: "SM7888",
//       name: "Ganesh Men's Hostel",
//       phone: "+91 98654 87475",
//       avatar: "GH",
//       tenants: 102,
//       verified: 100,
//       kycStatus: "Enabled",
//       updated: "14 May 2026, 10:46 AM",
//     },
//   ];

  const filteredProperties = properties;

  return (
    <DashboardLayout>
      <div className="w-full bg-white min-h-screen">

        {/* ================= TITLE ================= */}
        <div className="h-[40px] px-[15px] flex items-center border-b border-[#E5E7EB]">
          <h1 className="text-[14px] font-medium text-[#202124]">
            Properties Using KYC
          </h1>

          <ChevronDown
            size={13}
            strokeWidth={1.8}
            className="ml-[7px] text-[#2952F3]"
          />
        </div>

        
        <div className="px-[14px] pt-[14px]">

         
          <div className="h-[29px] flex items-center mb-[8px]">

            
            <div className="relative">
             <select
  value={status}
  onChange={(e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  }}
  className="
    appearance-none
    w-[110px]
    h-[28px]
    rounded-[4px]
    border
    border-[#8FA8FF]
    bg-[#F8FAFF]
    pl-[10px]
    pr-[20px]
    text-[11px]
    text-[#2952F3]
    outline-none
    cursor-pointer
  "
>
  <option value="Status">Status</option>
  <option value="Enabled">Enabled</option>
  <option value="Disabled">Disabled</option>
</select>

              <ChevronDown
                size={10}
                className="
                  absolute
                  right-[7px]
                  top-[9px]
                  text-[#2952F3]
                  pointer-events-none
                "
              />
            </div>

           
         <div className="relative ml-[7px]">
  <select
    value={period}
    onChange={(e) => {
      const value = e.target.value;

      setPeriod(value);
      setCurrentPage(1);

     
      if (value !== "CUSTOM") {
        setDateRange([]);
      }
    }}
    className="
      appearance-none
      w-[110px]
      h-[28px]
      rounded-[4px]
      border
      border-[#E1E4EA]
      bg-white
      pl-[10px]
      pr-[20px]
      text-[11px]
      text-[#222]
      outline-none
      cursor-pointer
    "
  >
    {dateFilters.map((filter) => (
      <option
        key={filter.key}
        value={filter.key}
      >
        {filter.value}
      </option>
    ))}
  </select>

  <ChevronDown
    size={10}
    className="
      absolute
      right-[7px]
      top-[9px]
      text-[#2952F3]
      pointer-events-none
    "
  />
</div>
{period === "CUSTOM" && (
  <div className="flex flex-col ml-[7px]">
    <RangePicker
      value={dateRange}
      onChange={(dates) => {
        // Date clear pannina
        if (!dates || dates.length === 0) {
          setDateRange([]);
          setPeriod("THIS_MONTH");
          setCurrentPage(1);
          return;
        }

        
        setDateRange(dates);
        setCurrentPage(1);
      }}
      format="DD-MM-YYYY"
      className="h-[28px] rounded-[4px]"
    />
  </div>
)}
         
            <div className="ml-auto flex items-center">

            
              <button
                type="button"
                className="
                  w-[28px]
                  h-[28px]
                  rounded-[4px]
                  bg-[#5A7BF0]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  hover:bg-[#496CE0]
                "
               onClick={loadHostels}
              >
                <RefreshCw
                  size={13}
                  strokeWidth={1.7}
                  className="text-white"
                />
              </button>

            
              <div
                className="
                  ml-[5px]
                  w-[157px]
                  h-[28px]
                  border
                  border-[#E1E4EA]
                  rounded-[4px]
                  flex
                  items-center
                  px-[11px]
                "
              >
                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search Hostel..."
                  className="
                    flex-1
                    min-w-0
                    text-[11px]
                    text-[#333]
                    placeholder:text-[#B5B5B5]
                    outline-none
                    bg-transparent
                  "
                />

                <Search
                  size={14}
                  strokeWidth={1.7}
                  className="text-[#222]"
                />
              </div>
            </div>
          </div>

        
  <div
  className="
    border
    border-[#E1E4EA]
    rounded-[7px]
    bg-white
    overflow-hidden
    w-full
  "
>
  <table className="w-full border-collapse table-fixed">

    <thead
      className="
        block
        w-full
        bg-[#F8F9FC]
      "
    >
      <tr
        className="
          flex
          w-full
          h-[38px]
          items-center
          border-b
          border-[#E1E4EA]
         
        "
      >

      <th className="w-[6%] px-[10px] text-left flex-shrink-0">
  <span className="text-[11px] font-medium text-[#555]">
    ID
  </span>
</th>

       <th className="w-[20%] px-[10px] text-left flex-shrink-0">
  <span className="text-[11px] font-medium text-[#555]">
    HOSTEL NAME
  </span>
</th>

        <th className="w-[14%] px-[8px] text-left flex-shrink-0">
  <span className="text-[11px] font-medium text-[#555]">
    TOTAL TENANTS
  </span>
</th>

        <th className="w-[11%] px-[8px] text-left flex-shrink-0">
  <span className="text-[11px] font-medium text-[#555]">
    VERIFIED
  </span>
</th>

        <th className="w-[14%] px-[8px] text-left flex-shrink-0">
  <span className="text-[11px] font-medium text-[#555]">
    KYC STATUS
  </span>
</th>

       <th className="w-[21%] px-[8px] text-left flex-shrink-0">
  <div className="flex items-center gap-[5px] whitespace-nowrap">
    <span className="text-[11px] font-medium text-[#555]">
      LAST UPDATED
    </span>

    <ArrowUpDown
      size={8}
      strokeWidth={1.5}
      className="text-[#777]"
    />
  </div>
</th>

        <th className="w-[14%] px-[8px] text-center flex-shrink-0">
          <span className="text-[11px] font-medium text-[#555]">
            ACTIONS
          </span>
        </th>

      </tr>
    </thead>


  <tbody
  className="
    block
    max-h-[420px]
    overflow-y-auto
    w-full
  "
>
  {loading ? (
    <tr className="flex w-full h-[420px] items-center justify-center">
      <td className="w-full">
        <div className="flex flex-col items-center justify-center gap-[8px]">
          
          <div
            className="
              w-[24px]
              h-[24px]
              border-[2px]
              border-[#E5E7EB]
              border-t-[#2952F3]
              rounded-full
              animate-spin
            "
          />

          <span className="text-[9px] text-[#777]">
            Loading...
          </span>

        </div>
      </td>
    </tr>
  ) : (
    filteredProperties.map((item, index) => (
      <tr
          key={item.id}
          className="
            flex
            w-full
            h-[58px]
            items-center
            border-b
            border-[#E8E8E8]
          "
        >

          {/* ID */}
         <td className="w-[68px] px-[10px]">
      <span className="text-[11px] text-[#222]">
        {(currentPage - 1) * pageSize + index + 1}
      </span>
    </td>


        
          <td className="w-[20%] px-[10px] flex-shrink-0 text-left ">
            <div className="flex items-center gap-[7px]">

              <div
  className="
    w-[24px]
    h-[24px]
    rounded-full
    bg-[#E9EDF3]
    flex
    items-center
    justify-center
    flex-shrink-0
    overflow-hidden
  "
>
  {item.mainImage ? (
    <img
      src={item.mainImage}
      alt={item.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-[7px] font-medium text-[#667085]">
      {item.avatar}
    </span>
  )}
</div>

              <div className="min-w-0">

                <div
                  className="
                    text-[11px]
                    font-semibold
                    text-[#222]
                    leading-[12px]
                    truncate
                    text-left
                  "
                >
                  {item.name}
                </div>

                <div
                  className="
                    text-[10px]
                    text-[#777]
                    pt-1
                    leading-[10px]
                    text-left
                  "
                >
                  {item.phone}
                </div>

              </div>

            </div>
          </td>


         
          <td className="w-[14%] px-[8px] text-center flex-shrink-0 text-left">
            <span className="text-[11px] text-[#333]">
              {item.tenants}
            </span>
          </td>


          {/* VERIFIED */}
          <td className="w-[11%] px-[8px] text-center flex-shrink-0 text-left">
            <span className="text-[11px] text-[#333]">
              {item.verified}
            </span>
          </td>


          {/* KYC STATUS */}
          <td className="w-[14%] px-[8px] flex-shrink-0 text-left">
            <span
              className={`
                text-[11px]
                font-medium
                ${
                  item.kycStatus === "Enabled"
                    ? "text-[#17B65B]"
                    : "text-[#FF7900]"
                }
              `}
            >
              {item.kycStatus}
            </span>
          </td>


          {/* LAST UPDATED */}
          <td className="w-[21%] px-[8px] flex-shrink-0 text-left">
            <span className="text-[11px] text-[#333]">
              {item.updated}
            </span>
          </td>


          {/* ACTIONS */}
          <td className="w-[14%] px-[8px] text-center flex-shrink-0">

            <button
              type="button"
              onClick={() => handleView(item)}
              className="
                w-[100px]
                h-[32px]
                rounded-[5px]
                bg-[#2952F3]
                hover:bg-[#2146DD]
                text-white
                text-[11px]
                font-medium
                cursor-pointer
              "
            >
              View
            </button>

          </td>

        </tr>
    ))
  )}
</tbody>

  </table>
 <div
  className="
    flex
    items-center
    justify-between
    px-5
    py-4
    border-t
    border-gray-100
    bg-white
  "
>
 
  <div className="text-[12px] text-gray-700">
    Total Record Count :
    <span className="text-[#2952F3] ml-1 font-medium">
      {filteredProperties?.length}
    </span>
  </div>

 
  <div className="flex items-center gap-5">

    {/* Page Size */}
    <select
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="
        w-[92px]
        h-10
        border
        border-gray-300
        rounded-lg
        px-3
        text-[12px]
        outline-none
        cursor-pointer
      "
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>

 
    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      className="
        text-[20px]
        disabled:opacity-40
        cursor-pointer
      "
    >
      ‹
    </button>

  
    <div
      className="
        w-10
        h-10
        rounded-full
        bg-[#F5F7FB]
        flex
        items-center
        justify-center
        text-[12px]
      "
    >
      {currentPage}
    </div>

    {/* Page Info */}
    <span className="text-[12px]">
      {currentPage} - {totalPages}
    </span>

    {/* Next */}
    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(
            prev + 1,
            totalPages
          )
        )
      }
      className="
        text-[20px]
        disabled:opacity-40
        cursor-pointer
      "
    >
      ›
    </button>

  </div>
</div>
</div>
        </div>
      </div>
      {isDrawerOpen && selectedProperty && (
  <>

    <div
      className="
        fixed
        inset-0
        bg-black/30
        z-[999]
      "
      onClick={closeDrawer}
    />

    
    <div
  className="
    fixed
    top-[15px]
    right-[15px]
    bottom-[15px]
    w-[420px]
    bg-white
    z-[1000]
    rounded-[8px]
    shadow-[-8px_0_25px_rgba(0,0,0,0.12)]
    overflow-y-auto
  "
>

      <div className="px-[18px] pt-[16px] pb-[12px]">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-[10px]">

         
            <div
              className="
                w-[34px]
                h-[34px]
                rounded-[8px]
                bg-[#5A7BF0]
                flex
                items-center
                justify-center
                text-white
                text-[10px]
                font-medium
              "
            >
              {selectedProperty.avatar}
            </div>

            <div>
              <div className="text-[12px] font-semibold text-[#222]">
                {selectedProperty.name}
              </div>

              <div className="text-[9px] text-[#777]">
                {selectedProperty.id}
              </div>
            </div>

          </div>

          
          <button
            type="button"
            onClick={closeDrawer}
            className="
              text-[#777]
              text-[16px]
              cursor-pointer
              hover:text-[#222]
            "
          >
            ×
          </button>

        </div>
      </div>

     

      <div className="px-[18px] grid grid-cols-3 gap-[7px]">

        <StatCard
          title="Total Tenants"
          value={selectedProperty.totalTenants}
          subtitle="Invoices to create"
        />

        <StatCard
          title="Total Requested"
          value={selectedProperty.totalRequests}
          subtitle="Selected"
        />

        <StatCard
          title="total Verified"
         value={selectedProperty.totalVerifiedTenants}
          subtitle="Selected"
        />

        <StatCard
          title="Total Completed"
           value={selectedProperty.totalCompleted}
          subtitle="Selected"
        />

        {/* <StatCard
          title="KYC Not Submitted"
          value="0"
          subtitle=""
        /> */}

      </div>

     

      <div className="px-[18px] mt-[10px]">

    
  <div
    className="
      border
      border-[#E5E7EB]
      rounded-[7px]
      p-[10px]
    "
  >
    <div className="text-[10px] font-medium text-[#222] mb-[7px] text-left">
      KYC Enable / Disable
    </div>

    <div
      className="
        h-[32px]
        bg-[#F5F7FC]
        rounded-[5px]
        px-[9px]
        flex
        items-center
        justify-between
      "
    >
      <span className="text-[9px] text-[#222]">
        {selectedProperty?.kycEnableStatus
          ? "Enabled"
          : "Disabled"}
      </span>

      <div className="flex items-center gap-[5px]">
        <span className="text-[8px] text-[#777]">
          {selectedProperty?.kycEnableStatus
            ? "On"
            : "Off"}
        </span>

        <div
          className={`
            w-[22px]
            h-[13px]
            rounded-full
            relative
            ${
              selectedProperty?.kycEnableStatus
                ? "bg-[#159947]"
                : "bg-[#B8B8B8]"
            }
          `}
        >
          <div
            className={`
              absolute
              top-[2px]
              w-[9px]
              h-[9px]
              rounded-full
              bg-white
              ${
                selectedProperty?.kycEnableStatus
                  ? "right-[2px]"
                  : "left-[2px]"
              }
            `}
          />
        </div>
      </div>
    </div>
  </div>


      </div>

    

      <div className="px-[18px] mt-[10px] pb-[20px]">

        <div
          className="
            border
            border-[#E5E7EB]
            rounded-[7px]
            p-[10px]
          "
        >

          {/* List Header */}
          <div className="flex items-center justify-between mb-[9px]">

            <span className="text-[10px] font-medium text-[#222]">
              Tenant KYC List
            </span>

            <div
  className="
    w-[112px]
    h-[22px]
    border
    border-[#E5E7EB]
    rounded-[4px]
    flex
    items-center
    px-[6px]
  "
>
  <Search
    size={9}
    className="text-[#999]"
  />

  <input
    type="text"
    value={tenantSearch}
    onChange={(e) => {
      const value = e.target.value;

      setTenantSearch(value);
      setTenantPage(1);

      loadTenantKYC(
        selectedProperty?.hostelId ||
          selectedProperty?.id,
        1,
        tenantPageSize,
        value,
        tenantKycStatus,
        tenantDateFilter
      );
    }}
    placeholder="Search tenants..."
    className="
      ml-[4px]
      w-full
      text-[7px]
      outline-none
      text-[#333]
      placeholder:text-[#AAA]
    "
  />
</div>

          </div>

          {/* Filter */}
    {/* FILTER */}
<div className="flex items-center gap-[5px] mb-[8px]">

  <span className="text-[7px] text-[#888]">
    Filter by:
  </span>

  {/* DATE FILTER */}
  <div className="relative">

    <select
      value={tenantDateFilter}
      onChange={(e) => {
        const value = e.target.value;

        setTenantDateFilter(value);
        setTenantPage(1);

        // Custom இல்லாத filter என்றால் date clear
        if (value !== "CUSTOM") {
          setTenantDateRange([]);
        }

        loadTenantKYC(
          selectedProperty?.hostelId ||
            selectedProperty?.id,
          1,
          tenantPageSize,
          tenantSearch,
          tenantKycStatus,
          value,
          value === "CUSTOM"
            ? tenantDateRange
            : []
        );
      }}
      className="
        appearance-none
        h-[18px]
        min-w-[75px]
        px-[8px]
        pr-[17px]
        rounded-[4px]
        bg-[#2952F3]
        text-white
        text-[7px]
        outline-none
        cursor-pointer
      "
    >

      {tenantDateFilters.map((filter) => (
        <option
          key={filter.key}
          value={filter.key}
          className="text-[#333] bg-white"
        >
          {filter.value}
        </option>
      ))}

    </select>

    <ChevronDown
      size={8}
      className="
        absolute
        right-[5px]
        top-[5px]
        text-white
        pointer-events-none
      "
    />

  </div>


  {/* CUSTOM DATE RANGE */}
  {tenantDateFilter === "CUSTOM" && (
    <div className="relative">

      <RangePicker
        value={tenantDateRange}
        onChange={(dates) => {

          // Date clear
          if (!dates || dates.length === 0) {
            setTenantDateRange([]);
            setTenantDateFilter("THIS_MONTH");
            setTenantPage(1);

            loadTenantKYC(
              selectedProperty?.hostelId ||
                selectedProperty?.id,
              1,
              tenantPageSize,
              tenantSearch,
              tenantKycStatus,
              "THIS_MONTH",
              []
            );

            return;
          }

          // Date selected
          setTenantDateRange(dates);
          setTenantPage(1);

          loadTenantKYC(
            selectedProperty?.hostelId ||
              selectedProperty?.id,
            1,
            tenantPageSize,
            tenantSearch,
            tenantKycStatus,
            "CUSTOM",
            dates
          );
        }}
        format="DD-MM-YYYY"
        className="
          h-[18px]
          w-[145px]
          text-[7px]
          rounded-[4px]
        "
        size="small"
      />

    </div>
  )}


  {/* KYC STATUS */}
  <div className="relative">

    <select
      value={tenantKycStatus}
      onChange={(e) => {
        const value = e.target.value;

        setTenantKycStatus(value);
        setTenantPage(1);

        loadTenantKYC(
          selectedProperty?.hostelId ||
            selectedProperty?.id,
          1,
          tenantPageSize,
          tenantSearch,
          value,
          tenantDateFilter,
          tenantDateRange
        );
      }}
      className="
        appearance-none
        h-[18px]
        min-w-[55px]
        px-[8px]
        pr-[17px]
        rounded-[4px]
        border
        border-[#E1E4EA]
        bg-white
        text-[#333]
        text-[7px]
        outline-none
        cursor-pointer
      "
    >

      <option value="">
        Status
      </option>

      {tenantKycStatuses.map((status) => (
        <option
          key={status.key}
          value={status.key}
        >
          {status.label}
        </option>
      ))}

    </select>

    <ChevronDown
      size={8}
      className="
        absolute
        right-[5px]
        top-[5px]
        text-[#777]
        pointer-events-none
      "
    />

  </div>

</div>

        <TenantKycTable
  tenants={tenantList}
  loading={tenantLoading}
  currentPage={tenantPage}
  pageSize={tenantPageSize}
  totalPages={tenantTotalPages}
  totalItems={tenantTotalItems}
  search={tenantSearch}
  setSearch={setTenantSearch}
  onPageChange={(page) => {
    setTenantPage(page);

    loadTenantKYC(
      selectedProperty?.hostelId ||
        selectedProperty?.id,
      page,
      tenantPageSize,
      tenantSearch
    );
  }}
/>
        </div>

      </div>
    </div>
  </>
)}
    </DashboardLayout>
  );
};


const StatCard = ({
  title,
  value,
  subtitle,
}) => {
  return (
    <div
      className="
        h-[55px]
        bg-[#F5F7FC]
        border
        border-[#E2E6EF]
        rounded-[6px]
        px-[8px]
        py-[7px]
      "
    >
      <div className="text-[7px] text-[#667085]">
        {title}
      </div>

      <div className="text-[12px] font-semibold text-[#222] mt-[2px]">
        {value}
      </div>

      {subtitle && (
        <div className="text-[6px] text-[#999]">
          {subtitle}
        </div>
      )}
    </div>
  );
};

const Header = ({ title }) => {
  return (
    <div className="flex items-center gap-[5px] whitespace-nowrap">
      <span className="text-[8px] font-medium text-[#555]">
        {title}
      </span>

      <ArrowUpDown
        size={8}
        strokeWidth={1.5}
        className="text-[#777]"
      />
    </div>
  );
};
const TenantKycTable = ({
  tenants = [],
  loading = false,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  totalItems = 0,
  search = "",
  setSearch,
  onPageChange,
}) => {

  return (
    <div className="w-full overflow-x-auto">

      {/* Header */}
      <div
        className="
          grid
          grid-cols-[1.1fr_.65fr_1.2fr_1fr_.75fr_.7fr]
          border-b
          border-[#E5E7EB]
          pb-[5px]
        "
      >
        <TableHeader text="Tenant Name" />
        <TableHeader text="Join Date" />
        <TableHeader text="Billing Cycle" />
        <TableHeader text="Submitted on" />
        <TableHeader text="KYC Status" />
        <TableHeader text="Action" />
      </div>

      {/* Rows */}
     {tenants.map((tenant, index) => (
  <div
    key={tenant.tenantId || index}
    className="
      grid
      grid-cols-[1.1fr_.65fr_1.2fr_1fr_.75fr_.7fr]
      min-h-[25px]
      items-center
      border-b
      border-[#F0F0F0]
    "
  >
    <TableText
      text={tenant.tenantName || "-"}
    />

    <TableText
      text={tenant.joinDate || "-"}
    />

    <TableText
      text={tenant.billingCycle || "-"}
    />

    <TableText
      text={tenant.submittedOn || "-"}
    />

    <div>
      <span
        className={`
          inline-flex
          px-[5px]
          py-[2px]
          rounded-[3px]
          text-[6px]
          ${
            tenant.kycStatus === "Approved"
              ? "bg-[#E8F8EE] text-[#18A957]"
              : tenant.kycStatus === "Pending"
              ? "bg-[#FFF2DA] text-[#F59E0B]"
              : "bg-[#FFE8E8] text-[#F04444]"
          }
        `}
      >
        {tenant.kycStatus || "-"}
      </span>
    </div>

    <div>
      <button
        type="button"
        className="
          h-[17px]
          min-w-[42px]
          px-[5px]
          rounded-[4px]
          bg-[#2952F3]
          text-white
          text-[6px]
        "
      >
        {tenant.kycStatus === "Pending"
          ? "Approve KYC"
          : tenant.kycStatus === "Expired"
          ? "Remind"
          : "View"}
      </button>
    </div>
  </div>
))}

    </div>
  );
};

const TableHeader = ({ text }) => {
  return (
    <div className="text-[6px] text-[#777] px-[2px]">
      {text}
    </div>
  );
};

const TableText = ({ text }) => {
  return (
    <div
      className="
        text-[6px]
        text-[#333]
        px-[2px]
        truncate
      "
    >
      {text}
    </div>
  );
};

export default PropertiesUsingKYC;