import React, { useState, useEffect, useContext } from "react";
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


const Properties = () => {
  const { hostels, getHostels, loading, getHostelById, hardResetHostel, errorMsg, accessError, deleteHostelExpense, exportHostels } = useHostel();
  const { createSubscription } = useSubscription();
  const { getPlansDropdown  } = usePlan();
  const [dropdownPlans, setDropdownPlans] = useState([]);
  const location = useLocation();
const { roleId } = useParams();

  useEffect(() => {
  getPlansDropdown().then((res) => {
    if (res?.success) {
      setDropdownPlans(res.data);
    }
  });
}, []);
console.log("dropdownPlans",dropdownPlans)
const skipApi = location.state?.skipApi;
  const { RangePicker } = DatePicker;
  const [skipFirstApi, setSkipFirstApi] = useState(location.state?.skipApi || false);
  const [dateRange, setDateRange] = useState([]);
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Hostels");
  console.log("canRead", canRead)
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
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
  const [trialPlan,setTrialPlan] = useState("")
  const [showTrialPopup, setShowTrialPopup] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [selectedTrialPlan, setSelectedTrialPlan] = useState("");
const [planError, setPlanError] = useState("");
const [showDropdown, setShowDropdown] = useState(false);
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



  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 2000);

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
  useEffect(() => {

  let start = "";
  let end = "";

  if (dateRange && dateRange.length === 2) {
    start = dateRange[0].format("DD-MM-YYYY");
    end = dateRange[1].format("DD-MM-YYYY");
  }

  getHostels(page, pageSize, debouncedSearch, start, end);

}, [page, pageSize, debouncedSearch, dateRange]);

  useEffect(() => {
    if (location.state?.skipApi) {
      navigate(location.pathname, { replace: true });
    }
  }, []);


  console.log("hostels", hostels);



  let displayData = hostels?.hostels || [];

  if (statusFilter) {
    displayData = displayData.filter(item =>
      statusFilter === "active"
        ? item.subscriptionIsActive
        : !item.subscriptionIsActive
    );
  }


  // let totalRecords =
  //   searchText.trim() !== "" || statusFilter !== ""
  //     ? displayData.length
  //     : hostels?.totalHostels || 0;

  // let totalPages = Math.ceil(totalRecords / pageSize) || 1;

  // const start = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  // const end = Math.min(page * pageSize, totalRecords);


  // const isNextDisabled = page >= totalPages - 1;
//   const handlePropertyClick = async (item) => {
// setTrialPlan(item)
//     const res = await getHostelById(item.hostelId);
//     console.log("res", res)
//     if (res?.success) {
//       navigate(`/property-overview/${item.hostelId}`, {
//         state: { hostelData: res.data,trialPlan }
//       });

