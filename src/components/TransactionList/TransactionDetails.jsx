import React, { useState, useEffect,useRef  } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import MenuCircle from "../../assets/menucircle.png"
import { useSubscription } from "../../Context/SubscriptionContext";
import ArrowRight from "../../assets/arrow-right.png";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Filter from "../../assets/Filter.png";
import Refresh from "../../assets/RefreshButton.png";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";
import Single from "../../assets/single.png";
import Location from "../../assets/locationGrey.png"
import Call from "../../assets/call.png";
import Team from "../../assets/Team.png";
import { useNavigate } from "react-router-dom";


const TransactionsPage = () => {

  const [totalItems, setTotalItems] = useState(0);
  const { getOrderHistory, loading, accessError,verifyPayment } = useSubscription();
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Hostel Transactions");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRevenue, setTotalRevenue] = useState("")
  const [dateRange, setDateRange] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredProof, setHoveredProof] = useState("");
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0
  });
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showVerifyDrawer, setShowVerifyDrawer] = useState(false);
  const navigate = useNavigate();

const [selectedVerifyItem, setSelectedVerifyItem] = useState(null);
const [verifyResponse, setVerifyResponse] = useState(null);
const menuRef = useRef(null);
useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {

      setOpenMenu(null);
      setShowVerifyDrawer(false);

    }

  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };

}, []);
  const { RangePicker } = DatePicker;
  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };
  const [resData, setResData] = useState({});
  const handleNext = () => {
    if (page < resData.totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  console.log("selectedTxn", selectedTxn)
  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };
  useEffect(() => {
    fetchData();
  }, [page, size, search, dateRange]);

  const fetchData = async () => {

    let start = "";
    let end = "";

    if (dateRange && dateRange.length === 2) {
      start = dateRange[0].format("DD-MM-YYYY");
      end = dateRange[1].format("DD-MM-YYYY");
    }

    const res = await getOrderHistory(
      page,
      size,
      search,
      start,
      end
    );

    if (res.success) {
      setData(res.data?.orderHistories || []);
      setTotalItems(res.data?.totalItems || 0);
      setTotalRevenue(res?.data?.totalRevenue || 0);
      setResData(res.data);
    }
  };

  const start = totalItems === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);

 const handleVerifyPayment = async (item) => {

  const res = await verifyPayment(item.historyId);

  if (res) {

    setVerifyResponse(res.data || res);
    setSelectedVerifyItem(item);
    setShowVerifyDrawer(true);

  }

};
  return (
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
        <div className="p-6 min-h-screen">


          <div className="border-b border-gray-200 mb-3 pb-2">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">


                <h1 className="text-lg font-semibold font-inter">
                  Transactions
                </h1>



              </div>


              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium font-inter w-full sm:w-fit cursor-pointer">
                Manage Plans
              </button>

            </div>

          </div>

          <div className="flex gap-4 mb-4">
            <div className="bg-white border border-gray-300 rounded-lg p-4 w-64">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="text-xl font-semibold">₹{totalRevenue}</h2>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-4 w-64">
              <p className="text-sm text-gray-500">Refunded Amount</p>
              <h2 className="text-xl font-semibold">0</h2>
            </div>
          </div>


          <div className="flex justify-between items-center mb-3">

            <div className="flex items-center gap-3">

              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates);
                  setPage(1);
                }}
                format="DD-MM-YYYY"
                className="h-[36px] rounded-lg"
              />



            </div>


            <div className="flex items-center gap-2">

              <img src={Refresh} className="w-6 h-6 cursor-pointer" />


              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-1 rounded"
              />
            </div>
          </div>


          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">


            <div className="max-h-[350px] overflow-y-auto">

              <table className="w-full text-sm">


                <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left">ID</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left">DATE</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left">CUSTOMER</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left">PROPERTY</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">REGION / CITY</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">PLAN TYPE</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">PaymentMode</th>
                    {/* <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">Transaction Ref no</th> */}
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">Payment proof</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">status</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">Collected By</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array.from({ length: size }).map((_, i) => (
                      <tr key={i} className="animate-pulse border-t border-gray-300">
                        {Array.from({ length: 11 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index} className="border-t border-gray-300">

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {index + 1}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {item.createdAtDate}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-blue-600 text-left">
                          {item.paidBy}
                        </td>

                       <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">

  <span
    onClick={() =>
    navigate(`/property-overview/${item.hostelId}`, {
  state: {
    from: "transactions",

    currentPage: page,
    currentSearch: search,
    currentDateRange: dateRange,
  },
})
    }
    className="text-blue-600 cursor-pointer hover:underline"
  >
    {item.hostelName}
  </span>

</td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {item.city}, {item.state}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {item.planType || item.planName || "-"}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          ₹ {item.totalAmount}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {item.paymentType || "-"}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {item.paymentProof ? (
                            <span
                              className="text-blue-600 cursor-pointer underline"
                              onMouseEnter={(e) => {
                                setHoveredProof(item.paymentProof);
                                setPreviewPos({
                                  x: e.clientX + 20,
                                  y: e.clientY - 20,
                                });
                              }}
                              onMouseMove={(e) => {
                                setPreviewPos({
                                  x: e.clientX + 20,
                                  y: e.clientY - 20,
                                });
                              }}
                              onMouseLeave={() => {
                                setHoveredProof("");
                              }}
                            >
                              {item.paymentProofFileName || "View Proof"}
                            </span>
                          ) : (
                            "--"
                          )}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {item.orderStatus}
                        </td>

                        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
                          {item.collectedBy || "__"}
                        </td>

                        {/* <td className="px-4 py-2 relative">
                          <img
                            src={MenuCircle}
                            className="w-4 h-4 cursor-pointer"

                            onClick={(e) => {

                              e.stopPropagation();

                              const rect = e.currentTarget.getBoundingClientRect();

                              setMenuPos({
                                top: rect.bottom + 5,
                                left: rect.left - 100
                              });

                              setOpenMenu(
                                openMenu === item.historyId
                                  ? null
                                  : item.historyId
                              );
                            }}
                          />
                          {openMenu === item.historyId && (
                            <div
                             ref={menuRef}
                              className="fixed w-32 bg-white border rounded shadow z-[99999]"
                              style={{
                                top: menuPos.top,
                                left: menuPos.left
                              }}
                            >

                              <button
                                onClick={() => {
                                  setSelectedTxn(item);
                                  setShowModal(true);
                                  setOpenMenu(null);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              >
                                View Details
                              </button>
                           

 <button
  onClick={() => {
    handleVerifyPayment(item);
    setOpenMenu(null);
  }}
  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
>
  Verify Payment
</button>



                            </div>
                          )}

                        </td> */}

<td className="px-4 py-2 relative">

  <button
    onClick={(e) => {

      e.stopPropagation();

      const rect =
        e.currentTarget.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const menuHeight = 100;

      const spaceBelow =
        viewportHeight - rect.bottom;

      setMenuPos({

        top:
          spaceBelow < menuHeight
            ? rect.top - menuHeight + 40
            : rect.bottom + 8,

        left: rect.left - 100,

      });

      setOpenMenu(
        openMenu === item.historyId
          ? null
          : item.historyId
      );

    }}
    className={`
      p-2 rounded-full
      transition-all duration-200

      ${
        openMenu === item.historyId
          ? "bg-[#EEF2FF] scale-110"
          : "hover:bg-gray-100"
      }
    `}
  >

    <img
      src={MenuCircle}
      className={`
        w-4 h-4 transition-all duration-200 cursor-pointer

        ${
          openMenu === item.historyId
            ? "animate-pulse"
            : ""
        }
      `}
    />

  </button>

  {openMenu === item.historyId && (

    <div
      ref={menuRef}
    className="
  fixed w-32 bg-white rounded-xl z-[99999]
  border border-gray-100
  shadow-[0_10px_35px_rgba(0,0,0,0.18)]
  overflow-hidden
"
      style={{
        top: menuPos.top,
        left: menuPos.left
      }}
    >

      <button
        onClick={() => {
          setSelectedTxn(item);
          setShowModal(true);
          setOpenMenu(null);
        }}
        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      >
        View Details
      </button>

      <button
        onClick={() => {
          handleVerifyPayment(item);
          setOpenMenu(null);
        }}
        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      >
        Verify Payment
      </button>

    </div>

  )}

</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-6 text-gray-400">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-4 py-3 text-sm">

            {/* Total Count */}
            <span>
              Total Record Count :
              <span className="text-blue-600 ml-1">{data.length || 0}</span>
            </span>

            <div className="flex items-center gap-4">

              {/* Page Size */}
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              {/* Prev */}
              <button className="cursor-pointer"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                &#8249;
              </button>

              {/* Current Page */}
              <span className="border px-3 py-1 rounded bg-gray-50">
                {page}
              </span>

              {/* Next */}
              <button
                disabled={page >= resData?.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                &#8250;
              </button>

              {/* Range */}
              <span className="text-gray-400">
                {start} - {end}
              </span>

            </div>
          </div>

        </div>
      )}

      {showModal && selectedTxn && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowModal(false)}
          />

          {/* DRAWER WITH SPACE */}
          <div className="fixed top-6 bottom-6 right-6 w-[400px] bg-white rounded-xl shadow-lg z-50 transform transition-transform duration-300 translate-x-0">

            <div className="h-full overflow-y-auto p-5">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-4 border-b border-gray-300">
                <div>
                  <h2 className="font-semibold text-sm text-start">
                    TXN{selectedTxn.historyId}
                  </h2>
                  <p className="text-green-600 text-xs">● Success</p>
                </div>

                <button onClick={() => setShowModal(false)} className="cursor-pointer">✕</button>
              </div>

              {/* PROPERTY INFO */}
              {/* <div className="text-sm space-y-2 mb-4 text-left">
                <p><b>Owner:</b> {selectedTxn.createdBy}</p>
                <p><b>Location:</b> {selectedTxn.city}, {selectedTxn.state}</p>
                <p><b>Mobile:</b> {selectedTxn.mobile || "-"}</p>
                <p><b>Active Tenants:</b> 42</p>
              </div> */}

              <div className="text-sm text-left">
                <p className="text-[13px] font-semibold tracking-[1px] text-gray-500 uppercase mb-4">
                  Property Info
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-[20px_120px_1fr] items-center gap-x-4">
                    <img src={Single} alt="owner" className="w-4 h-4 opacity-70" />
                    <span className="text-gray-500">Owner</span>
                    <span className="font-semibold text-gray-900">{selectedTxn.ownerInfo.fullName}</span>
                  </div>

                  <div className="grid grid-cols-[20px_120px_1fr] items-start gap-x-4">
                    <img src={Location} alt="location" className="w-4 h-4 mt-1 opacity-70" />
                    <span className="text-gray-500">Location</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTxn.city}, {selectedTxn.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-[20px_120px_1fr] items-center gap-x-4">
                    <img src={Call} alt="mobile" className="w-4 h-4 opacity-70" />
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTxn.mobile || "-"}
                    </span>
                  </div>

                  {/* <div className="grid grid-cols-[20px_120px_1fr] items-center gap-x-4">
      <img src={Team} alt="tenants" className="w-4 h-4 opacity-70" />
      <span className="text-gray-500">Active Tenants</span>
      <span className="font-semibold text-gray-900">42</span>
    </div> */}
                </div>
              </div>

             
              <div className="bg-gray-100 rounded-xl p-4 text-sm mt-3 mb-4 border border-gray-200">

                {/* TITLE */}
                <p className="text-[11px] text-gray-400 pb-2 mb-4 font-semibold tracking-wider border-b border-gray-300 text-left">
                  PAYMENT INFO
                </p>
                {/* ROWS */}
                <div className="space-y-3">

                  <div className="flex justify-between">
                    <p className="text-gray-500 text-xs">Payment Mode</p>
                    <p className="font-medium text-gray-800">
                      {selectedTxn.paymentMode || "Manual"}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-500 text-xs">Plan Name</p>
                    <p className="font-medium text-gray-800">
                      {selectedTxn.planName}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-500 text-xs">Amount</p>
                    <p className="font-medium text-gray-800">
                      ₹ {selectedTxn.totalAmount}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-500 text-xs">Discount Added</p>
                    <p className="font-medium text-gray-800">
                      ₹ {selectedTxn.discountAmount || 0}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-500 text-xs">Final Paid</p>
                    <p className="font-semibold text-gray-900">
                      ₹ {selectedTxn.totalAmount}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-500 text-xs">Collected by</p>
                    <p className="font-medium text-gray-800">
                      {selectedTxn.collectedBy || "-"}
                    </p>
                  </div>

                </div>
              </div>
