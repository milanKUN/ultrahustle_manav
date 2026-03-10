import React, { useRef, useState, useEffect } from "react";
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
    <div className={`user-page ${theme} min-h-screen relative overflow-hidden`}>
      {/* ---------- NAVBAR ---------- */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
      />

      <div className="pt-[85px] flex relative z-10">
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
            className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]"
          >
            <div className="p-8 space-y-28 w-full">
              <section ref={refs.account} id="account">
                <MyProfile />
              </section>

              <section ref={refs.profile} id="profile">
                <PersonalInfo />
              </section>

              <section ref={refs.security} id="security">
                <Security />
              </section>

              <section ref={refs.portfolio} id="portfolio">
                <MyPortfolio />
              </section>

              <section ref={refs.notifications} id="notifications">
                <Notification />
              </section>

              <section ref={refs.payments} id="payments">
                <Payments />
              </section>

              <section ref={refs.verification} id="verification">
                <Veriffication />
              </section>

              <section ref={refs.apps} id="apps">
                <ConnectedApps />
              </section>

              <section ref={refs.delete} id="delete">
                <DeleteAccount />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
