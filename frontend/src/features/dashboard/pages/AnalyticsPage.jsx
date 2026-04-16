import React, { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    BookOpen,
    BriefcaseBusiness,
    MonitorPlay,
    Package,
    Users,
    Target,
    Star,
    Box,
    CheckCircle,
    Clock,
    AlertCircle,
    IndianRupee,
    Zap,
    MessageSquare,
    Check,
} from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./AnalyticsPage.css";
import "../../../Darkuser.css";

const CHANNELS = [
    { label: "Products", icon: Package },
    { label: "Services", icon: BriefcaseBusiness },
    { label: "Courses", icon: BookOpen },
    { label: "Webinar", icon: MonitorPlay },
    { label: "Teams", icon: Users },
];

const METRIC_CARDS = [
    { label: "Reach", value: "5.9L" },
    { label: "Impressions", value: "11.8L" },
    { label: "Opens", value: "1.5L" },
    { label: "CTR", value: "0.1238" },
    { label: "Leads", value: "10.7K" },
    { label: "Value ($)", value: "39.3L" },
    {
        label: "Follower split",
        value: "41% / 59%",
        note: "Followers vs non-followers",
    },
    {
        label: "Response speed",
        value: "~ 18 min",
        note: "Median first reply",
    },
    {
        label: "Saved intent",
        value: "14.23%",
        note: "Saves / opens",
    },
];

const GOAL_BLOCKS = [
    {
        eyebrow: "Primary goal",
        title: "High-intent leads",
        copy: "Optimize opens -> messages -> conversion.",
    },
    {
        eyebrow: "Secondary goal",
        title: "Net earnings",
        copy: "Track fees, refunds, disputes & delivery time.",
    },
];

const HEALTH_ROWS = [
    {
        label: "Disputes",
        note: "Keep satisfaction high",
        value: "< 2%",
    },
    {
        label: "Refunds",
        note: "Digital products",
        value: "< 1%",
    },
    {
        label: "Completion",
        note: "Services / teams",
        value: "< 80%",
    },
];

const PERFORMANCE_DATA = [
    { day: "D1", value: 32000 },
    { day: "D3", value: 29000 },
    { day: "D5", value: 27500 },
    { day: "D7", value: 39000 },
    { day: "D9", value: 43500 },
    { day: "D11", value: 41000 },
    { day: "D13", value: 36500 },
    { day: "D15", value: 43000 },
    { day: "D17", value: 43000 },
    { day: "D19", value: 32500 },
    { day: "D21", value: 33800 },
    { day: "D23", value: 36500 },
    { day: "D25", value: 45000 },
    { day: "D26", value: 48000 },
];

const SNAPSHOT_ROWS = [
    { label: "Reach (unique)", note: "Unique accounts reached", value: "5.9L" },
    { label: "Impressions", note: "Total views across surfaces", value: "11.8L" },
    { label: "Opens", note: "Services / teams", value: "1.5L" },
    { label: "CTR", note: "Opens ÷ impressions", value: "12.38%" },
    { label: "Saves / Wishlists", note: "High intent signals", value: "20.7K" },
    { label: "Messages / Leads", note: "Chat / inquiry intent", value: "10.7K" },
    { label: "Value", note: "Earnings or goal value", value: "₹39,25,150" },
];

const MINI_SNAPSHOT_ROWS = [
    { label: "Avg rating", value: "4.7", note: "Based on 212 reviews" },
    { label: "Disputes", value: "1.4%", note: "As % of completed" },
];

const SOURCE_MIX_DATA = [
    { name: "Feed", value: 44, color: "#5d9dd6" },
    { name: "Search", value: 26, color: "#68b764" },
    { name: "Profile", value: 56, color: "#ffbc44" },
    { name: "Forum", value: 74, color: "#e357a6" },
    { name: "External", value: 81, color: "#9f83f4" },
    { name: "Boost", value: 16, color: "#ff6f7e" },
];

const SOURCE_BAR_DATA = [
    { label: "Impressions", value: 6.6 },
    { label: "Opens", value: 3.4 },
    { label: "Orders", value: 0.9 },
    { label: "completed", value: 0.2 },
];

const KEY_RATE_ROWS = [
    { label: "CTR", note: "Opens ÷ impressions", value: "12.38%" },
    { label: "Lead rate", note: "Messages ÷ opens", value: "7.31%" },
    {
        label: "Goal rate",
        note: "Orders completed + opens (proxy)",
        value: "12.00%",
    },
];

const NEXT_ACTIONS = [
    "Faster reply",
    "Stronger CTA",
    "FAQ snippet",
    "Pricing clarity",
];

const INSIGHTS_DATA = [
    { icon: Target, title: "Conversion rate", value: "3.8%", note: "Goal-dependent" },
    { icon: Star, title: "Rating", value: "3.8%", note: "Goal-dependent" },
    { icon: Box, title: "Orders created", value: "3.8%", note: "Goal-dependent" },
    { icon: Package, title: "Orders completed", value: "1.0K", note: "Completion rate: 83%" },
    { icon: CheckCircle, title: "Repeat clients", value: "28%", note: "Returning buyers" },
    { icon: Clock, title: "Avg delivery time", value: "2.4 days", note: "Median: 2.0" },
    { icon: AlertCircle, title: "Disputes", value: "1.4%", note: "Keep under 2%" },
    { icon: IndianRupee, title: "Net earnings", value: "₹3.1L", note: "After fees" },
];

const EARNINGS_BREAKDOWN = [
    { label: "Gross", note: "Before platform fees", value: "₹3,90,000" },
    { label: "Fees", note: "Platform + payment", value: "-₹52,000" },
    { label: "Net", note: "Take-home", value: "₹3,38,000" },
];

const OPS_HEALTH_DATA = [
    { label: "Completion rate", note: "Completed ÷ created", value: "83%" },
    { label: "Avg delivery", note: "Keep SLAs tight", value: "2.4d" },
    { label: "Disputes", note: "Resolve fast", value: "1.4%" },
];

const BOOST_METRICS = [
    { icon: Zap, title: "Spend", value: "₹32,000", note: "Total boost spend" },
    { icon: Target, title: "CPM", value: "78", note: "Cost per 1k impressions" },
    { icon: MessageSquare, title: "CPC", value: "9.2", note: "Cost per click" },
    { icon: Package, title: "CPA/CPP", value: "168", note: "Cost per action" },
    { icon: IndianRupee, title: "ROAS", value: "3.4x", note: "Return on ad spend" },
];

const SCALING_CHECKLIST = [
    { label: "CTR holds above baseline", note: "If CTR drops, refresh creatives", status: "success" },
    { label: "Conversion stable", note: "Goal: purchase / leads / enroll", status: "success" },
    { label: "Frequency not spiking", note: "Cap exposure to avoid fatigue", status: "warning" },
];

const BOOST_TACTICS = [
    "New hook lines",
    "Offer bundles",
    "Shorter landing",
    "Price anchors",
    "Retarget profile viewers",
];

const TOP_LISTINGS_DATA = [
    { title: "Growth Audit (48h)", ctr: "13.2%", conv: "4.2%", value: "₹1,24,000", leads: 312 },
    { title: "Content Sprint Pack", ctr: "10.8%", conv: "3.6%", value: "₹98,000", leads: 241 },
    { title: "Brand Kit Upgrade", ctr: "9.2%", conv: "2.8%", value: "₹76,000", leads: 188 },
];

const DEFINITIONS_DATA = [
    {
        title: "Signals",
        items: [
            { label: "Saves / wishlists", note: "Often predicts conversions", value: "High intent" },
            { label: "Messages", note: "Chat / inquiry", value: "Lead intent" },
            { label: "Reviews", note: "Boosts conversion", value: "Trust" },
        ]
    },
    {
        title: "Paid",
        items: [
            { label: "CPM", note: "Impressions", value: "High intent" },
            { label: "CPC", note: "Traffic", value: "Lead intent" },
            { label: "ROAS", note: "Return", value: "Revenue / spend" },
        ]
    },
    {
        title: "Operations",
        items: [
            { label: "Completion rate", note: "Services/teams", value: "Completed ÷ created" },
            { label: "Avg delivery", note: "Speed = satisfaction", value: "Time to deliver" },
            { label: "Disputes %", note: "Quality control", value: "Disputes ÷ completed" },
        ]
    }
];

