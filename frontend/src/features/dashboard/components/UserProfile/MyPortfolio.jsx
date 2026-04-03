import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

import {
    deletePortfolioProject,
    getMyPortfolio,
    syncMyPortfolio,
} from "../../api/portfolioApi";

const DEFAULT_CHILD_COUNT = 3;
const GRID_UPLOAD_SLOTS = 9;

let nextLocalId = 1000;
const makeLocalId = () => nextLocalId++;

const emptyProject = (localId = null) => ({
    id: localId ?? makeLocalId(),
    serverId: null,
    title: "",
    desc: "",
    cost: "",
    coverUrl: "",
    files: [],
    existingMedia: [],
});

const normalizeMedia = (media = []) =>
    Array.isArray(media)
        ? media
              .map((m, index) => ({
                  id: m?.id ?? `existing-${index}`,
                  url: m?.url || (m?.path ? toPublicUrl(m.path) : ""),
                  type: m?.type || "image",
                  path: m?.path || "",
              }))
              .filter((m) => m.url)
        : [];

const toPublicUrl = (path = "") => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/storage/")) return path;
    if (path.startsWith("storage/")) return `/${path}`;
    return `/storage/${path}`;
};

const firstValidMediaUrl = (project) => {
    if (project?.cover_media?.url) return project.cover_media.url;
    if (project?.cover_media?.path)
        return toPublicUrl(project.cover_media.path);

    const media = Array.isArray(project?.media) ? project.media : [];
    const first = media.find((m) => m?.url || m?.path);

    if (first?.url) return first.url;
    if (first?.path) return toPublicUrl(first.path);

    return "";
};

const projectFromServer = (p, forcedLocalId = null) => {
    const existingMedia = normalizeMedia(p?.media || []);
    return {
        id: forcedLocalId ?? makeLocalId(),
        serverId: p?.id ?? null,
        title: p?.title ?? "",
        desc: p?.description ?? "",
        cost:
            p?.cost_cents === null || p?.cost_cents === undefined
                ? ""
                : String(p.cost_cents),
        coverUrl: firstValidMediaUrl(p),
        files: [],
        existingMedia,
    };
};

const createPreviewFile = (file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
    file,
    preview: URL.createObjectURL(file),
    type: file?.type?.startsWith("video/") ? "video" : "image",
});

