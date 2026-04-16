import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./CampaignListing.css";
import "../../../Darkuser.css";


export default function CampaignListing({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [listingTypeFilter, setListingTypeFilter] =
        useState("All listing type");
    const [goalFilter, setGoalFilter] = useState("All");

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isListingTypeOpen, setIsListingTypeOpen] = useState(false);
    const [isGoalOpen, setIsGoalOpen] = useState(false);

    const statusRef = useRef(null);
    const listingTypeRef = useRef(null);
    const goalRef = useRef(null);

    const LISTING_TYPE_OPTIONS = [
        "All listing type",
        "Contracts",
        "Products",
        "Courses",
        "Webinars",
    ];
    const STATUS_OPTIONS = ["All", "Active", "Completed", "Paused"];
    const GOAL_OPTIONS = [
        "All",
        "Awareness",
        "Traffic",
        "Leads",
        "Conversions",
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                statusRef.current &&
                !statusRef.current.contains(event.target)
            ) {
                setIsStatusOpen(false);
            }
            if (
                listingTypeRef.current &&
                !listingTypeRef.current.contains(event.target)
            ) {
                setIsListingTypeOpen(false);
            }
            if (goalRef.current && !goalRef.current.contains(event.target)) {
                setIsGoalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const campaignListings = [
        {
            id: 1,
            listing: "Landing Page Design for SaaS",
            goal: "Lead",
            goalColor: "purple",
            status: "Active",
            statusColor: "green",
            spend: "$920",
            impressions: "12,000",
            clicks: "240",
            roas: "0.00x",
        },
        {
            id: 2,
            listing: "Notion Business Systems Template",
            goal: "Sales",
            goalColor: "blue",
            status: "Completed",
            statusColor: "green",
            spend: "$982",
            impressions: "98,000",
            clicks: "510",
            roas: "12.07x",
        },
    ];

    const listingsToBoost = [
        {
            id: 1,
            type: "Service",
            title: "Landing Page Design for SaaS (Figma + Webflow-ready)",
        },
        {
            id: 2,
            type: "Digital Product",
            title: "Notion Business Systems Template (Starter Pack)",
        },
        {
            id: 3,
            type: "Course",
            title: "AI Tools Course: Automations for Busy Founders",
        },
    ];

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        setShowSettings(false);
    }, []);

    return (
        <div className={`campaign-listing-layout user-page ${theme}`}>
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="campaign-listing-body">
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
                                        <button className="bc-btn draft-btn">
                                            Boost a listing
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Section */}
                            <div className="cl-filters-section">
                                <div className="cl-search-wrapper">
                                    <label className="cl-filter-label">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Campaign, listing, goals"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="cl-search-input"
                                    />
                                </div>

                                <div className="cl-filter-wrapper">
                                    <label className="cl-filter-label">
                                        Status
                                    </label>
                                    <div
                                        className={`cl-select-wrap ${isStatusOpen ? "open" : ""}`}
                                        ref={statusRef}
                                    >
                                        <button
                                            type="button"
                                            className="cl-select-button"
                                            onClick={() =>
                                                setIsStatusOpen((prev) => !prev)
                                            }
                                            aria-haspopup="listbox"
                                            aria-expanded={isStatusOpen}
                                        >
                                            <span>{statusFilter}</span>
                                            <ChevronDown size={15} />
                                        </button>

                                        {isStatusOpen && (
                                            <div
                                                className="cl-select-menu"
                                                role="listbox"
                                                aria-label="Status"
                                            >
                                                {STATUS_OPTIONS.map(
                                                    (option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            role="option"
                                                            aria-selected={
                                                                statusFilter ===
                                                                option
                                                            }
                                                            className={`cl-select-option ${statusFilter === option ? "active" : ""}`}
                                                            onClick={() => {
                                                                setStatusFilter(
                                                                    option,
                                                                );
                                                                setIsStatusOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {option}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="cl-filter-wrapper">
                                    <label className="cl-filter-label">
                                        Listing Type
                                    </label>
                                    <div
                                        className={`cl-select-wrap ${isListingTypeOpen ? "open" : ""}`}
                                        ref={listingTypeRef}
                                    >
                                        <button
                                            type="button"
                                            className="cl-select-button"
                                            onClick={() =>
                                                setIsListingTypeOpen(
                                                    (prev) => !prev,
                                                )
                                            }
                                            aria-haspopup="listbox"
                                            aria-expanded={isListingTypeOpen}
                                        >
                                            <span>{listingTypeFilter}</span>
                                            <ChevronDown size={15} />
                                        </button>

                                        {isListingTypeOpen && (
                                            <div
                                                className="cl-select-menu"
                                                role="listbox"
                                                aria-label="Listing type"
                                            >
                                                {LISTING_TYPE_OPTIONS.map(
                                                    (option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            role="option"
                                                            aria-selected={
                                                                listingTypeFilter ===
                                                                option
                                                            }
                                                            className={`cl-select-option ${listingTypeFilter === option ? "active" : ""}`}
                                                            onClick={() => {
                                                                setListingTypeFilter(
                                                                    option,
                                                                );
                                                                setIsListingTypeOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {option}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="cl-filter-wrapper">
                                    <label className="cl-filter-label">
                                        Goals
                                    </label>
                                    <div
                                        className={`cl-select-wrap ${isGoalOpen ? "open" : ""}`}
                                        ref={goalRef}
                                    >
                                        <button
                                            type="button"
                                            className="cl-select-button"
                                            onClick={() =>
                                                setIsGoalOpen((prev) => !prev)
                                            }
                                            aria-haspopup="listbox"
                                            aria-expanded={isGoalOpen}
                                        >
                                            <span>{goalFilter}</span>
                                            <ChevronDown size={15} />
                                        </button>

                                        {isGoalOpen && (
                                            <div
                                                className="cl-select-menu"
                                                role="listbox"
                                                aria-label="Goals"
                                            >
                                                {GOAL_OPTIONS.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        role="option"
                                                        aria-selected={
                                                            goalFilter ===
                                                            option
                                                        }
                                                        className={`cl-select-option ${goalFilter === option ? "active" : ""}`}
                                                        onClick={() => {
                                                            setGoalFilter(
                                                                option,
                                                            );
                                                            setIsGoalOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Listings Table */}
                            <div className="cl-table-section">
                                <table className="cl-listings-table">
                                    <thead>
                                        <tr>
                                            <th>Listing</th>
                                            <th>Goal</th>
                                            <th>Status</th>
                                            <th>Spend</th>
                                            <th>Impression</th>
                                            <th>Clicks</th>
                                            <th>RoAs</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaignListings.map((campaign) => (
                                            <tr key={campaign.id}>
                                                <td className="cl-listing-cell">
                                                    {campaign.listing}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`cl-badge cl-badge-${campaign.goalColor}`}
                                                    >
                                                        {campaign.goal}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`cl-badge cl-badge-${campaign.statusColor}`}
                                                    >
                                                        {campaign.status}
                                                    </span>
                                                </td>
                                                <td>{campaign.spend}</td>
                                                <td>{campaign.impressions}</td>
                                                <td>{campaign.clicks}</td>
                                                <td>{campaign.roas}</td>
                                                <td>
                                                    <button className="cl-view-analytics-btn">
                                                        View analytics
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Listings To Boost Section */}
                            <div className="cl-listings-section">
                                <div className="cl-listings-header">
                                    <h3 className="cl-listings-title">
                                        Listings
                                    </h3>
                                    <p className="cl-listings-breadcrumb">
                                        Entry point: My Listings → Boost
                                    </p>
                                </div>

                                <div className="cl-listings-grid">
                                    {listingsToBoost.map((listing) => (
                                        <div
                                            key={listing.id}
                                            className="cl-listing-card"
                                        >
                                            <div className="cl-card-type">
                                                {listing.type}
                                            </div>
                                            <div className="cl-card-title">
                                                {listing.title}
                                            </div>
                                            <button className="cl-card-boost-btn">
                                                Boost
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
