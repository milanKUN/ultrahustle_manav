import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, X, Eye, Loader2, Users } from "lucide-react";

import "../../../pages/InReviewLight.css";
import "./TeamProfileLight.css";
import "./ManageTeam.css";
import NavbarLight from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";

import { getMyTeams, toggleTeamStatus } from "../api/teamApi";

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

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => {
      setToast({ open: false, message: "", type: "success" });
    }, 2500);
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setPageError("");

      const res = await getMyTeams();
      setTeams(res?.teams || []);
    } catch (err) {
      console.error("Failed to fetch teams", err);
      setPageError(
        err?.response?.data?.message || "Failed to load teams."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openDeactivateModal = (team) => {
    setSelectedTeam(team);
    setConfirmOpen(true);
  };

  const closeDeactivateModal = () => {
    if (actionLoading) return;
    setConfirmOpen(false);
    setSelectedTeam(null);
  };

  const confirmToggleActive = async () => {
    if (!selectedTeam) return;

    try {
      setActionLoading(true);

      const res = await toggleTeamStatus(selectedTeam.id);

      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeam.id
            ? { ...t, isActive: res?.team?.isActive }
            : t
        )
      );

      showToast(res?.message || "Team status updated successfully.");
      closeDeactivateModal();
    } catch (err) {
      console.error("Failed to toggle team status", err);
      showToast(
        err?.response?.data?.message || "Failed to update team status.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

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
  }, [confirmOpen, actionLoading]);

  return (
    <div
      className={`manage-team-page user-page ${
        theme || "light"
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
              className={`manage-team-main p-4 md:p-6 lg:p-10 ${
                isDropdownOpen ? "blurred" : ""
              } w-full min-w-0 max-w-[1400px] mx-auto`}
            >
              <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white mb-1.5 md:mb-2 text-[#2A2A2A]">
                    My Teams
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    View, edit, and manage all your teams.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/create-team")}
                  className="manage-team-view-btn px-4 py-2 rounded-xl text-sm font-semibold border border-black"
                >
                  + Create Team
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
              ) : pageError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-5 py-4 text-sm text-red-600 dark:text-red-400">
                  {pageError}
                </div>
              ) : teams.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 dark:border-[#333] p-10 text-center bg-white/70 dark:bg-[#111]/50">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-[#1c1c1c] flex items-center justify-center">
                    <Users className="w-7 h-7 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2A2A2A] dark:text-white mb-2">
                    No teams created yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                    Create your first team and start collaborating.
                  </p>
                  <button
                    onClick={() => navigate("/create-team")}
                    className="manage-team-view-btn px-5 py-2.5 rounded-xl text-sm font-semibold border border-black"
                  >
                    Create Team
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className={`manage-team-card flex gap-4 md:gap-5 ${
                        !team.isActive ? "manage-team-card-inactive" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={
                            team.avatar ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(team.name) +
                              "&background=111827&color=fff&size=200"
                          }
                          alt={team.name}
                          className={`w-14 h-14 md:w-[60px] md:h-[60px] rounded-full object-cover ${
                            !team.isActive
                              ? "manage-team-avatar-inactive"
                              : ""
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <h3 className="manage-team-title font-medium text-[15px] md:text-base mb-3 max-sm:mb-4 flex flex-col items-start sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                          <span className="truncate w-full">{team.name}</span>
                          {!team.isActive && (
                            <span className="manage-team-badge flex-shrink-0">
                              Inactive
                            </span>
                          )}
                        </h3>

                        {/* Stats */}
                        <div
                          className={`flex items-center gap-2 md:gap-3 mb-4 ${
                            !team.isActive
                              ? "manage-team-stats-disabled"
                              : ""
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
                          className={`flex flex-col gap-2 md:gap-2.5 ${
                            !team.isActive
                              ? "manage-team-actions-disabled"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 md:gap-2.5">
                            {team.isOwner && (
                              <button
                                onClick={() => navigate(`/edit-team/${team.id}`)}
                                disabled={!team.isActive}
                                className="manage-team-action-btn flex-1 flex items-center justify-center gap-1 py-2 rounded-[10px] sm:rounded-[7px] text-[10px] transition-colors border"
                                title={!team.isActive ? "Activate team to edit" : ""}
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Edit Team
                              </button>
                            )}
                            {team.isOwner && (
                            <button
                              onClick={() => openDeactivateModal(team)}
                              className="manage-team-action-btn flex-1 flex items-center justify-center gap-1 py-2 rounded-[10px] sm:rounded-[7px] text-[10px] transition-colors border"
                            >
                              <X className="w-3.5 h-3.5" />
                              {team.isActive
                                ? "Deactivate Team"
                                : "Activate Team"}
                            </button>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              navigate(
                                team.isOwner
                                  ? `/team-profile/${team.username}`
                                  : `/public-team-profile/${team.username}`
                              )
                            }
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
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
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
                  Team: <span className="font-medium">{selectedTeam?.name}</span>
                </p>
              </div>

              <button
                onClick={closeDeactivateModal}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                disabled={actionLoading}
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
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                onClick={confirmToggleActive}
                disabled={actionLoading}
                className="flex-1 py-2 rounded-xl text-sm font-semibold border border-black manage-team-view-btn hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedTeam?.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Toast */}
      {toast.open && (
        <div className="fixed bottom-6 right-6 z-[99999]">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300"
                : "bg-white border-[#CEFF1B] text-black dark:bg-[#111] dark:text-white dark:border-[#CEFF1B]"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;