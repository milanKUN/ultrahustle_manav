import React, { useMemo, useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Smile, Paperclip, SendHorizontal, BadgeCheck, X, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import "./CreatorMilestonesPage.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import { 
  saveContract, 
  getContract, 
  updateContractStatus,
  submitMilestone,
  approveMilestone,
  requestMilestoneRevision,
  acceptMilestoneRevision,
  cancelMilestoneRevision,
  requestResolution
} from "../api/contractApi";

export default function MilestoneBoard({ theme = "light", setTheme }) {
  const { contractId: urlContractId } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || "creator");

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [projectOpen, setProjectOpen] = useState(false);
  const [projectValue, setProjectValue] = useState("Full project");
  const projectRef = useRef(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [deliveryFileName, setDeliveryFileName] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [sidebarFocusMilestone, setSidebarFocusMilestone] = useState(null);
  const uploadInputRef = useRef(null);

  useEffect(() => {
    const handleStorage = () => {
      setUserType(localStorage.getItem("userType") || "creator");
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("userTypeChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userTypeChange", handleStorage);
    };
  }, []);

  // ✅ VIEW ONLY STATE
  const [isViewOnly, setIsViewOnly] = useState(!!urlContractId);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setUserType(localStorage.getItem("userType") || "creator");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectRef.current && !projectRef.current.contains(event.target)) {
        setProjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (urlContractId) {
      fetchContractData();
    }
  }, [urlContractId]);

  const fetchContractData = async () => {
    setLoading(true);
    try {
      const res = await getContract(urlContractId);
      if (res.success) {
        setContract(res.data);
        setIsModified(false);

        // Focus logic
        if (!sidebarFocusMilestone) {
          const pending = res.data.milestones?.find(m => m.status === 'Revision Requested' || m.status === 'In-Progress' || m.status === 'Submitted');
          if (pending) setSidebarFocusMilestone(pending);
        } else {
          const updated = res.data.milestones?.find(m => m.id === sidebarFocusMilestone.id);
          if (updated) setSidebarFocusMilestone(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch contract", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus, action, details) => {
    try {
      const res = await updateContractStatus(urlContractId, newStatus, action, details);
      if (res.success) {
        alert(res.message || `Status updated to ${newStatus}`);
        fetchContractData();
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update status");
    }
  };

  const handleSubmitMilestone = async () => {
    console.log("Submitting milestone:", selectedMilestone);
    if (!selectedMilestone) {
      alert("No milestone selected for delivery.");
      return;
    }
    try {
      const res = await submitMilestone(selectedMilestone.id, {
        description: "Milestone delivery submitted.",
        links: deliveryLink ? [deliveryLink] : [],
        files: deliveryFileName ? [deliveryFileName] : []
      });
      if (res.success) {
        alert("Milestone submitted for approval!");
        setIsUploadModalOpen(false);
        fetchContractData();
      }
    } catch (err) {
      alert(err.message || "Failed to submit milestone");
    }
  };

  const handleApproveMilestone = async (milestoneId) => {
    if (!window.confirm("Are you sure you want to approve this milestone and release payment?")) return;
    try {
      const res = await approveMilestone(milestoneId);
      if (res.success) {
        alert("Milestone approved and paid!");
        fetchContractData();
      }
    } catch (err) {
      alert(err.message || "Failed to approve milestone");
    }
  };

  const handleRequestRevision = async () => {
    if (!selectedMilestone || !revisionNotes.trim()) return;
    try {
      const res = await requestMilestoneRevision(selectedMilestone.id, revisionNotes);
      if (res.success) {
        alert("Revision requested!");
        setIsRevisionModalOpen(false);
        setRevisionNotes("");
        fetchContractData();
      }
    } catch (err) {
      alert(err.message || "Failed to request revision");
    }
  };

  const handleAcceptRevision = async (milestoneId) => {
    try {
      const res = await acceptMilestoneRevision(milestoneId);
      if (res.success) {
        alert("Revision accepted! You can now start working on the changes.");
        fetchContractData();
      }
    } catch (err) {
      alert(err.message || "Failed to accept revision");
    }
  };

  const handleCancelRevision = async (milestoneId) => {
    if (!window.confirm("Are you sure you want to decline this revision request? This may lead to a dispute.")) return;
    try {
      const res = await cancelMilestoneRevision(milestoneId);
      if (res.success) {
        alert("Revision request declined.");
        fetchContractData();
      }
    } catch (err) {
      alert(err.message || "Failed to decline revision");
    }
  };

  const canEdit = useMemo(() => {
    if (!contract) return true; // new contract
    if (contract.status === 'Draft' && userType === 'creator') return true;
    if (contract.status === 'Review' && contract.review_turn === userType) return true;
    return false;
  }, [contract, userType]);

  const data = useMemo(
    () => ({
      completed: contract?.milestones?.filter(m => m.status === 'Paid').length || 0,
      total: contract?.milestones?.length || 1,
      startedAt: contract?.created_at ? new Date(contract.created_at).toDateString() : "N/A",
      targetAt: contract?.initial_delivery_deadline || "N/A",
      revisionsUsed: 0,
      revisionsTotal: contract?.revision_rounds || 0,
      nextActionTitle: "Check next milestone",
      nextActionDate: "",
      notice: contract?.status === 'Review' 
        ? (contract.review_turn === userType ? "Your turn to review." : "Waiting for other party.") 
        : (['Active', 'Accepted', 'Submitted', 'Revision Requested'].includes(contract?.status) ? "Project is in progress." : (contract?.status === 'Completed' ? "Project completed." : "Contract in draft.")),
    }),
    [contract, userType],
  );

  const progressPct = Math.round((data.completed / data.total) * 100);

  const feed = useMemo(() => {
    if (!contract?.activities) return [];
    return contract.activities.map(act => ({
      title: act.action,
      pill: act.actor?.full_name || "System",
      ts: new Date(act.created_at).toLocaleString(),
      desc: act.details?.details || act.action,
      tags: act.details?.tags || [],
      files: act.details?.files || [],
      chat: "Discuss in chat",
      amount: act.details?.amount ? `$${act.details.amount}` : null,
      footerBadge: act.details?.footerBadge || null,
      highlight: act.action.includes('Delivered') || act.action.includes('Accepted')
    }));
  }, [contract]);

  // ✅ Details data (invoice screen)
  const details = useMemo(
    () => ({
      title: contract?.title || "Title",
      orderedFrom: contract?.provider_full_name || "Name",
      deliveryDate: contract?.initial_delivery_deadline || "N/A",
      orderNumber: `#${contract?.contract_id || "123"}`,
      orderDate: contract?.created_at ? new Date(contract.created_at).toDateString() : "N/A",

      orderRows: (contract?.milestones || []).map(m => ({ item: m.title, qty: 1, duration: "-", price: `$${m.amount}` })),
      subtotal: `$${contract?.project_cost || 0}`,
      serviceFee: "$0",
      total: `$${contract?.project_cost || 0}`,

      extensionDate: "N/A",
      extensionRows: [],
      extensionTotal: "$0",

      milestone: {
        amount: `$${contract?.project_cost || 0}`,
        deadline: contract?.initial_delivery_deadline || "N/A",
        platformFee: "$0",
        netAmount: `$${contract?.project_cost || 0}`,
      },

      split: [
        { member: contract?.provider_full_name || "Creator", pct: "100%", amount: `$${contract?.project_cost || 0}` },
      ],
    }),
    [contract],
  );

  const [formData, setFormData] = useState({
    contract_id: "AUTO-" + Math.floor(100000 + Math.random() * 900000),
    title: "",
    type: "Solo",
    client_username: "",
    client_full_name: "",
    client_email: "",
    client_company: "",
    provider_username: "",
    provider_full_name: "",
    provider_email: "",
    provider_company: "",
    project_summary: "",
    out_of_scope: "",
    initial_delivery_deadline: "",
    client_review_window: "",
    revision_rounds: 0,
    revision_turnaround_time: "",
    late_delivery_consequence: "",
    delivery_sla: "",
    communication_sla: "",
    revision_sla: "",
    quality_standards: "",
    client_responsibilities: "",
    provider_responsibilities: "",
    payment_type: "Escrow",
    project_cost: 0,
    status: "Draft",
    deliverables: [{ title: "", format: "", quantity: "", acceptance_criteria: "" }],
    milestones: [{ title: "", amount: 0, deadline: "" }],
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsModified(true);
  };

  const updateDeliverable = (index, field, value) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index][field] = value;
    setFormData((prev) => ({ ...prev, deliverables: newDeliverables }));
    setIsModified(true);
  };

  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, { title: "", format: "", quantity: "", acceptance_criteria: "" }],
    }));
    setIsModified(true);
  };

  const removeDeliverable = (index) => {
    if (formData.deliverables.length === 1) return;
    const newDeliverables = [...formData.deliverables];
    newDeliverables.splice(index, 1);
    setFormData((prev) => ({ ...prev, deliverables: newDeliverables }));
    setIsModified(true);
  };

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index][field] = value;
    setFormData((prev) => ({ ...prev, milestones: newMilestones }));
    setIsModified(true);
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { title: "", amount: 0, deadline: "" }],
    }));
    setIsModified(true);
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length === 1) return;
    const newMilestones = [...formData.milestones];
    newMilestones.splice(index, 1);
    setFormData((prev) => ({ ...prev, milestones: newMilestones }));
    setIsModified(true);
  };

  const handleSave = async (isReview = false) => {
    try {
      const payload = { ...formData, status: isReview ? "Review" : formData.status };
      const res = await saveContract(payload);
      if (res.success) {
        alert(isReview ? "Contract sent for review!" : "Contract saved successfully!");
        if (!urlContractId) {
          navigate(`/milestones/${res.data.contract_id}`);
        } else {
          fetchContractData();
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save contract");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading contract details...</div>;

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
                        if (t !== "Contract") setIsViewOnly(false);
                        else if (urlContractId) setIsViewOnly(true);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Banner */}
              {(contract?.status === 'Extension_Requested' || contract?.status === 'Cancellation_Requested' || contract?.status === 'Disputed') && (
                <div className="mx-6 my-4 p-5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">Resolution Center Active: {contract.status.replace('_', ' ')}</h4>
                      <p className="text-sm opacity-80 text-white">
                        {contract.activities?.[0]?.action === 'Extension Requested' || contract.activities?.[0]?.action === 'Cancellation Requested' 
                          ? `${contract.activities[0].details?.requester_role === 'client' ? 'Client' : 'Creator'} has ${contract.activities[0].action.toLowerCase()}.`
                          : "A resolution process is currently active for this project."
                        }
                      </p>
                      <p className="text-xs italic opacity-60 mt-1 text-white">
                        Reason: {contract.activities?.[0]?.details?.details || "No reason provided."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                      onClick={() => navigate('/resolution-center', { state: { contractId: urlContractId, userType } })}
                    >
                      View Request
                    </button>
                  </div>
                </div>
              )}

              {/* ✅ CONTRACT TAB */}
              {activeTop === "Contract" && (
                <div className={`ms-contract-page ${isViewOnly ? "is-viewonly" : ""}`}>
                  {/* Header (always clickable) */}
                  <div className="ms-contract-top">
                    <h2 className="ms-contract-title">{urlContractId ? "Contract Details" : "Create New Contract"}</h2>

                    <div className="ms-contract-actions">
                      <button type="button" className="ms-ct-btn lime">
                        Save as PDF
                      </button>

                      {urlContractId && canEdit && (
                        <button
                          type="button"
                          className={`ms-ct-btn lime outline ${isViewOnly ? "active" : ""}`}
                          onClick={() => setIsViewOnly((p) => !p)}
                        >
                          <span className="ms-eye">👁</span>
                          {isViewOnly ? "Edit Contract" : "View only"}
                        </button>
                      )}
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
                            value={formData.title}
                            onChange={(e) => updateFormData("title", e.target.value)}
                          />
                        </div>

                        <div className="ms-ct-typeBox">
                          <div className="ms-ct-typeLeft">
                            <div className="ms-ct-label">Contract Type</div>
                            <div className="ms-ct-muted">Solo/ Team service</div>
                          </div>

                          <div className="ms-ct-typeRight">
                            <div className="ms-ct-typeText">{formData.type === "Solo" ? "Solo" : "Team"}</div>

                            <label className="ms-ct-switch">
                              <input
                                type="checkbox"
                                checked={formData.type === "Team"}
                                onChange={(e) => updateFormData("type", e.target.checked ? "Team" : "Solo")}
                                disabled={isViewOnly}
                              />
                              <span className="ms-ct-slider" />
                            </label>
                          </div>
                        </div>

                        <div className="ms-ct-field span2">
                          <label className="ms-ct-label">Contract ID</label>
                          <input
                            className="ms-ct-input"
                            placeholder="AUTO-123456"
                            disabled
                            value={formData.contract_id}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parties + Scope + Timeline + SLA */}
                    <div className="ms-ct-stack">
                      <div className="ms-ct-card">
                        <div className="ms-ct-cardHead">Parties Involved</div>
                        <div className="ms-ct-grid">
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Client Full Name</label>
                            <input
                              className="ms-ct-input"
                              disabled={isViewOnly}
                              value={formData.client_full_name}
                              onChange={(e) => updateFormData("client_full_name", e.target.value)}
                            />
                          </div>
                          <div className="ms-ct-field">
                            <label className="ms-ct-label">Client Email</label>
                            <input
                              className="ms-ct-input"
                              disabled={isViewOnly}
                              value={formData.client_email}
                              onChange={(e) => updateFormData("client_email", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="ms-ct-card">
                        <div className="ms-ct-cardHead">Scope and Deliverables</div>
                        <div className="ms-ct-field">
                          <label className="ms-ct-label">Project Summary</label>
                          <textarea
                            className="ms-ct-textarea"
                            disabled={isViewOnly}
                            value={formData.project_summary}
                            onChange={(e) => updateFormData("project_summary", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="ms-ct-card">
                        <div className="ms-ct-cardHead">Milestones</div>
                        {formData.milestones.map((mil, idx) => (
                          <div className="ms-ct-milGrid" key={idx}>
                            <div className="ms-ct-field">
                              <label className="ms-ct-label">Milestone Title</label>
                              <input
                                className="ms-ct-input"
                                disabled={isViewOnly}
                                value={mil.title}
                                onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                              />
                            </div>
                            <div className="ms-ct-field">
                              <label className="ms-ct-label">Amount</label>
                              <input
                                className="ms-ct-input"
                                type="number"
                                disabled={isViewOnly}
                                value={mil.amount}
                                onChange={(e) => updateMilestone(idx, "amount", parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            {!isViewOnly && formData.milestones.length > 1 && (
                              <button onClick={() => removeMilestone(idx)} className="ms-ct-removeBtn">X</button>
                            )}
                          </div>
                        ))}
                        {!isViewOnly && (
                          <button className="ms-ct-addBtn" onClick={addMilestone}>+ Add Milestone</button>
                        )}
                      </div>

                      {/* Final Confirmation / Negotiation Actions */}
                      <div className="ms-ct-confirmRow">
                        {/* EDIT MODE ACTIONS */}
                        {!isViewOnly && (
                          <div className="ms-ct-card ms-ct-miniCard">
                            <div className="ms-ct-cardHead">Actions</div>
                            <div className="ms-ct-bottomBtns">
                              <button 
                                type="button" 
                                className="ms-ct-confirmBtn lime"
                                onClick={() => handleSave(true)}
                              >
                                {contract?.status === 'Review' ? 'Send back for Review' : 'Send for review'}
                              </button>
                              <button 
                                type="button" 
                                className="ms-ct-ghostBtn"
                                onClick={() => handleSave(false)}
                              >
                                Save Draft
                              </button>
                            </div>
                          </div>
                        )}

                        {/* VIEW MODE ACTIONS (DECISIONS) */}
                        {isViewOnly && (contract?.status === 'Review' || contract?.status === 'Accepted') && contract?.review_turn === userType && !isModified && (
                          <div className="ms-ct-card ms-ct-miniCard">
                            <div className="ms-ct-cardHead">Decision</div>
                            <div className="ms-ct-bottomBtns">
                              {userType === 'client' ? (
                                <button 
                                  className="ms-ct-confirmBtn lime"
                                  onClick={() => handleStatusUpdate('Client_Accepted', 'Accepted Contract', 'Client approved the terms and is ready to fund.')}
                                >
                                  Ready to fund escrow
                                </button>
                              ) : (
                                <>
                                  {contract?.status === 'Accepted' ? (
                                    <button 
                                      className="ms-ct-confirmBtn lime"
                                      onClick={() => handleStatusUpdate('Active', 'Finalized Contract', 'Creator finalized and started the project.')}
                                    >
                                      Finalize & Start Project
                                    </button>
                                  ) : (
                                    <button 
                                      className="ms-ct-confirmBtn lime"
                                      onClick={() => handleStatusUpdate('Review', 'Accepted terms', 'Creator accepted terms and sent for final client approval.')}
                                    >
                                      Accept terms and send to Client
                                    </button>
                                  )}
                                </>
                              )}
                              <button 
                                className="ms-ct-ghostBtn"
                                onClick={() => handleStatusUpdate('Cancelled', 'Declined Contract', `${userType} declined the contract.`)}
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        )}
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
                          {contract?.activities?.map((act, i) => (
                            <div className="ms-ct-trow" key={i}>
                              <div>{new Date(act.created_at).toLocaleString()}</div>
                              <div>{act.actor?.full_name || 'System'}</div>
                              <div>{act.action}</div>
                              <div>{act.details?.details || '-'}</div>
                            </div>
                          ))}
                        </div>
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
                        <span className="ms-bullet" />
                        <span>Project start: <b>{data.startedAt}</b></span>
                      </div>
                      <div className="ms-item">
                        <span className="ms-bullet hollow" />
                        <span>Target completion: <b>{data.targetAt}</b></span>
                      </div>
                    </div>

                    <div className="ms-card">
                      <div className="ms-cardTitle">Revisions</div>
                      <div className="ms-revLine">
                        Used: <b>{(contract?.activities || []).filter(a => a.action === 'Revision Requested').length}</b> / {contract?.revision_rounds || 0}
                      </div>
                    </div>

                    <div className="ms-card">
                      <div className="ms-cardTitle">Next action</div>
                      <div className="ms-nextLine">{data.nextActionTitle}</div>
                      <div className="ms-nextLine sub">{data.nextActionDate}</div>
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
                          <button 
                            className="ms-dd-item"
                            onClick={() => { setProjectValue("Full project"); setProjectOpen(false); }}
                          >
                            Full project
                          </button>
                          <button 
                            className="ms-dd-item" 
                            type="button"
                            onClick={() => { setProjectValue("Current milestones"); setProjectOpen(false); }}
                          >
                            Current milestones
                          </button>
                          <button 
                            className="ms-dd-item" 
                            type="button"
                            onClick={() => { setProjectValue("Previous milestones"); setProjectOpen(false); }}
                          >
                            Previous milestones
                          </button>
                        </div>
                      )}
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

                  <div className="ms-milestone-list mb-6">
                    {(contract?.milestones || [])
                      .filter(m => activeStatus === 'All' || m.status === activeStatus)
                      .filter(m => {
                        if (projectValue === 'Full project') return true;
                        if (projectValue === 'Current milestones') return m.status !== 'Paid' && m.status !== 'Approved';
                        if (projectValue === 'Previous milestones') return m.status === 'Paid' || m.status === 'Approved';
                        return true;
                      })
                      .map((mil, idx) => (
                      <div 
                        key={mil.id || idx} 
                        className={`ms-milestone-card bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-[#ceff1b]/20 mb-3 transition-all ${userType === 'creator' && (mil.status === 'Open' || !mil.status || mil.status === 'Revision Requested' || mil.status === 'In-Progress') ? 'hover:border-[#ceff1b] cursor-pointer' : ''}`}
                        onClick={() => {
                          setSidebarFocusMilestone(mil);
                          if (userType === 'creator' && (mil.status === 'Open' || !mil.status || mil.status === 'Revision Requested' || mil.status === 'In-Progress') && contract?.status === 'Active') {
                            setSelectedMilestone(mil);
                            setIsUploadModalOpen(true);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{mil.title}</h4>
                            <p className="text-sm opacity-60">Due: {mil.deadline || 'N/A'}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                              mil.status === 'Paid' || mil.status === 'Approved' ? 'bg-green-500/20 text-green-500' :
                              mil.status === 'Submitted' ? 'bg-blue-500/20 text-blue-500' :
                              mil.status === 'In-Progress' ? 'bg-cyan-500/20 text-cyan-500' :
                              mil.status === 'Revision Requested' ? 'bg-orange-500/20 text-orange-500' :
                              'bg-gray-500/20 text-gray-500'
                            }`}>
                              {mil.status || 'Open'}
                            </span>
                            <span className="font-bold text-[#ceff1b] mt-1">${mil.amount}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          {userType === 'creator' && (mil.status === 'Open' || !mil.status || mil.status === 'Revision Requested' || mil.status === 'In-Progress') && contract?.status === 'Active' && (
                            <button 
                              className="px-4 py-2 bg-[#ceff1b] text-black rounded-lg text-sm font-bold"
                              onClick={() => { setSelectedMilestone(mil); setIsUploadModalOpen(true); }}
                            >
                              Submit for Approval
                            </button>
                          )}

                          {userType === 'client' && mil.status === 'Submitted' && (
                            <>
                              <button 
                                className="px-4 py-2 bg-[#ceff1b] text-black rounded-lg text-sm font-bold"
                                onClick={() => handleApproveMilestone(mil.id)}
                              >
                                Approve & Pay
                              </button>
                              <button 
                                className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-bold border border-white/20"
                                onClick={() => { setSelectedMilestone(mil); setIsRevisionModalOpen(true); }}
                              >
                                Request Revision
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="ms-lower">
                    <div className="ms-feed">
                      {feed.length === 0 ? (
                        <div className="p-10 text-center opacity-50">No activities recorded yet.</div>
                      ) : (
                        feed.map((it, idx) => (
                          <div
                            key={idx}
                            className={`ms-event ${it.highlight ? "highlight" : ""} ${idx < (feed.length - 3) ? "muted" : ""}`}
                          >
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
                        ))
                      )}
                    </div>

                    <div className="ms-side">
                      <div className="ms-panel ms-panel-action">
                        <div className="ms-panelTitle">Action</div>
                        
                        {/* ✅ CREATOR ACTIONS (Always 3) */}
                        {userType === 'creator' && (
                          <>
                            {contract?.status === 'Active' ? (
                              <button
                                className="ms-actionBtn lime"
                                type="button"
                                onClick={() => {
                                  const pending = (contract?.milestones || []).find(m => m.status === 'Revision Requested' || m.status === 'In-Progress' || m.status === 'Open' || !m.status);
                                  if (pending) {
                                    setSelectedMilestone(pending);
                                    setIsUploadModalOpen(true);
                                  } else {
                                    alert("No milestones available for submission.");
                                  }
                                }}
                              >
                                Upload
                              </button>
                            ) : (
                              <button
                                className="ms-actionBtn lime"
                                type="button"
                                onClick={() => handleStatusUpdate('Active', 'Start Project', 'Creator finalized and started the project.')}
                              >
                                Finalize & Start Project
                              </button>
                            )}

                            <button 
                              className="ms-actionBtn lime" 
                              type="button"
                              onClick={() => navigate('/messages')}
                            >
                              Message Client
                            </button>

                            <button
                              className="ms-actionBtn"
                              type="button"
                              onClick={() => navigate("/resolution-center", { state: { contractId: urlContractId, userType } })}
                            >
                              Resolution Center
                            </button>
                          </>
                        )}

                        {/* ✅ CLIENT ACTIONS (Up to 4) */}
                        {userType === 'client' && (
                          <>
                            <button
                              className="ms-actionBtn lime"
                              type="button"
                              onClick={() => handleStatusUpdate('Completed', 'Accept & Release Escrow', 'Client accepted and released escrow.')}
                            >
                              Accept & Release Escrow
                            </button>

                            <button 
                              className="ms-actionBtn lime" 
                              type="button"
                              onClick={() => navigate('/messages')}
                            >
                              Message Creator
                            </button>

                            {sidebarFocusMilestone?.status === 'Submitted' && (
                              <button
                                className="ms-actionBtn lime"
                                type="button"
                                onClick={() => {
                                  setSelectedMilestone(sidebarFocusMilestone);
                                  setIsRevisionModalOpen(true);
                                }}
                              >
                                Request revision
                              </button>
                            )}

                            <button
                              className="ms-actionBtn"
                              type="button"
                              onClick={() => navigate("/resolution-center", { state: { contractId: urlContractId, userType } })}
                            >
                              Resolution Center
                            </button>
                          </>
                        )}
                      </div>

                      {/* Specialized Panel: Revision Requested (Creator View) */}
                      {userType === 'creator' && sidebarFocusMilestone?.status === 'Revision Requested' && (
                        <div className="ms-panel ms-panel-revision-requested">
                          <div className="ms-panelTitle">Revision Requested</div>
                          <div className="ms-panelSub">
                            Client as requested revision for {sidebarFocusMilestone.title}
                          </div>

                          <div className="ms-timer">
                            <div className="ms-timeBox"><div className="ms-timeNum">1</div><div className="ms-timeLbl">Day</div></div>
                            <div className="ms-timeBox"><div className="ms-timeNum">20</div><div className="ms-timeLbl">Hours</div></div>
                            <div className="ms-timeBox"><div className="ms-timeNum">30</div><div className="ms-timeLbl">Minutes</div></div>
                          </div>

                          <div className="ms-panelTitle small">Description</div>
                          <div className="ms-descText">
                            {contract.activities?.find(a => a.action === 'Revision Requested' && a.details?.milestone_title === sidebarFocusMilestone.title)?.details?.details || 
                             contract.activities?.find(a => a.action === 'Revision Requested')?.details?.details || "No details provided."}
                          </div>

                          <div className="flex gap-2 mb-3">
                            <span className="ms-miniPill gray">Milestone: {sidebarFocusMilestone.title}</span>
                          </div>

                          <div className="ms-fileRow">
                            <button className="ms-fileBtn">Home.fig <span className="ms-open">open</span></button>
                            <button className="ms-fileBtn">dashboard.fig <span className="ms-open">open</span></button>
                          </div>

                          <button 
                            className="ms-actionBtn lime" 
                            onClick={() => handleAcceptRevision(sidebarFocusMilestone.id)}
                          >
                            Accept Revision
                          </button>
                          <button 
                            className="ms-actionBtn" 
                            onClick={() => handleCancelRevision(sidebarFocusMilestone.id)}
                          >
                            Cancel Revision
                          </button>
                        </div>
                      )}

                      {/* Specialized Panel: Extension Requested (Client View) */}
                      {userType === 'client' && contract?.status === 'Extension_Requested' && (
                        <div className="ms-panel ms-panel-extension-requested border-red-500/50">
                          <div className="ms-panelTitle text-red-500 font-bold">
                            {contract.provider_full_name || 'Creator'} has requested additional time to complete this milestone.
                          </div>

                          <div className="ms-timer">
                            <div className="ms-timeBox"><div className="ms-timeNum">1</div><div className="ms-timeLbl">Day</div></div>
                            <div className="ms-timeBox"><div className="ms-timeNum">20</div><div className="ms-timeLbl">Hours</div></div>
                            <div className="ms-timeBox"><div className="ms-timeNum">30</div><div className="ms-timeLbl">Minutes</div></div>
                          </div>

                          <div className="ms-panelSub italic">Please review and respond within the time window</div>

                          <div className="flex gap-2 my-4">
                            <button 
                              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-bold text-sm text-black"
                              onClick={() => handleStatusUpdate('Active', 'Extension Declined', 'Client declined the extension request.')}
                            >
                              Decline
                            </button>
                            <button 
                              className="flex-1 px-4 py-2 bg-[#ceff1b] text-black rounded-lg font-bold text-sm"
                              onClick={() => handleStatusUpdate('Active', 'Extension Accepted', 'Client accepted the extension request.')}
                            >
                              Accept
                            </button>
                          </div>

                          <div className="ms-field mb-3">
                            <label className="text-[10px] uppercase font-bold opacity-60">Days</label>
                            <div className="ms-input-static">12</div>
                          </div>

                          <div className="ms-field">
                            <label className="text-[10px] uppercase font-bold opacity-60">Why is extension needed?</label>
                            <div className="ms-descText">
                              {contract.activities?.find(a => a.action === 'Extension Requested')?.details?.details || "No details provided."}
                            </div>
                          </div>

                          <div className="mt-4 text-[10px] leading-relaxed">
                            <p className="text-red-500 font-bold">If you accept, <span className="text-white opacity-80">the milestone deadline will be extended by the requested number of days.</span></p>
                            <p className="text-red-500 font-bold mt-1">If you deny, <span className="text-white opacity-80">the original deadline remains unchanged.</span></p>
                            <p className="text-red-500 font-bold mt-1">If the timer expires with no action, <span className="text-white opacity-80">the system will deny the request.</span></p>
                          </div>
                        </div>
                      )}

                      {(contract?.status === 'Review' || contract?.status === 'Accepted') && (
                        <div className="ms-panel ms-panel-revision">
                          <div className="ms-panelTitle">
                            {contract?.status === 'Accepted' ? 'Contract Accepted' : 'Pending Review'}
                          </div>
                          <div className="ms-panelSub">
                            {contract?.status === 'Accepted' 
                              ? (userType === 'creator' ? 'Client has funded escrow. You can now finalize and start the project.' : 'You have accepted the terms. Waiting for creator to start the project.')
                              : (contract.review_turn === userType ? "It's your turn to review the latest changes." : "Waiting for the other party to review.")
                            }
                          </div>

                          <div className="ms-timer">
                            <div className="ms-timeBox">
                              <div className="ms-timeNum">0</div>
                              <div className="ms-timeLbl">Day</div>
                            </div>
                            <div className="ms-timeBox">
                              <div className="ms-timeNum">0</div>
                              <div className="ms-timeLbl">Hours</div>
                            </div>
                            <div className="ms-timeBox">
                              <div className="ms-timeNum">0</div>
                              <div className="ms-timeLbl">Minutes</div>
                            </div>
                          </div>

                          <div className="ms-panelTitle small">Latest Update</div>
                          <div className="ms-descText">
                            {contract.activities?.[0]?.details?.details || "No details provided for the latest update."}
                          </div>

                          <button 
                            className="ms-actionBtn lime" 
                            type="button"
                            onClick={() => setActiveTop("Contract")}
                          >
                            {contract?.status === 'Accepted' ? 'View Final Contract' : 'Review Contract Terms'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
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
                    <div className="msd-muted">Order ID: {details.orderNumber}</div>
                  </div>
                  <div className="msd-card">
                    <div className="msd-table">
                      <div className="msd-tr msd-th">
                        <div>Item</div>
                        <div>Qty.</div>
                        <div className="right">Price</div>
                      </div>
                      {details.orderRows.map((r, i) => (
                        <div className="msd-tr" key={i}>
                          <div>{r.item}</div>
                          <div>{r.qty}</div>
                          <div className="right">{r.price}</div>
                        </div>
                      ))}
                      <div className="msd-tr msd-total">
                        <div className="span3">Total</div>
                        <div className="right">{details.total}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
 
      {isUploadModalOpen && (
        <div
          className="ms-uploadModalOverlay"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="ms-uploadModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ms-upload-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="ms-upload-modal-title" className="ms-uploadModalTitle">
              Deliver {selectedMilestone?.title || "Milestone"}
            </h3>
 
            <div className="ms-uploadModalCard">
              <input
                ref={uploadInputRef}
                type="file"
                className="ms-uploadModalInputFile"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setDeliveryFileName(file ? file.name : "");
                }}
              />
 
              <button
                type="button"
                className="ms-uploadDropzone"
                onClick={() => uploadInputRef.current?.click()}
              >
                <span className="ms-uploadDropzoneIcon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M20 16.74A5 5 0 0 1 18 21H6a5 5 0 0 1-2-4.26" />
                  </svg>
                </span>
                <span className="ms-uploadDropzoneText">
                  <span className="ms-uploadDropzonePrimary">Click to upload</span> or Drag or drop file
                </span>
                <span className="ms-uploadDropzoneMeta">
                  PDF, JPG, JPEG, PNG less than 10MB.
                </span>
                <span className="ms-uploadDropzoneMeta">
                  Ensure your document are in good condition and readable
                </span>
                {deliveryFileName && (
                  <span className="ms-uploadDropzoneFileName">{deliveryFileName}</span>
                )}
              </button>
 
              <div className="ms-uploadField">
                <label className="ms-uploadLabel" htmlFor="ms-upload-link">
                  Link (optional)
                </label>
                <input
                  id="ms-upload-link"
                  type="text"
                  className="ms-uploadInput"
                  placeholder="Website"
                  value={deliveryLink}
                  onChange={(event) => setDeliveryLink(event.target.value)}
                />
              </div>
            </div>
 
            <div className="ms-uploadActions">
              <button
                type="button"
                className="ms-uploadSubmitBtn"
                onClick={handleSubmitMilestone}
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {isRevisionModalOpen && (
        <div
          className="ms-uploadModalOverlay"
          onClick={() => setIsRevisionModalOpen(false)}
        >
          <div
            className="ms-uploadModal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="ms-uploadModalTitle">
              Request Revision for {selectedMilestone?.title || "Milestone"}
            </h3>
 
            <div className="ms-uploadModalCard">
              <div className="ms-uploadField">
                <label className="ms-uploadLabel font-bold text-sm">Description</label>
                <textarea
                  className="ms-uploadInput min-h-[120px] p-4 bg-transparent border border-white/20 rounded-xl"
                  placeholder="What needs to be changed?"
                  value={revisionNotes}
                  onChange={(event) => setRevisionNotes(event.target.value)}
                />
              </div>

              <button
                type="button"
                className="ms-uploadDropzone mt-4 border-dashed"
                onClick={() => uploadInputRef.current?.click()}
              >
                <span className="ms-uploadDropzoneIcon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M20 16.74A5 5 0 0 1 18 21H6a5 5 0 0 1-2-4.26" />
                  </svg>
                </span>
                <span className="ms-uploadDropzoneText text-sm">
                  <span className="ms-uploadDropzonePrimary text-[#ceff1b]">Click to upload</span> or Drag or drop file
                </span>
                <span className="ms-uploadDropzoneMeta text-[10px]">
                  PDF, JPG, JPEG, PNG less than 10MB.
                </span>
              </button>
            </div>
 
            <div className="ms-uploadActions flex gap-3">
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-white/10 text-white font-bold border border-white/20"
                onClick={() => setIsRevisionModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-[#ceff1b] text-black font-bold"
                onClick={handleRequestRevision}
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
