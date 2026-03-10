import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../pages/DesktopLogin.css";
import desktopBg from "/desktop-bg.png";

const DesktopLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // basic guard
    if (!formData.email || !formData.password) return;

    console.log("Login Form submitted:", formData);

    // Example: navigate after login
    // navigate("/user-profile");
  };

  return (
    <div className="desktop-login-container">
      {/* Background Image */}
      <div className="desktop-login-bg" aria-hidden="true">
        <img src={desktopBg} alt="" />
      </div>

      {/* Main Content Area */}
      <div className="desktop-login-content">
        <div className="login-card-glass">
          {/* Tab Switcher */}
          <div className="desktop-tab-switcher">
            <button type="button" className="tab-btn active">
              Login
            </button>
            <button
              type="button"
              className="tab-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address or phone number</label>

              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address or phone number"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                />

                <button
                  type="button"
                  className="input-icon"
                  aria-label="Email field"
                  tabIndex={-1}
                >
                  {/* Mail Icon */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6h16v12H4V6Z"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 7l8 6 8-6"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="input-icon"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {/* Eye / Eye Off */}
                  {showPassword ? (
                    // Eye-off
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 3l18 18"
                        stroke="#888"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                        stroke="#888"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 5.1A10.8 10.8 0 0 1 12 5c5 0 9 7 9 7a17.8 17.8 0 0 1-3.1 4.2"
                        stroke="#888"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.1 6.1C3.9 7.8 3 9.5 3 9.5S7 16.5 12 16.5c1.2 0 2.3-.2 3.3-.6"
                        stroke="#888"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
                        stroke="#888"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#888"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <Link
                to="/desktop-forgot-password"
                className="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="desktop-login-btn">
              Login
            </button>

            {/* Divider */}
            <div className="desktop-divider">
              <span>OR</span>
            </div>

            {/* Social Login Buttons */}
            <div className="desktop-social-buttons">
              <button type="button" className="social-btn google-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button type="button" className="social-btn facebook-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="white"
                  />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            <p className="signup-link">
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DesktopLogin;
