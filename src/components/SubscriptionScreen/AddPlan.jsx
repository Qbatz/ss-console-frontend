import React, { useState, useEffect,useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlan } from "../../Context/PlanContexts";
import PlanImg from "../../assets/bookcheck.png";
import trash from "../../assets/trash.png";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";



const AddEditPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plans, getPlans, createPlan, updatePlan, deactivatePlanFeature, addPlanFeature, getSmartstayFeatures,getPlanById } = usePlan();
  useEffect(() => {
    getPlans();
  }, []);

  // const editData = location.state?.plan || null;
  const planId = location.state?.plan?.planId;

const [editData, setEditData] =
  useState(null);
  console.log("editData", editData)
  useEffect(() => {

  const fetchPlan = async () => {

    if (!planId) return;

    const res =
      await getPlanById(planId);

    if (res.success) {
      setEditData(res.data);
    }
  };

  fetchPlan();

}, [planId]);

  const [planType, setPlanType] = useState("");
  const [planCode, setPlanCode] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
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
  const [planError, setPlanError] = useState("")
  const [priceError, setPriceError] = useState("")
  const [durationError, setDurationError] = useState("")
  const [gstPercentage, setGstPercentage] = useState("")
  const [finalAmount, setFinalAmount] = useState(0);
  const [smartstayFeatures, setSmartstayFeatures] = useState([]);
  const [deletedFeatures, setDeletedFeatures] = useState([]);

  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureError, setFeatureError] = useState("");
  const buttonRef = useRef(false)
  const [featureForm, setFeatureForm] = useState({
    labelText: "",
    labelDescription: "",
    startsFrom: "",
    endsAt: ""
  });

  
  useEffect(() => {
    fetchSmartstayFeatures();
    getPlans();
  }, []);

  const fetchSmartstayFeatures = async () => {
    const res = await getSmartstayFeatures();

    if (res.success) {
      setSmartstayFeatures(res.data || []);
    }
  };
  useEffect(() => {
    const initial = {};

    smartstayFeatures.forEach((f) => {
      const exists = editData?.planFeatures?.some(
        (pf) => pf.featureName === f.featureName
      );

      initial[f.featureName] = editData ? exists : f.isCommon;
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
      setGstPercentage(editData.gst)
      setFinalAmount(editData.finalPrice)


      const addonData = editData.planFeatures.map(f => ({
        name: f.featureName,
        price: f.price,
        planFeatureId: f.planFeatureId,
        smartstayFeatureId: f.smartstayFeatureId,
        isCommon: f.isCommon
      }));

      setAddons(addonData);
    }

    setFeatures(initial);
  }, [editData, smartstayFeatures]);

  useEffect(() => {
    const initial = {};
    const addonData = [];

    smartstayFeatures.forEach((f) => {

      // const existingFeature =
      //   editData?.planFeatures?.find(
      //     (pf) =>
      //       pf.featureName?.trim() ===
      //       f.featureName?.trim()
      //   );
const existingFeature =
  editData?.planFeatures?.find(
    (pf) =>
      pf.smartstayFeatureId ===
      f.smartstayFeatureId
  );

const enabled =
  f.isCommon || !!existingFeature;

initial[f.featureName] = enabled;

      if (editData) {

        const enabled = !!existingFeature;

        initial[f.featureName] = enabled;


        if (enabled) {
          addonData.push({
            name: f.featureName,
            planFeatureId: existingFeature?.planFeatureId,
            isCommon: f.isCommon,
            smartstayFeatureId: f.smartstayFeatureId,

            labelText: existingFeature?.labelText || "",
            labelDescription:
              existingFeature?.labelDescription || "",

            startsFrom:
              existingFeature?.startsFrom || "",

            endsAt:
              existingFeature?.endsAt || ""
          });
        }

      } else {


        initial[f.featureName] =
          f.isCommon === true;

        if (f.isCommon) {
          addonData.push({
            name: f.featureName,
            isCommon: true,
            smartstayFeatureId:
              f.smartstayFeatureId
          });
        }
      }
    });

    setFeatures(initial);

    setAddons(addonData);

    if (editData) {
      setInitialAddons(addonData);
    }

  }, [editData, smartstayFeatures]);
  const handleSaveFeature = () => {
    
    setFeatureError("");

    const featureData = smartstayFeatures.find(f => f.featureName === selectedFeature);
    const existingAddon = initialAddons.find(a => a.name === selectedFeature);

    setFeatures(prev => ({ ...prev, [selectedFeature]: true }));

    setAddons(prev => {
      const alreadyExists = prev.some(a => a.name === selectedFeature);

      const newAddon = {
        name: selectedFeature,
        smartstayFeatureId: featureData?.smartstayFeatureId,
        planFeatureId: existingAddon?.planFeatureId || undefined,
        isCommon: featureData?.isCommon ?? false,
        labelText: featureForm.labelText || "",
        labelDescription: featureForm.labelDescription || "",
        startsFrom: featureForm.startsFrom || "",
        endsAt: featureForm.endsAt || ""
      };

      if (alreadyExists) {
        return prev.map(a => a.name === selectedFeature ? newAddon : a);
      }

      return [...prev, newAddon];
    });

    setDeletedFeatures(prev => prev.filter(f => f.name !== selectedFeature));
    setShowFeatureModal(false);
  };

//   const handleSubmit = async () => {

// if(buttonRef.current) return;
// buttonRef.current = true
     
//     let hasError = false;
//     if (!planName?.trim()) {
//       setPlanNameError("Plan name is required");
//       hasError = true;
//     }

//     if (!planType?.trim()) {
//       setPlanTypeError("Plan type is required");
//       hasError = true;
//     }

//     if (price === "" || price === null) {
//       setPriceError("Price is required");
//       hasError = true;
//     } else if (Number(price) < 0) {
//       setPriceError("Price cannot be less than 0");
//       hasError = true;
//     }

//     if (duration === "" || duration === null) {
//       setDurationError("Duration is required");
//       hasError = true;
//     } else if (Number(duration) <= 0) {
//       setDurationError("Duration should be higher than 0");
//       hasError = true;
//     }

//   if (hasError) {
//   setIsSubmitting(false);
//   return;
// }


//     const formatDate = (date) => {
//       if (!date) return "";
//       const parts = date.split("-");
//       if (parts.length !== 3) return date;
//       if (parts[0].length === 2) return date;
//       return `${parts[2]}-${parts[1]}-${parts[0]}`;
//     };

//     const planFeatures = smartstayFeatures.map((feature) => {

//       const addon = addons.find(
//         (a) => a.smartstayFeatureId === feature.smartstayFeatureId
//       );

//       return {
//         smartstayFeatureId: feature.smartstayFeatureId,
//         isFeatureActive: !!addon,

//         labelText: addon?.labelText || "",
//         labelDescription: addon?.labelDescription || "",

//         startsFrom: addon?.startsFrom
//           ? formatDate(addon.startsFrom)
//           : "",

//         endsAt: addon?.endsAt
//           ? formatDate(addon.endsAt)
//           : ""
//       };
//     });


//     const payload = {
//       planName,
//       planCode,
//       planType,
//       duration: Number(duration),
//       price: Number(price),
//       discountPercentage: Number(discount),
//       gstPercentage,
//       shouldShow,
//       canCustomize,
//       planFeatures
//     };

//     console.log("FINAL PAYLOAD:", payload);

//     // if (editData) {


//     //   const res = await updatePlan(editData.planId, payload);

//     //   if (!res?.success) {
//     //     setModalType("error");
//     //     setMessage(res?.message || "Update failed");
//     //     setShowSuccess(true);
//     //     setTimeout(() => setShowSuccess(false), 1500);
//     //     return;
//     //   }

//     //   setModalType("success");
//     //   setMessage("Updated Successfully");
//     //   setShowSuccess(true);
//     //   setTimeout(() => {
//     //     setShowSuccess(false);
//     //     navigate(-1);
//     //   }, 800);

//     //   return;
//     // }

//     if (editData) {

//       const oldFeatures = JSON.stringify(
//         initialAddons.map(a => ({
//           smartstayFeatureId: a.smartstayFeatureId,
//           labelText: a.labelText || "",
//           labelDescription: a.labelDescription || "",
//           startsFrom: a.startsFrom || "",
//           endsAt: a.endsAt || ""
//         }))
//       );

//       const newFeatures = JSON.stringify(
//         addons.map(a => ({
//           smartstayFeatureId: a.smartstayFeatureId,
//           labelText: a.labelText || "",
//           labelDescription: a.labelDescription || "",
//           startsFrom: a.startsFrom || "",
//           endsAt: a.endsAt || ""
//         }))
//       );

//       const noChanges =
//         planName === editData.planName &&
//         planCode === editData.planCode &&
//         planType === editData.planType &&
//         Number(price) === Number(editData.price) &&
//         Number(duration) === Number(editData.duration) &&
//         Number(discount) === Number(editData.discountPercentage) &&
//         Number(gstPercentage) === Number(editData.gst) &&
//         oldFeatures === newFeatures;

//       if (noChanges) {
//   setModalType("error");
//   setMessage("No changes detected");
//   setShowSuccess(true);

//   buttonRef.current = false; // ✅ reset

//   setTimeout(() => {
//     setShowSuccess(false);
//   }, 1500);

//   return;
// }

//       // UPDATE API CALL
//       const res = await updatePlan(
//         editData.planId,
//         payload
//       );

//       if (!res?.success) {
//         setModalType("error");
//         setMessage(res?.message || "Update failed");
//         setShowSuccess(true);
//         return;
//       }

//       setModalType("success");
//       setMessage("Updated Successfully");
//       setShowSuccess(true);

//       setTimeout(() => {
//         setShowSuccess(false);
//         navigate(-1);
//       }, 800);

//       return;
//     }
//     const res = await createPlan(payload);

//     if (res?.success) {
//       setModalType("success");
//       setMessage("Created Successfully");
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         navigate(-1);
//       }, 800);
//     } else {
//       setModalType("error");
//       setPlanError(res?.message || "");
//       setMessage(res?.message || "Something went wrong");
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 1500);
//     }

