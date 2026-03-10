import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useNavigate } from "react-router-dom";
import SubscriptionsTab from "./SubscriptionTab";
import ProductSupportTab from "./ProductSupportTab ";
import ActivityLogsTab from "./ActivityLogsTab ";
import Arrow from "../../assets/arrow-up.png"
const ProprietorsOverview = () => {
const navigate = useNavigate();
 const location = useLocation();
 const ownerData = location.state?.ownerData;
  

  const [activeTab, setActiveTab] = useState("properties");
console.log("ownerData",ownerData)
const formatDateTime = (date, time) => {
  if (!date) return "-";
  const d = new Date(date.split("/").reverse().join("-"));
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }) + " " + (time || "");
};
  return (
    <DashboardLayout>

      <div className="p-6 space-y-6">

      
        <div
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-sm  cursor-pointer hover:text-gray-700"
>
  <img src={Arrow} width={20} height={20} /><span>Proprietor Detail</span>
</div>

      
<div className="bg-[#F6F8FE] border border-gray-300 rounded-2xl px-8 py-6">

 
  <div className="flex items-center gap-4">

    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">

  {ownerData?.profileUrl ? (
    <img
      src={ownerData.profileUrl}
      alt="profile"
      className="w-full h-full object-cover"
    />
  ) : (
    ownerData?.initials
  )}

</div>

    <div>
      <h2 className="font-semibold text-lg text-gray-800 text-left">
        {ownerData?.fullName}
      </h2>

      <p className="text-sm text-gray-500">
{ownerData?.ownerId?.slice(-8)} | {formatDateTime(ownerData?.lastActivityDate, ownerData?.lastActivityTime)}
</p>
    </div>

  </div>


  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-6 text-sm">

    <div>
      <p className="text-gray-900 text-left">Mobile No</p>
      <p className="font-medium text-gray-500 text-left">+91 {ownerData?.mobileNo}</p>
    </div>

    <div>
      <p className="text-gray-900 text-left">Props</p>
      <p className="font-medium text-blue-500 text-left">
        {ownerData?.noOfProperties}
      </p>
    </div>

    <div>
      <p className="text-gray-900 text-left">Plan Status</p>
      <p className="font-medium text-gray-500 text-left">Active</p>
    </div>

    <div>
      <p className="text-gray-900 text-left">Status</p>
       <p className="font-medium text-gray-500 text-left">Active</p>

    </div>

  </div>

</div>

       
   <div className="flex items-center justify-between">

  {/* Tabs */}
  <div className="border-b border-[#E6E8F0] flex gap-6 text-sm">

    <button
      onClick={() => setActiveTab("properties")}
      className={`pb-2 ${
        activeTab === "properties"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      Properties
    </button>

    <button
      onClick={() => setActiveTab("subscriptions")}
      className={`pb-2 ${
        activeTab === "subscriptions"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      Subscriptions
    </button>

    <button
      onClick={() => setActiveTab("support")}
      className={`pb-2 ${
        activeTab === "support"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      Product Support
    </button>

    <button
      onClick={() => setActiveTab("logs")}
      className={`pb-2 ${
        activeTab === "logs"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      History
    </button>

  </div>

  {/* Search + Filter */}
  <div className="flex items-center gap-3">

    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="border border-[#E6E8F0] rounded-md pl-8 pr-3 py-2 text-sm"
      />
      <span className="absolute left-2 top-2 text-gray-400"></span>
    </div>

    <select className="border border-[#E6E8F0] rounded-md px-3 py-2 text-sm">
      <option>This Month</option>
    </select>

  </div>

</div>
        {/* Tab Content */}

        {activeTab === "properties" && 
    <div className="bg-white border border-[#E6E8F0] rounded-xl max-h-[300px] overflow-y-auto">

  <table className="min-w-full text-sm">

   
    <thead className="bg-[#F8F9FF] sticky top-0 z-20">
      <tr>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ID</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">NAME</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">TYPE</th>
        <th className="px-4 py-3 text-left whitespace-nowrap font-semibold text-[12px] uppercase text-[#6B7280] font-inter">REGION / CITY</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">SUB PLAN</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ADDED ON</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ACTIONS</th>
      </tr>
    </thead>

  
   <tbody className="divide-y divide-gray-200">

      {ownerData?.properties?.length > 0 ? (

        ownerData.properties.map((property, index) => (

          <tr key={property.hostelId} className="hover:bg-gray-50">

            <td className="px-4 py-3 text-left font-medium text-[12px]">{index + 1}</td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property.hostelName}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
             N/A
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property.city},{property.state}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property?.hostelPlan?.planName}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property.createdAt}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              ⋮
            </td>

          </tr>

        ))

      ) : (

        <tr>
          <td colSpan="7" className="text-center py-10 text-gray-500">
            No Data Found
          </td>
        </tr>

      )}

    </tbody>

  </table>

</div>
        }
        {activeTab === "subscriptions" && <SubscriptionsTab properties={ownerData?.properties}/>}
        {activeTab === "support" && <ProductSupportTab />}
        {activeTab === "logs" && <ActivityLogsTab activities={ownerData}/>}

      </div>

    </DashboardLayout>
  );
};

export default ProprietorsOverview;