import axios from "axios";

const attendanceAxiosClient = axios.create({
  baseURL: "http://192.168.0.106:8080/api",
});

attendanceAxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url?.startsWith("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default attendanceAxiosClient;