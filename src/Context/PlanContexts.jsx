import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../Config/AxiosConfig";

const PlanContext = createContext(null);

export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
   const [accessError,setAccessError] = useState("")
  

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

  
  const getPlans = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.get("/v2/plans");

      if (res.status === 200) {
        setPlans(res.data || []);
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      setAccessError(msg)
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };
  const createPlan = async (planData) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post("/v2/plans", planData);

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data || "Plan created successfully",
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const updatePlan = async (planId, planData) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.put(`/v2/plans/${planId}`, planData);

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || "Plan updated successfully",
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const deactivatePlan = async (planId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.put(
      `/v2/plans/deactivate-plan/${planId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || "Plan deactivated successfully",
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const deactivatePlanFeature = async (planFeatureId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.put(
      `/v2/plans/plan-feature/${planFeatureId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || "Feature deactivated successfully",
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const addPlanFeature = async (planId, feature) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post(
      `/v2/plans/plan-feature/${planId}`,
      feature
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data || "Feature added successfully",
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const getPlansDropdown = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/plans/dropdown");

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || []
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const reactivatePlan = async (planId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.put(
      `/v2/plans/reactivate-plan/${planId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || "Plan reactivated successfully",
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const getSmartstayFeatures = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(
      "/v2/plans/smartstay-feature"
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data
      };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg
    };

  } finally {
    setLoading(false);
  }
};
const createSmartstayFeature = async (featureData) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post(
      "/v2/plans/smartstay-feature",
      featureData
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data,
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};
const updateSmartstayFeature = async (
  smartstayFeatureId,
  featureData
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.put(
      `/v2/plans/smartstay-feature/${smartstayFeatureId}`,
      featureData
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};
const deleteSmartstayFeature = async (
  smartstayFeatureId
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.delete(
      `/v2/plans/smartstay-feature/${smartstayFeatureId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
      };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};
const getPlanById = async (planId) => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(
      `/v2/plans/${planId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data
      };
    }

    return { success: false };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error)
    };
  } finally {
    setLoading(false);
  }
};


const getProductUpdateTypes = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(
      "/v2/product-update/type"
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || [],
      };
    }

    return {
      success: false,
      data: [],
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
      data: [],
    };

  } finally {
    setLoading(false);
  }
};
const getProductUpdatePlatforms = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/product-update/platform");

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || [],
      };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};

const getProductUpdateModules = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/product-update/module");

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || [],
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};

const getProductUpdateCtas = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(
      "/v2/product-update/cta"
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || [],
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};


const getProductUpdatePublishStatuses = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(
      "/v2/product-update/publish-status"
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || [],
      };
    }

    return {
      success: false,
      data: [],
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
      data: [],
    };

  } finally {
    setLoading(false);
  }
};

const getProductUpdateAudiences = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(
      "/v2/product-update/audience"
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || [],
      };
    }

    return {
      success: false,
      data: [],
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
      data: [],
    };

  } finally {
    setLoading(false);
  }
};

// const createProductUpdate = async (payload, updateItems) => {
//   try {
//     const formData = new FormData();

//     // Generate clientId for each item
//     const productUpdateItems = updateItems.map((item, index) => ({
//       title: item.title,
//       description: item.description,
//       updateType: item.updateType,
//       module: item.module,
//       cta: item.cta,
//       ctaLink: item.ctaLink,
//       clientId: `client-${index + 1}`,
//     }));

//     // Final payload
//     const finalPayload = {
//       ...payload,
//       productUpdateItems,
//     };

//     // JSON as normal form-data field
//     formData.append(
//       "payload",
//       JSON.stringify(finalPayload)
//     );

//     // Image key = item's clientId
//     updateItems.forEach((item, index) => {
//       if (item.attachment) {
//         const clientId = `client-${index + 1}`;

//         formData.append(
//           clientId,
//           item.attachment
//         );
//       }
//     });

//     const res = await axiosInstance.post(
//       "/v2/product-update",
//       formData
//     );

//     return {
//       success: true,
//       data: res.data,
//       message:
//         res.data?.message ||
//         "Product Update Created Successfully",
//     };

//   } catch (error) {
//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);

//     return {
//       success: false,
//       message: msg,
//     };
//   }
// };


// const createProductUpdate = async (payload, updateItems) => {
//   try {
//     const formData = new FormData();

//     // JSON payload
//     formData.append(
//       "payload",
//       new Blob(
//         [JSON.stringify(payload)],
//         {
//           type: "application/json",
//         }
//       )
//     );

//     // Mandatory images
//     updateItems.forEach((item, index) => {
//       if (!item.attachment) {
//         throw new Error(`Image is required for Item ${index + 1}`);
//       }

//       formData.append(
//         `client-${index + 1}`,
//         item.attachment
//       );
//     });

//     const res = await axiosInstance.post(
//       "/v2/product-update",
//       formData
//     );

//     return {
//       success: true,
//       data: res.data,
//       message:
//         res.data?.message ||
//         "Product Update Created Successfully",
//     };

//   } catch (error) {
//     const msg =
//       error?.message ||
//       error?.response?.data?.message ||
//       "Something went wrong";

//     setErrorMsg(msg);

//     return {
//       success: false,
//       message: msg,
//     };
//   }
// };
const createProductUpdate = async (payload, updateItems) => {
  try {
    const formData = new FormData();

    // JSON payload
    formData.append(
      "payload",
      new Blob(
        [JSON.stringify(payload)],
        {
          type: "application/json",
        }
      )
    );

    // Images
    updateItems.forEach((item) => {
      if (!item.clientId) {
        console.error("Missing clientId:", item);
        return;
      }

      if (item.attachment instanceof File) {
        formData.append(
          item.clientId,
          item.attachment,
          item.attachment.name
        );
      }

      if (Array.isArray(item.attachment)) {
        item.attachment.forEach((file) => {
          if (file instanceof File) {
            formData.append(
              item.clientId,
              file,
              file.name
            );
          }
        });
      }
    });

    const res = await axiosInstance.post(
      "/v2/product-update",
      formData
    );

    return {
      success: true,
      data: res.data,
      message:
        res.data?.message ||
        "Product Update Created Successfully",
    };

  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  }
};

// const createProductUpdate = async (payload, updateItems) => {
//   try {
//     const formData = new FormData();

//     // JSON payload
//     formData.append(
//       "payload",
//       new Blob(
//         [JSON.stringify(payload)],
//         { type: "application/json" }
//       )
//     );

//     // Attachments
//     updateItems.forEach((item, index) => {
//       if (item.attachment) {
//         formData.append(
//           `client-${index + 1}`,
//           item.attachment
//         );
//       }
//     });

//     const res = await axiosInstance.post(
//       "/v2/product-update",
//       formData
//       // ❌ Don't add Content-Type manually
//     );

//     return {
//       success: true,
//       data: res.data,
//       message:
//         res.data?.message ||
//         "Product Update Created Successfully",
//     };

//   } catch (error) {
//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);

//     return {
//       success: false,
//       message: msg,
//     };
//   }
// };
// const createProductUpdate = async (payload, updateItems) => {
//   try {
//     const formData = new FormData();

//     // Main JSON payload
//     formData.append(
//       "payload",
//       new Blob(
//         [JSON.stringify(payload)],
//         { type: "application/json" }
//       )
//     );

//     // Item attachments
//     updateItems.forEach((item, index) => {
//       if (item.attachment) {
//         formData.append(
//           `item-${index + 1}`,
//           item.attachment
//         );
//       }
//     });

//     const res = await axiosInstance.post(
//       "/v2/product-update",
//       formData
//     );

//     return {
//       success: true,
//       data: res.data,
//       message:
//         res.data?.message ||
//         "Product Update Created Successfully"
//     };

//   } catch (error) {
//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);

//     return {
//       success: false,
//       message: msg
//     };
//   }
// };
// const createProductUpdate = async (payload, updateItems) => {
//   try {
//     const formData = new FormData();

//     // Main JSON payload
//     formData.append(
//       "payload",
//       new Blob(
//         [JSON.stringify(payload)],
//         { type: "application/json" }
//       )
//     );

  
//     updateItems.forEach((item, index) => {
//       if (item.attachment) {
//         formData.append(
//           `client-${index + 1}`,
//           item.attachment
//         );
//       }
//     });

//     const res = await axiosInstance.post(
//       "/v2/product-update",
//       formData
//     );

//     return {
//       success: true,
//       data: res.data,
//       message: res.data?.message || "Product Update Created Successfully"
//     };

//   } catch (error) {

//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);

//     return {
//       success: false,
//       message: msg
//     };
//   }
// };
const getProductUpdates = async ({
  page = 1,
  size = 10,
  name = "",
  publishStatus = "ALL",
  type = "ALL",
} = {}) => {
  try {
    const res = await axiosInstance.get(
      "/v2/product-update",
      {
        params: {
          page,
          size,
          name,
          publishStatus,
          type,
        },
      }
    );

    return {
      success: true,
      data: res.data,
    };

  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  }
};

const searchHostels = async (name) => {
  try {
    const res = await axiosInstance.get(
      "/v2/hostels/search",
      {
        params: {
          name: name,
        },
      }
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error(
      "Hostel Search Error:",
      error?.response?.data || error
    );

    return {
      success: false,
      data: [],
      message: error?.response?.data?.message || "Failed to search hostels",
    };
  }
};
const archiveProductUpdate = async (productUpdateId) => {
  try {
    const res = await axiosInstance.put(
      `/v2/product-update/archive/${productUpdateId}`
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    const msg = getErrorMessage(error);

    return {
      success: false,
      message: msg,
    };
  }
};
const getProductUpdateById = async (productUpdateId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(
      `/v2/product-update/${productUpdateId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      data: null,
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      data: null,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};


const updateProductUpdate = async (
  productUpdateId,
  payload
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.put(
      `/v2/product-update/${productUpdateId}`,
      payload
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
        message:
          res.data?.message ||
          "Product update updated successfully",
      };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};
const updateProductUpdateItem = async (
  payloads,
  updateItems
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData();

    // =========================
    // JSON PAYLOAD
    // =========================

    formData.append(
      "payloads",
      new Blob(
        [JSON.stringify(payloads)],
        {
          type: "application/json",
        }
      )
    );

    // =========================
    // FILES
    // =========================

    const files = {};

    updateItems.forEach((item) => {
      if (!item?.clientId) {
        console.error(
          "Missing clientId:",
          item
        );
        return;
      }

      // Single new image
      if (item.attachment instanceof File) {
        formData.append(
          item.clientId,
          item.attachment,
          item.attachment.name
        );

        files[item.clientId] =
          item.attachment.name;
      }

      // Multiple new images
      if (Array.isArray(item.attachment)) {
        item.attachment.forEach((file) => {
          if (file instanceof File) {
            formData.append(
              item.clientId,
              file,
              file.name
            );

            files[item.clientId] =
              file.name;
          }
        });
      }
    });

    console.log("PAYLOADS:", payloads);
    console.log("FILES:", files);

    const res = await axiosInstance.put(
      "/v2/product-update-item",
      formData,
      {
        params: {
          files,
        },
      }
    );

    return {
      success: true,
      data: res.data,
      message:
        res.data?.message ||
        "Product Update Item Updated Successfully",
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};
const createProductUpdateItem = async (
  formData,
  files
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post(
      "/v2/product-update-item",
      formData,
      {
        params: {
          files,
        },
      }
    );

    return {
      success: true,
      data: res.data,
      message:
        res.data?.message ||
        "Product update item created successfully",
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};

const deleteProductUpdate = async (productUpdateId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.delete(
      `/v2/product-update/${productUpdateId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
        message:
          res.data?.message ||
          "Product update deleted successfully",
      };
    }

    return {
      success: false,
      message: "Failed to delete product update",
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};const deleteProductUpdateItem = async (payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.delete(
      "/v2/product-update-item",
      {
        data: payload,
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
        message:
          res.data?.message ||
          "Product update item deleted successfully",
      };
    }

    return {
      success: false,
      message: "Failed to delete product update item",
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};
  return (
    <PlanContext.Provider
      value={{
        plans,
        loading,
        errorMsg,
        getPlans,createPlan,updatePlan,deactivatePlan,deactivatePlanFeature,addPlanFeature,accessError,
        getPlansDropdown,reactivatePlan,getSmartstayFeatures,createSmartstayFeature,updateSmartstayFeature,
        deleteSmartstayFeature,getPlanById,getProductUpdateTypes,getProductUpdatePlatforms,getProductUpdateModules,getProductUpdateCtas,getProductUpdatePublishStatuses,
        getProductUpdateAudiences,createProductUpdate,getProductUpdates,searchHostels,archiveProductUpdate,getProductUpdateById,updateProductUpdate,
        updateProductUpdateItem,createProductUpdateItem,deleteProductUpdate,deleteProductUpdateItem
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);