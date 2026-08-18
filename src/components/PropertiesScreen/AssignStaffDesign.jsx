import React, { useState, useEffect } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useHostel } from "../../Context/HostelListContext";
import { useSubscription } from "../../Context/SubscriptionContext";
import Message from "../../assets/message-2.png";
import Arrow from "../../assets/direction-down 01.png";
import { usePermission } from "../../Utils/permissionHelper";


const AssignStaffModal = ({
    show,
    onClose,
    selectedHostel,
    setModalType,
    setMessage,
    setShowSuccess,
    refreshData
}) => {
    const { assignRelationalAgent, getRelationalReasons } = useHostel();
    const { getAgentsDropdown } = useSubscription();

    const [staffId, setStaffId] = useState("");
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [reasonList, setReasonList] = useState([]);

    const [staffError, setStaffError] = useState("");
    const [reasonError, setReasonError] = useState("");
    const [commentError, setCommentError] = useState("");
    const [showReasonDropdown, setShowReasonDropdown] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);
    console.log("selectedHostel", selectedHostel)
    const resetForm = () => {
        setStaffId("");
        setReason("");
        setComment("");

        setStaffError("");
        setReasonError("");
        setCommentError("");

        setShowReasonDropdown(false);
        setShowStaffDropdown(false);
    };

    useEffect(() => {
        if (show) {
            fetchReasons();
            fetchAgents(); // 🔥 add this
        }
    }, [show]);
    if (!show) return null;

    const fetchAgents = async () => {
        const res = await getAgentsDropdown();

        if (res?.success) {
            setStaffList(res.data);
        }
    };
    const fetchReasons = async () => {
        const res = await getRelationalReasons();

        if (res?.success) {
            setReasonList(res.data);
        }
    };
    console.log("reasonList", reasonList)
    const handleSubmit = async () => {
        let hasError = false;

        if (!staffId) {
            setStaffError("Select staff");
            hasError = true;
        }

        if (!reason) {
            setReasonError("Select reason");
            hasError = true;
        }

        if (hasError) return;

        const payload = {
            agentId: staffId,
            reason,
            comments: comment || ""
        };

        try {
            const res = await assignRelationalAgent(
                selectedHostel?.parentId,
                payload
            );

            if (res?.success) {
                setModalType("success");
                setMessage(res.message);
                setShowSuccess(true);

                onClose();
                resetForm();

                // refresh parent data
                await refreshData();

                setTimeout(() => setShowSuccess(false), 1000);
            } else {
                setModalType("error");
                setMessage(res?.message);
                setShowSuccess(true);

                setTimeout(() => setShowSuccess(false), 1000);
            }

        } catch (err) {
            setModalType("error");
            setMessage("Something went wrong");
            setShowSuccess(true);
        }
    };
    // const handleSubmit = () => {
    //     let hasError = false;

    //     if (!staffId) {
    //         setStaffError("Select staff");
    //         hasError = true;
    //     }

    //     if (!reason) {
    //         setReasonError("Select reason");
    //         hasError = true;
    //     }



    //     if (hasError) return;

    //     onConfirm({ staffId, reason, comment });
    // };

    return (
        <div
            className="
    fixed inset-0 z-[9999]
    bg-black/40
    flex justify-end
    p-4
  "
            onClick={() => {
                resetForm();
                onClose();
            }}
        >

            {/* Modal */}
            <div
                className="
    w-[500px]
    h-[calc(100vh-32px)]
    bg-white-common
    rounded-2xl
    shadow-2xl
    overflow-y-auto
    drawer-scroll
    p-6
    animate-slideLeft
  "
                onClick={(e) => e.stopPropagation()}
            >


                {/* Title */}
                <h2 className="text-lg font-semibold mb-5 text-left">
                    Assign Staff
                </h2>

                {/* Staff */}
                <div className="mb-4 text-left">
                    <label className="text-sm text-gray-600">
                        Assign Staff <span className="text-red-500">*</span>
                    </label>

                    <div className="relative mt-1">

                        {/* BOX */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowStaffDropdown(!showStaffDropdown);
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer"
                        >
                            <span className="text-sm">
                                {staffList.find(s => s.agentId === staffId)?.agentName || "Select"}
                            </span>

                            <img src={Arrow} className="w-5 h-5" />
                        </div>

                        {/* DROPDOWN */}
                        {showStaffDropdown && (
                            <div className="absolute w-full mt-1 bg-white-common border rounded-lg shadow-md max-h-40 overflow-y-auto z-50">

                                <div
                                    onClick={() => {
                                        setStaffId("");
                                        setShowStaffDropdown(false);
                                    }}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    Select
                                </div>

                                {staffList.map((item) => (
                                    <div
                                        key={item.agentId}
                                        onClick={() => {
                                            setStaffId(item.agentId);
                                            setStaffError("");
                                            setShowStaffDropdown(false);
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {item.agentName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {staffError && <ErrorMessage message={staffError} type="error" />}
                </div>

                {/* Reason */}
                <div className="mb-4 text-left">
                    <label className="text-sm text-gray-600">
                        Select Reason<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">


                        <div
                            onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer"
                        >
                            <span className="text-sm">
                                {reasonList.find(r => r.key === reason)?.label || "Select"}
                            </span>

                            <img src={Arrow} className="w-5 h-5" />

                        </div>

                        {/* Dropdown */}
                        {showReasonDropdown && (
                            <div className="absolute w-full mt-1 bg-white-common border rounded-lg shadow-md max-h-40 overflow-y-auto z-50">

                                {reasonList.map((item) => (
                                    <div
                                        key={item.key}
                                        onClick={() => {
                                            setReason(item.key);
                                            setReasonError("");
                                            setShowReasonDropdown(false);
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {reasonError && <ErrorMessage message={reasonError} type="error" />}
                </div>
                {/* Comment */}
                <div className="mb-4 text-left">
                    <label className="text-sm text-gray-600">
                        Additional Comments
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setCommentError("");
                        }}
                        placeholder="Please Enter Comments"
                        className="
    input-common
    mt-1
    h-[80px]
  "
                    />

                    {commentError && <ErrorMessage message={commentError} type="error" />}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className=" px-4 py-2 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="btn-primary px-5 py-2 rounded-lg"
                    >
                        Confirm
                    </button>
                </div>
                {/* 🔥 Relational Agents History */}
                {selectedHostel?.relationalAgents?.length > 0 && (

                    <div className="mt-5 pt-4 border-t border-gray-200">

                        <p className="text-sm font-semibold text-gray-600 mb-4 text-left">
                            ASSIGNED HISTORY
                        </p>

                        <div className="flex flex-col gap-4 max-h-[260px] overflow-y-auto pr-2 drawer-scroll">

                            {selectedHostel.relationalAgents.map((item, index) => (

                                <div
                                    key={index}
                                    className="
            relative
            flex
            gap-4
            bg-white-common
            border
            border-gray-200
            rounded-xl
            p-4
          "
                                >

                                    {/* LEFT SIDE */}

                                    <div className="relative flex flex-col items-center">

                                        <div
                                            className="
                w-12
                h-12
                rounded-full
                bg-[#EEF3FF]
                flex
                items-center
                justify-center
                shrink-0
              "
                                        >

                                            <img
                                                src={Message}
                                                alt="message"
                                                className="w-5 h-5"
                                            />

                                        </div>

                                        {index !== selectedHostel.relationalAgents.length - 1 && (

                                            <div
                                                className="
                  w-[1px]
                  flex-1
                  bg-gray-300
                  mt-2
                "
                                            />

                                        )}

                                    </div>



                                    <div className="flex-1 text-left">

                                        <h3 className="text-[13px] font-semibold text-gray-800">
                                            {item.agentName}
                                        </h3>

                                        <p className="text-sm text-gray-700 mt-1">
                                            {item.reason}
                                        </p>

                                        {item.comments && (

                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.comments}
                                            </p>

                                        )}

                                        <div className="mt-3">

                                            <p className="text-sm text-gray-700">
                                                {item.createdAtDate}, {item.createdAtTime}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}
            </div>
        </div>
    );
};

export default AssignStaffModal;