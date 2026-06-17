import axios from "axios";
import ConfigV2 from "./ConfigV2";

const axiosInstance = axios.create({
  baseURL: ConfigV2.apiBaseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {

    const loginType =
      localStorage.getItem(
        "login_type"
      );

    let token = null;

    if (loginType === "mock") {

      token =
        localStorage.getItem(
          "mock_token"
        );

    } else {

      token =
        localStorage.getItem(
          "access_token"
        );

    }

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;
  }
);

axiosInstance.interceptors.response.use(

  (response) => response,

  async (error) => {

    if (
      error?.response?.status === 401
    ) {

      localStorage.clear();

      window.location.replace(
        "/internal/login"
      );

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;