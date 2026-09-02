import React, { useMemo, useState, useEffect, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { ChevronDown, Search, RefreshCw, ArrowUpDown, } from "lucide-react";
import { useKyc } from "../../Context/KYCContext";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const PropertiesUsingKYC = () => {
  const { loading, getHostelKYCList, getHostelKYCDetails, approveKYC,sendKYCReminder } = useKyc();
  const { RangePicker } = DatePicker;
  const [status, setStatus] = useState("Status");
  const [period, setPeriod] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
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
  const [tenantDateFilter, setTenantDateFilter] = useState("ALL");
  const [tenantDateRange, setTenantDateRange] = useState([]);
  const [tenantKycStatus, setTenantKycStatus] = useState("");
  const [tenantDateFilters, setTenantDateFilters] = useState([]);
  const [tenantKycStatuses, setTenantKycStatuses] = useState([]);
  const [isTenantDateOpen, setIsTenantDateOpen] = useState(false);
  const [isTenantStatusOpen, setIsTenantStatusOpen] = useState(false);
  const [reminderTenant, setReminderTenant] = useState(null);
  console.log("reminderTenant",reminderTenant)
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedApproveTenant, setSelectedApproveTenant] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showKycConfirm, setShowKycConfirm] = useState(false);
  const [kycEnableStatus, setKycEnableStatus] = useState(false);
  const approveLock = useRef(false);
  const handleReminder = (tenant) => {
    setReminderTenant(tenant);
  };
  const handleApproveKYC = async (tenant) => {
    if (
      approveLock.current ||
      approveLoading
    ) {
      return;
    }

    approveLock.current = true;

    try {
      setApproveLoading(true);

      const res = await approveKYC(tenant?.tenantId);

      if (res?.success) {
        setShowApproveModal(false);


        await loadTenantKYC(
          selectedProperty?.hostelId ||
          selectedProperty?.id,
          tenantPage,
          tenantPageSize,
          tenantSearch,
          tenantKycStatus,
          tenantDateFilter,
          tenantDateRange
        );
 setModalType("success");
      setMessage(res?.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
       
      } else {
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
      }
    } finally {
      setApproveLoading(false);
      approveLock.current = false;
    }
  };
  const sendTenantKYCReminder = async () => {
  if (!reminderTenant?.tenantId) {
    console.error("Customer ID missing");
    return;
  }

  try {
    setTenantLoading(true);

    const res = await sendKYCReminder(
      reminderTenant.tenantId
    );

    if (res?.success) {
      setReminderTenant(null);

      setModalType("success");
      setMessage(
        res?.data || "Reminder sent successfully"
      );
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

     
      await loadTenantKYC(
        selectedProperty?.hostelId ||
          selectedProperty?.id,
        tenantPage,
        tenantPageSize,
        tenantSearch,
        tenantKycStatus,
        tenantDateFilter,
        tenantDateRange
      );
    } else {
      setModalType("error");
      setMessage(
        res?.message || "Failed to send reminder"
      );
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }
  } catch (error) {
    console.error(
      "Send Tenant KYC Reminder Error:",
      error
    );
  } finally {
    setTenantLoading(false);
  }
};
  const loadHostels = async () => {
    try {

      let isEnabled;

      if (status === "Enabled") {
        isEnabled = true;
      } else if (status === "Disabled") {
        isEnabled = false;
      }

     
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


const handleKycEnableDisable = async () => {
  try {
    const hostelId =
      selectedProperty?.hostelId ||
      selectedProperty?.id;

    if (!hostelId) {
      console.error("Missing hostelId");
      return;
    }

    setLoading(true);

    
    const newStatus = !kycEnableStatus;

    const result = await updateHostelKYCStatus(
      hostelId,
      newStatus
    );

    if (!result?.success) {
      console.error(
        "KYC Enable/Disable failed:",
        result?.message
      );
      return;
    }

    // Update UI only after API success
    setKycEnableStatus(newStatus);

    // Close confirmation modal
    setShowKycConfirm(false);

  } catch (error) {
    console.error(
      "KYC Enable/Disable Error:",
      error
    );
  } finally {
    setLoading(false);
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
    period, dateRange
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
        page,
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
const hostel = data?.hostel;

if (hostel) {
  setSelectedProperty((prev) => ({
    ...prev,
    ...hostel,

    totalTenants: hostel?.totalTenants ?? 0,
    totalRequested: hostel?.totalRequested ?? 0,
    totalVerified: hostel?.totalVerified ?? 0,
    totalWaitingForApproval:
      hostel?.totalWaitingForApproval ?? 0,
  }));
}
      const tenants =
        data?.hostel?.tenants || [];


     const formattedTenants = tenants.map((tenant) => ({
  ...tenant,

  tenantId: tenant?.customerId || "",

  tenantName: tenant?.fullName?.trim() || "N/A",

  joinDate: tenant?.joiningDate || "",

  billingCycle:
    tenant?.billingCycleStart &&
    tenant?.billingCycleEnd
      ? `${tenant.billingCycleStart} - ${tenant.billingCycleEnd}`
      : "N/A",

  submittedDate: tenant?.kycCompletedDate || "",
  submittedTime: tenant?.kycCompletedTime || "",

  kycStatus:
    tenant?.kycDetailsStatus?.trim()
      ? tenant.kycDetailsStatus
      : "NOT_AVAILABLE",

  canSendReminder:
    tenant?.canSendReminder ?? false,

  canApproveKyc:
    tenant?.canApproveKyc ?? false,
}));

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
  useEffect(() => {
  if (!isDrawerOpen || !selectedProperty) return;

  loadTenantKYC(
    selectedProperty?.hostelId || selectedProperty?.id,
    tenantPage,
    tenantPageSize,
    tenantSearch,
    tenantKycStatus,
    tenantDateFilter,
    tenantDateRange
  );
}, [
  tenantPage,
  tenantPageSize,
]);
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

  // Close dropdowns
  setIsTenantDateOpen(false);
  setIsTenantStatusOpen(false);

  // Reset tenant filters
  setTenantDateFilter("ALL");
  setTenantDateRange([]);
  setTenantKycStatus("");

  
  setTenantSearch("");
  setTenantPage(1);
};
  

  const filteredProperties = properties;

  return (
    <DashboardLayout>
       <Toast
              show={showSuccess}
              message={message}
              type={modalType}
      
            />
      <div className="w-full bg-white min-h-screen">

      
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

                   
                      <td className="w-[68px] px-[10px]">
                        <span className="text-[12px] text-[#222]">
                          {(currentPage - 1) * pageSize + index + 1}
                        </span>
                      </td>



                      <td className="w-[20%] px-[10px] flex-shrink-0 text-left ">
                        <div className="flex items-center gap-[7px]">

                          <div
                            className="
    w-[30px]
    h-[30px]
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
                              <span className="text-[9px] font-medium text-[#667085]">
                                {item.avatar}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">

                            <div
                              className="
                    text-[12px]
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
                    text-[11px]
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
                        <span className="text-[12px] text-[#333]">
                          {item.tenants}
                        </span>
                      </td>


                    
                      <td className="w-[11%] px-[8px] text-center flex-shrink-0 text-left">
                        <span className="text-[12px] text-[#333]">
                          {item.verified}
                        </span>
                      </td>


                     
                      <td className="w-[14%] px-[8px] flex-shrink-0 text-left">
                        <span
                          className={`
                text-[12px]
                font-medium
                ${item.kycStatus === "Enabled"
                              ? "text-[#17B65B]"
                              : "text-[#FF7900]"
                            }
              `}
                        >
                          {item.kycStatus}
                        </span>
                      </td>


                      
                      <td className="w-[21%] px-[8px] flex-shrink-0 text-left">
                        <span className="text-[12px] text-[#333]">
                          {item.updated}
                        </span>
                      </td>


                      
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
    disabled={
      currentPage <= 1 ||
      totalPages <= 1 ||
      !totalItems ||
      totalItems <= pageSize * (currentPage - 1)
    }
    onClick={() => {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }}
    className="
      text-[20px]
      disabled:opacity-40
      disabled:cursor-not-allowed
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


  
  <span className="text-[12px]">
    {currentPage} - {totalPages}
  </span>


 
  <button
    type="button"
    disabled={
      currentPage >= totalPages ||
      totalPages <= 1 ||
      !totalItems ||
      totalItems <= pageSize * currentPage
    }
    onClick={() => {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }}
    className="
      text-[20px]
      disabled:opacity-40
      disabled:cursor-not-allowed
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
                    <div className="text-[12px] font-semibold text-[#222] text-left">
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
  value={selectedProperty?.totalTenants ?? 0}
  subtitle="Invoices to create"
/>

<StatCard
  title="Total Requested"
  value={selectedProperty?.totalRequested ?? 0}
  subtitle="Selected"
/>

<StatCard
  title="Total Verified"
  value={selectedProperty?.totalVerified ?? 0}
  subtitle="Selected"
/>

<StatCard
  title="Waiting For Approval"
  value={selectedProperty?.totalWaitingForApproval ?? 0}
  subtitle="Selected"
/>

             

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
                <div className="text-[11px] font-medium text-[#222] mb-[7px] text-left">
                  KYC Enable / Disable
                </div>

               <div
  className="
    h-[38px]
    bg-[#F5F7FC]
    rounded-[6px]
    px-[12px]
    flex
    items-center
    justify-between
  "
>
  <span className="text-[10px] text-[#222]">
    {kycEnableStatus ? "Enabled" : "Disabled"}
  </span>

  <div className="flex items-center gap-[6px]">

    <span className="text-[9px] text-[#777]">
      {kycEnableStatus ? "On" : "Off"}
    </span>

    <button
      type="button"
      onClick={() => setShowKycConfirm(true)}
      className={`
        w-[32px]
        h-[18px]
        rounded-full
        relative
        cursor-pointer
        ${kycEnableStatus
          ? "bg-[#159947]"
          : "bg-[#B9BCC1]"
        }
      `}
    >
      <div
        className={`
          absolute
          top-[3px]
          w-[12px]
          h-[12px]
          rounded-full
          bg-white
          transition-all
          ${kycEnableStatus
            ? "right-[3px]"
            : "left-[3px]"
          }
        `}
      />
    </button>

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


                <div className="flex items-center justify-between mb-[9px]">

                  <span className="text-[11px] font-medium text-[#222]">
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
      text-[9px]
      outline-none
      text-[#333]
      placeholder:text-[#AAA]
    "
                    />
                  </div>

                </div>


                <div className="flex items-center gap-[5px] mb-[8px]">

                  <span className="text-[9px] text-[#888]">
                    Filter by:
                  </span>


                  <div className="relative">
                 
                    <button
                      type="button"
                     onClick={() => {
  setIsTenantDateOpen((prev) => !prev);
  setIsTenantStatusOpen(false);
}}
                      className="
      h-[18px]
      min-w-[95px]
      px-[8px]
      pr-[18px]
      rounded-[4px]
      bg-[#2952F3]
      text-white
      text-[9px]
      text-left
      relative
      cursor-pointer
    "
                    >
                      {
                        tenantDateFilters.find(
                          (filter) =>
                            filter.key === tenantDateFilter
                        )?.value || "This month"
                      }

                      <ChevronDown
                        size={8}
                        className={`
        absolute
        right-[5px]
        top-1/2
        -translate-y-1/2
        text-white
        transition-transform
        ${isTenantDateOpen ? "rotate-180" : ""}
      `}
                      />
                    </button>

                    
                    {isTenantDateOpen && (
                      <div
                        className="
        absolute
        left-0
        top-[27px]
        z-[1100]
        w-[95px]
        max-h-[90px]
        overflow-y-auto
        rounded-[4px]
        border
        border-[#E1E4EA]
        bg-white
        shadow-md
      "
                      >
                        {tenantDateFilters.map((filter) => (
                          <button
                            key={filter.key}
                            type="button"
                            onClick={() => {
                              const value = filter.key;

                              setTenantDateFilter(value);
                              setTenantPage(1);
                              setIsTenantDateOpen(false);

                              
                              if (value !== "CUSTOM") {
                                setTenantDateRange([]);
                              }

                              
                              if (value === "CUSTOM") {
                                return;
                              }

                              loadTenantKYC(
                                selectedProperty?.hostelId ||
                                selectedProperty?.id,
                                1,
                                tenantPageSize,
                                tenantSearch,
                                tenantKycStatus,
                                value
                              );
                            }}
                            className={`
            w-full
            h-[20px]
            px-[8px]
            text-left
            text-[9px]
            cursor-pointer
            ${tenantDateFilter === filter.key
                                ? "bg-[#F3F6FF] text-[#2952F3]"
                                : "text-[#333]"
                              }
            hover:bg-[#F3F6FF]
          `}
                          >
                            {filter.value}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>



                  {tenantDateFilter === "CUSTOM" && (
                    <RangePicker
                      value={tenantDateRange}
                      onChange={(dates) => {
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
                            "THIS_MONTH"
                          );

                          return;
                        }

                        setTenantDateRange(dates);
                        setTenantPage(1);

                        const startDate = dates[0]
                          ? dates[0].format("YYYY-MM-DDTHH:mm:ss")
                          : "";

                        const endDate = dates[1]
                          ? dates[1].format("YYYY-MM-DDTHH:mm:ss")
                          : "";

                        loadTenantKYC(
                          selectedProperty?.hostelId ||
                          selectedProperty?.id,
                          1,
                          tenantPageSize,
                          tenantSearch,
                          tenantKycStatus,
                          "CUSTOM",
                          startDate,
                          endDate
                        );
                      }}
                      format="DD-MM-YYYY"
                      placeholder={["Start Date", "End"]}
                      size="small"
                      allowClear
                      className="
      !w-[145px]
      !h-[18px]
      !rounded-[4px]
      !text-[6px]
      !px-[5px]

      [&_.ant-picker-input>input]:!text-[6px]
      [&_.ant-picker-input>input]:!h-[16px]
      [&_.ant-picker-input>input]:!p-0

      [&_.ant-picker-input>input::placeholder]:!text-[6px]
      [&_.ant-picker-input>input::placeholder]:!text-[#AAA]

      [&_.ant-picker-separator]:!text-[7px]
      [&_.ant-picker-separator]:!px-[1px]

      [&_.ant-picker-suffix]:!text-[8px]
    "
                    />
                  )}



                  <div className="relative">
                   
                    <button
                      type="button"
                     onClick={() => {
  setIsTenantStatusOpen((prev) => !prev);
  setIsTenantDateOpen(false);
}}
                      className="
      h-[18px]
      min-w-[90px]
      px-[8px]
      pr-[18px]
      rounded-[4px]
      border
      border-[#E1E4EA]
      bg-white
      text-[#333]
      text-[9px]
      text-left
      relative
      cursor-pointer
    "
                    >
                      {tenantKycStatuses.find(
                        (status) =>
                          status.key === tenantKycStatus
                      )?.label || "Status"}

                      <ChevronDown
                        size={8}
                        className={`
        absolute
        right-[5px]
        top-1/2
        -translate-y-1/2
        text-[#777]
        transition-transform
        ${isTenantStatusOpen
                            ? "rotate-180"
                            : ""
                          }
      `}
                      />
                    </button>

               
                    {isTenantStatusOpen && (
                      <div
                        className="
        absolute
        left-0
        top-[27px]
        z-[1200]
        w-[95px]
        max-h-[90px]
        overflow-y-auto
        rounded-[4px]
        border
        border-[#E1E4EA]
        bg-white
        shadow-md
      "
                      >
                       
                        <button
                          type="button"
                          onClick={() => {
                            setTenantKycStatus("");
                            setTenantPage(1);
                            setIsTenantStatusOpen(false);

                            loadTenantKYC(
                              selectedProperty?.hostelId ||
                              selectedProperty?.id,
                              1,
                              tenantPageSize,
                              tenantSearch,
                              "",
                              tenantDateFilter
                            );
                          }}
                          className="
          w-full
          h-[20px]
          px-[8px]
          text-left
          text-[9px]
          text-[#333]
          cursor-pointer
          hover:bg-[#F3F6FF]
        "
                        >
                          Status
                        </button>

                        
                        {tenantKycStatuses.map((status) => (
                          <button
                            key={status.key}
                            type="button"
                            onClick={() => {
                              const value = status.key;

                              setTenantKycStatus(value);
                              setTenantPage(1);
                              setIsTenantStatusOpen(false);

                              loadTenantKYC(
                                selectedProperty?.hostelId ||
                                selectedProperty?.id,
                                1,
                                tenantPageSize,
                                tenantSearch,
                                value,
                                tenantDateFilter
                              );
                            }}
                            className={`
            w-full
            h-[20px]
            px-[8px]
            text-left
            text-[9px]
            cursor-pointer
            hover:bg-[#F3F6FF]
            ${tenantKycStatus === status.key
                                ? "bg-[#F3F6FF] text-[#2952F3]"
                                : "text-[#333]"
                              }
          `}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                <div className="relative min-h-[100px]">


              
                  <TenantKycTable
                    tenants={tenantList}
                    loading={tenantLoading}
                    currentPage={tenantPage}
                    pageSize={tenantPageSize}
                    totalPages={tenantTotalPages}
                    totalItems={tenantTotalItems}
                    search={tenantSearch}
                    setSearch={setTenantSearch}

                    onReminder={handleReminder}
                    onApprove={(tenant) => {
                      setSelectedApproveTenant(tenant);
                      setShowApproveModal(true);
                    }}

onPageChange={(page, newSize) => {
  const size = newSize ?? tenantPageSize;

  setTenantPage(page);
  setTenantPageSize(size);
}}
                  />


                  {tenantLoading && (
                    <div
                      className="
        absolute
        inset-0
        z-[50]
        bg-white/70
        flex
        items-center
        justify-center
        rounded-[6px]
      "
                    >
                      <div
                        className="
          w-[18px]
          h-[18px]
          border-[2px]
          border-[#DCE3FF]
          border-t-[#2952F3]
          rounded-full
          animate-spin
        "
                      />
                    </div>
                  )}

                </div>



              </div>

            </div>
          </div>
        </>
      )}

      {reminderTenant && (
        <div
          className="
      fixed
      inset-0
      z-[3000]
      bg-black/30
      flex
      items-center
      justify-center
    "
          onClick={() => setReminderTenant(null)}
        >
          <div
            className="
        w-[565px]
        bg-white
        rounded-[8px]
        shadow-xl
        p-[20px]
      "
            onClick={(e) => e.stopPropagation()}
          >

            
            <div className="text-[20px] font-medium text-[#101828]">
              Send KYC update reminder to
              <span className="ml-[4px]">
                “{reminderTenant.tenantName}”
              </span>
              ?
            </div>

            
            <div
              className="
          mt-[20px]
          h-[82px]
          rounded-[7px]
          bg-[#F5F7FC]
          px-[12px]
          flex
          items-center
        "
            >

              
              <div
                className="
            w-[44px]
            h-[44px]
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            flex-shrink-0
          "
              >
                <span className="text-[12px] text-[#344054]">
                  {reminderTenant.initial || "N/A"}
                </span>
              </div>

              
              <div className="ml-[14px]">

                <div className="flex items-center gap-[8px]">
                  <span className="text-[16px] font-medium text-[#344054]">
                    {reminderTenant.tenantName}
                  </span>

                  <span className="text-[16px] text-[#2952F3]">
                    ↗
                  </span>
                </div>

                <div className="mt-[5px] text-[12px] text-[#777]">
                  {reminderTenant.tenantId || "-"}
                </div>

              </div>
            </div>

            
            <div className="flex justify-end gap-[10px] mt-[24px]">

              <button
                type="button"
                onClick={() => setReminderTenant(null)}
                className="
            h-[46px]
            w-[102px]
            rounded-[7px]
            border
            border-[#D0D5DD]
            bg-white
            text-[14px]
            text-[#101828]
            cursor-pointer
          "
              >
                Cancel
              </button>

             <button
  type="button"
  onClick={sendTenantKYCReminder}
  disabled={tenantLoading}
  className={`
    h-[46px]
    w-[178px]
    rounded-[7px]
    text-white
    text-[14px]
    cursor-pointer
    flex
    items-center
    justify-center
    gap-[6px]
    ${
      tenantLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#2952F3] hover:bg-[#2146DD]"
    }
  `}
>
  {tenantLoading ? (
    <>
      <div
        className="
          w-[13px]
          h-[13px]
          border-[2px]
          border-white/40
          border-t-white
          rounded-full
          animate-spin
        "
      />
      Sending...
    </>
  ) : (
    <>
      ➤&nbsp; Send Reminder
    </>
  )}
</button>

            </div>

          </div>
        </div>
      )}
     {showApproveModal && selectedApproveTenant && (
  <div
    className="
      fixed
      inset-0
      z-[3000]
      bg-black/50
      flex
      items-center
      justify-center
    "
    onClick={() => {
      if (approveLoading) return;

      setShowApproveModal(false);
      setSelectedApproveTenant(null);
    }}
  >
    <div
      className="
        bg-white
        rounded-2xl
        w-[500px]
        p-6
        shadow-xl
      "
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-[20px] font-medium text-[#1f2937] text-left">
        Do you wanna approve KYC for this Tenant ?
      </h2>

      <p className="text-gray-500 mt-2 text-sm text-left">
        Upon your approval, the KYC process will be completed.
      </p>

      <div className="bg-[#f5f7fb] rounded-xl p-4 mt-6 flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
          <span className="text-[20px] text-[#344054]">
            {selectedApproveTenant?.tenantName
              ?.charAt(0)
              ?.toUpperCase()}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[20px]">
              {selectedApproveTenant?.tenantName}
            </h3>

            <span className="text-[#2952F3]">
              ↗
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {selectedApproveTenant?.tenantId || "-"}
          </p>
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <button
          type="button"
          onClick={() => {
            if (approveLoading) return;

            setShowApproveModal(false);
            setSelectedApproveTenant(null);
          }}
          className="
            border
            border-gray-300
            px-8
            py-3
            rounded-xl
            text-gray-700
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() =>
            handleApproveKYC(selectedApproveTenant)
          }
          disabled={approveLoading}
          className={`
            px-8
            py-3
            rounded-xl
            flex
            items-center
            gap-2
            text-white
            ${
              approveLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2952F3] hover:bg-[#1f46e5]"
            }
          `}
        >
          {approveLoading
            ? "Approving..."
            : "Confirm"}
        </button>

      </div>

    </div>
  </div>
)}

      {showKycConfirm && (
  <div
    className="
      fixed
      inset-0
      z-[2000]
      bg-black/30
      flex
      items-center
      justify-center
    "
  >
    <div
      className="
        w-[560px]
        bg-white
        rounded-[8px]
        shadow-xl
        px-[14px]
        py-[12px]
      "
    >

      
      <div
        className="
          flex
          items-center
          gap-[8px]
          text-[16px]
          font-medium
          text-[#182230]
        "
      >

        <span className="text-[#F5A623] text-[20px]">
          !
        </span>

        {kycEnableStatus
          ? `Disable KYC for “${selectedProperty?.name}” ?`
          : `Enable KYC for “${selectedProperty?.name}” ?`
        }

      </div>


    
      <div
        className="
          mt-[8px]
          text-[13px]
          text-[#475467]
          leading-[18px]
        "
      >

        {kycEnableStatus ? (
          <>
            New tenants will no longer be asked to submit KYC
            for this property.
            <br />
            Existing KYC records will be retained.
          </>
        ) : (
          <>
            New tenants will be asked to submit KYC
            for this property.
            <br />
            Existing KYC records will be retained.
          </>
        )}

      </div>


      
      <div
        className="
          flex
          justify-end
          items-center
          gap-[12px]
          mt-[14px]
        "
      >

        
        <button
          type="button"
          onClick={() => setShowKycConfirm(false)}
          className="
            h-[46px]
            min-w-[102px]
            px-[18px]
            rounded-[7px]
            border
            border-[#D0D5DD]
            bg-white
            text-[#101828]
            text-[14px]
            cursor-pointer
          "
        >
          Cancel
        </button>


        
        <button
          type="button"
          onClick={handleKycEnableDisable}
          className="
            h-[46px]
            min-w-[132px]
            px-[18px]
            rounded-[7px]
            bg-[#2952F3]
            text-white
            text-[14px]
            cursor-pointer
          "
        >
          {kycEnableStatus
            ? "Disable KYC"
            : "Enable KYC"
          }
        </button>

      </div>

    </div>
  </div>
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
      <div className="text-[10px] text-[#667085]">
        {title}
      </div>

      <div className="text-[12px] font-semibold text-[#222] mt-[2px]">
        {value}
      </div>

      {subtitle && (
        <div className="text-[7px] text-[#999]">
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
  onReminder,
  onApprove,
}) => {

  
  const hasAction = tenants.some(
    (tenant) =>
      tenant.canSendReminder === true ||
      tenant.canApproveKyc === true
  );
  return (
    <>


<div className="w-full">

  <div
    className="
      max-h-[174px]
      overflow-auto
      scrollbar-thin
      relative
    "
  >

    <div
      className="
        min-w-[579px]
        w-full
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-[32px_95px_75px_110px_120px_100px_72px]
          h-[30px]
          items-center
          bg-white
          border-b
          border-[#E5E7EB]
          sticky
          top-0
          z-[100]
        "
      >

        {/* ID HEADER */}
        <div
          className="
            h-[30px]
            flex
            items-center
            px-[4px]
            bg-white
            sticky
            left-0
            z-[110]
          "
        >
          <TableHeader text="ID" />
        </div>


        {/* TENANT NAME HEADER */}
        <div
          className="
            h-[30px]
            flex
            items-center
            px-[4px]
            bg-white
            sticky
            left-[32px]
            z-[110]
          "
        >
          <TableHeader text="Tenant Name" />
        </div>


        {/* JOIN DATE HEADER */}
        <div className="h-[30px] flex items-center px-[5px]">
          <TableHeader text="Join Date" />
        </div>


        {/* BILLING HEADER */}
        <div className="h-[30px] flex items-center px-[5px]">
          <TableHeader text="Billing Cycle" />
        </div>


        {/* SUBMITTED HEADER */}
        <div className="h-[30px] flex items-center px-[5px]">
          <TableHeader text="Submitted on" />
        </div>


        {/* KYC STATUS HEADER */}
        <div className="h-[30px] flex items-center px-[5px]">
          <TableHeader text="KYC Status" />
        </div>


        {/* ACTION HEADER */}
        {hasAction && (
          <div
            className="
              h-[30px]
              flex
              items-center
              px-[4px]
              bg-white
              sticky
              right-0
              z-[110]
            "
          >
            <TableHeader text="Action" />
          </div>
        )}

      </div>


      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (

        <div
          className="
            h-[50px]
            flex
            items-center
            justify-center
            bg-white
          "
        >

          <div
            className="
              w-[18px]
              h-[18px]
              border-[2px]
              border-[#E5E7EB]
              border-t-[#2952F3]
              rounded-full
              animate-spin
            "
          />

        </div>

      ) : tenants.length > 0 ? (

        tenants.map((tenant, index) => (

          <div
            key={tenant.tenantId || index}
            className="
              grid
              grid-cols-[32px_95px_75px_110px_120px_100px_72px]
              h-[30px]
              items-center
              border-b
              border-[#F0F0F0]
              bg-white
            "
          >

            {/* ================================================= */}
            {/* ID */}
            {/* ================================================= */}

            <div
              className="
                h-[30px]
                flex
                items-center
                px-[4px]
                bg-white
                sticky
                left-0
                z-[20]
              "
            >

              <TableText
                text={
                  (currentPage - 1) *
                    pageSize +
                  index +
                  1
                }
              />

            </div>


            {/* ================================================= */}
            {/* TENANT NAME */}
            {/* ================================================= */}

            <div
              className="
                h-[30px]
                flex
                items-center
                px-[4px]
                min-w-0
                bg-white
                sticky
                left-[32px]
                z-[20]
              "
            >

              <TableText
                text={
                  tenant.tenantName ||
                  "N/A"
                }
              />

            </div>


            {/* ================================================= */}
            {/* JOIN DATE */}
            {/* ================================================= */}

            <div
              className="
                h-[30px]
                flex
                items-center
                px-[5px]
                min-w-0
              "
            >

              <TableText
                text={
                  tenant.joinDate &&
                  typeof tenant.joinDate ===
                    "string" &&
                  tenant.joinDate.trim() &&
                  dayjs(
                    tenant.joinDate,
                    "DD/MM/YYYY",
                    true
                  ).isValid()
                    ? dayjs(
                        tenant.joinDate,
                        "DD/MM/YYYY"
                      ).format("MMM D")
                    : "N/A"
                }
              />

            </div>


            {/* ================================================= */}
            {/* BILLING CYCLE */}
            {/* ================================================= */}

            <div
              className="
                h-[30px]
                flex
                items-center
                px-[5px]
                min-w-0
              "
            >

              <TableText
                text={
                  tenant.billingCycle ||
                  "N/A"
                }
              />

            </div>


            {/* ================================================= */}
            {/* SUBMITTED ON */}
            {/* ================================================= */}

            <div
              className="
                h-[30px]
                flex
                items-center
                px-[5px]
                min-w-0
              "
            >

              {tenant.submittedDate ||
              tenant.submittedTime ? (

                <div
                  className="
                    flex
                    flex-col
                    justify-center
                    min-w-0
                  "
                >

                  {tenant.submittedDate && (

                    <span
                      className="
                        text-[7px]
                        text-[#333]
                        truncate
                        leading-[9px]
                      "
                    >
                      {tenant.submittedDate}
                    </span>

                  )}

                  {tenant.submittedTime && (

                    <span
                      className="
                        text-[7px]
                        text-[#777]
                        truncate
                        leading-[8px]
                      "
                    >
                      {tenant.submittedTime}
                    </span>

                  )}

                </div>

              ) : (

                <span
                  className="
                    text-[8px]
                    text-[#777]
                  "
                >
                  N/A
                </span>

              )}

            </div>


            {/* ================================================= */}
            {/* KYC STATUS */}
            {/* ================================================= */}

            <div
              className="
                h-[30px]
                flex
                items-center
                px-[5px]
                min-w-0
              "
            >

              <span
                className="
                  block
                  text-[8px]
                  text-[#333]
                  truncate
                "
              >
                {tenant?.kycDetailsStatus?.trim()
                  ? tenant.kycDetailsStatus
                  : "NOT_AVAILABLE"}
              </span>

            </div>


           

           {hasAction && (

  <div
    className="
      h-[30px]
      flex
      items-center
      px-[2px]
      bg-white
      sticky
      right-0
      z-[20]
    "
  >

    <div
      className="
        flex
        items-center
        gap-[3px]
      "
    >

      {/* REMINDER */}
      {tenant.canSendReminder === true && (
        <button
          type="button"
          onClick={() => onReminder(tenant)}
          className="
            h-[18px]
            min-w-[42px]
            px-[4px]
            rounded-[4px]
            bg-[#2952F3]
            text-white
            text-[7px]
            cursor-pointer
            whitespace-nowrap
          "
        >
          Reminder
        </button>
      )}

      {/* APPROVE */}
      {tenant.canApproveKyc === true && (
        <button
          type="button"
          onClick={() => onApprove(tenant)}
          className="
            h-[18px]
            min-w-[42px]
            px-[4px]
            rounded-[4px]
            bg-[#159947]
            text-white
            text-[7px]
            cursor-pointer
            whitespace-nowrap
          "
        >
          Approve
        </button>
      )}

      {/* NO ACTION */}
      {tenant.canSendReminder !== true &&
        tenant.canApproveKyc !== true && (
          <span className="text-[8px] text-[#777]">
            N/A
          </span>
        )}

    </div>

  </div>

)}

          </div>

        ))

      ) : (

        <div
          className="
            h-[50px]
            flex
            items-center
            justify-center
            text-[8px]
            text-[#999]
            bg-white
          "
        >
          No tenants found
        </div>

      )}

    </div>

  </div>

</div>
      
   {!loading && totalItems > 0 && (
  <div
    className="
      flex
      items-center
      justify-between
      w-full
      mt-[8px]
      pt-[6px]
    "
  >

   
    <div className="text-[9px] text-[#475467]">
      Total Record Count:
      <span className="ml-[3px] text-[#2952F3] font-medium">
        {tenants.length}
      </span>
    </div>


    
    <div className="flex items-center gap-[6px]">

      
   <select
  value={pageSize}
  onChange={(e) => {
    const newSize = Number(e.target.value);

    onPageChange(1, newSize);
  }}
  className="
    w-[52px]
    h-[28px]
    rounded-[8px]
    border
    border-[#D0D5DD]
    bg-white
    px-[7px]
    text-[7px]
    text-[#333]
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
        disabled={currentPage <= 1}
        onClick={() =>
          onPageChange(
            currentPage - 1,
            pageSize
          )
        }
        className="
          w-[18px]
          h-[28px]
          flex
          items-center
          justify-center
          text-[15px]
          text-[#B5B5B5]
          disabled:opacity-40
          disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        ‹
      </button>


      
      <div
        className="
          w-[36px]
          h-[36px]
          rounded-full
          bg-[#F5F7FC]
          flex
          items-center
          justify-center
          text-[8px]
          text-[#333]
          flex-shrink-0
        "
      >
        {currentPage}
      </div>


     
      <span
        className="
          text-[7px]
          text-[#333]
          whitespace-nowrap
          min-w-[28px]
          text-center
        "
      >
     
        {currentPage} - {totalPages}
      </span>


      
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() =>
          onPageChange(
            currentPage + 1,
            pageSize
          )
        }
        className="
          w-[18px]
          h-[28px]
          flex
          items-center
          justify-center
          text-[15px]
          text-[#777]
          disabled:opacity-40
          disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        ›
      </button>

    </div>

  </div>
)}
    </>
  );
};

const TableHeader = ({ text }) => {
  return (
    <div className="text-[9px] text-[#777] px-[2px] whitespace-nowrap">
      {text}
    </div>
  );
};

const TableText = ({ text }) => {
  return (
    <div
      className="
        text-[9px]
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