import React from "react";
import "./ProfileCompletion.css";

const ProfileCompletion = ({ theme = "light", completionPercentage = 10 }) => {
    const handleCompleteProfile = () => {
        console.log("Navigate to complete profile page");
    };

    const handleWhyImportant = () => {
        console.log("Show why profile completion is important");
    };

    return (
        <div className={`profile-completion-container ${theme}`}>
            {/* Left Section - Progress Circle */}
            <div className="profile-progress-section">
                <div className="progress-circle">
                    <svg viewBox="0 0 100 100" className="progress-svg">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            className="progress-bg"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            className="progress-fill"
                            style={{
                                strokeDasharray: `${(completionPercentage / 100) * 283} 283`,
                            }}
                        />
                    </svg>
                    <div className="progress-text">{completionPercentage}%</div>
                </div>
            </div>

            {/* Middle Section - Content */}
            <div className="profile-content-section">
                <h3 className="profile-completion-title">
                    {completionPercentage}% of your profile is complete
                </h3>
                <p className="profile-completion-text">
                    Complete your profile to apply for jobs!
                </p>
                <p className="profile-completion-subtitle">
                    To learn more about building a great profile, check out our
                    Braintrust Academy Course and get pro tips on Discord in the
                    #top-notch profile channel. When you get to 100%, you can
                    apply for jobs and get verified as an Approved Talent!
                </p>
            </div>

            {/* Right Section - Buttons */}
            <div className="profile-actions-section">
                <button
                    className="profile-complete-btn"
                    onClick={handleCompleteProfile}
                >
                    Complete profile
                </button>
                {/* <button
                    className="profile-why-btn"
                    onClick={handleWhyImportant}
                > */}
                <span className="text-[11px] font-semibold text-center">Why is this important?</span>
                {/* </button> */}
            </div>
        </div>
    );
};

export default ProfileCompletion;
