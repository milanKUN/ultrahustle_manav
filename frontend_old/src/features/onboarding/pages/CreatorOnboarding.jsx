import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const [currentStep] = useState(0);
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

  const handleGetStarted = () => navigate("/role-selection");
  const handleSkip = () => navigate("/");

  return (
    <div className="min-h-[100svh] w-full">
      {/* Layout:
          0–1000px: stacked
          1001px+: split
      */}
      <div className="min-h-[100svh] w-full overflow-x-hidden min-[1001px]:overflow-hidden flex flex-col min-[1001px]:flex-row">
        {/* IMAGE */}
        <div
          className="
            relative w-full overflow-hidden flex items-center justify-center
            h-[32svh] max-[400px]:h-[30svh]
            min-[401px]:h-[36svh]
            min-[701px]:h-[42svh]
            min-[1001px]:h-auto min-[1001px]:basis-[46%] min-[1001px]:shrink-0
          "
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#E8E8E8] via-[#E0E0E0] to-[#D8D8D8]" />

          {/* ✅ iPad/Tablet pe image ko thoda “contain” feel dena, taaki top crop kam ho */}
          <img
            src="/onboarding-character.png"
            alt="Ultra Hustle Character"
            className="
              relative z-10 w-full h-full
              object-cover object-top
              max-[400px]:object-top
              min-[701px]:object-cover min-[701px]:object-center
              min-[1001px]:object-cover min-[1001px]:object-top
            "
          />
        </div>

        {/* CONTENT AREA */}
        <div
          className="
            w-full flex-1 min-h-0 relative z-20 overflow-y-auto
            bg-[#E0E0E0]
            min-[1001px]:bg-gradient-to-br min-[1001px]:from-[#E8E8E8] min-[1001px]:via-[#E0E0E0] min-[1001px]:to-[#D8D8D8]

            rounded-t-[18px] max-[400px]:rounded-t-[16px]
            min-[401px]:rounded-t-[26px]
            min-[701px]:rounded-t-[34px]
            min-[1001px]:rounded-none

            /* ✅ overlap tuning per range (iPad Air: looks balanced) */
            mt-0 max-[400px]:mt-0
            min-[401px]:-mt-6
            min-[701px]:-mt-10
            min-[1001px]:mt-0

            /* ✅ better spacing on iPad/tablet */
            px-4 pt-8 pb-10
            max-[400px]:pt-9 max-[400px]:pb-12
            min-[401px]:px-6 min-[401px]:pt-9 min-[401px]:pb-11
            min-[701px]:px-10 min-[701px]:pt-10 min-[701px]:pb-12
            min-[1001px]:p-10
            min-[1301px]:p-12

            flex flex-col items-center
            justify-start min-[701px]:justify-center min-[1001px]:justify-center
          "
        >
          {/* ✅ Card wrapper width control so iPad pe “small box” feel na aaye */}
          <div className="w-full flex justify-center">
            <div
              className="
                w-full
                bg-white/40 backdrop-blur-xl
                shadow-xl border border-[#CEFF1B]

                rounded-[14px] max-[400px]:rounded-[13px]
                min-[401px]:rounded-[18px]
                min-[701px]:rounded-[22px]
                min-[1001px]:rounded-[28px]
                min-[1301px]:rounded-[30px]

                /* ✅ widths per your ranges (iPad Air: 820px → card ~760px) */
                max-w-[340px] max-[400px]:max-w-[330px]
                min-[401px]:max-w-[560px]
                min-[701px]:max-w-[760px]
                min-[1001px]:max-w-[860px]
                min-[1301px]:max-w-[960px]

                /* ✅ padding tuned (iPad/tablet bigger + cleaner) */
                px-4 py-5
                max-[400px]:px-4 max-[400px]:py-5
                min-[401px]:px-8 min-[401px]:py-8
                min-[701px]:px-12 min-[701px]:py-12
                min-[1001px]:px-12 min-[1001px]:py-12
                min-[1301px]:px-14 min-[1301px]:py-14
              "
            >
              {/* TOP */}
              <div className="text-center mx-auto">
                <h2
                  className="
                    font-roboto font-bold text-gray-800 leading-tight
                    text-[21px] max-[400px]:text-[20px]
                    min-[401px]:text-[28px]
                    min-[701px]:text-[36px]
                    min-[1001px]:text-[46px]
                    min-[1301px]:text-[54px]
                  "
                >
                  Welcome To
                </h2>

                <div className="mt-2 min-[701px]:mt-3 min-[1001px]:mt-4">
                  <img
                    src="/logo.png"
                    alt="Ultra Hustle"
                    className="
                      mx-auto object-contain
                      h-[38px] max-[400px]:h-[36px]
                      min-[401px]:h-[52px]
                      min-[701px]:h-[68px]
                      min-[1001px]:h-[86px]
                      min-[1301px]:h-[96px]
                    "
                  />
                </div>
              </div>

              {/* DIVIDER */}
              <div className="h-[2px] w-full bg-black my-4 min-[701px]:my-6 min-[1001px]:my-8" />

              {/* BOTTOM */}
              <div className="text-center mx-auto">
                <p
                  className="
                    text-gray-800 leading-relaxed
                    text-[12.5px] max-[400px]:text-[12px]
                    min-[401px]:text-[15px]
                    min-[701px]:text-[18px]
                    min-[1001px]:text-[24px]
                    min-[1301px]:text-[28px]
                    mb-5 min-[701px]:mb-8 min-[1001px]:mb-12
                  "
                >
                  Let&apos;s personalize your workspace.
                </p>

                <div className="flex justify-center mb-6 min-[701px]:mb-10 min-[1001px]:mb-12">
                  <button
                    onClick={handleGetStarted}
                    className="
                      bg-[#CEFF1B] border border-black min-[1001px]:border-2
                      text-black font-[400]
                      hover:bg-white hover:text-gray-900 transition-all duration-300
                      shadow-sm hover:shadow-[0_0_15px_#CEFF1B]

                      rounded-lg min-[701px]:rounded-xl

                      px-5 py-[10px]
                      max-[400px]:px-5
                      min-[401px]:px-9 min-[401px]:py-3
                      min-[701px]:px-12 min-[701px]:py-4
                      min-[1001px]:px-14 min-[1001px]:py-[18px]
                      min-[1301px]:px-16 min-[1301px]:py-[20px]

                      text-[13px]
                      min-[401px]:text-[15px]
                      min-[701px]:text-[18px]
                      min-[1001px]:text-[24px]
                      min-[1301px]:text-[28px]
                    "
                  >
                    Get Started
                  </button>
                </div>

                {/* STEPS */}
                <div className="flex justify-center items-center gap-2 min-[701px]:gap-3 min-[1001px]:gap-4">
                  {[...Array(totalSteps)].map((_, index) =>
                    index <= currentStep ? (
                      <div
                        key={index}
                        onClick={() => index < currentStep && navigate(stepPaths[index])}
                        className={`rounded-full transition-all duration-300
                          ${
                            index === currentStep
                              ? "bg-[#C3FF00] w-4 h-4 min-[701px]:w-5 min-[701px]:h-5 min-[1001px]:w-6 min-[1001px]:h-6 shadow-md shadow-[#C3FF00]/40"
                              : "bg-[#5C5C5C] w-2.5 h-2.5 min-[701px]:w-3.5 min-[701px]:h-3.5 min-[1001px]:w-4 min-[1001px]:h-4 hover:bg-gray-400 cursor-pointer"
                          }`}
                      />
                    ) : null
                  )}
                </div>

                {/* SKIP */}
                <div className="mt-5 min-[701px]:mt-7 min-[1001px]:mt-10 text-center">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="
                      text-gray-700 underline underline-offset-4 hover:text-black transition
                      text-[12px]
                      min-[401px]:text-[13px]
                      min-[701px]:text-[14px]
                      min-[1001px]:text-[16px]
                    "
                  >
                  
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /CARD */}
        </div>
        {/* /CONTENT */}
      </div>
    </div>
  );
}
