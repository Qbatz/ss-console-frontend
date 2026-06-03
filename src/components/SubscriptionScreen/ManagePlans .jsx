import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePlan } from "../../Context/PlanContexts";
import rightsideimage from "../../assets/rightsidelogo.png";
import Tick from "../../assets/TickIcon.png";
import discoutshape from "../../assets/discountShape.png";
import Edit from "../../assets/edit-2.png";
import Dots from "../../assets/menucircle.png";
import Toast from "../../components/SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";


// const plans = [
//   {
//     name: "Basic Plan",
//     price: 599,
//     yearly: 7188,
//     active: true,
//     features: [
//       "Dashboard & Property Management",
//       "Tenant & Room Management",
//       "Asset and Expenses Management",
//       "Auto Recurring Invoices",
//       "Complaint Management",
//       "Due Reminders (In-App & Email)",
//       "EB Calculation",
//       "Rent Collection Tracking",
//       "Reports & Insights",
//     ],
//   },
//   {
//     name: "Premium Plan",
//     price: 999,
//     yearly: 11988,
//     active: true,
//     features: [
//       "Dashboard & Property Management",
//       "Tenant & Room Management",
//       "Asset and Expenses Management",
//       "Auto Recurring Invoices",
//       "Complaint Management",
//       "Due Reminders (In-App & Email)",
//       "EB Calculation",
//       "Rent Collection Tracking",
//       "Reports & Insights",
//       "Secure Cloud Storage",
//       "Unlimited Staff Access",
//     ],
//   },
// ];

