import React from "react";
import SsIcon from "../../assets/SsIcon.png";

const Sidebar = () => {
  return (
    <div className="w-[220px] bg-white border-r border-gray-200 pt-6 px-4">

      <div className="space-y-2 text-gray-600 text-sm">

        <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-medium">
          Home
        </div>

        <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          Proprietors
        </div>

        <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          Properties
        </div>

        <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          Subscriptions
        </div>

        <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          Billings
        </div>

        <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          Support Tickets
        </div>

        <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          CRM Dashboard
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
