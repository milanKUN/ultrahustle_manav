import React, { useState, useEffect } from "react";
import {
    BadgeCheck,
    CircleDollarSign,
    Gauge,
    LayoutGrid,
    MessageCircleMore,
    Play,
    PackageCheck,
    ReceiptText,
    Rocket,
    Send,
    Star,
    Sparkles,
    Activity,
    Wallet,
} from "lucide-react";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./Dashboard.css";
import "../../../Darkuser.css";

const Dashboard = ({ theme, setTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [activeOrderCategory, setActiveOrderCategory] = useState("Service");

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        setShowSettings(false);
    }, []);

    const handleSectionChange = (id) => {
        setActiveSetting(id);
    };

    const overviewStats = [
        {
            title: "Active Listings",
            value: "12",
            note: "+2 this week",
            icon: LayoutGrid,
        },
        {
            title: "Orders in Progress",
            value: "3",
            note: "1 due today",
            icon: Send,
        },
        {
            title: "Completed Orders",
            value: "87",
            note: "98% completion",
            icon: PackageCheck,
        },
        {
            title: "Total Earnings",
            value: "87",
            note: "98% completion",
            icon: CircleDollarSign,
        },
    ];

    const orderCategories = [
        "Service",
        "Digital Products",
        "Teams",
        "Courses",
        "Webinars",
    ];

    const orderCategoryContent = {
        Service: [
            {
                title: "Confirmed Contracts",
                columns: [
                    "#",
                    "Buyer",
                    "Listing",
                    "Hold",
                    "Released",
                    "Fee %/$",
                    "Net (All Released)",
                ],
                rows: [
                    [
                        "SC- 10428",
                        "Aisha Khan",
                        "Brand identity sprint\nServices",
                        "$18,000",
                        "10%",
                        "$6,000",
                        "$5,400",
                    ],
                    [
                        "TC-8891",
                        "Rohit Mehra",
                        "MVP build -\nteam project\nTeams",
                        "$55,000",
                        "$0",
                        "$2,500",
                        "$0",
                    ],
                ],
            },
        ],
        "Digital Products": [
            {
                title: "Digital Products",
                columns: [
                    "#",
                    "Buyer",
                    "Product",
                    "Quantity",
                    "Gross",
                    "Fee %/$",
                    "Net",
                    "Status",
                ],
                rows: [
                    [
                        "DP-77201",
                        "Nikhil Patel",
                        "Notion Client\nPortal Template",
                        "1",
                        "$1,499",
                        "$150",
                        "$1,349",
                        "Paid",
                    ],
                ],
            },
        ],
        Teams: [
            {
                title: "Confirmed Contracts",
                columns: [
                    "#",
                    "Buyer",
                    "Listing",
                    "Hold",
                    "Released",
                    "Fee %/$",
                    "Net (All Released)",
                ],
                rows: [
                    [
                        "TC-8891",
                        "Rohit Mehra",
                        "MVP build -\nteam project\nTeams",
                        "$55,000",
                        "$0",
                        "$2,500",
                        "$0",
                    ],
                ],
            },
        ],
        Courses: [
            {
                title: "Course Enrollments",
                columns: [
                    "#",
                    "Learner",
                    "Course",
                    "Price",
                    "Fee",
                    "Net",
                    "Progress",
                ],
                rows: [
                    [
                        "CE-2209",
                        "Fatima Noor",
                        "Design Systems\n101",
                        "$7,999",
                        "$800",
                        "$7,199",
                        "42%",
                    ],
                ],
            },
        ],
        Webinars: [
            {
                title: "Webinar Bookings",
                columns: [
                    "#",
                    "Attendee",
                    "Webinar",
                    "Ticket Type",
                    "Price",
                    "Fee",
                    "Net",
                    "Status",
                ],
                rows: [
                    [
                        "WB-50012",
                        "Alex Chen",
                        "Ship Faster with\nAI Tools",
                        "Pro",
                        "$2,499",
                        "$250",
                        "$2,249",
                        "Upcoming",
                    ],
                ],
            },
        ],
    };

    const visibleOrderGroups = orderCategoryContent[activeOrderCategory] || [];

    const listingSnapshots = [
        {
            title: "AI Logo Design",
            category: "Branding",
            views: "3,280",
            orders: "42",
            conversion: "1.28%",
            revenue: "₹84,000",
        },
        {
            title: "Landing Page UI (Figma)",
            category: "Web Design",
            views: "2,140",
            orders: "18",
            conversion: "0.84%",
            revenue: "₹63,000",
        },
        {
            title: "Pitch Deck Makeover",
            category: "Design",
            views: "1,560",
            orders: "11",
            conversion: "0.70%",
            revenue: "₹44,000",
        },
    ];

    const financialSnapshots = [
        {
            title: "Wallet Balance",
            value: "₹42,500",
            note: "",
            icon: Wallet,
        },
        {
            title: "Pending Earnings",
            value: "₹12,000",
            note: "",
            icon: PackageCheck,
        },
        {
            title: "Available to Withdraw",
            value: "₹15,000",
            note: "",
            icon: CircleDollarSign,
        },
        {
            title: "Last Payout",
            value: "₹15,000",
            note: "2 days ago",
            icon: ReceiptText,
        },
    ];

    const boostMetrics = [
        { label: "Spend", value: "₹500" },
        { label: "Clicks", value: "1,240" },
        { label: "Orders", value: "6" },
        { label: "ROAS", value: "9.0x" },
    ];

    const reputationMetrics = [
        { label: "Rating", value: "4.9" },
        { label: "Reviews", value: "132" },
        { label: "Karma", value: "A+" },
        { label: "Completion", value: "98%" },
    ];

    const reputationTags = [
        { label: "On-time delivery", className: "is-green" },
        { label: "Fast response", className: "is-blue" },
        { label: "Top rated", className: "is-pink" },
    ];

    const messagePreview = [
        {
            name: "Kavya Mehta",
            text: "Can you share the final exports today?",
            time: "2m",
        },
        {
            name: "Nexora Labs",
            text: "Looks good - one more revision on the hero copy.",
            time: "1h",
        },
        {
            name: "Rohit Jain",
            text: "Where can I download the product files?",
            time: "Yesterday",
        },
        {
            name: "Studio North",
            text: "Workshop agenda approved. See you Monday.",
            time: "1h",
        },
        {
            name: "Asha Patel",
            text: "Thanks - leaving a review now!",
            time: "4d",
        },
    ];

    const aiInsights = [
        "Your conversion rate increased 18% this week.",
        "Your listing 'AI Logo Design' is trending in Search.",
        "Responding faster may increase orders by 12%.",
    ];

    const activityTimeline = [
        { label: "Order placed", time: "2h" },
        { label: "Listing purchased", time: "3h" },
        { label: "Review received", time: "Yesterday" },
        { label: "Payment released", time: "2d" },
    ];

    return (
        <div
            className={`dashboard-page user-page ${theme} min-h-screen relative overflow-hidden`}
        >
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((p) => !p)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="pt-[72px] flex relative z-10">
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

                <div className="relative flex-1 min-w-5 overflow-hidden">
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)] custom-scroll">
                        <div className="dashboard-container p-8">
                            <div className="dashboard-hero">
                                <p className="dashboard-eyebrow">
                                    Ultra Hustle
                                </p>
                                <p className="dashboard-breadcrumb">
                                    Dashboard Home - /dashboard/creator
                                </p>
                            </div>

                            <section className="creator-summary-card">
                                <div className="creator-summary-main">
                                    <div
                                        className="creator-avatar"
                                        aria-hidden="true"
                                    />

                                    <div className="creator-meta">
                                        <div className="creator-name-row">
                                            <h1>Full Name</h1>
                                            <BadgeCheck
                                                size={18}
                                                strokeWidth={2.4}
                                            />
                                            <span className="creator-chip">
                                                Pro Creator
                                            </span>
                                            <span className="creator-chip">
                                                KYC
                                            </span>
                                        </div>

                                        <p className="creator-handle">
                                            @Abigail_12
                                        </p>

                                        <div className="creator-stats-row">
                                            <span className="-mr-2">
                                                <Star size={12} />
                                            </span>
                                            <span>4.9</span>
                                            <span>132 reviews</span>
                                            <span>Followers (soon)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="creator-actions">
                                    <button
                                        type="button"
                                        className="creator-action-button"
                                    >
                                        <Send size={15} />
                                        <span>Create Listings</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="creator-action-button"
                                    >
                                        <LayoutGrid size={15} />
                                        <span>View Marketplace</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="creator-action-button"
                                    >
                                        <Rocket size={15} />
                                        <span>Boost Listings</span>
                                    </button>
                                </div>
                            </section>

                            <section className="dashboard-overview-section">
                                <div className="dashboard-section-heading">
                                    <h2>Performance overview</h2>
                                    <p>Your core dashboard signals</p>
                                </div>

                                <div className="overview-grid">
                                    {overviewStats.map(
                                        ({
                                            title,
                                            value,
                                            note,
                                            icon: Icon,
                                        }) => (
                                            <article
                                                key={title}
                                                className="overview-card"
                                            >
                                                <div className="overview-copy">
                                                    <p className="overview-title">
                                                        {title}
                                                    </p>
                                                    <p className="overview-value">
                                                        {value}
                                                    </p>
                                                    <p className="overview-note">
                                                        {note}
                                                    </p>
                                                </div>

                                                <div
                                                    className="overview-icon-wrap"
                                                    aria-hidden="true"
                                                >
                                                    <Icon size={20} />
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className="orders-attention-card">
                                <div className="orders-attention-head">
                                    <h2>Orders requiring attention</h2>
                                    <p>
                                        Know what to do today - deadlines +
                                        statuses
                                    </p>
                                </div>

                                <div className="orders-attention-filters">
                                    {orderCategories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`orders-attention-pill ${activeOrderCategory === category ? "active" : ""}`}
                                            onClick={() =>
                                                setActiveOrderCategory(category)
                                            }
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                {visibleOrderGroups.map((group, groupIndex) => (
                                    <div
                                        className="orders-attention-group"
                                        key={`${group.title}-${groupIndex}`}
                                    >
                                        <h3>{group.title}</h3>

                                        <div className="orders-attention-table-card">
                                            <div className="orders-attention-table-scroll">
                                                <table className="orders-attention-table">
                                                    <thead>
                                                        <tr>
                                                            {group.columns.map(
                                                                (column) => (
                                                                    <th
                                                                        key={
                                                                            column
                                                                        }
                                                                    >
                                                                        {column}
                                                                    </th>
                                                                ),
                                                            )}
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {group.rows.map(
                                                            (row, rowIndex) => (
                                                                <tr
                                                                    key={`${row[0]}-${rowIndex}`}
                                                                >
                                                                    {row.map(
                                                                        (
                                                                            cell,
                                                                            cellIndex,
                                                                        ) => {
                                                                            const currentColumn =
                                                                                group
                                                                                    .columns[
                                                                                cellIndex
                                                                                ];
                                                                            const isListingColumn =
                                                                                cellIndex ===
                                                                                2;

                                                                            return (
                                                                                <td
                                                                                    key={`${row[0]}-${cellIndex}`}
                                                                                    className={
                                                                                        isListingColumn
                                                                                            ? "orders-attention-listing-cell"
                                                                                            : ""
                                                                                    }
                                                                                >
                                                                                    {currentColumn ===
                                                                                        "Progress" ? (
                                                                                        <div className="inline-flex min-w-[132px] items-center gap-3">
                                                                                            <div
                                                                                                className="relative h-[8px] w-[88px] flex-shrink-0 overflow-hidden rounded-full"
                                                                                                style={{
                                                                                                    backgroundColor:
                                                                                                        "#d7e47e",
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    aria-hidden="true"
                                                                                                    className="absolute left-0 top-0 h-full rounded-full"
                                                                                                    style={{
                                                                                                        width: "28px",
                                                                                                        backgroundColor:
                                                                                                            "#d8ff1e",
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                            <strong className="text-[14px] font-medium leading-none text-[#4a4a4a]">
                                                                                                {
                                                                                                    cell
                                                                                                }
                                                                                            </strong>
                                                                                        </div>
                                                                                    ) : currentColumn ===
                                                                                        "Status" ? (
                                                                                        <span className="orders-attention-status">
                                                                                            {
                                                                                                cell
                                                                                            }
                                                                                        </span>
                                                                                    ) : isListingColumn ? (
                                                                                        <span>
                                                                                            {
                                                                                                cell
                                                                                            }
                                                                                        </span>
                                                                                    ) : (
                                                                                        cell
                                                                                    )}
                                                                                </td>
                                                                            );
                                                                        },
                                                                    )}
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            <section className="listings-snapshot-card">
                                <div className="dashboard-section-heading listings-snapshot-heading">
                                    <h2>Listings performance snapshot</h2>
                                    <p>Top 3 listings - what's working</p>
                                </div>

                                <div className="listings-snapshot-grid">
                                    {listingSnapshots.map((listing) => (
                                        <article
                                            key={listing.title}
                                            className="listing-snapshot-item"
                                        >
                                            <div className="listing-snapshot-top">
                                                <h3>{listing.title}</h3>
                                                <p>{listing.category}</p>
                                            </div>

                                            <div className="listing-snapshot-metrics">
                                                <div>
                                                    <span>Views</span>
                                                    <strong>{listing.views}</strong>
                                                </div>
                                                <div>
                                                    <span>Orders</span>
                                                    <strong>{listing.orders}</strong>
                                                </div>
                                                <div>
                                                    <span>Conversion</span>
                                                    <strong>{listing.conversion}</strong>
                                                </div>
                                                <div>
                                                    <span>Revenue</span>
                                                    <strong>{listing.revenue}</strong>
                                                </div>
                                            </div>

                                            <div className="listing-snapshot-actions">
                                                <button
                                                    type="button"
                                                    className="listing-snapshot-btn"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="listing-snapshot-btn listing-snapshot-btn-icon"
                                                >
                                                    <Gauge size={12} />
                                                    <span>Boost</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="listing-snapshot-link"
                                                >
                                                    Analytics
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            <section className="financial-snapshot-section">
                                <div className="dashboard-section-heading financial-snapshot-heading">
                                    <h2>Financial snapshot</h2>
                                    <p>Quick overview of money</p>
                                </div>

                                <div className="financial-snapshot-grid">
                                    {financialSnapshots.map(
                                        ({ title, value, note, icon: Icon }) => (
                                            <article
                                                key={title}
                                                className="financial-snapshot-card"
                                            >
                                                <div className="financial-snapshot-copy">
                                                    <p>{title}</p>
                                                    <h3>{value}</h3>
                                                    {note ? (
                                                        <span>{note}</span>
                                                    ) : null}
                                                </div>

                                                <div
                                                    className="financial-snapshot-icon"
                                                    aria-hidden="true"
                                                >
                                                    <Icon size={18} />
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className="dashboard-intelligence-section">
                                <div className="dashboard-wide-grid">
                                    <article className="dashboard-wide-card">
                                        <div className="dashboard-section-heading dashboard-compact-heading">
                                            <h2>Boost performance</h2>
                                            <p>Only shown when boosts are running</p>
                                        </div>

                                        <div className="dashboard-mini-metrics">
                                            {boostMetrics.map((item) => (
                                                <div key={item.label}>
                                                    <span>{item.label}</span>
                                                    <strong>{item.value}</strong>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="dashboard-tip-box">
                                            Tip: Boost your top listing during peak hours to maximize ROAS.
                                        </div>
                                    </article>

                                    <article className="dashboard-wide-card">
                                        <div className="dashboard-section-heading dashboard-compact-heading">
                                            <h2>Reviews & reputation</h2>
                                            <p>Fast trust signals</p>
                                        </div>

                                        <div className="dashboard-mini-metrics">
                                            {reputationMetrics.map((item) => (
                                                <div key={item.label}>
                                                    <span>{item.label}</span>
                                                    <strong>{item.value}</strong>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="reputation-tags">
                                            {reputationTags.map((tag) => (
                                                <span
                                                    key={tag.label}
                                                    className={`reputation-tag ${tag.className}`}
                                                >
                                                    {tag.label}
                                                </span>
                                            ))}
                                        </div>
                                    </article>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr]">
                                    <article
                                        className={`min-w-0 rounded-[14px] border p-3 ${
                                            theme === "dark"
                                                ? "border-[#d8ff1e]/60 bg-[#111111]"
                                                : "border-[#d8ff1e] bg-white"
                                        }`}
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <h3
                                                    className={`m-0 text-[14px] font-semibold leading-none ${
                                                        theme === "dark"
                                                            ? "text-[#d8ff1e]"
                                                            : "text-[#2e2e2e]"
                                                    }`}
                                                >
                                                    Messages preview
                                                </h3>
                                                <p
                                                    className={`mt-1 mb-0 text-[12px] leading-none ${
                                                        theme === "dark"
                                                            ? "text-[#8f8f8f]"
                                                            : "text-[#5f5f5f]"
                                                    }`}
                                                >
                                                    Last 5 conversations
                                                </p>
                                            </div>
                                            <MessageCircleMore
                                                size={16}
                                                className={`shrink-0 ${
                                                    theme === "dark"
                                                        ? "text-[#9a9a9a]"
                                                        : "text-[#666666]"
                                                }`}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {messagePreview.map((item) => (
                                                <div
                                                    key={`${item.name}-${item.time}`}
                                                    className={`flex w-full min-w-0 items-start justify-between gap-3 rounded-[9px] border px-3 py-[10px] ${
                                                        theme === "dark"
                                                            ? "border-[#3f3f3f] bg-[#1f1f1f]"
                                                            : "border-[#aeb4bb] bg-[#f6f6f6]"
                                                    }`}
                                                >
                                                    <div className="min-w-0">
                                                        <strong
                                                            className={`block text-[14px] font-semibold leading-none ${
                                                                theme === "dark"
                                                                    ? "text-[#f3f3f3]"
                                                                    : "text-[#2f2f2f]"
                                                            }`}
                                                        >
                                                            {item.name}
                                                        </strong>
                                                        <p
                                                            className={`mt-1 mb-0 text-[11px] leading-[1.25] ${
                                                                theme === "dark"
                                                                    ? "text-[#b0b0b0]"
                                                                    : "text-[#6c6c6c]"
                                                            }`}
                                                        >
                                                            {item.text}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`shrink-0 text-[10px] leading-none ${
                                                            theme === "dark"
                                                                ? "text-[#8a8a8a]"
                                                                : "text-[#8d8d8d]"
                                                        }`}
                                                    >
                                                        {item.time}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </article>

                                    <article
                                        className={`min-w-0 rounded-[14px] border p-3 ${
                                            theme === "dark"
                                                ? "border-[#d8ff1e]/60 bg-[#111111]"
                                                : "border-[#d8ff1e] bg-white"
                                        }`}
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <h3
                                                    className={`m-0 text-[14px] font-semibold leading-none ${
                                                        theme === "dark"
                                                            ? "text-[#d8ff1e]"
                                                            : "text-[#2e2e2e]"
                                                    }`}
                                                >
                                                    AI insights
                                                </h3>
                                                <p
                                                    className={`mt-1 mb-0 text-[12px] leading-none ${
                                                        theme === "dark"
                                                            ? "text-[#8f8f8f]"
                                                            : "text-[#5f5f5f]"
                                                    }`}
                                                >
                                                    Ultra Hustle assistant suggestions
                                                </p>
                                            </div>
                                            <Sparkles
                                                size={16}
                                                className={`shrink-0 ${
                                                    theme === "dark"
                                                        ? "text-[#9a9a9a]"
                                                        : "text-[#666666]"
                                                }`}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {aiInsights.map((insight) => (
                                                <div
                                                    key={insight}
                                                    className={`w-full rounded-[9px] border px-3 py-[10px] ${
                                                        theme === "dark"
                                                            ? "border-[#3f3f3f] bg-[#1f1f1f]"
                                                            : "border-[#aeb4bb] bg-[#f6f6f6]"
                                                    }`}
                                                >
                                                    <p
                                                        className={`m-0 text-[12px] leading-[1.25] ${
                                                            theme === "dark"
                                                                ? "text-[#b0b0b0]"
                                                                : "text-[#6c6c6c]"
                                                        }`}
                                                    >
                                                        {insight}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-4 inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[7px] border border-[#9aac11] bg-[#d8ff1e] px-4 text-[11px] font-medium text-[#252b10]"
                                        >
                                            <Send size={12} />
                                            <span>Create Listings</span>
                                        </button>
                                    </article>

                                    <article
                                        className={`min-w-0 rounded-[14px] border p-3 ${
                                            theme === "dark"
                                                ? "border-[#d8ff1e]/60 bg-[#111111]"
                                                : "border-[#d8ff1e] bg-white"
                                        }`}
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <h3
                                                    className={`m-0 text-[14px] font-semibold leading-none ${
                                                        theme === "dark"
                                                            ? "text-[#d8ff1e]"
                                                            : "text-[#2e2e2e]"
                                                    }`}
                                                >
                                                    Activity timeline
                                                </h3>
                                                <p
                                                    className={`mt-1 mb-0 text-[12px] leading-none ${
                                                        theme === "dark"
                                                            ? "text-[#8f8f8f]"
                                                            : "text-[#5f5f5f]"
                                                    }`}
                                                >
                                                    Recent actions
                                                </p>
                                            </div>
                                            <Activity
                                                size={16}
                                                className={`shrink-0 ${
                                                    theme === "dark"
                                                        ? "text-[#9a9a9a]"
                                                        : "text-[#666666]"
                                                }`}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {activityTimeline.map((item) => (
                                                <div
                                                    key={`${item.label}-${item.time}`}
                                                    className={`flex w-full items-center justify-between gap-3 rounded-[9px] border px-3 py-[10px] ${
                                                        theme === "dark"
                                                            ? "border-[#3f3f3f] bg-[#1f1f1f]"
                                                            : "border-[#aeb4bb] bg-[#f6f6f6]"
                                                    }`}
                                                >
                                                    <strong
                                                        className={`block text-[12px] font-semibold leading-none ${
                                                            theme === "dark"
                                                                ? "text-[#f3f3f3]"
                                                                : "text-[#2f2f2f]"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </strong>
                                                    <span
                                                        className={`shrink-0 text-[12px] leading-none ${
                                                            theme === "dark"
                                                                ? "text-[#8a8a8a]"
                                                                : "text-[#8d8d8d]"
                                                        }`}
                                                    >
                                                        {item.time}
                                                    </span>
                                                </div>
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

export default Dashboard;
