import React, { useMemo, useRef, useState } from "react";
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
const MAX_TAGS = 15;
const MAX_PORTFOLIO_ITEMS = 4;

const EMPTY_PACKAGE = {
  enabled: true,
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
};

const EMPTY_FAQ = { q: "", a: "" };
const EMPTY_ADDON = { name: "", price: "", days: "" };
const EMPTY_PORTFOLIO = {
  image: null,
  title: "",
  description: "",
  cost: "",
  existingMedia: [],
};

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
};

const normalizeDeliveryFormat = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeFaqs = (faqs) => {
  if (!Array.isArray(faqs) || !faqs.length) return [{ ...EMPTY_FAQ }];
  return faqs.map((faq) => ({
    q: faq?.q || faq?.question || "",
    a: faq?.a || faq?.answer || "",
  }));
};

const normalizeAddOns = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    name: item?.name || "",
    price:
      item?.price !== undefined && item?.price !== null
        ? String(item.price)
        : "",
    days:
      item?.days !== undefined && item?.days !== null
        ? String(item.days)
        : "",
  }));
};

const normalizePortfolioItems = (projects) => {
  if (!Array.isArray(projects) || !projects.length) {
    return Array.from({ length: MAX_PORTFOLIO_ITEMS }, () => ({
      ...EMPTY_PORTFOLIO,
    }));
  }

  const loaded = projects.map((p) => ({
    title: p?.title || "",
    description: p?.description || "",
    cost:
      p?.cost !== undefined && p?.cost !== null
        ? String(p.cost)
        : p?.cost_cents !== undefined && p?.cost_cents !== null
          ? String(p.cost_cents)
          : "",
    image: p?.media?.[0]?.url || p?.cover_media_url || null,
    existingMedia: Array.isArray(p?.media) ? p.media : [],
  }));

  while (loaded.length < MAX_PORTFOLIO_ITEMS) {
    loaded.push({ ...EMPTY_PORTFOLIO });
  }

  return loaded.slice(0, MAX_PORTFOLIO_ITEMS);
};

const makeEmptyPackages = () => ({
  Basic: { ...EMPTY_PACKAGE, enabled: true, packageName: "Basic" },
  Standard: { ...EMPTY_PACKAGE, enabled: false, packageName: "Standard" },
  Premium: { ...EMPTY_PACKAGE, enabled: false, packageName: "Premium" },
});

