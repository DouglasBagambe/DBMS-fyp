// src/utils/api.js

import axios from "axios";

const API_URL = "https://dbms-o3mb.onrender.com/api";

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

export const signup = async ({ name, email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Signup failed");
  }
};
