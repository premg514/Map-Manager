import axios from "axios";

// Base URL of the backend API
const API_URL = "http://localhost:5000/api";

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
    console.log(error)
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const fetchDashboardData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw "Unauthorized access";
  }
};
export const addMapData = async (token, data) => {
  try {
    const response = await axios.post(`${API_URL}/map/save-map`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response
  } catch (error) {
    throw "Unauthorized access";
  }
}
export const fetchMapData = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/map/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw "Unauthorized access";
  }
};

export const deleteMap = async(token, id)=>{
  try {
    const response = await axios.delete(`${API_URL}/map/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw "Unauthorized access";
  }
}