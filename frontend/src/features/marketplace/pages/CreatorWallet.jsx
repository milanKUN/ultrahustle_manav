import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    ChevronDown,
    CreditCard,
    Landmark,
    Plus,
    Search,
    Wallet,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "./CreatorWallet.css";

const SUMMARY_CARDS = [
    { label: "Total Balance", value: "Rs 2,40,000" },
    { label: "Available", value: "Rs 40,000" },
    { label: "In Escrow", value: "Rs 10,000" },
    { label: "Upcoming", value: "Rs 8,900" },
];

const HIGHLIGHT_CARDS = [
    {
        label: "Available Balance",
        value: "Rs 12,540",
        badge: "Up",
        badgeTone: "up",
        note: "Updated just now",
        spark: [34, 36, 40, 44, 42, 39, 41, 45, 43, 37],
    },
    {
        label: "In Escrow (on hold )",
        value: "Rs 12,540",
        badge: "Stable",
        badgeTone: "stable",
        note: "Includes active contracts",
        spark: [48, 46, 42, 41, 43, 47, 49, 44, 41, 36],
    },
    {
        label: "Total Balance",
        value: "Rs 2,40,000",
        note: "",
        spark: [56, 38, 35, 34, 41, 47, 52, 56, 61, 58],
        filled: true,
    },
];

const EARNINGS_FILTERS = [
    "Service",
    "Digital Products",
    "Teams",
    "Courses",
    "Webinars",
];

const transactions = [
    {
        date: "10 Dec 2025",
        type: "Earning-\nService",
        description: "Service Order\n#LH-239 -\nLogo Design",
        listing: "UH - 129",
        gross: "Rs 12,500",
        fee: "Rs 500",
    },
    {
        date: "10 Dec 2025",
        type: "Boost\nspent",
        description: "Service Order\n#LH-239 -\nLogo Design",
        listing: "UH - 129",
        gross: "Rs 12,500",
        fee: "Rs 500",
    },
    {
        date: "10 Dec 2025",
        type: "Fee",
        description: "Service Order\n#LH-239 -\nLogo Design",
        listing: "UH - 129",
        gross: "Rs 12,500",
        fee: "Rs 500",
    },
];

const PAYMENT_HISTORY = [
    {
        date: "3 Dec 2025",
        amount: "Rs 12,500",
        method: "Bank(HDFC****4321)",
        reference: "WTX-193",
        status: "Completed",
    },
];

const boostBars = [42, 58, 33, 49, 37, 64, 44, 52];

const highlightChartData = HIGHLIGHT_CARDS.map((card) => ({
    ...card,
    chartData: card.spark.map((value, index) => ({
        name: `P${index + 1}`,
        value,
    })),
}));

const earningsChartData = [
    { name: "Last", amount: 12400 },
    { name: "This Month", amount: 42800 },
];

const boostChartData = [
    { name: "1 Dec", value: boostBars[0] },
    { name: "8 Dec", value: boostBars[1] },
    { name: "10 Dec", value: boostBars[2] },
    { name: "13 Dec", value: boostBars[3] },
    { name: "16 Dec", value: boostBars[4] },
    { name: "20 Dec", value: boostBars[5] },
    { name: "22 Dec", value: boostBars[6] },
    { name: "25 Dec", value: boostBars[7] },
];

const chartMargin = { top: 4, right: 0, left: 0, bottom: 0 };

