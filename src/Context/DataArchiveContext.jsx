import React, {
  createContext,
  useContext,
  useState,
} from "react";
import axiosInstance from "../Config/AxiosConfig";

const ArchiveContext = createContext(null);

export const DataArchiveProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [accessError, setAccessError] = useState("");

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

 
  const getDataArchive = async (
    page = 0,
    size = 10
  ) => {
    try {
      setLoading(true);
      setAccessError("");

      const response = await axiosInstance.get(
        "/v2/data-archive",
        {
          params: {
            page,
            size,
          },
        }
      );

      console.log(
        "DATA ARCHIVE API RESPONSE:",
        response.data
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "DATA ARCHIVE API ERROR:",
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

  const ArchiveActivities = async (hostelId) => {
  try {
    setLoading(true);
    setAccessError("");

    const response = await axiosInstance.post(
      `/v2/data-archive/activities/hostel/${hostelId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
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
const RestoreArchive = async (archiveId) => {
  try {
    setAccessError("");

    const response = await axiosInstance.post(
      `/v2/data-archive/restore/${Number(archiveId)}`
    );

console.log("response",response)
    if (response.status === 200) {
      console.log("response",response.data)
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
    };

  } catch (error) {
    console.error(
      "RESTORE ERROR:",
      error?.response?.data || error
    );

    const errorData = error?.response?.data;

    const msg =
      typeof errorData === "string"
        ? errorData
        : errorData?.message ||
          errorData?.error ||
          "Restore failed";

    setAccessError(msg);

    return {
      success: false,
      message: msg,
    };
  }
};

const getDataArchiveById = async (archiveId) => {
  try {
    setLoading(true);
    setAccessError("");

    const response = await axiosInstance.get(
      `/v2/data-archive/${Number(archiveId)}`
    );

    console.log("DATA ARCHIVE BY ID RESPONSE:", response);

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
    };
  } catch (error) {
    console.error(
      "DATA ARCHIVE BY ID ERROR:",
      error?.response?.data || error
    );

    const errorData = error?.response?.data;

    const msg =
      typeof errorData === "string"
        ? errorData
        : errorData?.message ||
          errorData?.error ||
          "Something went wrong";

    setAccessError(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};
// const RestoreArchive = async (archiveId) => {
//   try {
//     setLoading(true);
//     setAccessError("");

//     const response = await axiosInstance.post(
//       `/v2/data-archive/restore/${Number(archiveId)}`
//     );

//     console.log("RESTORE RESPONSE:", response.data);

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     console.error("RESTORE ERROR:", error);
//     console.error("RESTORE ERROR DATA:", error?.response?.data);

//     const errorData = error?.response?.data;

//     const msg =
//       typeof errorData === "string"
//         ? errorData
//         : errorData?.message ||
//           errorData?.error ||
//           "Restore failed";

//     setAccessError(msg);

//     return {
//       success: false,
//       message: msg,
//     };
//   } finally {
//     setLoading(false);
//   }
// };

  return (
    <ArchiveContext.Provider
      value={{
        loading,
        accessError,
        getDataArchive,ArchiveActivities,RestoreArchive,getDataArchiveById
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () =>
  useContext(ArchiveContext);