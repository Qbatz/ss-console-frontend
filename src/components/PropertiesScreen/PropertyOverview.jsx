import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import OverviewSubscriptions from "./OverviewSubscription";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Mobile from "../../assets/mobile.png";
import locationImg from "../../assets/location.png";
import Arrow from "../../assets/maximize.png";
import Crown from "../../assets/crown.png";
import refresh from "../../assets/refresh.png";
import arrowleft from "../../assets/arrow-up.png";
import ViewImg from "../../assets/View.png";
import ProductSupport from "./ProductSupport";
import StaffScreen from "./StaffScreen";
import InvoicesScreen from "./InvoicesScreen";
import PropertyActive from "./ActiveScreen";
import swap from "../../assets/arrowswap.png";
import Star from "../../assets/star.png"
import PropertyAmenities from "./PropertyAmenities";
import { useHostel } from "../../Context/HostelListContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";
import ReccuringBill from "./ReccuringBill";
import { useOwners } from "../../Context/OwnersContext";
import { useRole } from "../../Context/RoleContext";
import { usePlan } from "../../Context/PlanContexts";
import { useSubscription } from "../../Context/SubscriptionContext";
const PropertyOverview = () => {
  const { hostels, getHostels, loading, getHostelById, hardResetHostel, errorMsg, accessError } = useHostel();
  const { owners, totalItems, totalPages, getOwners, getOwnerById } = useOwners();
  const { adminDetails, agentRoles, getAgentRoles, getAgentRoleById, deleteAgentRole, } = useRole();
  const { createSubscription } = useSubscription();
  const [hostelData, setHostelData] = useState(null);
  const [dropdownPlans, setDropdownPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedExpandablePlan, setSelectedExpandablePlan] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [paidByError, setPaidByError] = useState("");
  const [paidAmountError, setPaidAmountError] = useState("");
  const [showTrialPlanDropdown, setShowTrialPlanDropdown] = useState(false);
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Tenants");

  const { canWrite: canResetWrite } = usePermission("Reset hostel");
  const { plans, getPlans, getPlansDropdown } = usePlan();
  console.log("paidBy", paidBy)
  useEffect(() => {
    getPlansDropdown().then((res) => {
      if (res?.success) {
        setDropdownPlans(res.data);
      }
    });
  }, []);
  const paidByUsers = [
    {
      id: hostelData?.ownerInfo?.ownerId,
      name: hostelData?.ownerInfo?.fullName,
      role: "Owner"
    },

    ...(hostelData?.masters || []).map(m => ({
      id: m.userId,
      name: m.fullName,
      role: "Master"
    })),

    ...(hostelData?.staffs || []).map(s => ({
      id: s.userId,
      name: s.fullName,
      role: "Staff"
    }))
  ];
  const trialPlans = dropdownPlans?.trialPlans || [];
  console.log("dropdownPlans", dropdownPlans)
  useEffect(() => {
    getPlans()
  }, [])
  const [activeTab, setActiveTab] = useState("tenants");
  const [showSharing, setShowSharing] = useState(false);
  const [showBillingRule, setShowBillingRule] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [hostelerror, setHostelError] = useState("")
  const [noteText, setNoteText] = useState("");
  const [days, setDays] = useState("");
  const [daysError, setDaysError] = useState("")
  const [planCode, setPlanCode] = useState("");
  console.log("planCode", planCode)
  const [paidAmount, setPaidAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [menuError, setMenuError] = useState("")
  const [planError, setPlanError] = useState("")
  const [proofError, setProofError] = useState("")
  const [showTrialConfirm, setShowTrialConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState("");
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showPaidByDropdown, setShowPaidByDropdown] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const loginType = localStorage.getItem("login_type");
  const showInvoices = loginType === "normal";
  const { hostelId } = useParams();

  // const hostelData = location.state?.hostelData;
  useEffect(() => {
    const fetchData = async () => {
      if (!hostelId) return;

      const res = await getHostelById(hostelId);

      if (res?.success) {
        setHostelData(res.data);
      }
    };

    fetchData();
  }, [hostelId]);
  const trialPlan = location.state?.trialPlan;
  console.log("trialPlan", trialPlan)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHardReset = async () => {

    if (!hostelData.hostelId) return;

    const enteredId = noteText.trim();

    if (!enteredId) {
      setHostelError("Please Enter Hostel ID");
      return;
    }

    const res = await hardResetHostel(
      hostelData.hostelId,
      enteredId
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res?.message);


      setShowNoteModal(false);
      setShowSuccess(true);
      setNoteText("");
      setHostelError("");

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

    } else {
      setHostelError(res?.message || "Please Enter Valid Hostel ID");
    }
  };
  const plan = hostelData?.currentSubscription?.planName;
  console.log("recurringStatus", hostelData?.recurringStatus);

  const handleOwnerClick = async (item) => {

    const res = await getOwnerById(item.ownerInfo.ownerId);

    if (res?.success) {

      navigate(`/ProprietorsOverview/${item.ownerInfo.ownerId}`, {
        state: { ownerData: res.data }
      });

    }

  };



  const handleTrialOnly = async () => {

    // if (!selectedPlanCode) {
    //   alert("Please select a plan");
    //   return;
    // }
    let hasError = false;

    if (!selectedPlanCode) {
      setPlanError("Please Select Plancode");
      hasError = true;
    }



    if (hasError) return;
    const payload = {
      trialDays: 0,
      paidAmount: Number(paidAmount || 0),
      discountAmount: Number(discountAmount || 0),
      planCode: selectedPlanCode
    };

    const res = await createSubscription(
      trialPlan?.hostelId,
      payload
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      await getHostels(1, 10, "");

      setTimeout(() => {
        setShowSuccess(false);
        setShowTrialConfirm(false);
      }, 1000);

    } else {
      setMenuError(res?.message);
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    }
  };
  const handleTrialWithDays = async () => {
    let hasError = false;
    if (!selectedExpandablePlan) {
      setPlanError("Please select a plan");
      hasError = true;
    }

    if (!days) {
      setDaysError("Please Enter Days");
      hasError = true;
    }
    if (hasError) return;

    const payload = {
      trialDays: Number(days),
      paidAmount: Number(paidAmount || 0),
      discountAmount: Number(discountAmount || 0),
      planCode: selectedExpandablePlan   // 🔥 FIX
    };

    const res = await createSubscription(
      trialPlan?.hostelId,
      payload
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      await getHostels(1, 10, "");

      setTimeout(() => {
        setShowSuccess(false);
        setShowTrialModal(false);
      }, 1000);

    } else {
      setDaysError(res?.message);
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);

      }, 1000);
    }
  };


  const resetPlanForm = () => {
    setPlanCode("");
    setPaidAmount("");
    setDiscountAmount("");
    setPaymentProof(null);
    setProofError("")
    setPlanError("")
    setPaidBy("")
    setPaidByError("")
    setPaidAmountError("")

  };
  const selectedPlanothers = dropdownPlans?.otherPlans?.find(
    (p) => p.planCode === planCode
  );
  const handleSubscription = async () => {

    let hasError = false;

    if (!planCode) {
      setPlanError("Please Select Plancode");
      hasError = true;
    }

    if (!paymentProof) {
      setProofError("Please upload proof");
      hasError = true;
    }
    if (!paidAmount) {
      setPaidAmountError("Please enter paid amount");
      hasError = true;
    }
    if (!paidBy) {
      setPaidByError("Please select Paid By");
      hasError = true;
    }

    if (hasError) return;

    const payload = {

      trialDays: 0,
      planCode: planCode,
      paidAmount: Number(paidAmount),
      discountAmount: Number(discountAmount || 0),
      paidBy
    };
    console.log("payload", payload)
    const res = await createSubscription(
      trialPlan?.hostelId,
      payload,
      paymentProof
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      await getHostels(1, 10, "");

      setTimeout(() => {
        setShowSuccess(false);
        setShowPlanModal(false)
        resetPlanForm()

      }, 1000);

    } else {
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    }
  };


  if (!hostelData) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="pl-2 pr-2 min-h-screen">


        <div className="flex items-center ">

          <img src={arrowleft} height={20} width={20} className="text-xl cursor-pointer"

            onClick={() => navigate(`/properties/${adminDetails?.roleId}`, {
              state: { skipApi: true }
            })}
          />
          <p className="text-[20px] leading-[48px] font-medium text-[#1F2937] font-sans ml-2">
            Property Overview
          </p>
        </div>


        <div className="bg-[#F6F8FC] border border-[#E6E8F0] rounded-xl p-5">

          {/* Top Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
                {hostelData.initials}
              </div>

              <div>
                <h2 className="text-[24px] font-semibold text-gray-900 text-left font-sans" >
                  {hostelData.hostelName}
                </h2>

                <p className="text-sm text-gray-500 flex items-center gap-1">
                  {hostelData.hostelId} |
                  <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleOwnerClick(hostelData)}>
                    {hostelData.ownerInfo?.fullName}
                  </span>

                  <img src={Arrow} className="w-3 h-3 ml-1" />
                </p>
              </div>
              <div className="flex gap-5 mt-4">

                {/* 1️⃣ Trial Extend */}
                {/* <button
                disabled={trialPlan?.trialExtendable === false}
                 onClick={() => setShowTrialConfirm(true)}
                  className="bg-green-600 text-white px-2 py-[2px] font-medium rounded text-[10px] whitespace-nowrap cursor-pointer"
                >
                  Trial Extend
                </button> */}
                <button
                  disabled={trialPlan?.canAddTrial === false}
                  onClick={() => setShowTrialConfirm(true)}
                  className={`px-2 py-[2px] font-medium rounded text-[10px] whitespace-nowrap
    ${trialPlan?.canAddTrial === false
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white cursor-pointer hover:bg-green-700"
                    }
  `}
                  title={
                    trialPlan?.canAddTrial === false
                      ? "Trial cannot be extended"
                      : ""
                  }
                >
                  Trial Extend
                </button>

                {/* 2️⃣ Trial + Days */}
                {/* <button
                 disabled={trialPlan?.trialExtendable === false}
                  onClick={() => setShowTrialModal(true)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-[10px] whitespace-nowrap cursor-pointer"
                >
                  Trial + Days
                </button> */}
                <button
                  disabled={trialPlan?.canAddExpandableTrial === false}
                  onClick={() => setShowTrialModal(true)}
                  className={`px-3 py-1 rounded text-[10px] whitespace-nowrap
    ${trialPlan?.canAddExpandableTrial === false
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-500 text-white cursor-pointer hover:bg-yellow-600"
                    }
  `}
                >
                  Trial + Days
                </button>

                {/* 3️⃣ Subscription */}
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] whitespace-nowrap cursor-pointer"
                >
                  Buy Plan
                </button>
                {/* <button
                  onClick={() => setShowPlanModal(true)}
                  disabled={trialPlan?.trialExtendable === true}
                  className={`px-3 py-1 rounded text-[10px] whitespace-nowrap
    ${trialPlan?.trialExtendable === true
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white cursor-pointer"}
  `}
                >
                  Buy Plan
                </button> */}

              </div>
            </div>


            {/* Right */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <img src={refresh} className="w-8 h-8" />
              <span>
                {hostelData.createdAtDate}
              </span>

              {/* Menu */}
              <img src={ViewImg} width={18} height={18} />
              <div className="text-gray-400 cursor-pointer text-xl">⋮</div>
            </div>

          </div>


          {/* Bottom Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">

            {/* Mobile */}
            <div className="flex items-start gap-3">


              <div>
                <p className="  text-[#1D1D1D] text-left font-sans font-medium text-sm">Mob No</p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={Mobile} className="w-4 h-4" />
                  <p className="text-sm font-medium font-sans">
                    +91 {hostelData.mobile}
                  </p>
                </div>
              </div>
            </div>


            {/* Location */}
            <div className="flex items-start gap-3">


              <div>
                <p className="text-[#1D1D1D] text-left font-sans font-medium text-sm">Region / City</p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={locationImg} className="w-4 h-4" />
                  <p className="text-sm font-medium text-blue-600 flex items-center">
                    {hostelData.city}, {hostelData.state}
                    <img src={Arrow} className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>


            {/* Subscription */}
            <div className="flex items-start gap-3">


              <div>
                <p className="  text-[#1D1D1D] text-left font-sans font-medium text-sm">Subscription Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={(plan === "Basic") ? Star : (plan === "Premium") ? Crown : null}
                    className="w-4 h-4"
                    style={{ display: plan === "basic" || plan === "premium" ? "block" : "none" }}
                  />

                  <p className="text-sm font-medium ">
                    {/* {hostelData.hostelPlan?.currentPlan} */}
                    {hostelData?.currentSubscription?.planName || "N/A"}
                  </p>
                </div>
              </div>
            </div>


            {/* Status */}
            <div className="flex items-start gap-3">


              <div>
                <p className="  text-[#1D1D1D] text-left font-sans font-medium text-sm">Status</p>

                <p className="text-sm font-medium flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${hostelData?.subscriptionStatus?.toLowerCase() === "active"
                      ? "bg-green-500"
                      : "bg-red-500"
                      }`}
                  ></span>

                  <span
                    className={`font-medium ${hostelData?.subscriptionStatus === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {hostelData?.subscriptionStatus || "N/A"}
                  </span>

                  {/* <span className="text-gray-400 text-xs">
                    22 Days Left to Renew
                  </span> */}
                </p>
              </div>

            </div>
            <div className="flex items-start gap-3">


              <button
                disabled={!canResetWrite}
                onClick={() => {
                  if (canResetWrite === true) {
                    setShowNoteModal(true);
                  }
                }}
                className={`px-3 py-[2px] rounded text-[12px] font-medium 
  ${canResetWrite === true
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Reset
              </button>

            </div>
          </div>

        </div>



        <div className="bg-white border border-gray-300 rounded-xl p-4 mt-4">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:divide-x lg:divide-gray-300">

            {/* Active Tenants */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Active Tenants</p>
                {/* <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" /> */}
              </div>

              <p className="text-lg  text-start font-semibold mt-1">
                {hostelData.noOfActiveTenants}
              </p>
            </div>


            {/* Rooms & Beds */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Rooms & Beds</p>
                <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" onClick={() => setShowSharing(true)} />
              </div>

              <p className="text-lg text-start font-semibold mt-1">
                {hostelData.noOfRooms} | {hostelData.noOfBeds}
              </p>
            </div>



            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Revenue Generated</p>
                {/* <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" /> */}
              </div>

              <p className="text-lg text-start font-semibold mt-1">₹0</p>
            </div>


            {/* Invoices */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Total Invoices</p>
                <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" onClick={() => setShowBillingRule(true)} />
              </div>

              <p className="text-lg  text-start font-semibold mt-1">0</p>
            </div>


            {/* Support */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Support Tickets</p>

              </div>

              <p className="text-lg text-start font-semibold mt-1">0</p>
            </div>

          </div>
        </div>



        <div className="bg-white rounded-xl pt-4 flex flex-col">


          {/* <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-5 pt-4 gap-3"> */}
          <div className="sticky top-0 z-40 bg-white flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-5 pt-0 pb-3 gap-3  border-gray-200">
            <div className="flex gap-6 border-b border-[#E6E8F0] overflow-x-auto">

              {[
                "tenants",
                "subscriptions",
                "Product Support",
                "staffs",
                "invoices",
                "activity",
                "Amenities",
                "Configuration"
              ]
                .map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium font-sans capitalize border-b-2 whitespace-nowrap cursor-pointer ${activeTab === tab
                      ? "border-[#2563EB] text-[#2563EB]"
                      : "border-transparent text-gray-500"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
            </div>


            {/* <div className="flex items-center gap-3 pb-3 lg:pb-4">

              <input
                placeholder="Search..."
                className="border border-[#E6E8F0] rounded-lg px-4 py-2 text-sm w-40 lg:w-56"
              />

              <select className="border border-[#E6E8F0] rounded-lg px-3 py-2 text-sm">
                <option>Active</option>
              </select>

            </div> */}
          </div>


          {activeTab === "tenants" && (
            canRead === true ? (
              <div className="overflow-x-auto">


                <div className="max-h-[300px] overflow-y-auto border border-[#E6E8F0] rounded-xl">

                  <table className="w-full text-sm">

                    <thead className="bg-[#F8F9FF] sticky top-0 z-10">
                      <tr>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            ID
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Name
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Mail
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Mobile No
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Status
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                      </tr>
                    </thead>


                    <tbody className="divide-y divide-gray-200">

                      {hostelData?.tenantList && hostelData?.tenantList?.length > 0 ? (
                        hostelData?.tenantList?.map((item, index) => (
                          <tr key={item.customerId || index} className="hover:bg-gray-50">

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              {index + 1}
                            </td>

                            <td className="px-4 py-2 text-[#2563EB] text-left font-medium text-[12px]">
                              {item.fullName || item.firstName || "N/A"}
                            </td>

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              {item.emailId || "N/A"}
                            </td>

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              {item.mobile || "N/A"}
                            </td>

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              <span className="text-green-600">
                                {item.currentStatus || "N/A"}
                              </span>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-gray-400">
                            No Data Found
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>
              </div>
            ) : (

              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src={LoginImg}
                  alt="Access Restricted"
                  className="w-48 mb-3"
                />

                <p className="text-red-500 font-medium">
                  Access Restricted
                </p>
              </div>

            )

          )}


          {activeTab === "subscriptions" && (
            <OverviewSubscriptions hostelData={hostelData} />
          )}
          {activeTab === "Product Support" && (
            <ProductSupport hostelData={hostelData} />
          )}
          {activeTab === "staffs" && (
            <StaffScreen hostelData={hostelData} />
          )}
          {activeTab === "invoices" && (
            <InvoicesScreen hostelData={hostelData} />
          )}
          {activeTab === "activity" && (
            <PropertyActive hostelData={hostelData} />
          )}
          {activeTab === "Amenities" && (
            <PropertyAmenities hostelData={hostelData} />
          )}
          {activeTab === "Configuration" && (
            <ReccuringBill hostelData={hostelData} />
          )}


        </div>

      </div>
      {showSharing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[80vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Detailed Sharing Breakdown
              </h2>

              <button
                onClick={() => setShowSharing(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Sharing Cards */}
            {hostelData?.sharingBreakdown?.length > 0 ? (

              [...hostelData.sharingBreakdown]
                .sort((a, b) => a.sharingType - b.sharingType)
                .map((item, index) => (

                  <div key={index} className="border rounded-xl p-4 mb-4">

                    <div className="flex justify-between mb-2">
                      <p className="font-semibold">
                        {item.sharingTypeDisplay || "N/A"}
                      </p>

                      <span className="text-sm text-gray-500">
                        {item.noOfRoomsAvailable ?? 0} Rooms Available
                      </span>
                    </div>

                    <div className="grid grid-cols-3 text-sm">

                      <div>
                        <p className="text-gray-500">Rooms</p>
                        <p className="font-semibold text-lg">
                          {item.noOfRooms ?? 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Total Beds</p>
                        <p className="font-semibold text-lg">
                          {item.noOfBeds ?? 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Occupied</p>
                        <p
                          className={`font-semibold text-lg ${item.noOfOccupiedBeds > 0
                            ? "text-green-600"
                            : "text-gray-400"
                            }`}
                        >
                          {item.noOfOccupiedBeds ?? 0}
                        </p>
                      </div>

                    </div>

                  </div>

                ))

            ) : (
              <div className="text-center py-6 text-gray-400">
                No Sharing Data Found
              </div>
            )}

          </div>
        </div>
      )}

      {showBillingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-xl w-[360px] shadow-lg p-6 relative">

            {/* Close */}
            <button
              onClick={() => setShowBillingRule(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Billing Rule
            </h2>

            <div className="border-t pt-4 space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">Billing Start Date</span>
                <span className="font-semibold text-gray-800">{hostelData?.billingRules[0]?.billingStartDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Bill Due Days</span>
                <span className="font-semibold text-gray-800">{hostelData?.billingRules[0]?.billDueDays}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Notice Period</span>
                <span className="font-semibold text-gray-800">{hostelData?.billingRules[0]?.noticePeriod}</span>
              </div>

            </div>

          </div>
        </div>
      )}
      {showNoteModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowNoteModal(false);
            setNoteText("");
            setHostelError("");
          }}
        >

          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => {
                setShowNoteModal(false);
                setNoteText("");
                setHostelError("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-left ">
              Enter Hostel ID <span className="text-red-400">*</span>
            </h2>

            <div className="space-y-4">

              {/* <input
                type="text"
                placeholder="Enter Hostel ID"
                value={noteText}
                onChange={(e) => {
                  setNoteText(e.target.value);
                  setHostelError("");
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              /> */}
              <input
                type="text"
                placeholder="Enter Hostel ID"
                value={noteText}
                onChange={(e) => {
                  setNoteText(e.target.value);
                  setHostelError("");
                }}
                onPaste={(e) => {
                  e.preventDefault();
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />

              {hostelerror && (
                <ErrorMessage message={hostelerror} type="error" />
              )}

              <button
                onClick={handleHardReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Submit
              </button>

            </div>

          </div>
        </div>
      )}
      {showTrialModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowTrialModal(false);
            setDaysError("");
            setSelectedExpandablePlan("");
            setPlanError("");
            setDays("")
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-[350px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2 className="text-lg font-semibold mb-4 text-left">
              Extend Trial
            </h2>
            <div className="relative">

              {/* BOX */}
              <div
                onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer"
              >
                <span className="text-sm ">
                  {dropdownPlans?.expandableTrialPlans?.find(p => p.planCode === selectedExpandablePlan)
                    ? `${dropdownPlans.expandableTrialPlans.find(p => p.planCode === selectedExpandablePlan).planName} - ${selectedExpandablePlan}`
                    : "Select Plan"}
                </span>

                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showPlanDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {/* DROPDOWN */}
              {showPlanDropdown && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto z-50">

                  <div
                    onClick={() => {
                      setSelectedExpandablePlan("");
                      setShowPlanDropdown(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-left"
                  >
                    Select Plan
                  </div>

                  {dropdownPlans?.expandableTrialPlans?.map((plan) => (
                    <div
                      key={plan.planId}
                      onClick={() => {
                        setSelectedExpandablePlan(plan.planCode);
                        setPlanError("");
                        setShowPlanDropdown(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-left"
                    >
                      {plan.planName} - {plan.planCode} ({plan.duration} days)
                    </div>
                  ))}
                </div>
              )}
            </div>

            {planError && (
              <div className="mb-3">
                <ErrorMessage message={planError} type="error" />
              </div>
            )}
            {/* Input */}
            <input
              type="number"
              placeholder="Enter days"
              value={days}
              onChange={(e) => {
                setDays(e.target.value);
                setDaysError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-4"
            />
            {daysError && (
              <div className="mb-3">
                <ErrorMessage message={daysError} type="error" />
              </div>
            )}
            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowTrialModal(false);
                  setDaysError("");
                  setSelectedExpandablePlan("");
                  setPlanError("");
                  setDays("")
                }}
                className="px-4 py-2 border rounded-lg text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleTrialWithDays();

                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showPlanModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowPlanModal(false);
            resetPlanForm();
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-[400px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2 className="text-lg font-semibold mb-4 text-left">
              Buy Subscription Plan
            </h2>

            {/* Plan Code */}
            <div className="relative w-full" ref={dropdownRef}>

              {/* SELECT BOX */}
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer mb-3 flex items-center justify-between bg-white"
              >
                {/* Selected text */}
                <span className={`text-sm ${planCode ? "text-gray-800" : "text-gray-400"}`}>
                  {dropdownPlans?.otherPlans?.find(p => p.planCode === planCode)?.planName || "Select Plan"}
                </span>

                {/* Arrow */}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {/* DROPDOWN LIST */}
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow max-h-40 overflow-y-auto">

                  {dropdownPlans?.otherPlans?.length > 0 ? (
                    dropdownPlans.otherPlans.map((plan) => (
                      <div
                        key={plan.planId}
                        onClick={() => {
                          setPlanCode(plan.planCode);
                          setShowDropdown(false);
                        }}
                        className={`px-3 py-2 cursor-pointer text-sm flex justify-between items-center
        ${plan.planCode === planCode
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100"
                          }`}
                      >
                        <span>{plan.planName}</span>

                        {plan.planCode === planCode && (
                          <span className="text-blue-600">✔</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      No Plans Available
                    </div>
                  )}

                </div>
              )}

            </div>
            {planError && (
              <ErrorMessage message={planError} type="error" />
            )}
            {/* <select
  value={paidBy}
  onChange={(e) => {
    setPaidBy(e.target.value);
    setPaidByError("");
  }}
  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
>
  <option value="">Select Paid By</option>

  {paidByUsers.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name} ({user.role})
    </option>
  ))}
</select> */}
            <div className="relative w-full">

              {/* SELECT BOX */}
              <div
                onClick={() => setShowPaidByDropdown(!showPaidByDropdown)}
                className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between bg-white"
              >
                <span className={`text-sm ${paidBy ? "text-gray-800" : "text-gray-400"}`}>
                  {paidByUsers.find(u => u.id === paidBy)?.name || "Select Paid By"}
                </span>

                {/* 🔥 Arrow */}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showPaidByDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {/* DROPDOWN */}
              {showPaidByDropdown && (
                <div className="absolute w-full bg-white border rounded-lg shadow mt-1 max-h-40 overflow-y-auto z-[9999]">

                  {paidByUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setPaidBy(user.id);
                        setShowPaidByDropdown(false);
                        setPaidByError("");
                      }}
                      className={`px-3 py-2 cursor-pointer text-sm flex justify-between
            ${paidBy === user.id
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100"}
          `}
                    >
                      <span>{user.name} ({user.role})</span>

                      {paidBy === user.id && <span>✔</span>}
                    </div>
                  ))}

                </div>
              )}

            </div>

            {paidByError && (
              <ErrorMessage message={paidByError} type="error" />
            )}

            <input
              type="number"
              placeholder={
                selectedPlanothers
                  ? `₹${selectedPlanothers.price}`
                  : "Paid Amount"
              }
              value={paidAmount}
              onChange={(e) => {
                setPaidAmount(e.target.value);
                setPaidAmountError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-3"
            />
            {paidAmountError && (
              <ErrorMessage message={paidAmountError} type="error" />
            )}
            {/* Discount */}
            <input
              type="number"
              placeholder="Discount Amount"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-3"
            />

            {/* File Upload */}
            {/* <input
              type="file"
              onChange={(e) => {
                setPaymentProof(e.target.files[0]);
                setProofError("");
              }}
              className="w-full mb-4"
            /> */}
            <div className="w-full mt-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">

                {/* Hidden input */}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setPaymentProof(e.target.files[0]);
                    setProofError("");
                  }}
                />

                {/* Icon + Text */}
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4" />
                  </svg>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Choose Image</span> to Upload
                  </p>
                  <p className="text-xs text-gray-400">JPG/JPEG Format</p>
                </div>
              </label>

              {/* File name show */}
              {paymentProof && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {paymentProof.name}
                </p>
              )}
            </div>
            {proofError && (
              <ErrorMessage message={proofError} type="error" />
            )}
            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  resetPlanForm();
                }}
                className="px-4 py-2 border rounded-lg text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleSubscription();

                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showTrialConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">


          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowTrialConfirm(false);
              setPlanError("");
              setSelectedPlanCode("")
              setShowTrialPlanDropdown("")
            }}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-[350px] p-5 z-[10000]">



            <div className="mb-4 relative">

              <label className="text-sm text-gray-600 mb-1 block text-left">
                Select Plan
              </label>

              {/* SELECT BOX */}
              <div
                onClick={() => setShowTrialPlanDropdown(!showTrialPlanDropdown)}
                className="w-full border rounded-lg px-3 py-2 text-sm flex justify-between items-center cursor-pointer bg-white"
              >
                <span className={`${selectedPlanCode ? "text-gray-800" : "text-gray-400"}`}>
                  {dropdownPlans?.trialPlans?.find(p => p.planCode === selectedPlanCode)?.planName
                    ? `${dropdownPlans.trialPlans.find(p => p.planCode === selectedPlanCode).planName} - ${selectedPlanCode}`
                    : "Select Plan"}
                </span>

                {/* 🔽 Arrow */}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showTrialPlanDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {/* DROPDOWN LIST */}
              {showTrialPlanDropdown && (
                <div
                  className="absolute mt-1 w-full bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto z-[10001] text-left"
                >
                  {dropdownPlans?.trialPlans?.map((plan) => (
                    <div
                      key={plan.planId}
                      onClick={() => {
                        setSelectedPlanCode(plan.planCode);
                        setPlanError("");
                        setShowTrialPlanDropdown(false);
                      }}
                      className={`px-3 py-2 cursor-pointer text-sm
                  ${selectedPlanCode === plan.planCode
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100"}
                `}
                    >
                      {plan.planName} - {plan.planCode} ({plan.duration} days)
                    </div>
                  ))}
                </div>
              )}

            </div>

            {planError && (
              <ErrorMessage message={planError} type="error" />
            )}
            <div className="flex justify-end gap-2">

              {/* Cancel */}
              <button
                onClick={() => {
                  setShowTrialConfirm(false);
                  setPlanError("");
                  setSelectedPlanCode("")
                  setShowTrialPlanDropdown("")

                }}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>

              {/* OK */}
              <button

                onClick={async () => {
                  await handleTrialOnly();

                }}
                className="px-4 py-2 rounded-lg text-sm bg-green-600 text-white cursor-pointer"

              >
                OK
              </button>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PropertyOverview;