//     buttonRef.current=false
//   };

const handleSubmit = async () => {

  if (buttonRef.current) return;

  buttonRef.current = true;

  let hasError = false;

  if (!planName?.trim()) {
    setPlanNameError("Plan name is required");
    hasError = true;
  }

  if (!planType?.trim()) {
    setPlanTypeError("Plan type is required");
    hasError = true;
  }

  if (price === "" || price === null) {
    setPriceError("Price is required");
    hasError = true;
  } else if (Number(price) < 0) {
    setPriceError("Price cannot be less than 0");
    hasError = true;
  }

  if (duration === "" || duration === null) {
    setDurationError("Duration is required");
    hasError = true;
  } else if (Number(duration) <= 0) {
    setDurationError("Duration should be higher than 0");
    hasError = true;
  }

  if (hasError) {
    buttonRef.current = false;
    return;
  }

  const formatDate = (date) => {
    if (!date) return "";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    if (parts[0].length === 2) return date;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const planFeatures = smartstayFeatures.map((feature) => {

    const addon = addons.find(
      (a) =>
        a.smartstayFeatureId ===
        feature.smartstayFeatureId
    );

    return {
      smartstayFeatureId:
        feature.smartstayFeatureId,

      isFeatureActive: !!addon,

      labelText:
        addon?.labelText || "",

      labelDescription:
        addon?.labelDescription || "",

      startsFrom: addon?.startsFrom
        ? formatDate(addon.startsFrom)
        : "",

      endsAt: addon?.endsAt
        ? formatDate(addon.endsAt)
        : ""
    };
  });

  const payload = {
    planName,
    planCode,
    planType,
    duration: Number(duration),
    price: Number(price),
    discountPercentage: Number(discount),
    gstPercentage,
    shouldShow,
    canCustomize,
    planFeatures
  };

  console.log("FINAL PAYLOAD:", payload);

  // EDIT
  if (editData) {

    const oldFeatures = JSON.stringify(
      initialAddons.map((a) => ({
        smartstayFeatureId:
          a.smartstayFeatureId,
        labelText:
          a.labelText || "",
        labelDescription:
          a.labelDescription || "",
        startsFrom:
          a.startsFrom || "",
        endsAt:
          a.endsAt || ""
      }))
    );

    const newFeatures = JSON.stringify(
      addons.map((a) => ({
        smartstayFeatureId:
          a.smartstayFeatureId,
        labelText:
          a.labelText || "",
        labelDescription:
          a.labelDescription || "",
        startsFrom:
          a.startsFrom || "",
        endsAt:
          a.endsAt || ""
      }))
    );

    const noChanges =
      planName === editData.planName &&
      planCode === editData.planCode &&
      planType === editData.planType &&
      Number(price) ===
        Number(editData.price) &&
      Number(duration) ===
        Number(editData.duration) &&
      Number(discount) ===
        Number(
          editData.discountPercentage
        ) &&
      Number(gstPercentage) ===
        Number(editData.gst) &&
      oldFeatures === newFeatures;

    if (noChanges) {

      setModalType("error");
      setMessage(
        "No changes detected"
      );
      setShowSuccess(true);

      buttonRef.current = false;

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

      return;
    }

    const res = await updatePlan(
      editData.planId,
      payload
    );

    if (!res?.success) {

      setModalType("error");
      setMessage(
        res?.message ||
          "Update failed"
      );
      setShowSuccess(true);

      buttonRef.current = false;

      return;
    }

    // SUCCESS
    setModalType("success");
    setMessage(
      "Updated Successfully"
    );
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate(-1);
    }, 800);

    return;
  }

  // CREATE
  const res = await createPlan(payload);

  if (res?.success) {

    setModalType("success");
    setMessage(
      "Created Successfully"
    );
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate(-1);
    }, 800);

    return;
  }

  // CREATE ERROR
  setModalType("error");
  setPlanError(
    res?.message || ""
  );
  setMessage(
    res?.message ||
      "Something went wrong"
  );
  setShowSuccess(true);

  buttonRef.current = false;

  setTimeout(() => {
    setShowSuccess(false);
  }, 1500);
};
  //   const handleSubmit = async () => {
  //     let hasError = false;
  //     if (!planName?.trim()) {
  //       setPlanNameError("Plan name is required");

  //     }

  //     if (!planType?.trim()) {
  //       setPlanTypeError("Plan type is required");
  //       hasError = true;
  //     }
  //  if (price === "" || price === null) {
  //   setPriceError("Price is required");
  //   hasError = true;
  // } else if (Number(price) < 0) {
  //   setPriceError("Price cannot be less than 0");
  //   hasError = true;
  // }
  // if (duration === "" || duration === null) {
  //   setDurationError("Duration is required");
  //   hasError = true;
  // } else if (Number(duration) <= 0) {
  //   setDurationError("Duration should be higher than 0");
  //   hasError = true;
  // }

  //     // if (!planCode?.trim()) {
  //     //   setPlanCodeError("Plan code is required");
  //     //   hasError = true;
  //     // }


  //     if (hasError) return;


  //  const validAddons = addons.filter(a => a.name);
  // const formatDate = (date) => {
  //   if (!date) return "";

  //   const [year, month, day] = date.split("-");

  //   return `${day}-${month}-${year}`;
  // };
  // let planFeatures = validAddons.map((a) => ({
  //   smartstayFeatureId: a.smartstayFeatureId,
  //   planFeatureId: a.planFeatureId,
  //   featureName: a.name,
  //   labelText: a.labelText,
  //   labelDescription: a.labelDescription,

  //   startsFrom: formatDate(a.startsFrom),
  //   endsAt: formatDate(a.endsAt),

  //   isFeatureActive: true,
  // }));
  // console.log("addons:", addons);
  // console.log("initial:", initialAddons);

  //     const payload = {
  //       planName,
  //       planCode,
  //       planType,
  //       duration: Number(duration),
  //       price: Number(price),
  //       discountPercentage: Number(discount),
  //       shouldShow,
  //       canCustomize,
  //       planFeatures,
  //       gstPercentage:gstPercentage
  //     };

  //     console.log("FINAL PAYLOAD:", payload);

  //     let res;


  // if (editData) {


  //   const newFeatures = addons.filter(a => !a.planFeatureId);


  // const editedFeatures = addons.filter((a) => {
  //   const initial = initialAddons.find(
  //     (i) => i.planFeatureId === a.planFeatureId
  //   );

  //   if (!initial) return false;

  //   return (
  //     initial.smartstayFeatureId !== a.smartstayFeatureId ||
  //     initial.isFeatureActive !== a.isFeatureActive ||
  //     initial.labelText !== a.labelText ||
  //     initial.labelDescription !== a.labelDescription ||
  //     initial.startsFrom !== a.startsFrom ||
  //     initial.endsAt !== a.endsAt
  //   );
  // });

  //   // ✅ DELETED FEATURES
  //  // ✅ DELETE EXISTING FEATURES


  // console.log("deletedFeatures", deletedFeatures);

  // // ✅ DELETE EXISTING FEATURES
  // if (deletedFeatures.length > 0) {

  //   const deleteRes = await Promise.all(
  //     deletedFeatures.map(async (f) => {

  //       console.log("Deleting ID:", f.planFeatureId);

  //       const res = await deactivatePlanFeature(
  //         f.planFeatureId
  //       );

  //       console.log("DELETE RES:", res);

  //       return res;
  //     })
  //   );

  //   console.log("ALL DELETE RES:", deleteRes);
  // }

  //   console.log("newFeatures", newFeatures);
  //   console.log("editedFeatures", editedFeatures);
  //   console.log("deletedFeatures", deletedFeatures);

  //   // ✅ OTHER FIELD CHECK
  //   const otherFieldsChanged =
  //     planName?.trim() !== editData.planName?.trim() ||
  //     planCode?.trim() !== editData.planCode?.trim() ||
  //     planType?.trim() !== editData.planType?.trim() ||
  //     Number(price || 0) !== Number(editData.price || 0) ||
  //     Number(duration || 0) !== Number(editData.duration || 0) ||
  //     Number(discount || 0) !== Number(editData.discountPercentage || 0) ||
  //     Number(gstPercentage || 0) !== Number(editData.gst || 0);

  //   // ✅ NO CHANGES
  //   if (
  //     newFeatures.length === 0 &&
  //     editedFeatures.length === 0 &&
  //     deletedFeatures.length === 0 &&
  //     !otherFieldsChanged
  //   ) {
  //     setModalType("error");
  //     setMessage("No changes detected");
  //     setShowSuccess(true);
  //     return;
  //   }

  //   // ✅ ADD NEW FEATURES
  //   if (newFeatures.length > 0) {
  //   await Promise.all(
  //     newFeatures.map(f =>
  //       addPlanFeature(editData.planId, {
  //         smartstayFeatureId: f.smartstayFeatureId,
  //         featureName: f.name,
  //         labelText: f.labelText,
  //         labelDescription: f.labelDescription,
  //         startsFrom: formatDate(f.startsFrom),
  //         endsAt: formatDate(f.endsAt),
  //         isFeatureActive: true
  //       })
  //     )
  //   );
  // }

  //   // ✅ UPDATE EXISTING FEATURES
  //   if (editedFeatures.length > 0) {

  //  await Promise.all(
  //   editedFeatures.map(f =>
  //     addPlanFeature(editData.planId, {
  //       planFeatureId: f.planFeatureId,
  //       smartstayFeatureId: f.smartstayFeatureId,
  //       featureName: f.name,
  //       labelText: f.labelText,
  //       labelDescription: f.labelDescription,
  //       startsFrom: formatDate(f.startsFrom),
  //       endsAt: formatDate(f.endsAt),
  //       isFeatureActive: true
  //     })
  //   )
  // );
  //   }





  //   if (otherFieldsChanged) {

  //     res = await updatePlan(editData.planId, payload);

  //     if (!res?.success) {
  //       setModalType("error");
  //       setMessage(res.message || "Update failed");
  //       setShowSuccess(true);
  //       return;
  //     }
  //   }


  //   setTimeout(() => {
  //     setShowSuccess(false);
  //     navigate(-1);
  //   }, 800);

  //   return;
  // }
  //     else {

  //      payload.planFeatures =
  //   payload.planFeatures;

  //       res = await createPlan(payload);
  //     }

  //     if (res.success) {
  //       // alert(editData ? "Updated Successfully" : "Created Successfully");
  //       setModalType("success");
  //       setMessage(editData ? "Updated Successfully" : "Created Successfully");
  //       setShowSuccess(true);

  //       setTimeout(() => {
  //         setShowSuccess(false);
  //         navigate(-1);


  //       }, 800);

  //     } else {

  //       setModalType("error");
  //       setPlanError(res.message)
  //       setMessage(res.message || "Something went wrong");
  //       setShowSuccess(true);

  //       setTimeout(() => {
  //         setShowSuccess(false);


  //       }, 800);
  //     }
  //   };
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


  // const toggleFeature = (name) => {
  //   setFeatures(prev => ({
  //     ...prev,
  //     [name]: !prev[name],
  //   }));
  // };
  // const toggleFeature = (name) => {

  //   const isEnabled = features[name];

  //   if (isEnabled) {

  //     // OFF -> remove from addon
  //     setAddons((prev) =>
  //       prev.filter((a) => a.name !== name)
  //     );

  //   } else {

  //     // ON -> add to addon
  //     const exists = addons.some(
  //       (a) => a.name === name
  //     );

  //     if (!exists) {
  //       setAddons((prev) => [
  //         ...prev,
  //         {
  //           name,
  //           price: ""
  //         }
  //       ]);
  //     }
  //   }

  //   setFeatures((prev) => ({
  //     ...prev,
  //     [name]: !prev[name],
  //   }));
  // };

  // const toggleFeature = (name) => {
  //   const enabled = !features[name];

  //   setFeatures((prev) => ({
  //     ...prev,
  //     [name]: enabled,
  //   }));

  //   if (enabled) {
  //     const featureData = smartstayFeatures.find(
  //       (f) => f.featureName === name
  //     );

  //     setAddons((prev) => [
  //       ...prev,
  //       {
  //         name,
  //         isCommon: featureData?.isCommon ?? false,
  //       },
  //     ]);
  //   } else {
  //     setAddons((prev) =>
  //       prev.filter((a) => a.name !== name)
  //     );
  //   }
  // };
  
  const toInputDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    
    if (parts[0].length === 2) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };
  const toggleFeature = (name) => {
    const enabled = !features[name];

    if (enabled) {
      setSelectedFeature(name);

      const existingAddon =
        addons.find(a => a.name === name) ||
        initialAddons.find(a => a.name === name);

      setFeatureForm({
        labelText: existingAddon?.labelText || "",
        labelDescription: existingAddon?.labelDescription || "",
        startsFrom: toInputDate(existingAddon?.startsFrom || ""),  
        endsAt: toInputDate(existingAddon?.endsAt || "")           
      });

      setShowFeatureModal(true);
      return;
    }

    setFeatures(prev => ({ ...prev, [name]: false }));
    setAddons(prev => prev.filter(a => a.name !== name));
  };
  const addAddon = () => {
    setAddons([...addons, { name: "", price: "" }]);
  };
  console.log("addAddon", addAddon)
  
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
  // const removeAddon = (index) => {
  //   const addon = addons[index];


  //   if (editData && addon.planFeatureId) {
  //     setSelectedAddonIndex(index);
  //     setShowRemoveModal(true);
  //   } else {

  //     setAddons(addons.filter((_, i) => i !== index));
  //   }
  // };
  const removeAddon = (index) => {
    const addon = addons[index];

    if (addon.planFeatureId) {
      setDeletedFeatures(prev => [...prev, addon]);
    }

    setAddons(prev =>
      prev.filter((_, i) => i !== index)
    );

    setFeatures(prev => ({
      ...prev,
      [addon.name]: false,
    }));
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
            <div className="bg-white-common p-5 rounded-xl border border-gray-300">
              <div className="flex items-center gap-2 mb-4">
                <img src={PlanImg} alt="plan" className="w-4 h-4" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Plan Info
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* PLAN NAME */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Plan Name <span className="text-red-600">*</span></label>
                  <input
                    value={planName}
                    onChange={(e) => {
                      setPlanName(e.target.value);
                      setPlanNameError("");
                      setPlanError("")
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
                      setPlanError("")
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
                    Plan Type <span className="text-red-600">*</span>
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
                  <label className="text-xs font-medium text-black-500 text-left">
                    Price (Monthly) <span className="text-red-600">*</span>
                  </label>

                  <input
                    type="text"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value < 0) {
                        setPriceError("Price cannot be less than 0");
                      } else {
                        setPriceError("");
                        setPlanError("")
                        setPrice(value);
                      }
                    }}
                    placeholder="₹ Price"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* ✅ MOVE HERE */}
                  {priceError && (
                    <ErrorMessage message={priceError} type="error" />
                  )}
                </div>

                {/* DURATION */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">
                    Duration (Days) <span className="text-red-600">*</span>
                  </label>

                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ allow empty (backspace work)
                      if (value === "") {
                        setDuration("");
                        setDurationError("");
                        setPlanError("")
                        return;
                      }

                      // ✅ validate only if value exists
                      if (Number(value) <= 0) {
                        setDurationError("Duration should be higher than 0");
                      } else {
                        setDurationError("");
                      }

                      setDuration(value);
                    }}
                    placeholder="Enter duration"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />


                  {durationError && (
                    <ErrorMessage message={durationError} type="error" />
                  )}
                </div>

                {/* DISCOUNT */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Discount (%) <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Enter discount"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-black-500 text-left">Gst (%)</label>
                  <input
                    type="text"
                    value={gstPercentage}
                    onChange={(e) => setGstPercentage(e.target.value)}
                    placeholder="Enter Gst"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {editData && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-black-500 text-left">
                      Final Amount
                    </label>

                    <input
                      type="text"
                      value={finalAmount}
                      readOnly
                      className="
        border border-gray-300 rounded-lg
        px-3 py-2 text-sm bg-gray-100
        cursor-not-allowed
      "
                    />
                  </div>
                )}
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
              {planError && (
                <ErrorMessage message={planError} type="error" />
              )}
            </div>


            <div className="bg-white-common p-5 rounded-xl border border-gray-300">
              <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2 font-medium">
                <div className="flex items-center gap-3">
                  <span className="w-40 text-left">Feature Name</span>
                  <span className="w-16 text-center">Common</span>
                </div>

                <span className="w-12 text-center">
                  Enabled
                </span>
              </div>



            {smartstayFeatures?.map((f) => {
const isEnabled = features[f.featureName] ?? false;

const shouldDisable =
  f.isCommon && isEnabled;

  return (
    <div
      key={f.smartstayFeatureId}
      className="flex justify-between items-center"
    >
      <div className="flex items-center gap-3 text-left">
        <span className="w-40">
          {f.featureName}
        </span>

        <input
          type="checkbox"
          checked={f.isCommon}
          readOnly
          className="w-4 h-4"
        />
   
      </div>

  <button
  type="button"
  onClick={() => toggleFeature(f.featureName)}
  disabled={shouldDisable}
  className={`w-12 h-5 flex items-center rounded-full p-1 transition ${
    isEnabled
      ? "bg-blue-600"
      : "bg-gray-300"
  } ${
    shouldDisable
      ? "cursor-not-allowed opacity-70"
      : "cursor-pointer"
  }`}
>
  <div
    className={`bg-white-common w-4 h-4 rounded-full shadow transition-transform ${
      isEnabled ? "translate-x-7" : ""
    }`}
  />
</button>
    </div>
  );
})}
            </div>

          </div>

          
          <div className="space-y-6">


            <div
              className={`bg-white-common p-5 rounded-xl border border-gray-300 flex flex-col 
  ${addons.length === 0 ? "h-auto" : "h-[330px]"}`}
            >

              {/* TITLE */}
              <h2 className="font-medium text-center mb-4">
                Add-on Features
              </h2>

              {addons.length === 0 ? (

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

                  <div className="flex-1 overflow-y-auto pr-1 space-y-2">

                    {addons.map((addon, i) => (
                      <div
                        key={i}
                        className="
      flex
      items-center
      justify-between
      border border-gray-300
      rounded-lg
      px-3
      py-2
    "
                      >
                        <span>{addon.name}</span>

                        {addon.isCommon !== true && (
                          <img
                            src={trash}
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeAddon(i)}
                          />
                        )}
                      </div>
                    ))}

                  </div>

                  {/* ADD BUTTON */}
                  {/* <button
                    onClick={addAddon}
                    className="w-full border border-dashed border-gray-300 py-2.5 rounded-lg text-sm mt-3 hover:bg-gray-50"
                  >
                    + Add Add-on Feature
                  </button> */}
                </>
              )}

            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  navigate(-1);
                  setPlanCodeError("");
                  setPlanNameError("");
                  setPlanTypeError("");
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
              >
                Discard
              </button>

              <button
  onClick={handleSubmit}
  disabled={buttonRef.current}
  className={`
    px-4 py-2 rounded-lg text-white
    ${
      buttonRef.current
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 cursor-pointer"
    }
  `}
