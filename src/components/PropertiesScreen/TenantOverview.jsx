import React, { useState,useEffect,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import {
  FiArrowLeft,
  FiPhone,
  FiExternalLink,
  FiMoreVertical,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import InvoiceOverviewDrawer from "./InvoiceOverviewDrawer";
import { useHostel } from "../../Context/HostelListContext";

// const invoices = [
//   {
//     invoiceNo: "#FS-2025-001",
//     status: "Pending",
//     date: "02-Oct-2025",
//     type: "Settlement",
//     amount: "₹ 1,299",
//     due: "₹ 0",
//   },
//   {
//     invoiceNo: "#ST-2025-002",
//     status: "Partially Paid",
//     date: "01-Oct-2025",
//     type: "Rental",
//     amount: "₹ 6,000",
//     due: "₹ 3,000",
//   },
//   {
//     invoiceNo: "#ST-2025-003",
//     status: "Unpaid",
//     date: "01-Oct-2025",
//     type: "Rental",
//     amount: "₹ 1,900",
//     due: "₹ 1,900",
//   },
//   {
//     invoiceNo: "#ST-2025-004",
//     status: "Partially Paid",
//     date: "01-Oct-2025",
//     type: "Rental",
//     amount: "₹ 12,000",
//     due: "₹ 6,000",
//   },
// ];

const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-500";
    case "Pending":
      return "bg-red-500";
    case "Unpaid":
      return "bg-red-400";
    case "Partially Paid":
      return "bg-amber-500";
    default:
      return "bg-gray-400";
  }
};

const TenantOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTenantById } = useHostel();
  // const tenantData = location.state?.tenantData;
  const hostelData = location.state?.hostelData;
const { customerId } = useParams();
  const [activeTab, setActiveTab] = useState("invoice");
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);
const menuRef = useRef(null);
const [selectedInvoice, setSelectedInvoice] = useState(null);
const [tenantData, setTenantData] = useState(null);
const [invoices, setInvoices] = useState([]);
const [transactions, setTransactions] = useState([]);
const [sourceInvoice,setSourceInvoice] = useState([])
const [openMenu, setOpenMenu] = useState(null);
const [deleteItem, setDeleteItem] = useState(null);
console.log("invoices",invoices)


