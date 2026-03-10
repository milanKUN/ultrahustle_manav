import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatorDashboard() {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Create Your First Listing',
      description: 'Publish a service or product in minutes',
      onClick: () => {
        // Navigate to create listing page
        console.log('Navigate to create listing');
      }
    },
    {
      title: 'Add Portfolio',
      description: 'Showcase your best work for better matches',
      onClick: () => {
        // Navigate to add portfolio page
        console.log('Navigate to add portfolio');
      }
    },
    {
      title: 'Complete Profile',
      description: 'Improve your visibility and trust.',
      onClick: () => {
        // Navigate to complete profile page
        console.log('Navigate to complete profile');
      }
    }
  ];

  const handleResetOnboarding = () => {
    // Reset onboarding and navigate back to start
    navigate('/creator-onboarding');
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8E8E8] via-[#E0E0E0] to-[#D8D8D8]"></div>

      {/* Animated Gradient Glows */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(195, 255, 0, 0.5) 0%, rgba(195, 255, 0, 0.2) 40%, transparent 70%)',
          top: '-20%',
          left: '-10%',
          filter: 'blur(80px)',
          animation: 'glow-rotate 10s ease-in-out infinite',
        }}
      ></div>
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(195, 255, 0, 0.4) 0%, rgba(195, 255, 0, 0.15) 40%, transparent 70%)',
          bottom: '-15%',
          right: '-10%',
          filter: 'blur(70px)',
          animation: 'glow-bottomleft-center-right 12s ease-in-out infinite',
        }}
      ></div>
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(195, 255, 0, 0.35) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)',
          top: '50%',
          left: '60%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
          animation: 'glow-center-topright 8s ease-in-out infinite',
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        {/* Header */}
        <h1 className="text-5xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-12">
          Creator Dashboard
        </h1>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 ">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#CEFF1B] cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/60 group"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 text-xl md:text-lg leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reset Onboarding Button */}
        <button
          onClick={handleResetOnboarding}
          className="px-6 py-3 bg-[#C3FF00] text-gray-800 font-semibold rounded-xl border border-black hover:bg-[#B3EF00] hover:border-[#98CB00] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Reset Onboarding
        </button>
      </div>
    </div>
  );
}
