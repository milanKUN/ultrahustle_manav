import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatorProfileSetup() {
  const navigate = useNavigate();
  const currentStep = 7; // Visual step index (8th step)
  const totalSteps = 8;

  const stepPaths = [
    "/onboarding",
    "/creator-role-selection",
    "/creator-work-type-selection",
    "/creator-goals-selection",
    "/creator-needs",
    "/creator-setup-workspace",
    "/creator-profile-setup"
  ];

  const handleGetStarted = () => {
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col min-[950px]:flex-row bg-[#E8E8E8]">
      {/* Top (Mobile) / Left (Desktop) - Character Image */}
      <div className="w-full min-[950px]:w-[46%] relative overflow-hidden flex items-start min-[950px]:items-center justify-center min-h-[45vh] min-[950px]:min-h-screen z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8E8E8] via-[#E0E0E0] to-[#D8D8D8]"></div>
        <img
          src="/onboarding-character.png"
          alt="Ultra Hustle Character"
          className="relative z-10 h-full w-full object-cover object-top min-[950px]:object-cover min-[950px]:w-full min-[950px]:h-full min-[950px]:object-top"
        />
      </div>

      {/* Bottom (Mobile) / Right (Desktop) - Content */}
      <div className="w-full min-[950px]:w-[70%] bg-[#E0E0E0] min-[950px]:bg-gradient-to-br min-[950px]:from-[#E8E8E8] min-[950px]:via-[#E0E0E0] min-[950px]:to-[#D8D8D8] rounded-t-[50px] min-[950px]:rounded-none -mt-12 min-[950px]:mt-0 p-6 min-[950px]:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[55vh] min-[950px]:min-h-screen z-20">
        {/* Animated Gradient Glows */}






        {/* Content Card Container */}
        <div className="bg-white/40 min-[950px]:bg-white/40 backdrop-blur-xl rounded-[30px] shadow-xl p-6 min-[950px]:p-[clamp(24px,4vh,64px)] w-full max-w-[500px] min-[950px]:max-w-none min-[950px]:w-[95%] min-[950px]:h-auto min-[950px]:min-h-[85%] relative z-10 border border-[#CEFF1B] min-[950px]:border min-[950px]:border-[#CEFF1B] flex flex-col justify-center items-center text-center">

          <h1 className="text-3xl min-[950px]:text-4xl font-bold text-gray-800 mb-3 min-[950px]:mb-4">
            You're all set!
          </h1>

          <p className="text-lg min-[950px]:text-xl text-gray-600 min-[950px]:text-gray-700 max-w-[300px] min-[950px]:max-w-[600px] leading-relaxed mb-4 min-[950px]:mb-6">
            Complete your profile to boost visibility and match accuracy
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-black min-[950px]:bg-black mb-4 min-[950px]:mb-6 max-w-[600px]"></div>

          <p className="text-lg min-[950px]:text-xl font-medium text-gray-800 mb-4 min-[950px]:mb-6">
            Let's create your profile
          </p>

          <div className="flex flex-wrap gap-2 min-[950px]:gap-4 mb-8 min-[950px]:mb-12 w-full justify-center">
            <button
              onClick={handleGetStarted}
              className="px-4 py-3 min-[950px]:px-12 min-[950px]:py-4 rounded-lg min-[950px]:rounded-xl bg-[#CEFF1B] border border-black text-black font-semibold text-sm min-[950px]:text-xl hover:bg-white hover:text-gray-900 transition-all shadow-sm hover:shadow-[0_0_15px_#CEFF1B] flex-1 min-[950px]:flex-none whitespace-nowrap"
            >
              Get Started
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-3 min-[950px]:px-12 min-[950px]:py-4 rounded-lg min-[950px]:rounded-xl bg-[#CEFF1B] border border-black text-black font-semibold text-sm min-[950px]:text-xl hover:bg-white hover:text-gray-900 transition-all shadow-sm hover:shadow-[0_0_15px_#CEFF1B] flex-1 min-[950px]:flex-none whitespace-nowrap"
            >
              Skip for now
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center items-center gap-3">
            {[...Array(totalSteps)].map((_, index) => (
              index <= currentStep && (
                <div
                  key={index}
                  onClick={() => index < currentStep && navigate(stepPaths[index])}
                  className={`w-3 h-3 min-[950px]:w-4 min-[950px]:h-4 rounded-full transition-all duration-300 ${index === currentStep
                    ? 'bg-[#C3FF00]'
                    : 'bg-gray-500 min-[950px]:bg-gray-600 hover:bg-gray-400 cursor-pointer'
                    }`}
                />
              )
            ))}
          </div>




        </div>
      </div>
    </div>
  );
}