function CreatorWallet({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [earningsFilter, setEarningsFilter] = useState("Service");
    const [transactionMonth, setTransactionMonth] = useState("This Month");
    const [transactionType, setTransactionType] = useState("All");
    const [payoutMethod, setPayoutMethod] = useState("UPI");
    const [walletSearch, setWalletSearch] = useState("");
    const [fundAmount, setFundAmount] = useState("0");
    const [withdrawAmount, setWithdrawAmount] = useState("12540");
    const isDark = String(theme).toLowerCase() === "dark";

    useEffect(() => {
        setSidebarOpen(false);
        setShowSettings(false);
    }, []);

    const filteredTransactions = useMemo(() => {
        const query = walletSearch.trim().toLowerCase();

        return transactions.filter((item) => {
            const matchesType =
                transactionType === "All" ||
                item.type
                    .replace("\n", " ")
                    .toLowerCase()
                    .includes(transactionType.toLowerCase());

            const matchesSearch =
                !query ||
                item.description.toLowerCase().includes(query) ||
                item.listing.toLowerCase().includes(query);

            return matchesType && matchesSearch;
        });
    }, [transactionType, walletSearch]);

    return (
        <div
            className={`creator-wallet-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}
        >
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                theme={theme}
                onDropdownChange={setIsDropdownOpen}
            />

            <div className="pt-[85px] flex relative w-full">
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
                    <div className="relative overflow-y-auto h-[calc(100vh-85px)] w-full">
                        <main
                            className={`creator-wallet-main ${isDropdownOpen ? "blurred" : ""}`}
                        >
                            <div className="creator-wallet-shell">
                                <section className="creator-wallet-header">
                                    <div>
                                        <h1 className="creator-wallet-title">
                                            Payouts &amp; Wallets
                                        </h1>
                                        <p className="creator-wallet-subtitle">
                                            Track your earnings, balances, fees,
                                            and withdrawals.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="creator-wallet-manageBtn"
                                    >
                                        <CreditCard size={16} />
                                        <span>Manage Payment Method</span>
                                    </button>
                                </section>

                                <section className="creator-wallet-summaryGrid">
                                    {SUMMARY_CARDS.map((card) => (
                                        <article
                                            key={card.label}
                                            className="creator-wallet-summaryCard"
                                        >
                                            <span>{card.label}</span>
                                            <strong>{card.value}</strong>
                                        </article>
                                    ))}
                                </section>

                                <section className="creator-wallet-highlightGrid">
                                    {highlightChartData.map((card) => (
                                        <article
                                            key={card.label}
                                            className={`creator-wallet-panel creator-wallet-balanceCard ${card.filled ? "filled" : ""}`}
                                        >
                                            <span className="creator-wallet-cardLabel">
                                                {card.label}
                                            </span>
                                            <div className="creator-wallet-balanceValueRow">
                                                <strong>{card.value}</strong>
                                                {card.badge ? (
                                                    <span
                                                        className={`creator-wallet-miniBadge ${card.badgeTone || ""}`}
                                                    >
                                                        {card.badge}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="creator-wallet-sparkline">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                    className="creator-wallet-chartScope"
                                                >
                                                    {card.filled ? (
                                                        <AreaChart
                                                            data={
                                                                card.chartData
                                                            }
                                                            margin={chartMargin}
                                                        >
                                                            <Tooltip
                                                                cursor={false}
                                                                contentStyle={{
                                                                    display:
                                                                        "none",
                                                                }}
                                                                wrapperStyle={{
                                                                    display:
                                                                        "none",
                                                                }}
                                                            />
                                                            <Area
                                                                type="monotone"
                                                                dataKey="value"
                                                                stroke="#4a4a4a"
                                                                fill="#4a4a4a"
                                                                fillOpacity={
                                                                    0.92
                                                                }
                                                                strokeWidth={2}
                                                                dot={false}
                                                            />
                                                        </AreaChart>
                                                    ) : (
                                                        <LineChart
                                                            data={
                                                                card.chartData
                                                            }
                                                            margin={chartMargin}
                                                        >
                                                            <Tooltip
                                                                cursor={false}
                                                                contentStyle={{
                                                                    display:
                                                                        "none",
                                                                }}
                                                                wrapperStyle={{
                                                                    display:
                                                                        "none",
                                                                }}
                                                            />
                                                            <Line
                                                                type="monotone"
                                                                dataKey="value"
                                                                stroke="#3d3d3d"
                                                                strokeWidth={2}
                                                                dot={false}
                                                                activeDot={
                                                                    false
                                                                }
                                                            />
                                                        </LineChart>
                                                    )}
                                                </ResponsiveContainer>
                                            </div>

                                            {card.note ? (
                                                <p className="creator-wallet-note">
                                                    {card.note}
                                                </p>
                                            ) : null}
                                        </article>
                                    ))}
                                </section>

                                <section className="creator-wallet-contentGrid">
                                    <div className="creator-wallet-contentMain">
                                        <section className="creator-wallet-panel creator-wallet-overviewCard">
                                            <div className="creator-wallet-sectionHead">
                                                <div>
                                                    <h2>Earnings Overview</h2>
                                                    <p>
                                                        See where your money is
                                                        coming from.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="creator-wallet-chipRow">
                                                {EARNINGS_FILTERS.map(
                                                    (filter) => (
                                                        <button
                                                            key={filter}
                                                            type="button"
                                                            className={`creator-wallet-chip ${earningsFilter === filter ? "active" : ""}`}
                                                            onClick={() =>
                                                                setEarningsFilter(
                                                                    filter,
                                                                )
                                                            }
                                                        >
                                                            {filter}
                                                        </button>
                                                    ),
                                                )}
                                            </div>

                                            <div className="creator-wallet-earningsStats">
                                                <div>
                                                    <span>This Month</span>
                                                    <strong>Rs 42,800</strong>
                                                </div>
                                                <div>
                                                    <span>Last Month</span>
                                                    <strong>Rs 12,400</strong>
                                                </div>
                                                <div className="creator-wallet-growthStat">
                                                    <span className="creator-wallet-growthBadge">
                                                        +9%
                                                    </span>
                                                    <small>Vs Last Month</small>
                                                </div>
                                            </div>

                                            <div
                                                className="creator-wallet-barChart"
                                                aria-label="Earnings bar chart"
                                            >
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                    className="creator-wallet-chartScope"
                                                >
                                                    <BarChart
                                                        data={earningsChartData}
                                                        barCategoryGap="24%"
                                                        margin={{
                                                            top: 10,
                                                            right: 0,
                                                            left: -18,
                                                            bottom: 0,
                                                        }}
                                                    >
                                                        <CartesianGrid
                                                            vertical={false}
                                                            stroke="transparent"
                                                        />
                                                        <XAxis
                                                            dataKey="name"
                                                            axisLine={{
                                                                stroke: "#8c8c8c",
                                                                strokeWidth: 1.5,
                                                            }}
                                                            tickLine={false}
                                                            tick={{
                                                                fill: "#7b7b7b",
                                                                fontSize: 13,
                                                            }}
                                                        />
                                                        <YAxis
                                                            hide
                                                            domain={[0, 50000]}
                                                        />
                                                        <Tooltip
                                                            cursor={false}
                                                            formatter={(
                                                                value,
                                                            ) => [
                                                                `Rs ${value.toLocaleString("en-IN")}`,
                                                                "Earnings",
                                                            ]}
                                                            contentStyle={{
                                                                borderRadius: 10,
                                                                border: "1px solid #d8ef73",
                                                                background:
                                                                    "#ffffff",
                                                            }}
                                                        />
                                                        <Bar
                                                            dataKey="amount"
                                                            radius={[
                                                                0, 0, 0, 0,
                                                            ]}
                                                            maxBarSize={124}
                                                            activeBar={{
                                                                stroke: "none",
                                                                fillOpacity: 0.96,
                                                            }}
                                                        >
                                                            {earningsChartData.map(
                                                                (entry) => (
                                                                    <Cell
                                                                        key={
                                                                            entry.name
                                                                        }
                                                                        fill={
                                                                            entry.name ===
                                                                            "This Month"
                                                                                ? "#767676"
                                                                                : "#8c8c8c"
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </section>

                                        <section
                                            className={`rounded-[20px] border px-6 py-5 shadow-[0_20px_40px_rgba(31,31,31,0.06)] ${
                                                isDark
                                                    ? "border-[rgba(214,255,31,0.5)] bg-[#000000]"
                                                    : "!border-[#d8ef73] bg-[rgba(255,255,255,0.88)]"
                                            }`}
                                        >
                                            <div className="mb-4">
                                                <h2
                                                    className={`m-0 text-[28px] font-bold leading-tight ${
                                                        isDark
                                                            ? "text-[#f4f4f4]"
                                                            : "text-[#2f2f2f]"
                                                    }`}
                                                >
                                                    Transactions
                                                </h2>
                                                <p
                                                    className={`mt-2 text-[12px] leading-[1.45] ${
                                                        isDark
                                                            ? "text-[#b8b8b8]"
                                                            : "text-[#777777]"
                                                    }`}
                                                >
                                                    Amounts show gross, fee, and
                                                    net per transaction.
                                                </p>
                                            </div>

                                            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[152px_152px_minmax(0,1fr)]">
                                                <div className="relative">
                                                    <select
                                                        value={transactionMonth}
                                                        onChange={(event) =>
                                                            setTransactionMonth(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className={`h-10 w-full appearance-none rounded-[7px] border px-3 pr-9 text-[12px] outline-none ${
                                                            isDark
                                                                ? "border-[rgba(214,255,31,0.36)] bg-[#0b0b0b] text-[#f1f1f1]"
                                                                : "border-[#bdbdbd] bg-white text-[#2f2f2f]"
                                                        }`}
                                                    >
                                                        <option>
                                                            This Month
                                                        </option>
                                                        <option>
                                                            Last Month
                                                        </option>
                                                        <option>
                                                            This Year
                                                        </option>
                                                    </select>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                                                            isDark
                                                                ? "text-[#b5b5b5]"
                                                                : "text-[#444444]"
                                                        }`}
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <select
                                                        value={transactionType}
                                                        onChange={(event) =>
                                                            setTransactionType(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className={`h-10 w-full appearance-none rounded-[7px] border px-3 pr-9 text-[12px] outline-none ${
                                                            isDark
                                                                ? "border-[rgba(214,255,31,0.36)] bg-[#0b0b0b] text-[#f1f1f1]"
                                                                : "border-[#bdbdbd] bg-white text-[#2f2f2f]"
                                                        }`}
                                                    >
                                                        <option>All</option>
                                                        <option>Earning</option>
                                                        <option>Boost</option>
                                                        <option>Fee</option>
                                                    </select>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                                                            isDark
                                                                ? "text-[#b5b5b5]"
                                                                : "text-[#444444]"
                                                        }`}
                                                    />
                                                </div>

                                                <label
                                                    className={`flex h-10 items-center gap-2 rounded-[7px] border px-3 ${
                                                        isDark
                                                            ? "border-[rgba(214,255,31,0.36)] bg-[#0b0b0b]"
                                                            : "border-[#bdbdbd] bg-white"
                                                    }`}
                                                >
                                                    <Search
                                                        size={14}
                                                        className={`shrink-0 ${
                                                            isDark
                                                                ? "text-[#b5b5b5]"
                                                                : "text-[#777777]"
                                                        }`}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Search by Order ID/ listing name"
                                                        value={walletSearch}
                                                        onChange={(event) =>
                                                            setWalletSearch(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className={`w-full border-0 bg-transparent text-[12px] outline-none ${
                                                            isDark
                                                                ? "text-[#f1f1f1] placeholder:text-[#8f8f8f]"
                                                                : "text-[#2f2f2f] placeholder:text-[#8b8b8b]"
                                                        }`}
                                                    />
                                                </label>
                                            </div>

                                            <div
                                                className={`overflow-hidden rounded-[8px] border ${
                                                    isDark
                                                        ? "border-[rgba(214,255,31,0.34)] bg-[#000000]"
                                                        : "border-[#ababab] bg-white"
                                                }`}
                                            >
                                                <div className="overflow-x-auto">
                                                    <div className="min-w-[700px]">
                                                        <div
                                                            className={`grid grid-cols-[0.9fr_0.85fr_1.45fr_1.15fr_0.95fr_0.9fr] border-b ${
                                                                isDark
                                                                    ? "border-[rgba(214,255,31,0.28)] bg-[#080808]"
                                                                    : "border-[#b2b2b2] bg-white"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`px-3 py-3 text-left text-[14px] font-semibold ${
                                                                    isDark
                                                                        ? "text-[#f5f5f5]"
                                                                        : "text-[#333333]"
                                                                }`}
                                                            >
                                                                Date
                                                            </div>
                                                            <div
                                                                className={`px-3 py-3 text-left text-[14px] font-semibold ${
                                                                    isDark
                                                                        ? "text-[#f5f5f5]"
                                                                        : "text-[#333333]"
                                                                }`}
                                                            >
                                                                Type
                                                            </div>
                                                            <div
                                                                className={`px-3 py-3 text-left text-[14px] font-semibold ${
                                                                    isDark
                                                                        ? "text-[#f5f5f5]"
                                                                        : "text-[#333333]"
                                                                }`}
                                                            >
                                                                Description
                                                            </div>
                                                            <div
                                                                className={`px-3 py-3 text-left text-[14px] font-semibold ${
                                                                    isDark
                                                                        ? "text-[#f5f5f5]"
                                                                        : "text-[#333333]"
                                                                }`}
                                                            >
                                                                Listing / Orders
                                                                ID
                                                            </div>
                                                            <div
                                                                className={`px-3 py-3 text-left text-[14px] font-semibold ${
                                                                    isDark
                                                                        ? "text-[#f5f5f5]"
                                                                        : "text-[#333333]"
                                                                }`}
                                                            >
                                                                Gross Amount
                                                            </div>
                                                            <div
                                                                className={`px-3 py-3 text-left text-[14px] font-semibold ${
                                                                    isDark
                                                                        ? "text-[#f5f5f5]"
                                                                        : "text-[#333333]"
                                                                }`}
                                                            >
                                                                Platform Fee
                                                            </div>
                                                        </div>

                                                        {filteredTransactions.map(
                                                            (
                                                                transaction,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={`${transaction.listing}-${index}`}
                                                                    className={`grid grid-cols-[0.9fr_0.85fr_1.45fr_1.15fr_0.95fr_0.9fr] border-b last:border-b-0 ${
                                                                        isDark
                                                                            ? "border-[rgba(255,255,255,0.1)] bg-[#000000]"
                                                                            : "border-[#d0d0d0]"
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className={`px-3 py-3 text-[12px] leading-[1.25] ${
                                                                            isDark
                                                                                ? "text-[#e9e9e9]"
                                                                                : "text-[#8a8a8a]"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.date
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`whitespace-pre-line px-3 py-3 text-[12px] leading-[1.25] ${
                                                                            isDark
                                                                                ? "text-[#f0f0f0]"
                                                                                : "text-[#7b7b7b]"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.type
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`whitespace-pre-line px-3 py-3 text-[12px] leading-[1.25] ${
                                                                            isDark
                                                                                ? "text-[#f0f0f0]"
                                                                                : "text-[#7b7b7b]"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.description
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`px-3 py-3 text-[12px] leading-[1.25] ${
                                                                            isDark
                                                                                ? "text-[#e9e9e9]"
                                                                                : "text-[#8a8a8a]"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.listing
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`px-3 py-3 text-[12px] leading-[1.25] ${
                                                                            isDark
                                                                                ? "text-[#e9e9e9]"
                                                                                : "text-[#8a8a8a]"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.gross
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`px-3 py-3 text-[12px] leading-[1.25] ${
                                                                            isDark
                                                                                ? "text-[#e9e9e9]"
                                                                                : "text-[#8a8a8a]"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.fee
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`mt-4 flex items-center justify-center gap-4 text-[12px] ${
                                                    isDark
                                                        ? "text-[#d8d8d8]"
                                                        : "text-[#5c5c5c]"
                                                }`}
                                            >
                                                <button type="button">
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex h-6 min-w-6 items-center justify-center rounded-[6px] bg-[#d6ff1f] px-2 font-medium text-[#1b1b1b]"
                                                >
                                                    1
                                                </button>
                                                <button
                                                    type="button"
                                                    className={
                                                        isDark
                                                            ? "text-[#f0f0f0]"
                                                            : "text-[#2d2d2d]"
                                                    }
                                                >
                                                    2
                                                </button>
                                                <button type="button">
                                                    Next
                                                </button>
                                            </div>
                                        </section>

                                        <section className="creator-wallet-panel creator-wallet-historyCard">
                                            <div className="creator-wallet-sectionHead">
                                                <div>
                                                    <h2>Payment History</h2>
                                                </div>
                                            </div>

                                            <div className="creator-wallet-tableWrap">
                                                <table className="creator-wallet-table creator-wallet-historyTable">
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Amount</th>
                                                            <th>
                                                                Payment Method
                                                            </th>
                                                            <th>
                                                                Reference ID
                                                            </th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {PAYMENT_HISTORY.map(
                                                            (entry) => (
                                                                <tr
                                                                    key={
                                                                        entry.reference
                                                                    }
                                                                >
                                                                    <td>
                                                                        {
                                                                            entry.date
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            entry.amount
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            entry.method
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            entry.reference
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <span className="creator-wallet-statusPill">
                                                                            {
                                                                                entry.status
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>
                                    </div>

                                    <aside className="creator-wallet-sidebar">
                                        <section className="creator-wallet-panel creator-wallet-fundCard">
                                            <div className="creator-wallet-sideHead">
                                                <Plus size={15} />
                                                <h2>Add Funds</h2>
                                            </div>
                                            <p className="creator-wallet-sideSub text-center">
                                                Top up your balance for Boosts
                                                &amp; fees
                                            </p>

                                            <div className="creator-wallet-balanceMeta">
                                                <span>Current Balances :</span>
                                                <strong>Rs 12,540</strong>
                                            </div>

                                            <label className="creator-wallet-field">
                                                <span>Funding Method</span>
                                                <div className="creator-wallet-select wide">
                                                    <select
                                                        value={payoutMethod}
                                                        onChange={(event) =>
                                                            setPayoutMethod(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        <option>UPI</option>
                                                        <option>
                                                            Bank Account
                                                        </option>
                                                        <option>Card</option>
                                                    </select>
                                                    <ChevronDown size={14} />
                                                </div>
                                            </label>

                                            <label className="creator-wallet-field">
                                                <span>Amount to Add</span>
                                                <div className="creator-wallet-inlineInputs">
                                                    <input
                                                        type="text"
                                                        value={fundAmount}
                                                        onChange={(event) =>
                                                            setFundAmount(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        className="creator-wallet-quickBtn"
                                                    >
                                                        Quick Rs 1,000
                                                    </button>
                                                </div>
                                            </label>

                                            <button
                                                type="button"
                                                className="creator-wallet-primaryBtn"
                                            >
                                                + Add Funds
                                            </button>

                                            <p className="creator-wallet-disclaimer">
                                                Funds are available instantly
                                                for Boosts. Refunds go back to
                                                original method per gateway
                                                rules.
                                            </p>
                                        </section>

                                        <section className="creator-wallet-panel creator-wallet-withdrawCard">
                                            <div className="creator-wallet-sideHead">
                                                <Landmark size={15} />
                                                <h2>Withdraw Funds</h2>
                                            </div>
                                            <p className="creator-wallet-sideSub text-center">
                                                Usual processing time: 1 - 3
                                                business days
                                            </p>

                                            <div className="creator-wallet-balanceMeta stacked">
                                                <span>Current Balances :</span>
                                                <strong>Rs 12,540</strong>
                                            </div>

                                            <label className="creator-wallet-field">
                                                <span>
                                                    Select Payout Method
                                                </span>
                                                <div className="creator-wallet-select wide">
                                                    <select
                                                        value={payoutMethod}
                                                        onChange={(event) =>
                                                            setPayoutMethod(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        <option>UPI</option>
                                                        <option>
                                                            Bank Account
                                                        </option>
                                                    </select>
                                                    <ChevronDown size={14} />
                                                </div>
                                            </label>

                                            <label className="creator-wallet-field">
                                                <span>Amount to Withdraw</span>
                                                <div className="creator-wallet-inlineInputs">
                                                    <input
                                                        type="text"
                                                        value={withdrawAmount}
                                                        onChange={(event) =>
                                                            setWithdrawAmount(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        className="creator-wallet-quickBtn"
                                                    >
                                                        Withdraw Full Amount
                                                    </button>
                                                </div>
                                            </label>

                                            <button
                                                type="button"
                                                className="creator-wallet-primaryBtn"
                                            >
                                                <Wallet size={15} />
                                                Request Withdraw
                                            </button>

                                            <p className="creator-wallet-disclaimer">
                                                Platform fee (if any) will be
                                                shown before confirming
                                            </p>
                                        </section>

                                        <section className="creator-wallet-panel creator-wallet-boostCard">
                                            <div className="creator-wallet-sideHead">
                                                <BarChart3 size={15} />
                                                <h2>Boost Overview</h2>
                                            </div>
                                            <p className="creator-wallet-sideSub text-center">
                                                Spend &amp; engagement
                                            </p>

                                            <div className="creator-wallet-miniStatGrid">
                                                <div className="creator-wallet-miniStat">
                                                    <span>Total Boost</span>
                                                    <strong>Rs 8,200</strong>
                                                </div>
                                                <div className="creator-wallet-miniStat">
                                                    <span>This Month</span>
                                                    <strong>Rs 1,200</strong>
                                                </div>
                                            </div>

                                            <div
                                                className="creator-wallet-boostGraph"
                                                aria-label="Boost activity graph"
                                            >
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                    className="creator-wallet-chartScope"
                                                >
                                                    <BarChart
                                                        data={boostChartData}
                                                        margin={{
                                                            top: 6,
                                                            right: 0,
                                                            left: 0,
                                                            bottom: 0,
                                                        }}
                                                        barCategoryGap="30%"
                                                    >
                                                        <XAxis
                                                            dataKey="name"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            interval={0}
                                                            tick={{
                                                                fill: "#9a9a9a",
                                                                fontSize: 9,
                                                            }}
                                                        />
                                                        <YAxis
                                                            hide
                                                            domain={[0, 80]}
                                                        />
                                                        <Tooltip
                                                            cursor={false}
                                                            formatter={(
                                                                value,
                                                            ) => [
                                                                `${value}%`,
                                                                "Engagement",
                                                            ]}
                                                            contentStyle={{
                                                                borderRadius: 10,
                                                                border: "1px solid #d8ef73",
                                                                background:
                                                                    "#ffffff",
                                                            }}
                                                        />
                                                        <Bar
                                                            dataKey="value"
                                                            radius={[
                                                                4, 4, 0, 0,
                                                            ]}
                                                            maxBarSize={16}
                                                            activeBar={{
                                                                stroke: "none",
                                                                fillOpacity: 0.96,
                                                            }}
                                                        >
                                                            {boostChartData.map(
                                                                (entry) => (
                                                                    <Cell
                                                                        key={
                                                                            entry.name
                                                                        }
                                                                        fill="#c5c5c5"
                                                                    />
                                                                ),
                                                            )}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <button
                                                type="button"
                                                className="creator-wallet-primaryBtn"
                                            >
                                                View Boost Analytics
                                            </button>
                                        </section>

                                        <section className="creator-wallet-panel creator-wallet-helpCard">
                                            <div className="creator-wallet-sideHead">
                                                <CreditCard size={15} />
                                                <h2>Payout Rules &amp; Help</h2>
                                            </div>

                                            <ul className="creator-wallet-helpList">
                                                <li>
                                                    Withdrawals typically take 1
                                                    - 3 business days.
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="creator-wallet-linkBtn"
                                                    >
                                                        View Payout FAQs
                                                    </button>
                                                </li>
                                            </ul>
                                        </section>
                                    </aside>
                                </section>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatorWallet;
