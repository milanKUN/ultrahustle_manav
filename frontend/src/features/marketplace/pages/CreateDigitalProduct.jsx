import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CreateDigitalProduct.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MyPortfolio from "../../dashboard/components/UserProfile/MyPortfolio";
import FAQSection from "../components/FAQSection";
import CoverSection from "../components/CoverSection";
import DeliverablesSection from "../components/DeliverablesSection";
import {
  createListing,
  getListingByUsername,
  updateListing,
  getMyTeams,
} from "../api/listingApi";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import { useNavigate, useParams } from "react-router-dom";

const LISTING_TYPE = "digital_product";

export default function CreateDigitalProduct({
  theme,
  setTheme,
  mode: pageMode = "create",
}) {
  const categories = useMemo(
    () => ["Design", "Development", "Marketing", "Writing"],
    [],
  );

  const navigate = useNavigate();
  const { username } = useParams();
  const isEditMode = pageMode === "edit";

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

  const [teamList, setTeamList] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const TABS = ["Basic", "Standard", "Premium"];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [successPopup, setSuccessPopup] = useState({
    open: false,
    title: "",
    message: "",
    shouldRedirect: false,
  });

  const showSuccess = (title, message, shouldRedirect = false) => {
    setSuccessPopup({
      open: true,
      title,
      message,
      shouldRedirect,
    });
  };

  React.useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    const onKey = (e) => {
      if (e.key === "Escape") setUploadStep(null);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  React.useEffect(() => {
    setSidebarOpen(true);
    setShowSettings(false);
  }, []);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

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

  const [sellerMode, setSellerMode] = useState("Solo");
  const [teamName, setTeamName] = useState("");
  const [activeTab, setActiveTab] = useState("Basic");

  const [pkg, setPkg] = useState({
    Basic: { price: "", included: [], toolsUsed: [], deliveryFormats: [] },
    Standard: { price: "", included: [], toolsUsed: [], deliveryFormats: [] },
    Premium: { price: "", included: [], toolsUsed: [], deliveryFormats: [] },
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

  React.useEffect(() => {
    const loadTeams = async () => {
      if (sellerMode !== "Team") return;

      try {
        setTeamsLoading(true);
        const res = await getMyTeams();
        const teams = Array.isArray(res?.teams) ? res.teams : [];
        setTeamList(teams.map((item) => item.team_name).filter(Boolean));
      } catch (e) {
        setTeamList([]);
      } finally {
        setTeamsLoading(false);
      }
    };

    loadTeams();
  }, [sellerMode]);

  const [includedInput, setIncludedInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [deliveryFormatInput, setDeliveryFormatInput] = useState("");

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

  const addDeliveryFormat = () => {
    const v = deliveryFormatInput.trim();
    if (!v) return;
    if ((current.deliveryFormats || []).some((t) => t.toLowerCase() === v.toLowerCase())) {
      setDeliveryFormatInput("");
      return;
    }
    setPkg((p) => ({
      ...p,
      [activeTab]: {
        ...p[activeTab],
        deliveryFormats: [...(p[activeTab].deliveryFormats || []), v],
      },
    }));
    setDeliveryFormatInput("");
  };

  const removeDeliveryFormat = (idx) => {
    setPkg((p) => ({
      ...p,
      [activeTab]: {
        ...p[activeTab],
        deliveryFormats: p[activeTab].deliveryFormats.filter((_, i) => i !== idx),
      },
    }));
  };

  const [cover, setCover] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const applyCoverFile = (file) => {
    if (!file) return;
    setCoverFile(file);

    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  };

  const clearCover = () => {
    setCover(null);
    setCoverFile(null);
  };

  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);

  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);

  const updateFaq = (idx, key, value) => {
    setFaqs(faqs.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeFaq = (idx) => {
    if (faqs.length === 1) return;
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const [deliverables, setDeliverables] = useState([{ file: null, notes: "" }]);
  const [links, setLinks] = useState([""]);

  const addDeliverable = () => setDeliverables([...deliverables, { file: null, notes: "" }]);

  const updateDeliverableNotes = (idx, notes) =>
    setDeliverables(deliverables.map((d, i) => (i === idx ? { ...d, notes } : d)));

  const updateDeliverableFile = (idx, file) =>
    setDeliverables(deliverables.map((d, i) => (i === idx ? { ...d, file } : d)));

  const removeDeliverable = (idx) =>
    setDeliverables(deliverables.filter((_, i) => i !== idx));

  const addLink = () => setLinks([...links, ""]);
  const updateLink = (idx, value) => setLinks(links.map((l, i) => (i === idx ? value : l)));
  const removeLink = (idx) => setLinks(links.filter((_, i) => i !== idx));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [listingId, setListingId] = useState(null);

  React.useEffect(() => {
    const loadListing = async () => {
      if (!isEditMode || !username) {
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        setSaveError("");

        const res = await getListingByUsername(username);
        const item = res?.listing || null;

        if (!item) {
          setSaveError("Listing not found.");
          return;
        }

        if (item.listing_type !== LISTING_TYPE) {
          setSaveError("This listing is not a digital product.");
          return;
        }

        setListingId(item.id || null);
        setAiPowered(Boolean(item.ai_powered));

        setForm({
          title: item.title || "",
          category: item.category || "",
          subCategory: item.sub_category || "",
          shortDescription: item.short_description || "",
          about: item.about || "",
          productType: item?.details?.product_type || "",
        });

        setSellerMode(item.seller_mode || "Solo");
        setTeamName(item.team_name || "");
        setTags(Array.isArray(item.tags) ? item.tags : []);

        setFaqs(
          Array.isArray(item.faqs) && item.faqs.length
            ? item.faqs.map((faq) => ({
                q: faq.q || "",
                a: faq.a || "",
              }))
            : [{ q: "", a: "" }],
        );

        setLinks(
          Array.isArray(item.links) && item.links.length ? item.links : [""],
        );

        setDeliverables(
          Array.isArray(item.deliverables) && item.deliverables.length
            ? item.deliverables.map((d) => ({
                file: null,
                notes: d.notes || "",
                existing_file_name: d.file_name || "",
                existing_file_url: d.file_url || "",
              }))
            : [{ file: null, notes: "" }],
        );

        const packages = item?.details?.packages || {};
        setPkg({
          Basic: {
            price: packages?.Basic?.price || "",
            included: Array.isArray(packages?.Basic?.included) ? packages.Basic.included : [],
            toolsUsed: Array.isArray(item?.details?.tools) ? item.details.tools : [],
            deliveryFormats: Array.isArray(packages?.Basic?.deliveryFormats)
              ? packages.Basic.deliveryFormats
              : [],
          },
          Standard: {
            price: packages?.Standard?.price || "",
            included: Array.isArray(packages?.Standard?.included) ? packages.Standard.included : [],
            toolsUsed: Array.isArray(item?.details?.tools) ? item.details.tools : [],
            deliveryFormats: Array.isArray(packages?.Standard?.deliveryFormats)
              ? packages.Standard.deliveryFormats
              : [],
          },
          Premium: {
            price: packages?.Premium?.price || "",
            included: Array.isArray(packages?.Premium?.included) ? packages.Premium.included : [],
            toolsUsed: Array.isArray(item?.details?.tools) ? item.details.tools : [],
            deliveryFormats: Array.isArray(packages?.Premium?.deliveryFormats)
              ? packages.Premium.deliveryFormats
              : [],
          },
        });

        if (item.cover_media_url || item.cover_media_path) {
          setCover(item.cover_media_url || item.cover_media_path);
        }
      } catch (e) {
        setSaveError(e?.message || "Failed to load digital product.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadListing();
  }, [isEditMode, username]);

  const validateBeforeSave = () => {
    if (!String(form.title || "").trim()) return "Product title is required.";
    if (!String(form.category || "").trim()) return "Category is required.";
    if (!String(form.subCategory || "").trim()) return "Sub category is required.";
    if (!String(form.productType || "").trim()) return "Product type is required.";
    return "";
  };

  const buildPayload = (status) => ({
    listing_type: LISTING_TYPE,
    status,
    title: form.title,
    category: form.category,
    sub_category: form.subCategory,
    short_description: form.shortDescription,
    about: form.about,
    ai_powered: aiPowered,
    seller_mode: sellerMode,
    team_name: sellerMode === "Team" ? teamName : "",
    cover_file: coverFile,
    tags,
    faqs: faqs.filter((f) => String(f.q || "").trim() || String(f.a || "").trim()),
    links: links.map((l) => String(l || "").trim()).filter(Boolean),
    deliverables: deliverables.filter(
      (d) =>
        d.file ||
        String(d.notes || "").trim() ||
        String(d.existing_file_url || "").trim(),
    ),
    details: {
      product_type: form.productType,
      tools: current.toolsUsed,
      packages: pkg,
    },
  });

  const handleSaveListing = async (status = "published") => {
    const validationError = validateBeforeSave();
    if (validationError) {
      setSaveError(validationError);
      setSaveSuccess("");
      return;
    }

    try {
      setIsSubmitting(true);
      setSaveError("");
      setSaveSuccess("");

      const res = isEditMode
        ? await updateListing(username, buildPayload(status))
        : await createListing(buildPayload(status));

      const newListingId =
        res?.listing_id ||
        res?.data?.listing_id ||
        res?.listing?.id ||
        listingId ||
        null;

      if (newListingId) {
        setListingId(newListingId);
      }

      const message = isEditMode
        ? status === "draft"
          ? "Your digital product draft has been updated successfully."
          : "Your digital product has been updated successfully."
        : status === "draft"
          ? "Your digital product draft has been saved successfully."
          : "Your digital product has been created successfully.";

      setSaveSuccess(message);
      showSuccess(
        isEditMode
          ? status === "draft"
            ? "Draft Updated!"
            : "Digital Product Updated!"
          : status === "draft"
            ? "Draft Saved!"
            : "Digital Product Created!",
        message,
        status !== "draft",
      );
    } catch (e) {
      setSaveError(e?.message || `Failed to ${isEditMode ? "update" : "save"} listing.`);
      setSaveSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />
        <div className="pt-[85px] flex relative z-10">
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
          <div className="relative flex-1 min-w-5 overflow-hidden p-6">
            Loading digital product...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />

        <div
          className={`pt-[85px] flex relative z-10 ${
            isModalOpen ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
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

          <div className="relative flex-1 min-w-5 overflow-hidden">
            <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
              <div className="create-service-container">
                <div className="csl-stack">
                  <div className="csl-card">
                    <div className="csl-header">
                      <div>
                        <h1 className="csl-title">
                          {isEditMode ? "Edit Digital Product" : "Create Digital Product"}
                        </h1>
                        <p className="csl-subtitle">
                          {isEditMode ? "Update each section" : "Fill out each section"}
                        </p>
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

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Product title</label>
                        <input
                          className="csl-input"
                          placeholder="eg., Professional Logo Design"
                          value={form.title}
                          onChange={(e) => setFormField("title", e.target.value)}
                        />
                      </div>

                      <div className="csl-field mt-6">
                        <label className="csl-label">Product Description</label>
                        <textarea
                          className="csl-textarea"
                          placeholder="Short description"
                          value={form.shortDescription}
                          onChange={(e) => setFormField("shortDescription", e.target.value)}
                        />
                      </div>

                      <div className="csl-field mt-6">
                        <label className="csl-label">About Product</label>
                        <textarea
                          className="csl-textarea"
                          placeholder="About this digital product"
                          value={form.about}
                          onChange={(e) => setFormField("about", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-grid2">
                        <div className="csl-field">
                          <label className="csl-label">Category</label>
                          <CustomSelect
                            value={form.category}
                            onChange={(val) =>
                              setForm((prev) => ({
                                ...prev,
                                category: val,
                                subCategory: "",
                                productType: "",
                              }))
                            }
                            options={categories}
                            placeholder="Select category"
                          />
                        </div>

                        <div className="csl-field">
                          <label className={`csl-label ${!form.category ? "opacity-50" : ""}`}>
                            Sub Category
                          </label>
                          <CustomSelect
                            value={form.subCategory}
                            onChange={(val) =>
                              setForm((prev) => ({
                                ...prev,
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
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-grid2">
                        <div className="csl-field">
                          <label className={`csl-label ${!form.subCategory ? "opacity-50" : ""}`}>
                            Product Type
                          </label>
                          <CustomSelect
                            value={form.productType}
                            onChange={(val) => setFormField("productType", val)}
                            options={productTypes}
                            placeholder="eg., Digital Service"
                            disabled={!form.subCategory}
                          />
                        </div>

                        <div className="csl-field">
                          <label className="csl-label">Price</label>
                          <input
                            className="csl-input"
                            placeholder="Price"
                            type="number"
                            value={current.price}
                            onChange={(e) => setPkgField("price", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-grid2">
                        <div className="csl-field">
                          <label className="csl-label">Seller Type</label>
                          <CustomSelect
                            value={sellerMode}
                            onChange={(val) => {
                              setSellerMode(val);
                              if (val !== "Team") {
                                setTeamName("");
                              }
                            }}
                            options={["Solo", "Team"]}
                            placeholder="Select mode"
                          />
                        </div>

                        <div className="csl-field">
                          <label className={`csl-label ${sellerMode !== "Team" ? "opacity-50" : ""}`}>
                            Team Name
                          </label>
                          <CustomSelect
                            value={teamName}
                            onChange={(val) => setTeamName(val)}
                            options={teamList}
                            placeholder={
                              sellerMode !== "Team"
                                ? "Select team name"
                                : teamsLoading
                                  ? "Loading teams..."
                                  : teamList.length
                                    ? "Select team name"
                                    : "No team found"
                            }
                            disabled={sellerMode !== "Team" || teamsLoading || teamList.length === 0}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Tags (multi-select)</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="eg., Logo, Figma"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={onTagKeyDown}
                          />
                          <button type="button" className="csl-add-btn-lime" onClick={addTag}>
                            Add
                          </button>
                        </div>

                        {tags.length > 0 && (
                          <div className="csl-chips-container">
                            {tags.map((t, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {t}
                                <button type="button" onClick={() => removeTag(i)}>×</button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() => setTags([])}
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="csl-field mt-6">
                        <label className="csl-label">Tools used</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="eg., Figma, Notion"
                            value={toolsInput}
                            onChange={(e) => setToolsInput(e.target.value)}
                            onKeyDown={(e) => onEnterAdd(e, addTool)}
                          />
                          <button type="button" className="csl-add-btn-lime" onClick={addTool}>
                            Add
                          </button>
                        </div>

                        {!!current.toolsUsed?.length && (
                          <div className="csl-chips-container">
                            {current.toolsUsed.map((x, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {x}
                                <button type="button" onClick={() => removeTool(i)}>×</button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() =>
                                setPkg((p) => ({
                                  ...p,
                                  [activeTab]: { ...p[activeTab], toolsUsed: [] },
                                }))
                              }
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Packages</label>

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

                        <div className="csl-field mt-4">
                          <label className="csl-label">{activeTab} Price</label>
                          <input
                            className="csl-input"
                            placeholder="Package price"
                            value={current.price}
                            onChange={(e) => setPkgField("price", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="csl-field mt-6">
                        <label className="csl-label">What's included</label>
                        <input
                          className="csl-input"
                          placeholder="eg., Source Files"
                          value={includedInput}
                          onChange={(e) => setIncludedInput(e.target.value)}
                          onKeyDown={(e) => onEnterAdd(e, addIncluded)}
                        />
                        <button type="button" className="csl-add-btn-lime-below" onClick={addIncluded}>
                          Add
                        </button>

                        {!!current.included?.length && (
                          <div className="csl-chips-container" style={{ marginTop: "12px" }}>
                            {current.included.map((x, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {x}
                                <button type="button" onClick={() => removeFromList("included", i)}>
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() =>
                                setPkg((p) => ({
                                  ...p,
                                  [activeTab]: { ...p[activeTab], included: [] },
                                }))
                              }
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="csl-field mt-6">
                        <label className="csl-label">Delivery format</label>
                        <input
                          className="csl-input"
                          placeholder="eg., Google Drive Link"
                          value={deliveryFormatInput}
                          onChange={(e) => setDeliveryFormatInput(e.target.value)}
                          onKeyDown={(e) => onEnterAdd(e, addDeliveryFormat)}
                        />
                        <button
                          type="button"
                          className="csl-add-btn-lime-below"
                          onClick={addDeliveryFormat}
                        >
                          Add
                        </button>

                        {!!current.deliveryFormats?.length && (
                          <div className="csl-chips-container" style={{ marginTop: "12px" }}>
                            {current.deliveryFormats.map((x, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {x}
                                <button type="button" onClick={() => removeDeliveryFormat(i)}>
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() =>
                                setPkg((p) => ({
                                  ...p,
                                  [activeTab]: { ...p[activeTab], deliveryFormats: [] },
                                }))
                              }
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <CoverSection
                    mode="listing"
                    listingType={LISTING_TYPE}
                    cover={cover}
                    coverFileName={coverFile?.name || ""}
                    onUploadClick={() => setUploadStep("grid")}
                    onRemoveCover={clearCover}
                  />

                  {saveError ? <p className="text-red-600 text-sm">{saveError}</p> : null}
                  {saveSuccess ? <p className="text-green-600 text-sm">{saveSuccess}</p> : null}

                  <div className="csl-group-box">
                    <h2 className="csl-section">Portfolio</h2>
                    <div className="csl-portfolio-wrap">
                      <MyPortfolio
                        key={listingId || "new-listing-portfolio"}
                        theme={theme}
                        mode="listing"
                        listingType={LISTING_TYPE}
                        listingId={listingId}
                      />
                    </div>
                  </div>

                  <DeliverablesSection
                    mode="listing"
                    listingType={LISTING_TYPE}
                    deliverables={deliverables}
                    onAddDeliverable={addDeliverable}
                    onRemoveDeliverable={removeDeliverable}
                    onUpdateDeliverableNotes={updateDeliverableNotes}
                    onUpdateDeliverableFile={updateDeliverableFile}
                    links={links}
                    onAddLink={addLink}
                    onRemoveLink={removeLink}
                    onUpdateLink={updateLink}
                  />

                  <FAQSection
                    mode="listing"
                    listingType={LISTING_TYPE}
                    faqs={faqs}
                    onAddFaq={addFaq}
                    onUpdateFaq={updateFaq}
                    onRemoveFaq={removeFaq}
                    showFooter={true}
                    isSaving={isSubmitting}
                    submitMode={isEditMode ? "edit" : "create"}
                    onSave={() => handleSaveListing("published")}
                    onSaveDraft={() => handleSaveListing("draft")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen &&
          createPortal(
            <div className={`user-page ${theme || "light"}`}>
              <div
                className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
                onClick={() => setUploadStep(null)}
              />

              {(uploadStep === "grid" || uploadStep === "success") && (
                <UploadGrid
                  blurred={uploadStep === "success"}
                  onBack={() => setUploadStep(null)}
                  onSelect={(files) => {
                    if (files?.[0]) applyCoverFile(files[0]);
                    setUploadStep("success");
                  }}
                />
              )}

              {uploadStep === "success" && <UploadSuccess onBack={() => setUploadStep(null)} />}
            </div>,
            document.body,
          )}
      </div>

      <SuccessPopup
        open={successPopup.open}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() => setSuccessPopup({ open: false, title: "", message: "" })}
        onClick={() => {
          setSuccessPopup({
            open: false,
            title: "",
            message: "",
            shouldRedirect: false,
          });

          if (successPopup.shouldRedirect) {
            navigate("/my-listings");
          }
        }}
      />
    </>
  );
}

function CustomSelect({ value, onChange, options, placeholder, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div
      className={`onboarding-custom-select ${open ? "active" : ""} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
      ref={ref}
    >
      <div className="onboarding-selected-option" onClick={() => !disabled && setOpen(!open)}>
        <span className={!value ? "opacity-70" : ""}>{value || placeholder}</span>
        <span className="onboarding-arrow">▼</span>
      </div>

      {open && (
        <ul className="onboarding-options-list dark:bg-[#1E1E1E]">
          {options.map((opt, index) => (
            <li
              key={`${opt}-${index}`}
              className={value === opt ? "active" : ""}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UploadGrid({ onSelect, onBack, blurred }) {
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);
  const activeIndexRef = useRef(null);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (activeIndexRef.current === null || selected.length === 0) return;

    setFiles((prev) => {
      const updated = [...prev];
      updated[activeIndexRef.current] = selected[0];
      return updated;
    });

    activeIndexRef.current = null;
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
      <div
        className={`upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white dark:bg-[#1A1A1A] shadow-[0_0_20px_#CEFF1B] transition-all duration-200 ${
          blurred ? "blur-sm scale-[0.98] pointer-events-none select-none opacity-95" : ""
        }`}
      >
        <div className="upload-header flex items-center gap-3 mb-3 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 shrink-0"
            title="Back"
          >
            <img src="/backarrow.svg" alt="back" />
          </button>

          <h4 className="text-sm font-medium text-black dark:text-black">
            Select and upload your file
          </h4>

          <button
            type="button"
            onClick={onBack}
            className="ml-auto w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#CEFF1B]"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 custom-scroll">
          {Array.from({ length: 9 }).map((_, i) => {
            const file = files[i];
            return (
              <div
                key={i}
                onClick={() => {
                  activeIndexRef.current = i;
                  fileRef.current?.click();
                }}
                className="upload-slot relative h-[110px] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                {i === 0 && (
                  <span className="absolute inset-0 z-10 flex items-center justify-center px-2 pointer-events-none">
                    <span className="bg-[#CEFF1B] text-black font-medium text-[10px] sm:text-xs px-2 py-[3px] rounded max-w-[90%] text-center whitespace-normal leading-tight">
                      Upload Cover Image
                    </span>
                  </span>
                )}

                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  i !== 0 && (
                    <div className="relative pointer-events-none">
                      <img src="/video2.svg" className="w-10 mr-8 mt-2 opacity-60" alt="" />
                      <img src="/video1.svg" className="w-12 absolute -right-2 -top-3 opacity-60" alt="" />
                      <div className="absolute bottom-4 right-6 w-6 h-6 rounded-full bg-[#CEFF1B] flex items-center justify-center text-black font-bold">
                        +
                      </div>
                    </div>
                  )
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
              className="upload-btn-cancel px-4 py-2 rounded-lg text-sm border border-black dark:border-white/20 dark:text-white"
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

function SuccessPopup({ open, title, message, onClose, onClick }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl shadow-[0_0_30px_rgba(206,255,27,0.4)] border border-[#CEFF1B] px-8 py-10 w-full max-w-[420px] text-center animate-[fadeIn_.25s_ease]">
        <div className="w-20 h-20 rounded-full bg-[#CEFF1B] mx-auto flex items-center justify-center mb-6 shadow-lg">
          <img src="/right.svg" alt="success" className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>

        <button
          onClick={onClick}
          className="bg-[#CEFF1B] text-black font-semibold px-6 py-3 rounded-xl border border-black hover:scale-[1.02] transition"
        >
          Continue
        </button>
      </div>
    </div>,
    document.body
  );
}

function UploadSuccess({ onBack }) {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-auto p-4">
      <div className="upload-success-card rounded-2xl w-[90%] max-w-[600px] h-auto min-h-[300px] md:h-[400px] py-10 flex flex-col items-center justify-center shadow-[0_0_20px_#CEFF1B] bg-white dark:bg-[#2B2B2B]">
        <div className="w-24 h-24 bg-[#CEFF1B] rounded-full flex items-center justify-center mb-6">
          <img src="/right.svg" alt="success" />
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