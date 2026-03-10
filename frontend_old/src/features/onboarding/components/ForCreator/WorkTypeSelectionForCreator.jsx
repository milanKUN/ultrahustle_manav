import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../OnboardingSelect.css";

export default function WorkTypeSelectionForCreator() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [industry, setIndustry] = useState("");
  const [buildTeamPlan, setBuildTeamPlan] = useState(null);

  // Custom Dropdown State
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const industryRef = useRef(null);

  const industryOptions = [
    { value: "technology", label: "Technology & IT" },
    { value: "marketing", label: "Marketing & Advertising" },
    { value: "design", label: "Design & Creative" },
    { value: "education", label: "Education & E-learning" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance & Consulting" },
    { value: "ecommerce", label: "E-commerce & Retail" },
    { value: "media", label: "Media & Entertainment" },
    { value: "other", label: "Other" },
  ];

  const selectedIndustryLabel =
    industryOptions.find((opt) => opt.value === industry)?.label || "Select one";

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (industryRef.current && !industryRef.current.contains(event.target)) {
        setIsIndustryOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const currentStep = 2;
  const totalSteps = 7;

  const stepPaths = [
    "/onboarding",
    "/role-selection",
    "/creator-work-type-selection",
    "/creator-goals-selection",
    "/creator-needs",
    "/creator-setup-workspace",
    "/creator-profile-setup",
  ];

  const handleBack = () => navigate("/role-selection");

  const handleContinue = () => {
    if (selectedType) navigate("/creator-goals-selection");
  };

  const handleReset = () => navigate("/onboarding");

  const canContinue =
    selectedType &&
    (selectedType !== "team" || (industry && buildTeamPlan));

  return (
    <div className="min-h-[100svh] w-full flex flex-col min-[950px]:flex-row">
      {/* Left Panel */}
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
            aria-label="Back"
          >
            <span className="w-full h-full rounded-full flex items-center justify-center bg-[#CEFF1B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 min-[701px]:h-6 min-[701px]:w-6 text-black"
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

          <div className="flex-1 flex flex-col justify-center min-[950px]:justify-start min-[950px]:pt-[clamp(40px,10vh,128px)] items-center min-[950px]:items-start text-center min-[950px]:text-left px-4 min-[950px]:px-0">
            <h2 className="text-3xl min-[701px]:text-4xl min-[950px]:text-4xl font-bold text-black">
              How do you work?
            </h2>
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

      {/* Right / Content */}
      <div
        className="
          w-full min-[950px]:w-[70%]
          bg-[#E0E0E0]
          min-[950px]:bg-gradient-to-br min-[950px]:from-[#E8E8E8] min-[950px]:via-[#E0E0E0] min-[950px]:to-[#D8D8D8]

          rounded-t-[34px] max-[400px]:rounded-t-[28px]
          min-[701px]:rounded-t-[44px]
          min-[950px]:rounded-none

          -mt-10 max-[400px]:-mt-8
          min-[701px]:-mt-12
          min-[950px]:mt-0

          p-6 pt-8
          min-[701px]:p-10 min-[701px]:pt-10
          min-[950px]:p-[clamp(24px,4vh,48px)]

          flex flex-col justify-start min-[701px]:justify-center min-[950px]:justify-center
          items-center relative overflow-visible z-20
          min-h-[60vh] min-[701px]:min-h-[62vh] min-[950px]:min-h-[100svh]
        "
      >
        {/* Desktop glows (unchanged) */}
        <div className="hidden min-[950px]:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0" />

        {/* ✅ MOBILE + TABLET (0–949px) — FIXED BIGGER FOR iPad mini */}
        <div
          className="
            min-[950px]:hidden w-full relative z-10
            max-w-[420px]
            min-[701px]:max-w-[760px]
            px-0
            min-[701px]:px-6
          "
        >
          <div className="bg-transparent border-none rounded-none shadow-none">
            {/* Cards row */}
            <div className="grid grid-cols-2 gap-3 min-[701px]:gap-5">
              <button
                type="button"
                onClick={() => setSelectedType("solo")}
                className={[
                  "text-left rounded-2xl transition-all border",
                  "p-4 min-[701px]:p-6",
                  selectedType === "solo"
                    ? "bg-[#CEFF1B] border-black shadow-sm"
                    : "bg-white border-[#CEFF1B]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex items-center rounded-md font-medium border",
                    "px-2 py-1 text-[10px] min-[701px]:px-4 min-[701px]:py-1.5 min-[701px]:text-sm",
                    selectedType === "solo"
                      ? "border-black bg-[#FEFEFE]/66"
                      : "border-black/40 bg-[#FEFEFE]/66",
                  ].join(" ")}
                >
                  Solo Creator / Solo Professional
                </span>

                <ul className="mt-3 min-[701px]:mt-4 space-y-2 min-[701px]:space-y-3 text-[12px] min-[701px]:text-[14px] leading-4 min-[701px]:leading-5 text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>I work individually</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>I manage my own tasks and deliveries</span>
                  </li>
                </ul>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("team")}
                className={[
                  "text-left rounded-2xl transition-all border",
                  "p-4 min-[701px]:p-6",
                  selectedType === "team"
                    ? "bg-[#CEFF1B] border-black shadow-sm"
                    : "bg-white border-[#CEFF1B]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex items-center rounded-md font-medium border",
                    "px-2 py-1 text-[10px] min-[701px]:px-4 min-[701px]:py-1.5 min-[701px]:text-sm",
                    selectedType === "team"
                      ? "border-black bg-[#FEFEFE]/66"
                      : "border-black/40 bg-white",
                  ].join(" ")}
                >
                  Team / Organization
                </span>

                <ul className="mt-3 min-[701px]:mt-4 space-y-2 min-[701px]:space-y-3 text-[12px] min-[701px]:text-[14px] leading-4 min-[701px]:leading-5 text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>We have a team</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>Multiple people handle projects</span>
                  </li>
                </ul>
              </button>
            </div>

            {/* Team options (mobile/tablet) */}
            {selectedType === "team" && (
              <div className="mt-4 min-[701px]:mt-6 relative z-20">
                <label className="block text-black font-semibold mb-2 text-sm min-[701px]:text-base text-center">
                  Industry
                </label>

                <div
                  className={`onboarding-custom-select ${isIndustryOpen ? "active" : ""}`}
                  ref={industryRef}
                >
                  <div
                    className={`onboarding-selected-option ${isIndustryOpen ? "open" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsIndustryOpen(!isIndustryOpen);
                    }}
                  >
                    <span>{selectedIndustryLabel}</span>
                    <span className="onboarding-arrow">▼</span>
                  </div>

                  {isIndustryOpen && (
                    <ul className="onboarding-options-list">
                      {industryOptions.map((opt) => (
                        <li
                          key={opt.value}
                          className={industry === opt.value ? "active" : ""}
                          onClick={() => {
                            setIndustry(opt.value);
                            setIsIndustryOpen(false);
                          }}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <label className="block text-black font-semibold mb-2 mt-4 min-[701px]:mt-6 text-sm min-[701px]:text-base text-center">
                  Do you plan to build teams on Ultra Hustle?
                </label>

                <div className="flex gap-2 min-[701px]:gap-3 justify-center flex-wrap">
                  {["Yes", "No", "Maybe Later"].map((option) => {
                    const val = option.toLowerCase();
                    const active = buildTeamPlan === val;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setBuildTeamPlan(val)}
                        className={[
                          "h-10 min-[701px]:h-12 px-4 min-[701px]:px-6 rounded-lg border font-medium transition-all",
                          "text-xs min-[701px]:text-sm",
                          active
                            ? "bg-[#CEFF1B] border-black text-black"
                            : "bg-white border-black/20 text-black/50",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Buttons row */}
            <div className="mt-5 min-[701px]:mt-8 flex flex-wrap items-center justify-center gap-2 min-[701px]:gap-5">
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
                disabled={!canContinue}
                className={[
                  "h-10 min-[701px]:h-12 rounded-lg font-medium border",
                  "px-4 min-[701px]:px-8 text-sm min-[701px]:text-base",
                  canContinue
                    ? "bg-[#CEFF1B] border-black text-black"
                    : "bg-[#DADADA] border-black/20 text-black/30",
                ].join(" ")}
              >
                Continue
              </button>
            </div>

            {/* Dots */}
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
        <div className="hidden min-[950px]:flex flex-col min-[950px]:flex-row gap-6 justify-between items-stretch relative z-10 w-full px-4">
          {/* Solo Card */}
          <div
            onClick={() => setSelectedType("solo")}
            className={`flex-1 max-w-[450px] min-h-[160px] p-[clamp(16px,3vh,32px)] rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${selectedType === "solo"
              ? "bg-[#CEFF1B]  shadow-lg"
              : "bg-[#FEFEFE]/40 border-1 border-[#CEFF1B] hover:bg-white/20"
              }`}
          >
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-2 rounded-lg border-1 font-medium text-lg ${selectedType === "solo"
                  ? "border-black bg-[#FEFEFE]/66"
                  : "border-gray-900 bg-[#FEFEFE]/66"
                  }`}
              >
                Solo Creator / Solo Professional
              </span>
            </div>
            <ul className="text-gray-700 text-base space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#2B2B2B]">•</span>
                <span>I work individually</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2B2B2B]">•</span>
                <span>I manage my own tasks and deliveries</span>
              </li>
            </ul>
          </div>

          {/* Team Card */}
          <div
            onClick={() => setSelectedType("team")}
            className={`flex-1 max-w-[450px] min-h-[160px] p-[clamp(16px,3vh,32px)] rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${selectedType === "team"
              ? "bg-[#CEFF1B]  shadow-lg"
              : "bg-[#FEFEFE]/40 border-1 border-[#CEFF1B] hover:bg-white/20"
              }`}
          >
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-2 rounded-lg border-1 font-medium text-lg ${selectedType === "team"
                  ? "border-black bg-[#FEFEFE]/66"
                  : "border-gray-900 bg-[#FEFEFE]/66"
                  }`}
              >
                Team / Organization
              </span>
            </div>
            <ul className="text-gray-700 text-base space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#2B2B2B]">•</span>
                <span>We have a team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2B2B2B]">•</span>
                <span>Multiple people handle projects</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Extra Options for Team Selection - Desktop (unchanged) */}
        {selectedType === "team" && (
          <div className="hidden min-[950px]:flex mt-4 min-[950px]:mt-6 flex-col min-[950px]:flex-row gap-6 justify-between items-start w-full px-4 relative z-20 animate-fade-in-up">
            <div className="flex-1 w-full max-w-[450px]">
              <label className="block text-gray-800 font-semibold mb-2 text-lg">
                Industry
              </label>
              <div className="onboarding-custom-select" ref={industryRef}>
                <div
                  className={`onboarding-selected-option ${isIndustryOpen ? "open" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsIndustryOpen(!isIndustryOpen);
                  }}
                >
                  <span>{selectedIndustryLabel}</span>
                  <span className="onboarding-arrow">▼</span>
                </div>

                {isIndustryOpen && (
                  <ul className="onboarding-options-list">
                    {industryOptions.map((opt) => (
                      <li
                        key={opt.value}
                        className={industry === opt.value ? "active" : ""}
                        onClick={() => {
                          setIndustry(opt.value);
                          setIsIndustryOpen(false);
                        }}
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex-1 w-full max-w-[450px]">
              <label className="block text-gray-800 font-semibold mb-2 text-lg">
                Do you plan to build teams on Ultra Hustle?
              </label>

              <div className="flex gap-4">
                {["Yes", "No", "Maybe Later"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setBuildTeamPlan(option.toLowerCase())}
                    className={`${option === "Maybe Later" ? "w-[172px]" : "w-[104px]"
                      } h-[50px] rounded-[6px] border border-black font-medium transition-all flex items-center justify-center ${buildTeamPlan === option.toLowerCase()
                        ? "bg-[#CEFF1B] border-black text-black"
                        : "bg-white/50 border-gray-200 text-gray-500 hover:bg-white/80"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Footer (unchanged) */}
        <div className="hidden min-[950px]:block mt-4 min-[950px]:mt-6 relative z-10 w-full max-w-[750px]">
          {selectedType !== "team" && <div className="h-8 mb-4"></div>}

          <div className="flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-lg border-1 border-black text-gray-600 font-medium text-lg hover:bg-gray-100 transition-all"
            >
              Reset
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-10 py-3 rounded-lg border-1 border-black text-gray-700 font-medium text-lg hover:bg-gray-100 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`px-10 py-3 rounded-lg font-medium text-lg transition-all ${canContinue
                  ? "bg-[#CEFF1B] border-2 border-black text-black hover:bg-[#b8e617]"
                  : "bg-gray-200 border-1 border-black text-gray-700 cursor-not-allowed"
                  }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
