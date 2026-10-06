import React,{useState,useEffect} from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useDashboard } from "../../Context/DashboardContext";

const Home = () => {
   const { dashboardData, getDashboard } = useDashboard();
   const [regionFilter, setRegionFilter] = useState("THIS_MONTH");
   const [hoverRegion, setHoverRegion] = useState(null);

   useEffect(() => {
  getDashboard("THIS_MONTH");
}, []);

     

  const stats = [
    {
      title: "TOTAL HOSTELS",
      value: dashboardData?.hostelCount || 0,
      subtitle: "All registered properties",
    },
    {
      title: "ACTIVE PROPERTIES",
      value: dashboardData?.activeHostelCount || 0,
      subtitle: "Currently active",
      active: true,
    },
    {
      title: "BEDS",
      value: dashboardData?.bedCount || 0,
      subtitle: "Total registered beds",
    },
    {
      title: "CUSTOMERS",
      value: dashboardData?.ownersCount || 0,
      subtitle: "Total customers",
    },
  ];

  const adoptionStats = [
    {
      title: "PAID PROPERTIES",
      value: dashboardData?.paidHostelCount || 0,
      subtitle: "Paid at least once",
    },
    {
      title: "ACTIVE PAID PROPS",
      value:  dashboardData?.activePaidHostelCount || 0,
      subtitle: "Currently active & paid",
    },
    {
      title: "MULTI-BRANCH",
      value: dashboardData?.multiBranchOwnerCount || 0,
      subtitle: "Customers w/ multiple properties",
    },
    {
      title: "USED IN LAST 45 DAYS",
      value: dashboardData?.usedLast45DaysCount || 0,
      subtitle: "Properties with recent activity",
      // percentage: "+8.2%",
    },
  ];

 const regions = dashboardData?.regionGraphData || [];
 const maxCount = Math.max(
  ...regions.map((item) => Number(item.count) || 0),
  1
);

 const recentRegions = dashboardData?.regionData || [];
 const customers = dashboardData?.ownerData || [];
 const activities = dashboardData?.userActivitiesData || [];
 

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F8FAFC] px-7 py-5">


        <div className="flex items-start justify-between mb-5">

          <div>
            <h1 className="text-[17px] font-semibold text-[#111827] text-left">
              Dashboard
            </h1>

            <p className="text-[10px] text-[#98A2B3] mt-1 text-left">
              Overview of SmartStay properties, customers and usage.
            </p>
          </div>

        </div>



        <p className="text-[12px] font-semibold tracking-[1.5px] text-[#667085] mb-2 text-left">
          OVERALL SCALE
        </p>

        <div className="grid grid-cols-4 gap-2.5 mb-5 text-left">

          {stats.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg border px-3.5 py-3 h-[83px] ${item.active
                  ? "bg-[#2448E8] border-[#2448E8] text-white"
                  : "bg-white border-[#D9DDE5]"
                }`}
            >

              <p
                className={`text-[11px] tracking-[1.2px] font-medium ${item.active
                    ? "text-blue-100"
                    : "text-[#98A2B3]"
                  }`}
              >
                {item.title}
              </p>

              <h2
                className={`text-[23px] leading-7 font-semibold mt-1 ${item.active
                    ? "text-white"
                    : "text-[#111827]"
                  }`}
              >
                {item.value}
              </h2>

              <p
                className={`text-[10px] mt-1 ${item.active
                    ? "text-blue-100"
                    : "text-[#98A2B3]"
                  }`}
              >
                {item.subtitle}
              </p>

            </div>
          ))}

        </div>



        <p className="text-[12px] font-semibold tracking-[1.5px] text-[#667085] mb-2 text-left">
          CUSTOMER ADOPTION
        </p>

        <div className="grid grid-cols-4 gap-2.5 mb-5 text-left ">

          {adoptionStats.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-[#D9DDE5] rounded-lg px-3.5 py-3 h-[83px]"
            >

              <p className="text-[11px] tracking-[1.2px] text-[#98A2B3] font-medium">
                {item.title}
              </p>

              <h2 className="text-[23px] leading-7 font-semibold text-[#111827] mt-1">
                {item.value}
              </h2>

              <div className="flex items-center justify-between">

                <p className="text-[10px] text-[#98A2B3] mt-1">
                  {item.subtitle}
                </p>

                {item.percentage && (
                  <span className="text-[8px] text-green-600 font-medium">
                    ↗ {item.percentage}
                  </span>
                )}

              </div>

            </div>
          ))}

        </div>



        <p className="text-[12px] font-semibold tracking-[1.5px] text-[#667085] mb-2 text-left">
          GEOGRAPHIC GROWTH
        </p>

        <div className="grid grid-cols-[2fr_0.72fr] gap-2.5 mb-5 items-start">


          <div className="bg-white border border-[#D9DDE5] rounded-lg p-4">

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-[12px] font-semibold text-[#111827] text-left">
                  New Customers & Properties by Region
                </h2>

                <p className="text-[8px] text-[#98A2B3] mt-1 text-left">
                  Where SmartStay is gaining new customers
                </p>
              </div>

              <div className="flex gap-2">

                

      <select
  value={regionFilter}
  onChange={async (e) => {
    const value = e.target.value;

    setRegionFilter(value);

    await getDashboard(value);
  }}
  className="h-[25px] border border-[#D9DDE5] rounded-md px-2 text-[8px] outline-none bg-white"
>
  {dashboardData?.regionGraphDateFilters?.map((filter) => (
    <option
      key={filter.key}
      value={filter.key}
    >
      {filter.label}
    </option>
  ))}
</select>

              </div>

            </div>



            

<div className="mt-5">

  {regions.map((region, index) => {
const regionDetails = dashboardData?.regionData?.find(
  (item) => item.city === region.city
);
   

 const width = `${((Number(region.count) || 0) / maxCount) * 100}%`;

    return (
      <div
        key={index}
        className="flex items-center gap-3 mb-4"
      >

        
        <span className="w-[80px] text-right text-[11px] text-[#475467] truncate">
          {region.city}
        </span>

        
        <div
          className="flex-1 h-[18px] relative flex items-center"
          onMouseEnter={() => setHoverRegion(region)}
          onMouseLeave={() => setHoverRegion(null)}
        >

       
          <div className="absolute left-0 right-0 border-b border-dashed border-[#EEF2F6]" />

          
          <div
            className="relative h-[8px] rounded-r-sm bg-[#91A2E9] cursor-pointer"
            style={{
              width,
            }}
          />

         {hoverRegion?.city === region.city && (
  <div
    className="absolute z-50 bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-3 py-2"
    style={{
      left: `calc(${width} - 110px)`,
      top: "-65px",
      width: "112px",
    }}
  >

    
    <p className="text-[8px] font-semibold text-[#344054] mb-2">
      {region.city}
    </p>

    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-1.5">
        <span className="w-[6px] h-[6px] rounded-full bg-[#2448FF]" />

        <span className="text-[7px] text-[#667085]">
          New Customers
        </span>
      </div>

      <span className="text-[7px] font-semibold text-[#344054]">
        {regionDetails?.ownerCount || 0}
      </span>
    </div>

   
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="w-[6px] h-[6px] rounded-full bg-[#91A2E9]" />

        <span className="text-[7px] text-[#667085]">
          New Properties
        </span>
      </div>

      <span className="text-[7px] font-semibold text-[#344054]">
        {regionDetails?.hostelCount || 0}
      </span>
    </div>

  </div>
)}

        </div>

      </div>
    );
  })}

</div>

          



  <div className="ml-[93px] mt-1 flex justify-between text-[10px] text-[#98A2B3]">
  <span>0</span>

  <span>{Math.round(maxCount * 0.25)}</span>

  <span>{Math.round(maxCount * 0.5)}</span>

  <span>{Math.round(maxCount * 0.75)}</span>

  <span>{maxCount}</span>
</div>


            
            <div className="border-t border-[#EEF2F6] mt-4 pt-3 flex items-center gap-5">

             

              <div className="flex items-center gap-1.5">
                <span className="w-[11px] h-[11px] rounded-full bg-[#91A2E9]" />
                <span className="text-[8px] text-[#667085]">
                  New Properties
                </span>
              </div>

            </div>

          </div>



          <div className="bg-white border border-[#D9DDE5] rounded-lg p-4">

            <div className="flex items-center justify-between mb-3">

              <h2 className="text-[12px] font-semibold text-[#111827]">
                Recently Added Regions
              </h2>

             

            </div>

            <div>

             {recentRegions.map((region, index) => (
  <div
    key={index}
    className="flex gap-2 py-2.5 border-b border-[#F0F2F5] last:border-0"
  >
    <div className="w-5 h-5 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[8px]">
      ◉
    </div>

    <div className="text-left">
      <p className="text-[10px] font-semibold text-[#344054]">
        {region.city}, {region.state}
      </p>

      <p className="text-[9px] text-[#98A2B3] mt-0.5">
        {region.ownerCount} customers · {region.hostelCount} properties
      </p>

      <p className="text-[8px] text-[#B0B7C3] mt-0.5">
        {region.latestDateDisplay}
      </p>
    </div>
  </div>
))}

            </div>

          </div>

        </div>



        <p className="text-[12px] font-semibold tracking-[1.5px] text-[#667085] mb-2 text-left">
          CUSTOMERS & ACTIVITY
        </p>

        <div className="grid grid-cols-[2fr_0.72fr] gap-2.5">


          <div className="bg-white border border-[#D9DDE5] rounded-lg p-4 text-left">

  
  <div className="mb-3">
    <h2 className="text-[12px] font-semibold text-[#111827]">
      Largest Customers
    </h2>

    <p className="text-[8px] text-[#98A2B3] mt-1">
      Customers with the highest number of properties
    </p>
  </div>

 
  <div className="grid grid-cols-[1.5fr_0.55fr_0.55fr_0.55fr] px-1 pb-2 border-b border-[#EEF2F6]">

    <span className="text-[9px] tracking-[1px] text-[#98A2B3]">
      CUSTOMER
    </span>

    <span className="text-[9px] tracking-[1px] text-[#98A2B3]">
      PROPERTIES
    </span>

    <span className="text-[9px] tracking-[1px] text-[#98A2B3]">
      CITIES
    </span>

  </div>


  <div className="h-[180px] overflow-y-auto pr-1">

    {customers.map((customer, index) => (
      <div
        key={index}
        className="grid grid-cols-[1.5fr_0.55fr_0.55fr_0.55fr] items-center px-1 py-2.5 border-b border-[#F2F4F7] last:border-0"
      >

        <span className="text-[10px] text-[#344054]">
          {customer.ownerName}
        </span>

        <span className="text-[10px] font-semibold text-blue-600">
          {customer.hostelCount}
        </span>

        <span className="text-[10px] text-[#667085]">
          {customer.cityCount}
        </span>

      </div>
    ))}

  </div>

</div>



          <div className="bg-white border border-[#D9DDE5] rounded-lg p-4">

            <div className="flex items-center justify-between mb-3">

              <h2 className="text-[12px] font-semibold text-[#111827]">
                Recent Activity
              </h2>

              

            </div>


  <div className="h-[300px] overflow-y-auto pr-1">
  {activities.map((activity, index) => (
    <div
      key={index}
      className="flex gap-2 py-2.5 border-b border-[#F0F2F5] last:border-0"
    >

     
      <div className="w-7 h-7 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[8px] overflow-hidden">
        {activity?.hostelMainImage ? (
          <img
            src={activity.hostelMainImage}
            alt={activity?.hostelInitials || "Hostel"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>
            {activity?.hostelInitials || "NA"}
          </span>
        )}
      </div>

      <div className="text-left min-w-0">

        {/* Activity */}
        <p className="text-[10px] font-semibold text-[#344054]">
          {activity?.description || "Activity updated"}
        </p>

        {/* Hostel Name */}
        <p className="text-[9px] text-[#667085] mt-0.5">
          {activity?.hostelName || "N/A"}
        </p>

        {/* Source */}
        <p className="text-[8px] text-[#98A2B3] mt-0.5">
          {activity?.source || "N/A"}
        </p>

        {/* Address */}
        <p className="text-[8px] text-[#98A2B3] mt-0.5 truncate">
          {activity?.hostelAddress || "N/A"}
        </p>

        {/* Time */}
        <p className="text-[8px] text-[#B0B7C3] mt-0.5">
          ◷ {activity?.dateDisplay || ""}
        </p>

      </div>

    </div>
  ))}
</div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Home;