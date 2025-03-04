import axios from "axios";
import store from "../store/store"; // Import the Redux store

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim();

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔥 Add an interceptor to inject the token automatically
api.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Get the current Redux state
    const token = state.vote.currentVoter?.token; // Extract the JWT token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
