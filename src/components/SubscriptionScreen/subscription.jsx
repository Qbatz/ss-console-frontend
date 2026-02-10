import React, { useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subscriptions");

  return (
    <DashboardLayout>
      <div className="p-6 pt-1">

       
        <div className="border-b border-gray-200 mb-3 pb-2">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* LEFT SIDE */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">

              {/* Title */}
              <h1 className="text-lg font-semibold font-inter">
                Subscriptions
              </h1>

              {/* Tabs */}
              <div className="flex gap-6 text-sm font-medium font-inter">
                <button
                  onClick={() => setActiveTab("subscriptions")}
                  className={`text-[13px] pb-2 ${activeTab === "subscriptions"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                    }`}
                >
                  Subscriptions
                </button>

                <button
                  onClick={() => setActiveTab("demo")}
                  className={`text-[13px] pb-2 ${activeTab === "demo"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                    }`}
                >
                  Demo Requests
                </button>
              </div>

            </div>

            {/* RIGHT SIDE BUTTON */}
            <button
              onClick={() => navigate("/manage-plans")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium font-inter w-full sm:w-fit"
            >
              Manage Plans
            </button>

          </div>

        </div>



       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm font-gilroy">Active Properties</p>
            <h2 className="text-2xl font-bold mt-2">45</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm font-gilroy">Expired Properties</p>
            <h2 className="text-2xl font-bold mt-2">24</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm font-gilroy">Basic</p>
            <h2 className="text-2xl font-bold mt-2">12</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm font-gilroy">Trial</p>
            <h2 className="text-2xl font-bold mt-2">09</h2>
          </div>

        </div>

       
        <div className="mb-4 bg-white py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <select className="border px-3 py-1 rounded-lg text-xs font-sans">
                <option>All</option>
                <option>Active</option>
                <option>Expired</option>
              </select>

              <select className="border px-3 py-2 rounded-lg text-xs font-sans">
                <option>This Month</option>
                <option>Last Month</option>
              </select>

              <button className="border px-4 py-2 rounded-lg text-xs font-sans">
                Filter
              </button>
            </div>

            <input
              type="text"
              placeholder="Search..."
              className="border px-4 py-2 rounded-lg text-sm w-64"
            />
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border">

          <div className="max-h-[320px] overflow-y-auto">

            <table className="w-full text-sm">

             
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10 font-Inter">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Property Name</th>
                  <th className="px-4 py-3 text-left">Proprietor</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Plan Type</th>
                  <th className="px-4 py-3 text-left">Start Date</th>
                  <th className="px-4 py-3 text-left">Expiry Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50 text-[12px] font-Inter">
                    <td className="px-4 py-2">SM7626</td>
                    <td className="px-4 py-2 text-blue-600">
                      Laksha Ladies Hostel
                    </td>
                    <td className="px-4 py-2">Anish Raj</td>
                    <td className="px-4 py-2 text-green-600">Active</td>
                    <td className="px-4 py-2">Premium</td>
                    <td className="px-4 py-2">02-Oct-2025</td>
                    <td className="px-4 py-2">01-Nov-2025</td>
                    <td className="px-4 py-2 text-center">⋮</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>









        {/* Footer Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">

          <span className="font-small font-sans text-sm">
            Total Record Count : <span className="text-blue-600">69</span>
          </span>

          <div className="flex items-center gap-4">
            <select className="border px-2 py-1 rounded-md font-sans text-xs">
              <option>20</option>
              <option>50</option>
            </select>

            <span className="font-sans text-xs">1 - 10</span>

            <button className="font-sans text-xs">{"<"}</button>
            <button className="font-sans text-xs">{">"}</button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Subscription;
