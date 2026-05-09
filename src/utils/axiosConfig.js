import axios from "axios";

const instance = axios.create({
  baseURL: "https://homefood-api-uka6.onrender.com/api",
});

// ✅ ADD TOKEN AUTOMATICALLY
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;