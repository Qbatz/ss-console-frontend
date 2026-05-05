import React, { useState, useEffect } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useHostel } from "../../Context/HostelListContext";
import { useSubscription } from "../../Context/SubscriptionContext";
import Message from "../../assets/message-2.png";
import Arrow from "../../assets/direction-down 01.png"


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
    console.log("staffList", staffList)
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
                selectedHostel?.hostelId,
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
  className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
  onClick={() => {
    resetForm();
    onClose();
  }}
>

            {/* Modal */}
          <div
  className="bg-white rounded-xl w-[500px] max-h-[80vh] overflow-y-auto p-6"
  onClick={(e) => e.stopPropagation()}
>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-5 text-left">
                    Assign
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

                            <img src={Arrow} className="w-5 h-5"/>
                        </div>

                        {/* DROPDOWN */}
                        {showStaffDropdown && (
                            <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto z-50">

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

                       <img src={Arrow} className="w-5 h-5"/>

                    </div>

                    {/* Dropdown */}
                    {showReasonDropdown && (
                        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto z-50">

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
                        Additional Comments <span className="text-red-500">*</span>
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setCommentError("");
                        }}
                        placeholder="Please Enter Comments"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 h-[80px]"
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
                        className="px-4 py-2 text-gray-600 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                    >
                        Confirm
                    </button>
                </div>
{/* 🔥 Relational Agents History */}
{selectedHostel?.relationalAgents?.length > 0 && (
   <div className="mt-5 border-t border-gray-300 pt-4 h-[200px] overflow-y-auto pr-2">

    <p className="text-xs font-semibold text-gray-500 mb-3 text-left">
      ASSIGNED HISTORY
    </p>

    <div className="flex flex-col gap-3">
      {selectedHostel.relationalAgents.map((item, index) => (
        <div key={index} className="flex gap-3">

          {/* ICON */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
            <img src={Message} className="w-3 h-3"/>
          </div>

          {/* CONTENT */}
          <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-3">

            <p className="text-sm font-medium text-gray-800">
              {item.agentName}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {item.reason}
            </p>

            {item.comments && (
              <p className="text-xs text-gray-600 mt-1">
                {item.comments}
              </p>
            )}

            <p className="text-[10px] text-gray-400 mt-2">
              {item.createdAtDate} • {item.createdAtTime}
            </p>

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