import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import {
  FiArrowLeft,
  FiPhone,
  FiExternalLink,
  FiMoreVertical,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import InvoiceOverviewDrawer from "./InvoiceOverviewDrawer";

const invoices = [
  {
    invoiceNo: "#FS-2025-001",
    status: "Pending",
    date: "02-Oct-2025",
    type: "Settlement",
    amount: "₹ 1,299",
    due: "₹ 0",
  },
  {
    invoiceNo: "#ST-2025-002",
    status: "Partially Paid",
    date: "01-Oct-2025",
    type: "Rental",
    amount: "₹ 6,000",
    due: "₹ 3,000",
  },
  {
    invoiceNo: "#ST-2025-003",
    status: "Unpaid",
    date: "01-Oct-2025",
    type: "Rental",
    amount: "₹ 1,900",
    due: "₹ 1,900",
  },
  {
    invoiceNo: "#ST-2025-004",
    status: "Partially Paid",
    date: "01-Oct-2025",
    type: "Rental",
    amount: "₹ 12,000",
    due: "₹ 6,000",
  },
];

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

  const tenantData = location.state?.tenantData;
  const hostelData = location.state?.hostelData;

  const [activeTab, setActiveTab] = useState("invoice");
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);

const [selectedInvoice, setSelectedInvoice] = useState(null);
console.log("tenantData",tenantData)
  return (
    <DashboardLayout>
      <div className="bg-cardBg min-h-screen">

        {/* Header */}
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

        {/* Profile Card */}
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
                  Ground Floor | Room 101 | Bed A
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
                  {hostelData?.hostelName || "N/A"}
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

          </div>
        </div>

        {/* Table */}
        <div className="bg-white px-6 py-5">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-[#F5F7FB] text-[#6B7280] text-[11px]">

                  <th className="px-4 py-4 text-left">
                    INVOICE NO
                  </th>

                  <th className="px-4 py-4 text-left">
                    STATUS
                  </th>

                  <th className="px-4 py-4 text-left">
                    DATE CREATED
                  </th>

                  <th className="px-4 py-4 text-left">
                    TYPE
                  </th>

                  <th className="px-4 py-4 text-left">
                    AMOUNT
                  </th>

                  <th className="px-4 py-4 text-left">
                    DUE AMOUNT
                  </th>

                  <th className="px-4 py-4 text-center">
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {invoices.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#F1F5F9] text-[12px]"
                  >
                    <td
  className="
    px-4
    py-4
    text-[#2563EB]
    font-medium
    text-left
    cursor-pointer
    hover:underline
  "
  onClick={() => {
    setSelectedInvoice(item);
    setShowInvoiceDrawer(true);
  }}
>
  {item.invoiceNo}
</td>

                    <td className="px-4 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                            w-2
                            h-2
                            rounded-full
                            ${getStatusColor(
                              item.status
                            )}
                          `}
                        />

                        <span>
                          {item.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-left">
                      {item.date}
                    </td>

                    <td className="px-4 py-4 text-left">
                      {item.type}
                    </td>

                    <td className="px-4 py-4 text-left">
                      {item.amount}
                    </td>

                    <td className="px-4 py-4 text-left">
                      {item.due}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <FiMoreVertical />
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

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