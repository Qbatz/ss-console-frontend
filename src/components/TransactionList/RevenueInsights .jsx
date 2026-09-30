import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useSubscription } from "../../Context/SubscriptionContext";

const RevenueInsights = () => {
    const { getOrderHistoryGraph } = useSubscription();

    const [compare, setCompare] = useState("");
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState(null);


    const loadRevenueGraph = async (filter = "MONTH") => {
        try {
            setLoading(true);

            const res = await getOrderHistoryGraph(filter);

            if (res?.success) {
                setGraphData(res.data);

               
                if (!compare && res.data?.comparisonFilters?.length > 0) {
                    setCompare(res.data.comparisonFilters[0].key);
                }

                console.log("Revenue Graph Response:", res.data);
            }
        } catch (error) {
            console.error("Revenue graph error:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadRevenueGraph("MONTH");
    }, []);


    const handleComparisonChange = async (e) => {
        const value = e.target.value;

        setCompare(value);


        if (value === "NONE") {
            await loadRevenueGraph("MONTH");
            return;
        }


        await loadRevenueGraph(value);
    };


    const currentData = graphData?.current?.records || [];

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

                            {compare && graphData?.cardData?.revenuePercentageDifference != null && (
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-[9px] text-green-600">
                                        ↗
                                    </span>

                                    <span className="text-[9px] text-green-600 font-medium">
                                        +{graphData.cardData.revenuePercentageDifference}%
                                    </span>

                                    <span className="text-[9px] text-green-600">
                                        {getComparisonLabel()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
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



                        <div className="relative h-[220px]">


                            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-gray-400">

                                {yAxisValues.map((value, index) => (
                                    <span key={index}>
                                        {formatAxisValue(value)}
                                    </span>
                                ))}

                            </div>

                            <div className="absolute left-[45px] right-2 top-0 bottom-0">


                                <div className="absolute inset-0 flex flex-col justify-between">

                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div
                                            key={item}
                                            className="border-t border-dashed border-gray-100"
                                        />
                                    ))}

                                </div>



                                <svg
                                    viewBox="0 0 800 200"
                                    className="absolute inset-0 w-full h-full overflow-visible"
                                    preserveAspectRatio="none"
                                >



                                    {compare !== "NONE" &&
                                        comparisonData.length > 0 && (
                                            <>
                                                <polyline
                                                    points={generatePoints(
                                                        comparisonData
                                                    )}
                                                    fill="none"
                                                    stroke="#9CA3AF"
                                                    strokeWidth="2"
                                                    strokeDasharray="5 4"
                                                />

                                                {comparisonPoints.map(
                                                    (point, index) => (
                                                        <circle
                                                            key={`comparison-${index}`}
                                                            cx={point.x}
                                                            cy={point.y}
                                                            r="3"
                                                            fill="#9CA3AF"
                                                        />
                                                    )
                                                )}
                                            </>
                                        )}




                                    <polyline
                                        points={generatePoints(currentData)}
                                        fill="none"
                                        stroke="#2448FF"
                                        strokeWidth="2"
                                    />


                                    {currentPoints.map((point, index) => (
                                        <circle
                                            key={`current-${index}`}
                                            cx={point.x}
                                            cy={point.y}
                                            r="3.5"
                                            fill="#2448FF"
                                            className="cursor-pointer"
                                            onMouseEnter={() => {
                                                setHoveredPoint({
                                                    index,
                                                    x: point.x,
                                                    y: point.y,
                                                    data: currentData[index],
                                                });
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredPoint(null);
                                            }}
                                        />
                                    ))}

                                </svg>
                                {hoveredPoint && (
                                    <div
                                        className="absolute z-50 bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-3 py-2 pointer-events-none"
                                        style={{
                                            left: `${(hoveredPoint.x / 800) * 100}%`,
                                            top: `${(hoveredPoint.y / 200) * 100}%`,
                                            transform: "translate(-50%, -115%)",
                                            minWidth: "105px",
                                        }}
                                    >

                                        <p className="text-[9px] text-gray-500 mb-1">
                                            {hoveredPoint.data?.label}
                                        </p>


                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-[6px] h-[6px] rounded-full bg-[#2448FF]" />

                                                <span className="text-[9px] text-gray-600">
                                                    {graphData?.current?.label || "This Month"}
                                                </span>
                                            </div>

                                            <span className="text-[9px] font-semibold text-[#2448FF]">
                                                ₹
                                                {Number(
                                                    hoveredPoint.data?.revenue || 0
                                                ).toLocaleString("en-IN", {
                                                    maximumFractionDigits: 0,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}



                                <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-gray-400">

                                    {currentData.map(
                                        (item, index) => (
                                            <span key={index}>
                                                {item?.label}
                                            </span>
                                        )
                                    )}

                                </div>

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