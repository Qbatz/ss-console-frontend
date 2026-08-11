import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Arrow from "../../assets/arrow-right.png";
import { useHostel } from "../../Context/HostelListContext";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import Edit from "../../assets/editIcon.png";
import Toast from "../SuccessModal/ToastDesign";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowImg from "../../assets/arrow-up.png";
import Verify from "../../assets/tick.png"



const SettlementSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantData = location.state?.tenantData;
  
  const { getTenantSettlement, generateTenantSettlement } = useHostel();
  const { customerId } = useParams();
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [showRent, setShowRent] = useState(false);
  const [showElectricity, setShowElectricity] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showDeduction, setShowDeduction] = useState(false);
  const [showRetainer, setShowRetainer] = useState(false);
  const [showRentSection, setShowRentSection] = useState(false);
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
  const [customerRetainer,setCustomerRetainer] = useState({})
  const [deductionType, setDeductionType] = useState("");
  const [deductionRows, setDeductionRows] = useState([]);
  const [deductionAmount, setDeductionAmount] = useState("");
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [customerDeductions, setCustomerDeductions] = useState({});
  const [customerFinalSettlement, setCustomerFinalSettlement] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [collectFullRent, setCollectFullRent] = useState(false);
  const [stayList, setStayList] = useState({})
  const [fullRentAmount, setFullRentAmount] = useState(0);
  const [isRentSet, setIsRentSet] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showOtherCharges, setShowOtherCharges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);


  
  const sections = [
    { title: "Unpaid Invoices", amount: `₹${unPaidInvoice?.unpaidAmount || 0}` },
    // { title: "Refundable Rent", amount: `₹${customerRentInfo?.currentPayableRent || 0}` },
    {
      title:
        Number(customerRentInfo?.currentMonthPendingAmount || 0) >= 0
          ? "Payable Rent"
          : "Refundable Rent",

      amount: `₹${Number(
        customerRentInfo?.currentMonthPendingAmount || 0
      ).toFixed(2)}`
    },
    { title: "Electricity Bill", amount: `₹${customerEbInfo?.pendingEbAmount || 0}` },
    { title: "Wallet", amount: `₹${customerWallet?.walletAmount || 0}` },
    { title: "Refundable Advance", amount: `₹${customerAdvance?.availableBalance || 0}` },
    { title: "Refundable Bookings", amount: `₹${customerBooking?.availableBalance || 0}` },
     { title: "Retainer Invoice", amount: `₹${customerRetainer?.totalBalanceAmount || 0}` },
    { title: "Deductions", amount: `₹${customerDeductions?.pendingAmount || 0}` },
  ];

  useEffect(() => {
    setFullRentAmount(customerRentInfo?.fullRent || 0);
  }, [customerRentInfo]);
  const additionalDeductionAmount = deductionRows.reduce(
    (total, row) => total + Number(row.amount || 0),
    0
  );

  // const totalRent =
  // Number(customerRentInfo?.currentPayableRent || 0) -
  // Number(customerRentInfo?.currentRentPaid || 0);

  const payableRentAmount =
    collectFullRent && isRentSet
      ? Number(fullRentAmount || 0)
      : Number(customerRentInfo?.currentPayableRent || 0);

  const totalRent =
    payableRentAmount -
    Number(customerRentInfo?.currentRentPaid || 0);

  const totalDeductions =
    Number(customerDeductions?.pendingAmount || 0) +
    Number(additionalDeductionAmount || 0);

  // const outstandingAmount =
  // totalRent -
  // Number(customerFinalSettlement?.discountAmount || 0) +
  // Number(customerFinalSettlement?.ebAmount || 0) +
  // Number(unPaidInvoice?.unpaidAmount || 0) +
  // Number(customerRentInfo?.otherItemAmount || 0) +
  // totalDeductions +
  // Math.abs(Number(customerFinalSettlement?.walletAmount || 0)) -
  // Number(customerFinalSettlement?.refundableAdvance || 0);
  const outstandingAmount =
    totalRent -
    Number(customerFinalSettlement?.discountAmount || 0) +
    Number(customerFinalSettlement?.ebAmount || 0) +
    Number(unPaidInvoice?.unpaidAmount || 0) +
    Number(customerRentInfo?.otherItemAmount || 0) +
    totalDeductions +
    Number(customerFinalSettlement?.walletAmount || 0) -
    Number(customerFinalSettlement?.refundableAdvance || 0)-
    Number(customerRetainer?.totalBalanceAmount || 0);
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
        setCustomerRetainer(res?.data?.customerRetainerInfo)
        setCustomerDeductions(res?.data?.customerDeductionsInfo);
        setCustomerFinalSettlement(res?.data?.customerFinalSettlementInfo)
        setStayList(res?.data?.customerStayInfo)

      }
      else {
        setModalType("error");
        setMessage(res?.message);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);


        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching settlement data:", error);
    } finally {
      setLoadingData(false);
    }
  };


  const finalPayableAmount =
    Number(customerFinalSettlement?.amountToBePaid || 0) +
    additionalDeductionAmount;
  useEffect(() => {
    if (customerId) {

      handleSettlement(checkoutDate.format("DD-MM-YYYY"));
    }
  }, [customerId]);
  const handleGenerateSettlement = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const payload = {
        leavingDate: checkoutDate.format("DD-MM-YYYY"),
        isCustomRent: collectFullRent,
        customRentAmount: collectFullRent
          ? Number(fullRentAmount || 0)
          : 0,
        newDeductions: deductionRows.map((row) => ({
          type: row.type,
          amount: Number(row.amount || 0),
        })),
      };

      const res = await generateTenantSettlement(customerId, payload);

      if (res.success) {
        setModalType("success");
        setMessage("Settlement generated successfully");
        setShowSuccess(true);

        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        setModalType("error");
        setMessage(res.message);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          setIsGenerating(false);
        }, 2000);
      }
    } catch (error) {
      setIsGenerating(false);
    }
  };
  return (

    <DashboardLayout>
      {loadingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-[#E4E7EC] border-t-[#3158F5] rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <Toast
            show={showSuccess}
            message={message}
            type={modalType}

          />
          <div className="h-screen bg-[#F8FAFC] flex flex-col">


            <div className="px-8 pt-2 shrink-0">
              <div className="flex items-center gap-3">


                <img src={ArrowImg} className="w-4 h-4 cursor-pointer" onClick={() => navigate(-1)} />


                <div>
                  <h1 className="block text-[17px] font-semibold text-[#222222] text-left">
                    Final Settlement
                  </h1>

                  <p className="mt-1 text-[16px] text-[#667085] text-left">
                    Tenants / Final Settlement
                  </p>
                </div>

              </div>
            </div>


            <div className="flex-1 px-8 py-4 overflow-hidden">

              <div className="flex gap-6 h-full">


                <div className="w-[350px] shrink-0">
                  <div className="h-full rounded-3xl border border-[#EAECF0] bg-white px-8 py-4 overflow-y-auto">


                    <div className="flex items-start gap-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4E7EC] text-[12px] font-semibold">
                        {custometInfoList?.initials}
                      </div>

                      <div>

                        {/* <div className="flex items-center gap-2 text-left">
  <h2
    className="w-[180px] text-[18px] font-semibold truncate"
    title={custometInfoList?.fullName || "N/A"}
  >
    {custometInfoList?.fullName || "N/A"}
  </h2>

  <img
    src={Verify}
    alt="Verified"
    className="w-4 h-4 flex-shrink-0"
  />
</div> */}
                        {/* <div className="inline-flex items-center gap-2 text-left">
  <h2
    className="max-w-[180px] text-[18px] font-semibold truncate"
    title={custometInfoList?.fullName || "N/A"}
  >
    {custometInfoList?.fullName || "N/A"}
  </h2>

  <img
    src={Verify}
    alt="Verified"
    className="w-4 h-4 flex-shrink-0"
  />
</div> */}
                        <div className="flex items-center justify-start gap-2 w-full text-left">
                          <h2
                            className="max-w-[180px] text-[18px] font-semibold truncate"
                            title={custometInfoList?.fullName || "N/A"}
                          >
                            {custometInfoList?.fullName || "N/A"}
                          </h2>

                          <img
                            src={Verify}
                            alt="Verified"
                            className="w-4 h-4 flex-shrink-0"
                          />
                        </div>

                        <p className="mt-1 text-[14px] text-[#475467] text-left">
                          Mobile : +91 {custometInfoList?.mobile}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex gap-2">
                      <span className="rounded-full bg-[#FFF3D6] px-2 py-1 text-[12px] font-inter font-medium">
                        {custometInfoList?.floorName}
                      </span>

                      <span className="rounded-full bg-[#FDE7EC] px-2 py-1 text-[12px] font-inter font-medium">
                        {custometInfoList?.roomName}-{custometInfoList?.bedName}
                      </span>
                    </div>

                    <div className="mt-3 space-y-4">

                      <div className="flex justify-between text-[14px] ">
                        <span className="font-inter font-normal">Joined Date</span>
                        <span className="font-semibold">{custometInfoList?.joiningDate}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span>NoticeDate</span>
                        <span className="font-semibold">{stayList?.noticeDate}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span>Req Checkout Date</span>
                        <span className="font-semibold">{stayList?.requestedLeavingDate}</span>
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
                        <span className="font-semibold">₹{customerRentInfo?.currentMonthRent || 0}</span>
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
                              <img src={Edit} className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          // <DatePicker
                          //   value={checkoutDate}
                          //   format="DD-MM-YYYY"
                          //   allowClear={false}
                          //   onChange={(value) => {
                          //     if (value) {
                          //       setCheckoutDate(value);
                          //       // Formatted API custom format conversion parameter triggers standard validation flow
                          //       handleSettlement(value.format("DD-MM-YYYY"));
                          //       setEditDate(false);
                          //     }
                          //   }}
                          // />
                          <DatePicker
                            value={checkoutDate}
                            format="DD-MM-YYYY"
                            allowClear={false}
                            disabledDate={(current) => {
                              return (
                                current &&
                                (
                                  current.isAfter(dayjs(), "day") ||
                                  current.isBefore(dayjs(stayList?.noticeDate, "DD/MM/YYYY"), "day")
                                )
                              );
                            }}
                            onChange={(value) => {
                              if (value) {
                                setCheckoutDate(value);
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
                      className={`mt-2 rounded-xl py-2 text-center text-[14px] ${outstandingAmount >= 0
                        ? "bg-[#FFF1F3] text-red-500"
                        : "bg-[#ECFDF3] text-[#027A48]"
                        }`}
                    >
                      {outstandingAmount >= 0 ? "Pending" : "Refund"}
                    </div>

                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 bg-white rounded border border-[#EAECF0] flex flex-col overflow-hidden">


                  <div className="flex-1 overflow-y-auto p-4   [&::-webkit-scrollbar]:w-[10px]

    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-track]:rounded-full

    [&::-webkit-scrollbar-thumb]:bg-[#bfd3ff]
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:border-[3px]
    [&::-webkit-scrollbar-thumb]:border-transparent
    [&::-webkit-scrollbar-thumb]:bg-clip-content

    [&::-webkit-scrollbar-thumb:hover]:bg-[#9dbdff]

    [scrollbar-width:thin]
    [scrollbar-color:#bfd3ff_transparent]">

                    {sections.map((item) => (
                      <div
                        key={item.title}
                        className="mb-4 overflow-hidden  rounded-2xl border border-[#EAECF0] bg-white"
                      >
                        <div
                          className="flex items-center justify-between px-3 py-3 cursor-pointer "

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

                             if (item.title === "Retainer Invoice") {
                              setShowRetainer(!showRetainer);
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
                                  ? "rotate-[270deg]"
                                  : "rotate-90"
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
                                            : item.title === "Retainer Invoice"
                                          ? showRetainer
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
                            {(item.title === "Payable Rent" ||
                              item.title === "Refundable Rent") &&
                              collectFullRent ? (

                              isRentSet ? (
                                <div className="flex items-center gap-3">
                                  <span className="text-[18px] font-semibold text-[#101828]">
                                    ₹{fullRentAmount}
                                  </span>

                                  <img
                                    src={Edit}
                                    alt="edit"
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={() => setIsRentSet(false)}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center border border-[#D0D5DD] rounded-xl overflow-hidden">

                                  <input
                                    type="text"
                                    value={fullRentAmount}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, "");
                                      setFullRentAmount(value);
                                    }}
                                    className="w-[120px] px-4 py-2 outline-none text-[14px]"
                                  />

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsRentSet(true);
                                    }}
                                    className="bg-[#EEF4FF] px-4 py-2 text-[14px] font-medium text-[#3158F5]"
                                  >
                                    ✓ Set
                                  </button>
                                </div>
                              )

                            ) : (
                              <span className="text-[14px] font-semibold text-[#101828]">
                                {item.amount}
                              </span>
                            )}
                          </span>
                        </div>


                        {item.title === "Unpaid Invoices" && showUnpaid && (
                          <div className="px-4 pb-4">
                            <div className="overflow-hidden rounded border border-[#EAECF0] text-left">

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
                              <div className="px-3 py-3 flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={collectFullRent}
                                  onChange={(e) => setCollectFullRent(e.target.checked)}
                                  className="w-3 h-3 rounded accent-[#3158F5] cursor-pointer"
                                />

                                <span className="text-[14px] text-[#344054]">
                                  Do you want to collect Full Rent for current month?
                                </span>
                              </div>

                              <div className="border-t border-[#EAECF0] px-3 py-3">

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
                                      className="w-9 h-9 rounded-lg  flex items-center justify-center"
                                    >
                                      <img
                                        src={Arrow}
                                        className={`w-4 h-4 transition-transform ${item.title === "Unpaid Invoices"
                                          ? showUnpaid
                                            ? "rotate-[270deg]"
                                            : "rotate-90"
                                          : item.title === "Refundable Rent" ||
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
                                {customerRentInfo?.otherItems?.length > 0 && (
                                  <>
                                    <div className="flex justify-between items-center mt-5">
                                      <div className="flex items-center gap-3">
                                        <span className="text-[14px] text-[#101828]">
                                          Other Charges
                                        </span>

                                        <button
                                          onClick={() => setShowOtherCharges(!showOtherCharges)}
                                          className="w-9 h-9 rounded-lg  flex items-center justify-center cursor-pointer"
                                        >
                                          <img
                                            src={Arrow}
                                            className={`w-4 h-4 transition-transform ${showOtherCharges ? "rotate-[270deg]" : "rotate-90"
                                              }`}
                                          />
                                        </button>
                                      </div>

                                      <span className="text-[16px] font-medium">
                                        ₹
                                        {customerRentInfo?.otherItemAmount}
                                      </span>
                                    </div>

                                    {showOtherCharges && (
                                      <div className="mt-4 rounded-2xl bg-[#F9FAFB]">
                                        {customerRentInfo.otherItems.map((charge, index) => (
                                          <div
                                            key={index}
                                            className="flex justify-between items-center px-5 py-4"
                                          >
                                            <span className="text-[#3158F5] text-[13px]">
                                              {charge.item}
                                            </span>

                                            <span className="text-[15px] text-[#344054]">
                                              ₹{charge.amount}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                            </div>
                          )}


                        {item.title === "Electricity Bill" && showElectricity && (
                          <div className="border-t border-[#EAECF0] px-6 py-6">

                            <h4 className="text-[12px] font-semibold text-[#101828] mb-5 text-left">
                              Missed Electricity
                            </h4>


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
                            {customerEbInfo?.pendingEb?.length > 0 && (
                              <>
                                <h4 className="text-[14px] font-semibold text-[#101828] mt-6 mb-4 text-left">
                                  Pending Invoices
                                </h4>

                                {customerEbInfo.pendingEb.map((eb, index) => (
                                  <div
                                    key={index}
                                    className="border-t border-[#EAECF0] py-4 flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-4">

                                      <span className="text-[14px] text-[#101828]">
                                        {eb.floorName || "N/A"}
                                      </span>

                                      <span className="h-5 w-px bg-[#D0D5DD]" />

                                      <span className="text-[14px] text-[#101828]">
                                        {eb.roomName || "N/A"}
                                      </span>

                                      <span className="rounded-xl bg-[#EEF4FF] px-4 py-2 text-[#3158F5] text-[13px] font-medium">
                                        {eb.fromDate} - {eb.toDate}
                                      </span>

                                    </div>

                                    <div className="text-right">
                                      <span className="text-[15px] font-medium text-[#101828]">
                                        ({eb.units} Units) ₹{eb.amount}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}

                          </div>
                        )}

                        {item.title === "Wallet" && showWallet && (
                          <div className="border-t border-[#EAECF0]">

                            {customerWallet?.walletHistory?.length > 0 ? (
                              <>
                                <div className="grid grid-cols-3 bg-[#F9FAFB] px-8 py-5 text-[11px] text-[#667085] font-medium text-left">
                                  <div>SOURCE</div>
                                  <div>TYPE</div>
                                  <div className="text-right">AMOUNT</div>
                                </div>

                                {customerWallet.walletHistory.map((wallet, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-3 px-8 py-5 border-t border-[#EAECF0] text-left"
                                  >
                                    <div className="text-[13px] text-[#101828]">
                                      {wallet.source || "-"}
                                    </div>

                                    <div className="text-[13px] text-[#667085]">
                                      {wallet.defaultSourceType || "-"}
                                    </div>

                                    <div
                                      className={`text-right text-[13px] font-medium ${Number(wallet.amount) < 0
                                        ? "text-red-500"
                                        : "text-green-600"
                                        }`}
                                    >
                                      ₹ {wallet.amount}
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="px-6 py-8 flex justify-center">
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

                          </div>
                        )}

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

 {item.title === "Retainer Invoice" && showRetainer && (
<>
<div className="grid grid-cols-4 bg-[#F9FAFB] px-8 py-5 text-[11px] text-[#667085] font-medium">
  <div className="text-left">INVOICE NUMBER</div>
  <div className="text-left">INVOICE AMOUNT</div>
  <div className="text-left">DATE</div>
  <div className="text-left">AVAILABLE AMOUNT</div>
</div>

{/* Only Rows Scroll */}
<div className="max-h-[300px] overflow-y-auto">
  {customerRetainer?.retainerInfos?.length > 0 ? (
    customerRetainer.retainerInfos.map((booking, index) => (
      <div
        key={index}
        className="grid grid-cols-4 px-8 py-6 border-t border-[#EAECF0] items-center"
      >
        {/* Invoice Number */}
        <div className="text-[#3158F5] underline cursor-pointer text-[12px] text-left">
          {booking.invoiceNumber}
        </div>

        {/* Invoice Amount */}
        <div className="text-[12px] text-left">
          ₹ {booking.invoiceAmount}
        </div>

        {/* Date */}
        <div className="text-[12px] text-gray-500 text-left">
          {booking.invoiceDate}
        </div>

        {/* Available Amount */}
        <div className="text-[12px] font-medium text-left">
          ₹ {booking.balanceAmount}
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
</>
)}
                        {item.title === "Deductions" && showDeduction && (
                          <div className="border-t border-[#EAECF0] px-8 py-6">


                            <div className="flex justify-end mb-6">
                              <button
                                onClick={() =>
                                  setDeductionRows([
                                    ...deductionRows,
                                    { type: "", amount: "", reason: "" }
                                  ])
                                }
                                className="flex items-center gap-1 bg-[#EEF4FF] px-3 py-2 rounded-lg text-[#3158F5] text-sm font-medium cursor-pointer"
                              >
                                <span className="w-4 h-4 rounded-full bg-[#3158F5] text-white flex items-center justify-center text-xs">
                                  +
                                </span>
                                Add
                              </button>
                            </div>


                            {customerDeductions?.deductions?.map((deduction, index) => (
                              <div
                                key={`existing-${index}`}
                                className=" pt-6 mb-4"
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


                            {deductionRows.map((row, index) => (
                              <div
                                key={index}
                                className="pt-6 mb-4"
                              >
                                <div className="relative flex items-start gap-6">

                                  {row.type === "Others" ? (
                                    <>
                                      <input
                                        type="text"
                                        placeholder="Enter custom reason"
                                        className="w-[400px] h-[40px] border border-[#D0D5DD] rounded-xl px-4 text-[14px] outline-none"
                                      />


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

                    <div className="mb-4 overflow-hidden rounded-xl border border-[#EAECF0] bg-white">
                      <div className="flex justify-between items-center px-3 py-3">
                        <span className="text-sm font-semibold text-[#101828]">
                          Discount (Current Month)
                        </span>

                        <span className="text-[14px] font-semibold text-[#101828]">
                          ₹ {customerRentInfo?.discountAmount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[14px] text-[#667085]">
                        Outstanding Amount Payable
                      </p>

                      <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="flex items-center gap-2 text-[#3158F5] text-[12px] cursor-pointer"
                      >
                        View Breakdown

                        <img
                          src={Arrow}
                          alt=""
                          className={`w-4 h-4 transition-transform ${showBreakdown ? "rotate-[270deg]" : "rotate-90"
                            }`}
                        />
                      </button>
                    </div>
                    {showBreakdown && (
                      <div className="mt-1 rounded-2xl  p-6">
                        <h3 className="text-[18px] font-semibold text-[#101828] mb-6 text-left">
                          Final Settlement
                        </h3>

                        <div className="space-y-3">

                          <div className="flex justify-between">
                            <span className="font-inter font-normal">
                              {Number(customerRentInfo?.currentPayableRent || 0) >= 0
                                ? "Payable Rent"
                                : "Refundable Rent"}
                            </span>

                            <span className="font-medium font-inter">
                              ₹{payableRentAmount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-5">
                            <span className="text-[16px] text-[#101828]">
                              Last Rent Paid
                            </span>

                            <span className="text-[16px] font-medium">
                              ₹{customerRentInfo?.currentRentPaid}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-5">
                            <span className="text-[16px] text-[#101828]">
                              Total Rent (
                              ₹{payableRentAmount.toFixed(2)}
                              -
                              ₹{Number(customerRentInfo?.currentRentPaid || 0).toFixed(2)}
                              )
                            </span>

                            <span className="text-[16px] font-medium">
                              ₹{(
                                payableRentAmount -
                                Number(customerRentInfo?.currentRentPaid || 0)
                              ).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className=" font-inter font-normal">
                              Discount
                            </span>

                            <span className="font-medium font-inter">
                              ₹{customerFinalSettlement?.discountAmount || 0}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className=" font-inter font-normal">
                              Refundable Advance
                            </span>

                            <span className="font-medium font-inter">
                              ₹{customerFinalSettlement?.refundableAdvance || 0}
                            </span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className=" font-inter font-normal">
                              Refundable Booking
                            </span>

                            <span className="font-medium font-inter">
                              ₹{customerBooking?.availableBalance || 0}
                            </span>
                          </div> */}
                          <div className="flex justify-between">
                            <span className=" font-inter font-normal">
                              Wallet
                            </span>

                            <span className="font-medium font-inter">
                              ₹{customerFinalSettlement?.walletAmount || 0}
                            </span>
                          </div>

                          {/* <div className="flex justify-between">
                            <span className="font-normal font-inter">
                              Total Deductions
                            </span>

                            <span className="text-red-500 font-medium font-inter">
                              ₹{customerDeductions?.pendingAmount || 0}
                            </span>
                          </div> */}
                          <div className="flex justify-between">
                            <span className="font-normal font-inter">
                              Total Deductions
                            </span>

                            <span className="font-medium font-inter">
                              ₹
                              {(
                                Number(customerFinalSettlement?.totalDeductions || 0) +
                                Number(additionalDeductionAmount || 0)
                              ).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="font-normal font-inter">
                              Electricity
                            </span>

                            <span className="font-medium font-inter">
                              ₹{customerFinalSettlement?.ebAmount || 0}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="font-normal font-inter">
                              Unpaid Invoices
                            </span>

                            <span className="font-medium font-inter">
                              ₹{unPaidInvoice?.unpaidAmount || 0}
                            </span>
                          </div>

 <div className="flex justify-between">
                            <span className="font-normal font-inter">
                              Retainer Invoices
                            </span>

                            <span className="font-medium font-inter">
                              ₹{customerRetainer?.totalBalanceAmount || 0}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="font-normal font-inter">
                              Other Charges
                            </span>

                            <span className=" font-medium font-inter">
                              ₹ {customerRentInfo?.otherItemAmount || 0}
                            </span>
                          </div>
                          {/* <div className="mt-4 border border-[#EAECF0] rounded-xl px-6 py-4">
                            <input
                              type="text"
                                value={outstandingAmount.toFixed(2)}
                              readOnly
                              className="
      w-full
      outline-none
      bg-transparent
      text-[15px]
      font-bold
      text-[#16A34A]
    "
                            />
                          </div> */}
                          {/* <div className="mt-4 border border-[#EAECF0] rounded-xl px-6 py-4">
                            <input
                              type="text"
                              value={`₹ ${outstandingAmount.toFixed(2)}`}
                              readOnly
                              className={`
      w-full
      outline-none
      bg-transparent
      text-[15px]
      font-bold
      ${outstandingAmount < 0
                                  ? "text-[#DC2626]"
                                  : "text-[#16A34A]"
                                }
    `}
                            />
                          </div> */}
                        </div>
                      </div>
                    )}



                  </div>


                  <div className="border-t border-[#EAECF0] bg-white px-8 py-6 shrink-0">

                    <div className="flex items-center justify-between">


                      <div>
                        <p className="text-[11px] text-[#667085] whitespace-nowrap text-center">
                          Outstanding Amount Payable
                        </p>

                        {/* <h2 className="mt-1 text-[17px] text-left font-bold text-[#16A34A]">
                          ₹ {outstandingAmount.toFixed(2)}
                        </h2> */}
                        <h2
                          className={`mt-1 text-[17px] text-left font-bold ${outstandingAmount < 0
                            ? "text-[#DC2626]"
                            : "text-[#16A34A]"
                            }`}
                        >
                          ₹ {Math.round(outstandingAmount)}
                        </h2>
                      </div>

                      <div className="flex gap-4">

                        <button className="h-[40px] px-8 rounded-xl border border-[#D0D5DD] bg-white text-[13px]" onClick={() => navigate(-1)}>
                          Cancel
                        </button>

                        <button
                          className="h-[40px] px-5 rounded-xl bg-[#3158F5] text-white text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleGenerateSettlement}
                          disabled={isGenerating}
                        >
                          {isGenerating ? "Generating..." : "Generate"}
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SettlementSummary;