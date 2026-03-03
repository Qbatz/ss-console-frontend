import React from "react";

const OverviewSubscriptions = ({hostelData}) => {
  const currentSub = hostelData?.currentSubscription;
  console.log("hostelData",hostelData)
  return (
    <div className="px-5 py-4 space-y-8">

      {/* Current Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-left">
          Current
        </h3>

        <div className="bg-white border border-[#E6E8F0] rounded-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-[#F5F7FB] text-gray-500 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">SUB PLAN</th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">BILLING CYCLE</th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">AMOUNT</th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">DUE DATE</th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">STATEMENTS</th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">RENEWAL STATUS</th>
                <th className="px-4 py-3 text-right font-semibold text-[12px] uppercase text-[#6B7280] font-sans">ACTIONS</th>
              </tr>
            </thead>

            {/* <tbody className="divide-y">

              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 text-left font-medium text-[12px]">N/A</td>
                <td className="px-4 py-2 text-left font-medium text-[12px]">N/A</td>
                <td className="px-4 py-2 text-left font-medium text-[12px]">N/A</td>
                <td className="px-4 py-2 text-left font-medium text-[12px]">N/A</td>
                <td className="px-4 py-2 text-left font-medium text-[12px]">---</td>
                <td className="px-4 py-2 text-left font-medium text-[12px]">
                 ---
                </td>
                <td className="px-4 py-2 text-center font-medium text-[12px]">⋮</td>
              </tr>

            </tbody> */}
            <tbody className="divide-y">

  {currentSub ? (
    <tr className="hover:bg-gray-50">

      <td className="px-4 py-2 text-left font-medium text-[12px]">
        {currentSub.planName || "N/A"}
      </td>

      <td className="px-4 py-2 text-left font-medium text-[12px]">
        {currentSub.planStartsAt} - {currentSub.planEndsAt}
      </td>

      <td className="px-4 py-2 text-left font-medium text-[12px]">
        ₹ {currentSub.planAmount ?? 0}
      </td>

      <td className="px-4 py-2 text-left font-medium text-[12px]">
        {currentSub.planEndsAt || "N/A"}
      </td>

      <td className="px-4 py-2 text-left font-medium text-[12px]">
        ---
      </td>

      <td className="px-4 py-2 text-left font-medium text-[12px]">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            hostelData?.subscriptionStatus?.toLowerCase() === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {hostelData?.subscriptionStatus || "N/A"}
        </span>
      </td>

      <td className="px-4 py-2 text-center font-medium text-[12px]">
        ⋮
      </td>

    </tr>
  ) : (
    <tr>
      <td colSpan={7} className="text-center py-6 text-gray-400">
        No Current Subscription
      </td>
    </tr>
  )}

</tbody>
          </table>

        </div>
      </div>


      
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-left">
          History
        </h3>

   <div className="bg-white border border-[#E6E8F0] rounded-xl overflow-hidden">

 
  <div className="max-h-[320px] overflow-y-auto">

    <table className="w-full text-sm">

      <thead className="bg-[#F5F7FB] text-gray-500 text-xs sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">SUB PLAN</th>
          <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">BILLING CYCLE</th>
          <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">AMOUNT</th>
          <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">DUE DATE</th>
          <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">STATEMENTS</th>
          <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">RENEWAL STATUS</th>
          <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-sans">ACTIONS</th>
        </tr>
      </thead>

   <tbody className="divide-y">

  {hostelData?.subscriptions && hostelData.subscriptions.length > 0 ? (
    hostelData.subscriptions.map((sub) => (
      <tr key={sub.subscriptionId} className="hover:bg-gray-50">

        <td className="px-4 py-3">{sub.planName || "N/A"}</td>

        <td className="px-4 py-3">
          {sub.planStartsAt || "N/A"} - {sub.planEndsAt || "N/A"}
        </td>

        <td className="px-4 py-2 text-left font-medium text-[12px]">
          ₹ {sub.planAmount ?? 0}
        </td>

        <td className="px-4 py-2 text-left font-medium text-[12px]">
          {sub.planEndsAt || "N/A"}
        </td>

        <td className="px-4 py-2 text-left font-medium text-[12px]">
          ---
        </td>

        <td className="px-4 py-2 text-left font-medium text-[12px]">
          Active
        </td>

        <td className="px-4 py-2 text-center font-medium text-[12px]">
          ⋮
        </td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={7} className="text-center py-6 text-gray-400">
        No Data Found
      </td>
    </tr>
  )}

</tbody>

    </table>

  </div>

</div>
      </div>


     
      {/* <div className="flex justify-between items-center text-sm pt-2">

        <span className="text-gray-600">
          Total Record Count :
          <span className="text-blue-600 font-medium ml-1">05</span>
        </span>

        <div className="flex items-center gap-3">

          <select className="border border-[#E6E8F0] rounded-md px-2 py-1">
            <option>20</option>
          </select>

          <button className="text-gray-400">‹</button>

          <span className="border px-3 py-1 rounded-md bg-gray-100">
            1
          </span>

          <button className="text-blue-600">›</button>

        </div>

      </div> */}

    </div>
  );
};

export default OverviewSubscriptions;
