import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useRole } from "../../Context/RoleContext";
import Arrow from "../../assets/arrow-up.png";
import UserBlack from "../../assets/userblack.png";
import Location from "../../assets/locationyellow.png";
import Crown from "../../assets/crown.png";
import Mail from "../../assets/Mail.png";
import Mobile from "../../assets/mobile.png";
import Message from "../../assets/message-2.png"

const UserInfo = () => {
  const navigate = useNavigate();
  console.log()

  const {agentId } = useParams();
  const {getAgentDetails } = useRole();
  const [agentDetails, setAgentDetails] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("activity");
  const [menuDirection, setMenuDirection] = useState("top");
  const [menuPos, setMenuPos] = useState({
  top: 0,
  left: 0
});
console.log("agentDetails",agentDetails)
  useEffect(() => {
    const fetchDetails = async () => {
      const res = await getAgentDetails(agentId);
      if (res?.success) {
        setAgentDetails(res.data);
      }
    };

    fetchDetails();
  }, [agentId]);

  useEffect(() => {
    const handleClick = () => setOpenMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
const subscriptions = agentDetails?.subscriptions || [];

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white flex items-center gap-4 px-4 sm:px-8 py-3 border-b border-gray-200">

          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 text-xl cursor-pointer"
          >
            <img src={Arrow} alt="Arrow" className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-[18px] font-semibold text-gray-900 leading-6 text-start">
              User Info
            </h2>
            <p className="text-[12px] text-gray-500">
              <span className="text-gray-800">IAM Users</span> › Overview
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[355px_1fr] min-h-[calc(100vh-61px)]">

          <div className="px-4 sm:px-5 py-6 border-b lg:border-b-0 lg:border-r border-gray-200">

            <div className="bg-[#FAFBFF] border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                 <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-sm font-semibold text-gray-700">
  {agentDetails?.initials || "NA"}
</div>

                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-900">
                      {agentDetails?.fullName || "Susi"}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {agentDetails?.roleName || "Support Agent"}
                    </p>
                  </div>
                </div>

                <button className="text-gray-700 text-xl cursor-pointer">⋮</button>
              </div>

              <div className="mt-5 space-y-3 text-[13px]">
                <p className="text-blue-600 flex items-center gap-2">
                  <img src={Mail} className="w-4 h-4" />
                  {agentDetails?.email || "susi.r5@gmail.com"}
                </p>
                <p className="text-blue-600 flex items-center gap-2">
                  <img src={Mobile} className="w-4 h-4" />
                  {agentDetails?.mobile || "+91 95782 34961"}
                </p>
              </div>

              {/* <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white border border-gray-200 rounded-md p-3 h-[72px]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                    Onboarded
                  </p>
                  <p className="text-blue-600 font-bold text-[22px] mt-2">05</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-3 h-[72px]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Trial Conv.
                  </p>
                  <p className="text-blue-600 font-bold text-[22px] mt-2">80%</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-3 h-[72px]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Avg. Support
                  </p>
                  <p className="text-blue-600 font-bold text-[22px] mt-2">2h</p>
                </div>
              </div> */}

              {/* <p className="text-[11px] text-blue-600 mt-3 text-start">
                ⓘ Based upon last 30 Days
              </p> */}
            </div>

            {/* Properties */}
            <h4 className="text-[13px] font-medium text-gray-800 mt-5 mb-3 text-start">
              Managing Properties
            </h4>

   <div className="border border-gray-200 rounded-2xl bg-white max-h-[400px] flex flex-col overflow-visible">

  {/* SCROLL AREA */}
<div
  className="overflow-y-auto flex-1 pr-1 overflow-x-visible"
  style={{
    scrollbarColor: "#D9E9FF transparent"
  }}
>
    {agentDetails?.hostelRelations?.length > 0 ? (

      agentDetails.hostelRelations.map((item, index) => (

        <div
          key={item.id}
          className={`flex items-start justify-between px-4 py-4
          ${index !== agentDetails.hostelRelations.length - 1
              ? "border-b border-gray-100"
              : ""
            }`}
        >

          {/* LEFT */}
          <div className="flex items-start gap-3 min-w-0">

            {/* IMAGE */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 shrink-0 flex items-center justify-center">

              {item.mainImage ? (

                <img
                  src={item.mainImage}
                  alt="Property"
                  className="w-full h-full object-cover"
                />

              ) : (

                <span className="text-[18px] font-semibold text-[#2563EB] uppercase">
                  {item.initials || "NA"}
                </span>

              )}

            </div>

            {/* CONTENT */}
            <div className="min-w-0">

              {/* NAME */}
              <p className="text-[14px] font-semibold text-gray-900 truncate text-left">
                {item.hostelName}
              </p>

              {/* LOCATION + PLAN */}
              <div className="mt-1">

                <div className="flex items-center gap-2 flex-wrap">

                  {/* LOCATION */}
                  <div className="relative group flex items-center gap-1">

                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>

                    <span className="text-[12px] text-gray-500 cursor-default">
                      {item.city}
                    </span>

                    {/* TOOLTIP */}
                    <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
                      {item.fullAddress}
                    </div>

                  </div>

                  {/* PLAN */}
                  <span
                    className={`text-[10px] px-2 py-[2px] rounded-full font-medium flex items-center gap-1
                    ${item.planName === "Premium"
                        ? "bg-orange-50 text-orange-600"
                        : item.planName === "Trial"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-600"
                      }`}
                  >
                    {item.planName !== "Trial" && "👑"}

                    {item.planName}
                  </span>

                </div>

                {/* EXPIRES */}
                {item.aboutToExpire && (
                  <div className="mt-2 text-left">

                    <span className="text-[10px] px-2 py-[3px] rounded-full bg-red-50 text-red-600 font-medium inline-flex">

                      {item.expiringInDays === 0
                        ? "Expires today"
                        : `Expires in ${item.expiringInDays} day${item.expiringInDays !== 1 ? "s" : ""}`
                      }

                    </span>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* MENU */}
          <div className="relative">

            <button
              className="text-gray-500 text-lg leading-none cursor-pointer"
 onClick={(e) => {

  e.stopPropagation();

  const rect =
    e.currentTarget.getBoundingClientRect();

  const viewportHeight =
    window.innerHeight;

  const menuHeight = 100;

  const spaceBelow =
    viewportHeight - rect.bottom;

  setMenuDirection(
    spaceBelow < menuHeight
      ? "top"
      : "bottom"
  );

  setMenuPos({
    top:
      spaceBelow < menuHeight
        ? rect.top - menuHeight
        : rect.bottom + 8,

    left: rect.left - 120
  });

  setOpenMenu(
    openMenu === index
      ? null
      : index
  );
}}
            >
              ⋮
            </button>

            {/* DROPDOWN */}
    {openMenu === index && (
  <div
    className="
      fixed z-[99999]
      bg-white border border-gray-200
      rounded-xl shadow-lg py-1 w-40
    "
   style={{
  top: menuPos.top,
  left: menuPos.left
}}
  >

                <button className="w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50">
                  Change Access
                </button>

                <button className="w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50">
                  Renew Subscription
                </button>

              </div>
            )}

          </div>

        </div>

      ))

    ) : (

      <div className="py-10 text-center text-gray-400 text-sm">
        No Properties Found
      </div>

    )}

  </div>

</div>
          </div>


          <div className="px-8 py-6">


            <div className="flex gap-10 mb-8">


              <button
                onClick={() => setActiveTab("activity")}
                className={`pb-2 text-[13px] font-semibold border-b-2 cursor-pointer ${activeTab === "activity"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent"
                  }`}
              >
                Recent Activity
              </button>

              {/* Subscriptions */}
              <button
                onClick={() => setActiveTab("subscription")}
                className={`pb-2 text-[13px] font-semibold border-b-2  cursor-pointer ${activeTab === "subscription"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent"
                  }`}
              >
                Subscriptions
              </button>

            </div>


            {activeTab === "activity" ? (

            <div className="relative pl-5 max-h-[400px] overflow-y-auto pr-2 text-left">
  {agentDetails?.agentActivities?.length > 0 ? (

    agentDetails.agentActivities.map((activity, index, arr) => (
      <div key={index} className="relative flex gap-5 pb-8">

        {index !== arr.length - 1 && (
          <div className="absolute left-[15px] top-9 w-px h-full bg-gray-200"></div>
        )}

        <div className="w-8 h-8 rounded-full bg-blue-50 border border-gray-200 flex items-center justify-center z-10">
          <img src={Message} className="w-4 h-4" />
        </div>

        <div>
          <div className="pt-1">
            <h4 className="text-[14px] font-semibold text-gray-900">
              {activity.activityType}
            </h4>
            <p className="text-[13px] text-gray-700 mt-2">
              {activity.description}
            </p>
            <p className="text-[11px] text-gray-500 mt-2">
              {activity.createdAtDate}, {activity.createdAtTime}
            </p>
          </div>
        </div>

      </div>
    ))

  ) : (
    <p className="text-gray-400 text-sm">No Activity Found</p>
  )}
</div>
            ) : (
            <div className="border border-gray-200 rounded-lg p-4 overflow-x-auto">
  <table className="w-full min-w-[650px] text-sm">
    
    {/* HEADER */}
    <thead>
      <tr className="text-gray-500 text-[12px] text-left border-b">
        <th className="pb-3">Property Name</th>
        <th className="pb-3">Plan Type</th>
        <th className="pb-3">Start Date</th>
        <th className="pb-3">Expiry Date</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody className="text-gray-700">

      {subscriptions.length > 0 ? (

        subscriptions.map((item) => (
          <tr key={item.id} className="border-b last:border-0">

            {/* Property */}
            <td className="py-4">{item.propertyName}</td>

            {/* Plan */}
            <td>
              <span
                className={`text-[10px] px-2 py-[2px] rounded
                ${item.planType === "STANDARD"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-orange-100 text-orange-600"}`}
              >
                {item.planType}
              </span>
            </td>

            {/* Dates */}
            <td>{item.startDate}</td>
            <td>{item.expiryDate}</td>

          </tr>
        ))

      ) : (

        <tr>
          <td
            colSpan="4"
            className="text-center py-8 text-gray-400 text-sm"
          >
            🚫 No Subscriptions Available
          </td>
        </tr>

      )}

    </tbody>
  </table>
</div>

            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserInfo;