// utils/axiosClient.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies automatically
});

// --- Refresh token queue handling ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request interceptor ---
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken"); // only short-lived access token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 unauthorized and request not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint (cookie-based)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/refreshToken`,
          {},
          { withCredentials: true } // cookies sent automatically
        );

        const { accessToken } = response.data;

        if (!accessToken) throw new Error("Failed to refresh token");

        // Save new access token (short-lived) in localStorage
        localStorage.setItem("userToken", accessToken);

        // Update axios default header
        axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        // Retry original request
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("userToken");
        toast.error("Session expired. Please log in again.");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
