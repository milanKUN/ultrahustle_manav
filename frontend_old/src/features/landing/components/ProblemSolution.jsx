import React from 'react';

export default function ProblemSolution() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 py-24 md:px-16 z-10">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Problem Statement */}
        <div className="flex flex-col gap-6 pl-8">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-800 leading-tight">
            Ever Felt Like Everything’s <br />
            <span className="font-medium">Scattered?</span>
          </h2>
          
          <div className="space-y-6 text-gray-600 font-medium text-lg leading-relaxed">
            <p>
              You’re signing into five different apps just to send one proposal. 
              You’re juggling payments, messages, and files across endless tabs. 
              <strong className="block text-gray-800 mt-1">You’re not alone.</strong>
            </p>
            <p>
              Creators and businesses worldwide lose hours and income to <strong className="text-gray-900">digital fragmentation</strong>. While you’re managing tools, others are managing growth.
            </p>
            <p>
              Every minute spent switching platforms is a minute not spent creating, delivering, or scaling your impact.
            </p>
          </div>

          {/* Placeholder for the specific character pose in the design. 
              Reusing the existing character for now as a placeholder since no new asset was provided. */}
          <div className="-mt-24 relative h-[600px] w-full flex justify-center lg:justify-start">
             <img 
               src="/problem-character.png" 
               alt="Frustrated Digital Creator" 
               className="h-full w-auto object-contain opacity-100"
             />
          </div>
        </div>

        {/* Right Column: Solution Card */}
        <div className="bg-transparent border-4 border-gray-300 rounded-3xl p-8 md:p-10">
          <h3 className="text-3xl md:text-4xl font-normal text-gray-800 mb-4">
            Your All-in-One Solution
          </h3>
          <p className="text-gray-600 mb-10 text-lg">
            Imagine a space where everything you need lives under one roof. 
            Ultra Hustle unifies every aspect of your creator or client journey into a <strong className="text-gray-800">single, intuitive system</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Feature Cards */}
            <FeatureCard 
              title="Sell Products" 
              desc="Create and sell digital products with automated payments and instant delivery." 
            />
            <FeatureCard 
              title="Teach Courses" 
              desc="Host and monetize courses with video hosting and student management." 
            />
            <FeatureCard 
              title="Host Events" 
              desc="Run webinars and workshops with integrated booking, ticketing, and payments." 
            />
            <FeatureCard 
              title="Launch Services" 
              desc="Offer freelance services with built-in proposals, contracts, and project management tools." 
            />
          </div>

          {/* Full Width Feature Card */}
          <div className="bg-gradient-to-b from-white/40 to-white/20 p-6 rounded-2xl border border-white/30 shadow-sm mb-8">
             <h4 className="text-xl font-medium text-gray-700 mb-2">Build Teams</h4>
             <p className="text-sm text-gray-600 leading-relaxed">
               Form flexible creator teams, assign tasks, and track progress seamlessly.
             </p>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed">
            No more switching, syncing, or scrambling between tools — Ultra Hustle brings your entire workflow together so you can focus on what truly matters: creating exceptional work and scaling your impact.
          </p>
        </div>

      </div>
    </section>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-gradient-to-b from-white/40 to-white/20 p-6 rounded-2xl border border-white/30 shadow-sm hover:bg-white/30 transition-colors">
      <h4 className="text-xl font-medium text-gray-700 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
