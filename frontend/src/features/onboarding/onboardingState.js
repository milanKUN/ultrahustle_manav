import { getAuthToken, getCurrentUserEmail } from "../auth/api/authApi";

const ONBOARDING_COMPLETED_PREFIX = "uh_onboarding_completed__";

const safeKeyPart = (value) => encodeURIComponent(String(value || "").trim().toLowerCase());

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)), "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getCurrentUserKey = (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (normalizedEmail) return normalizedEmail;

  const storedEmail = String(getCurrentUserEmail?.() || "").trim().toLowerCase();
  if (storedEmail) return storedEmail;

  const token = getAuthToken?.();
  const payload = decodeJwtPayload(token);

  const tokenEmail =
    (payload && (payload.email || payload.user?.email || payload.data?.email)) || "";
  if (tokenEmail) return String(tokenEmail).trim().toLowerCase();

  const tokenUserId = (payload && (payload.sub || payload.id || payload.user_id)) || "";
  if (tokenUserId) return `id:${String(tokenUserId)}`;

  return "default";
};

const onboardingCompletedKey = (userKey) => {
  return `${ONBOARDING_COMPLETED_PREFIX}${safeKeyPart(userKey)}`;
};

export const isOnboardingCompleted = (email) => {
  const userKey = getCurrentUserKey(email);
  return localStorage.getItem(onboardingCompletedKey(userKey)) === "1";
};

export const setOnboardingCompleted = (email, completed = true) => {
  const userKey = getCurrentUserKey(email);
  const key = onboardingCompletedKey(userKey);
  if (completed) localStorage.setItem(key, "1");
  else localStorage.removeItem(key);
};

export const getNextRouteAfterAuth = (email) => {
  return isOnboardingCompleted(email) ? "/dashboard" : "/onboarding";
};
