import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CreateCourse.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import FAQSection from "../components/FAQSection";
import PreviewVideo from "../components/PreviewVideo";
import CoverSection from "../components/CoverSection";
import DeliverablesSection from "../components/DeliverablesSection";
import LessonSection from "../components/LessonSection";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";


export default function CreateCourse({ theme, setTheme }) {
  /* ================== CONSTANTS ================== */
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

  const courseLevels = useMemo(
    () => ["Beginner", "Intermediate", "Advanced", "Expert"],
    [],
  );

  const deliveryFormats = useMemo(
    () => ["Video Lectures", "Live Sessions", "Downloadable PDF", "Quizzes"],
    [],
  );

  const TABS = ["Basic", "Standard", "Premium"];

  // ✅ Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null); // null | "grid" | "success"
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  // ✅ ESC close + body scroll lock when modal open
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

  /* ================== BASIC DETAILS STATE ================== */
  const [aiPowered, setAiPowered] = useState(false);

  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    shortDescription: "",
    prerequisites: "",
    level: "",
  });

  const [toolsInput, setToolsInput] = useState("");
  const [tools, setTools] = useState([]);

  const [learningInput, setLearningInput] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);

  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState([]);

  const [previewVideo, setPreviewVideo] = useState(null);

  /* ================== LESSONS STATE ================== */
  const [lessons, setLessons] = useState([
    { title: "", description: "", media: null },
    { title: "", description: "", media: null },
    { title: "", description: "", media: null },
  ]);

  const addLesson = () => setLessons([...lessons, { title: "", description: "", media: null }]);
  const removeLesson = (idx) => setLessons(lessons.filter((_, i) => i !== idx));
  const updateLesson = (idx, key, value) => {
    setLessons(lessons.map((l, i) => i === idx ? { ...l, [key]: value } : l));
  };
  const uploadLessonMedia = (idx) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => updateLesson(idx, 'media', reader.result);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const languageOptions = ["English", "Hindi", "Spanish", "French", "German"];

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

  /* ================== PACKAGE STATE ================== */
  const [mode, setMode] = useState("Solo");
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

  const [includedInput, setIncludedInput] = useState("");
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

  /* ================== SHARED ADDERS ================== */
  const addItem = (input, setInput, list, setList) => {
    const v = input.trim();
    if (!v) return;
    if (list.some(x => x.toLowerCase() === v.toLowerCase())) {
      setInput("");
      return;
    }
    setList([...list, v]);
    setInput("");
  };

  const removeItem = (idx, list, setList) => {
    setList(list.filter((_, i) => i !== idx));
  };

  /* ================== MEDIA + DELIVERABLES ================== */
  const fileRef = useRef(null);
  const [cover, setCover] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  };

  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);
  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);
  const updateFaq = (idx, key, value) => {
    setFaqs(faqs.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };
  const removeFaq = (idx) => setFaqs(faqs.filter((_, i) => i !== idx));

  const [deliverables, setDeliverables] = useState([{ file: null, notes: "" }]);
  const [links, setLinks] = useState([""]);
  const addDeliverable = () => setDeliverables([...deliverables, { file: null, notes: "" }]);
  const updateDeliverableNotes = (idx, notes) => setDeliverables(deliverables.map((d, i) => i === idx ? { ...d, notes } : d));
  const addLink = () => setLinks([...links, ""]);
  const updateLink = (idx, value) => setLinks(links.map((l, i) => i === idx ? value : l));

  /* ================== RENDER ================== */
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

                {/* PRIMARY FORM CARD */}
                <div className="csl-card">
                  <div className="csl-header">
                    <div>
                      <h1 className="csl-title">Create Course Listing</h1>
                      <p className="csl-subtitle">Fill out each section</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <h2 className="csl-section m-0">Course Details</h2>
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
                      <label className="csl-label">Course title</label>
                      <input
                        className="csl-input"
                        placeholder="eg., Professional Logo Design"
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
                          onChange={(val) => setForm({ ...form, category: val, subCategory: "", level: "" })}
                          options={categories}
                          placeholder="Select category"
                        />
                      </div>
                      <div className="csl-field">
                        <label className="csl-label">Sub category</label>
                        <CustomSelect
                          value={form.subCategory}
                          onChange={(val) => setForm({ ...form, subCategory: val, level: "" })}
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
                          value={form.level}
                          onChange={(val) => setFormField("level", val)}
                          options={courseLevels}
                          placeholder="eg., Digital Service"
                          disabled={!form.subCategory}
                        />
                      </div>
                      <div className="csl-field">
                        <label className="csl-label">Ticket price</label>
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
                    <div className="csl-field">
                      <label className="csl-label">Short description</label>
                      <textarea
                        className="csl-textarea"
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
                        placeholder="Tools needed"
                        value={toolsInput}
                        onChange={(e) => setToolsInput(e.target.value)}
                        onKeyDown={(e) => onEnterAdd(e, () => addItem(toolsInput, setToolsInput, tools, setTools))}
                      />
                      <p className="csl-hint mt-2">You can add 10 more tools & technologies</p>
                      {tools.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {tools.map((t, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {t} <button onClick={() => removeItem(i, tools, setTools)}>×</button>
                            </div>
                          ))}
                          <button type="button" className="csl-clear-all" onClick={() => setTools([])} title="Clear all">✕</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Prerequisites</label>
                      <textarea
                        className="csl-textarea h-28"
                        placeholder="No prior design experience required; basic computer skills recommended."
                        value={form.prerequisites}
                        onChange={(e) => setFormField("prerequisites", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Course includes</label>
                      <input
                        className="csl-input"
                        placeholder="Course includes"
                        value={includedInput}
                        onChange={(e) => setIncludedInput(e.target.value)}
                        onKeyDown={(e) => onEnterAdd(e, () => addItem(includedInput, setIncludedInput, current.included, (val) => setPkgField("included", val)))}
                      />
                      <button type="button" className="csl-add-btn-lime-below" onClick={() => addItem(includedInput, setIncludedInput, current.included, (val) => setPkgField("included", val))}>+ Add</button>
                      {current.included.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {current.included.map((item, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {item} <button onClick={() => removeItem(i, current.included, (val) => setPkgField("included", val))}>×</button>
                            </div>
                          ))}
                          <button type="button" className="csl-clear-all" onClick={() => setPkgField("included", [])} title="Clear all">✕</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">What you will learn</label>
                      <input
                        className="csl-input"
                        placeholder="What you will learn"
                        value={learningInput}
                        onChange={(e) => setLearningInput(e.target.value)}
                        onKeyDown={(e) => onEnterAdd(e, () => addItem(learningInput, setLearningInput, learningPoints, setLearningPoints))}
                      />
                      <button type="button" className="csl-add-btn-lime-below" onClick={() => addItem(learningInput, setLearningInput, learningPoints, setLearningPoints)}>+ Add</button>
                      {learningPoints.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {learningPoints.map((p, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {p} <button onClick={() => removeItem(i, learningPoints, setLearningPoints)}>×</button>
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
                        value={languageInput}
                        onChange={(val) => addItem(val, setLanguageInput, languages, setLanguages)}
                        options={languageOptions}
                        placeholder="Languages"
                      />
                      <p className="csl-hint mt-2">You can add up to 10 Languages</p>
                      {languages.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {languages.map((l, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {l} <button onClick={() => removeItem(i, languages, setLanguages)}>×</button>
                            </div>
                          ))}
                          <button type="button" className="csl-clear-all" onClick={() => setLanguages([])} title="Clear all">✕</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <CoverSection
                  cover={cover}
                  onUploadClick={() => setUploadStep("grid")}
                  onRemoveCover={() => setCover(null)}
                />

                <LessonSection
                  lessons={lessons}
                  onAddLesson={addLesson}
                  onRemoveLesson={removeLesson}
                  onUpdateLesson={updateLesson}
                  onUploadMedia={uploadLessonMedia}
                />

                <DeliverablesSection
                  deliverables={deliverables}
                  onAddDeliverable={addDeliverable}
                  onUpdateDeliverableNotes={updateDeliverableNotes}
                  links={links}
                  onAddLink={addLink}
                  onUpdateLink={updateLink}
                />

                <div className="csl-group-box">
                  <PreviewVideo
                    previewImage={previewVideo || undefined}
                    onUpload={() => {
                      // Simulate video upload or open file picker
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'video/*';
                      input.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setPreviewVideo(url);
                        }
                      };
                      input.click();
                    }}
                    onClose={() => setPreviewVideo(null)}
                  />
                </div>

                

                <FAQSection
                  faqs={faqs}
                  onAddFaq={addFaq}
                  onUpdateFaq={updateFaq}
                  onRemoveFaq={removeFaq}
                  showFooter={true}
                  onSave={() => console.log("Save")}
                  onSaveDraft={() => console.log("Draft")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PORTAL FOR MODALS ================= */}
      {isModalOpen && createPortal(
        <div className={`user-page ${theme || 'light'}`}>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
            onClick={() => setUploadStep(null)}
          />

          {/* UPLOAD GRID */}
          {(uploadStep === "grid" || uploadStep === "success") && (
            <UploadGrid
              blurred={uploadStep === "success"}
              onBack={() => setUploadStep(null)}
              onSelect={(files) => {
                if (files?.[0]) {
                  const r = new FileReader(); r.onload = () => setCover(r.result); r.readAsDataURL(files[0]);
                }
                setUploadStep("success");
              }}
            />
          )}

          {/* SUCCESS MODAL */}
          {uploadStep === "success" && (
            <UploadSuccess
              onBack={() => setUploadStep(null)}
            />
          )}
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
    document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn);
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
            <li key={opt} className={value === opt ? "active" : ""} onClick={() => { onChange(opt); setOpen(false); }}>{opt}</li>
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
        className={`upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white dark:bg-[#1A1A1A] shadow-[0_0_20px_#CEFF1B] transition-all duration-200
        ${blurred ? "blur-sm scale-[0.98] pointer-events-none select-none opacity-95" : ""}`}
      >
        {/* HEADER */}
        <div className="upload-header flex items-center gap-3 mb-3 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 shrink-0"
            title="Back"
          >
            <img src="/backarrow.svg" alt="back" />
          </button>
          <h4 className="text-sm font-medium text-black dark:text-black">Select and upload your file</h4>
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
                      <div className="absolute bottom-4 right-6 w-6 h-6 rounded-full bg-[#CEFF1B] flex items-center justify-center text-black font-bold">+</div>
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
