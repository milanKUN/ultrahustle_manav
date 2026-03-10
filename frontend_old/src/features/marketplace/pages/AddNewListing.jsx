import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AddNewListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";

// ✅ Images (icons ki jagah)
import serviceImg from "../../../assets/service.svg";
import digitalProductImg from "../../../assets/digital.svg";
import courseImg from "../../../assets/course.svg";
import webinarImg from "../../../assets/webinar.svg";

export default function AddNewListing({ theme, setTheme }) {
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownChange = (isOpen) => setIsDropdownOpen(isOpen);
  const handleSectionChange = (id) => setActiveSetting(id);

  useEffect(() => {
    setSidebarOpen(false);
    setShowSettings(false);
  }, []);

  const listingTypes = [
    {
      id: "service",
      title: "Service",
      image: serviceImg,
      desc: "For client work, consulting, or done-for-you projects.",
      subdesc:
        "Set your scope, pricing, timelines, and revisions clearly so both you and the client stay aligned from day one.",
      route: "/create-service-listing",
    },
    {
      id: "digital-product",
      title: "Digital Product",
      image: digitalProductImg,
      desc: "For templates, files, tools, or resources you can sell again and again.",
      subdesc:
        "Upload once, set your license and price, and deliver instantly without manual work.",
      route: "#",
    },
    {
      id: "course",
      title: "Course",
      image: courseImg,
      desc: "For teaching step by step.",
      subdesc:
        "Organize lessons, control access, and give buyers a clean, distraction-free learning experience.",
      route: "#",
    },
    {
      id: "webinar",
      title: "Webinar",
      image: webinarImg,
      desc: "For live sessions or recorded events.",
      subdesc:
        "Schedule, collect registrations, and deliver your session without juggling multiple tools.",
      route: "#",
    },
  ];

  return (
    <div
      className={`add-listing-page user-page ${
        theme || "light"
      } min-h-screen relative overflow-hidden`}
    >
      {/* NAVBAR */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
        onDropdownChange={handleDropdownChange}
      />

      <div className="pt-[85px] flex relative z-10 w-full">
        {/* SIDEBAR */}
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

        {/* MAIN CONTENT WRAPPER */}
        <div className="relative flex-1 min-w-0 overflow-hidden w-full">
          {/* Scrollable Area */}
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)] w-full">
            <main
              className={`add-listing-main p-6 lg:p-10 ${
                isDropdownOpen ? "blurred" : ""
              }`}
            >
              <div className="add-listing-header">
                <h1 className="add-listing-title">What do you want to sell?</h1>
                <p className="add-listing-subtitle">
                  Pick the format that fits how you work. We will handle the
                  structure so you can focus on creating and delivering.
                </p>
              </div>

              <div className="add-listing-grid">
                {listingTypes.map((type) => (
                  <div key={type.id} className="add-listing-card">
                    <h2 className="add-listing-card-title">{type.title}</h2>

                    {/* ✅ IMAGE ICON */}
                    <div className="add-listing-icon-wrapper add-listing-icon">
                      <img
                        src={type.image}
                        alt={type.title}
                        className="add-listing-image"
                        loading="lazy"
                      />
                    </div>

                    <p className="add-listing-card-desc">{type.desc}</p>
                    <p className="add-listing-card-subdesc">{type.subdesc}</p>

                    <button
                      className="add-listing-btn"
                      onClick={() => {
                        if (type.route !== "#") navigate(type.route);
                      }}
                    >
                      Create
                    </button>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}