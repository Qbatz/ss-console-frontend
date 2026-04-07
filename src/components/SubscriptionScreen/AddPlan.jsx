import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlan } from "../../Context/PlanContexts";
import PlanImg from "../../assets/bookcheck.png";
import trash from "../../assets/trash.png";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const defaultFeatures = [
  "Dashboard & Property Management",
  "Tenant & Room Management",
  "Asset and Expenses Management",
  "Complaint Management",
  "Due Reminders (In-App & Email)",
  "EB Calculation",
  "Rent Collection Tracking",
  "Reports & Insights",
  "WhatsApp Integration",
  "KYC Module",
  "Rental Agreement + Legal E-Sign",
  "Payment Gateway",
];

const AddEditPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plans, getPlans, createPlan, updatePlan, deactivatePlanFeature, addPlanFeature } = usePlan();
  useEffect(() => {
    getPlans();
  }, []);

  const editData = location.state?.plan || null;
  console.log("editData", editData)

  const [planType, setPlanType] = useState("");
  const [planCode, setPlanCode] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [canCustomize, setCanCustomize] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const [addons, setAddons] = useState([]);
  const [planName, setPlanName] = useState("");
  const [features, setFeatures] = useState({});
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [planNameError, setPlanNameError] = useState("")
  const [planTypeError, setPlanTypeError] = useState("")
  const [planCodeError, setPlanCodeError] = useState("")
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedAddonIndex, setSelectedAddonIndex] = useState(null);
  const [initialAddons, setInitialAddons] = useState([]);

  // INIT FEATURES
  useEffect(() => {
    const initial = {};

    defaultFeatures.forEach(f => {
      const exists = editData?.planFeatures?.some(
        pf => pf.featureName === f
      );
      initial[f] = editData ? exists : true;
    });

    if (editData) {
      setPlanName(editData.planName);
      setPrice(editData.price);
      setPlanType(editData.planType);
      setPlanCode(editData.planCode);
      setDuration(editData.duration);
      setDiscount(editData.discountPercentage);
      setCanCustomize(editData.canCustomize);
      setShouldShow(editData.shouldShow);


      const addonData = editData.planFeatures.map(f => ({
        name: f.featureName,
        price: f.price,
        planFeatureId: f.planFeatureId
      }));;

      setAddons(addonData);
    }

    setFeatures(initial);
  }, [editData]);
  useEffect(() => {
  if (editData) {
    const addonData = editData.planFeatures.map(f => ({
      name: f.featureName,
      price: f.price,
      planFeatureId: f.planFeatureId
    }));

    setAddons(addonData);
    setInitialAddons(addonData); // 👈 IMPORTANT
  }
}, [editData]);

  
  const handleSubmit = async () => {
    let hasError = false;
    if (!planName?.trim()) {
      setPlanNameError("Plan name is required");
      hasError = true;
    }

    if (!planType?.trim()) {
      setPlanTypeError("Plan type is required");
      hasError = true;
    }

    // if (!planCode?.trim()) {
    //   setPlanCodeError("Plan code is required");
    //   hasError = true;
    // }


    if (hasError) return;


 const validAddons = addons.filter(a => a.name);

let planFeatures = validAddons.map(a => ({
  planFeatureId: a.planFeatureId, // 🔥 IMPORTANT FIX
  featureName: a.name,
  price: Number(a.price || 0)
}));
console.log("addons:", addons);
console.log("initial:", initialAddons);

    const payload = {
      planName,
      planCode,
      planType,
      duration: Number(duration),
      price: Number(price),
      discountPercentage: Number(discount),
      shouldShow,
      canCustomize,
      planFeatures
    };

    console.log("FINAL PAYLOAD:", payload);

    let res;

    
if (editData) {

  const newFeatures = addons.filter(a => !a.planFeatureId);

  const editedFeatures = addons.filter(a => {
    const initial = initialAddons.find(
      i => i.planFeatureId === a.planFeatureId
    );

    if (!initial) return false;

    return (
      initial.name?.trim() !== a.name?.trim() ||
      Number(initial.price || 0) !== Number(a.price || 0)
    );
  });

  const otherFieldsChanged =
    planName?.trim() !== editData.planName?.trim() ||
    planCode?.trim() !== editData.planCode?.trim() ||
    planType?.trim() !== editData.planType?.trim() ||
    Number(price || 0) !== Number(editData.price || 0) ||
    Number(duration || 0) !== Number(editData.duration || 0) ||
    Number(discount || 0) !== Number(editData.discountPercentage || 0);

  // ❌ No changes
  if (
    newFeatures.length === 0 &&
    editedFeatures.length === 0 &&
    !otherFieldsChanged
  ) {
    setModalType("error");
    setMessage("No changes detected");
    setShowSuccess(true);
    return;
  }

  // ✅ ANY feature change (new OR edit)
  if (
    (newFeatures.length > 0 || editedFeatures.length > 0) &&
    !otherFieldsChanged
  ) {
    const featuresToSend = [...newFeatures, ...editedFeatures];

   await Promise.all(
  featuresToSend.map(f =>
    addPlanFeature(editData.planId, {
      planFeatureId: f.planFeatureId, // 🔥 IMPORTANT
      featureName: f.name,
      price: Number(f.price || 0)
    })
  )
);

    setModalType("success");
    setMessage("Feature updated successfully");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate(-1);
    }, 800);

    return;
  }

  // ✅ other fields change → updatePlan
  res = await updatePlan(editData.planId, payload);
}
    else {

      payload.planFeatures = payload.planFeatures.map(({ featureName, price }) => ({
        featureName,
        price
      }));

      res = await createPlan(payload);
    }

    if (res.success) {
      // alert(editData ? "Updated Successfully" : "Created Successfully");
      setModalType("success");
      setMessage(editData ? "Updated Successfully" : "Created Successfully");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate(-1);


      }, 800);

    } else {

      setModalType("error");
      setPlanTypeError(res.message)
      setMessage(res.message || "Something went wrong");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);


      }, 800);
    }
  };
  //   const handleSubmit = async () => {
  //     const selectedFeatures = Object.keys(features).filter(f => features[f]);

  // if (selectedFeatures.length === 0) {
  //   alert("Select at least one feature");
  //   return;
  // }
  //   if (!planName || !price) {
  //     alert("Plan Name & Price required");
  //     return;
  //   }

  //   let res;

  //   if (editData) {
  //  const payload = {
  //   planName,
  //   planCode,
  //   planType,
  //   duration: Number(duration),
  //   price: Number(price),
  //   discountPercentage: Number(discount),
  //   shouldShow,
  //   canCustomize,
  //   planFeatures: selectedFeatures.map(name => {
  //     const existing = editData?.planFeatures?.find(
  //       pf => pf.featureName === name
  //     );

  //     return {
  //       planFeatureId: existing?.planFeatureId, // only for edit
  //       featureName: name,
  //       price: 0
  //     };
  //   })
  // };
  //     res = await updatePlan(editData.planId, payload);
  //   } else {
  //  const payload = {
  //   planName,
  //   planCode,
  //   planType,
  //   duration: Number(duration),
  //   price: Number(price),
  //   discountPercentage: Number(discount),
  //   shouldShow,
  //   canCustomize,
  //   planFeatures: selectedFeatures.map(name => ({
  //     featureName: name,
  //     price: 0
  //   }))
  // };
  //     res = await createPlan(payload);
  //   }

  //   if (res.success) {
  //     alert(editData ? "Updated Successfully" : "Created Successfully");
  //     navigate(-1);
  //   } else {
  //     alert(res.message);
  //   }
  // };


  const toggleFeature = (name) => {
    setFeatures(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };


  const addAddon = () => {
    setAddons([...addons, { name: "", price: "" }]);
  };

  // UPDATE ADDON
  const updateAddon = (index, key, value) => {
    const updated = [...addons];
    updated[index][key] = value;
    setAddons(updated);
  };

  // REMOVE ADDON
  // const removeAddon = (index) => {
  //   setAddons(addons.filter((_, i) => i !== index));
  // };
  //   const removeAddon = async (index) => {
  //   const addon = addons[index];


  //   if (editData && addon.planFeatureId) {
  //     const confirmDelete = window.confirm("Remove this add-on?");

  //     if (!confirmDelete) return;

  //     const res = await deactivatePlanFeature(addon.planFeatureId);

  //     if (res.success) {
  //       setAddons(addons.filter((_, i) => i !== index));
  //     }
  //   } else {
  //     // 🆕 NEW ADDON → JUST REMOVE (NO API)
  //     setAddons(addons.filter((_, i) => i !== index));
  //   }
  // };
  const removeAddon = (index) => {
    const addon = addons[index];


    if (editData && addon.planFeatureId) {
      setSelectedAddonIndex(index);
      setShowRemoveModal(true);
    } else {

      setAddons(addons.filter((_, i) => i !== index));
    }
  };
  const handleConfirmRemoveAddon = async () => {
    const index = selectedAddonIndex;
    const addon = addons[index];

    if (!addon) return;

    const res = await deactivatePlanFeature(addon.planFeatureId);

    if (res.success) {
      setAddons(addons.filter((_, i) => i !== index));
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setShowRemoveModal(false);

      }, 800);
    }
    else {
      setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);


      }, 800);
    }



  };

  // TOTAL PRICE
  const totalPrice =
    Number(price) +
    addons.reduce((sum, a) => sum + Number(a.price || 0), 0);

  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="bg-[#F8FAFC] min-h-screen px-6 py-6">

        {/* TITLE */}
        <h1 className="text-xl font-semibold mb-1 text-left">
          {editData ? "Edit Subscription Plan" : "Add Subscription Plan"}
        </h1>
        <p className="text-sm text-gray-400 mb-6 text-left">
          Configure plan details, core features, and specialized add-ons.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* PLAN INFO */}
            <div className="bg-white p-5 rounded-xl border border-gray-300">
              <div className="flex items-center gap-2 mb-4">
                <img src={PlanImg} alt="plan" className="w-4 h-4" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Plan Info
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* PLAN NAME */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Plan Name</label>
                  <input
                    value={planName}
                    onChange={(e) => {
                      setPlanName(e.target.value);
                      setPlanNameError("");
                    }}
                    placeholder="Enter plan name"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {planNameError && (
                    <ErrorMessage message={planNameError} type="error" />
                  )}
                </div>

                {/* PLAN CODE */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Plan Code</label>
                  <input
                    value={planCode}
                    onChange={(e) => {
                      setPlanCode(e.target.value);
                      setPlanCodeError("");
                    }}
                    placeholder="Enter plan code"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {planCodeError && (
                    <ErrorMessage message={planCodeError} type="error" />
                  )} */}
                </div>

                {/* PLAN TYPE */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600 text-left">
                    Plan Type
                  </label>

                  <input
                    type="text"
                    value={planType}
                    onChange={(e) => {
                      setPlanType(e.target.value);
                      setPlanTypeError("");
                    }}
                    placeholder="Enter Plan Type (e.g. BASIC)"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {planTypeError && (
                    <ErrorMessage message={planTypeError} type="error" />
                  )}
                </div>


                {/* PRICE */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Price (Monthly)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="₹ Price"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* DURATION */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Duration (Days)</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Enter duration"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* DISCOUNT */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Discount (%)</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Enter discount"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* SWITCHES */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">

                {/* SHOW PLAN */}
                <div className="flex items-center justify-between sm:justify-start gap-3  px-4 py-2  w-full sm:w-auto">
                  <span className="text-sm text-gray-600">Show Plan</span>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={shouldShow}
                    onChange={() => setShouldShow(!shouldShow)}
                  />
                </div>

                {/* CUSTOMIZE */}
                <div className="flex items-center justify-between sm:justify-start gap-3  px-4 py-2  w-full sm:w-auto">
                  <span className="text-sm text-gray-600">Customizable</span>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={canCustomize}
                    onChange={() => setCanCustomize(!canCustomize)}
                  />
                </div>

              </div>
            </div>

            {/* CORE FEATURES */}
            <div className="bg-white p-5 rounded-xl border border-gray-300">
              <div className="flex justify-between mb-4">
                <h2 className="font-medium">Core Features</h2>
                <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">
                  BASIC PACKAGE
                </span>
              </div>

              <div className="space-y-3">
                {defaultFeatures.map((f, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm">{f}</span>

                    {/* TOGGLE */}
                    <button
                      onClick={() => toggleFeature(f)}
                      className={`w-10 h-5 flex items-center rounded-full p-1 transition ${features[f] ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform ${features[f] ? "translate-x-5" : ""
                          }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">


            <div
              className={`bg-white p-5 rounded-xl border border-gray-300 flex flex-col 
  ${addons.length === 0 ? "h-auto" : "h-[330px]"}`}
            >

              {/* TITLE */}
              <h2 className="font-medium text-center mb-4">
                Add-on Features
              </h2>

              {addons.length === 0 ? (
                // ✅ EMPTY → SMALL HEIGHT
                <div className="flex justify-center py-4">
                  <button
                    onClick={addAddon}
                    className="w-full max-w-md border border-dashed border-gray-300 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  >
                    + Add Add-on Feature
                  </button>
                </div>
              ) : (
                <>
                  {/* ✅ SCROLL AREA */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                    {addons.map((addon, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 p-4 rounded-xl bg-gray-50"
                      >

                        {/* FEATURE NAME */}
                        <div className="mb-3 text-left">
                          <label className="text-[11px] font-semibold text-gray-400 tracking-wide text-left">
                            FEATURE NAME
                          </label>

                          <input
                            placeholder="Enter feature name"
                            value={addon.name}
                            onChange={(e) =>
                              updateAddon(i, "name", e.target.value)
                            }
                            className="mt-1 w-full border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* PRICE */}
                        <div className="mb-3 text-left">
                          <label className="text-[11px] font-semibold text-gray-400 tracking-wide ">
                            PRICE
                          </label>

                          <div className="mt-1 flex items-center border border-gray-200 bg-white rounded-lg px-3 py-2">
                            <span className="text-gray-500 text-sm mr-1">₹</span>
                            <input
                              value={addon.price}
                              onChange={(e) =>
                                updateAddon(i, "price", e.target.value)
                              }
                              className="w-full outline-none text-sm"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* REMOVE BUTTON */}
                        <button
                          onClick={() => removeAddon(i)}
                          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 text-sm py-2 rounded-lg hover:bg-red-100 transition cursor-pointer"
                        >
                          <img src={trash} className="w-4 h-4" />
                          Remove Add-on
                        </button>

                      </div>
                    ))}
                  </div>

                  {/* ADD BUTTON */}
                  <button
                    onClick={addAddon}
                    className="w-full border border-dashed border-gray-300 py-2.5 rounded-lg text-sm mt-3 hover:bg-gray-50"
                  >
                    + Add Add-on Feature
                  </button>
                </>
              )}

            </div>

            {/* LIVE PREVIEW */}
            <div className="bg-white p-5 rounded-xl border border-gray-300">
              <p className="text-xs text-gray-400 mb-2">LIVE PREVIEW</p>

              <div className="bg-blue-600 text-white p-4 rounded-xl shadow">
                <p className="text-xs">Total Plan Value</p>
                <h2 className="text-xl font-bold">
                  ₹{totalPrice} /month
                </h2>
              </div>
            </div>

          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              navigate(-1);
              setPlanCodeError("");
              setPlanNameError("");
              setPlanTypeError("");
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Discard
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            {editData ? "Save Changes" : "Create Plan"}
          </button>
        </div>

      </div>
      {showRemoveModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-lg w-[320px] p-5 z-10">

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Remove Add-on
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to remove this add-on?
            </p>

            <div className="flex justify-end gap-3">

              {/* Cancel */}
              <button
                onClick={() => {
                  setShowRemoveModal(false);
                  setSelectedAddonIndex(null);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              {/* OK */}
              <button
                onClick={handleConfirmRemoveAddon}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
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

export default AddEditPlan;