import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Arrow from "../../assets/arrow-right.png";
import { useHostel } from "../../Context/HostelListContext";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import Edit from "../../assets/editIcon.png";
import Toast from "../SuccessModal/ToastDesign";



const SettlementSummary = () => {
  const { getTenantSettlement } = useHostel();
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
  const [custometInfoList, setCustomerInfoList] = useState("")
  const [customerStayInfo, setCustomerStayInfo] = useState("")
  const [unPaidInvoice, setUnPaidInvoice] = useState({})
  const [customerRentInfo, setCustomerRentInfo] = useState({})
  const [customerEbInfo, setCustomerInfo] = useState({})
  const [customerWallet, setCustomerWallet] = useState({})
  const [customerAdvance, setCustomerAdvance] = useState({})
  const [customerBooking, setCustomerBooking] = useState({})
  const [deductionType, setDeductionType] = useState("");
  const [deductionRows, setDeductionRows] = useState([]);
  const [deductionAmount, setDeductionAmount] = useState("");
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [customerDeductions, setCustomerDeductions] = useState({});
  const [customerFinalSettlement,setCustomerFinalSettlement] = useState("")
  const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [collectFullRent, setCollectFullRent] = useState(false);
 
  console.log("customerFinalSettlement", customerFinalSettlement);
  const sections = [
    { title: "Unpaid Invoices", amount: `₹${unPaidInvoice?.unpaidAmount || 0}`  },
    // { title: "Refundable Rent", amount: `₹${customerRentInfo?.currentPayableRent || 0}` },
    {
  title:
    Number(customerRentInfo?.currentPayableRent || 0) >= 0
      ? "Payable Rent"
      : "Refundable Rent",

  amount: `₹${Math.abs(
    customerRentInfo?.currentPayableRent || 0
  ).toFixed(2)}`
},
    { title: "Electricity Bill", amount: `₹${customerEbInfo?.lastReading || 0}` },
    { title: "Wallet", amount: `₹${customerWallet?.walletAmount || 0}` },
    { title: "Refundable Advance", amount: `₹${customerAdvance?.availableBalance || 0}` },
    { title: "Refundable Bookings", amount: `₹${customerBooking?.paidAmount || 0}` },
    { title: "Deductions", amount: `₹${customerDeductions?.pendingAmount|| 0}` },
  ];
  const handleSettlement = async (selectedDate) => {
    if (!customerId) return;

    setLoadingData(true);
    try {

      const res = await getTenantSettlement(customerId, selectedDate);
      if (res?.success) {
        setSettlementData(res.data);
        setCustomerInfoList(res?.data?.customerInfo)
        setCustomerStayInfo(res?.data?.customerStayInfo)
        setUnPaidInvoice(res?.data?.unpaidInvoicesInfo)
        setCustomerRentInfo(res?.data?.customerRentInfo)
        setCustomerInfo(res?.data?.customerEbInfo)
        setCustomerWallet(res?.data?.customerWalletInfo)
        setCustomerAdvance(res?.data?.customerAdvanceInfo)
        setCustomerBooking(res?.data?.customerBookingInfo)
        setCustomerDeductions(res?.data?.customerDeductionsInfo);
        setCustomerFinalSettlement(res?.data?.customerFinalSettlementInfo)

      }
      else{
        setModalType("error");
        setMessage(res?.message );  
        setShowSuccess(true);
        setTimeout(() => {setShowSuccess(false);
          

          }, 2000);
      }
    } catch (error) {
      console.error("Error fetching settlement data:", error);
    } finally {
      setLoadingData(false);
    }
  };
  const additionalDeductionAmount = deductionRows.reduce(
  (total, row) => total + Number(row.amount || 0),
  0
);

const finalPayableAmount =
  Number(customerFinalSettlement?.amountToBePaid || 0) +
  additionalDeductionAmount;
  useEffect(() => {
    if (customerId) {

      handleSettlement(checkoutDate.format("DD-MM-YYYY"));
    }
  }, [customerId]);
  return (
    <DashboardLayout>
       <Toast
              show={showSuccess}
              message={message}
              type={modalType}
      
            />
      <div className="h-screen bg-[#F8FAFC] flex flex-col">


        <div className="px-8 pt-6 shrink-0">
          <h1 className="block text-[20px] font-semibold text-[#222222] text-left">
            Final Settlement
          </h1>

          <p className="mt-1 text-[18px] text-[#667085] text-left">
            Tenants / Final Settlement
          </p>
        </div>


        <div className="flex-1 px-8 py-4 overflow-hidden">

          <div className="flex gap-6 h-full">


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
                    <span className="font-semibold">₹{customerBooking?.paidAmount || 0}</span>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span>Advance Paid</span>
                    <span className="font-semibold">₹{custometInfoList?.totalBookingAndAdvancePaidAmount}</span>
                  </div>

                  <div className="flex justify-between text-[14px]">
                    <span>Monthly Rent</span>
                    <span className="font-semibold">₹{customerRentInfo?.currentMonthRent}</span>
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
                          <img src={Edit} className="w-4 h-4"/>
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

                {/* <div className="mt-8 rounded-xl bg-[#FFF1F3] py-3 text-center text-red-500 text-[14px]">
                  Pending
                </div> */}
               <div
  className={`mt-8 rounded-xl py-3 text-center text-[14px] ${
    finalPayableAmount >= 0
      ? "bg-[#FFF1F3] text-red-500"
      : "bg-[#ECFDF3] text-[#027A48]"
  }`}
>
  {finalPayableAmount >= 0 ? "Pending" : "Refund"}
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

                        if (item.title === "Refundable Rent" ||
item.title === "Payable Rent") {
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
                          className={`w-4 h-4 transition-transform ${item.title === "Unpaid Invoices"
                              ? showUnpaid
                                ? "rotate-[90deg]"
                                : "rotate-270"
                              : item.title === "Refundable Rent" ||
item.title === "Payable Rent"
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

                        <h3 className="text-sm font-semibold text-[#101828]">
                          {item.title}
                        </h3>
                      </div>

                      <span className="text-[14px] font-semibold text-[#101828]">
                        {item.amount}
                      </span>
                    </div>

                    {/* {item.title === "Unpaid Invoices" && showUnpaid && (
                      <div className="px-4 pb-4">
                        <div className="overflow-hidden rounded-xl border border-[#EAECF0] text-left">
                          <div className="grid grid-cols-3 px-4 py-4 font-semibold text-[#101828] text-[13px]">
                            <div>Invoice No</div>
                            <div>Type</div>
                            <div className="text-right">Invoice Amount</div>
                          </div>

                          {unPaidInvoice?.unpaidInvoices?.map((invoice) => (
                            <div
                              key={invoice.invoiceId}
                              className="grid grid-cols-3 px-4 py-4  text-[13px]"
                            >
                              <div className="text-[#3158F5] underline cursor-pointer">
                                {invoice.invoiceNumber}
                              </div>

                              <div>{invoice.type}</div>

                              <div className="text-right">
                                ₹{invoice.pendingAmount}
                              </div>
                            </div>
                          ))}

                          <div className="border-t border-gray-300 bg-[#F9FAFB] grid grid-cols-3 px-4 py-4 font-medium">
                            <div>Total</div>
                            <div />
                            <div className="text-right">
                              ₹{unPaidInvoice?.unpaidAmount || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}
                    {item.title === "Unpaid Invoices" && showUnpaid && (
  <div className="px-4 pb-4">
    <div className="overflow-hidden rounded-xl border border-[#EAECF0] text-left">

      <div className="grid grid-cols-3 px-4 py-4 font-semibold text-[#101828] text-[13px]">
        <div>Invoice No</div>
        <div>Type</div>
        <div className="text-right">Invoice Amount</div>
      </div>

      {unPaidInvoice?.unpaidInvoices?.length > 0 ? (
        <>
          {unPaidInvoice.unpaidInvoices.map((invoice) => (
            <div
              key={invoice.invoiceId}
              className="grid grid-cols-3 px-4 py-4 text-[13px]"
            >
              <div className="text-[#3158F5] underline cursor-pointer">
                {invoice.invoiceNumber}
              </div>

              <div>{invoice.type}</div>

              <div className="text-right">
                ₹{invoice.pendingAmount}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="py-6 text-center text-[#667085] text-[14px]">
          No pending invoices
        </div>
      )}

      <div className="border-t border-gray-300 bg-[#F9FAFB] grid grid-cols-3 px-4 py-4 font-medium">
        <div>Total</div>
        <div />
        <div className="text-right">
          ₹{unPaidInvoice?.unpaidAmount || 0}
        </div>
      </div>

    </div>
  </div>
)}



{
  (item.title === "Refundable Rent" ||
    item.title === "Payable Rent") &&
                      showRentSection && (

                        <div className="border-t border-[#EAECF0]">

                          {/* <div className="px-6 py-5 flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="w-5 h-5 rounded"
                            />

                            <span className="text-[16px] text-[#344054]">
                              Do you want to collect Full Rent for current month?
                            </span>
                          </div> */}
                          <div className="px-6 py-5 flex items-center gap-3">
  <input
    type="checkbox"
    checked={collectFullRent}
    onChange={(e) => setCollectFullRent(e.target.checked)}
    className="w-5 h-5 rounded accent-[#3158F5]"
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
                                ₹{customerRentInfo?.currentRentPaid}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="text-[14px] text-[#101828]">
                                  Actual Stay Days (Rent) ({customerRentInfo?.stayDays} days)
                                </span>

                                <button
                                  onClick={() =>
                                    setShowRentDetails(!showRentDetails)
                                  }
                                  className="w-9 h-9 rounded-lg bg-[#EEF4FF] flex items-center justify-center"
                                >
                                  <img
                                    src={Arrow}
                                    className={`w-4 h-4 transition-transform ${item.title === "Unpaid Invoices"
                                        ? showUnpaid
                                          ? "rotate-[270deg]"
                                          : "rotate-90"
                                        :  item.title === "Refundable Rent" ||
  item.title === "Payable Rent"
                                          ? showRentSection
                                            ? "rotate-[270deg]"
                                            : "rotate-90"
                                          : "rotate-90"
                                      }`}
                                  />
                                </button>
                              </div>

                              <span className="text-[16px] font-medium">
                                ₹{customerRentInfo?.currentPayableRent}
                              </span>
                            </div>

                            {showRentDetails &&
                              customerRentInfo?.rentBreakUpInfo?.map((rent, index) => (
                                <div
                                  key={index}
                                  className="mt-4 rounded-2xl bg-[#F9FAFB] px-5 py-4 flex justify-between items-center"
                                >
                                  <span className="text-[#3158F5] text-[13px]">
                                    {rent.floorName} | {rent.roomName} - {rent.bedName}
                                  </span>

                                  <span className="text-[15px] text-[#344054]">
                                    ({rent.noOfDays} days × {rent.rentPerDay} = {rent.totalRent})
                                  </span>
                                </div>
                              ))}

                          </div>

                        </div>
                      )}


                    {item.title === "Electricity Bill" && showElectricity && (
                      <div className="border-t border-[#EAECF0] px-6 py-6">

                        <h4 className="text-[12px] font-semibold text-[#101828] mb-5 text-left">
                          Missed Electricity
                        </h4>

                        {/* <div className="border-t border-[#EAECF0] pt-4 flex items-center justify-between">

      <div className="flex items-center gap-4">
        <span className="text-[12px] text-[#101828]">
          Ground Floor
        </span>

        <span className="h-6 w-px bg-[#D0D5DD]" />

        <span className="text-[12px] text-[#101828]">
          G1 - bed7
        </span>

        <span className="rounded-xl bg-[#FFF4ED] px-4 py-2 text-[#B54708] text-[12px] font-medium">
          13/06/2026 - 10/07/2026
        </span>
      </div>

      <button className="flex items-center gap-2 text-[#3158F5] font-medium">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3158F5] text-white">
          +
        </span>
        Add
      </button>

    </div> */}
                        {customerEbInfo?.missedEb?.map((eb, index) => (
                          <div
                            key={index}
                            className="border-t border-[#EAECF0] pt-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-[12px] text-[#101828]">
                                {eb.floorName}
                              </span>

                              <span className="h-6 w-px bg-[#D0D5DD]" />

                              <span className="text-[12px] text-[#101828]">
                                {eb.roomName} - {eb.bedName}
                              </span>

                              <span className="rounded-xl bg-[#FFF4ED] px-4 py-2 text-[#B54708] text-[12px] font-medium">
                                {eb.fromDate} - {eb.toDate}
                              </span>
                            </div>

                          </div>
                        ))}

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
                    {/* {item.title === "Refundable Advance" && showAdvance && (
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
)} */}
                    {item.title === "Refundable Advance" && showAdvance && (
                      <div className="border-t border-[#EAECF0]">

                        <div className="grid grid-cols-4 bg-[#F9FAFB] px-8 py-6 text-[11px] text-[#667085] font-medium">
                          <div>ADJUSTED WITH</div>
                          <div>TYPE</div>
                          <div>DATE</div>
                          <div className="text-right">APPLIED AMOUNT</div>
                        </div>

                        {customerAdvance?.RedeemedTo?.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 px-8 py-7 border-t border-[#EAECF0] "
                          >
                            <div className="text-[#3158F5] underline cursor-pointer text-[12px]">
                              {item.invoiceNumber}
                            </div>

                            <div className="text-[12px]">{item.invoiceType}</div>

                            <div className="text-[12px]">{item.redeemedDate}</div>

                            <div className="text-center font-medium text-[12px]">
                              ₹ {item.redeemedAmount}
                            </div>
                          </div>
                        ))}

                      </div>
                    )}
                    {item.title === "Refundable Bookings" && showBooking && (
                      <div className="border-t border-[#EAECF0]">

                        <div className="grid grid-cols-4 bg-[#F9FAFB] px-8 py-6 text-[11px] text-[#667085] font-medium">
                          <div>ADJUSTED WITH</div>
                          <div>TYPE</div>
                          <div>DATE</div>
                          <div className="text-right">APPLIED AMOUNT</div>
                        </div>

                        {customerBooking?.RedeemedTo?.length > 0 ? (
                          customerBooking.RedeemedTo.map((booking, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-4 px-8 py-7 border-t border-[#EAECF0]"
                            >
                              <div className="text-[#3158F5] underline cursor-pointer">
                                {booking.invoiceNumber}
                              </div>

                              <div>{booking.invoiceType}</div>

                              <div>{booking.redeemedDate}</div>

                              <div className="text-right font-medium">
                                ₹ {booking.redeemedAmount}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-10 flex justify-center">
                            <span className="text-[#B54708] text-[14px]">
                              No booking transactions available
                            </span>
                          </div>
                        )}

                      </div>
                    )}
                    {/* {item.title === "Deductions" && showDeduction && (
                      <div className="border-t border-[#EAECF0] px-8 py-8">

                        <div className="flex justify-end mb-6">
                          <button
                            onClick={() =>
                              setDeductionRows([
                                ...deductionRows,
                                { type: "", amount: "", reason: "" }
                              ])
                            }
                            className="flex items-center gap-1.5 bg-[#EEF4FF] px-3 py-2 rounded-lg text-[#3158F5] text-sm font-medium cursor-pointer"
                          >
                            <span className="w-4 h-4 rounded-full bg-[#3158F5] text-white flex items-center justify-center text-xs">
                              +
                            </span>
                            Add
                          </button>
                        </div>
                        {deductionRows.map((row, index) => (
                          <div
                            key={index}
                            className="border-t border-[#EAECF0] pt-6 mb-4"
                          >
                            <div className="relative flex items-start gap-6">

                              {row.type === "Others" ? (
                                <>
                                  <input
                                    type="text"
                                    placeholder="Enter custom reason"
                                    className="w-[400px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                                  />

                                  <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-[320px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                                  />
                                </>
                              ) : (
                                <>
                                  <select
                                    value={row.type}
                                    onChange={(e) => {
                                      const updated = [...deductionRows];
                                      updated[index].type = e.target.value;
                                      setDeductionRows(updated);
                                    }}
                                    className="w-[300px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                                  >
                                    <option value="">Select...</option>
                                    <option value="Due Amount">Due Amount</option>
                                    <option
                                      value="Maintenance"
                                      disabled={deductionRows.some(
                                        (r, i) => r.type === "Maintenance" && i !== index
                                      )}
                                    >
                                      Maintenance
                                    </option>

                                    <option value="Others">
                                      Others
                                    </option>

                                  </select>

                                  <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-[320px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                                  />
                                </>
                              )}

                              <button
                                onClick={() =>
                                  setDeductionRows(
                                    deductionRows.filter((_, i) => i !== index)
                                  )
                                }
                                className="
          absolute
          -top-3
          right-0
          w-7
          h-7
          rounded-full
          bg-[#98A2B3]
          text-white
          flex
          items-center
          justify-center
          text-sm
          hover:bg-[#667085] cursor-pointer
        "
                              >
                                ×
                              </button>

                            </div>
                          </div>
                        ))}

                        <p className="mt-6 text-[#475467] text-[13px] leading-5 text-left">
                          Note: These amount was be withheld from the
                          Non Refundable Deposit amount due to lack of payment.

                        </p>

                      </div>
                    )} */}
                    {/* {item.title === "Deductions" && showDeduction && (
  <div className="border-t border-[#EAECF0] px-8 py-8">

    {customerDeductions?.deductions?.length > 0 ? (
      <>
        {customerDeductions.deductions.map((deduction, index) => (
          <div
            key={index}
            className="border-t border-[#EAECF0] pt-6 mb-4"
          >
            <div className="flex items-start gap-6">

              <input
                type="text"
                value={deduction.type}
                disabled
                className="
                  w-[300px]
                  h-[56px]
                  border
                  border-[#D0D5DD]
                  rounded-xl
                  px-4
                  text-[14px]
                  bg-[#F9FAFB]
                  text-[#667085]
                  cursor-not-allowed
                "
              />

              <input
                type="text"
                value={deduction.amount}
                disabled
                className="
                  w-[320px]
                  h-[56px]
                  border
                  border-[#D0D5DD]
                  rounded-xl
                  px-4
                  text-[14px]
                  bg-[#F9FAFB]
                  text-[#667085]
                  cursor-not-allowed
                "
              />

            </div>
          </div>
        ))}
      </>
    ) : (
      <>
        <div className="flex justify-end mb-6">
          <button
            onClick={() =>
              setDeductionRows([
                ...deductionRows,
                { type: "", amount: "", reason: "" }
              ])
            }
            className="flex items-center gap-1.5 bg-[#EEF4FF] px-3 py-2 rounded-lg text-[#3158F5] text-sm font-medium cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-[#3158F5] text-white flex items-center justify-center text-xs">
              +
            </span>
            Add
          </button>
        </div>

        {deductionRows.map((row, index) => (
          <div
            key={index}
            className="border-t border-[#EAECF0] pt-6 mb-4"
          >
            <div className="relative flex items-start gap-6">

              {row.type === "Others" ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter custom reason"
                    className="w-[400px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Enter amount"
                    className="w-[320px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                  />
                </>
              ) : (
                <>
                  <select
                    value={row.type}
                    onChange={(e) => {
                      const updated = [...deductionRows];
                      updated[index].type = e.target.value;
                      setDeductionRows(updated);
                    }}
                    className="w-[300px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Due Amount">Due Amount</option>

                    <option
                      value="Maintenance"
                      disabled={deductionRows.some(
                        (r, i) =>
                          r.type === "Maintenance" &&
                          i !== index
                      )}
                    >
                      Maintenance
                    </option>

                    <option value="Others">
                      Others
                    </option>
                  </select>

                  <input
                    type="text"
                    placeholder="Enter amount"
                    className="w-[320px] h-[56px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                  />
                </>
              )}

              <button
                onClick={() =>
                  setDeductionRows(
                    deductionRows.filter(
                      (_, i) => i !== index
                    )
                  )
                }
                className="
                  absolute
                  -top-3
                  right-0
                  w-7
                  h-7
                  rounded-full
                  bg-[#98A2B3]
                  text-white
                  flex
                  items-center
                  justify-center
                  text-sm
                  hover:bg-[#667085]
                  cursor-pointer
                "
              >
                ×
              </button>

            </div>
          </div>
        ))}
      </>
    )}

    <p className="mt-6 text-[#475467] text-[13px] leading-5 text-left">
      Note: These amount was be withheld from the
      Non Refundable Deposit amount due to lack of payment.
    </p>

  </div>
)} */}
{item.title === "Deductions" && showDeduction && (
  <div className="border-t border-[#EAECF0] px-8 py-8">

    {/* Add Button - Always Visible */}
    <div className="flex justify-end mb-6">
      <button
        onClick={() =>
          setDeductionRows([
            ...deductionRows,
            { type: "", amount: "", reason: "" }
          ])
        }
        className="flex items-center gap-1.5 bg-[#EEF4FF] px-3 py-2 rounded-lg text-[#3158F5] text-sm font-medium cursor-pointer"
      >
        <span className="w-4 h-4 rounded-full bg-[#3158F5] text-white flex items-center justify-center text-xs">
          +
        </span>
        Add
      </button>
    </div>

    {/* Existing Deductions from API */}
    {customerDeductions?.deductions?.map((deduction, index) => (
      <div
        key={`existing-${index}`}
        className="border-t border-[#EAECF0] pt-6 mb-4"
      >
        <div className="flex items-start gap-6">

          <input
            type="text"
            value={deduction.type}
            disabled
            className="
              w-[300px]
              h-[40px]
              border
              border-[#D0D5DD]
              rounded-xl
              px-4
              text-[14px]
              bg-[#F9FAFB]
              text-[#667085]
              cursor-not-allowed
            "
          />

          <input
            type="text"
            value={deduction.amount}
            disabled
            className="
              w-[320px]
              h-[40px]
              border
              border-[#D0D5DD]
              rounded-xl
              px-4
              text-[14px]
              bg-[#F9FAFB]
              text-[#667085]
              cursor-not-allowed
            "
          />

        </div>
      </div>
    ))}

    {/* New Deduction Rows */}
    {deductionRows.map((row, index) => (
      <div
        key={index}
        className="border-t border-[#EAECF0] pt-6 mb-4"
      >
        <div className="relative flex items-start gap-6">

          {row.type === "Others" ? (
            <>
              <input
                type="text"
                placeholder="Enter custom reason"
                className="w-[400px] h-[40px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
              />

              {/* <input
                type="text"
                placeholder="Enter amount"
                className="w-[320px] h-[40px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
              /> */}
              <input
  type="text"
  value={row.amount}
  onChange={(e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    const updated = [...deductionRows];
    updated[index].amount = value;
    setDeductionRows(updated);
  }}
  placeholder="Enter amount"
  className="w-[320px] h-[40px] border border-[#D0D5DD] rounded-xl px-2 text-[14px] outline-none"
/>
            </>
          ) : (
            <>
              <select
                value={row.type}
                onChange={(e) => {
                  const updated = [...deductionRows];
                  updated[index].type = e.target.value;
                  setDeductionRows(updated);
                }}
                className="w-[300px] h-[40px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
              >
                <option value="">Select...</option>

                <option value="Due Amount">
                  Due Amount
                </option>

                <option
                  value="Maintenance"
                  disabled={
                    deductionRows.some(
                      (r, i) =>
                        r.type === "Maintenance" &&
                        i !== index
                    ) ||
                    customerDeductions?.deductions?.some(
                      (d) =>
                        d.type?.toLowerCase() ===
                        "maintenance"
                    )
                  }
                >
                  Maintenance
                </option>

                <option value="Others">
                  Others
                </option>
              </select>

              {/* <input
                type="text"
                placeholder="Enter amount"
                className="w-[320px] h-[40px] border border-[#D0D5DD] rounded-xl px-2 text-[14px] outline-none"
              /> */}
              <input
  type="text"
  value={row.amount}
  onChange={(e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    const updated = [...deductionRows];
    updated[index].amount = value;
    setDeductionRows(updated);
  }}
  placeholder="Enter amount"
  className="w-[320px] h-[40px] border border-[#D0D5DD] rounded-xl px-2 text-[14px] outline-none"
/>
            </>
          )}

          <button
            onClick={() =>
              setDeductionRows(
                deductionRows.filter(
                  (_, i) => i !== index
                )
              )
            }
            className="
              absolute
              -top-3
              right-0
              w-6
              h-6
              rounded-full
              bg-[#98A2B3]
              text-white
              flex
              items-center
              justify-center
              text-sm
              hover:bg-[#667085]
              cursor-pointer
            "
          >
            ×
          </button>

        </div>
      </div>
    ))}

    <p className="mt-6 text-[#475467] text-[13px] leading-5 text-left">
      Note: These amount was be withheld from the
      Non Refundable Deposit amount due to lack of payment.
    </p>

  </div>
)}
                  </div>
                ))}
                {/* <div className="border border-[#EAECF0] rounded-2xl mx-4 mb-4 px-10 py-3 flex justify-between items-center">
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
</div> */}
                {/* <div className="border border-[#EAECF0] rounded-2xl mx-4 mb-4 px-10 py-3 flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-[#101828]">
                    Discount (Current Month)
                  </span>

                  {isEditingDiscount ? (
                    <div className="flex items-center border border-[#D0D5DD] rounded-xl overflow-hidden">
          
                      <input
                        type="text"
                        value={discount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setDiscount(value);
                        }}
                        maxLength={10}
                        className="w-[120px] px-4 py-2 outline-none text-[14px]"
                      />

                      <button
                        onClick={() => setIsEditingDiscount(false)}
                        className="bg-[#E8F5EC] px-5 py-2 text-[14px] font-medium text-[#027A48]"
                      >
                        SET
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center border border-[#D0D5DD] rounded-xl overflow-hidden">
                      <span className="px-4 py-2 text-[14px] font-medium">
                        ₹ {discount}
                      </span>

                      <button
                        onClick={() => setIsEditingDiscount(true)}
                        className="bg-[#EEF4FF] px-4 py-2 text-[14px] font-medium text-[#3158F5]"
                      >
                        ✎ Edit
                      </button>
                    </div>
                  )}
                </div> */}

              </div>

              {/* Footer */}
              <div className="border-t border-[#EAECF0] bg-white px-8 py-6 shrink-0">

                <div className="flex items-center justify-between">

                  {/* <div>
                    <p className="text-[12px] text-[#667085] whitespace-nowrap text-left">
                      Outstanding Amount Payable
                    </p>

                    <h2 className="mt-1 text-[17px] text-left font-bold text-[#16A34A]">
                      ₹ {customerFinalSettlement?.amountToBePaid}
                    </h2>
                  </div> */}
                  <div>
  <p className="text-[12px] text-[#667085] whitespace-nowrap text-left">
    Outstanding Amount Payable
  </p>

  <h2 className="mt-1 text-[17px] text-left font-bold text-[#16A34A]">
    ₹ {finalPayableAmount.toFixed(2)}
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