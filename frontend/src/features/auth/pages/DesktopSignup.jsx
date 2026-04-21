import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/DesktopLogin.css";
import "../pages/DesktopSignup.css";
import desktopBg from "/desktop-bg.png";
import { getOAuthRedirectUrl, register, setPendingVerificationEmail } from "../api/authApi";

const DesktopSignup = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreedToTerms: false,
  });

  // ✅ Password Validation State
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    special: false,
    upper: false,
    lower: false,
    number: false,
  });

  const validatePassword = (pass) => {
    setPasswordCriteria({
      length: pass.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "password") validatePassword(newValue);

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // ✅ Custom Role Select (FULL FIX)
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const options = useMemo(
    () => [
      { value: "freelancer", label: "Find Work" },
      { value: "client", label: "Hire Talent" },
    ],
    [],
  );

  const selectedLabel =
    options.find((opt) => opt.value === formData.role)?.label ||
    "Select an option";

  const handleSelect = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setIsOpen(false);
  };

  // ✅ Close dropdown on outside click + ESC
  useEffect(() => {
    const onMouseDown = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (isSubmitting) return;

    if (!formData.fullName || !formData.email || !formData.password) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }

    if ((formData.password || "").length < 8) {
      setSubmitError("Password must be at least 8 characters.");
      return;
    }

    if (!formData.role) {
      setSubmitError("Please select an option.");
      return;
    }

    if (!formData.agreedToTerms) {
      setSubmitError("Please agree to Terms & Privacy Policy.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: formData.role,
        agreedToTerms: formData.agreedToTerms,
      });

      setPendingVerificationEmail(formData.email);
      navigate("/desktop-email-verification");
    } catch (err) {
      setSubmitError(err?.message || "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = getOAuthRedirectUrl("google");
  };

  const handleFacebookSignup = () => {
    window.location.href = getOAuthRedirectUrl("facebook");
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden custom-scroll">
      <div className="desktop-login-container signup-mode">
        {/* Background Image */}
      <div className="desktop-login-bg">
        <img src={desktopBg} alt="Background" />
      </div>

      {/* Main Content Area */}
      <div className="desktop-login-content">
        {/* Signup Form Card */}
        <div className="login-card-glass signup-card-glass">
          {/* Tab Switcher */}
          <div className="desktop-tab-switcher">
            <button className="tab-btn" type="button" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="tab-btn active" type="button">
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-visible h-auto max-h-none">

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setShowPasswordTooltip(true)}
                  onBlur={() => setShowPasswordTooltip(false)}
                  required
                />
                <button
                  type="button"
                  className="input-icon"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2" />
                    <path
                      d="M21 12C21 12 16.9706 18 12 18C7.02944 18 3 12 3 12C3 12 7.02944 6 12 6C16.9706 6 21 12 21 12Z"
                      stroke="#888"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>

              {/* Password Tooltip */}
              {showPasswordTooltip && (
                <div className="desktop-password-tooltip">
                  <div className="tooltip-arrow"></div>
                  <h4>Your Password must contain:</h4>
                  <ul>
                    <li className={!formData.password ? "" : passwordCriteria.length ? "valid" : "invalid"}>
                      At least 8 Characters
                    </li>
                    <li className={!formData.password ? "" : passwordCriteria.special ? "valid" : "invalid"}>
                      Special Character (eg. !@#$%&*)
                    </li>
                    <li className={!formData.password ? "" : passwordCriteria.upper ? "valid" : "invalid"}>
                      At least one upper case letter (A-Z)
                    </li>
                    <li className={!formData.password ? "" : passwordCriteria.lower ? "valid" : "invalid"}>
                      At least one lower case letter (a-z)
                    </li>
                    <li className={!formData.password ? "" : passwordCriteria.number ? "valid" : "invalid"}>
                      Number (0-9)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="input-icon"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label="Toggle confirm password visibility"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2" />
                    <path
                      d="M21 12C21 12 16.9706 18 12 18C7.02944 18 3 12 3 12C3 12 7.02944 6 12 6C16.9706 6 21 12 21 12Z"
                      stroke="#888"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* ✅ Role Select (Custom) */}
            <div className="form-group">
              <label>I am Mainly here to</label>

              <div className="custom-select" ref={selectRef}>
                <div
                  className={`selected-option ${isOpen ? "open" : ""}`}
                  onClick={() => setIsOpen((v) => !v)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setIsOpen((v) => !v);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                >
                  {selectedLabel}
                  <span className="arrow">▼</span>
                </div>

                {isOpen && (
                  <ul className="options-list" role="listbox">
                    {options.map((option) => (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={formData.role === option.value}
                        className={formData.role === option.value ? "active" : ""}
                        onClick={() => handleSelect(option.value)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">I agree to Terms &amp; Privacy Policy</span>
              </label>
            </div>

            {submitError ? (
              <p className="auth-submit-message" role="alert" style={{ color: '#dc2626', textAlign: 'center', marginTop: '12px' }}>
                {submitError}
              </p>
            ) : null}

            {/* Submit */}
            <button type="submit" className="desktop-login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>

            <div className="desktop-divider">
              <span>OR</span>
            </div>

            {/* Social Buttons */}
            <div className="desktop-social-buttons">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={handleGoogleSignup}
                disabled={isSubmitting}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
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

              <button
                type="button"
                className="social-btn facebook-btn"
                onClick={handleFacebookSignup}
                disabled={isSubmitting}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="white"
                  />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DesktopSignup;
