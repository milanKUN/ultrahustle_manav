import React, { useState, useEffect } from 'react';
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import './BoostCampaign.css';
import "../../../Darkuser.css";

export default function BoostCampaign({ theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");
  const [activeGoal, setActiveGoal] = useState("views");
  const [step, setStep] = useState(1);
  const [audienceType, setAudienceType] = useState('smart'); // smart | manual
  const [placementType, setPlacementType] = useState('auto'); // auto | manual
  const steps = [
    { id: 1, name: "Choose Goal", desc: "Objective" },
    { id: 2, name: "Audience & Placement", desc: "Who + Where" },
    { id: 3, name: "Budget & Duration", desc: "Spend" },
    { id: 4, name: "Review & launch", desc: "Confirm" },
  ];
  const selectedGeographies = ["India", "UAE", "UK"];
  const selectedInterestTags = ["Design", "Development", "Marketing", "AI tools"];
  const trafficSourcePreferences = ["Marketplace feed", "Search results", "Recommendations", "Related listings", "Category pages"];
  const manualPlacementOptions = [
    "Marketplace feed",
    "Push surfaces (future)",
    "Home recommendations",
    "Search results",
    "Dashboard Recommendations",
    "Related listings",
    "Category pages",
    "Email Recommendations (future)",
  ];
  const deviceOptions = ["All Devices", "Mobile", "Desktop"];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    setShowSettings(false);
  }, []);

  return (
    <div className={`boost-campaign-layout-wrapper user-page ${theme}`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className="boost-campaign-layout-body">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={setActiveSetting}
          theme={theme}
          setTheme={setTheme}
        />
        
        <div className="boost-campaign-main-content">
          <div className="boost-campaign-scroll-area">
            <div className="boost-campaign-container">
              
              {/* Header Section */}
              <div className="bc-header-section">
                <div className="bc-header-left">
                  <h1 className="bc-title">Boost Campaigns</h1>
                  <p className="bc-subtitle">All boost across your listings.</p>
                </div>
                <div className="bc-header-right">
                  <div className="bc-actions top-actions">
                    <span className="bc-action-text pb-text">Boost Campaigns</span>
                    <button className="bc-btn primary-btn">New Boost</button>
                  </div>
                  <div className="bc-actions bottom-actions">
                    <span className="bc-action-text">Back to Listing</span>
                    <button className="bc-btn draft-btn">Save as Draft</button>
                    <span className="bc-action-text">Help / Learn More</span>
                  </div>
                </div>
              </div>

              {/* Card Section */}
              <div className="bc-card">
                <div className="bc-card-left">
                  <div className="bc-img-placeholder">
                    <div className="bc-img-overlay">
                      <span className="bc-img-text">SaaS Landing</span>
                      <div className="bc-img-line"></div>
                      <div className="bc-img-line-long"></div>
                      <div className="bc-img-subtext">SaaS Landing</div>
                      <div className="bc-img-pill"></div>
                      <div className="bc-img-circle"></div>
                    </div>
                  </div>
                </div>

                <div className="bc-card-right">
                  <div className="bc-card-title-row">
                    <h2 className="bc-card-title">Landing Page Design for Saas (Figma + Webflow-ready)</h2>
                    <span className="bc-badge">Publised</span>
                  </div>

                  <div className="bc-card-meta">
                    <span className="bc-meta-item">Service</span>
                    <span className="bc-meta-item">Design / UI/UX</span>
                    <span className="bc-meta-item">$4,999</span>
                    <span className="bc-meta-item">4.8</span>
                  </div>

                  <div className="bc-stats-grid">
                    <div className="bc-stat-box">
                      <span className="bc-stat-label">Views (30d)</span>
                      <span className="bc-stat-value">280</span>
                    </div>
                    <div className="bc-stat-box">
                      <span className="bc-stat-label">Clicks</span>
                      <span className="bc-stat-value">18</span>
                    </div>
                    <div className="bc-stat-box">
                      <span className="bc-stat-label">Leads / Orders</span>
                      <span className="bc-stat-value">2</span>
                    </div>
                    <div className="bc-stat-box">
                      <span className="bc-stat-label">Conv. Rate</span>
                      <span className="bc-stat-value">1.8%</span>
                    </div>
                  </div>

                  <div className="bc-card-footer">
                    <span className="bc-badge quality-badge">Quality: 75/100</span>
                    <span className="bc-footer-text">Used for estimate (thumbnail + trust + conversion).</span>
                  </div>
                </div>
              </div>

              {/* Boost Setup Section */}
              <div className="bc-setup-card">
                <div className="bc-setup-header">
                  <h3 className="bc-setup-title">Boost Setup</h3>
                  <p className="bc-setup-subtitle">Simple 4-step flow - faster than enterprise ad managers</p>
                </div>

                <div className="mb-[30px] grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {steps.map((stepItem) => {
                    const isActive = step === stepItem.id;
                    const isCompleted = step > stepItem.id;
                    const cardClasses = isActive
                      ? "border-[#c4ea2e] bg-[#d4ff32]"
                      : theme === "dark"
                        ? isCompleted
                          ? "border-[#555555] bg-[#1a1a1a]"
                          : "border-[#444444] bg-[#1a1a1a]"
                        : "border-[#cccccc] bg-white";
                    const iconClasses = isActive
                      ? "bg-[#111111] text-white"
                      : isCompleted
                        ? theme === "dark"
                          ? "bg-white text-[#111111]"
                          : "bg-[#111111] text-white"
                        : "bg-[#d4ff32] text-[#111111]";
                    const titleClasses = theme === "dark"
                      ? isCompleted
                        ? "text-[#eeeeee]"
                        : isActive
                          ? "text-[#111111]"
                          : "text-[#eeeeee]"
                      : "text-[#111111]";
                    const descClasses = isActive
                      ? theme === "dark"
                        ? "text-[#38420b]"
                        : "text-[#5b6e15]"
                      : theme === "dark"
                        ? "text-[#aaaaaa]"
                        : "text-[#777777]";

                    return (
                      <div
                        key={stepItem.id}
                        className={`flex min-h-[68px] items-center gap-3 rounded-2xl border px-2 py-3 cursor-default transition-none ${cardClasses}`}
                      >
                        <div
                          className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold leading-none ${iconClasses}`}
                        >
                          {stepItem.id}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <div className={`whitespace-nowrap text-[15px] font-medium leading-tight ${titleClasses}`}>
                            {stepItem.name}
                          </div>
                          <div className={`whitespace-nowrap text-[12px] leading-tight ${descClasses}`}>
                            {stepItem.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {step === 1 && (
                  <div className="bc-step-content">
                  <h4 className="bc-content-title">What do you want this boost to achieve?</h4>
                  <p className="bc-content-subtitle">Goal options are filtered by listing type.</p>

                  <div className="bc-goals-grid">
                    <div 
                      className={`bc-goal-card ${activeGoal === 'views' ? 'active' : ''}`}
                      onClick={() => setActiveGoal('views')}
                    >
                      <div className="bc-goal-title">Get More Views</div>
                      <div className="bc-goal-desc">Optimizes for inquires &amp; messages</div>
                    </div>
                    <div 
                      className={`bc-goal-card ${activeGoal === 'clicks' ? 'active' : ''}`}
                      onClick={() => setActiveGoal('clicks')}
                    >
                      <div className="bc-goal-title">Get More Clicks</div>
                      <div className="bc-goal-desc">Optimizes for listing opens &amp; CTR</div>
                    </div>
                    <div 
                      className={`bc-goal-card ${activeGoal === 'leads' ? 'active' : ''}`}
                      onClick={() => setActiveGoal('leads')}
                    >
                      <div className="bc-goal-title">Get More Leads</div>
                      <div className="bc-goal-desc">Optimizes for inquires &amp; messages</div>
                    </div>
                  </div>

                  <div className="bc-recommendation-box">
                    <div className="bc-rec-label">Recommended for this listing</div>
                    <div className="bc-rec-text">Because awareness is low, Views is recommended.</div>
                    <div className="bc-rec-badges">
                      <span className="bc-rec-badge lime">Suggested views</span>
                      <span className="bc-rec-badge blue">Allowed: Views, Clicks, Leads</span>
                    </div>
                  </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="bc-step-content">
                    <div className="bc-step-header-row">
                      <div>
                        <h4 className="bc-content-title">Who should see this boost?</h4>
                        <p className="bc-content-subtitle">Keep it simple. Smart is recommended.</p>
                      </div>
                      <div className="bc-toggle-group">
                        <button 
                          className={`bc-toggle-btn ${audienceType === 'smart' ? 'active' : ''}`}
                          onClick={() => setAudienceType('smart')}
                        >Smart audience</button>
                        <button 
                          className={`bc-toggle-btn ${audienceType === 'manual' ? 'active' : ''}`}
                          onClick={() => setAudienceType('manual')}
                        >Manual audience</button>
                      </div>
                    </div>
                    {audienceType === 'manual' ? (
                      <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1 block text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              Geography
                            </label>
                            <input
                              type="text"
                              placeholder="Geography"
                              readOnly
                              className="h-10 w-full rounded-[4px] border border-[#b7b7b7] bg-white px-3 text-[12px] text-[#444] outline-none dark:border-[#505050] dark:bg-[#1f1f1f] dark:text-[#ddd]"
                            />
                            <div className="mt-3 flex flex-wrap gap-2">
                              {selectedGeographies.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-3 rounded-[4px] border border-[#dfdfdf] bg-white px-3 py-[6px] text-[9px] text-[#575757] dark:border-[#4a4a4a] dark:bg-[#232323] dark:text-[#ddd]"
                                >
                                  {tag}
                                  <span className="text-[8px] leading-none">×</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              Interest tags
                            </label>
                            <input
                              type="text"
                              placeholder="Search Tools & Technologies"
                              readOnly
                              className="h-10 w-full rounded-[4px] border border-[#b7b7b7] bg-white px-3 text-[12px] text-[#444] outline-none dark:border-[#505050] dark:bg-[#1f1f1f] dark:text-[#ddd]"
                            />
                            <p className="mt-1 text-[8px] text-[#898989] dark:text-[#a0a0a0]">
                              You can add 10 more tools &amp; technologies
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {selectedInterestTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-3 rounded-[4px] border border-[#dfdfdf] bg-white px-3 py-[6px] text-[9px] text-[#575757] dark:border-[#4a4a4a] dark:bg-[#232323] dark:text-[#ddd]"
                                >
                                  {tag}
                                  <span className="text-[8px] leading-none">×</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              User type
                            </label>
                            <input
                              type="text"
                              placeholder="Select"
                              readOnly
                              className="h-10 w-full rounded-[4px] border border-[#b7b7b7] bg-white px-3 text-[12px] text-[#7b7b7b] outline-none dark:border-[#505050] dark:bg-[#1f1f1f] dark:text-[#bdbdbd]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              Budget intent
                            </label>
                            <input
                              type="text"
                              placeholder="Select"
                              readOnly
                              className="h-10 w-full rounded-[4px] border border-[#b7b7b7] bg-white px-3 text-[12px] text-[#7b7b7b] outline-none dark:border-[#505050] dark:bg-[#1f1f1f] dark:text-[#bdbdbd]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              Traffic source preference
                            </label>
                            <div className="rounded-[8px] bg-white/70 px-2 py-3 dark:bg-[#1f1f1f]">
                              <div className="flex flex-wrap gap-2">
                                {trafficSourcePreferences.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-[4px] border border-[#dfdfdf] bg-white px-2 py-[5px] text-[8px] text-[#575757] dark:border-[#4a4a4a] dark:bg-[#232323] dark:text-[#ddd]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              Device
                            </label>
                            <div className="rounded-[8px] bg-white/70 px-2 py-2 dark:bg-[#1f1f1f]">
                              <div className="flex flex-wrap gap-2">
                                {deviceOptions.map((device, index) => (
                                  <button
                                    key={device}
                                    type="button"
                                    className={`rounded-[4px] border px-3 py-[6px] text-[9px] transition-none ${
                                      index === 0
                                        ? 'border-[#d4ff32] bg-[#d4ff32] text-[#111]'
                                        : 'border-[#dfdfdf] bg-white text-[#575757] dark:border-[#4a4a4a] dark:bg-[#232323] dark:text-[#ddd]'
                                    }`}
                                  >
                                    {device}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="rounded-[10px] border border-[#d4ff32] bg-white px-3 py-4 dark:bg-[#1a1a1a]">
                            <h5 className="text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              Audience size indicator
                            </h5>
                            <div className="mt-3 h-[5px] w-full rounded-full bg-[#dddddd]">
                              <div className="h-[5px] w-[58%] rounded-full bg-[#d4ff32]" />
                            </div>
                            <p className="mt-2 text-[10px] text-[#666] dark:text-[#bbb]">
                              Estimated breadth: 52 / 100
                            </p>
                            <p className="mt-5 text-[8px] text-[#9b9b9b] dark:text-[#9f9f9f]">
                              Audience breadth affects delivery and estimates.
                            </p>
                          </div>

                          <div className="rounded-[10px] border border-[#d4ff32] bg-white px-3 py-4 dark:bg-[#1a1a1a]">
                            <h5 className="text-[12px] font-semibold text-[#222] dark:text-[#f2f2f2]">
                              Where should your listing appear?
                            </h5>
                            <p className="mt-1 text-[11px] text-[#666] dark:text-[#bbb]">
                              Auto placement usually performs best.
                            </p>

                            <div className="mt-4">
                              <div className="mb-2 text-[12px] font-medium text-[#222] dark:text-[#f2f2f2]">
                                Placements
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {manualPlacementOptions.map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    className="rounded-[4px] border border-[#dfdfdf] bg-white px-2 py-[5px] text-[8px] text-[#575757] transition-none dark:border-[#4a4a4a] dark:bg-[#232323] dark:text-[#ddd]"
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bc-ai-targeting-container">
                          <div className="bc-ai-label">AI - selected targeting summary</div>
                          <div className="bc-ai-grid">
                            <div className="bc-ai-card">
                              <div className="bc-ai-card-label">Likely buyer type</div>
                              <div className="bc-ai-card-value">Startup founders</div>
                            </div>
                            <div className="bc-ai-card">
                              <div className="bc-ai-card-label">Interest cluster</div>
                              <div className="bc-ai-card-value">Design + growth</div>
                            </div>
                            <div className="bc-ai-card">
                              <div className="bc-ai-card-label">Geography focus</div>
                              <div className="bc-ai-card-value">India, UAE, US</div>
                            </div>
                            <div className="bc-ai-card">
                              <div className="bc-ai-card-label">Behavior segment</div>
                              <div className="bc-ai-card-value">Actively browsing related listings</div>
                            </div>
                          </div>
                        </div>

                        <div className="bc-step-header-row mt-15">
                          <p className="bc-content-subtitle mb-0">Audience breadth affects delivery and estimates.</p>
                          <div className="bc-toggle-group small">
                            <button 
                              className={`bc-toggle-btn ${placementType === 'auto' ? 'active' : ''}`}
                              onClick={() => setPlacementType('auto')}
                            >Auto</button>
                            <button 
                              className={`bc-toggle-btn ${placementType === 'manual' ? 'active' : ''}`}
                              onClick={() => setPlacementType('manual')}
                            >Manual</button>
                          </div>
                        </div>

                        <div className="bc-step-header-row mt-25 block">
                          <h4 className="bc-content-title">Where should your listing appear?</h4>
                          <p className="bc-content-subtitle">Auto placement usually performs best.</p>
                        </div>

                        <div className="bc-placement-card">
                          <h5 className="bc-placement-title">Auto Placement</h5>
                          <p className="bc-placement-desc">We'll automatically choose the best surfaces for your goal.</p>
                          <div className="bc-placement-pills">
                            <span className="bc-blue-pill">Marketplace feed</span>
                            <span className="bc-blue-pill">Recommendations</span>
                            <span className="bc-blue-pill">Search results</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="bc-setup-footer">
                  <button className="bc-nav-link" onClick={handleBack} disabled={step === 1}>
                    {step > 1 ? <>&larr; Back</> : "Back &rarr;"}
                  </button>
                  <div className="bc-footer-right">
                    <span className="bc-step-indicator">Step {step} of 4</span>
                    <button className="bc-btn black-btn" onClick={handleNext}>Next</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
