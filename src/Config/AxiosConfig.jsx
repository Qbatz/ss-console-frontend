// import axios from "axios";
// import ConfigV2 from "./ConfigV2";

// const axiosInstance = axios.create({
//   baseURL: ConfigV2.apiBaseUrl,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const loginType =
//       localStorage.getItem("login_type");

//     let token = null;

//     if (loginType === "mock") {
//       token =
//         localStorage.getItem(
//           "mock_token"
//         );
//     } else {
//       token =
//         localStorage.getItem(
//           "access_token"
//         );
//     }

//     if (token) {
//       config.headers.Authorization =
//         `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,

//   (error) => {
//     const status =
//       error?.response?.status;

//     if (status === 401) {
//       localStorage.clear();

//       if (
//         window.location.pathname !==
//         "/internal/login"
//       ) {
//         window.location.replace(
//           "/internal/login"
//         );
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";
import ConfigV2 from "./ConfigV2";

const axiosInstance = axios.create({
  baseURL: ConfigV2.apiBaseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const loginType = localStorage.getItem("login_type");

    let token = null;

    if (loginType === "mock") {
      token = localStorage.getItem("mock_token");
    } else {
      token = localStorage.getItem("access_token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.clear();

      const host = window.location.hostname;
      const isLocal = host === "localhost";
      const isDev = host.includes("consoledev");

      
      const loginPath = (isLocal || isDev) ? "/internal/login" : "/";

    const alreadyOnAuthPage =
  window.location.pathname === loginPath ||
  window.location.pathname === "/";

if (!alreadyOnAuthPage) {
  window.location.replace(loginPath);
}
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;