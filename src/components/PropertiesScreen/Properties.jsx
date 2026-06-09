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
import LoginImg from "../../assets/LoginImg.png";
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


const Properties = () => {
  const { hostels, getHostels, loading, getHostelById, hardResetHostel, errorMsg, accessError, deleteHostelExpense, exportHostels, deleteHostel } = useHostel();
  const { createSubscription,getAgentsDropdown } = useSubscription();
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
  // const [page, setPage] = useState(1);
  // const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  // const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(
  location.state?.currentPage || 1
);

// const [searchText, setSearchText] = useState(
//   location.state?.currentSearch || ""
// );
const locationSearch =
  location.state?.currentSearch;

// const [searchText, setSearchText] = useState(
//   locationSearch ?? ""
// );
const [searchText, setSearchText] = useState(
  sessionStorage.getItem("propertiesSearch") || ""
);

const [statusFilter, setStatusFilter] = useState(
  sessionStorage.getItem("propertiesStatus") || ""
);

const [dateRange, setDateRange] = useState(() => {

  const stored =
    sessionStorage.getItem("propertiesDate");

  if (!stored) return [];

  const parsed = JSON.parse(stored);

  return [
    dayjs(parsed[0]),
    dayjs(parsed[1]),
  ];

});
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
  const [hostelerror, setHostelError] = useState("")
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
    subActive
  );

}, [
  page,
  pageSize,
  debouncedSearch,
  dateRange,
  statusFilter
]);


  console.log("hostels", hostels);



  let displayData = hostels?.hostels || [];

 



  const handlePropertyClick = async (item) => {
    const res = await getHostelById(item.hostelId);

    if (res?.success) {
      // navigate(`/property-overview/${item.hostelId}`, {
      //   state: {
      //     hostelData: res.data,
      //     trialPlan: item
      //   }
      // });
      navigate(`/property-overview/${item.hostelId}`, {
  state: {
    hostelData: res.data,
    trialPlan: item,

    currentPage: page,
    currentSearch: searchText,
    currentDateRange: dateRange,
    currentStatusFilter: statusFilter,
  }
});
    }
  };

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
    subActive
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

  return (
    <>

      <DashboardLayout>

        {(canRead === false || accessError === "Access Restricted") ? (

          <div className="flex-center-col h-[400px] gap-4">

            <img
              src={LoginImg}
              alt="Access Restricted"
              className="w-64 object-contain"
            />

           <p className="error-title">
              {accessError}
            </p>

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

  {/* CARD 1 */}

  <div
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Active Properties
      </p>

      <div className="flex items-center text-left gap-2 mt-2">

        <h2 className="text-2xl text-[20px] font-bold text-gray-800 leading-none">
          {hostels?.activeHostels}
        </h2>

        <span className="badge-primary">
          ↑ 12%
        </span>

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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Used Today
      </p>

      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
        65
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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Used 1-7 Days
      </p>

      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
        64
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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Used Last 8-14 Days
      </p>

      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
        65
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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Inactive 15-30 Days
      </p>

      <div className="flex items-center gap-2 mt-2">

        <h2 className="text-2xl text-[20px] font-bold text-gray-800 leading-none">
          12
        </h2>

        <span className="badge-primary">
          ↑ 12%
        </span>

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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Inactive 30+ Days
      </p>

      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
        24
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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Never Used
      </p>

      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
        22
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
    className="
      card-common
      flex items-start justify-between
      p-4 xl:p-5
      min-h-[90px]
    "
  >

    <div>

      <p className="text-[11px] text-gray-500 font-medium">
        Trial Expiring Soon
      </p>

      <h2 className="text-2xl text-[20px] font-bold text-gray-800 mt-2 leading-none">
        09
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


           <div className="sticky top-0 z-20 bg-white pb-4">

  <div
  className="
    flex
    items-end
    gap-4
    flex-wrap
    font-inter 
  "
>

    <div className="flex gap-3">

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

    </div>
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
      bg-white
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
        ${
          openAgentDropdown
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
        bg-white
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

            ${
              agentFilter === ""
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

              ${
                agentFilter ===
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
  className="
    card-common
    overflow-x-auto
    overflow-y-visible

    flex-col-layout

    max-h-[calc(100vh-230px)]

    relative
    z-[1]
  "
>

              <div
  className="
    scroll-container
    overflow-visible
    relative
  "
>

                 <table className="w-max min-w-full table-fixed text-sm text-left">

  <thead className="table-header sticky top-0 z-40">

                      <tr>

                        {/* Sticky ID */}
                       <th className="table-sticky-head px-4 py-3 w-[80px]">
                          ID
                        </th>

                        {/* Sticky Name */}
                        <th className="px-4 py-3 sticky left-[80px] bg-[#F8F9FF] z-80 w-[100px]">
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
                            <td className="px-4 py-2 sticky left-0 bg-white z-30 w-[80px]">
                              <div className="h-4 w-6 bg-gray-200 rounded"></div>
                            </td>

                            {/* Sticky Name */}
                            <td className="px-4 py-2 sticky left-[80px] bg-white z-30 w-[260px]">
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

                          
                            <td className="px-4 py-2 sticky left-0 bg-white z-30 w-[80px] group-hover:bg-gray-50">
                             
                              {(hostels?.currentPage - 1) * hostels?.sizePerPage + index + 1}
                            </td>

                            {/* Sticky Name */}
                            <td className="px-4 py-2 sticky left-[80px] bg-white z-30 w-[260px] group-hover:bg-gray-50">

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
                                  <span className="text-gray-900 font-semibold truncate">
                                    {item.hostelName}
                                  </span>
                                  <span className="text-gray-500 text-xs truncate">
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
                              {item.expiredOn || "----"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {item.ownerInfo?.mobile}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {item.ownerInfo?.emailId}
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
                             <td
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

</td>
                           

                        <td
  className="
    px-4 py-2
    text-center

    sticky
    right-0

    bg-white

    z-[50]

    group-hover:bg-gray-50

  
  "
>

  <div className="flex items-center justify-center gap-2">

    <img
      src={noteAdd}
      alt="noteAdd"
      className="w-5 h-5 cursor-pointer"
    />

    <div className="relative">

      <button
      onClick={(e) => {

  e.stopPropagation();

  const rect =
    e.currentTarget.getBoundingClientRect();

  const viewportHeight =
    window.innerHeight;

  const viewportWidth =
    window.innerWidth;

  const menuWidth = 180;

  const menuHeight = 120;

  const spaceBelow =
    viewportHeight - rect.bottom;

  const spaceRight =
    viewportWidth - rect.right;

  setMenuPosition({

    top:
      spaceBelow < menuHeight
        ? rect.top - menuHeight
        : rect.bottom - 12,

    left:
      spaceRight < menuWidth
        ? rect.left - menuWidth - 24
        : rect.right - menuWidth,

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
            ${
              openMenu === item.hostelId
                ? "scale-110"
                : ""
            }
          `}
        />

      </button>

      {openMenu === item.hostelId && (

        <div
          ref={menuRef}
 className="
  fixed
  w-[140px]

  bg-white
  border border-gray-200
  rounded-2xl

  shadow

  overflow-hidden

  z-[99999]
"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >

          <button
            onClick={() => {
              setSelectedHostelId(item.hostelId);
              setShowResetModal(true);
              setOpenMenu(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Reset Expense
          </button>

          <button
            onClick={() => {
              setDeleteHostelId(item.hostelId);
              setShowDeleteModal(true);
              setOpenMenu(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
          >
            Delete
          </button>

          {/* <button
            onClick={() => {
              setSelectedHostel(item);
              setShowAssignModal(true);
              setOpenMenu(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Assign Staff
          </button> */}

        </div>

      )}

    </div>

    {/* <img
      src={Money}
      onClick={() => {

        if (
          canWrite === true &&
          item?.canAddTrial === true
        ) {

          setSelectedItem(item);
          setShowTrialPopup(true);

        }

      }}
      alt="money"
      className={`
        w-5 h-5 transition-transform duration-150
        ${
          canWrite === true &&
          item?.canAddTrial === true
            ? "cursor-pointer hover:scale-110 active:scale-95"
            : "opacity-40 cursor-not-allowed"
        }
      `}
    /> */}

  </div>

</td>

                          </tr>

                        ))

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
              <div className="flex-between px-4 py-1 text-sm bg-white">

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

                  {/* Prev */}
                  {/* PREV */}
<button
  disabled={hostels?.currentPage <= 1}
  onClick={() => setPage(prev => prev - 1)}
  className={`
    px-2
    py-1
    rounded

    ${
      hostels?.currentPage <= 1
        ? "text-gray-300 cursor-not-allowed"
        : "text-textDark hover:bg-cardBg cursor-pointer"
    }
  `}
>
  &#8249;
</button>

{/* CURRENT PAGE */}
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

    ${
      hostels?.currentPage >= hostels?.totalPages
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
        bg-white
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
              className="bg-white rounded-2xl shadow-xl w-[380px] p-6 text-center"
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
        bg-white
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

            ${
              isDeleting
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
      </DashboardLayout>
    </>
  );
};

export default Properties;
