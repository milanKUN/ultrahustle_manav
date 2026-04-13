import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    ChevronDown,
    Copy,
    GraduationCap,
    Headphones,
    MoreHorizontal,
    MonitorPlay,
    PauseCircle,
    Pencil,
    Search,
    Trash2,
    Users,
} from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import listingCover from "../../../assets/web-design.jpg";
import "./MyCampaign.css";

const CATEGORY_TABS = [
    { id: "Products", label: "Products", icon: Box },
    { id: "Services", label: "Services", icon: Headphones },
    { id: "Courses", label: "Courses", icon: GraduationCap },
    { id: "Webinar", label: "Webinar", icon: MonitorPlay },
    { id: "Teams", label: "Teams", icon: Users },
];

const STATUS_OPTIONS = ["All Statuses", "Active", "Paused", "Draft"];

const LISTINGS = [
    {
        id: 1,
        title: "Notion Content Calendar",
        category: "Products",
        status: "Active",
        updatedAt: "Updated Feb 26, 2026",
        image: listingCover,
    },
    {
        id: 2,
        title: "Notion Content Calendar",
        category: "Products",
        status: "Paused",
        updatedAt: "Updated Feb 26, 2026",
        image: listingCover,
    },
    {
        id: 3,
        title: "Notion Content Calendar",
        category: "Products",
        status: "Draft",
        updatedAt: "Updated Feb 26, 2026",
        image: listingCover,
    },
    {
        id: 4,
        title: "Creator Strategy Sprint",
        category: "Services",
        status: "Active",
        updatedAt: "Updated Feb 24, 2026",
        image: listingCover,
    },
    {
        id: 5,
        title: "Audience Growth Masterclass",
        category: "Courses",
        status: "Paused",
        updatedAt: "Updated Feb 21, 2026",
        image: listingCover,
    },
    {
        id: 6,
        title: "Launch Funnel Live Session",
        category: "Webinar",
        status: "Draft",
        updatedAt: "Updated Feb 20, 2026",
        image: listingCover,
    },
    {
        id: 7,
        title: "Studio Ops Team",
        category: "Teams",
        status: "Active",
        updatedAt: "Updated Feb 18, 2026",
        image: listingCover,
    },
];

function PackageMark(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            {...props}
        >
            <path d="M12 3 4.75 7 12 11 19.25 7 12 3Z" />
            <path d="M4.75 7v10L12 21l7.25-4V7" />
            <path d="M12 11v10" />
        </svg>
    );
}