const ManagePlans = () => {
  const navigate = useNavigate();

  const { plans, getPlans, deactivatePlan, errorMsg, accessError, reactivatePlan } = usePlan();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [deleteError, setDeleteError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const menuRef = useRef(null);
  console.log("errorMsg", errorMsg)
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Plans");
  const toggleMenu = (id) => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };
  const location = useLocation();
  useEffect(() => {
    getPlans();
  }, []);

  console.log("plans", plans)
  const handleConfirmDeactivate = async () => {
    if (!selectedPlanId) return;

    const res = await deactivatePlan(selectedPlanId);

    if (res.success) {
      setModalType("success");
      setMessage(res?.message);
      setShowSuccess(true);
      getPlans();
      setShowModal(false);
      setTimeout(() => {
        setShowSuccess(false);

      }, 800);

    }
    else {
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);
      setDeleteError(res.message)
      setSelectedPlanId(null);
      setTimeout(() => {
        setShowSuccess(false);

      }, 800);
    }


  };
  const handleReactivatePlan = async (planId) => {
    const res = await reactivatePlan(planId);

    if (res.success) {
      setModalType("success");
      setMessage("Plan reactivated successfully");
      setShowSuccess(true);

      getPlans();

      setTimeout(() => {
        setShowSuccess(false);
      }, 800);
    } else {
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 800);
    }

    setOpenMenuId(null);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null); // close menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      {(canRead === false || errorMsg === "Access Restricted") ? (

        <div className="flex flex-col items-center justify-center h-[400px] gap-4">

          <img
            src={LoginImg}
            alt="Access Restricted"
            className="w-64 object-contain"
          />

          <p className="text-red-600 text-lg font-medium">
            {accessError}
          </p>

        </div>

      ) : (
        <>
          <div className="bg-[#F8FAFC] min-h-screen w-full">

            {/* HEADER */}
            {/* <div className="w-full px-4 sm:px-6 py-4 bg-white border-b border-gray-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
    <div className="flex items-center gap-3">
      <ArrowLeft size={18} onClick={() => navigate(-1)} className="cursor-pointer" />

      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Manage Plans
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Subscriptions &gt; Manage Plans
        </p>
      </div>
    </div>

   
    <button
  onClick={() => navigate("/add-plan")}
  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
>
  + Add New Plan
</button>
  </div> */}
            <div className="w-full bg-white border-b border-gray-300 px-4 sm:px-6 py-3">

              <div className="flex items-center justify-between">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-6">

                  {/* BACK + TITLE */}
                  <div className="flex items-center gap-3">
                    <ArrowLeft
                      size={18}
                      onClick={() => navigate(-1)}
                      className="cursor-pointer text-gray-600"
                    />

                    <div>
                      <h1 className="text-base sm:text-lg font-semibold text-gray-800 text-left" >
                        Manage Plans
                      </h1>
                      <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                        Subscriptions &gt; Manage Plans
                      </p>
                    </div>
                  </div>

                  {/* 🔥 TABS (SAME ROW) */}
                  <div className="hidden sm:flex items-center gap-6 ml-6">
                    <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                      Plans List
                    </button>

                    <button className="text-sm text-gray-400 pb-1">
                      Approvals
                    </button>
                  </div>

                </div>

                {/* RIGHT SIDE BUTTON */}
                {/* <button
              onClick={() => navigate("/add-plan")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              + Add New Plan
            </button> */}
                <button
                  onClick={() => navigate("/add-plan")}
                  disabled={!canWrite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
  ${!canWrite
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    }`}
                >
                  + Add New Plan
                </button>

              </div>

            </div>

            {/* CONTENT */}
            <div className="max-w-[1280px] mx-auto px-6 py-6">


              {/* <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-5 lg:p-6 mb-6 shadow-sm">

  <p className="text-[11px] sm:text-xs text-gray-400 mb-2">
    TOTAL RECURRING REVENUE
  </p>

  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">

   
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        ₹1,366,850.00
      </h2>
      <span className="inline-block mt-2 text-[11px] sm:text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
        +12.5%
      </span>
    </div>

  
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-500">
      <div>
        <p>Active Subscribers</p>
        <p className="text-gray-900 font-semibold text-sm sm:text-base mt-1">
          182
        </p>
      </div>

      <div>
        <p>Average Recurring/Month</p>
        <p className="text-gray-900 font-semibold text-sm sm:text-base mt-1">
          ₹109,018
        </p>
      </div>
    </div>

  </div>
</div> */}
              <div className="relative bg-white border border-gray-200 rounded-xl px-5 py-4 mb-4 shadow-sm overflow-hidden">

                {/* IMAGE */}
                <img
                  src={rightsideimage}
                  alt="graph"
                  className="absolute right-0 top-0 h-[80px] max-w-[180px] opacity-3 pointer-events-none"
                />

                {/* CONTENT */}
                <div className="relative z-10 flex items-center gap-8">

                  {/* LEFT */}
                  <div className="min-w-[200px]">
                    <p className="text-[11px] text-gray-400 mb-1 tracking-wide">
                      TOTAL RECURRING REVENUE
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                      ₹0
                    </h2>

                    <span className="inline-block mt-1 text-[11px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      +12.5%
                    </span>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-8 text-xs text-gray-500">

                    <div>
                      <p>Active Subscribers</p>
                      <p className="text-gray-900 font-semibold text-sm mt-0.5">
                        182
                      </p>
                    </div>

                    <div>
                      <p>Average Recurring/Month</p>
                      <p className="text-gray-900 font-semibold text-sm mt-0.5">
                        ₹109,018
                      </p>
                    </div>

                  </div>

                </div>
              </div>


              {/* <h2 className="text-lg font-semibold text-gray-800 mb-4 text-left">
            Active plans
          </h2> */}
              {/* <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                    }`}
                >
                  Active Plans
                </button>

                <button
                  onClick={() => setActiveTab("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "inactive"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                    }`}
                >
                  Inactive Plans
                </button>
              </div> */}
              <div className="mb-5 border-b border-gray-200">
  <div className="flex items-center gap-6">

    <button
      onClick={() => setActiveTab("active")}
      className={`pb-3 text-sm font-medium border-b-2 transition cursor-pointer
      ${
        activeTab === "active"
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-blue-600"
      }`}
    >
      Active Plans
    </button>

    <button
      onClick={() => setActiveTab("inactive")}
      className={`pb-3 text-sm font-medium border-b-2 transition cursor-pointer
      ${
        activeTab === "inactive"
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-blue-600"
      }`}
    >
      Inactive Plans
    </button>

  </div>
</div>

              {/* TOGGLE */}
              <div className="mb-6 text-left">
                <div className="inline-flex bg-gray-100 p-1 rounded-full">
                  <button className="px-5 py-1.5 text-sm bg-blue-600 text-white rounded-full">
                    Monthly
                  </button>
                  <button className="px-5 py-1.5 text-sm text-gray-500">
                    Yearly <span className="text-xs">-20% off</span>
                  </button>
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {(
                  activeTab === "active"
                    ? plans?.activePlans
                    : plans?.inActivePlans
                )?.map((plan) => {
                  // const yearlyPrice = plan.finalPrice * 12;

                  const uniqueFeatures = [
                    ...new Map(
                      plan.planFeatures.map(item => [item.featureName, item])
                    ).values()
                  ];

                  return (
                    <div
                      key={plan.planId}
                      className="bg-white border border-gray-300 rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition h-full"
                    >

                      <div>

                        {/* NAME + ACTIVE */}
                        <div className="flex justify-between items-center mb-1 relative">

                          <h3 className="text-base font-semibold text-gray-800 font-sans">
                            {plan.planName}
                          </h3>

                          <div className="flex items-center gap-2">

                            {plan.shouldShow && (
                              <span className="text-[10px] font-medium bg-[#DEE1FF] text-[#0031c5] px-3 py-1 rounded-full font-sans">
                                {activeTab === "active" ? "Active" : "Inactive"}
                              </span>
                            )}

                            {/* DOTS ICON */}
                            <img
                              src={Dots}
                              alt="menu"
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => toggleMenu(plan.planId)}
                            />

                          </div>

                          {/* DROPDOWN MENU */}
                          {openMenuId === plan.planId && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-8 bg-white border rounded-lg shadow-md w-32 z-10"
                            >
                              {/* <button
      onClick={() => {
        setSelectedPlanId(plan.planId);
        setShowModal(true);
        setOpenMenuId(null);
      }}
      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
    >
      Delete
    </button> */}
                              {/* <button
                                onClick={() => {
                                  setSelectedPlanId(plan.planId);
                                  setShowModal(true);
                                  setOpenMenuId(null);
                                }}
                                disabled={!canDelete}
                                className={`w-full text-left px-3 py-2 text-sm
  ${!canDelete
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-red-500 hover:bg-gray-100 cursor-pointer"
                                  }`}
                              >
                                Delete
                              </button> */}
                              {activeTab === "active" && (
                                <button
                                  onClick={() => {
                                    setSelectedPlanId(plan.planId);
                                    setShowModal(true);
                                    setOpenMenuId(null);
                                  }}
                                  disabled={!canDelete}
                                  className={`w-full text-left px-3 py-2 text-sm
    ${!canDelete
                                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                      : "text-red-500 hover:bg-gray-100 cursor-pointer"
                                    }`}
                                >
                                  InActive
                                </button>
                              )}
                              {activeTab === "inactive" && (
                                <button
                                  onClick={() => {
                                    setSelectedPlanId(plan.planId);
                                    setShowReactivateModal(true);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-gray-100 cursor-pointer"
                                >
                                  Reactivate
                                </button>
                              )}

                            </div>
                          )}

                        </div>




                        <div className="mb-5 text-left">
                          <div className="flex items-start gap-2">

                            {/* FINAL PRICE */}
                            <span className="font-bold text-[22px] text-gray-900 leading-none">
                              ₹{plan.finalPrice}
                            </span>

                            {/* MONTH + GST INFO */}
                            <div className="flex flex-col leading-tight">
                              <span className="text-sm text-gray-500">
                                /month
                              </span>


                            </div>


                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            billed yearly as ₹{plan?.yearlyPrice}
                          </span>

                          <p className="text-xs text-gray-400 mt-1">

                            ₹{plan.price} + {plan.gst}% GST

                          </p>
                        </div>

                        {/* FEATURES */}
                        <ul className="space-y-3 text-sm text-gray-600 min-h-[180px]">
                          {uniqueFeatures.map((f, i) => (
                            <li key={i} className="flex items-start gap-3 text-left whitespace-nowrap">
                              {/* <span className="text-blue-600 mt-1 text-xs">■</span> */}
                              <img src={Tick} className="w-4 h-4 mt-0" />
                              {f.featureName}
                            </li>
                          ))}
                        </ul>

                      </div>


                      <div className="mt-6 space-y-2">
                        <div className="w-full">
                          {/* <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer">

                        <img
                          src={discoutshape}
                          alt="discount"
                          className="h-4 w-4"
                        />

                        Create Offer
                      </button> */}
                          <button
                            onClick={() => navigate("/create-offer", { state: { plan } })}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg"
                          >
                            <img
                              src={discoutshape}
                              alt="discount"
                              className="h-4 w-4"
                            />
                            Create Offer
                          </button>
                        </div>


                        {/* <button
                      onClick={() => navigate("/add-plan", { state: { plan } })}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
                    >
                      <img src={Edit} alt="edit" className="h-4 w-4" />
                      Edit Plan
                    </button> */}
                        <button
                          onClick={() => navigate("/add-plan", { state: { plan } })}
                          disabled={!canUpdate}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition
  ${!canUpdate
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                            }`}
                        >
                          <img src={Edit} alt="edit" className="h-4 w-4" />
                          Edit Plan
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </>
      )}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-xl shadow-lg w-[320px] p-5 z-10">

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Deactivate Plan
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to deactivate this plan?
            </p>
            {deleteError && (
              <ErrorMessage message={deleteError} type="error" />
            )}
            <div className="flex justify-end gap-3">

              {/* Cancel */}
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPlanId(null);
                  setDeleteError("")
                }}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>


              {/* OK */}
              <button
                onClick={handleConfirmDeactivate}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                OK
              </button>

            </div>
          </div>
        </div>
      )}
      {showReactivateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">


          <div className="absolute inset-0 bg-black/40"></div>


          <div className="relative bg-white rounded-xl shadow-lg w-[320px] p-5 z-10">

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Reactivate Plan
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to reactivate this plan?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowReactivateModal(false);
                  setSelectedPlanId(null);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                onClick={async () => {
                  await handleReactivatePlan(selectedPlanId);

                  setShowReactivateModal(false);
                  setSelectedPlanId(null);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Reactivate
              </button>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManagePlans;