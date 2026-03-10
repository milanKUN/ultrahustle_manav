import axios from "axios";
import { getAuthToken } from "../../auth/api/authApi";

// Base URL for axios.
// - Set VITE_API_BASE_URL to call your backend directly (e.g. http://159.89.193.253/).
// - Leave empty to use same-origin requests (useful with Vite proxy in dev).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = (res) => res?.data;

const extractErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) return error?.message || "Request failed";
  if (typeof data === "string") return data;

  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstValue = data.errors[firstKey];
    if (Array.isArray(firstValue) && firstValue[0]) return firstValue[0];
    if (typeof firstValue === "string") return firstValue;
  }

  if (data.message) return data.message;
  return "Request failed";
};

const ME_PATH = "/api/v1/me";

export const deleteMe = async () => {
  try {
    const res = await api.delete(ME_PATH);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};
