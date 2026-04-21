// ... same imports
import React, { useMemo, useState, useRef, useEffect } from "react";
import "./CreatorMilestonesPage.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";

export default function MilestoneBoard({ theme = "light", setTheme }) {
  const topTabs = ["Milestones", "Contract", "Details"];
  const statusTabs = [
    "All",
    "Open",
    "In-Progress",
    "Approved",
    "Delivered",
    "Overdue",
  ];

  const [activeTop, setActiveTop] = useState("Milestones");
  const [activeStatus, setActiveStatus] = useState("All");

  // ✅ VIEW ONLY STATE
  const [isViewOnly, setIsViewOnly] = useState(true);

  // dropdown
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectValue] = useState("Full project");
  const projectRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (projectRef.current && !projectRef.current.contains(e.target)) {
        setProjectOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  React.useEffect(() => {
    setSidebarOpen(true);
    setShowSettings(false);
  }, []);

  const data = useMemo(
    () => ({
      completed: 1,
      total: 5,
      startedAt: "Thu Nov 20 2025",
      targetAt: "Sat Jan 10 2026",
      revisionsUsed: 2,
      revisionsTotal: 3,
      nextActionTitle: "Deliver Milestone 2 by Fri",
      nextActionDate: "Dec 26 2025",
      notice:
        "Milestone 2 delivery due in 24 hours. Please update your client if you expect delays.",
    }),
    [],
  );

  const progressPct = Math.round((data.completed / data.total) * 100);

  const feed = useMemo(
    () => [
      {
        title: "Milestone-1",
        pill: "Creator",
        ts: "Nov 18, 2025, 02:30 PM",
        desc: "Contract initiated and terms accepted by both parties",
        tags: ["Milestone: Design phase"],
        chat: "Discuss in chat",
        amount: "$100000",
      },
      {
        title: "Escrow funded",
        pill: "Client",
        ts: "Nov 18, 2025, 02:30 PM",
        desc: "Client funded escrow for Milestone",
        tags: ["Milestone: Design phase"],
        chat: "Discuss in chat",
      },
      {
        title: "Milestone 1 delivered",
        pill: "Creator",
        ts: "Dec 09, 2025, 06:40 PM",
        desc: "Creator submitted files for Home page design and Dashboard UI",
        tags: ["Milestone: Design phase", "Deadline: 2025-12-15"],
        files: ["Home.fig", "dashboard.fig", "preview.pdf"],
        chat: "Discuss in chat",
        amount: "$100000",
        highlight: true,
      },
      {
        title: "Revision requested",
        pill: "Client",
        ts: "Nov 18, 2025, 02:30 PM",
        desc: "Client requested changes on hero section and mobile menu",
        tags: ["Milestone: Design phase", "Revision round: 1 of 3"],
        files: ["Annotated.pdf"],
        chat: "Discuss in chat",
        footerBadge: "Revision Accepted",
      },
      {
        title: "Milestone 1 approved and released",
        pill: "Client",
        ts: "Dec 09, 2025, 06:40 PM",
        desc: "Creator submitted files for Home page design and Dashboard UI",
        tags: ["Milestone: Design phase", "Deadline: 2025-12-15"],
        chat: "Discuss in chat",
        amount: "$100000",
      },
      {
        title: "Revision delivered",
        pill: "Creator",
        ts: "Nov 18, 2025, 02:30 PM",
        desc: "Client requested changes on hero section and mobile menu",
        tags: ["Milestone: Design phase", "Revision round: 1 of 3"],
        files: ["hero_v2.fig", "Mobilemenu_v2.mov"],
        chat: "Discuss in chat",
      },
      {
        title: "Revision deliverd",
        pill: "Creator",
        ts: "Nov 18, 2025, 02:30 PM",
        desc: "Client requested changes on hero section and mobile menu",
        tags: ["Milestone: Design phase", "Revision round: 1 of 3"],
        files: ["hero_v2.fig", "Mobilemenu_v2.mov"],
        chat: "Discuss in chat",
      },
      {
        title: "Upcoming Milestone",
        pill: "Client",
        ts: "Dec 20, 2025, 10:00 AM",
        desc: "Planning for the next phase",
        tags: ["Milestone: Development"],
        chat: "Discuss in chat",
      },
      {
        title: "Project Update",
        pill: "Creator",
        ts: "Dec 21, 2025, 04:00 PM",
        desc: "Weekly progress report submitted",
        tags: ["Update"],
        chat: "Discuss in chat",
      },
    ],
    [],
  );

  // ✅ Details data (invoice screen)
  const details = useMemo(
    () => ({
      title: "Title",
      orderedFrom: "Name",
      deliveryDate: "Fri Dec 26 2025",
      orderNumber: "#123456789",
      orderDate: "Fri Dec 26 2025",

      orderRows: [{ item: "Name", qty: 1, duration: "2 days", price: "$100000" }],
      subtotal: "$100000",
      serviceFee: "$100",
      total: "$100100",

      extensionDate: "Fri Dec 26 2025",
      extensionRows: [
        { item: "Extend duration", qty: 1, duration: "1 day", price: "$100" },
      ],
      extensionTotal: "$100200",

      milestone: {
        amount: "$50000",
        deadline: "01-12-2026",
        platformFee: "$10000",
        netAmount: "$15000",
      },

      split: [
        { member: "Member A (Design)", pct: "40%", amount: "$50000" },
        { member: "Member B (Dev)", pct: "40%", amount: "$50000" },
        { member: "Member C (QA)", pct: "40%", amount: "$50000" },
      ],
    }),
    [],
  );

  return (
    <div className={`create-team-page user-page ${theme} min-h-screen relative overflow-hidden`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="pt-[72px] flex relative z-10">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={(id) => setActiveSetting(id)}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-5 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
            <div className="ms-wrap">
              {/* Top tabs */}
              <div className="ms-topbar">
                <div className="ms-seg">
                  {topTabs.map((t) => (
                    <button
                      key={t}
                      className={`ms-segBtn ${activeTop === t ? "active" : ""}`}
                      onClick={() => {
                        setActiveTop(t);
                        // ✅ Contract ke bahar jaate hi unlock
                        if (t !== "Contract") setIsViewOnly(false);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* ✅ CONTRACT TAB */}
              {activeTop === "Contract" && (
                <div className={`ms-contract-page ${isViewOnly ? "is-viewonly" : ""}`}>
                  {/* Header (always clickable) */}
                  <div className="ms-contract-top">
                    <h2 className="ms-contract-title">Create New Contract</h2>

                    <div className="ms-contract-actions">
                      <button type="button" className="ms-ct-btn lime">
                        Save as PDF
                      </button>

                      <button
                        type="button"
                        className={`ms-ct-btn lime outline ${isViewOnly ? "active" : ""}`}
                        onClick={() => setIsViewOnly((p) => !p)}
                      >
                        <span className="ms-eye">👁</span>
                        {isViewOnly ? "View only" : "View only"}
                      </button>
                    </div>
                  </div>

                  {/* ✅ BODY (Only this area locked) */}
                  <div className="ms-ct-body">
                    {isViewOnly && <div className="ms-ct-lockOverlay" />}

                    {/* Contract Basics */}
                    <div className="ms-ct-card ms-ct-basics">
                      <div className="ms-ct-cardHead">Contract Basics</div>

                      <div className="ms-ct-grid">
                        <div className="ms-ct-field">
                          <label className="ms-ct-label">Contract Title</label>
                          <input
                            className="ms-ct-input"
                            placeholder="Contact Title"
                            disabled={isViewOnly}
                          />
                        </div>

                        <div className="ms-ct-typeBox">
                          <div className="ms-ct-typeLeft">
                            <div className="ms-ct-label">Contract Type</div>
                            <div className="ms-ct-muted">Solo/ Team service</div>
                          </div>

                          <div className="ms-ct-typeRight">
                            <div className="ms-ct-typeText">Solo/team</div>

                            <label className="ms-ct-switch">
                              <input type="checkbox" defaultChecked disabled={isViewOnly} />
                              <span className="ms-ct-slider" />
                            </label>
                          </div>
                        </div>

                        <div className="ms-ct-field span2">
                          <label className="ms-ct-label">Contract ID</label>
                          <input
                            className="ms-ct-input"
                            placeholder="AUTO-123456"
                            disabled={isViewOnly}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parties + Scope + Timeline + SLA */}
                    <div className="ms-ct-stack">
                      {/* Parties Involved */}
                      <div className="ms-ct-card ms-ct-parties-box">
                        <div className="ms-ct-cardHead">Parties Involved</div>

                        <div className="ms-ct-parties">
                          <div className="ms-ct-partyCard">
                            <div className="ms-ct-partyTop">
                              <div className="ms-ct-partyTitle">Client</div>
                            </div>

                            <div className="ms-ct-fields">
                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Client username</label>
                                <input className="ms-ct-input" placeholder="Client username" disabled={isViewOnly} />
                              </div>

                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Full name</label>
                                <input className="ms-ct-input" placeholder="Full name" disabled={isViewOnly} />
                              </div>

                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Email</label>
                                <input className="ms-ct-input" placeholder="Email" disabled={isViewOnly} />
                              </div>

                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Name and company</label>
                                <input className="ms-ct-input" placeholder="Name and company" disabled={isViewOnly} />
                              </div>
                            </div>
                          </div>

                          <div className="ms-ct-partyCard">
                            <div className="ms-ct-partyTop">
                              <div className="ms-ct-partyTitle">Service Provider</div>
                            </div>

                            <div className="ms-ct-fields">
                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Creator username</label>
                                <input className="ms-ct-input" placeholder="Creator username" disabled={isViewOnly} />
                              </div>

                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Full name</label>
                                <input className="ms-ct-input" placeholder="Full name" disabled={isViewOnly} />
                              </div>

                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Email</label>
                                <input className="ms-ct-input" placeholder="Email" disabled={isViewOnly} />
                              </div>

                              <div className="ms-ct-field">
                                <label className="ms-ct-label">Name and company</label>
                                <input className="ms-ct-input" placeholder="Country" disabled={isViewOnly} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scope and Deliverables */}
                      <div className="ms-ct-card ms-ct-scope-box">
                        <div className="ms-ct-cardHead">Scope and Deliverables</div>

                        <div className="ms-ct-field">
                          <label className="ms-ct-label">Project Summary</label>
                          <textarea className="ms-ct-textarea" placeholder="Short explanation" disabled={isViewOnly} />
                        </div>

                        <div className="ms-ct-subHead">Deliverables</div>

                        <div className="ms-ct-deliverGrid">
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Title</label>
                            <input className="ms-ct-input" placeholder="Title" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Format/file type</label>
                            <input className="ms-ct-input" placeholder="Format/file type" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Quantity</label>
                            <input className="ms-ct-input" placeholder="Quantity" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Acceptance Criteria</label>
                            <input className="ms-ct-input" placeholder="Acceptance Criteria" disabled={isViewOnly} />
                          </div>
                        </div>

                        <button type="button" className="ms-ct-addBtn" disabled={isViewOnly}>
                          Add Deliverables
                        </button>

                        <div className="ms-ct-field mt14">
                          <label className="ms-ct-label">Out of scope</label>
                          <textarea className="ms-ct-textarea" placeholder="Free text" disabled={isViewOnly} />
                        </div>
                      </div>

                      {/* Timeline and Revisions */}
                      <div className="ms-ct-card ms-ct-timeline-box">
                        <div className="ms-ct-cardHead">Timeline and Revisions</div>

                        <div className="ms-ct-grid3">
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Initial delivery deadline</label>
                            <div className="ms-ct-dateWrap">
                              <input className="ms-ct-input" placeholder="DD-MM-YYYY" disabled={isViewOnly} />
                              <span className="ms-ct-cal">📅</span>
                            </div>
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Client review window (1–7 days)</label>
                            <select className="ms-ct-select" defaultValue="" disabled={isViewOnly}>
                              <option value="" disabled>Select one</option>
                              <option>1 day</option>
                              <option>2 days</option>
                              <option>3 days</option>
                              <option>5 days</option>
                              <option>7 days</option>
                            </select>
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Included revision rounds</label>
                            <select className="ms-ct-select" defaultValue="" disabled={isViewOnly}>
                              <option value="" disabled>Select one</option>
                              <option>0</option>
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>5</option>
                            </select>
                          </div>
                        </div>

                        <div className="ms-ct-grid3 ms-ct-grid3-2">
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Revision turnaround time (days)</label>
                            <select className="ms-ct-select" defaultValue="" disabled={isViewOnly}>
                              <option value="" disabled>Select one</option>
                              <option>1 day</option>
                              <option>2 days</option>
                              <option>3 days</option>
                              <option>5 days</option>
                              <option>7 days</option>
                            </select>
                          </div>
                        </div>

                        <div className="ms-ct-field">
                          <label className="ms-ct-label">Late delivery consequence</label>
                          <select className="ms-ct-select" defaultValue="" disabled={isViewOnly}>
                            <option value="" disabled>Select</option>
                            <option>Fee reduction</option>
                            <option>Extra revision round</option>
                            <option>Partial refund</option>
                            <option>Mutual renegotiation</option>
                          </select>
                        </div>
                      </div>

                      {/* SLA Snapshot */}
                      <div className="ms-ct-card ms-ct-sla-box">
                        <div className="ms-ct-cardHead">SLA Snapshot</div>

                        <div className="ms-ct-slaGrid">
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Delivery SLA</label>
                            <input className="ms-ct-input" placeholder="Delivery SLA" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Communication SLA</label>
                            <input className="ms-ct-input" placeholder="Communication SLA" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Revision SLA</label>
                            <input className="ms-ct-input" placeholder="Revision SLA" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Quality standards</label>
                            <input className="ms-ct-input" placeholder="Quality standards" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Client responsibilities</label>
                            <input className="ms-ct-input" placeholder="Client responsibilities" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Creator/team responsibilities</label>
                            <input className="ms-ct-input" placeholder="Creator/team responsibilities" disabled={isViewOnly} />
                          </div>
                        </div>
                      </div>

                      {/* Payment and Escrow */}
                      <div className="ms-ct-card ms-ct-payment-box">
                        <div className="ms-ct-cardHead">Payment and Escrow</div>

                        <div className="ms-ct-payTop">
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Payment Type</label>
                            <select className="ms-ct-select" defaultValue="" disabled={isViewOnly}>
                              <option value="" disabled>Select one</option>
                              <option>Escrow</option>
                              <option>Direct</option>
                              <option>Milestone-based</option>
                            </select>
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Project cost</label>
                            <input className="ms-ct-input" placeholder="$50000" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Escrow Rules</label>
                            <div className="ms-ct-ruleBox">
                              <div>Funds lock before work starts.</div>
                              <div className="ms-ct-muted">Release after approval or review expiry.</div>
                            </div>
                          </div>
                        </div>

                        <div className="ms-ct-subHead">Milestones</div>

                        <div className="ms-ct-milGrid">
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Add Milestone</label>
                            <input className="ms-ct-input" placeholder="Milestone 1" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Amount</label>
                            <input className="ms-ct-input" placeholder="$10000" disabled={isViewOnly} />
                          </div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Initial delivery deadline</label>
                            <div className="ms-ct-dateWrap">
                              <input className="ms-ct-input" placeholder="DD-MM-YYYY" disabled={isViewOnly} />
                              <span className="ms-ct-cal">📅</span>
                            </div>
                          </div>

                          <button className="ms-ct-trash" type="button" aria-label="Delete milestone" disabled={isViewOnly}>
                            <img src="/delete.svg" alt="" />
                          </button>
                        </div>

                        <button type="button" className="ms-ct-addBtn" disabled={isViewOnly}>
                          + Add Milestone
                        </button>
                      </div>
                      {/* Team Payout Configuration */}
                      <div className="ms-ct-card ms-ct-payout-config">
                        <div className="ms-ct-cardHead">Team Payout Configuration</div>

                        <div className="ms-ct-grid3">
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="Member A" />
                          </div>
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="Design" />
                          </div>
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="80%" />
                          </div>
                        </div>

                        <div className="ms-ct-grid3">
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="Member B" />
                          </div>
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="Dev" />
                          </div>
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="60%" />
                          </div>
                        </div>

                        <div className="ms-ct-grid3">
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="Member C" />
                          </div>
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="QA" />
                          </div>
                          <div className="ms-ct-field">
                            <input className="ms-ct-input" placeholder="50%" />
                          </div>
                        </div>
                      </div>

                      {/* Final Confirmation cards */}
                      <div className="ms-ct-confirmRow">
                        <div className="ms-ct-card ms-ct-miniCard">
                          <div className="ms-ct-cardHead">Final Confirmation (Client)</div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Full Name</label>
                            <input className="ms-ct-input" placeholder="Full Name" disabled={isViewOnly} />
                          </div>

                          <label className="ms-ct-check">
                            <input type="checkbox" disabled={isViewOnly} />
                            <span>
                              I accept and agree to the{" "}
                              <a className="ms-ct-link" href="#">
                                terms and conditions
                              </a>
                            </span>
                          </label>

                          <button type="button" className="ms-ct-confirmBtn lime" disabled={isViewOnly}>
                            Ready to fund escrow
                          </button>

                          <div className="ms-ct-bottomBtns">
                            <button type="button" className="ms-ct-ghostBtn" disabled={isViewOnly}>
                              Send for review
                            </button>
                            <button type="button" className="ms-ct-ghostBtn" disabled={isViewOnly}>
                              Edit Contract
                            </button>
                          </div>
                        </div>

                        <div className="ms-ct-card ms-ct-miniCard">
                          <div className="ms-ct-cardHead">Final Confirmation (Creator)</div>

                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Full Name</label>
                            <input className="ms-ct-input" placeholder="Full Name" disabled={isViewOnly} />
                          </div>

                          <label className="ms-ct-check">
                            <input type="checkbox" disabled={isViewOnly} />
                            <span>
                              I accept and agree to the{" "}
                              <a className="ms-ct-link" href="#">
                                terms and conditions
                              </a>
                            </span>
                          </label>

                          <button type="button" className="ms-ct-confirmBtn lime" disabled={isViewOnly}>
                            Accept contract
                          </button>

                          <div className="ms-ct-bottomBtns">
                            <button type="button" className="ms-ct-ghostBtn" disabled={isViewOnly}>
                              Cancelled
                            </button>
                            <button type="button" className="ms-ct-ghostBtn" disabled={isViewOnly}>
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Activity Log */}
                      <div className="ms-ct-card ms-ct-activity-box">
                        <div className="ms-ct-cardHead">Activity Log</div>

                        <div className="ms-ct-table">
                          <div className="ms-ct-thead">
                            <div>Timestamp</div>
                            <div>Actor</div>
                            <div>Action</div>
                            <div>Details</div>
                          </div>

                          <div className="ms-ct-trow">
                            <div>2025-12-10 10:12</div>
                            <div>Client @acme</div>
                            <div>Created contract</div>
                            <div>Title: Landing Page Design</div>
                          </div>

                          <div className="ms-ct-trow">
                            <div>2025-12-10 11:05</div>
                            <div>Team Owner @alpha</div>
                            <div>Edited milestones</div>
                            <div>Added Milestone 2 (₹25,000)</div>
                          </div>

                          <div className="ms-ct-trow highlight">
                            <div>2025-12-11 09:30</div>
                            <div>Team Admin @alpha</div>
                            <div>Accepted &amp; sent to client</div>
                            <div>Review window: 3 days</div>
                          </div>

                          <div className="ms-ct-trow">
                            <div>2025-12-12 14:02</div>
                            <div>Client @acme</div>
                            <div>Resolution: Funded escrow</div>
                            <div>Total: ₹75,000</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ DETAILS TAB */}
              {activeTop === "Details" && (
                <div className="ms-details">
                  <div className="msd-head">
                    <h2 className="msd-title">{details.title}</h2>
                    <div className="msd-sub">
                      Ordered from <b>{details.orderedFrom}</b> &nbsp;·&nbsp;
                      Delivery date: {details.deliveryDate}
                    </div>
                    <div className="msd-muted">Ordered number {details.orderNumber}</div>
                  </div>

                  <div className="msd-card">
                    <div className="msd-cardHead">
                      <div className="msd-cardTitle">Your Order</div>
                      <div className="msd-cardDate">{details.orderDate}</div>
                    </div>

                    <div className="msd-table">
                      <div className="msd-tr msd-th">
                        <div>Item</div>
                        <div>Qty.</div>
                        <div>Duration</div>
                        <div className="right">Price</div>
                      </div>

                      {details.orderRows.map((r, i) => (
                        <div className="msd-tr" key={i}>
                          <div>{r.item}</div>
                          <div>{r.qty}</div>
                          <div>{r.duration}</div>
                          <div className="right">{r.price}</div>
                        </div>
                      ))}

                      <div className="msd-tr msd-sum">
                        <div className="span3">Subtotal</div>
                        <div className="right">{details.subtotal}</div>
                      </div>

                      <div className="msd-tr msd-sum">
                        <div className="span3">Service fee</div>
                        <div className="right">{details.serviceFee}</div>
                      </div>

                      <div className="msd-tr msd-total">
                        <div className="span3">Total</div>
                        <div className="right">{details.total}</div>
                      </div>
                    </div>
                  </div>

                  <div className="msd-card">
                    <div className="msd-cardHead">
                      <div className="msd-cardTitle">Order extension</div>
                      <div className="msd-cardDate">{details.extensionDate}</div>
                    </div>

                    <div className="msd-table">
                      <div className="msd-tr msd-th">
                        <div>Item</div>
                        <div>Qty.</div>
                        <div>Duration</div>
                        <div className="right">Price</div>
                      </div>

                      {details.extensionRows.map((r, i) => (
                        <div className="msd-tr" key={i}>
                          <div>{r.item}</div>
                          <div>{r.qty}</div>
                          <div>{r.duration}</div>
                          <div className="right">{r.price}</div>
                        </div>
                      ))}

                      <div className="msd-tr msd-total">
                        <div className="span3">Total</div>
                        <div className="right">{details.extensionTotal}</div>
                      </div>
                    </div>
                  </div>

                  <div className="msd-help">
                    If something appears to be missing or incorrect, please visit our{" "}
                    <a href="#" className="msd-link">
                      resolution center
                    </a>
                  </div>

                  <div className="msd-grid">
                    <div className="msd-card msd-mini">
                      <div className="msd-miniTitle">Milestone- details</div>
                      <div className="msd-miniRow">
                        <span>Amount</span>
                        <span>{details.milestone.amount}</span>
                      </div>
                      <div className="msd-miniRow">
                        <span>Deadline</span>
                        <span>{details.milestone.deadline}</span>
                      </div>
                      <div className="msd-miniRow">
                        <span>Platform fee 20% (demo)</span>
                        <span>{details.milestone.platformFee}</span>
                      </div>
                      <div className="msd-miniRow strong">
                        <span>Net amount:</span>
                        <span>{details.milestone.netAmount}</span>
                      </div>
                    </div>

                    <div className="msd-card msd-mini">
                      <div className="msd-miniTitle">Split</div>

                      <div className="msd-table">
                        <div className="msd-tr msd-th msd-splitHead">
                          <div>Members</div>
                          <div>Percentage</div>
                          <div className="right">Amount</div>
                        </div>

                        {details.split.map((r, i) => (
                          <div className="msd-tr" key={i}>
                            <div>{r.member}</div>
                            <div>{r.pct}</div>
                            <div className="right">{r.amount}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ MILESTONES TAB */}
              {activeTop === "Milestones" && (
                <>
                  <div className="ms-cards">
                    <div className="ms-card">
                      <div className="ms-cardTitle">Overall progress</div>
                      <div className="ms-bar">
                        <div className="ms-barFill" style={{ width: `${progressPct}%` }} />
                      </div>
                      <div className="ms-sub">
                        {data.completed} of {data.total} milestones completed
                      </div>
                    </div>

                    <div className="ms-card">
                      <div className="ms-cardTitle">Timeline</div>
                      <div className="ms-item">
                        ● Start date: <b>{data.startedAt}</b>
                      </div>
                      <div className="ms-item">
                        ○ End date: <b>{data.targetAt}</b>
                      </div>
                    </div>

                    <div className="ms-card">
                      <div className="ms-cardTitle">Revisions</div>
                      <div className="ms-item">
                        Used: <b>{data.revisionsUsed}</b> / {data.revisionsTotal}
                      </div>
                    </div>

                    <div className="ms-card">
                      <div className="ms-cardTitle">Next action</div>
                      <div className="ms-item">{data.nextActionTitle}</div>
                      <div className="ms-sub">{data.nextActionDate}</div>
                    </div>
                  </div>

                  <div className="ms-controls">
                    <div className="ms-dd-wrap" ref={projectRef}>
                      <button
                        className={`ms-dd-trigger ${projectOpen ? "open" : ""}`}
                        onClick={() => setProjectOpen(!projectOpen)}
                      >
                        <span>{projectValue}</span>
                        <span className="ms-dd-arrow" aria-hidden="true" />
                      </button>

                      {projectOpen && (
                        <div className="ms-dd-menu">
                          <button className="ms-dd-item">Full project</button>
                          <button className="ms-dd-item disabled" disabled>
                            Current milestone
                          </button>
                          <button className="ms-dd-item disabled" disabled>
                            Previous Milestone
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="ms-status-actions">
                      <button className="ms-btn-late">Late</button>
                      <button className="ms-btn-very-late">Very late</button>
                    </div>
                  </div>

                  <div className="ms-notice">{data.notice}</div>

                  <div className="ms-status">
                    {statusTabs.map((s) => (
                      <button
                        key={s}
                        className={`ms-pill ${activeStatus === s ? "active" : ""}`}
                        onClick={() => setActiveStatus(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="ms-lower">
                    <div className="ms-feed">
                      {feed.map((it, idx) => (
                        <div key={idx} className={`ms-event ${it.highlight ? "highlight" : ""}`}>
                          <div className="ms-eventHead">
                            <div className="ms-eventLeft">
                              <div className="ms-eventTitle">{it.title}</div>
                              {it.pill && (
                                <span className={`ms-miniPill ${it.pill.toLowerCase()}`}>{it.pill}</span>
                              )}
                            </div>
                            <div className="ms-eventTs">{it.ts}</div>
                          </div>

                          <div className="ms-eventDesc">{it.desc}</div>

                          <div className="ms-tagRow">
                            {(it.tags || []).map((t) => (
                              <span key={t} className="ms-tag">
                                {t}
                              </span>
                            ))}
                          </div>

                          {it.files?.length ? (
                            <div className="ms-fileRow">
                              {it.files.map((f) => (
                                <button key={f} className="ms-fileBtn" type="button">
                                  {f} <span className="ms-open">open</span>
                                </button>
                              ))}
                            </div>
                          ) : null}

                          <div className="ms-eventFoot">
                            <div className="ms-chat">{it.chat}</div>
                            <div className="ms-rightFoot">
                              {it.amount && <div className="ms-amount">{it.amount}</div>}
                              {it.footerBadge && <span className="ms-badge">{it.footerBadge}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="ms-side">
                      <div className="ms-panel ms-panel-action">
                        <div className="ms-panelTitle">Action</div>
                        <button className="ms-actionBtn lime" type="button">
                          Upload
                        </button>
                        <button className="ms-actionBtn lime" type="button">
                          Message Client
                        </button>
                        <button className="ms-actionBtn" type="button">
                          Resolution Center
                        </button>
                      </div>

                      <div className="ms-panel ms-panel-revision">
                        <div className="ms-panelTitle">Revision Requested</div>
                        <div className="ms-panelSub">Client as requested revision for milestone 1</div>

                        <div className="ms-timer">
                          <div className="ms-timeBox">
                            <div className="ms-timeNum">1</div>
                            <div className="ms-timeLbl">Day</div>
                          </div>
                          <div className="ms-timeBox">
                            <div className="ms-timeNum">20</div>
                            <div className="ms-timeLbl">Hours</div>
                          </div>
                          <div className="ms-timeBox">
                            <div className="ms-timeNum">30</div>
                            <div className="ms-timeLbl">Minutes</div>
                          </div>
                        </div>

                        <div className="ms-panelTitle small">Description</div>
                        <div className="ms-descText">
                          Lorem ipsum is simply dummy text of the printing and typesetting industry...
                        </div>

                        <div className="ms-tagRow">
                          <span className="ms-tag">Milestone: Design phase</span>
                        </div>

                        <div className="ms-fileRow">
                          <button className="ms-fileBtn" type="button">
                            Home.fig <span className="ms-open">open</span>
                          </button>
                          <button className="ms-fileBtn" type="button">
                            dashboard.fig <span className="ms-open">open</span>
                          </button>
                          <button className="ms-fileBtn" type="button">
                            preview.pdf <span className="ms-open">open</span>
                          </button>
                          <button className="ms-fileBtn" type="button">
                            Deadline: 2025-12-15
                          </button>
                        </div>

                        <button className="ms-actionBtn lime" type="button">
                          Accept revision
                        </button>
                        <button className="ms-actionBtn" type="button">
                          Cancel revision
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

