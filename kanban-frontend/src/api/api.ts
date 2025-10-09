import axios, {type AxiosInstance,type InternalAxiosRequestConfig} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
    headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("jwt");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config
})

export default api;
