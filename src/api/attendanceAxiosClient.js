import axios from "axios";

const attendanceAxiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
});

attendanceAxiosClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (
    token &&
    !config.url?.startsWith("/auth")
  ) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default attendanceAxiosClient;