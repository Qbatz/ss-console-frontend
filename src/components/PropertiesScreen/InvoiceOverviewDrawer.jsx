import React from "react";
import { FiX } from "react-icons/fi";

const InvoiceOverviewDrawer = ({
  show,
  onClose,
  invoice,
}) => {

    const SectionHeader = ({
  title,
  amount,
  link,
}) => (
  <div className="flex items-start justify-between px-4 py-3  border-gray-300">

    <div className="flex items-center gap-2">
      <span className="text-[#FF4D4F] text-xs">
        ^
      </span>

      <span className="text-[14px] font-medium">
        {title}
      </span>
    </div>

    <div className="text-right">

      <p className="font-semibold">
        {amount}
      </p>

      {link && (
        <p className="text-[#2563EB] text-xs mt-1">
          {link}
        </p>
      )}

    </div>

  </div>
);
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999]">

      
      <div
        className="
          absolute
          inset-0
          bg-black/30
        "
        onClick={onClose}
      />

     
      <div
  className="
    absolute
    top-4
    right-4
    bottom-4
    w-[560px]
    bg-white
    rounded-[16px]
    shadow-xl
    overflow-y-auto
  "
>
       
        <div
          className="
            flex
            justify-between
            items-center
            p-5
            border-b border-gray-300
          "
        >
          <h2
            className="
              text-l
              font-semibold
            "
          >
            Invoice Overview
          </h2>

          <button
            onClick={onClose}
          >
            <FiX size={20} className="cursor-pointer"/>
          </button>
        </div>

        
        <div className="p-5">

          <div
            className="
              border-soft
              rounded-xl 
              p-5
            "
          >

            <div className="space-y-2">

  <div className="flex items-center text-left">

    <p className="w-[100px] text-gray-400 text-[12px]">
      Invoice No
    </p>

    <span className="mx-4 text-gray-400 text-left">
      :
    </span>

    <p className="font-medium text-[#262626] text-left text-[12px]">
      {invoice?.invoiceNo}
    </p>

  </div>

  <div className="flex items-center text-left">

    <p className="w-[100px] text-gray-400 text-[12px]">
      Status
    </p>

    <span className="mx-4 text-gray-400 text-left">
      :
    </span>

    <p className="text-[#FF4D4F] font-medium text-left text-[12px]">
      {invoice?.status}
    </p>

  </div>

</div>

          </div>

          {/* Total Refund */}
          <div
            className="
              flex
              justify-between
              mt-6
              mb-4
            "
          >
            <span className="text-[12px]">
              Total Refund
            </span>

            <span
              className="
                text-2xl
                font-semibold text-[13px]
              "
            >
              ₹ 3,260
            </span>

          </div>

          {/* Section */}
          <div
            className="
border-soft rounded-xl mb-4 text-[13px]">

            <div
              className="
                flex
                justify-between
                p-4
                border-b border-gray-300
              "
            >
              <span>
                Unpaid Invoices
              </span>

              <span>
                - ₹ 1,200
              </span>
            </div>

            <table className="w-full">

              <thead>
                <tr>
                  <th className="p-3 text-left">
                    Invoice No
                  </th>

                  <th className="p-3 text-left">
                    Type
                  </th>

                  <th className="p-3 text-right">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td className="p-3 text-blue-600 text-left">
                    INV001
                  </td>

                  <td className="p-3 text-left">
                    Manual
                  </td>

                  <td className="p-3 text-right">
                    ₹ 500
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

          {/* Refundable Advance */}
          <div
            className="
              border-soft
              rounded-xl
              p-4
              mb-4
            "
          >
            <div
              className="
                flex
                justify-between
              "
            >
              <span className="text-[13px]">
                Refundable Advance
              </span>

              <span className="text-[13px]">
                ₹ 2,100
              </span>
            </div>
          </div>

          {/* Booking */}
          <div className="border-soft rounded-xl overflow-hidden mb-4 text-[13px]">

  <SectionHeader
    title="Booking"
    amount="₹ 0.00"
    link="INV-457"
  />

  <table className="w-full">

    <thead className="bg-[#FAFAFA]">

      <tr>
        <th className="px-4 py-3 text-left text-[11px]">
          APPLIED TO
        </th>

        <th className="px-4 py-3 text-left text-[11px]">
          DATE
        </th>

        <th className="px-4 py-3 text-right text-[11px]">
          APPLIED AMOUNT
        </th>
      </tr>

    </thead>

    <tbody>

      <tr>

        <td className="px-4 py-4 text-[#2563EB] text-left">
          ADV001
        </td>

        <td className="px-4 py-4 text-left">
          10 Dec 2025
        </td>

        <td className="px-4 py-4 text-right">
          ₹ 500.00
        </td>

      </tr>

    </tbody>

  </table>

</div>

          {/* Refundable Rent */}
          <div className="border-soft rounded-xl overflow-hidden mb-4">

  <SectionHeader
    title="Refundable Rent"
    amount="₹ 3,200"
  />

  <div className="p-4 text-[13px]">

    <div className="flex justify-between mb-4">
      <span>Last Rent Paid (30 Days)</span>
      <span>₹ 6,000</span>
    </div>

    <div className="flex justify-between mb-4">
      <span>Actual Stay Days (Rent)- 14</span>
      <span>₹ 2,800</span>
    </div>

    <div className="bg-[#FAFAFA] rounded-lg p-3">

      <div className="flex justify-between">

        <span className="text-[#2563EB] text-sm">
          Ground Floor | G 005 - B 03
        </span>

        <span className="text-xs">
          (10 days * 200)
        </span>

      </div>

      <div className="flex justify-between mt-3">

        <span className="text-[#2563EB] text-sm">
          First Floor | F 002 - B 01
        </span>

        <span className="text-xs">
          (04 days * 200)
        </span>

      </div>

    </div>

  </div>

</div>

          {/* Electricity */}
        <div className="border-soft rounded-xl overflow-hidden">

  <SectionHeader
    title="Electricity Bill"
    amount="₹ 300"
  />

  <div className="p-4 text-left">

    <p className="font-medium mb-4">
      Missed Electricity
    </p>

    <div className="border-b border-gray-300 pb-4">

      <div className="flex justify-between">

        <div>

          <p>
            Ground Floor | G 005 - B 03
          </p>

          <span
            className="
              inline-block
              mt-2
              px-2
              py-1
              bg-[#FFF7E6]
              text-[#FA8C16]
              text-[11px]
              rounded
            "
          >
            01 Dec 2025 - 16 Dec 2025
          </span>

        </div>

        <div className="text-right">

          <p className="text-xs">
            (17 Units)
          </p>

          <p>
            ₹ 170
          </p>

        </div>

      </div>

    </div>

    <div className="pt-4">

      <p className="font-medium mb-3">
        Pending invoices
      </p>

      <div className="flex justify-between">

        <div>

          <p>
            First Floor | F 002 - B 01
          </p>

          <span
            className="
              inline-block
              mt-2
              px-2
              py-1
              bg-[#F0F5FF]
              text-[#2563EB]
              text-[11px]
              rounded
            "
          >
            03 Jan - 13 Jan 2025
          </span>

        </div>

        <button
          className="
            text-[#2563EB]
            flex
            items-center
            gap-1
          "
        >
          + Add
        </button>

      </div>

    </div>

  </div>

</div>

        </div>

      </div>

    </div>
  );
};

export default InvoiceOverviewDrawer;