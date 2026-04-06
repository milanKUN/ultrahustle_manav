import React from "react";
import {
    Star,
    Infinity,
    CheckCircle2,
    Clock,
    User,
} from "lucide-react";
import "./DetailedTeamCard.css";

const DetailedTeamCard = ({
    teamName = "Sara Johnson",
    location = "San Francisco, CA",
    rating = 4.9,
    reviewCount = 247,
    description = "Hi! I'm Sarah, a senior UI/UX designer with over 8 years of experience creating beautiful and functional mobile applications. I've worked with startups, agencies, and Fortune 500 companies to deliver exceptional user experiences.",
    languages = ["Spanish", "English"],
    karma = "1,284",
    projectsCompleted = "98%",
    responseSpeed = "1 hr",
    memberSince = "January 2018",
    skills = [
        "Agile/Scrum",
        "Accessibility",
        "Visual Design",
        "Front-end Development",
        "Product Design",
        "UI/UX Design",
        "Design Systems",
        "Mobile App Design",
        "User Research",
    ],
    avatarUrl = "https://i.pravatar.cc/150?u=team",
}) => {
    return (
        <div className="tsl-team-profile-card">
            <div className="tsl-profile-left">
                <div className="tsl-profile-header">
                    <div className="tsl-avatar-container">
                        <img
                            src={avatarUrl}
                            alt={teamName}
                            className="tsl-profile-avatar"
                        />
                        <div className="tsl-online-indicator"></div>
                    </div>
                    <div className="tsl-profile-title-box">
                        <h3>{teamName}</h3>
                        <p className="tsl-location">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            {location}
                        </p>
                        <div className="tsl-rating-row">
                            <div className="tsl-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        fill="#CEFF1B"
                                        color="#CEFF1B"
                                    />
                                ))}
                            </div>
                            <span className="tsl-rating-text">
                                {rating}({reviewCount} reviews)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="tsl-profile-details">
                    <h4>About Me</h4>
                    <p>{description}</p>

                    <div className="tsl-languages-section">
                        <h5>Languages</h5>
                        <div className="tsl-lang-tags">
                            {languages.map((language) => (
                                <span key={language}>{language}</span>
                            ))}
                        </div>
                    </div>

                    <button className="tsl-full-profile-btn" type="button">
                        View Profile
                    </button>
                </div>
            </div>

            <div className="tsl-profile-right">
                <div className="tsl-stats-grid">
                    <div className="tsl-stat-card">
                        <div className="stat-header">
                            <Infinity size={16} className="stat-icon-svg" />
                            <span className="stat-label">Karma</span>
                        </div>
                        <span className="stat-value">{karma}</span>
                    </div>
                    <div className="tsl-stat-card">
                        <div className="stat-header">
                            <CheckCircle2
                                size={16}
                                className="stat-icon-svg"
                            />
                            <span className="stat-label">
                                Projects Completed
                            </span>
                        </div>
                        <span className="stat-value">{projectsCompleted}</span>
                    </div>
                    <div className="tsl-stat-card">
                        <div className="stat-header">
                            <Clock size={16} className="stat-icon-svg" />
                            <span className="stat-label">
                                Average Response Speed
                            </span>
                        </div>
                        <span className="stat-value">{responseSpeed}</span>
                    </div>
                    <div className="tsl-stat-card">
                        <div className="stat-header">
                            <User size={16} className="stat-icon-svg" />
                            <span className="stat-label">Member Since</span>
                        </div>
                        <span className="stat-value">{memberSince}</span>
                    </div>
                </div>

                <div className="tsl-skills-panel">
                    <h4>Skills & Expertise</h4>
                    <div className="tsl-skills-grid">
                        {skills.map((skill) => (
                            <span key={skill} className="tsl-skill-tag">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedTeamCard;
