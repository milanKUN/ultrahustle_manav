import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./NavbarLight.css";
import { logout } from "../../features/auth/api/authApi";
import { getUserName, getMyPersonalInfo } from "../../features/dashboard/api/personalInfoApi";
import defaultAvatar from "./default-avatar.png";

const NavbarLight = ({ onDropdownChange, theme = "light", toggleSidebar, isSidebarOpen: externalIsSidebarOpen }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 950 : false
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [activeSearchTab, setActiveSearchTab] = useState("");
  const [activeViewAll, setActiveViewAll] = useState(null);
  const [username, setUsername] = useState("");
  // ✅ (optional) input value
  const [searchQuery, setSearchQuery] = useState("");
  const [avatar, setAvatar] = useState("");
  const resolvedSidebarOpen =
    externalIsSidebarOpen !== undefined
      ? externalIsSidebarOpen
      : isSidebarOpen;
  const isAnyDropdownOpen =
    isDropdownOpen || isMessagesOpen || isNotificationsOpen || isSearchOpen;

  // Notify parent about dropdown state changes
  const notifyParent = (isOpen) => {
    if (onDropdownChange) onDropdownChange(isOpen);
  };

  const handleSidebarToggle = () => {
    if (toggleSidebar) {
      toggleSidebar();
      return;
    }

    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    setIsMessagesOpen(false);
    setIsNotificationsOpen(false);
    setIsSearchOpen(false);
    notifyParent(newState);
  };

  const toggleMessages = () => {
    const newState = !isMessagesOpen;
    setIsMessagesOpen(newState);
    setIsDropdownOpen(false);
    setIsNotificationsOpen(false);
    setIsSearchOpen(false);
    notifyParent(newState);
  };

  const toggleNotifications = () => {
    const newState = !isNotificationsOpen;
    setIsNotificationsOpen(newState);
    setIsDropdownOpen(false);
    setIsMessagesOpen(false);
    setIsSearchOpen(false);
    notifyParent(newState);
  };

  const toggleSearch = () => {
    const newState = !isSearchOpen;
    setIsSearchOpen(newState);
    setIsDropdownOpen(false);
    setIsMessagesOpen(false);
    setIsNotificationsOpen(false);
    notifyParent(newState);
  };

  const closeAllDropdowns = () => {
    setIsDropdownOpen(false);
    setIsMessagesOpen(false);
    setIsNotificationsOpen(false);
    setIsSearchOpen(false);
    notifyParent(false);
  };

  // ✅ close on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeAllDropdowns();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileViewport(window.innerWidth <= 950);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //get user full name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await getUserName();
        // console.log(res.full_name);
        setUsername(res.full_name);
      } catch (error) {
        console.error("Failed to fetch username", error);
      }
    };

    fetchUserName();
  }, []);

  /* useEffect(() => {
    try {
      const onboarding = JSON.parse(localStorage.getItem("onboarding"));
      if (onboarding?.username) {
        setUsername(onboarding.username);
      }
    } catch (e) {
      console.error("Invalid onboarding data");
    }
  }, []); */

  const loadPersonalInfo = async () => {
    const info = await getMyPersonalInfo();
    const data = info?.data ?? [];
    setAvatar(data.avatar_url);
  };

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  // Sample messages data
  const messagesData = [
    { id: 1, name: "John Smith", text: "Thanks for your help!", time: "2m ago" },
  ];


  // Sample notifications data
  const notificationsData = [
    { id: 1, text: "You have 5 save on your listings", time: "2m ago" },
  ];

  // ✅ Tabs
  const searchTabs = [
    "Service",
    "Digital Products",
    "Webinars",
    "Course",
    "Team",
    "Profile",
  ];

  // ✅ Category wise results (Team & User are different like you asked)
  const resultsByTab = useMemo(
    () => ({
      Service: [
        {
          id: 1,
          title: "Service Listings (Title)",
          description: "Service description",
          category: "Service",
        },
      ],
      "Digital Products": [
        {
          id: 11,
          title: "UI Kit (Title)",
          description: "Figma UI kit for dashboards",
          category: "Digital Products",
          avatarColor: "#5B5B5B",
        },
      ],
      Webinars: [
        {
          id: 21,
          title: "Webinar Listing (Title)",
          description: "Live session description",
          category: "Webinars",
        },
      ],
      Course: [
        {
          id: 31,
          title: "Course Listing (Title)",
          description: "Course description",
          category: "Course",
        },
      ],

      // ✅ TEAM TAB (Team Name + Description)
      Team: [
        {
          id: 101,
          title: "Ultra Hustle Team",
          description: "Product design + full-stack dev team",
          category: "Team",
        },
      ],

      // ✅ USER TAB (User Name + Description)
      Profile: [
        {
          id: 201,
          title: "Rahul Sharma",
          description: "UI/UX Designer • India",
          category: "Profile",
        }
      ],
    }),
    [],
  );

  // ✅ take results for active tab
  const activeResultsRaw = resultsByTab[activeSearchTab] || [];

  // ✅ simple filtering by input text (optional but good)
  const activeResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeResultsRaw;
    return activeResultsRaw.filter((r) => {
      const t = `${r.title} ${r.description}`.toLowerCase();
      return t.includes(q);
    });
  }, [activeResultsRaw, searchQuery]);

  return (
    <>
      {/* Header/Navbar */}
      <header className={`inreview-header border-b border-[#CEFF1B] shadow-[0_2px_12px_3px_rgba(206,255,  27,0.35)] backdrop-blur-xl bg-gradient-to-r from-[#D9D9D9] via-[#CFCFCF] to-[#C6C6C6] ${theme} !z-[200] pointer-events-auto`}>
        <div className="header-left">
          {isMobileViewport && (
            <button
              className="hamburger-btn"
              onClick={handleSidebarToggle}
              aria-label={
                resolvedSidebarOpen
                  ? "Close sidebar"
                  : "Open sidebar"
              }
            >
              {resolvedSidebarOpen ? (
                <X size={20} strokeWidth={2.3} />
              ) : (
                <Menu size={20} strokeWidth={2.3} />
              )}
            </button>
          )}

          <Link to="/">
            <img src="/logo.png" alt="UltraHustle" className="logo" />
          </Link>

          <nav className="nav-menu">
            <Link to="/" className="nav-item">
              <span className={`nav-pill ${location.pathname === "/" ? "active" : ""}`}></span>
              <span className="nav-text">Home</span>
            </Link>
            <Link to="/dashboard" className="nav-item">
              <span className={`nav-pill ${location.pathname === "/dashboard" ? "active" : ""}`}></span>
              <span className="nav-text">Dashboard</span>
            </Link>
            <Link to="/marketplace" className="nav-item">
              <span className={`nav-pill ${location.pathname === "/marketplace" ? "active" : ""}`}></span>
              <span className="nav-text">Marketplace</span>
            </Link>
          </nav>
        </div>

        <div className="search-wrapper">
          <div className="header-search">
            <input
              type="text"
              className="search-input font-roboto "
              placeholder={`Search ${activeSearchTab}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={toggleSearch}
            />

            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>

          {isSearchOpen && (
            <div className="search-dropdown">
              <div className="search-tabs">
                {searchTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`search-tab ${activeSearchTab === tab ? "active" : ""}`}
                    onClick={() => setActiveSearchTab(tab)}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="search-results">
                {activeResults.length === 0 ? (
                  <div className="search-empty">No results found</div>
                ) : (
                  activeResults.map((result) => (
                    <div key={result.id} className="search-result-item">
                      <div
                        className="search-result-avatar"
                        style={
                          result.avatarColor
                            ? { background: result.avatarColor }
                            : {}
                        }
                      ></div>

                      <div className="search-result-content">
                        <span className="search-result-title">
                          {result.title}
                        </span>
                        <span className="search-result-description">
                          {result.description}
                        </span>
                      </div>

                      {activeSearchTab !== "Team" &&
                        activeSearchTab !== "Profile" && (
                          <div className="ai-powered-badge">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                            >
                              <path
                                d="M8.872 9.695L7.986 12.794C7.654 13.954 6.01 13.954 5.678 12.794L4.793 9.695C4.73697 9.49896 4.63191 9.32043 4.48774 9.17626C4.34357 9.03209 4.16504 8.92703 3.969 8.871L0.87 7.986C-0.29 7.654 -0.29 6.01 0.87 5.678L3.969 4.793C4.16504 4.73697 4.34357 4.63191 4.48774 4.48774C4.63191 4.34357 4.73697 4.16504 4.793 3.969L5.678 0.87C6.01 -0.29 7.654 -0.29 7.986 0.87L8.871 3.969C8.92703 4.16504 9.03209 4.34357 9.17626 4.48774C9.32043 4.63191 9.49896 4.73697 9.695 4.793L12.794 5.678C13.954 6.01 13.954 7.654 12.794 7.986L9.695 8.871C9.49896 8.92703 9.32043 9.03209 9.17626 9.17626C9.03209 9.32043 8.92703 9.49896 8.871 9.695M14.402 14.548L14.026 16.056C13.976 16.258 13.689 16.258 13.638 16.056L13.261 14.548C13.2522 14.513 13.234 14.481 13.2085 14.4555C13.183 14.43 13.151 14.4118 13.116 14.403L11.608 14.026C11.406 13.976 11.406 13.689 11.608 13.638L13.116 13.261C13.151 13.2522 13.183 13.234 13.2085 13.2085C13.234 13.183 13.2522 13.151 13.261 13.116L13.638 11.608C13.688 11.406 13.975 11.406 14.026 11.608L14.403 13.116C14.4118 13.151 14.43 13.183 14.4555 13.2085C14.481 13.234 14.513 13.2522 14.548 13.261L16.056 13.638C16.258 13.688 16.258 13.975 16.056 14.026L14.548 14.403C14.513 14.4118 14.481 14.43 14.4555 14.4555C14.43 14.481 14.4108 14.513 14.402 14.548Z"
                                fill="url(#paint0_linear_788_11390)"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_788_11390"
                                  x1="1.45505e-07"
                                  y1="0.741517"
                                  x2="16.2075"
                                  y2="15.466"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#9747FF" />
                                  <stop offset="1" stopColor="#FF5CE8" />
                                </linearGradient>
                              </defs>
                            </svg>
                            Ai Powered
                          </div>
                        )}

                      <button className="external-link-btn" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M7 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V11M9 9L17 1M17 1V6M17 1H12"
                            stroke="#2B2B2B"
                            strokeOpacity="0.8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <a
                href="#"
                className={`search-view-all ${activeViewAll === "search" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveViewAll("search");
                }}
              >
                View all
              </a>
            </div>
          )}
        </div>

        <div className="header-right">
          {/* Messages Icon with Dropdown */}
          <div className="messages-wrapper">
            <button className="icon-btn" onClick={toggleMessages} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22.9532 11.7785C22.9551 13.2456 22.6674 14.6987 22.1066 16.0545C21.5459 17.4102 20.7231 18.642 19.6854 19.6792C18.6472 20.7176 17.4145 21.5412 16.0578 22.103C14.7012 22.6647 13.2471 22.9536 11.7787 22.953C10.1983 22.9565 8.63535 22.6229 7.19411 21.9745L2.52257 22.6655C2.29062 22.7034 2.05294 22.684 1.83016 22.6092C1.60738 22.5343 1.40624 22.4062 1.24421 22.236C1.08219 22.0657 0.964177 21.8585 0.900428 21.6323C0.836678 21.4061 0.82912 21.1678 0.878408 20.938L1.52713 16.1988C0.910051 14.8073 0.595463 13.3006 0.60418 11.7785C0.602304 10.3114 0.889986 8.85827 1.45074 7.50252C2.01149 6.14676 2.83428 4.915 3.87197 3.87783C4.91015 2.83941 6.14282 2.01578 7.49951 1.45404C8.85619 0.892294 10.3103 0.603445 11.7787 0.604005C14.744 0.604202 17.5879 1.78174 19.6854 3.87783C20.7225 4.9154 21.545 6.14723 22.1057 7.5029C22.6664 8.85856 22.9544 10.3115 22.9532 11.7785Z"
                  stroke="#2B2B2B"
                  strokeWidth="1.20805"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isMessagesOpen && (
              <div className="messages-dropdown">
                <div className="messages-header">Messages</div>
                <div className="messages-list">
                  {messagesData.map((msg) => (
                    <div key={msg.id} className="message-item">
                      <div className="message-avatar"></div>
                      <div className="message-content">
                        <span className="message-name">{msg.name}</span>
                        <span className="message-text">{msg.text}</span>
                      </div>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#"
                  className={`view-all-link ${activeViewAll === "messages" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveViewAll("messages");
                  }}
                >
                  View all
                </a>
              </div>
            )}
          </div>

          {/* Notifications Bell Icon with Dropdown */}
          <div className="notifications-wrapper">
            <button
              className="icon-btn"
              onClick={toggleNotifications}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="26"
                viewBox="0 0 25 26"
                fill="none"
              >
                <path
                  d="M16.529 20.3462C16.529 20.9306 16.4138 21.5094 16.1902 22.0494C15.9665 22.5894 15.6387 23.08 15.2254 23.4933C14.8121 23.9066 14.3214 24.2344 13.7815 24.4581C13.2415 24.6818 12.6627 24.7969 12.0782 24.7969C11.4938 24.7969 10.915 24.6818 10.375 24.4581C9.83504 24.2344 9.3444 23.9066 8.93111 23.4933C8.51782 23.08 8.18998 22.5894 7.96631 22.0494C7.74264 21.5094 7.62752 20.9306 7.62752 20.3462M21.2734 20.3462H2.88432C2.43947 20.346 2.00466 20.2139 1.63486 19.9666C1.26506 19.7193 0.976883 19.368 0.806753 18.9569C0.636623 18.5459 0.592181 18.0937 0.679047 17.6574C0.765913 17.2211 0.980186 16.8203 1.29478 16.5058L2.0603 15.739C2.77532 15.0235 3.17692 14.0534 3.1768 13.0419V9.53725C3.1768 7.17644 4.11463 4.91232 5.78397 3.24298C7.45332 1.57363 9.71743 0.635803 12.0782 0.635803C14.4391 0.635803 16.7032 1.57363 18.3725 3.24298C20.0419 4.91232 20.9797 7.17644 20.9797 9.53725V13.0419C20.9799 14.0536 21.382 15.0237 22.0975 15.739L22.8643 16.5058C23.1782 16.8206 23.392 17.2213 23.4785 17.6574C23.565 18.0934 23.5204 18.5454 23.3504 18.9562C23.1804 19.3669 22.8925 19.7182 22.5231 19.9656C22.1537 20.2129 21.718 20.3454 21.2734 20.3462Z"
                  stroke="#2B2B2B"
                  strokeWidth="1.27164"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isNotificationsOpen && (
              <div className="notifications-dropdown">
                <div className="notification-container">
                  <div className="notifications-header">Notifications</div>
                  <div className="mark-all-read">Mark all as read</div>
                </div>

                <div className="notifications-list">
                  {notificationsData.map((notif) => (
                    <div key={notif.id} className="notification-item">
                      <div className="notification-avatar"></div>
                      <div className="notification-content">
                        <span
                          className="notification-text"
                          style={
                            notif.twoLines ? { whiteSpace: "pre-line" } : {}
                          }
                        >
                          {notif.text}
                        </span>
                      </div>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/notification"
                  className={`notifications-view-all ${activeViewAll === "notifications" ? "active" : ""
                    }`}
                  onClick={() => {
                    setActiveViewAll("notifications");
                    closeAllDropdowns();
                  }}
                >
                  View all
                </Link>
              </div>
            )}
          </div>

          <div className="user-avatar-wrapper">
            <div
              className={`user-avatar-btn ${isDropdownOpen ? "active" : ""}`}
              onClick={toggleDropdown}
              role="button"
              tabIndex={0}
            >
              <img
                src={avatar || defaultAvatar}
                alt={username || "User"}
                className="w-[34px] h-[34px] rounded-full object-cover border border-[#5C5C5C]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
            </div>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-greeting">
                  Hi, {username || "User"}!
                </div>
                <div className="dropdown-divider"></div>
                <a href="user-profile" className="dropdown-item">
                  My Profile
                </a>
                <a href="/setting" className="dropdown-item">
                  Settings
                </a>
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item logout">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Blur overlay for main content when any dropdown is open */}
      {isAnyDropdownOpen && (
        <div className="blur-overlay" onClick={closeAllDropdowns}></div>
      )}
    </>
  );
};

export default NavbarLight;
