import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CreateServiceListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import {
  createListing,
  getListingByUsername,
  updateListing,
  getListingDropdowns,
  getMyTeams,
} from "../api/listingApi";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const LISTING_TYPE = "service";
const LISTING_TYPE_SLUG = "service";
const TABS = ["Basic", "Standard", "Premium"];

const EMPTY_PACKAGE = {
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
};

const EMPTY_FAQ = { q: "", a: "" };
const EMPTY_ADDON = { name: "", price: "", days: "" };

export default function CreateServiceListing({
  theme = "light",
  setTheme,
  mode = "create",
}) {
  const navigate = useNavigate();
  const { username } = useParams();
  const isEditMode = mode === "edit";

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(null); // null | "draft" | "published"

  const [validationErrors, setValidationErrors] = useState({});
  const [lastAutoSave, setLastAutoSave] = useState(null);
  const prevFormRef = useRef(null);

  const [listingId, setListingId] = useState(null);
  const [saveError, setSaveError] = useState("");

  const [coverImages, setCoverImages] = useState([]); // preview URLs
  const [coverFiles, setCoverFiles] = useState([]);   // File objects
  const [coverSlideIdx, setCoverSlideIdx] = useState(0);

  const [aiPowered, setAiPowered] = useState(false);
  const [sellerMode, setSellerMode] = useState("Solo");
  const [teamName, setTeamName] = useState("");
  const [activeTab, setActiveTab] = useState("Basic");

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    productType: "",
    shortDescription: "",
    about: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [pkg, setPkg] = useState({
    Basic: { ...EMPTY_PACKAGE, enabled: true },
    Standard: { ...EMPTY_PACKAGE, enabled: false },
    Premium: { ...EMPTY_PACKAGE, enabled: false },
  });

  const [includedInput, setIncludedInput] = useState("");
  const [howInput, setHowInput] = useState("");
  const [notInput, setNotInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");

  const [addOn, setAddOn] = useState({ ...EMPTY_ADDON });
  const [addOns, setAddOns] = useState([]);

  const [faqs, setFaqs] = useState([{ ...EMPTY_FAQ }]);

  const [portfolioItems, setPortfolioItems] = useState([
    { image: null, title: "", description: "", cost: "" },
    { image: null, title: "", description: "", cost: "" },
    { image: null, title: "", description: "", cost: "" },
    { image: null, title: "", description: "", cost: "" },
  ]);

  const current = pkg[activeTab];

  // Metadata fetching
  React.useEffect(() => {
    const fetchMetadata = async () => {
      setIsMetaLoading(true);
      try {
        const catRes = await getListingDropdowns(LISTING_TYPE_SLUG, { type: "categories" });
        if (catRes?.categories) setCategories(catRes.categories);
        
        const teamRes = await getMyTeams();
        const rows = Array.isArray(teamRes?.teams) ? teamRes.teams : (Array.isArray(teamRes) ? teamRes : []);
        setTeamOptions(rows);
      } catch (e) {
        console.error("Metadata fetch failed", e);
      } finally {
        setIsMetaLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  React.useEffect(() => {
    if (!form.category) {
      setSubCategories([]);
      setProductTypes([]);
      return;
    }
    const fetchSubs = async () => {
      try {
        const res = await getListingDropdowns(LISTING_TYPE_SLUG, { 
          type: "sub_categories", 
          category: form.category 
        });
        if (res?.sub_categories) setSubCategories(res.sub_categories);
      } catch (e) {
        console.error("Subcategories fetch failed", e);
      }
    };
    fetchSubs();
  }, [form.category]);

  React.useEffect(() => {
    if (!form.category || !form.subCategory) {
      setProductTypes([]);
      return;
    }
    const fetchProductTypes = async () => {
      try {
        const res = await getListingDropdowns(LISTING_TYPE_SLUG, { 
          type: "product_types",
          category: form.category,
          sub_category: form.subCategory
        });
        if (res?.product_types) setProductTypes(res.product_types);
      } catch (e) {
        console.error("Product types fetch failed", e);
      }
    };
    fetchProductTypes();
  }, [form.category, form.subCategory]);

  // Load listing for Edit mode
  React.useEffect(() => {
    if (!isEditMode || !username) {
      setInitialLoading(false);
      return;
    }

    const loadListing = async () => {
      setInitialLoading(true);
      try {
        const item = await getListingByUsername(username);
        setListingId(item.id);

        setForm({
          title: item.title || "",
          category: item.category || "",
          subCategory: item.sub_category || "",
          productType: item.details?.product_type || "",
          shortDescription: item.short_description || "",
          about: item.about || "",
        });

        if (item.tags) setTags(item.tags);
        if (item.ai_powered !== undefined) setAiPowered(!!item.ai_powered);
        if (item.seller_mode) setSellerMode(item.seller_mode);
        if (item.team_name) setTeamName(item.team_name);

        if (item.details?.packages) {
          const newPkg = { ...pkg };
          item.details.packages.forEach((p, idx) => {
            const tab = TABS[idx];
            if (tab) {
              newPkg[tab] = {
                ...EMPTY_PACKAGE,
                ...p,
                enabled: true,
                packageName: p.package_name || tab,
              };
            }
          });
          setPkg(newPkg);
        }

        if (item.details?.add_ons) setAddOns(item.details.add_ons);
        if (item.faqs) setFaqs(item.faqs.map(f => ({ q: f.q || f.question || "", a: f.a || f.answer || "" })));

        if (item.portfolio_projects) {
          const loaded = item.portfolio_projects.map(p => ({
            title: p.title || "",
            description: p.description || "",
            cost: p.cost || "",
            image: p.media?.[0]?.url || p.cover_media_url || null,
            existingMedia: p.media || []
          }));
          // Ensure we have 4 slots, filling with empty if needed
          const filled = [...loaded];
          while(filled.length < 4) {
            filled.push({ image: null, title: "", description: "", cost: "" });
          }
          setPortfolioItems(filled);
        }

        if (item.gallery) {
          setCoverImages(item.gallery);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Load failed",
          text: e?.message || "Failed to load service listing.",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadListing();
  }, [isEditMode, username]);

  // Handlers
  const setFormField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setPkgField = (key, value) => {
    setPkg((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }));
  };

  const addToList = (key, value, setValue, limit = 20) => {
    const clean = String(value || "").trim();
    if (!clean) return;

    setPkg((prev) => {
      const currentList = Array.isArray(prev[activeTab][key]) ? prev[activeTab][key] : [];
      if (currentList.length >= limit) return prev;
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [key]: [...currentList, clean.substring(0, 80)],
        },
      };
    });
    setValue("");
  };

  const removeFromList = (key, idx) => {
    setPkg((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: prev[activeTab][key].filter((_, i) => i !== idx),
      },
    }));
  };

  const addFaq = () => {
    if (faqs.length < 10) setFaqs([...faqs, { ...EMPTY_FAQ }]);
  };

  const updateFaq = (idx, key, val) => {
    const newFaqs = [...faqs];
    newFaqs[idx][key] = val;
    setFaqs(newFaqs);
  };

  const applyCoverFiles = (files) => {
    if (!files || !files.length) return;
    setCoverFiles(files);
    const urls = files.map(f => URL.createObjectURL(f));
    setCoverImages(urls);
    setCoverSlideIdx(0);
  };

  const validateBeforeSave = () => {
    const errors = {};
    if (!form.title || form.title.length < 10) errors.title = true;
    if (!form.category) errors.category = true;
    if (!form.subCategory) errors.subCategory = true;
    if (!form.shortDescription || form.shortDescription.length < 30) errors.shortDescription = true;
    if (!form.about || form.about.length < 100) errors.about = true;
    if (!form.productType) errors.productType = true;
    if (tags.length === 0) errors.tags = true;

    const b = pkg.Basic;
    if (!b.packageName) errors.basicName = true;
    if (!b.price || b.price < 1) errors.basicPrice = true;
    if (!b.deliveryDays || b.deliveryDays < 1) errors.basicDelivery = true;
    if (b.revisions === "" || b.revisions === null) errors.basicRevisions = true;
    if (!b.scope) errors.basicScope = true;

    if (sellerMode === "Team" && !teamName) errors.teamName = true;
    if (coverImages.length === 0 && coverFiles.length === 0) errors.coverImages = true;

    setValidationErrors(errors);
    return Object.keys(errors).length;
  };

  const buildPayload = (status = "published") => {
    const details = {
      product_type: form.productType,
      packages: TABS.map((tab) => {
        const p = pkg[tab];
        if (!p.enabled && tab !== "Basic") return null;
        return {
          package_name: p.packageName || tab,
          price: p.price,
          delivery_days: p.delivery_days || p.deliveryDays,
          revisions: p.revisions,
          scope: p.scope,
          included: p.included || [],
          how_it_works: p.how_it_works || p.howItWorks || [],
          not_included: p.not_included || p.notIncluded || [],
          tools_used: p.tools_used || p.toolsUsed || [],
          delivery_format: p.delivery_format || p.deliveryFormat || "",
        };
      }).filter(Boolean),
      add_ons: addOns,
    };

    return {
      listing_type: LISTING_TYPE,
      status: status,
      title: form.title,
      category: form.category,
      sub_category: form.subCategory,
      short_description: form.shortDescription,
      about: form.about,
      tags: tags,
      ai_powered: aiPowered,
      seller_mode: sellerMode,
      team_name: teamName,
      details: details,
      faqs: faqs.filter(f => f.q.trim() && f.a.trim()),
      portfolio_projects: portfolioItems.filter(p => p.image || p.title).map((p, idx) => ({
        title: p.title,
        description: p.description,
        cost: p.cost,
        sort_order: idx,
        files: p.image instanceof File ? [p.image] : [],
        existing_media: p.existingMedia || []
      })),
      cover_files: coverFiles,
      existing_cover_urls: coverImages.filter(img => typeof img === 'string' && !img.startsWith('blob:'))
    };
  };

  const handleSaveListing = async (status = "published", isAutoSave = false) => {
    if (status === "published") {
      const errCount = validateBeforeSave();
      if (errCount > 0) {
        Swal.fire({
          icon: "warning",
          title: "Validation error",
          text: `Please fix ${errCount} errors before publishing.`,
        });
        const firstErr = document.querySelector(".error-border");
        if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    try {
      if (!isAutoSave) setSavingStatus(status);
      const payload = buildPayload(status);
      
      const res = isEditMode 
        ? await updateListing(username, payload)
        : await createListing(payload);

      if (isAutoSave) {
        setLastAutoSave(new Date());
      } else {
        Swal.fire({
          icon: "success",
          title: status === "draft" ? "Draft Saved" : "Published!",
          text: status === "draft" ? "Your listing has been saved as a draft." : "Your service is now live.",
        }).then(() => {
          if (status === "published") navigate(`/marketplace/service/${res.slug || username}?published=true`);
        });
      }
    } catch (e) {
      if (!isAutoSave) {
        Swal.fire({ icon: "error", title: "Save failed", text: e?.message || "Failed to save listing." });
      }
    } finally {
      if (!isAutoSave) setSavingStatus(null);
    }
  };

  // Auto-save logic
  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentPayload = JSON.stringify(buildPayload("draft"));
      if (prevFormRef.current && prevFormRef.current !== currentPayload) {
        handleSaveListing("draft", true);
      }
      prevFormRef.current = currentPayload;
    }, 30000);
    return () => clearInterval(interval);
  }, [form, pkg, tags, addOns, faqs, portfolioItems, sellerMode, teamName]);

  if (initialLoading) {
    return (
      <div className="create-service-page dark bg-[#0b0b0b] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#CEFF1B]" />
      </div>
    );
  }

  return (
    <div className={`create-service-page ${theme} bg-[#f4f4f4] min-h-screen`}>
      <UserNavbar theme={theme} setTheme={setTheme} />
      <div className="pt-[85px] flex">
        <Sidebar expanded={sidebarOpen} setExpanded={setSidebarOpen} theme={theme} setTheme={setTheme} />
        
        <div className="relative flex-1 min-w-5 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="create-service-container">
              <div className="csl-stack">
                <div className="csl-card">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? "Edit Service Listing" : "Create Service Listing"}
                      </h1>
                      <p className="text-gray-500 mt-1">Fill out the details below to showcase your expertise.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">AI Powered?</span>
                      <label className="csl-switch">
                        <input type="checkbox" checked={aiPowered} onChange={(e) => setAiPowered(e.target.checked)} />
                        <span className="csl-slider" />
                      </label>
                    </div>
                  </div>

                  {/* Section A */}
                  
                  <div className="csl-field mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="csl-label !mb-0">Listing Title <span className="text-red-500">*</span></label>
                      <span className="text-xs text-gray-500">{form.title.length}/120</span>
                    </div>
                    <input
                      className={`csl-input ${validationErrors.title ? "error-border" : ""}`}
                      placeholder="Start with I will... Example: I will design your brand identity from scratch."
                      value={form.title}
                      maxLength={120}
                      onChange={(e) => setFormField("title", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="csl-field">
                      <label className="csl-label">Category <span className="text-red-500">*</span></label>
                      <div className={validationErrors.category ? "error-border rounded-xl" : ""}>
                        <CustomSelect
                          value={form.category}
                          onChange={(val) => { setFormField("category", val); setFormField("subCategory", ""); }}
                          options={categories.map(c => c.name || c)}
                          placeholder={isMetaLoading ? "Loading..." : "Select category"}
                        />
                      </div>
                    </div>
                    <div className="csl-field">
                      <label className="csl-label">Sub category <span className="text-red-500">*</span></label>
                      <div className={validationErrors.subCategory ? "error-border rounded-xl" : ""}>
                        <CustomSelect
                          value={form.subCategory}
                          onChange={(val) => setFormField("subCategory", val)}
                          options={subCategories.map(s => s.name || s)}
                          placeholder="Select sub category"
                          disabled={!form.category}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="csl-field mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="csl-label !mb-0">Short Description <span className="text-red-500">*</span></label>
                      <span className="text-xs text-gray-500">{form.shortDescription.length}/300</span>
                    </div>
                    <textarea
                      className={`csl-textarea h-24 ${validationErrors.shortDescription ? "error-border" : ""}`}
                      placeholder="Brief summary shown in search results (30-300 chars)"
                      value={form.shortDescription}
                      maxLength={300}
                      onChange={(e) => setFormField("shortDescription", e.target.value)}
                    />
                  </div>

                  <div className="csl-field mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="csl-label !mb-0">About This Service <span className="text-red-500">*</span></label>
                      <span className="text-xs text-gray-500">{form.about.length}/3000</span>
                    </div>
                    <textarea
                      className={`csl-textarea h-48 ${validationErrors.about ? "error-border" : ""}`}
                      placeholder="Full detailed description (100-3000 chars)"
                      value={form.about}
                      maxLength={3000}
                      onChange={(e) => setFormField("about", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="csl-field">
                      <label className="csl-label">Product type <span className="text-red-500">*</span></label>
                      <div className={validationErrors.productType ? "error-border rounded-xl" : ""}>
                        <CustomSelect
                          value={form.productType}
                          onChange={(val) => setFormField("productType", val)}
                          options={productTypes.length > 0 ? productTypes.map(pt => pt.name || pt) : ["Digital Service", "Consultation", "Retainer", "Done-For-You", "Other"]}
                          placeholder={productTypes.length > 0 ? "Select type" : "Select subcategory first"}
                          disabled={!form.subCategory && productTypes.length === 0}
                        />
                      </div>
                    </div>
                    <div className="csl-field">
                      <label className="csl-label">Tags <span className="text-red-500">*</span></label>
                      <div className={`csl-tag-box ${validationErrors.tags ? "error-border" : ""}`}>
                        {tags.map((t, idx) => (
                          <span key={idx} className="csl-tag-pill">
                            {t}
                            <button onClick={() => setTags(tags.filter((_, i) => i !== idx))}>×</button>
                          </span>
                        ))}
                        {tags.length < 15 && (
                          <input
                            type="text"
                            placeholder="Add tags..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && tagInput.trim()) {
                                setTags([...tags, tagInput.trim().substring(0, 30)]);
                                setTagInput("");
                              }
                            }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1">1-15 tags. Press Enter to add.</span>
                    </div>
                  </div>
                </div>

                {/* Section B */}
                <div className="csl-card">
                  <div className="flex gap-4 mb-6">
                    {["Solo", "Team"].map((m) => (
                      <button
                        key={m}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          sellerMode === m ? "bg-[#CEFF1B] border-black text-black font-bold" : "border-gray-200 text-gray-500 hover:text-black hover:border-black"
                        }`}
                        onClick={() => setSellerMode(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {sellerMode === "Team" && (
                    <div className="csl-field">
                      <label className="csl-label">Select Team <span className="text-red-500">*</span></label>
                      <div className={validationErrors.teamName ? "error-border rounded-xl" : ""}>
                        {teamOptions.length > 0 ? (
                          <CustomSelect
                            value={teamName}
                            onChange={setTeamName}
                            options={teamOptions.map(t => t.team_name || t.name || t)}
                            placeholder="Choose your team"
                          />
                        ) : (
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500">
                            No active teams found. <a href="/dashboard/creator/teams/create" className="text-[#CEFF1B] underline font-bold">Create one first.</a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section C */}
                <div className="csl-card">
                  <div className="flex gap-4 mb-8">
                    {TABS.map((tab) => (
                      <div key={tab} className="flex-1 flex flex-col items-center">
                        <button
                          className={`w-full py-3 rounded-xl border transition-all ${activeTab === tab ? "bg-[#CEFF1B] border-black text-black font-bold" : "border-gray-200 text-gray-500"}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab}
                        </button>
                        {tab !== "Basic" && (
                          <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${pkg[tab].enabled ? "bg-[#CEFF1B]" : "bg-gray-200"}`}>
                              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${pkg[tab].enabled ? "left-4.5" : "left-0.5"}`} />
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={pkg[tab].enabled}
                              onChange={(e) => setPkg(prev => ({ ...prev, [tab]: { ...prev[tab], enabled: e.target.checked } }))}
                            />
                            <span className="text-[10px] text-gray-500 group-hover:text-gray-300">Enabled</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={`transition-opacity ${!current.enabled ? "opacity-30 pointer-events-none" : ""}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="csl-field">
                        <label className="csl-label">Package Name <span className="text-red-500">*</span></label>
                        <input
                          className={`csl-input ${validationErrors.basicName && activeTab === "Basic" ? "error-border" : ""}`}
                          value={current.packageName}
                          maxLength={30}
                          onChange={(e) => setPkgField("packageName", e.target.value)}
                        />
                      </div>
                      <div className="csl-field">
                        <label className="csl-label">Price <span className="text-red-500">*</span></label>
                        <div className={`relative ${validationErrors.basicPrice && activeTab === "Basic" ? "error-border rounded-xl" : ""}`}>
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                          <input
                            type="number"
                            className="csl-input pl-8"
                            value={current.price}
                            onChange={(e) => setPkgField("price", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="csl-field">
                        <label className="csl-label">Delivery Days <span className="text-red-500">*</span></label>
                        <div className={`flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 ${validationErrors.basicDelivery && activeTab === "Basic" ? "error-border" : ""}`}>
                          <button className="w-10 h-10 text-gray-600 hover:text-black font-bold" onClick={() => setPkgField("deliveryDays", Math.max(1, (Number(current.deliveryDays) || 1) - 1))}>-</button>
                          <input type="number" className="flex-1 bg-transparent text-center text-gray-900 font-bold outline-none" value={current.deliveryDays} onChange={(e) => setPkgField("deliveryDays", e.target.value)} />
                          <button className="w-10 h-10 text-gray-600 hover:text-black font-bold" onClick={() => setPkgField("deliveryDays", (Number(current.deliveryDays) || 0) + 1)}>+</button>
                        </div>
                      </div>
                      <div className="csl-field">
                        <label className="csl-label">Revisions <span className="text-red-500">*</span></label>
                        <div className={`flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 ${validationErrors.basicRevisions && activeTab === "Basic" ? "error-border" : ""}`}>
                          <button className="w-10 h-10 text-gray-600 hover:text-black font-bold" onClick={() => setPkgField("revisions", Math.max(0, (Number(current.revisions) || 0) - 1))}>-</button>
                          <input type="number" className="flex-1 bg-transparent text-center text-gray-900 font-bold outline-none" value={current.revisions} onChange={(e) => setPkgField("revisions", e.target.value)} />
                          <button className="w-10 h-10 text-gray-600 hover:text-black font-bold" onClick={() => setPkgField("revisions", (Number(current.revisions) || 0) + 1)}>+</button>
                        </div>
                      </div>
                    </div>

                    <div className="csl-field mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="csl-label !mb-0">Scope of Work <span className="text-red-500">*</span></label>
                        <span className="text-xs text-gray-500">{current.scope.length}/500</span>
                      </div>
                      <textarea
                        className={`csl-textarea h-32 ${validationErrors.basicScope && activeTab === "Basic" ? "error-border" : ""}`}
                        value={current.scope}
                        maxLength={500}
                        onChange={(e) => setPkgField("scope", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="csl-label">What's Included</label>
                        <div className="flex gap-2 mb-3">
                          <input className="csl-input" value={includedInput} onChange={e => setIncludedInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addToList("included", includedInput, setIncludedInput, 20)} />
                          <button className="px-4 bg-[#CEFF1B] text-black rounded-xl font-bold" onClick={() => addToList("included", includedInput, setIncludedInput, 20)}>+</button>
                        </div>
                        <ul className="space-y-2">
                          {current.included.map((item, i) => (
                            <li key={i} className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                              • {item}
                              <button onClick={() => removeFromList("included", i)} className="text-red-500">×</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <label className="csl-label">How it Works</label>
                        <div className="flex gap-2 mb-3">
                          <input className="csl-input" value={howInput} onChange={e => setHowInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addToList("howItWorks", howInput, setHowInput, 10)} />
                          <button className="px-4 bg-[#CEFF1B] text-black rounded-xl font-bold" onClick={() => addToList("howItWorks", howInput, setHowInput, 10)}>+</button>
                        </div>
                        <ul className="space-y-2">
                          {current.howItWorks.map((item, i) => (
                            <li key={i} className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                              {i + 1}. {item}
                              <button onClick={() => removeFromList("howItWorks", i)} className="text-red-500">×</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section D */}
                <div className="csl-card">
                  <div className="space-y-4 mb-6">
                    {addOns.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 animate-in fade-in zoom-in-95">
                        <div className="flex-1 text-gray-900 font-medium">{item.name}</div>
                        <div className="w-24 text-gray-900 font-bold">${item.price}</div>
                        <div className="text-gray-500 text-xs">+{item.days} days</div>
                        <button onClick={() => setAddOns(addOns.filter((_, i) => i !== idx))} className="text-red-500 text-xl">×</button>
                      </div>
                    ))}
                  </div>

                  {addOns.length < 5 && (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input className="csl-input" placeholder="Add-on Name" value={addOn.name} onChange={e => setAddOn({...addOn, name: e.target.value})} />
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                          <input type="number" className="csl-input pl-8" placeholder="Price" value={addOn.price} onChange={e => setAddOn({...addOn, price: e.target.value})} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center bg-gray-200 p-1 rounded-xl">
                          <button className="w-8 h-8 text-gray-700" onClick={() => setAddOn({...addOn, days: Math.max(0, (Number(addOn.days)||0)-1)})}>-</button>
                          <span className="w-20 text-center text-xs text-gray-700">{addOn.days || 0} Extra Days</span>
                          <button className="w-8 h-8 text-gray-700" onClick={() => setAddOn({...addOn, days: (Number(addOn.days)||0)+1})}>+</button>
                        </div>
                        <button className="px-6 py-2 bg-[#CEFF1B] text-black rounded-xl font-bold border border-black shadow-[2px_2px_0px_black]" onClick={() => { if(addOn.name && addOn.price) { setAddOns([...addOns, addOn]); setAddOn(EMPTY_ADDON); } }}>+ Add Add-On</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section E */}
                <div className="csl-card">
                  <div 
                    className={`relative aspect-video rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group ${validationErrors.coverImages ? "border-red-500" : "border-gray-200 hover:border-[#CEFF1B]"}`}
                    onClick={() => setUploadStep("grid")}
                  >
                    {coverImages.length > 0 ? (
                      <>
                        <img src={coverImages[0]} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold border border-black shadow-[2px_2px_0px_black]">Change Image</span>
                        </div>
                        <button className="absolute top-4 right-4 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); setCoverImages([]); setCoverFiles([]); }}>×</button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                        <p className="text-gray-900 font-bold">Click to upload cover photo</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP • Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="csl-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioItems.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`bg-gray-50 p-6 rounded-3xl border border-gray-200 relative group transition-all hover:shadow-lg ${idx === 0 ? "md:col-span-2 lg:col-span-2 md:row-span-2" : "md:col-span-1"}`}
                      >
                        <div 
                          className={`${idx === 0 ? "aspect-[16/9] lg:aspect-[16/10]" : "aspect-video"} bg-gray-200 rounded-2xl mb-4 overflow-hidden relative cursor-pointer shadow-inner`}
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = e.target.files[0];
                              if(file) {
                                const newItems = [...portfolioItems];
                                newItems[idx].image = file;
                                setPortfolioItems(newItems);
                              }
                            };
                            input.click();
                          }}
                        >
                          {item.image ? (
                            <img src={item.image instanceof File ? URL.createObjectURL(item.image) : item.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Portfolio" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <svg width={idx === 0 ? "48" : "24"} height={idx === 0 ? "48" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <span className={`${idx === 0 ? "text-sm" : "text-xs"} mt-2 font-bold`}>{idx === 0 ? "Upload Main Project Image" : "Upload Project Image"}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full shadow-lg border border-black">Change Image</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <input 
                            className={`csl-input ${idx === 0 ? "text-lg font-bold" : ""}`} 
                            placeholder={idx === 0 ? "Main Project Title" : "Project Title"} 
                            value={item.title} 
                            onChange={e => { const ni = [...portfolioItems]; ni[idx].title = e.target.value; setPortfolioItems(ni); }} 
                          />
                          <textarea 
                            className={`csl-textarea ${idx === 0 ? "h-32" : "h-24"}`} 
                            placeholder="Description of this project..." 
                            value={item.description} 
                            onChange={e => { const ni = [...portfolioItems]; ni[idx].description = e.target.value; setPortfolioItems(ni); }} 
                          />
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input className="csl-input pl-8" placeholder="Cost (e.g. 500-800)" value={item.cost} onChange={e => { const ni = [...portfolioItems]; ni[idx].cost = e.target.value; setPortfolioItems(ni); }} />
                          </div>
                        </div>
                        
                        {portfolioItems.length > 1 && (
                          <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center shadow-lg hover:scale-110 transition-transform" onClick={() => setPortfolioItems(portfolioItems.filter((_, i) => i !== idx))}>×</button>
                        )}
                      </div>
                    ))}
                  </div>
                  {portfolioItems.length < 4 && (
                    <button className="w-full py-6 mt-6 border-2 border-dashed border-gray-300 rounded-[32px] text-gray-500 hover:border-[#CEFF1B] hover:text-[#CEFF1B] hover:bg-[#CEFF1B]/5 transition-all font-black uppercase tracking-widest text-sm" onClick={() => setPortfolioItems([...portfolioItems, { image: null, title: "", description: "", cost: "" }])}>
                      + Add Portfolio Item ({portfolioItems.length}/4)
                    </button>
                  )}
                </div>

                {/* Section G */}
                <div className="csl-card">
                  <div className="space-y-6 mb-8">
                    {faqs.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 relative">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-gray-500 font-bold">FAQ #{idx + 1}</span>
                          {faqs.length > 1 && <button onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))} className="text-red-500">Remove</button>}
                        </div>
                        <input className="csl-input mb-4" placeholder="Question" value={item.q} onChange={e => updateFaq(idx, "q", e.target.value)} maxLength={200} />
                        <textarea className="csl-textarea h-24" placeholder="Answer" value={item.a} onChange={e => updateFaq(idx, "a", e.target.value)} maxLength={500} />
                      </div>
                    ))}
                  </div>
                  {faqs.length < 10 && (
                    <button className="px-6 py-2 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-200 border border-gray-300" onClick={addFaq}>+ Add FAQ</button>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 pb-12 mt-12">
                  <button
                    className="px-10 py-4 text-gray-500 hover:text-black font-black uppercase tracking-widest transition-all"
                    onClick={() => {
                      Swal.fire({
                        title: "Discard changes?",
                        text: "Any unsaved data will be lost.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Discard",
                        cancelButtonText: "Cancel",
                        confirmButtonColor: "#ff4444",
                      }).then(r => r.isConfirmed && navigate("/my-listings"));
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-8 py-3 rounded-2xl border border-gray-300 text-gray-900 font-bold hover:bg-gray-50 transition-all ${savingStatus === "draft" ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={() => handleSaveListing("draft")}
                  >
                    {savingStatus === "draft" ? "Saving..." : "Save as Draft"}
                  </button>
                  <button
                    className="px-10 py-4 bg-[#CEFF1B] text-black rounded-2xl font-black uppercase tracking-widest border-4 border-black shadow-[8px_8px_0px_black] hover:scale-105 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    onClick={() => handleSaveListing("published")}
                  >
                    {savingStatus === "published" ? "Publishing..." : isEditMode ? "Update Listing" : "Save & Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lastAutoSave && (
        <div className="fixed bottom-6 left-8 z-[100] text-[10px] text-gray-500 bg-white shadow-xl px-4 py-2 rounded-full border border-gray-200 pointer-events-none">
          Auto-saved {lastAutoSave.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {isModalOpen &&
        createPortal(
          <div className="user-page light">
            <div className="fixed inset-0 z-[9998] bg-black/40" onClick={() => setUploadStep(null)} />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-4xl pointer-events-auto bg-white rounded-[40px] border border-gray-200 p-8 shadow-2xl">
                <UploadGrid 
                  onSelect={applyCoverFiles} 
                  onBack={() => setUploadStep(null)}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className={`relative w-full ${disabled ? "opacity-40 pointer-events-none" : ""}`} ref={ref}>
      <div 
        className={`w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-all hover:border-black ${open ? "border-black ring-1 ring-black" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className={!value ? "text-gray-400" : "text-gray-900 font-medium"}>{value || placeholder}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
      </div>
      {open && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-2xl overflow-hidden z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`px-5 py-3 text-sm text-gray-700 hover:bg-[#CEFF1B] hover:text-black cursor-pointer transition-colors ${value === opt ? "bg-gray-50" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadGrid({ onSelect, onBack }) {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (files.length + newFiles.length > 9) {
      Swal.fire({ icon: 'error', text: 'Max 9 images allowed' });
      return;
    }
    setFiles([...files, ...newFiles]);
  };

  return (
    <div className="text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Select Cover Images</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-black">✕</button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {files.map((f, i) => (
          <div key={i} className="aspect-square rounded-2xl overflow-hidden relative border border-gray-200">
            <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
            <button className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>×</button>
            {i === 0 && <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#CEFF1B] text-black text-[10px] font-bold rounded border border-black">Primary</span>}
          </div>
        ))}
        {files.length < 9 && (
          <div 
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#CEFF1B] transition-colors bg-gray-50"
            onClick={() => inputRef.current.click()}
          >
            <span className="text-2xl mb-1 text-gray-400">+</span>
            <span className="text-[10px] text-gray-500">Upload Image</span>
          </div>
        )}
      </div>
      
      <input type="file" multiple accept="image/*" className="hidden" ref={inputRef} onChange={handleFile} />
      
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 text-gray-500 font-bold" onClick={onBack}>Cancel</button>
        <button 
          className="px-10 py-3 bg-[#CEFF1B] text-black rounded-xl font-bold border border-black shadow-[4px_4px_0px_black] disabled:opacity-30"
          disabled={files.length === 0}
          onClick={() => onSelect(files)}
        >
          Use {files.length} Images
        </button>
      </div>
    </div>
  );
}
