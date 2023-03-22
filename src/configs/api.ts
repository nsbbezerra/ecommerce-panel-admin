import axios from "axios";

const url = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
  baseURL: url || "",
});

export { api };
