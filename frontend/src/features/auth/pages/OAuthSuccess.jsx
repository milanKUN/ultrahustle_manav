import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/authApi";
import { setOnboardingCompleted } from "../../onboarding/onboardingState";
import { extractOnboardingCompleted, getOnboardingStatus } from "../../onboarding/api/onboardingApi";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const params = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams((location.hash || "").replace(/^#/, ""));
    return { searchParams, hashParams };
  }, [location.search, location.hash]);

  useEffect(() => {
    const token =
      params.searchParams.get("token") ||
      params.hashParams.get("token") ||
      "";

    const message =
      params.searchParams.get("message") ||
      params.hashParams.get("message") ||
      "";

    const err =
      params.searchParams.get("error") ||
      params.hashParams.get("error") ||
      "";

    if (err) {
      setError(err);
      return;
    }

    if (!token) {
      setError(message || "Missing token from OAuth callback.");
      return;
    }

    (async () => {
      try {
        setAuthToken(token);
        const status = await getOnboardingStatus();
        const completed = extractOnboardingCompleted(status);
        if (completed) setOnboardingCompleted(undefined, true);
        navigate(completed ? "/dashboard" : "/onboarding", { replace: true });
      } catch (e) {
        // Fallback: keep onboarding mandatory
        navigate("/onboarding", { replace: true });
      }
    })();
  }, [navigate, params]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ maxWidth: 520, padding: 16, textAlign: "center" }}>
        {error ? (
          <>
            <h2 style={{ marginBottom: 8 }}>OAuth Login Failed</h2>
            <p style={{ marginBottom: 12 }}>{error}</p>
            <button type="button" onClick={() => navigate("/login")}
              style={{ height: 44, padding: "0 16px", borderRadius: 12, cursor: "pointer" }}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: 8 }}>Signing you in…</h2>
            <p>Please wait.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthSuccess;
