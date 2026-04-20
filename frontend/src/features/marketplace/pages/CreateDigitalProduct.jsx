import React, { useRef, useState } from "react";
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
import DeliverablesSection from "../components/DeliverablesSection";
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

  const [deliveryFormatInput, setDeliveryFormatInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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
      deliveryFormat: [],
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
      deliveryFormat: [],
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
      deliveryFormat: [],
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
  const deliverableFileRef = useRef(null);

  const [addOn, setAddOn] = useState({
    name: "",
    price: "",
    days: "",
  });

  const [addOns, setAddOns] = useState([]);
  const [coverImages, setCoverImages] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [coverSlideIdx, setCoverSlideIdx] = useState(0);
  const [savingStatus, setSavingStatus] = useState(null); // null | "draft" | "published"
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  const [mainDeliverables, setMainDeliverables] = useState([]);
  const [notes, setNotes] = useState([""]);
  const [links, setLinks] = useState([""]);

  const handleMainDeliverablesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setMainDeliverables((prev) => [...prev, ...files]);
    setNotes((prev) => {
      const updated = [...prev];
      while (updated.length < mainDeliverables.length + files.length) updated.push("");
      return updated;
    });
    if (e.target) e.target.value = "";
  };

  const removeDeliverable = (idx) => {
    setMainDeliverables((prev) => prev.filter((_, i) => i !== idx));
    setNotes((prev) => prev.filter((_, i) => i !== idx));
  };

  const addMoreDeliverables = () => deliverableFileRef.current?.click();

  const addNoteField = () => setNotes((p) => [...p, ""]);
  const updateNoteField = (idx, value) =>
    setNotes((p) => p.map((item, i) => (i === idx ? value : item)));

  const addLinkField = () => setLinks((p) => [...p, ""]);
  const updateLinkField = (idx, value) =>
    setLinks((p) => p.map((item, i) => (i === idx ? value : item)));

  // Delivery Format as tag list (per product protocol)
  const addDeliveryFormat = () => {
    const v = deliveryFormatInput.trim();
    if (!v) return;
    const current_df = pkg[activeTab].deliveryFormat || [];
    if (current_df.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setDeliveryFormatInput("");
      return;
    }
    setPkg((p) => ({
      ...p,
      [activeTab]: {
        ...p[activeTab],
        deliveryFormat: [...current_df, v],
      },
    }));
    setDeliveryFormatInput("");
  };

  const removeDeliveryFormat = (idx) => {
    setPkg((p) => ({
      ...p,
      [activeTab]: {
        ...p[activeTab],
        deliveryFormat: (p[activeTab].deliveryFormat || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // Drag-and-drop handlers for main deliverables
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;
    setMainDeliverables((prev) => [...prev, ...files]);
    setNotes((prev) => {
      const updated = [...prev];
      while (updated.length < mainDeliverables.length + files.length) updated.push("");
      return updated;
    });
  };

  const addNewAddOn = () => {
    if (!addOn.name) return;
    setAddOns((p) => [...p, addOn]);
    setAddOn({ name: "", price: "", days: "" });
  };

  const removeAddOn = (idx) => {
    setAddOns((p) => p.filter((_, i) => i !== idx));
  };

  const applyCoverFiles = (files) => {
    if (!files || !files.length) return;
    setCoverFiles(files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
        }),
    );
    Promise.all(readers).then((urls) => {
      setCoverImages(urls);
      setCoverSlideIdx(0);
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    applyCoverFiles(files);
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

      if (Array.isArray(listing.deliverables) && listing.deliverables.length) {
        setMainDeliverables(
          listing.deliverables.map((d) => ({
            file: null,
            notes: d.notes || "",
            existing_file_name: d.file_name || "",
            existing_file_url: d.file_url || "",
            name: d.file_name,
            size: d.file_size,
          }))
        );
        setNotes(listing.deliverables.map((item) => item.notes || ""));
      } else {
        setMainDeliverables([]);
        setNotes([]);
      }

      const gallery = Array.isArray(listing.gallery) ? listing.gallery : [];
      if (gallery.length > 0) {
        setCoverImages(gallery);
        setCoverFiles([]);
        setCoverSlideIdx(0);
      } else if (listing.cover_media_url || listing.cover_media_path) {
        const coverUrl = listing.cover_media_url || listing.cover_media_path;
        setCoverImages([coverUrl]);
        setCoverFiles([]);
        setCoverSlideIdx(0);
      }

      const tools = Array.isArray(listing?.tools)
        ? listing.tools
        : Array.isArray(listing?.details?.tools)
          ? listing.details.tools
          : [];

      const included = Array.isArray(listing?.details?.included)
        ? listing.details.included
        : [];

      const deliveryFormat = listing?.details?.delivery_format
        ? String(listing.details.delivery_format).split(",").map((s) => s.trim()).filter(Boolean)
        : [];

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
        background: "#0b0b0b",
        color: "#ffffff",
        iconColor: "#CEFF1B",
        confirmButtonColor: "#CEFF1B",
        confirmButtonText: "<span style='color:#000;font-weight:700'>OK</span>",
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
      cover_files: coverFiles.length ? coverFiles : null,
      tags: tags.filter(Boolean),
      faqs: faqs
        .map((item) => ({
          q: item.q?.trim() || "",
          a: item.a?.trim() || "",
        }))
        .filter((item) => item.q || item.a),
      links: links.map((item) => item.trim()).filter(Boolean),
      deliverables: mainDeliverables.map((d, index) => ({
        file: d instanceof File ? d : (d.file instanceof File ? d.file : null),
        notes: notes[index] || (typeof d === 'object' ? d.notes : "") || "",
        existing_file_url: d.existing_file_url || d.file_url || ""
      })),
      details: {
        product_type: form.productType || "",
        price: form.price || "",
        included: (activeData.included || []).filter(Boolean),
        delivery_format: (activeData.deliveryFormat || []).join(", "),
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
        background: "#0b0b0b",
        color: "#ffffff",
        iconColor: "#CEFF1B",
        confirmButtonColor: "#CEFF1B",
        confirmButtonText: "<span style='color:#000;font-weight:700'>OK</span>",
      });
      return;
    }

    try {
      setSavingStatus(status);

      const payload = buildPayload(status);

      const res = isEditMode
        ? await updateListing(username, payload)
        : await createListing(payload);

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated!" : "Saved!",
        text:
          res?.message ||
          (isEditMode
            ? "Listing updated successfully"
            : "Listing saved successfully"),
        background: "#0b0b0b",
        color: "#ffffff",
        iconColor: "#CEFF1B",
        confirmButtonColor: "#CEFF1B",
        confirmButtonText: "<span style='color:#000;font-weight:700'>Go to My Listings</span>",
        customClass: {
          popup: "swal-brand-popup",
          title: "swal-brand-title",
          confirmButton: "swal-brand-confirm",
        },
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
        background: "#0b0b0b",
        color: "#ffffff",
        iconColor: "#ff4444",
        confirmButtonColor: "#CEFF1B",
        confirmButtonText: "<span style='color:#000;font-weight:700'>Try Again</span>",
      });
    } finally {
      setSavingStatus(null);
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
                      <div className="sp-toolsRow">
                        <input
                          className="sp-input"
                          value={includedInput}
                          onChange={(e) => setIncludedInput(e.target.value)}
                          onKeyDown={(e) => onEnterAdd(e, addIncluded)}
                          placeholder="eg., Source file, Commercial License"
                        />
                        <button
                          type="button"
                          className="sp-addBtnRight"
                          onClick={addIncluded}
                        >
                          + Add
                        </button>
                      </div>

                      {!!current.included?.length && (
                        <ul className="included-bullet-list">
                          {current.included.map((x, idx) => (
                            <li key={`${x}-${idx}`} className="included-bullet-item">
                              <span className="included-bullet-dot">•</span>
                              <span className="included-bullet-text">{x}</span>
                              <button
                                type="button"
                                className="included-bullet-del"
                                onClick={() => removeFromList("included", idx)}
                                aria-label="Remove"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="sp-field mt-4">
                      <label className="sp-label">Delivery format</label>
                      <div className="sp-toolsRow">
                        <input
                          className="sp-input"
                          value={deliveryFormatInput}
                          onChange={(e) => setDeliveryFormatInput(e.target.value)}
                          onKeyDown={(e) => onEnterAdd(e, addDeliveryFormat)}
                          placeholder="eg., PDF, Figma, ZIP Download"
                        />
                        <button
                          type="button"
                          className="sp-addBtnRight"
                          onClick={addDeliveryFormat}
                        >
                          + Add
                        </button>
                      </div>
                      <div className="sp-hint">Tag the format buyers will receive</div>

                      {!!(current.deliveryFormat || []).length && (
                        <div className="sp-chipRow" style={{ position: "relative" }}>
                          {(current.deliveryFormat || []).map((x, idx) => (
                            <div className="sp-chip" key={`${x}-${idx}`}>
                              {x}
                              <button
                                className="sp-chipX"
                                type="button"
                                onClick={() => removeDeliveryFormat(idx)}
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
                                [activeTab]: { ...p[activeTab], deliveryFormat: [] },
                              }))
                            }
                            title="Clear all"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="am-card">
                  <h3 className="am-title" style={{ marginTop: 0 }}>
                    Cover Pages
                  </h3>
                  <p className="csl-label" style={{marginBottom:'8px',opacity:.7}}>Upload up to 9 images — first image is the primary cover.</p>
                  <div className="am-uploadBox">
                    {coverImages.length > 0 ? (
                      <>
                        {/* Slider Preview */}
                        <div className="am-cover-slider" style={{position:'relative',width:'100%'}}>
                          <img
                            src={coverImages[coverSlideIdx]}
                            alt={`cover ${coverSlideIdx + 1}`}
                            className="am-preview"
                            style={{display:'block'}}
                          />
                          {coverImages.length > 1 && (
                            <>
                              <button
                                type="button"
                                className="am-slide-btn left"
                                onClick={() => setCoverSlideIdx((p) => (p - 1 + coverImages.length) % coverImages.length)}
                              >&#8249;</button>
                              <button
                                type="button"
                                className="am-slide-btn right"
                                onClick={() => setCoverSlideIdx((p) => (p + 1) % coverImages.length)}
                              >&#8250;</button>
                              <div className="am-slide-dots">
                                {coverImages.map((_, i) => (
                                  <span
                                    key={i}
                                    className={`am-dot ${i === coverSlideIdx ? 'active' : ''}`}
                                    onClick={() => setCoverSlideIdx(i)}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                          <div className="am-slide-count">{coverSlideIdx + 1} / {coverImages.length}</div>
                        </div>
                        {/* Thumbnail strip */}
                        {coverImages.length > 1 && (
                          <div className="am-thumb-strip">
                            {coverImages.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`thumb ${i + 1}`}
                                className={`am-thumb ${i === coverSlideIdx ? 'active' : ''}`}
                                onClick={() => setCoverSlideIdx(i)}
                              />
                            ))}
                          </div>
                        )}
                        <button
                          type="button"
                          className="am-changeBtn"
                          onClick={() => setUploadStep("grid")}
                          title="Change cover images"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Change
                        </button>
                      </>
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

                <DeliverablesSection
                  deliverables={mainDeliverables.map((d, idx) => ({
                    file: d instanceof File ? d : (d.file instanceof File ? d.file : null),
                    name: d.file_name || d.name,
                    size: d.file_size || d.size,
                    notes: notes[idx] || (typeof d === 'object' ? d.notes : "") || "",
                  }))}
                  onAddDeliverable={(file) => {
                    setMainDeliverables((p) => [...p, file]);
                    setNotes((p) => [...p, ""]);
                  }}
                  onRemoveDeliverable={(idx) => {
                    setMainDeliverables((p) => p.filter((_, i) => i !== idx));
                    setNotes((p) => p.filter((_, i) => i !== idx));
                  }}
                  onUpdateDeliverableNotes={(idx, val) => {
                    setNotes((p) => p.map((n, i) => (i === idx ? val : n)));
                  }}
                  onUpdateDeliverableFile={(idx, file) => {
                    setMainDeliverables((p) => p.map((f, i) => (i === idx ? file : f)));
                  }}
                  links={links}
                  onAddLink={() => setLinks((p) => [...p, ""])}
                  onRemoveLink={(idx) => setLinks((p) => p.filter((_, i) => i !== idx))}
                  onUpdateLink={(idx, val) => setLinks((p) => p.map((l, i) => (i === idx ? val : l)))}
                />

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
                    className={`faq-draft${savingStatus === "draft" ? " saving" : ""}`}
                    onClick={() => handleSubmit("draft")}
                    disabled={savingStatus !== null}
                  >
                    {savingStatus === "draft" ? (
                      <span className="saving-indicator">
                        <span className="saving-dot" />
                        Saving...
                      </span>
                    ) : (
                      "Save as Draft"
                    )}
                  </button>

                  <button
                    type="button"
                    className={`faq-save${savingStatus === "published" ? " saving" : ""}`}
                    onClick={() => handleSubmit("published")}
                    disabled={savingStatus !== null}
                  >
                    {savingStatus === "published" ? (
                      <span className="saving-indicator">
                        <span className="saving-dot" />
                        Saving...
                      </span>
                    ) : (
                      isEditMode ? "Update" : "Save"
                    )}
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
          initialFiles={coverFiles}
          onSelect={(files) => {
            const validFiles = files.filter(Boolean);
            if (!validFiles.length) return;
            setCoverFiles(validFiles);
            const urls = validFiles.map(file => URL.createObjectURL(file));
            setCoverImages(urls);
            setCoverSlideIdx(0);
            setUploadStep("success");
          }}
          onBack={() => setUploadStep(null)}
          blurred={uploadStep === "success"}
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

function UploadGrid({ onSelect, onBack, blurred, initialFiles = [] }) {
  const fileRef = useRef(null);
  const [files, setFiles] = useState(initialFiles);
  const activeIndexRef = useRef(null);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;

    if (activeIndexRef.current !== null) {
      const next = [...files];
      next[activeIndexRef.current] = newFiles[0];
      setFiles(next);
      activeIndexRef.current = null;
    } else {
      const combined = [...files, ...newFiles].slice(0, 9);
      setFiles(combined);
    }
    e.target.value = "";
  };

  const removeFile = (idx, e) => {
    e.stopPropagation();
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <div className={`am-modal-overlay ${blurred ? "blurred" : ""}`}>
      <div className="am-modal-content">
        <div className="am-modal-header">
          <button className="am-back-btn" onClick={onBack}>
            ← Back
          </button>
          <h2 className="am-modal-title">Upload Cover Photo</h2>
          <button
            className="am-done-btn"
            onClick={() => onSelect(files)}
            disabled={!files.length}
          >
            Done
          </button>
        </div>

        <div className="am-upload-grid">
          {[...Array(9)].map((_, i) => {
            const file = files[i];
            const url = file ? URL.createObjectURL(file) : null;

            return (
              <div
                key={i}
                className={`am-grid-slot ${file ? "has-file" : ""}`}
                onClick={() => {
                  activeIndexRef.current = i;
                  fileRef.current?.click();
                }}
              >
                {url ? (
                  <>
                    <img src={url} alt="" className="am-slot-img" />
                    <button
                      className="am-remove-slot"
                      onClick={(e) => removeFile(i, e)}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="am-slot-add">+</div>
                )}
              </div>
            );
          })}
        </div>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFiles}
        />
        <p className="am-modal-hint">
          Upload up to 9 images. The first image will be your main cover.
        </p>
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