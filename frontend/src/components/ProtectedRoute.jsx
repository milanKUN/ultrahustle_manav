import { Navigate } from "react-router-dom";
const TOKEN_KEY = "uh_auth_token";
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEY);

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