export default function MyListingPage({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Products");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All Statuses");
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const statusDropdownRef = useRef(null);
    const actionMenuRef = useRef(null);

    useEffect(() => {
        setSidebarOpen(false);
        setShowSettings(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target)
            ) {
                setIsStatusOpen(false);
            }
            const clickedInsideActions =
                event.target.closest(".my-listings-actionsWrap") ||
                event.target.closest(".my-listings-actions");

            if (actionMenuRef.current && !clickedInsideActions) {
                setOpenActionMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredListings = useMemo(() => {
        return LISTINGS.filter((item) => {
            const matchesTab = item.category === activeTab;
            const matchesStatus =
                status === "All Statuses" || item.status === status;
            const matchesSearch = item.title
                .toLowerCase()
                .includes(search.trim().toLowerCase());
            return matchesTab && matchesStatus && matchesSearch;
        });
    }, [activeTab, search, status]);

    return (
        <div
            className={`my-listings-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}
        >
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
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
                            className={`my-listings-main ${isDropdownOpen ? "blurred" : ""}`}
                        >
                            <section className="my-listings-shell">
                                <div className="my-listings-head">
                                    <h1 className="my-listings-title">
                                        Boost Listings
                                    </h1>
                                    <p className="my-listings-subtitle">
                                        One place to manage products, services,
                                        courses, webinars, and teams.
                                    </p>
                                </div>

                                <div className="my-listings-toolbar">
                                    <label
                                        className="my-listings-search"
                                        aria-label="Search product"
                                    >
                                        <Search size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search product"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                        />
                                    </label>

                                    <div
                                        className={`my-listings-selectWrap ${isStatusOpen ? "open" : ""}`}
                                        aria-label="Filter by status"
                                        ref={statusDropdownRef}
                                    >
                                        <button
                                            type="button"
                                            className="my-listings-selectButton"
                                            aria-haspopup="listbox"
                                            aria-expanded={isStatusOpen}
                                            onClick={() =>
                                                setIsStatusOpen((prev) => !prev)
                                            }
                                        >
                                            <span>{status}</span>
                                            <ChevronDown size={16} />
                                        </button>

                                        {isStatusOpen && (
                                            <div
                                                className="my-listings-selectMenu"
                                                role="listbox"
                                                aria-label="Status options"
                                            >
                                                {STATUS_OPTIONS.map(
                                                    (option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            role="option"
                                                            aria-selected={
                                                                status ===
                                                                option
                                                            }
                                                            className={`my-listings-selectOption ${status === option ? "active" : ""}`}
                                                            onClick={() => {
                                                                setStatus(
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

                                <div
                                    className="my-listings-tabs"
                                    role="tablist"
                                    aria-label="Listing categories"
                                >
                                    {CATEGORY_TABS.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                role="tab"
                                                aria-selected={
                                                    activeTab === tab.id
                                                }
                                                className={`my-listings-tab ${activeTab === tab.id ? "active" : ""}`}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                            >
                                                <Icon size={14} />
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="my-listings-grid">
                                    {filteredListings.map((listing) => (
                                        <article
                                            key={listing.id}
                                            className="my-listings-card"
                                        >
                                            <div className="my-listings-cardImage">
                                                <img
                                                    src={listing.image}
                                                    alt={listing.title}
                                                />
                                            </div>

                                            <div className="my-listings-cardBody">
                                                <div className="my-listings-cardTop">
                                                    <div className="my-listings-cardMeta">
                                                        <span className="my-listings-cardIcon">
                                                            <PackageMark
                                                                width={14}
                                                                height={14}
                                                            />
                                                        </span>
                                                        <div>
                                                            <h2>
                                                                {listing.title}
                                                            </h2>
                                                            <p>
                                                                $29 |{" "}
                                                                {
                                                                    listing.updatedAt
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="my-listings-actionsWrap"
                                                        ref={
                                                            openActionMenu ===
                                                            listing.id
                                                                ? actionMenuRef
                                                                : null
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            className={`my-listings-menu ${openActionMenu === listing.id ? "active" : ""}`}
                                                            aria-label="More options"
                                                            onClick={() =>
                                                                setOpenActionMenu(
                                                                    (prev) =>
                                                                        prev ===
                                                                        listing.id
                                                                            ? null
                                                                            : listing.id,
                                                                )
                                                            }
                                                        >
                                                            <MoreHorizontal
                                                                size={16}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                {openActionMenu ===
                                                    listing.id && (
                                                    <div className="my-listings-actions">
                                                        <div className="my-listings-actionsHeader">
                                                            Actions
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="my-listings-actionItem"
                                                        >
                                                            <Pencil size={18} />
                                                            <span>Edit</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="my-listings-actionItem"
                                                        >
                                                            <PauseCircle
                                                                size={18}
                                                            />
                                                            <span>Pause</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="my-listings-actionItem"
                                                        >
                                                            <Copy size={18} />
                                                            <span>
                                                                Duplicate
                                                            </span>
                                                        </button>

                                                        <div className="my-listings-actionsDivider" />

                                                        <button
                                                            type="button"
                                                            className="my-listings-actionItem delete"
                                                        >
                                                            <Trash2 size={18} />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="my-listings-cardFooter">
                                                    <span
                                                        className={`my-listings-status my-listings-status-${listing.status.toLowerCase()}`}
                                                    >
                                                        {listing.status}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="my-listings-boost-btn"
                                                        aria-label="Boost listing"
                                                    >
                                                        Boost
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {filteredListings.length === 0 && (
                                    <div className="my-listings-empty">
                                        No listings match your current search
                                        and filter.
                                    </div>
                                )}
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
