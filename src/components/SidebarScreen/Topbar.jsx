import React from "react";
import SsIcon from "../../assets/SsIcon.png";
import mailImg from "../../assets/Mail.png";
import notificationImg from "../../assets/Bell.png";

const Topbar = () => {
  return (
    <div className="bg-white h-[58px] border-b border-gray-200 flex items-center justify-between px-8">

      {/* LEFT - Logo */}
      <div className="flex items-center gap-2">
        <img src={SsIcon} className="h-7" />
        <span className="text-blue-600 font-semibold text-lg">
          Smartstay
        </span>
      </div>

      {/* CENTER - Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-[480px]">
          <input
            type="text"
            placeholder='Try search "where did my user come from"'
            className="w-full border border-gray-200 rounded-full pl-5 pr-20 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium">
            Search
          </button>
        </div>
      </div>

      {/* RIGHT - Icons */}
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
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
  );
};

export default Topbar;
