import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://ssconsole.qbatz.com",
  baseURL: "https://ssconsoledevapi.qbatz.com",
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    console.log("TOKEN:", token); // 👈 check this

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
