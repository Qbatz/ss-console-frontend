import React, { useEffect, useState,useRef } from "react";
import SsIcon from "../../assets/SsIcon.png";
import mailImg from "../../assets/Mail.png";
import notificationImg from "../../assets/Bell.png";
import { NavLink } from "react-router-dom";
import { useRole } from "../../Context/RoleContext";
import Home from "../../assets/home.png";
import Users from "../../assets/users.png";
import Buildings from "../../assets/buildings.png";
import Subscription from "../../assets/subscriptions.png";
import Billings from "../../assets/billings.png";
import Support from "../../assets/supportticket.png";
import Dashbord from "../../assets/spacedashboard.png";
import Roles from "../../assets/roles.png";
import Admin from "../../assets/adminuser.png";
import { useDashboard } from "../../Context/DashboardContext";
import { useLocation } from "react-router-dom";
import Drop from "../../assets/direction-down 01.png"

const DashboardLayout = ({ children }) => {

  const { adminDetails, agentRoles, getAgentRoles, getAgentRoleById, loading, deleteAgentRole, errorMsg, accessError } = useRole();
  const { dashboardData, getDashboard } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openSales, setOpenSales] = useState(false);

  const [recurringOpen, setRecurringOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
    if (
      location.pathname.includes("/demo-requests") ||
      location.pathname.includes("/subscription") ||
      location.pathname.includes("/trial-users") ||
      location.pathname.includes("/transactions")
    ) {
      setOpenSales(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    getDashboard()
  }, [])

  const handleLogout = () => {
    // 🔥 clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("mock_token");
    localStorage.removeItem("login_type");

    // redirect flag clear
    sessionStorage.removeItem("redirecting");

    // 🔥 go to login page
    window.location.replace("/");
  };
  useEffect(() => {
    if (
      location.pathname.includes("/Recurring-Bill") ||
      location.pathname.includes("/tenant-Bill")
    ) {
      setRecurringOpen(true);
    }
  }, [location.pathname]);
  console.log("dashboardData", dashboardData);
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
<div className="relative" ref={menuRef}>

  {/* PROFILE */}
  <div
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="cursor-pointer"
  >
    {adminDetails?.profilePic ? (
      <img
        src={adminDetails.profilePic}
        className="w-8 h-8 rounded-full object-cover"
        alt="profile"
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
        {adminDetails?.initials || "NA"}
      </div>
    )}
  </div>

  {/* DROPDOWN */}
  {showProfileMenu && (
  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-md z-[9999]">
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500 cursor-pointer"
    >
      Logout
    </button>
  </div>
)}

</div>
        
          {/* {adminDetails?.profilePic ? (
            <img
              src={adminDetails.profilePic}
              className="w-8 h-8 rounded-full object-cover"
              alt="profile"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
              {adminDetails?.initials || "NA"}
            </div>
          )} */}
        </div>
      </div>


     <div className="flex flex-1 overflow-hidden min-h-0">


        <div
          className={`
    fixed md:static top-0 left-0 h-full w-[240px] bg-white border-r border-gray-200 pt-6 px-4
    transform transition-transform duration-300 z-40
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
        >


          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          {/* <div className="space-y-2 text-gray-600 text-sm landing-7 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin"> */}
          <div className="space-y-2 text-gray-600 text-[12px] landing-7 
  max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin
  whitespace-nowrap ">



            <SidebarItem title="Home" count="0" to={`/home/${adminDetails?.roleId}`} activeIcon={Home}
              inactiveIcon={Home} />


            {/* <SidebarItem title="Proprietors" count={dashboardData?.ownersCount || 0} to={`/proprietors/${adminDetails?.roleId}`} activeIcon={Users}
              inactiveIcon={Users} /> */}
            <SidebarItem
              title="Proprietors"
              count={dashboardData?.ownersCount || 0}
              to={`/proprietors/${adminDetails?.roleId}`}
              activeIcon={Users}
              inactiveIcon={Users}
              customActivePaths={["/proprietors", "/ProprietorsOverview"]}
            />

            {/* <SidebarItem title="Properties" count={dashboardData?.hostelCount || 0} to={`/properties/${adminDetails?.roleId}`} activeIcon={Buildings}
              inactiveIcon={Buildings} /> */}
            <SidebarItem
              title="Properties"
              count={dashboardData?.hostelCount || 0}
              to={`/properties/${adminDetails?.roleId}`}
              activeIcon={Buildings}
              inactiveIcon={Buildings}
              customActivePaths={["/properties", "/property-overview"]}
            />

            {/* <SidebarItem title="Subscriptions" count="0" to={`/subscription/${adminDetails?.roleId}`} activeIcon={Subscription}
              inactiveIcon={Subscription} />

            <SidebarItem
              title="DemoRequests"
              count={dashboardData?.demoRequestCount || 0}
              to={`/demo-requests/${adminDetails?.roleId}`}
              activeIcon={Subscription}
              inactiveIcon={Subscription}
            /> */}
            <div>

              {/* Parent */}
              <div
                onClick={() => {
                  setOpenSales(!openSales);
                  setRecurringOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img src={Users} className="w-5 h-5" />
                  <span className="text-[12px]">Sales</span>
                </div>

                <span className={`transform transition ${openSales ? "rotate-180" : ""}`}>
                  <img src={Drop} className="w-5 h-5" />
                </span>
              </div>

              {/* Children */}
              {openSales && (
                <div className="ml-7 mt-1 space-y-1">

                  <SidebarItem
                    title="Demo Requests"
                    count={dashboardData?.demoRequestCount || 0}
                    to={`/demo-requests/${adminDetails?.roleId}`}
                    // activeIcon={Subscription}
                    // inactiveIcon={Subscription}
                  />

                  <SidebarItem
                    title="Subscriptions"
                    to={`/subscription/${adminDetails?.roleId}`}
                    // activeIcon={Subscription}
                    // inactiveIcon={Subscription}
                  />

                  <SidebarItem
                    title="Trial Users"
                    to={`/trial-users/${adminDetails?.roleId}`}
                    // activeIcon={Users}
                    // inactiveIcon={Users}
                  />

                  <SidebarItem
                    title="Transactions"
                    to={`/transactions/${adminDetails?.roleId}`}
                    // activeIcon={Billings}
                    // inactiveIcon={Billings}
                  />

                </div>
              )}

            </div>
            <SidebarItem title="Billings" to={`/billing/${adminDetails?.roleId}`} activeIcon={Billings}
              inactiveIcon={Billings} />
              <SidebarItem title="Invoice-Redemption" to={`/invoice-redemption/${adminDetails?.roleId}`} activeIcon={Billings}
              inactiveIcon={Billings} />

            {/* <SidebarItem title="Monthly Recurring" count="0" to={`/Recurring-Bill/${adminDetails?.roleId}`} /> */}


            {/* <SidebarItem
              title="Monthly Recurring"count="0"to={`/Recurring-Bill/${adminDetails?.roleId}`}
            />
             <SidebarItem
              title="Tenant Recurring"count="0"to={`/tenant-Bill/${adminDetails?.roleId}`}/> */}
            <div>
              {/* Parent */}

              <div
                onClick={() => {
                  setRecurringOpen(!recurringOpen);
                  setOpenSales(false);
                }}
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img src={Subscription} className="w-5 h-5" />
                  <span className="text-[12px]">Recurring Monitor</span>
                </div>

                <span className={`transform transition ${recurringOpen ? "rotate-180" : ""}`}>
                  <img src={Drop} className="w-5 h-5" />
                </span>
              </div>

              {/* Children */}
              {recurringOpen && (
                <div className="ml-8 mt-1 space-y-1 text-[12px]">

                  <SidebarItem
                    title="Monthly Recurring"
                    to={`/Recurring-Bill/${adminDetails?.roleId}`}
                  />

                  <SidebarItem
                    title="Tenant Recurring"
                    to={`/tenant-Bill/${adminDetails?.roleId}`}
                  />

                </div>
              )}
            </div>


            <SidebarItem title="Tenants Summary" count="0" to={`/tenantList/${adminDetails?.roleId}`} activeIcon={Users}
              inactiveIcon={Users} />
               <SidebarItem title="Table Customization" count="0" to={`/tableCustomize/${adminDetails?.roleId}`} activeIcon={Users}
              inactiveIcon={Users} />

            <SidebarItem title="Support Tickets" count="0" to={`/supportTicket/${adminDetails?.roleId}`} activeIcon={Support}
              inactiveIcon={Support} />

            <SidebarItem title="CRM Dashboard" count="0" to={`/crmDashboard/${adminDetails?.roleId}`} activeIcon={Dashbord}
              inactiveIcon={Dashbord} />


            <SidebarItem title="IAM-Admin User" count={dashboardData?.agentCount || 0} to={`/iam-admin-user/${adminDetails?.roleId}`} activeIcon={Admin}
              inactiveIcon={Admin} />

            <SidebarItem title="roles" count="0" to={`/roles/${adminDetails?.roleId}`} activeIcon={Roles}
              inactiveIcon={Roles} />

          </div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Scrollable Content */}
       {/* <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6 mt-1 md:px-2 bg-white pb-14"> */}
   <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-6 mt-1 md:px-2 bg-white pb-14">
          <div className="w-full">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

// const SidebarItem = ({ img,title, count, to }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       `flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
//       ${
//         isActive
//           ? "bg-blue-50 text-blue-600 font-medium"
//           : "hover:bg-gray-100 text-gray-600"
//       }`
//     }
//   >
//     <span>{title}</span>
//     {count && (
//       <span className="text-xs bg-gray-100 px-2  rounded-full">
//         {count}
//       </span>
//     )}

//   </NavLink>

// );

// const SidebarItem = ({ title, count, to, activeIcon, inactiveIcon }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       `flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
//       ${isActive
//         ? "bg-blue-50 text-blue-600 font-medium"
//         : "hover:bg-gray-100 text-gray-600"
//       }`
//     }
//   >
//     {({ isActive }) => (
//       <>
//         <div className="flex items-center gap-5">
//           <img
//             src={isActive ? activeIcon : inactiveIcon}
//             className="w-5 h-5"
//           />
//           <span className="whitespace-nowrap">{title}</span>
//         </div>

//         {count && (
//           <span className="text-xs bg-gray-100 px-2 rounded-full text-blue-500">
//             {count}
//           </span>
//         )}
//       </>
//     )}
//   </NavLink>
// );


// const SidebarItem = ({
//   title,
//   count,
//   to,
//   activeIcon,
//   inactiveIcon,
//   customActivePaths = []
// }) => {
//   const location = useLocation();

//   const isActive =
//     customActivePaths.length > 0
//       ? customActivePaths.some(path =>
//           location.pathname.startsWith(path)
//         )
//       : location.pathname === to;

//   return (
//     <NavLink
//       to={to}
//       className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
//         ${isActive
//           ? "bg-blue-50 text-blue-600 font-medium"
//           : "hover:bg-gray-100 text-gray-600"
//         }`}
//     >
//       <div className="flex items-center gap-5">
//         <img
//           src={isActive ? activeIcon : inactiveIcon}
//           className="w-5 h-5"
//         />
//         <span>{title}</span>
//       </div>

//       {count && (
//         <span className="text-xs bg-gray-100 px-2 rounded-full text-blue-500">
//           {count}
//         </span>
//       )}
//     </NavLink>
//   );
// };

const SidebarItem = ({
  title,
  count,
  to,
  activeIcon,
  inactiveIcon,
  customActivePaths = []
}) => {
  const location = useLocation();

  const isActive =
    customActivePaths.length > 0
      ? customActivePaths.some(path =>
        location.pathname.startsWith(path)
      )
      : location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center justify-between px-1 py-2 rounded-lg cursor-pointer transition text-[12px]
        ${isActive
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100 text-gray-600"
        }`}
    >
      <div className="flex items-center gap-3">
        {activeIcon && inactiveIcon && (
          <img
            src={isActive ? activeIcon : inactiveIcon}
            className="w-5 h-5"
          />
        )}

        <span>{title}</span>
      </div>

      {count && (
        <span className="text-xs bg-gray-100 px-2 rounded-full text-blue-500 text-[11px]">
          {count}
        </span>
      )}
    </NavLink>
  );
};
export default DashboardLayout;
