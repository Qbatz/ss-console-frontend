import axios from "axios";
import ConfigV2 from "./ConfigV2";

const axiosInstance = axios.create({
  baseURL: ConfigV2.apiBaseUrl,
});
axiosInstance.interceptors.request.use((config) => {

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
});
// axiosInstance.interceptors.request.use((config) => {

//   const mockToken = localStorage.getItem("mock_token");
//   const normalToken = localStorage.getItem("access_token");

//   const token = mockToken || normalToken;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    // if (error?.response?.status === 401) {

    //   const mockToken = localStorage.getItem("mock_token");

    //   localStorage.removeItem("mock_token");
    //   localStorage.removeItem("access_token");

    //   if (mockToken) {
    //     window.location.replace("/internal/login");
    //   } else {
    //     window.location.replace("/");
    //   }
    // }
    if (error?.response?.status === 401) {

  const alreadyLoggedOut = sessionStorage.getItem("logout");

  if (!alreadyLoggedOut) {
    sessionStorage.setItem("logout", "true");

    localStorage.removeItem("mock_token");
    localStorage.removeItem("access_token");

    window.location.replace("/");
  }
}

    return Promise.reject(error);
  }
);

export default axiosInstance;
