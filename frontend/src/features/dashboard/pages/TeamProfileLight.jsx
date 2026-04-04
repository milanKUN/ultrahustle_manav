import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";

import "../../../pages/InReviewLight.css";
import "./TeamProfileLight.css";
import NavbarLight from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";

import { getTeamByUsername } from "../api/teamApi";
import { getMyPortfolio } from "../api/portfolioApi";

const toInitials = (name = "") => {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "T";
};

const toCurrencyText = (cost) => {
  if (cost === null || cost === undefined || cost === "") return "—";
  const numeric = Number(cost);
  if (Number.isNaN(numeric)) return String(cost);
  return `$${numeric}`;
};

const firstMediaUrl = (project) => {
  if (project?.cover_media?.url) return project.cover_media.url;

  if (Array.isArray(project?.media) && project.media.length > 0) {
    const media = project.media[0];
    if (media?.url) return media.url;
    if (media?.path) {
      if (media.path.startsWith("http")) return media.path;
      if (media.path.startsWith("/storage/")) return media.path;
      if (media.path.startsWith("storage/")) return `/${media.path}`;
      return `/storage/${media.path}`;
    }
  }

  return "";
};

const TeamProfileLight = (props) => {
  const navigate = useNavigate();
  const { username } = useParams();

  const [activeItem, setActiveItem] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const toolsContainerRef = useRef(null);
  const languagesContainerRef = useRef(null);
  const skillsContainerRef = useRef(null);
  const contentRef = useRef(null);

  const [joinStatus, setJoinStatus] = useState("idle");
  const [favorites, setFavorites] = useState(new Set());

  const [localTheme, setLocalTheme] = useState("light");
  const theme = props.theme || localTheme;
  const setTheme = props.setTheme || setLocalTheme;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [team, setTeam] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  const handleDropdownChange = (isOpen) => setIsDropdownOpen(isOpen);
  const handleSectionChange = (id) => setActiveSetting(id);

  const handleScroll = useCallback(() => {}, []);

  const scrollHorizontal = (ref, direction) => {
    if (!ref?.current) return;
    ref.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setPageError("");

        const teamRes = await getTeamByUsername(username);

        const fetchedTeam =
          teamRes?.data?.team ||
          teamRes?.team ||
          teamRes?.data ||
          null;

        const fetchedMemberships =
          teamRes?.data?.memberships ||
          teamRes?.memberships ||
          [];

        setTeam(fetchedTeam);
        setMemberships(Array.isArray(fetchedMemberships) ? fetchedMemberships : []);

        if (fetchedTeam?.id) {
          try {
            const portfolioRes = await getMyPortfolio({
              mode: "team",
              teamId: fetchedTeam.id,
            });

            const rawProjects =
              portfolioRes?.projects ||
              portfolioRes?.data?.projects ||
              portfolioRes?.portfolio?.projects ||
              [];

            const sortedProjects = Array.isArray(rawProjects)
              ? [...rawProjects].sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
              : [];

            setPortfolioProjects(sortedProjects);
          } catch {
            setPortfolioProjects([]);
          }
        } else {
          setPortfolioProjects([]);
        }
      } catch (err) {
        setPageError(err?.message || "Failed to load team profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const teamData = useMemo(() => {
    const memberCount = memberships.filter((m) => !m?.left_at).length;

    return {
      id: team?.id ?? null,
      name: team?.name || "Team",
      username: team?.username ? `@${team.username}` : "",
      title: team?.title || "",
      description: team?.bio || "",
      availability: team?.availability || "Not specified",
      about: team?.about ? [team.about] : [],
      whatWeDo: team?.what_we_do ? [team.what_we_do] : [],
      hashtags: Array.isArray(team?.hashtags) ? team.hashtags : [],
      skills: Array.isArray(team?.skills) ? team.skills : [],
      tools: Array.isArray(team?.tools) ? team.tools : [],
      languages: Array.isArray(team?.languages) ? team.languages : [],
      badges: [],
      stats: {
        karma: 0,
        projectsCompleted: portfolioProjects.length,
        averageRating: 0,
        members: memberCount,
      },
      avatarUrl: team?.avatar_url || "",
      terms: team?.terms || "",
    };
  }, [team, memberships, portfolioProjects]);

  const memberCards = useMemo(() => {
    return memberships.map((m) => {
      const fullName =
        m?.user?.full_name ||
        m?.name ||
        m?.user?.name ||
        m?.email ||
        "Member";

      return {
        id: m?.id,
        name: fullName,
        role: m?.role || "Member",
        tag: m?.member_title || "Team Member",
        userId: m?.user_id || m?.user?.id || null,
        username: m?.user?.username || null,
        email: m?.user?.email || m?.email || "",
      };
    });
  }, [memberships]);

  const allProjects = useMemo(() => {
    return portfolioProjects.map((project) => ({
      id: project?.id,
      image: firstMediaUrl(project),
      title: project?.title || "Untitled Project",
      description: project?.description || "",
      cost: toCurrencyText(project?.cost_cents),
    }));
  }, [portfolioProjects]);

  const featuredProject = allProjects[0] || null;
  const otherProjects = allProjects.slice(1);

  const openViewer = (index) => {
    setActiveItemIndex(index);
    setActiveItem(allProjects[index]);
  };

  const nextProject = (e) => {
    e.stopPropagation();
    if (!allProjects.length) return;
    const nextIdx = (activeItemIndex + 1) % allProjects.length;
    openViewer(nextIdx);
  };

  const prevProject = (e) => {
    e.stopPropagation();
    if (!allProjects.length) return;
    const prevIdx = (activeItemIndex - 1 + allProjects.length) % allProjects.length;
    openViewer(prevIdx);
  };

  if (loading) {
    return (
      <div className={`team-profile-page user-page ${theme || "light"} min-h-screen`}>
        <NavbarLight
          className="create-team-navbar"
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
          onDropdownChange={handleDropdownChange}
        />
        <div className="pt-[85px] p-8">Loading team profile...</div>
      </div>
    );
  }

  if (pageError || !team) {
    return (
      <div className={`team-profile-page user-page ${theme || "light"} min-h-screen`}>
        <NavbarLight
          className="create-team-navbar"
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
          onDropdownChange={handleDropdownChange}
        />
        <div className="pt-[85px] p-8 text-red-600">
          {pageError || "Team not found."}
        </div>
      </div>
    );
  }

  return (
    <div className={`team-profile-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}>
      <NavbarLight
        className="create-team-navbar"
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
        onDropdownChange={handleDropdownChange}
      />

      <div className="pt-[85px] flex relative z-10">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={handleSectionChange}
          theme={theme || "light"}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-5 overflow-hidden">
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]"
          >
            <main className={`inreview-main ${isDropdownOpen || activeItem ? "blurred" : ""} w-full min-w-0`}>
              <section className="profile-card">
                <div className="profile-left">
                  <div className="profile-avatar">
                    {teamData.avatarUrl ? (
                      <img
                        src={teamData.avatarUrl}
                        alt={teamData.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#CEFF1B] text-[#111] flex items-center justify-center font-semibold">
                        {toInitials(teamData.name)}
                      </div>
                    )}
                  </div>

                  <div className="profile-info">
                    <h1 className="profile-name">{teamData.name}</h1>
                    <span className="profile-username">{teamData.username}</span>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="btn-message"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    Message
                  </button>

                  <button
                    className={`btn-join ${joinStatus === "sent" ? "sent" : ""}`}
                    onClick={() => setJoinStatus("sent")}
                    disabled={joinStatus === "sent"}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    {joinStatus === "sent" ? "Request Sent" : "Join"}
                  </button>
                </div>
              </section>

              <section className="title-badges-section">
                <div className="title-left">
                  <h2 className="section-title">{teamData.title || "No title added yet"}</h2>
                  <p className="section-description">{teamData.description || "No bio added yet."}</p>
                </div>

                <div className="title-center">
                  <div className="info-stack">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        className="info-badge availability-badge"
                        style={{
                          background: "#CEFF1B",
                          padding: "8px 16px",
                          borderRadius: "10px",
                          color: "#000",
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {teamData.availability}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="title-right">
                  {teamData.badges.length > 0 && (
                    <div className="trust-badges">
                      {teamData.badges.map((badge, index) => (
                        <span key={index} className="trust-badge">{badge}</span>
                      ))}
                    </div>
                  )}

                  <div className="hashtags">
                    {teamData.hashtags.length > 0 ? (
                      teamData.hashtags.map((tag, index) => (
                        <span key={index} className="hashtag">{tag}</span>
                      ))
                    ) : (
                      <span className="hashtag">No hashtags added</span>
                    )}
                  </div>
                </div>
              </section>

              <section className="stats-section">
                <div className="stat-card">
                  <div className="stat-content">
                    <span className="stat-value">{teamData.stats.karma}</span>
                    <span className="stat-label">Karma</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <span className="stat-value">{teamData.stats.projectsCompleted}</span>
                    <span className="stat-label">Portfolio Projects</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <span className="stat-value">{teamData.stats.averageRating}</span>
                    <span className="stat-label">Average Rating</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <span className="stat-value">{teamData.stats.members}</span>
                    <span className="stat-label">Members</span>
                  </div>
                </div>
              </section>

              <section className="content-card">
                <h3 className="card-title">About</h3>
                {teamData.about.length ? (
                  teamData.about.map((paragraph, index) => (
                    <p key={index} className="card-text">{paragraph}</p>
                  ))
                ) : (
                  <p className="card-text">No about content added yet.</p>
                )}
              </section>

              <section className="content-card">
                <h3 className="card-title">What We Do</h3>
                {teamData.whatWeDo.length ? (
                  teamData.whatWeDo.map((paragraph, index) => (
                    <p key={index} className="card-text">{paragraph}</p>
                  ))
                ) : (
                  <p className="card-text">No details added yet.</p>
                )}
              </section>

              <section className="skills-section">
                <h3 className="section-heading">Skills & Expertise</h3>
                <div className="skills-wrapper">
                  <button className="scroll-btn left" onClick={() => scrollHorizontal(skillsContainerRef, "left")}>◀</button>
                  <div className="skills-container scrollable" ref={skillsContainerRef}>
                    {teamData.skills.length ? (
                      teamData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span className="skill-tag">No skills added</span>
                    )}
                  </div>
                  <button className="scroll-btn right" onClick={() => scrollHorizontal(skillsContainerRef, "right")}>▶</button>
                </div>
              </section>

              <section className="tools-section">
                <h3 className="section-heading">Tools & Technologies</h3>
                <div className="skills-wrapper">
                  <button className="scroll-btn left" onClick={() => scrollHorizontal(toolsContainerRef, "left")}>◀</button>
                  <div className="tools-container scrollable" ref={toolsContainerRef}>
                    {teamData.tools.length ? (
                      teamData.tools.map((tool, index) => (
                        <span key={index} className="tool-tag">{tool}</span>
                      ))
                    ) : (
                      <span className="tool-tag">No tools added</span>
                    )}
                  </div>
                  <button className="scroll-btn right" onClick={() => scrollHorizontal(toolsContainerRef, "right")}>▶</button>
                </div>
              </section>

              <section className="languages-section">
                <h3 className="section-heading">Languages</h3>
                <div className="skills-wrapper">
                  <button className="scroll-btn left" onClick={() => scrollHorizontal(languagesContainerRef, "left")}>◀</button>
                  <div className="languages-list scrollable" ref={languagesContainerRef}>
                    {teamData.languages.length ? (
                      teamData.languages.map((lang, index) => (
                        <span key={index} className="language-item">{lang}</span>
                      ))
                    ) : (
                      <span className="language-item">No languages added</span>
                    )}
                  </div>
                  <button className="scroll-btn right" onClick={() => scrollHorizontal(languagesContainerRef, "right")}>▶</button>
                </div>
              </section>

              <section className="portfolio-section">
                <div className="portfolio-header">
                  <h3 className="portfolio-title">Portfolio</h3>
                  <div className="portfolio-header-line"></div>
                </div>

                {featuredProject ? (
                  <>
                    <div className="portfolio-featured-card">
                      <div className="portfolio-featured-image">
                        {featuredProject.image ? (
                          <img
                            src={featuredProject.image}
                            alt={featuredProject.title}
                            onClick={() => openViewer(0)}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <div className="w-full h-[260px] bg-[#eee]" />
                        )}
                      </div>

                      <div className="portfolio-featured-content">
                        <h4 className="portfolio-featured-title">{featuredProject.title}</h4>
                        <p className="portfolio-featured-desc">{featuredProject.description || "No description"}</p>
                        <div className="portfolio-featured-cost">
                          <span className="cost-label">Project cost</span>
                          <span className="cost-value">{featuredProject.cost}</span>
                        </div>
                      </div>
                    </div>

                    {activeItem && createPortal(
                      <div className="portfolio-modal-backdrop" onClick={() => setActiveItem(null)}>
                        <div className={`portfolio-modal-content ${theme}`} onClick={(e) => e.stopPropagation()}>
                          <div className="portfolio-modal-topbar">
                            <div className="portfolio-modal-brand">
                              <div className="portfolio-brand-circle"></div>
                              <span>Made by {teamData.name}</span>
                            </div>
                            <div className="portfolio-modal-nav">
                              <button className="nav-arrow left" onClick={prevProject}>◀</button>
                              <span className="portfolio-modal-counter">
                                {activeItemIndex + 1} of {allProjects.length}
                              </span>
                              <button className="nav-arrow right" onClick={nextProject}>▶</button>
                            </div>
                            <button className="portfolio-modal-close" onClick={() => setActiveItem(null)}>
                              ✕
                            </button>
                          </div>

                          <div className="portfolio-modal-info">
                            <div className="portfolio-info-header">
                              <h3>{activeItem.title}</h3>
                            </div>
                            <p>{activeItem.description || "No description"}</p>

                            <div className="portfolio-modal-cost">
                              <span className="cost-label">Project cost</span>
                              <span className="cost-value">{activeItem.cost}</span>
                            </div>
                          </div>

                          <div className="portfolio-modal-image">
                            {activeItem.image ? (
                              <img src={activeItem.image} alt={activeItem.title} />
                            ) : (
                              <div className="w-full h-[320px] bg-[#eee]" />
                            )}
                          </div>
                        </div>
                      </div>,
                      document.body
                    )}

                    {otherProjects.length > 0 && (
                      <div className="portfolio-grid-card">
                        <div className="portfolio-grid">
                          {otherProjects.map((item, index) => (
                            <div key={item.id || index} className="portfolio-item">
                              <div className="portfolio-item-image">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    onClick={() => openViewer(index + 1)}
                                    style={{ cursor: "pointer" }}
                                  />
                                ) : (
                                  <div className="w-full h-[180px] bg-[#eee]" />
                                )}
                              </div>

                              <div className="portfolio-item-info">
                                <div className="portfolio-item-left">
                                  <span className="portfolio-item-title">{item.title}</span>
                                  <span className="portfolio-item-desc">{item.description || "No description"}</span>
                                </div>

                                <div className="portfolio-item-right">
                                  <span className="cost-label">Project cost</span>
                                  <span className="cost-value">{item.cost}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="content-card">
                    <p className="card-text">No portfolio projects found.</p>
                  </div>
                )}
              </section>

              <section className="membersWrap">
                <div className="membersHeader">
                  <h3 className="membersTitle">Members</h3>
                  <div className="membersLine" />
                </div>

                <div className="membersPanel">
                  <div className="membersGrid">
                    {memberCards.length ? (
                      memberCards.map((m) => (
                        <div key={m.id} className="memberCard">
                          <div className="memberTop">
                            <div className="avatar">
                              <div className="w-full h-full rounded-full bg-[#CEFF1B] text-[#111] flex items-center justify-center font-semibold">
                                {toInitials(m.name)}
                              </div>
                            </div>
                            <div className="memberInfo">
                              <div className="memberName">{m.name}</div>
                              <div className="memberRole">{m.role}</div>
                            </div>
                          </div>

                          <div className="memberTag">{m.tag}</div>

                          <button
                            className="viewBtn"
                            type="button"
                            onClick={() => {
                              if (m.username) {
                                navigate(`/public-user-profile/${m.username}`);
                              }
                            }}
                            disabled={!m.username}
                          >
                            View Profile
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="card-text">No team members found.</p>
                    )}
                  </div>
                </div>
              </section>

              <section style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                  <div
                    style={{
                      padding: "12px 28px",
                      background: "#CEFF1B",
                      borderRadius: "15px",
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#222",
                    }}
                  >
                    Listings
                  </div>
                </div>

                <div className="content-card">
                  <p className="card-text">Listings API not connected yet.</p>
                </div>
              </section>

              <section className="reviews-section">
                <div className="reviews-header">
                  <h3 className="reviews-title">Reviews</h3>
                  <div className="reviews-header-line"></div>
                </div>

                <div className="content-card">
                  <p className="card-text">Reviews API not connected yet.</p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfileLight;