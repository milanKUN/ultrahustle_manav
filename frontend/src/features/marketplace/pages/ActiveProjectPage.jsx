import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MessageSquareText,
  Search,
  UserRound,
  Users,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "./ActiveProjectPage.css";
import { getContracts } from "../api/contractApi";

const PROJECT_MODE_TABS = ["Solo", "Teams"];
const PROJECT_STATUS_TABS = ["Active", "Completed", "Disputed"];
const SORT_OPTIONS = ["Recent activity", "Due soon", "Newest"];

export default function ActiveProjectPage({ theme, setTheme }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("Solo");
  const [activeStatus, setActiveStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recent activity");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || "creator");

  useEffect(() => {
    const handleStorage = () => {
      setUserType(localStorage.getItem("userType") || "creator");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    fetchActiveProjects();
  }, [activeStatus, userType]);

  const fetchActiveProjects = async () => {
    setLoading(true);
    try {
      // Map frontend tab status to backend status
      let backendStatus = activeStatus;
      const res = await getContracts(backendStatus, userType);
      if (res.success) {
        setContracts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch active projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProjects = useMemo(() => {
    return contracts.filter((project) => {
      const matchesMode = project.type === activeMode;
      const matchesSearch = project.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesMode && matchesSearch;
    });
  }, [contracts, activeMode, search]);

  return (
    <div className={`active-projects-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        theme={theme}
        onDropdownChange={setIsDropdownOpen}
      />

      <div className="pt-[72px] flex relative w-full">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={setActiveSetting}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-0 overflow-hidden w-full">
          <div className="relative overflow-y-auto h-[calc(100vh-72px)] w-full">
            <main className={`active-projects-main ${isDropdownOpen ? "blurred" : ""}`}> 
              <section className="active-projects-shell">
                <header className="active-projects-head">
                  <h1 className="active-projects-title">Active Projects</h1>
                  <p className="active-projects-subtitle">
                    Track delivery work: milestones, deadlines, revisions, messages, files, and resolution.
                  </p>
                </header>

                <section className="active-projects-board p-4">
                  <div className="active-projects-boardTop">
                    <h2 className="active-projects-boardTitle">Contracts</h2>

                    <div className="active-projects-boardFilters">
                      <div className="active-projects-modeTabs">
                        {PROJECT_MODE_TABS.map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            className={`active-projects-modeTab ${activeMode === tab ? "active" : ""}`}
                            onClick={() => setActiveMode(tab)}
                          >
                            {tab === "Solo" ? <UserRound size={13} /> : <Users size={13} />}
                            <span>{tab}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="active-projects-statusTabs">
                      {PROJECT_STATUS_TABS.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          className={`active-projects-statusTab ${activeStatus === tab ? "active" : ""}`}
                          onClick={() => setActiveStatus(tab)}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="active-projects-toolbar">
                    <label className="active-projects-search" aria-label="Search product">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search product"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </label>

                    <div
                      className={`active-projects-selectWrap ${isSortOpen ? "open" : ""}`}
                      ref={sortRef}
                    >
                      <button
                        type="button"
                        className="active-projects-selectButton"
                        onClick={() => setIsSortOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isSortOpen}
                      >
                        <span>{sortBy}</span>
                        <ChevronDown size={16} />
                      </button>

                      {isSortOpen && (
                        <div className="active-projects-selectMenu" role="listbox" aria-label="Sort projects">
                          {SORT_OPTIONS.map((option) => (
                            <button
                              key={option}
                              type="button"
                              role="option"
                              aria-selected={sortBy === option}
                              className={`active-projects-selectOption ${sortBy === option ? "active" : ""}`}
                              onClick={() => {
                                setSortBy(option);
                                setIsSortOpen(false);
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="active-projects-grid">
                    {loading ? (
                      <div className="p-10 text-center opacity-50">Loading projects...</div>
                    ) : filteredProjects.map((project) => {
                      const totalMilestones = project.milestones?.length || 0;
                      const completedMilestones = project.milestones?.filter(m => m.status === 'Paid').length || 0;
                      const progress = `${completedMilestones}/${totalMilestones}`;
                      const progressPct = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

                      return (
                        <React.Fragment key={project.id}>
                          <article className="active-projects-card active-projects-card-main">
                            <div className="active-projects-cardHeader">
                              <div className="active-projects-cardTitleGroup">
                              <div className="active-projects-cardTitleRow">
                                <h3>{project.title}</h3>
                                <span className={`active-projects-miniStatus ${project.status.includes('Requested') || project.status === 'Disputed' ? 'text-red-500 font-bold' : ''}`}>
                                  {project.status.includes('Requested') ? <AlertCircle size={12} className="inline mr-1" /> : null}
                                  {project.status}
                                </span>
                              </div>
                                <div className="active-projects-cardMeta">
                                  <span>{project.type}</span>
                                  <span>•</span>
                                  <span>{userType === 'creator' ? project.client_full_name : project.provider_full_name}</span>
                                  <span>•</span>
                                  <span>{project.contract_id}</span>
                                </div>
                              </div>
                            </div>

                            <div className="active-projects-progressBlock">
                              <div className="active-projects-progressTop">
                                <span>Milestones</span>
                                <span>{progress}</span>
                              </div>

                              <div className="active-projects-progressBar">
                                <span style={{ width: `${progressPct}%` }} />
                              </div>

                              <div className="active-projects-nextRow">
                                <span>
                                  Next: <strong>{project.milestones?.find(m => m.status !== 'Paid')?.title || 'N/A'}</strong>
                                </span>
                                <span>• due {project.initial_delivery_deadline || 'N/A'}</span>
                              </div>
                            </div>
                          </article>

                          <article className="active-projects-card active-projects-card-side">
                            <h3>Due</h3>
                            <div className="active-projects-sideInfo">
                              <div>
                                <CalendarDays size={14} />
                                <span>{project.initial_delivery_deadline || 'N/A'}</span>
                              </div>
                              <div>
                                <Clock3 size={14} />
                                <span>Active</span>
                              </div>
                            </div>
                          </article>

                          <article className="active-projects-card active-projects-card-side">
                            <h3>Collaboration</h3>
                            <div className="active-projects-collabPills">
                              <span>
                                <MessageSquareText size={13} />
                                <b>0</b>
                              </span>
                              <span>
                                <CalendarDays size={13} />
                                <b>0</b>
                              </span>
                            </div>

                            <button 
                              type="button" 
                              className="active-projects-roomBtn"
                              onClick={() => navigate(`/milestones/${project.contract_id}`)}
                            >
                              Open Workroom
                              <span>→</span>
                            </button>
                          </article>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {!loading && filteredProjects.length === 0 && (
                    <div className="active-projects-empty">
                      No active projects match your current filters.
                    </div>
                  )}
                </section>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
