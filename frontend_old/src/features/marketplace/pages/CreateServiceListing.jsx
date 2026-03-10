import React, { useMemo, useRef, useState } from "react";
import "./CreateServiceListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MyPortfolio from "../../dashboard/components/UserProfile/MyPortfolio";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";

export default function CreateServiceListing({ theme, setTheme }) {
  /* ================== CONSTANTS ================== */
  const categories = useMemo(
    () => ["Design", "Development", "Marketing", "Writing"],
    [],
  );

  const subCategoriesMap = useMemo(
    () => ({
      Design: ["Logo Design", "UI/UX", "Branding"],
      Development: ["Full Stack", "Frontend", "Backend"],
      Marketing: ["SEO", "Social Media", "Ads"],
      Writing: ["Copywriting", "Blog Writing", "Script Writing"],
    }),
    [],
  );

  const productTypes = useMemo(
    () => ["Digital Service", "Consultation", "One-time Project", "Monthly Retainer"],
    [],
  );

  const teamList = useMemo(
    () => ["Ultra Hustle Studio", "Design Squad", "Dev Crew"],
    [],
  );

  const deliveryFormats = useMemo(
    () => ["Google Drive Link", "Figma Link", "ZIP Download", "Notion Page"],
    [],
  );

  const TABS = ["Basic", "Standard", "Premium"];

  // ✅ Sidebar state (matching CreateTeam.jsx)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  React.useEffect(() => {
    setSidebarOpen(true);
    setShowSettings(false);
  }, []);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  /* ================== BASIC DETAILS STATE ================== */
  const [aiPowered, setAiPowered] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    shortDescription: "",
    about: "",
    productType: "",
  });

  const subCategories = form.category ? subCategoriesMap[form.category] || [] : [];

  const setFormField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  /* ================== TAGS STATE ================== */
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const addTag = () => {
    const clean = tagInput.trim();
    if (!clean) return;
    if (tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags((p) => [...p, clean]);
    setTagInput("");
  };

  const removeTag = (idx) => setTags((p) => p.filter((_, i) => i !== idx));

  const onTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  /* ================== SERVICE PROVIDER + PACKAGES STATE ================== */
  const [mode, setMode] = useState("Solo"); // Solo | Team
  const [teamName, setTeamName] = useState("");
  const [activeTab, setActiveTab] = useState("Basic");
  // ✅ Upload modal state (MISSING)
  const [uploadStep, setUploadStep] = useState(null); // null | "grid" | "success"

  // ✅ Modal open when grid OR success (MISSING)
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [pkg, setPkg] = useState({
    Basic: {
      packageName: "",
      price: "",
      deliveryDays: "",
      revisions: "",
      scope: "",
      included: [],
      howItWorks: [],
      notIncluded: [],
      toolsUsed: [],
      deliveryFormat: "",
    },
    Standard: {
      packageName: "",
      price: "",
      deliveryDays: "",
      revisions: "",
      scope: "",
      included: [],
      howItWorks: [],
      notIncluded: [],
      toolsUsed: [],
      deliveryFormat: "",
    },
    Premium: {
      packageName: "",
      price: "",
      deliveryDays: "",
      revisions: "",
      scope: "",
      included: [],
      howItWorks: [],
      notIncluded: [],
      toolsUsed: [],
      deliveryFormat: "",
    },
  });

  const current = pkg[activeTab];

  const setPkgField = (key, value) => {
    setPkg((p) => ({
      ...p,
      [activeTab]: { ...p[activeTab], [key]: value },
    }));
  };

  const addToList = (key, value) => {
    const v = value.trim();
    if (!v) return;
    setPkg((p) => ({
      ...p,
      [activeTab]: { ...p[activeTab], [key]: [...p[activeTab][key], v] },
    }));
  };

  const removeFromList = (key, idx) => {
    setPkg((p) => ({
      ...p,
      [activeTab]: {
        ...p[activeTab],
        [key]: p[activeTab][key].filter((_, i) => i !== idx),
      },
    }));
  };

  const [includedInput, setIncludedInput] = useState("");
  const [howInput, setHowInput] = useState("");
  const [notInput, setNotInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");

  const onEnterAdd = (e, fn) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fn();
    }
  };

  const addIncluded = () => {
    addToList("included", includedInput);
    setIncludedInput("");
  };

  const addHow = () => {
    addToList("howItWorks", howInput);
    setHowInput("");
  };

  const addNot = () => {
    addToList("notIncluded", notInput);
    setNotInput("");
  };

  const addTool = () => {
    const v = toolsInput.trim();
    if (!v) return;

    if ((current.toolsUsed || []).some((t) => t.toLowerCase() === v.toLowerCase())) {
      setToolsInput("");
      return;
    }

    if ((current.toolsUsed || []).length >= 10) return;

    setPkg((p) => ({
      ...p,
      [activeTab]: {
        ...p[activeTab],
        toolsUsed: [...(p[activeTab].toolsUsed || []), v],
      },
    }));
    setToolsInput("");
  };

  const removeTool = (idx) => removeFromList("toolsUsed", idx);

  /* ================== ADD-ONS + MEDIA STATE ================== */
  const fileRef = useRef(null);

  const [addOn, setAddOn] = useState({
    name: "",
    price: "",
    days: "",
  });

  const [addOns, setAddOns] = useState([]);
  const [cover, setCover] = useState(null);

  const addNewAddOn = () => {
    if (!addOn.name) return;
    setAddOns((p) => [...p, addOn]);
    setAddOn({ name: "", price: "", days: "" });
  };

  const removeAddOn = (idx) => {
    setAddOns((p) => p.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================== FAQ STATE ================== */
  const [faqs, setFaqs] = useState([
    {
      q: "",
      a: "",
    },
  ]);

  const addFaq = () => {
    setFaqs((p) => [...p, { q: "", a: "" }]);
  };

  const updateFaq = (idx, key, value) => {
    setFaqs((p) =>
      p.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    );
  };

  const removeFaq = (idx) => {
    setFaqs((p) => p.filter((_, i) => i !== idx));
  };

  /* ================== RENDER ================== */
  return (
    <div
      className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}
    >
      {/* ✅ NAVBAR */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className={`pt-[85px] flex relative z-10 transition-all duration-300 ${isModalOpen ? "blur-sm pointer-events-none select-none" : ""}`}>
        {/* ✅ SIDEBAR */}
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

        {/* ✅ MAIN CONTENT WRAPPER */}
        <div className="relative flex-1 min-w-5 overflow-hidden">
          {/* Scrollable Area */}
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="create-service-container">
              <div className="csl-stack">
                {/* ================= BASIC DETAILS CARD ================= */}
                <div className="csl-card">
                  <div className="csl-header">
                    <div>
                      <h1 className="csl-title">Create Service Listing</h1>
                      <p className="csl-subtitle">Fill out each section</p>
                    </div>

                    <div className="csl-ai">
                      <span className={`csl-ai-pill ${aiPowered ? "active" : ""}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                        </svg>
                        Ai Powered
                      </span>
                      <label className="csl-switch">
                        <input
                          type="checkbox"
                          checked={aiPowered}
                          onChange={(e) => setAiPowered(e.target.checked)}
                        />
                        <span className="csl-slider" />
                      </label>
                    </div>
                  </div>

                  <h2 className="csl-section">Basic Details</h2>

                  <div className="csl-grid2">
                    <div className="csl-field">
                      <label className="csl-label">Listing Title</label>
                      <input
                        className="csl-input"
                        placeholder="eg., Professional Logo Design"
                        value={form.title}
                        onChange={(e) => setFormField("title", e.target.value)}
                      />
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">Category</label>
                      <div className="csl-selectWrap">
                        <CustomSelect
                          value={form.category}
                          onChange={(val) =>
                            setForm((p) => ({
                              ...p,
                              category: val,
                              subCategory: "",
                              productType: "",
                            }))
                          }
                          options={categories}
                          placeholder="Select category"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="csl-grid2">


                    <div className="csl-field">
                      <label className={`csl-label ${!form.category ? "opacity-50" : ""}`}>Sub Category</label>
                      <div className="csl-selectWrap">
                        <CustomSelect
                          value={form.subCategory}
                          onChange={(val) =>
                            setForm((p) => ({
                              ...p,
                              subCategory: val,
                              productType: "",
                            }))
                          }
                          options={subCategories}
                          placeholder="Select sub category"
                          disabled={!form.category}
                        />
                      </div>
                    </div>
                    <div className="csl-field">
                      <label className={`csl-label ${!form.subCategory ? "opacity-50" : ""}`}>Product Type</label>
                      <div className="csl-selectWrap">
                        <CustomSelect
                          value={form.productType}
                          onChange={(val) => setFormField("productType", val)}
                          options={productTypes}
                          placeholder="eg., Digital Service"
                          disabled={!form.subCategory}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="csl-field">
                    <label className="csl-label">Short Description</label>
                    <textarea
                      className="csl-textarea"
                      placeholder="Short Description"
                      value={form.shortDescription}
                      onChange={(e) => setFormField("shortDescription", e.target.value)}
                    />
                  </div>

                  <div className="csl-field">
                    <label className="csl-label">About This Service</label>
                    <textarea
                      className="csl-textarea"
                      placeholder="About this service"
                      value={form.about}
                      onChange={(e) => setFormField("about", e.target.value)}
                    />
                  </div>



                  <div className="csl-field">
                    <label className="csl-label">Tags (multi-select)</label>

                    <div className="csl-tagsRow">
                      <input
                        className="csl-input csl-tagInput"
                        placeholder="eg., type a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={onTagKeyDown}
                      />

                      <button type="button" className="csl-addBtn" onClick={addTag}>
                        + Add
                      </button>
                    </div>

                    {tags.length > 0 && (
                      <div className="csl-chips">
                        {tags.map((t, idx) => (
                          <div className="csl-chip" key={`${t}-${idx}`}>
                            <span className="csl-chipText">{t}</span>
                            <button
                              type="button"
                              className="csl-chipX"
                              onClick={() => removeTag(idx)}
                              aria-label="Remove tag"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="csl-clear-all"
                          onClick={() => setTags([])}
                          title="Clear all"
                        >×</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= SERVICE PROVIDER + PACKAGES ================= */}
                <div className="sp-card">
                  <div className="sp-top">
                    <div className="sp-topLeft">
                      <div className="sp-topTitle">Service Provider</div>
                    </div>

                    <div className="sp-topRight">
                      <span className={`sp-mode ${mode === "Solo" ? "active" : ""}`}>Solo</span>
                      <label className="sp-switch">
                        <input
                          type="checkbox"
                          checked={mode === "Team"}
                          onChange={(e) => setMode(e.target.checked ? "Team" : "Solo")}
                        />
                        <span className="sp-slider" />
                      </label>
                      <span className={`sp-mode ${mode === "Team" ? "active" : ""}`}>Team</span>
                    </div>
                  </div>

                  {mode === "Team" && (
                    <div className="sp-field">
                      <label className="sp-label">Team name</label>
                      <div className="sp-selectWrap">
                        <CustomSelect
                          value={teamName}
                          onChange={(val) => setTeamName(val)}
                          options={teamList}
                          placeholder="Select team name"
                          disabled={mode !== "Team"}
                        />
                      </div>
                    </div>
                  )}

                  <div className="sp-packagesTitle">Packages</div>
                  <div className="sp-tabs">
                    {TABS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`sp-tab ${activeTab === t ? "active" : ""}`}
                        onClick={() => setActiveTab(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="sp-grid3">
                    <div className="sp-field">
                      <label className="sp-label">Package Name</label>
                      <input
                        className="sp-input"
                        value={current.packageName}
                        onChange={(e) => setPkgField("packageName", e.target.value)}
                        placeholder="e.g. Starter Package"
                      />
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">Price</label>
                      <div className="sp-priceWrap">
                        <span className="sp-currency">$</span>
                        <input
                          className="sp-input sp-priceInput"
                          value={current.price}
                          onChange={(e) => setPkgField("price", e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">Delivery Time (days)</label>
                      <div className="sp-selectWrap">
                        <CustomSelect
                          value={current.deliveryDays}
                          onChange={(val) => setPkgField("deliveryDays", val)}
                          options={["1", "2", "3", "5", "7", "10", "14", "21", "30"]}
                          placeholder="Select days"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">No. of. Revisions</label>
                    <div className="sp-selectWrap">
                      <CustomSelect
                        value={current.revisions}
                        onChange={(val) => setPkgField("revisions", val)}
                        options={["1", "2", "3", "5", "Unlimited"]}
                        placeholder="Select revisions"
                      />
                    </div>
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">Scope of Work</label>
                    <textarea
                      className="sp-textarea"
                      value={current.scope}
                      placeholder="Scope of work"
                      onChange={(e) => setPkgField("scope", e.target.value)}
                    />
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">What's included</label>
                    <input
                      className="sp-input"
                      value={includedInput}
                      onChange={(e) => setIncludedInput(e.target.value)}
                      onKeyDown={(e) => onEnterAdd(e, addIncluded)}
                      placeholder="eg., Source Files"
                    />
                    <button type="button" className="sp-addMini" onClick={addIncluded}>
                      + <span>Add</span>
                    </button>

                    {!!current.included?.length && (
                      <div className="sp-chipRow" style={{ position: 'relative' }}>
                        {current.included.map((x, idx) => (
                          <div className="sp-chip" key={`${x}-${idx}`}>
                            {x}
                            <button className="sp-chipX" type="button" onClick={() => removeFromList("included", idx)}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="csl-clear-all"
                          onClick={() => setPkg(p => ({
                            ...p,
                            [activeTab]: { ...p[activeTab], included: [] }
                          }))}
                          title="Clear all"
                        >×</button>
                      </div>
                    )}
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">How it works</label>
                    <input
                      className="sp-input"
                      value={howInput}
                      onChange={(e) => setHowInput(e.target.value)}
                      onKeyDown={(e) => onEnterAdd(e, addHow)}
                      placeholder="eg., Kickoff Call"
                    />
                    <button type="button" className="sp-addMini" onClick={addHow}>
                      + <span>Add</span>
                    </button>

                    {!!current.howItWorks?.length && (
                      <div className="sp-chipRow" style={{ position: "relative" }}>
                        {current.howItWorks.map((x, idx) => (
                          <div className="sp-chip" key={`${x}-${idx}`}>
                            {x}
                            <button className="sp-chipX" type="button" onClick={() => removeFromList("howItWorks", idx)}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="csl-clear-all"
                          onClick={() => setPkg(p => ({
                            ...p,
                            [activeTab]: { ...p[activeTab], howItWorks: [] }
                          }))}
                          title="Clear all"
                        >×</button>
                      </div>
                    )}
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">What's not included</label>
                    <input
                      className="sp-input"
                      value={notInput}
                      onChange={(e) => setNotInput(e.target.value)}
                      onKeyDown={(e) => onEnterAdd(e, addNot)}
                      placeholder="eg., Printing"
                    />
                    <button type="button" className="sp-addMini" onClick={addNot}>
                      + <span>Add</span>
                    </button>

                    {!!current.notIncluded?.length && (
                      <div className="sp-chipRow" style={{ position: "relative" }}>
                        {current.notIncluded.map((x, idx) => (
                          <div className="sp-chip" key={`${x}-${idx}`}>
                            {x}
                            <button className="sp-chipX" type="button" onClick={() => removeFromList("notIncluded", idx)}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="csl-clear-all"
                          onClick={() => setPkg(p => ({
                            ...p,
                            [activeTab]: { ...p[activeTab], notIncluded: [] }
                          }))}
                          title="Clear all"
                        >×</button>
                      </div>
                    )}
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">Tools used</label>
                    <div className="sp-toolsRow">
                      <input
                        className="sp-input"
                        value={toolsInput}
                        onChange={(e) => setToolsInput(e.target.value)}
                        onKeyDown={(e) => onEnterAdd(e, addTool)}
                        placeholder="eg., Figma, Notion"
                      />
                      <button type="button" className="sp-addBtnRight" onClick={addTool}>
                        + Add
                      </button>
                    </div>
                    <div className="sp-hint">You can add 10 tools</div>

                    {!!current.toolsUsed?.length && (
                      <div className="sp-chipRow" style={{ position: "relative" }}>
                        {current.toolsUsed.map((x, idx) => (
                          <div className="sp-chip" key={`${x}-${idx}`}>
                            {x}
                            <button className="sp-chipX" type="button" onClick={() => removeTool(idx)}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="csl-clear-all"
                          onClick={() => setPkg(p => ({
                            ...p,
                            [activeTab]: { ...p[activeTab], toolsUsed: [] }
                          }))}
                          title="Clear all"
                        >×</button>
                      </div>
                    )}

                    <div className="sp-field">
                      <label className="sp-label">Delivery format</label>
                      <div className="sp-selectWrap">
                        <CustomSelect
                          value={current.deliveryFormat}
                          onChange={(val) => setPkgField("deliveryFormat", val)}
                          options={["Googel drive link", "figma link ", "zip download", "notion page"]}
                          placeholder="Select format"
                        />
                      </div>
                    </div>
                  </div>


                </div>

                {/* ================= ADD-ONS + MEDIA ================= */}
                <div className="am-card">
                  <h3 className="am-title">Add-Ons</h3>

                  <div className="am-grid3">
                    <div className="am-field">
                      <label>Package Name</label>
                      <input
                        className="am-input"
                        value={addOn.name}
                        onChange={(e) => setAddOn({ ...addOn, name: e.target.value })}
                        placeholder="e.g. Fast Delivery"
                      />
                    </div>

                    <div className="am-field">
                      <label>Price</label>
                      <div className="am-priceWrap">
                        <span>$</span>
                        <input
                          className="am-input am-priceInput"
                          value={addOn.price}
                          onChange={(e) => setAddOn({ ...addOn, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="am-field">
                      <label>Delivery Time (days)</label>
                      <input
                        className="am-input"
                        value={addOn.days}
                        onChange={(e) => setAddOn({ ...addOn, days: e.target.value })}
                        placeholder="e.g. 1"
                      />
                    </div>
                  </div>

                  <button className="am-addBtn" onClick={addNewAddOn}>
                    + Add
                  </button>

                  {addOns.length > 0 && (
                    <div className="am-addOnList">
                      {addOns.map((item, idx) => (
                        <div key={idx} className="am-chip">
                          {item.name} – ${item.price} – {item.days} days
                          <button onClick={() => removeAddOn(idx)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3 className="am-title" style={{ marginTop: 30 }}>
                    Media
                  </h3>

                  <div className="am-mediaLabel">Cover Page</div>

                  <div className="am-uploadBox">
                    {cover ? (
                      <img src={cover} alt="cover" className="am-preview" />
                    ) : (
                      <div className="am-placeholder">
                        <button className="am-uploadBtn" onClick={() => setUploadStep("grid")}>
                          Upload Photo
                        </button>
                      </div>
                    )}
                    <button className="am-removeImg" onClick={() => setCover(null)}>
                      ×
                    </button>

                    <input
                      type="file"
                      ref={fileRef}
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Portfolio Section */}
                <div className="csl-portfolio-wrap">
                  <MyPortfolio />
                </div>

                {/* ================= FAQ ================= */}
                <div className="faq-wrap">
                  <h3 className="faq-title">FAQs</h3>

                  {faqs.map((item, idx) => (
                    <div className="faq-card" key={idx}>
                      <div className="faq-card-top">
                        <div className="faq-number">FAQ #{idx + 1}</div>

                        <button
                          type="button"
                          className="faq-trash"
                          onClick={() => removeFaq(idx)}
                          aria-label="Delete FAQ"
                          title="Delete"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>

                      <div className="faq-field">
                        <label className="faq-label">Question</label>
                        <input
                          className="faq-input"
                          placeholder="Type your question"
                          value={item.q}
                          onChange={(e) => updateFaq(idx, "q", e.target.value)}
                        />
                      </div>

                      <div className="faq-field">
                        <label className="faq-label">Answer</label>
                        <input
                          className="faq-input"
                          placeholder="Type the answer"
                          value={item.a}
                          onChange={(e) => updateFaq(idx, "a", e.target.value)}
                        />
                      </div>

                      <button type="button" className="faq-add" onClick={addFaq}>
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
                {/* ================= ACTIONS ================= */}
                <div className="faq-actions">
                  <button type="button" className="faq-draft">Save as Draft</button>
                  <button type="button" className="faq-save">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= UPLOAD MODALS ================= */}
      {
        isModalOpen && (
          <div
            className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
            onClick={() => setUploadStep(null)}
          />
        )
      }

      {
        (uploadStep === "grid" || uploadStep === "success") && (
          <UploadGrid
            blurred={uploadStep === "success"}
            onBack={() => setUploadStep(null)}
            onSelect={(files) => {
              if (files && files[0]) {
                const reader = new FileReader();
                reader.onload = () => setCover(reader.result);
                reader.readAsDataURL(files[0]);
              }
              setUploadStep("success");
            }}
          />
        )
      }

      {
        uploadStep === "success" && (
          <UploadSuccess onBack={() => setUploadStep(null)} />
        )
      }
    </div>
  );
}

/* ================= REUSABLE CUSTOM SELECT ================= */

function CustomSelect({ value, onChange, options, placeholder, disabled = false }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`onboarding-custom-select ${open ? "active" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""}`} ref={ref}>
      <div
        className={`onboarding-selected-option ${open ? "open" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen(!open);
        }}
      >
        <span className={!value ? "opacity-70" : ""}>{value || placeholder}</span>
        <span className="onboarding-arrow">▼</span>
      </div>
      {open && (
        <ul className="onboarding-options-list dark:bg-[#1E1E1E]">

          {options.map((opt) => (
            <li
              key={opt}
              className={value === opt ? "active" : ""}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ================= UPLOAD GRID ================= */

function UploadGrid({ onSelect, onBack, blurred }) {
  const fileRef = React.useRef(null);
  const [files, setFiles] = React.useState([]);
  const [visibleSlots] = React.useState(9);
  const [activeIndex, setActiveIndex] = React.useState(null);

  const openPicker = () => fileRef.current?.click();

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (activeIndex === null || selected.length === 0) return;
    setFiles((prev) => {
      const updated = [...prev];
      updated[activeIndex] = selected[0];
      return updated;
    });
    setActiveIndex(null);
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center pointer-events-auto">
      <div
        className={`upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white shadow-[0_0_20px_#CEFF1B] transition-all duration-200${blurred ? " blur-sm scale-[0.98] pointer-events-none select-none opacity-95" : ""
          }`}
      >
        {/* HEADER */}
        <div className="upload-header flex items-center gap-3 mb-3 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
            title="Back"
          >
            <img src="/backarrow.svg" alt="back" />
          </button>
          <h4 className="text-sm font-medium">Select and upload your file</h4>
          <button
            type="button"
            onClick={onBack}
            className="ml-auto w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#CEFF1B]"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 custom-scroll">
          {Array.from({ length: visibleSlots }).map((_, i) => {
            const file = files[i];
            return (
              <div
                key={i}
                onClick={() => { setActiveIndex(i); openPicker(); }}
                className="upload-slot relative h-[110px] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100"
              >
                {i === 0 && (
                  <span className="absolute inset-0 z-10 flex items-center justify-center px-2">
                    <span className="bg-[#CEFF1B] text-black font-medium text-[10px] sm:text-xs px-2 py-[3px] rounded max-w-[90%] text-center whitespace-normal leading-tight">
                      Upload Cover Image
                    </span>
                  </span>
                )}
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    {i !== 0 && (
                      <div className="relative">
                        <img src="/video2.svg" className="w-10 mr-8 mt-2 opacity-60" alt="" />
                        <img src="/video1.svg" className="w-12 absolute -right-2 -top-3 opacity-60" alt="" />
                        <div className="absolute bottom-4 right-5 w-6 h-6 rounded-full bg-[#CEFF1B] flex items-center justify-center">+</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end items-center mt-3 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="upload-btn-cancel px-4 py-2 rounded-lg text-sm border border-black"
            >
              Cancel
            </button>
            {files.filter(Boolean).length > 0 && (
              <button
                type="button"
                onClick={() => onSelect(files.filter(Boolean))}
                className="upload-btn-confirm px-5 py-2 rounded-lg text-sm font-medium bg-[#CEFF1B] border border-black"
              >
                Upload
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFiles}
          className="hidden"
        />
      </div>
    </div>
  );
}

/* ================= UPLOAD SUCCESS ================= */

function UploadSuccess({ onBack }) {
  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-auto p-4">
      <div className="upload-success-card rounded-2xl w-[90%] max-w-[600px] h-auto min-h-[300px] md:h-[400px] py-10 flex flex-col items-center justify-center shadow-[0_0_20px_#CEFF1B] bg-white dark:bg-[#2B2B2B]">
        <div className="w-24 h-24 bg-[#CEFF1B] rounded-full flex items-center justify-center mb-6">
          <img src="/right.svg" alt="" />
        </div>
        <h3 className="text-2xl font-semibold mb-8 text-black dark:text-white text-center px-4">
          You have successfully uploaded!
        </h3>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="upload-btn-confirm px-12 py-3 rounded-lg bg-[#CEFF1B] border border-black font-semibold text-black transition-transform hover:scale-105"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
