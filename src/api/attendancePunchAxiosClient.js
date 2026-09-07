import axios from "axios";

const attendancePunchAxiosClient = axios.create({
  baseURL: "http://localhost:8080/api",

  // ==========================================================
  // STOP PUNCH REQUEST QUICKLY IF ACADEMY NETWORK
  // IS NOT REACHABLE
  // ==========================================================

  timeout: 2000,
});

attendancePunchAxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url?.startsWith("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default attendancePunchAxiosClient;