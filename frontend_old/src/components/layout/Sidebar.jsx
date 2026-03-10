import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MobileBottomNav from "./MobileBottomNav";

import {
  LayoutGrid,
  Store,
  Folder,
  Settings,
  ChevronDown,
  ChevronLeft,
  Users,
  MessageCircle,
  TrendingUp,
  Maximize2,
  Package,
  FilePlus,
  ShoppingBag,
  ShoppingCart,
  HeartIcon,
} from "lucide-react";
import { CiSaveDown1 } from "react-icons/ci";

/* ================= DATA ================= */

const CREATOR_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  {
    label: "Marketplace",
    icon: Store,
    children: [
      { label: "View Products", icon: Package, path: "/marketplace" },
      { label: "Add New Listings", icon: FilePlus, path: "/add-listing" },
    ],
  },
  {
    label: "My Team",
    icon: Users,
    children: [
      { label: "Create Team", icon: Maximize2, path: "/create-team" },
      { label: "Manage Team", icon: Users, path: "/manage-team" },
    ],
  },
  {
    label: "My Projects",
    icon: Folder,
    children: [
      { label: "Active Projects", icon: Folder, path: "/milestones" },
      { label: "My Orders", icon: ShoppingBag, path: "/orders" },
    ],
  },
  { label: "Message", icon: MessageCircle, path: "/messages" },
  {
    label: "Growth Tools",
    icon: TrendingUp,
    children: [{ label: "Analytics & Earning", icon: TrendingUp, path: "/analytics" }],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Profile & Settings", icon: Users, path: "/setting" },
      { label: "Payout / Wallet", icon: ShoppingBag, path: "/wallet" },
    ],
  },
];

