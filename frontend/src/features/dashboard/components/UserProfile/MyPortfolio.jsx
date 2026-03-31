import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  deletePortfolioProject,
  getMyPortfolio,
  putMyPortfolio,
  uploadProjectMedia,
} from "../../api/portfolioApi";

let nextId = 4; // counter for unique IDs

export default function MyPortfolio() {
  const [projects, setProjects] = useState([
    { id: 1, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
    { id: 2, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
    { id: 3, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
  ]);

  const [mainProject, setMainProject] = useState({
    serverId: null,
    title: "",
    desc: "",
    cost: "",
    coverUrl: "",
  });

  const [uploadStep, setUploadStep] = useState(null); // null | "grid" | "success"
  const [uploadTarget, setUploadTarget] = useState(null); // { type: 'main'|'project', localId?: number, serverId?: number|null }

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { id: nextId++, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
    ]);
  };

  const removeProject = async (id) => {
    setError("");
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    // If it already exists on the backend, delete it there first.
    if (project.serverId) {
      try {
        await deletePortfolioProject(project.serverId);
      } catch (e) {
        setError(e?.message || "Request failed");
        return;
      }
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProject = (id, field, value) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const normalizeServerProjects = (data) => {
    const raw = data?.projects || data?.data?.projects || data?.portfolio?.projects || [];
    if (!Array.isArray(raw)) return [];
    return raw;
  };

  const projectToLocal = (p) => {
    const directCoverUrl =
      p?.cover_media?.url ||
      p?.cover_media?.path ||
      p?.cover_url ||
      p?.coverUrl ||
      "";

    const media = Array.isArray(p?.media) ? p.media : [];
    const coverMediaId = p?.cover_media_id ?? null;
    const coverFromMediaId =
      coverMediaId && media.length
        ? media.find((m) => m?.id === coverMediaId)?.url || media.find((m) => m?.id === coverMediaId)?.path
        : "";
    const firstMediaUrl = media?.[0]?.url || media?.[0]?.path || "";

    const coverUrl = String(directCoverUrl || coverFromMediaId || firstMediaUrl || "");

    const cost =
      (typeof p?.cost_cents === "number" ? String(p.cost_cents) : p?.cost_cents) ??
      p?.cost ??
      p?.project_cost ??
      "";

    return {
      id: nextId++,
      serverId: p?.id ?? null,
      title: p?.title ?? "",
      desc: p?.description ?? p?.desc ?? "",
      cost: cost === null || cost === undefined ? "" : String(cost),
      coverUrl,
      sortOrder: p?.sort_order ?? 0,
    };
  };

  const refreshPortfolio = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await getMyPortfolio();
      const serverProjects = normalizeServerProjects(data);
      const mapped = serverProjects
        .slice()
        .sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
        .map(projectToLocal);

      if (mapped.length > 0) {
        const [first, ...rest] = mapped;
        setMainProject({
          serverId: first.serverId,
          title: first.title,
          desc: first.desc,
          cost: first.cost,
          coverUrl: first.coverUrl,
        });
        setProjects(
          rest.length
            ? rest.map((p) => ({ ...p }))
            : [
                { id: 1, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
                { id: 2, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
                { id: 3, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
              ],
        );
      } else {
        setMainProject({ serverId: null, title: "", desc: "", cost: "", coverUrl: "" });
        setProjects([
          { id: 1, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
          { id: 2, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
          { id: 3, serverId: null, title: "", desc: "", cost: "", coverUrl: "" },
        ]);
      }
    } catch (e) {
      setError(e?.message || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildSavePayload = () => {
    const combined = [{ ...mainProject, _sort: 0 }, ...projects.map((p, idx) => ({ ...p, _sort: idx + 1 }))];

    return {
      projects: combined.map((p) => ({
        ...(p.serverId ? { id: p.serverId } : {}),
        title: p.title,
        description: p.desc,
        // Backend expects `cost_cents` (see GET /api/v1/me/portfolio response)
        cost_cents: p.cost === "" ? null : Number.parseInt(String(p.cost), 10),
        currency: "USD",
        sort_order: p._sort,
      })),
    };
  };

  const handleSaveChanges = async () => {
    setError("");
    try {
      setIsSaving(true);
      await putMyPortfolio(buildSavePayload());
      await refreshPortfolio();
    } catch (e) {
      setError(e?.message || "Request failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    setError("");
    setUploadStep(null);
    await refreshPortfolio();
  };

  const openUploadForMain = () => {
    setError("");
    setUploadTarget({ type: "main", serverId: mainProject?.serverId || null });
    setUploadStep("grid");
  };

  const openUploadForProject = (project) => {
    setError("");
    setUploadTarget({ type: "project", localId: project.id, serverId: project?.serverId || null });
    setUploadStep("grid");
  };

  const handleUploadSelected = async (files) => {
    setError("");
    const serverId = uploadTarget?.serverId;

    if (!serverId) {
      setError("Please save changes before uploading media.");
      return;
    }

    try {
      setIsSaving(true);
      await uploadProjectMedia(serverId, files);
      setUploadStep("success");
      await refreshPortfolio();
    } catch (e) {
      setError(e?.message || "Request failed");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Modal open when grid OR success
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  // ✅ ESC close + body scroll lock when modal open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setUploadStep(null);
    };
    window.addEventListener("keydown", onKey);

    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <>
      {/* ================= PAGE (BLUR BEHIND UPLOAD GRID) ================= */}
      <div
        className={`ml-auto mt-12 pb-20 transition-all duration-300 my-portfolio user-profile-portfolio
        ${isModalOpen ? "blur-sm pointer-events-none select-none" : ""}`}
      >
      
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold whitespace-nowrap">My Portfolio</h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>

        {/* MAIN */}
        <div className="portfolio-card-edit portfolio-surface border-1 border-[#CEFF1B] rounded-2xl p-6 mb-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[417px] bg-gray-200 rounded-xl overflow-hidden">
              {mainProject.coverUrl ? (
                <img
                  src={mainProject.coverUrl}
                  alt=""
                  className="absolute inset-0 m-auto bg-[#CEFF1B] px-4 py-2 rounded"
                />
              ) : null}
              <button
                type="button"
                onClick={openUploadForMain}
                className="absolute inset-0 m-auto bg-[#CEFF1B] px-4 py-2 rounded"
                disabled={isSaving || isLoading}
              >
                Upload Photo
              </button>

              {/* <button
                type="button"
                onClick={() => setUploadStep(null)}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center
                  bg-red-500 text-white rounded-full text-sm shadow-md hover:bg-red-600"
                title="Close"
              >
                ✕
              </button> */}
            </div>

            <div className="space-y-4 form-label">
              <Input
                label="Title"
                value={mainProject.title}
                placeholder="SalonSync - Revolutionary AI-Powered Salon App UI/UX"
                className="form-input"
                onChange={(v) => setMainProject({ ...mainProject, title: v })}
              />
              <Textarea
                label="Description"
                limit={150}
                className="form-textarea"
                placeholder="This project involves designing a next-generation salon mobile application with AI-powered recommendations, seamless booking experience, and elegant user interface."
                value={mainProject.desc}
                onChange={(v) => setMainProject({ ...mainProject, desc: v })}
              />
              <Input
                label="Project cost"
                numericOnly
                value={mainProject.cost}
                placeholder="$600-$800"
                onChange={(v) => setMainProject({ ...mainProject, cost: v })}
              />
            </div>
          </div>
        </div>

        {/* PROJECTS GRID */}
        <div className="portfolio-card-edit portfolio-surface border-1 border-[#CEFF1B] rounded-xl p-6 mb-6 flex flex-col">
          <div className="px-4 pb-4 -mx-4">
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="relative h-[220px] bg-gray-200 rounded-xl">
                    {project.coverUrl ? (
                      <img
                        src={project.coverUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover rounded-xl"
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openUploadForProject(project)}
                      className="absolute inset-0 m-auto bg-[#CEFF1B] px-3 py-1 rounded text-xs"
                      disabled={isSaving || isLoading}
                    >
                      Change Photo
                    </button>

                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full text-sm"
                      title="Remove"
                      disabled={isSaving || isLoading}
                    >
                      ✕
                    </button>
                  </div>

                  <Input
                    label="Title"
                    className="text-md"
                    placeholder="SalonSync - Revolutionary AI-Powered Salon App UI/UX"
                    value={project.title}
                    onChange={(v) => updateProject(project.id, "title", v)}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Type here"
                    limit={150}
                    value={project.desc}
                    onChange={(v) => updateProject(project.id, "desc", v)}
                  />
                  <Input
                    label="Cost"
                    placeholder="$600-$800"
                    small
                    numericOnly
                    value={project.cost}
                    onChange={(v) => updateProject(project.id, "cost", v)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={addProject}
              className="bg-[#CEFF1B] border-[0.6px] border-black px-4 py-2 rounded"
              disabled={isSaving || isLoading}
            >
              Add more
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={isSaving || isLoading}
            className="px-4 py-2 border-[0.6px] border-black rounded"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || isLoading}
            className="bg-[#CEFF1B] border-[0.6px] border-black px-4 py-2 rounded"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* ================= MODALS PORTALED TO BODY ================= */}
      {isModalOpen &&
        createPortal(
          <>
            {/* BACKDROP (BLUR DARK) - behind UploadGrid but above page */}
            <div
              className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
              onClick={() => setUploadStep(null)}
            />

            {/* UPLOAD GRID (visible in both grid and success) */}
            <UploadGrid
              blurred={uploadStep === "success"}
              onBack={() => setUploadStep(null)}
              onSelect={handleUploadSelected}
            />

            {/* SUCCESS MODAL (TOP) */}
            {uploadStep === "success" && <UploadSuccess onBack={() => setUploadStep(null)} />}
          </>,
          document.body
        )}
    </>
  );
}

/* ================= UPLOAD GRID ================= */

function UploadGrid({ onSelect, onBack, blurred }) {
  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [visibleSlots] = useState(9);
  const [activeIndex, setActiveIndex] = useState(null);

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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto">
      <div
        className={`upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white shadow-[0_0_20px_#CEFF1B] transition-all duration-200
        ${blurred ? "blur-sm scale-[0.98] pointer-events-none select-none opacity-95" : ""}`}
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
                onClick={() => {
                  setActiveIndex(i);
                  openPicker();
                }}
                className="upload-slot relative h-[110px] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100"
              >
                {/* ✅ COVER IMAGE BADGE */}
                {i === 0 && (
                  <span className="absolute inset-0 z-10 flex items-center justify-center px-2">
                    <span className="bg-[#CEFF1B] text-black font-medium text-[10px] sm:text-xs px-2 py-[3px] rounded max-w-[90%] text-center whitespace-normal leading-tight">
                      Upload Cover Image
                    </span>
                  </span>
                )}

                {/* ✅ FILE PREVIEW */}
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    {/* ✅ show icons only for NON-cover slots */}
                    {i !== 0 && (
                      <div className="relative">
                        <img src="/video2.svg" className="w-10 mr-8 mt-2 opacity-60" alt="" />
                        <img src="/video1.svg" className="w-12 absolute -right-2 -top-3 opacity-60" alt="" />
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

        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFiles} className="hidden" />
      </div>
    </div>
  );
}

/* ================= SUCCESS (TOP OF GRID) ================= */

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

/* ================= INPUTS ================= */

function Input({ label, placeholder, small, numericOnly, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => {
          let val = e.target.value;
          if (numericOnly) {
            val = val.replace(/[^0-9]/g, "");
          }
          onChange?.(val);
        }}
        className={`${small ? "w-40" : "w-full"} border border-black rounded-md px-3 py-2 bg-transparent text-sm
        outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B] placeholder:text-gray-400`}
      />
    </div>
  );
}

function Textarea({ label, placeholder, limit, value, onChange }) {
  const text = value ?? "";

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={3}
        value={text}
        maxLength={limit}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border border-black rounded-md px-3 py-2 bg-transparent text-sm resize-none
        outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B] placeholder:text-gray-400"
      />
      {limit && (
        <p className="text-xs text-red-500 mt-1">
          {text.length}/{limit} characters
        </p>
      )}
    </div>
  );
}
