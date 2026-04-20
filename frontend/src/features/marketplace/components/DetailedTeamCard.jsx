import React, { useMemo } from "react";
import {
  Star,
  Infinity,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import "./DetailedTeamCard.css";

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toArray = (value) => {
  return Array.isArray(value) ? value.filter(Boolean) : [];
};

const formatMemberSince = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

const DetailedTeamCard = ({
  teamName = "",
  location = "",
  rating = 0,
  reviewCount = 0,
  description = "",
  languages = [],
  karma = "—",
  projectsCompleted = "—",
  responseSpeed = "—",
  memberSince = "",
  skills = [],
  avatarUrl = "",
  buttonText = "View Profile",
  onViewProfile,
}) => {
  const safeLanguages = useMemo(() => toArray(languages), [languages]);
  const safeSkills = useMemo(() => toArray(skills), [skills]);

  const safeRating = toNumber(rating, 0);
  const safeReviewCount = toNumber(reviewCount, 0);

  return (
    <div className="tsl-team-profile-card">
      <div className="tsl-profile-left">
        <div className="tsl-profile-header">
          <div className="tsl-avatar-container">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={teamName || "Profile"}
                className="tsl-profile-avatar"
              />
            ) : (
              <div className="tsl-profile-avatar"></div>
            )}
            <div className="tsl-online-indicator"></div>
          </div>

          <div className="tsl-profile-title-box">
            <h3>{teamName || "Profile"}</h3>

            {!!location && (
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
            )}

            <div className="tsl-rating-row">
              <div className="tsl-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= Math.round(safeRating) ? "#CEFF1B" : "none"}
                    color="#CEFF1B"
                  />
                ))}
              </div>
              <span className="tsl-rating-text">
                {safeRating ? safeRating.toFixed(1) : "0.0"} ({safeReviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="tsl-profile-details">
          <h4>About Me</h4>
          <p>{description || "No description added yet."}</p>

          <div className="tsl-languages-section">
            <h5>Languages</h5>
            <div className="tsl-lang-tags">
              {safeLanguages.length ? (
                safeLanguages.map((language) => (
                  <span key={language}>{language}</span>
                ))
              ) : (
                <span>Not specified</span>
              )}
            </div>
          </div>

          <button
            className="tsl-full-profile-btn"
            type="button"
            onClick={onViewProfile}
            disabled={!onViewProfile}
          >
            {buttonText}
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
            <span className="stat-value">{karma || "—"}</span>
          </div>

          <div className="tsl-stat-card">
            <div className="stat-header">
              <CheckCircle2 size={16} className="stat-icon-svg" />
              <span className="stat-label">Projects Completed</span>
            </div>
            <span className="stat-value">{projectsCompleted || "—"}</span>
          </div>

          <div className="tsl-stat-card">
            <div className="stat-header">
              <Clock size={16} className="stat-icon-svg" />
              <span className="stat-label">Average Response Speed</span>
            </div>
            <span className="stat-value">{responseSpeed || "—"}</span>
          </div>

          <div className="tsl-stat-card">
            <div className="stat-header">
              <User size={16} className="stat-icon-svg" />
              <span className="stat-label">Member Since</span>
            </div>
            <span className="stat-value">{formatMemberSince(memberSince)}</span>
          </div>
        </div>

        <div className="tsl-skills-panel">
          <h4>Skills & Expertise</h4>
          <div className="tsl-skills-grid">
            {safeSkills.length ? (
              safeSkills.map((skill) => (
                <span key={skill} className="tsl-skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <span className="tsl-skill-tag">No skills added</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedTeamCard;
