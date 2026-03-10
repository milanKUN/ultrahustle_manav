import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import "../../../pages/InReviewLight.css";
import "./TeamProfileLight.css";
import NavbarLight from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";


const UserProfile = (props) => {
  const navigate = useNavigate();
  // ✅ Theme via props (CreateTeam jaisa)
  const [activeItem, setActiveItem] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const toolsContainerRef = useRef(null);
  const languagesContainerRef = useRef(null);
  const [joinStatus, setJoinStatus] = useState("idle");
  const scrollHorizontal = (ref, direction) => {
    if (!ref?.current) return;
    const scrollAmount = 200;

    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const [localTheme, setLocalTheme] = useState("light");
  const theme = props.theme || localTheme;
  const setTheme = props.setTheme || setLocalTheme;
  const [isrequestsent, setIsRequestsent] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const [mainTab, setMainTab] = useState("listings"); // listings | projects
  const [filter, setFilter] = useState("All"); // All | Services | Products | Courses | Webinars

  const skillsContainerRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openFollowModal, setOpenFollowModal] = useState(false);

  // ✅ Activity Calendar state
  const [openActivityCalendar, setOpenActivityCalendar] = useState(false);
  const [activityDates, setActivityDates] = useState([
    "05-02-2026", "08-02-2026", "12-02-2026", "15-02-2026",
    "18-02-2026", "22-02-2026", "25-02-2026", "28-02-2026"
  ]); // Sample activity dates in DD-MM-YYYY format

  // ✅ Sidebar state (standardized with localStorage)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const contentRef = useRef(null);

  const handleDropdownChange = (isOpen) => setIsDropdownOpen(isOpen);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const members = [
    { id: 1, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
    { id: 2, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
    {
      id: 3,
      name: "Abigail Abigail",
      role: "Owner",
      tag: "Frontend Developer",
    },
    {
      id: 4,
      name: "Abigail Abigail",
      role: "Owner",
      tag: "Social Media Manager",
    },
    {
      id: 5,
      name: "Abigail Abigail",
      role: "Owner",
      tag: "Frontend Developer",
    },
    { id: 6, name: "Abigail Abigail", role: "Owner", tag: "Sales" },
    { id: 7, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
    { id: 8, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
    {
      id: 9,
      name: "Abigail Abigail",
      role: "Owner",
      tag: "Social Media Manager",
    },
  ];

  const handleScroll = useCallback(() => {
    // Placeholder for scroll spy if needed later
  }, []);


  // ✅ teamData / portfolioData / listingsData / reviewsData
  // (tumhara same data yahin rahega)
  const teamData = {
    name: " Name",
    username: "@Abigail_12",
    title: "Product Designer & Full-Stack Developer",
    location: "Kolkata, India",
    description:
      "Award-winning designer with 8+ years creating elegant, user-centered digital experiences. Specialized in design systems, mobile apps, and SaaS platforms.",
    availability: "Available for collaboration",
    stats: {
      karma: 200,
      projectsCompleted: 47,
      averageRating: 4.3,
      members: 30,
    },
    badges: ["Trusted Seller", "Fast Responder", "Quality Work"],
    hashtags: ["#UI/UX", "#Web Design", "#React", "#Figma", "#Mobile"],
    about: [
      "I'm a passionate product designer and full-stack developer with over 8 years of experience creating elegant, user-centered digital experiences.",
      "I specialize in bridging the gap between design and development, building pixel-perfect interfaces with clean, maintainable code.",
    ],
    whatWeDo: [
      "I'm a passionate product designer and full-stack developer with over 8 years of experience creating elegant, user-centered digital experiences.",
      "I specialize in bridging the gap between design and development, building pixel-perfect interfaces with clean, maintainable code.",
    ],
    skills: [
      "Product Design",
      "UI/UX Design",
      "Design Systems",
      "Mobile App Design",
      "Prototyping",
      "User Research",
      "Responsive Design",
      "Interaction Design",
    ],
    tools: [
      "Notion",
      "Tailwind CSS",
      "Photoshop",
      "Figma",
      "Illustrator",
      "TypeScript",
      "Webflow",
    ],
    languages: ["English", "Hindi", "Tamil",],
  };

  const teams = [
    {
      id: 1,
      name: "Design Systems Collective",
      role: "Lead Designer",
      members: 12,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "Design Systems Collective",
      role: "UI/UX Designer",
      members: 12,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 3,
      name: "Design Systems Collective",
      role: "Senior Designer",
      members: 12,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const portfolioData = {
    featured: {
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "SalonSync - Revolutionary AI-Powered Salon App UI/UX",
      description:
        "This project involves designing a next-generation salon mobile application with AI-powered recommendations.",
      cost: "$600-$800",
    },
    items: [
      {
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "Title",
        description: "Description",
        cost: "$",
      },
      {
        image:
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "E-commerce Dashboard Redesign",
        description: "This project involves designing more...",
        cost: "$600-$800",
      },
      {
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "E-commerce Dashboard Redesign",
        description: "This project involves designing more...",
        cost: "$600-$800",
      },
    ],
  };

  const listingsData = [
    {
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      title: "Complete UI/UX Design for Mobile & Web more...",
      type: "Service",
      views: 3247,
      price: "$2,500",
    },

    {
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80",
      title: "React & Frontend Development Course",
      type: "Course",
      views: 1890,
      price: "$99",
    },

    {
      image:
        "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=500&q=80",
      title: "E-commerce Website UI Kit",
      type: "Product",
      views: 2460,
      price: "$49",
    },

    {
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=80",
      title: "Growth Marketing Live Webinar",
      type: "Webinar",
      views: 870,
      price: "Free",
    },

    {
      image:
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=500&q=80",
      title: "Brand Identity & Logo Design",
      type: "Service",
      views: 1325,
      price: "$1,200",
    },

    {
      image:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=500&q=80",
      title: "Landing Page Conversion Template",
      type: "Product",
      views: 1640,
      price: "$29",
    },
  ];

  const reviewsData = {
    average: 4.9,
    total: 48,
    breakdown: { 5: 38, 4: 7, 3: 2, 2: 1, 1: 0 },
    reviews: [
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
      {
        name: "Emily Chen",
        date: "Nov 15, 2025",
        rating: 5,
        text: "Exceptional designer!",
      },
    ],
  };

  return (
    <div
      className={`team-profile-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}
    >
      {/* ✅ NAVBAR */}
      <NavbarLight
        className="create-team-navbar"
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
        onDropdownChange={handleDropdownChange}
      />

      <div className="pt-[85px] flex relative z-10">
        {/* ✅ SIDEBAR */}
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

        {/* ✅ MAIN CONTENT WRAPPER */}
        <div className="relative flex-1 min-w-5 overflow-hidden">
          {/* Scrollable Area */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]"
          >
            <main
              className={`inreview-main ${isDropdownOpen || activeItem ? "blurred" : ""} w-full min-w-0`}
            >
              {/* Profile Card */}
              <section className="profile-card">
                <div className="profile-left">
                  <div className="profile-avatar"></div>

                  <div className="profile-info">
                    <h1 className="profile-name">{teamData.name}</h1>
                    <span className="profile-username">
                      {teamData.username}
                    </span>

                    {/* 🔹 Meta line (ONLINE + dots) */}
                    <div className="profile-meta-line">
                      <span className="status-online">
                        <span className="online-dot"></span>
                        Online
                      </span>

                      <span className="meta-separator">•</span>
                      <span
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => setOpenFollowModal(true)}
                      >
                        123 Friends
                      </span>

                      <span className="meta-separator">•</span>
                      <span>Joined Oct 2025 {teamData.joined}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="btn-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Message
                  </button>

                  <button
                    className={`btn-join ${joinStatus === "sent" ? "sent" : ""}`}
                    onClick={() => setJoinStatus("sent")}
                    disabled={joinStatus === "sent"}
                  >
                    {joinStatus === "sent" ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <polyline points="16 11 18 13 22 9" />
                        </svg>
                        Followed
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" y1="8" x2="19" y2="14" />
                          <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                        Follow
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* Title & Badges Section */}
              <section className="title-badges-section">
                {/* LEFT */}
                <div className="title-left">
                  <h2 className="section-title">{teamData.title}</h2>
                  <p className="section-description">{teamData.description}</p>
                </div>

                {/* CENTER (Location + Availability) */}
                <div className="title-center">
                  <div className="info-stack">
                    {/* 📍 Location */}
                    <div className="profile-info-item">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="info-icon"
                      >
                        <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div className="info-badge location-badge">
                        <span className="info-label">Location:</span> {teamData.location}
                      </div>
                    </div>

                    {/* 🟢 Availability */}
                    <div className="profile-info-item">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="info-icon"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <div className="availability-badge">
                        {teamData.availability}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="title-right">
                  <div className="trust-badges">
                    {teamData.badges.map((badge, index) => (
                      <span key={index} className="trust-badge">
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="hashtags">
                    {teamData.hashtags.map((tag, index) => (
                      <span key={index} className="hashtag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Stats Section */}
              <section className="stats-section">
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="39"
                      height="43"
                      viewBox="0 0 39 43"
                      fill="none"
                    >
                      <path
                        d="M17.2348 41.0348C17.8518 41.3911 18.5517 41.5786 19.2641 41.5786C19.9766 41.5786 20.6765 41.3911 21.2935 41.0348L35.4989 32.9175C36.1153 32.5616 36.6272 32.0499 36.9834 31.4337C37.3396 30.8175 37.5275 30.1184 37.5282 29.4067V13.1719C37.5275 12.4602 37.3396 11.7611 36.9834 11.1449C36.6272 10.5287 36.1153 10.017 35.4989 9.66115L21.2935 1.54376C20.6765 1.18754 19.9766 1 19.2641 1C18.5517 1 17.8518 1.18754 17.2348 1.54376L3.02935 9.66115C2.41296 10.017 1.90099 10.5287 1.5448 11.1449C1.18861 11.7611 1.00073 12.4602 1 13.1719V29.4067C1.00073 30.1184 1.18861 30.8175 1.5448 31.4337C1.90099 32.0499 2.41296 32.5616 3.02935 32.9175L17.2348 41.0348Z"
                        stroke="#5C5C5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.2642 41.5825V21.2891"
                        stroke="#5C5C5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.58838 11.1423L19.264 21.2891L36.9396 11.1423"
                        stroke="#5C5C5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.1318 5.60242L28.3959 16.0536"
                        stroke="#5C5C5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{teamData.stats.karma}</span>
                    <span className="stat-label">Karma</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                    >
                      <path
                        d="M28.7181 12.2048C29.3574 15.3426 28.9018 18.6047 27.4271 21.4472C25.9524 24.2898 23.5477 26.5408 20.6142 27.825C17.6807 29.1091 14.3956 29.3488 11.3067 28.504C8.21787 27.6593 5.51198 25.7811 3.6403 23.1827C1.76863 20.5844 0.844292 17.4229 1.02145 14.2255C1.19861 11.0281 2.46655 7.98808 4.61383 5.6124C6.7611 3.23672 9.65792 1.66897 12.8212 1.1706C15.9845 0.672238 19.223 1.27337 21.9967 2.87377"
                        stroke="#5C5C5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.7964 13.6048L14.9964 17.8048L28.9964 3.80481"
                        stroke="#5C5C5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {teamData.stats.projectsCompleted}
                    </span>
                    <span className="stat-label">Projects Completed</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="41"
                      height="39"
                      viewBox="0 0 41 39"
                      fill="none"
                    >
                      <path
                        d="M19.4821 1.5721C19.5671 1.40033 19.6984 1.25574 19.8613 1.15466C20.0241 1.05357 20.2119 1 20.4036 1C20.5952 1 20.7831 1.05357 20.9459 1.15466C21.1087 1.25574 21.2401 1.40033 21.3251 1.5721L25.8065 10.6494C26.1017 11.2469 26.5375 11.7638 27.0765 12.1557C27.6155 12.5477 28.2415 12.803 28.9008 12.8998L38.9229 14.3665C39.1128 14.394 39.2912 14.4741 39.438 14.5977C39.5847 14.7213 39.6939 14.8836 39.7533 15.066C39.8126 15.2485 39.8197 15.444 39.7738 15.6303C39.7278 15.8166 39.6307 15.9863 39.4933 16.1202L32.2454 23.178C31.7674 23.6438 31.4098 24.2188 31.2033 24.8534C30.9968 25.4881 30.9477 26.1634 31.0601 26.8213L32.7712 36.793C32.8047 36.9828 32.7842 37.1782 32.712 37.3569C32.6398 37.5356 32.5188 37.6904 32.3629 37.8037C32.2069 37.917 32.0223 37.9841 31.83 37.9975C31.6377 38.0109 31.4455 37.97 31.2754 37.8794L22.3164 33.169C21.7261 32.8591 21.0694 32.6971 20.4026 32.6971C19.7359 32.6971 19.0791 32.8591 18.4888 33.169L9.53177 37.8794C9.3617 37.9694 9.16976 38.0099 8.97781 37.9963C8.78585 37.9826 8.60157 37.9154 8.44594 37.8022C8.29031 37.689 8.16956 37.5344 8.09744 37.356C8.02532 37.1776 8.00471 36.9825 8.03797 36.793L9.74711 26.8233C9.86002 26.1651 9.8111 25.4893 9.6046 24.8542C9.39809 24.2192 9.04019 23.6439 8.56177 23.178L1.31389 16.1222C1.17536 15.9884 1.0772 15.8184 1.03058 15.6315C0.983959 15.4446 0.990759 15.2484 1.0502 15.0652C1.10965 14.882 1.21935 14.7192 1.36681 14.5953C1.51427 14.4715 1.69356 14.3915 1.88426 14.3645L11.9044 12.8998C12.5645 12.8038 13.1914 12.5488 13.7311 12.1568C14.2708 11.7647 14.7071 11.2475 15.0026 10.6494L19.4821 1.5721Z"
                        stroke="#5C5C5C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {teamData.stats.averageRating}
                    </span>
                    <span className="stat-label">Average Rating</span>
                  </div>
                </div>
                <div
                  className="stat-card"
                  onClick={() => setOpenActivityCalendar(true)}
                  style={{ cursor: "pointer" }}
                >
                  {/* ✅ DOTS ICON — green dots based on activityDates */}
                  <div className="">
                    <div className="activity-dots" aria-hidden="true">
                      {(() => {
                        const now = new Date();
                        const currentMonth = now.getMonth() + 1; // 1-12
                        const currentYear = now.getFullYear();
                        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

                        // Extract active day numbers for current month
                        const activeDays = new Set(
                          activityDates
                            .filter((d) => {
                              const [dd, mm, yyyy] = d.split("-").map(Number);
                              return mm === currentMonth && yyyy === currentYear;
                            })
                            .map((d) => parseInt(d.split("-")[0], 10))
                        );

                        return Array.from({ length: daysInMonth }).map((_, i) => (
                          <span key={i} className={`dot ${activeDays.has(i + 1) ? "on" : ""}`} />
                        ));
                      })()}
                    </div>
                  </div>

                  {/* ✅ content */}
                  <div className="stat-content">
                    <span className="stat-value">
                      {activityDates.filter((d) => {
                        const [, mm, yyyy] = d.split("-").map(Number);
                        const now = new Date();
                        return mm === now.getMonth() + 1 && yyyy === now.getFullYear();
                      }).length}
                    </span>
                    <span className="stat-label">Activity Time</span>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="content-card">
                <h3 className="card-title">About</h3>
                {teamData.about.map((paragraph, index) => (
                  <p key={index} className="card-text">
                    {paragraph}
                  </p>
                ))}
              </section>



              {/* Skills & Expertise Section */}
              <section className="skills-section">
                <h3 className="section-heading">Skills & Expertise</h3>
                <div className="skills-wrapper">
                  <button
                    className="scroll-btn left"
                    onClick={() => scrollHorizontal(skillsContainerRef, "left")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <circle cx="12.5" cy="12.5" r="12.5" fill="#CEFF1B" />
                      <path
                        d="M15 18L9 13L15 8"
                        stroke="#2B2B2B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="skills-container scrollable" ref={skillsContainerRef}>
                    {teamData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    className="scroll-btn right"
                    onClick={() => scrollHorizontal(skillsContainerRef, "right")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <circle cx="12.5" cy="12.5" r="12.5" fill="#CEFF1B" />
                      <path
                        d="M10 8L16 13L10 18"
                        stroke="#2B2B2B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </section>

              {/* Tools & Technologies Section */}
              <section className="tools-section">
                <h3 className="section-heading">Tools & Technologies</h3>

                <div className="skills-wrapper">
                  {/* LEFT ARROW */}
                  <button
                    className="scroll-btn left"
                    onClick={() => scrollHorizontal(toolsContainerRef, "left")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <circle cx="12.5" cy="12.5" r="12.5" fill="#CEFF1B" />
                      <path
                        d="M15 18L9 13L15 8"
                        stroke="#2B2B2B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* CONTENT */}
                  <div
                    className="tools-container scrollable"
                    ref={toolsContainerRef}
                  >
                    {teamData.tools.map((tool, index) => (
                      <span key={index} className="tool-tag">
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* RIGHT ARROW */}
                  <button
                    className="scroll-btn right"
                    onClick={() => scrollHorizontal(toolsContainerRef, "right")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <circle cx="12.5" cy="12.5" r="12.5" fill="#CEFF1B" />
                      <path
                        d="M10 8L16 13L10 18"
                        stroke="#2B2B2B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </section>

              {/* Languages Section */}
              <section className="languages-section">
                <h3 className="section-heading">Languages</h3>

                <div className="skills-wrapper">
                  {/* LEFT ARROW */}
                  <button
                    className="scroll-btn left"
                    onClick={() =>
                      scrollHorizontal(languagesContainerRef, "left")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <circle cx="12.5" cy="12.5" r="12.5" fill="#CEFF1B" />
                      <path
                        d="M15 18L9 13L15 8"
                        stroke="#2B2B2B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* CONTENT */}
                  <div
                    className="languages-list scrollable"
                    ref={languagesContainerRef}
                  >
                    {teamData.languages.map((lang, index) => (
                      <span key={index} className="language-item">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* RIGHT ARROW */}
                  <button
                    className="scroll-btn right"
                    onClick={() =>
                      scrollHorizontal(languagesContainerRef, "right")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <circle cx="12.5" cy="12.5" r="12.5" fill="#CEFF1B" />
                      <path
                        d="M10 8L16 13L10 18"
                        stroke="#2B2B2B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </section>

              {/* My Portfolio Section */}
              <section className="portfolio-section">
                <div className="portfolio-header">
                  <h3 className="portfolio-title">My Portfolio</h3>
                  <div className="portfolio-header-line"></div>
                </div>

                {/* ✅ Featured Portfolio Item */}
                <div className="portfolio-featured-card">
                  <div className="portfolio-featured-image">
                    <img
                      src={portfolioData.featured.image}
                      alt={portfolioData.featured.title}
                      onClick={() => {
                        const allItems = [portfolioData.featured, ...portfolioData.items];
                        setActiveItemIndex(0);
                        setActiveItem(allItems[0]);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </div>

                  <div className="portfolio-featured-content">
                    <h4 className="portfolio-featured-title">
                      {portfolioData.featured.title}
                    </h4>
                    <p className="portfolio-featured-desc">
                      {portfolioData.featured.description}
                    </p>
                    <div className="portfolio-featured-cost">
                      <span className="cost-label">Project cost</span>
                      <span className="cost-value">
                        {portfolioData.featured.cost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ POPUP MODAL */}
                {activeItem && createPortal(
                  <div className="portfolio-modal-backdrop" onClick={() => setActiveItem(null)}>
                    <div
                      className={`portfolio-modal-content ${theme}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* 🔝 Top Bar */}
                      <div className="portfolio-modal-topbar">
                        <div className="portfolio-modal-brand">
                          <div className="portfolio-brand-circle"></div>
                          <span>Made by Name</span>
                        </div>

                        {/* Right Actions: Arrows + Close */}
                        <div className="flex items-center gap-4">
                          <div className="portfolio-modal-nav">
                            <button
                              className="nav-arrow left"
                              onClick={() => {
                                const allItems = [portfolioData.featured, ...portfolioData.items];
                                const prevIndex = activeItemIndex > 0 ? activeItemIndex - 1 : allItems.length - 1;
                                setActiveItemIndex(prevIndex);
                                setActiveItem(allItems[prevIndex]);
                              }}
                            >◀</button>
                            <span className="portfolio-modal-counter">
                              {activeItemIndex + 1} of {[portfolioData.featured, ...portfolioData.items].length}
                            </span>
                            <button
                              className="nav-arrow right"
                              onClick={() => {
                                const allItems = [portfolioData.featured, ...portfolioData.items];
                                const nextIndex = activeItemIndex < allItems.length - 1 ? activeItemIndex + 1 : 0;
                                setActiveItemIndex(nextIndex);
                                setActiveItem(allItems[nextIndex]);
                              }}
                            >▶</button>
                          </div>

                          <button
                            className="portfolio-modal-close"
                            onClick={() => setActiveItem(null)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* 📝 Info */}
                      <div className="portfolio-modal-info">
                        <div className="portfolio-info-header">
                          <h3>{activeItem.title}</h3>

                        </div>
                        <p>{activeItem.description}</p>

                        <div className="portfolio-modal-cost">
                          <span className="cost-label">Project cost</span>
                          <span className="cost-value">{activeItem.cost}</span>
                        </div>
                      </div>

                      {/* 🖼 Main Image */}
                      <div className="portfolio-modal-image">
                        <img src={activeItem.image} alt={activeItem.title} />
                      </div>

                      {/* 🧩 Thumbnails */}
                      <div className="portfolio-modal-thumbs">
                        {[
                          activeItem.image,
                          activeItem.image,
                          activeItem.image,
                          activeItem.image,
                          activeItem.image,
                          activeItem.image,
                        ].map((img, i) => (
                          <img key={i} src={img} alt={`thumb-${i}`} />
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}

                {/* ✅ Portfolio Grid */}
                <div className="portfolio-grid-card">
                  <div className="portfolio-grid">
                    {portfolioData.items.map((item, index) => (
                      <div key={index} className="portfolio-item">
                        <div className="portfolio-item-image">
                          <img
                            src={item.image}
                            alt={item.title}
                            onClick={() => {
                              const allItems = [portfolioData.featured, ...portfolioData.items];
                              setActiveItemIndex(index + 1);
                              setActiveItem(allItems[index + 1]);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </div>

                        <div className="portfolio-item-info">
                          <div className="portfolio-item-left">
                            <span className="portfolio-item-title">
                              {item.title}
                            </span>
                            <span className="portfolio-item-desc">
                              {item.description}
                            </span>
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
              </section>

              {/* Listings Section */}
              < section style={{ width: "100%" }}>
                {/* ================= TOP CONTROLS ================= */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  {/* Switch */}
                  <div
                    style={{
                      maxWidth: "560px",
                      height: "56px",
                      background: "#CEFF1B",
                      borderRadius: "18px",
                      padding: "6px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                    }}
                  >
                    <button
                      onClick={() => setMainTab("listings")}
                      style={{
                        background: mainTab === "listings" ? "#fff" : "transparent",
                        borderRadius: "14px",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#000",
                        cursor: "pointer",
                      }}
                    >
                      Listings
                    </button>
                    <button
                      onClick={() => setMainTab("projects")}
                      style={{
                        background: mainTab === "projects" ? "#fff" : "transparent",
                        borderRadius: "14px",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#000",
                        cursor: "pointer",
                      }}
                    >
                      Projects
                    </button>
                  </div>

                  {/* Pills */}
                  <div
                    style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
                  >
                    {["All", "Services", "Products", "Courses", "Webinars"].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => setFilter(item)}
                          style={{
                            padding: "12px 26px",
                            borderRadius: "999px",
                            border: filter === item ? "1px solid #ddd" : "none",
                            cursor: "pointer",
                            background:
                              filter === item
                                ? "#fff"
                                : "linear-gradient(#f5f5f5,#e9e9e9)",
                            boxShadow:
                              "inset 0 1px 0 rgba(255,255,255,.9),0 2px 8px rgba(0,0,0,.06)",
                            fontSize: "15px",
                            fontWeight: "500",
                            color: "#000",
                          }}
                        >
                          {item}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* ================= CONTENT ================= */}
                {mainTab === "listings" ? (
                  <div className="listings-grid">
                    {listingsData
                      .filter((l) => {
                        if (filter === "All") return true;
                        return l.type === filter.slice(0, -1);
                      })
                      .map((listing, index) => (
                        <div key={index} className="listing-card">
                          <div className="listing-image">
                            <img src={listing.image} alt={listing.title} />

                            <button className="listing-nav-btn left">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                              </svg>
                            </button>
                            <button className="listing-nav-btn right">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </button>
                          </div>

                          <div className="listing-info">
                            <div className="listing-title-row">
                              <h4 className="listing-title">{listing.title}</h4>
                              <span className="listing-type">{listing.type}</span>
                            </div>

                            <div className="listing-meta">
                              <div className="listing-views">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>{listing.views} views</span>
                              </div>
                              <div className="listing-price">{listing.price}</div>
                            </div>
                          </div>

                          <div className="listing-actions">
                            <button className="btn-view-listing">View Listing</button>
                            <button
                              className="btn-favorite"
                              onClick={() => toggleFavorite(index)}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24"
                                fill={favorites.has(index) ? "#ef4444" : "none"}
                                stroke={favorites.has(index) ? "#ef4444" : "currentColor"}
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  /* ================= EMPTY PROJECTS ================= */
                  <div
                    style={{
                      padding: "80px 20px",
                      textAlign: "center",
                      color: "#777",
                      fontSize: "16px",
                    }}
                  >
                    No projects / purchases yet.
                  </div>
                )}
              </section>

              {/* Reviews Section */}
              <section className="reviews-section">
                <div className="reviews-header">
                  <h3 className="reviews-title">Reviews</h3>
                  <div className="reviews-header-line"></div>
                </div>

                <div className="reviews-container">
                  {/* Left Side - Rating Summary */}
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <span className="rating-score">
                        {reviewsData.average}
                      </span>
                      <div className="rating-stars">
                        {(() => {
                          const starColor = theme === "dark" || theme === "dark-theme" ? "#ceff1b" : "#FFA500";
                          return [1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={
                                star <= Math.round(reviewsData.average)
                                  ? starColor
                                  : "none"
                              }
                              stroke={starColor}
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ));
                        })()}
                      </div>
                      <span className="review-count">
                        ({reviewsData.total} reviews)
                      </span>
                    </div>

                    <div className="rating-breakdown">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="rating-bar-row">
                          <span className="rating-label">
                            {rating} <span style={{ color: theme === "dark" || theme === "dark-theme" ? "#ceff1b" : "#FFA500" }}>★</span>
                          </span>
                          <div className="rating-bar">
                            <div
                              className="rating-bar-fill"
                              style={{
                                width: `${(reviewsData.breakdown[rating] / reviewsData.total) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="rating-count">
                            {reviewsData.breakdown[rating]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Reviews List */}
                  <div className="reviews-list">
                    {reviewsData.reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-avatar"></div>
                          <div className="reviewer-info">
                            <span className="reviewer-name">{review.name}</span>
                            <div className="review-stars">
                              {(() => {
                                const starColor = theme === "dark" || theme === "dark-theme" ? "#ceff1b" : "#FFA500";
                                return [1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill={
                                      star <= review.rating ? starColor : "none"
                                    }
                                    stroke={starColor}
                                    strokeWidth="2"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ));
                              })()}
                            </div>
                          </div>
                          <span className="review-date">{review.date}</span>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section
                className={`${theme === "dark" ? "user-page-dark" : ""}`}
              >
                {/* ✅ OUTER BOX */}
                <div className="teamsWrap">
                  <h3 className="teamsTitle">Teams</h3>

                  <div className="teamsRow">
                    {teams.map((t) => (
                      <div className="teamCard" key={t.id}>
                        <div className="teamTop">
                          <img
                            className="teamAvatar"
                            src={t.avatar}
                            alt={t.name}
                          />

                          <div className="teamMeta">
                            <div className="teamName">{t.name}</div>
                            <span className="teamRolePill">{t.role}</span>

                            <div className="teamMembersRow">
                              <span className="teamUsersIcon">
                                {/* icon */}
                              </span>
                              <span className="teamMembersText">
                                {t.members} members
                              </span>
                            </div>
                          </div>
                        </div>

                        <button className="teamBtn" type="button" onClick={() => navigate('/public-team-profile')}>
                          View Team
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      {/* ================= ACTIVITY CALENDAR MODAL ================= */}
      {openActivityCalendar && (
        <ActivityCalendar
          onClose={() => setOpenActivityCalendar(false)}
          activityDates={activityDates}
          theme={theme}
        />
      )}

      {/* ================= FOLLOWERS / FOLLOWING MODAL ================= */}
      {openFollowModal && (
        <FollowModal
          onClose={() => setOpenFollowModal(false)}
          theme={theme}
        />
      )}
    </div >
  );
};

/* ================= FOLLOWERS / FOLLOWING MODAL ================= */

function FollowModal({ onClose, theme }) {
  const [tab, setTab] = useState("followers");

  const [followersList, setFollowersList] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: "User Name",
    }))
  );

  const [followingList, setFollowingList] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 100,
      name: "User Name",
    }))
  );

  const removeFollower = (id) => {
    setFollowersList(followersList.filter((u) => u.id !== id));
  };

  const removeFollowing = (id) => {
    setFollowingList(followingList.filter((u) => u.id !== id));
  };

  const currentList = tab === "followers" ? followersList : followingList;

  return (
    <div
      className="
        z-50 flex
        md:mt-20 p-4 md:p-0
        bg-black/60
        backdrop-blur-sm
        fixed inset-0 items-center justify-center friend-modal
      "
      onClick={onClose}
    >
      <div
        className={`w-[95%] max-w-[620px] max-h-[90vh] p-5 md:p-8 rounded-[16px] flex flex-col friend-modal-card relative bg-white dark:bg-[#121212] border-2 border-[#CEFF1B] shadow-[0_0_40px_rgba(206,255,27,0.5)] dark:shadow-[0_0_50px_rgba(206,255,27,0.6)] transition-colors ${theme === "dark" || theme === "dark-theme" ? "dark" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-gray-600 text-lg absolute top-4 right-4"
        >
          ✕
        </button>

        {/* TABS */}
        <div className="flex flex-wrap mb-1 md:mb-3 font-semibold justify-center gap-4 md:gap-16">
          <button
            onClick={() => setTab("followers")}
            className={`px-5 py-1.5 rounded-lg ${tab === "followers" ? "bg-[#CEFF1B] text-black" : ""}`}

          >
            Followers
          </button>
          <button
            onClick={() => setTab("following")}
            className={`px-5 py-1.5 rounded-lg ${tab === "following" ? "bg-[#CEFF1B] text-black" : ""}`}

          >
            Following
          </button>
        </div>

        <div className="h-[1px] mb-2 md:mb-3 bg-[#000000] divider" />

        {/* SEARCH */}
        <div className="mb-3 md:mb-5 relative">
          <input
            placeholder="Search here"
            className="w-full px-5 py-2.5 text-sm text-left bg-white rounded-full border border-gray-300 placeholder:text-center focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          <span className="text-gray-500 pointer-events-none absolute right-5 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        {/* LIST */}
        <div className="overflow-y-auto max-h-[360px] pr-2 space-y-5 custom-scroll">
          {currentList.map((u) => (
            <div key={u.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 pr-2">
                <div className="w-9 h-9 md:w-11 md:h-11 shrink-0 bg-[#D9D9D9] rounded-full" />
                <span className="text-xs md:text-sm font-medium truncate">{u.name}</span>
              </div>

              {tab === "followers" ? (
                <div className="flex gap-2">
                  <button className="px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs bg-[#CEFF1B] rounded-md text-black whitespace-nowrap font-medium">
                    Follow Back
                  </button>
                  <button
                    onClick={() => removeFollower(u.id)}
                    className="px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs border rounded-md whitespace-nowrap font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => removeFollowing(u.id)}
                    className="px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs border rounded-md whitespace-nowrap font-medium"
                  >
                    Unfollow
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= ACTIVITY CALENDAR COMPONENT ================= */

function ActivityCalendar({ onClose, activityDates, theme }) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [openYear, setOpenYear] = useState(false);
  const yearRef = useRef(null);

  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setOpenYear(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeYear = (dir) => {
    if (dir === "prev") setYear(y => y - 1);
    else setYear(y => y + 1);
  };


  const hasActivity = (day, mIndex, y) => {
    const formatted = `${String(day).padStart(2, "0")}-${String(mIndex + 1).padStart(2, "0")}-${y}`;
    return activityDates.includes(formatted);
  };

  // Ensure modal prevents background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/20 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#121212] w-full max-w-[1240px] h-auto max-h-[90vh] md:h-[90vh] rounded-[16px] flex flex-col relative border-2 border-[#CEFF1B] dark:border-[#CEFF1B] shadow-[0_0_40px_rgba(206,255,27,0.5)] dark:shadow-[0_0_50px_rgba(206,255,27,0.6)] overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LIME GREEN HEADER */}
        <div className="bg-[#CEFF1B] w-full py-2 sm:py-3 px-6 flex justify-center items-center shrink-0 relative z-10 transition-colors">
          <div className="flex items-center gap-2 relative">
            {/* Year Navigation Prev */}
            <button
              onClick={() => changeYear("prev")}
              className="flex w-8 h-8 md:w-6 md:h-6 sm:w-8 sm:h-8 items-center justify-center hover:bg-black/10 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>

            <div className={`onboarding-custom-select ${openYear ? "active" : ""}`} style={{ width: "140px" }} ref={yearRef}>
              <div
                className={`onboarding-selected-option activity-year-trigger ${openYear ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenYear(!openYear);
                }}
                style={{
                  background: "#CEFF1B",
                  color: "#000",
                  fontWeight: "900",
                  borderRadius: "8px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  fontSize: "18px"
                }}
              >
                <span>{year}</span>
                <span className="onboarding-arrow" style={{ marginLeft: "8px", fontSize: "10px" }}>▼</span>
              </div>

              {openYear && (
                <ul
                  className="onboarding-options-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: theme === "dark" || theme === "dark-theme" ? "#1A1A1A" : "#FFFFFF",
                    border: "1px solid #000",
                    borderRadius: "8px",
                    marginTop: "4px",
                    zIndex: 100
                  }}
                >
                  {years.map((y) => (
                    <li
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setOpenYear(false);
                      }}
                      className={year === y ? "active" : ""}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        color: theme === "dark" || theme === "dark-theme" ? "#FFFFFF" : "#000000",
                        fontSize: "16px",
                        backgroundColor: year === y ? "#CEFF1B" : "transparent"
                      }}
                    >
                      {y}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Year Navigation Next */}
            <button
              onClick={() => changeYear("next")}
              className="flex w-8 h-8 md:w-6 md:h-6 sm:w-8 sm:h-8 items-center justify-center hover:bg-black/10 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="flex md:hidden w-8 h-8 items-center justify-center hover:bg-black/10 rounded-full transition-colors absolute right-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* MONTH GRID */}
        <div className="overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-3 bg-white dark:bg-[#121212] items-stretch transition-colors flex-1 min-h-0 custom-scroll">
          {months.map((monthName, mIndex) => {
            const firstDay = new Date(year, mIndex, 1).getDay();
            const totalDays = new Date(year, mIndex + 1, 0).getDate();

            return (
              <div
                key={monthName}
                className="flex bg-white dark:bg-[#1A1A1A] rounded-[8px] p-3 border border-gray-200 dark:border-[#333333] flex-col items-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-sm dark:shadow-none min-h-[250px] md:min-h-0"
                style={{ height: "auto" }}>
                {/* Month Name */}
                <div className="w-full flex justify-center items-center mb-1 text-[11px] font-bold text-black dark:text-white">
                  <span className="text-black dark:text-white">{monthName}</span>
                </div>

                {/* Weekdays */}
                <div className="w-full grid grid-cols-7 text-[7px] md:text-[8px] font-bold text-gray-500 dark:text-gray-500 mb-0.5 tracking-wider">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
                    <div key={d} className="flex justify-center text-center">{d}</div>
                  ))}
                </div>

                {/* Dates Container */}
                <div className="w-full flex-1 flex flex-col justify-between">
                  {Array.from({ length: 6 }).map((_, rIndex) => (
                    <div key={`row-${rIndex}`} className="w-full grid grid-cols-7 gap-y-[1px]">
                      {Array.from({ length: 7 }).map((_, cIndex) => {
                        const cellIndex = rIndex * 7 + cIndex;
                        const dayNumber = cellIndex - firstDay + 1;

                        let content = "";
                        let isActive = false;
                        let cssClasses = "flex justify-center items-center h-[18px] sm:h-[22px] text-[10px] md:text-[11px] font-medium transition-colors ";

                        if (cellIndex >= firstDay && dayNumber <= totalDays) {
                          content = dayNumber;
                          cssClasses += "text-black dark:text-gray-300";
                          isActive = hasActivity(dayNumber, mIndex, year);
                        }

                        return (
                          <div key={`cell-${cellIndex}`} className={cssClasses}>
                            <div className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] flex items-center justify-center rounded-full transition-colors ${isActive ? "bg-[#CEFF1B] text-black font-extrabold shadow-sm" : ""}`}>
                              {content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
