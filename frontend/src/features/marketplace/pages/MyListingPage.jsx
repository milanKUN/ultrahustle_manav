import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import { getMyListings } from "../api/listingApi";
import "./MyListings.css";
import "../../../Darkuser.css";

// SVG Icons for tabs and cards
const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4A2 2 0 0 0 13 22l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const HeadsetsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
    <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const DotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="10" x2="10" y1="15" y2="9" />
    <line x1="14" x2="14" y1="15" y2="9" />
  </svg>
);

const DuplicateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const tabToListingType = {
  Products: "digital_product",
  Services: "service",
  Courses: "course",
  Webinar: "webinar",
};

const viewBaseByType = {
  digital_product: "digital-product",
  service: "service",
  course: "course",
  webinar: "webinar",
};

const editBaseByType = {
  digital_product: "edit-digital-product",
  service: "edit-service",
  course: "edit-course",
  webinar: "edit-webinar",
};

const getImageUrl = (path = "") => {
  if (!path) {
    return "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
  }
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage/")) return path;
  if (path.startsWith("storage/")) return `/${path}`;
  return `/storage/${path}`;
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getListingUsername = (item) => {
  return (
    item?.username ||
    item?.slug ||
    item?.listing_username ||
    item?.raw?.username ||
    item?.raw?.slug ||
    item?.raw?.listing_username ||
    ""
  );
};

const getViewRoute = (item) => {
  if (item.listingType === "team") {
    const username = getListingUsername(item);
    return username ? `/team/${username}` : "/team-profile";
  }

  const base = viewBaseByType[item.listingType];
  const username = getListingUsername(item);

  if (!base || !username) return "/marketplace";
  return `/${base}/${username}`;
};

const getEditRoute = (item) => {
  if (item.listingType === "team") {
    const username = getListingUsername(item);
    return username ? `/edit-team/${username}` : "/edit-team";
  }

  const base = editBaseByType[item.listingType];
  const username = getListingUsername(item);

  if (!base || !username) return "/add-listing";
  return `/${base}/${username}`;
};

export default function MyListings({ theme = "light", setTheme }) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("");
  const [activeTab, setActiveTab] = useState("Products");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [listings, setListings] = useState([]);
  const [teamCards, setTeamCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
      setOpenStatusDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getMyListings();

        const rawListings = res?.listings || res?.data?.listings || [];

        const mapped = Array.isArray(rawListings)
          ? rawListings.map((item) => ({
              id: item.id,
              title: item.title || "Untitled Listing",
              username: item.username || item.slug || item.listing_username || "",
              price: item.price ? `$${item.price}` : item.price_text || "—",
              updated: formatDate(item.updated_at || item.created_at),
              status: item.status || "draft",
              img: getImageUrl(item.cover_media_path || item.cover_media_url || ""),
              listingType: item.listing_type,
              raw: item,
            }))
          : [];

        setListings(mapped);
      } catch (e) {
        setError(e?.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const tabs = [
    { name: "Products", icon: <PackageIcon /> },
    { name: "Services", icon: <HeadsetsIcon /> },
    { name: "Courses", icon: <PlayCircleIcon /> },
    { name: "Webinar", icon: <VideoIcon /> },
    { name: "Teams", icon: <UsersIcon /> },
  ];

  const filteredListings = useMemo(() => {
    if (activeTab === "Teams") return teamCards;

    const selectedType = tabToListingType[activeTab];

    return listings.filter((item) => {
      const typeMatch = item.listingType === selectedType;

      const statusMatch =
        statusFilter === "All Statuses" ||
        String(item.status).toLowerCase() === statusFilter.toLowerCase();

      const searchMatch =
        !searchTerm.trim() ||
        String(item.title).toLowerCase().includes(searchTerm.trim().toLowerCase());

      return typeMatch && statusMatch && searchMatch;
    });
  }, [listings, teamCards, activeTab, statusFilter, searchTerm]);

  return (
    <div className={`user-page ${theme} min-h-screen relative overflow-hidden mylis-shell`}>
      <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} theme={theme} />

      <div className="pt-[72px] flex relative z-10 w-full h-full">
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

        <div className="relative flex-1 min-w-5 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
            <main className="mylis-main w-full">
              <div className="mylis-header-row">
                <h1 className="mylis-title">My Listings</h1>
                <button
                  className="mylis-add-btn"
                  onClick={() => navigate("/add-listing")}
                >
                  + Add New Listing
                </button>
              </div>

              <p className="mylis-subtitle">
                One place to manage products, services, courses, webinars, and teams.
              </p>

              <div className="mylis-toolbar">
                <div className="mylis-search-wrap">
                  <span className="mylis-search-icon">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    className="mylis-search-input"
                    placeholder="Search listing"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mylis-status-wrap">
                  <div
                    className={`mylis-status-btn ${openStatusDropdown ? "open" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenStatusDropdown(!openStatusDropdown);
                      setOpenDropdown(null);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {statusFilter}
                    <span className="arrow">▼</span>
                  </div>

                  {openStatusDropdown && (
                    <ul className="status-menu" onClick={(e) => e.stopPropagation()}>
                      {["All Statuses", "published", "draft", "paused", "active"].map((status) => (
                        <li
                          key={status}
                          className={statusFilter === status ? "active" : ""}
                          onClick={() => {
                            setStatusFilter(status);
                            setOpenStatusDropdown(false);
                          }}
                        >
                          {status === "published"
                            ? "Published"
                            : status === "draft"
                            ? "Draft"
                            : status === "paused"
                            ? "Paused"
                            : status === "active"
                            ? "Active"
                            : "All Statuses"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mylis-tabs-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    className={`mylis-tab ${activeTab === tab.name ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="p-6 text-sm text-gray-600">Loading listings...</div>
              ) : error ? (
                <div className="p-6 text-sm text-red-600">{error}</div>
              ) : filteredListings.length === 0 ? (
                <div className="p-6 text-sm text-gray-600">
                  No {activeTab.toLowerCase()} found.
                </div>
              ) : (
                <div className="mylis-grid">
                  {filteredListings.map((item) => (
                    <div
                      className={`mylis-card ${openDropdown === item.id ? "active-dropdown" : ""}`}
                      key={item.id}
                      onClick={() => navigate(getViewRoute(item))}
                    >
                      <div className="mylis-card-img-wrap">
                        <img src={item.img} alt={item.title} className="mylis-card-img" />
                      </div>

                      <div className="mylis-card-body">
                        <div className="mylis-card-top">
                          <div className="mylis-card-icon-title">
                            <div className="mylis-card-type-icon">
                              {item.listingType === "digital_product" ? (
                                <PackageIcon />
                              ) : item.listingType === "service" ? (
                                <HeadsetsIcon />
                              ) : item.listingType === "course" ? (
                                <PlayCircleIcon />
                              ) : item.listingType === "webinar" ? (
                                <VideoIcon />
                              ) : (
                                <PackageIcon />
                              )}
                            </div>

                            <div className="mylis-card-info">
                              <h3>{item.title}</h3>
                              <p>
                                {item.price} • Updated {item.updated || "—"}
                              </p>
                            </div>
                          </div>

                          <div className="mylis-dropdown-wrap">
                            <button
                              className="mylis-card-dots"
                              aria-label="Menu"
                              onClick={(e) => toggleDropdown(item.id, e)}
                            >
                              <DotsIcon />
                            </button>

                            {openDropdown === item.id && (
                              <div
                                className="mylis-dropdown-menu"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="mylis-dropdown-header">Actions</div>

                                <button
                                  className="mylis-dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(getEditRoute(item));
                                  }}
                                >
                                  <EditIcon /> Edit
                                </button>

                                <button className="mylis-dropdown-item">
                                  <PauseIcon /> Pause
                                </button>

                                <button className="mylis-dropdown-item">
                                  <DuplicateIcon /> Duplicate
                                </button>

                                <div className="mylis-dropdown-divider"></div>

                                <button className="mylis-dropdown-item danger">
                                  <TrashIcon /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`mylis-badge ${String(item.status).toLowerCase()}`}>
                          {String(item.status).charAt(0).toUpperCase() + String(item.status).slice(1)}
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
    </div>
  );
}
