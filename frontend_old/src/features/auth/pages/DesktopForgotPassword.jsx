import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/DesktopForgotPassword.css';
import desktopBg from '/desktop-bg.png';

const DesktopForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (formData.email) {
      setStep(2);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password === formData.confirmPassword) {
      setStep(3);
    }
  };

  return (
    <div className="desktop-login-container">
      {/* Background Image */}
      <div className="desktop-login-bg">
        <img src={desktopBg} alt="Background" />
      </div>

      {/* Main Content Area */}
      <div className="desktop-login-content">

        {/* Forgot Password Card */}
        <div className="login-card-glass forgot-password-card">

          {/* Success State handles its own layout, otherwise show header */}
          {step !== 3 && (
            <div className="forgot-password-header">
              <h2>{step === 1 ? 'Forgot your password' : 'Create new password'}</h2>
              {step === 1 && <p>No worries, we'll send you the reset instructions</p>}
              {step === 2 && <p className="error-text">Your new password must be different from previously used password</p>}
            </div>
          )}

          {/* STEP 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address or phone number</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email address or phone number"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="desktop-login-btn action-btn-grey">
                Reset Password
              </button>

              <div className="back-to-login">
                <button type="button" onClick={() => navigate('/login')}>
                  ← Back to log in
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: New Password */}
          {step === 2 && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="input-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2" />
                      <path d="M21 12C21 12 16.9706 18 12 18C7.02944 18 3 12 3 12C3 12 7.02944 6 12 6C16.9706 6 21 12 21 12Z" stroke="#888" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2" />
                      <path d="M21 12C21 12 16.9706 18 12 18C7.02944 18 3 12 3 12C3 12 7.02944 6 12 6C16.9706 6 21 12 21 12Z" stroke="#888" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" className="desktop-login-btn action-btn-grey">
                Reset Password
              </button>
            </form>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="success-container-desktop">
              <div className="success-icon-desktop">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 32 32" fill="none">
                  <path d="M24.5998 3.89597C22.1055 1.96752 18.9766 0.820068 15.5798 0.820068C7.4281 0.820068 0.819824 7.42835 0.819824 15.5801C0.819824 23.7318 7.4281 30.3401 15.5798 30.3401C23.7315 30.3401 30.3398 23.7318 30.3398 15.5801C30.3398 13.5442 29.9276 11.6045 29.1821 9.84007" stroke="#CEFF1B" strokeWidth="1.64" strokeLinecap="round" />
                  <path d="M9.02002 13.5073L14.8847 19.372" stroke="#CEFF1B" strokeWidth="1.64" strokeLinecap="round" />
                  <path d="M15.3618 19.0198L29.4615 4.92008" stroke="#CEFF1B" strokeWidth="1.64" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="success-header">Password Reset</h3>
              <p className="success-text">
                Your password has been successful reset.<br />
                Click below to log in.
              </p>
              <button
                className="desktop-login-btn primary-lime"
                onClick={() => navigate('/onboarding')}
              >
                Continue
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DesktopForgotPassword;
