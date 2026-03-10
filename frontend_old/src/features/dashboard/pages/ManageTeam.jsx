import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, X, Eye } from "lucide-react";

import "../../../pages/InReviewLight.css";
import "./TeamProfileLight.css";
import "./ManageTeam.css";
import NavbarLight from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";

const ManageTeam = (props) => {
    const navigate = useNavigate();

    const [localTheme, setLocalTheme] = useState("light");
    const theme = props.theme || localTheme;
    const setTheme = props.setTheme || setLocalTheme;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownChange = (isOpen) => setIsDropdownOpen(isOpen);
    const handleSectionChange = (id) => setActiveSetting(id);

    useEffect(() => {
        setSidebarOpen(false);
    }, []);

    // ✅ Teams in state + active flag
    const [teams, setTeams] = useState([
        {
            id: 1,
            name: "Design Systems Collective",
            avatar:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
            members: 7,
            listings: 6,
            projects: 1,
            isActive: true,
        },
        {
            id: 2,
            name: "Design Systems Collective",
            avatar:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
            members: 7,
            listings: 6,
            projects: 1,
            isActive: true,
        },
        {
            id: 3,
            name: "Design Systems Collective",
            avatar:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
            members: 7,
            listings: 6,
            projects: 1,
            isActive: true,
        },
    ]);

    // ✅ confirm modal
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const openDeactivateModal = (team) => {
        setSelectedTeam(team);
        setConfirmOpen(true);
    };

    const closeDeactivateModal = () => {
        setConfirmOpen(false);
        setSelectedTeam(null);
    };

    const confirmToggleActive = () => {
        if (!selectedTeam) return;
        setTeams((prev) =>
            prev.map((t) =>
                t.id === selectedTeam.id ? { ...t, isActive: !t.isActive } : t
            )
        );
        closeDeactivateModal();
    };

    // ESC close + scroll lock
    useEffect(() => {
        if (!confirmOpen) return;

        const onKey = (e) => {
            if (e.key === "Escape") closeDeactivateModal();
        };

        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [confirmOpen]);

    return (
        <div
            className={`manage-team-page user-page ${theme || "light"
                } min-h-screen relative overflow-hidden`}
        >
            {/* NAVBAR */}
            <NavbarLight
                className="create-team-navbar"
                toggleSidebar={() => setSidebarOpen((p) => !p)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
                onDropdownChange={handleDropdownChange}
            />

            <div className="pt-[85px] flex relative z-10">
                {/* SIDEBAR */}
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

                {/* MAIN CONTENT WRAPPER */}
                <div className="relative flex-1 min-w-0 overflow-hidden">
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
                        <main
                            className={`manage-team-main p-4 md:p-6 lg:p-10 ${isDropdownOpen ? "blurred" : ""
                                } w-full min-w-0 max-w-[1400px] mx-auto`}
                        >
                            <div className="mb-6 md:mb-8">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white mb-1.5 md:mb-2 text-[#2A2A2A]">
                                    My Teams
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    View, edit, and manage all your teams.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                {teams.map((team) => (
                                    <div
                                        key={team.id}
                                        className={`manage-team-card flex gap-4 md:gap-5 ${!team.isActive ? "manage-team-card-inactive" : ""
                                            }`}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={team.avatar}
                                                alt={team.name}
                                                className={`w-14 h-14 md:w-[60px] md:h-[60px] rounded-full object-cover ${!team.isActive ? "manage-team-avatar-inactive" : ""
                                                    }`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <h3 className="manage-team-title font-medium text-[15px] md:text-base mb-3 max-sm:mb-4 flex flex-col items-start sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                                                <span className="truncate w-full">{team.name}</span>
                                                {!team.isActive && (
                                                    <span className="manage-team-badge flex-shrink-0">Inactive</span>
                                                )}
                                            </h3>

                                            {/* Stats */}
                                            <div
                                                className={`flex items-center gap-2 md:gap-3 mb-4 ${!team.isActive ? "manage-team-stats-disabled" : ""
                                                    }`}
                                            >
                                                <div className="manage-team-stat flex-1 flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-[10px] sm:rounded-xl border border-gray-100 dark:border-[#333]">
                                                    <span className="manage-team-number font-semibold text-base sm:text-lg md:text-xl leading-none mb-1">
                                                        {team.members}
                                                    </span>
                                                    <span className="manage-team-label text-[9px] sm:text-[10px] font-medium capitalize">
                                                        Members
                                                    </span>
                                                </div>

                                                <div className="manage-team-stat flex-1 flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-[10px] sm:rounded-xl border border-gray-100 dark:border-[#333]">
                                                    <span className="manage-team-number font-semibold text-base sm:text-lg md:text-xl leading-none mb-1">
                                                        {team.listings}
                                                    </span>
                                                    <span className="manage-team-label text-[9px] sm:text-[10px] font-medium capitalize">
                                                        Listings
                                                    </span>
                                                </div>

                                                <div className="manage-team-stat flex-1 flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-[10px] sm:rounded-xl border border-gray-100 dark:border-[#333]">
                                                    <span className="manage-team-number font-semibold text-base sm:text-lg md:text-xl leading-none mb-1">
                                                        {team.projects}
                                                    </span>
                                                    <span className="manage-team-label text-[9px] sm:text-[10px] font-medium capitalize">
                                                        Projects
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div
                                                className={`flex flex-col gap-2 md:gap-2.5 ${!team.isActive ? "manage-team-actions-disabled" : ""
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 md:gap-2.5">
                                                    <button
                                                        onClick={() => navigate("/create-team")}
                                                        disabled={!team.isActive}
                                                        className="manage-team-action-btn flex-1 flex items-center justify-center gap-1 py-2 rounded-[10px] sm:rounded-[7px] text-[10px] transition-colors border"
                                                        title={!team.isActive ? "Activate team to edit" : ""}
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" /> Edit Team
                                                    </button>

                                                    <button
                                                        onClick={() => openDeactivateModal(team)}
                                                        className="manage-team-action-btn flex-1 flex items-center justify-center gap-1 py-2 rounded-[10px] sm:rounded-[7px] text-[10px] transition-colors border"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        {team.isActive ? "Deactivate Team" : "Activate Team"}
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => navigate("/team-profile")}
                                                    disabled={!team.isActive}
                                                    className="manage-team-view-btn w-full flex items-center justify-center border-1 border-black gap-2 py-2 rounded-[10px] sm:rounded-[7px] text-[10px] font-medium transition-colors"
                                                    title={!team.isActive ? "Activate team to view" : ""}
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Team
                                                </button>
                                            </div>
                                        </div>


                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* ✅ Confirm Modal */}
            {confirmOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center px-4 backdrop-blur-sm transition-all duration-300"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeDeactivateModal();
                    }}
                    style={{ background: "rgba(0,0,0,0.55)" }}
                >
                    <div className="w-full max-w-[420px] rounded-2xl bg-white dark:bg-[#0f1115] p-5 border-2 border-[#CEFF1B] dark:border-[#CEFF1B] shadow-[0_0_35px_rgba(206,255,27,0.45)] dark:shadow-[0_0_40px_rgba(206,255,27,0.6)]">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-black dark:text-white">
                                    {selectedTeam?.isActive ? "Deactivate team?" : "Activate team?"}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Team:{" "}
                                    <span className="font-medium">{selectedTeam?.name}</span>
                                </p>
                            </div>

                            <button
                                onClick={closeDeactivateModal}
                                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {selectedTeam?.isActive
                                ? "This will make the team inactive and disable View/Edit."
                                : "This will activate the team again."}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={closeDeactivateModal}
                                className="flex-1 py-2 rounded-xl border text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmToggleActive}
                                className="flex-1 py-2 rounded-xl text-sm font-semibold border border-black manage-team-view-btn hover:opacity-90 transition-all"
                            >
                                {selectedTeam?.isActive ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTeam;