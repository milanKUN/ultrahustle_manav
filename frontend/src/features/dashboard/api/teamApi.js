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
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
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

const V1 = "/api/v1";

export const createTeam = async (payload) => {
  try {
    const res = await api.post(`${V1}/teams`, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getTeam = async (teamId) => {
  try {
    const res = await api.get(`${V1}/teams/${teamId}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const patchTeam = async (teamId, payload) => {
  try {
    const res = await api.patch(`${V1}/teams/${teamId}`, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const uploadTeamAvatar = async (teamId, file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post(`${V1}/teams/${teamId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const deleteTeamAvatar = async (teamId) => {
  try {
    const res = await api.delete(`${V1}/teams/${teamId}/avatar`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getTeamMembers = async (teamId) => {
  try {
    const res = await api.get(`${V1}/teams/${teamId}/members`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const patchTeamMember = async (teamId, memberId, payload) => {
  try {
    const res = await api.patch(`${V1}/teams/${teamId}/members/${memberId}`, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const deleteTeamMember = async (teamId, memberId) => {
  try {
    const res = await api.delete(`${V1}/teams/${teamId}/members/${memberId}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const searchCreators = async (q) => {
  try {
    const res = await api.get(`${V1}/creators/search`, {
      params: { q },
    });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const sendTeamInvite = async (teamId, payload) => {
  try {
    const res = await api.post(`${V1}/teams/${teamId}/invites`, payload);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const listTeamInvites = async (teamId) => {
  try {
    const res = await api.get(`${V1}/teams/${teamId}/invites`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const acceptTeamInvite = async (token) => {
  try {
    const res = await api.post(`${V1}/team-invites/${token}/accept`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const declineTeamInvite = async (token) => {
  try {
    const res = await publicApi.post(`${V1}/team-invites/${token}/decline`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getTeamByUsername = async (username) => {
  try {
    const res = await api.get(`${V1}/teams/username/${username}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getMyTeams = async () => {
  try {
    const res = await api.get(`${V1}/my-teams`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const toggleTeamStatus = async (teamId) => {
  try {
    const res = await api.patch(`${V1}/teams/${teamId}/toggle-status`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const checkTeamUsernameAvailability = async (username, teamId = null) => {
  try {
    const res = await api.get(`${V1}/teams/check-username`, {
      params: {
        username,
        team_id: teamId || undefined,
      },
    });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};