const CLIENT_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Marketplace", icon: Store, path: "/marketplace" },
  { label: "My Cart", icon: ShoppingCart, path: "/cart" },
  {
    label: "My Projects",
    icon: Folder,
    children: [
      { label: "Active Projects", icon: Folder, path: "/milestones" },
      { label: "My Orders", icon: ShoppingBag, path: "/orders" },
    ],
  },
  { label: "Message", icon: MessageCircle, path: "/messages" },
  { label: "Saved", icon: HeartIcon, path: "/saved" },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Profile & Settings", icon: Users, path: "/setting" },
      { label: "Payout / Wallet", icon: ShoppingBag, path: "/wallet" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Sidebar({
  expanded,
  setExpanded,
  showSettings,
  setShowSettings,
  activeSetting,
  onSectionChange,
  forceClient,
  theme,
  setTheme,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [userType, setUserType] = useState("creator");

  const [activeMain, setActiveMain] = useState("Dashboard");

  const path = location.pathname;

  useEffect(() => {

    let detectedMain = null;
    let detectedMenu = null;
    let detectedSub = null;
    if (path.includes("/dashboard")) {
      detectedMain = "Dashboard";
      detectedMenu = null;
    } else if (path.includes("/messages")) {
      detectedMain = "Message";
      detectedMenu = null;
    }

    // ✅ SETTINGS (dropdown) + IMPORTANT: open full sidebar + settings panel
    else if (path.includes("/setting") || path.includes("/settings")) {
      detectedMain = "Settings";
      detectedMenu = "Settings";
      setExpanded?.(true);
      setShowSettings?.(true);
    }

    // ✅ MARKETPLACE (dropdown)
    else if (
      path.includes("/marketplace") ||
      path.includes("/listing") ||
      path.includes("/contracts") ||
      path.includes("/solo-contracts") ||
      path.includes("/add-listing")
    ) {
      detectedMain = "Marketplace";
      detectedMenu = "Marketplace";
    }

    // ✅ TEAM (dropdown)
    else if (path.includes("/team") || path.includes("/create-team") || path.includes("/manage-team")) {
      detectedMain = "My Team";
      detectedMenu = "My Team";
    }

    // ✅ PROJECTS (dropdown)
    else if (
      path.includes("/project") ||
      path.includes("/milestones") ||
      path.includes("/orders") ||
      path.includes("/my-orders")
    ) {
      detectedMain = "My Projects";
      detectedMenu = "My Projects";
    }

    setActiveMain(detectedMain);
    setOpenMenu(detectedMenu);

    // ✅ force client
    if (forceClient) {
      setUserType("client");
      setShowSettings?.(false);
    }
  }, [path, forceClient, setExpanded, setShowSettings]);

  const SIDEBAR_ITEMS = userType === "creator" ? CREATOR_ITEMS : CLIENT_ITEMS;

  const [isMobile, setIsMobile] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState("Marketplace");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 950);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setExpanded?.(false);
      setShowSettings?.(false);
    }
  }, [isMobile, setExpanded, setShowSettings]);

  useEffect(() => {
    if (userType === "client") {
      setActiveMain("Dashboard");
      setOpenMenu(null);
    }
  }, [userType]);

  return (
    <>
      <div className="flex">
        {/* ================= ICON RAIL ================= */}
        {!isMobile && !expanded && (
          <aside
            className="sidebar w-14 flex flex-col items-center py-4 sticky top-[85px] h-[calc(100vh-85px)] overflow-y-auto scrollbar-hide"
            style={{
              backgroundColor: "var(--card)",
              msOverflowStyle: "none",
              scrollbarWidth: "none"
            }}
          >
            <button
              onClick={() => setExpanded((p) => !p)}
              className="w-10 h-10 rounded-full flex items-center justify-center mb-6 transition hover:scale-105"
              style={{ backgroundColor: "var(--bg)" }}
            >
              <img src="/switch.svg" alt="toggle sidebar" className="w-5 h-5" />
            </button>

            <div className="flex flex-col space-y-4">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = activeMain === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      // Always expand on click as requested
                      setExpanded(true);

                      if (item.path) {
                        navigate(item.path);
                        setActiveMain(item.label);
                        setOpenMenu(null);
                      } else if (item.children && item.children.length > 0) {
                        setActiveMain(item.label);
                        setOpenMenu(item.label);
                      }
                    }}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${isActive
                        ? "bg-[#CEFF1B] shadow-[0_0_15px_rgba(206,255,27,0.4)]"
                        : theme === 'dark' ? "transparent" : "hover:bg-white/10"
                      }
                    `}
                    title={item.label}
                  >
                    <item.icon
                      size={18}
                      style={{ color: isActive ? "#000" : "var(--text)" }}
                    />
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ===== BACKDROP BLUR (MOBILE ONLY) ===== */}
        {isMobile && expanded && (
          <div
            className="fixed inset-0 backdrop-blur-xl bg-black/30 z-[9998]"
            onClick={() => setExpanded(false)}
          />
        )}

        {/* ================= MAIN SIDEBAR ================= */}
        {expanded && (
          <aside
            className={`
              ${isMobile
                ? "fixed top-0 left-0 h-screen w-[289px] z-[9999] pt-[85px]"
                : "sticky top-[85px] w-[289px] min-w-[289px] h-[calc(100vh-85px)]"
              }
              px-6 py-6 flex flex-col
              overflow-y-auto scrollbar-hide
            `}
            style={{
              backgroundColor: "var(--card)",
              msOverflowStyle: "none",
              scrollbarWidth: "none"
            }}
          >
            <style>{`
              aside::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* CREATOR / CLIENT TOGGLE & CLOSE BTN */}
            <div className="flex items-center gap-2 mb-8 mt-2">
              <div className="creator-client-toggle flex-1 flex bg-[#CEFF1B] rounded-xl p-1">
                {["creator", "client"].map((t) => {
                  const isActive = userType === t;

                  return (
                    <button
                      key={t}
                      onClick={() => setUserType(t)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
                      style={{
                        backgroundColor: isActive ? "#ffffff" : "transparent",
                        color: "#000000",
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  );
                })}
              </div>

              {!isMobile && (
                <button
                  onClick={() => setExpanded(false)}
                  className="p-2 rounded-xl bg-[#CEFF1B] text-[#000] hover:opacity-90 transition"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
            </div>

            {/* NAV */}
            <nav className="space-y-4">
              {SIDEBAR_ITEMS.map((item) => {
                const isNeon = activeMain === item.label && !item.children;

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        // ✅ Dashboard
                        if (item.label === "Dashboard") {
                          setActiveMain("Dashboard");
                          setOpenMenu(null);
                          navigate("/dashboard");
                          return;
                        }

                        // ✅ Message
                        if (item.label === "Message") {
                          setActiveMain("Message");
                          setOpenMenu(null);
                          navigate("/messages");
                          return;
                        }

                        // ✅ Client single pages
                        if (userType === "client" && !item.children) {
                          setActiveMain(item.label);
                          setOpenMenu(null);

                          if (item.label === "Marketplace")
                            navigate("/marketplace");
                          else if (item.label === "My Cart") navigate("/cart");
                          return;
                        }

                        // ✅ Dropdowns
                        setActiveMain(item.label);
                        setOpenMenu(openMenu === item.label ? null : item.label);
                      }}
                      className="w-full flex items-center font-medium px-3 py-2 rounded-md transition"
                      style={{
                        backgroundColor: isNeon
                          ? "#CEFF1B"
                          : theme === "dark" && openMenu === item.label
                            ? "#3A3A3A"
                            : theme === "light" && openMenu === item.label
                              ? "#E8E8E8"
                              : "transparent",

                        color: isNeon
                          ? "#000000"
                          : theme === "dark"
                            ? "#FFFFFF"
                            : "var(--text)",
                      }}
                    >
                      <item.icon size={18} />
                      <span className="ml-4">{item.label}</span>

                      {item.children && (
                        <ChevronDown
                          size={14}
                          className={`ml-auto transition-transform ${openMenu === item.label ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </button>

                    {item.children && openMenu === item.label && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.children.map((sub) => {
                          const Icon = sub.icon;
                          const isSubActive = path === sub.path || (sub.path === "/setting" && path === "/settings");

                          return (
                            <div
                              key={sub.label}
                              className="flex items-center gap-3 text-sm px-3 py-2 rounded-md cursor-pointer transition"
                              onClick={() => {
                                navigate(sub.path);
                              }}
                              style={{
                                backgroundColor: isSubActive
                                  ? "#CEFF1B"
                                  : "transparent",
                                color: isSubActive ? "#000" : "var(--text)",
                              }}
                            >
                              {Icon && <Icon size={16} />}
                              <span>{sub.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* THEME TOGGLE */}
            <div className="w-full px-4 pb-4 mt-auto ml-2">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="
                  relative
                  w-[135px] h-[48px]
                  bg-[#CEFF1B]
                  rounded-full
                  flex items-center
                  transition
                "
              >
                <div
                  className={`
                    absolute top-[7.5px]
                    w-[33px] h-[33px]
                    rounded-full
                    flex items-center justify-center
                    shadow-md shadow-black/30
                    transition-all duration-300 ease-in-out
                    ${theme === "dark"
                      ? "left-[96px] bg-[#24272C]"
                      : "left-[6px] bg-[#24272C]"
                    }
                  `}
                >
                  {theme === "dark" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E9EAF0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E9EAF0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </aside>
        )}

        {/* ================= SETTINGS SIDEBAR ================= */}
        {/* ✅ CHANGE: expanded dependency removed + client bhi allow */}
        {showSettings && !isMobile && (
          <aside
            className="w-[238px] border-l sticky top-[85px] h-[calc(100vh-85px)] overflow-y-auto scrollbar-hide"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              msOverflowStyle: "none",
              scrollbarWidth: "none"
            }}
          >
            <div className="pt-8 space-y-1">
              {[
                "account",
                "profile",
                "security",
                "portfolio",
                "notifications",
                "payments",
                "verification",
                "apps",
                "delete",
              ].map((item) => {
                const isActive = activeSetting === item;

                return (
                  <div
                    key={item}
                    onClick={() => onSectionChange(item)}
                    className="px-5 py-2 text-sm cursor-pointer transition"
                    style={{
                      backgroundColor: isActive ? "#CEFF1B" : "transparent",
                      color:
                        item === "delete"
                          ? "#ef4444"
                          : isActive
                            ? "#000000"
                            : "var(--text)",
                    }}
                  >
                    {item.replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      {isMobile && !expanded && (
        <MobileBottomNav
          active={activeBottomTab}
          setActive={setActiveBottomTab}
          theme={theme}
        />
      )}
    </>
  );
}
