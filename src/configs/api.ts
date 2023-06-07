import axios from "axios";

const apiUrl = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
  baseURL: apiUrl || "",
});

api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");

    if (token && config.headers)
      config.headers.set("Authorization", `${token}`);

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export { api, apiUrl };
