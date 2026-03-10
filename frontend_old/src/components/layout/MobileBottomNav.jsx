import React, { useState, useEffect, useRef } from "react";
import { Store, Newspaper, Search, LayoutGrid, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileBottomNav({ active, setActive, theme = "light" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Same content like image
  const items = [
    { label: "Marketplace", icon: Store, path: "/marketplace" },
    { label: "Feed", icon: Newspaper, path: "/feed" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { label: "Account", icon: UserRound, path: "/user-profile" },
  ];

  // ✅ Scroll to Hide Logic (Support for custom containers)
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = (e) => {
      // If we're capturing, e.target is the element that scrolled
      // fallback to root if e.target is document
      const target = (e.target === document) ? (window || document.documentElement) : e.target;
      const currentScrollY = target.scrollTop !== undefined ? target.scrollTop : window.scrollY;

      const diff = currentScrollY - lastScrollY.current;

      // sensitivity
      if (Math.abs(diff) < 5) return;

      if (diff > 0 && currentScrollY > 50) {
        // Scrolling Down -> hide
        setIsVisible(false);
      } else if (diff < 0) {
        // Scrolling Up -> show
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    // Use CAPTURE phase (true) because scroll events don't bubble
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  // ✅ if parent doesn't pass active, auto detect using route
  const currentActive =
    active ||
    (() => {
      const hit = items.find((i) =>
        location.pathname === i.path || location.pathname.startsWith(i.path + "/")
      );
      return hit?.label || "Dashboard";
    })();

  return (
    <div
      className={`
      fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-3
      transition-all duration-300 ease-in-out
      min-[550px]:hidden
    `}
      style={{
        transform: isVisible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(140%)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >

      <div
        className={`
          w-[400px] max-w-[92vw]
          rounded-2xl
          flex items-center justify-between
          px-3 py-3
          backdrop-blur-xl
          ${isDark ? "bg-[#0b0b0b]/85" : "bg-white/75"}
        `}
        style={{
          border: "2px solid #CEFF1B", // Slightly thicker for visibility
          boxShadow: isDark
            ? "0 10px 28px rgba(0,0,0,0.4)"
            : "0 10px 28px rgba(0,0,0,0.12)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentActive === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setActive?.(item.label);
                navigate(item.path);
              }}
              className="flex-1 h-[52px] flex items-center justify-center"
            >
              {isActive ? (
                // ✅ Active = neon big pill like image
                <div className="w-full h-[52px] bg-[#CEFF1B] rounded-2xl flex flex-col items-center justify-center">
                  <Icon size={16} style={{ color: "#000000" }} />
                  <span
                    className="text-[10px] font-semibold mt-[2px]"
                    style={{ color: "#000000" }}
                  >
                    {item.label}
                  </span>
                </div>
              ) : (
                // ✅ Inactive
                <div className="flex flex-col items-center gap-[2px]">
                  <Icon
                    size={16}
                    style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)" }}
                  />
                  <span
                    className="text-[10px] font-semibold mt-[2px]"
                    style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)" }}
                  >
                    {item.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}