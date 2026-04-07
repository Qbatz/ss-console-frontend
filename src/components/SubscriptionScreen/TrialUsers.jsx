import React, { useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";

const TrailPage = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const data = Array.from({ length: 50 }).map((_, i) => ({
    id: `TXN00${i + 1}`,
    date: "05 Apr 2026",
    customer: "Arunachalam R",
    property: "Laksha Ladies Hostel",
    city: "Velachery , Chennai",
    plan: i % 2 === 0 ? "Basic" : "Pro plan",
  }));

  return (
    <DashboardLayout>
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
                TrailUsers
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
          <p className="text-sm text-gray-500">Total Trials</p>
          <h2 className="text-xl font-semibold">85</h2>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 w-64">
          <p className="text-sm text-gray-500">Expiring Today</p>
          <h2 className="text-xl font-semibold">0</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-3">

        <div className="flex gap-2">
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>This Month</option>
          </select>

          <button className="border border-gray-300 px-3 py-1 rounded text-sm">
            Filter
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-blue-500 text-white p-2 rounded">
            🔄
          </button>

          <input
            placeholder="Search..."
            className="border border-gray-300 rounded px-3 py-1 text-sm"
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
          <th className="px-4 py-3 text-[12px] font-semibold text-left">REGION / CITY</th>
          <th className="px-4 py-3 text-[12px] font-semibold text-left">PLAN TYPE</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border-t border-gray-300">

            <td className="px-4 py-2 text-[12px] text-left">{item.id}</td>
            <td className="px-4 py-2 text-[12px] text-left">{item.date}</td>
            <td className="px-4 py-2 text-[12px] text-left">{item.customer}</td>
            <td className="px-4 py-2 text-[12px] text-left">{item.property}</td>
            <td className="px-4 py-2 text-[12px] text-left">{item.city}</td>
            <td className="px-4 py-2 text-[12px] text-left">{item.plan}</td>

          </tr>
        ))}
      </tbody>

    </table>

  </div>
</div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 text-sm">
        <p>
          Total Record Count : <span className="text-blue-600">69</span>
        </p>

        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1">
            <option>20</option>
          </select>

          <button>{"<"}</button>
          <span>1 - 10</span>
          <button>{">"}</button>
        </div>
      </div>

    </div>
    </DashboardLayout>
  );
};

export default TrailPage;