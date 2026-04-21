import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Eye, FileText, Filter, Search, Upload } from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar"; 
import "../../../Darkuser.css";
import "./MyOrderClientPage.css";

const SUMMARY_CARDS = [
  { title: "Active contracts", placeholder: "Active contracts", value: "4" },
  { title: "Orders this month", placeholder: "Orders this month", value: "6" },
  { title: "Net earnings in orders", placeholder: "Net earnings in orders", value: "\u20B936,437" },
];

const LISTING_TYPES = ["All listing type", "Contracts", "Products", "Courses", "Webinars"];
const STATUS_TABS = ["All", "New", "In-Progress", "Completed", "Cancelled"];

const ORDER_ROWS = [
  {
    id: "UH-ORD-1044",
    creator: "Aisha Khan",
    listing: "Landing page redesign",
    subtotal: "$22,000",
    hold: "$22,000",
    status: "New",
    actionLabel: "Send Invite",
    actionTone: "invite",
    updated: "57 min ago",
    actions: "full",
    listingType: "Contracts",
  },
  {
    id: "TC-8891",
    creator: "Rohit Mehra",
    listing: "MVP build team project Teams",
    subtotal: "$55,000",
    hold: "$0",
    status: "Completed",
    actionLabel: "Completed",
    actionTone: "done",
    updated: "43 min ago",
    actions: "compact",
    listingType: "Contracts",
  },
];

export default function MyOrderClientPage({ theme, setTheme }) {
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

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ORDER_ROWS.filter((row) => {
      const matchesSearch =
        !query ||
        row.id.toLowerCase().includes(query) ||
        row.creator.toLowerCase().includes(query) ||
        row.listing.toLowerCase().includes(query);

      const matchesType = listingType === "All listing type" || row.listingType === listingType;
      const matchesStatus = status === "All" || row.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [listingType, search, status]);

  const renderActions = (compact = false) => (
    <div className="my-order-client-actionsCell" aria-label="Contract actions">
      {!compact && (
        <button type="button" className="my-order-client-actionBtn" aria-label="View contract">
          <Eye size={18} />
        </button>
      )}
      {!compact && (
        <button type="button" className="my-order-client-actionBtn" aria-label="Open file">
          <FileText size={18} />
        </button>
      )}
      <button type="button" className="my-order-client-actionBtn" aria-label="Upload update">
        <Upload size={18} />
      </button>
      <button type="button" className="my-order-client-actionBtn" aria-label="Approve contract">
        <CheckCircle2 size={18} />
      </button>
      <button type="button" className="my-order-client-actionBtn" aria-label="Report issue">
        <AlertTriangle size={18} />
      </button>
    </div>
  );

  return (
    <div className={`my-order-client-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}>
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
          forceClient
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-0 overflow-hidden w-full">
          <div className="relative overflow-y-auto h-[calc(100vh-72px)] w-full">
            <main className={`my-order-client-main ${isDropdownOpen ? "blurred" : ""}`}>
              <section className="my-order-client-shell">
                <header className="my-order-client-head">
                  <h1 className="my-order-client-title">Orders</h1>
                  <p className="my-order-client-subtitle">
                    Manage contracts, products, courses, and webinars in one place.
                  </p>
                </header>

                <section className="my-order-client-summaryGrid">
                  {SUMMARY_CARDS.map((card) => (
                    <article key={card.title} className="my-order-client-summaryItem">
                      <h2>{card.title}</h2>
                      <div className="my-order-client-summaryCard">
                        <span>{card.placeholder}</span>
                        <strong>{card.value}</strong>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="my-order-client-toolbar">
                  <label className="my-order-client-search" aria-label="Search product">
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder="Search product"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </label>

                  <div
                    className={`my-order-client-selectWrap ${isTypeOpen ? "open" : ""}`}
                    ref={typeRef}
                  >
                    <button
                      type="button"
                      className="my-order-client-selectButton"
                      onClick={() => setIsTypeOpen((prev) => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={isTypeOpen}
                    >
                      <span>{listingType}</span>
                      <ChevronDown size={14} />
                    </button>

                    {isTypeOpen && (
                      <div className="my-order-client-selectMenu" role="listbox" aria-label="Listing type">
                        {LISTING_TYPES.map((option) => (
                          <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={listingType === option}
                            className={`my-order-client-selectOption ${listingType === option ? "active" : ""}`}
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

                  <button type="button" className="my-order-client-filterBtn">
                    <span>Filter</span>
                    <Filter size={14} strokeWidth={1.9} />
                  </button>
                </section>

                <div className="my-order-client-statusTabs">
                  {STATUS_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`my-order-client-statusTab ${status === tab ? "active" : ""}`}
                      onClick={() => setStatus(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <section className="my-order-client-group">
                  <h2 className="my-order-client-groupTitle">Confirmed Contracts</h2>

                  <div className="my-order-client-tableCard">
                    <div className="my-order-client-tableScroll">
                      <table className="my-order-client-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Creator</th>
                            <th>Product / Listing</th>
                            <th>Subtotal</th>
                            <th>Hold (Escrow)</th>
                            <th>Status</th>
                            <th>Updated</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRows.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.creator}</td>
                              <td>{row.listing}</td>
                              <td>{row.subtotal}</td>
                              <td>{row.hold}</td>
                              <td>
                                <button
                                  type="button"
                                  className={`my-order-client-statusBadge ${row.actionTone}`}
                                >
                                  {row.actionLabel}
                                </button>
                              </td>
                              <td>{row.updated}</td>
                              <td>{renderActions(row.actions === "compact")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {filteredRows.length === 0 && (
                    <div className="my-order-client-empty">No orders match your current filters.</div>
                  )}
                </section>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
