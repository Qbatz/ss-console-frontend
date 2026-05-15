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
  return (
    <PlanContext.Provider
      value={{
        plans,
        loading,
        errorMsg,
        getPlans,createPlan,updatePlan,deactivatePlan,deactivatePlanFeature,addPlanFeature,accessError,
        getPlansDropdown,reactivatePlan
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);