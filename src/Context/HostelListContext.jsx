import React, { createContext, useContext, useState } from "react";
import api from "../Config/AxiosConfig";
import axiosInstance from "../Config/AxiosConfig";


const HostelContext = createContext(null);

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [accessError,setAccessError] = useState("")

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

  // ✅ GET /v2/hostels
  // const getHostels = async () => {
  //   try {
  //     setLoading(true);
  //     setErrorMsg("");

  //     const res = await api.get("/v2/hostels");

  //     if (res.status === 200) {
  //       setHostels(res.data || []);
  //       return { success: true, data: res.data };
  //     }

  //     return { success: false };
  //   } catch (error) {
  //     const msg = getErrorMessage(error);
  //     setErrorMsg(msg);
  //     return { success: false, message: msg };
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const getHostels = async (page = 1, size = 10, hostelName = "",  startDate = "",
  endDate = ""
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/hostels", {
      params: {
        page,
        size,
        hostelName,
        startDate,
        endDate
        
      }
    });
console.log("res",res)
    if (res.status === 200) {
      setHostels(res.data);
      return { success: true, data: res.data };
    }

    return { success: false };
  } 
  catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    setAccessError(msg)
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
// GET /v2/hostels/{hostelId}
const getHostelById = async (hostelId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(`/v2/hostels/${hostelId}`, {
      params: {
        hostelId: hostelId   
      }
    });

    if (res.status === 200) {
      return { success: true, data: res.data };
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

// POST /v2/hostels/hard-reset/{hostelId}
// const hardResetHostel = async (hostelId) => {
//   try {
//     setLoading(true);
//     setErrorMsg("");

//     const res = await axiosInstance.post(
//       `/v2/hostels/hard-reset/${hostelId}`
//     );

//     if (res.status === 200) {
//       return { success: true, message: "Hostel Hard Reset Successful" };
//     }

//     return { success: false };

//   }
//    catch (error) {
//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);
//     return { success: false, message: msg };
//   } finally {
//     setLoading(false);
//   }
// };
const hardResetHostel = async (hostelId, typedHostelId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post(
      `/v2/hostels/hard-reset/${hostelId}`,
      {
        hostelId: typedHostelId
      }
    );

    if (res.status === 200) {
      return { success: true, message: "Hostel Hard Reset Successful" };
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
const deleteHostelExpense = async (hostelId) => {
  try {

    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.delete(
      `/v2/hostels/expense/${hostelId}`
    );

    if (res.status === 200 || res.status === 204) {
      return {
        success: true,
        message: "Expense deleted successfully"
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
const getHostelActivities = async (
  hostelId,
  page = 1,
  size = 10,
  name = ""
) => {
  try {

    setLoading(true);

    const res = await axiosInstance.get(
      `/v2/hostels/activities/${hostelId}`,
      {
        params: {
          page,
          size,
          name
        }
      }
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

    return {
      success: false,
      message: msg
    };

  } finally {
    setLoading(false);
  }
};
const getRecurringHostels = async (
  page = 0,
  size = 10,
  hostelName = "",
  filterBy = "TODAY",
  statusFilterBy = "ALL",
  billingModelFilterBy = "ALL",
  billingCycleStartDay = ""
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/hostels/recurring", {
      params: {
        page,
        size,
        hostelName,
        filterBy,
        statusFilterBy,
        billingModelFilterBy,
        billingCycleStartDay
      }
    });

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
// const getRecurringHostels = async (
//   page = 0,
//   size = 10,
//   hostelName = "",
//   filterBy = "TODAY",
//   statusFilterBy = "ALL",
  
//   billingCycleStartDay = ""
// ) => {
//   try {
//     setLoading(true);
//     setErrorMsg("");

//     const res = await axiosInstance.get("/v2/hostels/recurring", {
//       params: {
//         page,
//         size,
//         hostelName,
//         filterBy,
//         statusFilterBy,
//         billingCycleStartDay,
//         statusFilterBy 
//       }
//     });

//     if (res.status === 200) {
//       return {
//         success: true,
//         data: res.data
//       };
//     }

//     return { success: false };

//   } catch (error) {
//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);

//     return {
//       success: false,
//       message: msg
//     };

//   } finally {
//     setLoading(false);
//   }
// };
// const getRecurringHostels = async (
//   page = 0,
//   size = 10,
//   hostelName = "",
//   filterBy = "TODAY"
// ) => {
//   try {
//     setLoading(true);
//     setErrorMsg("");

//     const res = await axiosInstance.get("/v2/hostels/recurring", {
//       params: {
//         page,
//         size,
//         hostelName,
//         filterBy
//       }
//     });

//     if (res.status === 200) {
//       return {
//         success: true,
//         data: res.data
//       };
//     }

//     return { success: false };

//   } catch (error) {
//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);

//     return {
//       success: false,
//       message: msg
//     };

//   } finally {
//     setLoading(false);
//   }
// };
const generateRecurringInvoice = async (hostelId, inputDay) => {
  try {

    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post(
      `/v2/hostels/recurring/${hostelId}`,
      {
        inputDay: inputDay
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || "Recurring Generated Successfully"
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
const getRecurringByHostelId = async (hostelId, page = 0, size = 10) => {
  try {
    
    setErrorMsg("");

    const res = await axiosInstance.get(
      `/v2/hostels/recurring/${hostelId}`,
      {
        params: {
          page,
          size
        }
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
   
  }
};
const bulkGenerateRecurring = async (hostelIds = []) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const body = hostelIds.map(id => ({
      hostelId: id
    }));

    const res = await axiosInstance.post(
      "/v2/hostels/recurring",
      body
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || "Bulk Recurring Generated Successfully"
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
const exportHostels = async (
  hostelName = "",
  startDate = "",
  endDate = ""
) => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/v2/hostels/export", {
      params: {
        hostelName,
        startDate,
        endDate
      },
      responseType: "blob" // 🔥 important for file download
    });

    // Create file download
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "hostels.xlsx"); // file name
    document.body.appendChild(link);
    link.click();

    return { success: true };

  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);

    return { success: false, message: msg };

  } finally {
    setLoading(false);
  }
};
const getTenantRecurring = async (
  page = 0,
  size = 10,
  name = "",
  filterBy = "TODAY",
  statusFilterBy = "ALL",
  billingModelFilterBy = "ALL",
  billingCycleStartDay = "",
  isHostelBased = false
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/hostels/tenant-recurring", {
      params: {
        page,
        size,
        name,
        filterBy,
        statusFilterBy,
        billingModelFilterBy,
        billingCycleStartDay,
        isHostelBased
      }
    });

    console.log("tenant recurring response", res.data);

    return {
      success: true,
      data: res.data
    };

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
const generateTenantRecurring = async (customerIds = []) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const body = customerIds.map(id => ({
      customerId: id
    }));

    const res = await axiosInstance.post(
      "/v2/hostels/tenant-recurring",
      body
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || "Recurring Generated Successfully"
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



const getRecurringByTenantId = async (tenantId, page = 0, size = 10) => {
  try {
    
    setErrorMsg("");

    const res = await axiosInstance.get(
      `/v2/hostels/tenant-recurring/${tenantId}`,
      {
        params: {
          page,
          size
        }
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
   
  }
};
const getRecurringMonth = async (month, year) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/hostels/recurring/month", {
      params: {
        month,
        year
      }
    });

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
const updateBillingRule = async (hostelId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.put(
      `/v2/hostels/billing-rule/${hostelId}`,
      payload
    );

    if (res.status === 200) {
      return {
        success: true,
        message: "Billing rule updated successfully"
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
const deleteHostel = async (hostelId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.delete(
      `/v2/hostels/${hostelId}`
    );

    if (res.status === 200 || res.status === 204) {
      return {
        success: true,
        message: "Hostel deleted successfully"
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
const assignRelationalAgent = async (hostelId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post(
      `/v2/relational-agent/${hostelId}`,
      payload
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        message: "Staff assigned successfully"
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
const getRelationalReasons = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(
      "/v2/relational-agent/reasons"
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || []
      };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);

    return {
      success: false,
      message: msg
    };
  } finally {
    setLoading(false);
  }
};
const updateTableColumns = async (payload) => {
  try {
    setLoading(true);

    const res = await axiosInstance.put("/v2/table-columns", payload);

    if (res.status === 200) {
      return { success: true, message: "Columns updated successfully" };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const resetTableColumns = async (payload) => {
  try {
    const res = await axiosInstance.put(
      "/v2/table-columns/reset",
      payload
    );
    

    if (res.status === 200) {
      
      return { success: true , data: res?.data};
    }

    return { success: false };
  } catch (err) {
    return { success: false, message: err.message };
  }
  
};
const getTableColumns = async (page = 1, size = 10, name = "") => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/v2/table-columns", {
      params: {
        page,
        size,
        name
      }
    });

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const getInvoiceRedemption = async (page = 1, size = 10, name = "") => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/v2/invoice-redemption", {
      params: {
        page,
        size,
        name,
      },
    });

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const getHostelInvoiceRedemption = async (
  hostelId,
  page = 0,
  size = 10
) => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(
      `/v2/invoice-redemption/${hostelId}`,
      {
        params: {
          page,
          size
        }
      }
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

    return {
      success: false,
      message: msg
    };

  } finally {
    setLoading(false);
  }
};
const updateInvoiceRedemption = async (
  invoiceRedemptionId,
  amount
) => {
  try {
    setLoading(true);

    const res = await axiosInstance.put(
      `/v2/invoice-redemption/${invoiceRedemptionId}`,
      {
        amount
      }
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

    return {
      success: false,
      message: msg
    };

  } finally {
    setLoading(false);
  }
};
const deleteInvoiceRedemption = async (
  invoiceRedemptionId
) => {

  try {

    setLoading(true);

    const res = await axiosInstance.delete(
      `/v2/invoice-redemption/${invoiceRedemptionId}`
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

    return {
      success: false,
      message: msg
    };

  } finally {

    setLoading(false);

  }

};
const resetUserPin = async (userId) => {

  try {

    setLoading(true);

    const res = await axiosInstance.put(
      `/v2/users/reset-pin/${userId}`
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

    return {
      success: false,
      message: msg
    };

  } finally {

    setLoading(false);

  }

};
const getInvoicesByHostelId = async (
  hostelId,
  page = 0,
  size = 10
) => {

  try {

    const response = await api.get(
      `/v2/invoice/${hostelId}`,
      {
        params: {
          page,
          size,
        },
      }
    );
  console.log("response.data",response.data)
    return response.data;
  

  } catch (error) {

    console.log("getInvoicesByHostelId error", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Something went wrong",
    };

  }

};
const deleteInvoice = async (payload) => {
  try {

    setLoading(true);

    const res = await axiosInstance.delete(
      "/v2/invoice",
      {
        data: payload
      }
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

    return {
      success: false,
      message: msg
    };

  } finally {

    setLoading(false);

  }
};
  return (
    <HostelContext.Provider
      value={{
        hostels,
        loading,
        errorMsg,
        getHostels,getHostelById,hardResetHostel,accessError,deleteHostelExpense,getHostelActivities,getRecurringHostels,generateRecurringInvoice,getRecurringByHostelId,
        bulkGenerateRecurring,exportHostels,getTenantRecurring,generateTenantRecurring,getRecurringByTenantId,getRecurringMonth,updateBillingRule,
        deleteHostel,assignRelationalAgent,getRelationalReasons,updateTableColumns,
        resetTableColumns,getTableColumns,getInvoiceRedemption,getHostelInvoiceRedemption,updateInvoiceRedemption,
        deleteInvoiceRedemption,resetUserPin,getInvoicesByHostelId,deleteInvoice
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);
