import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MessageSquareText,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "./ActiveProjectPage.css";

const PROJECT_MODE_TABS = ["Solo", "Teams"];
const PROJECT_STATUS_TABS = ["Active", "Completed", "Disputed"];
const SORT_OPTIONS = ["Recent activity", "Due soon", "Newest"];

const PROJECTS = [
  {
    id: 1,
    title: "Brand Identity + Landing Page",
    mode: "Solo",
    status: "Active",
    client: "Ava (Client)",
    contractId: "contract id",
    done: 1,
    total: 4,
    nextStep: "Logo directions",
    dueDate: "Feb 20, 2026",
    dueFull: "Mar 15, 2026",
    timeLeft: "12 days left",
    messages: 34,
    files: 12,
  },
  {
    id: 2,
    title: "Monthly Content Ops (Retainer)",
    mode: "Teams",
    status: "Active",
    client: "Ava (Client)",
    contractId: "contract id",
    done: 1,
    total: 4,
    nextStep: "Logo directions",
    dueDate: "Feb 20, 2026",
    dueFull: "Mar 15, 2026",
    timeLeft: "12 days left",
    messages: 34,
    files: 12,
    hasExtension: true,
  },
  {
    id: 3,
    title: "Creator Studio Revamp",
    mode: "Teams",
    status: "Disputed",
    client: "Maya (Client)",
    contractId: "contract id",
    done: 2,
    total: 5,
    nextStep: "Revision review",
    dueDate: "Mar 08, 2026",
    dueFull: "Mar 18, 2026",
    timeLeft: "Needs review",
    messages: 48,
    files: 18,
  },
];

export default function ActiveProjectPage({ theme, setTheme }) {
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

  useEffect(() => {
    setSidebarOpen(false);
    setShowSettings(false);
  }, []);

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
    return PROJECTS.filter((project) => {
      const matchesMode = project.mode === activeMode;
      const matchesStatus = project.status === activeStatus;
      const matchesSearch = project.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesMode && matchesStatus && matchesSearch;
    });
  }, [activeMode, activeStatus, search]);

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
                    {filteredProjects.map((project) => {
                      const progress = `${project.done}/${project.total}`;
                      const progressPct = (project.done / project.total) * 100;

                      return (
                        <React.Fragment key={project.id}>
                          <article className="active-projects-card active-projects-card-main">
                            <div className="active-projects-cardHeader">
                              <div className="active-projects-cardTitleGroup">
                              <div className="active-projects-cardTitleRow">
                                <h3>{project.title}</h3>
                                <span className="active-projects-miniStatus">{project.status}</span>
                                {project.hasExtension && (
                                  <span className="active-projects-extensionTag">Extension</span>
                                )}
                              </div>
                                <div className="active-projects-cardMeta">
                                  <span>{project.mode}</span>
                                  <span>•</span>
                                  <span>{project.client}</span>
                                  <span>•</span>
                                  <span>{project.contractId}</span>
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
                                  Next: <strong>{project.nextStep}</strong>
                                </span>
                                <span>• due {project.dueDate}</span>
                              </div>
                            </div>
                          </article>

                          <article className="active-projects-card active-projects-card-side">
                            <h3>Due</h3>
                            <div className="active-projects-sideInfo">
                              <div>
                                <CalendarDays size={14} />
                                <span>{project.dueFull}</span>
                              </div>
                              <div>
                                <Clock3 size={14} />
                                <span>{project.timeLeft}</span>
                              </div>
                            </div>
                          </article>

                          <article className="active-projects-card active-projects-card-side">
                            <h3>Collaboration</h3>
                            <div className="active-projects-collabPills">
                              <span>
                                <MessageSquareText size={13} />
                                <b>{project.messages}</b>
                              </span>
                              <span>
                                <CalendarDays size={13} />
                                <b>{project.files}</b>
                              </span>
                            </div>

                            <button type="button" className="active-projects-roomBtn">
                              Open Workroom
                              <span>→</span>
                            </button>
                          </article>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {filteredProjects.length === 0 && (
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
