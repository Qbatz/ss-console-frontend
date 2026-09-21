import React, {
  createContext,
  useContext,
  useState,
} from "react";
import axiosInstance from "../Config/AxiosConfig";

const ServiceTokenContext = createContext(null);

export const ServiceTokenProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [accessError, setAccessError] = useState("");

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

 
  const getServiceTokens = async (
    page = 1,
    size = 10,
    name = "",
    status = "ALL"
  ) => {
    try {
      setLoading(true);
      setAccessError("");

      const response = await axiosInstance.get(
        "/v2/service-token",
        {
          params: {
            page,
            size,
            name,
            status,
          },
        }
      );

      console.log(
        "SERVICE TOKEN API RESPONSE:",
        response.data
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "SERVICE TOKEN API ERROR:",
        error?.response?.data || error
      );

      const msg = getErrorMessage(error);

      setAccessError(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };
const getServiceTokenServices = async () => {
  try {
    setLoading(true);
    setAccessError("");

    const response = await axiosInstance.get(
      "/v2/service-token/services"
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const errorData = error?.response?.data;

    const msg =
      typeof errorData === "string"
        ? errorData
        : errorData?.message ||
          errorData?.error ||
          "Failed to get services";

    setAccessError(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};

const generateServiceToken = async (service) => {
  try {
    setLoading(true);
    setAccessError("");

    const response = await axiosInstance.post(
      "/v2/service-token/generate",
      {
        service: service,
      }
    );

    console.log(
      "GENERATE TOKEN RESPONSE:",
      response.data
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Token generation failed",
    };
  } catch (error) {
    console.error(
      "GENERATE TOKEN ERROR:",
      error?.response?.data || error
    );

    const errorData = error?.response?.data;

    const msg =
      typeof errorData === "string"
        ? errorData
        : errorData?.message ||
          errorData?.error ||
          "Token generation failed";

    setAccessError(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};
const regenerateServiceToken = async (service) => {
  try {
    setLoading(true);
    setAccessError("");

    const response = await axiosInstance.put(
      "/v2/service-token/re-generate",
      {
        service,
      }
    );

    console.log(
      "REGENERATE TOKEN RESPONSE:",
      response.data
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Token regeneration failed",
    };
  } catch (error) {
    console.error(
      "REGENERATE TOKEN ERROR:",
      error?.response?.data || error
    );

    const errorData = error?.response?.data;

    const msg =
      typeof errorData === "string"
        ? errorData
        : errorData?.message ||
          errorData?.error ||
          "Token regeneration failed";

    setAccessError(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};
const revokeServiceToken = async (service) => {
  try {
    setLoading(true);
    setAccessError("");

    const response = await axiosInstance.put(
      "/v2/service-token/revoke",
      null,
      {
        params: {
          service,
        },
      }
    );

    console.log(
      "REVOKE TOKEN RESPONSE:",
      response.data
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message:
          response.data?.message ||
          "Token revoked successfully",
      };
    }

    return {
      success: false,
      message: "Token revoke failed",
    };
  } catch (error) {
    console.error(
      "REVOKE TOKEN ERROR:",
      error?.response?.data || error
    );

    const errorData = error?.response?.data;

    const msg =
      typeof errorData === "string"
        ? errorData
        : errorData?.message ||
          errorData?.error ||
          "Token revoke failed";

    setAccessError(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};
const getServiceTokenByService = async (service) => {
  try {
    setLoading(true);
    setAccessError("");

    const response = await axiosInstance.get(
      "/v2/service-token/service",
      {
        params: {
          service,
        },
      }
    );

    console.log(
      "SERVICE TOKEN DETAILS:",
      response.data
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Failed to get service token details",
    };
  } catch (error) {
    console.error(
      "SERVICE TOKEN DETAILS ERROR:",
      error?.response?.data || error
    );

    const errorData = error?.response?.data;

    const msg =
      typeof errorData === "string"
        ? errorData
        : errorData?.message ||
          errorData?.error ||
          "Failed to get service token details";

    setAccessError(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};
  return (
    <ServiceTokenContext.Provider
      value={{
        loading,
        accessError,
        getServiceTokens,getServiceTokenServices,generateServiceToken,regenerateServiceToken,revokeServiceToken,getServiceTokenByService
      }}
    >
      {children}
    </ServiceTokenContext.Provider>
  );
};

export const useServiceToken = () =>
  useContext(ServiceTokenContext);