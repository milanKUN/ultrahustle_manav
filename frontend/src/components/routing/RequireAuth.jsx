import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../../features/auth/api/authApi";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
