
import React, { useState, useEffect } from "react";
import {
    CalendarDays,
    Clock,
    AlertCircle,
    TrendingUp,
    Users
} from "lucide-react";
import Billingperiod from "../../assets/BillingPeriod.png"
import { useHostel } from "../../Context/HostelListContext";

const RecurringBill = ({ hostelData }) => {
    const { getRecurringHostels, generateRecurringInvoice } = useHostel();
    useEffect(() => {
        fetchRecurring();
    }, []);

    const fetchRecurring = async () => {
        const res = await getRecurringHostels(0, 10, "", "TODAY");

        if (res?.success) {
            console.log("Recurring Data", res.data);
        }
    };


    const [showModal, setShowModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const handleGenerate = async () => {

        const res = await generateRecurringInvoice(
            hostelData.hostelId,
            1
        );

        if (res?.success) {
            alert("Recurring invoices generated successfully");
            setShowModal(false);
        } else {
            alert(res?.message || "Failed");
        }
    };
    return (
        <div className="p-6 space-y-6">

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                    <p className="text-[14px] text-gray-500 font-sans text-left">Billing Method</p>
                    <h2 className="font-semibold font-sans text-[16px] text-left">Monthly Recurring</h2>
                    <p className="text-xs text-gray-400 font-sans text-left">Cycle : 2 to 1</p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-white text-left">
                    <p className="text-sm text-gray-500 flex items-center gap-1 text-left">
                        Current Billing Period
                    </p>
                    <h2 className="font-semibold text-[16px] text-left">Mar 2 → Apr 1</h2>
                    <p className="text-xs text-gray-400 text-left">
                        Invoice generation expected May 1
                    </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-white text-left">
                    <p className="text-sm text-gray-500 text-left">Recurring Status</p>
                    <h2 className="font-semibold text-orange-500 text-left">Paused</h2>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-white text-left">
                    <p className="text-sm text-gray-500 text-left">Active Tenants</p>
                    <h2 className="font-semibold text-lg text-left">42</h2>
                </div>

            </div>

            {/* Billing Timeline */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white text-left">
                <h3 className="font-semibold mb-6">Billing Timeline</h3>

                <div className="flex items-center justify-between relative">

                    <div className="absolute left-12 right-12 top-5 border-t border-gray-300"></div>

                    <div className="relative flex flex-col items-center gap-2">
                        <div>
                            {/* <CalendarDays size={18} /> */}
                            <img src={Billingperiod} width={45} height={45} />
                        </div>
                        <p className="text-xs text-gray-500">Billing Period</p>
                        <p className="text-sm font-medium">Mar 2 → Apr 1</p>
                    </div>

                    <div className="relative flex flex-col items-center gap-2">
                        <div className="bg-yellow-500 text-white p-3 rounded-full">
                            <TrendingUp size={18} />
                        </div>
                        <p className="text-xs text-gray-500">Invoice Generation</p>
                        <p className="text-sm font-medium">Apr 1</p>
                    </div>

                    <div className="relative flex flex-col items-center gap-2">
                        <div className="bg-gray-500 text-white p-3 rounded-full">
                            <Clock size={18} />
                        </div>
                        <p className="text-xs text-gray-500">Payment Due</p>
                        <p className="text-sm font-medium">Apr 10</p>
                    </div>

                    <div className="relative flex flex-col items-center gap-2">
                        <div className="bg-red-500 text-white p-3 rounded-full">
                            <AlertCircle size={18} />
                        </div>
                        <p className="text-xs text-gray-500">Late Fee Starts</p>
                        <p className="text-sm font-medium">Apr 11</p>
                    </div>

                </div>
            </div>

            {/* Issue Card */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white flex items-center justify-between">

                <div>
                    <h3 className="font-semibold text-[18px]  font-sans text-left">
                        Recurring Billing Issue Detected
                    </h3>
                    <p className="text-sm text-gray-500 text-[12px]  font-sans text-left">
                        Recurring invoices for this month were not generated automatically.
                    </p>

                    <div className="flex gap-10 mt-4 text-sm">

                        <div>
                            <p className="text-sm text-gray-500 text-[12px]  font-sans text-left">Billing Cycle</p>
                            <p className="font-medium">2 Apr → 1 May</p>
                        </div>

                        <div>
                            <p className="text-gray-400 flex items-center gap-1 text-sm text-gray-500 text-[12px]  font-sans text-left">
                                <Users size={14} /> Active Tenants
                            </p>
                            <p className="font-medium text-left">42</p>
                        </div>

                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 text-sm text-gray-500 text-[12px]  font-sans"
                >
                    Generate Recurring Manually
                </button>

            </div>

            {/* History Table */}
            <h3 className="p-4 font-semibold text-left">Recurring History</h3>
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">

                <div className="max-h-[250px] overflow-y-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left uppercase">Month</th>
                                <th className="px-4 py-3 text-left uppercase">Billing Cycle</th>
                                <th className="px-4 py-3 text-left uppercase">Trigger Type</th>
                                <th className="px-4 py-3 text-left uppercase">Invoices Generated</th>
                                <th className="px-4 py-3 text-left uppercase">Triggered By</th>
                                <th className="px-4 py-3 text-left uppercase">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">

                            <tr>
                                <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">March 2026</td>
                                <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">Mar 2 → Apr 1</td>
                                <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">-</td>
                                <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">-</td>
                                <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">-</td>
                                <td className="p-3 text-red-500">Not Generated</td>
                            </tr>




                        </tbody>

                    </table>

                </div>

            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-[480px] max-h-[90vh] p-6 relative shadow-xl overflow-y-auto 
[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">    {/* close */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 text-gray-400"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold text-left font-sans">
                            Generate Recurring Invoices
                        </h2>

                        <p className="text-[12px] text-gray-500 mt-1 text-left font-sans">
                            Recurring invoices were not generated automatically for this property.
                            You can generate them manually for the current billing cycle.
                        </p>

                        {/* Billing Cycle */}
                        <div className="mt-4 text-left">
                            <label className="text-[13px] font-sans font-medium">Billing Cycle</label>
                            <input
                                value="2 Apr → 1 May"
                                disabled
                                className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100 text-[12px]"
                            />
                        </div>

                        {/* Active Tenants */}
                        <div className="mt-3 text-left">
                            <label className="text-[13px] font-sans font-medium">Active Tenants</label>
                            <input
                                value="42"
                                disabled
                                className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100 text-[12px]"
                            />
                        </div>

                        {/* Reason */}
                        <div className="mt-3 text-left">
                            <label className="text-[13px] font-sans font-medium">
                                Reason <span className="text-red-500">*</span>
                            </label>

                            <select className="w-full mt-1 border rounded-lg px-3 py-2 text-[12px]">
                                <option>Select a reason</option>
                                <option>System issue</option>
                                <option>Manual billing</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="mt-3 text-left">
                            <label className="text-[13px] font-sans font-medium">Description</label>

                            <textarea
                                rows="3"
                                placeholder="Explain why this manual recurring generation is required."
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-[12px]"
                            />
                        </div>

                        {/* warning */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4 text-[12px] font-sans text-left text-yellow-800 flex gap-2">
                            <p>⚠ </p>
                            Generating recurring invoices will create invoices for all active tenants for this billing cycle.
                        </div>

                        {/* checkbox */}
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                checked={confirm}
                                onChange={(e) => setConfirm(e.target.checked)}
                            />

                            <p className="text-sm">
                                I confirm that I want to generate invoices manually.
                            </p>
                        </div>

                        {/* buttons */}
                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded-lg text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleGenerate}
                                disabled={!confirm}
                                className={`px-4 py-2 rounded-lg text-sm text-white ${confirm
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                Generate Recurring
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};

export default RecurringBill;

