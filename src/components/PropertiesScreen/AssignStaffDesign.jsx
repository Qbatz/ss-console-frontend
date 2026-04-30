import React, { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const AssignStaffModal = ({
    show,
    onClose,
    staffList = [],
    reasonList = [],
    onConfirm
}) => {

    const [staffId, setStaffId] = useState("");
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");

    const [staffError, setStaffError] = useState("");
    const [reasonError, setReasonError] = useState("");
    const [commentError, setCommentError] = useState("");

    if (!show) return null;

    const handleSubmit = () => {
        let hasError = false;

        if (!staffId) {
            setStaffError("Select staff");
            hasError = true;
        }

        if (!reason) {
            setReasonError("Select reason");
            hasError = true;
        }

        if (!comment) {
            setCommentError("Enter comment");
            hasError = true;
        }

        if (hasError) return;

        onConfirm({ staffId, reason, comment });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">

            {/* Modal */}
            <div className="bg-white rounded-xl w-[500px] p-6">

                {/* Title */}
                <h2 className="text-lg font-semibold mb-5 text-left">
                    Assign
                </h2>

                {/* Staff */}
                <div className="mb-4 text-left">
                    <label className="text-sm text-gray-600 ">
                        Assign Staff <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={staffId}
                        onChange={(e) => {
                            setStaffId(e.target.value);
                            setStaffError("");
                        }}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    >
                        <option value="">Select</option>

                        {staffList.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    {staffError && <ErrorMessage message={staffError} type="error" />}
                </div>

                {/* Reason */}
                <div className="mb-4 text-left">
                    <label className="text-sm text-gray-600">
                        Select Reason <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setReasonError("");
                        }}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    >
                        <option value="">Select</option>

                        {reasonList.map((item, i) => (
                            <option key={i} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

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
                        placeholder="..."
                        className="w-full border rounded-lg px-3 py-2 mt-1 h-[80px]"
                    />

                    {commentError && <ErrorMessage message={commentError} type="error" />}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Confirm
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AssignStaffModal;