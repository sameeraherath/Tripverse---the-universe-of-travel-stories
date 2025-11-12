import axios from "axios";
import wso2Auth from "./wso2Auth";

// WSO2 Gateway URL (direct replacement - no fallback)
const WSO2_GATEWAY_URL = import.meta.env.VITE_WSO2_GATEWAY_URL || 
  'https://localhost:8243/tripverse/discover/v1';

// Create axios instance for WSO2 Gateway
const wso2Api = axios.create({
  baseURL: WSO2_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add WSO2 OAuth token
wso2Api.interceptors.request.use(
  async (config) => {
    try {
      const token = await wso2Auth.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get WSO2 access token:", error);
      // Token acquisition failed - request will likely fail
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
wso2Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear old token and get new one
        wso2Auth.clearTokens();
        const newToken = await wso2Auth.getAccessToken();
        
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return wso2Api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Redirect to login or show error
        if (error.response?.status === 401) {
          // Could redirect to login page if needed
          // window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

const discoverApi = {
  // Get aggregated travel information through WSO2 Gateway
  getAggregatedInfo: async (location) => {
    const response = await wso2Api.get(`/aggregate/${encodeURIComponent(location)}`);
    return response.data;
  },

  // Individual endpoints through WSO2 Gateway
  getWeather: async (location) => {
    const response = await wso2Api.get(`/weather/${encodeURIComponent(location)}`);
    return response.data;
  },

  getAttractions: async (location) => {
    const response = await wso2Api.get(`/attractions/${encodeURIComponent(location)}`);
    return response.data;
  },

  getCurrency: async (base = "USD") => {
    const response = await wso2Api.get(`/currency/${base}`);
    return response.data;
  },
};

export default discoverApi;
