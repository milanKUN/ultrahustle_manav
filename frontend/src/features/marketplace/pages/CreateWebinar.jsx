import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CreateWebinar.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import FAQSection from "../components/FAQSection";
import CoverSection from "../components/CoverSection";
import DeliverablesSection from "../components/DeliverablesSection";
import {
  createListing,
  getListingByUsername,
  updateListing,
  getListingDropdowns,
  getLanguages,
} from "../api/listingApi";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const LISTING_TYPE = "webinar";
const LISTING_TYPE_SLUG = "webinar";

export default function CreateWebinar({
  theme,
  setTheme,
  mode = "create",
}) {
  const navigate = useNavigate();
  const { username } = useParams();
  const isEditMode = mode === "edit";

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [coverImages, setCoverImages] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [coverSlideIdx, setCoverSlideIdx] = useState(0);
  const [activePreviewImg, setActivePreviewImg] = useState(0);
  const [existingPreviewVideoUrl, setExistingPreviewVideoUrl] = useState("");

  const [aiPowered, setAiPowered] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    productType: "",
    shortDescription: "",
  });

  const [toolsInput, setToolsInput] = useState("");
  const [tools, setTools] = useState([]);

  const [keyOutcomeInput, setKeyOutcomeInput] = useState("");
  const [keyOutcomes, setKeyOutcomes] = useState([]);

  const [learningInput, setLearningInput] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);

  const [languages, setLanguages] = useState([]);

  const [agenda, setAgenda] = useState([
    { id: 1, time: "", topic: "", description: "" },
  ]);

  const [schedule, setSchedule] = useState({
    date: "",
    startTime: "",
    duration: "",
    timezone: "Asia/Kolkata",
    link: "",
    ticketPrice: "",
  });

  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);
  const [deliverables, setDeliverables] = useState([{ file: null, notes: "" }]);
  const [links, setLinks] = useState([""]);

  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const isTodayDate = (value) => value === getTodayDateString();

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

  const setFormField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadCategories = async () => {
    try {
      setIsMetaLoading(true);
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "categories",
      });
      setCategories(Array.isArray(res?.categories) ? res.categories : []);
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      setProductTypes([]);
    }
  };

  const loadLanguages = async () => {
    try {
      const res = await getLanguages();
      const rows = Array.isArray(res?.languages) ? res.languages : [];
      setLanguageOptions(
        rows
          .map((item) => String(item?.value || "").trim())
          .filter(Boolean)
      );
    } catch (e) {
      setLanguageOptions([]);
    }
  };

  React.useEffect(() => {
    loadCategories();
    loadLanguages();
  }, []);

  React.useEffect(() => {
    loadSubCategories(form.category);
  }, [form.category]);

  React.useEffect(() => {
    loadProductTypes(form.category, form.subCategory);
  }, [form.category, form.subCategory]);

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
          Swal.fire({
            icon: "error",
            title: "Not found",
            text: "Listing not found.",
          });
          return;
        }

        if (item.listing_type !== LISTING_TYPE) {
          Swal.fire({
            icon: "error",
            title: "Invalid listing",
            text: "This listing is not a webinar.",
          });
          return;
        }

        setForm({
          title: item.title || "",
          category: item.category || "",
          subCategory: item.sub_category || "",
          productType: item.product_type || item?.details?.product_type || "",
          shortDescription: item.short_description || "",
        });

        setAiPowered(Boolean(item.ai_powered));
        setTools(Array.isArray(item?.details?.tools) ? item.details.tools : []);
        setKeyOutcomes(
          Array.isArray(item?.details?.key_outcomes) ? item.details.key_outcomes : []
        );
        setLearningPoints(
          Array.isArray(item?.details?.learning_points)
            ? item.details.learning_points
            : Array.isArray(item?.details?.what_you_will_learn)
              ? item.details.what_you_will_learn
              : []
        );
        setLanguages(
          Array.isArray(item?.details?.languages) ? item.details.languages : []
        );

        setAgenda(
          Array.isArray(item?.details?.agenda) && item.details.agenda.length
            ? item.details.agenda.map((ag, index) => ({
                id: index + 1,
                time: ag.time || "",
                topic: ag.topic || "",
                description: ag.description || "",
              }))
            : [{ id: 1, time: "", topic: "", description: "" }]
        );

        setSchedule({
          date: item?.details?.schedule_date || "",
          startTime: item?.details?.schedule_start_time || "",
          duration: item?.details?.schedule_duration || "",
          timezone: item?.details?.schedule_timezone || "Asia/Kolkata",
          link: item?.details?.webinar_link || "",
          ticketPrice:
            item?.details?.ticket_price !== undefined && item?.details?.ticket_price !== null
              ? String(item.details.ticket_price)
              : "",
        });

        setFaqs(
          Array.isArray(item.faqs) && item.faqs.length
            ? item.faqs.map((faq) => ({
                q: faq.q || faq.question || "",
                a: faq.a || faq.answer || "",
              }))
            : [{ q: "", a: "" }]
        );

        setLinks(Array.isArray(item.links) && item.links.length ? item.links : [""]);

        if (Array.isArray(item.deliverables) && item.deliverables.length) {
          setDeliverables(
            item.deliverables.map((d) => ({
              file: null,
              notes: d.notes || "",
              existing_file_name: d.file_name || "",
              existing_file_url: d.file_url || "",
              name: d.file_name,
              size: d.file_size,
            }))
          );
        } else {
          setDeliverables([]);
        }

        if (item.gallery_json) {
          try {
            const gallery = JSON.parse(item.gallery_json);
            if (Array.isArray(gallery)) {
              const urls = gallery.map((path) =>
                path.startsWith("http") ? path : `/storage/${path}`
              );
              setCoverImages(urls);
              setCoverFiles([]);
            }
          } catch (e) {
            console.error("Failed to parse gallery_json", e);
          }
        } else if (item.cover_media_url || item.cover_media_path) {
          const coverUrl = item.cover_media_url || item.cover_media_path;
          setCoverImages([coverUrl]);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Load failed",
          text: e?.message || "Failed to load webinar.",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadListing();
  }, [isEditMode, username]);

  const addSimpleItem = (input, setInput, list, setList) => {
    const value = String(input || "").trim();
    if (!value) return;

    if (list.some((x) => String(x).toLowerCase() === value.toLowerCase())) {
      setInput("");
      return;
    }

    setList([...list, value]);
    setInput("");
  };

  const removeSimpleItem = (idx, list, setList) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const onEnterAdd = (e, fn) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fn();
    }
  };

  const addAgendaItem = () => {
    setAgenda([...agenda, { id: Date.now(), time: "", topic: "", description: "" }]);
  };

  const updateAgendaItem = (idx, key, value) => {
    setAgenda(agenda.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeAgendaItem = (idx) => {
    if (agenda.length === 1) return;
    setAgenda(agenda.filter((_, i) => i !== idx));
  };

  const updateSchedule = (key, value) => {
    setSchedule((prev) => ({ ...prev, [key]: value }));
  };

  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);

  const updateFaq = (idx, key, value) => {
    setFaqs(faqs.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeFaq = (idx) => {
    if (faqs.length === 1) return;
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

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

  const applyCoverFiles = (files) => {
    setCoverFiles(files);
    const newUrls = files.map((f) => URL.createObjectURL(f));
    setCoverImages(newUrls);
    setCoverSlideIdx(0);
    setActivePreviewImg(0);
  };

  const validateBeforeSave = () => {
    if (!String(form.title || "").trim()) return "Webinar title is required.";
    if (!String(form.category || "").trim()) return "Category is required.";
    if (!String(form.subCategory || "").trim()) return "Sub category is required.";
    if (!String(form.productType || "").trim()) return "Product type is required.";
    if (!String(schedule.date || "").trim()) return "Schedule date is required.";
    if (!String(schedule.startTime || "").trim()) return "Start time is required.";

    const today = getTodayDateString();

    if (schedule.date < today) {
      return "Past dates are not allowed for webinar schedule.";
    }

    if (schedule.date === today && schedule.startTime < getCurrentTimeString()) {
      return "Past time can't be selected for today's webinar.";
    }

    return "";
  };

  React.useEffect(() => {
    if (!schedule.date || !schedule.startTime) return;

    if (isTodayDate(schedule.date)) {
      const currentTime = getCurrentTimeString();
      if (schedule.startTime < currentTime) {
        setSchedule((prev) => ({
          ...prev,
          startTime: "",
        }));
      }
    }
  }, [schedule.date]);

  const handleScheduleDateChange = (value) => {
    const today = getTodayDateString();

    setSchedule((prev) => {
      const next = {
        ...prev,
        date: value,
      };

      if (value === today && prev.startTime && prev.startTime < getCurrentTimeString()) {
        next.startTime = "";
      }

      return next;
    });

    setSaveError("");
  };

  const handleScheduleTimeChange = (value) => {
    const today = getTodayDateString();
    const currentTime = getCurrentTimeString();

    if (schedule.date === today && value < currentTime) {
      setSaveError("Past time can't be selected for today's webinar.");
      setSchedule((prev) => ({
        ...prev,
        startTime: "",
      }));
      return;
    }

    setSaveError("");
    setSchedule((prev) => ({
      ...prev,
      startTime: value,
    }));
  };

  const buildPayload = (status) => ({
    listing_type: LISTING_TYPE,
    status,
    title: form.title,
    category: form.category,
    sub_category: form.subCategory,
    product_type: form.productType,
    short_description: form.shortDescription,
    about: form.shortDescription,
    ai_powered: aiPowered,
    seller_mode: "Solo",
    team_name: "",

    cover_files: coverFiles,
    existing_cover_urls: coverImages.filter(url => !url.startsWith('blob:')),

    faqs: faqs.filter((f) => String(f.q || "").trim() || String(f.a || "").trim()),
    links: links.map((l) => String(l || "").trim()).filter(Boolean),

    deliverables: deliverables.map(d => ({
      file: d.file,
      notes: d.notes || "",
      existing_file_url: d.existing_file_url || ""
    })),

    details: {
      product_type: form.productType,
      ticket_price: schedule.ticketPrice,
      tools,
      key_outcomes: keyOutcomes,
      learning_points: learningPoints,
      languages,
      schedule_date: schedule.date,
      schedule_start_time: schedule.startTime,
      schedule_duration: schedule.duration,
      schedule_timezone: schedule.timezone,
      webinar_link: schedule.link,
      agenda: agenda
        .map((item) => ({
          time: item.time,
          topic: item.topic,
          description: item.description,
        }))
        .filter((item) => item.time || item.topic || item.description),
    },
  });

  const handleSaveListing = async (status = "published") => {
    const validationError = validateBeforeSave();
    if (validationError) {
      Swal.fire({
        icon: "warning",
        title: "Validation error",
        text: validationError,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSaveError("");
      setSaveSuccess("");

      const res = isEditMode
        ? await updateListing(username, buildPayload(status))
        : await createListing(buildPayload(status));

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Webinar Updated" : "Webinar Created",
        text:
          res?.message ||
          (isEditMode
            ? "Your webinar has been updated successfully."
            : "Your webinar has been created successfully."),
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/my-listings");
        }
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update failed" : "Save failed",
        text: e?.message || `Failed to ${isEditMode ? "update" : "save"} webinar.`,
      });
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
            Loading webinar...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}>
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
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
            <div className="create-service-container">
              <div className="csl-stack">
                <div className="csl-card">
                  <div className="csl-header">
                    <div>
                      <h1 className="csl-title">
                        {isEditMode ? "Edit Webinar Listing" : "Create Webinar Listing"}
                      </h1>
                      <p className="csl-subtitle">
                        {isEditMode ? "Update each section" : "Fill out each section"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <h2 className="csl-section m-0">Webinar Details</h2>
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

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Webinar title</label>
                      <input
                        className="csl-input"
                        placeholder="Enter webinar title"
                        value={form.title}
                        onChange={(e) => setFormField("title", e.target.value)}
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
                          placeholder={isMetaLoading ? "Loading categories..." : "Select category"}
                        />
                      </div>

                      <div className="csl-field">
                        <label className="csl-label">Sub category</label>
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
                        <label className="csl-label">Product type</label>
                        <CustomSelect
                          value={form.productType}
                          onChange={(val) => setFormField("productType", val)}
                          options={productTypes}
                          placeholder="Select product type"
                          disabled={!form.subCategory}
                        />
                      </div>

                      <div className="csl-field">
                        <label className="csl-label">Ticket price</label>
                        <input
                          className="csl-input"
                          placeholder="Ticket price"
                          type="number"
                          value={schedule.ticketPrice || ""}
                          onChange={(e) =>
                            setSchedule((prev) => ({ ...prev, ticketPrice: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Short description</label>
                      <textarea
                        className="csl-textarea h-28"
                        placeholder="Short description"
                        value={form.shortDescription}
                        onChange={(e) => setFormField("shortDescription", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Tools needed</label>
                      <input
                        className="csl-input"
                        placeholder="Add tool and press Enter"
                        value={toolsInput}
                        onChange={(e) => setToolsInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () =>
                            addSimpleItem(toolsInput, setToolsInput, tools, setTools)
                          )
                        }
                      />
                      <p className="csl-hint mt-2">You can add up to 10 tools & technologies</p>

                      {tools.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {tools.map((t, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {t}
                              <button type="button" onClick={() => removeSimpleItem(i, tools, setTools)}>
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="csl-clear-all"
                            onClick={() => setTools([])}
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
                      <label className="csl-label">Key outcomes</label>
                      <input
                        className="csl-input"
                        placeholder="Add key outcome and press Enter"
                        value={keyOutcomeInput}
                        onChange={(e) => setKeyOutcomeInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () =>
                            addSimpleItem(
                              keyOutcomeInput,
                              setKeyOutcomeInput,
                              keyOutcomes,
                              setKeyOutcomes
                            )
                          )
                        }
                      />
                      <button
                        type="button"
                        className="csl-add-btn-lime-below"
                        onClick={() =>
                          addSimpleItem(
                            keyOutcomeInput,
                            setKeyOutcomeInput,
                            keyOutcomes,
                            setKeyOutcomes
                          )
                        }
                      >
                        + Add
                      </button>

                      {keyOutcomes.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {keyOutcomes.map((item, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {item}
                              <button
                                type="button"
                                onClick={() => removeSimpleItem(i, keyOutcomes, setKeyOutcomes)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="csl-clear-all"
                            onClick={() => setKeyOutcomes([])}
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
                      <label className="csl-label">What you will learn</label>
                      <input
                        className="csl-input"
                        placeholder="Add learning point and press Enter"
                        value={learningInput}
                        onChange={(e) => setLearningInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () =>
                            addSimpleItem(
                              learningInput,
                              setLearningInput,
                              learningPoints,
                              setLearningPoints
                            )
                          )
                        }
                      />
                      <button
                        type="button"
                        className="csl-add-btn-lime-below"
                        onClick={() =>
                          addSimpleItem(
                            learningInput,
                            setLearningInput,
                            learningPoints,
                            setLearningPoints
                          )
                        }
                      >
                        + Add
                      </button>

                      {learningPoints.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {learningPoints.map((p, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {p}
                              <button
                                type="button"
                                onClick={() => removeSimpleItem(i, learningPoints, setLearningPoints)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="csl-clear-all"
                            onClick={() => setLearningPoints([])}
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
                      <label className="csl-label">Languages</label>
                      <CustomSelect
                        value=""
                        onChange={(val) => {
                          if (!val) return;
                          if (languages.some((x) => x.toLowerCase() === val.toLowerCase())) return;
                          setLanguages([...languages, val]);
                        }}
                        options={languageOptions}
                        placeholder="Select language"
                      />

                      {languages.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {languages.map((l, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {l}
                              <button
                                type="button"
                                onClick={() => removeSimpleItem(i, languages, setLanguages)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="csl-clear-all"
                            onClick={() => setLanguages([])}
                            title="Clear all"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="csl-card">
                  <h2 className="csl-section">Agenda</h2>
                  <div className="csl-agenda-stack">
                    {agenda.map((item, idx) => (
                      <div key={item.id} className="csl-agenda-item">
                        <div className="csl-agenda-header">
                          <span className="csl-agenda-num">Agenda item {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeAgendaItem(idx)}
                            className="csl-trash-btn"
                            title="Delete agenda item"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="csl-grid2">
                          <div className="csl-field">
                            <label className="csl-label">Time/Duration</label>
                            <input
                              className="csl-input"
                              placeholder="Time/Duration"
                              value={item.time}
                              onChange={(e) => updateAgendaItem(idx, "time", e.target.value)}
                            />
                          </div>

                          <div className="csl-field">
                            <label className="csl-label">Topic name</label>
                            <input
                              className="csl-input"
                              placeholder="Topic name"
                              value={item.topic}
                              onChange={(e) => updateAgendaItem(idx, "topic", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="csl-field mt-4">
                          <label className="csl-label">Description</label>
                          <textarea
                            className="csl-textarea h-[100px]"
                            placeholder="Agenda description"
                            value={item.description}
                            onChange={(e) => updateAgendaItem(idx, "description", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="csl-add-btn-lime-below"
                      onClick={addAgendaItem}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="csl-card">
                  <h2 className="csl-section">Schedule</h2>
                  <div className="csl-schedule-box">
                    <div className="csl-grid2">
                      <div className="csl-field">
                        <label className="csl-label">Date</label>
                        <input
                          className="csl-input"
                          type="date"
                          value={schedule.date || ""}
                          min={getTodayDateString()}
                          onChange={(e) => handleScheduleDateChange(e.target.value)}
                        />
                      </div>

                      <div className="csl-field">
                        <label className="csl-label">Start time</label>
                        <input
                          className="csl-input"
                          type="time"
                          value={schedule.startTime || ""}
                          min={schedule.date === getTodayDateString() ? getCurrentTimeString() : ""}
                          onChange={(e) => handleScheduleTimeChange(e.target.value)}
                        />
                        {saveError && (
                          <p style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>
                            {saveError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="csl-grid2 mt-4">
                      <div className="csl-field">
                        <label className="csl-label">Duration (minutes)</label>
                        <input
                          type="number"
                          className="csl-input"
                          placeholder="Duration"
                          value={schedule.duration}
                          onChange={(e) => updateSchedule("duration", e.target.value)}
                        />
                      </div>

                      <div className="csl-field">
                        <label className="csl-label">Timezone</label>
                        <input
                          className="csl-input"
                          placeholder="Timezone"
                          value={schedule.timezone}
                          onChange={(e) => updateSchedule("timezone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="csl-field mt-4">
                      <label className="csl-label">Webinar link</label>
                      <input
                        className="csl-input"
                        placeholder="Enter webinar URL"
                        value={schedule.link}
                        onChange={(e) => updateSchedule("link", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {saveSuccess ? <p className="text-green-600 text-sm">{saveSuccess}</p> : null}

                <DeliverablesSection
                  deliverables={deliverables.map(d => ({
                    file: d.file,
                    notes: d.notes,
                    name: d.file?.name || d.existing_file_name || d.name,
                    size: d.file?.size || d.size
                  }))}
                  onAddDeliverable={(file) => setDeliverables([...deliverables, { file, notes: "" }])}
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
                  onSave={() => handleSaveListing("published")}
                  onSaveDraft={() => handleSaveListing("draft")}
                  isSaving={isSubmitting}
                  submitMode={isEditMode ? "edit" : "create"}
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
                initialFiles={coverFiles}
                onSelect={(files) => {
                  if (files?.length) applyCoverFiles(files);
                  setUploadStep("success");
                }}
                onBack={() => setUploadStep(null)}
                blurred={uploadStep === "success"}
              />
            )}

            {uploadStep === "success" && <UploadSuccess onBack={() => setUploadStep(null)} />}
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
