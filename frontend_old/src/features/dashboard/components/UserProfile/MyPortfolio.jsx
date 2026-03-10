import { useState, useRef, useEffect } from "react";

let nextId = 4; // counter for unique IDs

export default function MyPortfolio() {
  const [projects, setProjects] = useState([
    { id: 1, title: "", desc: "", cost: "" },
    { id: 2, title: "", desc: "", cost: "" },
    { id: 3, title: "", desc: "", cost: "" },
  ]);

  const [mainProject, setMainProject] = useState({ title: "", desc: "", cost: "" });
  const [uploadStep, setUploadStep] = useState(null); // null | "grid" | "success"

  const addProject = () => {
    setProjects([...projects, { id: nextId++, title: "", desc: "", cost: "" }]);
  };

  const removeProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
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
        className={`ml-auto mt-12 pb-20 transition-all duration-300 my-portfolio
        ${isModalOpen ? "blur-sm pointer-events-none select-none" : ""}`}
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold whitespace-nowrap">My Portfolio</h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>

        {/* MAIN */}
        <div className="portfolio-card-edit border-2 border-[#CEFF1B] bg-white rounded-2xl p-6 mb-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[417px] bg-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setUploadStep("grid")}
                className="absolute inset-0 m-auto bg-[#CEFF1B] px-4 py-2 rounded"
              >
                Upload Photo
              </button>

              <button
                type="button"
                onClick={() => setUploadStep(null)}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center
                  bg-red-500 text-white rounded-full text-sm shadow-md hover:bg-red-600"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <Input label="Title" value={mainProject.title} onChange={(v) => setMainProject({ ...mainProject, title: v })} />
              <Textarea label="Description" limit={150} value={mainProject.desc} onChange={(v) => setMainProject({ ...mainProject, desc: v })} />
              <Input label="Project cost" numericOnly value={mainProject.cost} onChange={(v) => setMainProject({ ...mainProject, cost: v })} />
            </div>
          </div>
        </div>

        {/* PROJECTS GRID */}
        <div className="portfolio-card-edit border-2 border-[#CEFF1B] bg-white rounded-xl p-6 mb-6 flex flex-col">
          <div className="max-h-[520px] overflow-y-auto px-4 pb-4 -mx-4 custom-scroll">
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="relative h-[250px] bg-gray-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUploadStep("grid")}
                      className="absolute inset-0 m-auto bg-[#CEFF1B] px-3 py-1 rounded text-xs"
                    >
                      Change Photo
                    </button>

                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center
                        bg-red-500 text-white rounded-full text-sm"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>

                  <Input label="Title" value={project.title} onChange={(v) => updateProject(project.id, 'title', v)} />
                  <Textarea label="Description" limit={150} value={project.desc} onChange={(v) => updateProject(project.id, 'desc', v)} />
                  <Input label="Cost" small numericOnly value={project.cost} onChange={(v) => updateProject(project.id, 'cost', v)} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={addProject}
              className="bg-[#CEFF1B] border-[0.6px] border-black px-4 py-2 rounded"
            >
              Add more
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 border-[0.6px] border-black rounded"
          >
            Discard
          </button>
          <button
            type="button"
            className="bg-[#CEFF1B] border-[0.6px] border-black px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ================= BACKDROP (BLUR DARK) =================
          ✅ behind UploadGrid but above page
      */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
          onClick={() => setUploadStep(null)}
        />
      )}

      {/* ================= UPLOAD GRID =================
          ✅ grid stays visible in BOTH "grid" and "success"
          ✅ when "success" => grid becomes blurred + disabled
      */}
      {(uploadStep === "grid" || uploadStep === "success") && (
        <UploadGrid
          blurred={uploadStep === "success"}
          onBack={() => setUploadStep(null)}
          onSelect={() => setUploadStep("success")}
        />
      )}

      {/* ================= SUCCESS MODAL (TOP) ================= */}
      {uploadStep === "success" && (
        <UploadSuccess
          onBack={() => setUploadStep(null)}
        />
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
    <div className="fixed inset-0 z-[950] flex items-center justify-center pointer-events-auto">
      <div
        className={`upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white shadow-[0_0_20px_#CEFF1B] transition-all duration-200
        ${blurred
            ? "blur-sm scale-[0.98] pointer-events-none select-none opacity-95"
            : ""
          }`}
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
                  <span
                    className="
      absolute inset-0 z-10
      flex items-center justify-center
      px-2
    "
                  >
                    <span
                      className="
        bg-[#CEFF1B] text-black font-medium
        text-[10px] sm:text-xs
        px-2 py-[3px]
        rounded
        max-w-[90%]
        text-center
        whitespace-normal
        leading-tight
      "
                    >
                      Upload Cover Image
                    </span>
                  </span>
                )}


                {/* ✅ FILE PREVIEW */}
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {/* ✅ show icons only for NON-cover slots */}
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
        className={`${small ? "w-40" : "w-full"
          } border border-black rounded-md px-3 py-2 bg-transparent text-sm
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
