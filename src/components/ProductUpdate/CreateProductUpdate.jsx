import React, { useState, useEffect,useRef} from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { usePlan } from "../../Context/PlanContexts";
import { useSupportTickets } from "../../Context/SupportTicketsContext";
import { X, ChevronDown, CalendarDays, Search, Upload, } from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";



const CreateProductUpdate = () => {
  const navigate = useNavigate();
  const { searchOwners, loading } = useSupportTickets();
  const { getPlansDropdown, getProductUpdateTypes, getProductUpdatePlatforms, getProductUpdateModules, getProductUpdateCtas, getProductUpdatePublishStatuses, getProductUpdateAudiences, createProductUpdate, searchHostels } = usePlan();
  const [updateTitle, setUpdateTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [version, setVersion] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [platform, setPlatform] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [platformError, setPlatformError] = useState("");

  const [audienceError, setAudienceError] = useState("");
  const [publishingError, setPublishingError] = useState("");
  const [itemsError, setItemsError] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [search, setSearch] = useState("");
  const [hostels, setHostels] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);


  const [ownersList, setOwnersList] = useState([]);
  const [showOwnerPopup, setShowOwnerPopup] = useState(false);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [ownerSearch, setOwnerSearch] = useState("");
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [updateTypes, setUpdateTypes] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [updateItems, setUpdateItems] = useState([]);
  const [modules, setModules] = useState([]);
  const [ctas, setCtas] = useState([]);
  const [publishStatuses, setPublishStatuses] = useState([]);
  const [publishing, setPublishing] = useState("");
  const [audiences, setAudiences] = useState([]);
  const [audience, setAudience] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [propertiesList, setPropertiesList] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [showPropertyPopup, setShowPropertyPopup] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [itemTypeErrors, setItemTypeErrors] = useState({});
  const [itemTitleErrors, setItemTitleErrors] = useState({});
  const [itemDescriptionErrors, setItemDescriptionErrors] = useState({});
  const [itemModuleErrors, setItemModuleErrors] = useState({});
  const [itemCtaErrors, setItemCtaErrors] = useState({});
  const [itemCtaLinkErrors, setItemCtaLinkErrors] = useState({});
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [publishDateError, setPublishDateError] = useState("");
const [publishTimeError, setPublishTimeError] = useState("");
const [expiryDateError, setExpiryDateError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const isSubmittingRef = useRef(false);
  console.log("ownersList", ownersList)


  const handleOwnerSearch = async (value) => {
    const searchValue = value.trim();

    setOwnerSearch(value);

    if (searchValue.length < 2) {
      setOwnersList([]);
      setShowOwnerDropdown(false);
      return;
    }

    try {
      setOwnerLoading(true);
      setShowOwnerDropdown(true);

      const res = await searchOwners(searchValue);

      if (res?.success) {
        setOwnersList(res.data || []);
      } else {
        setOwnersList([]);
      }

    } catch (error) {
      console.log("Owner Search Error:", error);
      setOwnersList([]);
    } finally {
      setOwnerLoading(false);
    }
  };

  useEffect(() => {

    const fetchPlans = async () => {

      const res = await getPlansDropdown();

      if (res.success) {

        setPlans(
          res.data?.otherPlans || []
        );
       

      }

    };

    fetchPlans();

  }, []);
  useEffect(() => {
    const fetchDropdowns = async () => {
      const [
        typeRes,
        platformRes,
        moduleRes,
        ctaRes,
        publishStatusRes,
      ] = await Promise.all([
        getProductUpdateTypes(),
        getProductUpdatePlatforms(),
        getProductUpdateModules(),
        getProductUpdateCtas(),
        getProductUpdatePublishStatuses(),
      ]);

      if (typeRes?.success) {
        setUpdateTypes(typeRes.data || []);
      }

      if (platformRes?.success) {
        setPlatforms(platformRes.data || []);
      }

      if (moduleRes?.success) {
        setModules(moduleRes.data || []);
      }

      if (ctaRes?.success) {
        setCtas(ctaRes.data || []);
      }

      if (publishStatusRes?.success) {
        setPublishStatuses(publishStatusRes.data || []);
      }
    };

    fetchDropdowns();
  }, []);
  useEffect(() => {
    const fetchDropdownData = async () => {

      const audienceRes = await getProductUpdateAudiences();

      if (audienceRes?.success) {
        setAudiences(audienceRes.data || []);
      }
    };

    fetchDropdownData();
  }, []);
  useEffect(() => {

    const delayDebounce =
      setTimeout(async () => {

        if (
          customerSearch.trim()
            .length < 2
        ) {

          setOwnersList([]);

          return;

        }

        const res =
          await searchOwners(
            customerSearch
          );

        if (res.success) {

          setOwnersList(
            res.data || []
          );
          console.log("res.data", res.data)


          if (
            document.activeElement ===
            customerRef.current?.querySelector("input")
          ) {

            setShowDropdown(true);

          }

        }

      }, 500);

    return () =>
      clearTimeout(
        delayDebounce
      );

  }, [customerSearch]);
  const formatDate = (value) => {
    if (!value) return "";

    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  };
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed"));
              return;
            }

            resolve(
              new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ".jpg"),
                {
                  type: "image/jpeg",
                }
              )
            );
          },
          "image/jpeg",
          0.7
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };
  const handleAddUpdateItem = () => {
    setUpdateItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        clientId: `item-${prev.length + 1}`,

        itemType: "",
        title: "",
        description: "",
        relatedModule: "",
        cta: "",
        ctaLink: "",

        attachment: null,
      },
    ]);
  };
  const isScheduleSelected = publishStatuses?.some(
  (status) =>
    status?.key === publishing &&
    status?.value?.trim()?.toLowerCase() === "schedule"
);
  const validateForm = () => {
    let valid = true;



    setTitleError("");
    setDescriptionError("");
    setTypeError("");
    setPlatformError("");
    setAudienceError("");
    setPublishingError("");
    setItemsError("");

    setItemTypeErrors({});
    setItemTitleErrors({});
    setItemDescriptionErrors({});
    setItemModuleErrors({});
    setItemCtaErrors({});
    setItemCtaLinkErrors({});
    setPublishDateError("");
setPublishTimeError("");
setExpiryDateError("");



    if (!updateTitle.trim()) {
      setTitleError("Update Title is required");
      valid = false;
    }

    if (!shortDescription.trim()) {
      setDescriptionError("Short Description is required");
      valid = false;
    }

    if (!updateType) {
      setTypeError("Select Update Type");
      valid = false;
    }

    if (!platform) {
      setPlatformError("Select Platform");
      valid = false;
    }



    if (updateItems.length === 0) {
      setItemsError("Add at least one update item");
      valid = false;
    } else {
      const typeErrors = {};
      const titleErrors = {};
      const descriptionErrors = {};
      const moduleErrors = {};
      const ctaErrors = {};
      const ctaLinkErrors = {};

      updateItems.forEach((item, index) => {


        if (!item.itemType) {
          typeErrors[index] = "Item Type is required";
          valid = false;
        }


        if (!item.title?.trim()) {
          titleErrors[index] = "Title is required";
          valid = false;
        }


        if (!item.description?.trim()) {
          descriptionErrors[index] = "Description is required";
          valid = false;
        }


        if (!item.relatedModule) {
          moduleErrors[index] = "Related Module is required";
          valid = false;
        }


        if (!item.cta) {
          ctaErrors[index] = "CTA is required";
          valid = false;
        }


        if (!item.ctaLink?.trim()) {
          ctaLinkErrors[index] = "CTA Link is required";
          valid = false;
        }


      });

      setItemTypeErrors(typeErrors);
      setItemTitleErrors(titleErrors);
      setItemDescriptionErrors(descriptionErrors);
      setItemModuleErrors(moduleErrors);
      setItemCtaErrors(ctaErrors);
      setItemCtaLinkErrors(ctaLinkErrors);
    }



    if (!audience) {

      setAudienceError(
        "Please select who should see this update"
      );

      valid = false;

    } else if (

      audience === "SELECTED_PLANS" ||
      audience === "PLANS"
    ) {

      if (!selectedPlans || selectedPlans.length === 0) {

        setAudienceError(
          "Please select at least one subscription plan"
        );

        valid = false;
      }

    } else if (

      audience === "SELECTED_PROPERTIES" ||
      audience === "PROPERTIES" ||
      audience === "SELECTED_HOSTELS" ||
      audience === "HOSTELS"
    ) {

      if (
        !selectedProperties ||
        selectedProperties.length === 0
      ) {

        setAudienceError(
          "Please select at least one property"
        );

        valid = false;
      }

    } else if (

      audience === "SELECTED_OWNERS" ||
      audience === "OWNERS" ||
      audience === "CUSTOMERS"
    ) {

      if (
        !selectedOwners ||
        selectedOwners.length === 0
      ) {

        setAudienceError(
          "Please select at least one owner"
        );

        valid = false;
      }
    }




    if (!publishing) {

      setPublishingError(
        "Please select a publishing option"
      );

      valid = false;
    }

if (isScheduleSelected) {

  // Publish Date
  if (!publishDate) {

    setPublishDateError(
      "Publish Date is required"
    );

    valid = false;
  }


  // Publish Time
  if (!publishTime) {

    setPublishTimeError(
      "Publish Time is required"
    );

    valid = false;
  }


  // Expiry Date
  if (!expiryDate) {

    setExpiryDateError(
      "Expiry Date is required"
    );

    valid = false;
  }
}


    return valid;
  };
  // const handleCreateProductUpdate = async () => {
  //   try {
  //     const isValid = validateForm();

  //     if (!isValid) {
  //       return;
  //     }
  //     const payload = {
  //       title: updateTitle,
  //       description: shortDescription,
  //       version: version,
  //       releaseDate: releaseDate,

       
  //       updateType: updateType,

        
  //       platform: platform,

        
  //       publishDate: publishDate,
  //       publishTime: publishTime,
  //       expiryDate: expiryDate,

        
  //       audience: audience,

  //       audienceIds:
  //         audience === "SELECTED_PLANS"
  //           ? selectedPlans.map(String)
  //           : (
  //             audience === "SELECTED_OWNERS" ||
  //             audience === "OWNERS" ||
  //             audience === "CUSTOMERS"
  //           )
  //             ? selectedOwners.map((owner) =>
  //               String(owner?.parentId)
  //             )
  //             : [],

      
  //       publishStatus: publishing,

        
  //       productUpdateItems: updateItems.map((item) => ({
  //         clientId: item.clientId,
  //         title: item.title,
  //         description: item.description,
  //         updateType: item.itemType,
  //         module: item.relatedModule,
  //         cta: item.cta,
  //         ctaLink: item.ctaLink,
  //       })),
  //     };

     

  //     const result = await createProductUpdate(
  //       payload,
  //       updateItems
  //     );

  //     if (result.success) {


  //       setModalType("success");
  //       setMessage(res?.message);
  //       setShowSuccess(true);

  //       setTimeout(() => {
  //         setShowSuccess(false);


  //       }, 800);
  //     } else {

  //       setModalType("error");
  //       setMessage(res?.message);
  //       setShowSuccess(true);

  //       setTimeout(() => {
  //         setShowSuccess(false);


  //       }, 800);
  //     }

  //   } catch (error) {
  //     console.error("Create Product Update Error:", error);
  //   }
  // };
  const resetProductUpdateForm = () => {
  // Basic Information
  setUpdateTitle("");
  setShortDescription("");
  setVersion("");
  setReleaseDate("");
  setUpdateType("");
  setPlatform("");

  // What's New
  setUpdateItems([]);

  // Audience
  setAudience("");
  setSelectedPlans([]);
  setSelectedProperties([]);
  setSelectedOwners([]);

  // Publishing
  setPublishing("");
  setPublishDate("");
  setPublishTime("");
  setExpiryDate("");

  // Search states
  setSearch("");
  setCustomerSearch("");
  setOwnerSearch("");
  setPropertySearch("");

  // Lists
  setOwnersList([]);
  setPropertiesList([]);

  // Dropdowns / Popups
  setShowOwnerPopup(false);
  setShowOwnerDropdown(false);

  setShowPlanPopup(false);
  setShowPlanDropdown(false);

  setShowPropertyPopup(false);
  setShowPropertyDropdown(false);

  setShowPreviewModal(false);

  // Validation errors
  setTitleError("");
  setDescriptionError("");
  setTypeError("");
  setPlatformError("");
  setAudienceError("");
  setPublishingError("");
  setItemsError("");

  setItemTypeErrors({});
  setItemTitleErrors({});
  setItemDescriptionErrors({});
  setItemModuleErrors({});
  setItemCtaErrors({});
  setItemCtaLinkErrors({});
  setPublishDateError("");
setPublishTimeError("");
setExpiryDateError("");
};
const handleCreateProductUpdate = async () => {
   // Prevent multiple clicks / duplicate API calls
  if (isSubmittingRef.current) {
    return;
  }

  isSubmittingRef.current = true;
  setIsSubmitting(true);
  try {

   const isValid = validateForm();

if (!isValid) {
  isSubmittingRef.current = false;
  setIsSubmitting(false);
  return;
}

    const payload = {
      title: updateTitle,
      description: shortDescription,
      version: version,
      releaseDate: releaseDate,

     
      updateType: updateType,

     
      platform: platform,

   
      publishDate: publishDate,
      publishTime: publishTime,
      expiryDate: expiryDate,

   
      audience: audience,

     audienceIds:
  audience === "SELECTED_PLANS" ||
  audience === "PLANS"
    ? selectedPlans.map(String)

    : audience === "SELECTED_PROPERTIES" ||
      audience === "PROPERTIES" ||
      audience === "SELECTED_HOSTELS" ||
      audience === "HOSTELS"
    ? selectedProperties
        .map(
          (property) =>
            property?.propertyId ||
            property?.hostelId ||
            property?.id
        )
        .filter(Boolean)
        .map(String)

    : audience === "SELECTED_OWNERS" ||
      audience === "OWNERS" ||
      audience === "CUSTOMERS"
    ? selectedOwners
        .map((owner) => owner?.parentId)
        .filter(Boolean)
        .map(String)

    : [],

  
      publishStatus: publishing,

      
      productUpdateItems: updateItems.map((item) => ({
        clientId: item.clientId,
        title: item.title,
        description: item.description,
        updateType: item.itemType,
        module: item.relatedModule,
        cta: item.cta,
        ctaLink: item.ctaLink,
      })),
    };

    console.log(
      "PRODUCT UPDATE PAYLOAD:",
      payload
    );

    const result = await createProductUpdate(
      payload,
      updateItems
    );

    console.log(
      "CREATE PRODUCT UPDATE RESULT:",
      result
    );


  

    if (result?.success) {

      setModalType("success");

      
      setMessage(
        result?.message ||
        "Product update created successfully"
      );

      setShowSuccess(true);


   
      resetProductUpdateForm();


      
      setTimeout(() => {

        setShowSuccess(false);

        navigate(-1);

      }, 1200);


      return;
    }


  

    setModalType("error");

    setMessage(
      result?.message ||
      "Failed to create product update"
    );

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);


  } catch (error) {

  console.error(
    "Create Product Update Error:",
    error
  );

  setModalType("error");

  setMessage(
    error?.message ||
    "Something went wrong"
  );

  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
  }, 2000);

  // Allow submit again after API error
  isSubmittingRef.current = false;
  setIsSubmitting(false);
}
};
  const handlePropertySearch = async (value) => {
    const searchValue = value.trim();

    setPropertySearch(value);

    if (searchValue.length < 2) {
      setPropertiesList([]);
      setShowPropertyDropdown(false);
      return;
    }

    try {
      setPropertyLoading(true);
      setShowPropertyDropdown(true);

      const res = await searchHostels(searchValue);

      if (res?.success) {
        setPropertiesList(res.data || []);
      } else {
        setPropertiesList([]);
      }

    } catch (error) {
      console.error("Property Search Error:", error);
      setPropertiesList([]);
    } finally {
      setPropertyLoading(false);
    }
  };
  return (
    <DashboardLayout>
       <Toast
              show={showSuccess}
              message={message}
              type={modalType} />


      <div className="min-h-screen bg-[#F8F9FB]">

        
        <div className="sticky top-0 z-40 bg-white  px-5 py-3">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-gray-700 text-[16px] cursor-pointer"
              >
                ‹
              </button>

              <div>
                <h1 className="text-[14px] font-semibold text-gray-800">
                  Create Product Update
                </h1>

                <p className="text-[9px] text-gray-400 text-left">
                  Product Updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                className="
                  px-3 py-1.5
                  border border-gray-200
                  rounded-md
                  bg-white
                  text-[9px]
                  text-gray-600
                  cursor-pointer
                "
              >
                Save as Draft
              </button>

              <button
                type="button"
                className="
                  px-3 py-1.5
                  border border-[#2952F3]
                  text-[#2952F3]
                  rounded-md
                  bg-white
                  text-[9px]
                  cursor-pointer
                "
              >
                ▣ Preview
              </button>

            <button
  onClick={handleCreateProductUpdate}
  type="button"
  disabled={isSubmitting}
  className="
    px-3 py-1.5
    bg-[#2952F3]
    hover:bg-[#1E40D0]
    text-white
    rounded-md
    text-[9px]
    cursor-pointer
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  {isSubmitting ? "Publishing..." : "Publish"}
</button>

            </div>
          </div>
        </div>

     
        <div className="px-4 py-4">

          <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5 w-full">

           
            <div className="space-y-3">

           
              <div className="bg-white border border-gray-200 rounded-lg p-4">

                <h2 className="text-[14px] font-semibold text-gray-800 mb-4 text-left">
                  Basic Information
                </h2>

                
                <div className="mb-3">

                  <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
                    Update Title
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    value={updateTitle}
                    onChange={(e) => {
                      setUpdateTitle(e.target.value);
                      setTitleError("");
                    }}
                    placeholder="e.g. Introducing Expense Management"
                    className="
                      w-full
                      h-8
                      border border-gray-200
                      rounded-md
                      px-2.5
                      text-[11px]
                      outline-none
                      focus:border-[#2952F3]
                    "
                  />

                </div>
                {titleError && (
                  <ErrorMessage message={titleError} type="error" />
                )}
              
                <div className="mb-3">

                  <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
                    Short Description
                    <span className="text-red-500"> *</span>
                  </label>

                  <textarea
                    value={shortDescription}
                    onChange={(e) => {
                      setShortDescription(e.target.value);
                      setDescriptionError("");
                    }}
                    placeholder="Briefly describe what is new in this update."
                    rows={3}
                    className="
                      w-full
                      border border-gray-200
                      rounded-md
                      px-2.5 py-2
                     text-[11px]
                      outline-none
                      resize-none
                      focus:border-[#2952F3]
                    "
                  />

                </div>
                {descriptionError && (
                  <ErrorMessage message={descriptionError} type="error" />
                )}
               
                <div className="grid grid-cols-2 gap-2 mb-3">

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
                      Version
                    </label>

                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="e.g. v2.8.0"
                      className="
                        w-full
                        h-8
                        border border-gray-200
                        rounded-md
                        px-2.5
                        text-[11px]
                        outline-none
                        focus:border-[#2952F3]
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
                      Release Date
                    </label>

                    <DatePicker
                      format="DD-MM-YYYY"
                      value={releaseDate ? dayjs(releaseDate, "DD-MM-YYYY") : null}
                      onChange={(date) => {
                        setReleaseDate(date ? date.format("DD-MM-YYYY") : "");
                      }}
                      placeholder="dd-mm-yyyy"
                      className="
    w-full
    h-8
    text-[11px]
    rounded-md
  "
                    />
                  </div>

                </div>

               
                <div className="grid grid-cols-2 gap-2">

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
                      Update Type
                      <span className="text-red-500"> *</span>
                    </label>

                    <select
                      value={updateType}
                      onChange={(e) => {
                        setUpdateType(e.target.value);
                        setTypeError("");
                      }}
                      className="
    w-full
    h-8
    border border-gray-200
    rounded-md
    px-2.5
   text-[11px]
    text-gray-500
    outline-none
    cursor-pointer
  "
                    >
                      <option value="">Select type</option>

                      {updateTypes?.map((type) => (
                        <option
                          key={type.key}
                          value={type.key}
                        >
                          {type.value}
                        </option>
                      ))}
                    </select>
                    {typeError && (
                      <ErrorMessage message={typeError} type="error" />
                    )}
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
                      Platform
                      <span className="text-red-500"> *</span>
                    </label>

                    <select
                      value={platform}
                      onChange={(e) => {
                        setPlatform(e.target.value);
                        setPlatformError("");
                      }}
                      className="
    w-full
    h-8
    border border-gray-200
    rounded-md
    px-2.5
    text-[11px]
    text-gray-500
    outline-none
    cursor-pointer
  "
                    >
                      <option value="">Select platform</option>

                      {platforms?.map((item, index) => (
                        <option
                          key={item?.key || index}
                          value={item?.key}
                        >
                          {item?.value}
                        </option>
                      ))}
                    </select>
                    {platformError && (
                      <ErrorMessage message={platformError} type="error" />
                    )}
                  </div>

                </div>

              </div>


            
              <div className="bg-white border border-gray-200 rounded-lg p-4">

                <h2 className="text-[12px] font-semibold text-gray-800 text-left">
                  What's New
                </h2>

                <p className="text-[11px] text-gray-400 mt-1 text-left">
                  Add the features, improvements or fixes included in this release.
                </p>

                
                {updateItems.length === 0 ? (

                  <div
                    className="
        mt-4
        h-[58px]
        border border-gray-200
        rounded-md
        flex flex-col
        items-center
        justify-center
      "
                  >
                    <div className="text-gray-300 text-[18px]">
                      ◇
                    </div>

                    <p className="text-[11px] text-gray-400 mt-1">
                      No items yet. Add your first update item.
                    </p>
                  </div>

                ) : (

                  <div className="mt-4 space-y-2">

                    {updateItems.map((item, index) => (

                      <div
                        key={item.id}
                        className="
            border border-gray-200
            rounded-md
            p-2.5
            bg-white
          "
                      >

                      
                        <div className="flex items-center justify-between mb-2">

                          <div className="flex items-center gap-2">

                            <span className="text-[8px] text-gray-300">
                              ⋮⋮
                            </span>

                            <span className="text-[8px] text-gray-500">
                              Item {index + 1}
                            </span>

                          </div>

                          <div className="flex items-center gap-2">

                            
                            <button
                              type="button"
                              onClick={() => {
                                const duplicate = {
                                  ...item,
                                  id: Date.now() + Math.random(),
                                  clientId: `item-${updateItems.length + 1}-${Date.now()}`,
                                };

                                setUpdateItems((prev) => {
                                  const newItems = [...prev];
                                  newItems.splice(index + 1, 0, duplicate);
                                  return newItems;
                                });
                              }}
                              className="
                  text-gray-400
                  hover:text-[#2952F3]
                  cursor-pointer
                  text-[10px]
                "
                              title="Duplicate"
                            >
                              ⧉
                            </button>

                           
                            <button
                              type="button"
                              onClick={() => {
                                setUpdateItems((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="
                  text-red-400
                  hover:text-red-600
                  cursor-pointer
                  text-[10px]
                "
                              title="Delete"
                            >
                              🗑
                            </button>

                          </div>

                        </div>

                      
                        <div className="grid grid-cols-2 gap-2">

                          <div>

                            <label className="block text-[7px] text-gray-500 mb-1 text-left">
                              Item Type
                            </label>

                            <select
                              value={item.itemType}
                              onChange={(e) => {
                                const value = e.target.value;

                                setUpdateItems((prev) =>
                                  prev.map((updateItem, i) =>
                                    i === index
                                      ? {
                                        ...updateItem,
                                        itemType: value,
                                      }
                                      : updateItem
                                  )
                                );
                                setItemTypeErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[index];
                                  return newErrors;
                                });
                                setItemsError("");
                              }}
                              className="
    w-full
    h-7
    border border-gray-200
    rounded-md
    px-2
    text-[11px]
    text-gray-600
    outline-none
    cursor-pointer
  "
                            >
                              <option value="">
                                Select
                              </option>

                              {updateTypes?.map((type) => (
                                <option
                                  key={type.key}
                                  value={type.key}
                                >
                                  {type.value}
                                </option>
                              ))}
                            </select>
                            {itemTypeErrors[index] && (
                              <ErrorMessage
                                message={itemTypeErrors[index]}
                                type="error"
                              />
                            )}
                          </div>

                          <div>

                            <label className="block text-[7px] text-gray-500 mb-1 text-left">
                              Title
                              <span className="text-red-500"> *</span>
                            </label>

                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const value = e.target.value;

                                setUpdateItems((prev) =>
                                  prev.map((updateItem, i) =>
                                    i === index
                                      ? {
                                        ...updateItem,
                                        title: value,
                                      }
                                      : updateItem
                                  )
                                );
                                setItemTitleErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[index];
                                  return newErrors;
                                });
                                setItemsError("");

                              }}
                              placeholder="e.g. Expense Management"
                              className="
                  w-full
                  h-7
                  border border-gray-200
                  rounded-md
                  px-2
                  text-[8px]
                  outline-none
                  focus:border-[#2952F3]
                "
                            />
                            {itemTitleErrors[index] && (
                              <ErrorMessage
                                message={itemTitleErrors[index]}
                                type="error"
                              />
                            )}
                          </div>

                        </div>

                        
                        <div className="mt-2">

                          <label className="block text-[12px] text-gray-500 mb-1 text-left">
                            Description
                            <span className="text-red-500"> *</span>
                          </label>

                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const value = e.target.value;

                              setUpdateItems((prev) =>
                                prev.map((updateItem, i) =>
                                  i === index
                                    ? {
                                      ...updateItem,
                                      description: value,
                                    }
                                    : updateItem
                                )
                              );

                              // Clear only this item's description error
                              setItemDescriptionErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors[index];
                                return newErrors;
                              });
                              setItemsError("");
                            }}
                            placeholder="Describe the feature, improvement or fix..."
                            rows={2}
                            className="
      w-full
      border border-gray-200
      rounded-md
      px-2 py-1.5
      text-[8px]
      outline-none
      resize-none
      focus:border-[#2952F3]
    "
                          />

                          {itemDescriptionErrors[index] && (
                            <ErrorMessage
                              message={itemDescriptionErrors[index]}
                              type="error"
                            />
                          )}

                        </div>


                        <div className="grid grid-cols-3 gap-2 mt-2">

                          <div>

                            <label className="block text-[7px] text-gray-500 mb-1 text-left">
                              Related Module
                              <span className="text-red-500"> *</span>
                            </label>

                            <select
                              value={item.relatedModule}
                              onChange={(e) => {
                                const value = e.target.value;

                                setUpdateItems((prev) =>
                                  prev.map((updateItem, i) =>
                                    i === index
                                      ? {
                                        ...updateItem,
                                        relatedModule: value,
                                      }
                                      : updateItem
                                  )
                                );

                                
                                setItemModuleErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[index];
                                  return newErrors;
                                });
                                setItemsError("");
                              }}
                              className={`
      w-full
      h-7
      border
      rounded-md
      px-2
      text-[8px]
      text-gray-600
      outline-none
      cursor-pointer
      ${itemModuleErrors[index]
                                  ? "border-red-500"
                                  : "border-gray-200"
                                }
    `}
                            >
                              <option value="">Select</option>

                              {modules?.map((module) => (
                                <option
                                  key={module.key}
                                  value={module.key}
                                >
                                  {module.value}
                                </option>
                              ))}
                            </select>

                            {itemModuleErrors[index] && (
                              <ErrorMessage
                                message={itemModuleErrors[index]}
                                type="error"
                              />
                            )}

                          </div>

                          <div>

                            <label className="block text-[7px] text-gray-500 mb-1 text-left">
                              CTA
                              <span className="text-red-500"> *</span>
                            </label>

                            <select
                              value={item.cta}
                              onChange={(e) => {
                                const value = e.target.value;

                                setUpdateItems((prev) =>
                                  prev.map((updateItem, i) =>
                                    i === index
                                      ? {
                                        ...updateItem,
                                        cta: value,
                                      }
                                      : updateItem
                                  )
                                );

                                // Clear only this item's CTA error
                                setItemCtaErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[index];
                                  return newErrors;
                                });
                                setItemsError("");
                              }}
                              className={`
      w-full
      h-7
      border
      rounded-md
      px-2
      text-[8px]
      text-gray-600
      outline-none
      cursor-pointer
      ${itemCtaErrors[index]
                                  ? "border-red-500"
                                  : "border-gray-200"
                                }
    `}
                            >
                              <option value="">
                                No CTA
                              </option>

                              {ctas?.map((cta, index) => (
                                <option
                                  key={cta?.key || index}
                                  value={cta?.key}
                                >
                                  {cta?.value}
                                </option>
                              ))}
                            </select>

                            {itemCtaErrors[index] && (
                              <ErrorMessage
                                message={itemCtaErrors[index]}
                                type="error"
                              />
                            )}

                          </div>

                          <div>

                            <label className="block text-[7px] text-gray-500 mb-1 text-left">
                              CTA Link
                              <span className="text-red-500"> *</span>
                            </label>

                            <input
                              type="text"
                              value={item.ctaLink}
                              onChange={(e) => {
                                const value = e.target.value;

                                setUpdateItems((prev) =>
                                  prev.map((updateItem, i) =>
                                    i === index
                                      ? {
                                        ...updateItem,
                                        ctaLink: value,
                                      }
                                      : updateItem
                                  )
                                );

                                // Clear only this item's CTA Link error
                                setItemCtaLinkErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[index];
                                  return newErrors;
                                });
                                setItemsError("");
                              }}
                              placeholder="/path or URL"
                              className={`
      w-full
      h-7
      border
      rounded-md
      px-2
      text-[8px]
      outline-none
      focus:border-[#2952F3]
      ${itemCtaLinkErrors[index]
                                  ? "border-red-500"
                                  : "border-gray-200"
                                }
    `}
                            />

                            {itemCtaLinkErrors[index] && (
                              <ErrorMessage
                                message={itemCtaLinkErrors[index]}
                                type="error"
                              />
                            )}

                          </div>

                        </div>

                        <div className="mt-2">

                          <label className="block text-[7px] text-gray-500 mb-1">
                            Attachments - relevant to the update
                          </label>

                          <label
                            className="
                w-full
                h-11
                border border-gray-200
                rounded-md
                bg-gray-50
                flex
                items-center
                justify-center
                gap-2
                cursor-pointer
                hover:bg-gray-100
              "
                          >

                            <Upload
                              size={13}
                              className="text-[#2952F3]"
                            />

                            <div className="text-center">

                              <p className="text-[7px] text-[#2952F3]">
                                Choose Image to Upload
                              </p>

                              <p className="text-[6px] text-gray-400 mt-0.5">
                                JPG/JPEG Format
                              </p>

                            </div>

                            <input
                              type="file"
                              accept="image/jpeg,image/jpg"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];

                                if (!file) return;

                                try {
                                  const compressedFile = await compressImage(file);

                                  setUpdateItems((prev) =>
                                    prev.map((updateItem, i) =>
                                      i === index
                                        ? {
                                          ...updateItem,
                                          attachment: compressedFile,
                                        }
                                        : updateItem
                                    )
                                  );

                                  console.log("Original size:", file.size);
                                  console.log("Compressed size:", compressedFile.size);

                                } catch (error) {
                                  console.error("Image compression error:", error);
                                }
                              }}
                            />

                          </label>

                        </div>

                      </div>

                    ))}

                  </div>

                )}
                {itemsError && (
                  <ErrorMessage
                    message={itemsError}
                    type="error"
                  />
                )}

                <button
                  type="button"
                  onClick={handleAddUpdateItem}
                  className="
      w-full
      h-7
      mt-2
      border
      border-dashed
      border-[#B8C8FF]
      rounded-md
      text-[8px]
      text-[#2952F3]
      hover:bg-[#F5F7FF]
      cursor-pointer
    "
                >
                  + &nbsp; Add Update Item
                </button>

              </div>


              <div className="bg-white border border-gray-200 rounded-lg p-4">

                <h2 className="text-[11px] font-semibold text-gray-800 mb-3 text-left">
                  Who should see this update?
                </h2>

                {audiences?.map((item) => {
                  const key = item?.key;

                  return (
                    <AudienceOption
                      key={key}
                      value={key}
                      selected={audience}
                      onChange={(value) => {
                        setAudience(value);

                        // Clear audience error
                        setAudienceError("");

                        if (
                          value === "SELECTED_PLANS" ||
                          value === "PLANS"
                        ) {
                          setShowPlanPopup(true);
                          setShowPlanDropdown(false);
                        }

                        if (
                          value === "SELECTED_PROPERTIES" ||
                          value === "PROPERTIES" ||
                          value === "SELECTED_HOSTELS" ||
                          value === "HOSTELS"
                        ) {
                          setShowPropertyPopup(true);
                          setShowPropertyDropdown(false);
                        }

                        if (
                          value === "SELECTED_OWNERS" ||
                          value === "OWNERS" ||
                          value === "CUSTOMERS"
                        ) {
                          setShowOwnerPopup(true);
                          setShowOwnerDropdown(false);
                        }
                      }}
                      title={item?.value}
                      description={item?.description}
                      showView={
                        (
                          (key === "SELECTED_PLANS" || key === "PLANS") &&
                          selectedPlans.length > 0
                        ) ||
                        (
                          (
                            key === "SELECTED_OWNERS" ||
                            key === "OWNERS" ||
                            key === "CUSTOMERS"
                          ) &&
                          selectedOwners.length > 0
                        )
                      }
                      onView={() => {

                        if (
                          key === "SELECTED_PLANS" ||
                          key === "PLANS"
                        ) {
                          setShowPlanPopup(true);
                          setShowPlanDropdown(false);
                        }

                        if (
                          key === "SELECTED_OWNERS" ||
                          key === "OWNERS" ||
                          key === "CUSTOMERS"
                        ) {
                          setShowOwnerPopup(true);
                          setShowOwnerDropdown(false);
                        }

                      }}
                    />
                  );
                })}

                {audienceError && (
                  <ErrorMessage
                    message={audienceError}
                    type="error"
                  />
                )}

              </div>

             

<div className="bg-white border border-gray-200 rounded-lg p-4">

  <h2 className="text-[11px] font-semibold text-gray-800 mb-3 text-left">
    Publishing
  </h2>

  {publishStatuses?.map((status) => (
    <PublishOption
      key={status.key}
      value={status.key}
      selected={publishing}
      onChange={(value) => {

        // Set selected publishing status
        setPublishing(value);

        // Clear publishing error
        setPublishingError("");

        // Find selected status from API
        const selectedStatus = publishStatuses?.find(
          (item) => item?.key === value
        );

        // Check whether selected option is Schedule
        const isSchedule =
          selectedStatus?.value
            ?.trim()
            ?.toLowerCase() === "schedule";

        // If NOT Schedule, clear schedule fields
        if (!isSchedule) {

          setPublishDate("");
          setPublishTime("");
          setExpiryDate("");

          setPublishDateError("");
          setPublishTimeError("");
          setExpiryDateError("");
        }
      }}
      title={status.value}
      description={status.description}
    />
  ))}

  {/* Publishing Error */}
  {publishingError && (
    <ErrorMessage
      message={publishingError}
      type="error"
    />
  )}

</div>


{/* ==============================
    SCHEDULE DATE & TIME
================================ */}

{isScheduleSelected && (

  <div className="bg-white border border-gray-200 rounded-lg p-4">

    <div className="mt-3 bg-[#F8F9FB] rounded-xl p-3">

      {/* =========================
          PUBLISH DATE + TIME
      ========================= */}

      <div className="grid grid-cols-2 gap-2">

        {/* PUBLISH DATE */}

        <div>

          <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
            Publish Date
            <span className="text-red-500"> *</span>
          </label>

          <DatePicker
            format="DD-MM-YYYY"

            value={
              publishDate
                ? dayjs(
                    publishDate,
                    "DD-MM-YYYY"
                  )
                : null
            }

            onChange={(date) => {

              const value = date
                ? date.format("DD-MM-YYYY")
                : "";

              setPublishDate(value);

              // Clear error
              setPublishDateError("");
            }}

            placeholder="dd-mm-yyyy"

            className="
              w-full
              h-8
              text-[11px]
              rounded-md
            "
          />

          {publishDateError && (
            <ErrorMessage
              message={publishDateError}
              type="error"
            />
          )}

        </div>


        {/* PUBLISH TIME */}

        <div>

          <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
            Publish Time
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="time"

            value={publishTime}

            onChange={(e) => {

              setPublishTime(
                e.target.value
              );

              // Clear error
              setPublishTimeError("");
            }}

            className="
              w-full
              h-8
              border
              border-gray-200
              rounded-md
              bg-white
              px-2.5
              text-[11px]
              text-gray-600
              outline-none
              focus:border-[#2952F3]
            "
          />

          {publishTimeError && (
            <ErrorMessage
              message={publishTimeError}
              type="error"
            />
          )}

        </div>

      </div>


      {/* =========================
          TIMEZONE
      ========================= */}

      <p className="text-[8px] text-gray-400 mt-2.5 text-left">
        Timezone: IST (UTC+5:30)
      </p>


      {/* =========================
          EXPIRY DATE
      ========================= */}

      <div className="mt-3">

        <label className="block text-[12px] font-medium text-gray-700 mb-1.5 text-left">
          Expiry Date
          <span className="text-red-500"> *</span>
        </label>

        <DatePicker
          format="DD-MM-YYYY"

          value={
            expiryDate
              ? dayjs(
                  expiryDate,
                  "DD-MM-YYYY"
                )
              : null
          }

          onChange={(date) => {

            const value = date
              ? date.format("DD-MM-YYYY")
              : "";

            setExpiryDate(value);

            // Clear error
            setExpiryDateError("");
          }}

          placeholder="dd-mm-yyyy"

          className="
            w-full
            h-8
            text-[8px]
            rounded-md
          "
        />

        {expiryDateError && (
          <ErrorMessage
            message={expiryDateError}
            type="error"
          />
        )}

      </div>

    </div>

  </div>
)}

            {/* SCHEDULE DATE & TIME */}
{publishing === "SCHEDULE" && (
  <div className="bg-white border border-gray-200 rounded-lg p-4">

    <div className="mt-3 bg-[#F8F9FB] rounded-xl p-3">

      {/* Publish Date + Publish Time */}
      <div className="grid grid-cols-2 gap-2">

        {/* Publish Date */}
        <div>
          <label className="block text-[8px] font-medium text-gray-700 mb-1.5 text-left">
            Publish Date
            <span className="text-red-500"> *</span>
          </label>

          <DatePicker
            format="DD-MM-YYYY"
            value={
              publishDate
                ? dayjs(publishDate, "DD-MM-YYYY")
                : null
            }
            onChange={(date) => {
              setPublishDate(
                date ? date.format("DD-MM-YYYY") : ""
              );
            }}
            placeholder="dd-mm-yyyy"
            className="w-full h-8 text-[8px] rounded-md"
          />

          {publishDateError && (
            <ErrorMessage
              message={publishDateError}
              type="error"
            />
          )}
        </div>

        {/* Publish Time */}
        <div>
          <label className="block text-[8px] font-medium text-gray-700 mb-1.5 text-left">
            Publish Time
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="time"
            value={publishTime}
            onChange={(e) => {
              setPublishTime(e.target.value);
              setPublishTimeError("");
            }}
            className="
              w-full
              h-8
              border border-gray-200
              rounded-md
              bg-white
              px-2.5
              text-[8px]
              text-gray-600
              outline-none
              focus:border-[#2952F3]
            "
          />

          {publishTimeError && (
            <ErrorMessage
              message={publishTimeError}
              type="error"
            />
          )}
        </div>

      </div>

      {/* Timezone */}
      <p className="text-[8px] text-gray-400 mt-2.5 text-left">
        Timezone: IST (UTC+5:30)
      </p>

      {/* Expiry Date */}
      <div className="mt-3">

        <label className="block text-[8px] font-medium text-gray-700 mb-1.5 text-left">
          Expiry Date
          <span className="text-red-500"> *</span>
        </label>

        <DatePicker
          format="DD-MM-YYYY"
          value={
            expiryDate
              ? dayjs(expiryDate, "DD-MM-YYYY")
              : null
          }
          onChange={(date) => {
            setExpiryDate(
              date ? date.format("DD-MM-YYYY") : ""
            );
            setExpiryDateError("");
          }}
          placeholder="dd-mm-yyyy"
          className="w-full h-8 text-[8px] rounded-md"
        />

        {expiryDateError && (
          <ErrorMessage
            message={expiryDateError}
            type="error"
          />
        )}

      </div>

    </div>
  </div>
)}
            </div>


            <div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sticky top-20">

                <div className="flex items-center gap-2 mb-3">

                  <div className="text-[#2952F3] text-[10px]">
                    ▣
                  </div>

                  <h2 className="text-[8px] font-semibold text-gray-700">
                    Owner App Preview
                  </h2>

                </div>

                {/* Mobile */}
                {/* Mobile Preview */}
                <div
                  className="
    mx-auto
    w-[112px]
    h-[242px]
    bg-[#202632]
    rounded-[18px]
    p-[4px]
    shadow-md
  "
                >
                  <div
                    className="
      w-full
      h-full
      bg-white
      rounded-[14px]
      overflow-hidden
      flex
      flex-col
      relative
    "
                  >

                    {/* =========================
        PHONE HEADER
    ========================= */}

                    <div
                      className="
        h-7
        min-h-7
        px-2
        flex
        items-center
        justify-between
        border-b
        border-gray-100
        bg-white
        z-10
      "
                    >
                      <span className="text-[6px] font-semibold text-[#2952F3]">
                        ◉ Smartstay
                      </span>

                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="text-[5px] text-gray-400"
                      >
                        See All
                      </button>
                    </div>


                    {/* =========================
        SCROLLABLE CONTENT
    ========================= */}

                    <div
                      className="
        flex-1
        min-h-0
        overflow-y-auto
        overflow-x-hidden
        overscroll-contain
        scrollbar-thin
      "
                    >

                      <div className="px-2 pt-3 pb-5">

                        {/* What's New Header */}
                        <div className="flex items-center justify-between">

                          <p className="text-[7px] font-semibold text-gray-700">
                            What's New
                          </p>

                          <button
                            type="button"
                            onClick={() => setShowPreviewModal(true)}
                            className="text-[5px] text-[#2952F3]"
                          >
                            See All
                          </button>

                        </div>


                        {/* =========================
            UPDATE ITEMS
        ========================= */}

                        <div className="mt-2 space-y-2">

                          {updateItems.length === 0 ? (

                            <div
                              className="
                h-[80px]
                border
                border-gray-100
                rounded-md
                flex
                items-center
                justify-center
              "
                            >
                              <p className="text-[5px] text-gray-300 text-center">
                                Add items to see preview
                              </p>
                            </div>

                          ) : (

                            updateItems.map((item, index) => {

                              const itemTypeLabel =
                                updateTypes?.find(
                                  (type) =>
                                    type.key === item.itemType
                                )?.value ||
                                item.itemType ||
                                "New feature";


                              const ctaLabel =
                                ctas?.find(
                                  (cta) =>
                                    cta.key === item.cta
                                )?.value ||
                                item.cta ||
                                "Learn more";


                              return (
                                <div
                                  key={item.id || index}
                                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-lg
                    p-2
                    shadow-sm
                    shrink-0
                  "
                                >

                                  {/* ITEM TYPE */}

                                  {item.itemType && (
                                    <span
                                      className="
                        inline-block
                        px-1.5
                        py-0.5
                        rounded
                        bg-[#EEF3FF]
                        text-[#2952F3]
                        text-[4.5px]
                        font-semibold
                      "
                                    >
                                      {itemTypeLabel}
                                    </span>
                                  )}


                                  {/* TITLE */}

                                  <p
                                    className="
                      mt-1
                      text-[6px]
                      font-semibold
                      text-gray-800
                      break-words
                    "
                                  >
                                    {item.title || "Update Title"}
                                  </p>


                                  {/* DESCRIPTION */}

                                  <p
                                    className="
                      mt-1
                      text-[4.8px]
                      text-gray-400
                      line-clamp-2
                      break-words
                    "
                                  >
                                    {item.description ||
                                      "Description will appear here."}
                                  </p>


                                  {/* CTA */}

                                  {item.cta && (
                                    <button
                                      type="button"
                                      className="
                        mt-2
                        w-full
                        h-[18px]
                        bg-[#2952F3]
                        text-white
                        rounded
                        text-[5px]
                      "
                                    >
                                      {ctaLabel}
                                    </button>
                                  )}

                                </div>
                              );
                            })

                          )}

                        </div>

                      </div>

                    </div>


                    {/* =========================
        PHONE HOME INDICATOR
    ========================= */}

                    <div
                      className="
        absolute
        bottom-[5px]
        left-1/2
        -translate-x-1/2
        w-8
        h-1
        bg-gray-200
        rounded-full
        pointer-events-none
      "
                    />

                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
      {showPlanPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowPlanPopup(false)}
          />

          {/* Popup */}
          <div className="
      relative
      w-[400px]
      bg-white
      rounded-xl
      shadow-2xl
      p-5
      z-[110]
    ">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-[13px] font-semibold text-gray-800">
                  Select Subscription Plans
                </h2>

                <p className="text-[9px] text-gray-400 mt-1">
                  Select one or more plans to target
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPlanPopup(false)}
                className="
            w-7 h-7
            rounded-md
            flex items-center justify-center
            text-gray-500
            hover:bg-gray-100
            cursor-pointer
          "
              >
                ×
              </button>

            </div>


            {/* Multi Select Dropdown */}
            <div className="relative">

              <button
                type="button"
                onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                className="
            w-full
            h-10
            border border-gray-200
            rounded-lg
            px-3
            flex
            items-center
            justify-between
            text-left
            text-[10px]
            text-gray-600
            bg-white
            cursor-pointer
          "
              >

                <span>
                  {selectedPlans.length === 0
                    ? "Select subscription plans"
                    : `${selectedPlans.length} plan${selectedPlans.length > 1 ? "s" : ""} selected`
                  }
                </span>

                <span className="text-gray-400">
                  ▾
                </span>

              </button>


              {/* Dropdown */}
              {showPlanDropdown && (
                <div className="
            absolute
            left-0
            right-0
            mt-1
            bg-white
            border border-gray-200
            rounded-lg
            shadow-lg
            z-[120]
            max-h-[180px]
            overflow-y-auto
          ">

                  {plans.map((plan) => {

                    const checked = selectedPlans.includes(plan.planId);

                    return (
                      <label
                        key={plan.planId}
                        className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2.5
                    hover:bg-[#F7F9FF]
                    cursor-pointer
                  "
                      >

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedPlans((prev) => {
                              if (prev.includes(plan.planId)) {
                                return prev.filter(
                                  (planId) => planId !== plan.planId
                                );
                              }

                              return [...prev, plan.planId];
                            });

                            setAudienceError("");
                          }}
                          className="accent-[#2952F3] cursor-pointer"
                        />

                        <span className="text-[10px] text-gray-700">
                          {plan.planName}
                        </span>

                      </label>
                    );

                  })}

                </div>
              )}

            </div>


            {/* Selected Plans */}
            {selectedPlans.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">

                {selectedPlans.map((planId) => {

                  const plan = plans.find(
                    (item) => item.planId === planId
                  );

                  return (
                    <span
                      key={planId}
                      className="
                  px-2
                  py-1
                  rounded-md
                  bg-[#EEF3FF]
                  text-[#2952F3]
                  text-[9px]
                  flex
                  items-center
                  gap-1
                "
                    >
                      {plan?.planName}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlans((prev) =>
                            prev.filter((item) => item !== planId)
                          );
                        }}
                        className="text-[#2952F3] cursor-pointer"
                      >
                        ×
                      </button>

                    </span>
                  );

                })}

              </div>
            )}


            {/* Footer */}
            <div className="flex justify-end gap-2 mt-5">

              <button
                type="button"
                onClick={() => {
                  setShowPlanPopup(false);
                  setShowPlanDropdown(false);
                }}
                className="
            px-3 py-1.5
            border border-gray-200
            rounded-md
            text-[9px]
            text-gray-600
            cursor-pointer
          "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("Selected Plans:", selectedPlans);

                  setShowPlanDropdown(false);
                  setShowPlanPopup(false);
                }}
                className="
            px-4 py-1.5
            bg-[#2952F3]
            hover:bg-[#1E40D0]
            text-white
            rounded-md
            text-[9px]
            cursor-pointer
          "
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}
      {showOwnerPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setShowOwnerDropdown(false);
              setShowOwnerPopup(false);
              setOwnerSearch("");
              setOwnersList([]);
            }}
          />

          {/* Popup */}
          <div
            className="
        relative
        w-[400px]
        bg-white
        rounded-xl
        shadow-2xl
        p-5
        z-[110]
      "
          >

            {/* Header */}
            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-[13px] font-semibold text-gray-800">
                  Select Owners
                </h2>

                <p className="text-[9px] text-gray-400 mt-1">
                  Select one or more owners
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowOwnerDropdown(false);
                  setShowOwnerPopup(false);
                  setOwnerSearch("");
                  setOwnersList([]);
                }}
                className="
            w-7
            h-7
            rounded-md
            flex
            items-center
            justify-center
            text-gray-500
            hover:bg-gray-100
            cursor-pointer
          "
              >
                ×
              </button>

            </div>


            {/* Owner Search */}
            <div className="relative">

              <div
                className="
            w-full
            h-10
            border
            border-gray-200
            rounded-lg
            px-3
            flex
            items-center
            bg-white
          "
              >

                <input
                  type="text"
                  value={ownerSearch}
                  placeholder="Search owner..."
                  onChange={(e) => {
                    handleOwnerSearch(e.target.value);
                  }}
                  onFocus={() => {
                    if (ownerSearch.trim().length >= 2) {
                      setShowOwnerDropdown(true);
                    }
                  }}
                  className="
              w-full
              outline-none
              text-[10px]
              bg-transparent
              text-gray-700
            "
                />

                <Search
                  size={15}
                  className="text-gray-400 shrink-0"
                />

              </div>


              {/* Owner Dropdown */}
              {showOwnerDropdown && (
                <div
                  className="
      absolute
      top-[48px]
      left-0
      right-0
      bg-white
      border
      border-gray-200
      rounded-xl
      shadow-xl
      z-[99999]
      overflow-hidden
    "
                >

                  {/* Owner List */}
                  <div className="max-h-[220px] overflow-y-auto">

                    {ownerLoading ? (
                      <div className="px-4 py-5 text-center text-[10px] text-gray-400">
                        Searching...
                      </div>
                    ) : ownersList?.length > 0 ? (

                      ownersList.map((owner, index) => {

                        const ownerId = owner?.parentId;

                        const isSelected =
                          selectedOwners.includes(ownerId);

                        return (
                          <label
                            key={ownerId || index}
                            className="
                flex
                items-center
                gap-3
                px-4
                py-3
                border-b
                border-gray-100
                hover:bg-[#F5F7FF]
                cursor-pointer
              "
                          >

                            <input
                              type="checkbox"
                              checked={selectedOwners.some(
                                (item) => item?.parentId === owner?.parentId
                              )}
                              onChange={() => {
                                setSelectedOwners((prev) => {
                                  const exists = prev.some(
                                    (item) => item?.parentId === owner?.parentId
                                  );

                                  if (exists) {
                                    return prev.filter(
                                      (item) => item?.parentId !== owner?.parentId
                                    );
                                  }

                                  return [...prev, owner];
                                });
                              }}
                              className="
    w-4
    h-4
    accent-[#315CEC]
    cursor-pointer
  "
                            />

                            <div className="min-w-0">

                              <p className="text-[11px] font-medium text-gray-800">
                                {owner?.fullName}
                              </p>

                              {owner?.mobile && (
                                <p className="text-[9px] text-gray-500 mt-1">
                                  {owner.mobile}
                                </p>
                              )}

                            </div>

                          </label>
                        );
                      })

                    ) : (

                      <div className="px-4 py-5 text-center text-[10px] text-gray-400">
                        No owners found
                      </div>

                    )}

                  </div>


                  {/* DONE / SAVE */}
                  <div className="border-t border-gray-200 px-3 py-2 flex justify-end bg-white">

                    <button
                      type="button"
                      onClick={() => {

                        // Dropdown close
                        setShowOwnerDropdown(false);

                        // Search clear
                        setOwnerSearch("");

                        // List clear
                        setOwnersList([]);

                      }}
                      className="
          px-4
          py-1.5
          bg-[#2952F3]
          hover:bg-[#1E40D0]
          text-white
          rounded-md
          text-[10px]
          font-medium
          cursor-pointer
        "
                    >
                      Done
                    </button>

                  </div>

                </div>
              )}

            </div>


            {/* Selected Owners */}
            {selectedOwners.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">

                {selectedOwners.map((owner) => (
                  <span
                    key={owner?.parentId}
                    className="
          px-2
          py-1
          rounded-md
          bg-[#EEF3FF]
          text-[#2952F3]
          text-[9px]
          flex
          items-center
          gap-1
        "
                  >

                    {/* FULL NAME */}
                    {owner?.fullName}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOwners((prev) =>
                          prev.filter(
                            (item) =>
                              item?.parentId !== owner?.parentId
                          )
                        );
                      }}
                      className="
            text-[#2952F3]
            cursor-pointer
          "
                    >
                      ×
                    </button>

                  </span>
                ))}

              </div>
            )}


            {/* Footer */}
            <div className="flex justify-end gap-2 mt-5">

              {/* Cancel */}
              <button
                type="button"
                onClick={() => {

                  setSelectedOwners([]);

                  setOwnerSearch("");
                  setOwnersList([]);

                  setShowOwnerDropdown(false);
                  setShowOwnerPopup(false);

                }}
                className="
            px-3
            py-1.5
            border
            border-gray-200
            rounded-md
            text-[9px]
            text-gray-600
            hover:bg-gray-50
            cursor-pointer
          "
              >
                Cancel
              </button>


              {/* Done */}
              <button
                type="button"
                onClick={() => {

                  console.log(
                    "Selected Owners:",
                    selectedOwners
                  );

                  // IMPORTANT:
                  // Selection clear panna koodathu

                  setShowOwnerDropdown(false);
                  setShowOwnerPopup(false);

                  setOwnerSearch("");
                  setOwnersList([]);

                }}
                className="
            px-4
            py-1.5
            bg-[#2952F3]
            hover:bg-[#1E40D0]
            text-white
            rounded-md
            text-[9px]
            cursor-pointer
          "
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}

      {showPropertyPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setShowPropertyDropdown(false);
              setShowPropertyPopup(false);
              setPropertySearch("");
              setPropertiesList([]);
            }}
          />

          {/* Popup */}
          <div
            className="
        relative
        w-[400px]
        bg-white
        rounded-xl
        shadow-2xl
        p-5
        z-[110]
      "
          >

            {/* Header */}
            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-[13px] font-semibold text-gray-800">
                  Select Properties
                </h2>

                <p className="text-[9px] text-gray-400 mt-1">
                  Select one or more properties
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPropertyDropdown(false);
                  setShowPropertyPopup(false);
                  setPropertySearch("");
                  setPropertiesList([]);
                }}
                className="
            w-7 h-7
            rounded-md
            flex items-center justify-center
            text-gray-500
            hover:bg-gray-100
            cursor-pointer
          "
              >
                ×
              </button>

            </div>

            {/* Search */}
            <div className="relative">

              <div
                className="
            w-full
            h-10
            border
            border-gray-200
            rounded-lg
            px-3
            flex
            items-center
            bg-white
          "
              >

                <input
                  type="text"
                  value={propertySearch}
                  placeholder="Search property..."
                  onChange={(e) => {
                    handlePropertySearch(e.target.value);
                  }}
                  onFocus={() => {
                    if (propertySearch.trim().length >= 2) {
                      setShowPropertyDropdown(true);
                    }
                  }}
                  className="
              w-full
              outline-none
              text-[10px]
              bg-transparent
              text-gray-700
            "
                />

                <Search
                  size={15}
                  className="text-gray-400 shrink-0"
                />

              </div>

              {/* Dropdown */}
              {showPropertyDropdown && (
                <div
                  className="
              absolute
              top-[48px]
              left-0
              right-0
              bg-white
              border
              border-gray-200
              rounded-xl
              shadow-xl
              z-[99999]
              overflow-hidden
            "
                >

                  <div className="max-h-[220px] overflow-y-auto">

                    {propertyLoading ? (

                      <div className="px-4 py-5 text-center text-[10px] text-gray-400">
                        Searching...
                      </div>

                    ) : propertiesList?.length > 0 ? (

                      propertiesList.map((property, index) => {

                        // IMPORTANT:
                        // API response field names based on your actual response
                        const propertyId =
                          property?.propertyId ||
                          property?.hostelId ||
                          property?.id;

                        const propertyName =
                          property?.propertyName ||
                          property?.hostelName ||
                          property?.name;

                        const isSelected =
                          selectedProperties.some(
                            (item) =>
                              (
                                item?.propertyId ||
                                item?.hostelId ||
                                item?.id
                              ) === propertyId
                          );

                        return (
                          <label
                            key={propertyId || index}
                            className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        border-b
                        border-gray-100
                        hover:bg-[#F5F7FF]
                        cursor-pointer
                      "
                          >

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {

                                setSelectedProperties((prev) => {

                                  const exists = prev.some(
                                    (item) =>
                                      (
                                        item?.propertyId ||
                                        item?.hostelId ||
                                        item?.id
                                      ) === propertyId
                                  );

                                  if (exists) {
                                    return prev.filter(
                                      (item) =>
                                        (
                                          item?.propertyId ||
                                          item?.hostelId ||
                                          item?.id
                                        ) !== propertyId
                                    );
                                  }

                                  return [
                                    ...prev,
                                    property
                                  ];
                                });

                              }}
                              className="
                          w-4
                          h-4
                          accent-[#315CEC]
                          cursor-pointer
                        "
                            />

                            <div className="min-w-0">

                              <p className="text-[11px] font-medium text-gray-800">
                                {propertyName}
                              </p>

                            </div>

                          </label>
                        );
                      })

                    ) : (

                      <div className="px-4 py-5 text-center text-[10px] text-gray-400">
                        No properties found
                      </div>

                    )}

                  </div>

                  {/* Done */}
                  <div className="border-t border-gray-200 px-3 py-2 flex justify-end bg-white">

                    <button
                      type="button"
                      onClick={() => {
                        setShowPropertyDropdown(false);
                        setPropertySearch("");
                        setPropertiesList([]);
                      }}
                      className="
                  px-4
                  py-1.5
                  bg-[#2952F3]
                  hover:bg-[#1E40D0]
                  text-white
                  rounded-md
                  text-[10px]
                  font-medium
                  cursor-pointer
                "
                    >
                      Done
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* Selected Properties */}
            {selectedProperties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">

                {selectedProperties.map((property) => {

                  const propertyId =
                    property?.propertyId ||
                    property?.hostelId ||
                    property?.id;

                  const propertyName =
                    property?.propertyName ||
                    property?.hostelName ||
                    property?.name;

                  return (
                    <span
                      key={propertyId}
                      className="
                  px-2
                  py-1
                  rounded-md
                  bg-[#EEF3FF]
                  text-[#2952F3]
                  text-[9px]
                  flex
                  items-center
                  gap-1
                "
                    >

                      {propertyName}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProperties((prev) =>
                            prev.filter(
                              (item) =>
                                (
                                  item?.propertyId ||
                                  item?.hostelId ||
                                  item?.id
                                ) !== propertyId
                            )
                          );
                        }}
                        className="text-[#2952F3] cursor-pointer"
                      >
                        ×
                      </button>

                    </span>
                  );

                })}

              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-5">

              <button
                type="button"
                onClick={() => {
                  setSelectedProperties([]);
                  setPropertySearch("");
                  setPropertiesList([]);
                  setShowPropertyDropdown(false);
                  setShowPropertyPopup(false);
                }}
                className="
            px-3
            py-1.5
            border
            border-gray-200
            rounded-md
            text-[9px]
            text-gray-600
            hover:bg-gray-50
            cursor-pointer
          "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log(
                    "Selected Properties:",
                    selectedProperties
                  );

                  setShowPropertyDropdown(false);
                  setShowPropertyPopup(false);
                  setPropertySearch("");
                  setPropertiesList([]);
                }}
                className="
            px-4
            py-1.5
            bg-[#2952F3]
            hover:bg-[#1E40D0]
            text-white
            rounded-md
            text-[9px]
            cursor-pointer
          "
              >
                Done
              </button>

            </div>

          </div>
        </div>
      )}
      {showPreviewModal && (
  <div
    className="
      fixed inset-0
      z-[9999]
      bg-black/40
      flex
      items-center
      justify-center
      p-5
    "
  >

    {/* MODAL */}
    <div
      className="
        w-[450px]
        max-w-[90vw]
        bg-white
        rounded-xl
        shadow-xl
        overflow-hidden
      "
    >

      {/* ================= HEADER ================= */}
      <div
        className="
          h-[55px]
          px-5
          flex
          items-center
          justify-between
          border-b
          border-gray-200
          bg-white
        "
      >

        <div className="flex items-center gap-2">

          <div
            className="
              w-6 h-6
              rounded
              bg-[#EEF3FF]
              flex
              items-center
              justify-center
            "
          >
            <span className="text-[#2952F3] text-[10px]">
              ▣
            </span>
          </div>

          <p className="text-[12px] font-semibold text-gray-700">
            Preview — Owner App
          </p>

        </div>

        <button
          type="button"
          onClick={() => setShowPreviewModal(false)}
          className="text-gray-400 text-xl"
        >
          ×
        </button>

      </div>


      {/* ================= PREVIEW AREA ================= */}
      <div
        className="
          h-[350px]
          bg-gray-50
          flex
          justify-center
          items-center
          py-4
        "
      >

        {/* PHONE */}
        <div
          className="
            w-[180px]
            h-[315px]
            bg-white
            border-[6px]
            border-[#202735]
            rounded-[26px]
            overflow-hidden
            shadow-md
          "
        >

          {/* PHONE SCROLL AREA */}
          <div
            className="
              h-full
              overflow-y-auto
              overflow-x-hidden
              scrollbar-thin
            "
          >

            {/* PHONE HEADER */}
            <div
              className="
                h-[34px]
                px-3
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                bg-white
                sticky
                top-0
                z-10
              "
            >

              <div className="flex items-center gap-1">

                <div
                  className="
                    w-4 h-4
                    rounded
                    bg-[#2952F3]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <span className="text-white text-[7px]">
                    S
                  </span>
                </div>

                <span className="text-[8px] font-semibold text-[#2952F3]">
                  Smartstay
                </span>

              </div>

              <span className="text-[6px] text-gray-400">
                See All
              </span>

            </div>


            {/* ================= WHAT'S NEW ================= */}
            <div className="px-3 pt-3 pb-5">

              <div className="flex items-center justify-between">

                <p className="text-[9px] font-semibold text-gray-800">
                  What's New
                </p>

                <span className="text-[6px] text-[#2952F3]">
                  See All
                </span>

              </div>


              {/* ITEMS */}
              <div className="mt-3 space-y-3">

                {updateItems.length === 0 ? (

                  <div className="text-center py-10">

                    <p className="text-[7px] text-gray-400">
                      No updates available
                    </p>

                  </div>

                ) : (

                  updateItems.map((item, index) => {

                    const itemTypeLabel =
                      updateTypes?.find(
                        (type) =>
                          type.key === item.itemType
                      )?.value ||
                      item.itemType ||
                      "NEW FEATURE";

                    const ctaLabel =
                      ctas?.find(
                        (cta) =>
                          cta.key === item.cta
                      )?.value ||
                      item.cta;


                    return (

                      <div
                        key={item.id || index}
                        className="
                          bg-white
                          border
                          border-gray-200
                          rounded-lg
                          p-3
                          shadow-sm
                        "
                      >

                        {/* TYPE */}
                        <span
                          className="
                            inline-block
                            px-2
                            py-1
                            rounded
                            bg-[#EEF3FF]
                            text-[#2952F3]
                            text-[6px]
                            font-semibold
                          "
                        >
                          {itemTypeLabel}
                        </span>


                        {/* TITLE */}
                        <p
                          className="
                            mt-2
                            text-[8px]
                            font-semibold
                            text-gray-800
                            break-words
                          "
                        >
                          {item.title || "Update Title"}
                        </p>


                        {/* DESCRIPTION */}
                        <p
                          className="
                            mt-1
                            text-[6px]
                            text-gray-400
                            break-words
                          "
                        >
                          {item.description ||
                            "Description will appear here."}
                        </p>


                        {/* CTA */}
                        {item.cta && (
                          <button
                            type="button"
                            className="
                              mt-3
                              w-full
                              h-[25px]
                              bg-[#2952F3]
                              text-white
                              rounded-md
                              text-[6px]
                              font-medium
                            "
                          >
                            {ctaLabel}
                          </button>
                        )}

                      </div>

                    );

                  })

                )}

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= FOOTER ================= */}
      <div
        className="
          h-[55px]
          px-5
          flex
          items-center
          justify-between
          border-t
          border-gray-200
          bg-white
        "
      >

        <button
          type="button"
          onClick={() => setShowPreviewModal(false)}
          className="
            text-[11px]
            text-gray-500
          "
        >
          Close
        </button>


        <div className="flex gap-2">

          <button
            type="button"
            onClick={() => setShowPreviewModal(false)}
            className="
              px-4
              py-2
              border
              border-gray-200
              rounded-md
              text-[10px]
              text-gray-700
            "
          >
            Back to Edit
          </button>

          <button
            type="button"
            className="
              px-4
              py-2
              bg-[#2952F3]
              text-white
              rounded-md
              text-[10px]
            "
          >
            Publish Update
          </button>

        </div>

      </div>

    </div>

  </div>
)}
    </DashboardLayout>
  );
};


/* Audience Option */

const AudienceOption = ({
  value,
  selected,
  onChange,
  title,
  description,
  showView = false,
  onView,
}) => {
  const active = selected === value;

  return (
    <div
      className={`
        w-full
        px-3 py-2
        rounded-md
        border
        mb-1.5
        flex
        items-start
        gap-2
        ${active
          ? "border-[#2952F3] bg-[#F7F9FF]"
          : "border-gray-200 bg-white"
        }
      `}
    >

      {/* Radio / Main option */}
      <button
        type="button"
        onClick={() => onChange(value)}
        className="flex items-start gap-2 flex-1 text-left cursor-pointer"
      >
        <span
          className={`
            mt-[2px]
            w-2.5 h-2.5
            rounded-full
            border
            flex
            items-center
            justify-center
            ${active
              ? "border-[#2952F3]"
              : "border-gray-300"
            }
          `}
        >
          {active && (
            <span className="w-1 h-1 rounded-full bg-[#2952F3]" />
          )}
        </span>

        <div>
          <p className="text-[8px] font-medium text-gray-700">
            {title}
          </p>

          <p className="text-[7px] text-gray-400 mt-0.5">
            {description}
          </p>
        </div>
      </button>

      {/* View Icon */}
      {showView && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="
            mt-0.5
            w-6 h-6
            flex
            items-center
            justify-center
            rounded-md
            text-gray-400
            hover:text-[#2952F3]
            hover:bg-white
            cursor-pointer
          "
          title="View selected plans"
        >
          👁
        </button>
      )}

    </div>
  );
};


/* Publishing Option */

const PublishOption = ({
  value,
  selected,
  onChange,
  title,
  description,
}) => {
  const active = selected === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`
        w-full
        text-left
        px-3 py-2
        rounded-md
        border
        mb-1.5
        flex
        items-start
        gap-2
        cursor-pointer
        ${active
          ? "border-[#2952F3] bg-[#F7F9FF]"
          : "border-gray-200 bg-white"
        }
      `}
    >
      <span
        className={`
          mt-[2px]
          w-2.5 h-2.5
          rounded-full
          border
          flex
          items-center
          justify-center
          ${active
            ? "border-[#2952F3]"
            : "border-gray-300"
          }
        `}
      >
        {active && (
          <span className="w-1 h-1 rounded-full bg-[#2952F3]" />
        )}
      </span>

      <div>
        <p className="text-[8px] font-medium text-gray-700">
          {title}
        </p>

        <p className="text-[7px] text-gray-400 mt-0.5">
          {description}
        </p>
      </div>
    </button>
  );
};

export default CreateProductUpdate;