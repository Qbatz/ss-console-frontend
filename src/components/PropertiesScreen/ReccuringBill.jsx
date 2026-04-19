
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
import Circle from "../../assets/menucircle.png";
import Toast from "../SuccessModal/ToastDesign";


const RecurringBill = ({ hostelData }) => {
    const { getRecurringHostels, generateRecurringInvoice } = useHostel();
    const [reccuringData, setReccuringData] = useState([])
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        fetchRecurring();
    }, []);
    console.log("hostelData",hostelData.ebConfig)

    const fetchRecurring = async () => {
        const res = await getRecurringHostels(0, 10, "", "TODAY");

        if (res?.success) {
            console.log("Recurring Data", res.data.hostelList);
            setReccuringData(res.data.hostelList)
        }
    };

    console.log("reccuringData", reccuringData)
    const [showModal, setShowModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const handleGenerateRow = async (item) => {

        const res = await generateRecurringInvoice(
            item.hostelId,
            item.recurringDay
        );

        if (res?.success) {

            
            setModalType("success");
            setMessage(res?.message);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 1500);
            fetchRecurring();

        } 
        else {

            setMessage(res?.message);
            setModalType("error");

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 1500);

        }

    };
    return (
   <div className="p-5">

  {/* BILLING RULE */}
  <div className="border border-gray-200 rounded-xl p-5 bg-white h-[350px]">

    <h2 className="text-[13px] font-semibold text-gray-600 mb-4 tracking-wide text-left">
      BILLING RULE
    </h2>

    <div className="grid grid-cols-3 gap-y-6 gap-x-12 text-[13px] text-left">

      <div>
        <p className="text-gray-400 mb-1">Billing Method</p>
        <p className="text-gray-800 font-medium">Monthly Recurring</p>
      </div>

      <div>
        <p className="text-gray-400 mb-1">Billing Cycle</p>
        <p className="text-gray-800 font-medium">2 → 1 - Pre-paid</p>
      </div>

      <div>
        <p className="text-gray-400 mb-1">Last Recurring</p>
        <p className="text-gray-800 font-medium">May 1, 2026</p>
      </div>

      <div>
        <p className="text-gray-400 mb-1">Current Period</p>
        <p className="text-gray-800 font-medium">May 2 → Jun 1</p>
      </div>

      <div>
        <p className="text-gray-400 mb-1">Next Recurring</p>
        <p className="text-gray-800 font-medium">Jun 1, 2026</p>
      </div>

    </div>

    {/* Divider */}
    <div className="border-t border-gray-300 my-5"></div>

    {/* ELECTRICITY RULE */}
    <h2 className="text-[13px] font-semibold text-gray-600 mb-4 tracking-wide text-left">
      ELECTRICITY RULE
    </h2>

    <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-[13px] text-left">

      <div>
        <p className="text-gray-400 mb-1">Calculation Method</p>
        <p className="text-gray-800 font-medium">{hostelData?.ebConfig?.typeOfReading}</p>
      </div>

      <div>
        <p className="text-gray-400 mb-1">Configuration</p>
        <p className="text-gray-800 font-medium">
          Fixed Monthly Charge - ₹ {hostelData?.ebConfig?.charge}
        </p>
      </div>

    </div>

  </div>

  {/* STATUS */}
  <div className="flex items-center gap-3 mt-4 text-[13px]">

    <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-[2px] rounded-full">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      Active
    </span>

    <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-[2px] rounded-full">
      ✔ Generated
    </span>

  </div>

  {/* TABLE TITLE */}
  <h3 className="text-[13px] font-semibold text-gray-600 mt-4 mb-2 text-left">
    RECURRING HISTORY — LAST 5 MONTHS
  </h3>

  {/* TABLE */}
  <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">

    <table className="w-full text-[13px]">

      <thead className="bg-gray-50 text-gray-500">
        <tr>
          <th className="px-4 py-2 text-left font-medium">MONTH</th>
          <th className="px-4 py-2 text-left font-medium">CYCLE</th>
          <th className="px-4 py-2 text-left font-medium">INV</th>
          <th className="px-4 py-2 text-left font-medium">BY</th>
          <th className="px-4 py-2 text-left font-medium">STATUS</th>
        </tr>
      </thead>

      <tbody className="divide-y text-gray-700">

        <tr>
          <td className="px-4 py-2">May 2026</td>
          <td className="px-4 py-2">Apr 2 → May 1</td>
          <td className="px-4 py-2">42</td>
          <td className="px-4 py-2">Admin</td>
          <td className="px-4 py-2">
            <span className="bg-green-100 text-green-600 px-2 py-[2px] rounded-full text-xs">
              ✔ Generated
            </span>
          </td>
        </tr>

      </tbody>

    </table>

  </div>

</div>
    );
};

export default RecurringBill;

