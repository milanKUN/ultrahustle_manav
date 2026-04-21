import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Eye, FileText, Filter, Search, Upload } from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "./MyOrderCreatorPage.css";

const SUMMARY_CARDS = [
  { title: "Active contracts", placeholder: "Active contracts", value: "4" },
  { title: "Orders this month", placeholder: "Orders this month", value: "6" },
  { title: "Net earnings in orders", placeholder: "Net earnings in orders", value: "₹36,437" },
];

const LISTING_TYPES = ["All listing type", "Contracts", "Products", "Courses", "Webinars"];
const STATUS_TABS = ["All", "New", "In-Progress", "Completed", "Cancelled"];

const ORDER_GROUPS = [
  {
    id: "confirmed-contracts",
    title: "Confirmed Contracts",
    columns: ["#", "Buyer", "Listing", "Hold", "Released", "Fee % / $", "Net (All Released)", "Status", "Updated", "Actions"],
    rows: [
      [
        "SC-10428",
        "Aisha Khan",
        "Brand identity sprint Services",
        "$18,000",
        "$6,000",
        "10%",
        "$5,400",
        "Send Invite",
        "Jan 23, 2026,\n03:05 PM",
        "Actions",
      ],
      [
        "TC-8891",
        "Rohit Mehra",
        "MVP build team project Teams",
        "$55,000",
        "$2,500",
        "$200",
        "$0",
        "Send Invite",
        "Jan 23, 2026,\n08:25 PM",
        "Actions",
      ],
    ],
  },
  {
    id: "digital-products",
    title: "Digital Products",
    columns: ["#", "Buyer", "Product", "Quantity", "Gross", "Fee % / $", "Net", "Status", "Updated", "Actions"],
    rows: [
      ["DP-77201", "Nikhil Patil", "Notion Client Portal Template", "1", "$1,499", "$150", "$1,349", "Paid", "Jan 23, 2026,\n03:05 PM", "Actions"],
    ],
  },
  {
    id: "course-enrollments",
    title: "Course Enrollments",
    columns: ["#", "Learner", "Course", "Price", "Fee", "Net", "Progress", "Status", "Updated", "Actions"],
    rows: [
      ["CE-2205", "Farhan Noor", "Design Systems 101", "$7,999", "$800", "$7,199", "42%", "Active", "Jan 23, 2026,\n03:05 PM", "Actions"],
    ],
  },
  {
    id: "webinar-bookings",
    title: "Webinar Bookings",
    columns: ["#", "Attendee", "Webinar", "Ticket Type", "Price", "Fee", "Net", "Status", "Updated", "Actions"],
    rows: [
      ["WB-50112", "Alex Chen", "Skip Faster with AI Tools", "Pro", "$2,499", "$250", "$2,249", "Upcoming", "Jan 23, 2026,\n03:05 PM", "Actions"],
    ],
  },
];

