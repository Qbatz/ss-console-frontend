
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
import Item from "antd/es/list/Item";
import Change from "../../assets/change.png"


const RecurringBill = ({ hostelData }) => {
  const { getRecurringHostels, generateRecurringInvoice, updateBillingRule } = useHostel();
  const [reccuringData, setReccuringData] = useState([])
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [billingType, setBillingType] = useState("");
  const [confirmManual, setConfirmManual] = useState(false);
  const [shouldDeleteInvoices, setShouldDeleteInvoices] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  useEffect(() => {
    fetchRecurring();
  }, []);
  useEffect(() => {
    if (hostelData?.currentBillingRules?.billingModel) {
      setBillingType(hostelData.currentBillingRules.billingModel);
    }
  }, [hostelData]);
  console.log("hostelData", hostelData.ebConfig)

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
  const formatDate = (date) => {
    if (!date) return "-";

    const [day, month, year] = date.split("/");

    const d = new Date(`${year}-${month}-${day}`);

    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };
  const parseDate = (date) => {
    if (!date) return null;

    const [day, month, year] = date.split("/");
    return new Date(`${year}-${month}-${day}`);
  };
  const formatShortDate = (date) => {
    if (!date) return "-";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };
  const start = parseDate(hostelData?.currentBillingRules?.currentPeriodStartDate);
  const end = parseDate(hostelData?.currentBillingRules?.currentPeriodEndDate);
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
  const isInvalidChange =
  hostelData?.currentBillingRules?.typeOfBilling === "JOINING_DATE_BASED" &&
  billingType === "POSTPAID";
  const isJoiningBased =
  hostelData?.currentBillingRules?.typeOfBilling === "JOINING_DATE_BASED";

  const handleUpdateSchedule = async () => {

    const currentModel = String(hostelData?.currentBillingRules?.billingModel || "");
    const selectedModel = String(billingType || "");
 if (hostelData?.currentBillingRules?.typeOfBilling === "JOINING_DATE_BASED") {
  setModalType("error");
  setMessage("Cannot change billing model for Joining Date Based");
  setShowSuccess(true);

  setIsBlocked(true); 

  setTimeout(() => setShowSuccess(false), 1500);
  return;
}
    if (
      currentModel === selectedModel &&
      shouldDeleteInvoices === false
    ) {
      setModalType("error");
      setMessage("No changes detected");
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 1500);
      return;
    }


 

    const payload = {
      billingStartDate: null,
      billingDueDays: null,
      noticePeriodDays: null,
      gracePeriodDays: null,
      typeOfBilling: null,
      billingModel: billingType,
      reminderDays: null,
      shouldDeleteInvoices
    };

    const res = await updateBillingRule(
      hostelData?.hostelId,
      payload
    );

    if (res?.success) {
      setShowScheduleModal(false);
      setModalType("success");
      setMessage(res.message);
    } else {
      setModalType("error");
      setMessage(res?.message);
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };
  //     const handleUpdateSchedule = async () => {
  //   if (!confirmManual) return;

  //  const payload = {
  //   billingStartDate: null,
  //   billingDueDays: null,
  //   noticePeriodDays: null,
  //   gracePeriodDays: null,
  //   typeOfBilling: null,
  //   billingModel: billingType,
  //   reminderDays: null
  // };

  //   const res = await updateBillingRule(
  //     hostelData?.hostelId,
  //     payload
  //   );

  //   if (res?.success) {
  //     setShowScheduleModal(false);

  //     // refresh data
  //     await getHostelById(hostelData?.hostelId);

  //     setModalType("success");
  //     setMessage(res.message);
  //     setShowSuccess(true);

  //   } else {
  //     setModalType("error");
  //     setMessage(res?.message);
  //     setShowSuccess(true);
  //   }

  //   setTimeout(() => {
  //     setShowSuccess(false);
  //   }, 1000);
  // };
  return (
    <div className="p-5">
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />

      {/* BILLING RULE */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white h-[350px]">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-[13px] font-semibold text-gray-600 tracking-wide">
            BILLING RULE
          </h2>

          <button
            onClick={() => setShowBillingModal(true)}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-[4px] rounded cursor-pointer"
          >
            View
          </button>

        </div>

        <div className="grid grid-cols-3 gap-y-6 gap-x-12 text-[13px] text-left">

          <div>
            <p className="text-gray-400 mb-1">Billing Method</p>
            <p className="text-gray-800 font-medium">{hostelData?.currentBillingRules?.typeOfBilling}</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1 flex items-center gap-2">
              Billing Cycle


              <div className="relative group cursor-pointer">
                {/* <img
  src={Change}
  className="w-3 h-3 cursor-pointer"
  onClick={() => setShowScheduleModal(true)}
/> */}
                <img
                  src={Change}
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {


                    setShowScheduleModal(true);
                  }}
                />


                <div className="absolute left-1/2 -translate-x-1/2 top-[-30px] 
                      bg-gray-600 text-white text-[11px] px-2 py-[2px] rounded 
                      opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  Change Schedule
                </div>
              </div>
            </p>

            <p className="text-gray-800 font-medium flex items-center gap-2">
              {hostelData?.currentBillingRules?.billingStartDay} → {hostelData?.currentBillingRules?.billingEndDay} -

              <span className="bg-blue-100 text-blue-700 px-2 py-[2px] rounded text-xs font-medium">
                {hostelData?.currentBillingRules?.billingModel}
              </span>
            </p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Last Recurring</p>

            <p className="text-gray-800 font-medium">
              {formatDate(hostelData?.currentBillingRules?.lastRecurringDate)}
            </p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Current Period</p>

            <p className="text-gray-800 font-medium">
              {formatShortDate(start)} → {formatShortDate(end)}
            </p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Next Recurring</p>
            <p className="text-gray-800 font-medium">
              {/* {hostelData?.currentBillingRules?.nextRecurringDate} */}
              {formatDate(hostelData?.currentBillingRules?.nextRecurringDate)}
            </p>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* ELECTRICITY RULE */}
        <h2 className="text-[13px] font-semibold text-gray-600 mb-4 tracking-wide text-left">
          ELECTRICITY RULE
        </h2>

        <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-[13px] text-left">
          <div>
            <p className="text-gray-400 mb-1">Included in Rent</p>

            <p
              className={`font-medium ${hostelData?.ebConfig?.shouldIncludeInRent
                  ? "text-green-600"
                  : "text-red-500"
                }`}
            >
              {hostelData?.ebConfig?.shouldIncludeInRent
                ? "Included"
                : "Not Included"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Calculation Method</p>
            <p className="text-gray-800 font-medium">{hostelData?.ebConfig?.typeOfReading}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Configuration</p>

            <p className="text-gray-800 font-medium">
              {hostelData?.ebConfig?.typeOfReading === "FLAT_RATE"
                ? `Flat Charge - ₹ ${hostelData?.ebConfig?.flatCharge}`
                : `Fixed Monthly Charge - ₹ ${hostelData?.ebConfig?.charge}`}
            </p>
          </div>

        </div>

      </div>

      {/* STATUS */}
      <div className="flex items-center gap-3 mt-4 text-[13px]">

        {hostelData?.recurringStatus === true ? (
          <>
            {/* ACTIVE */}
            <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-[2px] rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Active
            </span>

            {/* GENERATED */}
            <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-[2px] rounded-full">
              ✔ Generated
            </span>
          </>
        ) : (
          <>
            {/* EXPIRED */}
            <span className="bg-red-100 text-red-600 px-2 py-[2px] rounded-full">
              Expired
            </span>

            {/* PENDING */}
            <span className="bg-yellow-100 text-yellow-700 px-2 py-[2px] rounded-full">
              Pending
            </span>
          </>
        )}

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

          <tbody className="divide-y text-gray-700 divide-gray-200">
            {hostelData?.recurringHistory?.length > 0 ? (
              hostelData.recurringHistory.map((item, index) => {

                const start = parseDate(item.cycleStartDate);
                const end = parseDate(item.cycleEndDate);

                return (
                  <tr key={index}>

                    {/* MONTH */}
                    <td className="px-4 py-2 text-left">
                      {item.recurringCreatedAtDate}
                    </td>

                    {/* CYCLE */}
                    <td className="px-4 py-2 text-left">
                      {item.cycleStartDay} → {item.cycleEndDay}
                    </td>

                    {/* INVOICE COUNT */}
                    <td className="px-4 py-2 text-left">
                      {item.invoiceGeneratedCount}
                    </td>

                    {/* CREATED BY */}
                    <td className="px-4 py-2 text-left">
                      {item.createdBy || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-2 text-left">
                      <span className="bg-green-100 text-green-600 px-2 py-[2px] rounded-full text-xs">
                        {item.recurringMode}
                      </span>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No Recurring History
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
      {showBillingModal && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowBillingModal(false)}
          />

          {/* MODAL CENTER */}
          <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setShowBillingModal(false)}>

            <div className="bg-white w-[90%] max-h-[90vh] rounded-xl shadow-lg p-5 flex flex-col" onClick={(e) => e.stopPropagation()}>

              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-sm">Billing Rules</h2>
                <button className="cursor-pointer" onClick={() => setShowBillingModal(false)}>✕</button>
              </div>

              {/* TABLE SCROLL */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg">

                  <thead className="bg-gray-100 text-gray-600 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Cycle</th>
                      <th className="p-2 text-left">Billing Type</th>
                      <th className="p-2 text-left">Billingmodel</th>
                      <th className="p-2 text-left">Created</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {hostelData?.billingRules?.map((rule) => (
                      <tr key={rule.billingRulesId} className="hover:bg-gray-50">
                        <td className="p-2 text-left">{rule.billingStartDay} → {rule.billingEndDay}</td>
                        <td className="p-2 text-left">{rule.typeOfBilling}</td>
                        <td className="p-2 text-left">
                          <span className={`px-2 py-[2px] rounded text-xs
                      ${rule.billingModel === "PREPAID"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"}`}>
                            {rule.billingModel}
                          </span>
                        </td>
                        <td className="p-2 text-left">{rule.createdAtDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </>
      )}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowScheduleModal(false)}
          ></div>

          {/* Modal */}
          <div
            className="relative bg-white rounded-xl shadow-xl w-[400px] p-5 z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">
                Change Bill Schedule
              </h2>

              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-red-500 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Dropdown */}
            {/* <div className="mb-3">
        <label className="text-xs text-gray-500 mb-1 block text-left">
          Billing Schedule
        </label>

      
<select
  value={billingType}
  onChange={(e) => setBillingType(e.target.value)}
  disabled={hostelData?.currentBillingRules?.typeOfBilling === "JOINING_DATE_BASED"}
  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100"
>
  {hostelData?.billingModels?.map((item, index) => (
    <option key={index} value={item.billingModel}>
      {item.billingModel === "PREPAID" ? "Prepaid" : "Postpaid"}
    </option>
  ))}
</select>
      </div> */}

            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block text-left">
                Billing Schedule
              </label>

              <select
                value={billingType}
                onChange={(e) => setBillingType(e.target.value)}

                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100"
              >
                {hostelData?.billingModels?.map((item, index) => (
                  <option key={index} value={item.billingModel}>
                    {item.billingModel === "PREPAID" ? "Prepaid" : "Postpaid"}
                  </option>
                ))}
              </select>

              {/* 🔥 Message here */}
            {isJoiningBased && (
  <p className="text-xs text-red-500 mt-1 text-center">
    Only Prepaid is allowed for Joining Date Based billing
  </p>
)}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs rounded-lg px-3 py-2 mb-3">
              ⚠ It will reflects on from the next Billing Cycle
            </div>


            <div className="flex items-start gap-2 mb-4">
              <input
                type="checkbox"
                checked={shouldDeleteInvoices}
                onChange={(e) => setShouldDeleteInvoices(e.target.checked)}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-600">
                Delete existing invoices
              </p>
            </div>


            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border rounded-lg text-sm cursor-pointer"
              >
                Cancel
              </button>

 <button
  onClick={handleUpdateSchedule}
  disabled={isJoiningBased}
  className={`px-4 py-2 rounded-lg text-sm text-white ${
    isJoiningBased
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-blue-600 cursor-pointer"
  }`}
>
  Proceed
</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RecurringBill;

