import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./MyListings.css";
import "../../../Darkuser.css";
import { getMyListings } from "../api/listingApi";

// SVG Icons for tabs and cards
const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
    </svg>
);

const HeadsetsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
    </svg>
);

const PlayCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
);

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const DotsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="10" x2="10" y1="15" y2="9" />
        <line x1="14" x2="14" y1="15" y2="9" />
    </svg>
);

const DuplicateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);

export default function MyListings({ theme = "light", setTheme }) {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : true;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("");
    const [activeTab, setActiveTab] = useState("Products");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [openStatusDropdown, setOpenStatusDropdown] = useState(false);

    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setIsLoading(true);
                const res = await getMyListings();
                setListings(res?.listings || []);
            } catch (error) {
                console.error("Failed to fetch listings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdown(null);
            setOpenStatusDropdown(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleSectionChange = (id) => {
        setActiveSetting(id);
    };

    const tabs = [
        { name: "Products", icon: <PackageIcon /> },
        { name: "Services", icon: <HeadsetsIcon /> },
        { name: "Courses", icon: <PlayCircleIcon /> },
        { name: "Webinar", icon: <VideoIcon /> },
        { name: "Teams", icon: <UsersIcon /> },
    ];

    const typeMap = {
        'digital_product': 'Products',
        'service': 'Services',
        'course': 'Courses',
        'webinar': 'Webinar'
    };

    const filteredListings = listings.filter(l => {
        const tabName = typeMap[l.listing_type] || 'Other';
        if (activeTab === 'Teams') return false; 
        
        const matchesTab = tabName === activeTab;
        const matchesStatus = statusFilter === "All Statuses" || 
                           (l.status && l.status.toLowerCase() === statusFilter.toLowerCase());
                           
        return matchesTab && matchesStatus;
    });

    return (
        <div className={`user-page ${theme} min-h-screen relative overflow-hidden mylis-shell`}>
            {/* ---------- NAVBAR ---------- */}
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((p) => !p)}
                theme={theme}
            />

            <div className="pt-[72px] flex relative z-10 w-full h-full">
                {/* ---------- SIDEBAR ---------- */}
                <Sidebar
                    expanded={sidebarOpen}
                    setExpanded={setSidebarOpen}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    activeSetting={activeSetting}
                    onSectionChange={handleSectionChange}
                    theme={theme}
                    setTheme={setTheme}
                />

                {/* ---------- MAIN CONTENT ---------- */}
                <div className="relative flex-1 min-w-5 overflow-hidden">
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
                        <main className="mylis-main w-full">

                            {/* Header */}
                            <div className="mylis-header-row">
                                <h1 className="mylis-title">My Listings</h1>
                                <button 
                                    className="mylis-add-btn"
                                    onClick={() => navigate("/add-listing")}
                                >
                                    + Add New Listing
                                </button>
                            </div>
                            <p className="mylis-subtitle">
                                One place to manage products, services, courses, webinars, and teams.
                            </p>

                            {/* Toolbar */}
                            <div className="mylis-toolbar">
                                <div className="mylis-search-wrap">
                                    <span className="mylis-search-icon">
                                        <SearchIcon />
                                    </span>
                                    <input
                                        type="text"
                                        className="mylis-search-input"
                                        placeholder="Search product"
                                    />
                                </div>
                                <div className="mylis-status-wrap">
                                    <div
                                        className={`mylis-status-btn ${openStatusDropdown ? "open" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenStatusDropdown(!openStatusDropdown);
                                            setOpenDropdown(null);
                                        }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {statusFilter}
                                        <span className="arrow">▼</span>
                                    </div>

                                    {openStatusDropdown && (
                                        <ul className="status-menu" onClick={(e) => e.stopPropagation()}>
                                            {["All Statuses", "Active", "Paused", "Draft"].map((status) => (
                                                <li
                                                    key={status}
                                                    className={statusFilter === status ? "active" : ""}
                                                    onClick={() => {
                                                        setStatusFilter(status);
                                                        setOpenStatusDropdown(false);
                                                    }}
                                                >
                                                    {status}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mylis-tabs-wrap">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.name}
                                        className={`mylis-tab ${activeTab === tab.name ? "active" : ""}`}
                                        onClick={() => setActiveTab(tab.name)}
                                    >
                                        {tab.icon}
                                        {tab.name}
                                    </button>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="mylis-grid">
                                {isLoading ? (
                                    <div className="py-20 text-center w-full opacity-50">Loading listings...</div>
                                ) : filteredListings.length === 0 ? (
                                    <div className="py-20 text-center w-full opacity-50">No listings found in this category.</div>
                                ) : filteredListings.map((item) => {
                                    const getRoute = () => {
                                        switch (activeTab) {
                                            case "Products": return "/digital-product-listing";
                                            case "Services": return "/team-service-listing";
                                            case "Courses": return "/course-listing";
                                            case "Webinar": return "/webinar-listing";
                                            case "Teams": return "/team-profile";
                                            default: return "/marketplace";
                                        }
                                    };

                                    return (
                                        <div 
                                            className={`mylis-card ${openDropdown === item.id ? 'active-dropdown' : ''}`} 
                                            key={item.id}
                                            onClick={() => navigate(getRoute())}
                                        >
                                        <div className="mylis-card-img-wrap">
                                            <img 
                                                src={item.cover_media_url || item.img || "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                                                alt={item.title} 
                                                className="mylis-card-img" 
                                            />
                                        </div>
                                        <div className="mylis-card-body">
                                            <div className="mylis-card-top">
                                                <div className="mylis-card-icon-title">
                                                    <div className="mylis-card-type-icon">
                                                        <PackageIcon />
                                                    </div>
                                                    <div className="mylis-card-info">
                                                        <h3>{item.title}</h3>
                                                        <p>
                                                            {item.price ? `$${item.price}` : "Price TBD"} • Updated {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "Recently"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mylis-dropdown-wrap">
                                                    <button
                                                        className="mylis-card-dots"
                                                        aria-label="Menu"
                                                        onClick={(e) => toggleDropdown(item.id, e)}
                                                    >
                                                        <DotsIcon />
                                                    </button>
                                                    {openDropdown === item.id && (
                                                        <div className="mylis-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                                            <div className="mylis-dropdown-header">Actions</div>
                                                            <button 
                                                                className="mylis-dropdown-item"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const type = item.listing_type;
                                                                    const slug = item.username || item.id;
                                                                    if (type === 'digital_product') navigate(`/edit-digital-product/${slug}`);
                                                                    else if (type === 'service') navigate(`/edit-service/${slug}`);
                                                                    else if (type === 'course') navigate(`/edit-course/${slug}`);
                                                                    else if (type === 'webinar') navigate(`/edit-webinar/${slug}`);
                                                                }}
                                                            >
                                                                <EditIcon /> Edit
                                                            </button>
                                                            <button className="mylis-dropdown-item">
                                                                <PauseIcon /> Pause
                                                            </button>
                                                            <button className="mylis-dropdown-item">
                                                                <DuplicateIcon /> Duplicate
                                                            </button>
                                                            <div className="mylis-dropdown-divider"></div>
                                                            <button className="mylis-dropdown-item danger">
                                                                <TrashIcon /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`mylis-badge ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </div>
                                        </div>
                                        </div>
                                        );
                                    })}
                                </div>

                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