const fetchTenant = async () => {
  const res = await getTenantById(customerId);

  if (res?.success) {
    setTenantData(res.data);
    setInvoices(res?.data?.invoices)
    setTransactions(res?.data?.transactions || []);
    setSourceInvoice(res?.data?.invoiceRedemptions || [])
  }
};
useEffect(() => {
  fetchTenant();
}, [customerId]);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setOpenMenu(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);
  return (
    <DashboardLayout>
      <div className="min-h-screen">

        
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="mt-1 text-[#2563EB]"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-[24px] font-semibold text-[#1F2937] text-left">
                Tenant Info
              </h1>

              <p className="text-[13px] text-[#6B7280] mt-1">
                Properties &gt; Tenant Overview
              </p>
            </div>
          </div>
        </div>

        
        <div className="bg-white px-8 py-4 border-b border-[#E5E7EB]">

          <div className="flex justify-between">

            <div className="flex gap-4">

             <div
  className="
    w-[50px]
    h-[50px]
    rounded-[16px]
    border
    border-[#E5E7EB]
    flex
    items-center
    justify-center
    overflow-hidden
    bg-white
  "
>
  {tenantData?.profileImage ? (
    <img
      src={tenantData.profileImage}
      alt="profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span
      className="
        text-[20px]
        font-semibold
        text-[#374151]
      "
    >
      {tenantData?.initials || "--"}
    </span>
  )}
</div>

              <div>
                <h2 className="text-[20px] leading-none font-semibold text-[#1F2937] text-left">
                  {tenantData?.fullName || "N/A"}
                </h2>

                <p className="mt-3 text-[15px] text-[#6B7280] text-left">
                  {tenantData?.hostelDetails?.floorName} |  {tenantData?.hostelDetails?.roomName} | {tenantData?.hostelDetails?.bedName}
                </p>
              </div>

            </div>

            <button>
              <FiMoreVertical size={20} />
            </button>

          </div>

          {/* Info Row */}
          <div className="grid grid-cols-3 gap-20 mt-5 text-left">

            <div>
              <p className="text-[#9CA3AF] text-sm">
                Mob No
              </p>

              <div className="flex items-center gap-2 mt-2">
                <FiPhone className="text-[#2563EB]" />
                <span className="font-medium text-[#1F2937]">
                  {tenantData?.mobile || "N/A"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[#9CA3AF] text-sm text-left">
                Staying Hostel
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium text-[#2563EB]">
                  {tenantData?.hostelDetails?.hostelName || "N/A"}
                </span>

                <FiExternalLink
                  size={14}
                  className="text-[#2563EB]"
                />
              </div>
            </div>

            <div className="text-left">
              <p className="text-[#9CA3AF] text-sm">
                Mail
              </p>

              <p className="mt-2 font-medium text-[#1F2937]">
                {tenantData?.emailId ||
                  "N/A"}
              </p>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white px-6">

          <div className="flex gap-10 border-b border-[#E5E7EB]">

            <button
              onClick={() =>
                setActiveTab("invoice")
              }
              className={`
                py-4
                text-sm
                font-medium
                border-b-2
                ${
                  activeTab === "invoice"
                    ? "border-[#2563EB] text-[#2563EB]"
                    : "border-transparent text-[#9CA3AF]"
                }
              `}
            >
              Invoices
            </button>

            <button
              onClick={() =>
                setActiveTab("transaction")
              }
              className={`
                py-4
                text-sm
                font-medium
                border-b-2
                ${
                  activeTab === "transaction"
                    ? "border-[#2563EB] text-[#2563EB]"
                    : "border-transparent text-[#9CA3AF]"
                }
              `}
            >
              Transactions
            </button>
 <button
              onClick={() =>
                setActiveTab("redemption")
              }
              className={`
                py-4
                text-sm
                font-medium
                border-b-2
                ${
                  activeTab === "redemption"
                    ? "border-[#2563EB] text-[#2563EB]"
                    : "border-transparent text-[#9CA3AF]"
                }
              `}
            >
              Invoice Redemption
            </button>

         <button
  onClick={() =>
    navigate(
      `/tenant-deductions/${tenantData?.customerId}`,
      {
        state: {
          tenantData,
          hostelData,
        },
      }
    )
  }
  className="py-4 text-sm font-medium"
>
  Deduction
</button>
          </div>
        </div>

      {
         activeTab === "invoice" && (
    <div className="bg-white px-6 py-5">

  <div className="max-h-[250px] overflow-auto">

    <table className="w-full">

      <thead className="sticky top-0 bg-[#F5F7FB] z-10">
        <tr className="text-[#6B7280] text-[11px]">
          <th className="px-4 py-4 text-left">INVOICE NO</th>
          <th className="px-4 py-4 text-left">STATUS</th>
          <th className="px-4 py-4 text-left whitespace-nowrap">
            INVOICE MODE
          </th>
          <th className="px-4 py-4 text-left whitespace-nowrap">
            DATE CREATED
          </th>
          <th className="px-4 py-4 text-left">TYPE</th>
          <th className="px-4 py-4 text-left">ACTIONS</th>
        </tr>
      </thead>

      <tbody>
        {invoices.map((item, index) => (
          <tr
            key={index}
            className="border-b border-[#F1F5F9] text-[12px]"
          >
            <td className="px-4 py-4 text-[#2563EB] font-medium text-left">
              {item.invoiceNumber}
            </td>

            <td className="px-4 py-4 text-left">
              {item.paymentStatus}
            </td>

            <td className="px-4 py-4 text-left">
              {item.invoiceMode}
            </td>

            <td className="px-4 py-4 text-left">
              <div>
                <div>{item.createdAtDate || "----"}</div>
                <div className="text-[11px] text-gray-400">
                  {item.createdAtTime}
                </div>
              </div>
            </td>

            <td className="px-4 py-4 text-left">
              {item.invoiceType}
            </td>

            <td className="px-4 py-4 text-left">
              <FiMoreVertical />
            </td>
          </tr>
        ))}
      </tbody>

    </table>

  </div>

</div>
      )}
       {activeTab === "transaction" && (
  <div className="bg-white px-6 py-5">

    <div className="max-h-[250px] overflow-auto">

      <table className="w-full">

        <thead className="sticky top-0 bg-[#F5F7FB] z-10">
          <tr className="text-[#6B7280] text-[11px]">

            <th className="px-4 py-4 text-left">
              INVOICE NO
            </th>

            <th className="px-4 py-4 text-left">
              PAID AMOUNT
            </th>

            <th className="px-4 py-4 text-left">
              STATUS
            </th>

            <th className="px-4 py-4 text-left">
              PAYMENT DATE
            </th>

            <th className="px-4 py-4 text-left">
              MODE
            </th>

            <th className="px-4 py-4 text-left">
              REFERENCE ID
            </th>
<th className="px-4 py-4 text-left">
              ACTION
            </th>
          </tr>
        </thead>

        <tbody className="bg-white">

          {transactions?.length > 0 ? (

            transactions.map((item) => (

              <tr
                key={item.transactionId}
                className="border-b border-[#F1F5F9] text-[12px]"
              >

                <td className="px-4 py-4 text-left text-[#2563EB] font-medium">
                  {item.invoiceNumber || "--"}
                </td>

                <td className="px-4 py-4 text-left">
                  ₹{item.paidAmount || 0}
                </td>

                <td className="px-4 py-4 text-left">
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-medium
                      ${
                        item.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : item.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {item.status || "--"}
                  </span>
                </td>

                <td className="px-4 py-4 text-left">
                  <div>
                    <div>
                      {item.paymentDate || "--"}
                    </div>

                    {item.paymentTime && (
                      <div className="text-[11px] text-gray-400">
                        {item.paymentTime}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4 text-left">
                  {item.transactionMode || "--"}
                </td>

                <td className="px-4 py-4 text-left">
                  {item.transactionReferenceId || "--"}
                </td>
 {/* <td className="px-4 py-4 text-left">
              <FiMoreVertical />
            </td> */}
    <td className="px-4 py-4 text-left relative overflow-visible">
      <div ref={menuRef}>
  <button
    onClick={() =>
      setOpenMenu(
        openMenu === item.transactionId
          ? null
          : item.transactionId
      )
    }
  >
    <FiMoreVertical />
  </button>

  {openMenu === item.transactionId && (
    <div
      className="
        absolute right-0 bottom-full mb-2
        w-32 bg-white border rounded-lg shadow-lg z-[9999]
      "
    >
      <button
        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
        onClick={() => {
          setDeleteItem(item);
          setOpenMenu(null);
        }}
      >
        Delete
      </button>
    </div>
  )}
  </div>
</td>
              </tr>

            ))

          ) : (

            <tr>
              <td
                colSpan="6"
                className="text-center py-10 text-gray-500"
              >
                No Transactions Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>

  </div>
)}

           {
         activeTab === "redemption" && (  
 <div className="bg-white px-6 py-5">

  <div className="max-h-[250px] overflow-auto">

    <table className="w-full">

      <thead className="sticky top-0 bg-[#F5F7FB] z-10">
        <tr className="text-[#6B7280] text-[11px]">
          <th className="px-4 py-4 text-left">
           SOURCE INVOICE
          </th>

          <th className="px-4 py-4 text-left">
            TARGET INVOICE
          </th>
<th className="px-4 py-4 text-left">
            REDEMPTION AMOUNT
          </th>
          <th className="px-4 py-4 text-left">
            CREATED AT
          </th>

          <th className="px-4 py-4 text-left">
            CREATED BY
          </th>

          <th className="px-4 py-4 text-left">
            ACTION
          </th>
        </tr>
      </thead>

      <tbody>
        {sourceInvoice?.length > 0 ? (
          sourceInvoice.map((item) => (
            <tr
              key={item.transactionId}
              className="border-b border-[#F1F5F9] text-[12px]"
            >
              <td className="px-4 py-4 text-left">
                {item.sourceInvoiceNumber}
              </td>

              <td className="px-4 py-4 text-left">
                {item.targetInvoiceNumber}
              </td>
<td className="px-4 py-4 text-left">
                {item.redemptionAmount}
              </td>
              {/* <td className="px-4 py-4 text-left">
                {item.createdAtDate}
              </td> */}
              <td className="px-4 py-4 text-left">
  <p className="font-medium">
    {item.createdAtDate}
  </p>

  <p className="text-[11px] text-gray-400">
    {item.createdAtTime}
  </p>
</td>

              <td className="px-4 py-4 text-left">
                {item.createdBy}
              </td>
             <td className="px-4 py-4 text-left cursor-pointer" >
              <FiMoreVertical />
            </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="6"
              className="text-center py-6 text-gray-500"
            >
              No Transactions Found
            </td>
          </tr>
        )}
      </tbody>

    </table>

  </div>

</div>
         )}


             {
         activeTab === "deduction" && (  
 <div>
  
 </div>
         )}

{deleteItem && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setDeleteItem(null)}
  >
    <div
      className="bg-white rounded-lg p-6 w-[350px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-3">
        Delete Transaction
      </h3>

      <p className="text-sm text-gray-600 mb-5">
        Are you sure you want to delete this transaction?
      </p>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border rounded"
          onClick={() => setDeleteItem(null)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => {
            handleDelete(deleteItem.transactionId);
            setDeleteItem(null);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
      </div>
      <InvoiceOverviewDrawer
  show={showInvoiceDrawer}
  onClose={() =>
    setShowInvoiceDrawer(false)
  }
  invoice={selectedInvoice}
/>
    </DashboardLayout>
  );
};

export default TenantOverview;