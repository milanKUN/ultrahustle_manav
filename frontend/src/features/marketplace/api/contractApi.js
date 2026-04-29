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
  if (data.message) return data.message;
  return "Request failed";
};

export const saveContract = async (payload) => {
  try {
    const res = await api.post("/api/v1/contracts", payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getContract = async (contractId) => {
  try {
    const res = await api.get(`/api/v1/contracts/${contractId}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getContracts = async (status = null, role = 'creator') => {
  try {
    const params = {};
    if (status) params.status = status;
    params.role = role;
    const res = await api.get('/api/v1/contracts', { params });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const updateContractStatus = async (contractId, status, action = null, details = null) => {
  try {
    const res = await api.patch(`/api/v1/contracts/${contractId}/status`, { status, action, details });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const updateContract = async (id, payload) => {
  try {
    const res = await api.post("/api/v1/contracts", { ...payload, record_id: id });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const submitMilestone = async (milestoneId, payload) => {
  try {
    const res = await api.post(`/api/v1/contracts/milestones/${milestoneId}/submit`, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const approveMilestone = async (milestoneId) => {
  try {
    const res = await api.post(`/api/v1/contracts/milestones/${milestoneId}/approve`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const requestMilestoneRevision = async (milestoneId, notes) => {
  try {
    const res = await api.post(`/api/v1/contracts/milestones/${milestoneId}/revision`, { notes });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const acceptMilestoneRevision = async (milestoneId) => {
  try {
    const res = await api.post(`/api/v1/contracts/milestones/${milestoneId}/accept-revision`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const cancelMilestoneRevision = async (milestoneId) => {
  try {
    const res = await api.post(`/api/v1/contracts/milestones/${milestoneId}/cancel-revision`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const requestResolution = async (contractId, payload) => {
  try {
    const res = await api.post(`/api/v1/contracts/${contractId}/resolution`, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};
