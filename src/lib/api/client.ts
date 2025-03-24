import axios, { type AxiosError } from "axios";
import { useAuthStore } from "@/lib/store/auth-store";

// Create a base axios instance
const apiClient = axios.create({
  baseURL: "https://helicode-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Update response interceptor to handle common responses and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Return the entire response data, not just the data property
    return response.data;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // If the error is 401, log the user out
      useAuthStore.getState().logout();

      // Redirect user to login page (optional)
      window.location.href = "/";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
