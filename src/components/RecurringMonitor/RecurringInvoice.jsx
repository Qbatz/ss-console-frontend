import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Arrow from "../../assets/arrow-right.png";
import { useHostel } from "../../Context/HostelListContext";
import Toast from "../SuccessModal/ToastDesign";
import Search from "../../assets/Search.png";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";
import Circle from "../../assets/menucircle.png";

const RecurringInvoice = () => {
  const { getRecurringHostels, generateRecurringInvoice, loading, errorMsg } = useHostel();
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

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  const fetchRecurring = async () => {

    const res = await getRecurringHostels(
      page,
      size,
      search,
      filter
    );

    if (res?.success) {

      setData(res.data.hostelList || []);
      setTotalItems(res.data.totalItems);
      setTotalPages(res.data.totalPages);
      setFilterOptions(res.data.filterOptions || []);
    }

  };
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

    const delay = setTimeout(() => {
      fetchRecurring();
    }, 400);

    return () => clearTimeout(delay);

  }, [page, size, filter, search]);
  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);
  const handleGenerate = async (item) => {

    const res = await generateRecurringInvoice(
      item.hostelId,
      item.recurringDay
    );

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

            {/* <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <p className="text-sm text-gray-500">Recurring Pending</p>
          <p className="text-xl font-semibold mt-1">98</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <p className="text-sm text-gray-500">Subscription Expired</p>
          <p className="text-xl font-semibold mt-1">₹1,24,000</p>
        </div> */}

          </div>

          <p className="text-xs text-blue-500 mb-4 text-left">
            Based upon last 30 Days
          </p>

          {/* Filters */}
          <div className="flex justify-between items-center mb-4">

            <div ref={dropdownRef} className="relative w-40">

              <button
                onClick={() => setOpenFilter(!openFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center"
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
            {/* 
       <input
  value={search}
  onChange={(e)=>{
    setSearch(e.target.value);
    setPage(1);
  }}
  placeholder="Search Tenants..."
  className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-56"
/> */}
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

          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            <div className="max-h-[400px] overflow-y-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Property</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Mobile No</th>
                    {/* <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Sub Status</th> */}
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Recurring Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Region / City</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Billing Cycle</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Recurring mode</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Tenant Count</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Sub Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                {/* <tbody className="divide-y divide-gray-200">

{data.length > 0 ? (

data.map((item,index)=>(

<tr key={item.hostelId}>

<td className="px-4 py-3">

 {(page - 1) * size + index + 1}
</td>

<td className="px-4 py-2 text-left font-medium text-[12px]">
{item.hostelName}
</td>

<td className="px-4 py-2 text-left font-medium text-[12px]">
{item.mobile}
</td>

<td className="px-4 py-2 text-left font-medium text-[12px]">
{item.initials}
</td>


<td
  className="px-4 py-2 text-left font-medium text-[12px]"
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
<td className="px-4 py-2 text-left font-medium text-[12px]">
{item.recurringMode}
</td>

<td className="px-4 py-2 text-left font-medium text-[12px]">

{item.recurringStatus ?

<span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
Generated
</span>

:

<span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded-full">
Not Generated
</span>

}

</td>

<td className="px-4 py-2 text-left font-medium text-[12px]">

<button
  disabled={item.recurringStatus}
  onClick={() => handleGenerate(item)}
  className={`px-3 py-1 rounded-lg text-xs text-white
  ${item.recurringStatus
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  Generate
</button>

</td>

</tr>

))

) : (

<tr>
<td colSpan="7" className="text-center py-6 text-gray-400">
No Data Found
</td>
</tr>

)}

</tbody> */}
                <tbody className="divide-y divide-gray-200">

                  {loading ? (

                    // 🔥 Skeleton Loader
                    Array.from({ length: size }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))

                  ) : data.length > 0 ? (

                    data.map((item, index) => (
                      <tr key={item.hostelId}>
                        <td className="px-4 py-3">
                          {(page - 1) * size + index + 1}
                        </td>

                        {/* <td className="px-4 py-2 text-left font-medium text-[12px]">
        {item.hostelName}
      </td> */}
                        <td className="px-4 py-2 whitespace-nowrap">
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
                          Billing Cycle
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.recurringMode}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          Tenant Count
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
      onClick={() => {
  setSelectedItem(item);
  setShowDetailsModal(true);
}}
      className="px-3 py-1 rounded-lg text-xs text-white bg-blue-600 hover:bg-blue-700"
        
    >
      Generate
    </button>
  ) : (
    <button
      onClick={() => {
        console.log("View Details", item);
      }}
      className="px-3 py-1 rounded-lg text-xs border border-gray-300 text-blue-600 bg-white hover:bg-gray-50 flex items-center gap-1"
    >
      👁 View Details
    </button>
  )}
</td>
                      </tr>
                    ))

                  ) : (

                    <tr>
                      <td colSpan="8" className="text-center py-6 text-gray-400">
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
                <img src={Arrow} className="w-4 h-4" />
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
                <img src={Arrow} className="w-4 h-4 rotate-180" />
              </button>

              {/* Range */}
              <span className="text-gray-400">
                {start} - {end}
              </span>

            </div>

          </div>
 {showDetailsModal && selectedItem && (
  <div className="fixed inset-0 z-[9999] flex justify-end">

    {/* Overlay */}
      <div
    className="fixed inset-0 bg-black/10 backdrop-blur-[0px]"
    onClick={() => setShowDetailsModal(false)}
  ></div>

    {/* RIGHT SIDE FLOATING DRAWER */}
    <div className="relative z-[10000] flex items-center">
    <div className="w-[420px] h-[calc(100%-40px)] my-5 mr-5 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col animate-slideIn">

        {/* HEADER (fixed) */}
        <div className="flex justify-between items-start p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
              {selectedItem.initials}
            </div>

            <div>
              <p className="font-semibold text-sm">
                {selectedItem.hostelName}
              </p>
              <p className="text-xs text-gray-500">
                {selectedItem.hostelId}
              </p>
            </div>
          </div>

          <button onClick={() => setShowDetailsModal(false)}>✕</button>
        </div>

        {/* BODY (scroll only here) */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">

          {/* PROPERTY INFO */}
          <div className="mb-4 space-y-2">
            <p className="font-semibold text-gray-500 text-[11px]">
              PROPERTY INFO
            </p>

            <p>📍 {selectedItem.city}, {selectedItem.state}</p>
            <p>📞 {selectedItem.mobile}</p>
            <p>👤 {selectedItem.ownerInfo?.fullName}</p>
            <p>👥 Active Tenants: 42</p>
          </div>

          {/* BILLING CARD */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
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
          </div>

          {/* STATUS BADGES */}
          <div className="flex gap-2 mb-3">
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
              Expired
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
              Pending
            </span>
          </div>

          {/* ALERT */}
          {!selectedItem.recurringStatus && (
            <div className="bg-orange-100 text-orange-600 text-xs p-3 rounded-lg mb-4">
              Recurring invoices were not generated for this property.
              Subscription is expired.
            </div>
          )}

          {/* HISTORY TABLE */}
          <div>
            <p className="text-gray-500 text-[11px] font-semibold mb-2">
              RECURRING HISTORY — LAST 5 MONTHS
            </p>

            <div className="border rounded-lg overflow-hidden">
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
                  <tr className="bg-yellow-50">
                    <td className="p-2">May 2026</td>
                    <td className="p-2">Apr → May</td>
                    <td className="p-2">42</td>
                    <td className="p-2">Admin</td>
                    <td className="p-2 text-yellow-600">Pending</td>
                  </tr>

                  <tr>
                    <td className="p-2">Apr 2026</td>
                    <td className="p-2">Mar → Apr</td>
                    <td className="p-2">40</td>
                    <td className="p-2">System</td>
                    <td className="p-2 text-green-600">Generated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* FOOTER (fixed bottom) */}
        <div className="p-4 border-t flex justify-between">
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
        </div>

      </div>
    </div>
  </div>
)}
        </>
      )}
    </DashboardLayout>
  );
};

export default RecurringInvoice;