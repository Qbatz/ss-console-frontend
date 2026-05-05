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


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {

   
//     if (error?.response?.status === 401) {

//       const isAlreadyRedirecting = sessionStorage.getItem("redirecting");

//       if (!isAlreadyRedirecting) {
//         sessionStorage.setItem("redirecting", "true");

//         localStorage.removeItem("access_token");
//         localStorage.removeItem("mock_token");

//         window.location.replace("/");
//       }
//     }

//     return Promise.reject(error);
//   }
// );
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

  
    if (error?.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(
          `${ConfigV2.apiBaseUrl}/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("access_token", newAccessToken);

        axiosInstance.defaults.headers.Authorization =
          "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          "Bearer " + newAccessToken;

        return axiosInstance(originalRequest);

      } catch (err) {
        processQueue(err, null);

        localStorage.clear();
        window.location.replace("/");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