export default function MyOrderCreatorPage({ theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("All listing type");
  const [status, setStatus] = useState("All");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const typeRef = useRef(null);

  useEffect(() => {
    setSidebarOpen(false);
    setShowSettings(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setIsTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ORDER_GROUPS.filter((group) => {
      const groupType = group.title;
      const matchesType =
        listingType === "All listing type" ||
        groupType.toLowerCase().includes(listingType.toLowerCase().replace("s", ""));

      const matchesSearch =
        !query ||
        group.title.toLowerCase().includes(query) ||
        group.rows.some((row) => row.some((cell) => String(cell).toLowerCase().includes(query)));

      return matchesType && matchesSearch;
    });
  }, [listingType, search]);

  const renderActions = (label, compact = false) => (
    <div className="my-orders-actionsCell" aria-label={label}>
      <button type="button" className="my-orders-actionBtn" aria-label="View contract">
        <Eye size={18} />
      </button>
      <button type="button" className="my-orders-actionBtn" aria-label="Open file">
        <FileText size={18} />
      </button>
      {!compact && (
        <button type="button" className="my-orders-actionBtn" aria-label="Upload update">
          <Upload size={18} />
        </button>
      )}
      {!compact && (
        <button type="button" className="my-orders-actionBtn" aria-label="Approve contract">
          <CheckCircle2 size={18} />
        </button>
      )}
      <button type="button" className="my-orders-actionBtn" aria-label="Report issue">
        <AlertTriangle size={18} />
      </button>
    </div>
  );

  return (
    <div className={`my-orders-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}>
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
            <main className={`my-orders-main ${isDropdownOpen ? "blurred" : ""}`}>
              <section className="my-orders-shell">
                <header className="my-orders-head">
                  <h1 className="my-orders-title">Orders</h1>
                  <p className="my-orders-subtitle">
                    Manage contracts, products, courses, and webinars in one place.
                  </p>
                </header>

                <section className="my-orders-summaryGrid">
                  {SUMMARY_CARDS.map((card) => (
                    <article key={card.title} className="my-orders-summaryItem">
                      <h2>{card.title}</h2>
                      <div className="my-orders-summaryCard">
                        <span>{card.placeholder}</span>
                        <strong>{card.value}</strong>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="my-orders-toolbar">
                  <label className="my-orders-search" aria-label="Search product">
                    <Search size={15} />
                    <input
                      type="text"
                      placeholder="Search product"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </label>

                  <div
                    className={`my-orders-selectWrap ${isTypeOpen ? "open" : ""}`}
                    ref={typeRef}
                  >
                    <button
                      type="button"
                      className="my-orders-selectButton"
                      onClick={() => setIsTypeOpen((prev) => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={isTypeOpen}
                    >
                      <span>{listingType}</span>
                      <ChevronDown size={15} />
                    </button>

                    {isTypeOpen && (
                      <div className="my-orders-selectMenu" role="listbox" aria-label="Listing type">
                        {LISTING_TYPES.map((option) => (
                          <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={listingType === option}
                            className={`my-orders-selectOption ${listingType === option ? "active" : ""}`}
                            onClick={() => {
                              setListingType(option);
                              setIsTypeOpen(false);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="button" className="my-orders-filterBtn">
                    <span>Filter</span>
                    <Filter size={14} strokeWidth={1.9} />
                  </button>
                </section>

                <div className="my-orders-statusTabs">
                  {STATUS_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`my-orders-statusTab ${status === tab ? "active" : ""}`}
                      onClick={() => setStatus(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="my-orders-groups">
                  {filteredGroups.map((group) => (
                    <section key={group.id} className="my-orders-group">
                      <h2 className="my-orders-groupTitle">{group.title}</h2>

                      <div className="my-orders-tableCard">
                        <div className="my-orders-tableScroll">
                          <table className="my-orders-table">
                            <thead>
                              <tr>
                                {group.columns.map((column) => (
                                  <th key={column}>{column}</th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {group.rows.map((row, rowIndex) => (
                                <tr key={`${group.id}-${rowIndex}`}>
                                  {row.map((cell, cellIndex) => {
                                    const isPaidBadge =
                                      group.id === "digital-products" && cellIndex === 7;
                                    const isProgressBar =
                                      group.id === "course-enrollments" && cellIndex === 6;
                                    const isCourseStatus =
                                      group.id === "course-enrollments" && cellIndex === 7;
                                    const isWebinarStatus =
                                      group.id === "webinar-bookings" && cellIndex === 7;
                                    const isUpdatedCell =
                                      (group.id === "digital-products" && cellIndex === 8) ||
                                      (group.id === "course-enrollments" && cellIndex === 8) ||
                                      (group.id === "webinar-bookings" && cellIndex === 8);
                                    const isActionCell =
                                      (group.id === "digital-products" && cellIndex === 9) ||
                                      (group.id === "course-enrollments" && cellIndex === 9) ||
                                      (group.id === "webinar-bookings" && cellIndex === 9);
                                    const isContractStatus =
                                      group.id === "confirmed-contracts" && cellIndex === 7;
                                    const isContractUpdated =
                                      group.id === "confirmed-contracts" && cellIndex === 8;
                                    const isContractActions =
                                      group.id === "confirmed-contracts" && cellIndex === 9;

                                    return (
                                      <td key={`${group.id}-${rowIndex}-${cellIndex}`}>
                                        {isPaidBadge ? (
                                          <span className="my-orders-genericStatus">{cell}</span>
                                        ) : isCourseStatus || isWebinarStatus ? (
                                          <span className="my-orders-genericStatus">{cell}</span>
                                        ) : isContractStatus ? (
                                          <span className="my-orders-contractStatus">{cell}</span>
                                        ) : isContractUpdated || isUpdatedCell ? (
                                          <span className="my-orders-updatedCell">{cell}</span>
                                        ) : isContractActions ? (
                                          renderActions("Contract actions")
                                        ) : isActionCell ? (
                                          renderActions(`${group.title} actions`, true)
                                        ) : isProgressBar ? (
                                          <div className="my-orders-progressCell">
                                            <div className="my-orders-progressTrack">
                                              <span style={{ width: cell }} />
                                            </div>
                                            <b>{cell}</b>
                                          </div>
                                        ) : (
                                          cell
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* <div className="my-orders-tableFooter">
                          <span>&lsaquo;</span>
                          <div className="my-orders-tableFooterBar" />
                          <span>&rsaquo;</span>
                        </div> */}
                      </div>
                    </section>
                  ))}

                  {filteredGroups.length === 0 && (
                    <div className="my-orders-empty">
                      No orders match your current filters.
                    </div>
                  )}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
