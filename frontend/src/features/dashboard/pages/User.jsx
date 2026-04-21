import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";

import MyProfile from "../components/UserProfile/MyProfie";
import PersonalInfo from "../components/UserProfile/PersonalInfo";
import Security from "../components/UserProfile/Security";
import Notification from "../components/UserProfile/Notification";
import Payments from "../components/UserProfile/Payments";
import Veriffication from "../components/UserProfile/Veriffication";
import ConnectedApps from "../components/UserProfile/ConnectedApps";
import DeleteAccount from "../components/UserProfile/DeleteAccount";
import MyPortfolio from "../components/UserProfile/MyPortfolio"; 

function User({ theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("account");

  const contentRef = useRef(null);
  const ticking = useRef(false);

  const [successPopup, setSuccessPopup] = useState({
    open: false,
    title: "",
    message: "",
  });
  
  const showSuccess = (title, message) => {
    setSuccessPopup({
      open: true,
      title,
      message,
    });
  };

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  /* ---------- SECTION REFS ---------- */
  const refs = {
    account: useRef(null),
    profile: useRef(null),
    security: useRef(null),
    portfolio: useRef(null),
    notifications: useRef(null),
    payments: useRef(null),
    verification: useRef(null),
    apps: useRef(null),
    delete: useRef(null),
  };

  /* ---------- INIT ---------- */
  useEffect(() => {
    setShowSettings(true);
    setTimeout(() => handleScroll(), 0);
  }, []);

  /* ---------- SIDEBAR CLICK ---------- */
  const handleSectionChange = (id) => {
    setActiveSetting(id);

    const container = contentRef.current;
    const section = refs[id]?.current;
    if (!container || !section) return;

    container.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  };

  /* ---------- SCROLL SPY ---------- */
  const handleScroll = () => {
    if (!contentRef.current || ticking.current) return;

    ticking.current = true;

    requestAnimationFrame(() => {
      const scrollTop = contentRef.current.scrollTop;
      let current = "account";

      Object.entries(refs).forEach(([key, ref]) => {
        if (scrollTop >= ref.current?.offsetTop - 150) {
          current = key;
        }
      });

      setActiveSetting(current);
      ticking.current = false;
    });
  };

  return (
    <><div className={`user-page ${theme} min-h-screen relative overflow-hidden`}>
      {/* ---------- NAVBAR ---------- */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
      />

      <div className="pt-[72px] flex relative z-10">
        {/* ---------- SIDEBAR ---------- */}
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

        {/* ---------- CONTENT ---------- */}
        <div className="relative flex-1 min-w-5 overflow-hidden">
          {/* ---------- SCROLL AREA ---------- */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]"
          >
            <div className="p-8 space-y-28 w-full">
              <section ref={refs.account} id="account">
                <MyProfile theme={theme} />
              </section>

              <section ref={refs.profile} id="profile">
                <PersonalInfo theme={theme} />
              </section>

              <section ref={refs.security} id="security">
                <Security theme={theme} />
              </section>

              <section ref={refs.portfolio} id="portfolio">
                <MyPortfolio
                  mode="user"
                  onSuccess={(msg) =>
                    showSuccess(
                      "Portfolio Updated!",
                      msg || "Portfolio updated successfully."
                    )
                  }
                />
              </section>

              <section ref={refs.notifications} id="notifications">
                <Notification theme={theme} />
              </section>

              <section ref={refs.payments} id="payments">
                <Payments theme={theme} />
              </section>

              <section ref={refs.verification} id="verification">
                <Veriffication theme={theme} />
              </section>

              <section ref={refs.apps} id="apps">
                <ConnectedApps theme={theme} />
              </section>

              <section ref={refs.delete} id="delete">
                <DeleteAccount theme={theme} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuccessPopup
      open={successPopup.open}
      title={successPopup.title}
      message={successPopup.message}
      onClose={() => setSuccessPopup({ open: false, title: "", message: "" })}
    />
    </>
    
  );
}

function SuccessPopup({ open, title, message, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl shadow-[0_0_30px_rgba(206,255,27,0.4)] border border-[#CEFF1B] px-8 py-10 w-full max-w-[420px] text-center animate-[fadeIn_.25s_ease]">
        <div className="w-20 h-20 rounded-full bg-[#CEFF1B] mx-auto flex items-center justify-center mb-6 shadow-lg">
          <img src="/right.svg" alt="success" className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>

        <button
          onClick={onClose}
          className="bg-[#CEFF1B] text-black font-semibold px-6 py-3 rounded-xl border border-black hover:scale-[1.02] transition"
        >
          Continue
        </button>
      </div>
    </div>,
    document.body
  );
}

export default User;
