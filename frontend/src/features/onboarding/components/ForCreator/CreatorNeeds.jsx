import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../OnboardingSelect.css";
import { getFreelancerOnboarding, saveFreelancerSkills } from "../../api/onboardingApi";
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

export default function CreatorNeeds() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [primarySkill, setPrimarySkill] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [rateRange, setRateRange] = useState("");
  const [hasPortfolio, setHasPortfolio] = useState(null);
  const [portfolioLinks, setPortfolioLinks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const experienceRef = useRef(null);

  const experienceOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "pro", label: "Pro" },
    { value: "expert", label: "Expert" },
  ];

  const selectedExperienceLabel =
    experienceOptions.find((opt) => opt.value === experienceLevel)?.label ||
    "Select";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (experienceRef.current && !experienceRef.current.contains(event.target)) {
        setIsExperienceOpen(false);
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
        const res = await getFreelancerOnboarding();
        const record = res?.data ?? res;
        if (!record || !alive) return;

        if (Array.isArray(record.categories)) setSelectedCategories(record.categories);
        if (record.primary_skill) setPrimarySkill(record.primary_skill);
        if (record.experience_level) setExperienceLevel(record.experience_level);
        if (record.rate_range) setRateRange(record.rate_range);
        if (record.has_portfolio) setHasPortfolio(record.has_portfolio);
        if (record.portfolio_links) setPortfolioLinks(record.portfolio_links);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const currentStep = 4;
  const totalSteps = 7;

  const stepPaths = [
    "/onboarding",
    "/creator-role-selection",
    "/creator-work-type-selection",
    "/creator-goals-selection",
    "/creator-needs",
    "/creator-setup-workspace",
    "/creator-profile-setup",
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

  const handleBack = () => navigate("/creator-goals-selection");

  const isContinueEnabled =
    selectedCategories.length > 0 &&
    primarySkill &&
    experienceLevel &&
    hasPortfolio &&
    (hasPortfolio === "no" || (hasPortfolio === "yes" && portfolioLinks));

  const handleContinue = async () => {
    if (!isContinueEnabled || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await saveFreelancerSkills({
        categories: selectedCategories,
        primary_skill: primarySkill,
        experience_level: experienceLevel,
        rate_range: rateRange || undefined,
        has_portfolio: hasPortfolio,
        portfolio_links: hasPortfolio === "yes" ? portfolioLinks : undefined,
      });
      navigate("/creator-setup-workspace");
    } catch (e) {
      console.error("Failed to save freelancer skills", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => navigate("/onboarding");

  // ✅ Mobile/Tablet chip (bigger on iPad mini)
  const MobileChip = ({ category }) => {
    const Icon = category.icon;
    const active = selectedCategories.includes(category.id);

    return (
      <button
        type="button"
        onClick={() => toggleCategory(category.id)}
        className={[
          "flex items-center gap-2 rounded-xl border transition-all",
          "px-3 py-2 min-[701px]:px-4 min-[701px]:py-3",
          active
            ? "bg-[#CEFF1B] border-black shadow-sm"
            : "bg-white border-[#CEFF1B]",
        ].join(" ")}
      >
        <span className="w-6 h-6 min-[701px]:w-7 min-[701px]:h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#CEFF1B]">
          <Icon size={14} className="text-black min-[701px]:hidden" strokeWidth={2} />
          <Icon size={16} className="text-black hidden min-[701px]:block" strokeWidth={2} />
        </span>
        <span className="text-xs min-[701px]:text-sm font-medium text-black/80 whitespace-nowrap">
          {category.label}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-[100svh] w-full flex flex-col min-[950px]:flex-row">
      {/* LEFT/TOP PANEL */}
      <div className="w-full min-[950px]:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[45vh] min-[950px]:min-h-[100svh]">
        <div className="absolute inset-0 flex flex-col justify-between p-6 min-[701px]:p-8 min-[950px]:p-10">
          {/* Back Button - Mobile/Tablet Only */}
          <button
            onClick={handleBack}
            className="min-[950px]:hidden w-10 h-10 min-[701px]:w-12 min-[701px]:h-12 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: "linear-gradient(180deg, #FFFFFF, #9C9C9C)",
              padding: "2px",
            }}
          >
            <span className="w-full h-full rounded-full flex items-center justify-center bg-[#CEFF1B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 min-[701px]:h-6 min-[701px]:w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </button>

          {/* Question */}
          <div className="flex-1 flex flex-col justify-center min-[950px]:justify-start min-[950px]:pt-[clamp(40px,10vh,128px)] items-center min-[950px]:items-start text-center min-[950px]:text-left px-4 min-[950px]:px-0">
            <h2 className="text-3xl min-[701px]:text-4xl min-[950px]:text-4xl font-bold text-black leading-tight">
              Tell us more about
            </h2>

            <h2 className="text-3xl min-[701px]:text-4xl min-[950px]:text-4xl font-bold text-black -mt-1 leading-tight">
              your skills
            </h2>

            <p className="text-black/60 text-base min-[701px]:text-lg min-[950px]:text-xl mt-4 max-w-md">
              What service do you offer
            </p>
          </div>

          {/* Step Indicators - Desktop Only */}
          <div className="hidden min-[950px]:flex items-center gap-3 ml-12">
            {[...Array(totalSteps)].map((_, index) =>
              index <= currentStep ? (
                <div
                  key={index}
                  onClick={() => index < currentStep && navigate(stepPaths[index])}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep ? "bg-black w-4 h-4" : "bg-white cursor-pointer"
                    }`}
                />
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* RIGHT/BOTTOM CONTENT */}
      <div
        className="
          w-full min-[950px]:w-[70%]
          bg-[#E0E0E0]
          rounded-t-[34px] max-[400px]:rounded-t-[28px]
          min-[701px]:rounded-t-[44px]
          min-[950px]:rounded-none

          -mt-10 max-[400px]:-mt-8
          min-[701px]:-mt-12
          min-[950px]:mt-0

          px-3 py-6
          min-[701px]:px-8 min-[701px]:py-10
          min-[950px]:p-[clamp(24px,4vh,48px)]

          flex flex-col justify-center items-center
          relative overflow-visible min-h-[60vh] min-[701px]:min-h-[62vh] min-[950px]:min-h-[100svh]
          z-20
        "
      >
        <div className="relative z-10 w-full max-w-[900px]">
          {/* ✅ MOBILE + TABLET (0–949px) — FIXED BIGGER FOR iPad mini */}
          <div className="min-[950px]:hidden w-full max-w-[420px] min-[701px]:max-w-[760px] mx-auto">
            <div
              className="
                bg-transparent rounded-[26px]
                px-2 py-4
                min-[701px]:px-6 min-[701px]:py-6
                border border-black/10
                shadow-sm
              "
            >
              {/* category chips */}
              <div className="flex flex-wrap gap-2 min-[701px]:gap-3">
                {categories.map((c) => (
                  <MobileChip key={c.id} category={c} />
                ))}
              </div>

              {/* fields */}
              <div className="mt-5 min-[701px]:mt-7 grid grid-cols-2 gap-3 min-[701px]:gap-5 items-end relative z-20">
                <div>
                  <label className="block text-[11px] min-[701px]:text-[13px] font-semibold text-black/70 mb-2">
                    Primary skill / niche
                  </label>
                  <input
                    type="text"
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    placeholder="Skill/niche"
                    className="w-full h-10 min-[701px]:h-12 rounded-xl border border-black/20 bg-white px-3 min-[701px]:px-4 text-sm min-[701px]:text-base text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] min-[701px]:text-[13px] font-semibold text-black/70 mb-2">
                    Experience level
                  </label>

                  <div
                    className={`onboarding-custom-select ${isExperienceOpen ? "active" : ""}`}
                    ref={experienceRef}
                  >
                    <div
                      className={`onboarding-selected-option ${isExperienceOpen ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExperienceOpen(!isExperienceOpen);
                      }}
                    >
                      <span>{selectedExperienceLabel}</span>
                      <span className="onboarding-arrow">▼</span>
                    </div>

                    {isExperienceOpen && (
                      <ul className="onboarding-options-list">

                        {experienceOptions.map((opt) => (
                          <li
                            key={opt.value}
                            className={experienceLevel === opt.value ? "active" : ""}
                            onClick={() => {
                              setExperienceLevel(opt.value);
                              setIsExperienceOpen(false);
                            }}
                          >
                            {opt.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] min-[701px]:text-[13px] font-semibold text-black/70 mb-2">
                    Hourly / project range (optional)
                  </label>
                  <input
                    type="text"
                    value={rateRange}
                    onChange={(e) => setRateRange(e.target.value)}
                    placeholder="Hourly/project range"
                    className="w-full h-10 min-[701px]:h-12 rounded-xl border border-black/20 bg-white px-3 min-[701px]:px-4 text-sm min-[701px]:text-base text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] min-[701px]:text-[13px] font-semibold text-black/70 mb-2">
                    Do you already have a portfolio?
                  </label>
                  <div className="flex gap-2 min-[701px]:gap-3">
                    {["Yes", "No"].map((opt) => {
                      const val = opt.toLowerCase();
                      const active = hasPortfolio === val;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setHasPortfolio(val)}
                          className={[
                            "flex-1 rounded-xl border font-medium transition-all",
                            "h-10 min-[701px]:h-12 text-xs min-[701px]:text-sm",
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

              {/* portfolio links */}
              {hasPortfolio === "yes" && (
                <div className="mt-5 min-[701px]:mt-7">
                  <label className="block text-[11px] min-[701px]:text-[13px] font-semibold text-black/70 mb-2">
                    Upload links (IG, Behance, Portfolio, Drive)
                  </label>
                  <input
                    type="text"
                    value={portfolioLinks}
                    onChange={(e) => setPortfolioLinks(e.target.value)}
                    placeholder="Paste here"
                    className="w-full h-10 min-[701px]:h-12 rounded-xl border border-black/20 bg-white px-3 min-[701px]:px-4 text-sm min-[701px]:text-base text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>
              )}

              {/* buttons */}
              <div className="mt-6 min-[701px]:mt-8 flex flex-wrap items-center justify-center gap-2 min-[701px]:gap-5">
                <button
                  onClick={handleReset}
                  className="
                    h-10 min-[701px]:h-12
                    px-4 min-[701px]:px-8
                    rounded-lg border border-black/20
                    bg-white text-black/60
                    text-sm min-[701px]:text-base
                  "
                >
                  Reset
                </button>

                <button
                  onClick={handleBack}
                  className="
                    h-10 min-[701px]:h-12
                    px-4 min-[701px]:px-8
                    rounded-lg border border-black/40
                    bg-white text-black
                    text-sm min-[701px]:text-base
                  "
                >
                  Back
                </button>

                <button
                  onClick={handleContinue}
                  disabled={!isContinueEnabled}
                  className={[
                    "rounded-lg font-medium border transition-all",
                    "h-10 min-[701px]:h-12 px-4 min-[701px]:px-8 text-sm min-[701px]:text-base",
                    isContinueEnabled
                      ? "bg-[#CEFF1B] border-black text-black"
                      : "bg-[#DADADA] border-black/20 text-black/30",
                  ].join(" ")}
                >
                  Continue
                </button>
              </div>

              {/* dots */}
              <div className="mt-6 min-[701px]:mt-8 flex justify-center items-center gap-2">
                {[...Array(totalSteps)].map((_, index) =>
                  index <= currentStep ? (
                    <span
                      key={index}
                      onClick={() => index < currentStep && navigate(stepPaths[index])}
                      className={[
                        "rounded-full",
                        "w-2 h-2 min-[701px]:w-2.5 min-[701px]:h-2.5",
                        index === currentStep ? "bg-black" : "bg-black/30 cursor-pointer",
                      ].join(" ")}
                    />
                  ) : null
                )}
              </div>
            </div>
          </div>

          {/* ✅ DESKTOP (your original, unchanged) */}
          <div className="hidden min-[950px]:block">
            {/* ... kept exactly as you had (desktop code unchanged) */}
            {/* Creator Categories - Desktop Container */}
            <div className="bg-[#FEFEFE]/40 min-[950px]:bg-white/40 backdrop-blur-md border-[#CEFF1B] min-[950px]:border min-[950px]:border-[#CEFF1B] rounded-[24px] min-[950px]:rounded-[30px] p-4 min-[950px]:p-[clamp(16px,3vh,32px)] shadow-xl mb-4 min-[950px]:mb-6 flex flex-col justify-center gap-4">
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
                                ? "bg-[#CEFF1B] border-[0.6px] border-[#2B2B2B] shadow-md scale-105"
                                : "bg-transparent border-[#2B2B2B] hover:bg-white/10"
                              }
                            `}
                          >
                            <div className="p-1.5 rounded-xl flex items-center justify-center shrink-0 bg-[#CEFF1B]">
                              <Icon
                                size={rowIndex === 0 ? 22 : 18}
                                className="text-black"
                                strokeWidth={2}
                              />
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

            {/* Desktop fields (original) */}
            <div className="grid grid-cols-2 gap-3 min-[950px]:gap-8 mb-6 items-end relative z-20">
              <div>
                <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                  Primary skill / niche
                </label>
                <input
                  type="text"
                  value={primarySkill}
                  onChange={(e) => setPrimarySkill(e.target.value)}
                  placeholder="Skill/niche"
                  className="w-full p-2 min-[950px]:p-[clamp(10px,1.2vh,12px)] rounded-md min-[950px]:rounded-xl border border-black bg-transparent min-[950px]:bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_20px_#CEFF1B] font-medium text-xs min-[950px]:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-800  font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                  Experience level
                </label>
                <div className={`onboarding-custom-select ${isExperienceOpen ? "active" : ""}`} ref={experienceRef}>
                  <div
                    className={`onboarding-selected-option ${isExperienceOpen ? "open" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExperienceOpen(!isExperienceOpen);
                    }}
                  >
                    <span>{selectedExperienceLabel === "Select" ? "Experience level" : selectedExperienceLabel}</span>
                    <span className="onboarding-arrow">▼</span>
                  </div>

                  {isExperienceOpen && (
                    <ul className="onboarding-options-list">
                      {experienceOptions.map((opt) => (
                        <li
                          key={opt.value}
                          className={experienceLevel === opt.value ? "active" : ""}
                          onClick={() => {
                            setExperienceLevel(opt.value);
                            setIsExperienceOpen(false);
                          }}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                  Your hourly / project range
                </label>
                <input
                  type="text"
                  value={rateRange}
                  onChange={(e) => setRateRange(e.target.value)}
                  placeholder="Hourly/project range"
                  className="w-full p-2 min-[950px]:p-[clamp(10px,1.2vh,12px)] bg-transparent rounded-md min-[950px]:rounded-xl border border-black bg-[#F0F0F0]/50 min-[950px]:bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_20px_#CEFF1B] transition-all font-medium text-xs min-[950px]:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                  Do you already have a portfolio?
                </label>
                <div className="flex gap-2">
                  {["Yes", "No"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setHasPortfolio(opt.toLowerCase())}
                      className={`flex-1 p-2 min-[950px]:py-3 rounded-md min-[950px]:rounded-xl font-medium transition-all text-xs min-[950px]:text-base ${hasPortfolio === opt.toLowerCase()
                        ? "bg-[#CEFF1B] text-black"
                        : "bg-transparent text-gray-600"
                        }`}
                      style={{ border: "0.6px solid #000" }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasPortfolio === "yes" && (
              <div className="grid grid-cols-1 gap-3 min-[950px]:gap-6 mb-4 min-[950px]:mb-6 animate-fade-in-up">
                <div>
                  <label className="block text-gray-800 font-semibold font-roboto mb-2 min-[950px]:mb-3 text-[9px] min-[950px]:text-lg whitespace-nowrap">
                    Upload links (IG, Behance, Portfolio, Drive)
                  </label>
                  <input
                    type="text"
                    value={portfolioLinks}
                    onChange={(e) => setPortfolioLinks(e.target.value)}
                    placeholder="Paste here"
                    className="w-[49%] bg-transparent p-2 min-[950px]:p-3 rounded-md min-[950px]:rounded-xl border border-black bg-[#F0F0F0]/50 min-[950px]:bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_20px_#CEFF1B] transition-all font-medium text-xs min-[950px]:text-base"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 min-[950px]:mt-[clamp(16px,2vh,32px)] relative z-10 w-full">
              <div className="flex justify-between items-center gap-2 min-[950px]:gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 min-[950px]:px-8 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg border border-black text-black font-medium text-xs min-[950px]:text-lg hover:bg-gray-100 transition-all"
                >
                  Reset
                </button>

                <div className="flex gap-2 min-[950px]:gap-4">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 min-[950px]:px-10 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg border border-black text-black font-medium text-xs min-[950px]:text-lg hover:bg-gray-100 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!isContinueEnabled}
                    className={`px-4 py-2 min-[950px]:px-10 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg font-medium text-xs min-[950px]:text-lg transition-all whitespace-nowrap ${isContinueEnabled
                      ? "bg-[#CEFF1B] border border-black text-black hover:bg-[#b8e617]"
                      : "bg-lime-200 border border-black text-black cursor-not-allowed"
                      }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /desktop */}
        </div>
      </div>
    </div>
  );
}
