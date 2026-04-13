import React from "react";
import { Star, Infinity, CheckCircle2, Clock, User, Pencil, Camera } from "lucide-react";
import "./GroupDetailsCard.css";
import "./DetailedTeamCard.css";

const GroupDetailsCard = ({
    membersCount = 12,
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
}) => {
    return (
        <div className="group-details-card tsl-team-profile-card">
            <div className="gdc-header">
                <div className="gdc-group-avatar-wrapper">
                    <div className="gdc-group-avatar"></div>
                    <button className="gdc-edit-avatar-btn" type="button" aria-label="Edit group avatar">
                        <Camera size={14} />
                    </button>
                </div>
                <div className="gdc-group-name-wrapper">
                    <h3 className="gdc-group-name">Group Name</h3>
                    <button className="gdc-edit-name-btn" type="button" aria-label="Edit group name">
                        <Pencil size={14} />
                    </button>
                </div>
                <span className="gdc-group-members-count">{membersCount} Members</span>
            </div>

            <div className="gdc-owner-card">
                <div className="gdc-owner-avatar-container">
                    <div className="gdc-owner-avatar"></div>
                    <span className="gdc-owner-online"></span>
                </div>
                <div className="gdc-owner-info">
                    <h4>Sarah Anderson</h4>
                    <p className="gdc-owner-location">San Francisco, CA</p>
                    <div className="gdc-owner-rating">
                        <div className="gdc-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill="#CEFF1B"
                                    color="#CEFF1B"
                                />
                            ))}
                        </div>
                        <span>
                            <strong>4.9</strong>(247 reviews)
                        </span>
                    </div>
                </div>
            </div>

            <hr className="gdc-divider" />

            <div className="gdc-members-grid">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="gdc-member-item">
                        <div className="gdc-member-avatar"></div>
                        <p className="gdc-member-name">User Name</p>
                        <p className="gdc-member-desig">Designation</p>
                    </div>
                ))}
            </div>

            <button className="gdc-view-profile-btn" type="button">
                View Profile
            </button>

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

export default GroupDetailsCard;
