import axios from "axios";
import { getAuthToken } from "../../auth/api/authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

/* ================= AUTH ================= */

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= HELPERS ================= */

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

const getPortfolioBasePath = ({ mode = "user", teamId = null } = {}) => {
  if (mode === "team") {
    if (!teamId) {
      throw new Error("teamId is required for team portfolio");
    }

    return `/api/v1/teams/${teamId}/portfolio`;
  }

  return `/api/v1/me/portfolio`;
};

const appendProjectToFormData = (formData, project, index) => {
  if (project.serverId) {
    formData.append(`projects[${index}][id]`, project.serverId);
  }

  formData.append(`projects[${index}][title]`, project.title || "");
  formData.append(`projects[${index}][description]`, project.desc || "");
  formData.append(`projects[${index}][cost_cents]`, project.cost || "");
  formData.append(`projects[${index}][currency]`, "USD");
  formData.append(`projects[${index}][sort_order]`, project.sort_order ?? index);

  (project.files || []).forEach((file) => {
    formData.append(`projects[${index}][files][]`, file);
  });
};

/* ================= LOAD ================= */

export const getMyPortfolio = async (options = {}) => {
  try {
    const basePath = getPortfolioBasePath(options);
    const res = await api.get(basePath);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

/* ================= SAVE ================= */

export const syncMyPortfolio = async (projects = [], options = {}) => {
  try {
    const basePath = getPortfolioBasePath(options);
    const formData = new FormData();

    (projects || []).forEach((project, index) => {
      appendProjectToFormData(formData, project, index);
    });

    const res = await api.post(`${basePath}/sync`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

/* ================= DELETE PROJECT ================= */

export const deletePortfolioProject = async (projectId, options = {}) => {
  try {
    if (!projectId) {
      throw new Error("projectId is required");
    }

    const basePath = getPortfolioBasePath(options);
    const res = await api.delete(`${basePath}/projects/${projectId}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

/* ================= DELETE MEDIA ================= */

export const deletePortfolioMedia = async (mediaId, options = {}) => {
  try {
    if (!mediaId) {
      throw new Error("mediaId is required");
    }

    const basePath = getPortfolioBasePath(options);
    const res = await api.delete(`${basePath}/media/${mediaId}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getPublicTeamPortfolio = async (username) => {
  try {
    const res = await publicApi.get(
      `/api/v1/teams/username/${username}/portfolio`
    );
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

//public user portfolio
export const getPublicUserPortfolio = async (username) => {
  try {
    const res = await publicApi.get(`/api/v1/users/username/${username}/portfolio`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};