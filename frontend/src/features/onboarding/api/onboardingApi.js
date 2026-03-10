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

export const extractOnboardingCompleted = (status) => {
  const completed =
    status?.completed ??
    status?.is_completed ??
    status?.onboarding_completed ??
    status?.onboarding?.completed ??
    status?.data?.completed ??
    status?.data?.is_completed ??
    status?.data?.onboarding_completed ??
    status?.data?.onboarding?.completed;

  return completed === true || completed === 1 || completed === "1";
};

export const getOnboardingStatus = async () => {
  const res = await api.get("/api/onboarding/status");
  return unwrap(res);
};

export const completeOnboarding = async () => {
  const res = await api.post("/api/onboarding/complete");
  return unwrap(res);
};

// Client
export const saveClientWorkType = async ({ work_type, team_industry, team_build_plan }) => {
  const res = await api.patch("/api/onboarding/client/work-type", {
    work_type,
    team_industry,
    team_build_plan,
  });
  return unwrap(res);
};

export const saveClientGoals = async ({ goals }) => {
  const res = await api.patch("/api/onboarding/client/goals", { goals });
  return unwrap(res);
};

export const saveClientNeeds = async (payload) => {
  const res = await api.patch("/api/onboarding/client/needs", payload);
  return unwrap(res);
};

export const saveClientBusinessDetails = async (payload) => {
  const res = await api.patch("/api/onboarding/client/business-details", payload);
  return unwrap(res);
};

export const getClientOnboarding = async () => {
  const res = await api.get("/api/onboarding/client");
  return unwrap(res);
};

// Freelancer / Creator
export const saveFreelancerWorkType = async ({ work_type, team_industry, team_build_plan }) => {
  const res = await api.patch("/api/onboarding/freelancer/work-type", {
    work_type,
    team_industry,
    team_build_plan,
  });
  return unwrap(res);
};

export const saveFreelancerGoals = async ({ goals }) => {
  const res = await api.patch("/api/onboarding/freelancer/goals", { goals });
  return unwrap(res);
};

export const saveFreelancerSkills = async (payload) => {
  const res = await api.patch("/api/onboarding/freelancer/skills", payload);
  return unwrap(res);
};

export const getFreelancerOnboarding = async () => {
  const res = await api.get("/api/onboarding/freelancer");
  return unwrap(res);
};
