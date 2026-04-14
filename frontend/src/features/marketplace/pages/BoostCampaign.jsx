import React, { useState, useEffect } from "react";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./BoostCampaign.css";
import "../../../Darkuser.css";

export default function BoostCampaign({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [activeGoal, setActiveGoal] = useState("views");
    const [step, setStep] = useState(1);
    const [audienceType, setAudienceType] = useState("smart");
    const [placementType, setPlacementType] = useState("auto");
    const [dailyBudget, setDailyBudget] = useState("214");
    const [selectedDuration, setSelectedDuration] = useState("7 days");
    const [selectedBoostType, setSelectedBoostType] = useState("starter");
    const [campaignName, setCampaignName] = useState(
        "Landing Page Design fo - Boost",
    );
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [geographyInput, setGeographyInput] = useState("");
    const [intrestedTag, setIntrestedTag] = useState("");
    const [selectedGeographies, setSelectedGeographies] = useState([
        "India",
        "UAE",
        "UK",
    ]);
    const [selectedInterestTags, setSelectedInterestTags] = useState([
        "Design",
        "Development",
        "Marketing",
        "AI tools",
    ]);

    const steps = [
        { id: 1, name: "Choose Goal", desc: "Objective" },
        { id: 2, name: "Audience & Placement", desc: "Who + Where" },
        { id: 3, name: "Budget & Duration", desc: "Spend" },
        { id: 4, name: "Review & launch", desc: "Confirm" },
    ];

    // const selectedInterestTags = ["Design", "Development", "Marketing", "AI tools"];
    const trafficSourcePreferences = [
        "Marketplace feed",
        "Search results",
        "Recommendations",
        "Related listings",
        "Category pages",
    ];
    const manualPlacementOptions = [
        "Marketplace feed",
        "Push surfaces (future)",
        "Home recommendations",
        "Search results",
        "Dashboard Recommendations",
        "Related listings",
        "Category pages",
        "Email Recommendations (future)",
    ];
    const deviceOptions = ["All Devices", "Mobile", "Desktop"];
    const durationOptions = [
        "3 days",
        "5 days",
        "7 days",
        "14 days",
        "28 days",
        "Custom end",
    ];

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const addGeographyTag = (rawValue) => {
        const value = rawValue.trim();
        if (!value) return;

        setSelectedGeographies((prev) => {
            const exists = prev.some(
                (item) => item.toLowerCase() === value.toLowerCase(),
            );
            if (exists) return prev;
            return [...prev, value];
        });
        setGeographyInput("");
    };

    const addIntrestedTag = (rawValue) => {
        const value = rawValue.trim();
        if (!value) return;

        setSelectedInterestTags((prev) => {
            const exists = prev.some(
                (item) => item.toLowerCase() === value.toLowerCase(),
            );
            if (exists) return prev;
            return [...prev, value];
        });
        setIntrestedTag("");
    };

    const removeGeographyTag = (tagToRemove) => {
        setSelectedGeographies((prev) =>
            prev.filter((tag) => tag !== tagToRemove),
        );
    };

    const removeInterestTag = (tagToRemove) => {
        setSelectedInterestTags((prev) =>
            prev.filter((tag) => tag !== tagToRemove),
        );
    };

    const handleGeographyKeyDown = (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addGeographyTag(geographyInput);
        }
    };

    const handleInterestTagKeyDown = (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addIntrestedTag(intrestedTag);
        }
    };

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        setShowSettings(false);
    }, []);

    return (
        <div className={`boost-campaign-layout-wrapper user-page ${theme}`}>
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="boost-campaign-layout-body">
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

                <div className="boost-campaign-main-content">
                    <div className="boost-campaign-scroll-area">
                        <div className="boost-campaign-container">
                            <div className="bc-header-section">
                                <div className="bc-header-left">
                                    <h1 className="bc-title">
                                        Boost Campaigns
                                    </h1>
                                    <p className="bc-subtitle">
                                        All boost across your listings.
                                    </p>
                                </div>
                                <div className="bc-header-right">
                                    <div className="bc-actions top-actions">
                                        <span className="bc-action-text pb-text">
                                            Boost Campaigns
                                        </span>
                                        <button className="bc-btn primary-btn">
                                            New Boost
                                        </button>
                                    </div>
                                    <div className="bc-actions bottom-actions">
                                        <span className="bc-action-text">
                                            Back to Listing
                                        </span>
                                        <button className="bc-btn draft-btn">
                                            Save as Draft
                                        </button>
                                        <span className="bc-action-text">
                                            Help / Learn More
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bc-card">
                                <div className="bc-card-left">
                                    <div className="bc-img-placeholder">
                                        <div className="bc-img-overlay">
                                            <span className="bc-img-text">
                                                SaaS Landing
                                            </span>
                                            <div className="bc-img-line"></div>
                                            <div className="bc-img-line-long"></div>
                                            <div className="bc-img-subtext">
                                                SaaS Landing
                                            </div>
                                            <div className="bc-img-pill"></div>
                                            <div className="bc-img-circle"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bc-card-right">
                                    <div className="bc-card-title-row">
                                        <h2 className="bc-card-title">
                                            Landing Page Design for Saas (Figma
                                            + Webflow-ready)
                                        </h2>
                                        <span className="bc-badge">
                                            Publised
                                        </span>
                                    </div>

                                    <div className="bc-card-meta">
                                        <span className="bc-meta-item">
                                            Service
                                        </span>
                                        <span className="bc-meta-item">
                                            Design / UI/UX
                                        </span>
                                        <span className="bc-meta-item">
                                            $4,999
                                        </span>
                                        <span className="bc-meta-item">
                                            4.8
                                        </span>
                                    </div>

                                    <div className="bc-stats-grid">
                                        <div className="bc-stat-box">
                                            <span className="bc-stat-label">
                                                Views (30d)
                                            </span>
                                            <span className="bc-stat-value">
                                                280
                                            </span>
                                        </div>
                                        <div className="bc-stat-box">
                                            <span className="bc-stat-label">
                                                Clicks
                                            </span>
                                            <span className="bc-stat-value">
                                                18
                                            </span>
                                        </div>
                                        <div className="bc-stat-box">
                                            <span className="bc-stat-label">
                                                Leads / Orders
                                            </span>
                                            <span className="bc-stat-value">
                                                2
                                            </span>
                                        </div>
                                        <div className="bc-stat-box">
                                            <span className="bc-stat-label">
                                                Conv. Rate
                                            </span>
                                            <span className="bc-stat-value">
                                                1.8%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bc-card-footer">
                                        <span className="bc-badge quality-badge">
                                            Quality: 75/100
                                        </span>
                                        <span className="bc-footer-text">
                                            Used for estimate (thumbnail + trust
                                            + conversion).
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bc-setup-card">
                                <div className="bc-setup-header">
                                    <h3 className="bc-setup-title">
                                        Boost Setup
                                    </h3>
                                    <p className="bc-setup-subtitle">
                                        Simple 4-step flow - faster than
                                        enterprise ad managers
                                    </p>
                                </div>

                                <div className="bc-steps-strip">
                                    {steps.map((stepItem) => {
                                        const isActive = step === stepItem.id;
                                        const isCompleted = step > stepItem.id;

                                        return (
                                            <div
                                                key={stepItem.id}
                                                className={`bc-step-strip-item ${isActive ? "active" : isCompleted ? "completed" : ""}`}
                                            >
                                                <div className="bc-step-strip-icon">
                                                    {stepItem.id}
                                                </div>
                                                <div className="bc-step-strip-info">
                                                    <div className="bc-step-strip-name">
                                                        {stepItem.name}
                                                    </div>
                                                    <div className="bc-step-strip-desc">
                                                        {stepItem.desc}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {step === 1 && (
                                    <div className="bc-step-content">
                                        <h4 className="bc-content-title">
                                            What do you want this boost to
                                            achieve?
                                        </h4>
                                        <p className="bc-content-subtitle">
                                            Goal options are filtered by listing
                                            type.
                                        </p>

                                        <div className="bc-goals-grid">
                                            <div
                                                className={`bc-goal-card ${activeGoal === "views" ? "active" : ""}`}
                                                onClick={() =>
                                                    setActiveGoal("views")
                                                }
                                            >
                                                <div className="bc-goal-title">
                                                    Get More Views
                                                </div>
                                                <div className="bc-goal-desc">
                                                    Optimizes for inquires &amp;
                                                    messages
                                                </div>
                                            </div>
                                            <div
                                                className={`bc-goal-card ${activeGoal === "clicks" ? "active" : ""}`}
                                                onClick={() =>
                                                    setActiveGoal("clicks")
                                                }
                                            >
                                                <div className="bc-goal-title">
                                                    Get More Clicks
                                                </div>
                                                <div className="bc-goal-desc">
                                                    Optimizes for listing opens
                                                    &amp; CTR
                                                </div>
                                            </div>
                                            <div
                                                className={`bc-goal-card ${activeGoal === "leads" ? "active" : ""}`}
                                                onClick={() =>
                                                    setActiveGoal("leads")
                                                }
                                            >
                                                <div className="bc-goal-title">
                                                    Get More Leads
                                                </div>
                                                <div className="bc-goal-desc">
                                                    Optimizes for inquires &amp;
                                                    messages
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bc-recommendation-box">
                                            <div className="bc-rec-label">
                                                Recommended for this listing
                                            </div>
                                            <div className="bc-rec-text">
                                                Because awareness is low, Views
                                                is recommended.
                                            </div>
                                            <div className="bc-rec-badges">
                                                <span className="bc-rec-badge lime">
                                                    Suggested views
                                                </span>
                                                <span className="bc-rec-badge blue">
                                                    Allowed: Views, Clicks,
                                                    Leads
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="bc-step-content">
                                        <div className="bc-step-header-row">
                                            <div>
                                                <h4 className="bc-content-title">
                                                    Who should see this boost?
                                                </h4>
                                                <p className="bc-content-subtitle">
                                                    Keep it simple. Smart is
                                                    recommended.
                                                </p>
                                            </div>
                                            <div className="bc-toggle-group">
                                                <button
                                                    className={`bc-toggle-btn ${audienceType === "smart" ? "active" : ""}`}
                                                    onClick={() =>
                                                        setAudienceType("smart")
                                                    }
                                                >
                                                    Smart audience
                                                </button>
                                                <button
                                                    className={`bc-toggle-btn ${audienceType === "manual" ? "active" : ""}`}
                                                    onClick={() =>
                                                        setAudienceType(
                                                            "manual",
                                                        )
                                                    }
                                                >
                                                    Manual audience
                                                </button>
                                            </div>
                                        </div>

                                        {audienceType === "manual" ? (
                                            <div className="bc-manual-audience-layout">
                                                <div className="bc-manual-audience-main">
                                                    <div className="bc-manual-field">
                                                        <label className="bc-manual-label">
                                                            Geography
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Geography"
                                                            value={
                                                                geographyInput
                                                            }
                                                            onChange={(event) =>
                                                                setGeographyInput(
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            onKeyDown={
                                                                handleGeographyKeyDown
                                                            }
                                                            onBlur={() =>
                                                                addGeographyTag(
                                                                    geographyInput,
                                                                )
                                                            }
                                                            className="bc-manual-input"
                                                        />
                                                        <div className="bc-chip-row">
                                                            {selectedGeographies.map(
                                                                (tag) => (
                                                                    <span
                                                                        key={
                                                                            tag
                                                                        }
                                                                        className="bc-manual-chip"
                                                                    >
                                                                        {tag}
                                                                        <button
                                                                            type="button"
                                                                            className="bc-manual-chip-close"
                                                                            onClick={() =>
                                                                                removeGeographyTag(
                                                                                    tag,
                                                                                )
                                                                            }
                                                                            aria-label={`Remove ${tag}`}
                                                                        >
                                                                            x
                                                                        </button>
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="bc-manual-field">
                                                        <label className="bc-manual-label">
                                                            Interest tags
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Search Tools & Technologies"
                                                            value={intrestedTag}
                                                            onChange={(event) =>
                                                                setIntrestedTag(
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            onKeyDown={
                                                                handleInterestTagKeyDown
                                                            }
                                                            onBlur={() =>
                                                                addIntrestedTag(
                                                                    intrestedTag,
                                                                )
                                                            }
                                                            className="bc-manual-input"
                                                        />
                                                        <p className="bc-manual-note">
                                                            You can add 10 more
                                                            tools &amp;
                                                            technologies
                                                        </p>
                                                        <div className="bc-chip-row">
                                                            {selectedInterestTags.map(
                                                                (tag) => (
                                                                    <span
                                                                        key={
                                                                            tag
                                                                        }
                                                                        className="bc-manual-chip"
                                                                    >
                                                                        {tag}
                                                                        <span
                                                                            onClick={() =>
                                                                                removeInterestTag(
                                                                                    tag,
                                                                                )
                                                                            }
                                                                            aria-label={`Remove ${tag}`}
                                                                            className="bc-manual-chip-close"
                                                                        >
                                                                            x
                                                                        </span>
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="bc-manual-field">
                                                        <label className="bc-manual-label">
                                                            User type
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Select"
                                                            readOnly
                                                            className="bc-manual-input muted"
                                                        />
                                                    </div>

                                                    <div className="bc-manual-field">
                                                        <label className="bc-manual-label">
                                                            Budget intent
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Select"
                                                            readOnly
                                                            className="bc-manual-input muted"
                                                        />
                                                    </div>

                                                    <div className="bc-manual-field">
                                                        <label className="bc-manual-label">
                                                            Traffic source
                                                            preference
                                                        </label>
                                                        <div className="bc-manual-panel">
                                                            <div className="bc-chip-row !mt-1">
                                                                {trafficSourcePreferences.map(
                                                                    (tag) => (
                                                                        <span
                                                                            key={
                                                                                tag
                                                                            }
                                                                            className="bc-mini-chip"
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bc-manual-field">
                                                        <label className="bc-manual-label bc-manual-label-device">
                                                            Device
                                                        </label>
                                                        <div className="bc-manual-panel bc-manual-panel-tight">
                                                            <div className="bc-chip-row">
                                                                {deviceOptions.map(
                                                                    (
                                                                        device,
                                                                        index,
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                device
                                                                            }
                                                                            type="button"
                                                                            className={`bc-mini-chip bc-mini-chip-button ${index === 0 ? "active" : ""}`}
                                                                        >
                                                                            {
                                                                                device
                                                                            }
                                                                        </button>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bc-manual-audience-side">
                                                    <div className="bc-manual-side-card">
                                                        <h5 className="bc-manual-side-title">
                                                            Audience size
                                                            indicator
                                                        </h5>
                                                        <div className="bc-manual-progress">
                                                            <div className="bc-manual-progress-fill" />
                                                        </div>
                                                        <p className="bc-manual-side-text">
                                                            Estimated breadth:
                                                            52 / 100
                                                        </p>
                                                        
                                                        <p className="bc-manual-side-note">
                                                            Audience breadth
                                                            affects delivery and
                                                            estimates.
                                                        </p>
                                                    </div>

                                                    <div className="bc-manual-side-card">
                                                        <h5 className="bc-manual-side-title">
                                                            Where should your
                                                            listing appear?
                                                        </h5>
                                                        <p className="bc-manual-side-text">
                                                            Auto placement
                                                            usually performs
                                                            best.
                                                        </p>

                                                        <div className="bc-manual-side-section">
                                                            <div className="bc-manual-section-title">
                                                                Placements
                                                            </div>
                                                            <div className="bc-chip-row">
                                                                {manualPlacementOptions.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                option
                                                                            }
                                                                            type="button"
                                                                            className="bc-mini-chip bc-mini-chip-button"
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </button>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="bc-ai-targeting-container">
                                                    <div className="bc-ai-label">
                                                        AI - selected targeting
                                                        summary
                                                    </div>
                                                    <div className="bc-ai-grid">
                                                        <div className="bc-ai-card">
                                                            <div className="bc-ai-card-label">
                                                                Likely buyer
                                                                type
                                                            </div>
                                                            <div className="bc-ai-card-value">
                                                                Startup founders
                                                            </div>
                                                        </div>
                                                        <div className="bc-ai-card">
                                                            <div className="bc-ai-card-label">
                                                                Interest cluster
                                                            </div>
                                                            <div className="bc-ai-card-value">
                                                                Design + growth
                                                            </div>
                                                        </div>
                                                        <div className="bc-ai-card">
                                                            <div className="bc-ai-card-label">
                                                                Geography focus
                                                            </div>
                                                            <div className="bc-ai-card-value">
                                                                India, UAE, US
                                                            </div>
                                                        </div>
                                                        <div className="bc-ai-card">
                                                            <div className="bc-ai-card-label">
                                                                Behavior segment
                                                            </div>
                                                            <div className="bc-ai-card-value">
                                                                Actively
                                                                browsing related
                                                                listings
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bc-step-header-row mt-15">
                                                    <p className="bc-content-subtitle mb-0">
                                                        Audience breadth affects
                                                        delivery and estimates.
                                                    </p>
                                                    <div className="bc-toggle-group small">
                                                        <button
                                                            className={`bc-toggle-btn ${placementType === "auto" ? "active" : ""}`}
                                                            onClick={() =>
                                                                setPlacementType(
                                                                    "auto",
                                                                )
                                                            }
                                                        >
                                                            Auto
                                                        </button>
                                                        <button
                                                            className={`bc-toggle-btn ${placementType === "manual" ? "active" : ""}`}
                                                            onClick={() =>
                                                                setPlacementType(
                                                                    "manual",
                                                                )
                                                            }
                                                        >
                                                            Manual
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="bc-step-header-row mt-25 block">
                                                    <h4 className="bc-content-title">
                                                        Where should your
                                                        listing appear?
                                                    </h4>
                                                    <p className="bc-content-subtitle">
                                                        Auto placement usually
                                                        performs best.
                                                    </p>
                                                </div>

                                                <div className="bc-placement-card">
                                                    <h5 className="bc-placement-title">
                                                        Auto Placement
                                                    </h5>
                                                    <p className="bc-placement-desc">
                                                        We'll automatically
                                                        choose the best surfaces
                                                        for your goal.
                                                    </p>
                                                    <div className="bc-placement-pills">
                                                        <span className="bc-blue-pill">
                                                            Marketplace feed
                                                        </span>
                                                        <span className="bc-blue-pill">
                                                            Recommendations
                                                        </span>
                                                        <span className="bc-blue-pill">
                                                            Search results
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="bc-step-content bc-step3-content"> 
                                        <div className="bc-step3-grid">
                                            <div className="bc-step3-field">
                                                <div className="bc-step3-label-row">
                                                    <label className="bc-step3-label">
                                                        Daily Budget
                                                    </label>
                                                    <span className="bc-step3-hint">
                                                        Example: $10/day, $20/day
                                                    </span>
                                                </div>
                                                <div className="bc-step3-budget-wrap">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={dailyBudget}
                                                        onChange={(event) =>
                                                            setDailyBudget(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="bc-step3-budget-input"
                                                    />
                                                    <span className="bc-step3-budget-unit">
                                                        INR / day
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bc-step3-field">
                                                <label className="bc-step3-label">
                                                    Duration
                                                </label>
                                                <div className="bc-step3-duration-options">
                                                    {durationOptions.map(
                                                        (option) => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                className={`bc-step3-duration-chip ${selectedDuration === option ? "active" : ""}`}
                                                                onClick={() =>
                                                                    setSelectedDuration(
                                                                        option,
                                                                    )
                                                                }
                                                            >
                                                                {option}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                                <div className="bc-step3-end-date">
                                                    Ends on
                                                    <span className="bc-step3-end-date-value">
                                                        2026-03-23
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bc-step3-boost-grid">
                                            <button
                                                type="button"
                                                className={`bc-step3-boost-card ${selectedBoostType === "starter" ? "active" : ""}`}
                                                onClick={() =>
                                                    setSelectedBoostType(
                                                        "starter",
                                                    )
                                                }
                                            >
                                                <span className="bc-step3-boost-title">
                                                    Starter Boost
                                                </span>
                                                <span className="bc-step3-boost-subtitle">
                                                    Good for testing demand
                                                </span>
                                                <span className="bc-step3-boost-price">
                                                    $ 100 / day - 3 days
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                className={`bc-step3-boost-card ${selectedBoostType === "growth" ? "active" : ""}`}
                                                onClick={() =>
                                                    setSelectedBoostType(
                                                        "growth",
                                                    )
                                                }
                                            >
                                                <span className="bc-step3-boost-title">
                                                    Growth Boost
                                                </span>
                                                <span className="bc-step3-boost-subtitle">
                                                    Best for steady reach and
                                                    clicks
                                                </span>
                                                <span className="bc-step3-boost-price">
                                                    $ 100 / day - 3 days
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                className={`bc-step3-boost-card ${selectedBoostType === "conversion" ? "active" : ""}`}
                                                onClick={() =>
                                                    setSelectedBoostType(
                                                        "conversion",
                                                    )
                                                }
                                            >
                                                <span className="bc-step3-boost-title">
                                                    Conversion Boost
                                                </span>
                                                <span className="bc-step3-boost-subtitle">
                                                    Best for optimized lead or
                                                    sales
                                                </span>
                                                <span className="bc-step3-boost-price">
                                                    $ 100 / day - 3 days
                                                </span>
                                            </button>
                                        </div>

                                        <div className="bc-step3-estimated-spend">
                                            <div className="bc-step3-estimated-label">
                                                Estimated spend
                                            </div>
                                            <div className="bc-step3-estimated-value">
                                                $ 1,498
                                            </div>
                                            <div className="bc-step3-estimated-note">
                                                (Daily budget * duration)
                                            </div>
                                        </div>

                                        <div className="bc-step3-results-card">
                                            <div className="bc-step3-results-title">
                                                Estimated results
                                            </div>
                                            <div className="bc-step3-results-grid">
                                                <div className="bc-step3-result-item">
                                                    <span className="bc-step3-result-label">
                                                        Reach
                                                    </span>
                                                    <span className="bc-step3-result-value">
                                                        5,262 - 8,770
                                                    </span>
                                                </div>
                                                <div className="bc-step3-result-item">
                                                    <span className="bc-step3-result-label">
                                                        Clicks
                                                    </span>
                                                    <span className="bc-step3-result-value">
                                                        121 - 202
                                                    </span>
                                                </div>
                                                <div className="bc-step3-result-item">
                                                    <span className="bc-step3-result-label">
                                                        Reach
                                                    </span>
                                                    <span className="bc-step3-result-value">
                                                        1 - 2
                                                    </span>
                                                </div>
                                                <div className="bc-step3-result-item">
                                                    <span className="bc-step3-result-label">
                                                        Cost / Click
                                                    </span>
                                                    <span className="bc-step3-result-value">
                                                        $ 7 - $ 12
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="bc-step3-results-note">
                                                Estimates depends on listing
                                                quality, category competition,
                                                goal, audience size, and
                                                delivery.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="bc-step-content bc-s4-root">
                                        <div className="bc-s4-campaign">
                                            <label className="bc-s4-label">
                                                Campaign name
                                            </label>
                                            <div className="bc-s4-name-row">
                                                <input
                                                    type="text"
                                                    value={campaignName}
                                                    onChange={(event) =>
                                                        setCampaignName(
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="bc-s4-name-input"
                                                />
                                                <span className="bc-s4-optional">
                                                    Optional
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bc-s4-grid">
                                            <section className="bc-s4-review">
                                                <h5 className="bc-s4-title">
                                                    Review summary
                                                </h5>
                                                <div className="bc-s4-listings">
                                                    {Array.from({
                                                        length: 6,
                                                    }).map((_, index) => (
                                                        <article
                                                            key={index}
                                                            className="bc-s4-listing"
                                                        >
                                                            <span className="bc-s4-kicker">
                                                                Listing
                                                            </span>
                                                            <span className="bc-s4-listing-name">
                                                                Landing Page
                                                                Design for Saas
                                                                (Figma + Webflow
                                                                - ready)
                                                            </span>
                                                            <span className="bc-s4-meta">
                                                                Service
                                                            </span>
                                                        </article>
                                                    ))}
                                                </div>

                                                <div className="bc-s4-results">
                                                    <h6 className="bc-s4-title">
                                                        Estimated results
                                                    </h6>
                                                    <div className="bc-s4-results-grid">
                                                        <div className="bc-s4-result">
                                                            <span>Reach</span>
                                                            <strong>
                                                                5,262 - 8,770
                                                            </strong>
                                                        </div>
                                                        <div className="bc-s4-result">
                                                            <span>Clicks</span>
                                                            <strong>
                                                                121 - 202
                                                            </strong>
                                                        </div>
                                                        <div className="bc-s4-result">
                                                            <span>Reach</span>
                                                            <strong>1 - 2</strong>
                                                        </div>
                                                        <div className="bc-s4-result">
                                                            <span>
                                                                Cost / Click
                                                            </span>
                                                            <strong>
                                                                $ 7 - $ 12
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    <p className="bc-s4-note">
                                                        Estimates depends on
                                                        listing quality,
                                                        category competition,
                                                        goal, audience size, and
                                                        delivery.
                                                    </p>
                                                </div>
                                            </section>

                                            <aside className="bc-s4-side">
                                                <section className="bc-s4-panel">
                                                    <h5 className="bc-s4-title">
                                                        Terms
                                                    </h5>
                                                    <p className="bc-s4-note">
                                                        Boost increase
                                                        visibility but does not
                                                        guarantee orders.
                                                    </p>
                                                    <label className="bc-s4-check">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                termsAccepted
                                                            }
                                                            onChange={(event) =>
                                                                setTermsAccepted(
                                                                    event.target
                                                                        .checked,
                                                                )
                                                            }
                                                        />
                                                        <span>
                                                            I Understand boost
                                                            increase visibility
                                                            but does not
                                                            guarantee tee orders
                                                            or revenue.
                                                        </span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        className="bc-s4-btn-launch"
                                                        disabled={
                                                            !termsAccepted
                                                        }
                                                    >
                                                        Launch Boost
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bc-s4-btn-save"
                                                    >
                                                        Save as Draft
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bc-s4-btn-link"
                                                    >
                                                        Edit Setup
                                                    </button>
                                                </section>

                                                <section className="bc-s4-panel">
                                                    <h5 className="bc-s4-title">
                                                        Status model
                                                    </h5>
                                                    <p className="bc-s4-note">
                                                        Each campaign has one
                                                        clear status
                                                    </p>
                                                    <div className="bc-s4-status">
                                                        <span className="bc-s4-chip bc-s4-chip-gray">
                                                            Draft
                                                        </span>
                                                        <span className="bc-s4-chip bc-s4-chip-blue">
                                                            Paused
                                                        </span>
                                                        <span className="bc-s4-chip bc-s4-chip-lime">
                                                            Active
                                                        </span>
                                                        <span className="bc-s4-chip bc-s4-chip-yellow">
                                                            Scheduled
                                                        </span>
                                                        <span className="bc-s4-chip bc-s4-chip-red">
                                                            Completed
                                                        </span>
                                                    </div>
                                                </section>
                                            </aside>
                                        </div>

                                        <section className="bc-s4-payment">
                                            <h5 className="bc-s4-title">
                                                Payment
                                            </h5>
                                            <p className="bc-s4-note">
                                                Mock payment options (wire to
                                                wallet + UPI + saved methods).
                                            </p>
                                            <div className="bc-s4-payment-grid">
                                                <button
                                                    type="button"
                                                    className="bc-s4-pay-btn"
                                                >
                                                    <span>Pay from wallet</span>
                                                    <small>Placeholder</small>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bc-s4-pay-btn"
                                                >
                                                    <span>Pay from wallet</span>
                                                    <small>Placeholder</small>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bc-s4-pay-btn"
                                                >
                                                    <span>Pay from wallet</span>
                                                    <small>Placeholder</small>
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                )}


                                <div className="bc-setup-footer mt-2">
                                    {step > 1 ? (
                                        <button
                                            className="bc-nav-link"
                                            onClick={handleBack}
                                        >
                                            &larr; Back
                                        </button>
                                    ) : (
                                        <span />
                                    )}
                                    <div className="bc-footer-right">
                                        <span className="bc-step-indicator">
                                            Step {step} of 4
                                        </span>
                                        <button
                                            className="bc-btn black-btn"
                                            onClick={handleNext}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
