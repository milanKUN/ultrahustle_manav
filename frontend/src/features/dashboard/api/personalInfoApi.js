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

const PERSONAL_INFO_PATH = "/api/v1/me/personal-info";
const AVATAR_PATH = `${PERSONAL_INFO_PATH}/avatar`;

export const getMyPersonalInfo = async () => {
  try {
    const res = await api.get(PERSONAL_INFO_PATH);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const putMyPersonalInfo = async (payload) => {
  try {
    const res = await api.put(PERSONAL_INFO_PATH, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const patchMyPersonalInfo = async (payload) => {
  try {
    const res = await api.patch(PERSONAL_INFO_PATH, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const deleteMyPersonalInfo = async () => {
  try {
    const res = await api.delete(PERSONAL_INFO_PATH);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const uploadMyAvatar = async (file) => {
  try {
    const formData = new FormData();
    // Backend route expects a file input; commonly named `avatar`
    formData.append("avatar", file);

    const res = await api.post(AVATAR_PATH, formData, {
      headers: {
        // Override the instance default JSON content-type for multipart uploads
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const deleteMyAvatar = async () => {
  try {
    const res = await api.delete(AVATAR_PATH);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};
