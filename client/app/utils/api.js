// src/utils/api.js

import axios from "axios";

const API_URL = "https://dbms-o3mb.onrender.com/api";

// Add caching for GET requests
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in ms

// Basic exponential backoff for retries
const axiosWithRetry = async (config, retries = 3, delay = 1000) => {
  try {
    return await axios(config);
  } catch (error) {
    // If we've run out of retries or it's not a rate limiting error, throw
    if (retries === 0 || error.response?.status !== 429) {
      throw error;
    }

    console.log(
      `Rate limited, retrying in ${delay}ms... (${retries} retries left)`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Retry with longer delay
    return axiosWithRetry(config, retries - 1, delay * 2);
  }
};

// GET wrapper with caching
const cachedGet = async (url, config = {}) => {
  const cacheKey = `${url}-${JSON.stringify(config)}`;

  // Check cache
  const cachedItem = cache.get(cacheKey);
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${url}`);
    return cachedItem.data;
  }

  // Make request with retry
  const response = await axiosWithRetry({
    ...config,
    method: "GET",
    url,
  });

  // Cache the result
  cache.set(cacheKey, {
    data: response,
    timestamp: Date.now(),
  });

  return response;
};

// Authentication functions
export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const signup = async ({
  firstName,
  lastName,
  email,
  password,
  company,
  phoneNumber,
  gender,
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      firstName,
      lastName,
      email,
      password,
      company,
      phoneNumber,
      gender,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Signup failed");
  }
};

// User profile functions
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/auth/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update profile");
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await cachedGet(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to get profile data"
    );
  }
};

// Vehicle management functions
export const getVehicles = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await cachedGet(`${API_URL}/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch vehicles");
  }
};

export const addVehicle = async (vehicleData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API_URL}/vehicles`, vehicleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add vehicle");
  }
};

export const updateVehicle = async (id, vehicleData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/vehicles/${id}`, vehicleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update vehicle");
  }
};

export const deleteVehicle = async (id) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API_URL}/vehicles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete vehicle");
  }
};

export const getVehicleCount = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await cachedGet(`${API_URL}/vehicles/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to get vehicle count"
    );
  }
};

export const updateVehicleTrip = async (id, timestamp) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API_URL}/vehicles/${id}/trip`,
      { timestamp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update trip information"
    );
  }
};

// Driver management functions
export const getDrivers = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await cachedGet(`${API_URL}/drivers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch drivers");
  }
};

export const addDriver = async (driverData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API_URL}/drivers`, driverData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add driver");
  }
};

export const updateDriver = async (id, driverData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/drivers/${id}`, driverData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update driver");
  }
};

export const deleteDriver = async (id) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${API_URL}/drivers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete driver");
  }
};

export const recordIncident = async (driverId, incidentData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/drivers/${driverId}/incidents`,
      incidentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to record incident");
  }
};

export const getActiveDriverCount = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await cachedGet(`${API_URL}/drivers/count/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to get active driver count"
    );
  }
};

export const getIncidentCount = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await cachedGet(`${API_URL}/drivers/incidents/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to get incident count"
    );
  }
};

// Dashboard metrics - get all counts at once
export const getDashboardMetrics = async () => {
  try {
    // Method 1: Use the dedicated metrics endpoint
    const token = localStorage.getItem("authToken");
    const response = await cachedGet(`${API_URL}/user/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.metrics;
  } catch (error) {
    // Try fallback method if metrics endpoint fails
    try {
      console.log("Main metrics endpoint failed, trying fallback");
      const [vehicleCount, activeDriverCount, incidentCount] =
        await Promise.all([
          getVehicleCount(),
          getActiveDriverCount(),
          getIncidentCount(),
        ]);

      return {
        vehicleCount: vehicleCount.count,
        activeDriverCount: activeDriverCount.count,
        incidentCount: incidentCount.count,
      };
    } catch (fallbackError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch dashboard metrics"
      );
    }
  }
};
