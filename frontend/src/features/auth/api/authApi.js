import axios from "axios";

const TOKEN_KEY = "uh_auth_token";
const PENDING_EMAIL_KEY = "uh_pending_verification_email";
const CURRENT_EMAIL_KEY = "uh_auth_email";

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
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const extractErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) return error?.message || "Request failed";

  if (typeof data === "string") return data;

  // Laravel validation format: { errors: { field: ["msg"] } }
  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstValue = data.errors[firstKey];
    if (Array.isArray(firstValue) && firstValue[0]) return firstValue[0];
  }

  if (data.message) return data.message;

  return "Request failed";
};

const saveTokenFromResponse = (data) => {
  const token = data?.token || data?.access_token || data?.data?.token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  return token;
};

export const setAuthToken = (token) => {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const setPendingVerificationEmail = (email) => {
  if (!email) return;
  localStorage.setItem(PENDING_EMAIL_KEY, email);
};

export const getPendingVerificationEmail = () => {
  return localStorage.getItem(PENDING_EMAIL_KEY) || "";
};

export const clearPendingVerificationEmail = () => {
  localStorage.removeItem(PENDING_EMAIL_KEY);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setCurrentUserEmail = (email) => {
  if (!email) return;
  localStorage.setItem(CURRENT_EMAIL_KEY, String(email).trim().toLowerCase());
};

export const getCurrentUserEmail = () => localStorage.getItem(CURRENT_EMAIL_KEY) || "";

export const clearCurrentUserEmail = () => {
  localStorage.removeItem(CURRENT_EMAIL_KEY);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

const normalizeRoleForBackend = (role) => {
  const normalized = String(role || "")
    .trim()
    .toLowerCase();

  // Backend appears to accept: "freelancer" | "client".
  // Some parts of the UI (and older builds) may still use "creator".
  const map = {
    creator: "freelancer",
    freelancer: "freelancer",
    client: "client",
    "find work": "freelancer",
    "hire talent": "client",
  };

  return map[normalized] || normalized;
};

export const register = async ({ fullName, email, password, password_confirmation, role, agreedToTerms }) => {
  try {
    const normalizedFullName = String(fullName || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedRole = normalizeRoleForBackend(role);

    const form = new URLSearchParams();
    // Support multiple backend field naming conventions.
    form.set("fullName", normalizedFullName);
    form.set("full_name", normalizedFullName);
    form.set("name", normalizedFullName);

    form.set("email", normalizedEmail);
    form.set("password", password);
    form.set("password_confirmation", password_confirmation);
    form.set("role", normalizedRole);

    const agreed = agreedToTerms ? "1" : "0";
    form.set("agreedToTerms", agreed);
    form.set("agreed_to_terms", agreed);

    const res = await api.post("/api/register", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    saveTokenFromResponse(res.data);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const login = async ({ email, password }) => {
  try {
    const form = new URLSearchParams();
    form.set("email", email);
    form.set("password", password);

    const res = await api.post("/api/login", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    saveTokenFromResponse(res.data);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

// OTP verification endpoints can vary per backend. Override these in Vite env if needed.
const VERIFY_OTP_PATH = import.meta.env.VITE_VERIFY_OTP_PATH || "/api/verify-otp";
const RESEND_OTP_PATH = import.meta.env.VITE_RESEND_OTP_PATH || "/api/resend-otp";

export const verifyOtp = async ({ email, otp }) => {
  try {
    const form = new URLSearchParams();
    form.set("email", email);
    form.set("otp", otp);
    form.set("code", otp);

    const res = await api.post(VERIFY_OTP_PATH, form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    saveTokenFromResponse(res.data);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const resendOtp = async ({ email }) => {
  try {
    const form = new URLSearchParams();
    form.set("email", email);

    const res = await api.post(RESEND_OTP_PATH, form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const form = new URLSearchParams();
    form.set("email", email);

    const res = await api.post("/api/forgot-password", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const resetPassword = async ({ email, token, password, password_confirmation }) => {
  try {
    const form = new URLSearchParams();
    form.set("email", email);
    form.set("token", token);
    form.set("password", password);
    form.set("password_confirmation", password_confirmation);

    const res = await api.post("/api/reset-password", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getOAuthRedirectUrl = (provider) => {
  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "";
  const base = API_BASE_URL || backendOrigin || window.location.origin;
  return new URL(`/auth/${provider}/redirect`, base).toString();
};