//     }
//   };
const handlePropertyClick = async (item) => {
  const res = await getHostelById(item.hostelId);

  if (res?.success) {
    navigate(`/property-overview/${item.hostelId}`, {
      state: {
        hostelData: res.data,
        trialPlan: item  
      }
    });
  }
};
  // const handleExport = () => {
  //   if (!dateRange || dateRange.length !== 2) {
  //     console.log("Select date range");
  //     return;
  //   }

  //   const start = dateRange[0].format("DD-MM-YYYY");
  //   const end = dateRange[1].format("DD-MM-YYYY");

  //   exportHostels(searchText, start, end);
  // };
  const handleExport = () => {
    let start = "";
    let end = "";

    // date irundha mattum format pannum
    if (dateRange && dateRange.length === 2) {
      start = dateRange[0].format("DD-MM-YYYY");
      end = dateRange[1].format("DD-MM-YYYY");
    }

    exportHostels(searchText, start, end);
  };
  const handleCreateSubscription = async (item) => {

  if (!selectedTrialPlan) {
    setPlanError("Please select a plan");
    return;
  }

  const payload = {
    trialDays: 0,
    paidAmount: 0,
    discountAmount: 0,
    planCode: selectedTrialPlan   // ✅ முக்கியம்
  };

  const res = await createSubscription(
    item?.hostelId,
    payload
  );

  if (res?.success) {
    setShowTrialPopup(false); // close popup
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
//   const handleCreateSubscription = async (item) => {

//   const payload = {
//     // isTrial: item?.trialExtendable,
//     trialDays: 0,
//     paidAmount:0,
//     discountAmount:0,
  
//   };

//   const res = await createSubscription( 
//     item?.hostelId,
//     payload
//   );
// console.log("payload",payload)
//   if (res?.success) {
//     setModalType("success");
//     setMessage(res.message);
//     setShowSuccess(true);

//     getHostels(page, pageSize, searchText);

//     setTimeout(() => {
//       setShowSuccess(false);
//     }, 1000);

//   } else {
//     setMenuError(res?.message);
//     setModalType("error");
//     setMessage(res?.message);
//     setShowSuccess(true);

//     setTimeout(() => {
//       setShowSuccess(false);
//     }, 1000);
//   }
// };


// const handleCreateSubscription = async (item) => {

//    const payload = {
//     isTrial: true,
//     trialDays: 0,
//     paidAmount: Number(paidAmount || 0),
//     discountAmount: Number(discountAmount || 0)
//   };

//   await createSubscription(
//     trialPlan?.hostelId,
//     payload
    
//   );
//    if (res?.success) {

//       setModalType("success");
//       setMessage(res.message);
//       setShowSuccess(true);
//       getHostels(page, pageSize, searchText);
//       setTimeout(() => {
//         setShowSuccess(false);

//       }, 1000);
//     } else {
//       setMenuError(res.message)
//       setModalType("error");
//       setMessage(res.message);
//       setShowSuccess(true);

//       setTimeout(() => {
//         setShowSuccess(false);

//       }, 1000);
//     }
// };
  // const handleHardReset = async () => {

  //   if (!selectedHostel?.hostelId) return;

  //   const enteredId = noteText.trim();

  //   if (!enteredId) {
  //     setHostelError("Please Enter Hostel ID");
  //     return;
  //   }

  //   const res = await hardResetHostel(
  //     selectedHostel.hostelId,
  //     enteredId
  //   );

  //   if (res?.success) {
  //     setModalType("success");
  //     setMessage(res?.message);
  //     getHostels(page, pageSize, searchText);

  //     setShowNoteModal(false);
  //     setShowSuccess(true);
  //     setNoteText("");
  //     setHostelError("");

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1500);

  //   } else {
  //     setHostelError(res?.message || "Please Enter Valid Hostel ID");
  //   }
  // };
  //   const handleHardReset = async () => {
  //   if (!selectedHostel?.hostelId) return;

  //   const enteredId = noteText.trim();


  //   if (!enteredId) {
  //     setHostelError("Please Enter Hostel ID");
  //     return;
  //   }


  //   const res = await hardResetHostel(enteredId);

  //   if (res?.success) {
  //     setModalType("success");
  //     setMessage(res?.message);
  //     getHostels(page, pageSize, searchText);

  //     setShowNoteModal(false);
  //     setShowSuccess(true);
  //     setNoteText("");
  //     setHostelError("");

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1500);

  //   } else {
  //     setHostelError(res?.message || "Please Enter Valid Hostel ID");
  //   }
  // };
  // const handleHardReset = async () => {
  //   if (!selectedHostel?.hostelId) return;

  //   const enteredId = noteText.trim();
  //   const actualId = selectedHostel.hostelId;


  //   const res = await hardResetHostel(enteredId);

  //   if (res?.success) {
  //     setModalType("success");
  //     setMessage(res?.message);
  //     getHostels(page, pageSize, searchText);
  //     setShowNoteModal(false);
  //     setShowSuccess(true);
  //     setNoteText("");

  //   setTimeout(() => {
  //     setShowSuccess(false);
  //   }, 1500);

  //   } else {
  //     setHostelError(res?.message || "Please Enter Valid Hostel ID")
  //   }
  // };

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

  return (
    <>

      <DashboardLayout>

        {(canRead === false || accessError === "Access Restricted") ? (

          <div className="flex flex-col items-center justify-center h-[400px] gap-4">

            <img
              src={LoginImg}
              alt="Access Restricted"
              className="w-64 object-contain"
            />

            <p className="text-red-600 text-lg font-medium">
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


            <div className="flex flex-col h-full min-h-0">





              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold font-sans">Properties</h1>

                <button className="flex items-center gap-2 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-Inter">
                  <img src={AddBtn} alt="add" className="w-4 h-4 object-contain" />
                  Add Property
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border-gray-300">
                  <p className="text-gray-500 text-xs font-Gilroy">Total Properties</p>
                  <h2 className="text-2xl font-bold text-base mt-1 font-Gilroy">{hostels?.totalHostels}</h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border-gray-300">
                  <p className="text-gray-500 text-sm">Active Properties</p>
                  <h2 className="text-2xl text-base font-bold mt-1">{hostels?.activeHostels}</h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border-gray-300">
                  <p className="text-gray-500 text-sm">InActive Properties</p>
                  <h2 className="text-2xl text-base font-bold mt-1">{hostels?.inactiveHostels}</h2>
                </div>
              </div>


              <div className="sticky top-0 z-20 bg-white pb-4">
                <div className="flex flex-wrap justify-between items-center gap-2 font-inter">


                  <div className="flex gap-3">

                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                      }}
                      className="border rounded-lg px-3 py-2 text-xs font-medium text-gray-700  border border-gray-300"
                    >
                      <option value="">All</option>
                      {/* <option value="active">Active</option>
              <option value="inactive">Inactive</option> */}
                    </select>

                    {/* 
                  <select className="border rounded-lg px-3 py-2 text-xs font-medium leading-[150%] text-gray-700">
                    <option className="text-[#1E45E1] font-medium font-inter ">This Month</option>
                    <option>Last Month</option>
                  </select> */}

                    <button className="border px-4 py-2 rounded-lg text-xs font-medium leading-[150%] text-gray-700 font-inter border border-gray-300">
                      Filter
                    </button>

                  </div>
                  {/* <div className="flex items-end gap-3">

                    
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                 
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>


                    <button
                      onClick={() =>
                        exportHostels(
                          searchText,
                          formatDateToDDMMYYYY(startDate),
                          formatDateToDDMMYYYY(endDate)
                        )
                      } className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 bg-green-600 hover:bg-green-700"

                    >
                      ⬇ Export
                    </button>

                  </div> */}
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1 text-left">Select Date Range</label>

                      <RangePicker
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                        format="DD-MM-YYYY"
                        className="h-[38px] rounded-lg"
                      />
                    </div>
                    {/* Start Date */}
                    {/* <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm h-[38px] w-[180px]"
    />
  </div> */}

                    {/* End Date */}
                    {/* <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm h-[38px] w-[180px]"
    />
  </div> */}

                    {/* Export Button */}
                    <button
                      // onClick={() =>
                      //   exportHostels(
                      //     searchText,
                      //     formatDateToDDMMYYYY(startDate),
                      //     formatDateToDDMMYYYY(endDate)
                      //   )
                      // }
                      onClick={handleExport}
                      className="h-[38px] px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2 shadow-sm cursor-pointer"
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
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setPage(1);
                      }}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-medium leading-[150%] w-56"
                    />
                  </div>
                </div>
              </div>




              {/* <div className="bg-white rounded-xl shadow-sm border flex flex-col h-[calc(100vh-230px)]"> */}

              {/* <div className="bg-white rounded-xl shadow-sm border-gray-600 overflow-hidden flex flex-col max-h-[calc(100vh-230px)]"> */}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-230px)]">

                <div className="flex-1 overflow-x-auto overflow-y-auto">

                  <table className="w-max min-w-full table-fixed text-sm text-left">


                    <thead className="bg-[#F8F9FF] text-gray-600 text-xs uppercase sticky top-0 z-40">

                      <tr>

                        {/* Sticky ID */}
                        <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                          ID
                        </th>

                        {/* Sticky Name */}
                        <th className="px-4 py-3 sticky left-[80px] bg-[#F8F9FF] z-50 w-[100px]">
                          Name
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

                        <th className="px-4 py-3 w-[150px] whitespace-nowrap">
                          SubActiveDays
                        </th>

                        <th className="px-4 py-3 w-[150px] whitespace-nowrap">
                          Expiry On
                        </th>

                        <th className="px-1 py-3 w-[100px] whitespace-nowrap">
                          Last Action
                        </th>

                        <th className="px-4 py-3 w-[120px] text-center">
                          PlatForm
                        </th>

                        <th className="px-4 py-3 w-[120px] text-center">
                          Status
                        </th>

                        <th className="px-4 py-3 w-[120px] text-center">
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

                            {/* Sticky ID */}
                            <td className="px-4 py-2 sticky left-0 bg-white z-30 w-[80px] group-hover:bg-gray-50">
                              {/* {(page - 1) * pageSize + index + 1} */}
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
                                  {item.initials || "NA"}
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

                            <td className="px-4 py-2 whitespace-nowrap">
                              {item.ownerInfo?.mobile}
                            </td>