export default function MyPortfolio({
    onSuccess,
    mode = "user",
    teamId = null,
}) {
    const [mainProject, setMainProject] = useState(emptyProject("main"));
    const [projects, setProjects] = useState([
        emptyProject(1),
        emptyProject(2),
        emptyProject(3),
    ]);

    const [uploadOpen, setUploadOpen] = useState(false);
    const [uploadTarget, setUploadTarget] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        projectId: null,
        title: "",
        message: "",
    });

    const [toast, setToast] = useState({
        open: false,
        title: "",
        message: "",
        type: "success",
    });

    const [draggedId, setDraggedId] = useState(null);

    const portfolioOptions = useMemo(
        () => ({
            mode,
            teamId,
        }),
        [mode, teamId],
    );

    const canUseTeamPortfolio = mode !== "team" || !!teamId;

    const showToast = (title, message = "", type = "success") => {
        setToast({ open: true, title, message, type });

        setTimeout(() => {
            setToast((prev) => ({ ...prev, open: false }));
        }, 3000);
    };

    const normalizeServerProjects = (data) => {
        const raw =
            data?.projects ||
            data?.data?.projects ||
            data?.portfolio?.projects ||
            [];
        return Array.isArray(raw) ? raw : [];
    };

    const refreshPortfolio = async () => {
        if (!canUseTeamPortfolio) {
            setMainProject(emptyProject("main"));
            setProjects([emptyProject(1), emptyProject(2), emptyProject(3)]);
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const data = await getMyPortfolio(portfolioOptions);

            const mapped = normalizeServerProjects(data)
                .slice()
                .sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

            if (mapped.length > 0) {
                const [first, ...rest] = mapped;

                setMainProject({
                    ...emptyProject("main"),
                    ...projectFromServer(first, "main"),
                    id: "main",
                });

                const childProjects = rest.map((p, index) =>
                    projectFromServer(p, index + 1),
                );

                while (childProjects.length < DEFAULT_CHILD_COUNT) {
                    childProjects.push(emptyProject(childProjects.length + 1));
                }

                setProjects(childProjects);
            } else {
                setMainProject(emptyProject("main"));
                setProjects([
                    emptyProject(1),
                    emptyProject(2),
                    emptyProject(3),
                ]);
            }
        } catch (e) {
            setError(e?.message || "Failed to load portfolio");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshPortfolio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, teamId]);

    useEffect(() => {
        return () => {
            [
                ...mainProject.files,
                ...projects.flatMap((p) => p.files || []),
            ].forEach((f) => {
                if (f?.preview) URL.revokeObjectURL(f.preview);
            });
        };
    }, [mainProject.files, projects]);

    const updateMain = (field, value) => {
        setMainProject((prev) => ({ ...prev, [field]: value }));
    };

    const updateProject = (id, field, value) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
        );
    };

    const clearLocalFiles = (files = []) => {
        files.forEach((f) => {
            if (f?.preview) URL.revokeObjectURL(f.preview);
        });
    };

    const askRemoveProject = (id) => {
        setConfirmModal({
            open: true,
            projectId: id,
            title: "Remove Portfolio?",
            message:
                "Are you sure you want to remove this portfolio? This action cannot be undone.",
        });
    };

    const removeProject = async (id) => {
        const project = projects.find((p) => p.id === id);
        if (!project) return;

        if (project.serverId) {
            try {
                await deletePortfolioProject(
                    project.serverId,
                    portfolioOptions,
                );
            } catch (e) {
                setError(e?.message || "Failed to delete project");
                return;
            }
        }

        clearLocalFiles(project.files || []);

        setProjects((prev) => {
            const filtered = prev.filter((p) => p.id !== id);

            while (filtered.length < DEFAULT_CHILD_COUNT) {
                filtered.push(emptyProject(makeLocalId()));
            }

            return filtered;
        });

        showToast("Deleted", "Portfolio removed successfully.");
    };

    const addMorePortfolio = () => {
        setProjects((prev) => [...prev, emptyProject(makeLocalId())]);
    };

    const openUploadForMain = () => {
        setError("");
        setUploadTarget({ type: "main" });
        setUploadOpen(true);
    };

    const openUploadForProject = (project) => {
        setError("");
        setUploadTarget({ type: "project", localId: project.id });
        setUploadOpen(true);
    };

    const handleUploadSelected = (rawFiles) => {
        if (!uploadTarget) return;

        const preparedFiles = (rawFiles || []).map(createPreviewFile);
        const preview = preparedFiles?.[0]?.preview || "";

        if (uploadTarget.type === "main") {
            clearLocalFiles(mainProject.files || []);
            setMainProject((prev) => ({
                ...prev,
                files: preparedFiles,
                coverUrl: preview || prev.coverUrl,
            }));
        } else {
            setProjects((prev) =>
                prev.map((p) => {
                    if (p.id !== uploadTarget.localId) return p;
                    clearLocalFiles(p.files || []);
                    return {
                        ...p,
                        files: preparedFiles,
                        coverUrl: preview || p.coverUrl,
                    };
                }),
            );
        }

        setUploadOpen(false);
        setUploadTarget(null);
    };

    const buildProjectsForSave = () => {
        const combined = [
            { ...mainProject, _sort: 0 },
            ...projects.map((p, idx) => ({ ...p, _sort: idx + 1 })),
        ];

        return combined.map((p) => ({
            serverId: p.serverId,
            title: p.title,
            desc: p.desc,
            cost: p.cost,
            sort_order: p._sort,
            files: (p.files || []).map((f) => f.file),
        }));
    };

    const handleSaveChanges = async () => {
        if (!canUseTeamPortfolio) {
            setError("Create the team first to save team portfolio.");
            return;
        }

        setError("");

        try {
            setIsSaving(true);

            const response = await syncMyPortfolio(
                buildProjectsForSave(),
                portfolioOptions,
            );

            await refreshPortfolio();

            showToast(
                "Success",
                mode === "team"
                    ? "Team portfolio updated successfully."
                    : "Portfolio updated successfully.",
            );

            onSuccess?.(
                response?.message ||
                    (mode === "team"
                        ? "Team portfolio updated successfully"
                        : "Portfolio updated successfully"),
            );
        } catch (e) {
            console.error("Portfolio save error:", e);
            setError(e?.message || "Failed to save portfolio");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = async () => {
        setError("");
        setUploadOpen(false);
        setUploadTarget(null);

        clearLocalFiles(mainProject.files || []);
        projects.forEach((p) => clearLocalFiles(p.files || []));

        await refreshPortfolio();

        showToast("Discarded", "Unsaved changes were reset.");
    };

    // ===== DRAG DROP =====
    const handleDragStart = (id) => {
        setDraggedId(id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (targetId) => {
        if (!draggedId || draggedId === targetId) return;

        setProjects((prev) => {
            const draggedIndex = prev.findIndex((p) => p.id === draggedId);
            const targetIndex = prev.findIndex((p) => p.id === targetId);

            if (draggedIndex === -1 || targetIndex === -1) return prev;

            const updated = [...prev];
            const [draggedItem] = updated.splice(draggedIndex, 1);
            updated.splice(targetIndex, 0, draggedItem);

            return updated;
        });

        setDraggedId(null);
    };

    const sectionTitle = mode === "team" ? "Team Portfolio" : "My Portfolio";

    return (
        <>
            <div
                className={`ml-auto mt-12 pb-20 transition-all duration-300 my-portfolio user-profile-portfolio ${
                    uploadOpen ? "blur-sm pointer-events-none select-none" : ""
                }`}
            >
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xl font-semibold whitespace-nowrap">
                        {sectionTitle}
                    </h3>
                    <div className="flex-1 h-px bg-[#2B2B2B]" />
                </div>

                {mode === "team" && !teamId ? (
                    <div className="border border-dashed border-[#CEFF1B] rounded-2xl p-8 bg-white/70">
                        <p className="text-sm text-gray-700">
                            Create the team first, then you can add its
                            portfolio here.
                        </p>
                    </div>
                ) : (
                    <>
                        <PortfolioCard
                            isMain
                            // titleLabel="Main Portfolio"
                            titleInputLabel="Main Portfolio Title"
                            project={mainProject}
                            onTitleChange={(v) => updateMain("title", v)}
                            onDescChange={(v) => updateMain("desc", v)}
                            onCostChange={(v) => updateMain("cost", v)}
                            onUpload={openUploadForMain}
                            onClearMedia={() => {
                                clearLocalFiles(mainProject.files || []);
                                setMainProject((prev) => ({
                                    ...prev,
                                    files: [],
                                    existingMedia: [],
                                    coverUrl: "",
                                }));
                            }}
                        />

                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(project.id)}
                                className={`transition ${
                                    draggedId === project.id
                                        ? "opacity-50 scale-[0.99]"
                                        : ""
                                }`}
                            >
                                <PortfolioCard
                                    titleLabel={`Portfolio ${index + 1}`}
                                    titleInputLabel={`Title ${index + 1}`}
                                    project={project}
                                    onTitleChange={(v) =>
                                        updateProject(project.id, "title", v)
                                    }
                                    onDescChange={(v) =>
                                        updateProject(project.id, "desc", v)
                                    }
                                    onCostChange={(v) =>
                                        updateProject(project.id, "cost", v)
                                    }
                                    onUpload={() =>
                                        openUploadForProject(project)
                                    }
                                    onDelete={() =>
                                        askRemoveProject(project.id)
                                    }
                                    onClearMedia={() => {
                                        clearLocalFiles(project.files || []);
                                        setProjects((prev) =>
                                            prev.map((p) =>
                                                p.id === project.id
                                                    ? {
                                                          ...p,
                                                          files: [],
                                                          existingMedia: [],
                                                          coverUrl: "",
                                                      }
                                                    : p,
                                            ),
                                        );
                                    }}
                                    showDragHandle
                                    dragHandleProps={{
                                        draggable: true,
                                        onDragStart: () =>
                                            handleDragStart(project.id),
                                        onDragEnd: () => setDraggedId(null),
                                    }}
                                />
                            </div>
                        ))}

                        <div className="flex justify-end mt-6 pt-0">
                            <button
                                type="button"
                                onClick={addMorePortfolio}
                                className="bg-[#CEFF1B] border-[0.6px] border-black px-4 py-2 rounded"
                            >
                                + Add More Portfolio
                            </button>
                        </div>

                        <div className="flex justify-end gap-4 mt-10">
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
                    </>
                )}

                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>

            {uploadOpen &&
                createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
                            onClick={() => {
                                setUploadOpen(false);
                                setUploadTarget(null);
                            }}
                        />
                        <UploadGrid
                            onBack={() => {
                                setUploadOpen(false);
                                setUploadTarget(null);
                            }}
                            onSelect={handleUploadSelected}
                        />
                    </>,
                    document.body,
                )}

            {confirmModal.open &&
                createPortal(
                    <ConfirmModal
                        title={confirmModal.title}
                        message={confirmModal.message}
                        onCancel={() =>
                            setConfirmModal({
                                open: false,
                                projectId: null,
                                title: "",
                                message: "",
                            })
                        }
                        onConfirm={async () => {
                            const id = confirmModal.projectId;
                            setConfirmModal({
                                open: false,
                                projectId: null,
                                title: "",
                                message: "",
                            });
                            await removeProject(id);
                        }}
                    />,
                    document.body,
                )}

            {toast.open &&
                createPortal(
                    <SuccessToast
                        title={toast.title}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            setToast((prev) => ({ ...prev, open: false }))
                        }
                    />,
                    document.body,
                )}
        </>
    );
}

