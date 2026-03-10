import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../../features/auth/api/authApi";
import { getOnboardingStatus, extractOnboardingCompleted } from "../../features/onboarding/api/onboardingApi";
import { isOnboardingCompleted, setOnboardingCompleted } from "../../features/onboarding/onboardingState";

export default function RequireOnboardingComplete({ children }) {
  const token = getAuthToken();
  const [state, setState] = useState({ loading: true, authed: true, completed: false });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!token) {
          if (!alive) return;
          setState({ loading: false, authed: false, completed: false });
          return;
        }

        if (isOnboardingCompleted()) {
          if (!alive) return;
          setState({ loading: false, authed: true, completed: true });
          return;
        }

        const status = await getOnboardingStatus();
        const completed = extractOnboardingCompleted(status);
        if (completed) setOnboardingCompleted(undefined, true);

        if (!alive) return;
        setState({ loading: false, authed: true, completed });
      } catch (err) {
        const httpStatus = err?.response?.status;
        if (!alive) return;

        if (httpStatus === 401) {
          setState({ loading: false, authed: false, completed: false });
        } else {
          // If status fails for any other reason, keep onboarding mandatory.
          setState({ loading: false, authed: true, completed: false });
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (state.loading) return null;

  if (!state.authed) {
    return <Navigate to="/login" replace />;
  }

  if (!state.completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