<td className="px-4 py-2 whitespace-nowrap">
                              {item.ownerInfo?.emailId}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {item?.joinedOn}
                            </td>

                            <td className="px-4 py-2">
                              {item.noOfdaysSubscriptionActive || "----"}
                            </td>

                            <td className="px-4 py-2">
                              {item.expiredOn || "----"}
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

                            <td className="px-4 py-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <img
                                  src={noteAdd}
                                  alt="noteAdd"
                                  className="w-5 h-5 cursor-pointer"
                                // onClick={() => {
                                //   setSelectedHostel(item);
                                //   setShowNoteModal(true);
                                // }}
                                />
                                {/* <img src={Circle} alt="circle" className="w-5 h-5 cursor-pointer" /> */}
                                <div className="relative">
                                  <img
                                    src={Circle}
                                    alt="circle"
                                    className="w-5 h-5 cursor-pointer"
                                    onClick={() =>
                                      setOpenMenu(openMenu === item.hostelId ? null : item.hostelId)
                                    }
                                  />

                                  {openMenu === item.hostelId && (
                                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">

                                      <button
                                        onClick={() => {
                                          setSelectedHostelId(item.hostelId);
                                          setShowResetModal(true);
                                          setOpenMenu(false)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                      >
                                        Reset Expense
                                      </button>

                                    </div>
                                  )}
                                </div>
                                {/* <img
                                    src={Money}
                                    onClick={() => handleCreateSubscription(item)}
                                    alt="money"
                                    className="w-5 h-5 cursor-pointer"
                                  /> */}
                                {/* <img
                                  src={Money}
                                  onClick={() => {
                                    if (canWrite === true) handleCreateSubscription(item);
                                  }}
                                  alt="money"
                                  className={`w-5 h-5 ${canWrite === true ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                                /> */}
                                {/* {item?.hostelPlan?.currentPlan === "Trial" && item?.isTrial === "true" && ( */}
  {/* <img
    src={Money}
    onClick={() => {
         console.log("clicked", item , canWrite) ;
      if (canWrite === true && item?.canAddTrial === true ) {
     
        handleCreateSubscription(item);
    }}}
    alt="money"
    className={`w-5 h-5 ${(canWrite === true && item?.canAddTrial === true) ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
  /> */}
  <img
  src={Money}
  onClick={() => {
    if (canWrite === true && item?.canAddTrial === true) {
      setSelectedItem(item);
      setShowTrialPopup(true);
    }
  }}
  alt="money"
  className={`w-5 h-5 ${
    canWrite === true && item?.canAddTrial === true
      ? "cursor-pointer"
      : "opacity-40 cursor-not-allowed"
  }`}
/>
{/* // )} */}
                              </div>
                            </td>

                          </tr>

                        ))

                      )}


                    </tbody>

                  </table>


                  {tooltip.visible && (
                    <div
                      className="fixed bg-white shadow-lg border border-gray-200 
        rounded-lg px-3 py-2 text-xs text-gray-700 
        z-[9999] max-w-[400px] break-words"
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
              <div className="flex justify-between items-center px-4 py-1 text-sm  bg-white">

                {/* Total Count */}
                <span className="text-gray-600">
                  Total Record Count :{" "}
                  <span className="text-blue-600 font-medium">
                    {/* {pageSize} */}
                    {hostels?.totalHostels}
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
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>

                  {/* Prev */}
                  <button
                    // disabled={page <= 1}
                    disabled={hostels?.currentPage <= 1}
                    onClick={() => setPage(prev => prev - 1)}
                  >
                    &#8249;
                  </button>


                  <span className="border px-3 py-1 rounded-md bg-gray-100">
                    {/* {page} */}
                    {hostels?.currentPage}
                  </span>

                  <span className="text-gray-500">
                    {/* {start} - {end} */}
                    {hostels?.currentPage ?? 1} - {hostels?.totalPages ?? 1}
                  </span>



                  <button
                    // disabled={page >= totalPages || totalPages === 0}
                    disabled={hostels?.currentPage >= hostels?.totalPages}
                    onClick={() => setPage(prev => prev + 1)}
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
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => {
              setShowResetModal(false);
              setOpenMenu(false);
              setMenuError("")
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-xl w-[420px] p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="text-xl font-semibold mb-3">
                Reset Expense?
              </h2>

              <p className="text-gray-500 mb-8">
                Are you sure you want to reset this expense?
              </p>
              {menuError && (
                <ErrorMessage message={menuError} type="error" />
              )}
              <div className="flex justify-center gap-4 mt-1">

                <button
                  // onClick={() => setShowResetModal(false)}
                  onClick={() => {
                    setShowResetModal(false);
                    setOpenMenu(false);
                    setMenuError("")
                  }}
                  className="px-6 py-3 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleResetExpense}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        )}
        {showTrialPopup && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => {
      setShowTrialPopup(false);
      setSelectedTrialPlan("");
      setPlanError("");
    }}
  >
    <div
      className="bg-white rounded-xl shadow-xl w-[350px] p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold mb-4 text-left">Select Trial Plan</h2>

      {/* DROPDOWN */}
   <div className="relative">

  {/* SELECT BOX */}
  <div
    onClick={() => setShowDropdown(!showDropdown)}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer"
  >
    <span className="text-sm">
      {dropdownPlans?.trialPlans?.find(p => p.planCode === selectedTrialPlan)?.planName
        ? `${dropdownPlans.trialPlans.find(p => p.planCode === selectedTrialPlan).planName} - ${selectedTrialPlan}`
        : "Select Plan"}
    </span>

 
      <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
  </div>

  {/* DROPDOWN LIST */}
  {showDropdown && (
    <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto z-50">

      <div
        onClick={() => {
          setSelectedTrialPlan("");
          setShowDropdown(false);
        }}
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
      >
        Select Plan
      </div>

      {dropdownPlans?.trialPlans?.map((plan) => (
        <div
          key={plan.planId}
          onClick={() => {
            setSelectedTrialPlan(plan.planCode);
            setPlanError("");
            setShowDropdown(false);
          }}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {plan.planName} - {plan.planCode} ({plan.duration} days)
        </div>
      ))}
    </div>
  )}
</div>

      {planError && <ErrorMessage message={planError} type="error" />}

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button
         onClick={() => {
  setShowTrialPopup(false);
  setSelectedTrialPlan("");
  setPlanError("");
}}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => handleCreateSubscription(selectedItem)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}
      </DashboardLayout>
    </>
  );
};

export default Properties;