const AUDIENCE_DATA = [
    {
        title: "Age",
        rows: [
            { label: "18-24", value: 22 },
            { label: "25-34", value: 44 },
            { label: "35-44", value: 21 },
            { label: "45+", value: 13 },
        ]
    },
    {
        title: "Gender",
        rows: [
            { label: "Men", value: 61 },
            { label: "Women", value: 44 },
            { label: "Other", value: 21 },
            { label: "45+", value: 13 },
        ]
    },
    {
        title: "Country",
        rows: [
            { label: "India", value: 22 },
            { label: "UAE", value: 44 },
            { label: "USA", value: 21 },
            { label: "UK", value: 13 },
            { label: "Other", value: 13 },
        ]
    },
    {
        title: "Device",
        rows: [
            { label: "Android", value: 22 },
            { label: "iOS", value: 44 },
            { label: "Web", value: 21 },
        ]
    },
    {
        title: "Followers vs non-followers",
        rows: [
            { label: "Followers", value: 61 },
            { label: "Non-followers", value: 44 },
        ]
    }
];

export default function AnalyticsPage({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [activeChannel, setActiveChannel] = useState("Products");

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        setShowSettings(false);
    }, []);

    return (
        <div
            className={`analytics-page user-page ${theme} min-h-screen relative overflow-hidden`}
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
                    onSectionChange={setActiveSetting}
                    theme={theme}
                    setTheme={setTheme}
                />

                <div className="relative flex-1 min-w-5 overflow-hidden">
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
                        <div className="analytics-page-shell">
                            <div className="analytics-board">
                                <section className="analytics-surface analytics-surface-main">
                                    <header className="analytics-heading">
                                        <h1>Momentum is building</h1>
                                        <p>
                                            CTR at 12.38% with strongest volume
                                            from Feed. Focus on high-intent
                                            opens -&gt; messages to lift
                                            conversions
                                        </p>
                                    </header>

                                    <div
                                        className="analytics-tabs"
                                        role="tablist"
                                        aria-label="Analytics channels"
                                    >
                                        {CHANNELS.map(
                                            ({ label, icon: Icon }) => (
                                                <button
                                                    key={label}
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={
                                                        activeChannel === label
                                                    }
                                                    className={`analytics-tab ${
                                                        activeChannel === label
                                                            ? "is-active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setActiveChannel(label)
                                                    }
                                                >
                                                    <Icon
                                                        size={11}
                                                        strokeWidth={2}
                                                    />
                                                    <span>{label}</span>
                                                </button>
                                            ),
                                        )}
                                    </div>

                                    <div className="analytics-metrics-grid">
                                        {METRIC_CARDS.map((item) => (
                                            <article
                                                key={item.label}
                                                className="analytics-metric"
                                            >
                                                <span className="analytics-metric-label">
                                                    {item.label}
                                                </span>
                                                <strong className="analytics-metric-value">
                                                    {item.value}
                                                </strong>
                                                {item.note ? (
                                                    <p className="analytics-metric-note">
                                                        {item.note}
                                                    </p>
                                                ) : null}
                                            </article>
                                        ))}
                                    </div>
                                </section>

                                <aside className="analytics-surface analytics-surface-side">
                                    <header className="analytics-heading analytics-heading-side">
                                        <h2>Goals</h2>
                                        <p>Choose what success means</p>
                                    </header>

                                    <div className="analytics-side-stack">
                                        {GOAL_BLOCKS.map((item) => (
                                            <article
                                                key={item.title}
                                                className="analytics-side-card"
                                            >
                                                <span className="analytics-side-eyebrow">
                                                    {item.eyebrow}
                                                </span>
                                                <h3>{item.title}</h3>
                                                <p>{item.copy}</p>
                                            </article>
                                        ))}

                                        <article className="analytics-side-card analytics-health-card">
                                            <span className="analytics-side-eyebrow">
                                                Health checks
                                            </span>

                                            <div className="analytics-health-list">
                                                {HEALTH_ROWS.map((item) => (
                                                    <div
                                                        key={item.label}
                                                        className="analytics-health-item"
                                                    >
                                                        <div className="analytics-health-copy">
                                                            <strong>
                                                                {item.label}
                                                            </strong>
                                                            <p>{item.note}</p>
                                                        </div>
                                                        <span>
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </article>
                                    </div>
                                </aside>
                            </div>

                            <section className="analytics-surface analytics-performance-surface">
                                <header className="analytics-heading analytics-performance-heading">
                                    <h2>Performance</h2>
                                    <p>Services · Trend over time</p>
                                </header>

                                <div className="analytics-performance-layout">
                                    <div className="analytics-chart-panel">
                                        <div className="analytics-chart-wrap">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <AreaChart
                                                    data={PERFORMANCE_DATA}
                                                    margin={{
                                                        top: 8,
                                                        right: 6,
                                                        left: 8,
                                                        bottom: 8,
                                                    }}
                                                >
                                                    <defs>
                                                        <linearGradient
                                                            id="performanceArea"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#ceff1b"
                                                                stopOpacity={
                                                                    0.35
                                                                }
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="#ceff1b"
                                                                stopOpacity={
                                                                    0.02
                                                                }
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid
                                                        vertical={false}
                                                        stroke="#ecece5"
                                                    />
                                                    <XAxis
                                                        dataKey="day"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickMargin={12}
                                                        padding={{
                                                            left: 6,
                                                            right: 6,
                                                        }}
                                                        tick={{
                                                            fill:
                                                                theme === "dark"
                                                                    ? "#f0f0f0"
                                                                    : "#323232",
                                                            fontSize: 12,
                                                        }}
                                                        interval={1}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        domain={[0, 60000]}
                                                        ticks={[
                                                            0, 15000, 30000,
                                                            45000, 60000,
                                                        ]}
                                                        allowDecimals={false}
                                                        tickFormatter={(
                                                            value,
                                                        ) =>
                                                            value === 0
                                                                ? "0"
                                                                : `${(
                                                                      value /
                                                                      1000
                                                                  ).toFixed(
                                                                      1,
                                                                  )}K`
                                                        }
                                                        tick={{
                                                            fill:
                                                                theme === "dark"
                                                                    ? "#f0f0f0"
                                                                    : "#323232",
                                                            fontSize: 12,
                                                        }}
                                                        tickMargin={10}
                                                        width={52}
                                                    />
                                                    <Tooltip
                                                        formatter={(value) => [
                                                            `${(
                                                                Number(value) /
                                                                1000
                                                            ).toFixed(1)}K`,
                                                            "Trend",
                                                        ]}
                                                        contentStyle={{
                                                            borderRadius:
                                                                "10px",
                                                            border:
                                                                theme === "dark"
                                                                    ? "1px solid #444"
                                                                    : "1px solid #d6d6cf",
                                                            background:
                                                                theme === "dark"
                                                                    ? "#1e1e1e"
                                                                    : "#ffffff",
                                                            color:
                                                                theme === "dark"
                                                                    ? "#f0f0f0"
                                                                    : "#2f2f2f",
                                                            fontSize: "12px",
                                                        }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke="#c7ff00"
                                                        strokeWidth={3}
                                                        fill="url(#performanceArea)"
                                                        activeDot={{
                                                            r: 5,
                                                            fill: "#ffffff",
                                                            stroke: "#c7ff00",
                                                            strokeWidth: 2,
                                                        }}
                                                        dot={false}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <aside className="analytics-performance-side">
                                        <div className="analytics-snapshot-card">
                                            <div className="analytics-snapshot-head">
                                                <span>Snapshot</span>
                                                <span>All listings</span>
                                            </div>

                                            <div className="analytics-snapshot-list">
                                                {SNAPSHOT_ROWS.map((item) => (
                                                    <div
                                                        key={item.label}
                                                        className="analytics-snapshot-row"
                                                    >
                                                        <div className="analytics-snapshot-copy">
                                                            <strong>
                                                                {item.label}
                                                            </strong>
                                                            <p>{item.note}</p>
                                                        </div>
                                                        <span>
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="analytics-mini-snapshot-grid">
                                            {MINI_SNAPSHOT_ROWS.map((item) => (
                                                <article
                                                    key={item.label}
                                                    className="analytics-mini-snapshot"
                                                >
                                                    <span>{item.label}</span>
                                                    <strong>
                                                        {item.value}
                                                    </strong>
                                                    <p>{item.note}</p>
                                                </article>
                                            ))}
                                        </div>
                                    </aside>
                                </div>
                            </section>

                            <section className="analytics-source-duo">
                                <section className="analytics-surface analytics-source-surface analytics-source-panel">
                                    <header className="analytics-heading analytics-source-heading">
                                        <h2>Source mix</h2>
                                        <p>Where impressions are coming from</p>
                                    </header>

                                    <div className="analytics-source-content">
                                        <div className="analytics-source-pie">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Tooltip
                                                        formatter={(value) => [
                                                            `${value}%`,
                                                            "Value",
                                                        ]}
                                                        contentStyle={{
                                                            borderRadius:
                                                                "10px",
                                                            border:
                                                                theme === "dark"
                                                                    ? "1px solid #444"
                                                                    : "1px solid #d6d6cf",
                                                            background:
                                                                theme === "dark"
                                                                    ? "#1e1e1e"
                                                                    : "#ffffff",
                                                            color:
                                                                theme === "dark"
                                                                    ? "#f0f0f0"
                                                                    : "#2f2f2f",
                                                            fontSize: "12px",
                                                        }}
                                                    />
                                                    <Pie
                                                        data={SOURCE_MIX_DATA}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={78}
                                                        innerRadius={0}
                                                        paddingAngle={1}
                                                        stroke="none"
                                                    >
                                                        {SOURCE_MIX_DATA.map(
                                                            (entry) => (
                                                                <Cell
                                                                    key={
                                                                        entry.name
                                                                    }
                                                                    fill={
                                                                        entry.color
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="analytics-source-list">
                                            {SOURCE_MIX_DATA.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="analytics-source-row"
                                                >
                                                    <div className="analytics-source-name">
                                                        <span
                                                            className="analytics-source-dot"
                                                            style={{
                                                                backgroundColor:
                                                                    item.color,
                                                            }}
                                                        />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <strong>
                                                        {item.value}%
                                                    </strong>
                                                </div>
                                            ))}

                                            <div className="analytics-source-tip">
                                                <span>Tip</span>
                                                <p>
                                                    Boost tends to amplify what
                                                    already works. Watch CTR &
                                                    conversion before scaling
                                                    spend.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="analytics-surface analytics-source-surface analytics-source-panel analytics-source-panel-right">
                                    <div className="analytics-source-bars">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={SOURCE_BAR_DATA}
                                                margin={{
                                                    top: 10,
                                                    right: 14,
                                                    left: 0,
                                                    bottom: 6,
                                                }}
                                            >
                                                <XAxis
                                                    dataKey="label"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fill:
                                                            theme === "dark"
                                                                ? "#f0f0f0"
                                                                : "#323232",
                                                        fontSize: 9,
                                                    }}
                                                    interval={0}
                                                    tickMargin={8}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    domain={[0, 12]}
                                                    ticks={[0, 3, 6, 9, 12]}
                                                    tickFormatter={(value) =>
                                                        value === 0
                                                            ? "0"
                                                            : `${value.toFixed(1)}L`
                                                    }
                                                    tick={{
                                                        fill:
                                                            theme === "dark"
                                                                ? "#f0f0f0"
                                                                : "#323232",
                                                        fontSize: 9,
                                                    }}
                                                    width={36}
                                                    tickMargin={4}
                                                />
                                                <Tooltip
                                                    formatter={(value) => [
                                                        `${value}L`,
                                                        "Value",
                                                    ]}
                                                    contentStyle={{
                                                        borderRadius: "10px",
                                                        border:
                                                            theme === "dark"
                                                                ? "1px solid #444"
                                                                : "1px solid #d6d6cf",
                                                        background:
                                                            theme === "dark"
                                                                ? "#1e1e1e"
                                                                : "#ffffff",
                                                        color:
                                                            theme === "dark"
                                                                ? "#f0f0f0"
                                                                : "#2f2f2f",
                                                        fontSize: "12px",
                                                    }}
                                                    cursor={{
                                                        fill:
                                                            theme === "dark"
                                                                ? "rgba(255,255,255,0.08)"
                                                                : "rgba(206, 255, 27, 0.15)",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    radius={[4, 4, 0, 0]}
                                                    fill="#c7ff00"
                                                    barSize={20}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="analytics-source-cards">
                                        <div className="analytics-rates-card">
                                            <h3>Key rates</h3>
                                            <div className="analytics-rates-list">
                                                {KEY_RATE_ROWS.map((item) => (
                                                    <div
                                                        key={item.label}
                                                        className="analytics-rates-row"
                                                    >
                                                        <div>
                                                            <strong>
                                                                {item.label}
                                                            </strong>
                                                            <p>{item.note}</p>
                                                        </div>
                                                        <span>
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="analytics-next-card">
                                            <h3>Next action</h3>
                                            <p>
                                                Improve the biggest drop first.
                                                Most creators see the steepest
                                                drop between Opens -&gt;
                                                Messages.
                                            </p>

                                            <div className="analytics-next-actions">
                                                {NEXT_ACTIONS.map((action) => (
                                                    <button
                                                        key={action}
                                                        type="button"
                                                        className="analytics-next-button"
                                                    >
                                                        {action}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </section>

                            <section className="analytics-surface analytics-insights-surface mt-8">
                                <header className="analytics-heading analytics-insights-heading">
                                    <h2>Insights</h2>
                                    <p>Category-specific metrics</p>
                                </header>

                                <div className="analytics-insights-grid">
                                    {INSIGHTS_DATA.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.title}
                                                className="analytics-insight-card"
                                            >
                                                <div className="analytics-insight-icon">
                                                    <Icon
                                                        size={20}
                                                        strokeWidth={2}
                                                        color="#2f2f2f"
                                                    />
                                                </div>
                                                <div className="analytics-insight-info">
                                                    <span className="analytics-insight-title">
                                                        {item.title}
                                                    </span>
                                                    <strong className="analytics-insight-value">
                                                        {item.value}
                                                    </strong>
                                                    <p className="analytics-insight-note">
                                                        {item.note}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="analytics-insights-bottom">
                                    <div className="analytics-breakdown-card">
                                        <h3>Earnings breakdown</h3>
                                        <div className="analytics-breakdown-list">
                                            {EARNINGS_BREAKDOWN.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="analytics-rates-row"
                                                >
                                                    <div>
                                                        <strong>
                                                            {item.label}
                                                        </strong>
                                                        <p>{item.note}</p>
                                                    </div>
                                                    <span>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="analytics-ops-card">
                                        <h3>Ops health</h3>
                                        <div className="analytics-ops-list">
                                            {OPS_HEALTH_DATA.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="analytics-rates-row"
                                                >
                                                    <div>
                                                        <strong>
                                                            {item.label}
                                                        </strong>
                                                        <p>{item.note}</p>
                                                    </div>
                                                    <span>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="analytics-surface analytics-boost-surface mt-8">
                                <header className="analytics-heading analytics-boost-heading">
                                    <h2>Boost performance</h2>
                                    <p>Paid amplification efficiency</p>
                                </header>

                                <div className="analytics-boost-grid">
                                    {BOOST_METRICS.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.title}
                                                className="analytics-insight-card"
                                            >
                                                <div className="analytics-insight-icon">
                                                    <Icon
                                                        size={18}
                                                        strokeWidth={2}
                                                        color="#2f2f2f"
                                                    />
                                                </div>
                                                <div className="analytics-insight-info">
                                                    <span className="analytics-insight-title">
                                                        {item.title}
                                                    </span>
                                                    <strong className="analytics-insight-value">
                                                        {item.value}
                                                    </strong>
                                                    <p className="analytics-insight-note">
                                                        {item.note}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="analytics-boost-bottom">
                                    <div className="analytics-breakdown-card">
                                        <header className="analytics-heading">
                                            <h2>Scaling checklist</h2>
                                            <p>Paid amplification efficiency</p>
                                        </header>
                                        <div className="analytics-checklist-list">
                                            {SCALING_CHECKLIST.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="analytics-checklist-row"
                                                >
                                                    <div>
                                                        <strong>
                                                            {item.label}
                                                        </strong>
                                                        <p>{item.note}</p>
                                                    </div>
                                                    <div
                                                        className={`analytics-status-icon is-${item.status}`}
                                                    >
                                                        {item.status ===
                                                        "success" ? (
                                                            <Check
                                                                size={16}
                                                                strokeWidth={4}
                                                                color="#ffffff"
                                                            />
                                                        ) : (
                                                            <svg
                                                                width="22"
                                                                height="22"
                                                                viewBox="0 0 24 24"
                                                                fill="#ffe100"
                                                                stroke="#262626"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                                                <path d="M12 9v4" />
                                                                <path d="M12 17h.01" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="analytics-breakdown-card">
                                        <header className="analytics-heading">
                                            <h2>Boost performance</h2>
                                            <p>Paid amplification efficiency</p>
                                        </header>

                                        <div className="analytics-tactics-chips">
                                            {BOOST_TACTICS.map((tactic) => (
                                                <button
                                                    key={tactic}
                                                    type="button"
                                                    className="analytics-next-button"
                                                >
                                                    {tactic}
                                                </button>
                                            ))}
                                        </div>

                                        <p className="analytics-boost-tip">
                                            Start with high-intent sources
                                            (Search/Profile) before broad reach.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="analytics-surface analytics-audience-surface mt-8">
                                <header className="analytics-heading analytics-audience-heading">
                                    <h2>Audience</h2>
                                    <p>Who is engaging with your offers</p>
                                </header>

                                <div className="analytics-audience-grid">
                                    {AUDIENCE_DATA.map((card) => (
                                        <div
                                            key={card.title}
                                            className="analytics-audience-card"
                                        >
                                            <h3>{card.title}</h3>
                                            <div className="analytics-audience-list">
                                                {card.rows.map((row) => (
                                                    <div
                                                        key={row.label}
                                                        className="analytics-audience-row"
                                                    >
                                                        <div className="analytics-audience-row-header">
                                                            <span>
                                                                {row.label}
                                                            </span>
                                                            <strong>
                                                                {row.value}%
                                                            </strong>
                                                        </div>
                                                        <div className="analytics-audience-progress">
                                                            <div
                                                                className="analytics-audience-progress-bar"
                                                                style={{
                                                                    width: `${row.value}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="analytics-surface analytics-listings-surface mt-8">
                                <header className="analytics-heading analytics-listings-heading">
                                    <h2>Top listings</h2>
                                    <p>What is driving results</p>
                                </header>
                                <div className="analytics-table-container">
                                    <table className="analytics-table">
                                        <thead>
                                            <tr>
                                                <th>Listing</th>
                                                <th>CTR</th>
                                                <th>Conversion</th>
                                                <th>Value</th>
                                                <th>Leads</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TOP_LISTINGS_DATA.map(
                                                (item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.title}</td>
                                                        <td>{item.ctr}</td>
                                                        <td>{item.conv}</td>
                                                        <td>{item.value}</td>
                                                        <td>{item.leads}</td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="analytics-surface analytics-definitions-surface mt-8 mb-8">
                                <header className="analytics-heading analytics-definitions-heading">
                                    <h2>Definitions</h2>
                                    <p>
                                        Quick reference for common Ultra Hustle
                                        metrics.
                                    </p>
                                </header>

                                <div className="analytics-definitions-grid">
                                    {DEFINITIONS_DATA.map((card) => (
                                        <div
                                            key={card.title}
                                            className="analytics-definition-card"
                                        >
                                            <h3>{card.title}</h3>
                                            <div className="analytics-definition-list">
                                                {card.items.map((item) => (
                                                    <div
                                                        key={item.label}
                                                        className="analytics-definition-row"
                                                    >
                                                        <div className="analytics-definition-info">
                                                            <strong>
                                                                {item.label}
                                                            </strong>
                                                            <p>{item.note}</p>
                                                        </div>
                                                        <div className="analytics-definition-value">
                                                            <strong>
                                                                {item.value}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
