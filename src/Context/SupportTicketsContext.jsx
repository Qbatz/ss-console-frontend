import React, {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../Config/AxiosConfig";
import axiosInstance from "../Config/AxiosConfig";

const SupportTicketsContext =
  createContext(null);

export const SupportTicketsProvider = ({
  children,
}) => {

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  console.log(
    "errorMsg",
    errorMsg
  );

  /* =========================
      ERROR MESSAGE
  ========================= */

  const getErrorMessage = (
    error
  ) => {

    if (error?.response?.data) {

      if (
        typeof error.response.data ===
        "string"
      ) {

        return error.response.data;

      }

      if (
        error.response.data.message
      ) {

        return error.response.data
          .message;

      }

      return JSON.stringify(
        error.response.data
      );

    }

    return "Something went wrong";

  };

  /* =========================
      SEARCH OWNERS
  ========================= */

  const searchOwners = async (
    name = ""
  ) => {

    try {

      setLoading(true);

      setErrorMsg("");

      const res =
        await axiosInstance.get(
          "/v2/owners/search",
          {
            params: {
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

      return {
        success: false
      };

    } catch (error) {

      const msg =
        getErrorMessage(error);

      setErrorMsg(msg);

      return {
        success: false,
        message: msg
      };

    } finally {

      setLoading(false);

    }

  };
  /* =========================
    QUERY TYPE
========================= */

const getQueryTypes =
  async () => {

    try {

      setLoading(true);

      setErrorMsg("");

      const res =
        await axiosInstance.get(
          "/v2/support-ticket/query-type"
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

      const msg =
        getErrorMessage(error);

      setErrorMsg(msg);

      return {
        success: false,
        data: [],
        message: msg,
      };

    } finally {

      setLoading(false);

    }

  };
const createSupportTicket = async (
  payload,
  file
) => {

  try {

    setLoading(true);

    const formData =
      new FormData();

    formData.append(
      "payload",
      new Blob(
        [JSON.stringify(payload)],
        {
          type:
            "application/json",
        }
      )
    );

    if (file) {

      formData.append(
        "paymentProof",
        file
      );

    }

    const res =
      await axiosInstance.post(
        "/v2/support-ticket",
        formData
      );

   return {
  success: true,
  data: res.data,
  message:
    res.data?.message ??
    "Ticket Created Successfully",
};

  } catch (error) {

    const msg =
      getErrorMessage(error);

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };

  } finally {

    setLoading(false);

  }

};

const getAllSupportTickets =
  async ({
    page = 1,
    size = 10,
    name = "",
    startDate = "",
    endDate = "",
    status = "",
    agentId = "",
  }) => {

    try {

      setLoading(true);

      setErrorMsg("");

      const res =
        await axiosInstance.get(
          "/v2/support-ticket",
          {
            params: {
              page,
              size,
              name,
              startDate,
              endDate,
              status,
              agentId,
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
      };

    } catch (error) {

      const msg =
        getErrorMessage(error);

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
    <SupportTicketsContext.Provider
      value={{
        loading,
        errorMsg,

        searchOwners,getQueryTypes,createSupportTicket,getAllSupportTickets
      }}
    >
      {children}
    </SupportTicketsContext.Provider>
  );

};

export const useSupportTickets =
  () =>
    useContext(
      SupportTicketsContext
    );