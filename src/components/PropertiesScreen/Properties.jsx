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
import { useNavigate } from "react-router-dom";


const Properties = () => {
  const { hostels, getHostels, loading, getHostelById, hardResetHostel } = useHostel();
  const { createSubscription, errorMsg } = useSubscription();
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
  const [hostelerror , setHostelError] = useState("")
  const [noteText, setNoteText] = useState("");
  const navigate = useNavigate();
const [tooltip, setTooltip] = useState({
  visible: false,
  text: "",
  x: 0,
  y: 0,
});
  
console.log("Typed Value:", noteText);
console.log("Selected Hostel ID:", selectedHostel?.hostelId);

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     getHostels(page, pageSize, searchText);
  //   }, 500);

  //   return () => clearTimeout(delay);
  // }, [page, pageSize, searchText]);
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     getHostels(page, pageSize, searchText);
  //   }, 300);

  //   return () => clearTimeout(delay);
  // }, [page, pageSize, searchText]);

  useEffect(() => {
    const fetchData = async () => {
      await getHostels(page, pageSize, searchText);

      // Only first time loader stop
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchText]);






  console.log("hostels", hostels);
  // let filteredData = hostels?.hostels || [];


  let displayData = hostels?.hostels || [];

  if (statusFilter) {
    displayData = displayData.filter(item =>
      statusFilter === "active"
        ? item.subscriptionIsActive
        : !item.subscriptionIsActive
    );
  }

  // 🔥 Always calculate based on displayed data
  let totalRecords =
    searchText.trim() !== "" || statusFilter !== ""
      ? displayData.length
      : hostels?.totalHostels || 0;

  let totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const start = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRecords);


  const isNextDisabled = page >= totalPages - 1;
  const handlePropertyClick = async (item) => {

    const res = await getHostelById(item.hostelId);
    console.log("res", res)
    if (res?.success) {

      navigate("/property-overview", {
        state: { hostelData: res.data }
      });

    }
  };


  const handleCreateSubscription = async (hostelId) => {
    const payload = {
      planCode: hostelId?.hostelPlan.currentPlanCode,
      paidAmount: 0,
      referenceNumber: "",
    };

    const res = await createSubscription(hostelId?.hostelId, payload);

    if (res?.success) {

      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);
      getHostels(page, pageSize, searchText);
      setTimeout(() => {
        setShowSuccess(false);

      }, 1000);
    } else {

      setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);

      }, 1000);
    }
  };
  const handleHardReset = async () => {
  if (!selectedHostel?.hostelId) return;

  const enteredId = noteText.trim();

  
  if (!enteredId) {
    setHostelError("Please Enter Hostel ID");
    return;
  }

  
  const res = await hardResetHostel(enteredId);

  if (res?.success) {
    setModalType("success");
    setMessage(res?.message);
    getHostels(page, pageSize, searchText);

    setShowNoteModal(false);
    setShowSuccess(true);
    setNoteText("");
    setHostelError("");

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  } else {
    setHostelError(res?.message || "Please Enter Valid Hostel ID");
  }
};
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


  return (
    <>

      <DashboardLayout>
        <Toast
          show={showSuccess}
          message={message}
          type={modalType}

        />
        {isFirstLoad && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!isFirstLoad && (


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
            Created On
          </th>

          <th className="px-4 py-3 w-[150px] whitespace-nowrap">
            SubActiveDays
          </th>

          <th className="px-4 py-3 w-[150px] whitespace-nowrap">
            Expiry On
          </th>

          <th className="px-4 py-3 w-[200px] whitespace-nowrap">
            Last Action
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

    [...Array(pageSize || 8)].map((_, index) => (
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
          {(page - 1) * pageSize + index + 1}
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

            <div className="flex border rounded-full w-5 h-5 items-center justify-center text-[9px] font-medium text-gray-600">
              T
            </div>

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
          {item?.joinedOn}
        </td>

        <td className="px-4 py-2">
          {item.noOfdaysSubscriptionActive || "----"}
        </td>

        <td className="px-4 py-2">
          {item.expiredOn || "----"}
        </td>

        <td className="px-4 py-2 whitespace-nowrap">
          {item.lastUpdateDate} {item.lastUpdateTime}
        </td>

        <td className="px-4 py-2 text-center">
          <span
            className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap w-fit mx-auto ${
              item.subscriptionIsActive
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.subscriptionIsActive
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
                                onClick={() => {
                                  setSelectedHostel(item);
                                  setShowNoteModal(true);
                                }}
                              />
                              <img src={Circle} alt="circle" className="w-5 h-5 cursor-pointer" />
                              <img
                                src={Money}
                                onClick={() => handleCreateSubscription(item)}
                                alt="money"
                                className="w-5 h-5 cursor-pointer"
                              />
          </div>
        </td>

      </tr>

    ))

  )}


      </tbody>

    </table>

    {/* ================= TOOLTIP ================= */}
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
                  {pageSize}
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
                  disabled={page <= 1}
                  onClick={() => setPage(prev => prev - 1)}
                >
                  &#8249;
                </button>

                {/* Current Page */}
                <span className="border px-3 py-1 rounded-md bg-gray-100">
                  {page}
                </span>

                {/* Range */}
                <span className="text-gray-500">
                  {start} - {end}
                </span>


                {/* Next */}
                <button
                  disabled={page >= totalPages || totalPages === 0}
                  onClick={() => setPage(prev => prev + 1)}
                >
                  &#8250;
                </button>


              </div>
            </div>

          </div>
        )

        }
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">


              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText("");
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-left">
                Enter Hostel ID
              </h2>

              <div className="space-y-4">

                {/* Input */}
                <input
                  type="text"
                  placeholder="Enter Hostel ID"
                  value={noteText}
                  onChange={(e) =>
                  {
                    setNoteText(e.target.value)
                    setHostelError("")
                  }
                   }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />

 {hostelerror && (
              <ErrorMessage message={hostelerror} type="error" />
            )}

                {/* Button */}
                <button
                  onClick={handleHardReset}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
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
