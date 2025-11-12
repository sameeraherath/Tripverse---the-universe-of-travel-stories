const axios = require("axios");

const WSO2_CONFIG = {
  gatewayUrl: process.env.WSO2_GATEWAY_URL || "https://localhost:8243",
  publisherUrl: process.env.WSO2_PUBLISHER_URL || "https://localhost:9443",
  username: process.env.WSO2_USERNAME || "admin",
  password: process.env.WSO2_PASSWORD || "admin",
  clientId: process.env.WSO2_CLIENT_ID,
  clientSecret: process.env.WSO2_CLIENT_SECRET,
};

/**
 * Get WSO2 OAuth2 access token using client credentials
 * @returns {Promise<string>} Access token
 */
async function getWSO2AccessToken() {
  try {
    const tokenUrl = `${WSO2_CONFIG.publisherUrl}/oauth2/token`;
    const credentials = Buffer.from(
      `${WSO2_CONFIG.clientId}:${WSO2_CONFIG.clientSecret}`
    ).toString("base64");

    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: "default",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting WSO2 access token:", error.message);
    throw error;
  }
}

/**
 * Validate WSO2 token (optional utility)
 * @param {string} token - WSO2 access token
 * @returns {Promise<boolean>} True if valid
 */
async function validateWSO2Token(token) {
  try {
    const introspectUrl = `${WSO2_CONFIG.publisherUrl}/oauth2/introspect`;
    const credentials = Buffer.from(
      `${WSO2_CONFIG.clientId}:${WSO2_CONFIG.clientSecret}`
    ).toString("base64");

    const response = await axios.post(
      introspectUrl,
      new URLSearchParams({
        token: token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    return response.data.active === true;
  } catch (error) {
    console.error("Error validating WSO2 token:", error.message);
    return false;
  }
}

/**
 * Health check for WSO2 Gateway
 * @returns {Promise<object>} Health status
 */
async function checkWSO2Health() {
  try {
    const healthUrl = `${WSO2_CONFIG.gatewayUrl}/health`;
    const response = await axios.get(healthUrl, { timeout: 5000 });
    return {
      status: "healthy",
      gateway: WSO2_CONFIG.gatewayUrl,
      response: response.data,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      gateway: WSO2_CONFIG.gatewayUrl,
      error: error.message,
    };
  }
}

/**
 * Log API usage to WSO2 Analytics (optional)
 * @param {string} apiName - API name
 * @param {string} resource - Resource path
 * @param {string} method - HTTP method
 * @param {number} statusCode - HTTP status code
 */
async function logWSO2Analytics(apiName, resource, method, statusCode) {
  // This would integrate with WSO2 Analytics if configured
  // For now, just log to console
  console.log(`WSO2 Analytics: ${apiName} ${method} ${resource} - ${statusCode}`);
}

module.exports = {
  WSO2_CONFIG,
  getWSO2AccessToken,
  validateWSO2Token,
  checkWSO2Health,
  logWSO2Analytics,
};

