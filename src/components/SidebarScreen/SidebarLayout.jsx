import React, { useState } from "react";
import SsIcon from "../../assets/SsIcon.png";
import mailImg from "../../assets/Mail.png";
import notificationImg from "../../assets/Bell.png";
import { NavLink } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">


      
      <div className="h-[50px] bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0 pb-2">

     
        <div className="flex items-center gap-2">
            <button
    className="md:hidden text-2xl"
    onClick={() => setSidebarOpen(true)}
  >
    ☰
  </button>
          <img src={SsIcon} className="h-6" />
          <span className="text-blue-600 font-semibold text-lg">
            Smartstay
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-[450px]">
            <input
              type="text"
              placeholder='Try search "where did my user come from"'
              className="w-full border border-gray-200 rounded-full pl-5 pr-20 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium">
              Search
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={mailImg} className="w-[18px] h-[18px]" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] px-1 rounded-full">
              2
            </span>
          </div>

          <img src={notificationImg} className="w-[18px] h-[18px]" />

          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>

      
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
      {/* Sidebar */}
<div
  className={`
    fixed md:static top-0 left-0 h-full w-[240px] bg-white border-r border-gray-200 pt-6 px-4
    transform transition-transform duration-300 z-40
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
>

  {/* Close button (mobile only) */}
  <div className="md:hidden flex justify-end mb-4">
    <button onClick={() => setSidebarOpen(false)}>✕</button>
  </div>

  <div className="space-y-1 text-gray-600 text-sm">
    <SidebarItem title="Home" count="35" to="/home" />
    <SidebarItem title="Proprietors" count="04" to="/proprietors" />
    <SidebarItem title="Properties" count="05" to="/properties"/>
    <SidebarItem title="Subscriptions" count="05" to="/subscription"/>
    <SidebarItem title="Billings" to ="/billing"/>
    <SidebarItem title="Support Tickets" count="2" to="/supportTicket"/>
    <SidebarItem title="CRM Dashboard" count="2" to="/crmDashboard"/>
    <SidebarItem title="roles" count="2" to="/roles" />
    <SidebarItem title="IAM-Admin User" count="2" to="/iam-admin-user"/>
  </div>
</div>

{sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/30 md:hidden z-30"
    onClick={() => setSidebarOpen(false)}
  />
)}

        {/* Scrollable Content */}
       <div className="flex-1 overflow-y-auto px-6 py-2 md:px-2 bg-white scrollbar-hide pb-14">
        <div className="w-full">
          {children}
          </div>
        </div>

      </div>
    </div>
  );
};

const SidebarItem = ({ title, count, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
      ${
        isActive
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100 text-gray-600"
      }`
    }
  >
    <span>{title}</span>
    {count && (
      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </NavLink>
);


export default DashboardLayout;
