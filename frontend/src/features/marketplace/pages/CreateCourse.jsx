import React, { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./CreateCourse.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
// import FAQSection from "../components/FAQSection";
import PreviewVideo from "../components/PreviewVideo";
import CoverSection from "../components/CoverSection";
import DeliverablesSection from "../components/DeliverablesSection";
import LessonSection from "../components/LessonSection";
import {
  createListing,
  getListingByUsername,
  updateListing,
  getListingDropdowns,
  getLanguages,
} from "../api/listingApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const LISTING_TYPE = "course";
const LISTING_TYPE_SLUG = "course";

export default function CreateCourse({
  theme,
  setTheme,
  mode = "create",
}) {
  const navigate = useNavigate();
  const { listingusername } = useParams();
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

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    productType: "",
    price: "",
    shortDescription: "",
    about: "",
  });

  const [toolsInput, setToolsInput] = useState("");
  const [tools, setTools] = useState([]);

  const [includedInput, setIncludedInput] = useState("");
  const [courseIncluded, setCourseIncluded] = useState([]);

  const [learningInput, setLearningInput] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);

  const [languages, setLanguages] = useState([]);
  const [aiPowered, setAiPowered] = useState(false);

  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewVideoFile, setPreviewVideoFile] = useState(null);
  const [existingPreviewVideoUrl, setExistingPreviewVideoUrl] = useState("");

  const [lessons, setLessons] = useState([
    { title: "", description: "", media: null },
    { title: "", description: "", media: null },
    { title: "", description: "", media: null },
  ]);
  const [coverImages, setCoverImages] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [coverSlideIdx, setCoverSlideIdx] = useState(0);
  const [activePreviewImg, setActivePreviewImg] = useState(0);

  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);

  const [resources, setResources] = useState([{ file: null, notes: "" }]);
  const [links, setLinks] = useState([""]);

  useEffect(() => {
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

  useEffect(() => {
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
      const items = Array.isArray(res?.languages) ? res.languages : [];
      setLanguageOptions(items.map((item) => item.value).filter(Boolean));
    } catch (e) {
      setLanguageOptions([]);
    }
  };

  useEffect(() => {
    loadCategories();
    loadLanguages();
  }, []);

  useEffect(() => {
    loadSubCategories(form.category);
  }, [form.category]);

  useEffect(() => {
    loadProductTypes(form.category, form.subCategory);
  }, [form.category, form.subCategory]);

  const addSimpleItem = (input, setInput, list, setList) => {
    const v = String(input || "").trim();
    if (!v) return;
    if (list.some((x) => String(x).toLowerCase() === v.toLowerCase())) {
      setInput("");
      return;
    }
    setList([...list, v]);
    setInput("");
  };

  const removeSimpleItem = (idx, list, setList) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const addLesson = () =>
    setLessons([...lessons, { title: "", description: "", media: null }]);

  const removeLesson = (idx) =>
    setLessons(lessons.filter((_, i) => i !== idx));

  const updateLesson = (idx, key, value) => {
    setLessons(lessons.map((l, i) => (i === idx ? { ...l, [key]: value } : l)));
  };

  const uploadLessonMedia = (idx) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        updateLesson(idx, "media", {
          preview: reader.result,
          existing_url: "",
          existing_path: "",
          file,
          type: file.type?.startsWith("video/") ? "video" : "image",
        });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };


  const applyCoverFiles = (files) => {
    setCoverFiles(files);
    const newUrls = files.map((f) => {
      if (f instanceof File) return URL.createObjectURL(f);
      if (typeof f === "string") return f;
      return null;
    }).filter(Boolean);
    setCoverImages(newUrls);
    setActivePreviewImg(0);
  };

  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);

  const updateFaq = (idx, key, value) => {
    setFaqs(faqs.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeFaq = (idx) => {
    if (faqs.length === 1) return;
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const addResource = () => setResources([...resources, { file: null, notes: "" }]);

  const updateResourceNotes = (idx, notes) =>
    setResources(resources.map((d, i) => (i === idx ? { ...d, notes } : d)));

  const updateResourceFile = (idx, file) =>
    setResources(resources.map((d, i) => (i === idx ? { ...d, file } : d)));

  const removeResource = (idx) =>
    setResources(resources.filter((_, i) => i !== idx));

  const addLink = () => setLinks([...links, ""]);
  const updateLink = (idx, value) => setLinks(links.map((l, i) => (i === idx ? value : l)));
  const removeLink = (idx) => setLinks(links.filter((_, i) => i !== idx));

  useEffect(() => {
    const loadListing = async () => {
      if (!isEditMode || !listingusername) {
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);

        const res = await getListingByUsername(listingusername);
        const item = res?.listing || res?.data?.listing || res?.data || null;

        if (!item) {
          throw new Error("Course listing not found.");
        }

        setForm({
          title: item.title || "",
          category: item.category || "",
          subCategory: item.sub_category || "",
          productType: item?.details?.product_type || item?.product_type || "",
          price:
            item?.price !== undefined && item?.price !== null
              ? String(item.price)
              : item?.details?.price !== undefined && item?.details?.price !== null
                ? String(item.details.price)
                : "",
          shortDescription: item.short_description || "",
          about: item.about || "",
        });

        const existingUrls = [];
        if (item.gallery_json) {
          try {
            const gallery = JSON.parse(item.gallery_json);
            if (Array.isArray(gallery)) {
              gallery.forEach((path) => {
                existingUrls.push(path.startsWith("http") ? path : `/storage/${path}`);
              });
            }
          } catch (e) {
            console.error("Failed to parse gallery_json", e);
          }
        } else if (item.cover_media_url || item.cover_media_path) {
          existingUrls.push(item.cover_media_url || item.cover_media_path);
        }

        setCoverImages(existingUrls);
        setCoverFiles(existingUrls);

        setTools(
          Array.isArray(item?.tools)
            ? item.tools
            : Array.isArray(item?.details?.tools)
              ? item.details.tools
              : []
        );

        setCourseIncluded(
          Array.isArray(item?.details?.included) ? item.details.included : []
        );

        setLearningPoints(
          Array.isArray(item?.details?.learning_points)
            ? item.details.learning_points
            : []
        );

        setLanguages(
          Array.isArray(item?.details?.languages) ? item.details.languages : []
        );

        setAiPowered(Boolean(item?.ai_powered));

        setFaqs(
          Array.isArray(item.faqs) && item.faqs.length
            ? item.faqs.map((faq) => ({
              q: faq.q || faq.question || "",
              a: faq.a || faq.answer || "",
            }))
            : [{ q: "", a: "" }]
        );

        setLinks(
          Array.isArray(item.links) && item.links.length ? item.links : [""]
        );

        if (Array.isArray(item.deliverables) && item.deliverables.length) {
          setResources(
            item.deliverables.map((d) => ({
              file: null,
              notes: d.notes || "",
              existing_file_name: d.file_name || d.name || "",
              existing_file_url: d.file_url || d.url || "",
              name: d.file_name || d.name,
              size: d.file_size || d.size,
            }))
          );
        } else {
          setResources([{ file: null, notes: "" }]);
        }

        setLessons(
          Array.isArray(item?.details?.lessons) && item.details.lessons.length
            ? item.details.lessons.map((lesson) => {
              const mediaUrl = lesson.media_url || lesson.url || "";
              return {
                title: lesson.title || "",
                description: lesson.description || "",
                media: mediaUrl
                  ? {
                    preview: mediaUrl,
                    existing_url: mediaUrl,
                    existing_path: lesson.media_path || lesson.path || "",
                    file: null,
                    type:
                      lesson.media_type ||
                      lesson.type ||
                      (mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image"),
                  }
                  : null,
              };
            })
            : [
              { title: "", description: "", media: null },
              { title: "", description: "", media: null },
              { title: "", description: "", media: null },
            ]
        );

        if (item?.details?.preview_video_url || item?.preview_video_url) {
          const vUrl = item?.details?.preview_video_url || item?.preview_video_url;
          setExistingPreviewVideoUrl(vUrl);
          setPreviewVideo(vUrl);
        } else {
          setExistingPreviewVideoUrl("");
          setPreviewVideo(null);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Load failed",
          text: e?.message || "Failed to load course.",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadListing();
  }, [isEditMode, listingusername]);

  const validateBeforeSave = () => {
    const price = Number(form.price);
    if (isNaN(price)) return "Please enter a valid price in numbers.";
    // if (isNaN(price) || price < 1 || price > 9999) return "Price must be between $1 and $9,999.";
    if (!String(form.shortDescription || "").trim()) return "Short description is required.";
    if (String(form.shortDescription || "").length > 500) return "Short description must be under 500 characters.";
    return "";
  };

  const buildPayload = (status = "published") => {
    return {
      listing_type: LISTING_TYPE,
      status,
      ai_powered: aiPowered,
      title: form.title,
      category: form.category,
      sub_category: form.subCategory,
      short_description: form.shortDescription,
      about: form.about,

      cover_files: coverFiles.filter((f) => f instanceof File),
      existing_cover_urls: coverFiles
        .filter((f) => typeof f === "string")
        .map((url) => url.replace(/.*\/storage\//, "")),

      links: links.map((l) => String(l || "").trim()).filter(Boolean),

      faqs: faqs.filter(
        (f) => String(f.q || "").trim() || String(f.a || "").trim()
      ),

      deliverables: resources.map((d) => ({
        file: d.file || null,
        notes: d.notes || "",
        existing_file_url: d.existing_file_url || "",
      })),

      details: {
        product_type: form.productType,
        price: form.price,
        tools,
        included: courseIncluded,
        learning_points: learningPoints,
        languages,

        preview_video_file: previewVideoFile || null,
        existing_preview_video_url:
          previewVideoFile ? "" : existingPreviewVideoUrl || "",

        lessons: lessons
          .filter(
            (lesson) =>
              String(lesson.title || "").trim() ||
              String(lesson.description || "").trim() ||
              lesson.media?.file ||
              lesson.media?.existing_url ||
              lesson.media?.preview
          )
          .map((lesson) => ({
            title: lesson.title || "",
            description: lesson.description || "",
            media_file: lesson.media?.file || null,
            media_type: lesson.media?.type || null,
            existing_media_path:
              !lesson.media?.file && lesson.media?.existing_path
                ? lesson.media.existing_path.replace(/.*\/storage\//, "")
                : "",
          })),
      },
    };
  };

  const handleSaveListing = async (asDraft = false) => {
    if (!asDraft) {
      const validationError = validateBeforeSave();
      if (validationError) {
        Swal.fire({
          icon: "warning",
          title: "Validation error",
          text: validationError,
          background: "#0b0b0b",
          color: "#ffffff",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const status = asDraft ? "draft" : "published";

      const res = isEditMode
        ? await updateListing(listingusername, buildPayload(status))
        : await createListing(buildPayload(status));

      const titleText = asDraft
        ? isEditMode
          ? "Draft Updated"
          : "Draft Saved"
        : isEditMode
          ? "Course Updated"
          : "Course Created";

      const bodyText =
        res?.message ||
        (asDraft
          ? "Your draft has been saved."
          : isEditMode
            ? "Your course has been updated successfully."
            : "Your course has been created successfully.");

      Swal.fire({
        icon: "success",
        title: titleText,
        text: bodyText,
        confirmButtonText: asDraft ? "OK" : "Go to Listings",
        confirmButtonColor: "#CEFF1B",
        background: "#0b0b0b",
        color: "#ffffff",
      }).then((result) => {
        if (result.isConfirmed && !asDraft) {
          navigate("/my-listings");
        }
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update failed" : "Save failed",
        text: e?.message || `Failed to ${isEditMode ? "update" : "save"} course.`,
        background: "#0b0b0b",
        color: "#ffffff",
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
        <div className="pt-[72px] flex relative z-10">
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
            Loading course...
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
          className={`pt-[72px] flex relative z-10 transition-all duration-300 ${isModalOpen ? "blur-sm pointer-events-none select-none" : ""
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
                          {isEditMode ? "Edit Course Listing" : "Create Course Listing"}
                          {aiPowered && (
                            <span className="csl-ai-pill active" style={{ marginLeft: 12, display: 'inline-flex' }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                              AI Powered
                            </span>
                          )}
                        </h1>
                        <p className="csl-subtitle">
                          {isEditMode ? "Update course details" : "Fill out each section"}
                        </p>
                      </div>
                    </div>

                    {/* AI Powered Toggle */}
                    <div className="csl-group-box" style={{ marginBottom: 8 }}>
                      <label className="csl-label" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <span>AI Powered</span>
                        <div
                          onClick={() => setAiPowered(!aiPowered)}
                          style={{
                            width: 44, height: 24, borderRadius: 12,
                            background: aiPowered ? '#CEFF1B' : '#555',
                            position: 'relative', cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            background: '#fff', position: 'absolute', top: 3,
                            left: aiPowered ? 22 : 4, transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          }} />
                        </div>
                      </label>
                    </div>

                    <h2 className="csl-section m-0">Course Details</h2>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Course title</label>
                        <input
                          className="csl-input"
                          placeholder="Course title"
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
                          <label className="csl-label">Price</label>
                          <input
                            className="csl-input"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) => setFormField("price", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <div className="flex justify-between items-center mb-1">
                          <label className="csl-label mb-0">Short description (Max 200 characters)</label>
                          <span style={{ fontSize: '12px', color: 'var(--csl-muted)' }}>{form.shortDescription.length}/200</span>
                        </div>
                        <textarea
                          className="csl-textarea"
                          placeholder="Briefly describe your course"
                          value={form.shortDescription}
                          maxLength={200}
                          onChange={(e) => setFormField("shortDescription", e.target.value)}
                        />
                      </div>
                    </div>



                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Tools needed (Max 15)</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="Type a tool and press Enter"
                            value={toolsInput}
                            onChange={(e) => setToolsInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (tools.length < 15) {
                                  addSimpleItem(toolsInput, setToolsInput, tools, setTools);
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="csl-add-btn-lime"
                            onClick={() => {
                              if (tools.length < 15) {
                                addSimpleItem(toolsInput, setToolsInput, tools, setTools);
                              }
                            }}
                            disabled={tools.length >= 15}
                          >
                            Add
                          </button>
                        </div>

                        {tools.length > 0 && (
                          <div className="csl-chips-container mt-4">
                            {tools.map((t, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {t}
                                <button
                                  type="button"
                                  onClick={() => removeSimpleItem(i, tools, setTools)}
                                >
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
                        <div className="flex justify-between items-center mb-1">
                          <label className="csl-label mb-0">Prerequisites (Max 500 characters)</label>
                          <span style={{ fontSize: '12px', color: 'var(--csl-muted)' }}>{form.about.length}/500</span>
                        </div>
                        <textarea
                          className="csl-textarea h-40"
                          placeholder="Describe your course in detail..."
                          value={form.about}
                          maxLength={500}
                          onChange={(e) => setFormField("about", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Course included (Max 15)</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="e.g. 12 video lessons (Max 80 chars)"
                            value={includedInput}
                            maxLength={80}
                            onChange={(e) => setIncludedInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (courseIncluded.length < 15) {
                                  addSimpleItem(includedInput, setIncludedInput, courseIncluded, setCourseIncluded);
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="csl-add-btn-lime"
                            onClick={() => {
                              if (courseIncluded.length < 15) {
                                addSimpleItem(includedInput, setIncludedInput, courseIncluded, setCourseIncluded);
                              }
                            }}
                            disabled={courseIncluded.length >= 15}
                          >
                            Add
                          </button>
                        </div>

                        {courseIncluded.length > 0 && (
                          <div className="csl-chips-container mt-4">
                            {courseIncluded.map((item, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {item}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSimpleItem(i, courseIncluded, setCourseIncluded)
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() => setCourseIncluded([])}
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
                        <label className="csl-label">What you will learn (Max 15)</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="Outcome (Max 100 chars)"
                            value={learningInput}
                            maxLength={100}
                            onChange={(e) => setLearningInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (learningPoints.length < 15) {
                                  addSimpleItem(learningInput, setLearningInput, learningPoints, setLearningPoints);
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="csl-add-btn-lime"
                            onClick={() => {
                              if (learningPoints.length < 15) {
                                addSimpleItem(learningInput, setLearningInput, learningPoints, setLearningPoints);
                              }
                            }}
                            disabled={learningPoints.length >= 15}
                          >
                            Add
                          </button>
                        </div>

                        {learningPoints.length > 0 && (
                          <div className="csl-chips-container mt-4">
                            {learningPoints.map((p, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {p}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSimpleItem(i, learningPoints, setLearningPoints)
                                  }
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
                        <label className="csl-label">Cover Images</label>
                        <div className="am-uploader-container">
                          {coverImages.length > 0 ? (
                            <>
                              <div className="am-main-preview">
                                <img
                                  src={coverImages[activePreviewImg]}
                                  className="am-preview-img"
                                  alt=""
                                />
                                {coverImages.length > 1 && (
                                  <>
                                    <button
                                      type="button"
                                      className="am-nav-btn prev"
                                      onClick={() =>
                                        setActivePreviewImg((p) =>
                                          p === 0 ? coverImages.length - 1 : p - 1
                                        )
                                      }
                                    >
                                      ‹
                                    </button>
                                    <button
                                      type="button"
                                      className="am-nav-btn next"
                                      onClick={() =>
                                        setActivePreviewImg((p) =>
                                          p === coverImages.length - 1 ? 0 : p + 1
                                        )
                                      }
                                    >
                                      ›
                                    </button>
                                  </>
                                )}
                                <div className="am-dot-strip">
                                  {coverImages.map((_, i) => (
                                    <span
                                      key={i}
                                      className={`am-dot ${i === activePreviewImg ? "active" : ""
                                        }`}
                                      onClick={() => setActivePreviewImg(i)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="am-thumb-strip">
                                {coverImages.map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    className={`am-thumb ${activePreviewImg === idx ? "active" : ""
                                      }`}
                                    onClick={() => setActivePreviewImg(idx)}
                                    alt=""
                                  />
                                ))}
                              </div>
                              <button
                                type="button"
                                className="am-change-btn"
                                onClick={() => setUploadStep("grid")}
                              >
                                Change Images
                              </button>
                            </>
                          ) : (
                            <div
                              className="am-placeholder"
                              onClick={() => setUploadStep("grid")}
                            >
                              <div className="am-upload-icon">+</div>
                              <div className="am-upload-text">Upload Cover Images</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Languages</label>
                        <CustomSelect
                          value=""
                          onChange={(val) => {
                            if (!val) return;
                            if (languages.some((x) => x.toLowerCase() === val.toLowerCase())) {
                              return;
                            }
                            setLanguages([...languages, val]);
                          }}
                          options={languageOptions}
                          placeholder="Select language"
                          searchable
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



                  <LessonSection
                    lessons={lessons}
                    onAddLesson={addLesson}
                    onRemoveLesson={removeLesson}
                    onUpdateLesson={updateLesson}
                    onUploadMedia={uploadLessonMedia}
                  />

                  <DeliverablesSection
                    deliverables={resources.map(d => ({
                      file: d.file,
                      notes: d.notes,
                      name: d.file?.name || d.existing_file_name || d.name,
                      size: d.file?.size || d.size
                    }))}
                    onAddDeliverable={(file) => setResources([...resources, { file, notes: "" }])}
                    onRemoveDeliverable={removeResource}
                    onUpdateDeliverableNotes={updateResourceNotes}
                    onUpdateDeliverableFile={updateResourceFile}
                    links={links}
                    onAddLink={addLink}
                    onRemoveLink={removeLink}
                    onUpdateLink={updateLink}
                  />

                  <div className="csl-group-box">
                    <PreviewVideo
                      previewImage={previewVideo || undefined}
                      previewType="video"
                      onUpload={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "video/*";
                        input.onchange = (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.type.startsWith("video/")) {
                              Swal.fire("Error", "Please select a video file.", "error");
                              return;
                            }
                            setPreviewVideoFile(file);
                            const url = URL.createObjectURL(file);
                            setPreviewVideo(url);
                          }
                        };
                        input.click();
                      }}
                      onClose={() => {
                        setPreviewVideo(null);
                        setPreviewVideoFile(null);
                        setExistingPreviewVideoUrl("");
                      }}
                    />
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
                            ×
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

                  <div className="faq-actions" style={{ display: 'flex', gap: 12 }}>
                    <button
                      type="button"
                      className="faq-save"
                      style={{ background: 'transparent', border: '1px solid #CEFF1B', color: '#CEFF1B' }}
                      onClick={() => handleSaveListing(true)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save as Draft"}
                    </button>
                    <button
                      type="button"
                      className="faq-save"
                      onClick={() => handleSaveListing(false)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : isEditMode ? "Update & Publish" : "Save & Publish"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {uploadStep &&
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
                  setUploadStep(null);
                }}
                onBack={() => setUploadStep(null)}
                blurred={uploadStep === "success"}
              />
            )}

            {uploadStep === "success" && <UploadSuccess onBack={() => setUploadStep(null)} />}
          </div>,
          document.body
        )}
    </>
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

function CustomSelect({ value, onChange, options, placeholder, disabled = false, searchable = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const filtered = useMemo(() => {
    if (!searchable || !search) return options;
    return options.filter((opt) =>
      String(opt || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, searchable]);

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

      {open && (
        <ul className="onboarding-options-list dark:bg-[#1E1E1E]" style={{ maxHeight: 220, overflowY: 'auto' }}>
          {searchable && (
            <li style={{ position: 'sticky', top: 0, padding: '6px 10px', background: 'inherit', zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '6px 10px', borderRadius: 6,
                  border: '1px solid #444', background: 'transparent',
                  color: 'inherit', fontSize: 13, outline: 'none',
                }}
              />
            </li>
          )}
          {filtered.length > 0 ? filtered.map((opt, index) => (
            <li
              key={`${opt}-${index}`}
              className={value === opt ? "active" : ""}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                setSearch("");
              }}
            >
              {opt}
            </li>
          )) : (
            <li style={{ opacity: 0.5, cursor: 'default' }}>No results</li>
          )}
        </ul>
      )}
    </div>
  );
}

function UploadGrid({ onSelect, onBack, blurred, initialFiles = [] }) {
  const fileRef = useRef(null);
  const [files, setFiles] = useState(initialFiles);
  const activeIndexRef = useRef(null);

  // Get preview URL: handle both File objects and URL strings
  const getPreviewUrl = (item) => {
    if (!item) return null;
    if (item instanceof File) return URL.createObjectURL(item);
    if (typeof item === "string") return item; // existing URL from edit mode
    return null;
  };

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;

    if (activeIndexRef.current !== null && files[activeIndexRef.current]) {
      // Replaced a specific slot
      const next = [...files];
      next[activeIndexRef.current] = newFiles[0];
      setFiles(next.slice(0, 9));
    } else {
      // Adding new files
      const combined = [...files, ...newFiles].slice(0, 9);
      setFiles(combined);
    }
    activeIndexRef.current = null;
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
            const item = files[i];
            const url = getPreviewUrl(item);

            return (
              <div
                key={i}
                className={`am-grid-slot ${item ? "has-file" : ""}`}
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
