import React, { useState, useEffect } from "react";
import "./cookies.css";
import { X } from "lucide-react";

const Cookies = ({ theme = "light" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        if (!cookiesAccepted) {
            setIsVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem("cookiesAccepted", "true");
        setIsVisible(false);
    };

    const handleManagePreferences = () => {
        // Open preferences modal or navigate to settings
        console.log("Manage preferences clicked");
    };

    const handleClose = () => {
        // Just close without accepting
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={`cookie-banner ${theme}`}>
            <div className="cookie-container">
                <div className="cookie-header">
                    <h3 className="cookie-title">Accept the use of cookies</h3>
                    <button
                        className="cookie-close"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="cookie-body">
                    <p className="cookie-text">
                        We use cookies to improve your browsing experience,
                        serve personalized content, and analyze our traffic. By
                        clicking Accept all Cookies, you agree to the storing of
                        cookies on your device.
                    </p>
                    <p className="cookie-subtext">
                        You can customize your settings by clicking Manage
                        Preferences. For more details, see our{" "}
                        <a href="#" className="cookie-link">
                            Cookie Policy
                        </a>
                        .
                    </p>
                </div>

                <div className="cookie-actions">
                    <button
                        className="cookie-btn secondary"
                        onClick={handleManagePreferences}
                    >
                        Manage Preferences
                    </button>
                    <button
                        className="cookie-btn primary"
                        onClick={handleAcceptAll}
                    >
                        Accept all Cookies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cookies;
