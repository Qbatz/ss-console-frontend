import React,{useState,useEffect} from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Arrow from "../../assets/arrow-right.png";
import { useHostel } from "../../Context/HostelListContext";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

const sections = [
  { title: "Unpaid Invoices", amount: "₹12000" },
  { title: "Refundable Rent", amount: "₹-2258.06" },
  { title: "Electricity Bill", amount: "₹0" },
  { title: "Wallet", amount: "₹0" },
  { title: "Refundable Advance", amount: "₹6000" },
  { title: "Refundable Bookings", amount: "₹0" },
  { title: "Deductions", amount: "₹0" },
];

const SettlementSummary = () => {
   const {getTenantSettlement} = useHostel();
     const { customerId } = useParams();
  const [showUnpaid, setShowUnpaid] = useState(true);
const [showRent, setShowRent] = useState(false);
const [showElectricity, setShowElectricity] = useState(false);
const [showWallet, setShowWallet] = useState(false);
const [showAdvance, setShowAdvance] = useState(false);
const [showBooking, setShowBooking] = useState(false);
const [showDeduction, setShowDeduction] = useState(false);
const [showRentSection, setShowRentSection] = useState(true);
const [showRentDetails, setShowRentDetails] = useState(false);
const [checkoutDate, setCheckoutDate] = useState(dayjs());
const [editDate, setEditDate] = useState(false);
const [settlementData, setSettlementData] = useState(null);
const [loadingData, setLoadingData] = useState(false);
const [custometInfoList,setCustomerInfoList] = useState("")
const [customerStayInfo,setCustomerStayInfo] = useState("")
console.log("customerStayInfo", customerStayInfo);
const handleSettlement = async (selectedDate) => {
  if (!customerId) return;
  
  setLoadingData(true);
  try {
 
    const res = await getTenantSettlement(customerId, selectedDate);
    if (res?.success) {
      setSettlementData(res.data);
      setCustomerInfoList(res?.data?.customerInfo)
      setCustomerStayInfo(res?.data?.customerStayInfo)
      
    }
  } catch (error) {
    console.error("Error fetching settlement data:", error);
  } finally {
    setLoadingData(false);
  }
};
useEffect(() => {
  if (customerId) {
    
    handleSettlement(checkoutDate.format("DD-MM-YYYY"));
  }
}, [customerId]);
  return (
    <DashboardLayout>
      <div className="h-screen bg-[#F8FAFC] flex flex-col">

        {/* Header */}
        <div className="px-8 pt-6 shrink-0">
          <h1 className="block text-[20px] font-semibold text-[#222222] text-left">
            Final Settlement
          </h1>

          <p className="mt-1 text-[18px] text-[#667085] text-left">
            Tenants / Final Settlement
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-4 overflow-hidden">

          <div className="flex gap-6 h-full">

            {/* LEFT CARD */}
            <div className="w-[350px] shrink-0">
              <div className="h-full rounded-3xl border border-[#EAECF0] bg-white p-8 overflow-y-auto">

               
                <div className="flex items-start gap-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4E7EC] text-[12px] font-semibold">
                    {custometInfoList?.initials}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[20px] font-semibold">
                      {custometInfoList?.fullName}
                      </h2>

                      <span className="text-blue-600">✔</span>
                    </div>

                    <p className="mt-2 text-[14px] text-[#475467]">
                      Mobile : +91 {custometInfoList?.mobile}
                    </p>
                  </div>
                </div>

               <div className="mt-4 flex gap-2">
  <span className="rounded-full bg-[#FFF3D6] px-3 py-2 text-[13px]">
    Ground Floor
  </span>

  <span className="rounded-full bg-[#FDE7EC] px-4 py-2 text-[13px]">
    G1-bed7
  </span>
</div>

                <div className="mt-8 space-y-4">

                  <div className="flex justify-between text-[14px]">
                    <span>Joined Date</span>
                    <span className="font-semibold">{custometInfoList?.joiningDate}</span>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span>Req Checkout Date</span>
                    <span className="font-semibold">{customerStayInfo?.requestedLeavingDate}</span>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span>Advance Amount</span>
                    <span className="font-semibold">₹{custometInfoList?.customerAdvanceAmount}</span>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span>Booking Amount</span>
                    <span className="font-semibold">₹0</span>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span>Advance Paid</span>
                    <span className="font-semibold">₹10000</span>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span>Monthly Rent</span>
                    <span className="font-semibold">₹6000</span>
                  </div>

 <div className="flex justify-between items-center text-[14px]">
  <span>Actual Checkout Date</span>

  {/* Date display conditional layout mapping logic block */}
{!editDate ? (
  <div className="flex items-center gap-2">
    <span className="font-semibold">
      {checkoutDate.format("DD/MM/YYYY")}
    </span>

    <button
      onClick={() => setEditDate(true)}
      className="text-[#3158F5]"
    >
      ✎
    </button>
  </div>
) : (
  <DatePicker
    value={checkoutDate}
    format="DD-MM-YYYY"
    allowClear={false}
    onChange={(value) => {
      if (value) {
        setCheckoutDate(value);
        // Formatted API custom format conversion parameter triggers standard validation flow
        handleSettlement(value.format("DD-MM-YYYY"));
        setEditDate(false);
      }
    }}
  />
)}
</div>

                </div>

                <div className="mt-8 rounded-xl bg-[#FFF1F3] py-3 text-center text-red-500 text-[14px]">
                  Pending
                </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 bg-white rounded-3xl border border-[#EAECF0] flex flex-col overflow-hidden">

              {/* Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-4">

               {sections.map((item) => (
  <div
    key={item.title}
    className="mb-4 overflow-hidden  rounded-2xl border border-[#EAECF0] bg-white"
  >
    <div
      className="flex items-center justify-between px-6 py-5 cursor-pointer "
//     onClick={() => {
//   if (item.title === "Unpaid Invoices") {
//     setShowUnpaid(!showUnpaid);
//   }

//  if (item.title === "Refundable Rent") {
//   setShowRentSection(!showRentSection);
// }
// }}
onClick={() => {
  if (item.title === "Unpaid Invoices") {
    setShowUnpaid(!showUnpaid);
  }

  if (item.title === "Refundable Rent") {
    setShowRentSection(!showRentSection);
  }

  if (item.title === "Electricity Bill") {
    setShowElectricity(!showElectricity);
  }

  if (item.title === "Wallet") {
    setShowWallet(!showWallet);
  }

  if (item.title === "Refundable Advance") {
    setShowAdvance(!showAdvance);
  }

  if (item.title === "Refundable Bookings") {
    setShowBooking(!showBooking);
  }

  if (item.title === "Deductions") {
    setShowDeduction(!showDeduction);
  }
}}
    >
      <div className="flex items-center gap-3">
       <img
  src={Arrow}
 className={`w-4 h-4 transition-transform ${
  item.title === "Unpaid Invoices"
    ? showUnpaid
      ? "rotate-[270deg]"
      : "rotate-90"
    : item.title === "Refundable Rent"
    ? showRentSection
      ? "rotate-[270deg]"
      : "rotate-90"
    : item.title === "Electricity Bill"
    ? showElectricity
      ? "rotate-[270deg]"
      : "rotate-90"
    : item.title === "Wallet"
    ? showWallet
      ? "rotate-[270deg]"
      : "rotate-90"
    : item.title === "Refundable Advance"
    ? showAdvance
      ? "rotate-[270deg]"
      : "rotate-90"
    : item.title === "Refundable Bookings"
    ? showBooking
      ? "rotate-[270deg]"
      : "rotate-90"
    : showDeduction
    ? "rotate-[270deg]"
    : "rotate-90"
}`}
/>

        <h3 className="text-[14px] font-semibold text-[#101828]">
          {item.title}
        </h3>
      </div>

      <span className="text-[14px] font-semibold text-[#101828]">
        {item.amount}
      </span>
    </div>

    {item.title === "Unpaid Invoices" && showUnpaid && (
      <div className="px-4 pb-4">
        <div className="overflow-hidden rounded-xl border border-[#EAECF0]">
          <div className="grid grid-cols-3 px-4 py-4 font-semibold text-[#101828]">
            <div>Invoice No</div>
            <div>Type</div>
            <div className="text-right">Invoice Amount</div>
          </div>

          <div className="grid grid-cols-3 px-4 py-4">
            <div className="text-[#3158F5] underline cursor-pointer">
              INV-013
            </div>
            <div>Rent</div>
            <div className="text-right">₹6000</div>
          </div>

          <div className="grid grid-cols-3 px-4 py-4">
            <div className="text-[#3158F5] underline cursor-pointer">
              INV-012
            </div>
            <div>Rent</div>
            <div className="text-right">₹6000</div>
          </div>

          <div className="border-t bg-[#F9FAFB] grid grid-cols-3 px-4 py-4 font-medium">
            <div>Total</div>
            <div />
            <div className="text-right">₹12000</div>
          </div>
        </div>
      </div>
    )}
    

  
   {item.title === "Refundable Rent" &&
  showRentSection && (

  <div className="border-t border-[#EAECF0]">

    <div className="px-6 py-5 flex items-center gap-3">
      <input
        type="checkbox"
        className="w-5 h-5 rounded"
      />

      <span className="text-[16px] text-[#344054]">
        Do you want to collect Full Rent for current month?
      </span>
    </div>

    <div className="border-t border-[#EAECF0] px-6 py-5">

      <div className="flex justify-between items-center mb-5">
        <span className="text-[16px] text-[#101828]">
          Last Rent Paid
        </span>

        <span className="text-[16px] font-medium">
          ₹4000
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-[16px] text-[#101828]">
            Actual Stay Days (Rent) (9 days)
          </span>

          <button
            onClick={() =>
              setShowRentDetails(!showRentDetails)
            }
            className="w-9 h-9 rounded-lg bg-[#EEF4FF] flex items-center justify-center"
          >
           <img
  src={Arrow}
  className={`w-4 h-4 transition-transform ${
    item.title === "Unpaid Invoices"
      ? showUnpaid
        ? "rotate-[270deg]"
        : "rotate-90"
      : item.title === "Refundable Rent"
      ? showRentSection
        ? "rotate-[270deg]"
        : "rotate-90"
      : "rotate-90"
  }`}
/>
          </button>
        </div>

        <span className="text-[16px] font-medium">
          ₹1741.94
        </span>
      </div>

      {showRentDetails && (
        <div className="mt-4 rounded-2xl bg-[#F9FAFB] px-5 py-4 flex justify-between items-center">
          <span className="text-[#3158F5] text-[15px]">
            Ground Floor | G1 - bed7
          </span>

          <span className="text-[15px] text-[#344054]">
            (9 days × 193.55 = 1741.94)
          </span>
        </div>
      )}

    </div>

  </div>
)}


{item.title === "Electricity Bill" && showElectricity && (
  <div className="border-t border-[#EAECF0] px-6 py-6">

    <h4 className="text-[16px] font-semibold text-[#101828] mb-5">
      Missed Electricity
    </h4>

    <div className="border-t border-[#EAECF0] pt-4 flex items-center justify-between">

      <div className="flex items-center gap-4">
        <span className="text-[16px] text-[#101828]">
          Ground Floor
        </span>

        <span className="h-6 w-px bg-[#D0D5DD]" />

        <span className="text-[16px] text-[#101828]">
          G1 - bed7
        </span>

        <span className="rounded-xl bg-[#FFF4ED] px-4 py-2 text-[#B54708] text-[15px] font-medium">
          13/06/2026 - 10/07/2026
        </span>
      </div>

      <button className="flex items-center gap-2 text-[#3158F5] font-medium">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3158F5] text-white">
          +
        </span>
        Add
      </button>

    </div>

  </div>
)}
{item.title === "Wallet" && showWallet && (
  <div className="border-t border-[#EAECF0] px-6 py-8 flex justify-center">
    <span
      className="
        rounded-xl
        bg-[#FFF4ED]
        px-6
        py-3
        text-[16px]
        font-medium
        text-[#B54708]
      "
    >
      No wallet transactions available
    </span>
  </div>
)}
{item.title === "Refundable Advance" && showAdvance && (
  <div className="border-t border-[#EAECF0]">

    <div className="grid grid-cols-4 bg-[#F9FAFB] px-8 py-6 text-[#667085] font-semibold">
      <div>ADJUSTED WITH</div>
      <div>TYPE</div>
      <div>DATE</div>
      <div className="text-right">APPLIED AMOUNT</div>
    </div>

    <div className="grid grid-cols-4 px-8 py-7 border-t border-[#EAECF0]">
      <div className="text-[#3158F5] underline cursor-pointer">
        INV-011
      </div>

      <div>Rent</div>

      <div>08/07/2026</div>

      <div className="text-right font-medium">
        ₹ 4000
      </div>
    </div>

  </div>
)}
{item.title === "Refundable Bookings" && showBooking && (
  <div className="border-t border-[#EAECF0]">

    <div className="grid grid-cols-4 bg-[#F9FAFB] px-8 py-6 text-[#667085] font-semibold">
      <div>ADJUSTED WITH</div>
      <div>TYPE</div>
      <div>DATE</div>
      <div className="text-right">APPLIED AMOUNT</div>
    </div>

    <div className="py-10 flex justify-center">
      <span className="text-[#B54708] text-[18px]">
        No booking transactions available
      </span>
    </div>

  </div>
)}
{item.title === "Deductions" && showDeduction && (
  <div className="border-t border-[#EAECF0] px-8 py-8">

    <div className="flex justify-end mb-8">
      <button className="flex items-center gap-2 bg-[#EEF4FF] px-5 py-3 rounded-xl text-[#3158F5]">
        <span className="w-6 h-6 rounded-full bg-[#3158F5] text-white flex items-center justify-center">
          +
        </span>
        Add
      </button>
    </div>

    <p className="text-[#475467] text-[16px] leading-8">
      Note: These amount was be withheld from the
      Non Refundable Deposit amount due to
      lack of payment.
    </p>

  </div>
)}
  </div>
))}
<div className="border border-[#EAECF0] rounded-2xl mx-4 mb-4 px-10 py-3 flex justify-between items-center">
  <span className="text-[14px] font-semibold text-[#101828]">
    Discount (Current Month)
  </span>

  <div className="flex items-center border border-[#D0D5DD] rounded-xl overflow-hidden">
    <span className="px-4 py-2 text-[14px] font-medium">
      ₹ 0
    </span>

    <button className="bg-[#EEF4FF] px-4 py-2 text-[14px] font-medium text-[#3158F5]">
      Edit
    </button>
  </div>
</div>

              </div>

              {/* Footer */}
              <div className="border-t border-[#EAECF0] bg-white px-8 py-6 shrink-0">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[12px] text-[#667085] whitespace-nowrap text-left">
                      Outstanding Amount Payable
                    </p>

                    <h2 className="mt-1 text-[17px] text-left font-bold text-[#16A34A]">
                      ₹ 3,742
                    </h2>
                  </div>

                  <div className="flex gap-4">

                    <button className="h-[40px] px-8 rounded-xl border border-[#D0D5DD] bg-white text-[13px]">
                      Cancel
                    </button>

                    <button className="h-[40px] px-5 rounded-xl bg-[#3158F5] text-white text-[13px]">
                      Generate
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettlementSummary;