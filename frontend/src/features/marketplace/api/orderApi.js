import axios from "axios";
import { getAuthToken } from "../../auth/api/authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
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

    return data.message || "Request failed";
};

export const getOrderWebinar = async (orderId) => {
    try {
        const res = await api.get(`/api/orders/${orderId}/webinar`);
        return unwrap(res);
    } catch (err) {
        throw new Error(extractErrorMessage(err));
    }
};

export const toggleOrderWebinarAgenda = async (orderId, itemId) => {
    try {
        const res = await api.post(`/api/orders/${orderId}/webinar/agenda/${itemId}/toggle`);
        return unwrap(res);
    } catch (err) {
        throw new Error(extractErrorMessage(err));
    }
};

/**
 * Reusable order endpoints for other listing delivery/access pages.
 * Keep same file so course / digital product / service pages can use it later.
 */
export const getOrderDigitalProduct = async (orderId) => {
    try {
        const res = await api.get(`/api/orders/${orderId}/digital-product`);
        return unwrap(res);
    } catch (err) {
        throw new Error(extractErrorMessage(err));
    }
};

export const getOrderCourse = async (orderId) => {
    try {
        const res = await api.get(`/api/orders/${orderId}/course`);
        return unwrap(res);
    } catch (err) {
        throw new Error(extractErrorMessage(err));
    }
};

export const getOrderService = async (orderId) => {
    try {
        const res = await api.get(`/api/orders/${orderId}/service`);
        return unwrap(res);
    } catch (err) {
        throw new Error(extractErrorMessage(err));
    }
};

export const toggleOrderCourseLesson = async (orderId, lessonId) => {
    try {
        const res = await api.post(`/api/orders/${orderId}/course/lessons/${lessonId}/toggle`);
        return unwrap(res);
    } catch (err) {
        throw new Error(extractErrorMessage(err));
    }
};