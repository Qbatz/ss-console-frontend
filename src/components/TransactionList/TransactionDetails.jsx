import React, { useState, useEffect } from "react";
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


const TransactionsPage = () => {
 
  const [totalItems, setTotalItems] = useState(0);
  const { getOrderHistory,loading,accessError } = useSubscription();
   const { canRead, canWrite, canUpdate, canDelete } =
      usePermission("Hostel Transactions");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRevenue,setTotalRevenue] = useState("")
  const [dateRange, setDateRange] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
const [selectedTxn, setSelectedTxn] = useState(null);
const [showModal, setShowModal] = useState(false);
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

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0); // reset page
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

        {/* Header */}
        {/* <div className="flex justify-between items-center mb-6 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <button className="text-blue-600 text-sm font-medium">
          Manage Plans
        </button>
      </div> */}
        <div className="border-b border-gray-200 mb-3 pb-2">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">


              <h1 className="text-lg font-semibold font-inter">
                Transactions
              </h1>



            </div>

            {/* RIGHT SIDE BUTTON */}
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium font-inter w-full sm:w-fit cursor-pointer">
              Manage Plans
            </button>

          </div>

        </div>
        {/* Cards */}
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

        {/* Filters */}
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
          
              <img src={Refresh} className="w-6 h-6 cursor-pointer"/>
           

            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">

          {/* Wrapper with fixed height */}
          <div className="max-h-[350px] overflow-y-auto">

            <table className="w-full text-sm">

              {/* Sticky Header */}
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
                  <th className="px-4 py-3 text-[12px] font-semibold text-left whitespace-nowrap">Transaction Ref no</th>
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
          TXN{item.historyId}
        </td>

        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
          {item.createdAtDate}
        </td>

        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-blue-600 text-left">
          {item.createdBy}
        </td>

        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
          {item.hostelName}
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
          __
        </td>
        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
         __
        </td>

        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
          {item.orderStatus}
        </td>

        <td className="px-4 py-2 text-[12px] whitespace-nowrap text-left">
          {item.createdBy}
        </td>

      <td className="px-4 py-2 relative">
  <img 
    src={MenuCircle} 
    className="w-4 h-4 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      setOpenMenu(openMenu === item.historyId ? null : item.historyId);
    }}
  />
              {openMenu === item.historyId && (
  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-50">
    <button
      onClick={() => {
        setSelectedTxn(item);
        setShowModal(true);
        setOpenMenu(null);
      }}
      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
    >
      View Details
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
            <span className="text-blue-600 ml-1">{totalItems}</span>
          </span>

          <div className="flex items-center gap-4">

            {/* Page Size */}
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1); // 🔥 reset
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-sm">
              TXN{selectedTxn.historyId}
            </h2>
            <p className="text-green-600 text-xs">● Success</p>
          </div>

          <button onClick={() => setShowModal(false)}>✕</button>
        </div>

        {/* PROPERTY INFO */}
        <div className="text-sm space-y-2 mb-4 text-left">
          <p><b>Owner:</b> {selectedTxn.createdBy}</p>
          <p><b>Location:</b> {selectedTxn.city}, {selectedTxn.state}</p>
          <p><b>Mobile:</b> {selectedTxn.mobile || "-"}</p>
          <p><b>Active Tenants:</b> 42</p>
        </div>

        {/* PAYMENT BOX */}
       <div className="bg-gray-100 rounded-lg p-4 text-sm mb-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-xs">Plan</p>
              <p className="font-medium">{selectedTxn.planName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Billing Cycle</p>
              <p className="font-medium">2+1 - Pre-paid</p>
            </div>
          </div>

          <div className="flex justify-between mt-3">
            <div>
              <p className="text-gray-500 text-xs">Amount</p>
              <p>₹{selectedTxn.totalAmount}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Discount</p>
              <p>₹199</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-gray-500 text-xs">Final Paid</p>
            <p className="font-semibold">₹{selectedTxn.totalAmount}</p>
          </div>
        </div>

        {/* IMAGE */}
        <div className="rounded-lg overflow-hidden border">
          <img
            src={ArrowRight}
            className="w-full h-auto object-contain"
          />
        </div>

      </div>
    </div>
  </>
)}
    </DashboardLayout>
  );
};

export default TransactionsPage;