import React from "react";

const SubscriptionsTab = ({ properties }) => {

  return (
    <div className="overflow-x-auto">

      <div className="max-h-[300px] overflow-y-auto border border-[#E6E8F0] rounded-xl">

        <table className="min-w-full text-sm">

          {/* Header */}
          <thead className="bg-[#F8F9FF] text-gray-600 text-xs sticky top-0 z-20 border-b border-[#E6E8F0]">

            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">NAME</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">SUB PLAN</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">BILLING CYCLE</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">AMOUNT</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">DUE DATE</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter whitespace-nowrap">RENEWAL STATUS</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ACTIONS</th>
            </tr>

          </thead>

          {/* Body */}
         <tbody className="divide-y divide-[#E6E8F0]">

  {properties?.length > 0 ? (

    properties.map((item) => {

      const plan = item.hostelPlan;

      return (

        <tr key={item.hostelId} className="hover:bg-gray-50">

          <td className="px-4 py-3 text-[#2563EB] text-left font-medium text-[12px]">
            {item.hostelName}
          </td>

          <td className="px-4 py-3 text-left font-medium text-[12px]">
            {plan?.planName || "-"}
          </td>

          <td className="px-4 py-3 text-left font-medium text-[12px] whitespace-nowrap">
            {plan?.planStartsAt} - {plan?.planEndsAt}
          </td>

          <td className="px-4 py-3 text-left font-medium text-[12px]">
            ₹ {plan?.planAmount || 0}
          </td>

          <td className="px-4 py-3 text-left font-medium text-[12px]">
            {plan?.planEndsAt}
          </td>

          <td className="px-4 py-3 text-left font-medium text-[12px]">

            {plan?.isPlanActive ? (
              <span className="text-green-600">Active</span>
            ) : (
              <span className="text-red-500">Expired</span>
            )}

          </td>

          <td className="px-4 py-3">⋮</td>

        </tr>

      );

    })

  ) : (

    <tr>
      <td colSpan="7" className="text-center py-10 text-gray-500">
        No Subscription Found
      </td>
    </tr>

  )}

</tbody>

        </table>

      </div>

    </div>
  );

};

export default SubscriptionsTab;