>
  {isSubmitting
    ? "Saving..."
    : editData
    ? "Update"
    : "Create"}
</button>
            </div>
            {/* LIVE PREVIEW */}
            {/* <div className="bg-white p-5 rounded-xl border border-gray-300">
              <p className="text-xs text-gray-400 mb-2">LIVE PREVIEW</p>

              <div className="bg-blue-600 text-white p-4 rounded-xl shadow">
                <p className="text-xs">Total Plan Value</p>
                <h2 className="text-xl font-bold">
                  ₹{totalPrice} /month
                </h2>
              </div>
            </div> */}

          </div>
        </div>

        {/* ACTIONS */}


      </div>
      {showRemoveModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Modal */}
          <div className="relative bg-white-common rounded-xl shadow-lg w-[320px] p-5 z-10">

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
      {showFeatureModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFeatureModal(false)}
          />

          <div className="relative bg-white-common rounded-xl w-[500px] p-6">

            <h3 className="text-lg font-semibold mb-4">
              Feature Details
            </h3>

            <div className="space-y-3">

              <input
                type="text"
                placeholder="Label Text"
                value={featureForm.labelText}
                onChange={(e) =>
                  setFeatureForm({
                    ...featureForm,
                    labelText: e.target.value
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                placeholder="Label Description"
                value={featureForm.labelDescription}
                onChange={(e) =>
                  setFeatureForm({
                    ...featureForm,
                    labelDescription: e.target.value
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="date"
                value={featureForm.startsFrom}
                onChange={(e) =>
                  setFeatureForm({
                    ...featureForm,
                    startsFrom: e.target.value
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="date"
                value={featureForm.endsAt}
                onChange={(e) =>
                  setFeatureForm({
                    ...featureForm,
                    endsAt: e.target.value
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() =>
                  setShowFeatureModal(false)
                }
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default AddEditPlan;