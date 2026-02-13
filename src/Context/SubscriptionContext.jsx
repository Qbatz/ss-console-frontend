import React, { createContext, useContext, useState } from "react";
import api from "../Config/AxiosConfig";
import axiosInstance from "../Config/AxiosConfig";

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
console.log("errorMsg",errorMsg)
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


  const createSubscription = async (hostelId, payload) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axiosInstance.post(
        `/v2/subscription/${hostelId}`,
        payload
      );
     

      if (res.status === 200 || res.status === 201) {
        return {
          success: true,
          data: res.data,
          message: "Subscription created successfully",
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
    <SubscriptionContext.Provider
      value={{
        loading,
        errorMsg,
        createSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
