import React, { useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import OverviewSubscriptions from "./OverviewSubscription";
import { useLocation,useNavigate  } from "react-router-dom";
import Mobile from "../../assets/mobile.png";
import locationImg from "../../assets/location.png";
import Arrow from "../../assets/maximize.png";
import Crown from "../../assets/crown.png";
import refresh from "../../assets/refresh.png";
import arrowleft from "../../assets/arrow-up.png";
import ViewImg from "../../assets/View.png";
import ProductSupport from "./ProductSupport";
import StaffScreen from "./StaffScreen";
import InvoicesScreen from "./InvoicesScreen";
import PropertyActive from "./ActiveScreen";
import swap from "../../assets/arrowswap.png";

const PropertyOverview = () => {
  const [activeTab, setActiveTab] = useState("tenants");
  const location = useLocation();
  const navigate = useNavigate();

  const hostelData = location.state?.hostelData;
  console.log("hostelData", hostelData)

  if (!hostelData) return <div className="p-5">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="pl-2 pr-2 min-h-screen">


        <div className="flex items-center ">
          {/* <span className="text-xl cursor-pointer"  onClick={() => navigate(-1)}> ←  </span> */}
          <img src={arrowleft} height={20} width={20} className="text-xl cursor-pointer" onClick={() => navigate(-1)}/>
          <p className="text-[20px] leading-[48px] font-medium text-[#1F2937] font-sans ml-2">
  Property Overview
</p>
        </div>


       <div className="bg-[#F6F8FC] border border-[#E6E8F0] rounded-xl p-5">

  {/* Top Section */}
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

    {/* Left */}
    <div className="flex items-center gap-4">

      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
        {hostelData.initials}
      </div>

      <div>
        <h2 className="text-[24px] font-semibold text-gray-900 text-left font-sans">
          {hostelData.hostelName}
        </h2>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          {hostelData.hostelId?.slice(0, 6)} |
          <span className="text-[#2563EB] cursor-pointer">
            {hostelData.ownerInfo?.fullName}
          </span>

          <img src={Arrow} className="w-3 h-3 ml-1" />
        </p>
      </div>
    </div>


    {/* Right */}
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <img src={refresh} className="w-8 h-8" />
      <span>
        {hostelData.createdAtDate}
      </span>

      {/* Menu */}
      <img src={ViewImg} width={18} height={18}/>
      <div className="text-gray-400 cursor-pointer text-xl">⋮</div>
    </div>

  </div>


  {/* Bottom Info Row */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">

    {/* Mobile */}
    <div className="flex items-start gap-3">
      <img src={Mobile} className="w-5 h-5 mt-1" />

      <div>
        <p className="  text-[#1D1D1D] text-left font-sans font-medium text-[12px]">Mobile No</p>
        <p className="text-sm font-medium font-sans">
          +91 {hostelData.mobile}
        </p>
      </div>
    </div>


    {/* Location */}
    <div className="flex items-start gap-3">
      <img src={locationImg} className="w-5 h-5 mt-1" />

      <div>
        <p className="text-[#1D1D1D] text-left font-sans font-medium text-[12px]">Region / City</p>

        <p className="text-sm font-medium text-[#2563EB] flex items-center gap-1">
          {hostelData.city}, {hostelData.state}
          <img src={Arrow} className="w-3 h-3" />
        </p>
      </div>
    </div>


    {/* Subscription */}
    <div className="flex items-start gap-3">
      <img src={Crown} className="w-5 h-5 mt-1" />

      <div>
        <p className="  text-[#1D1D1D] text-left font-sans font-medium text-[12px]">Subscription Plan</p>

        <p className="text-sm font-medium flex items-center gap-1">
          {hostelData.hostelPlan?.currentPlan}
        </p>
      </div>
    </div>


    {/* Status */}
    <div className="flex items-start gap-3">
   

      <div>
        <p className="  text-[#1D1D1D] text-left font-sans font-medium text-[12px]">Status</p>

        <p className="text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>

          <span className="text-green-600">Active</span>

          <span className="text-gray-400 text-xs">
            22 Days Left to Renew
          </span>
        </p>
      </div>
    </div>

  </div>

</div>


        {activeTab === "tenants" && (
          <div className="bg-white border border-gray-300 rounded-xl p-4 mt-4">

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:divide-x lg:divide-gray-200">

  {/* Active Tenants */}
  <div className="px-2 lg:px-4">
    <div className="flex items-center gap-1">
      <p className="text-xs text-gray-500">Active Tenants</p>
      {/* <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" /> */}
    </div>

    <p className="text-lg font-semibold mt-1">
      {hostelData.noOfTenants}
    </p>
  </div>


  {/* Rooms & Beds */}
  <div className="px-2 lg:px-4">
    <div className="flex items-center gap-1">
      <p className="text-xs text-gray-500">Rooms & Beds</p>
      <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" />
    </div>

    <p className="text-lg font-semibold mt-1">
      {hostelData.noOfRooms} | {hostelData.noOfBeds}
    </p>
  </div>


  
  <div className="px-2 lg:px-4">
    <div className="flex items-center gap-1">
      <p className="text-xs text-gray-500">Revenue Generated</p>
      {/* <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" /> */}
    </div>

    <p className="text-lg font-semibold mt-1">₹0</p>
  </div>


  {/* Invoices */}
  <div className="px-2 lg:px-4">
    <div className="flex items-center gap-1">
      <p className="text-xs text-gray-500">Total Invoices</p>
      <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" />
    </div>

    <p className="text-lg font-semibold mt-1">0</p>
  </div>


  {/* Support */}
  <div className="px-2 lg:px-4">
    <div className="flex items-center gap-1">
      <p className="text-xs text-gray-500">Support Tickets</p>
   
    </div>

    <p className="text-lg font-semibold mt-1">0</p>
  </div>

</div>
          </div>
        )}


        <div className="bg-white rounded-xl mt-4 flex flex-col">


          {/* <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-5 pt-4 gap-3"> */}
<div className="sticky top-0 z-20 bg-white flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-5 pt-4 gap-3 ">

            <div className="flex gap-6 border-b border-[#E6E8F0] overflow-x-auto">

              {["tenants", "subscriptions", "Product Support", "staffs", "invoices", "activity"]
                .map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium font-sans capitalize border-b-2 whitespace-nowrap ${activeTab === tab
                        ? "border-[#2563EB] text-[#2563EB]"
                        : "border-transparent text-gray-500"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
            </div>


            <div className="flex items-center gap-3 pb-3 lg:pb-4">

              <input
                placeholder="Search..."
                className="border border-[#E6E8F0] rounded-lg px-4 py-2 text-sm w-40 lg:w-56"
              />

              <select className="border border-[#E6E8F0] rounded-lg px-3 py-2 text-sm">
                <option>Active</option>
              </select>

            </div>
          </div>


          {activeTab === "tenants" && (
   <div className="overflow-x-auto">

  
  <div className="max-h-[330px] overflow-y-auto border border-[#E6E8F0] rounded-xl">

    <table className="w-full text-sm">

     <thead className="bg-[#F8F9FF] sticky top-0 z-10">
  <tr>

    <th className="px-4 py-3 text-left">
      <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
        ID
        <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
      </div>
    </th>

    <th className="px-4 py-3 text-left">
      <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
        Name
        <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
      </div>
    </th>

    <th className="px-4 py-3 text-left">
      <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
        Mail
        <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
      </div>
    </th>

    <th className="px-4 py-3 text-left">
      <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
        Mobile No
        <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
      </div>
    </th>

    <th className="px-4 py-3 text-left">
      <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
        Status
        <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
      </div>
    </th>

  </tr>
</thead>

      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="px-4 py-2 text-left font-medium text-[12px]">N/A</td>
          <td className="px-4 py-2 text-[#2563EB] text-left font-medium text-[12px]">N/A</td>
          <td className="px-4 py-2 text-left font-medium text-[12px]">N/A</td>
          <td className="px-4 py-2 text-left font-medium text-[12px]">N/A</td>
          <td className="px-4 py-2 text-green-600 text-left font-medium text-[12px]">N/A</td>
        </tr>
      </tbody>

    </table>

  </div>
</div>
          )}


          {activeTab === "subscriptions" && (
            <OverviewSubscriptions hostelData={hostelData} />
          )}
            {activeTab === "Product Support" && (
            <ProductSupport hostelData={hostelData} />
          )}
            {activeTab === "staffs" && (
            <StaffScreen hostelData={hostelData} />
          )}
             {activeTab === "invoices" && (
            <InvoicesScreen hostelData={hostelData} />
          )}
           {activeTab === "activity" && (
            <PropertyActive hostelData={hostelData} />
          )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default PropertyOverview;
