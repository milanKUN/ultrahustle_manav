import React, { useEffect, useState } from "react";
import {
    Bookmark,
    BriefcaseBusiness,
    CalendarDays,
    Clock3,
    Ellipsis,
    IndianRupee,
    MessageSquareText,
    PackageCheck,
    Paperclip,
    ArrowRight,
    ShoppingBag,
} from "lucide-react";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./ClientDashboard.css";
import "../../../Darkuser.css";

const purchaseOverview = [
    {
        title: "Active Orders",
        value: "12",
        icon: BriefcaseBusiness,
    },
    {
        title: "Completed Orders",
        value: "18",
        icon: PackageCheck,
    },
    {
        title: "Total Spend",
        value: "Rs. 1,25,000",
        icon: IndianRupee,
    },
    {
        title: "Saved Listings",
        value: "7",
        icon: Bookmark,
    },
];

const activeWorkItems = [
    {
        title: "Monthly Content Ops (Retainer)",
        mode: "Solo",
        creator: "Ava (Client)",
        contractId: "contract id",
        status: "Active",
        tag: "Extension",
        completedMilestones: 1,
        totalMilestones: 4,
        nextStep: "Logo directions",
        nextDueDate: "Feb 20, 2026",
        dueDate: "Mar 15, 2026",
        timeLeft: "12 days left",
        messages: 34,
        files: 12,
    },
    {
        title: "Monthly Content Ops (Retainer)",
        mode: "Solo",
        creator: "Ava (Client)",
        contractId: "contract id",
        status: "Active",
        tag: "Extension",
        completedMilestones: 1,
        totalMilestones: 4,
        nextStep: "Logo directions",
        nextDueDate: "Feb 20, 2026",
        dueDate: "Mar 15, 2026",
        timeLeft: "12 days left",
        messages: 34,
        files: 12,
    },
];

const recentPurchases = [
    {
        id: "10 min",
        title: "AI Logo Design",
        creator: "Aarav Kapoor",
        price: "Rs 2,999",
    },
    {
        id: "25 min",
        title: "Figma Landing Page",
        creator: "Neha Sharma",
        price: "Rs 12,500",
    },
    {
        id: "27 min",
        title: "Webinar: Growth funnels",
        creator: "Sahil Verma",
        price: "Rs 799",
    },
];

const savedListings = [
    {
        title: "Notion Content Calendar",
        price: "$29",
        updatedAt: "Updated Feb 26, 2026",
        status: "Active",
    },
    {
        title: "Notion Content Calendar",
        price: "$29",
        updatedAt: "Updated Feb 26, 2026",
        status: "Active",
    },
    {
        title: "Notion Content Calendar",
        price: "$29",
        updatedAt: "Updated Feb 26, 2026",
        status: "Active",
    },
];

const recommendedCreators = [
    {
        name: "Aarav Kapoor",
        category: "Branding",
        price: "From Rs 2,999",
    },
    {
        name: "Neha Sharma",
        category: "Web Design",
        price: "From Rs 6,500",
    },
    {
        name: "Sahil Verma",
        category: "Growth",
        price: "From Rs 799",
    },
];

const financialOverview = [
    {
        label: "Wallet Credits",
        value: "₹2,500",
        note: "",
    },
    {
        label: "Pending Refunds",
        value: "₹1,000",
        note: "",
    },
    {
        label: "Last Payment",
        value: "₹12,500",
        note: "3 days ago",
    },
];

const clientMessages = [
    {
        name: "Aarav Kapoor",
        text: "Shared the latest draft for review.",
        time: "2m",
    },
    {
        name: "Neha Sharma",
        text: "Milestone 2 ready when you are.",
        time: "1d",
    },
    {
        name: "Sahil Verma",
        text: "Webinar link will be sent 30 mins prior.",
        time: "3d",
    },
];

const clientActivity = [
    {
        label: "Order placed",
        time: "2h",
    },
    {
        label: "Course enrolled",
        time: "1d",
    },
    {
        label: "Webinar booked",
        time: "3d",
    },
    {
        label: "Project completed",
        time: "1w",
    },
];

