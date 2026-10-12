import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";
import { useNavigate } from "react-router-dom";
import LocationGrey from "../../assets/locationGrey.png";
import LocationBlue from "../../assets/location.png";
import Arrow from "../../assets/arrow-up.png"

export default function OnboardingInsights() {
  const { getHostelGraph } = useHostel();
const navigate = useNavigate();
  const [period, setPeriod] = useState("MONTH");

  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHostelGraph("MONTH");
  }, []);

  const fetchHostelGraph = async (filter = "MONTH") => {
    try {
      setLoading(true);

      const res = await getHostelGraph(filter);

      if (res?.success) {
        setGraphData(res.data);
      }
    } catch (error) {
      console.error("Hostel graph error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (filterKey) => {
    setPeriod(filterKey);
    fetchHostelGraph(filterKey);
  };

  const cardData = graphData?.hostelGraphCardData;
  const chartData = graphData?.hostelOnboardedData ?? [];
  const regions = graphData?.hostelGraphRegionData ?? [];
  const filters = graphData?.onboardedDateFilters ?? [];



  const maxValue = Math.max(
    1,
    ...chartData.map((item) => Number(item.hostelCount) || 0)
  );

  const chartScale = Math.ceil(maxValue / 4) * 4 || 4;
  const yAxisValues = [
    chartScale,
    Math.round(chartScale * 0.75),
    Math.round(chartScale * 0.5),
    Math.round(chartScale * 0.25),
    0,
  ];

  const percentageDifference =
    Number(cardData?.onboardedPercentageDifference) || 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:px-8 md:py-6 font-inter">
        <div className="mx-auto max-w-[1200px]">

        
        
<div className="border-b border-gray-200 pb-4 mb-5 text-left">
  <div className="flex items-center gap-3 mb-2">
   
     <img src={Arrow} alt="arrow" className="w-5 h-5 cursor-pointer" onClick={() => navigate(-1)}/>
    

    <h1 className="text-xl font-semibold text-[#111827]">
      Properties
    </h1>
  </div>

  <p className="text-xs text-gray-400 mt-1">
    Track property onboarding across regions and time periods.
  </p>
</div>


          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

            <div className="rounded-lg border border-gray-200 bg-white p-4 text-left">
              <p className="text-[10px] text-gray-500 uppercase">
                Total Properties
              </p>
              <h2 className="text-2xl font-bold mt-1">
                {cardData?.hostelCount ?? 0}
              </h2>
              <p className="text-[10px] text-gray-400">
                All registered properties
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white  p-4 text-left">
              <p className="text-[10px] text-gray-500 uppercase ">
                Onboarded — This Month
              </p>

              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-2xl font-bold">
                  {cardData?.onboardedThisMonth ?? 0}
                </h2>

                <span
  className={`text-[10px] font-medium ${
    percentageDifference >= 0 ? "text-green-600" : "text-red-500"
  }`}
>
  {percentageDifference >= 0 ? "↗" : "↘"}{" "}
  {percentageDifference > 0 ? "+" : ""}
  {percentageDifference}%
</span>
              </div>

              <p className="text-[10px] text-gray-400">
                vs previous period
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 text-left">
              <p className="text-[10px] text-gray-500 uppercase">
                Top Region
              </p>
<h2 className="flex items-center gap-1 font-semibold mt-1 text-sm">
  <img
    src={LocationBlue}
    alt="location"
    className="w-4 h-4 object-contain"
  />
  {cardData?.topRegion ?? "-"}
</h2>
              <h2 className="font-semibold mt-1 text-sm">
                {cardData?.topRegionHostelCount ?? "-"}
              </h2>
              <p className="text-[10px] text-gray-400">
                {cardData?.topRegionPercentage ?? 0}% of all onboardings
              </p>
            </div>
          </div>

          
          <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-5 mb-4">

            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="text-left">
                <h2 className="text-sm font-semibold">
                  Properties Onboarded
                </h2>

                <p className="text-[10px] text-gray-400 mt-1">
                  {filters.find((item) => item.key === period)?.label ?? "Month"}
                </p>
              </div>

              {/* API-based filters */}
              <div className="flex flex-wrap items-center gap-1">
                {filters.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    disabled={loading}
                    onClick={() => handlePeriodChange(item.key)}
                    className={`px-3 py-2 text-[10px] rounded-md transition-colors ${period === item.key
                        ? "bg-white text-blue-600 shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      } ${loading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                  >
                    {item.label}
                  </button>
                ))}


              </div>
            </div>

            {loading && !graphData ? (
              <div className="h-[240px] flex items-center justify-center text-sm text-gray-400">
                Loading onboarding insights...
              </div>
            ) : (
              <>
                {/* Bar Chart */}
                <div className="flex h-[240px]">
                  <div className="flex flex-col justify-between text-[10px] text-gray-400 pr-3 pb-6">
                    {yAxisValues.map((value, index) => (
                      <span key={`${value}-${index}`}>{value}</span>
                    ))}
                  </div>

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="relative flex-1 flex items-end justify-around border-b border-gray-100">

                      {yAxisValues.map((value, index) => (
                        <div
                          key={`${value}-${index}`}
                          className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                          style={{
                            bottom: `${(value / chartScale) * 100}%`,
                          }}
                        />
                      ))}

                    {chartData.map((item, index) => {
  const count = Number(item.hostelCount) || 0;

  return (
    <div
      key={`${item.label}-${index}`}
      className="group relative z-10 h-full flex-1 flex items-end justify-center"
    >
      
      <div
        className={`w-8 md:w-10 rounded-t cursor-pointer transition-all duration-200 ${
          index === chartData.length - 1
            ? "bg-[#2446E8]"
            : "bg-[#C7D2FE] group-hover:bg-[#2446E8]"
        }`}
        style={{
          height: `${(count / chartScale) * 100}%`,
          minHeight: count > 0 ? "2px" : "0",
        }}
      />

      
      <div
        className="
          absolute
          z-50
          left-1/2
          -translate-x-1/2
          bottom-[55%]
          pointer-events-none
          opacity-0
          invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all
          duration-200
          bg-white
          border
          border-gray-200
          rounded-md
          shadow-lg
          px-3
          py-2
          min-w-[95px]
          whitespace-nowrap
        "
      >
        <p className="text-[9px] text-gray-400 mb-1 text-left">
          {item.label}
        </p>

        <div className="flex items-center gap-1.5 text-left">
          <span className="w-2 h-2 rounded-full bg-[#2446E8]" />

          <span className="text-[10px] font-semibold text-gray-800">
            {count} Properties
          </span>
        </div>
      </div>
    </div>
  );
})}
                    </div>

                    <div className="flex justify-around pt-2">
                      {chartData.map((item, index) => (
                        <span
                          key={`${item.label}-${index}`}
                          className="flex-1 text-center text-[10px] text-gray-500"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-3">
                  Latest period highlighted in blue
                </p>
              </>
            )}
          </div>


          <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-5">
            <h2 className="text-sm font-semibold mb-4 text-left">
              Onboarding by Region
            </h2>

            <div className="space-y-3">
              {regions.map((item) => (
                <div key={item.region}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="flex items-center gap-1 text-[11px] text-gray-600">
  <img
    src={LocationGrey}
    alt="location"
    className="w-3 h-3 object-contain"
  />
  {item.region}
</span>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-medium">
                        {item.regionHostelCount}
                      </span>

                      <span className="text-[10px] text-gray-400 w-7 text-right">
                        {item.regionPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2446E8]"
                      style={{
                        width: `${Math.min(
                          100,
                          Number(item.regionPercentage) || 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {!regions.length && (
                <p className="text-xs text-gray-400">
                  No region data available.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}