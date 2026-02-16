import axios from "axios";
import ConfigV2 from "./ConfigV2";

const axiosInstance = axios.create({
  baseURL: ConfigV2.apiBaseUrl,
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {

    const mockToken = localStorage.getItem("mock_token");
    const normalToken = localStorage.getItem("access_token");

    // 🔥 Priority logic
    const tokenToUse = mockToken || normalToken;

    console.log("TOKEN USED:", tokenToUse);

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance;
