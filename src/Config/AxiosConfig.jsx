// import axios from "axios";
// import ConfigV2 from "./ConfigV2";

// const axiosInstance = axios.create({
//   baseURL: ConfigV2.apiBaseUrl,
// });

// // Attach token automatically
// axiosInstance.interceptors.request.use(
//   (config) => {

//     const mockToken = localStorage.getItem("mock_token");
//     const normalToken = localStorage.getItem("access_token");

//     // 🔥 Priority logic
//     const tokenToUse = mockToken || normalToken;

//     console.log("TOKEN USED:", tokenToUse);

//     if (tokenToUse) {
//       config.headers.Authorization = `Bearer ${tokenToUse}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// export default axiosInstance;

import axios from "axios";
import ConfigV2 from "./ConfigV2";

const axiosInstance = axios.create({
  baseURL: ConfigV2.apiBaseUrl,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const mockToken = localStorage.getItem("mock_token");
    const normalToken = localStorage.getItem("access_token");

    const tokenToUse = mockToken || normalToken;

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
console.log("error",error)
    if (error?.response?.status === 401) {

      const mockToken = localStorage.getItem("mock_token");
      const normalToken = localStorage.getItem("access_token");

      
      localStorage.removeItem("mock_token");
      localStorage.removeItem("access_token");

      if (mockToken) {
        window.location.replace("/internal/login");
      } else if (normalToken) {
        window.location.replace("/");
      } else {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
