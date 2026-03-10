import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  ShoppingBag,
  MonitorPlay,
  GraduationCap,
  Users,
  Sparkles,
  Layers,
} from "lucide-react";

export default function GoalsSelection() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState([]);

  const currentStep = 3;
  const totalSteps = 8;

  const stepPaths = [
    "/onboarding",
    "/client-role-selection",
    "/client-work-type-selection",
    "/client-goals-selection",
    "/client-needs",
    "/client-business-details",
    "/client-setup-workspace",
    "/client-profile-setup",
  ];

  const goals = [
    { id: "hire-talent", label: "Hire talent", icon: Briefcase },
    { id: "buy-products", label: "Buy digital products", icon: ShoppingBag },
    { id: "join-webinars", label: "Join webinars", icon: MonitorPlay },
    { id: "team-longterm", label: "Build a team for long term work", icon: Users },
    { id: "explore-ai", label: "Explore creators with Ai", icon: Sparkles },
    { id: "take-course", label: "Take Course", icon: GraduationCap },
    { id: "manage-products", label: "Manage multiple products smoothly", icon: Layers },
  ];

  const toggleGoal = (id) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleBack = () => navigate("/client-work-type-selection");
  const handleReset = () => navigate("/onboarding");

  const canContinue = selectedGoals.length > 0;

  const handleContinue = () => {
    if (canContinue) navigate("/client-needs");
  };

  // ✅ Bigger on iPad mini (701–949)
  const MobileChip = ({ goal }) => {
    const Icon = goal.icon;
    const active = selectedGoals.includes(goal.id);

    return (
      <button
        type="button"
        onClick={() => toggleGoal(goal.id)}
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
          {goal.label}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-[100svh] w-full flex flex-col min-[950px]:flex-row">
      {/* Top / Left Section */}
      <div className="w-full min-[950px]:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[45vh] min-[950px]:min-h-[100svh]">
        <div className="absolute inset-0 flex flex-col justify-between p-6 min-[701px]:p-8 min-[950px]:p-10">
          {/* Back Button - Mobile/Tablet only */}
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
              What do you
            </h2>
            <h2 className="text-3xl min-[701px]:text-4xl min-[950px]:text-4xl font-bold text-black -mt-1 leading-tight">
              want to achieve
            </h2>

            <p className="text-black/60 text-base min-[701px]:text-lg min-[950px]:text-xl mt-4 max-w-md">
              Select multiple
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

      {/* Bottom / Right Section */}
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

          px-3 py-6
          min-[701px]:px-8 min-[701px]:py-10
          min-[950px]:p-[clamp(24px,4vh,48px)]

          flex flex-col justify-center items-center
          relative overflow-visible
          min-h-[60vh] min-[701px]:min-h-[62vh] min-[950px]:min-h-[100svh]
          z-20
        "
      >
        {/* Glows (desktop only, unchanged) */}
        <div className="hidden min-[950px]:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0" />

        {/* ✅ MOBILE + TABLET (0–949px) */}
        <div className="min-[950px]:hidden w-full max-w-[420px] min-[701px]:max-w-[760px] relative z-10">
          <div className="bg-transparent border border-black/10 rounded-[22px] min-[701px]:rounded-[26px] px-3 py-4 min-[701px]:px-6 min-[701px]:py-6 shadow-sm">
            <div className="flex flex-wrap gap-2 min-[701px]:gap-3">
              {goals.map((goal) => (
                <MobileChip key={goal.id} goal={goal} />
              ))}
            </div>

            {/* Buttons */}
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
                disabled={!canContinue}
                className={[
                  "rounded-lg font-medium border transition-all",
                  "h-10 min-[701px]:h-12 px-4 min-[701px]:px-8",
                  "text-sm min-[701px]:text-base",
                  canContinue
                    ? "bg-[#CEFF1B] border-black text-black"
                    : "bg-[#DADADA] border-black/20 text-black/30",
                ].join(" ")}
              >
                Continue
              </button>
            </div>

            {/* Step dots */}
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
        <div className="hidden min-[950px]:block relative z-10 w-full max-w-[900px]">
          <div className="-mt-6 bg-white/40 backdrop-blur-md border-1 border-[#CEFF1B] rounded-[30px] p-8 min-[950px]:p-[clamp(20px,3.5vh,48px)] shadow-xl min-h-[360px]">
            <div className="flex flex-wrap gap-4 justify-center min-[950px]:justify-start mt-4 min-[950px]:mt-6">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);

                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`
                      flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer border-2 backdrop-blur-sm
                      ${isSelected
                        ? "bg-[#CEFF1B] border-black shadow-lg scale-105"
                        : "bg-white/20 border-[#2B2B2B] "
                      }
                    `}
                  >
                    <div className="bg-[#CEFF1B] p-2 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-black" strokeWidth={2} />
                    </div>

                    <span className={`font-[500] text-lg ${isSelected ? "text-black" : "text-gray-800"}`}>
                      {goal.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden min-[950px]:block mt-4 min-[950px]:mt-8 relative z-10 w-full max-w-[900px]">
          <div className="flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-lg border border-black text-gray-600 font-medium text-lg hover:bg-gray-100 transition-all"
            >
              Reset
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-10 py-3 rounded-lg border border-black text-[#2B2B2B] font-medium text-lg hover:bg-gray-100 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`px-10 py-3 rounded-lg font-medium text-lg transition-all ${canContinue
                  ? "bg-[#CEFF1B] border-2 border-black text-black hover:bg-[#b8e617]"
                  : "bg-[#CEFF1B]/50 border border-[#2B2B2B] text-gray-500 cursor-not-allowed"
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
