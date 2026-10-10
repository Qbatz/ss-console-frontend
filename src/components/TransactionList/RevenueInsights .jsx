import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useSubscription } from "../../Context/SubscriptionContext";

const RevenueInsights = () => {
    const { getOrderHistoryGraph } = useSubscription();
    const [compare, setCompare] = useState("");

    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    
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
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500">
                                Compare with
                            </span>

                           <select
    value={compare}
    onChange={handleComparisonChange}
    className="h-[28px] border border-[#D9DDE5] rounded-md px-2 text-[10px] outline-none bg-white"
>
    <option value="">Select month</option>
    <option value="THIS_MONTH">This Month Only</option>

    {graphData?.comparisonFilters?.map((filter) => (
        <option key={filter.key} value={filter.key}>
            {filter.key === "MONTH"
                ? "Previous Month"
                : filter.key === "QUARTER"
                    ? "Previous Quarter"
                    : filter.key === "CUSTOM_MONTH"
                        ? "Custom Month"
                        : filter.key}
        </option>
    ))}
</select>
                            {showCustomMonth && (
                                <div className="flex items-center gap-2 mt-2">
                                    {/* Month */}
                                    <select
                                        value={customMonth}
                                        onChange={(e) =>
                                            handleCustomMonthChange(
                                                e.target.value,
                                                customYear
                                            )
                                        }
                                        className="h-[28px] border border-[#D9DDE5] rounded-md px-2 text-[10px] bg-white"
                                    >
                                        <option value="">Select month</option>

                                        {Array.from({ length: 12 }, (_, index) => (
                                            <option key={index + 1} value={String(index + 1)}>
                                                {new Date(2026, index).toLocaleString("en-US", {
                                                    month: "short",
                                                })}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Year */}
                                    <select
                                        value={customYear}
                                        onChange={(e) =>
                                            handleCustomMonthChange(
                                                customMonth,
                                                e.target.value
                                            )
                                        }
                                        className="h-[28px] border border-[#D9DDE5] rounded-md px-2 text-[10px] bg-white"
                                    >
                                        <option value="">Select year</option>

                                        {Array.from({ length: 5 }, (_, index) => {
                                            const year = new Date().getFullYear() - index;

                                            return (
                                                <option key={year} value={String(year)}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
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

                                {/* Bars */}
                                <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">

                                    {currentData.map((item, index) => {
                                        const revenue = Number(item?.revenue || 0);

                                        const barHeight =
                                            yAxisMax > 0
                                                ? (revenue / yAxisMax) * 100
                                                : 0;

                                        const comparisonRevenue =
                                            Number(comparisonData[index]?.revenue || 0);

                                        const comparisonBarHeight =
                                            yAxisMax > 0
                                                ? (comparisonRevenue / yAxisMax) * 100
                                                : 0;

                                        return (
                                            <div
                                                key={index}
                                                className="flex-1 h-full flex items-end justify-center gap-1"
                                            >


                                                {compare !== "NONE" && comparisonData.length > 0 && (
                                                    <div
                                                        className="relative w-[35%] max-w-[28px] bg-gray-300 rounded-t-sm cursor-pointer transition-all duration-200 hover:bg-gray-400"
                                                        style={{
                                                            height: `${comparisonBarHeight}%`,
                                                            minHeight: "3px",
                                                        }}
                                                        onMouseEnter={() => {
                                                            setHoveredPoint({
                                                                index,
                                                                data: item,
                                                                type: "comparison",
                                                                revenue,
                                                                comparisonRevenue,
                                                            });
                                                        }}
                                                        onMouseLeave={() => {
                                                            setHoveredPoint(null);
                                                        }}
                                                    />
                                                )}


                                                <div
                                                    className="relative w-[45%] max-w-[34px] bg-[#2448FF] rounded-t-sm cursor-pointer transition-all duration-200 hover:bg-[#1938D8]"
                                                    style={{
                                                        height: `${barHeight}%`,
                                                        minHeight: "3px",
                                                    }}
                                                    onMouseEnter={() => {
                                                        setHoveredPoint({
                                                            index,
                                                            data: item,
                                                            type: "current",
                                                            revenue,
                                                            comparisonRevenue,
                                                        });
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredPoint(null);
                                                    }}
                                                >


                                                    {hoveredPoint?.index === index && (
                                                        <div
                                                            className="absolute z-50 bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-3 py-2 pointer-events-none"
                                                            style={{
                                                                left: "50%",
                                                                bottom: "calc(100% + 8px)",
                                                                transform: "translateX(-50%)",
                                                                minWidth: "125px",
                                                            }}
                                                        >
                                                            <p className="text-[9px] text-gray-500 mb-1">
                                                                {item?.label}
                                                            </p>


                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="w-[6px] h-[6px] rounded-full bg-[#2448FF]" />

                                                                    <span className="text-[9px] text-gray-600">
                                                                        {graphData?.current?.label || "Current"}
                                                                    </span>
                                                                </div>

                                                                <span className="text-[9px] font-semibold text-[#2448FF]">
                                                                    ₹{formatRevenue(revenue)}
                                                                </span>
                                                            </div>


                                                            {compare !== "NONE" &&
                                                                comparisonData.length > 0 && (
                                                                    <div className="flex items-center justify-between gap-3 mt-1">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="w-[6px] h-[6px] rounded-full bg-gray-400" />

                                                                            <span className="text-[9px] text-gray-600">
                                                                                {graphData?.comparison?.label ||
                                                                                    "Comparison"}
                                                                            </span>
                                                                        </div>

                                                                        <span className="text-[9px] font-semibold text-gray-500">
                                                                            ₹{formatRevenue(comparisonRevenue)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                
                                {/* <div className="absolute left-0 right-0 -bottom-6 flex justify-between text-[9px] text-gray-400">
                                    {currentData.map((item, index) => (
                                        <span
                                            key={index}
                                            className="flex-1 text-center truncate"
                                        >
                                            {item?.label}
                                        </span>
                                    ))}
                                </div> */}
                                {compare !== "" && (
    <div className="absolute left-0 right-0 -bottom-6 flex justify-between text-[9px] text-gray-400">
        {currentData.map((item, index) => (
            <span
                key={index}
                className="flex-1 text-center truncate"
            >
                {item?.label}
            </span>
        ))}
    </div>
)}
                            </div>
                        </div>
                    )}






                    {compare !== "NONE" &&
                        comparisonData.length > 0 && (
                            <div className="flex justify-center items-center gap-5 mt-7">

                                <div className="flex items-center gap-1.5">

                                    <span className="w-5 h-[2px] bg-[#2448FF]" />

                                    <span className="text-[9px] text-gray-500">
                                        {graphData?.current?.label || "Current"}
                                    </span>

                                </div>

                                <div className="flex items-center gap-1.5">

                                    <span className="w-5 h-[2px] bg-gray-400 border-dashed" />

                                    <span className="text-[9px] text-gray-500">
                                        {graphData?.comparison?.label || "Comparison"}
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