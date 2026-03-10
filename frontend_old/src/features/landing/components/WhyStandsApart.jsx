import React from 'react';

export default function WhyStandsApart() {
  return (
    <section className="relative container mx-auto px-8 md:px-16 pt-0 pb-24 z-10 -mt-16">
      <h2 className="text-4xl md:text-5xl font-normal text-gray-800 mb-12">
        Why Ultra Hustle Stands Apart
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: All-in-One Platform (Green Gradient) */}
        <div className="bg-transparent border-4 border-gray-300 p-10 rounded-2xl shadow-lg backdrop-blur-sm">
           <h3 className="text-xl font-bold text-gray-800 mb-4">All-in-One Platform</h3>
           <p className="text-gray-700 font-medium leading-relaxed">
             Ditch the scattered apps cluttering your workflow. Run your entire creative business or agency from one intelligent account that scales with you.
           </p>
        </div>

        {/* Card 2: Seamless Collaboration (Grey Gradient) */}
        <div className="bg-transparent border-4 border-gray-300 p-10 rounded-2xl shadow-lg backdrop-blur-sm">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Seamless Collaboration</h3>
           <p className="text-gray-700 font-medium leading-relaxed">
             Creators and clients connect, communicate, and deliver effortlessly no lost messages or missed updates.
           </p>
        </div>

        {/* Card 3: Trust-Built Payments (Grey Gradient) */}
        <div className="bg-transparent border-4 border-gray-300 p-10 rounded-2xl shadow-lg backdrop-blur-sm">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Trust-Built Payments</h3>
           <p className="text-gray-700 font-medium leading-relaxed">
             Escrow, contracts, and automated releases mean you always get paid on time stress-free and dispute-free.
           </p>
        </div>

        {/* Card 4: Community-Powered Growth (Green Gradient) */}
        <div className="bg-transparent border-4 border-gray-300 p-10 rounded-2xl shadow-lg backdrop-blur-sm">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Community-Powered Growth</h3>
           <p className="text-gray-700 font-medium leading-relaxed">
             Connect with teammates, mentors, and experts who understand your journey. Grow faster when you’re not climbing alone.
           </p>
        </div>

      </div>
    </section>
  );
}
