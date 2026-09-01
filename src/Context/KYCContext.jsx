import React, {
  createContext,
  useContext,
  useState,
} from "react";
import axiosInstance from "../Config/AxiosConfig";

const KYCContext = createContext(null);

export const KYCProvider = ({
  children,
}) => {
  const [loading, setLoading] =
    useState(false);

  const [accessError, setAccessError] = useState("");

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";



const getKYCList = async (
  page = 1,
  size = 10,
  name = ""
) => {
  setLoading(true);   

  try {
    const res = await axiosInstance.get(
      "/v2/kyc",
      {
        params: {
          page,
          size,
          name,
        },
      }
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  } finally {
    setLoading(false);   
  }
};

const approveKYC = async (
  customerId
) => {
  try {

    setLoading(true);

    const res =
      await axiosInstance.post(
        `/v2/kyc/${customerId}`
      );

    return {
      success: true,
      data: res.data,
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.response?.status === 500
          ? "Internal Server Error"
          : getErrorMessage(error),
    };

  } finally {

    setLoading(false);

  }
};
const getHostelKYCList = async (
  page = 1,
  size = 10,
  name = "",
  isEnabled,
  dateFilter = "ALL",
  startDate,
  endDate
) => {
  setLoading(true);

  try {
    const params = {
      page,
      size,
      name,
      dateFilter,
    };

    if (isEnabled !== undefined) {
      params.isEnabled = isEnabled;
    }

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    console.log("KYC API PARAMS:", params);

    const res = await axiosInstance.get(
      "/v2/kyc/hostels",
      {
        params,
      }
    );

    return {
      success: true,
      data: res.data,
    };

  } catch (error) {
    console.error(
      "Get Hostel KYC Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(error),
    };

  } finally {
    setLoading(false);
  }
};

const getHostelKYCDetails = async (
  hostelId,
  page = 1,
  size = 10,
  name = "",
  kycStatus = "",
  dateFilter = "ALL",
  startDate = "",
  endDate = ""
) => {
  try {
    const params = {
      page,
      size,
      name,
      kycStatus,
      dateFilter,
    };

   
    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    console.log("HOSTEL KYC DETAILS PARAMS:", params);

    const res = await axiosInstance.get(
      `/v2/kyc/${hostelId}`,
      {
        params,
      }
    );

    return {
      success: true,
      data: res.data,
    };

  } catch (error) {
    console.error(
      "Get Hostel KYC Details Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

const sendKYCReminder = async (customerId) => {
  try {
    setLoading(true);

    const res = await axiosInstance.post(
      `/v2/kyc/reminder/${customerId}`
    );

    return {
      success: true,
      data: res.data,
    };

  } catch (error) {
    console.error(
      "Send KYC Reminder Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(error),
    };

  } finally {
    setLoading(false);
  }
};
  return (
    <KYCContext.Provider
      value={{
        loading,
        accessError,
        getKYCList,approveKYC,getHostelKYCList,getHostelKYCDetails,sendKYCReminder
      }}
    >
      {children}
    </KYCContext.Provider>
  );
};

export const useKyc = () =>
  useContext(KYCContext);