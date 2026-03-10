import React from 'react';

export default function NewWayToWork() {
  return (
    <section className="relative min-h-screen container mx-auto px-8 md:px-16 pt-0 pb-24 flex flex-col gap-8 z-10 -mt-32">
      
      {/* Section 1: The New Way to Work and Win */}
      <div>
         <h2 className="text-4xl md:text-5xl font-normal text-gray-800 mb-8">
            The New Way to Work and Win
         </h2>
         <div className="bg-transparent border-4 border-gray-300 p-6 md:p-8 rounded-3xl">
            <div className="max-w-4xl space-y-8 text-lg font-medium text-gray-700 leading-relaxed font-roboto">
                <p>
                    Imagine a space where everything you need lives under one roof. <br/>
                    Ultra Hustle unifies every aspect of your creator or client journey into a <strong className="text-gray-900">single, intuitive system</strong>
                </p>
                <p>
                    The old way was broken — scattered tools, missed deadlines, late payments, and zero accountability
                </p>
                <p>
                    Ultra Hustle replaces chaos with <strong className="text-gray-900">one intelligent workflow</strong> that connects every step of creation and collaboration.
                </p>
                
                <div className="pt-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Create. Collaborate. Deliver. Get Paid.</h3>
                    <div className="space-y-1 text-gray-700">
                        <p><strong className="text-black">For Creators:</strong> Build trust, showcase your skills, and get paid securely.</p>
                        <p><strong className="text-black">For Clients:</strong> Hire confidently, track progress, and protect every payment with smart contracts</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Section 2: The Power of One Platform */}
      <div>
         <h2 className="text-4xl md:text-5xl font-normal text-gray-800 mb-12">
            The Power of One Platform
         </h2>
         
         <div className="relative flex flex-col lg:flex-row items-start justify-between gap-8">
            
            {/* Left Card: For Creators */}
             <div className="flex-1 bg-transparent backdrop-blur-xl border-4 border-gray-300 p-5 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">For Creators:</h3>
                <ul className="space-y-1 text-gray-700 font-medium">
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Collaborate with teams and clients in one workspace
                    </li>
                    <li className="flex items-start gap-2">
                         <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Build reputation through verified feedback
                    </li>
                    <li className="flex items-start gap-2">
                         <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Lock payments with escrow & contracts
                    </li>
                    <li className="flex items-start gap-2">
                         <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Sell services, products, and courses
                    </li>
                </ul>
             </div>

             {/* Center Visual (Placeholder) */}
             {/* Note: The design has a sitting character here. I'll use a placeholder space or the standing character for layout until the asset is provided. */}
             <div className="w-full lg:w-1/6 min-h-[300px] flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-transparent flex items-end justify-center">
                    {/* Sitting Character */}
                    <img 
                        src="/sitting-character.png" 
                        alt="Platform Workflow" 
                        className="h-[550px] w-auto max-w-none object-contain translate-y-28"
                    />
                 </div>
             </div>

             {/* Right Card: For Clients */}
             <div className="flex-1 bg-transparent backdrop-blur-xl border-4 border-gray-300 p-5 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">For Clients:</h3>
                <ul className="space-y-1 text-gray-700 font-medium">
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Manage multiple projects and teams in one dashboard
                    </li>
                    <li className="flex items-start gap-2">
                         <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Track milestones and timelines transparently
                    </li>
                    <li className="flex items-start gap-2">
                         <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Hire trusted creators with verified portfolios
                    </li>
                    <li className="flex items-start gap-2">
                         <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                        Pay securely only after approval
                    </li>
                </ul>
             </div>

         </div>
      </div>

    </section>
  );
}
