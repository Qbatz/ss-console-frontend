import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../Config/AxiosConfig";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accessError, setAccessError] = useState("");

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

  const getDashboard = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/v2/dashboard");

      if (res.status === 200) {
        setDashboardData(res.data);
        return { success: true, data: res.data };
      }

      return { success: false };

    } catch (error) {
      const msg = getErrorMessage(error);

      setAccessError(msg);
      console.log("Dashboard Error 👉", msg);

      return { success: false, message: msg };

    } finally {
      setLoading(false);
    }
  };
const getHostelBedInfo = async (
  page = 1,
  size = 10,
  name = ""
) => {
  try {
    setLoading(true);
    setAccessError("");

    const res = await axiosInstance.get(
      "/v2/beds/hostel-bed-info",
      {
        params: {
          page,
          size,
          name,
        },
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      data: [],
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    setAccessError(msg);
    console.log("Hostel Bed Info Error 👉", msg);

    return {
      success: false,
      message: msg,
      data: [],
    };

  } finally {
    setLoading(false);
  }
};

const updateBedCurrentStatus = async (bedId, payload) => {
  try {
    setLoading(true);

    const res = await axiosInstance.put(
      `/v2/beds/update-current-status/${bedId}`,
      payload
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data,
        message: res.data?.message || "Bed status updated successfully",
      };
    }

    return {
      success: false,
      message: "Unable to update bed status",
    };

  } catch (error) {
    const msg = getErrorMessage(error);

    console.log("Update Bed Status Error 👉", msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};
  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        loading,
        accessError,
        getDashboard,getHostelBedInfo,updateBedCurrentStatus
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);