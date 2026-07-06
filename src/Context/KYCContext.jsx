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

  return (
    <KYCContext.Provider
      value={{
        loading,
        accessError,
        getKYCList,approveKYC
      }}
    >
      {children}
    </KYCContext.Provider>
  );
};

export const useKyc = () =>
  useContext(KYCContext);