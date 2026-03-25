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
    // setLoading(true);

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
  return (
    <HostelContext.Provider
      value={{
        hostels,
        loading,
        errorMsg,
        getHostels,getHostelById,hardResetHostel,accessError,deleteHostelExpense,getHostelActivities,getRecurringHostels,generateRecurringInvoice,getRecurringByHostelId,
        bulkGenerateRecurring,exportHostels
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);
