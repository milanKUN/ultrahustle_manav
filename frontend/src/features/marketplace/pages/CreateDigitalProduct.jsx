import React, { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateDigitalProduct.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MyPortfolio from "../../dashboard/components/UserProfile/MyPortfolio";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import {
  createListing,
  updateListing,
  getListingByUsername,
  getListingDropdowns,
} from "../api/listingApi";
import Swal from "sweetalert2";

export default function CreateDigitalProduct({
  mode = "create",
  theme,
  setTheme,
}) {
  const LISTING_TYPE_SLUG = "digital-product";
  const TABS = ["Basic", "Standard", "Premium"];

  const navigate = useNavigate();
  const { username } = useParams();

  const isEditMode = mode === "edit";

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [isLoadingListing, setIsLoadingListing] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);

  const deliveryFormats = useMemo(
    () => ["Google Drive Link", "Figma Link", "ZIP Download", "Notion Page"],
    [],
  );

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

  const [aiPowered, setAiPowered] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    shortDescription: "",
    about: "",
    productType: "",
    price: "",
  });

  const setFormField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const loadCategories = async () => {
    try {
      setIsMetaLoading(true);
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "categories",
      });
      setCategories(Array.isArray(res?.categories) ? res.categories : []);
    } catch (error) {
      console.error("Failed to load categories", error);
      setCategories([]);
    } finally {
      setIsMetaLoading(false);
    }
  };

  const loadSubCategories = async (categoryName) => {
    if (!categoryName) {
      setSubCategories([]);
      return;
    }

    try {
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "sub_categories",
        category: categoryName,
      });
      setSubCategories(Array.isArray(res?.sub_categories) ? res.sub_categories : []);
    } catch (error) {
      console.error("Failed to load sub categories", error);
      setSubCategories([]);
    }
  };

  const loadProductTypes = async (categoryName, subCategoryName) => {
    if (!categoryName || !subCategoryName) {
      setProductTypes([]);
      return;
    }

    try {
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "product_types",
        category: categoryName,
        sub_category: subCategoryName,
      });
      setProductTypes(Array.isArray(res?.product_types) ? res.product_types : []);
    } catch (error) {
      console.error("Failed to load product types", error);
      setProductTypes([]);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  React.useEffect(() => {
    loadSubCategories(form.category);
  }, [form.category]);

  React.useEffect(() => {
    loadProductTypes(form.category, form.subCategory);
  }, [form.category, form.subCategory]);

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

  const [activeTab, setActiveTab] = useState("Basic");
  const [uploadStep, setUploadStep] = useState(null);
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

    if (
      (current.toolsUsed || []).some((t) => t.toLowerCase() === v.toLowerCase())
    ) {
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

  const fileRef = useRef(null);

  const [addOn, setAddOn] = useState({
    name: "",
    price: "",
    days: "",
  });

  const [addOns, setAddOns] = useState([]);
  const [cover, setCover] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  const [mainDeliverables, setMainDeliverables] = useState([]);
  const [notes, setNotes] = useState([""]);
  const [links, setLinks] = useState([""]);

  const handleMainDeliverablesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setMainDeliverables((prev) => [...prev, ...files]);
  };

  const addNoteField = () => setNotes((p) => [...p, ""]);
  const updateNoteField = (idx, value) =>
    setNotes((p) => p.map((item, i) => (i === idx ? value : item)));

  const addLinkField = () => setLinks((p) => [...p, ""]);
  const updateLinkField = (idx, value) =>
    setLinks((p) => p.map((item, i) => (i === idx ? value : item)));

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

    setCoverFile(file);

    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  };

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

  const loadListingForEdit = async () => {
    if (!isEditMode || !username) return;

    try {
      setIsLoadingListing(true);

      const res = await getListingByUsername(username);
      const listing = res?.listing || res?.data || res;

      if (!listing) return;

      setEditingListingId(listing.id || null);

      setForm({
        title: listing.title || "",
        category: listing.category || "",
        subCategory: listing.sub_category || "",
        shortDescription: listing.short_description || "",
        about: listing.about || "",
        productType: listing?.details?.product_type || "",
        price:
          listing?.details?.price !== undefined && listing?.details?.price !== null
            ? String(listing.details.price)
            : "",
      });

      setAiPowered(!!listing.ai_powered);
      setTags(Array.isArray(listing.tags) ? listing.tags : []);

      setFaqs(
        Array.isArray(listing.faqs) && listing.faqs.length
          ? listing.faqs.map((item) => ({
              q: item.q || item.question || "",
              a: item.a || item.answer || "",
            }))
          : [{ q: "", a: "" }],
      );

      setLinks(
        Array.isArray(listing.links) && listing.links.length
          ? listing.links
          : [""],
      );

      setNotes(
        Array.isArray(listing.deliverables) && listing.deliverables.length
          ? listing.deliverables.map((item) => item.notes || "")
          : [""],
      );

      setCover(listing.cover_media_url || null);

      const tools = Array.isArray(listing?.tools)
        ? listing.tools
        : Array.isArray(listing?.details?.tools)
          ? listing.details.tools
          : [];

      const included = Array.isArray(listing?.details?.included)
        ? listing.details.included
        : [];

      const deliveryFormat = listing?.details?.delivery_format || "";

      setPkg((prev) => ({
        ...prev,
        Basic: {
          ...prev.Basic,
          included,
          deliveryFormat,
          toolsUsed: tools,
        },
      }));

      setPortfolioProjects(
        Array.isArray(listing.portfolio_projects) ? listing.portfolio_projects : [],
      );
    } catch (error) {
      console.error("Failed to load listing", error);
      Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error?.message || "Failed to load listing details.",
      });
    } finally {
      setIsLoadingListing(false);
    }
  };

  React.useEffect(() => {
    loadListingForEdit();
  }, [isEditMode, username]);

  const buildPayload = (status = "published") => {
    const activeData = pkg[activeTab] || {};

    const allTools = Array.from(
      new Set(
        [
          ...(pkg.Basic?.toolsUsed || []),
          ...(pkg.Standard?.toolsUsed || []),
          ...(pkg.Premium?.toolsUsed || []),
        ]
          .map((item) => String(item).trim())
          .filter(Boolean),
      ),
    );

    return {
      listing_type: "digital_product",
      status,
      title: form.title.trim(),
      category: form.category || "",
      sub_category: form.subCategory || "",
      short_description: form.shortDescription || "",
      about: form.about || "",
      ai_powered: aiPowered,
      cover_file: coverFile || null,
      tags: tags.filter(Boolean),
      faqs: faqs
        .map((item) => ({
          q: item.q?.trim() || "",
          a: item.a?.trim() || "",
        }))
        .filter((item) => item.q || item.a),
      links: links.map((item) => item.trim()).filter(Boolean),
      deliverables: mainDeliverables.map((file, index) => ({
        file,
        notes: notes[index] || notes[0] || "",
      })),
      details: {
        product_type: form.productType || "",
        price: form.price || "",
        included: (activeData.included || []).filter(Boolean),
        delivery_format: activeData.deliveryFormat || "",
        tools: allTools,
      },
      portfolio_projects: portfolioProjects,
    };
  };

  const handleSubmit = async (status = "published") => {
    if (!form.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title is required",
        text: "Please enter the product title.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const payload = buildPayload(status);

      const res = isEditMode
        ? await updateListing(username, payload)
        : await createListing(payload);

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated" : "Saved",
        text:
          res?.message ||
          (isEditMode
            ? "Listing updated successfully"
            : "Listing saved successfully"),
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/my-listings");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update failed" : "Save failed",
        text: error?.message || "Something went wrong.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}
    >
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div
        className={`pt-[85px] flex relative z-10 transition-all duration-300 ${
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
                        {isEditMode
                          ? "Edit Digital Product Listing"
                          : "Create Digital Products Listing"}
                      </h1>
                      <p className="csl-subtitle">
                        {isEditMode
                          ? "Update your listing details"
                          : "Fill out each section"}
                      </p>
                    </div>

                    <div className="csl-ai">
                      <span
                        className={`csl-ai-pill ${aiPowered ? "active" : ""}`}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
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

                  {isLoadingListing && (
                    <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                      Loading listing details...
                    </div>
                  )}

                  <h2 className="csl-section">Basic Details</h2>

                  <div className="form-group full-width">
                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">
                        Product Title
                      </label>
                      <input
                        className="csl-input"
                        placeholder="eg., Professional Logo Design"
                        value={form.title}
                        onChange={(e) => setFormField("title", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-field mt-2">
                    <label className="csl-label">Product Description</label>
                    <textarea
                      className="csl-textarea"
                      placeholder="Product Description"
                      value={form.shortDescription}
                      onChange={(e) =>
                        setFormField("shortDescription", e.target.value)
                      }
                    />
                  </div>

                  <div className="csl-grid2">
                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">
                        Category
                      </label>
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
                          placeholder={
                            isMetaLoading ? "Loading categories..." : "Select category"
                          }
                        />
                      </div>
                    </div>

                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">
                        Sub Category
                      </label>
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
                          placeholder={
                            !form.category
                              ? "Select category first"
                              : "Select sub category"
                          }
                          disabled={!form.category}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="csl-grid2">
                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">
                        Product Type
                      </label>
                      <div className="csl-selectWrap">
                        <CustomSelect
                          value={form.productType}
                          onChange={(val) => setFormField("productType", val)}
                          options={productTypes}
                          placeholder={
                            !form.subCategory
                              ? "Select sub category first"
                              : "Select product type"
                          }
                          disabled={!form.subCategory}
                        />
                      </div>
                    </div>

                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">Price</label>
                      <input
                        className="csl-input"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setFormField("price", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-field">
                    <label className="csl-label mt-4">
                      Tags (multi-select)
                    </label>

                    <div className="csl-tagsRow">
                      <input
                        className="csl-input csl-tagInput"
                        placeholder="eg., type a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={onTagKeyDown}
                      />

                      <button
                        type="button"
                        className="csl-addBtn"
                        onClick={addTag}
                      >
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
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="sp-field mt-4">
                    <label className="sp-label">Tools used</label>
                    <div className="sp-toolsRow">
                      <input
                        className="sp-input"
                        value={toolsInput}
                        onChange={(e) => setToolsInput(e.target.value)}
                        onKeyDown={(e) => onEnterAdd(e, addTool)}
                        placeholder="eg., Figma, Notion"
                      />
                      <button
                        type="button"
                        className="sp-addBtnRight"
                        onClick={addTool}
                      >
                        + Add
                      </button>
                    </div>
                    <div className="sp-hint">You can add 10 tools</div>

                    {!!current.toolsUsed?.length && (
                      <div
                        className="sp-chipRow"
                        style={{ position: "relative" }}
                      >
                        {current.toolsUsed.map((x, idx) => (
                          <div className="sp-chip" key={`${x}-${idx}`}>
                            {x}
                            <button
                              className="sp-chipX"
                              type="button"
                              onClick={() => removeTool(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="csl-clear-all"
                          onClick={() =>
                            setPkg((p) => ({
                              ...p,
                              [activeTab]: { ...p[activeTab], toolsUsed: [] },
                            }))
                          }
                          title="Clear all"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    <div className="sp-field mt-4">
                      <label className="sp-label">What's included</label>
                      <input
                        className="sp-input"
                        value={includedInput}
                        onChange={(e) => setIncludedInput(e.target.value)}
                        onKeyDown={(e) => onEnterAdd(e, addIncluded)}
                        placeholder="eg., Source file"
                      />
                      <button
                        type="button"
                        className="sp-addMini"
                        onClick={addIncluded}
                      >
                        + <span>Add</span>
                      </button>

                      {!!current.included?.length && (
                        <div
                          className="sp-chipRow"
                          style={{ position: "relative" }}
                        >
                          {current.included.map((x, idx) => (
                            <div className="sp-chip" key={`${x}-${idx}`}>
                              {x}
                              <button
                                className="sp-chipX"
                                type="button"
                                onClick={() => removeFromList("included", idx)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            className="csl-clear-all"
                            onClick={() =>
                              setPkg((p) => ({
                                ...p,
                                [activeTab]: {
                                  ...p[activeTab],
                                  included: [],
                                },
                              }))
                            }
                            title="Clear all"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="sp-field mt-4">
                      <label className="sp-label">Delivery format</label>
                      <div className="sp-selectWrap">
                        <CustomSelect
                          value={current.deliveryFormat}
                          onChange={(val) => setPkgField("deliveryFormat", val)}
                          options={deliveryFormats}
                          placeholder="Select format"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="am-card">
                  <h3 className="am-title" style={{ marginTop: 0 }}>
                    Cover Page
                  </h3>
                  <div className="am-uploadBox">
                    {cover ? (
                      <img src={cover} alt="cover" className="am-preview" />
                    ) : (
                      <div className="am-placeholder">
                        <button
                          className="am-uploadBtn"
                          onClick={() => setUploadStep("grid")}
                        >
                          Upload Photo
                        </button>
                      </div>
                    )}
                    <button
                      className="am-removeImg"
                      onClick={() => {
                        setCover(null);
                        setCoverFile(null);
                      }}
                    >
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

                <div className="csl-portfolio-wrap">
                  <MyPortfolio
                    mode="listing"
                    listingType="digital_product"
                    listingId={isEditMode ? editingListingId : null}
                    onChange={setPortfolioProjects}
                  />
                </div>

                <div className="border !border-[#CEFF1B] rounded-xl p-4 bg-white">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Upload main deliverables
                  </h3>

                  <div className="p-4 mb-4">
                    <label
                      htmlFor="main-deliverables"
                      className="
                        flex flex-col items-center justify-center text-center cursor-pointer py-10 rounded-lg
                        border border-dashed border-gray-300
                        bg-[#EBEBEB]
                        dark:bg-[#FEFEFE40]
                        transition
                        hover:border-[#CEFF1B] hover:bg-gray-50
                        dark:hover:border-transparent dark:hover:bg-[#FEFEFE40]
                      "
                    >
                      <span className="text-blue-600 text-sm font-medium">
                        Click to upload
                        <span className="text-gray-500">
                          {" "}
                          or Drag or drop file
                        </span>
                      </span>

                      <span className="text-xs text-gray-400 mt-2">
                        PDF, JPG, JPEG, PNG less than 10MB
                      </span>
                      <span className="text-xs text-gray-400">
                        Ensure your document are in good condition and readable
                      </span>

                      <input
                        id="main-deliverables"
                        type="file"
                        multiple
                        accept="application/pdf,image/jpeg,image/png"
                        className="hidden"
                        onChange={handleMainDeliverablesChange}
                      />
                    </label>

                    {mainDeliverables.length > 0 && (
                      <ul className="mt-3 text-sm text-gray-600 list-disc list-inside">
                        {mainDeliverables.map((file, idx) => (
                          <li key={`${file.name}-${idx}`}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-slate-800 mb-4 m-4">
                    <div className="px-4 py-2 text-sm font-medium text-black dark:text-gray-200 bg-white dark:bg-slate-700">
                      Add Notes
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-600" />

                    <textarea
                      placeholder="Type here"
                      value={notes[0] || ""}
                      onChange={(e) => updateNoteField(0, e.target.value)}
                      className="
                        w-full px-4 py-3 text-sm
                        bg-white dark:bg-slate-800
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400 dark:placeholder-gray-500
                        resize-none border-none outline-none focus:ring-0
                      "
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end mt-2 m-4">
                    <button
                      type="button"
                      onClick={addLinkField}
                      className="bg-[#CEFF1B] text-black text-sm font-semibold px-3 py-2 rounded-md hover:opacity-90"
                    >
                      + Add more
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-black dark:text-gray-200 mx-4">
                      Link
                    </label>

                    <div className="mt-2 space-y-2 m-4">
                      {links.map((link, idx) => (
                        <input
                          key={idx}
                          placeholder="Paste here"
                          value={link}
                          onChange={(e) => updateLinkField(idx, e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-[#CEFF1B]"
                        />
                      ))}
                    </div>

                    <div className="flex justify-end mt-2 m-4">
                      <button
                        type="button"
                        onClick={addLinkField}
                        className="bg-[#CEFF1B] text-black text-sm font-semibold px-3 py-2 rounded-md hover:opacity-90"
                      >
                        + Add more
                      </button>
                    </div>
                  </div>
                </div>

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
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
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

                      <button
                        type="button"
                        className="faq-add"
                        onClick={addFaq}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>

                <div className="faq-actions">
                  <button
                    type="button"
                    className="faq-draft"
                    onClick={() => handleSubmit("draft")}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save as Draft"}
                  </button>

                  <button
                    type="button"
                    className="faq-save"
                    onClick={() => handleSubmit("published")}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : isEditMode ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
          onClick={() => setUploadStep(null)}
        />
      )}

      {(uploadStep === "grid" || uploadStep === "success") && (
        <UploadGrid
          blurred={uploadStep === "success"}
          onBack={() => setUploadStep(null)}
          onSelect={(files) => {
            if (files && files[0]) {
              setCoverFile(files[0]);
              const reader = new FileReader();
              reader.onload = () => setCover(reader.result);
              reader.readAsDataURL(files[0]);
            }
            setUploadStep("success");
          }}
        />
      )}

      {uploadStep === "success" && (
        <UploadSuccess onBack={() => setUploadStep(null)} />
      )}
    </div>
  );
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}) {
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
    <div
      className={`onboarding-custom-select size-phone ${open ? "active" : ""} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
      ref={ref}
    >
      <div
        className={`onboarding-selected-option ${open ? "open" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen(!open);
        }}
      >
        <span className={!value ? "opacity-70" : ""}>
          {value || placeholder}
        </span>
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
        className={`upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white shadow-[0_0_20px_#CEFF1B] transition-all duration-200${
          blurred
            ? " blur-sm scale-[0.98] pointer-events-none select-none opacity-95"
            : ""
        }`}
      >
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

        <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 custom-scroll">
          {Array.from({ length: visibleSlots }).map((_, i) => {
            const file = files[i];
            return (
              <div
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  openPicker();
                }}
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
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {i !== 0 && (
                      <div className="relative">
                        <img
                          src="/video2.svg"
                          className="w-10 mr-8 mt-2 opacity-60"
                          alt=""
                        />
                        <img
                          src="/video1.svg"
                          className="w-12 absolute -right-2 -top-3 opacity-60"
                          alt=""
                        />
                        <div className="absolute bottom-4 right-5 w-6 h-6 rounded-full bg-[#CEFF1B] flex items-center justify-center">
                          +
                        </div>
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