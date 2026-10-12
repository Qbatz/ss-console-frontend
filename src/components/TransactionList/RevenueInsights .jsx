import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useSubscription } from "../../Context/SubscriptionContext";

const RevenueInsights = () => {
    const { getOrderHistoryGraph } = useSubscription();
    const [compare, setCompare] = useState("");

    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [showCompareDropdown, setShowCompareDropdown] = useState(false);
    
    const today = new Date();

    const [customMonth, setCustomMonth] = useState(
        String(today.getMonth() + 1)
    );
    const [customYear, setCustomYear] = useState(
        String(today.getFullYear())
    );

    const [showCustomMonth, setShowCustomMonth] = useState(false);

    const loadRevenueGraph = async (
        filter = "CUSTOM_MONTH",
        month = "",
        year = ""
    ) => {
        try {
            setLoading(true);

            let res;


            if (filter === "CUSTOM_MONTH" && month && year) {
                res = await getOrderHistoryGraph(
                    "CUSTOM_MONTH",
                    month,
                    year
                );
            } else {

                res = await getOrderHistoryGraph(filter);
            }

            if (res?.success) {
                setGraphData(res.data);
            }
        } catch (error) {
            console.error("Revenue graph error:", error);
        } finally {
            setLoading(false);
        }
        console.log("filter",filter)
    };


    useEffect(() => {
        loadRevenueGraph("CUSTOM_MONTH");
    }, []);
    const isCustomMonthFilter =
  graphData?.comparisonFilters?.length > 0 &&
  compare === "CUSTOM_MONTH";

    const handleComparisonChange = async (e) => {
        const value = e.target.value;

        setCompare(value);

        if (value === "THIS_MONTH") {
            const month = String(new Date().getMonth() + 1);
            const year = String(new Date().getFullYear());

            setCustomMonth(month);
            setCustomYear(year);
            setShowCustomMonth(false);

            await loadRevenueGraph("CUSTOM_MONTH", month, year);
            return;
        }

        if (value === "CUSTOM_MONTH") {
            setShowCustomMonth(true);
            return;
        }

        setShowCustomMonth(false);

        if (value === "MONTH" || value === "QUARTER") {
            await loadRevenueGraph(value);
        }
    };

    const handleCustomMonthChange = async (month, year) => {
        setCustomMonth(month);
        setCustomYear(year);

        if (month && year) {
            await loadRevenueGraph("CUSTOM_MONTH", month, year);
        }
    };

    const currentData = graphData?.current?.records || [];
    console.log("currentData",currentData)

    const comparisonData =
        compare !== "NONE"
            ? graphData?.comparison?.records || []
            : [];

const isSameMonth =
  compare === "THIS_MONTH" &&
  graphData?.current?.label === graphData?.comparison?.label;

    const allRevenueValues = [
        ...currentData.map((item) => Number(item?.revenue || 0)),
        ...comparisonData.map((item) => Number(item?.revenue || 0)),
    ];

    const maxRevenue =
        allRevenueValues.length > 0
            ? Math.max(...allRevenueValues)
            : 0;


    const getYAxisMax = (value) => {
        if (value <= 1000) return 1000;
        if (value <= 5000) return 5000;
        if (value <= 10000) return 10000;
        if (value <= 25000) return 25000;
        if (value <= 50000) return 50000;
        if (value <= 100000) return 100000;

        return Math.ceil(value / 10000) * 10000;
    };

    const yAxisMax = getYAxisMax(maxRevenue);

    const yAxisValues = [
        yAxisMax,
        yAxisMax * 0.75,
        yAxisMax * 0.5,
        yAxisMax * 0.25,
        0,
    ];


    const formatAxisValue = (value) => {
        if (value >= 100000) {
            return `₹${Math.round(value / 1000)}K`;
        }

        if (value >= 1000) {
            return `₹${Math.round(value / 1000)}K`;
        }

        return `₹${Math.round(value)}`;
    };


    const generatePoints = (data) => {
        if (!data || data.length === 0) {
            return "";
        }

        if (data.length === 1) {
            return `400,${200 - ((Number(data[0]?.revenue || 0) / yAxisMax) * 170)}`;
        }

        return data
            .map((item, index) => {
                const revenue = Number(item?.revenue || 0);

                const x =
                    (index / (data.length - 1)) * 800;

                const y =
                    185 -
                    (revenue / yAxisMax) * 165;

                return `${x},${y}`;
            })
            .join(" ");
    };


    const generateCirclePoints = (data) => {
        if (!data || data.length === 0) {
            return [];
        }

        if (data.length === 1) {
            const revenue = Number(data[0]?.revenue || 0);

            return [
                {
                    x: 400,
                    y: 185 - (revenue / yAxisMax) * 165,
                    value: revenue,
                },
            ];
        }

        return data.map((item, index) => {
            const revenue = Number(item?.revenue || 0);

            const x =
                (index / (data.length - 1)) * 800;

            const y =
                185 -
                (revenue / yAxisMax) * 165;

            return {
                x,
                y,
                value: revenue,
            };
        });
    };

    const currentPoints =
        generateCirclePoints(currentData);

    const comparisonPoints =
        generateCirclePoints(comparisonData);


    const formatRevenue = (value) => {
        return Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };

    const getComparisonLabel = () => {
        if (compare === "MONTH") {
            return "vs previous month";
        }

        if (compare === "QUARTER") {
            return "vs previous quarter";
        }

        return "";
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#F8FAFC] px-7 py-5">


                <div className="flex items-start justify-between border-b border-[#D9DDE5] pb-3">

                    <div>
                        <h1 className="text-[16px] font-semibold text-[#111827]">
                            Revenue Insights
                        </h1>

                        <p className="text-[10px] text-gray-400 mt-1">
                            Track subscription revenue and compare performance over time.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-[10px] text-blue-600 hover:text-blue-700"
                        onClick={() => window.history.back()}
                    >
                        ‹ Back to Transactions
                    </button>

                </div>



                <div className="grid grid-cols-3 gap-3 mt-4">


                    <div className="bg-white border border-[#D9DDE5] rounded-lg px-3 py-3">

                        <p className="text-[10px] text-gray-500">
                            Total Revenue
                        </p>

                        <h2 className="text-[16px] font-semibold text-[#111827]">
                            ₹{" "}
                            {formatRevenue(
                                graphData?.cardData?.totalRevenue
                            )}
                        </h2>

                    </div>



                    <div className="bg-white border border-[#D9DDE5] rounded-lg px-3 py-3">

                        <p className="text-[10px] text-gray-500">
                            Subscriptions
                        </p>

                        <h2 className="text-[16px] font-semibold text-[#111827]">
                            {graphData?.cardData?.totalSubscriptions || 0}
                        </h2>

                    </div>



                    <div className="bg-white border border-[#D9DDE5] rounded-lg px-3 py-3">

                        <p className="text-[10px] text-gray-500">
                            This Month
                        </p>

                        <h2 className="text-[16px] font-semibold text-[#111827]">
                            {graphData?.cardData?.period || "-"}
                        </h2>

                    </div>

                </div>



                <div className="bg-white border border-[#D9DDE5] rounded-lg mt-4 p-4">


                    <div className="flex items-center justify-between mb-4">

                        <div>
                            <h2 className="text-[11px] font-semibold text-[#111827]">
                                Subscription Revenue
                            </h2>

                            {compare &&
                                graphData?.cardData?.revenuePercentageDifference != null && (
                                    <div className="flex items-center gap-1 mt-1">

                                        {/* Arrow */}
                                        <span
                                            className={`text-[9px] ${Number(graphData.cardData.revenuePercentageDifference) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {Number(graphData.cardData.revenuePercentageDifference) >= 0
                                                ? "↗"
                                                : "↘"}
                                        </span>

                                        {/* Percentage */}
                                        <span
                                            className={`text-[9px] font-medium ${Number(graphData.cardData.revenuePercentageDifference) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {Number(graphData.cardData.revenuePercentageDifference) > 0
                                                ? "+"
                                                : ""}
                                            {graphData.cardData.revenuePercentageDifference}%
                                        </span>

                                        {/* Comparison Label */}
                                        <span
                                            className={`text-[9px] ${Number(graphData.cardData.revenuePercentageDifference) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {getComparisonLabel()}
                                        </span>

                                    </div>
                                )}
                        </div>

                        {/* <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500">
                                Compare with
                            </span>

                            <select
                                value={compare}
                                onChange={handleComparisonChange}
                                className="h-[28px] border border-[#D9DDE5] rounded-md px-2 text-[10px] outline-none bg-white"
                            >
                                {graphData?.comparisonFilters?.map((filter) => (
                                    <option
                                        key={filter.key}
                                        value={filter.key}
                                    >
                                        {filter.key === "MONTH"
                                            ? "Previous Month"
                                            : filter.key === "QUARTER"
                                                ? "Previous Quarter"
                                                : filter.key}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                      
<div className="relative flex items-center justify-end gap-2">
  <span className="text-[10px] text-gray-500 whitespace-nowrap">
    Compare with
  </span>

  <button
    type="button"
    onClick={() => setShowCompareDropdown((prev) => !prev)}
    className="h-[28px] min-w-[140px] flex items-center justify-between gap-3
      border border-gray-300 rounded-md px-2.5 text-[10px]
      bg-white text-gray-600 hover:border-gray-400 transition-colors"
  >
    <span>
      {compare === "THIS_MONTH"
        ? "This Month Only"
        : compare === "CUSTOM_MONTH"
          ? new Date(Number(customYear), Number(customMonth) - 1)
              .toLocaleString("en-US", { month: "short", year: "numeric" })
          : compare === "MONTH"
            ? "Previous Month"
            : compare === "QUARTER"
              ? "Previous Quarter"
              : "Select month"}
    </span>

    <svg
      className={`w-3 h-3 transition-transform cursor-pointer ${
        showCompareDropdown ? "rotate-180" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  {showCompareDropdown && (
    <div className="absolute right-0 top-full mt-1 z-50
      w-[136px] max-h-[250px] overflow-y-auto
      rounded-md border border-gray-200 bg-white
      shadow-lg py-1">

      <button
        type="button"
        onClick={async () => {
          setShowCompareDropdown(false);
          await handleComparisonChange({
            target: { value: "THIS_MONTH" },
          });
        }}
        className={`w-full text-left px-3 py-2 text-[10px]
          hover:bg-gray-50 ${
            compare === "THIS_MONTH"
              ? "bg-indigo-50 text-blue-700"
              : "text-gray-600"
          }`}
      >
        This Month Only
      </button>

      <div className="border-t border-gray-100 my-1" />

     {Array.from({ length: 12 }, (_, index) => {
  const today = new Date();
  const monthDate = new Date(
    today.getFullYear(),
    today.getMonth() - index - 1,
    1
  );

  const month = String(monthDate.getMonth() + 1);
  const year = String(monthDate.getFullYear());

  const label = monthDate.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <button
      key={`${year}-${month}`}
      type="button"
      onClick={async () => {
        setCompare("CUSTOM_MONTH");
        setCustomMonth(month);
        setCustomYear(year);
        setShowCustomMonth(false);
        setShowCompareDropdown(false);

        await loadRevenueGraph("CUSTOM_MONTH", month, year);
      }}
      className={`w-full text-left px-3 py-2 text-[10px] hover:bg-gray-50 ${
        customMonth === month &&
        customYear === year &&
        compare === "CUSTOM_MONTH"
          ? "bg-indigo-50 text-blue-700"
          : "text-gray-600"
      }`}
    >
      {label}
    </button>
  );
})}
    </div>
  )}
</div>


                    </div>




                    {loading ? (
                        <div className="h-[220px] flex items-center justify-center">
                            <span className="text-[11px] text-gray-400">
                                Loading revenue data...
                            </span>
                        </div>
                    ) : currentData.length === 0 ? (
                        <div className="h-[220px] flex items-center justify-center">
                            <span className="text-[11px] text-gray-400">
                                No revenue data available
                            </span>
                        </div>
                    ) : (
                        <div className="relative h-[260px]">

                            
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] text-gray-400">
                                {yAxisValues.map((value, index) => (
                                    <span key={index}>
                                        {formatAxisValue(value)}
                                    </span>
                                ))}
                            </div>

                           
                            <div className="absolute left-[45px] right-2 top-0 bottom-8">

                               
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    {[0, 1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="border-t border-dashed border-gray-100"
                                        />
                                    ))}
                                </div>

                              
  


<div className="absolute inset-0 flex items-stretch justify-around px-4">
  {[
    ...(isSameMonth ? [] : comparisonData).map((item, index) => ({
      key: `comparison-${index}`,
      label: graphData?.comparison?.label || item?.label,
      value: Number(item?.revenue || 0),
      color: "bg-[#C7D2FE]",
      type: "comparison",
    })),
    ...currentData.map((item, index) => ({
      key: `current-${index}`,
      label: graphData?.current?.label || item?.label,
      value: Number(item?.revenue || 0),
      color: "bg-[#2448FF]",
      type: "current",
    })),
  ].map((bar) => {
    const height =
      yAxisMax > 0 ? (bar.value / yAxisMax) * 100 : 0;

    return (
      <div
        key={bar.key}
        className="flex-1 h-full flex flex-col items-center justify-end min-w-0"
      >
        {/* Bar */}
        <div className="w-full flex-1 flex items-end justify-center">
          <div
            className={`w-10 md:w-11 max-w-full rounded-t-md ${bar.color}`}
            style={{
              height: `${height}%`,
              minHeight: bar.value > 0 ? "3px" : "0",
            }}
            title={`${bar.label}: ₹${formatRevenue(bar.value)}`}
          />
        </div>

      
        <div className="w-full h-7 flex justify-center items-start pt-1">
          <span
            className={`text-[9px] text-center whitespace-nowrap ${
              bar.type === "current"
                ? "text-[#2448FF]"
                : "text-gray-500"
            }`}
          >
            {bar.label}
          </span>
        </div>
      </div>
    );
  })}
</div>


                            </div>
                        </div>
                    )}






                    {compare !== "NONE" &&
  comparisonData.length > 0 &&
  !isSameMonth && (
                            <div className="flex justify-center items-center gap-5 mt-7">

                               

                                <div className="flex items-center gap-1.5">

                                    <span className="w-5 h-[2px] bg-gray-400 border-dashed" />

                                    <span className="text-[9px] text-gray-500">
                                        {graphData?.comparison?.label || "Comparison"}
                                    </span>

                                </div>
                                 <div className="flex items-center gap-1.5">

                                    <span className="w-5 h-[2px] bg-[#2448FF]" />

                                    <span className="text-[9px] text-gray-500">
                                        {graphData?.current?.label || "Current"}
                                    </span>

                                </div>

                            </div>
                        )}

                </div>




            </div>

        </DashboardLayout>
    );
};

export default RevenueInsights;