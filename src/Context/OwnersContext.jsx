import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../Config/AxiosConfig";

const OwnersContext = createContext(null);

export const OwnersProvider = ({ children }) => {

  const [owners, setOwners] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  

  const getOwners = async ({
    page = 1,
    size = 10,
    name = "",
    isPropertiesExpired,
    isAboutToExpire,
    sortBy = "createdAt",
    direction = "desc"
  } = {}) => {

    try {
      setLoading(true);

      const res = await axiosInstance.get("/v2/owners", {
        params: {
          page,
          size,
          name,
          isPropertiesExpired,
          isAboutToExpire,
          sortBy,
          direction
        }
      });

      if (res.status === 200) {
        setOwners(res.data.content || []);
        setTotalItems(res.data.totalItems || 0);
        setTotalPages(res.data.totalPages || 0);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
const changeOwnerPassword = async (payload) => {
  try {
    setLoading(true);

    const res = await axiosInstance.post(
      "/v2/owners/change-password",
      payload
    );

    if (res?.status === 200 || res?.status === 201) {
      return {
        success: true,
        data: res.data,
        message: res.data?.message || "Password changed successfully",
      };
    }

    return { success: false };

  } catch (error) {

    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      "Failed to change password";

    console.log("CHANGE PASSWORD ERROR 👉", msg);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};

  return (
    <OwnersContext.Provider
      value={{
        owners,
        totalItems,
        totalPages,
        loading,
        getOwners,changeOwnerPassword
      }}
      
    >
      {children}
    </OwnersContext.Provider>
  );
};

export const useOwners = () => useContext(OwnersContext);
