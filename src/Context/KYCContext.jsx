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

  return (
    <KYCContext.Provider
      value={{
        loading,
        accessError,
        getKYCList,
      }}
    >
      {children}
    </KYCContext.Provider>
  );
};

export const useKyc = () =>
  useContext(KYCContext);