export default function CreateServiceListing({
  theme = "light",
  setTheme,
  mode = "create",
}) {
  const navigate = useNavigate();
  const { listingusername } = useParams();
  const isEditMode = mode === "edit";

  const portfolioFileRefs = useRef(
    Array.from({ length: MAX_PORTFOLIO_ITEMS }, () => React.createRef())
  );
  const coverFileRef = useRef(null);
  const prevDraftRef = useRef("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid";

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(null);
  const [lastAutoSave, setLastAutoSave] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});
  const [listingId, setListingId] = useState(null);
  const [saveError, setSaveError] = useState("");

  const [coverImages, setCoverImages] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
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

  const [pkg, setPkg] = useState(makeEmptyPackages());
  const [includedInput, setIncludedInput] = useState("");
  const [howInput, setHowInput] = useState("");
  const [notInput, setNotInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [deliveryFormatInput, setDeliveryFormatInput] = useState("");

  const [addOn, setAddOn] = useState({ ...EMPTY_ADDON });
  const [addOns, setAddOns] = useState([]);

  const [faqs, setFaqs] = useState([{ ...EMPTY_FAQ }]);

  const [portfolioItems, setPortfolioItems] = useState(
    Array.from({ length: MAX_PORTFOLIO_ITEMS }, () => ({ ...EMPTY_PORTFOLIO }))
  );

  const current = pkg[activeTab];

  React.useEffect(() => {
    const shouldLockScroll = Boolean(isModalOpen);
    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  React.useEffect(() => {
    const fetchMetadata = async () => {
      setIsMetaLoading(true);
      try {
        const catRes = await getListingDropdowns(LISTING_TYPE_SLUG, {
          type: "categories",
        });
        setCategories(Array.isArray(catRes?.categories) ? catRes.categories : []);

        const teamRes = await getMyTeams();
        const rows = Array.isArray(teamRes?.teams)
          ? teamRes.teams
          : Array.isArray(teamRes)
            ? teamRes
            : [];
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
          category: form.category,
        });
        setSubCategories(Array.isArray(res?.sub_categories) ? res.sub_categories : []);
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
          sub_category: form.subCategory,
        });
        setProductTypes(Array.isArray(res?.product_types) ? res.product_types : []);
      } catch (e) {
        console.error("Product types fetch failed", e);
      }
    };

    fetchProductTypes();
  }, [form.category, form.subCategory]);

  React.useEffect(() => {
    if (!isEditMode || !listingusername) {
      setInitialLoading(false);
      return;
    }

    const loadListing = async () => {
      setInitialLoading(true);

      try {
        const res = await getListingByUsername(listingusername);
        const item = res?.listing || res;

        setListingId(item?.id || null);

        setForm({
          title: item?.title || "",
          category: item?.category || "",
          subCategory: item?.sub_category || "",
          productType: item?.details?.product_type || item?.product_type || "",
          shortDescription: item?.short_description || "",
          about: item?.about || "",
        });

        setTags(Array.isArray(item?.tags) ? item.tags : []);
        setAiPowered(Boolean(item?.ai_powered));
        setSellerMode(item?.seller_mode || "Solo");
        setTeamName(item?.team_name || "");

        const newPkg = makeEmptyPackages();
        const loadedPackages = Array.isArray(item?.details?.packages)
          ? item.details.packages
          : [];

        loadedPackages.forEach((p, idx) => {
          const tab = TABS[idx];
          if (!tab) return;

          newPkg[tab] = {
            ...EMPTY_PACKAGE,
            enabled: true,
            packageName: tab,
            price:
              p?.price !== undefined && p?.price !== null ? String(p.price) : "",
            deliveryDays:
              p?.delivery_days !== undefined && p?.delivery_days !== null
                ? String(p.delivery_days)
                : p?.deliveryDays !== undefined && p?.deliveryDays !== null
                  ? String(p.deliveryDays)
                  : "",
            revisions:
              p?.revisions !== undefined && p?.revisions !== null
                ? String(p.revisions)
                : "",
            scope: p?.scope || "",
            included: normalizeStringArray(p?.included),
            howItWorks: normalizeStringArray(p?.how_it_works || p?.howItWorks),
            notIncluded: normalizeStringArray(p?.not_included || p?.notIncluded),
            toolsUsed: normalizeStringArray(p?.tools_used || p?.toolsUsed),
            deliveryFormat: normalizeDeliveryFormat(
              p?.delivery_format || p?.deliveryFormat
            ),
          };
        });

        setPkg(newPkg);
        setAddOns(normalizeAddOns(item?.details?.add_ons));
        setFaqs(normalizeFaqs(item?.faqs));
        setPortfolioItems(normalizePortfolioItems(item?.portfolio_projects));

        if (Array.isArray(item?.gallery) && item.gallery.length) {
          setCoverImages(item.gallery);
        } else if (item?.cover_media_url) {
          setCoverImages([item.cover_media_url]);
        } else {
          setCoverImages([]);
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
  }, [isEditMode, listingusername]);

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
      if (currentList.some((x) => x.toLowerCase() === clean.toLowerCase())) return prev;

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
        [key]: (Array.isArray(prev[activeTab][key]) ? prev[activeTab][key] : []).filter(
          (_, i) => i !== idx
        ),
      },
    }));
  };

  const addTag = () => {
    const clean = String(tagInput || "").trim();
    if (!clean || tags.length >= MAX_TAGS) return;
    if (tags.some((t) => t.toLowerCase() === clean.toLowerCase())) return;

    setTags((prev) => [...prev, clean.substring(0, 30)]);
    setTagInput("");
  };

  const removeTag = (idx) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const addFaq = () => {
    if (faqs.length < 10) setFaqs((prev) => [...prev, { ...EMPTY_FAQ }]);
  };

  const updateFaq = (idx, key, val) => {
    setFaqs((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));
  };

  const removeFaq = (idx) => {
    if (faqs.length === 1) return;
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  };

  const setPortfolioField = (idx, key, value) => {
    setPortfolioItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  };

  const handlePortfolioFileChange = (idx, files) => {
    const file = files?.[0] || null;
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPortfolioItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
            ...item,
            image: file,
            imagePreview: previewUrl,
          }
          : item
      )
    );
  };

  const handleCoverFileChange = (files) => {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;

    const previewUrls = fileList.map((file) => URL.createObjectURL(file));
    setCoverFiles((prev) => [...prev, ...fileList]);
    setCoverImages((prev) => [...prev, ...previewUrls]);
    setCoverSlideIdx(0);
    setUploadStep(null);
  };

  const removeCoverImage = (idx) => {
    setCoverImages((prev) => prev.filter((_, i) => i !== idx));
    setCoverFiles((prev) => {
      const next = [...prev];
      const blobUrl = coverImages[idx];
      if (typeof blobUrl === "string" && blobUrl.startsWith("blob:")) {
        const fileIndex = prev.findIndex((file) => {
          const tempUrl = URL.createObjectURL(file);
          const match = tempUrl === blobUrl;
          URL.revokeObjectURL(tempUrl);
          return match;
        });
        if (fileIndex > -1) next.splice(fileIndex, 1);
      }
      return next;
    });
    setCoverSlideIdx((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const addAddOn = () => {
    const name = String(addOn.name || "").trim();
    if (!name) return;

    setAddOns((prev) => [
      ...prev,
      {
        name,
        price: addOn.price || "",
        days: addOn.days || "",
      },
    ]);
    setAddOn({ ...EMPTY_ADDON });
  };

  const removeAddOn = (idx) => {
    setAddOns((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateBeforeSave = () => {
    const errors = {};

    if (!form.title || form.title.trim().length < 10) errors.title = true;
    if (!form.category) errors.category = true;
    if (!form.subCategory) errors.subCategory = true;
    if (!form.productType) errors.productType = true;
    if (!form.shortDescription || form.shortDescription.trim().length < 30) {
      errors.shortDescription = true;
    }
    if (!form.about || form.about.trim().length < 100) {
      errors.about = true;
    }
    if (tags.length === 0) errors.tags = true;
    if (!coverImages.length) errors.coverImages = true;

    const basic = pkg.Basic;
    if (!basic.price || Number(basic.price) < 1) errors.basicPrice = true;
    if (!basic.deliveryDays || Number(basic.deliveryDays) < 1) errors.basicDelivery = true;
    if (basic.revisions === "" || basic.revisions === null) errors.basicRevisions = true;
    if (!String(basic.scope || "").trim()) errors.basicScope = true;

    if (sellerMode === "Team" && !String(teamName || "").trim()) {
      errors.teamName = true;
    }

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
          package_name: tab,
          price: p.price,
          delivery_days: p.deliveryDays,
          revisions: p.revisions,
          scope: p.scope,
          included: p.included || [],
          how_it_works: p.howItWorks || [],
          not_included: p.notIncluded || [],
          tools_used: p.toolsUsed || [],
          delivery_format: Array.isArray(p.deliveryFormat)
            ? p.deliveryFormat.join(",")
            : "",
        };
      }).filter(Boolean),
      add_ons: addOns
        .map((item) => ({
          name: item.name || "",
          price: item.price || "",
          days: item.days || "",
        }))
        .filter((item) => item.name || item.price || item.days),
    };

    return {
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
      tags,
      details,
      faqs: faqs.filter((f) => String(f.q || "").trim() || String(f.a || "").trim()),
      portfolio_projects: portfolioItems
        .filter(
          (p) =>
            p.image ||
            String(p.title || "").trim() ||
            String(p.description || "").trim() ||
            String(p.cost || "").trim() ||
            (Array.isArray(p.existingMedia) && p.existingMedia.length)
        )
        .map((p, idx) => ({
          title: p.title,
          description: p.description,
          cost: p.cost,
          sort_order: idx,
          files: p.image instanceof File ? [p.image] : [],
          existing_media: p.existingMedia || [],
        })),
      cover_files: coverFiles,
      existing_cover_urls: coverImages.filter(
        (img) => typeof img === "string" && !img.startsWith("blob:")
      ),
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
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    try {
      if (!isAutoSave) setSavingStatus(status);

      const payload = buildPayload(status);
      const res = isEditMode
        ? await updateListing(listingusername, payload)
        : await createListing(payload);

      if (isAutoSave) {
        setLastAutoSave(new Date());
        return;
      }

      Swal.fire({
        icon: "success",
        title: status === "draft" ? "Draft Saved" : isEditMode ? "Service Updated" : "Service Created",
        text:
          status === "draft"
            ? "Your listing has been saved as a draft."
            : res?.message ||
            (isEditMode
              ? "Your service has been updated successfully."
              : "Your service has been created successfully."),
      }).then(() => {
        if (status !== "draft") {
          navigate("/my-listings");
        }
      });
    } catch (e) {
      if (!isAutoSave) {
        Swal.fire({
          icon: "error",
          title: "Save failed",
          text: e?.message || "Failed to save listing.",
        });
      }
    } finally {
      if (!isAutoSave) setSavingStatus(null);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const nextDraft = JSON.stringify(buildPayload("draft"));
      if (prevDraftRef.current && prevDraftRef.current !== nextDraft) {
        handleSaveListing("draft", true);
      }
      prevDraftRef.current = nextDraft;
    }, 30000);

    return () => clearInterval(interval);
  });

  const currentTeamOptions = useMemo(() => {
    return teamOptions.map((item) => item?.team_name || item?.name || "").filter(Boolean);
  }, [teamOptions]);

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
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          activeSetting={activeSetting}
          onSectionChange={setActiveSetting}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="create-service-container">
              <div className="csl-stack">
                <div className="csl-card">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? "Edit Service Listing" : "Create Service Listing"}
                      </h1>
                      <p className="text-gray-500 mt-1">
                        Fill out the details below to showcase your expertise.
                      </p>
                      {lastAutoSave ? (
                        <p className="text-xs text-gray-500 mt-2">
                          Draft auto-saved at {lastAutoSave.toLocaleTimeString()}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">AI Powered?</span>
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

                  <div className="csl-field mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="csl-label !mb-0">
                        Listing Title <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">{form.title.length}/120</span>
                    </div>
                    <input
                      className={`csl-input ${validationErrors.title ? "error-border" : ""}`}
                      placeholder="Start with I will..."
                      value={form.title}
                      maxLength={120}
                      onChange={(e) => setFormField("title", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="csl-field">
                      <label className="csl-label">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className={validationErrors.category ? "error-border rounded-xl" : ""}>
                        <CustomSelect
                          value={form.category}
                          onChange={(val) => {
                            setFormField("category", val);
                            setFormField("subCategory", "");
                            setFormField("productType", "");
                          }}
                          options={categories.map((c) => c?.name || c)}
                          placeholder={isMetaLoading ? "Loading..." : "Select category"}
                        />
                      </div>
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">
                        Sub category <span className="text-red-500">*</span>
                      </label>
                      <div className={validationErrors.subCategory ? "error-border rounded-xl" : ""}>
                        <CustomSelect
                          value={form.subCategory}
                          onChange={(val) => {
                            setFormField("subCategory", val);
                            setFormField("productType", "");
                          }}
                          options={subCategories.map((s) => s?.name || s)}
                          placeholder="Select sub category"
                          disabled={!form.category}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="csl-field">
                      <label className="csl-label">
                        Product type <span className="text-red-500">*</span>
                      </label>
                      <div className={validationErrors.productType ? "error-border rounded-xl" : ""}>
                        <CustomSelect
                          value={form.productType}
                          onChange={(val) => setFormField("productType", val)}
                          options={productTypes.map((pt) => pt?.name || pt)}
                          placeholder={productTypes.length ? "Select type" : "Select subcategory first"}
                          disabled={!form.subCategory}
                        />
                      </div>
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">
                        Tags <span className="text-red-500">*</span>
                      </label>
                      <div className={`csl-tag-box ${validationErrors.tags ? "error-border" : ""}`}>
                        {tags.map((t, idx) => (
                          <span key={idx} className="csl-tag-pill">
                            {t}
                            <button type="button" onClick={() => removeTag(idx)}>
                              ×
                            </button>
                          </span>
                        ))}
                        {tags.length < MAX_TAGS ? (
                          <input
                            type="text"
                            placeholder="Add tags..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                        ) : null}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1">
                        1-15 tags. Press Enter to add.
                      </span>
                    </div>
                  </div>

                  <div className="csl-field mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="csl-label !mb-0">
                        Short Description <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">
                        {form.shortDescription.length}/300
                      </span>
                    </div>
                    <textarea
                      className={`csl-textarea h-24 ${validationErrors.shortDescription ? "error-border" : ""}`}
                      placeholder="Brief summary shown in search results"
                      value={form.shortDescription}
                      maxLength={300}
                      onChange={(e) => setFormField("shortDescription", e.target.value)}
                    />
                  </div>

                  <div className="csl-field mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="csl-label !mb-0">
                        About This Service <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">{form.about.length}/3000</span>
                    </div>
                    <textarea
                      className={`csl-textarea h-48 ${validationErrors.about ? "error-border" : ""}`}
                      placeholder="Full detailed description"
                      value={form.about}
                      maxLength={3000}
                      onChange={(e) => setFormField("about", e.target.value)}
                    />
                  </div>
                </div>

                <div className="csl-card">
                  <div className="flex gap-4 mb-6">
                    {["Solo", "Team"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`flex-1 py-3 rounded-xl border transition-all ${sellerMode === m
                            ? "bg-[#CEFF1B] border-black text-black font-bold"
                            : "border-gray-200 text-gray-500 hover:text-black hover:border-black"
                          }`}
                        onClick={() => setSellerMode(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {sellerMode === "Team" ? (
                    <div className="csl-field mb-2">
                      <label className="csl-label">
                        Select team <span className="text-red-500">*</span>
                      </label>
                      <div className={validationErrors.teamName ? "error-border rounded-xl" : ""}>
                        <CustomSelect
                          value={teamName}
                          onChange={(val) => setTeamName(val)}
                          options={currentTeamOptions}
                          placeholder="Select team"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="csl-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Cover Images</h2>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-[#CEFF1B] text-black font-semibold"
                      onClick={() => setUploadStep("grid")}
                    >
                      Upload Images
                    </button>
                  </div>

                  <div className={validationErrors.coverImages ? "error-border rounded-2xl p-3" : ""}>
                    {coverImages.length ? (
                      <>
                        <div className="relative rounded-2xl overflow-hidden bg-white border">
                          <img
                            src={coverImages[coverSlideIdx]}
                            alt="Cover"
                            className="w-full h-[300px] object-cover"
                          />
                          {coverImages.length > 1 ? (
                            <>
                              <button
                                type="button"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90"
                                onClick={() =>
                                  setCoverSlideIdx((prev) =>
                                    prev === 0 ? coverImages.length - 1 : prev - 1
                                  )
                                }
                              >
                                ‹
                              </button>
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90"
                                onClick={() =>
                                  setCoverSlideIdx((prev) =>
                                    prev === coverImages.length - 1 ? 0 : prev + 1
                                  )
                                }
                              >
                                ›
                              </button>
                            </>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          {coverImages.map((img, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border bg-white">
                              <img src={img} alt={`cover-${idx}`} className="w-full h-28 object-cover" />
                              <button
                                type="button"
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black text-white"
                                onClick={() => removeCoverImage(idx)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="border-2 border-dashed rounded-2xl p-10 text-center text-gray-500">
                        No cover images uploaded yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="csl-card">
                  <div className="flex gap-2 mb-5">
                    {TABS.map((tab, idx) => (
                      <button
                        key={tab}
                        type="button"
                        className={`px-5 py-3 rounded-xl border font-semibold ${activeTab === tab
                            ? "bg-[#CEFF1B] text-black border-black"
                            : "border-gray-200 text-gray-600"
                          }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                    <div className="csl-field">
                      <label className="csl-label">Package name</label>
                      <input className="csl-input bg-gray-100" value={activeTab} readOnly />
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">
                        Price {activeTab === "Basic" ? <span className="text-red-500">*</span> : null}
                      </label>
                      <input
                        className={`csl-input ${activeTab === "Basic" && validationErrors.basicPrice ? "error-border" : ""
                          }`}
                        type="number"
                        min="0"
                        value={current.price}
                        onChange={(e) => setPkgField("price", e.target.value)}
                      />
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">
                        Delivery days {activeTab === "Basic" ? <span className="text-red-500">*</span> : null}
                      </label>
                      <input
                        className={`csl-input ${activeTab === "Basic" && validationErrors.basicDelivery ? "error-border" : ""
                          }`}
                        type="number"
                        min="1"
                        value={current.deliveryDays}
                        onChange={(e) => setPkgField("deliveryDays", e.target.value)}
                      />
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">
                        Revisions {activeTab === "Basic" ? <span className="text-red-500">*</span> : null}
                      </label>
                      <input
                        className={`csl-input ${activeTab === "Basic" && validationErrors.basicRevisions ? "error-border" : ""
                          }`}
                        type="number"
                        min="0"
                        value={current.revisions}
                        onChange={(e) => setPkgField("revisions", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-field mb-5">
                    <label className="csl-label">
                      Scope of work {activeTab === "Basic" ? <span className="text-red-500">*</span> : null}
                    </label>
                    <textarea
                      className={`csl-textarea h-28 ${activeTab === "Basic" && validationErrors.basicScope ? "error-border" : ""
                        }`}
                      value={current.scope}
                      onChange={(e) => setPkgField("scope", e.target.value)}
                    />
                  </div>

                  <TagInputSection
                    label="What's included"
                    inputValue={includedInput}
                    setInputValue={setIncludedInput}
                    values={current.included}
                    onAdd={() => addToList("included", includedInput, setIncludedInput)}
                    onRemove={(idx) => removeFromList("included", idx)}
                  />

                  <TagInputSection
                    label="How it works"
                    inputValue={howInput}
                    setInputValue={setHowInput}
                    values={current.howItWorks}
                    onAdd={() => addToList("howItWorks", howInput, setHowInput)}
                    onRemove={(idx) => removeFromList("howItWorks", idx)}
                  />

                  <TagInputSection
                    label="What's not included"
                    inputValue={notInput}
                    setInputValue={setNotInput}
                    values={current.notIncluded}
                    onAdd={() => addToList("notIncluded", notInput, setNotInput)}
                    onRemove={(idx) => removeFromList("notIncluded", idx)}
                  />

                  <TagInputSection
                    label="Tools used"
                    inputValue={toolsInput}
                    setInputValue={setToolsInput}
                    values={current.toolsUsed}
                    onAdd={() => addToList("toolsUsed", toolsInput, setToolsInput)}
                    onRemove={(idx) => removeFromList("toolsUsed", idx)}
                  />

                  <TagInputSection
                    label="Delivery format"
                    inputValue={deliveryFormatInput}
                    setInputValue={setDeliveryFormatInput}
                    values={current.deliveryFormat}
                    onAdd={() => addToList("deliveryFormat", deliveryFormatInput, setDeliveryFormatInput, 10)}
                    onRemove={(idx) => removeFromList("deliveryFormat", idx)}
                  />
                </div>

                <div className="csl-card">
                  <h2 className="text-xl font-semibold mb-4">Add-ons</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="csl-field">
                      <label className="csl-label">Add-on name</label>
                      <input
                        className="csl-input"
                        value={addOn.name}
                        onChange={(e) => setAddOn((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Add-on name"
                      />
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">Price</label>
                      <input
                        className="csl-input"
                        type="number"
                        min="0"
                        value={addOn.price}
                        onChange={(e) => setAddOn((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="Price"
                      />
                    </div>

                    <div className="csl-field md:col-span-2">
                      <label className="csl-label">Days</label>
                      <input
                        className="csl-input"
                        type="number"
                        min="0"
                        value={addOn.days}
                        onChange={(e) => setAddOn((prev) => ({ ...prev, days: e.target.value }))}
                        placeholder="Days"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-5 py-3 rounded-xl bg-[#CEFF1B] text-black font-bold"
                    onClick={addAddOn}
                  >
                    + Add
                  </button>

                  {addOns.length ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {addOns.map((item, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 rounded-xl bg-white border flex items-center gap-3"
                        >
                          <span>
                            {item.name} | ₹{item.price || 0} | {item.days || 0} day(s)
                          </span>
                          <button type="button" onClick={() => removeAddOn(idx)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="csl-card">
                  <h2 className="text-xl font-semibold mb-4">Portfolio</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioItems.map((item, idx) => (
                      <div key={idx} className="border rounded-2xl p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Project {idx + 1}</h3>
                          <button
                            type="button"
                            className="px-3 py-2 rounded-lg bg-[#CEFF1B] text-black font-semibold"
                            onClick={() => portfolioFileRefs.current[idx]?.current?.click()}
                          >
                            Upload Photo
                          </button>
                          <input
                            ref={portfolioFileRefs.current[idx]}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => handlePortfolioFileChange(idx, e.target.files)}
                          />
                        </div>

                        {(item.imagePreview || item.image) ? (
                          <img
                            src={
                              item.imagePreview ||
                              (typeof item.image === "string" ? item.image : null)
                            }
                            alt={`portfolio-${idx}`}
                            className="w-full h-40 object-cover rounded-xl mb-4"
                          />
                        ) : null}

                        <div className="csl-field mb-3">
                          <label className="csl-label">Project title</label>
                          <input
                            className="csl-input"
                            value={item.title}
                            onChange={(e) => setPortfolioField(idx, "title", e.target.value)}
                          />
                        </div>

                        <div className="csl-field mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <label className="csl-label !mb-0">Description</label>
                            <span className="text-xs text-gray-500">
                              {String(item.description || "").length}/150
                            </span>
                          </div>
                          <textarea
                            className="csl-textarea h-24"
                            maxLength={150}
                            value={item.description}
                            onChange={(e) =>
                              setPortfolioField(idx, "description", e.target.value)
                            }
                          />
                        </div>

                        <div className="csl-field">
                          <label className="csl-label">Project cost</label>
                          <input
                            className="csl-input"
                            type="text"
                            placeholder="$400-$500"
                            value={item.cost}
                            onChange={(e) => setPortfolioField(idx, "cost", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="csl-card">
                  <h2 className="text-xl font-semibold mb-4">FAQs</h2>

                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border rounded-2xl p-4 bg-white">
                        <div className="csl-field mb-3">
                          <label className="csl-label">Question</label>
                          <input
                            className="csl-input"
                            value={faq.q}
                            onChange={(e) => updateFaq(idx, "q", e.target.value)}
                          />
                        </div>

                        <div className="csl-field mb-3">
                          <label className="csl-label">Answer</label>
                          <textarea
                            className="csl-textarea h-24"
                            value={faq.a}
                            onChange={(e) => updateFaq(idx, "a", e.target.value)}
                          />
                        </div>

                        {faqs.length > 1 ? (
                          <button
                            type="button"
                            className="text-red-500 font-medium"
                            onClick={() => removeFaq(idx)}
                          >
                            Remove FAQ
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mt-4 px-4 py-3 rounded-xl border border-black"
                    onClick={addFaq}
                  >
                    + Add FAQ
                  </button>
                </div>

                {saveError ? <p className="text-red-500 text-sm">{saveError}</p> : null}

                <div className="flex flex-wrap gap-3 pb-10">
                  <button
                    type="button"
                    disabled={savingStatus !== null}
                    className={`px-6 py-3 rounded-xl font-bold ${savingStatus !== null
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-black"
                      }`}
                    onClick={() => handleSaveListing("draft")}
                  >
                    {savingStatus === "draft" ? "Saving Draft..." : "Save Draft"}
                  </button>

                  <button
                    type="button"
                    disabled={savingStatus !== null}
                    className={`px-6 py-3 rounded-xl font-bold ${savingStatus !== null
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#CEFF1B] text-black"
                      }`}
                    onClick={() => handleSaveListing("published")}
                  >
                    {savingStatus === "published"
                      ? isEditMode
                        ? "Updating..."
                        : "Publishing..."
                      : isEditMode
                        ? "Update Service"
                        : "Publish Service"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen
        ? createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Upload cover images</h3>
                <button type="button" onClick={() => setUploadStep(null)}>
                  ×
                </button>
              </div>

              <div
                className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer"
                onClick={() => coverFileRef.current?.click()}
              >
                <p className="text-gray-600">
                  Click here to select multiple images or videos
                </p>
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleCoverFileChange(e.target.files)}
                />
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </div>
  );
}

function TagInputSection({
  label,
  inputValue,
  setInputValue,
  values,
  onAdd,
  onRemove,
}) {
  return (
    <div className="mb-5">
      <label className="csl-label">{label}</label>
      <div className="csl-tag-box mb-3">
        {(values || []).map((item, idx) => (
          <span key={idx} className="csl-tag-pill">
            {item}
            <button type="button" onClick={() => onRemove(idx)}>
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          placeholder={`Add ${label.toLowerCase()}...`}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
      </div>

      <button
        type="button"
        className="px-4 py-2 rounded-xl border border-black"
        onClick={onAdd}
      >
        + Add
      </button>
    </div>
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
      className={`onboarding-custom-select ${open ? "active" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      ref={ref}
    >
      <div className="onboarding-selected-option" onClick={() => !disabled && setOpen(!open)}>
        <span className={!value ? "opacity-70" : ""}>{value || placeholder}</span>
        <span className="onboarding-arrow">▼</span>
      </div>

      {open ? (
        <ul className="onboarding-options-list dark:bg-[#1E1E1E]">
          {options.map((opt, idx) => {
            const val = opt?.name || opt;
            return (
              <li
                key={`${val}-${idx}`}
                className={value === val ? "active" : ""}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
              >
                {val}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}