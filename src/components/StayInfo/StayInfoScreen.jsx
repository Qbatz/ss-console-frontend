import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useDashboard } from "../../Context/DashboardContext";
import SearchImg from "../../assets/Search.png";
import Occupied from "../../assets/occupiedBed.png";
import EmptyBed from "../../assets/empty_bed.png";
import Notice from "../../assets/overdueimg.png";

const StayInfoScreen = () => {
    const { getHostelBedInfo, updateBedCurrentStatus } = useDashboard();
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showBedConfirm, setShowBedConfirm] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [updatingBed, setUpdatingBed] = useState(false);
    const handleBedClick = (bed) => {
        setSelectedBed(bed);
        setShowBedConfirm(true);
    };

    const fetchBeds = async (
        currentPage = page,
        currentSize = pageSize,
        searchValue = search
    ) => {
        try {
            const res = await getHostelBedInfo(
                currentPage,
                currentSize,
                searchValue
            );

            console.log("Hostel Bed Response:", res);

            if (res?.success) {
                const data = res?.data;

                const latestHostels = data?.hostels || [];

                setHostels(latestHostels);
                setTotalRecords(data?.totalItems || 0);
                setTotalPages(data?.totalPages || 1);

                if (selectedHostel?.hostelId) {
                    const updatedHostel = latestHostels.find(
                        (hostel) =>
                            hostel?.hostelId === selectedHostel?.hostelId
                    );

                    if (updatedHostel) {
                        setSelectedHostel(updatedHostel);


                        if (selectedFloor?.floorId) {
                            const updatedFloor = updatedHostel?.floors?.find(
                                (floor) =>
                                    floor?.floorId === selectedFloor?.floorId
                            );

                            setSelectedFloor(updatedFloor || null);
                        }
                    }
                }

                return {
                    success: true,
                    data: data,
                };
            }

            return { success: false };

        } catch (error) {
            console.log("Fetch Hostel Error:", error);

            return {
                success: false,
                message: error?.message,
            };
        }
    };

    useEffect(() => {
        fetchBeds(1, pageSize, "");
    }, []);
    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);
        setPage(1);

        fetchBeds(1, pageSize, value);
    };
    const handlePageSizeChange = (e) => {
        const value = Number(e.target.value);

        setPageSize(value);
        setPage(1);

        fetchBeds(1, value, search);
    };

    const handlePrevious = () => {
        if (page > 1) {
            const newPage = page - 1;

            setPage(newPage);
            fetchBeds(newPage, pageSize, search);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            const newPage = page + 1;

            setPage(newPage);
            fetchBeds(newPage, pageSize, search);
        }
    };

    // Hostel click
    const handleHostelClick = (hostel) => {
        setSelectedHostel(hostel);

        const firstFloor =
            hostel?.floors && hostel.floors.length > 0
                ? hostel.floors[0]
                : null;

        setSelectedFloor(firstFloor);
    };


    const handleFloorClick = (floor) => {
        setSelectedFloor(floor);
    };


    const handleBack = () => {
        setSelectedHostel(null);
        setSelectedFloor(null);
    };
    const handleConfirmBedStatus = async () => {
        if (!selectedBed?.bedId) return;

        try {
            setUpdatingBed(true);

            const payload = {
                status: "OCCUPIED",
            };

            const res = await updateBedCurrentStatus(
                selectedBed.bedId,
                payload
            );

            if (res?.success) {


                setShowBedConfirm(false);
                setSelectedBed(null);

                await fetchBeds(page, pageSize, search);

            } else {
                console.log(
                    "Bed status update failed:",
                    res?.message
                );
            }

        } catch (error) {
            console.log(
                "Bed status update error:",
                error
            );
        } finally {
            setUpdatingBed(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen  p-5">



                {!selectedHostel && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">


                        <div className="px-5 py-4 border-b border-gray-200">
                            <h2 className="text-[16px] font-semibold text-gray-800 text-left">
                                Hostel Information
                            </h2>

                            <p className="text-[11px] text-gray-400 mt-1 text-left">
                                View hostel, floor, room and bed information
                            </p>
                        </div>
                        <div className="px-5 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-end">

                                <div className="relative w-[260px]">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Search hostel..."
                                        className="
          w-full
          h-9
          border
          border-gray-300
          rounded-lg
          pl-9
          pr-3
          text-[14px]
          outline-none
          focus:border-[#2952F3]
        "
                                    />

                                    <span
                                        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-gray-400
          text-[13px]
        "
                                    >
                                        <img src={SearchImg} className="w-4 h-4" />
                                    </span>
                                </div>

                            </div>
                        </div>

                        <div className="max-h-[450px] overflow-y-auto overflow-x-auto rounded-lg">

                            <table className="w-full">
                                <colgroup>
                                    <col className="w-[25%]" />
                                    <col className="w-[15%]" />
                                    <col className="w-[25%]" />
                                    <col className="w-[11.5%]" />
                                    <col className="w-[11.5%]" />
                                    <col className="w-[12%]" />
                                </colgroup>
                                <thead>
                                    <tr className="bg-[#F8F9FB] border-b border-gray-200">

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600">
                                            Hostel Name
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600">
                                            Mobile
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600">
                                            Address
                                        </th>

                                        <th className="px-2 py-3 text-center text-[11px] font-semibold text-gray-600">
                                            Floors
                                        </th>

                                        <th className="px-2 py-3 text-center text-[11px] font-semibold text-gray-600">
                                            Rooms
                                        </th>

                                        <th className="px-2 py-3 text-center text-[11px] font-semibold text-gray-600">
                                            Beds
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {hostels.length > 0 ? (

                                        hostels.map((hostel) => {

                                            const floors = hostel?.floors || [];


                                            const rooms = [];

                                            floors.forEach((floor) => {
                                                if (floor?.rooms?.length > 0) {
                                                    rooms.push(...floor.rooms);
                                                }
                                            });

                                            const beds = [];

                                            rooms.forEach((room) => {
                                                if (room?.beds?.length > 0) {
                                                    beds.push(...room.beds);
                                                }
                                            });

                                            return (
                                                <tr
                                                    key={hostel?.hostelId}
                                                    className="
                            border-b
                            border-gray-100
                            hover:bg-[#F8FAFF]
                          "
                                                >



                                                    <td className="w-[280px] px-5 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleHostelClick(hostel)}
                                                            className="flex items-center gap-3 text-left cursor-pointer w-full"
                                                        >
                                                            <div
                                                                className="
        w-10 h-10
        shrink-0
        rounded-lg
        bg-[#EEF3FF]
        text-[#2952F3]
        flex items-center justify-center
        text-[11px]
        font-semibold
      "
                                                            >
                                                                {hostel?.initials || "--"}
                                                            </div>

                                                            <div className="min-w-0">


                                                                <p
                                                                    className="text-[12px] font-semibold text-[#2952F3] hover:underline truncate"
                                                                    title={hostel?.hostelName || "-"}
                                                                >
                                                                    {hostel?.hostelName || "-"}
                                                                </p>


                                                                <p
                                                                    className="text-[10px] text-gray-400 truncate"
                                                                    title={hostel?.emailId || "No email"}
                                                                >
                                                                    {hostel?.emailId || "No email"}
                                                                </p>

                                                            </div>
                                                        </button>
                                                    </td>



                                                    <td className="px-5 py-2 text-[11px] text-gray-600 text-left">
                                                        {hostel?.mobile || "-"}
                                                    </td>



                                                    <td className="px-4 py-2 text-[11px] text-gray-600 text-left">
                                                        <div
                                                            className="max-w-[200px] truncate cursor-pointer"
                                                            title={hostel?.fullAddress || "-"}
                                                        >
                                                            {hostel?.fullAddress || "-"}
                                                        </div>
                                                    </td>



                                                    <td className="px-5 py-2 text-center">

                                                        <span
                                                            className="
                                inline-flex
                                min-w-[30px]
                                h-[28px]
                                px-2
                                items-center
                                justify-center
                                rounded-full
                                bg-[#EEF3FF]
                                text-[#2952F3]
                                text-[11px]
                                font-semibold
                              "
                                                        >
                                                            {floors.length}
                                                        </span>

                                                    </td>



                                                    <td className="px-5 py-2 text-center">

                                                        <span
                                                            className="
                                inline-flex
                                min-w-[30px]
                                h-[28px]
                                px-2
                                items-center
                                justify-center
                                rounded-full
                                bg-gray-100
                                text-gray-700
                                text-[11px]
                                font-semibold
                              "
                                                        >
                                                            {rooms.length}
                                                        </span>

                                                    </td>



                                                    <td className="px-5 py-2 text-center">

                                                        <span
                                                            className="
                                inline-flex
                                min-w-[30px]
                                h-[28px]
                                px-2
                                items-center
                                justify-center
                                rounded-full
                                bg-[#EAF8EF]
                                text-[#16A34A]
                                text-[11px]
                                font-semibold
                              "
                                                        >
                                                            {beds.length}
                                                        </span>

                                                    </td>

                                                </tr>
                                            );
                                        })

                                    ) : (

                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="
                          text-center
                          py-10
                          text-[12px]
                          text-gray-400
                        "
                                            >
                                                No hostel information found
                                            </td>
                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>
                        <div
                            className="
    px-5
    py-4
    border-t
    border-gray-200
    flex
    items-center
    justify-between
  "
                        >



                            <div className="text-[14px] text-gray-600">

                                Total Record Count :

                                <span className="text-[#2952F3] font-semibold ml-1">
                                    {totalRecords}
                                </span>

                            </div>




                            <div className="flex items-center gap-3">



                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="
        h-10
        min-w-[95px]
        px-3
        border
        border-gray-200
        rounded-lg
        text-[12px]
        text-gray-700
        outline-none
        cursor-pointer
        bg-white
      "
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>



                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                    className={`
        w-9
        h-9
        rounded-lg
        flex
        items-center
        justify-center
        text-[20px]
        ${page === 1
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-[#9AB0EF] hover:bg-[#F3F6FF] cursor-pointer"
                                        }
      `}
                                >
                                    ‹
                                </button>




                                <button
                                    type="button"
                                    className="
        w-12
        h-10
        rounded-lg
        border
        border-[#D9E1FF]
        bg-white
        text-[#2952F3]
        text-[13px]
        font-medium
      "
                                >
                                    {page}
                                </button>




                                <span className="text-[13px] text-gray-500 whitespace-nowrap">
                                    {totalRecords === 0
                                        ? "0 - 0"
                                        : `${(page - 1) * pageSize + 1} - ${Math.min(
                                            page * pageSize,
                                            totalRecords
                                        )}`}
                                </span>




                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={page >= totalPages}
                                    className={`
        w-9
        h-9
        rounded-lg
        flex
        items-center
        justify-center
        text-[20px]
        ${page >= totalPages
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-[#9AB0EF] hover:bg-[#F3F6FF] cursor-pointer"
                                        }
      `}
                                >
                                    ›
                                </button>

                            </div>

                        </div>
                    </div>
                )}



                {selectedHostel && (

                    <div className="bg-white rounded-xl min-h-[calc(100vh-40px)]">

                        <div
                            className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                border-gray-200
              "
                        >

                            <div className="flex items-center gap-4">

                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="
                    w-9
                    h-9
                    rounded-full
                    border
                    border-gray-200
                    flex
                    items-center
                    justify-center
                    text-gray-600
                    hover:bg-gray-100
                    cursor-pointer
                  "
                                >
                                    ←
                                </button>

                                <div>

                                    <h2 className="text-[18px] font-semibold text-gray-800">
                                        {selectedHostel?.hostelName}
                                    </h2>

                                    <p className="text-[11px] text-gray-400 mt-1">
                                        {selectedHostel?.fullAddress}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-5">

                                <StatusLegend
                                    color="border-gray-400 bg-white"
                                    label="Available"
                                />

                                <StatusLegend
                                    color="bg-[#00A83B]"
                                    label="Occupied"
                                />

                                <StatusLegend
                                    color="bg-[#315CEC]"
                                    label="Reserved"
                                />

                                <StatusLegend
                                    color="bg-[#F59E0B]"
                                    label="Overdue"
                                />

                                <StatusLegend
                                    color="bg-[#EF4444]"
                                    label="Notice Period"
                                />

                            </div>

                        </div>



                        <div className="flex min-h-[calc(100vh-130px)]">



                            <div
                                className="
                  w-[190px]
                  shrink-0
                  border-r
                  border-gray-200
                  p-5
                  bg-white
                "
                            >

                                <p
                                    className="
                    text-[10px]
                    uppercase
                    tracking-wide
                    text-gray-400
                    font-semibold
                    mb-4
                  "
                                >
                                    Floors
                                </p>

                                <div className="space-y-3">

                                    {selectedHostel?.floors?.length > 0 ? (

                                        selectedHostel.floors.map((floor) => (

                                            <button
                                                key={floor?.floorId}
                                                type="button"
                                                onClick={() =>
                                                    handleFloorClick(floor)
                                                }
                                                className={`
                          w-full
                          min-h-[90px]
                          rounded-xl
                          border
                          flex
                          flex-col
                          items-center
                          justify-center
                          cursor-pointer
                          ${selectedFloor?.floorId ===
                                                        floor?.floorId
                                                        ? "border-[#2952F3] bg-[#EEF3FF]"
                                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                                    }
                        `}
                                            >

                                                <div
                                                    className={`
                            text-[24px]
                            font-semibold
                            ${selectedFloor?.floorId ===
                                                            floor?.floorId
                                                            ? "text-[#2952F3]"
                                                            : "text-gray-600"
                                                        }
                          `}
                                                >
                                                    {floor?.floorName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "F"}
                                                </div>

                                                <p
                                                    className={`
                            text-[12px]
                            font-medium
                            mt-1
                            ${selectedFloor?.floorId ===
                                                            floor?.floorId
                                                            ? "text-[#2952F3]"
                                                            : "text-gray-700"
                                                        }
                          `}
                                                >
                                                    {floor?.floorName}
                                                </p>

                                            </button>

                                        ))

                                    ) : (

                                        <p className="text-[11px] text-gray-400">
                                            No floors found
                                        </p>

                                    )}

                                </div>

                            </div>



                            <div className="flex-1 p-6 bg-[#FCFCFD]">

                                {selectedFloor ? (

                                    <>



                                        <div className="mb-5 text-left">

                                            <h3 className="text-[20px] font-semibold text-gray-800">
                                                {selectedFloor?.floorName}
                                            </h3>

                                            <p className="text-[11px] text-gray-400 mt-1">
                                                {selectedFloor?.rooms?.length || 0} Rooms
                                            </p>

                                        </div>



                                        {selectedFloor?.rooms?.length > 0 ? (

                                            //                       <div
                                            //                         className="
                                            //                           grid
                                            //                           grid-cols-1
                                            //                           lg:grid-cols-2
                                            //                           gap-5
                                            //                         "
                                            //                       >

                                            //                         {selectedFloor.rooms.map((room) => (

                                            //                           <RoomCard
                                            //   key={room?.roomId}
                                            //   room={room}
                                            //   onBedClick={handleBedClick}
                                            // />
                                            //                         ))}

                                            //                       </div>
                                            <div
                                                className="
    h-[600px]
    overflow-y-auto
    pr-3
  "
                                            >
                                                <div className="grid grid-cols-2 gap-5">
                                                    {selectedFloor?.rooms?.map((room) => (
                                                        <RoomCard
                                                            key={room?.roomId}
                                                            room={room}
                                                            onBedClick={handleBedClick}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                        ) : (

                                            <div
                                                className="
                          h-[300px]
                          flex
                          items-center
                          justify-center
                          border
                          border-dashed
                          border-gray-300
                          rounded-xl
                          bg-white
                        "
                                            >
                                                <p className="text-[12px] text-gray-400">
                                                    No rooms available in this floor
                                                </p>
                                            </div>

                                        )}

                                    </>

                                ) : (

                                    <div className="flex items-center justify-center h-[300px]">
                                        <p className="text-[12px] text-gray-400">
                                            No floors available
                                        </p>
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>

            {showBedConfirm && selectedBed && (
                <div className="
    fixed
    inset-0
    z-[999]
    flex
    items-center
    justify-center
  ">


                    <div
                        className="
        absolute
        inset-0
        bg-black/40
      "
                        onClick={() => {
                            if (!updatingBed) {
                                setShowBedConfirm(false);
                                setSelectedBed(null);
                            }
                        }}
                    />


                    <div className="
      relative
      w-[380px]
      bg-white
      rounded-xl
      shadow-2xl
      p-6
      z-10
    ">


                        <div className="
        mx-auto
        w-12
        h-12
        rounded-full
        bg-[#EEF3FF]
        text-[#2952F3]
        flex
        items-center
        justify-center
        text-xl
        font-semibold
      ">
                            ?
                        </div>


                        <h3 className="
        text-center
        text-[16px]
        font-semibold
        text-gray-800
        mt-4
      ">
                            Update Bed Status?
                        </h3>


                        <p className="
        text-center
        text-[12px]
        text-gray-500
        mt-2
        leading-5
      ">
                            Are you sure you want to change the status of{" "}
                            <span className="font-semibold text-gray-700">
                                {selectedBed?.bedName}
                            </span>
                            ?
                        </p>


                        <div className="
        flex
        justify-end
        gap-3
        mt-6
      ">

                            <button
                                type="button"
                                disabled={updatingBed}
                                onClick={() => {
                                    setShowBedConfirm(false);
                                    setSelectedBed(null);
                                }}
                                className="
            px-4
            py-2
            border
            border-gray-300
            rounded-lg
            text-[12px]
            text-gray-700
            hover:bg-gray-50
            cursor-pointer
          "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={updatingBed}
                                onClick={handleConfirmBedStatus}
                                className="
            px-5
            py-2
            bg-[#2952F3]
            hover:bg-[#1E40D0]
            text-white
            rounded-lg
            text-[12px]
            font-medium
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
                            >
                                {updatingBed ? "Updating..." : "Confirm"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </DashboardLayout>
    );
};




const RoomCard = ({ room, onBedClick }) => {
    const beds = room?.beds || [];

    return (
        <div
            className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        overflow-hidden
        shadow-sm
        h-[300px]
        flex
        flex-col
      "
        >

            {/* Room Header */}
            <div
                className="
          bg-[#DCE9FC]
          px-4
          py-3
          flex
          items-center
          justify-between
          shrink-0
        "
            >
                <div>
                    <h4 className="text-[16px] font-semibold text-gray-800">
                        {room?.roomName}
                    </h4>

                    <p className="text-[11px] text-gray-500">
                        {beds.length} sharing
                    </p>
                </div>

                <button
                    type="button"
                    className="text-[22px] text-gray-700"
                >
                    ⋮
                </button>
            </div>

            {/* Beds Scroll Area */}
            <div
                className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
          p-5
        "
            >
                {beds.length > 0 ? (
                    <div className="grid grid-cols-4 gap-x-5 gap-y-6">

                        {beds.map((bed) => (
                            <BedCard
                                key={bed?.bedId}
                                bed={bed}
                                onClick={() => onBedClick(bed)}
                            />
                        ))}

                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-[11px] text-gray-400">
                            No beds available
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};




const BedCard = ({ bed, onClick }) => {
    const status = bed?.currentStatus;

    return (
        <div
            onClick={onClick}
            className="
        flex
        flex-col
        items-center
        cursor-pointer
        hover:scale-105
        transition-transform
      "
        >
            <div className="relative">


                {status === "VACANT" && (
                    <img
                        src={EmptyBed}
                        alt="Vacant Bed"
                        className="w-[50px] h-[50px] object-contain"
                    />
                )}


                {status === "OCCUPIED" && (
                    <img
                        src={Occupied}
                        alt="Occupied Bed"
                        className="w-[50px] h-[50px] object-contain"
                    />
                )}


                {status === "NOTICE" && (
                    <>
                        <img
                            src={Occupied}
                            alt="Notice Bed"
                            className="w-[50px] h-[50px] object-contain"
                        />

                        <img
                            src={Notice}
                            alt="Notice"
                            className="
                absolute
                -right-2
                -top-1
                w-[20px]
                h-[20px]
                object-contain
              "
                        />
                    </>
                )}

            </div>


            <p className="text-[11px] font-medium text-gray-800 mt-2">
                {bed?.bedName}
            </p>

        </div>
    );
};




const StatusLegend = ({ color, label }) => {

    return (
        <div className="flex items-center gap-2">

            <span
                className={`
          w-5
          h-5
          rounded-full
          border-2
          ${color}
        `}
            />

            <span className="text-[11px] text-gray-700">
                {label}
            </span>

        </div>
    );
};

export default StayInfoScreen;