<div className="mt-4">

  
  {selectedTxn.paymentUrl && (

    <div className="mb-3 text-left">

      <p className="text-[11px] text-gray-500 uppercase font-semibold mb-1">
        Payment Link
      </p>

      <a
        href={selectedTxn.paymentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm underline break-all hover:text-blue-800"
      >
        {selectedTxn.paymentUrl}
      </a>

    </div>

  )}

  
  <div className="rounded-lg overflow-hidden border border-gray-300">

    <img
      src={selectedTxn.paymentProof}
      className="w-full h-auto object-contain"
    />

  </div>

</div>

              
              {/* <div className="rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={selectedTxn.paymentProof}
                  className="w-full h-auto object-contain"
                />
              </div> */}

            </div>
          </div>
        </>
      )}
      {hoveredProof && (
        <div
          className="fixed z-[9999] pointer-events-none bg-white border border-gray-300 rounded-lg shadow-lg p-2"
          style={{
            left: `${previewPos.x}px`,
            top: `${previewPos.y}px`,
          }}
        >
          <img
            src={hoveredProof}
            alt="Payment Proof"
            className="w-52 h-52 object-contain rounded"
          />
        </div>
      )}
{showVerifyDrawer && (

  <>

    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/30 z-40"
      onClick={() => setShowVerifyDrawer(false)}
    />

    {/* Compact Drawer */}
    <div className="fixed top-10 right-6 w-[380px] bg-[#FAFBFC] rounded-3xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-right duration-300">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E8F0] bg-white">

        <h2 className="text-[20px] font-semibold text-gray-800">
          Payment Verification
        </h2>

        <button
          onClick={() => setShowVerifyDrawer(false)}
          className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center text-2xl transition"
        >
          ×
        </button>

      </div>

      {/* Content */}
      {/* Content */}
<div className="p-6 bg-[#FAFBFC]">

  {verifyResponse?.isPaid ? (

  <>
    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
      <span className="text-green-600 text-5xl">✓</span>
    </div>

    <h3 className="mt-6 text-[20px] font-semibold text-[#1F2937]">
      Payment Success
    </h3>

    <p className="mt-3 text-[15px] text-gray-500 leading-7">
      This payment has been made successfully.
    </p>
  </>

) : (

  <>
    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
      <span className="text-red-600 text-5xl">✕</span>
    </div>

    <h3 className="mt-6 text-[20px] font-semibold text-[#1F2937]">
      Payment Failed
    </h3>

    <p className="mt-3 text-[15px] text-gray-500 leading-7">
      Payment verification failed.
    </p>
  </>

)}

</div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-2 bg-[#FAFBFC]">

        <button
          onClick={() => setShowVerifyDrawer(false)}
          className="w-full bg-[#2563EB] hover:bg-[#1E4FD8] text-white py-3 rounded-2xl text-sm font-semibold transition"
        >
          Close
        </button>

      </div>

    </div>

  </>

)}
    </DashboardLayout>
  );
};

export default TransactionsPage;