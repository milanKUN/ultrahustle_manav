import React, { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./CampaignAnalytics.css";
import "../../../Darkuser.css";

const summaryCards = [
    { label: "Spend", value: "₹6,553" },
    { label: "Impressions", value: "21,307" },
    { label: "Reach", value: "8,097" },
    { label: "Clicks", value: "1,619" },
    { label: "CTR", value: "7.6%" },
];

const trendData = [
    { day: "D1", value: 180 },
    { day: "D2", value: 150 },
    { day: "D3", value: 245 },
    { day: "D4", value: 205 },
    { day: "D5", value: 245 },
    { day: "D6", value: 185 },
    { day: "D7", value: 295 },
];

export default function CampaignAnalytics({ theme, setTheme }) {
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

    return (
        <div className={`campaign-analytics-layout user-page ${theme}`}>
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="campaign-analytics-body">
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

                <main className="campaign-analytics-main">
                    <div className="campaign-analytics-scroll">
                        <section className="campaign-analytics-container">
                            <header className="ca-header">
                                <div>
                                    <h1 className="ca-title">
                                        SaaS Landing - Lead Boost
                                    </h1>
                                    <p className="ca-subtitle">
                                        SaaS Landing - Lead Boost
                                    </p>
                                </div>

                                <div className="ca-header-actions">
                                    <span className="ca-link">
                                        Boost Campaigns
                                    </span>
                                    <button className="ca-btn-new">
                                        New Boost
                                    </button>
                                </div>
                            </header>

                            <div className="ca-stats-grid">
                                {summaryCards.map((card, index) => (
                                    <article
                                        key={`${card.label}-${index}`}
                                        className="ca-stat-card"
                                    >
                                        <span className="ca-stat-label">
                                            {card.label}
                                        </span>
                                        <strong className="ca-stat-value">
                                            {card.value}
                                        </strong>
                                    </article>
                                ))}
                            </div>

                            <div className="ca-stats-grid secondary">
                                {summaryCards.map((card, index) => (
                                    <article
                                        key={`${card.label}-secondary-${index}`}
                                        className="ca-stat-card"
                                    >
                                        <span className="ca-stat-label">
                                            {card.label}
                                        </span>
                                        <strong className="ca-stat-value">
                                            {card.value}
                                        </strong>
                                    </article>
                                ))}
                            </div>

                            <section className="ca-performance-card">
                                <h2 className="ca-performance-title">
                                    Performance
                                </h2>
                                <p className="ca-performance-subtitle">
                                    Services - Trend over time
                                </p>

                                <div className="ca-chart-wrap">
                                    <div className="ca-chart-area">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart
                                                data={trendData}
                                                margin={{
                                                    top: 10,
                                                    right: 16,
                                                    left: 12,
                                                    bottom: 8,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="caAreaFill"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#d4ff32"
                                                            stopOpacity={0.22}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#d4ff32"
                                                            stopOpacity={0.05}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="0"
                                                    vertical={false}
                                                    stroke="transparent"
                                                />
                                                <XAxis
                                                    dataKey="day"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickMargin={12}
                                                />
                                                <YAxis
                                                    domain={[0, 360]}
                                                    ticks={[0, 90, 180, 270, 360]}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    width={52}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#b6ea00"
                                                    strokeWidth={4}
                                                    fill="url(#caAreaFill)"
                                                    dot={false}
                                                    activeDot={false}
                                                />
                                                <Tooltip
                                                    cursor={{ stroke: "#b6ea00", strokeWidth: 1, opacity: 0.35 }}
                                                    contentStyle={{
                                                        border: "1px solid #d4ff32",
                                                        borderRadius: "8px",
                                                        background: "#efefef",
                                                        color: "#111",
                                                        fontSize: "12px",
                                                    }}
                                                    labelStyle={{ color: "#555", fontWeight: 600 }}
                                                    formatter={(value) => [value, "Value"]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
