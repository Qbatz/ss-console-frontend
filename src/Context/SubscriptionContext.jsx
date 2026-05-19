import React, { createContext, useContext, useState } from "react";
import api from "../Config/AxiosConfig";
import axiosInstance from "../Config/AxiosConfig";

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [accessError,setAccessError] = useState("")
  console.log("errorMsg", errorMsg)
  const getErrorMessage = (error) => {
    if (error?.response?.data) {
      if (typeof error.response.data === "string") {
        return error.response.data;
      }

      if (error.response.data.message) {
        return error.response.data.message;
      }

      return JSON.stringify(error.response.data);
    }

    return "Something went wrong";
  };
  const createSubscription = async (hostelId, payload, file) => {
    try {
      const formData = new FormData();

      formData.append(
        "subscription",
        new Blob(
          [JSON.stringify(payload)],
          { type: "application/json" }
        )
      );

      if (file) {
        formData.append("paymentProof", file);
      }

      const res = await axiosInstance.post(
        `/v2/subscription/${hostelId}`,
        formData
      );

      return {
        success: true,
        data: res.data,
        message: res.data?.message || "Subscription Added Successfully"
      };

    }
    catch (error) {

      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return {
        success: false,
        message: msg
      };

    }
  };


  const getSubscriptions = async (page = 1, size = 10, hostelName = "") => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.get("/v2/subscription", {
        params: {
          page,
          size,
          hostelName
        }
      });

      if (res.status === 200) {
        return {
          success: true,
          data: res.data
        };
      }

      return { success: false };

    }
    catch (error) {

      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      setAccessError(msg);
     
      return {
        success: false,
        message: msg
      };

    } finally {
      setLoading(false);
    }
  };
  const getDemoRequests = async (page = 1, size = 10, name = "") => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.get("/v2/demo-request", {
        params: { page, size, name }
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

      return { success: false, message: msg };

    } finally {
      setLoading(false);
    }
  };
  const getAgentsDropdown = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.get("/v2/admin/agents-dropdown");

      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
          message: "Updated Successfully"
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
  const createDemoRequest = async (payload) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.post(
        "/v2/demo-request",
        payload
      );

      if (res.status === 200 || res.status === 201) {
        return {
          success: true,
          data: res.data,
          message: "Demo request created successfully",
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
  const updateDemoRequestStatus = async (demoRequestId, payload) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.put(
        `/v2/demo-request/update-status/${demoRequestId}`,
        payload
      );

      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
          message: "Status updated successfully"
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
  const getDemoRequestStatus = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.get("/v2/demo-request/status");

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
  const getOrderHistory = async (
  page = 1,
  size = 10,
  name = "",
  startDate = "",
  endDate = ""
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get("/v2/order-history", {
      params: {
        page,
        size,
        name,
        startDate,
        endDate,
      },
    });

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
setAccessError(msg)
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const addDemoRequestComment = async (demoRequestId, comment) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.post(
      `/v2/demo-request/comment/${demoRequestId}`,
      { comment }
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data,
        message: "Comment added successfully"
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
const verifyPayment = async (orderHistoryId) => {

  try {

    setLoading(true);
    setErrorMsg("");

    const res = await axiosInstance.get(
      `/v2/order-history/verify/${orderHistoryId}`
    );

    if (res.status === 200) {

      return {
        success: true,
        data: res.data,
        message: "Payment verified successfully"
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
  return (
    <SubscriptionContext.Provider
      value={{
        loading,
        errorMsg,
        createSubscription, getSubscriptions, getDemoRequests, getAgentsDropdown, createDemoRequest, updateDemoRequestStatus, 
        getDemoRequestStatus,getOrderHistory,accessError,addDemoRequestComment,verifyPayment
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
