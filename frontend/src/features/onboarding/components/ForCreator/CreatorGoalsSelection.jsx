import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFreelancerOnboarding, saveFreelancerGoals } from "../../api/onboardingApi";
import {
  Briefcase,
  ShoppingBag,
  MonitorPlay,
  GraduationCap,
  Users,
  Sparkles,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function CreatorGoalsSelection() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill from backend (resume flow)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getFreelancerOnboarding();
        const record = res?.data ?? res;
        const goals = record?.goals || record?.selected_goals;
        if (!alive) return;
        if (Array.isArray(goals)) setSelectedGoals(goals);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const currentStep = 3;
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

  const goals = [
    { id: "earn-services", label: "Earn through services", icon: Briefcase },
    { id: "sell-digital", label: "Sell digital products", icon: ShoppingBag },
    { id: "host-webinars", label: "Host webinars", icon: MonitorPlay },
    { id: "launch-course", label: "Launch a course", icon: GraduationCap },
    { id: "build-team", label: "Build a team", icon: Users },
    { id: "promote-listings", label: "Promote my listings", icon: FileText },
    { id: "build-client-base", label: "Build a client base", icon: TrendingUp },
    { id: "ai-match", label: "Get discovered faster (AI Match)", icon: Sparkles },
  ];

  const toggleGoal = (id) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleBack = () => navigate("/creator-work-type-selection");
  const handleReset = () => navigate("/onboarding");

  const canContinue = selectedGoals.length > 0;
  const handleContinue = async () => {
    if (!canContinue || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await saveFreelancerGoals({ goals: selectedGoals });
      navigate("/creator-needs");
    } catch (e) {
      console.error("Failed to save freelancer goals", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const MobileChip = ({ goal }) => {
    const Icon = goal.icon;
    const active = selectedGoals.includes(goal.id);

    return (
      <button
        type="button"
        onClick={() => toggleGoal(goal.id)}
        className={[
          "flex items-center gap-2 rounded-xl border transition-all",
          // ✅ bigger on tablet
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
          <div className="flex-1 flex flex-col justify-center min-[950px]:justify-center min-[950px]:pt-0 items-center min-[950px]:items-center px-4 min-[950px]:px-0">
            <div className="flex flex-col items-start text-left max-w-fit">
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
        {/* Desktop glows */}
        <div className="hidden min-[950px]:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0" />

        {/* ✅ MOBILE + TABLET (0–949px) — FIXED BIGGER FOR iPad mini */}
        <div
          className="
            min-[950px]:hidden w-full relative z-10
            max-w-[420px]
            min-[701px]:max-w-[760px]
          "
        >
          <div
            className="
              bg-transparent rounded-[26px]
              px-3 py-4
              min-[701px]:px-6 min-[701px]:py-6
              border border-black/10 shadow-sm
            "
          >
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
                  "h-10 min-[701px]:h-12 px-4 min-[701px]:px-8 text-sm min-[701px]:text-base",
                  canContinue
                    ? "bg-[#CEFF1B] border-black text-black"
                    : "bg-[#DADADA] border-black/20 text-black/30",
                ].join(" ")}
              >
                Continue
              </button>
            </div>

            {/* Step Dots */}
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
                      flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer border-2 transition-all duration-300 backdrop-blur-sm
                      ${isSelected
                        ? "bg-[#CEFF1B] border-black shadow-lg scale-105"
                        : "bg-white/20 border-[#2B2B2B]"}
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
