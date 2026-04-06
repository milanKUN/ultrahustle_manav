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

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
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

//get all countries
export const getCountries = async () => {
  try {
    const res = await api.get('/api/v1/me/countries');
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

//get states from selected country
export const getStates = async (countryId) => {
  try {
    const res = await api.get(`/api/v1/me/states/${countryId}`);
    return unwrap(res); // returns array directly
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

//get cities from selected state
export const getCities = async (stateId) => {
  try {
    const res = await api.get(`/api/v1/me/cities/${stateId}`);
    return unwrap(res); // returns array
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

//get languages
export const getLanguages = async () => {
  try {
    const res = await api.get('/api/v1/me/languages');
    return unwrap(res); // returns array
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

//get login activities
export const getMyActivities = async () => {
  const res = await api.get("/api/v1/me/my-activities");
  return unwrap(res);
};

//get logged in user full name
export const getUserName = async () => {
  const res = await api.get("/api/v1/me/get-username");
  return unwrap(res);
};

//user login activities for activity time on user profile page
export const getMyActivity = async () => {
  const res = await api.get("/api/v1/me/my-activity");
  return unwrap(res);
};

//public user profile
export const getPublicUserProfile = async (username) => {
  const res = await publicApi.get(`/api/v1/users/username/${username}`);
  return res.data;
};

export const getPublicUserFollowCounts = async (username) => {
  const res = await publicApi.get(`/api/v1/users/username/${username}/follow-counts`);
  return res.data;
};