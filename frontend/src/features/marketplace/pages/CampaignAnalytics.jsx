import React, { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
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
    { label: "Spend", value: "\u20B96,553" },
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

const goalMetrics = [
    { label: "Impressions", value: "21,307" },
    { label: "Reach", value: "8,097" },
    { label: "Clicks", value: "1,619" },
    { label: "CTR", value: "7.6%" },
    { label: "Leads", value: "150" },
    { label: "CPL", value: "\u20B944" },
    { label: "Spend", value: "\u20B96,553" },
    { label: "CPC", value: "\u20B94" },
];

const placementChartData = [
    { placement: "Marketplace feed", primary: 12400, secondary: 2100 },
    { placement: "Search results", primary: 9200, secondary: 1600 },
    { placement: "Related listings", primary: 4100, secondary: 780 },
];

const placementTableRows = [
    {
        placement: "Marketplace feed",
        impressions: "12,400",
        clicks: "980",
        ctr: "7.9%",
        conversions: "62",
        cpc: "\u20B93.8",
        spend: "\u20B93,720",
    },
    {
        placement: "Search results",
        impressions: "9,200",
        clicks: "510",
        ctr: "5.5%",
        conversions: "58",
        cpc: "\u20B94.2",
        spend: "\u20B92,142",
    },
    {
        placement: "Related listings",
        impressions: "4,100",
        clicks: "129",
        ctr: "3.1%",
        conversions: "30",
        cpc: "\u20B95.1",
        spend: "\u20B9659",
    },
];

const audienceRows = [
    {
        country: "India",
        device: "Mobile",
        userType: "Founders",
        reach: "3,420",
        clicks: "412",
        conversions: "48",
        spend: "\u20B91,890",
        costPerResult: "\u20B939",
        revenue: "\u20B912,400",
    },
    {
        country: "UAE",
        device: "Desktop",
        userType: "Small business owners",
        reach: "1,980",
        clicks: "186",
        conversions: "22",
        spend: "\u20B9980",
        costPerResult: "\u20B945",
        revenue: "\u20B96,200",
    },
    {
        country: "US",
        device: "Tablet",
        userType: "Agencies",
        reach: "1,540",
        clicks: "142",
        conversions: "18",
        spend: "\u20B91,120",
        costPerResult: "\u20B962",
        revenue: "\u20B99,800",
    },
    {
        country: "UK",
        device: "Mobile",
        userType: "Clients",
        reach: "1,157",
        clicks: "98",
        conversions: "12",
        spend: "\u20B9740",
        costPerResult: "\u20B962",
        revenue: "\u20B94,100",
    },
];

const aiRecommendations = [
    "Your CTR is strong — consider increasing budget to scale results.",
    "Cost per result is efficient — extending by 7 days is likely worth it.",
    "Related listings is outperforming other placements — shift more delivery there.",
    "UK audiences are converting best — keep them included for the next run.",
];

const audienceFieldDefs = [
    { key: "country", label: "Country" },
    { key: "device", label: "Device" },
    { key: "userType", label: "User type" },
    { key: "reach", label: "Reach" },
    { key: "clicks", label: "Clicks" },
    { key: "conversions", label: "Conversions" },
    { key: "spend", label: "Spend" },
    { key: "costPerResult", label: "Cost/Result" },
    { key: "revenue", label: "Revenue" },
];

const boostPerformanceRows = [
    { label: "Impressions", value: "21,307", progress: 46 },
    { label: "Listing Opens", value: "1,619", progress: 72 },
    { label: "Engagement", value: "453", progress: 42 },
    { label: "Start", value: "146", progress: 24 },
    { label: "Conversion", value: "150", progress: 24 },
];

const boostedVsOrganic = [
    {
        title: "Organic (30d)",
        metrics: [
            { label: "Impressions", value: "280" },
            { label: "Clicks", value: "18" },
            { label: "Conversions", value: "2" },
            { label: "Conv. Rate", value: "1.8%" },
        ],
    },
    {
        title: "Boosted (selected range)",
        metrics: [
            { label: "Impressions", value: "21,307" },
            { label: "Clicks", value: "1,619" },
            { label: "Conversions", value: "150" },
            { label: "Conv. Rate", value: "9.3%" },
        ],
    },
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
                                                    ticks={[
                                                        0, 90, 180, 270, 360,
                                                    ]}
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
                                                    cursor={{
                                                        stroke: "#b6ea00",
                                                        strokeWidth: 1,
                                                        opacity: 0.35,
                                                    }}
                                                    contentStyle={{
                                                        border: "1px solid #d4ff32",
                                                        borderRadius: "8px",
                                                        background: "#efefef",
                                                        color: "#111",
                                                        fontSize: "12px",
                                                    }}
                                                    labelStyle={{
                                                        color: "#555",
                                                        fontWeight: 600,
                                                    }}
                                                    formatter={(value) => [
                                                        value,
                                                        "Value",
                                                    ]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </section>

                            <section
                                className="ca-dashboard-grid"
                                aria-label="Goal and audience analytics"
                            >
                                <div className="ca-dashboard-main">
                                    <article className="ca-surface-card">
                                        <h2 className="ca-surface-title">
                                            Goal achievement
                                        </h2>
                                        <p className="ca-surface-subtitle">
                                            Goal-aware metrics for: Leads
                                        </p>
                                        <div className="ca-goal-metrics-grid">
                                            {goalMetrics.map((m) => (
                                                <div
                                                    key={m.label}
                                                    className="ca-goal-metric-cell"
                                                >
                                                    <span className="ca-goal-metric-label">
                                                        {m.label}
                                                    </span>
                                                    <strong className="ca-goal-metric-value">
                                                        {m.value}
                                                    </strong>
                                                </div>
                                            ))}
                                        </div>
                                    </article>

                                    <article className="ca-surface-card">
                                        <h2 className="ca-surface-title">
                                            Goal achievement
                                        </h2>
                                        <p className="ca-surface-subtitle">
                                            Goal-aware metrics for: Leads
                                        </p>
                                        <div className="ca-bar-chart-wrap">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                                minHeight={240}
                                            >
                                                <BarChart
                                                    data={placementChartData}
                                                    margin={{
                                                        top: 4,
                                                        right: 12,
                                                        left: 4,
                                                        bottom: 0,
                                                    }}
                                                    barCategoryGap="18%"
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        vertical={false}
                                                        stroke="rgba(0,0,0,0.08)"
                                                    />
                                                    <XAxis
                                                        dataKey="placement"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickMargin={10}
                                                        interval={0}
                                                        height={56}
                                                        tick={{
                                                            fill: "#444",
                                                            fontSize: 11,
                                                        }}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickMargin={8}
                                                        width={44}
                                                        tick={{
                                                            fill: "#444",
                                                            fontSize: 12,
                                                        }}
                                                    />
                                                    <Tooltip
                                                        cursor={{
                                                            fill: "rgba(212,255,50,0.12)",
                                                        }}
                                                        contentStyle={{
                                                            border: "1px solid #d4ff32",
                                                            borderRadius: "8px",
                                                            background: "#fff",
                                                            color: "#111",
                                                            fontSize: "12px",
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="primary"
                                                        name="Volume"
                                                        fill="#d4ff32"
                                                        radius={[4, 4, 0, 0]}
                                                        maxBarSize={36}
                                                    />
                                                    <Bar
                                                        dataKey="secondary"
                                                        name="Engagement"
                                                        fill="#9bc700"
                                                        radius={[4, 4, 0, 0]}
                                                        maxBarSize={36}
                                                        opacity={0.85}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </article>

                                    <article className="ca-surface-card">
                                        <div className="ca-table-scroll">
                                            <table className="ca-data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Placement</th>
                                                        <th>Impressions</th>
                                                        <th>Clicks</th>
                                                        <th>CTR</th>
                                                        <th>Conversions</th>
                                                        <th>CPC</th>
                                                        <th>Spend</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {placementTableRows.map(
                                                        (row) => (
                                                            <tr
                                                                key={
                                                                    row.placement
                                                                }
                                                            >
                                                                <td>
                                                                    {
                                                                        row.placement
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        row.impressions
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {row.clicks}
                                                                </td>
                                                                <td>
                                                                    {row.ctr}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        row.conversions
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {row.cpc}
                                                                </td>
                                                                <td>
                                                                    {row.spend}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </article>

                                    <article className="ca-surface-card">
                                        <h2 className="ca-surface-title">
                                            Who engaged with your boost
                                        </h2>
                                        <p className="ca-surface-subtitle">
                                            Audience breakdown
                                        </p>
                                        <div className="ca-table-scroll ca-audience-table-wrap">
                                            <table className="ca-data-table">
                                                <thead>
                                                    <tr>
                                                        {audienceFieldDefs.map(
                                                            (c) => (
                                                                <th key={c.key}>
                                                                    {c.label}
                                                                </th>
                                                            ),
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {audienceRows.map(
                                                        (row, idx) => (
                                                            <tr
                                                                key={`${row.country}-${idx}`}
                                                            >
                                                                {audienceFieldDefs.map(
                                                                    (c) => (
                                                                        <td
                                                                            key={
                                                                                c.key
                                                                            }
                                                                            data-label={
                                                                                c.label
                                                                            }
                                                                        >
                                                                            {
                                                                                row[
                                                                                    c
                                                                                        .key
                                                                                ]
                                                                            }
                                                                        </td>
                                                                    ),
                                                                )}
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="ca-audience-cards">
                                            {audienceRows.map((row, idx) => (
                                                <div
                                                    className="ca-audience-card"
                                                    key={`aud-card-${idx}`}
                                                >
                                                    {audienceFieldDefs.map(
                                                        (c) => (
                                                            <div
                                                                className="ca-audience-card-row"
                                                                key={c.key}
                                                            >
                                                                <span>
                                                                    {c.label}
                                                                </span>
                                                                <strong>
                                                                    {row[c.key]}
                                                                </strong>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                </div>

                                <aside className="ca-dashboard-sidebar">
                                    <article className="ca-surface-card">
                                        <h2 className="ca-surface-title">
                                            What Ultra Hustle recommends
                                        </h2>
                                        <p className="ca-surface-subtitle">
                                            AI insights (mock)
                                        </p>
                                        <ul className="ca-ai-list">
                                            {aiRecommendations.map(
                                                (text, i) => (
                                                    <li
                                                        key={i}
                                                        className="ca-ai-bubble"
                                                    >
                                                        {text}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </article>

                                    <article className="ca-surface-card">
                                        <h2 className="ca-surface-title">
                                            Action panel
                                        </h2>
                                        <p className="ca-surface-subtitle">
                                            Do next — not just numbers
                                        </p>
                                        <div className="ca-action-stack">
                                            <button
                                                type="button"
                                                className="ca-action-btn ca-action-btn-primary"
                                            >
                                                Extend Campaign
                                            </button>
                                            <button
                                                type="button"
                                                className="ca-action-btn ca-action-btn-primary"
                                            >
                                                Pause Campaign
                                            </button>
                                            <button
                                                type="button"
                                                className="ca-action-btn ca-action-btn-primary"
                                            >
                                                Duplicate Campaign
                                            </button>
                                            <button
                                                type="button"
                                                className="ca-action-btn ca-action-btn-muted"
                                            >
                                                Stop Campaign
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className="ca-boost-link"
                                        >
                                            Boost another listing
                                        </button>
                                    </article>

                                    <article className="ca-surface-card">
                                        <h2 className="ca-surface-title">
                                            Export
                                        </h2>
                                        <p className="ca-surface-subtitle">
                                            Report export placeholder
                                        </p>
                                        <p className="ca-export-note">
                                            Add CSV/PDF export (server-side) +
                                            email report scheduling.
                                        </p>
                                    </article>
                                </aside>
                            </section>
                            <article className="ca-surface-card ca-boost-performance mt-4">
                                <h2 className="ca-surface-title">
                                    Boost performance
                                </h2>
                                <p className="ca-surface-subtitle">
                                    Paid amplification efficiency
                                </p>

                                <div className="ca-boost-grid-container">
                                    <div className="ca-boost-left-section">
                                        {boostPerformanceRows.map((row) => (
                                            <div
                                                key={row.label}
                                                className="ca-boost-row"
                                            >
                                                <div className="ca-boost-row-header">
                                                    <span className="ca-boost-label">
                                                        {row.label}
                                                    </span>
                                                    <span className="ca-boost-value">
                                                        {row.value}
                                                    </span>
                                                </div>
                                                <div className="ca-boost-progress">
                                                    <div
                                                        className="ca-boost-progress-fill"
                                                        style={{
                                                            width: `${row.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="ca-boost-right-section">
                                        <h3 className="ca-boost-heading">
                                            Interpretation
                                        </h3>
                                        <p className="ca-boost-text">
                                            If impressions — opens is low,
                                            improve thumbnail/title first. If
                                            opens — start is low, clarify
                                            pricing and deliverables. If start —
                                            conversion is low, simplify
                                            checkout/inquiry flow.
                                        </p>
                                        <div className="ca-boost-tags">
                                            <span className="ca-boost-tag">
                                                Action-oriented
                                            </span>
                                            <span className="ca-boost-tag">
                                                Goal-aware
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <article className="ca-surface-card ca-boosted-vs-organic mt-4">
                                <h2 className="ca-surface-title">
                                    Boosted vs Organic
                                </h2>
                                <p className="ca-surface-subtitle">
                                    Comparison against organic performance
                                </p>

                                <div className="ca-compare-grid">
                                    {boostedVsOrganic.map((group) => (
                                        <div
                                            key={group.title}
                                            className="ca-compare-panel"
                                        >
                                            <h3 className="ca-compare-title">
                                                {group.title}
                                            </h3>
                                            <div className="ca-compare-metrics">
                                                {group.metrics.map((metric) => (
                                                    <div
                                                        key={metric.label}
                                                        className="ca-compare-metric"
                                                    >
                                                        <span>
                                                            {metric.label}
                                                        </span>
                                                        <strong>
                                                            {metric.value}
                                                        </strong>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
