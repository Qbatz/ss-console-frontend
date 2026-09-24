import React, { useState, useEffect, useContext, useRef } from "react";
import AddBtn from "../../assets/add.png"
import Search from "../../assets/Search.png";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";
import Circle from "../../assets/menucircle.png";
import Money from "../../assets/MoneyRecive.png"
import { useSubscription } from "../../Context/SubscriptionContext";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import noteAdd from "../../assets/noteadd.png";
import { useNavigate, useLocation } from "react-router-dom";
import LoginImg from "../../assets/permission.svg";
import { usePermission } from "../../Utils/permissionHelper";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { usePlan } from "../../Context/PlanContexts";
import AssignStaffModal from "./AssignStaffDesign";
import PropertyIcon from "../../assets/ReceiptItem.png";
import ActiveIcon from "../../assets/ActiveTrend.png";
import InactiveIcon from "../../assets/trend-up.png";
import CalendarIcon from "../../assets/calendarIcon.png";
import UserIcon from "../../assets/user-block.png";
import TrialIcon from "../../assets/timer.png";
import Arrow from "../../assets/direction-down 01.png";
import { createPortal } from "react-dom";
import CommentBox from "../../assets/message-2.png";


const Properties = () => {
  const { hostels, getHostels, loading, getHostelById, hardResetHostel, errorMsg, accessError, deleteHostelExpense, exportHostels, deleteHostel, createHostelNote, getHostelNotes,getHostelFollowUpStatus,updateHostelFollowUpStatus,getHostelFollowUp } = useHostel();
  const { createSubscription, getAgentsDropdown,getDropReasons } = useSubscription();
  const { getPlansDropdown } = usePlan();
  const [dropdownPlans, setDropdownPlans] = useState([]);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const { roleId } = useParams();
  const [agentList, setAgentList] = useState([])
  const agentDropdownRef = useRef(null);
  const [agentFilter, setAgentFilter] = useState("");
  const [openAgentDropdown, setOpenAgentDropdown] = useState(false);
  const [filterOption, setFilterOption] = useState("TOTAL_PROPERTIES");
  const [hostelError, setHostelError] = useState("");
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
const [updateStatus, setUpdateStatus] = useState("");
const [additionalComments, setAdditionalComments] = useState("");
const [updateReason, setUpdateReason] = useState("");

const [followUpStatuses, setFollowUpStatuses] = useState([]);
const [followUpHistory, setFollowUpHistory] = useState([]);
const [statusError, setStatusError] = useState("");
const [reasonError, setReasonError] = useState("");

const [submitError, setSubmitError] = useState("");




  const [hostelNotes, setHostelNotes] =
    useState([]);



  const [isAddingNote, setIsAddingNote] = useState(false);
  const fetchHostelNotes = async (
    hostelId
  ) => {

    const res =
      await getHostelNotes(hostelId);

    if (res?.success) {

      setHostelNotes(

        res?.data || []
      );

    }

  };
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
  if (!showUpdateStatusModal) return;

  const fetchFollowUpStatuses = async () => {
    const res = await getHostelFollowUpStatus();

    console.log("FOLLOW UP STATUS API RESPONSE:", res);

    if (res?.success) {
      const statuses = Array.isArray(res?.data)
        ? res.data
        : res?.data?.statuses ||
          res?.data?.data ||
          [];

      setFollowUpStatuses(statuses);
      console.log("setFollowUpStatuses",followUpStatuses)
    } else {
      setFollowUpStatuses([]);
    }
  };

  fetchFollowUpStatuses();
}, [showUpdateStatusModal]);
  useEffect(() => {
    getPlansDropdown().then((res) => {
      if (res?.success) {
        setDropdownPlans(res.data);
      }
    });
  }, []);
  console.log("dropdownPlans", dropdownPlans)
  // const skipApi = location.state?.skipApi;
  const { RangePicker } = DatePicker;

  // const [skipFirstApi, setSkipFirstApi] = useState(location.state?.skipApi || false);
  // const [dateRange, setDateRange] = useState([]);
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Hostels");
  console.log("canRead", canRead)
  const {
    canRead: canReadExpenses,
    canWrite: canWriteExpenses,
    canUpdate: canUpdateExpenses,
    canDelete: canDeleteExpenses,
  } = usePermission("Expenses");
  // const [page, setPage] = useState(1);
  // const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  // const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(
    location.state?.currentPage || 1
  );



  const locationSearch =
    location.state?.currentSearch;

  // const [searchText, setSearchText] = useState(
  //   locationSearch ?? ""
  // );
  // const [searchText, setSearchText] = useState(
  //   sessionStorage.getItem("propertiesSearch") || ""
  // );
  // const [searchText, setSearchText] = useState(
  //   location.state?.currentSearch ||
  //   sessionStorage.getItem("propertiesSearch") ||
  //   ""
  // );
  const [searchText, setSearchText] = useState(
    location.state?.fromOverview
      ? location.state?.currentSearch || ""
      : ""
  );
  const [dateRange, setDateRange] = useState(() => {
    const range = location.state?.currentDateRange;

    if (range?.length === 2) {
      return [
        dayjs(range[0], "YYYY-MM-DD"),
        dayjs(range[1], "YYYY-MM-DD"),
      ];
    }

    return null;
  });
  useEffect(() => {
    const fromOverview = location.state?.fromOverview;

    if (!fromOverview) {
      setSearchText("");
      setDateRange([]);
      setStatusFilter("");
      setPage(1);
    }
  }, []);
  // const [statusFilter, setStatusFilter] = useState(
  //   sessionStorage.getItem("propertiesStatus") || ""
  // );

  // const [dateRange, setDateRange] = useState(() => {

  //   const stored =
  //     sessionStorage.getItem("propertiesDate");

  //   if (!stored) return [];

  //   const parsed = JSON.parse(stored);

  //   return [
  //     dayjs(parsed[0]),
  //     dayjs(parsed[1]),
  //   ];

  // });
  // const [statusFilter, setStatusFilter] = useState(
  //   location.state?.currentStatusFilter ||
  //   sessionStorage.getItem("propertiesStatus") ||
  //   ""
  // );
  const [statusFilter, setStatusFilter] = useState(
    location.state?.fromOverview
      ? location.state?.currentStatusFilter || ""
      : ""
  );

  // const [dateRange, setDateRange] = useState(
  //   location.state?.currentDateRange || []
  // );

  useEffect(() => {

    sessionStorage.setItem(
      "propertiesSearch",
      searchText
    );

  }, [searchText]);

  useEffect(() => {

    sessionStorage.setItem(
      "propertiesStatus",
      statusFilter
    );

  }, [statusFilter]);

  useEffect(() => {

    if (dateRange?.length === 2) {

      sessionStorage.setItem(
        "propertiesDate",
        JSON.stringify([
          dateRange[0],
          dateRange[1],
        ])
      );

    }
    else {

      sessionStorage.removeItem(
        "propertiesDate"
      );

    }

  }, [dateRange]);


  useEffect(() => {
    if (!location.state?.currentPage) {
      setSearchText("");
      setDateRange([]);
      setStatusFilter("");
      setPage(1);
    }
  }, []);
  // useEffect(() => {

  //   if (!location.state?.currentPage) {

  //     setSearchText("");
  //     setDateRange([]);
  //     setStatusFilter("");
  //     setPage(1);

  //   }

  // }, []);

  // const [dateRange, setDateRange] = useState(
  //   location.state?.currentDateRange || []
  // );


  const isStatusFiltering = statusFilter !== "";
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isPageChange, setIsPageChange] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [hostelDetails, setHostelDetails] = useState("")
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);

  const [noteText, setNoteText] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(null);
  const [menuError, setMenuError] = useState("")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trialPlan, setTrialPlan] = useState("")
  const [showTrialPopup, setShowTrialPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTrialPlan, setSelectedTrialPlan] = useState("");
  const [planError, setPlanError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteHostelId, setDeleteHostelId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const menuRef = useRef(null);
  // const [selectedHostel, setSelectedHostel] = useState(null);
  console.log("startDate", startDate)
  const navigate = useNavigate();

  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  console.log("Typed Value:", errorMsg);
  console.log("Selected Hostel ID:", accessError);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);

  }, [searchText]);

  // useEffect(() => {
  //   if (skipFirstApi) {
  //     setSkipFirstApi(false);
  //     return;
  //   }
  //   getHostels(page, pageSize, debouncedSearch);


  // }, [page, pageSize, debouncedSearch]);
  // useEffect(() => {
  //   if (skipFirstApi) {
  //     setSkipFirstApi(false);
  //     return;
  //   }

  //   let start = "";
  //   let end = "";

  //   if (dateRange && dateRange.length === 2) {
  //     start = dateRange[0].format("DD-MM-YYYY"); // API format
  //     end = dateRange[1].format("DD-MM-YYYY");
  //   }

  //   getHostels(page, pageSize, debouncedSearch, start, end);

  // }, [page, pageSize, debouncedSearch, dateRange]);
  // useEffect(() => {

  //   let start = "";
  //   let end = "";

  //   if (dateRange && dateRange.length === 2) {
  //     start = dateRange[0].format("DD-MM-YYYY");
  //     end = dateRange[1].format("DD-MM-YYYY");
  //   }

  //   getHostels(page, pageSize, debouncedSearch, start, end);

  // }, [page, pageSize, debouncedSearch, dateRange]);
  //   useEffect(() => {

  //   let start = "";
  //   let end = "";

  //   if (dateRange && dateRange.length === 2) {
  //     start = dateRange[0].format("DD-MM-YYYY");
  //     end = dateRange[1].format("DD-MM-YYYY");
  //   }

  //   let subActive = "";

  //   if (statusFilter === "active") {
  //     subActive = true;
  //   }
  //   else if (statusFilter === "inactive") {
  //     subActive = false;
  //   }

  //   getHostels(
  //     page,
  //     pageSize,
  //     debouncedSearch,
  //     start,
  //     end,
  //     subActive
  //   );

  // }, [page, pageSize, debouncedSearch, dateRange]);

  useEffect(() => {

    let start = "";
    let end = "";

    if (dateRange && dateRange.length === 2) {

      start = dateRange[0].format("DD-MM-YYYY");
      end = dateRange[1].format("DD-MM-YYYY");

    }

    let subActive = "";

    if (statusFilter === "active") {
      subActive = true;
    }
    else if (statusFilter === "inactive") {
      subActive = false;
    }

    getHostels(
      page,
      pageSize,

      debouncedSearch,

      start,
      end,

      subActive,

      agentFilter,

      filterOption
    );

  }, [
    page,
    pageSize,
    debouncedSearch,
    dateRange,
    statusFilter,
    agentFilter, filterOption
  ]);


  console.log("hostels", hostels);



  let displayData = hostels?.hostels || [];



  const handlePropertyClick = (item) => {
    sessionStorage.setItem(
      "propertyOverviewState",
      JSON.stringify({
        currentPage: page,
        currentSearch: searchText,
        currentDateRange:
          dateRange?.length === 2
            ? [
              dateRange[0].format("YYYY-MM-DD"),
              dateRange[1].format("YYYY-MM-DD"),
            ]
            : [],
        currentStatusFilter: statusFilter,
      })
    );

    window.open(`/property-overview/${item.hostelId}`, "_blank");
  };
  // const handlePropertyClick = async (item) => {
  //   const res = await getHostelById(item.hostelId);

  //   if (res?.success) {
  //     sessionStorage.setItem(
  //       "propertyOverviewState",
  //       JSON.stringify({
  //         currentPage: page,
  //         currentSearch: searchText,
  //         currentDateRange:
  //           dateRange?.length === 2
  //             ? [
  //                 dateRange[0].format("YYYY-MM-DD"),
  //                 dateRange[1].format("YYYY-MM-DD"),
  //               ]
  //             : [],
  //         currentStatusFilter: statusFilter,
  //       })
  //     );

  //     window.open(
  //       `/property-overview/${item.hostelId}`,
  //       "_blank"
  //     );
  //   }
  // };
  //   const handlePropertyClick = async (item) => {
  //     const res = await getHostelById(item.hostelId);

  //     if (res?.success) {
  //       // navigate(`/property-overview/${item.hostelId}`, {
  //       //   state: {
  //       //     hostelData: res.data,
  //       //     trialPlan: item
  //       //   }
  //       // });
  // //       navigate(`/property-overview/${item.hostelId}`, {
  // //   state: {
  // //     hostelData: res.data,
  // //     trialPlan: item,

  // //     currentPage: page,
  // //     currentSearch: searchText,
  // //     currentDateRange: dateRange,
  // //     currentStatusFilter: statusFilter,
  // //   }
  // // });
  // navigate(`/property-overview/${item.hostelId}`, {
  //   state: {
  //     currentPage: page,
  //     currentSearch: searchText,
  //      currentDateRange:
  //       dateRange?.length === 2
  //         ? [
  //             dateRange[0].format("YYYY-MM-DD"),
  //             dateRange[1].format("YYYY-MM-DD"),
  //           ]
  //         : [],
  //     currentStatusFilter: statusFilter,
  //   }
  // });
  //     }
  //   };

  // };
  // const handleExport = () => {
  //   let start = "";
  //   let end = "";


  //   if (dateRange && dateRange.length === 2) {
  //     start = dateRange[0].format("DD-MM-YYYY");
  //     end = dateRange[1].format("DD-MM-YYYY");
  //   }

  //   exportHostels(searchText, start, end);
  // };
  const handleExport = () => {

    let start = "";
    let end = "";

    if (
      dateRange &&
      dateRange.length === 2
    ) {

      start =
        dateRange[0].format(
          "DD-MM-YYYY"
        );

      end =
        dateRange[1].format(
          "DD-MM-YYYY"
        );

    }

    let subActive = "";

    if (
      statusFilter === "active"
    ) {

      subActive = true;

    } else if (
      statusFilter === "inactive"
    ) {

      subActive = false;

    }

    exportHostels(
      searchText,
      start,
      end,
      agentFilter,
      filterOption
    );

  };
  useEffect(() => {

    const handleClickOutside = (event) => {

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

  const handleCreateSubscription = async (item) => {
    const firstPlan = dropdownPlans?.trialPlans?.[0];



    if (!firstPlan) {
      setPlanError("Please select a plan");
      return;
    }

    const payload = {
      trialDays: 0,
      paidAmount: 0,
      discountAmount: 0,
      planCode: firstPlan?.planCode
    };

    const res = await createSubscription(
      item?.hostelId,
      payload
    );

    if (res?.success) {
      setShowTrialPopup(false);
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      getHostels(page, pageSize, searchText);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    } else {
      setPlanError(res?.message);
    }
  };


  console.log("hostels", hostels)
  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const handleResetExpense = async () => {

    const res = await deleteHostelExpense(selectedHostelId);

    if (res?.success) {

      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      getHostels(page, pageSize, searchText);

      setTimeout(() => {
        setShowSuccess(false);
        setShowResetModal(false)
      }, 1500);

    } else {

      setMenuError(res.message);
    }


  };
  const handleDeleteHostel = async () => {

    if (isDeleting) return;

    setIsDeleting(true);

    const res = await deleteHostel(deleteHostelId);

    if (res?.success) {

      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      getHostels(page, pageSize, searchText);

      setTimeout(() => {
        setShowSuccess(false);
        setShowDeleteModal(false);
        setIsDeleting(false);
      }, 1500);

    } else {

      setMenuError(res.message);
      setIsDeleting(false);

    }
  };
  const closeNotesDrawer = () => {

    setShowNoteModal(false);

    setNoteText("");

    setHostelError("");



  };
  const handleAddNote = async () => {

    if (isAddingNote) return;

    const lettersCount =
      noteText
        .trim()
        .replace(/[^a-zA-Z]/g, "")
        .length;

    if (!noteText.trim()) {

      setHostelError(
        "Please enter notes"
      );

      return;

    }

    if (lettersCount < 5) {

      setHostelError(
        "Notes must contain at least 5 letters"
      );

      return;

    }

    try {

      setIsAddingNote(true);

      const res =
        await createHostelNote(
          selectedHostelId,
          noteText
        );

      if (res?.success) {

        setNoteText("");
        setHostelError("");

        await fetchHostelNotes(
          selectedHostelId
        );

      } else {

        setHostelError(
          res?.message
        );

      }

    } finally {

      setIsAddingNote(false);

    }

  };
const handleUpdateStatus = async () => {
  setStatusError("");
  setReasonError("");

  if (!selectedHostel?.hostelId) {
    setMessage("Hostel ID is required");
    setModalType("error");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

    return;
  }

  let hasError = false;

  if (!updateStatus) {
    setStatusError("Please select status");
    hasError = true;
  }

  if (!updateReason) {
    setReasonError("Please select reason");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const payload = {
    hostelId: selectedHostel.hostelId,
    status: updateStatus,
    reason: updateReason,
    comments: additionalComments.trim(),
  };

  console.log("UPDATE STATUS PAYLOAD:", payload);

  const res = await updateHostelFollowUpStatus(payload);

  if (res?.success) {
    setShowUpdateStatusModal(false);

    setUpdateStatus("");
    setUpdateReason("");
    setAdditionalComments("");

    setStatusError("");
    setReasonError("");

    setModalType("success");
    setMessage(res?.message || "Status updated successfully");
    setShowSuccess(true);

    await getHostels(
      page,
      pageSize,
      debouncedSearch,
      startDate,
      endDate,
      "",
      agentFilter,
      filterOption
    );

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);
  } else {
    setModalType("error");
    setMessage(res?.message || "Failed to update status");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);
  }
};
const [latestdata,setLatestData] = useState("")
const handleUpdateStatusClick = async (item) => {
  setSelectedHostelId(item.hostelId);
  setSelectedHostel(item);
  setOpenMenu(null);

  setUpdateStatus("");
  setUpdateReason("");
  setStatusError("")
  setReasonError("")
 

  const res = await getHostelFollowUp(item.hostelId);

  if (res?.success) {
    setFollowUpHistory(
      res?.data?.hostelFollowUpHistory || []
      
    );
    setLatestData(res?.data)
    console.log("setFollowUpHistory",res?.data)
  } else {
    setFollowUpHistory([]);
  }

  setShowUpdateStatusModal(true);
};
  return (
    <>

      <DashboardLayout>

        {(canRead === false || accessError === "Access Restricted") ? (

          <div className="flex-center-col h-[400px] gap-4">

            <img
              src={LoginImg}
              alt="Access Restricted"
              className="w-[170px] sm:w-[140px] md:w-[150px] object-contain"
            />

            <h1 className="mt-1 text-[24px]  font-semibold text-[#101828]">
              Permission Restricted !
            </h1>

            <p className="mt-1 text-sm md:text-base text-[#4A5565] max-w-md">
              Your permission is restricted for this module
            </p>

          </div>

        )
          : canRead === undefined ? (


            <div className="flex items-center justify-center h-[400px]">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

          ) : (

            <>
              <Toast
                show={showSuccess}
                message={message}
                type={modalType}

              />
              {/* {isFirstLoad && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )} */}

              {/* {!isFirstLoad && ( */}


              <div className="flex-col-layout">





                {/* Header */}
                <div className="flex-between mb-6">

                  <h1 className="text-xl font-semibold font-inter">
                    Properties
                  </h1>

                  <button
                    className="
      flex items-center gap-2
      text-primaryBlue
      px-4 py-2
      rounded-lg
      text-sm
      font-inter
      transition-all duration-200
      hover:bg-primaryBlue
      hover:text-white
      cursor-pointer
    "
                  >
                    <img
                      src={AddBtn}
                      alt="add"
                      className="w-4 h-4 object-contain"
                    />

                    Add Property
                  </button>

                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">



                  <div
                    onClick={() => {
                      setFilterOption("TOTAL_PROPERTIES");
                      setPage(1);
                    }}
                    className={`
    card-common
    flex items-start justify-between
    p-4 xl:p-5
    min-h-[90px]

    cursor-pointer
    transition-all
    duration-200

    ${filterOption === "TOTAL_PROPERTIES"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
  `}
                  >

                    <div  >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Total Properties
                      </p>

                      <h2 className="text-2xl text-[20px] text-left font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.totalHostels}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-success">

                      <img
                        src={PropertyIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 2 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
      ${filterOption === "ACTIVE_PROPERTIES"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("ACTIVE_PROPERTIES");
                      setPage(1);
                    }} >

                    <div >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Active Properties
                      </p>

                      <div className="flex items-center text-left gap-2 mt-2">

                        <h2 className="text-2xl text-[20px] font-bold text-gray-800 leading-none">
                          {hostels?.activeHostels}
                        </h2>

                        {/* <span className="badge-primary">
          ↑ 12%
        </span> */}

                      </div>

                    </div>

                    <div className="stats-icon stats-icon-success">

                      <img
                        src={ActiveIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 3 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
      ${filterOption === "INACTIVE_PROPERTIES"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("INACTIVE_PROPERTIES");
                      setPage(1);
                    }} >

                    <div >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Inactive Properties
                      </p>

                      <h2 className="text-2xl text-[20px] text-left font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.inactiveHostels}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-warning">

                      <img
                        src={InactiveIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 4 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
      ${filterOption === "USED_TODAY"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("USED_TODAY");
                      setPage(1);
                    }}>

                    <div >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Used Today
                      </p>

                      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.usedTodayCount}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-success">

                      <img
                        src={CalendarIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 5 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
       ${filterOption === "USED_2TO7_DAYS"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
`}
                    onClick={() => {
                      setFilterOption("USED_2TO7_DAYS");
                      setPage(1);
                    }} >

                    <div  >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Used 1-7 Days
                      </p>

                      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.used2To7DaysCount}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-success">

                      <img
                        src={CalendarIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 6 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
       ${filterOption === "USED_8TO14_DAYS"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("USED_8TO14_DAYS");
                      setPage(1);
                    }} >

                    <div >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Used Last 8-14 Days
                      </p>

                      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.used8To14DaysCount}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-success">

                      <img
                        src={PropertyIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 7 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
       ${filterOption === "USED_15TO30_DAYS"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("USED_15TO30_DAYS");
                      setPage(1);
                    }} >

                    <div  >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Used 15-30 Days
                      </p>

                      <div className="flex items-center gap-2 mt-2">

                        <h2 className="text-2xl text-[20px] font-bold text-gray-800 leading-none">
                          {hostels?.used15To30DaysCount}
                        </h2>

                        {/* <span className="badge-primary">
          ↑ 12%
        </span> */}

                      </div>

                    </div>

                    <div className="stats-icon stats-icon-warning">

                      <img
                        src={UserIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 8 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
       ${filterOption === "USED_30_DAYS_AGO"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("USED_30_DAYS_AGO");
                      setPage(1);
                    }} >

                    <div >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Used 30+ Days
                      </p>

                      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.used30DaysAgoCount}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-warning">

                      <img
                        src={UserIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 9 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px] cursor-pointer
        ${filterOption === "NEVER_USED"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("NEVER_USED");
                      setPage(1);
                    }}>

                    <div  >

                      <p className="text-[11px] text-gray-500 font-medium">
                        Never Used
                      </p>

                      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.neverUsedCount}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-warning">

                      <img
                        src={InactiveIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>


                  {/* CARD 10 */}

                  <div
                    className={`
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
      cursor-pointer
        ${filterOption === "TRIAL_EXPIRING_SOON"
                        ? "!border-2 !border-blue-500 !bg-blue-50 shadow-lg scale-[1.01]"
                        : "hover:border-blue-300 hover:shadow-md"
                      }
    `}
                    onClick={() => {
                      setFilterOption("TRIAL_EXPIRING_SOON");
                      setPage(1);
                    }}>

                    <div>

                      <p className="text-[11px] text-gray-500 font-medium">
                        Trial Expiring Soon
                      </p>

                      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
                        {hostels?.trialExpiringCount}
                      </h2>

                    </div>

                    <div className="stats-icon stats-icon-danger">

                      <img
                        src={TrialIcon}
                        alt="icon"
                        className="w-4 h-4 object-contain"
                      />

                    </div>

                  </div>

                </div>


                <div className="sticky top-0 z-20 bg-white-common pb-4">

                  <div
                    className="
    flex
    items-end
    gap-4
    flex-wrap
    font-inter 
  "
                  >

                    {/* <div className="flex gap-3">

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        className="
          border border-gray-300
          rounded-lg
          px-3 py-2
          text-xs
          font-medium
          text-gray-700
          outline-none h-[42px]
        "
      >

        <option value="">
          All
        </option>

        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>

      </select>

    </div> */}
                    <div
                      className="
    relative
    w-[240px]
    shrink-0
  "
                      ref={agentDropdownRef}
                    >

                      {/* SELECT BOX */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAgentDropdown(
                            !openAgentDropdown
                          )
                        }
                        className="
      w-full
      h-[42px]
      px-4
      rounded-xl
      border border-gray-300
      bg-white-common
      flex items-center justify-between
      gap-3
      text-sm
      font-medium
      text-gray-700
      shadow-sm
      hover:border-blue-400
      transition-all
      duration-200
      cursor-pointer
    "
                      >

                        <span
                          className="
        truncate
        text-left
        flex-1
      "
                        >
                          {
                            agentList.find(
                              (a) =>
                                a.agentId === agentFilter
                            )?.agentName || "All Agents"
                          }
                        </span>

                        <img
                          src={Arrow}
                          className={`
        w-4 h-4 shrink-0
        transition-transform duration-200
        ${openAgentDropdown
                              ? "rotate-180"
                              : ""
                            }
      `}
                        />

                      </button>


                      {/* DROPDOWN */}
                      {openAgentDropdown && (

                        <div
                          className="
        absolute
        top-[48px]
        left-0
        w-full
        bg-white-common
        border border-gray-200
        rounded-xl
        shadow-[0_10px_30px_rgba(0,0,0,0.12)]
        overflow-hidden
        z-[9999]
        animate-fadeIn
      "
                        >

                          <div
                            className="
          max-h-[240px]
          overflow-y-auto
        "
                          >

                            {/* ALL */}
                            <button
                              type="button"
                              onClick={() => {

                                setAgentFilter("");
                                setOpenAgentDropdown(false);

                              }}
                              className={`
            w-full
            px-4 py-3
            text-sm
            text-left
            transition-all
            duration-150
            hover:bg-blue-50
            cursor-pointer

            ${agentFilter === ""
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-gray-700"
                                }
          `}
                            >
                              All Agents
                            </button>


                            {/* AGENTS */}
                            {agentList.map((agent) => (

                              <button
                                key={agent.agentId}
                                type="button"
                                onClick={() => {

                                  setAgentFilter(
                                    agent.agentId
                                  );

                                  setOpenAgentDropdown(
                                    false
                                  );

                                }}
                                className={`
              w-full
              px-4 py-3
              text-sm
              text-left
              transition-all
              duration-150
              hover:bg-blue-50
              cursor-pointer
              break-words

              ${agentFilter ===
                                    agent.agentId
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-gray-700"
                                  }
            `}
                              >
                                {agent.agentName}
                              </button>

                            ))}

                          </div>

                        </div>

                      )}

                    </div>
                    <div className="flex items-end gap-3">

                      <div className="flex flex-col">

                        <label className="text-xs text-gray-500 mb-1 text-left">
                          Select Date Range
                        </label>

                        <RangePicker

                          value={dateRange}
                          onChange={(dates) => setDateRange(dates)}
                          format="DD-MM-YYYY"
                          className="h-[38px] rounded-lg"
                        />

                      </div>

                      <button
                        onClick={handleExport}
                        className="
          btn-primary
          h-[38px]
          px-5
          rounded-lg
          text-sm
          flex
          items-center
          gap-2
          shadow-sm
        "
                      >
                        ⬇ Export
                      </button>

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
                        value={searchText}
                        // onChange={(e) => {
                        //   setSearchText(e.target.value);
                        //   setPage(1);
                        // }}
                        onChange={(e) => {
                          const value = e.target.value;

                          setSearchText(value);

                          setPage(1);
                        }}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-medium leading-[150%] w-56"
                      />
                    </div>

                  </div>

                </div>






                <div
                  className="card-common flex-col-layout relative z-[1]"
                  style={{
                    overflow: 'visible',
                    maxHeight: 'calc(100vh - 230px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >

                  <div
                    className="
    table-scroll
    relative
    overflow-auto
    max-h-[420px]
    rounded-2xl
  "
                  >

                    <table className="w-max min-w-full table-fixed text-sm text-left">

                      <thead className="table-header sticky top-0 z-[50]">

                        <tr>

                          {/* Sticky ID */}
                          <th className="table-sticky-head px-4 py-3 w-[80px]">
                            ID
                          </th>

                          {/* Sticky Name */}
                          <th className="px-4 py-3 sticky left-[80px] bg-[#F8F9FF] z-80 w-[180px] min-w-[180px]">
                            Name
                          </th>
                          <th className="px-4 py-3 w-[120px] text-left">
                            Status
                          </th>
                          <th className="px-4 py-3 w-[150px] whitespace-nowrap">
                            SubActiveDays
                          </th>
                          <th className="px-4 py-3 w-[150px] whitespace-nowrap">
                            Expiry On
                          </th>
                          <th className="px-4 py-3 w-[150px] whitespace-nowrap">
                            Mobile.No
                          </th>
                          <th className="px-4 py-3 w-[150px] whitespace-nowrap">
                            Email
                          </th>

                          <th className="px-4 py-3 w-[150px] whitespace-nowrap">
                            Created On
                          </th>





                          <th className="px-1 py-3 w-[100px] whitespace-nowrap">
                            Last Action
                          </th>

                          <th className="px-4 py-3 w-[120px] text-center">
                            PlatForm
                          </th>
                          <th className="px-4 py-3 w-[120px] text-left whitespace-nowrap">
                            Relational Agent
                          </th>


                          {/* <th className="px-4 py-3 w-[120px] text-center">
                          Actions
                        </th> */}
                          <th
                            className="
    px-4 py-3
    w-[120px]
    text-center

    sticky
    right-0

    bg-[#F8F9FF]

    z-[90]

  
  "
                          >
                            Actions
                          </th>

                        </tr>
                      </thead>

                      {/* ================= BODY ================= */}

                      <tbody className="divide-y divide-gray-200">

                        {loading ? (

                          // [...Array(pageSize || 8)].map((_, index) => (
                          [...Array(hostels?.sizePerPage || pageSize)].map((_, index) => (
                            <tr key={index} className="animate-pulse">

                              {/* Sticky ID */}
                              <td className="px-4 py-2 sticky bg-white-common z-30 w-[80px]">
                                <div className="h-4 w-6 bg-gray-200 rounded"></div>
                              </td>

                              {/* Sticky Name */}
                              <td className="px-4 py-2 sticky left-[80px] bg-white-common z-30 w-[260px]">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                  <div className="flex flex-col gap-2">
                                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                              </td>

                              <td className="px-4 py-2 text-center">
                                <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto"></div>
                              </td>

                              <td className="px-4 py-2 text-center">
                                <div className="flex justify-center gap-3">
                                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                </div>
                              </td>

                            </tr>
                          ))

                        ) : (

                          displayData?.map((item, index) => (

                            <tr key={item.hostelId} className="group hover:bg-gray-50 text-[13px]">


                              <td className="px-4 py-2 sticky left-0 bg-white-common z-30 w-[80px] group-hover:!bg-gray-50">

                                {(hostels?.currentPage - 1) * hostels?.sizePerPage + index + 1}
                              </td>


                              {/* <td className="px-4 py-2 sticky left-[80px] bg-white-common z-30 w-[260px] group-hover:!bg-gray-50">

                              <div
                                className="flex items-center gap-3 cursor-pointer"
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setTooltip({
                                    visible: true,
                                    text: item.fullAddress || "No Address",
                                    x: rect.left,
                                    y: rect.bottom + 6,
                                  });
                                }}
                                onMouseLeave={() =>
                                  setTooltip((prev) => ({ ...prev, visible: false }))
                                }
                              >
                                {item?.isTrial !== false && (
                                  <div className="flex border rounded-full w-5 h-5 items-center justify-center text-[9px] font-medium text-gray-600">
                                    T
                                  </div>
                                )}

                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-semibold uppercase">
                                  {item.hostelImage ? (
                                    <img
                                      src={item.hostelImage}
                                      alt="hostel"
                                      className="w-9 h-9 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-semibold uppercase">
                                      {item.initials || "NA"}
                                    </div>
                                  )}
                                </div>

                                <div
                                  className="flex flex-col truncate"
                                  onClick={() => handlePropertyClick(item)}
                                >
                                  <span
  className="text-gray-900 font-semibold truncate w-[180px] block"
  title={item.hostelName}
>
  {item.hostelName}
</span>
                                  <span className="text-gray-500 text-xs truncate">
                                    {item.ownerInfo?.fullName}
                                  </span>
                                </div>

                              </div>

                            </td> */}
                              <td className="px-4 py-2 sticky left-[80px] bg-white-common z-30 w-[180px] min-w-[180px] max-w-[180px] group-hover:!bg-gray-50">
                                <div
                                  className="flex items-center gap-3 cursor-pointer w-full overflow-hidden"
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltip({
                                      visible: true,
                                      text: item.fullAddress || "No Address",
                                      x: rect.left,
                                      y: rect.bottom + 6,
                                    });
                                  }}
                                  onMouseLeave={() =>
                                    setTooltip((prev) => ({ ...prev, visible: false }))
                                  }
                                >
                                  {item?.isTrial !== false && (
                                    <div className="flex border rounded-full w-5 h-5 items-center justify-center text-[9px] font-medium text-gray-600 shrink-0">
                                      T
                                    </div>
                                  )}

                                  <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-gray-200">
                                    {item.hostelImage ? (
                                      <img
                                        src={item.hostelImage}
                                        alt="hostel"
                                        className="w-7 h-7 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-semibold uppercase">
                                        {item.initials || "NA"}
                                      </div>
                                    )}
                                  </div>

                                  <div
                                    className="flex flex-col flex-1 min-w-0"
                                    onClick={() => handlePropertyClick(item)}
                                  >
                                    <span
                                      className="font-semibold text-gray-900 truncate"
                                      title={item.hostelName}
                                    >
                                      {item.hostelName}
                                    </span>

                                    <span
                                      className="text-gray-500 text-xs truncate"
                                      title={item.ownerInfo?.fullName}
                                    >
                                      {item.ownerInfo?.fullName}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span
                                  className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap w-fit mx-auto ${item.subscriptionIsActive
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                    }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${item.subscriptionIsActive
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                      }`}
                                  ></span>
                                  {item.subscriptionIsActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                {item.noOfdaysSubscriptionActive || "----"}
                              </td>
                              <td className="px-4 py-2">
                                {item.expiredOn || item.expiringAt || "----"}
                              </td>

                              <td className="px-4 py-2 whitespace-nowrap">
                                {item.ownerInfo?.mobile}
                              </td>
                              {/* <td className="px-4 py-2 whitespace-nowrap">
                              {item.ownerInfo?.emailId}
                            </td> */}
                              <td className="px-4 py-2 w-[100px] min-w-[100px] max-w-[100px]">
                                <div
                                  className="truncate"
                                  title={item.ownerInfo?.emailId}
                                >
                                  {item.ownerInfo?.emailId || "----"}
                                </div>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {item?.joinedOn}
                              </td>





                              {/* <td className="px-1 py-2">
  <div className="flex flex-col">
    <span>{item.lastUpdateDate}</span>
    <span>{item.lastUpdateTime}</span>
  </div>
</td> */}
                              <td className="px-1 py-2">
                                {item.lastUpdateDate || item.lastUpdateTime ? (
                                  <div className="flex flex-col">
                                    <span>{item.lastUpdateDate || "----"}</span>
                                    <span>{item.lastUpdateTime || "----"}</span>
                                  </div>
                                ) : (
                                  "----"
                                )}
                              </td>

                              <td className="px-4 py-2 text-center">
                                {item.platform || "----"}
                              </td>
                              {/* <td
  className="
    px-4
    py-2
    text-center
    text-left
    whitespace-nowrap
  "
>

  {item?.relationalAgents?.[0]?.agentId ? (

    <span
      onClick={() =>
        navigate(
          `/iam-user/${item.relationalAgents[0].agentId}`
        )
      }
      className="
        text-blue-600
        cursor-pointer
        hover:underline
        font-medium
      "
    >
      {item.relationalAgents[0].agentName}
    </span>

  ) : (

    "----"

  )}

</td> */}
                              <td
                                className="
    px-4
    py-2
    text-left
  "
                              >
                                {item?.relationalAgents?.[0]?.agentId ? (
                                  <div
                                    className="w-[120px] truncate text-blue-600 cursor-pointer hover:underline font-medium"
                                    title={item?.relationalAgents?.[0]?.agentName || "N/A"}
                                    onClick={() =>
                                      navigate(`/iam-user/${item.relationalAgents[0].agentId}`)
                                    }
                                  >
                                    {item?.relationalAgents?.[0]?.agentName || "N/A"}
                                  </div>
                                ) : (
                                  "----"
                                )}
                              </td>


                              <td
                                className="
    px-4 py-2
    text-center

    sticky
    right-0

    bg-white-common

    z-[10]

    group-hover:!bg-gray-50
  "
                              >

                                <div className="flex items-center justify-center gap-2">

                                  <img
                                    src={noteAdd}
                                    alt="noteAdd"
                                    className="w-5 h-5 cursor-pointer"
                                  />

                                  <div className="static">

                                    <button
                                      //       onClick={(e) => {

                                      //   e.stopPropagation();

                                      //   const rect =
                                      //     e.currentTarget.getBoundingClientRect();

                                      //   const viewportHeight =
                                      //     window.innerHeight;

                                      //   const viewportWidth =
                                      //     window.innerWidth;

                                      //   const menuWidth = 180;

                                      //   const menuHeight = 100;

                                      //   const spaceBelow =
                                      //     viewportHeight - rect.bottom;

                                      //   const spaceRight =
                                      //     viewportWidth - rect.right;

                                      //   setMenuPosition({

                                      //   top:
                                      //     spaceBelow < menuHeight
                                      //       ? rect.top - menuHeight + window.scrollY
                                      //       : rect.bottom + 8 + window.scrollY,

                                      //   left:
                                      //     spaceRight < menuWidth
                                      //       ? rect.left - menuWidth + window.scrollX
                                      //       : rect.right - menuWidth + window.scrollX,

                                      // });

                                      //   setOpenMenu(
                                      //     openMenu === item.hostelId
                                      //       ? null
                                      //       : item.hostelId
                                      //   );

                                      // }}
                                      onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();

                                        const menuWidth = 160;
                                        const menuHeight = 180;
                                        const gap = 5;
                                        const padding = 10;

                                        const spaceBelow =
                                          window.innerHeight - rect.bottom;

                                        const spaceAbove = rect.top;

                                        let top;


                                        if (spaceBelow >= menuHeight + padding) {
                                          top = rect.bottom + gap;
                                        }


                                        else if (spaceAbove >= menuHeight + padding) {
                                          top = rect.top - menuHeight - gap;
                                        }


                                        else {
                                          top = Math.max(
                                            padding,
                                            Math.min(
                                              rect.bottom + gap,
                                              window.innerHeight - menuHeight - padding
                                            )
                                          );
                                        }


                                        let left = rect.right - menuWidth;


                                        left = Math.max(
                                          padding,
                                          Math.min(
                                            left,
                                            window.innerWidth - menuWidth - padding
                                          )
                                        );

                                        setMenuPosition({
                                          top,
                                          left,
                                        });

                                        setOpenMenu(
                                          openMenu === item.hostelId
                                            ? null
                                            : item.hostelId
                                        );
                                      }}
                                    >

                                      <img
                                        src={Circle}
                                        alt="circle"
                                        className={`
            w-5 h-5 transition-transform duration-150 cursor-pointer
            ${openMenu === item.hostelId
                                            ? "scale-110"
                                            : ""
                                          }
          `}
                                      />

                                    </button>

                                    {openMenu === item.hostelId &&
                                      createPortal(
                                        <div
                                          ref={menuRef}
                                          style={{
                                            position: "fixed",
                                            top: menuPosition.top,
                                            left: menuPosition.left,
                                            width: "160px",
                                            maxHeight: "240px",
                                            background: "white",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "16px",
                                            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                                            overflow: "hidden",
                                            zIndex: 999999,
                                          }}
                                        >

                                          <button
                                            disabled={!canWrite}
                                            onClick={async () => {
                                              setSelectedHostelId(item.hostelId);

                                              await fetchHostelNotes(
                                                item.hostelId
                                              );

                                              setShowNoteModal(true);
                                              setOpenMenu(null);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${canWrite
                                                ? "hover:bg-gray-50 cursor-pointer"
                                                : "opacity-50 cursor-not-allowed"
                                              }`}
                                          >
                                            Add Notes
                                          </button>

                                         <button
  disabled={!canWrite}
 onClick={() => handleUpdateStatusClick(item)}
  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
    canWrite
      ? "hover:bg-gray-50 cursor-pointer"
      : "opacity-50 cursor-not-allowed"
  }`}
>
  Update Status
</button>

                                          <button
                                            disabled={!canWriteExpenses}
                                            onClick={() => {
                                              setSelectedHostelId(item.hostelId);
                                              setShowResetModal(true);
                                              setOpenMenu(null);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${canWriteExpenses
                                                ? "hover:bg-gray-50 cursor-pointer"
                                                : "opacity-50 cursor-not-allowed"
                                              }`}
                                          >
                                            Reset Expense
                                          </button>

                                          <button
                                            disabled={!canDelete}
                                            onClick={() => {
                                              setDeleteHostelId(item.hostelId);
                                              setShowDeleteModal(true);
                                              setOpenMenu(null);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${canDelete
                                                ? "hover:bg-gray-50 cursor-pointer"
                                                : "opacity-50 cursor-not-allowed"
                                              }`}
                                          >
                                            Delete
                                          </button>

                                        </div>,
                                        document.body
                                      )}

                                  </div>



                                </div>

                              </td>

                            </tr>

                          ))

                        )}
                        {!loading && displayData?.length === 0 && (

                          <tr>

                            <td
                              colSpan={8}
                              className="
        text-center
        py-10
        text-gray-400
        text-sm
        font-medium
      "
                            >
                              No Data Found
                            </td>

                          </tr>

                        )}


                      </tbody>

                    </table>


                    {tooltip.visible && (
                      <div
                        className="tooltip-common"
                        style={{
                          left: tooltip.x,
                          top: tooltip.y,
                        }}
                      >
                        {tooltip.text}
                      </div>
                    )}

                  </div>

                </div>

                <div className="flex-between px-4 py-1 text-sm bg-white-common">

                  {/* Total Count */}
                  <span className="text-muted">
                    Total Record Count :{" "}
                    <span className="text-primary">
                      {/* {pageSize} */}
                      {/* {hostels?.totalHostels} */}
                      {displayData?.length || 0}
                    </span>
                  </span>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-4">

                    {/* Page Size */}
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="border rounded-md px-2 py-1 text-sm cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>


                    <button
                      disabled={hostels?.currentPage <= 1}
                      onClick={() => setPage(prev => prev - 1)}
                      className={`
    px-2
    py-1
    rounded

    ${hostels?.currentPage <= 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-textDark hover:bg-cardBg cursor-pointer"
                        }
  `}
                    >
                      &#8249;
                    </button>


                    <span
                      className="
    border
    border-borderSoft
    px-3
    py-1
    rounded-card
    bg-cardBg
    text-cardTitle
    font-medium
  "
                    >
                      {hostels?.currentPage}
                    </span>

                    {/* TOTAL */}
                    <span className="text-textDark/60 text-cardTitle">
                      {hostels?.currentPage ?? 1} - {hostels?.totalPages ?? 1}
                    </span>

                    {/* NEXT */}
                    <button
                      disabled={
                        hostels?.currentPage >= hostels?.totalPages
                      }
                      onClick={() => setPage(prev => prev + 1)}
                      className={`
    px-2
    py-1
    rounded

    ${hostels?.currentPage >= hostels?.totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-textDark hover:bg-cardBg cursor-pointer"
                        }
  `}
                    >
                      &#8250;
                    </button>


                  </div>
                </div>


              </div>
              {/* // )

            // } */}
            </>

          )}

        {/* {showNoteModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => {
              setShowNoteModal(false);
              setNoteText("");
              setHostelError("");
            }}
          >

            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText("");
                  setHostelError("");
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-left">
                Enter Hostel ID
              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Enter Hostel ID"
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value);
                    setHostelError("");
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />

                {hostelerror && (
                  <ErrorMessage message={hostelerror} type="error" />
                )}

                <button
                  onClick={handleHardReset}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  Submit
                </button>

              </div>

            </div>
          </div>
        )} */}
        {showResetModal && (

          <div
            className="
      fixed inset-0
      bg-black/40

      flex
      items-center
      justify-center

      z-[99999]
    "
            onClick={() => {
              setShowResetModal(false);
              setOpenMenu(false);
              setMenuError("");
            }}
          >

            <div
              className="
        bg-white-common
        rounded-2xl
        shadow-2xl

        w-[420px]
        max-w-[90%]

        p-8
        text-center

        animate-fadeIn
      "
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="text-xl font-semibold mb-3">
                Reset Expense?
              </h2>

              <p className="text-gray-500 mb-8">
                Are you sure you want to reset this expense?
              </p>

              {menuError && (
                <ErrorMessage
                  message={menuError}
                  type="error"
                />
              )}

              <div className="flex justify-center gap-4 mt-1">

                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setOpenMenu(false);
                    setMenuError("");
                  }}
                  className="
            px-6
            py-3
            rounded-lg
            border
            border-blue-500
            text-blue-600
            hover:bg-blue-50
            transition-all
          "
                >
                  Cancel
                </button>

                <button
                  onClick={handleResetExpense}
                  className="
            px-6
            py-3
            rounded-lg
            bg-blue-600
            text-white
            hover:bg-blue-700
            transition-all
          "
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}
        {showTrialPopup && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-80"
            onClick={() => setShowTrialPopup(false)}
          >
            <div
              className="bg-white-common rounded-2xl shadow-xl w-[380px] p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Extend Trial
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to extend the trial?
              </p>
              {planError && (
                <ErrorMessage message={planError} type="error" />
              )}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowTrialPopup(false)}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleCreateSubscription(selectedItem)}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (

          <div
            className="
      fixed inset-0
      bg-black/40

      flex
      items-center
      justify-center

      z-[99999]
    "
            onClick={() => {
              setShowDeleteModal(false);
              setMenuError("");
            }}
          >

            <div
              className="
        bg-white-common
        rounded-2xl
        shadow-2xl

        w-[380px]
        max-w-[90%]

        p-7
        text-center

        animate-fadeIn
      "
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="text-[22px] font-semibold text-gray-800 mb-3">
                Delete Hostel?
              </h2>

              <p className="text-gray-500 text-[15px] leading-6 mb-7">
                Are you sure you want to delete this hostel?
              </p>

              {menuError && (
                <ErrorMessage
                  message={menuError}
                  type="error"
                />
              )}

              <div className="flex justify-center gap-4">

                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMenuError("");
                  }}
                  className="
            min-w-[110px]
            px-5
            py-3

            rounded-xl

            border
            border-gray-300

            text-gray-700
            font-medium

            hover:bg-gray-50

            transition-all
            duration-200

            cursor-pointer
          "
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteHostel}
                  disabled={isDeleting}
                  className={`
            min-w-[110px]
            px-5
            py-3

            rounded-xl

            text-white
            font-medium

            transition-all
            duration-200

            ${isDeleting
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                    }
          `}
                >
                  {isDeleting
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            </div>

          </div>

        )}
        <AssignStaffModal
          show={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          selectedHostel={selectedHostel}
          setModalType={setModalType}
          setMessage={setMessage}
          setShowSuccess={setShowSuccess}
          refreshData={() => getHostels(page, pageSize, searchText)}
        />
        {showNoteModal && (
          <div className="fixed inset-0 z-[9999]">

            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeNotesDrawer}
            />

            <div
              className="
        fixed
        top-3
        right-3
        bottom-3
        w-[420px]
        bg-white-common
        rounded-2xl
        shadow-2xl
        flex
        flex-col
        overflow-hidden
      "
            >

              {/* Header */}

              <div
                className="
          flex
          justify-between
          items-center
          px-5
          py-4
          border-b
        "
              >

                <h2
                  className="
            text-[16px]
            font-semibold
          "
                >
                  Internal Notes
                </h2>

                <button
                  onClick={closeNotesDrawer}
                  className="
            text-red-500
            text-lg
            cursor-pointer
          "
                >
                  ✕
                </button>

              </div>

              <div
                className="
          flex-1
          flex
          flex-col
          px-5
          py-4
          overflow-hidden
        "
              >

                <label
                  className="
            text-xs
            text-gray-500
            mb-2
            text-left
          "
                >
                  Additional Notes
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div
                  className="
            border
            border-gray-300
            rounded-xl
            p-3
          "
                >

                  <textarea
                    placeholder="Note here"
                    value={noteText}
                    onChange={(e) => {

                      setNoteText(
                        e.target.value
                      );

                      setHostelError("");

                    }}
                    className="
              w-full
              h-24
              resize-none
              outline-none
              text-sm
            "
                  />

                </div>

                {hostelError && (
                  <div className="mt-2">
                    <ErrorMessage
                      message={hostelError}
                      type="error"
                    />
                  </div>
                )}

                <div
                  className="
            flex
            justify-end
            mt-3
          "
                >

                  <button
                    onClick={handleAddNote}
                    disabled={isAddingNote}
                    className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-2
              rounded-lg
              text-sm cursor-pointer
            "
                  >
                    {isAddingNote
                      ? "Saving..."
                      : "Add"}
                  </button>

                </div>

                <p
                  className="
            text-[11px]
            text-gray-400
            mt-5
            mb-3
            text-left
          "
                >
                  ALL NOTES
                </p>

                <div
                  className="
            flex-1
            overflow-y-auto
            pr-1
          "
                >

                  <div className="space-y-5">

                    {hostelNotes?.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="
                  flex
                  gap-3
                "
                        >

                          <div
                            className="
                    flex
                    flex-col
                    items-center
                  "
                          >

                            <div
                              className="
                      w-9
                      h-9
                      rounded-full
                      bg-[#EEF3FF]
                      flex
                      items-center
                      justify-center
                    "
                            >
                              <img src={CommentBox} className="w-4 h-4" />
                            </div>

                            {index !==
                              hostelNotes.length - 1 && (

                                <div
                                  className="
                        w-[1px]
                        flex-1
                        bg-gray-200
                        mt-1
                      "
                                />

                              )}

                          </div>

                          <div className="flex-1">

                            <p
                              className="
                      text-sm
                      font-semibold
                      text-left
                    "
                            >
                              {item.notes}
                            </p>

                            <p
                              className="
                      text-xs
                      text-gray-500
                      mt-1
                      text-left
                    "
                            >
                              {item.createdAtDate}
                              {" "}
                              {item.createdAtTime}
                            </p>

                            <p
                              className="
                      text-xs
                      text-gray-400
                      mt-2
                      text-left
                    "
                            >
                              Added by
                              {" "}
                              {item.createdBy}
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
{showUpdateStatusModal && (
  <div
    className="fixed inset-0 z-[999999] bg-black/50"
    onClick={() => setShowUpdateStatusModal(false)}
  >
    <div
      className="
        fixed
        top-4
        right-4
        bottom-4
        w-[525px]
        bg-white
        rounded-2xl
        shadow-2xl
        overflow-hidden
        flex
        flex-col
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
        <h2 className="text-[16px] font-semibold text-[#222]">
          Update Status
        </h2>

        <button
          type="button"
          onClick={() => setShowUpdateStatusModal(false)}
          className="
            w-6
            h-6
            rounded-full
            border
            border-[#444]
            flex
            items-center
            justify-center
            text-[13px]
            text-[#333]
            cursor-pointer
            hover:bg-gray-100
          "
        >
          ×
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto px-5 py-4">

        {/* PROPERTY INFO */}
        <div className="bg-[#F8F9FB] px-3 py-3 rounded-sm mb-4">

          <p className="text-[11px] font-semibold text-[#667085] mb-3 text-left">
            PROPERTY INFO
          </p>

          <div className="space-y-2 text-[11px] text-left">

            <div className="flex">
              <span className="w-[115px] text-[#667085]">
                ♙ Customer Name
              </span>

              <span className="font-semibold text-[#333]">
                {selectedHostel?.ownerInfo?.fullName || "N/A"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[115px] text-[#667085]">
                ♧ Property Name
              </span>

              <span className="font-semibold text-blue-600">
                {selectedHostel?.hostelName || "N/A"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[115px] text-[#667085]">
                ♧ Location
              </span>

              <span className="font-semibold text-[#333]">
                {selectedHostel?.location || "N/A"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[115px] text-[#667085]">
                ♧ Mobile
              </span>

              <span className="font-semibold text-[#333]">
                {selectedHostel?.ownerInfo?.mobile || "N/A"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[115px] text-[#667085]">
                ◷ Current Status
              </span>

              <span className="font-semibold text-[#333]">
                {latestdata?.latestStatus || "N/A"}
              </span>
            </div>
            <div className="flex">
              <span className="w-[115px] text-[#667085]">
                ◷ Current Reason
              </span>

              <span className="font-semibold text-[#333]">
                {latestdata?.latestReason || "N/A"}
              </span>
            </div>

          </div>
        </div>

        {/* UPDATE STATUS */}
     <div className="grid grid-cols-[145px_1fr] gap-3 items-start mb-4">

  <label className="text-[11px] text-[#333] pt-2 text-start whitespace-nowrap">
    Update Status
  </label>

  <div>
    <select
      value={updateStatus}
      onChange={(e) => {
        setUpdateStatus(e.target.value);
        setUpdateReason("");
        setStatusError("");
      }}
      className="
        w-full
        h-[42px]
        border
        border-[#D9DDE5]
        rounded-lg
        px-3
        text-[13px]
        text-[#444]
        outline-none
        focus:border-blue-500
        bg-white
      "
    >
      <option value="">Select Status</option>

      {followUpStatuses.map((status) => (
        <option
          key={status.key}
          value={status.key}
        >
          {status.value}
        </option>
      ))}
    </select>

    {statusError && (
      <ErrorMessage
        message={statusError}
        type="error"
      />
    )}
  </div>

</div>

     
   <div className="grid grid-cols-[145px_1fr] gap-3 items-start mb-4">

  <label className="text-[11px] text-[#333] pt-2 text-left">
    Reason <span className="text-red-500">*</span>
  </label>

  <div>
    <select
      value={updateReason}
      onChange={(e) => {
        setUpdateReason(e.target.value);
        setReasonError("");
      }}
      disabled={!updateStatus}
      className="
        w-full
        h-[42px]
        border
        border-[#D9DDE5]
        rounded-lg
        px-3
        text-[13px]
        text-[#444]
        outline-none
        focus:border-blue-500
        bg-white
        disabled:bg-gray-100
        disabled:cursor-not-allowed
      "
    >
      <option value="">Select Reason</option>

      {followUpStatuses
        ?.find(
          (status) => status?.key === updateStatus
        )
        ?.reasons?.map((reason) => (
          <option
            key={reason}
            value={reason}
          >
            {reason}
          </option>
        ))}
    </select>

    {reasonError && (
      <ErrorMessage
        message={reasonError}
        type="error"
      />
    )}
  </div>

</div>

          
<div className="grid grid-cols-[145px_1fr] gap-3 items-center mb-4">

  <label className="text-[11px] text-[#333] text-left whitespace-nowrap">Additional Comments</label>

  <textarea
    value={additionalComments}
    onChange={(e) => setAdditionalComments(e.target.value)}
    placeholder="..."
    className="
      w-full
      h-[42px]
      border
      border-[#D9DDE5]
      rounded-lg
      px-3
      py-2
      text-[13px]
      outline-none
      resize-none
      focus:border-blue-500
    "
  />

</div>

        <div
        className="
          border-t
          border-[#E5E7EB]
          px-5
          py-4
          flex
          justify-end
          items-center
          gap-8
          shrink-0
          bg-white
        "
      >

        <button
          type="button"
          onClick={() =>
            setShowUpdateStatusModal(false)
          }
          className="
            text-[12px]
            text-[#444]
            cursor-pointer
            hover:text-black
          "
        >
          Cancel
        </button>

        <button
          onClick={handleUpdateStatus}
          type="button"
          className="
            h-[36px]
            w-[122px]
            rounded-lg
            bg-[#2952F3]
            text-white
            text-[12px]
            font-medium
            cursor-pointer
            hover:bg-[#1F45D8]
          "
        >
          Submit
        </button>

      </div>
        <div className="mt-5">

          <div className="flex items-center justify-between mb-2">

            <h3 className="text-[14px] font-semibold text-[#222]">
              Follow-Up History
            </h3>

            <span className="text-[11px] text-[#6B7280]">
              {followUpHistory.length} Records
            </span>

          </div>

          {/* FIXED HEIGHT HISTORY */}
          <div className="h-[150px] overflow-y-auto pr-1 space-y-2">

            {followUpHistory.length > 0 ? (

              followUpHistory.map((item, index) => (

                <div
                  key={item.followUpId || index}
                  className="
                    border
                    border-[#E5E7EB]
                    rounded-xl
                    p-2.5
                    bg-white
                  "
                >

                  {/* STATUS + DATE */}
                  <div className="flex items-center justify-between mb-1">

                    <span className="text-[12px] font-semibold text-[#374151]">
                      {item.status}
                    </span>

                    <span className="text-[10px] text-[#6B7280]">
                      {item.createdAtDate}{" "}
                      {item.createdAtTime}
                    </span>

                  </div>

                  {/* REASON */}
                  <div className="text-[11px] text-[#6B7280] mb-1">

                    <span className="font-medium text-[#374151]">
                      Reason:
                    </span>{" "}

                    {item.reason}

                  </div>

                
                  <div className="bg-[#F8F9FB] rounded-lg px-2 py-1.5 text-[11px] text-[#4B5563]">
                    {item.comments || "No comments"}
                  </div>

                  {/* CREATED BY */}
                  <div className="mt-1 text-[10px] text-[#6B7280]">

                    Created by:{" "}

                    <span className="font-medium text-[#374151]">
                      {item.createdBy}
                    </span>

                  </div>

                </div>

              ))

            ) : (

              <div
                className="
                  h-full
                  flex
                  items-center
                  justify-center
                  text-[12px]
                  text-[#9CA3AF]
                  border
                  border-dashed
                  border-[#D1D5DB]
                  rounded-xl
                "
              >
                No follow-up history found
              </div>

            )}

          </div>

        </div>

      </div>

     
     

    </div>
  </div>
)}
      </DashboardLayout>
    </>
  );
};

export default Properties;
