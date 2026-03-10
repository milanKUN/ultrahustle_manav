import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../OnboardingSelect.css";
import { getClientOnboarding, saveClientNeeds } from "../../api/onboardingApi";
import {
  Palette,
  Code,
  Megaphone,
  PenTool,
  Image,
  Video,
  Database,
  Music,
} from "lucide-react";

export default function ClientNeeds() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState("");
  const [frequency, setFrequency] = useState(null); // 'once', 'monthly', 'weekly'
  const [hiringForTeam, setHiringForTeam] = useState(null); // 'yes', 'no'
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Dropdown State
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const roleRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Prefill from backend (resume flow)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getClientOnboarding();
        const record = res?.data ?? res;
        if (!record || !alive) return;

        if (Array.isArray(record.categories)) setSelectedCategories(record.categories);
        if (record.avg_project_budget) setBudget(record.avg_project_budget);
        if (record.expected_frequency) setFrequency(record.expected_frequency);
        if (record.hiring_for_team) setHiringForTeam(record.hiring_for_team);
        if (record.hiring_business_name) setBusinessName(record.hiring_business_name);
        if (record.hiring_role) setRole(record.hiring_role);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const currentStep = 4;
  const totalSteps = 8;

  const stepPaths = [
    "/onboarding",
    "/client-role-selection",
    "/client-work-type-selection",
    "/client-goals-selection",
    "/client-needs",
    "/client-business-details",
    "/client-setup-workspace",
    "/client-profile-setup"
  ];

  const categories = [
    { id: "design", label: "Design", icon: Palette },
    { id: "development", label: "Development", icon: Code },
    { id: "marketing", label: "Marketing", icon: Megaphone },
    { id: "writing", label: "Writing", icon: PenTool },
    { id: "illustration", label: "Illustration", icon: Image },
    { id: "video", label: "Video Editing", icon: Video },
    { id: "data-ai", label: "Data & Ai", icon: Database },
    { id: "music", label: "Music & Audio", icon: Music },
  ];

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBack = () => navigate("/client-goals-selection");

  const handleReset = () => {
    navigate("/onboarding");
    setBusinessName("");
    setRole("");
  };

  const isContinueEnabled =
    selectedCategories.length > 0 &&
    budget &&
    frequency &&
    hiringForTeam &&
    (hiringForTeam === "no" || (hiringForTeam === "yes" && businessName && role));

  const handleContinue = async () => {
    if (!isContinueEnabled || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await saveClientNeeds({
        categories: selectedCategories,
        avg_project_budget: budget,
        expected_frequency: frequency,
        hiring_for_team: hiringForTeam,
        hiring_business_name: hiringForTeam === "yes" ? businessName : undefined,
        hiring_role: hiringForTeam === "yes" ? role : undefined,
      });
      navigate("/client-business-details");
    } catch (e) {
      console.error("Failed to save client needs", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Mobile chip (screenshot-style)
  const MobileChip = ({ category }) => {
    const Icon = category.icon;
    const isSelected = selectedCategories.includes(category.id);

    return (
      <button
        type="button"
        onClick={() => toggleCategory(category.id)}
        className={[
          "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
          isSelected ? "bg-[#CEFF1B] border-black shadow-sm" : "bg-white border-[#CEFF1B]",
        ].join(" ")}
      >
        <span
          className={[
            "w-6 h-6 rounded-lg flex items-center justify-center",
            "bg-[#CEFF1B]",
          ].join(" ")}
        >
          <Icon size={14} className="text-black" strokeWidth={2} />
        </span>
        <span className="text-xs font-medium text-black/80 whitespace-nowrap">
          {category.label}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col min-[950px]:flex-row">
      {/* Top Section on Mobile / Left Side on Desktop - Acid Green Panel */}
      <div className="w-full min-[950px]:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[45vh] min-[950px]:min-h-screen">
        <div className="absolute inset-0 flex flex-col justify-between p-6 min-[950px]:p-10">
          {/* Back Button - Mobile Only */}
          <button
            onClick={handleBack}
            className="min-[950px]:hidden w-10 h-10 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: "linear-gradient(180deg, #FFFFFF, #9C9C9C)",
              padding: "2px",
            }}
          >
            <span className="w-full h-full rounded-full flex items-center justify-center bg-[#CEFF1B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          </button>

          {/* Question */}
          <div className="flex-1 flex flex-col justify-center min-[950px]:justify-start min-[950px]:pt-[clamp(40px,10vh,128px)] items-center min-[950px]:items-start text-center min-[950px]:text-left px-4 min-[950px]:px-0">
            <h2 className="text-3xl min-[950px]:text-4xl font-bold text-black leading-tight">
              Tell us more
            </h2>

            <h2 className="text-3xl min-[950px]:text-4xl font-bold text-black -mt-1 leading-tight">
              about what your needs            </h2>

            <p className="text-black/60 text-base min-[950px]:text-xl mt-4 min-[950px]:mt-4 max-w-md">
              What type of creators do you hire?
            </p>
          </div>

          {/* Step Indicators - Desktop Only */}
          <div className="hidden min-[950px]:flex items-center gap-3 ml-12">
            {[...Array(totalSteps)].map((_, index) => (
              index <= currentStep && (
                <div
                  key={index}
                  onClick={() => index < currentStep && navigate(stepPaths[index])}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep ? "bg-black w-4 h-4" : "bg-white cursor-pointer"
                    }`}
                />
              )
            ))}
          </div>



        </div>
      </div>

      {/* Bottom Section on Mobile      {/* Right Section - Settings/Information */}
      <div className="w-full min-[950px]:w-[70%] bg-[#E0E0E0] rounded-t-[50px] min-[950px]:rounded-none -mt-12 min-[950px]:mt-0 px-3 py-6 min-[950px]:p-[clamp(24px,4vh,48px)] flex flex-col justify-center items-center relative overflow-visible min-h-[60vh] min-[950px]:min-h-screen z-20">
        {/* Main Content Area */}
        <div className="relative z-10 w-full max-w-[900px]">
          {/* ✅ MOBILE (screenshot-style layout) */}
          <div className="min-[950px]:hidden bg-transparent   py-4 border  ">
            {/* Categories chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <MobileChip key={c.id} category={c} />
              ))}
            </div>

            {/* Budget + Frequency */}
            <div className="mt-5 grid grid-cols-2 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-black/70 mb-2">
                  Average project budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="$2K - $4K"
                  className="w-full h-10 rounded-xl border border-black bg-white px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-black/70 mb-2">
                  Expected frequency
                </label>
                <div className="flex gap-2">
                  {["Once", "Monthly", "Weekly"].map((opt) => {
                    const val = opt.toLowerCase();
                    const active = frequency === val;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFrequency(val)}
                        className={[
                          "flex-1 h-10 rounded-xl border text-xs font-medium transition-all",
                          active
                            ? "bg-[#CEFF1B] border-black text-black"
                            : "bg-white border-black/20 text-black/60",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hiring for team */}
            <div className="mt-5">
              <label className="block text-[11px] font-semibold text-black/70 mb-2">
                Hiring for business/team?
              </label>
              <div className="flex gap-2">
                {["Yes", "No"].map((opt) => {
                  const val = opt.toLowerCase();
                  const active = hiringForTeam === val;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHiringForTeam(val)}
                      className={[
                        "flex-1 h-10 rounded-xl border text-xs font-medium transition-all",
                        active
                          ? "bg-[#CEFF1B] border-black text-black"
                          : "bg-white border-black/20 text-black/60",
                      ].join(" ")}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional business fields */}
            {hiringForTeam === "yes" && (
              <div className="mt-5 grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-black/70 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Type here"
                    className="w-full h-10 rounded-xl bg-transparent border-1 border-black/20 bg-white px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-black/70 mb-2">
                    Role
                  </label>
                  <div className={`onboarding-custom-select ${isRoleOpen ? "active" : ""}`} ref={roleRef}>
                    <div
                      className={`onboarding-selected-option ${isRoleOpen ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRoleOpen(!isRoleOpen);
                      }}
                    >
                      <span>{role || "Select"}</span>
                      <span className="onboarding-arrow">▼</span>
                    </div>

                    {isRoleOpen && (
                      <ul className="onboarding-options-list role-dropdown-small">
                        <li
                          className="text-gray-400 cursor-not-allowed"
                          style={{ pointerEvents: "none" }}
                        >
                          Select
                        </li>
                        {["Manager", "Founder", "HR", "Director", "Other"].map((opt) => (
                          <li
                            key={opt}
                            className={role === opt ? "active" : ""}
                            onClick={() => {
                              setRole(opt);
                              setIsRoleOpen(false);
                            }}
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* bottom buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleReset}
                className="h-10 px-4 rounded-lg border border-black/20 bg-white text-black/60 text-sm"
              >
                Reset
              </button>

              <button
                onClick={handleBack}
                className="h-10 px-4 rounded-lg border border-black/40 bg-white text-black text-sm"
              >
                Back
              </button>

              <button
                onClick={handleContinue}
                disabled={!isContinueEnabled}
                className={[
                  "h-10 px-4 rounded-lg text-sm font-medium border transition-all",
                  isContinueEnabled
                    ? "bg-[#CEFF1B] border-black text-black"
                    : "bg-[#DADADA] border-black/20 text-black/30",
                ].join(" ")}
              >
                Continue
              </button>
            </div>

            {/* step dots */}
            <div className="mt-6 flex justify-center items-center gap-2">
              {[...Array(totalSteps)].map((_, index) => (
                index <= currentStep && (
                  <span
                    key={index}
                    onClick={() => index < currentStep && navigate(stepPaths[index])}
                    className={[
                      "w-2 h-2 rounded-full",
                      index === currentStep ? "bg-black" : "bg-black/30 cursor-pointer",
                    ].join(" ")}
                  />
                )
              ))}
            </div>



          </div>

          {/* ✅ DESKTOP (your original layout 그대로) */}
          <div className="hidden min-[950px]:block">
            {/* Creator Categories - Desktop Container */}
            <div className="bg-white/40 min-[950px]:bg-white/40 backdrop-blur-md border-1 border-[#CEFF1B] min-[950px]:border min-[950px]:border-[#CEFF1B] rounded-[24px] min-[950px]:rounded-[30px] p-4 min-[950px]:p-[clamp(16px,3vh,32px)] shadow-xl mb-4 min-[950px]:mb-6 flex flex-col justify-center gap-4">
              <div className="hidden min-[950px]:flex flex-col gap-4">
                {[categories.slice(0, 3), categories.slice(3, 6), categories.slice(6)].map(
                  (row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap min-[950px]:flex-nowrap gap-4 w-full">
                      {row.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategories.includes(category.id);
                        return (
                          <div
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`
                              flex items-center gap-3.5 px-[clamp(12px,2vw,24px)] py-[clamp(8px,1.5vh,14px)] rounded-2xl cursor-pointer border-2 transition-all duration-300 backdrop-blur-sm justify-center whitespace-nowrap flex-1
                              ${isSelected
                                ? "bg-[#CEFF1B] border-black/50 shadow-md scale-105"
                                : "bg-transparent border-[#2B2B2B] "
                              }
                            `}
                          >
                            <div
                              className={`p-1.5 rounded-xl flex items-center justify-center shrink-0 bg-[#CEFF1B]`}
                            >
                              <Icon size={rowIndex === 0 ? 22 : 18} className="text-black" strokeWidth={2} />
                            </div>
                            <span
                              className={`font-[500] text-[clamp(14px,1.2vw,18px)] ${isSelected ? "text-black" : "text-gray-800"
                                }`}
                            >
                              {category.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Desktop form fields (original) */}
            <div className="grid grid-cols-2 gap-3 min-[950px]:gap-8 mb-6 items-end relative z-20">
              <div>
                <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                  Average project budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="$2K - $4K"
                  className="w-full p-2 min-[950px]:p-[clamp(10px,1.2vh,12px)] rounded-md min-[950px]:rounded-xl border border-black bg-transparent min-[950px]:bg-gray-100 text-gray-800 placeholder-gray-500 focus:!border-transparent focus:outline-none transition-all font-medium text-xs min-[950px]:text-base bg-[#F0F0F0]/50 focus:ring-0 focus:shadow-[0_0_20px_#CEFF1B]"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                  Expected project frequency
                </label>
                <div className="flex gap-2">
                  {["Once", "Monthly", "Weekly"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFrequency(opt.toLowerCase())}
                      className={`flex-1 py-1.5 min-[950px]:py-[clamp(8px,1vh,12px)] px-2 rounded-md min-[950px]:rounded-xl border border-black font-medium transition-all text-xs min-[950px]:text-base ${frequency === opt.toLowerCase()
                        ? "bg-[#CEFF1B] border-black text-black"
                        : "bg-transparent border-[#2B2B2B] text-gray-900"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                Are you hiring for your business/team?
              </label>
              <div className="flex gap-2 w-fit">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setHiringForTeam(opt.toLowerCase())}
                    className={`px-6 py-2 min-[950px]:px-8 min-[950px]:py-3 border border-black rounded-md min-[950px]:rounded-xl border font-medium transition-all text-xs min-[950px]:text-base ${hiringForTeam === opt.toLowerCase()
                      ? "bg-[#CEFF1B] border-black text-black"
                      : "bg-transparent border-[#2B2B2B] text-gray-600"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {hiringForTeam === "yes" && (
              <div className="grid grid-cols-2 gap-3 min-[950px]:gap-8 mb-6 animate-fade-in-up items-end">
                <div>
                  <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Business Name"
                    className="w-full p-2 min-[950px]:p-3 rounded-md min-[950px]:rounded-xl border-1 border-[#2B2B2B] bg-transparent min-[950px]:bg-gray-100 text-gray-800 placeholder-gray-500 focus:!border-transparent focus:outline-none transition-all font-medium text-xs min-[950px]:text-base focus:ring-0 focus:shadow-[0_0_20px_#CEFF1B]"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                    Role
                  </label>
                  <div className={`onboarding-custom-select ${isRoleOpen ? "active" : ""}`} ref={roleRef}>
                    <div
                      className={`onboarding-selected-option ${isRoleOpen ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRoleOpen(!isRoleOpen);
                      }}
                    >
                      <span className={!role ? "opacity-70" : ""}>
                        {role || "Role"}
                      </span>
                      <span className="onboarding-arrow">▼</span>
                    </div>


                    {isRoleOpen && (
                      <ul className="onboarding-options-list role-dropdown-small">

                        {["Manager", "Founder", "HR", "Director", "Other"].map((opt) => (
                          <li
                            key={opt}
                            className={role === opt ? "active" : ""}
                            onClick={() => {
                              setRole(opt);
                              setIsRoleOpen(false);
                            }}
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 min-[950px]:mt-[clamp(16px,2vh,32px)] relative z-10 w-full">
              <div className="flex justify-between items-center gap-2 min-[950px]:gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 min-[950px]:px-8 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg border border-black text-gray-600 font-medium text-xs min-[950px]:text-lg hover:bg-gray-100 transition-all"
                >
                  Reset
                </button>

                <div className="flex gap-2 min-[950px]:gap-4">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 min-[950px]:px-10 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg border border-black text-gray-700 font-medium text-xs min-[950px]:text-lg hover:bg-gray-100 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!isContinueEnabled}
                    className={`px-4 py-2 min-[950px]:px-10 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg font-medium text-xs min-[950px]:text-lg transition-all whitespace-nowrap ${isContinueEnabled
                      ? "bg-[#CEFF1B] border border-black text-black hover:bg-[#b8e617]"
                      : "bg-lime-200 border border-[#2B2B2B] text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* keep original mobile dots outside? ❌ not needed now (we added inside mobile card) */}
        </div>
      </div>
    </div>
  );
}
