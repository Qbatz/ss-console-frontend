import React, { createContext, useContext, useState } from "react";
import api from "../Config/AxiosConfig";

const HostelContext = createContext(null);

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
  const getHostels = async (page, size = 10, hostelName = "") => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.get("/v2/hostels", {
      params: {
        page,
        size,
        hostelName
      }
    });

    if (res.status === 200) {
      setHostels(res.data);
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


  return (
    <HostelContext.Provider
      value={{
        hostels,
        loading,
        errorMsg,
        getHostels,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);
