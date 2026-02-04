import React from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";

const Proprietors = () => {
 return (
    <DashboardLayout>

      
     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 bg-gray-50 p-6 rounded-2xl">
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total Tickets</p>
          <h2 className="text-3xl font-semibold mt-2">186</h2>
          <p className="text-green-500 text-sm mt-3">
            ↑ 8.5% Up from yesterday
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Active Proprietors</p>
          <h2 className="text-3xl font-semibold mt-2">287</h2>
          <p className="text-green-500 text-sm mt-3">↑ 8.5%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Occupancy Rate</p>
          <h2 className="text-3xl font-semibold mt-2">67%</h2>
          <p className="text-red-500 text-sm mt-3">↓ 8.5%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Active Systems</p>
          <h2 className="text-3xl font-semibold mt-2">42</h2>
          <p className="text-green-500 text-sm mt-3">↑ 8.5%</p>
        </div>

      </div>


     
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Communication Performance (Notify Hub)
      </h2>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm mb-6">

       
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h3 className="font-medium text-base md:text-lg">
              Message Delivery Status
            </h3>
            <p className="text-sm text-gray-500">
              Communication delivery status across channels
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm">
              Email
            </button>
            <button className="border px-4 py-1.5 rounded-md text-sm">
              SMS
            </button>
          </div>

        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-sm text-gray-500">Sent</p>
            <h3 className="text-2xl font-semibold mt-2">12,456</h3>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <p className="text-sm text-gray-500">Delivered</p>
            <h3 className="text-2xl font-semibold mt-2 text-green-600">
              11,892
            </h3>
            <p className="text-sm text-green-500 mt-2">
              ✓ Successfully delivered
            </p>
          </div>

          <div className="bg-red-50 p-6 rounded-xl">
            <p className="text-sm text-gray-500">Failed</p>
            <h3 className="text-2xl font-semibold mt-2 text-red-600">
              564
            </h3>
            <p className="text-sm text-red-500 mt-2">
              ✕ Delivery failed
            </p>
          </div>

        </div>

      </div>


     
     <div className="bg-indigo-50 p-6 md:p-8 rounded-2xl shadow-sm">


        <p className="text-sm text-gray-500 mb-2">Latest Campaign</p>

        <h3 className="font-medium mb-6 text-base md:text-lg">
          Monthly Billing Reminder - October 2025
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
          <p>Sent Date: Oct 28, 2025</p>
          <p>Recipients: 287</p>
          <p className="text-green-600">Delivery Rate: 96%</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 border rounded-md py-2 hover:bg-gray-50 transition bg-white">
            View Campaign
          </button>

          <button className="flex-1 border border-red-300 text-red-500 rounded-md py-2 hover:bg-red-50 transition bg-white">
            Check Failed Logs
          </button>
        </div>

      </div>
<div className="mt-6">
  <button className="w-full bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
    View All Campaigns
    <span>→</span>
  </button>
</div>
    </DashboardLayout>
  );
};

export default Proprietors;
