import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    ChevronDown,
    CreditCard,
    Landmark,
    Plus,
    Search,
    Trash2,
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



const PAYMENT_HISTORY = [
    {
        date: "3 Dec 2025",
        amount: "Rs 12,500",
        method: "Bank(HDFC****4321)",
        reference: "WTX-193",
        status: "Completed",
    },
];

const PAYMENT_METHOD_ROWS = [
    {
        method: "Visa",
        details: "•••• 0112",
        expiryOrBank: "12/27",
    },
    {
        method: "UPI",
        details: "client@upi",
        expiryOrBank: "—",
    },
];

const ACTIVE_ESCROW_ROWS = [
    {
        project: "Website UI Revamp",
        escrowAmount: "Rs 40,000",
        lockedFor: "Contract UH-CT-0048",
        status: "Partially Released",
    },
    {
        project: "Product Photoshoot",
        escrowAmount: "Rs 20,000",
        lockedFor: "Contract UH-CT-0042",
        status: "Fully Locked",
    },
];

const REFUND_ROWS = [
    {
        refundId: "RFND-2231",
        amount: "Rs 3,000",
        date: "2 Nov 2025",
        source: "Dispute (Milestone 1)",
        status: "Completed",
    },
    {
        refundId: "RFND-2190",
        amount: "Rs 2,000",
        date: "2 Dec 2025",
        source: "Cancelled Project",
        status: "Completed",
    },
];

const UPCOMING_PAYMENT_ROWS = [
    {
        contract: "UH-CT-0051",
        amount: "Rs 18,000",
        due: "Fund to activate",
    },
    {
        contract: "UH-CT-0043",
        amount: "Rs 12,000",
        due: "Pending",
    },
];

const CLIENT_TRANSACTION_HISTORY_ROWS = [
    {
        type: "Escrow Deposit",
        amount: "₹12,500",
        contractProject: "UH-CT-0048",
        date: "WDX-198",
        status: "Completed",
    },
    {
        type: "Release",
        amount: "₹10,000",
        contractProject: "Milestone 1",
        date: "WDX-198",
        status: "Completed",
    },
    {
        type: "Refund",
        amount: "₹3,000",
        contractProject: "Dispute UH-DSP-0021",
        date: "WDX-198",
        status: "Completed",
    },
    {
        type: "Auto-Release",
        amount: "₹15,000",
        contractProject: "Milestone 2",
        date: "WDX-198",
        status: "Completed",
    },
];

