import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, HelpCircle, Star } from "lucide-react";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import listingCover from "../../../assets/web-design.jpg";
import "../../../Darkuser.css";
import "./BoostCampaign.css";

export default function BoostCampaign({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
        setShowSettings(false);
    }, []);

    return (
        <div
            className={`boost-campaign-page user-page ${theme || "light"} min-h-screen`}
        >
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
                onDropdownChange={setIsDropdownOpen}
            />

            <div className="pt-[85px] flex relative z-10 w-full">
                <Sidebar
                    expanded={sidebarOpen}
                    setExpanded={setSidebarOpen}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    activeSetting={activeSetting}
                    onSectionChange={setActiveSetting}
                    theme={theme}
                    setTheme={setTheme}
                />

                <div className="relative flex-1 min-w-0 overflow-hidden w-full">
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)] w-full">
                        <main
                            className={`boost-campaign-main ${isDropdownOpen ? "blurred" : ""}`}
                        >
                            {/* Header Section */}
                            <div className="boost-campaign-header-container">
                                <div className="boost-campaign-left">
                                    <h1 className="boost-campaign-title">
                                        Boost Listings
                                    </h1>
                                    <p className="boost-campaign-subtitle">
                                        All boost across your listings.
                                    </p>
                                </div>

                                <div className="boost-campaign-right">
                                    <div className="boost-campaign-tabs-row">
                                        <span className="boost-campaign-tab-text">
                                            Boost Campaigns
                                        </span>
                                        <button className="boost-campaign-new-btn">
                                            New Boost
                                        </button>
                                    </div>

                                    <div className="boost-campaign-actions-row">
                                        <button className="boost-campaign-action-btn">
                                            <ArrowLeft size={16} />
                                            <span>Back to Listing</span>
                                        </button>
                                        <button className="boost-campaign-action-btn save-draft">
                                            <Save size={16} />
                                            <span>Save as Draft</span>
                                        </button>
                                        <button className="boost-campaign-action-btn">
                                            <HelpCircle size={16} />
                                            <span>Help / Learn More</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Card */}
                            <div className="boost-campaign-card-wrapper">
                                <div className="boost-campaign-card">
                                    {/* Image Section */}
                                    <div className="boost-campaign-card-image">
                                        <img
                                            src={listingCover}
                                            alt="SaaS Landing"
                                        />
                                        <span className="boost-campaign-image-label">
                                            SaaS Landing
                                        </span>
                                    </div>

                                    {/* Content Section */}
                                    <div className="boost-campaign-card-content">
                                        {/* Title and Status */}
                                        <div className="boost-campaign-card-header">
                                            <h2 className="boost-campaign-card-title">
                                                Landing Page Design for Saas
                                                (Figma + Webflow-ready)
                                            </h2>
                                            <span className="boost-campaign-status-badge">
                                                Paused
                                            </span>
                                        </div>

                                        {/* Meta Info */}
                                        <div className="boost-campaign-card-meta">
                                            <span className="boost-campaign-category">
                                                Service
                                            </span>
                                            <span className="boost-campaign-category">
                                                Design / UI/UX
                                            </span>
                                            <span className="boost-campaign-price">
                                                $4,999
                                            </span>
                                            <span className="boost-campaign-rating">
                                                <Star
                                                    size={14}
                                                    fill="#CEFF1B"
                                                    color="#CEFF1B"
                                                />
                                                4.8
                                            </span>
                                        </div>

                                        {/* Stats Section */}
                                        <div className="boost-campaign-stats">
                                            <div className="boost-campaign-stat-item">
                                                <span className="stat-label">
                                                    Views
                                                </span>
                                                <span className="stat-value">
                                                    280
                                                </span>
                                            </div>
                                            <div className="boost-campaign-stat-item">
                                                <span className="stat-label">
                                                    Leads / Orders
                                                </span>
                                                <span className="stat-value">
                                                    18
                                                </span>
                                            </div>
                                            <div className="boost-campaign-stat-item">
                                                <span className="stat-label">
                                                    Clicks
                                                </span>
                                                <span className="stat-value">
                                                    2
                                                </span>
                                            </div>
                                            <div className="boost-campaign-stat-item">
                                                <span className="stat-label">
                                                    Click Rate
                                                </span>
                                                <span className="stat-value">
                                                    1.8%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quality and Description */}
                                        <div className="boost-campaign-footer-info">
                                            <div className="boost-campaign-quality">
                                                <span className="quality-badge">
                                                    Quality: 75/100
                                                </span>
                                                <span className="quality-description">
                                                    Used for estimate (thumbnail
                                                    + trust + conversion).
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <MobileBottomNav theme={theme} />
        </div>
    );
}
