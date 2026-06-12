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
import InvoicesRedemption from "./InvoicesRedemption";
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
import Circle from "../../assets/menucircle.png";
import ArrowSelect from "../../assets/direction-down 01.png";
import InvoiceView from "./InvoiceView";
import CopyImg from "../../assets/copyImg.jpg"
import CustImag from "../../assets/single.png";
import CustTenImg from "../../assets/team.png"
import LocationGrey from "../../assets/locationGrey.png";
import Call from "../../assets/call.png";
const PropertyOverview = () => {
  const { hostels, getHostels, loading, getHostelById, hardResetHostel, errorMsg, accessError, generateOrderHistory,sharePaymentLink} = useHostel();
  const { owners, totalItems, totalPages, getOwners, getOwnerById, deleteTenant } = useOwners();
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
  const [openMenu, setOpenMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [phone, setPhone] = useState("");
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [generatedPaymentUrl, setGeneratedPaymentUrl] = useState("");
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Tenants");
  const {
    canRead: canSubscriptionRead,
    canWrite: canSubscriptionWrite,
    canUpdate: canSubscriptionUpdate,
    canDelete: canSubscriptionDelete,
  } = usePermission("Payments");

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
  console.log("hostelData",hostelData)
  const paidByUsers = [
    {
      id: hostelData?.owner?.userId,
      name: hostelData?.owner?.fullName,
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
   const [showPaidByDropdownGenerate, setShowPaidByDropdownGenerate] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showAgentModal, setShowAgentModal] = useState(false);
  {/* STATE */ }
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);

  const [paymentPlan, setPaymentPlan] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDiscount, setPaymentDiscount] = useState("");

  const [paymentPlanError, setPaymentPlanError] = useState("");
  const [paymentAmountError, setPaymentAmountError] = useState("");
  const [paymentDiscountError, setPaymentDiscountError] = useState("");
  const loginType = localStorage.getItem("login_type");
  const showInvoices = loginType === "normal";
  const { hostelId } = useParams();


  const fetchData = async () => {
    if (!hostelId) return;

    const res = await getHostelById(hostelId);

    if (res?.success) {
      setHostelData(res.data);
    }
  };
  const selectedPaymentPlan = dropdownPlans?.otherPlans?.find(
    (plan) => plan.planCode === paymentPlan
  );
  useEffect(() => {
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
fetchData()

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

    const res = await getOwnerById(item.owner.userId);

    if (res?.success) {

      navigate(`/ProprietorsOverview/${item.owner.userId}`, {
        state: { ownerData: res.data }
      });

    }

  };

  const handleTrialOnly = async () => {

    const firstPlan = dropdownPlans?.trialPlans?.[0];

    if (!firstPlan) {
      setMenuError("No trial plan available");
      return;
    }

    const payload = {
      trialDays: 0,
      paidAmount: 0,
      discountAmount: 0,
      planCode: firstPlan?.planCode
    };

    const res = await createSubscription(
      trialPlan?.hostelId,
      payload
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);
      const updated = await getHostelById(hostelId);

      if (updated?.success) {
        setHostelData(updated.data);
      }
      await getHostels(1, 10, "");

      setTimeout(() => {
        setShowSuccess(false);
        setShowTrialConfirm(false);
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
  const handleTrialWithDays = async () => {

    let hasError = false;

    if (!days) {
      setDaysError("Please Choose Days");
      hasError = true;
    }

    if (hasError) return;

    // 🔥 first plan auto pick
    const firstPlan = dropdownPlans?.expandableTrialPlans?.[0];

    if (!firstPlan) {
      setDaysError("No expandable trial plan available");
      return;
    }

    const payload = {
      trialDays: Number(days),
      paidAmount: 0,
      discountAmount: 0,
      planCode: firstPlan.planCode
    };

    const res = await createSubscription(
      // trialPlan?.hostelId,
      hostelId,
      payload
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      await getHostels(1, 10, "");
      const updated = await getHostelById(hostelId);

      if (updated?.success) {
        setHostelData(updated.data);
      }
      setTimeout(() => {
        setShowSuccess(false);
        setShowTrialModal(false);
        setDays(""); // reset
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
  // const handleTrialOnly = async () => {

  //   // if (!selectedPlanCode) {
  //   //   alert("Please select a plan");
  //   //   return;
  //   // }
  //   let hasError = false;

  //   if (!selectedPlanCode) {
  //     setPlanError("Please Select Plancode");
  //     hasError = true;
  //   }



  //   if (hasError) return;
  //   const payload = {
  //     trialDays: 0,
  //     paidAmount: Number(paidAmount || 0),
  //     discountAmount: Number(discountAmount || 0),
  //     planCode: selectedPlanCode
  //   };

  //   const res = await createSubscription(
  //     trialPlan?.hostelId,
  //     payload
  //   );

  //   if (res?.success) {
  //     setModalType("success");
  //     setMessage(res.message);
  //     setShowSuccess(true);

  //     await getHostels(1, 10, "");

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //       setShowTrialConfirm(false);
  //     }, 1000);

  //   } else {
  //     setMenuError(res?.message);
  //     setModalType("error");
  //     setMessage(res?.message);
  //     setShowSuccess(true);

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1000);
  //   }
  // };
  // const handleTrialWithDays = async () => {
  //   let hasError = false;
  //   if (!selectedExpandablePlan) {
  //     setPlanError("Please select a plan");
  //     hasError = true;
  //   }

  //   if (!days) {
  //     setDaysError("Please Enter Days");
  //     hasError = true;
  //   }
  //   if (hasError) return;

  //   const payload = {
  //     trialDays: Number(days),
  //     paidAmount: Number(paidAmount || 0),
  //     discountAmount: Number(discountAmount || 0),
  //     planCode: selectedExpandablePlan   // 🔥 FIX
  //   };

  //   const res = await createSubscription(
  //     trialPlan?.hostelId,
  //     payload
  //   );

  //   if (res?.success) {
  //     setModalType("success");
  //     setMessage(res.message);
  //     setShowSuccess(true);

  //     await getHostels(1, 10, "");

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //       setShowTrialModal(false);
  //     }, 1000);

  //   } else {
  //     setDaysError(res?.message);
  //     setModalType("error");
  //     setMessage(res?.message);
  //     setShowSuccess(true);

  //     setTimeout(() => {
  //       setShowSuccess(false);

  //     }, 1000);
  //   }
  // };


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
  useEffect(() => {
    const handleClickOutside = (e) => {

      if (!e.target.closest(".menu-container")) {
        setOpenMenu(null);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log("hostelData", hostelData)
  const handleSubscription = async () => {


    if (subscriptionLoading) return;

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

    try {

      setSubscriptionLoading(true);

      const payload = {
        trialDays: 0,
        planCode,
        paidAmount: Number(paidAmount),
        discountAmount: Number(discountAmount || 0),
        paidBy
      };

      const res = await createSubscription(
        hostelId,
        payload,
        paymentProof
      );

      if (res?.success) {

        setModalType("success");
        setMessage(res.message);
        setShowSuccess(true);

        await getHostels(1, 10, "");

        const updated = await getHostelById(hostelId);

        if (updated?.success) {
          setHostelData(updated.data);
        }

        setTimeout(() => {
          setShowSuccess(false);
          setShowPlanModal(false);
          resetPlanForm();
        }, 1000);

      } else {

        setModalType("error");
        setMessage(res?.message);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 1000);
      }

    } finally {

      setSubscriptionLoading(false);

    }
  };
  //   const handleSubscription = async () => {

  //     let hasError = false;

  //     if (!planCode) {
  //       setPlanError("Please Select Plancode");
  //       hasError = true;
  //     }

  //     if (!paymentProof) {
  //       setProofError("Please upload proof");
  //       hasError = true;
  //     }
  //     if (!paidAmount) {
  //       setPaidAmountError("Please enter paid amount");
  //       hasError = true;
  //     }
  //     if (!paidBy) {
  //       setPaidByError("Please select Paid By");
  //       hasError = true;
  //     }

  //     if (hasError) return;

  //     const payload = {

  //       trialDays: 0,
  //       planCode: planCode,
  //       paidAmount: Number(paidAmount),
  //       discountAmount: Number(discountAmount || 0),
  //       paidBy
  //     };
  //     console.log("payload", payload)
  //     const res = await createSubscription(
  //       trialPlan?.hostelId,
  //       payload,
  //       paymentProof
  //     );

  //     if (res?.success) {
  //       setModalType("success");
  //       setMessage(res.message);
  //       setShowSuccess(true);

  //       await getHostels(1, 10, "");
  // const updated = await getHostelById(hostelId);

  // if (updated?.success) {
  //   setHostelData(updated.data);
  // }
  //       setTimeout(() => {
  //         setShowSuccess(false);
  //         setShowPlanModal(false)
  //         resetPlanForm()

  //       }, 1000);

  //     } else {
  //       setModalType("error");
  //       setMessage(res?.message);
  //       setShowSuccess(true);

  //       setTimeout(() => {
  //         setShowSuccess(false);
  //       }, 1000);
  //     }
  //   };
  const handleDeleteTenant = async () => {

    const selectedTenant = hostelData?.tenantList?.find(
      t => t.customerId === selectedTenantId
    );

    if (!selectedTenant) return;

    const res = await deleteTenant(
      hostelId,
      selectedTenant.customerId,
      phone // 🔥 input value
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);

      const updated = await getHostelById(hostelId);
      if (updated?.success) {
        setHostelData(updated.data);
      }

      setTimeout(() => {
        setShowSuccess(false);
        setShowDeleteModal(false);
        setPhone("");
      }, 1200);

    } else {
      setMenuError(res?.message);
    }
  };
  //   const handleGeneratePayment = async () => {

  //   let hasError = false;
  // setGeneratedPaymentUrl(
  //   "https://paymentssandbox.zoho.in/paymentlinks/7ca871f6e7048883a46b4bde80b716108998f9601ac264723798872bf4281df3ac4f39cd635e9b5d0f973d8a0dac06e17b3023d49cb63166eb105e77b72ecf9a"
  // );
  //   if (!paymentPlan) {
  //     setPaymentPlanError("Please select plan");
  //     hasError = true;
  //   }

  //   if (!paymentAmount) {
  //     setPaymentAmountError("Please enter amount");
  //     hasError = true;
  //   }

  //   if (hasError) return;

  //   const payload = {
  //     planCode: paymentPlan,
  //     paidAmount: Number(paymentAmount),
  //     discountAmount: Number(paymentDiscount || 0)
  //   };

  //   const res = await generateOrderHistory(
  //     hostelId,
  //     payload
  //   );

  //   if (res?.success) {

  //     setModalType("success");
  //     setMessage("Payment generated successfully");
  //     setShowSuccess(true);

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //       setShowPaymentDrawer(false);

  //       setPaymentPlan("");
  //       setPaymentAmount("");
  //       setPaymentDiscount("");

  //       setPaymentPlanError("");
  //       setPaymentAmountError("");
  //     }, 1000);

  //   } else {

  //     setModalType("error");
  //     setMessage(res?.message || "Something went wrong");
  //     setShowSuccess(true);

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1000);

  //   }
  // };
  // const handleGeneratePayment = async () => {

  //   let hasError = false;

  //   if (!paymentPlan) {
  //     setPaymentPlanError("Please select plan");
  //     hasError = true;
  //   }

  //   if (!paymentAmount) {
  //     setPaymentAmountError("Please enter amount");
  //     hasError = true;
  //   }

  //   if (hasError) return;

  //   // TEMPORARY HARD CODE


  //   const payload = {
  //     planCode: paymentPlan,
  //     paidAmount: Number(paymentAmount),
  //     discountAmount: Number(paymentDiscount || 0)
  //   };

  //   await generateOrderHistory(
  //     hostelId,
  //     payload
  //   );

  // };
  const handleGeneratePayment = async () => {

    let hasError = false;

    if (!paymentPlan) {
      setPaymentPlanError("Please select plan");
      hasError = true;
    }

    // if (!paymentAmount) {
    //   setPaymentAmountError("Please enter amount");
    //   hasError = true;
    // }
      if (!paidBy) {
      setPaidByError("Please select Paid By");
      hasError = true;
    }
    if (!paymentDiscount) {
      setPaymentDiscountError("Please enter discount");
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      planCode: paymentPlan,
      // paidAmount: Number(paymentAmount),
      discountAmount: Number(paymentDiscount || 0),
      paidBy
    };

    const res = await generateOrderHistory(
      hostelId,
      payload
    );

    console.log("generate payment response", res);

    if (res?.success) {

      setGeneratedPaymentUrl(
        res?.data?.paymentUrl || ""
      );

      setModalType("success");
      setMessage("Payment generated successfully");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500)

    } else {

      setModalType("error");
      setMessage(res?.message || "Something went wrong");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500)

    }

  };
 const handleSharePayment = async () => {

  if (!generatedPaymentUrl) {
    return;
  }

  const res = await sharePaymentLink(
    hostelId,
    generatedPaymentUrl
  );

  if (res?.success) {

    setModalType("success");
    setMessage("Payment link shared successfully");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  } else {

    setModalType("error");
    setMessage(res?.message || "Share failed");
    setShowSuccess(true);

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
      <div className="px-pageX min-h-screen">


       <div className="flex items-center gap-rowGap">

          <img
  src={arrowleft}
  className="
    w-5
    h-5
    cursor-pointer
  "

         
            onClick={() => {

              if (location.state?.from === "transactions") {

                navigate(`/transactions/${adminDetails?.roleId}`, {
                  state: {
                    currentPage: location.state?.currentPage,
                    currentSearch: location.state?.currentSearch,
                    currentDateRange: location.state?.currentDateRange,
                  },
                })

              } else {

                navigate(`/properties/${adminDetails?.roleId}`, {
  state: {
    currentPage: location.state?.currentPage,
    currentSearch: location.state?.currentSearch,
    currentDateRange: location.state?.currentDateRange,
    currentStatusFilter:
      location.state?.currentStatusFilter,
  },
});

              }

            }}
          />
        <p className="text-pageTitle leading-pageTitle text-headingDark font-medium">
  Property Overview
</p>
        </div>


        <div className="bg-cardBg border border-borderSoft rounded-card shadow-card p-5 mt-2">

          {/* Top Section */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

  {/* LEFT */}
  <div className="flex items-center gap-3 min-w-0 flex-1">

    {/* PROFILE */}
    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-lg font-semibold shrink-0">

      {hostelData?.mainImage ? (

        <img
          src={hostelData.mainImage}
          alt="profile"
          className="w-full h-full object-cover"
        />

      ) : (

        <span>
          {hostelData?.initials}
        </span>

      )}

    </div>


    {/* CONTENT */}
    <div className="min-w-0 flex-1">

      {/* NAME + RIGHT */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">

        {/* NAME */}
        <div className="min-w-0">

          <h2
            title={hostelData.hostelName}
            className="
              text-sectionTitle
              font-semibold
              text-headingDark
              font-inter
              truncate
              whitespace-nowrap
              overflow-hidden
              max-w-[500px] text-left
            "
          >
            {hostelData.hostelName}
          </h2>

          <p
            className="
              text-cardTitle
              text-textDark/60
              flex
              items-center
              gap-1
              whitespace-nowrap
              overflow-hidden
              mt-1
            "
          >

            <span className="shrink-0">
              {hostelData.hostelId} |
            </span>

            <span
              title={hostelData.owner?.fullName}
              className="
                text-primaryBlue
                cursor-pointer
                hover:underline
                truncate
                overflow-hidden
                max-w-[260px]
              "
              onClick={() => handleOwnerClick(hostelData)}
            >
              {hostelData.owner?.fullName}
            </span>

            <img
              src={Arrow}
              className="w-3 h-3 ml-1 shrink-0"
            />

          </p>

        </div>


        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap mb-5">

          {/* BUTTONS */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* TRIAL */}
            <button
              disabled={
                hostelData?.canAddExpandableTrial === false ||
                !canSubscriptionWrite
              }
              onClick={() => {

                if (
                  hostelData?.canAddExpandableTrial !== false &&
                  canSubscriptionWrite
                ) {

                  setShowTrialModal(true);

                }

              }}
              className={`
                px-3
                py-1
                rounded-[6px]
                text-[10px]
                font-medium
                whitespace-nowrap
                transition-all
                duration-200
                shadow-card
                font-inter
                ${
                  hostelData?.canAddExpandableTrial === false ||
                  !canSubscriptionWrite
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-warningYellow text-white cursor-pointer hover:opacity-90"
                }
              `}
            >
              Trial + Days
            </button>


            {/* BUY PLAN */}
            <button
              disabled={!canSubscriptionWrite}
              onClick={() => {

                if (canSubscriptionWrite) {

                  setShowPlanModal(true);

                }

              }}
              className={`
                px-3
                py-1
                rounded-[6px]
                text-[10px]
                font-medium
                whitespace-nowrap
                transition-all
                duration-200
                shadow-card
                font-inter
                ${
                  canSubscriptionWrite
                    ? "bg-primaryBlue text-white cursor-pointer hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Buy Plan
            </button>


            {/* PAYMENT */}
            <button
              onClick={() => setShowPaymentDrawer(true)}
              className="
                px-3
                py-1
                rounded-[6px]
                text-[10px]
                font-medium
                whitespace-nowrap
                bg-successGreen
                text-white
                cursor-pointer
                hover:opacity-90
                transition-all
                duration-200
                shadow-card
                font-inter
              "
            >
              Generate Payment
            </button>

          </div>


          {/* DATE */}
          <div className="flex items-center gap-2">

            <img
              src={refresh}
              className="w-8 h-8 object-contain"
              alt="refresh"
            />

            <span className="whitespace-nowrap text-textDark text-[13px] font-inter">
              {hostelData.createdAtDate}
            </span>

          </div>


          {/* VIEW */}
          <button
            className="
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded-full
              hover:bg-cardBg
              transition-all
              duration-200
              cursor-pointer
            "
          >
            <img
              src={ViewImg}
              width={18}
              height={18}
              alt="view"
              className="object-contain"
            />
          </button>


          {/* MENU */}
          <button
            className="
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded-full
              text-gray-400
              hover:bg-cardBg
              hover:text-textDark
              transition-all
              duration-200
              cursor-pointer
            "
          >
            ⋮
          </button>

        </div>

      </div>

    </div>

  </div>

</div>


          
          <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-5
    gap-6
    mt-6
  "
>

  {/* MOBILE */}
  <div className="flex items-start gap-3">

    <div>

      <p
        className="
          text-label
          text-textDark
          text-left
          font-inter
          font-medium
        "
      >
        Mob No
      </p>

      <div className="flex items-center gap-2 mt-1">

        <img
          src={Mobile}
          className="w-4 h-4"
        />

        <p
          className="
            text-cardTitle
            font-medium
            font-inter
            text-textDark
          "
        >
          +91 {hostelData.mobile}
        </p>

      </div>

    </div>

  </div>

  {/* LOCATION */}
  <div className="flex items-start gap-3">

   <div className="min-w-0">

  <p
    className="
      text-label
      text-textDark
      text-left
      font-inter
      font-medium
    "
  >
    Region / City
  </p>

  <div
    className="
      flex
      items-center
      gap-2
      mt-1
      min-w-0
    "
  >

    <img
      src={locationImg}
      className="
        w-4
        h-4
        shrink-0
      "
    />

    <p
      title={`${hostelData.city}, ${hostelData.state}`}
      className="
        text-cardTitle
        font-medium
        text-primaryBlue
        flex
        items-center
        min-w-0
        truncate
      "
    >
      <span className="truncate">
        {hostelData.city}, {hostelData.state}
      </span>

      <img
        src={Arrow}
        className="
          w-3
          h-3
          ml-1
          shrink-0
        "
      />
    </p>

  </div>

</div>

  </div>

  {/* SUBSCRIPTION */}
  <div className="flex items-start gap-3">

    <div>

      <p
        className="
          text-label
          text-textDark
          text-left
          font-inter
          font-medium
        "
      >
        Subscription Plan
      </p>

      <div className="flex items-center gap-2 mt-1">

        <img
          src={
            plan === "Basic"
              ? Star
              : plan === "Premium"
              ? Crown
              : null
          }
          className="w-4 h-4"
          style={{
            display:
              plan === "basic" ||
              plan === "premium"
                ? "block"
                : "none"
          }}
        />

        <p
          className="
            text-cardTitle
            font-medium
            text-textDark
          "
        >
          {hostelData?.currentSubscription?.planName || "N/A"}
        </p>

      </div>

    </div>

  </div>

  {/* AGENT */}
  <div className="flex items-start gap-3">

    <div>

      <p
        className="
          text-label
          text-textDark
          text-left
          font-inter
          font-medium
        "
      >
        Current Agent
      </p>

      <div className="flex items-center gap-2 mt-1">

        {/* <p
          className="
            text-cardTitle
            font-medium
            text-primaryBlue
            truncate
            max-w-[120px]
          "
        >
          {hostelData?.relationalAgents?.[0]?.agentName || "N/A"}
        </p> */}
        <p
  onClick={() => {

    const agentId =
      hostelData?.relationalAgents?.[0]?.agentId;

    if (agentId) {

      navigate(`/iam-user/${agentId}`);

    }

  }}
  className="
    text-cardTitle
    font-medium
    text-primaryBlue
    truncate
    max-w-[120px]
    cursor-pointer
    hover:underline
  "
>
  {hostelData?.relationalAgents?.[0]?.agentName || "N/A"}
</p>

        {hostelData?.relationalAgents?.length > 0 && (

          <button
            onClick={() => setShowAgentModal(true)}
            className="
              text-[10px]
              px-2
              py-[2px]
              bg-primarySoft
              text-primaryBlue
              rounded-pill
              whitespace-nowrap cursor-pointer
            "
          >
            View
          </button>

        )}

      </div>

    </div>

  </div>

  {/* STATUS */}
  <div className="flex items-start gap-3">

    <div>

      <p
        className="
          text-label
          text-textDark
          text-left
          font-inter
          font-medium
        "
      >
        Status
      </p>

      <p
        className="
          text-cardTitle
          font-medium
          flex
          items-center
          gap-2
          mt-1
        "
      >

        <span
          className={`
            w-2
            h-2
            rounded-full
            ${
              hostelData?.subscriptionStatus?.toLowerCase() === "active"
                ? "bg-successGreen"
                : "bg-dangerRed"
            }
          `}
        ></span>

        <span
          className={`
            font-medium
            ${
              hostelData?.subscriptionStatus === "Active"
                ? "text-successGreen"
                : "text-dangerRed"
            }
          `}
        >
          {hostelData?.subscriptionStatus || "N/A"}
        </span>

      </p>

    </div>

  </div>

  {/* RESET */}
  <div className="flex items-start gap-3">

    <button
      disabled={!canResetWrite}
      onClick={() => {
        if (canResetWrite === true) {
          setShowNoteModal(true);
        }
      }}
      className={`
        px-3
        py-[2px]
        rounded-card
        text-tableCell
        font-medium
        ${
          canResetWrite === true
            ? "bg-primaryBlue hover:bg-blue-700 text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
    >
      Reset
    </button>

  </div>

</div>

        </div>



       <div
  className="
    bg-white
    border
    border-borderSoft
    rounded-card
    p-4
    mt-4
    shadow-card
  "
>

  <div
    className="
      grid
      grid-cols-2
      md:grid-cols-3
      lg:grid-cols-5
      gap-4
      lg:divide-x
      lg:divide-borderSoft
    "
  >

    {/* ACTIVE TENANTS */}
    <div className="px-2 lg:px-4">

      <p
        className="
          text-tableCell
          text-textDark/60
        "
      >
        Active Tenants
      </p>

      <p
        className="
          text-sectionTitle
          font-semibold
          mt-1
          text-headingDark
        "
      >
        {hostelData.noOfActiveTenants}
      </p>

    </div>

    {/* ROOMS & BEDS */}
    <div className="px-2 lg:px-4">

      <div className="flex items-center gap-1">

        <p
          className="
            text-tableCell
            text-textDark/60
          "
        >
          Rooms & Beds
        </p>

        <img
          src={ViewImg}
          className="
            w-3.5
            h-3.5
            opacity-70
            cursor-pointer
          "
          onClick={() => setShowSharing(true)}
        />

      </div>

      <p
        className="
          text-sectionTitle
          font-semibold
          mt-1
          text-headingDark text-left
        "
      >
        {hostelData.noOfRooms} | {hostelData.noOfBeds}
      </p>

    </div>

    {/* REVENUE */}
    <div className="px-2 lg:px-4">

      <p
        className="
          text-tableCell
          text-textDark/60
        "
      >
        Revenue Generated
      </p>

      <p
        className="
          text-sectionTitle
          font-semibold
          mt-1
          text-headingDark
        "
      >
        ₹0
      </p>

    </div>

    {/* INVOICES */}
    <div className="px-2 lg:px-4">

      <div className="flex items-center gap-1">

        <p
          className="
            text-tableCell
            text-textDark/60
          "
        >
          Total Invoices
        </p>

        <img
          src={ViewImg}
          className="
            w-3.5
            h-3.5
            opacity-70
            cursor-pointer
          "
          onClick={() => setShowBillingRule(true)}
        />

      </div>

      <p
        className="
          text-sectionTitle
          font-semibold
          mt-1
          text-headingDark text-left
        "
      >
        0
      </p>

    </div>

    {/* SUPPORT */}
    <div className="px-2 lg:px-4">

      <p
        className="
          text-tableCell
          text-textDark/60
        "
      >
        Support Tickets
      </p>

      <p
        className="
          text-sectionTitle
          font-semibold
          mt-1
          text-headingDark
        "
      >
        0
      </p>

    </div>

  </div>

</div>



       <div
  className="
    bg-white
    rounded-card
    pt-4
    flex
    flex-col
    shadow-card
    border
    border-borderSoft
  "
>

  {/* HEADER */}
  <div
    className="
      sticky
      top-0
      z-40
      bg-white
      flex
      flex-col
      lg:flex-row
      lg:items-center
      justify-between
      px-4
      lg:px-5
      pt-0
      pb-3
      gap-3
      border-b
      border-borderSoft
    "
  >

    {/* TABS */}
    <div
      className="
        flex
        gap-6
        overflow-x-auto
      "
    >

      {[
        "tenants",
        "subscriptions",
        "Product Support",
        "staffs",
        "Invoice",
        "Invoice Redemption",
        "activity",
        "Amenities",
        "Configuration"
      ].map((tab) => (

        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            pb-3
            text-cardTitle
            font-medium
            font-inter
            capitalize
            border-b-2
            whitespace-nowrap
            cursor-pointer
            transition-all
            duration-200

            ${
              activeTab === tab
                ? "border-primaryBlue text-primaryBlue"
                : "border-transparent text-textDark/60 hover:text-primaryBlue"
            }
          `}
        >
          {tab}
        </button>

      ))}

    </div>

  </div>

  {/* TENANTS */}
  {activeTab === "tenants" && (

    canRead === true ? (

      <div className="overflow-x-auto p-4">

        <div
          className="
            max-h-[300px]
            overflow-y-auto
            border
            border-borderSoft
            rounded-card
          "
        >

          <table className="w-full text-cardTitle">

            {/* TABLE HEADER */}
            <thead
              className="
                bg-cardBg
                sticky
                top-0
                z-10
              "
            >

              <tr>

                {[
                  "ID",
                  "Name",
                  "Mail",
                  "Mobile No",
                  "Joining Date",
                  "Status",
                  "Action"
                ].map((header) => (

                  <th
                    key={header}
                    className="
                      px-4
                      py-3
                      text-left text-[12px]
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        font-semibold
                        text-tableHeader
                        uppercase
                        text-textDark/60
                        font-inter
                      "
                    >

                      {header}

                      <img
                        src={swap}
                        alt="sort"
                        className="
                          w-3
                          h-3
                          opacity-70
                        "
                      />

                    </div>

                  </th>

                ))}

              </tr>

            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-borderSoft">

              {hostelData?.tenantList &&
              hostelData?.tenantList?.length > 0 ? (

                hostelData?.tenantList?.map((item, index) => (

                  <tr
                    key={item.customerId || index}
                    className="
                      hover:bg-cardBg
                      transition-all1 text-[12px]
                    "
                  >

                    {/* ID */}
                    <td
                      className="
                        px-4
                        py-3
                        text-left
                        font-medium
                        text-tableCell
                      "
                    >
                      {index + 1}
                    </td>

                    {/* NAME */}
                    <td
                      className="
                        px-4
                        py-3
                        text-primaryBlue
                        text-left
                        font-medium
                        text-tableCell
                      "
                    >
                      {item.fullName || item.firstName || "N/A"}
                    </td>

                    {/* MAIL */}
                    <td
                      className="
                        px-4
                        py-3
                        text-left
                        font-medium
                        text-tableCell
                        text-textDark
                      "
                    >
                      {item.emailId || "N/A"}
                    </td>

                    {/* MOBILE */}
                    <td
                      className="
                        px-4
                        py-3
                        text-left
                        font-medium
                        text-tableCell
                      "
                    >
                      {item.mobile || "N/A"}
                    </td>

                    {/* JOIN DATE */}
                    <td
                      className="
                        px-4
                        py-3
                        text-left
                        font-medium
                        text-tableCell
                      "
                    >
                      {item.joiningDate || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td
                      className="
                        px-4
                        py-3
                        text-left
                        font-medium
                        text-tableCell
                      "
                    >

                      <span
                        className="
                          text-successGreen
                          bg-green-50
                          px-2
                          py-[2px]
                          rounded-pill
                        "
                      >
                        {item.currentStatus || "N/A"}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td
                      className="
                        px-4
                        py-3
                        text-tableCell
                        text-left
                        whitespace-nowrap
                        relative
                      "
                    >

                      <div className="relative menu-container">

                       <img
  src={Circle}
  alt="menu"
  className="
    w-5
    h-5
    cursor-pointer
  "
  onClick={(e) => {

    e.stopPropagation();

    const rect =
      e.currentTarget.getBoundingClientRect();

    const menuHeight = 50; // menu approx height
    const spaceBelow =
      window.innerHeight - rect.bottom;

    const showAbove =
      spaceBelow < menuHeight;

    setMenuPosition({
      top: showAbove
        ? rect.top - menuHeight
        : rect.bottom + 5,

      left: rect.left,
    });

    setOpenMenu(
      openMenu === index
        ? null
        : index
    );

  }}
/>

{openMenu === index && (

  <div
    className="
      fixed
      w-28
      bg-white
      border
      border-borderSoft
      rounded-card
      shadow-dropdown
      z-[9999]
    "
    style={{
      top: menuPosition.top,
      left: menuPosition.left - 100,
    }}
  >

    <button
      disabled={!canDelete}
      onClick={() => {

        if (!canDelete) return;

        setSelectedTenantId(
          item.customerId
        );

        setShowDeleteModal(true);
        setOpenMenu(null);

      }}
      className={`
        w-full
        text-left
        px-4
        py-2
        text-cardTitle

        ${
          canDelete
            ? "hover:bg-cardBg text-dangerRed cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }
      `}
    >
      Delete
    </button>

  </div>

)}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={7}
                    className="
                      text-center
                      py-6
                      text-textDark/50
                    "
                  >
                    No Data Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    ) : (

      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          py-10
        "
      >

        <img
          src={LoginImg}
          alt="Access Restricted"
          className="
            w-48
            mb-3
          "
        />

        <p
          className="
            text-dangerRed
            font-medium
          "
        >
          Access Restricted
        </p>

      </div>

    )

  )}

  {/* OTHER TABS */}
  {activeTab === "subscriptions" && (
    <OverviewSubscriptions hostelData={hostelData} />
  )}

  {activeTab === "Product Support" && (
    <ProductSupport hostelData={hostelData} />
  )}

  {activeTab === "staffs" && (
    <StaffScreen
      hostelData={hostelData}
      refreshHostel={fetchData}
    />
  )}

  {activeTab === "Invoice" && (
    <InvoiceView
      hostelData={hostelData}
      refreshHostel={fetchData}
    />
  )}

  {activeTab === "Invoice Redemption" && (
    <InvoicesRedemption
      hostelData={hostelData}
      refreshHostel={fetchData}
    />
  )}

  {activeTab === "activity" && (
    <PropertyActive hostelData={hostelData} />
  )}

  {activeTab === "Amenities" && (
    <PropertyAmenities hostelData={hostelData} />
  )}

  {activeTab === "Configuration" && (
    <ReccuringBill
      hostelData={hostelData}
      refreshHostel={fetchData}
    />
  )}

</div>

      </div>
      {showSharing && (

  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      px-4
    "
  >

    <div
      className="
        bg-white
        rounded-modal
        shadow-modal
        w-full
        max-w-lg
        p-6
        relative
        max-h-[80vh]
        overflow-y-auto
        animate-fadeIn
      "
    >

      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          mb-5
        "
      >

        <h2
          className="
            text-cardTitle
            font-semibold
            text-headingDark
          "
        >
          Detailed Sharing Breakdown
        </h2>

        <button
          onClick={() => setShowSharing(false)}
          className="
            text-textDark/40
            hover:text-textDark
            text-xl
            cursor-pointer
          "
        >
          ✕
        </button>

      </div>

      {/* SHARING LIST */}
      {hostelData?.sharingBreakdown?.length > 0 ? (

        [...hostelData.sharingBreakdown]
          .sort((a, b) => a.sharingType - b.sharingType)
          .map((item, index) => (

            <div
              key={index}
              className="
                border
                border-borderSoft
                rounded-card
                p-4
                mb-4
                bg-cardBg
              "
            >

              {/* TOP */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-3
                  gap-3
                "
              >

                <p
                  className="
                    font-semibold
                    text-headingDark
                  "
                >
                  {item.sharingTypeDisplay || "N/A"}
                </p>

                <span
                  className="
                    text-tableCell
                    text-textDark/60
                    whitespace-nowrap
                  "
                >
                  {item.noOfRoomsAvailable ?? 0} Rooms Available
                </span>

              </div>

              {/* GRID */}
              <div
                className="
                  grid
                  grid-cols-3
                  gap-4
                "
              >

                {/* ROOMS */}
                <div>

                  <p
                    className="
                      text-tableCell
                      text-textDark/60
                    "
                  >
                    Rooms
                  </p>

                  <p
                    className="
                      font-semibold
                      text-sectionTitle
                      text-headingDark
                    "
                  >
                    {item.noOfRooms ?? 0}
                  </p>

                </div>

                {/* TOTAL BEDS */}
                <div>

                  <p
                    className="
                      text-tableCell
                      text-textDark/60
                    "
                  >
                    Total Beds
                  </p>

                  <p
                    className="
                      font-semibold
                      text-sectionTitle
                      text-headingDark
                    "
                  >
                    {item.noOfBeds ?? 0}
                  </p>

                </div>

                {/* OCCUPIED */}
                <div>

                  <p
                    className="
                      text-tableCell
                      text-textDark/60
                    "
                  >
                    Occupied
                  </p>

                  <p
                    className={`
                      font-semibold
                      text-sectionTitle
                      ${
                        item.noOfOccupiedBeds > 0
                          ? "text-successGreen"
                          : "text-textDark/40"
                      }
                    `}
                  >
                    {item.noOfOccupiedBeds ?? 0}
                  </p>

                </div>

              </div>

            </div>

          ))

      ) : (

        <div
          className="
            text-center
            py-6
            text-textDark/40
          "
        >
          No Sharing Data Found
        </div>

      )}

    </div>

  </div>

)}

{/* BILLING RULE */}
{showBillingRule && (

  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      px-4
    "
  >

    <div
      className="
        bg-white
        rounded-card
        w-full
        max-w-[360px]
        shadow-modal
        p-6
        relative
        animate-fadeIn
      "
    >

      {/* CLOSE */}
      <button
        onClick={() => setShowBillingRule(false)}
        className="
          absolute
          top-3
          right-3
          text-textDark/40
          hover:text-textDark
          cursor-pointer
        "
      >
        ✕
      </button>

      <h2
        className="
          text-cardTitle
          font-semibold
          text-headingDark
          mb-4
        "
      >
        Billing Rule
      </h2>

      <div
        className="
          border-t
          border-borderSoft
          pt-4
          space-y-4
        "
      >

        <div className="flex justify-between gap-4">

          <span className="text-textDark/60">
            Billing Start Date
          </span>

          <span
            className="
              font-semibold
              text-headingDark
            "
          >
            {hostelData?.billingRules[0]?.billingStartDate}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-textDark/60">
            Bill Due Days
          </span>

          <span
            className="
              font-semibold
              text-headingDark
            "
          >
            {hostelData?.billingRules[0]?.billDueDays}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-textDark/60">
            Notice Period
          </span>

          <span
            className="
              font-semibold
              text-headingDark
            "
          >
            {hostelData?.billingRules[0]?.noticePeriod}
          </span>

        </div>

      </div>

    </div>

  </div>

)}

{/* RESET MODAL */}
{showNoteModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      px-4
    "
    onClick={() => {

      setShowNoteModal(false);
      setNoteText("");
      setHostelError("");

    }}
  >

    <div
      className="
        bg-white
        rounded-card
        shadow-modal
        w-full
        max-w-md
        p-6
        relative
        animate-fadeIn
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* CLOSE */}
      <button
        onClick={() => {

          setShowNoteModal(false);
          setNoteText("");
          setHostelError("");

        }}
        className="
          absolute
          top-3
          right-3
          text-textDark/40
          hover:text-textDark
          cursor-pointer
        "
      >
        ✕
      </button>

      {/* TITLE */}
      <h2
        className="
          text-cardTitle
          font-semibold
          text-headingDark
          mb-4
          text-left
        "
      >
        Enter Hostel ID

        <span className="text-dangerRed">
          *
        </span>

      </h2>

      <div className="space-y-4">

        {/* INPUT */}
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
          className="
            w-full
            border
            border-borderSoft
            rounded-card
            px-3
            py-2
            text-cardTitle
            outline-none
            focus:border-primaryBlue
          "
        />

        {/* ERROR */}
        {hostelerror && (
          <ErrorMessage
            message={hostelerror}
            type="error"
          />
        )}

        {/* BUTTON */}
        <button
          onClick={handleHardReset}
          className="
            w-full
            bg-primaryBlue
            hover:bg-blue-700
            text-white
            py-2
            rounded-card
            text-cardTitle
            font-medium
            transition
            cursor-pointer
          "
        >
          Submit
        </button>

      </div>

    </div>

  </div>

)}
      {/* {showTrialModal && (
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
           
            <h2 className="text-lg font-semibold mb-4 text-left">
              Extend Trial
            </h2>
            <div className="relative">

            
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
      )} */}
  {showTrialModal && (

  <div
    className="
      fixed inset-0
      bg-black/40
      z-[99999]
    "
    onClick={() => {

      setShowTrialModal(false);
      setDays("");
      setDaysError("");

    }}
  >

    {/* DRAWER */}
    <div
      className="
        absolute
        top-4
        right-4
        bottom-4

        w-full
        max-w-[480px]

        bg-white
        rounded-2xl
        shadow-2xl

        flex
        flex-col

        overflow-hidden
        animate-slideLeft
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div
        className="
          flex items-center justify-between
          px-6 py-5
          border-b border-gray-200
          shrink-0
        "
      >

        <h2
          className="
            text-[22px]
            font-semibold
            text-gray-800
          "
        >
          Extend Trial Period
        </h2>

        <button
          onClick={() => {

            setShowTrialModal(false);
            setDays("");
            setDaysError("");

          }}
          className="
            w-8 h-8
            rounded-full
            flex items-center justify-center
            hover:bg-gray-100
            text-gray-500
            text-lg
            cursor-pointer
          "
        >
          ✕
        </button>

      </div>


    
      <div
        className="
          flex-1
          overflow-y-auto
          px-6 py-5
        "
      >

        
        <div
  className="
    bg-[#F9FAFB]
    rounded-xl
    p-5
    mb-6
    border border-[#F1F3F5]
  "
>

  {/* TITLE */}
  <p
    className="
      text-[13px]
      font-semibold
      text-[#6B7280]
      tracking-wide
      mb-5
      text-left
    "
  >
    PROPERTY INFO
  </p>

  {/* ROWS */}
  <div className="space-y-4">

    {/* CUSTOMER */}
    <div className="flex items-start gap-3">

      <img
        src={CustImag}
        className="w-4 h-4 mt-[2px] shrink-0"
      />

      <div className="flex items-center">

        <p
          className="
            w-[150px]
            text-[12px]
            text-[#6B7280]
            font-medium text-left
          "
        >
          Customer Name
        </p>

        <p
          className="
            text-[12px]
            font-semibold
            text-[#111827] text-left
          "
        >
         {hostelData.owner?.fullName}
        </p>

      </div>

    </div>


    {/* PROPERTY */}
    <div className="flex items-start gap-3">

      <img
        src={CustTenImg}
        className="w-4 h-4 mt-[2px] shrink-0"
      />

      <div className="flex items-center">

        <p
          className="
            w-[150px]
            text-[12px]
            text-[#6B7280]
            font-medium text-left
          "
        >
          Property Name
        </p>

        <p
          className="
            text-[12px]
            font-semibold
            text-[#1D4ED8] text-left
          "
        >
          {hostelData?.hostelName}
        </p>

      </div>

    </div>


    {/* LOCATION */}
    <div className="flex items-start gap-3">

      <img
        src={LocationGrey}
        className="w-4 h-4 mt-[2px] shrink-0"
      />

      <div className="flex items-center">

        <p
          className="
            w-[150px]
            text-[12px]
            text-[#6B7280]
            font-medium text-left
          "
        >
          Location
        </p>

        <p
          className="
            text-[12px]
            font-semibold
            text-[#111827]
          "
        >
           {hostelData.city}, {hostelData.state}
        </p>

      </div>

    </div>


    {/* MOBILE */}
    <div className="flex items-start gap-3">

      <img
        src={Call}
        className="w-4 h-4 mt-[2px] shrink-0"
      />

      <div className="flex items-center">

        <p
          className="
            w-[150px]
            text-[12px]
            text-[#6B7280]
            font-medium text-left
          "
        >
          Mobile
        </p>

        <p
          className="
            text-[12px]
            font-semibold
            text-[#111827]
          "
        >
         +91 {hostelData.mobile}
        </p>

      </div>

    </div>

  </div>

</div>


      
   <div className="flex items-start gap-3">

  {/* LEFT */}
  <div className="w-[140px] pt-1">

    <label
      className="
        text-xs
        font-medium
        text-gray-700
        leading-5
        text-left
        block
      "
    >
      Extension
      <br />
      Duration
      <span className="text-red-500 ml-1">
        *
      </span>
    </label>

  </div>


  {/* RIGHT */}
  <div className="pt-[2px]">

    <div
      className="
        flex
        items-center
        gap-8
        whitespace-nowrap
      "
    >

      {[
        { label: "+7 Days", value: 7 },
        { label: "+10 Days", value: 10 },
        { label: "+14 Days (Max)", value: 14 }
      ].map((item) => (

        <label
          key={item.value}
          className="
            flex items-center gap-2
            text-sm text-gray-700
            cursor-pointer
          "
        >

          <input
            type="radio"
            name="days"
            value={item.value}
            checked={Number(days) === item.value}
            onChange={(e) => {

              setDays(e.target.value);
              setDaysError("");

            }}
            className="accent-blue-600"
          />

          {item.label}

        </label>

      ))}

    </div>


    <div className="text-left">

  <button
    className="
      mt-3
      block
      text-xs
      text-blue-600
      hover:underline
      cursor-pointer
    "
  >
    Select Custom
  </button>

</div>

  </div>

</div>
 {daysError && (

          <div className="mt-4">

            <ErrorMessage
              message={daysError}
              type="error"
            />

          </div>

        )}
       
       <div className="flex items-start gap-6 mt-5">

 
  <div className=" pt-3">

    <label
      className="
        text-xs
        font-medium
        text-gray-700
        text-left
        block
      "
    >
      Reason
      <span className="text-red-500 ml-1">
        *
      </span>
    </label>

  </div>



  <div className="flex-1">

    <select
      className="
        w-full
        h-[48px]
        border
        border-gray-300
        rounded-xl
        px-4
        text-sm
        text-gray-700
        outline-none
        bg-white
        focus:border-blue-500
      "
    >

      <option>
        Sales Follow-up
      </option>

    </select>

  </div>

</div>


        {/* REMARKS */}
        <div className="flex items-start gap-6 mt-5">

  {/* LABEL */}
  <div className=" pt-3">

    <label
      className="
        text-xs
        font-medium
        text-gray-700
        text-left
        block
      "
    >
      Remarks
    </label>

  </div>


  {/* TEXTAREA */}
  <div className="flex-1">

    <textarea
      rows={4}
      placeholder="Add internal notes..."
      className="
        w-full
        min-h-[120px]
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        text-sm
        text-gray-700
        resize-none
        outline-none
        bg-white
        placeholder:text-gray-400
        focus:border-blue-500
      "
    />

  </div>

</div>


        {/* INFO */}
        <div
          className="
            bg-blue-50
            border border-blue-100
            rounded-xl
            px-4 py-3
            text-xs
            text-blue-700
          "
        >
          ℹ Maximum extension allowed: 14 days,
          Max 1 times per customer.
        </div>


        {/* ERROR */}
       

      </div>


      {/* FOOTER */}
      <div
        className="
          px-6 py-5
          border-t border-gray-200
          flex justify-end gap-3
          shrink-0
          bg-white
        "
      >

        <button
          onClick={() => {

            setShowTrialModal(false);
            setDays("");
            setDaysError("");

          }}
          className="
            px-5 py-2.5
            rounded-xl
            border border-gray-300
            text-gray-600
            hover:bg-gray-50
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          onClick={handleTrialWithDays}
          className="
            px-5 py-2.5
            rounded-xl
            bg-blue-600
            text-white
            hover:bg-blue-700
            cursor-pointer
          "
        >
          Confirm Extension
        </button>

      </div>

    </div>

  </div>

)}
      {showPlanModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      px-4
    "
    onClick={() => {

      setShowPlanModal(false);
      resetPlanForm();

    }}
  >

    <div
      className="
        bg-white
        rounded-modal
        shadow-modal
        w-full
        max-w-[400px]
        max-h-[90vh]
        overflow-y-auto
        p-6
        animate-fadeIn
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* TITLE */}
      <h2
        className="
          text-cardTitle
          font-semibold
          text-headingDark
          mb-5
          text-left
        "
      >
        Buy Subscription Plan
      </h2>

      {/* PLAN NAME */}
      <div
        className="
          relative
          w-full
          text-left
        "
        ref={dropdownRef}
      >

        <label
          className="
            block
            text-cardTitle
            text-textDark/70
            mb-1
            text-left
            font-medium
          "
        >
          Plan Name
        </label>

        <div
         onClick={() => {
  setShowDropdown(!showDropdown);
  setShowPaidByDropdown(false);
}}
          className="
            border
            border-borderSoft
            rounded-card
            px-3
            py-2.5
            cursor-pointer
            mb-3
            flex
            items-center
            justify-between
            bg-white
          "
        >

          <span
            className={`
              text-cardTitle
              ${
                planCode
                  ? "text-textDark"
                  : "text-textDark/40"
              }
            `}
          >
            {
              dropdownPlans?.otherPlans?.find(
                p => p.planCode === planCode
              )?.planName || "Select Plan"
            }
          </span>

          <svg
            className={`
              w-4
              h-4
              text-textDark/50
              transition-transform
              ${
                showDropdown
                  ? "rotate-180"
                  : ""
              }
            `}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>

        </div>

        {/* DROPDOWN */}
        {showDropdown && (

          <div
            className="
              absolute
              z-10
              mt-1
              w-full
              bg-white
              border
              border-borderSoft
              rounded-card
              shadow-dropdown
              max-h-40
              overflow-y-auto
            "
          >

            {dropdownPlans?.otherPlans?.length > 0 ? (

              dropdownPlans.otherPlans.map((plan) => (

                <div
                  key={plan.planId}
                  onClick={() => {

                    setPlanCode(plan.planCode);
                    setShowDropdown(false);
                    setPlanError("");
                   
                  

                  }}
                  className={`
                    px-3
                    py-2.5
                    cursor-pointer
                    text-cardTitle
                    flex
                    justify-between
                    items-center

                    ${
                      plan.planCode === planCode
                        ? "bg-primarySoft text-primaryBlue"
                        : "hover:bg-cardBg"
                    }
                  `}
                >

                  <span>{plan.planName}</span>

                  {plan.planCode === planCode && (
                    <span className="text-primaryBlue">
                      ✔
                    </span>
                  )}

                </div>

              ))

            ) : (

              <div
                className="
                  px-3
                  py-2
                  text-cardTitle
                  text-textDark/40
                "
              >
                No Plans Available
              </div>

            )}

          </div>

        )}

      </div>

      {/* PLAN ERROR */}
      {planError && (
        <ErrorMessage
          message={planError}
          type="error"
        />
      )}

      {/* STAFFS */}
      <div
        className="
          relative
          w-full
          text-left
          mt-3
        "
      >

        <label
          className="
            block
            text-cardTitle
            text-textDark/70
            mb-1
            text-left
            font-medium
          "
        >
          Staffs
        </label>

        <div
         onClick={() => {
  setShowPaidByDropdown(!showPaidByDropdown);
  setShowDropdown(false);
}}
          className="
            border
            border-borderSoft
            rounded-card
            px-3
            py-2.5
            cursor-pointer
            flex
            items-center
            justify-between
            bg-white
          "
        >

          <span
            className={`
              text-cardTitle
              ${
                paidBy
                  ? "text-textDark"
                  : "text-textDark/40"
              }
            `}
          >
            {
              paidByUsers.find(
                u => u.id === paidBy
              )?.name || "Select Paid By"
            }
          </span>

          <svg
            className={`
              w-4
              h-4
              text-textDark/50
              transition-transform
              ${
                showPaidByDropdown
                  ? "rotate-180"
                  : ""
              }
            `}
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

          <div
            className="
              absolute
              w-full
              bg-white
              border
              border-borderSoft
              rounded-card
              shadow-dropdown
              mt-1
              max-h-40
              overflow-y-auto
              z-[9999]
            "
          >

            {paidByUsers.map((user) => (

              <div
                key={user.id}
                onClick={() => {

                  setPaidBy(user.id);
                  setShowPaidByDropdown(false);
                  setPaidByError("");
                

                }}
                className={`
                  px-3
                  py-2.5
                  cursor-pointer
                  text-cardTitle
                  flex
                  justify-between
                  items-center

                  ${
                    paidBy === user.id
                      ? "bg-primarySoft text-primaryBlue"
                      : "hover:bg-cardBg"
                  }
                `}
              >

                <span>
                  {user.name} ({user.role})
                </span>

                {paidBy === user.id && (
                  <span>✔</span>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* STAFF ERROR */}
      {paidByError && (
        <ErrorMessage
          message={paidByError}
          type="error"
        />
      )}

      {/* PAID AMOUNT */}
      <div className="w-full mt-4">

        <label
          className="
            block
            text-cardTitle
            text-textDark/70
            mb-1
            text-left
            font-medium
          "
        >
          Paid Amount
        </label>

        <input
          type="number"
          placeholder={
            selectedPlanothers
              ? `₹${selectedPlanothers.finalPrice}`
              : "Paid Amount"
          }
          value={paidAmount}
          onChange={(e) => {

            setPaidAmount(e.target.value);
            setPaidAmountError("");
            setShowDropdown(false);
            setShowPaidByDropdown(false)

          }}
          className="
            w-full
            border
            border-borderSoft
            rounded-card
            px-3
            py-2.5
            text-cardTitle
            outline-none
            focus:border-primaryBlue
          "
        />

        {paidAmountError && (
          <ErrorMessage
            message={paidAmountError}
            type="error"
          />
        )}

      </div>

      {/* DISCOUNT */}
      <div className="w-full mt-4">

        <label
          className="
            block
            text-cardTitle
            text-textDark/70
            mb-1
            text-left
            font-medium
          "
        >
          Discount Amount
        </label>

        <input
          type="number"
          placeholder="Discount Amount"
          value={discountAmount}
          onChange={(e) => setDiscountAmount(e.target.value)}
          className="
            w-full
            border
            border-borderSoft
            rounded-card
            px-3
            py-2.5
            text-cardTitle
            outline-none
            focus:border-primaryBlue
          "
        />

      </div>

      {/* FILE UPLOAD */}
      <div className="w-full mt-5">

        <label
          className="
            flex
            flex-col
            items-center
            justify-center
            w-full
            h-32
            border-2
            border-dashed
            border-borderSoft
            rounded-card
            cursor-pointer
            hover:bg-cardBg
            transition
          "
        >

          <input
            type="file"
            className="hidden"
            onChange={(e) => {

              setPaymentProof(e.target.files[0]);
              setProofError("");

            }}
          />

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <svg
              className="
                w-8
                h-8
                mb-2
                text-textDark/30
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4" />
            </svg>

            <p
              className="
                text-cardTitle
                text-textDark/70
              "
            >
              <span
                className="
                  font-medium
                  text-primaryBlue
                "
              >
                Choose Image
              </span>

              {" "}to Upload
            </p>

            <p
              className="
                text-tableCell
                text-textDark/40
                mt-1
              "
            >
              JPG/JPEG Format
            </p>

          </div>

        </label>

        {/* FILE NAME */}
        {paymentProof && (

          <p
            className="
              text-cardTitle
              text-successGreen
              mt-2
            "
          >
            Selected: {paymentProof.name}
          </p>

        )}

      </div>

      {/* PROOF ERROR */}
      {proofError && (
        <ErrorMessage
          message={proofError}
          type="error"
        />
      )}

      {/* BUTTONS */}
      <div
        className="
          flex
          justify-end
          gap-3
          mt-5
        "
      >

        <button
          onClick={() => {

            setShowPlanModal(false);
            resetPlanForm();

          }}
          className="
            px-4
            py-2
            border
            border-borderSoft
            rounded-card
            text-textDark/70
            hover:bg-cardBg
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          disabled={subscriptionLoading}
          onClick={handleSubscription}
          className={`
            px-4
            py-2
            rounded-card
            text-white

            ${
              subscriptionLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primaryBlue cursor-pointer hover:bg-blue-700"
            }
          `}
        >
          {subscriptionLoading
            ? "Submit..."
            : "Submit"}
        </button>

      </div>

    </div>

  </div>

)}
      {/* {showTrialConfirm && (
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

         
          <div className="relative bg-white rounded-xl shadow-xl w-[350px] p-5 z-[10000]">



            <div className="mb-4 relative">

              <label className="text-sm text-gray-600 mb-1 block text-left">
                Select Plan
              </label>

           
              <div
                onClick={() => setShowTrialPlanDropdown(!showTrialPlanDropdown)}
                className="w-full border rounded-lg px-3 py-2 text-sm flex justify-between items-center cursor-pointer bg-white"
              >
                <span className={`${selectedPlanCode ? "text-gray-800" : "text-gray-400"}`}>
                  {dropdownPlans?.trialPlans?.find(p => p.planCode === selectedPlanCode)?.planName
                    ? `${dropdownPlans.trialPlans.find(p => p.planCode === selectedPlanCode).planName} - ${selectedPlanCode}`
                    : "Select Plan"}
                </span>

             
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
      )} */}
      {showTrialConfirm && (

  <div
    className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      px-4
    "
  >

    {/* OVERLAY */}
    <div
      className="
        absolute
        inset-0
        bg-black/40
      "
      onClick={() => setShowTrialConfirm(false)}
    />

    {/* MODAL */}
    <div
      className="
        relative
        bg-white
        rounded-modal
        shadow-modal
        w-full
        max-w-[320px]
        p-6
        z-[10000]
        animate-fadeIn
        border
        border-borderSoft
      "
    >

      {/* TITLE */}
      <h2
        className="
          text-cardTitle
          font-semibold
          text-headingDark
          mb-3
          text-center
        "
      >
        Extend Trial
      </h2>

      {/* DESCRIPTION */}
      <p
        className="
          text-cardTitle
          text-textDark/60
          mb-5
          text-center
          leading-6
        "
      >
        Are you sure you want to extend the trial?
      </p>

      {/* BUTTONS */}
      <div
        className="
          flex
          justify-end
          gap-3
        "
      >

        <button
          onClick={() => setShowTrialConfirm(false)}
          className="
            px-4
            py-2
            border
            border-borderSoft
            rounded-card
            text-cardTitle
            text-textDark/70
            hover:bg-cardBg
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          onClick={handleTrialOnly}
          className="
            px-4
            py-2
            bg-successGreen
            hover:bg-green-700
            text-white
            rounded-card
            text-cardTitle
            cursor-pointer
          "
        >
          Confirm
        </button>

      </div>

    </div>

  </div>

)}
      {showDeleteModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      px-4
    "
    onClick={() => {

      setShowDeleteModal(false);
      setMenuError("");
      setPhone("");

    }}
  >

    <div
      className="
        bg-white
        rounded-modal
        shadow-modal
        w-full
        max-w-[400px]
        p-6
        animate-fadeIn
        border
        border-borderSoft
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* TITLE */}
      <h2
        className="
          text-cardTitle
          font-semibold
          text-headingDark
          mb-3
          text-left
        "
      >
        Delete Tenant
      </h2>

      {/* DESCRIPTION */}
      <p
        className="
          text-cardTitle
          text-textDark/60
          mb-4
          text-left
          leading-6
        "
      >
        Please enter tenant mobile number to confirm
      </p>

      {/* PHONE INPUT */}
      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => {

          const value = e.target.value.replace(
            /\D/g,
            ""
          );

          if (value.length <= 10) {
            setPhone(value);
          }
          setMenuError("")

        }}
        maxLength={10}
        className="
          w-full
          border
          border-borderSoft
          rounded-card
          px-3
          py-2.5
          text-cardTitle
          outline-none
          focus:border-primaryBlue
          mb-3
        "
      />

      {/* ERROR */}
      {menuError && (

        <ErrorMessage
          message={menuError}
          type="error"
        />

      )}

      {/* BUTTONS */}
      <div
        className="
          flex
          justify-end
          gap-3
          mt-5
        "
      >

        <button
          onClick={() => {

            setShowDeleteModal(false);
            setMenuError("");
            setPhone("");

          }}
          className="
            px-4
            py-2
            border
            border-borderSoft
            rounded-card
            text-textDark/70
            hover:bg-cardBg
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteTenant}
          className="
            px-4
            py-2
            bg-primaryBlue
            hover:bg-blue-700
            text-white
            rounded-card
            cursor-pointer
          "
        >
          Submit
        </button>

      </div>

    </div>

  </div>

)}
      {showAgentModal && (

  <div
    className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      px-4
    "
  >

    {/* OVERLAY */}
    <div
      className="
        absolute
        inset-0
        bg-black/40
      "
      onClick={() => setShowAgentModal(false)}
    />

    
    <div
      className="
        relative
        bg-white
        rounded-modal
        shadow-modal
        w-full
        max-w-[700px]
        max-h-[80vh]
        overflow-hidden
        z-[10000]
        animate-fadeIn
        border
        border-borderSoft
      "
    >

     
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-4
          border-b
          border-borderSoft
        "
      >

        <h2
          className="
            text-sectionTitle
            font-semibold
            text-headingDark
          "
        >
          Agent Details
        </h2>

        <button
          onClick={() => setShowAgentModal(false)}
          className="
            text-textDark/40
            hover:text-dangerRed
            text-xl
            cursor-pointer
          "
        >
          ✕
        </button>

      </div>

      
      <div
        className="
          overflow-x-auto
          overflow-y-auto
          max-h-[65vh]
        "
      >

        <table className="w-full">

         
          <thead
            className="
              bg-cardBg
              sticky
              top-0
              z-10
            "
          >

            <tr>

              {[
                "Agent Name",
                "Reason",
                "Created By",
                "Date"
              ].map((header) => (

                <th
                  key={header}
                  className="
                    px-4
                    py-3
                    text-left
                    whitespace-nowrap
                  "
                >

                  <div
                    className="
                      text-tableHeader
                      uppercase
                      font-semibold
                      text-textDark/60
                      tracking-wide
                    "
                  >
                    {header}
                  </div>

                </th>

              ))}

            </tr>

          </thead>

          
          <tbody className="divide-y divide-borderSoft">

            {hostelData?.relationalAgents?.length > 0 ? (

              hostelData.relationalAgents.map((item, i) => (

                <tr
                  key={i}
                  className="
                    hover:bg-cardBg
                    transition-all
                  "
                >

                  {/* AGENT NAME */}
                  {/* <td
                    className="
                      px-4
                      py-3
                      text-cardTitle
                      font-small
                      text-headingDark
                      whitespace-nowrap text-left
                    "
                  >
                    {item.agentName || "N/A"}
                  </td> */}
                  <td
  onClick={() => {
    if (item.agentId) {
      navigate(`/iam-user/${item.agentId}`);
    }
  }}
  className="
    px-4
    py-3
    text-cardTitle
    font-small
    text-primaryBlue
    whitespace-nowrap
    text-left
    cursor-pointer
    hover:underline
  "
>
  {item.agentName || "N/A"}
</td>

                  
                  <td
                    className="
                      px-4
                      py-3
                      text-cardTitle
                      text-textDark/70
                      min-w-[180px]
                    "
                  >
                    {item.reason || "N/A"}
                  </td>

                  {/* CREATED BY */}
                  <td
                    className="
                      px-4
                      py-3
                      text-cardTitle
                      text-textDark/70
                      whitespace-nowrap
                    "
                  >
                    {item.createdBy || "N/A"}
                  </td>

                  {/* DATE */}
                  <td
  className="
    px-4
    py-3
    text-cardTitle
    text-textDark/70 text-start
  "
>

  <div className="flex flex-col">

    <span className="whitespace-nowrap">
      {item.createdAtDate || "N/A"}
    </span>

    <span
      className="
        text-[11px]
        text-textDark/50
        mt-[2px]
      "
    >
      {item.createdAtTime || ""}
    </span>

  </div>

</td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="
                    text-center
                    py-8
                    text-textDark/40
                    text-cardTitle
                  "
                >
                  No Data Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>

)}
     
      {showPaymentDrawer && (

  <div className="fixed inset-0 z-[9999]">

    
    <div
      className="
        absolute
        inset-0
        bg-black/40
      "
      onClick={() => {

        setShowPaymentDrawer(false);

        setPaymentPlan("");
        setPaymentAmount("");
        setPaymentDiscount("");

        setPaymentPlanError("");
        setPaymentAmountError("");
        setPaymentDiscountError("");

        setGeneratedPaymentUrl("");
        setShowPaidByDropdownGenerate(false)
        setPaidBy()

      }}
    />

    
    <div
      className="
        absolute
        top-4
        right-4
        bottom-4
        w-[450px]
        bg-white
        shadow-modal
        rounded-modal
        flex
        flex-col
        animate-slideLeft
        border
        border-borderSoft
      "
      onClick={(e) => e.stopPropagation()}
    >

      
      <div
        className="
          px-6
          py-5
          border-b
          border-borderSoft
          flex
          items-start
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-sectionTitle
              font-semibold
              text-headingDark
              text-left
            "
          >
            Generate Payment
          </h2>

          <p
            className="
              text-cardTitle
              text-textDark/60
              mt-1
            "
          >
            Create payment for subscription plan
          </p>

        </div>

        <button
          onClick={() => {

            setShowPaymentDrawer(false);

            setPaymentPlan("");
            setPaymentAmount("");
            setPaymentDiscount("");

            setPaymentPlanError("");
            setPaymentAmountError("");
            setPaymentDiscountError("");

            setGeneratedPaymentUrl("");

          }}
          className="
            text-textDark/40
            hover:text-dangerRed
            text-2xl
            cursor-pointer
          "
        >
          ✕
        </button>

      </div>

     
      <div
        className="
          flex-1
          overflow-y-auto
          px-6
          py-5
        "
      >

        
        <div className="mb-5">

          <label
            className="
              block
              text-cardTitle
              font-medium
              text-textDark
              mb-2
              text-left
            "
          >
            Plan Name

            <span className="text-dangerRed">
              *
            </span>

          </label>

          <div className="relative">

  
  <div
    onClick={() => setShowDropdown(!showDropdown)}
    className="
      w-full
      h-[43px]
      border
      border-borderSoft
      rounded-card
      px-4
      cursor-pointer
      bg-white
      flex
      items-center
      justify-between
    "
  >

    <span
      className={`
        text-cardTitle
        ${
          paymentPlan
            ? "text-textDark"
            : "text-textDark/40"
        }
      `}
    >
      {
        dropdownPlans?.otherPlans?.find(
          item => item.planCode === paymentPlan
        )?.planName || "Select Plan"
      }
    </span>

    <img
      src={ArrowSelect}
      className={`
        w-4
        h-4
        transition-transform
        ${
          showDropdown
            ? "rotate-180"
            : ""
        }
      `}
    />

  </div>

  {/* DROPDOWN */}
  {showDropdown && (

    <div
      className="
        absolute
        top-full
        left-0
        mt-2
        w-full
        bg-white
        border
        border-borderSoft
        rounded-card
        shadow-dropdown
        max-h-48
        overflow-y-auto
        z-50
      "
    >

      <div
        onClick={() => {

          setPaymentPlan("");
          setShowDropdown(false);

        }}
        className="
          px-4
          py-3
          cursor-pointer
          hover:bg-cardBg
          text-cardTitle
          text-textDark/50
        "
      >
        Select Plan
      </div>

      {dropdownPlans?.otherPlans?.map((item) => (

        <div
          key={item.planId}
          onClick={() => {

            setPaymentPlan(item.planCode);
            setPaymentPlanError("");
            setPaymentAmount("");

            setShowDropdown(false);

          }}
          className={`
            px-4
            py-3
            cursor-pointer
            text-cardTitle
            flex
            items-center
            justify-between

            ${
              paymentPlan === item.planCode
                ? "bg-primarySoft text-primaryBlue"
                : "hover:bg-cardBg"
            }
          `}
        >

          <span>
            {item.planName}
          </span>

          {paymentPlan === item.planCode && (
            <span>✔</span>
          )}

        </div>

      ))}

    </div>

  )}

</div>

          {paymentPlanError && (

            <ErrorMessage
              message={paymentPlanError}
              type="error"
            />

          )}

        </div>

        {/* PAID BY */}
<div className="mb-5">

  <label
    className="
      block
      text-cardTitle
      font-medium
      text-textDark
      mb-2
      text-left
    "
  >
    Paid By

    <span className="text-dangerRed">
      *
    </span>

  </label>

  <div className="relative">

    {/* SELECT BOX */}
    <div
      onClick={() =>
        setShowPaidByDropdownGenerate(
          !showPaidByDropdownGenerate
        )
      }
      className="
        w-full
        h-[43px]
        border
        border-borderSoft
        rounded-card
        px-4
        cursor-pointer
        bg-white
        flex
        items-center
        justify-between
      "
    >

      <span
        className={`
          text-cardTitle
          ${
            paidBy
              ? "text-textDark"
              : "text-textDark/40"
          }
        `}
      >

        {
          paidByUsers?.find(
            item => item.id === paidBy
          )?.name || "Select Paid By"
        }

      </span>

      <img
        src={ArrowSelect}
        className={`
          w-4
          h-4
          transition-transform
          ${
            showPaidByDropdownGenerate
              ? "rotate-180"
              : ""
          }
        `}
      />

    </div>

    {/* DROPDOWN */}
    {showPaidByDropdownGenerate && (

      <div
        className="
          absolute
          top-full
          left-0
          mt-2
          w-full
          bg-white
          border
          border-borderSoft
          rounded-card
          shadow-dropdown
          max-h-48
          overflow-y-auto
          z-50
        "
      >

        {paidByUsers?.map((item) => (

          <div
            key={item.id}
            onClick={() => {

              setPaidBy(item.id);

              setPaidByError("");

              setShowPaidByDropdownGenerate(false);

            }}
            className={`
              px-4
              py-3
              cursor-pointer
              text-cardTitle
              flex
              items-center
              justify-between

              ${
                paidBy === item.id
                  ? "bg-primarySoft text-primaryBlue"
                  : "hover:bg-cardBg"
              }
            `}
          >

            <div className="flex flex-col">

              <span>
                {item.name}
              </span>

              <span
                className="
                  text-[11px]
                  text-textDark/50
                "
              >
                {item.role}
              </span>

            </div>

            {paidBy === item.id && (
              <span>✔</span>
            )}

          </div>

        ))}

      </div>

    )}

  </div>

  {paidByError && (

    <ErrorMessage
      message={paidByError}
      type="error"
    />

  )}

</div>
        <div className="mb-5">

          <label
            className="
              block
              text-cardTitle
              font-medium
              text-textDark
              mb-2
              text-left
            "
          >
            Amount

            <span className="text-dangerRed">
              *
            </span>

          </label>

          <input
            type="text"
            readOnly
            placeholder={
              selectedPaymentPlan
                ? `₹${selectedPaymentPlan.finalPrice}`
                : "Amount"
            }
            value={
              paymentAmount ||
              (
                selectedPaymentPlan
                  ? selectedPaymentPlan.finalPrice
                  : ""
              )
            }
            className="
              w-full
              h-[43px]
              border
              border-borderSoft
              rounded-card
              px-4
              bg-cardBg
              text-textDark/70
              cursor-not-allowed
              outline-none
            "
          />

          {paymentAmountError && (

            <ErrorMessage
              message={paymentAmountError}
              type="error"
            />

          )}

        </div>

        
        <div className="mb-5">

          <label
            className="
              block
              text-cardTitle
              font-medium
              text-textDark
              mb-2
              text-left
            "
          >
            Discount

            <span className="text-dangerRed">
              *
            </span>

          </label>

          <input
            placeholder="Enter Discount"
            value={paymentDiscount}
            onChange={(e) => {

              let value = e.target.value.replace(
                /[^0-9.]/g,
                ""
              );

              const parts = value.split(".");

              if (parts.length > 2) {

                value =
                  parts[0] +
                  "." +
                  parts.slice(1).join("");

              }

              setPaymentDiscount(value);
              setPaymentDiscountError("");

            }}
            className="
              w-full
              h-[43px]
              border
              border-borderSoft
              rounded-card
              px-4
              outline-none
              text-cardTitle
              focus:border-primaryBlue
            "
          />

        </div>

        {paymentDiscountError && (

          <ErrorMessage
            message={paymentDiscountError}
            type="error"
          />

        )}

      
{generatedPaymentUrl && (
  <div className="w-full mt-4">

    <label
      className="
        block
        text-cardTitle
        text-textDark/70
        mb-1
        text-left
        font-medium
      "
    >
      Payment URL
    </label>

    <div className="relative">

      <textarea
        value={generatedPaymentUrl}
        readOnly
        rows={4}
        className="
          w-full
          border
          border-borderSoft
          rounded-card
          px-3
          py-3
          pr-12
          text-primaryBlue
          text-cardTitle
          outline-none
          resize-none
        "
      />

      
      <button
        onClick={() => {
          navigator.clipboard.writeText(
            generatedPaymentUrl
          );

          setModalType("success");
          setMessage("Link copied");
          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
          }, 1200);
        }}
        className="
          absolute
          top-2
          right-2
          w-8
          h-8
          flex
          items-center
          justify-center
          rounded-lg
          bg-cardBg
          hover:bg-gray-200
          transition-all
          duration-200
          cursor-pointer
        "
      >
        <img src={CopyImg} className="w-4 h-4"/>
      </button>

    </div>

  </div>
)}

      </div>

      {/* FOOTER */}
      <div
        className="
          border-t
          border-borderSoft
          px-6
          py-4
          flex
          justify-end
          gap-3
        "
      >

        <button
          onClick={() => {

            setShowPaymentDrawer(false);

            setPaymentPlan("");
            setPaymentAmount("");
            setPaymentDiscount("");

            setPaymentPlanError("");
            setPaymentAmountError("");
            setPaymentDiscountError("");

            setGeneratedPaymentUrl("");

          }}
          className="
            px-5
            py-2.5
            border
            border-borderSoft
            rounded-card
            text-textDark/70
            hover:bg-cardBg
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          onClick={handleGeneratePayment}
          className="
            px-6
            py-2.5
            bg-primaryBlue
            hover:bg-blue-700
            text-white
            rounded-card
            cursor-pointer
          "
        >
          Generate
        </button>
{generatedPaymentUrl && (

  <button
    onClick={handleSharePayment}
    className="
      w-10
      h-10
      flex
      items-center
      justify-center
      rounded-full
      bg-green-500
      hover:bg-green-600
      text-white
      cursor-pointer
      transition-all
      duration-200
      shadow-card
    "
    title="Share Payment Link"
  >

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="w-5 h-5 fill-current"
    >

      <path d="M16 .396C7.164.396 0 7.56 0 16.396c0 2.82.737 5.57 2.137 7.992L0 32l7.828-2.053a15.93 15.93 0 0 0 8.172 2.242c8.836 0 16-7.164 16-16S24.836.396 16 .396zm0 29.09a13.1 13.1 0 0 1-6.672-1.832l-.477-.281-4.645 1.219 1.238-4.527-.312-.492a13.045 13.045 0 0 1-2.012-7.016c0-7.223 5.879-13.102 13.102-13.102 3.5 0 6.793 1.363 9.266 3.836a13.02 13.02 0 0 1 3.836 9.266c0 7.223-5.879 13.102-13.102 13.102zm7.188-9.844c-.394-.199-2.332-1.152-2.695-1.285-.363-.133-.629-.199-.895.199-.266.394-1.027 1.285-1.258 1.551-.23.266-.465.297-.859.098-.394-.199-1.664-.613-3.172-1.953-1.172-1.043-1.965-2.332-2.195-2.727-.23-.394-.024-.609.172-.808.176-.176.394-.465.594-.695.199-.23.266-.394.398-.66.133-.266.066-.496-.031-.695-.098-.199-.895-2.156-1.227-2.953-.324-.777-.652-.672-.895-.684l-.762-.012c-.266 0-.695.098-1.059.496-.363.394-1.391 1.359-1.391 3.312 0 1.953 1.426 3.84 1.625 4.105.199.266 2.809 4.289 6.805 6.016.949.41 1.688.656 2.266.84.953.305 1.82.262 2.504.159.764-.114 2.332-.953 2.66-1.875.328-.922.328-1.711.23-1.875-.098-.164-.363-.262-.758-.461z" />

    </svg>

  </button>

)}
      </div>

    </div>

  </div>

)}
    </DashboardLayout>
  );
};

export default PropertyOverview;
