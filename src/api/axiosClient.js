import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach JWT token to protected API requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url?.startsWith("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;