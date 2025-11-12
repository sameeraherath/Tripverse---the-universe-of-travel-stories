import axios from "axios";

// WSO2 OAuth2 Token Service
class WSO2AuthService {
  constructor() {
    this.tokenUrl = import.meta.env.VITE_WSO2_TOKEN_URL || 
      `${import.meta.env.VITE_WSO2_GATEWAY_URL?.replace('/tripverse/discover/v1', '') || 'https://localhost:9443'}/oauth2/token`;
    this.clientId = import.meta.env.VITE_WSO2_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_WSO2_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshToken = null;
  }

  // Get access token from WSO2
  async getAccessToken() {
    // Validate WSO2 configuration
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        "WSO2 configuration missing. Please set VITE_WSO2_CLIENT_ID and VITE_WSO2_CLIENT_SECRET in your .env file."
      );
    }

    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // If we have a refresh token, try to refresh
    if (this.refreshToken) {
      try {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          return newToken;
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Fall through to get new token
      }
    }

    // Get new access token
    return await this.acquireNewToken();
  }

  // Acquire new access token using client credentials
  async acquireNewToken() {
    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: "client_credentials",
          scope: "default",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600; // Default 1 hour
      this.tokenExpiry = Date.now() + (expiresIn - 60) * 1000; // Refresh 1 minute before expiry
      this.refreshToken = response.data.refresh_token || null;

      // Store token in localStorage for persistence
      if (this.accessToken) {
        localStorage.setItem("wso2_access_token", this.accessToken);
        localStorage.setItem("wso2_token_expiry", this.tokenExpiry.toString());
      }
      if (this.refreshToken) {
        localStorage.setItem("wso2_refresh_token", this.refreshToken);
      }

      return this.accessToken;
    } catch (error) {
      console.error("Error acquiring WSO2 access token:", error);
      throw new Error("Failed to acquire WSO2 access token");
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = Date.now() + (expiresIn - 60) * 1000;
      
      if (response.data.refresh_token) {
        this.refreshToken = response.data.refresh_token;
        localStorage.setItem("wso2_refresh_token", this.refreshToken);
      }

      localStorage.setItem("wso2_access_token", this.accessToken);
      localStorage.setItem("wso2_token_expiry", this.tokenExpiry.toString());

      return this.accessToken;
    } catch (error) {
      console.error("Error refreshing WSO2 access token:", error);
      // Clear invalid refresh token
      this.refreshToken = null;
      localStorage.removeItem("wso2_refresh_token");
      throw error;
    }
  }

  // Load token from localStorage on initialization
  loadTokenFromStorage() {
    const storedToken = localStorage.getItem("wso2_access_token");
    const storedExpiry = localStorage.getItem("wso2_token_expiry");
    const storedRefresh = localStorage.getItem("wso2_refresh_token");

    if (storedToken && storedExpiry) {
      this.accessToken = storedToken;
      this.tokenExpiry = parseInt(storedExpiry, 10);
      this.refreshToken = storedRefresh;
    }
  }

  // Clear tokens
  clearTokens() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshToken = null;
    localStorage.removeItem("wso2_access_token");
    localStorage.removeItem("wso2_token_expiry");
    localStorage.removeItem("wso2_refresh_token");
  }
}

// Create singleton instance
const wso2Auth = new WSO2AuthService();

// Load token from storage on initialization
wso2Auth.loadTokenFromStorage();

export default wso2Auth;

