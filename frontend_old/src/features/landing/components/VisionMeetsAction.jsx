import React from 'react';

export default function VisionMeetsAction() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-between overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute mr-15 inset-0 z-0">
        <img 
          src="/vision-bg.png" 
          alt="Vision Meets Action Background" 
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-8 md:px-16 flex flex-col items-center justify-start pt-24 text-center h-full">
         <h2 className="text-3xl md:text-5xl font-normal text-gray-600 mb-6 max-w-4xl leading-tight">
            Start Where Vision Meets Action
         </h2>
         <p className="text-xl md:text-xl text-gray-800 font-medium mb-12 max-w-3xl">
            Whether you’re here to hire or to build, the future of work is waiting.
         </p>

         <div className="flex flex-col md:flex-row gap-6">
            <button className="px-10 py-4 rounded-full bg-gradient-to-b from-gray-300/80 to-gray-400/80 backdrop-blur-md border border-white/50 text-gray-900 font-bold text-lg shadow-xl hover:scale-105 transition-transform">
               Join as Creator
            </button>
            <button className="px-10 py-4 rounded-full bg-gradient-to-b from-gray-300/80 to-gray-400/80 backdrop-blur-md border border-white/50 text-gray-900 font-bold text-lg shadow-xl hover:scale-105 transition-transform">
               Join as Client
            </button>
         </div>
      </div>

      {/* Bottom Bar */}
      {/* Footer Text Overlay */}
      <div className="absolute bottom-16 w-full z-20 ml-16 py-20 text-center">
         <p className="text-gray-400 font-medium text-lg tracking-wide">
            Ultra Hustle — Where the World Works Together
         </p>
      </div>

    </section>
  );
}
