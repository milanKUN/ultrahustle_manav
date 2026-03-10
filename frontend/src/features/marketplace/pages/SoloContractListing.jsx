import React, { useMemo, useState, useRef, useEffect } from "react";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./SoloContractListing.css";
import '../../../Darkuser.css';

export default function SoloContractListing({ theme = "light", setTheme }) {


  const contractId = useMemo(() => "AUTO-123456", []);


  const [form, setForm] = useState({
    // Basics
    title: "",
    contractType: "",
    soloTeam: false,

    // Parties
    clientUsername: "",
    clientFullName: "",
    clientEmail: "",
    clientCompany: "",

    creatorUsername: "",
    creatorFullName: "",
    creatorEmail: "",
    creatorCompany: "",

    // Scope
    projectSummary: "",
    outOfScope: "",

    // Timeline
    initialDeliveryDeadline: "",
    clientReviewWindow: "",
    includedRevisionRounds: "",
    revisionTurnaroundDays: "",
    lateDeliveryConsequence: "",

    // SLA
    deliverySLA: "",
    communicationSLA: "",
    revisionSLA: "",
    qualityStandards: "",
    clientResponsibilities: "",
    creatorResponsibilities: "",

    // Payment & escrow
    paymentType: "",
    projectCost: "",
    escrowRules: "",

    // Final confirmation
    finalClientName: "",
    finalCreatorName: "",
    clientAgree: false,
    creatorAgree: false,
    teamPayouts: [
      { id: "1", name: "Member A", role: "Design", percentage: "80%" },
      { id: "2", name: "Member B", role: "Dev", percentage: "60%" },
      { id: "3", name: "Member C", role: "QA", percentage: "50%" },
    ],
  });

  // ✅ Sidebar & Settings state (matching standard layout)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("");

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const setFormField = (key, value) =>
    setForm((p) => ({ ...p, [key]: value }));

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onToggle = (key) => () => setForm((p) => ({ ...p, [key]: !p[key] }));

  const handlePayoutChange = (id, field, value) => {
    setForm((p) => ({
      ...p,
      teamPayouts: p.teamPayouts.map((pay) =>
        pay.id === id ? { ...pay, [field]: value } : pay
      ),
    }));
  };

  // Deliverables
  const [deliverables, setDeliverables] = useState([
    { id: crypto?.randomUUID?.() || String(Date.now()), title: "", format: "", qty: "", acceptance: "" }
  ]);

  const updateDeliverable = (index, key, value) => {
    setDeliverables((p) =>
      p.map((d, i) => (i === index ? { ...d, [key]: value } : d))
    );
  };

  const addDeliverable = () => {
    setDeliverables((p) => [
      ...p,
      {
        id: crypto?.randomUUID?.() || String(Date.now()),
        title: "",
        format: "",
        qty: "",
        acceptance: "",
      },
    ]);
  };

  const removeDeliverable = (id) => {
    if (deliverables.length <= 1) {
      setDeliverables([{ id: crypto?.randomUUID?.() || String(Date.now()), title: "", format: "", qty: "", acceptance: "" }]);
      return;
    }
    setDeliverables((p) => p.filter((d) => d.id !== id));
  };

  // Milestones
  const [milestones, setMilestones] = useState([
    { id: crypto?.randomUUID?.() || String(Date.now()), name: "Milestone 1", amount: "", deadline: "" }
  ]);

  const updateMilestone = (index, key, value) => {
    setMilestones((p) =>
      p.map((m, i) => (i === index ? { ...m, [key]: value } : m))
    );
  };

  const addMilestone = () => {
    setMilestones((p) => [
      ...p,
      {
        id: crypto?.randomUUID?.() || String(Date.now()),
        name: `Milestone ${p.length + 1}`,
        amount: "",
        deadline: "",
      },
    ]);
  };

  const removeMilestone = (id) => {
    if (milestones.length <= 1) return;
    setMilestones((p) => p.filter((m) => m.id !== id));
  };

  // Activity log dummy (same UI)
  const activity = useMemo(
    () => [
      { ts: "2025-11-20 10:00", actor: "Client @acme_corp", action: "Contract Created", details: "Initial draft submitted" },
      { ts: "2025-11-21 14:30", actor: "Creator @alex_design", action: "Terms Negotiated", details: "Updated milestones and delivery timeline" },
      { ts: "2025-11-22 09:15", actor: "Client @acme_corp", action: "Contract Approved", details: "Ready for escrow funding" }
    ],
    []
  );

  // --- Dropdown state keys to manage open/close ---
  const [openSelect, setOpenSelect] = useState(null); // Keeps track of which dropdown is open
  const selectRefs = useRef({});

  // --- Calendar state ---
  const [calendarConfig, setCalendarConfig] = useState(null); // { id: string, value: string, onSelect: func }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openSelect && selectRefs.current[openSelect] && !selectRefs.current[openSelect].contains(event.target)) {
        setOpenSelect(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSelect]);

  const toggleSelect = (id) => {
    setOpenSelect(openSelect === id ? null : id);
  };

  const handleSelectValue = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setOpenSelect(null);
  };

  const SoloSelect = ({ id, label, value, options, placeholder = "Select one", onChange }) => {
    const isOpen = openSelect === id;
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className="cnc-field" ref={(el) => (selectRefs.current[id] = el)}>
        <label className="cnc-label">{label}</label>
        <div className={`onboarding-custom-select ${isOpen ? "active" : ""}`}>
          <div
            className={`onboarding-selected-option ${isOpen ? "open" : ""}`}
            onClick={() => toggleSelect(id)}
          >
            <span className={!value ? "opacity-70" : ""}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="onboarding-arrow">▼</span>
          </div>

          {isOpen && (
            <ul className="onboarding-options-list">
              {options.map((opt) => (
                <li
                  key={opt.value}
                  className={value === opt.value ? "active" : ""}
                  onClick={() => onChange(opt.value)}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  const DateInput = ({ label, value, onOpen }) => (
    <div className="cnc-field">
      <label className="cnc-label">{label}</label>
      <div
        className="cnc-input cnc-dateInputWrap"
        onClick={onOpen}
        tabIndex="0"
      >
        <span className={!value ? "opacity-70" : ""}>
          {value || "DD-MM-YYYY"}
        </span>
        <span className="cnc-dateIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
      </div>
    </div>
  );

  return (
    <div className={`user-page ${theme} min-h-screen relative overflow-hidden`}>
      {/* ---------- NAVBAR ---------- */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
      />

      <div className="pt-[85px] flex relative z-10 w-full h-full">
        {/* ---------- SIDEBAR ---------- */}
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

        {/* Main Content Wrapper */}
        <div className="relative flex-1 min-w-5 overflow-hidden">
          {/* Scrollable Area */}
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)] p-4">
            <main className="cnc-main w-full">
              {/* Full width contract */}
              <div className="cnc-wrap">
                <h1 className="cnc-title">Create New Contract</h1>

                {/* Contract Basics */}
                <div className="cnc-card">
                  <h2 className="cnc-card-title">Contract Basics</h2>
                  <div className="cnc-grid">
                    <div className="cnc-field">
                      <label className="cnc-label">Contract Title</label>
                      <input
                        className="cnc-input"
                        placeholder="Contract Title"
                        value={form.title}
                        onChange={onChange("title")}
                      />
                    </div>
                    <div className="cnc-field cnc-contract-type-field">
                      <label className="cnc-label">Contract Type</label>
                      <div className="cnc-type-switch-wrapper">
                        <span className={`cnc-type-label ${!form.soloTeam ? "active" : ""}`}>
                          Solo
                        </span>
                        <button
                          type="button"
                          className={`cnc-switch ${form.soloTeam ? "is-on" : ""}`}
                          onClick={onToggle("soloTeam")}
                          aria-pressed={form.soloTeam}
                          aria-label="Solo/team toggle"
                        >
                          <span className="cnc-knob" />
                        </button>
                        <span className={`cnc-type-label ${form.soloTeam ? "active" : ""}`}>
                          Team
                        </span>
                      </div>
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Contract ID</label>
                      <input className="cnc-input" value={contractId} readOnly />
                    </div>
                    <div className="cnc-field cnc-field--empty" />
                  </div>
                </div>



                {/* Parties Involved */}
                <div className="cnc-parties-outer-box">
                  <h2 className="cnc-card-title cnc-title-standalone">Parties Involved</h2>
                  <div className="cnc-parties-wrapper">
                    <div className="cnc-subcard">
                      <div className="cnc-subTitle">Client</div>
                      <div className="cnc-subGrid">
                        <div className="cnc-field">
                          <label className="cnc-label">Client username</label>
                          <input
                            className="cnc-input"
                            placeholder="Client username"
                            value={form.clientUsername}
                            onChange={onChange("clientUsername")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Full name</label>
                          <input
                            className="cnc-input"
                            placeholder="Full name"
                            value={form.clientFullName}
                            onChange={onChange("clientFullName")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Email</label>
                          <input
                            className="cnc-input"
                            placeholder="Email"
                            value={form.clientEmail}
                            onChange={onChange("clientEmail")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Name and company</label>
                          <input
                            className="cnc-input"
                            placeholder="Name and company"
                            value={form.clientCompany}
                            onChange={onChange("clientCompany")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="cnc-subcard">
                      <div className="cnc-subTitle">
                        {form.soloTeam ? "Team Details" : "Service Provider"}
                      </div>
                      <div className="cnc-subGrid">
                        <div className="cnc-field">
                          <label className="cnc-label">
                            {form.soloTeam ? "Team" : "Creator"} username
                          </label>
                          <input
                            className="cnc-input"
                            placeholder={form.soloTeam ? "Team username" : "Creator username"}
                            value={form.creatorUsername}
                            onChange={onChange("creatorUsername")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">
                            {form.soloTeam ? "Team" : "Creator"} full name
                          </label>
                          <input
                            className="cnc-input"
                            placeholder={form.soloTeam ? "Team full name" : "Full name"}
                            value={form.creatorFullName}
                            onChange={onChange("creatorFullName")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">
                            {form.soloTeam ? "Team" : "Creator"} email
                          </label>
                          <input
                            className="cnc-input"
                            placeholder={form.soloTeam ? "Team email" : "Email"}
                            value={form.creatorEmail}
                            onChange={onChange("creatorEmail")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Name and company</label>
                          <input
                            className="cnc-input"
                            placeholder="Country"
                            value={form.creatorCompany}
                            onChange={onChange("creatorCompany")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope and Deliverables */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Scope and Deliverables</h2>
                  <div className="cnc-field">
                    <label className="cnc-label">Project Summary</label>
                    <textarea
                      className="cnc-textarea"
                      placeholder="Short explanation"
                      value={form.projectSummary}
                      onChange={onChange("projectSummary")}
                    />
                  </div>

                  <div className="cnc-deliverables">
                    <div className="cnc-del-title">Deliverables</div>

                    {deliverables.length > 0 && (
                      <div className="cnc-del-header">
                        <label className="cnc-label">Title</label>
                        <label className="cnc-label">Format/file type</label>
                        <label className="cnc-label">Quantity</label>
                        <label className="cnc-label">Acceptance Criteria</label>
                        <div /> {/* remove btn space */}
                      </div>
                    )}

                    {deliverables.map((d, index) => (
                      <div className="cnc-del-row-wrapper" key={d.id}>
                        <div className="cnc-del-grid">
                          <input
                            className="cnc-input"
                            placeholder="Title"
                            value={d.title}
                            onChange={(e) => updateDeliverable(index, "title", e.target.value)}
                          />
                          <input
                            className="cnc-input"
                            placeholder="Format/file type"
                            value={d.format}
                            onChange={(e) => updateDeliverable(index, "format", e.target.value)}
                          />
                          <input
                            className="cnc-input"
                            placeholder="Quantity"
                            value={d.qty}
                            onChange={(e) => updateDeliverable(index, "qty", e.target.value)}
                          />
                          <input
                            className="cnc-input"
                            placeholder="Acceptance Criteria"
                            value={d.acceptance}
                            onChange={(e) => updateDeliverable(index, "acceptance", e.target.value)}
                          />
                          <button
                            type="button"
                            className="cnc-del-row-remove"
                            onClick={() => removeDeliverable(d.id)}
                            title="Remove row"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="cnc-addBtn mt-2" onClick={addDeliverable}>
                      + Add More Deliverables
                    </button>
                  </div>

                  <div className="cnc-field cnc-outScope">
                    <label className="cnc-label">Out of scope</label>
                    <textarea
                      className="cnc-textarea"
                      placeholder="Free text"
                      value={form.outOfScope}
                      onChange={onChange("outOfScope")}
                    />
                  </div>
                </div>

                {/* Timeline and Revisions */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Timeline and Revisions</h2>
                  <div className="cnc-timelineGrid">
                    {/* Initial delivery deadline */}
                    <DateInput
                      label="Initial delivery deadline"
                      value={form.initialDeliveryDeadline}
                      onOpen={() =>
                        setCalendarConfig({
                          value: form.initialDeliveryDeadline,
                          onSelect: (val) =>
                            setFormField("initialDeliveryDeadline", val),
                        })
                      }
                    />

                    {/* Client review window */}
                    <SoloSelect
                      id="clientReviewWindow"
                      label="Client review window (1–7 days)"
                      value={form.clientReviewWindow}
                      options={[1, 2, 3, 4, 5, 6, 7].map((n) => ({
                        value: String(n),
                        label: `${n} day${n > 1 ? "s" : ""}`,
                      }))}
                      onChange={(val) => handleSelectValue("clientReviewWindow", val)}
                    />

                    {/* Included revision rounds */}
                    <SoloSelect
                      id="includedRevisionRounds"
                      label="Included revision rounds"
                      value={form.includedRevisionRounds}
                      options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
                        value: String(n),
                        label: String(n),
                      }))}
                      onChange={(val) => handleSelectValue("includedRevisionRounds", val)}
                    />

                    {/* Revision turnaround time */}
                    <SoloSelect
                      id="revisionTurnaroundDays"
                      label="Revision turnaround time (days)"
                      value={form.revisionTurnaroundDays}
                      options={[1, 2, 3, 4, 5, 7, 10, 14, 21, 30].map((n) => ({
                        value: String(n),
                        label: `${n} day${n > 1 ? "s" : ""}`,
                      }))}
                      onChange={(val) => handleSelectValue("revisionTurnaroundDays", val)}
                    />

                    {/* Late delivery consequence */}
                    <SoloSelect
                      id="lateDeliveryConsequence"
                      label="Late delivery consequence"
                      value={form.lateDeliveryConsequence}
                      options={[
                        { value: "discount_5", label: "5% discount" },
                        { value: "discount_10", label: "10% discount" },
                        { value: "refund_partial", label: "Partial refund" },
                        { value: "refund_full", label: "Full refund" },
                        { value: "extend_deadline", label: "Extend deadline" },
                      ]}
                      placeholder="Select"
                      onChange={(val) => handleSelectValue("lateDeliveryConsequence", val)}
                    />
                  </div>
                </div>

                {/* SLA Snapshot */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">SLA Snapshot</h2>
                  <div className="cnc-slaGrid">
                    <div className="cnc-field">
                      <label className="cnc-label">Delivery SLA</label>
                      <input
                        className="cnc-input"
                        placeholder="Delivery SLA"
                        value={form.deliverySLA}
                        onChange={onChange("deliverySLA")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Communication SLA</label>
                      <input
                        className="cnc-input"
                        placeholder="Communication SLA"
                        value={form.communicationSLA}
                        onChange={onChange("communicationSLA")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Revision SLA</label>
                      <input
                        className="cnc-input"
                        placeholder="Revision SLA"
                        value={form.revisionSLA}
                        onChange={onChange("revisionSLA")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Quality standards</label>
                      <input
                        className="cnc-input"
                        placeholder="Quality standards"
                        value={form.qualityStandards}
                        onChange={onChange("qualityStandards")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Client responsibilities</label>
                      <input
                        className="cnc-input"
                        placeholder="Client responsibilities"
                        value={form.clientResponsibilities}
                        onChange={onChange("clientResponsibilities")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Creator/team responsibilities</label>
                      <input
                        className="cnc-input"
                        placeholder="Creator/team responsibilities"
                        value={form.creatorResponsibilities}
                        onChange={onChange("creatorResponsibilities")}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment and Escrow */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Payment and Escrow</h2>
                  <div className="cnc-payTop">
                    <SoloSelect
                      id="paymentType"
                      label="Payment Type"
                      value={form.paymentType}
                      options={[
                        { value: "fixed", label: "Fixed" },
                        { value: "milestone", label: "Milestone based" },
                        { value: "hourly", label: "Hourly" },
                      ]}
                      onChange={(val) => handleSelectValue("paymentType", val)}
                    />
                    <div className="cnc-field">
                      <label className="cnc-label">Project cost</label>
                      <input
                        className="cnc-input"
                        placeholder="$50000"
                        value={form.projectCost}
                        onChange={onChange("projectCost")}
                      />
                    </div>
                    <div className="cnc-field cnc-span-all">
                      <label className="cnc-label">Escrow Rules</label>
                      <input
                        className="cnc-input"
                        placeholder="Funds lock before work starts. Release after approval or review expiry."
                        value={form.escrowRules}
                        onChange={onChange("escrowRules")}
                      />
                    </div>
                  </div>

                  <div className="cnc-milestones">
                    <div className="cnc-del-title">Milestones</div>

                    {milestones.length > 0 && (
                      <div className="cnc-mil-header">
                        <label className="cnc-label">Milestone Name</label>
                        <label className="cnc-label">Amount</label>
                        <label className="cnc-label">Deadline</label>
                        <div /> {/* remove btn space */}
                      </div>
                    )}

                    {milestones.map((m, index) => (
                      <div className="cnc-mil-row-wrapper" key={m.id}>
                        <div className="cnc-mil-grid">
                          <input
                            className="cnc-input"
                            placeholder={`Milestone ${index + 1}`}
                            value={m.name}
                            onChange={(e) => updateMilestone(index, "name", e.target.value)}
                          />
                          <input
                            className="cnc-input"
                            placeholder="$1000"
                            value={m.amount}
                            onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                          />
                          <DateInput
                            label=""
                            value={m.deadline}
                            onOpen={() => setCalendarConfig({
                              value: m.deadline,
                              onSelect: (val) => updateMilestone(index, "deadline", val)
                            })}
                          />
                          <button
                            type="button"
                            className="cnc-mil-row-remove"
                            onClick={() => removeMilestone(m.id)}
                            title="Remove milestone"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="cnc-addBtn mt-2" onClick={addMilestone}>
                      + Add Milestone
                    </button>
                  </div>
                </div>

                {/* Team Payout Configuration (Conditional) */}
                {form.soloTeam && (
                  <div className="cnc-card cnc-card--mt cnc-teamPayoutCard">
                    <h2 className="cnc-card-title">Team Payout Configuration</h2>
                    <div className="cnc-payout-list">
                      {form.teamPayouts.map((payout) => (
                        <div className="cnc-payout-row" key={payout.id}>
                          <div className="cnc-field">
                            <input
                              className="cnc-input cnc-payout-input"
                              placeholder="Member Name"
                              value={payout.name}
                              onChange={(e) => handlePayoutChange(payout.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="cnc-field">
                            <input
                              className="cnc-input cnc-payout-input"
                              placeholder="Role"
                              value={payout.role}
                              onChange={(e) => handlePayoutChange(payout.id, "role", e.target.value)}
                            />
                          </div>
                          <div className="cnc-field">
                            <input
                              className="cnc-input cnc-payout-input"
                              placeholder="Percentage"
                              value={payout.percentage}
                              onChange={(e) => handlePayoutChange(payout.id, "percentage", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Confirmation Section */}
                <div className="cnc-confirmArea cnc-card--mt">
                  <div className="cnc-confirmRow">
                    {/* Client Box */}
                    <div className="cnc-confirmCard">
                      <div className="cnc-confirmTitle">Final Confirmation (Client)</div>
                      <div className="cnc-field">
                        <label className="cnc-label">Full Name</label>
                        <input
                          className="cnc-input"
                          placeholder="Full Name"
                          value={form.finalClientName}
                          onChange={onChange("finalClientName")}
                        />
                      </div>
                      <label className="cnc-checkRow">
                        <input
                          type="checkbox"
                          checked={form.clientAgree}
                          onChange={onToggle("clientAgree")}
                        />
                        <span>
                          I accept and agree to the <a href="#">terms and conditions</a>
                        </span>
                      </label>
                      <button type="button" className="cnc-primaryBtn">
                        Ready to fund escrow
                      </button>
                      <div className="cnc-confirmActions">
                        <button type="button" className="cnc-ghostBtn">Send for review</button>
                        <button type="button" className="cnc-ghostBtn">Edit Contract</button>
                      </div>
                    </div>

                    {/* Team Box */}
                    <div className="cnc-confirmCard">
                      <div className="cnc-confirmTitle">Final Confirmation (Team)</div>
                      <div className="cnc-field">
                        <label className="cnc-label">Team Name</label>
                        <input
                          className="cnc-input"
                          placeholder="Team Name"
                          value={form.finalCreatorName}
                          onChange={onChange("finalCreatorName")}
                        />
                      </div>
                      <label className="cnc-checkRow">
                        <input
                          type="checkbox"
                          checked={form.creatorAgree}
                          onChange={onToggle("creatorAgree")}
                        />
                        <span>
                          I accept and agree to the <a href="#">terms and conditions</a>
                        </span>
                      </label>
                      <button type="button" className="cnc-primaryBtn">
                        Accept contract
                      </button>
                      <div className="cnc-confirmActions">
                        <button type="button" className="cnc-ghostBtn">Cancelled</button>
                        <button type="button" className="cnc-ghostBtn">Decline</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Activity Log</h2>
                  <div className="cnc-tableWrap">
                    <table className="cnc-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Actor</th>
                          <th>Action</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.map((r, idx) => (
                          <tr key={idx}>
                            <td>{r.ts}</td>
                            <td>{r.actor}</td>
                            <td>{r.action}</td>
                            <td>{r.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* ================= CALENDAR MODAL ================= */}
      {calendarConfig && (
        <Calendar
          initialDate={calendarConfig.value}
          onClose={() => setCalendarConfig(null)}
          onSelect={(date) => {
            calendarConfig.onSelect(date);
            setCalendarConfig(null);
          }}
        />
      )}
    </div>
  );
}

/* ================= CALENDAR COMPONENT ================= */

function Calendar({ onClose, onSelect, initialDate }) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const today = new Date();

  // Parse initialDate if exists (DD-MM-YYYY)
  const parseInit = () => {
    if (!initialDate) return { month: today.getMonth(), year: today.getFullYear() };
    const parts = initialDate.split("-");
    if (parts.length !== 3) return { month: today.getMonth(), year: today.getFullYear() };
    return { month: parseInt(parts[1]) - 1, year: parseInt(parts[2]) };
  };

  const initData = parseInit();

  const [year, setYear] = useState(initData.year);
  const [month, setMonth] = useState(initData.month);
  const [openYear, setOpenYear] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const yearRef = useRef(null);

  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setOpenYear(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const changeMonth = (dir) => {
    if (dir === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    } else {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
    }
  };

  const formatDate = (d) =>
    `${String(d).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/20 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center cursor-pointer p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#2B2B2B] w-[95%] max-w-[335px] h-[350px] rounded-xl p-3 shadow-lg calendar-outer cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-[#2B2B2B] w-full h-full rounded-lg p-3 flex flex-col text-black dark:text-[#f0f0f0] calendar-inner">
          {/* YEAR DROPDOWN */}
          <div className="relative mb-6 z-20 w-full" ref={yearRef}>
            <div className={`onboarding-custom-select ${openYear ? "active" : ""}`}>
              <div
                className={`onboarding-selected-option ${openYear ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenYear(!openYear);
                }}
                style={{ background: "#CEFF1B", color: "black", fontWeight: "bold" }}
              >
                <span>{year} :</span>
                <span className="onboarding-arrow">▼</span>
              </div>

              {openYear && (
                <ul className="onboarding-options-list dark:bg-[#1E1E1E]">
                  {years.map((y) => (
                    <li
                      key={y}
                      className={y === year ? "active" : ""}
                      onClick={() => {
                        setYear(y);
                        setOpenYear(false);
                      }}
                    >
                      {y}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* MONTH HEADER */}
          <div className="flex justify-between items-center text-sm font-medium -mt-2 mb-2 px-1">
            <span
              onClick={() => changeMonth("prev")}
              className="cursor-pointer text-lg font-bold w-8 h-8 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
            >
              ‹
            </span>
            <span className="font-bold">
              {months[month]} {year}
            </span>
            <span
              onClick={() => changeMonth("next")}
              className="cursor-pointer text-lg font-bold w-8 h-8 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
            >
              ›
            </span>
          </div>

          {/* WEEK */}
          <div className="grid grid-cols-7 text-[10px] text-black dark:text-gray-400 mb-2 font-bold uppercase">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-2 text-sm flex-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="text-center text-gray-300 dark:text-gray-700"
              >
                {prevMonthDays - firstDay + i + 1}
              </div>
            ))}

            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const formatted = formatDate(day);
              const isSelected = selectedDate === formatted;

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDate(formatted);
                    onSelect(formatted);
                  }}
                  className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 font-bold
                    ${isSelected
                      ? "bg-[#CEFF1B] text-black shadow-[0_0_10px_rgba(206,255,27,0.4)]"
                      : "text-black dark:text-gray-300 hover:bg-[#CEFF1B] hover:text-black"
                    }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
