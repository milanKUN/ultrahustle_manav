import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MobileBottomNav from "./MobileBottomNav";

import {
  ChevronLeft,
  FilePlus,
  Folder,
  HeartIcon,
  LayoutGrid,
  Maximize2,
  MessageCircle,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { CiSaveDown1 } from "react-icons/ci";
import { LuTrendingUp } from "react-icons/lu";

const CREATOR_ITEMS = [
    { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    {
        label: "Marketplace",
        icon: Store,
        children: [
            { label: "My Listings", icon: CiSaveDown1, path: "/my-listings" },
            { label: "Add New Listings", icon: FilePlus, path: "/add-listing" },
        ],
    },
    { label: "My Orders", icon: ShoppingBag, path: "/creator-orders" },
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
            {
                label: "Active Projects",
                icon: Folder,
                path: "/active-projects",
            },
        ],
    },
    { label: "Message", icon: MessageCircle, path: "/messages" },
    {
        label: "Growth Tools",
        icon: LuTrendingUp,
        children: [
            {
                label: "Analytics & Earning",
                icon: LuTrendingUp,
                path: "/analytics",
            },
        ],
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
    { label: "My Orders", icon: ShoppingBag, path: "/client-orders" },
    { label: "My Cart", icon: ShoppingCart, path: "/cart" },
    {
        label: "My Projects",
        icon: Folder,
        children: [
            {
                label: "Active Projects",
                icon: Folder,
                path: "/active-projects",
            },
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
  const [isMobile, setIsMobile] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState("Marketplace");

  const path = location.pathname;
  const sidebarItems = userType === "creator" ? CREATOR_ITEMS : CLIENT_ITEMS;

  useEffect(() => {
    let detectedMain = null;
    let detectedMenu = null;

    if (path.includes("/dashboard")) {
      detectedMain = "Dashboard";
    } else if (path.includes("/messages")) {
      detectedMain = "Message";
    } else if (path.includes("/setting") || path.includes("/settings")) {
      detectedMain = "Settings";
      detectedMenu = "Settings";
      setExpanded?.(true);
      setShowSettings?.(true);
    } else if (
      path.includes("/marketplace") ||
      path.includes("/listing") ||
      path.includes("/contracts") ||
      path.includes("/solo-contracts") ||
      path.includes("/add-listing")
    ) {
      detectedMain = "Marketplace";
      detectedMenu = "Marketplace";
    } else if (
      path.includes("/team") ||
      path.includes("/create-team") ||
      path.includes("/manage-team")
    ) {
      detectedMain = "My Team";
      detectedMenu = "My Team";
    } else if (
        path.includes("/project") ||
        path.includes("/milestones") ||
        path.includes("/active-projects") ||
        path.includes("/orders") ||
        path.includes("/my-orders")
    ) {
        detectedMain = "My Projects";
        detectedMenu = "My Projects";
    } else if (path.includes("/creator-orders")) {
        detectedMain = "My Orders";
    }

    setActiveMain(detectedMain);
    setOpenMenu(detectedMenu);

    if (forceClient) {
      setUserType("client");
      setShowSettings?.(false);
    }
  }, [forceClient, path, setExpanded, setShowSettings]);

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

  const handleMainItemClick = (item) => {
    if (item.path && !item.children) {
      setActiveMain(item.label);
      setOpenMenu(null);
      navigate(item.path);
      return;
    }

    setActiveMain(item.label);
    setOpenMenu(openMenu === item.label ? null : item.label);
  };

  return (
    <>
      <div className="flex">
        {!isMobile && !expanded && (
          <aside
            className="sidebar w-14 flex flex-col items-center py-4 sticky top-[85px] h-[calc(100vh-85px)] overflow-y-auto scrollbar-hide"
            style={{
              backgroundColor: "var(--card)",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="w-10 h-10 rounded-full flex items-center justify-center mb-6 transition"
              style={{ backgroundColor: "var(--bg)" }}
            >
              <img src="/switch.svg" alt="toggle sidebar" className="w-5 h-5" />
            </button>

            <div className="flex flex-col space-y-4">
              {sidebarItems.map((item) => {
                const isActive = activeMain === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setExpanded(true);

                      if (item.path) {
                        navigate(item.path);
                        setActiveMain(item.label);
                        setOpenMenu(null);
                      } else if (item.children?.length) {
                        setActiveMain(item.label);
                        setOpenMenu(item.label);
                      }
                    }}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center duration-300
                      ${
                        isActive
                          ? "bg-[#CEFF1B] shadow-[0_0_15px_rgba(206,255,27,0.4)]"
                          : "bg-transparent"
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

        {isMobile && expanded && (
          <div
            className="fixed inset-0 backdrop-blur-xl bg-black/30 z-[9998]"
            onClick={() => setExpanded(false)}
          />
        )}

        {expanded && (
          <aside
            className={`
              ${
                isMobile
                  ? "fixed top-0 left-0 h-screen w-[289px] z-[9999] pt-[85px]"
                  : "sticky top-[85px] w-[289px] min-w-[289px] h-[calc(100vh-85px)]"
              }
              px-6 py-6 flex flex-col
              overflow-y-auto scrollbar-hide
            `}
            style={{
              backgroundColor: "var(--card)",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <style>{`
              aside::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="flex items-center gap-2 mb-8 mt-2">
              <div className="creator-client-toggle flex-1 flex bg-[#CEFF1B] rounded-xl p-1">
                {["creator", "client"].map((type) => {
                  const isActive = userType === type;

                  return (
                    <button
                      key={type}
                      onClick={() => setUserType(type)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
                      style={{
                        backgroundColor: isActive ? "#ffffff" : "transparent",
                        color: "#000000",
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  );
                })}
              </div>

              {!isMobile && (
                <button
                  onClick={() => setExpanded(false)}
                  className="p-2 rounded-xl bg-[#CEFF1B] text-[#000] transition"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
            </div>

            <nav className="space-y-4">
              {sidebarItems.map((item) => {
                const isNeon = activeMain === item.label && !item.children;
                const itemBgColor = isNeon ? "#CEFF1B" : "transparent";
                const itemTextColor = isNeon
                  ? "#000000"
                  : theme === "dark"
                    ? "#FFFFFF"
                    : "#111111";

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => handleMainItemClick(item)}
                      className="w-full flex items-center gap-3 font-medium px-3 py-2 rounded-md transition"
                      style={{
                        backgroundColor: itemBgColor,
                        color: itemTextColor,
                      }}
                    >
                      <item.icon
                        size={18}
                        color={itemTextColor}
                        style={{ flexShrink: 0 }}
                      />
                      <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.label}
                      </span>

                      {item.children && (
                        <span
                          className={`ml-auto inline-flex items-center justify-center transition-transform ${
                            openMenu === item.label ? "rotate-180" : ""
                          }`}
                          style={{
                            flexShrink: 0,
                            color: itemTextColor,
                            lineHeight: 0,
                          }}
                          aria-hidden="true"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      )}
                    </button>

                    {item.children && openMenu === item.label && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.children.map((sub) => {
                          const Icon = sub.icon;
                          const isSubActive =
                            path === sub.path ||
                            (sub.path === "/setting" && path === "/settings");

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
                    ${
                      theme === "dark"
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

        {showSettings && !isMobile && (
          <aside
            className="w-[238px] border-l sticky top-[85px] h-[calc(100vh-85px)] overflow-y-auto scrollbar-hide"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
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
                    {item.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

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
