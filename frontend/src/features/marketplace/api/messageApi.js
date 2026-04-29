import axios from "axios";
import { getAuthToken } from "../../auth/api/authApi";

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
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getConversations = async () => {
    const response = await api.get("/api/conversations");
    return response.data;
};

export const getMessages = async (conversationId) => {
    const response = await api.get(`/api/conversations/${conversationId}/messages`);
    return response.data;
};

export const sendMessage = async (data) => {
    const response = await api.post("/api/messages", data);
    return response.data;
};
