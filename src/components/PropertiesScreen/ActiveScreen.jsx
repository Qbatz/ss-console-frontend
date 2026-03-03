import React from "react";

function PropertyActive({ hostelData }) {

  const activities = hostelData?.activities || [];

  return (
    <div className="bg-white border border-[#E6E8F0] rounded-xl overflow-hidden">

      {/* Scroll Container */}
      <div className="max-h-[350px] overflow-y-auto">

        <table className="w-full text-sm">

          {/* Header */}
          <thead className="bg-[#F5F7FB] text-gray-500 text-xs sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-left">
                Activity
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-left">
                User
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-left">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-left">
                Time
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-left">
                Source
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-left">
                Type
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">

            {activities.length > 0 ? (
              activities.map((item) => (
              <tr
        key={item.activityId}
        className="hover:bg-gray-50 border-b border-gray-300"
      >

                  <td className="px-4 py-2 text-[12px] text-left">
                    {item.description || "N/A"}
                  </td>

                  <td className="px-4 py-2 text-[12px] text-left">
                    {item.userName || "N/A"}
                  </td>

                  <td className="px-4 py-2 text-[12px] text-left">
                    {item.activityDate || "N/A"}
                  </td>

                  <td className="px-4 py-2 text-[12px] text-left">
                    {item.activityTime || "N/A"}
                  </td>

                  <td className="px-4 py-2 text-[12px] text-left">
                    {item.source || "N/A"}
                  </td>

                  <td className="px-4 py-2 text-[12px] text-left">
                    {item.activityType || "N/A"}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No Data Found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PropertyActive;