import React from 'react';

export default function UltraHustleAdvantage() {
  return (
    <section className="relative container mx-auto px-8 md:px-16 py-24 z-10">
      
      {/* Animated Gradient Glow - Bottom Left (Pulsing) */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
       
      ></div>

      {/* Animated Gradient Glow - Top Right (Overlap from WhyStandsApart) */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
      ></div>

      <div className="relative bg-gradient-to-b from-[#DDDDDD]/80 to-[#B5B5B5]/80 font-roboto backdrop-blur-xl border-4 border-[#B5B5B5] rounded-3xl p-10 md:p-16 shadow-2xl overflow-visible">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="z-10 ml-0 md:-ml-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-gray-800 mb-2 -mt-5">
                    The Ultra Hustle Advantage
                </h2>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-5 mb-8">
                    One Home for Every Ambition
                </h3>

                <ul className="space-y-4 sm:space-y-6 text-gray-700 font-medium text-base sm:text-lg ml-0 sm:ml-5 mb-10">
                    <li className="flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        <span>
                            Seamless Collaboration: Chat, share files, and track milestones all in one thread.
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        <span>
                            Universal Dashboard: Manage projects, payments, and growth at a glance.
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        <span>
                            Instant Payouts: Get paid globally within minutes of approval.
                        </span>
                    </li>
                </ul>

               <h3 className="text-xl font-bold text-gray-800 mb-8">
                    Ultra Hustle doesn’t replace your work.<br/>
It amplifies it.
                </h3>
            </div>

             {/* Right Image Overlay */}
             {/* Positioning the character to break out of the container on the right if on desktop. 
                 Now bridging the gap to the section below. */}
             <div className="absolute right-[-10rem] -bottom-[30rem] h-[250%] w-[70%] hidden lg:flex items-end justify-end pointer-events-none z-20">
                 <img 
                    src="/advantage-character.png" 
                    alt="UltraHustle Advantage Character" 
                    className="h-full object-contain "
                 />
             </div>
             
             {/* Mobile View Image */}
             <div className="lg:hidden flex justify-center mt-8">
                <img 
                    src="/advantage-character.png" 
                    alt="Ultra Hustle Advantage Character" 
                    className="h-96 object-contain"
                 />
             </div>

        </div>
      </div>

      {/* New Section: Who We're Building For */}
      {/* Reduced margin to visualy connect with the character bridging them */}
      <div className="mt-28 relative z-10">
         <h2 className="text-4xl md:text-5xl font-roboto text-gray-700 mb-12">
            Who We're Building For
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Creators */}
            <div className="bg-gradient-to-b from-[#DDDDDD]/80 to-[#B5B5B5]/80 backdrop-blur-xl border-4 border-[#B5B5B5] p-10 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">For Creators:</h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                    You’re done chasing opportunities. Now, opportunities chase you. Get discovered, get respected, and get paid what you deserve — on your terms.
                </p>
            </div>

            {/* For Clients */}
            <div className="bg-gradient-to-b from-[#DDDDDD]/80 to-[#B5B5B5]/80 backdrop-blur-xl border-4 border-[#B5B5B5] p-10 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">For Clients:</h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                    You deserve creators who deliver — without risk or delay. Hire verified talent, track progress in real time, and pay only when satisfied.
                </p>
            </div>
         </div>
      </div>
    </section>
  );
}