function PortfolioCard({
    isMain = false,
    titleLabel,
    titleInputLabel,
    project,
    onTitleChange,
    onDescChange,
    onCostChange,
    onUpload,
    onDelete,
    onClearMedia,
    showDragHandle = false,
    dragHandleProps = {},
}) {
    const allMedia = [
        ...(project.existingMedia || []).map((m) => ({
            id: m.id,
            url: m.url,
            type: m.type || "image",
        })),
        ...(project.files || []).map((f) => ({
            id: f.id,
            url: f.preview,
            type: f.type || "image",
        })),
    ].filter((m) => m.url);

    const coverMedia = allMedia[0];
    const visibleMedia = allMedia.slice(1, 4);

    return (
        <div className="portfolio-card-edit portfolio-surface border border-[#CEFF1B] rounded-[24px] p-4 sm:p-6 mb-10 bg-[#ECECEC]">
            <div className="grid xl:grid-cols-[342px_1fr] gap-8 items-start">
                <div className="space-y-3">
                    <div className="relative h-[300px] sm:h-[410px] rounded-2xl overflow-hidden border border-[#CEFF1B] bg-[#CEFF1B]">
                        {coverMedia && (
                            <div className="absolute inset-0 h-full w-full overflow-hidden rounded-none border-0">
                                {coverMedia.type === "video" ? (
                                    <video
                                        src={coverMedia.url}
                                        className="h-full w-full object-cover"
                                        muted
                                        playsInline
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={coverMedia.url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={onUpload}
                            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center px-4 py-2 rounded-lg border border-black/10 bg-gray text-[#CEFF1B] text-sm font-medium whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm dark:border-white/15 dark:bg-black/45 dark:text-[#CEFF1B]"
                            style={{
                                WebkitBackdropFilter: "blur(6px)",
                            }}
                        >
                            {allMedia.length ? "Change Photo" : "Upload Photo"}
                        </button>

                        {allMedia.length > 0 && (
                            <button
                                type="button"
                                onClick={onClearMedia}
                                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg border border-black/60 bg-white/90 text-xs font-medium hover:bg-white transition"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {visibleMedia.length > 0 && (
                        <div className="grid gap-2 grid-cols-3">
                            {visibleMedia.map((item, idx) => (
                                <MediaTile key={item.id || idx} media={item} />
                            ))}
                        </div>
                    )}

                    {allMedia.length > 4 && (
                        <p className="text-xs text-gray-600">
                            +{allMedia.length - 4} more media files selected
                        </p>
                    )}
                </div>

                <div className="space-y-5 max-w-[420px]">
                    <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-medium text-black">
                            {titleLabel}
                        </h4>
                        {showDragHandle && (
                            <span
                                className="text-xl cursor-grab select-none text-black/60"
                                {...dragHandleProps}
                            >
                                ::
                            </span>
                        )}
                    </div>

                    <Input
                        label={titleInputLabel}
                        value={project.title}
                        placeholder="SalonSync - Revolutionary AI-Powered Salon"
                        onChange={onTitleChange}
                    />

                    <Textarea
                        label="Description"
                        limit={150}
                        placeholder="This project involves designing a next-generation app..."
                        value={project.desc}
                        onChange={onDescChange}
                    />

                    <Input
                        label="Project cost"
                        numericOnly
                        value={project.cost}
                        placeholder="$600-$800"
                        onChange={onCostChange}
                    />

                    {!isMain && (
                        <div className="pt-1">
                            <button
                                type="button"
                                draggable={false}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.();
                                }}
                                className="px-4 py-2 border border-black text-red-600 rounded hover:bg-red-50 transition"
                            >
                                Remove Portfolio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MediaTile({ media, className = "" }) {
    const isVideo = media?.type === "video";

    return (
        <div
            className={`h-[84px] sm:h-[92px] rounded-xl overflow-hidden bg-gray-100 border border-black/10 ${className}`}
        >
            {isVideo ? (
                <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    controls
                />
            ) : (
                <img
                    src={media.url}
                    alt=""
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
}

function UploadGrid({ onSelect, onBack }) {
    const fileRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    const openPicker = () => fileRef.current?.click();

    const handleFiles = (e) => {
        const selected = Array.from(e.target.files || []);
        if (activeIndex === null || selected.length === 0) return;

        const selectedFile = selected[0];

        setFiles((prev) => {
            const updated = [...prev];
            updated[activeIndex] = selectedFile;
            return updated;
        });

        setActiveIndex(null);
        e.target.value = "";
    };

    const removeSlotFile = (idx) => {
        setFiles((prev) => {
            const updated = [...prev];
            updated[idx] = undefined;
            return updated;
        });
    };

    const preparedPreviews = Array.from({ length: GRID_UPLOAD_SLOTS }).map(
        (_, idx) => {
            const file = files[idx];
            return file ? URL.createObjectURL(file) : null;
        },
    );

    useEffect(() => {
        return () => {
            preparedPreviews.forEach((p) => p && URL.revokeObjectURL(p));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    const selectedCount = files.filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto px-3">
            <div className="upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white shadow-[0_0_20px_#CEFF1B] transition-all duration-200 overflow-auto">
                <div className="upload-header flex items-center gap-3 mb-3 shrink-0">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
                        title="Back"
                    >
                        ←
                    </button>

                    <h4 className="text-sm font-medium text-black">
                        Select and upload your file
                    </h4>

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
                    {Array.from({ length: GRID_UPLOAD_SLOTS }).map((_, idx) => {
                        const file = files[idx];
                        const preview = preparedPreviews[idx];
                        const isVideo = file?.type?.startsWith("video/");

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    setActiveIndex(idx);
                                    openPicker();
                                }}
                                className="upload-slot relative h-[160px] rounded-xl border border-dashed border-[#767676] flex items-center justify-center cursor-pointer overflow-hidden bg-white"
                            >
                                {idx === 0 && !preview && (
                                    <span className="absolute inset-0 z-10 flex items-center justify-center px-2">
                                        <span className="bg-[#CEFF1B] text-black font-medium text-[10px] sm:text-xs px-2 py-[3px] rounded max-w-[90%] text-center whitespace-normal leading-tight">
                                            Upload Cover Image
                                        </span>
                                    </span>
                                )}

                                {preview ? (
                                    isVideo ? (
                                        <video
                                            src={preview}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={preview}
                                            alt={`slot-${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )
                                ) : idx !== 0 ? (
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
                                        <div className="absolute bottom-4 right-5 w-6 h-6 rounded-full bg-[#CEFF1B] flex items-center justify-center text-black">
                                            +
                                        </div>
                                    </div>
                                ) : null}

                                {preview && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSlotFile(idx);
                                        }}
                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 border border-gray-200 text-black shadow flex items-center justify-center hover:bg-red-50"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-3 shrink-0">
                    <p className="text-sm text-black">Drag Files to upload</p>
                    <p className="text-xs text-red-500 mb-3">
                        3 required, up to 50 allowed
                    </p>

                    <div className="flex justify-end items-center">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onBack}
                                className="upload-btn-cancel px-4 py-2 rounded-lg text-sm border border-black"
                            >
                                Cancel
                            </button>
                            {selectedCount > 0 && (
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

function ConfirmModal({ title, message, onCancel, onConfirm }) {
    return (
        <>
            <div className="fixed inset-0 z-[11000] bg-black/40 backdrop-blur-sm" />
            <div className="fixed inset-0 z-[11001] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-3xl border border-[#CEFF1B] shadow-[0_0_30px_rgba(206,255,27,0.35)] p-6">
                    <h3 className="text-xl font-semibold text-black mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">{message}</p>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 border border-black rounded-xl bg-white hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-5 py-2.5 rounded-xl bg-red-500 text-white border border-red-600 hover:bg-red-600 transition"
                        >
                            Yes, Remove
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function SuccessToast({ title, message, onClose, type = "success" }) {
    return (
        <div className="fixed top-6 right-6 z-[12000] animate-[slideIn_.3s_ease]">
            <div
                className={`min-w-[320px] max-w-[420px] rounded-2xl border shadow-xl p-4 bg-white ${
                    type === "success" ? "border-[#CEFF1B]" : "border-red-300"
                }`}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            type === "success" ? "bg-[#CEFF1B]" : "bg-red-100"
                        }`}
                    >
                        {type === "success" ? "✓" : "!"}
                    </div>

                    <div className="flex-1">
                        <h4 className="font-semibold text-black">{title}</h4>
                        {message ? (
                            <p className="text-sm text-gray-600 mt-1">
                                {message}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-lg"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange, placeholder, numericOnly = false }) {
    return (
        <div>
            <label className="block mb-2 text-[16px] leading-none font-medium text-black">
                {label}
            </label>
            <input
                className="w-full border border-black rounded-md px-3 py-2 bg-transparent text-sm resize-none
        outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B] placeholder:text-gray-400"
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    let val = e.target.value;
                    if (numericOnly) val = val.replace(/[^\d]/g, "");
                    onChange(val);
                }}
            />
        </div>
    );
}

function Textarea({ label, value, onChange, placeholder, limit = 150 }) {
    return (
        <div>
            <label className="block mb-2 text-[16px] leading-none font-medium text-black">
                {label}
            </label>
            <textarea
                className="w-full border border-black rounded-md px-3 py-2 bg-transparent text-sm resize-none min-h-[110px]
                outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B] placeholder:text-gray-400"
                value={value}
                placeholder={placeholder}
                maxLength={limit}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="text-xs text-[#9AA0AD] mt-2">
                {value.length}/{limit}
            </div>
        </div>
    );
}
