import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SetupWorkspaceForCreator() {
  const navigate = useNavigate();
  const currentStep = 5; // Step 6 visually (0-indexed is 5)
  const totalSteps = 7;
  const stepPaths = [
    "/onboarding",
    "/creator-role-selection",
    "/creator-work-type-selection",
    "/creator-goals-selection",
    "/creator-needs",
    "/creator-setup-workspace",
    "/creator-profile-setup"
  ];
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress simulation logic
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/creator-profile-setup');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

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
        <div
          className="hidden min-[950px]:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.4) 0%, rgba(195, 255, 0, 0.15) 40%, transparent 70%)',
            bottom: '-15%',
            left: '-15%',
            filter: 'blur(60px)',
            animation: 'glow-bottomleft-center-right 8s ease-in-out infinite',
          }}
        ></div>
        <div
          className="hidden min-[950px]:block absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.35) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)',
            top: '-10%',
            right: '-10%',
            filter: 'blur(50px)',
            animation: 'glow-center-topright 8s ease-in-out infinite',
          }}
        ></div>

        <div
          className="hidden min-[950px]:block absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.3) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(50px)',
            animation: 'glow-rotate 6s steps(3) infinite',
          }}
        ></div>

        {/* Content Card Container */}
        <div className="bg-white/40 min-[950px]:bg-white/40 backdrop-blur-xl rounded-[30px] shadow-xl px-4 py-8 min-[950px]:p-12 w-full max-w-[500px] min-[950px]:max-w-none min-[950px]:w-[95%] min-[950px]:h-auto min-[950px]:min-h-[80%] relative z-10 border-[#CEFF1B] min-[950px]:border min-[950px]:border-[#CEFF1B] flex flex-col justify-center items-center text-center">

          {/* Circle Arrow Icon */}
          <div className="mb-6 min-[950px]:mb-12">
            <img
              src="/arrow-loader.png"
              alt="Loading"
              className="w-20 h-20 min-[950px]:w-24 min-[950px]:h-24 object-contain"
            />
          </div>

          <h1 className="text-3xl min-[950px]:text-4xl font-bold text-gray-800 mb-3 min-[950px]:mb-4">
            Let us set up your workspace
          </h1>

          <p className="text-lg min-[950px]:text-xl text-gray-600 min-[950px]:text-gray-700 max-w-[300px] min-[950px]:max-w-[600px] leading-relaxed mb-8 min-[950px]:mb-10">
            We're configuring your dashboard, recommendations, and category preferences
          </p>

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
