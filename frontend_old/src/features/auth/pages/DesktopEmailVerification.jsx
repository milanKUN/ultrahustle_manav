import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/DesktopEmailVerification.css';
import desktopBg from '/desktop-bg.png';

const DesktopEmailVerification = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [step, setStep] = useState('input'); // input, success
    const [error, setError] = useState('');
    const inputsRef = useRef([]);

    // Timer logic
    useEffect(() => {
        let interval;
        if (timer > 0 && step === 'input') {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, step]);

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(''); // Clear error on typing

        // Auto-focus next input
        if (value !== '' && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle Backspace to focus previous
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        // Mock verification logic
        if (code === '123456') { // Mock correct code
            setStep('success');
        } else {
            setError('Incorrect code, please try again');
        }
    };

    const handleResend = () => {
        setTimer(30);
        setOtp(['', '', '', '', '', '']);
        setError('');
        inputsRef.current[0].focus();
    };

    return (
        <div className="desktop-login-container">
            {/* Background Image */}
            <div className="desktop-login-bg">
                <img src={desktopBg} alt="Background" />
            </div>

            {/* Main Content Area */}
            <div className="desktop-login-content">

                {/* Verification Card */}
                <div className="login-card-glass email-verification-card">

                    {step === 'input' ? (
                        <>
                            <div className="verification-header">
                                <h2>Email Verification</h2>
                                <p className="verification-desc">
                                    We sent a reset code to <strong>dev@gmail.com</strong><br />
                                    Enter the 6 digit code below to activate your account
                                </p>
                            </div>

                            <div className="otp-container-desktop">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`otp-input-desktop ${error ? 'error' : ''}`}
                                    />
                                ))}
                            </div>

                            <button className="desktop-login-btn primary-lime" onClick={handleVerify}>
                                Verify & Continue
                            </button>

                            {error && <p className="error-message-desktop">Incorrect code, please try again</p>}

                            <div className="resend-text-desktop">
                                {error ? (
                                    <span className="resend-code-error">
                                        <button className="resend-link-desktop" disabled={timer > 0} onClick={handleResend}>
                                            Resend Code
                                        </button> in {timer > 0 ? `${timer} seconds` : '0 seconds'}
                                    </span>
                                ) : (
                                    <>
                                        Haven't got the sms yet? <button className="resend-link-desktop" disabled={timer > 0} onClick={handleResend}>Resend Code</button>
                                        {timer > 0 && <div className="timer-text">Resend Code in {timer} seconds</div>}
                                    </>
                                )}
                            </div>

                            <div className="back-to-login">
                                <button type="button" onClick={() => navigate('/login')}>
                                    ← Back to log in
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="success-container-desktop">
                            <div className="success-icon-desktop">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 32 32" fill="none">
                                    <path d="M24.5998 3.89597C22.1055 1.96752 18.9766 0.820068 15.5798 0.820068C7.4281 0.820068 0.819824 7.42835 0.819824 15.5801C0.819824 23.7318 7.4281 30.3401 15.5798 30.3401C23.7315 30.3401 30.3398 23.7318 30.3398 15.5801C30.3398 13.5442 29.9276 11.6045 29.1821 9.84007" stroke="#CEFF1B" strokeWidth="1.64" strokeLinecap="round" />
                                    <path d="M9.02002 13.5073L14.8847 19.372" stroke="#CEFF1B" strokeWidth="1.64" strokeLinecap="round" />
                                    <path d="M15.3618 19.0198L29.4615 4.92008" stroke="#CEFF1B" strokeWidth="1.64" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="success-header">Verification Successful</h3>
                            <p className="success-text">
                                You're good to go. Let's start building<br />
                                something extraordinary.
                            </p>
                            <button className="desktop-login-btn primary-lime" onClick={() => navigate('/create-team')}>
                                Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesktopEmailVerification;
