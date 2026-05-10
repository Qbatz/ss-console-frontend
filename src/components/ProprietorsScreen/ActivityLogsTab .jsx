import React from "react";

const ActivityLogsTab = ({ activities }) => {

  return (
    <div className="overflow-x-auto">

      <div className="max-h-[300px] overflow-y-auto border border-[#E6E8F0] rounded-xl">

        <table className="min-w-full text-sm">

          {/* Header */}
          <thead className="bg-[#F8F9FF] sticky top-0 z-20">

            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">DATE</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">EVENT TYPE</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">DETAILS</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ADMIN / USER</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">Platform</th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ACTIONS</th>
            </tr>

          </thead>

          <tbody className="divide-y divide-gray-200">

            {activities?.activities?.length > 0 ? (

              activities.activities.map((item) => (

                <tr
                  key={item.activityId}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-2 text-left font-medium text-[12px]">
                    {item.activityDate}
                  </td>

                  <td className="px-4 py-2 text-left font-medium text-[12px]">
                    {item.activityType}
                  </td>

                  <td className="px-4 py-2 text-left font-medium text-[12px]">
                    {item.description}
                  </td>

                  <td className="px-4 py-2 text-left font-medium text-[12px]">
                    {item.userName}
                  </td>
                  <td className="px-4 py-2 text-left font-medium text-[12px]">
                    {item.platform || "N/A"}
                  </td>

                  <td className="px-4 py-2 text-left font-medium text-[12px]">
                    ⋮
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No Activity Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ActivityLogsTab;