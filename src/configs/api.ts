import axios from "axios";

const apiUrl = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
  baseURL: apiUrl || "",
});

export { api, apiUrl };
