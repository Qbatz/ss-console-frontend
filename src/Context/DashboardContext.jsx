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

      const res = await axiosInstance.get("/v2/dashboard/");

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

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        loading,
        accessError,
        getDashboard
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);