const ClientDashboard = ({ theme, setTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        setShowSettings(false);
    }, []);

    const handleSectionChange = (id) => {
        setActiveSetting(id);
    };

    return (
        <div
            className={`dashboard-page user-page ${theme} min-h-screen relative overflow-hidden`}
        >
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="pt-[85px] flex relative z-10">
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

                <div className="relative flex-1 min-w-0 overflow-hidden">
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
                        <div className="client-dashboard-container p-8">
                            <div className="client-dashboard-hero">
                                <p className="client-dashboard-title">
                                    Ultra Hustle
                                </p>
                                <p className="client-dashboard-breadcrumb">
                                    Dashboard Home - /dashboard/client
                                </p>
                            </div>

                            <section className="client-profile-card">
                                <div className="client-profile-main">
                                    <div
                                        className="client-profile-avatar"
                                        aria-hidden="true"
                                    />

                                    <div className="client-profile-copy">
                                        <h1>Riya Malhotra</h1>
                                        <div className="client-profile-meta">
                                            <p>@riya.pm</p>
                                            <span>Member since Aug 2024</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="client-profile-actions">
                                    <button
                                        type="button"
                                        className="client-profile-action-button"
                                    >
                                        <ShoppingBag size={15} />
                                        <span>Browse Marketplace</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="client-profile-action-button"
                                    >
                                        <Bookmark size={15} />
                                        <span>View saved</span>
                                    </button>
                                </div>
                            </section>

                            <section className="client-overview-section">
                                <div className="client-section-heading">
                                    <h2>Purchase overview</h2>
                                    <p>Your buyer signals</p>
                                </div>

                                <div className="client-overview-grid">
                                    {purchaseOverview.map(
                                        ({ title, value, icon: Icon }) => (
                                            <article
                                                key={title}
                                                className="client-overview-card"
                                            >
                                                <div className="client-overview-copy">
                                                    <p className="client-overview-title">
                                                        {title}
                                                    </p>
                                                    <p className="client-overview-value">
                                                        {value}
                                                    </p>
                                                </div>

                                                <div
                                                    className="client-overview-icon"
                                                    aria-hidden="true"
                                                >
                                                    <Icon size={18} />
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className="client-active-work-section">
                                <div className="client-active-work-board">
                                    <div className="client-section-heading">
                                        <h2>Active work</h2>
                                        <p>
                                            Track ongoing projects and
                                            milestones
                                        </p>
                                    </div>

                                    <div className="client-active-work-list">
                                        {activeWorkItems.map(
                                            (project, index) => {
                                                const progressPct =
                                                    (project.completedMilestones /
                                                        project.totalMilestones) *
                                                    100;

                                                return (
                                                    <div
                                                        key={`${project.title}-${index}`}
                                                        className="client-active-work-grid"
                                                    >
                                                        <article className="client-active-work-card client-active-work-card-main">
                                                            <div className="client-active-work-header">
                                                                <div className="client-active-work-title-group">
                                                                    <div className="client-active-work-title-row">
                                                                        <h3>
                                                                            {
                                                                                project.title
                                                                            }
                                                                        </h3>
                                                                        <span className="client-active-work-status">
                                                                            {
                                                                                project.status
                                                                            }
                                                                        </span>
                                                                        <span className="client-active-work-tag">
                                                                            {
                                                                                project.tag
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <div className="client-active-work-meta">
                                                                        <span>
                                                                            {
                                                                                project.mode
                                                                            }
                                                                        </span>
                                                                        <span>
                                                                            -
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                project.creator
                                                                            }
                                                                        </span>
                                                                        <span>
                                                                            -
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                project.contractId
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="client-active-work-progress">
                                                                <div className="client-active-work-progress-top">
                                                                    <span>
                                                                        Milestones
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            project.completedMilestones
                                                                        }
                                                                        /
                                                                        {
                                                                            project.totalMilestones
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <div className="client-active-work-progress-bar">
                                                                    <span
                                                                        style={{
                                                                            width: `${progressPct}%`,
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="client-active-work-next">
                                                                    <span>
                                                                        Next:{" "}
                                                                        <strong>
                                                                            {
                                                                                project.nextStep
                                                                            }
                                                                        </strong>
                                                                    </span>
                                                                    <span>
                                                                        - due{" "}
                                                                        {
                                                                            project.nextDueDate
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </article>

                                                        <article className="client-active-work-card client-active-work-card-side">
                                                            <h3>Due</h3>
                                                            <div className="client-active-work-side-info">
                                                                <div>
                                                                    <CalendarDays
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {
                                                                            project.dueDate
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <Clock3
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {
                                                                            project.timeLeft
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </article>

                                                        <article className="client-active-work-card client-active-work-card-side">
                                                            <h3>
                                                                Collaboration
                                                            </h3>
                                                            <div className="client-active-work-pills">
                                                                <span>
                                                                    <MessageSquareText
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                    <b>
                                                                        {
                                                                            project.messages
                                                                        }
                                                                    </b>
                                                                </span>
                                                                <span>
                                                                    <Paperclip
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                    <b>
                                                                        {
                                                                            project.files
                                                                        }
                                                                    </b>
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                className="client-active-work-button"
                                                            >
                                                                <span>
                                                                    Open
                                                                    Workroom
                                                                </span>
                                                                <ArrowRight
                                                                    size={15}
                                                                />
                                                            </button>
                                                        </article>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="client-recent-purchases-section">
                                <div className="client-section-heading">
                                    <h2>Recent purchases</h2>
                                    <p>Latest transactions and access</p>
                                </div>

                                <div className="client-recent-purchases-list">
                                    {recentPurchases.map((item) => (
                                        <article
                                            key={item.title}
                                            className="client-purchase-card"
                                        >
                                            <div className="client-purchase-main">
                                                <span className="client-purchase-pill">
                                                    {item.id}
                                                </span>

                                                <div className="client-purchase-copy">
                                                    <h3>{item.title}</h3>
                                                    <p>
                                                        Creator: {item.creator}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="client-purchase-actions">
                                                <strong className="client-purchase-price">
                                                    {item.price}
                                                </strong>

                                                <button
                                                    type="button"
                                                    className="client-purchase-button client-purchase-button-secondary"
                                                >
                                                    View order
                                                </button>

                                                <button
                                                    type="button"
                                                    className="client-purchase-button client-purchase-button-primary"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            <section className="client-discovery-section">
                                <div className="client-discovery-grid">
                                    <article className="client-discovery-panel">
                                        <div className="client-section-heading client-discovery-heading">
                                            <h2>Saved listings</h2>
                                            <p>
                                                Quick preview of saved items
                                            </p>
                                        </div>

                                        <div className="client-saved-grid">
                                            {savedListings.map(
                                                (listing, index) => (
                                                    <article
                                                        key={`${listing.title}-${index}`}
                                                        className="client-saved-card"
                                                    >
                                                        <div className="client-saved-thumb" />

                                                        <div className="client-saved-footer">
                                                            <div className="client-saved-meta-row">
                                                                <div className="client-saved-icon">
                                                                    <Bookmark
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="client-saved-copy">
                                                                    <h3>
                                                                        {
                                                                            listing.title
                                                                        }
                                                                    </h3>
                                                                    <p>
                                                                        {
                                                                            listing.price
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            listing.updatedAt
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    className="client-saved-more"
                                                                    aria-label="More options"
                                                                >
                                                                    <Ellipsis
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>

                                                            <span className="client-saved-status">
                                                                {
                                                                    listing.status
                                                                }
                                                            </span>
                                                        </div>
                                                    </article>
                                                ),
                                            )}
                                        </div>
                                    </article>

                                    <article className="client-discovery-panel">
                                        <div className="client-section-heading client-discovery-heading">
                                            <h2>Recommended creators</h2>
                                            <p>AI-powered suggestions</p>
                                        </div>

                                        <div className="client-recommended-list">
                                            {recommendedCreators.map(
                                                (creator) => (
                                                    <article
                                                        key={creator.name}
                                                        className="client-recommended-card"
                                                    >
                                                        <div className="client-recommended-copy">
                                                            <h3>
                                                                {creator.name}
                                                            </h3>
                                                            <p>
                                                                {
                                                                    creator.category
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    creator.price
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="client-recommended-actions">
                                                            <button
                                                                type="button"
                                                                className="client-purchase-button client-purchase-button-secondary"
                                                            >
                                                                Profile
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="client-purchase-button client-purchase-button-primary"
                                                            >
                                                                Listings
                                                            </button>
                                                        </div>
                                                    </article>
                                                ),
                                            )}
                                        </div>
                                    </article>
                                </div>
                            </section>

                            <section className="client-insights-section">
                                <div className="client-insights-grid">
                                    <article className="client-insight-panel">
                                        <div className="client-section-heading client-discovery-heading">
                                            <h2>Financial overview</h2>
                                            <p>Payments and refunds</p>
                                        </div>

                                        <div className="client-mini-stack">
                                            {financialOverview.map((item) => (
                                                <article
                                                    key={item.label}
                                                    className="client-mini-card"
                                                >
                                                    <p className="client-mini-label">
                                                        {item.label}
                                                    </p>
                                                    <h3 className="client-mini-value">
                                                        {item.value}
                                                    </h3>
                                                    {item.note ? (
                                                        <span className="client-mini-note">
                                                            {item.note}
                                                        </span>
                                                    ) : null}
                                                </article>
                                            ))}
                                        </div>
                                    </article>

                                    <article className="client-insight-panel">
                                        <div className="client-section-heading client-discovery-heading">
                                            <h2>Messages preview</h2>
                                            <p>
                                                Last conversations with creators
                                            </p>
                                        </div>

                                        <div className="client-mini-stack">
                                            {clientMessages.map((item) => (
                                                <article
                                                    key={`${item.name}-${item.time}`}
                                                    className="client-feed-card"
                                                >
                                                    <div className="client-feed-copy">
                                                        <h3>{item.name}</h3>
                                                        <p>{item.text}</p>
                                                    </div>
                                                    <span className="client-feed-time">
                                                        {item.time}
                                                    </span>
                                                </article>
                                            ))}
                                        </div>
                                    </article>

                                    <article className="client-insight-panel">
                                        <div className="client-section-heading client-discovery-heading">
                                            <h2>Activity timeline</h2>
                                            <p>Recent actions</p>
                                        </div>

                                        <div className="client-mini-stack">
                                            {clientActivity.map((item) => (
                                                <article
                                                    key={`${item.label}-${item.time}`}
                                                    className="client-timeline-card"
                                                >
                                                    <strong>{item.label}</strong>
                                                    <span>{item.time}</span>
                                                </article>
                                            ))}
                                        </div>
                                    </article>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
