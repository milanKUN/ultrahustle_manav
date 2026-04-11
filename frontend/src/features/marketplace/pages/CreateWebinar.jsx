import React, { useMemo, useRef, useState } from "react";
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
} from "../api/listingApi";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import { useNavigate, useParams } from "react-router-dom";

const LISTING_TYPE = "webinar";

export default function CreateWebinar({
  theme,
  setTheme,
  mode = "create",
}) {
  const navigate = useNavigate();
  const { username } = useParams();

  const isEditMode = mode === "edit";

  const categories = useMemo(
    () => ["Design", "Development", "Marketing", "Writing", "Education", "Business"],
    [],
  );

  const subCategoriesMap = useMemo(
    () => ({
      Design: ["Logo Design", "UI/UX", "Branding"],
      Development: ["Full Stack", "Frontend", "Backend"],
      Marketing: ["SEO", "Social Media", "Ads"],
      Writing: ["Copywriting", "Blog Writing", "Script Writing"],
      Education: ["Mathematics", "Science", "Languages"],
      Business: ["Entrepreneurship", "Management", "Finance"],
    }),
    [],
  );

  const webinarLevels = useMemo(
    () => ["Beginner", "Intermediate", "Advanced", "Expert"],
    [],
  );

  const languageOptions = ["English", "Hindi", "Spanish", "French", "German"];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [cover, setCover] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [aiPowered, setAiPowered] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    shortDescription: "",
    webinarLevel: "",
  });

  const [toolsInput, setToolsInput] = useState("");
  const [tools, setTools] = useState([]);

  const [learningInput, setLearningInput] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);

  const [languages, setLanguages] = useState([]);

  const [agenda, setAgenda] = useState([{ id: 1, time: "", topic: "", description: "" }]);

  const [schedule, setSchedule] = useState({
    date: "",
    startTime: "",
    duration: "",
    timezone: "Asia/Kolkata",
    link: "",
    ticketPrice: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);
  const [deliverables, setDeliverables] = useState([{ file: null, notes: "" }]);
  const [links, setLinks] = useState([""]);

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
          setSaveError("This listing is not a webinar.");
          return;
        }

        setForm({
          title: item.title || "",
          category: item.category || "",
          subCategory: item.sub_category || "",
          shortDescription: item.short_description || "",
          webinarLevel: item?.details?.webinar_level || "",
        });

        setAiPowered(Boolean(item.ai_powered));
        setTags(Array.isArray(item.tags) ? item.tags : []);
        setTools(Array.isArray(item?.details?.tools) ? item.details.tools : []);
        setLearningPoints(
          Array.isArray(item?.details?.learning_points) ? item.details.learning_points : [],
        );
        setLanguages(
          Array.isArray(item?.details?.languages) ? item.details.languages : [],
        );

        setAgenda(
          Array.isArray(item?.details?.agenda) && item.details.agenda.length
            ? item.details.agenda.map((ag, index) => ({
                id: index + 1,
                time: ag.time || "",
                topic: ag.topic || "",
                description: ag.description || "",
              }))
            : [{ id: 1, time: "", topic: "", description: "" }],
        );

        setSchedule({
          date: item?.details?.schedule_date || "",
          startTime: item?.details?.schedule_start_time || "",
          duration: item?.details?.schedule_duration || "",
          timezone: item?.details?.schedule_timezone || "Asia/Kolkata",
          link: item?.details?.webinar_link || "",
          ticketPrice: item?.details?.ticket_price || "",
        });

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

        if (item.cover_media_url || item.cover_media_path) {
          setCover(item.cover_media_url || item.cover_media_path);
        }
      } catch (e) {
        setSaveError(e?.message || "Failed to load webinar.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadListing();
  }, [isEditMode, username]);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const subCategories = form.category ? subCategoriesMap[form.category] || [] : [];
  const setFormField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

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

  const validateBeforeSave = () => {
    if (!String(form.title || "").trim()) return "Webinar title is required.";
    if (!String(form.category || "").trim()) return "Category is required.";
    if (!String(form.subCategory || "").trim()) return "Sub category is required.";
    if (!String(form.webinarLevel || "").trim()) return "Webinar level is required.";
    if (!String(schedule.date || "").trim()) return "Schedule date is required.";
    if (!String(schedule.startTime || "").trim()) return "Start time is required.";
    return "";
  };

  const buildPayload = (status) => ({
    listing_type: LISTING_TYPE,
    status,
    title: form.title,
    category: form.category,
    sub_category: form.subCategory,
    short_description: form.shortDescription,
    about: form.shortDescription,
    ai_powered: aiPowered,
    seller_mode: "Solo",
    team_name: "",
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
      webinar_level: form.webinarLevel,
      ticket_price: schedule.ticketPrice,
      tools,
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
      setSaveError(validationError);
      setSaveSuccess("");
      return;
    }

    try {
      setIsSubmitting(true);
      setSaveError("");
      setSaveSuccess("");

      if (isEditMode) {
        await updateListing(username, buildPayload(status));
      } else {
        await createListing(buildPayload(status));
      }

      const message = isEditMode
        ? status === "draft"
          ? "Your webinar draft has been updated successfully."
          : "Your webinar has been updated successfully."
        : status === "draft"
          ? "Your webinar draft has been saved successfully."
          : "Your webinar has been created successfully.";

      setSaveSuccess(message);

      setTimeout(() => {
        navigate("/my-listings");
      }, 500);
    } catch (e) {
      setSaveError(e?.message || `Failed to ${isEditMode ? "update" : "save"} webinar.`);
      setSaveSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} isSidebarOpen={sidebarOpen} theme={theme} />
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
      <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} isSidebarOpen={sidebarOpen} theme={theme} />

      <div className={`pt-[85px] flex relative z-10 transition-all duration-300 ${isModalOpen ? "blur-sm pointer-events-none select-none" : ""}`}>
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
                        <input type="checkbox" checked={aiPowered} onChange={(e) => setAiPowered(e.target.checked)} />
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
                          onChange={(val) => setForm((prev) => ({ ...prev, category: val, subCategory: "", webinarLevel: "" }))}
                          options={categories}
                          placeholder="Select category"
                        />
                      </div>

                      <div className="csl-field">
                        <label className="csl-label">Sub category</label>
                        <CustomSelect
                          value={form.subCategory}
                          onChange={(val) => setForm((prev) => ({ ...prev, subCategory: val, webinarLevel: "" }))}
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
                        <label className="csl-label">Webinar level</label>
                        <CustomSelect
                          value={form.webinarLevel}
                          onChange={(val) => setFormField("webinarLevel", val)}
                          options={webinarLevels}
                          placeholder="Select level"
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
                          onChange={(e) => setSchedule((prev) => ({ ...prev, ticketPrice: e.target.value }))}
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
                        onKeyDown={(e) => onEnterAdd(e, () => addSimpleItem(toolsInput, setToolsInput, tools, setTools))}
                      />
                      <p className="csl-hint mt-2">You can add up to 10 tools & technologies</p>

                      {tools.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {tools.map((t, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {t}
                              <button type="button" onClick={() => removeSimpleItem(i, tools, setTools)}>×</button>
                            </div>
                          ))}
                          <button type="button" className="csl-clear-all" onClick={() => setTools([])} title="Clear all">✕</button>
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
                        value={learningInput}
                        onChange={(e) => setLearningInput(e.target.value)}
                        onKeyDown={(e) => onEnterAdd(e, () => addSimpleItem(learningInput, setLearningInput, learningPoints, setLearningPoints))}
                      />
                      <button type="button" className="csl-add-btn-lime-below" onClick={() => addSimpleItem(learningInput, setLearningInput, learningPoints, setLearningPoints)}>
                        + Add
                      </button>

                      {learningPoints.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {learningPoints.map((p, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {p}
                              <button type="button" onClick={() => removeSimpleItem(i, learningPoints, setLearningPoints)}>×</button>
                            </div>
                          ))}
                          <button type="button" className="csl-clear-all" onClick={() => setLearningPoints([])} title="Clear all">✕</button>
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
                          if (!languages.some((x) => x.toLowerCase() === val.toLowerCase())) {
                            setLanguages((prev) => [...prev, val]);
                          }
                        }}
                        options={languageOptions}
                        placeholder="Select language"
                      />

                      {languages.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {languages.map((l, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {l}
                              <button type="button" onClick={() => removeSimpleItem(i, languages, setLanguages)}>×</button>
                            </div>
                          ))}
                          <button type="button" className="csl-clear-all" onClick={() => setLanguages([])} title="Clear all">✕</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Tags</label>
                      <input
                        className="csl-input"
                        placeholder="Type tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />

                      {tags.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {tags.map((t, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {t}
                              <button type="button" onClick={() => removeTag(i)}>×</button>
                            </div>
                          ))}
                          <button type="button" className="csl-clear-all" onClick={() => setTags([])} title="Clear all">✕</button>
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

                <div className="csl-card">
                  <h2 className="csl-section">Agenda</h2>
                  <div className="csl-agenda-stack">
                    {agenda.map((item, idx) => (
                      <div key={item.id} className="csl-agenda-item">
                        <div className="csl-agenda-header">
                          <span className="csl-agenda-num">Agenda item {idx + 1}</span>
                          <button type="button" onClick={() => removeAgendaItem(idx)} className="csl-trash-btn" title="Delete agenda item">
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

                    <button type="button" className="csl-add-btn-lime-below" onClick={addAgendaItem}>
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
                          type="date"
                          className="csl-input"
                          value={schedule.date}
                          onChange={(e) => updateSchedule("date", e.target.value)}
                        />
                      </div>

                      <div className="csl-field">
                        <label className="csl-label">Start time</label>
                        <input
                          type="time"
                          className="csl-input"
                          value={schedule.startTime}
                          onChange={(e) => updateSchedule("startTime", e.target.value)}
                        />
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

                {saveError ? <p className="text-red-600 text-sm">{saveError}</p> : null}
                {saveSuccess ? <p className="text-green-600 text-sm">{saveSuccess}</p> : null}

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
            <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm" onClick={() => setUploadStep(null)} />

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
    <div className={`onboarding-custom-select ${open ? "active" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""}`} ref={ref}>
      <div className="onboarding-selected-option" onClick={() => !disabled && setOpen(!open)}>
        <span className={!value ? "opacity-70" : ""}>{value || placeholder}</span>
        <span className="onboarding-arrow">▼</span>
      </div>

      {open && (
        <ul className="onboarding-options-list dark:bg-[#1E1E1E]">
          {options.map((opt) => (
            <li
              key={opt}
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