const CLIENT_PAYMENT_HISTORY_ROWS = [
    {
        type: "Escrow Deposit",
        amount: "₹12,500",
        contractProject: "UH-CT-0048",
        date: "WDX-198",
        status: "Completed",
    },
    {
        type: "Release",
        amount: "₹10,000",
        contractProject: "Milestone 1",
        date: "WDX-198",
        status: "Completed",
    },
    {
        type: "Refund",
        amount: "₹3,000",
        contractProject: "Dispute UH-DSP-0021",
        date: "WDX-198",
        status: "Completed",
    },
    {
        type: "Auto-Release",
        amount: "₹15,000",
        contractProject: "Milestone 2",
        date: "WDX-198",
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

        return CLIENT_TRANSACTION_HISTORY_ROWS.filter((item) => {
            const matchesType =
                transactionType === "All" ||
                item.type
                    .toLowerCase()
                    .includes(transactionType.toLowerCase());

            const matchesSearch =
                !query ||
                item.contractProject.toLowerCase().includes(query) ||
                item.date.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query);

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

            <div className="pt-[72px] flex relative w-full">
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
                    <div className="relative overflow-y-auto h-[calc(100vh-72px)] w-full">
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

                                        <section className="creator-wallet-panel creator-wallet-billingCard">
                                            <div className="creator-wallet-sectionHead">
                                                <div>
                                                    <h2>
                                                        Payment Methods &amp;
                                                        Billing
                                                    </h2>
                                                    <p>
                                                        Saved cards, UPI, and
                                                        netbanking. Set a
                                                        default to speed up
                                                        funding.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="creator-wallet-billingTableWrap">
                                                <table className="creator-wallet-table creator-wallet-billingTable">
                                                    <colgroup>
                                                        <col style={{ width: "19%" }} />
                                                        <col style={{ width: "26%" }} />
                                                        <col style={{ width: "20%" }} />
                                                        <col style={{ width: "19%" }} />
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th>Method</th>
                                                            <th>Details</th>
                                                            <th>
                                                                Expiry/Bank
                                                            </th>
                                                            <th>Default</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {PAYMENT_METHOD_ROWS.map(
                                                            (row) => (
                                                                <tr
                                                                    key={`${row.method}-${row.details}`}
                                                                >
                                                                    <td>{row.method}</td>
                                                                    <td>{row.details}</td>
                                                                    <td>{row.expiryOrBank}</td>
                                                                    <td>
                                                                        <div className="creator-wallet-billingActions">
                                                                            <button
                                                                                type="button"
                                                                                className="creator-wallet-miniAction"
                                                                            >
                                                                                Set default
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                
                                                                            ><svg className="h-4 w-4 shrink-0 text-[#4f4f4f] transition-colors duration-150 hover:text-[#171717]">
                                                                                <Trash2
                                                                                    size={16}
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                
                                                                                />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="creator-wallet-billingAddressCard">
                                                <h3>Billing Address</h3>
                                                <div className="creator-wallet-billingAddressGrid">
                                                    <div>
                                                        <span>Name</span>
                                                        <strong>Acme Pvt Ltd</strong>
                                                        <span>GST Number (optional)</span>
                                                        <strong>29ABCDE1234F1Z5</strong>
                                                    </div>
                                                    <div>
                                                        <span>Address</span>
                                                        <strong>221B Baker Street, Bengaluru, KA</strong>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="creator-wallet-miniAction -mt-2"
                                                >
                                                    Edit Billing Details
                                                </button>
                                            </div>
                                        </section>

                                        <section className="creator-wallet-panel creator-wallet-escrowCard">
                                            <div className="creator-wallet-sectionHead">
                                                <div>
                                                    <h2>Active Escrow Deposits</h2>
                                                </div>
                                            </div>

                                            <div className="creator-wallet-tableWrap creator-wallet-clientTableWrap">
                                                <table className="creator-wallet-table creator-wallet-clientTable">
                                                    <thead>
                                                        <tr>
                                                            <th>Project</th>
                                                            <th>Escrow Amount</th>
                                                            <th>Locked For</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ACTIVE_ESCROW_ROWS.map(
                                                            (row) => (
                                                                <tr
                                                                    key={`${row.project}-${row.lockedFor}`}
                                                                >
                                                                    <td>{row.project}</td>
                                                                    <td>{row.escrowAmount}</td>
                                                                    <td>{row.lockedFor}</td>
                                                                    <td>
                                                                        <span className="creator-wallet-softPill">
                                                                            {row.status}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            type="button"
                                                                            className="creator-wallet-miniAction"
                                                                        >
                                                                            View
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>

                                        <section className="creator-wallet-panel creator-wallet-refundsCard">
                                            <div className="creator-wallet-sectionHead">
                                                <div>
                                                    <h2>Refunds</h2>
                                                </div>
                                            </div>

                                            <div className="creator-wallet-tableWrap creator-wallet-clientTableWrap">
                                                <table className="creator-wallet-table creator-wallet-clientTable">
                                                    <thead>
                                                        <tr>
                                                            <th>Refund ID</th>
                                                            <th>Amount</th>
                                                            <th>Date</th>
                                                            <th>Source</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {REFUND_ROWS.map(
                                                            (row) => (
                                                                <tr
                                                                    key={row.refundId}
                                                                >
                                                                    <td>{row.refundId}</td>
                                                                    <td>{row.amount}</td>
                                                                    <td>{row.date}</td>
                                                                    <td>{row.source}</td>
                                                                    <td>
                                                                        <span className="creator-wallet-miniAction creator-wallet-miniAction--pill">
                                                                            {row.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>

                                        <section className="creator-wallet-panel creator-wallet-upcomingPaymentsCard">
                                            <div className="creator-wallet-sectionHead">
                                                <div>
                                                    <h2>
                                                        Upcoming / Outstanding
                                                        Payments
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className="creator-wallet-tableWrap creator-wallet-clientTableWrap">
                                                <table className="creator-wallet-table creator-wallet-clientTable">
                                                    <thead>
                                                        <tr>
                                                            <th>Contract</th>
                                                            <th>Amount</th>
                                                            <th>Due</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {UPCOMING_PAYMENT_ROWS.map(
                                                            (row) => (
                                                                <tr
                                                                    key={row.contract}
                                                                >
                                                                    <td>{row.contract}</td>
                                                                    <td>{row.amount}</td>
                                                                    <td>{row.due}</td>
                                                                    <td>
                                                                        <button
                                                                            type="button"
                                                                            className="creator-wallet-miniAction"
                                                                        >
                                                                            Fund
                                                                            now
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>

                                        

                                        <section className="creator-wallet-panel creator-wallet-historyCard">
                                            <div className="creator-wallet-sectionHead">
                                                <div>
                                                    <h2>Payment History</h2>
                                                </div>
                                            </div>

                                            <div className="creator-wallet-clientHistoryFilters creator-wallet-paymentHistoryFilters">
                                                <div className="creator-wallet-paymentHistorySelect">
                                                    <select
                                                        value={transactionType}
                                                        onChange={(event) =>
                                                            setTransactionType(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        <option>All</option>
                                                        <option>
                                                            Escrow Deposit
                                                        </option>
                                                        <option>Release</option>
                                                        <option>Refund</option>
                                                        <option>
                                                            Auto-Release
                                                        </option>
                                                    </select>
                                                    <ChevronDown size={14} />
                                                </div>

                                                <label className="creator-wallet-paymentHistorySearch">
                                                    <Search size={14} />
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
                                                    />
                                                </label>
                                            </div>

                                            <div className="creator-wallet-tableWrap creator-wallet-clientTableWrap">
                                                <table className="creator-wallet-table creator-wallet-clientTable creator-wallet-historyLikeTable">
                                                    <thead>
                                                        <tr>
                                                            <th>Type</th>
                                                            <th>Amount</th>
                                                            <th>
                                                                Contract/Project
                                                            </th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {CLIENT_PAYMENT_HISTORY_ROWS.map(
                                                            (row) => (
                                                                <tr
                                                                    key={`${row.type}-${row.contractProject}-${row.date}-payment`}
                                                                >
                                                                    <td>{row.type}</td>
                                                                    <td>{row.amount}</td>
                                                                    <td>
                                                                        {
                                                                            row.contractProject
                                                                        }
                                                                    </td>
                                                                    <td>{row.date}</td>
                                                                    <td>
                                                                        <span className="creator-wallet-miniAction creator-wallet-miniAction--pill">
                                                                            {row.status}
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
