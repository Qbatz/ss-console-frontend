import React from "react";

const ProductSupport = ({hostelData}) => {

    return(
<div className="bg-white border border-[#E6E8F0] rounded-xl overflow-hidden">

  {/* FIXED HEIGHT */}
  <div className="h-[320px] flex flex-col">

    {/* TABLE HEADER */}
    <table className="w-full text-sm border-b border-gray-200">
      <thead className="bg-[#F5F7FB] text-gray-600 text-xs">
        <tr>
          <th className="px-4 py-3 text-left">TICKET ID</th>
          <th className="px-4 py-3 text-left">CREATED ON</th>
          <th className="px-4 py-3 text-left">RAISED BY</th>
          <th className="px-4 py-3 text-left">CATEGORY</th>
          <th className="px-4 py-3 text-left">PRIORITY</th>
          <th className="px-4 py-3 text-left">STATUS</th>
          <th className="px-4 py-3 text-left">ASSIGNED TO</th>
          <th className="px-4 py-3 text-left">ACTIONS</th>
        </tr>
      </thead>
    </table>

    {/* SCROLLABLE BODY */}
    <div className="flex-1 overflow-y-auto">

      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-200">

          {Array.from({ length: 20 }).map((_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-blue-600">#TKT10{i}</td>
              <td className="px-4 py-3">20 Oct 2025</td>
              <td className="px-4 py-3">Hari Krishnan</td>
              <td className="px-4 py-3">General Query</td>
              <td className="px-4 py-3">Medium</td>
              <td className="px-4 py-3">Open</td>
              <td className="px-4 py-3">Unassigned</td>
              <td className="px-4 py-3">⋮</td>
            </tr>
          ))}

        </tbody>
      </table>

    </div>

  </div>

</div>
    )
}
export default ProductSupport;