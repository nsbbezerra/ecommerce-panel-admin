import axios from "axios";

const apiUrl = import.meta.env.VITE_API_ENDPOINT;

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: apiUrl || "",
  headers: {
    Authorization: token,
  },
});

export { api, apiUrl };
