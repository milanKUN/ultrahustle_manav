import React from 'react';

export default function GlobalMovement() {
  return (
    <section className="relative w-full py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative flex flex-col items-center">
            <div className="text-center mb-8 max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-normal text-gray-700 mb-4">
                    A Global Movement of Hustlers
                </h2>
                <p className="text-gray-600 text-lg md:text-xl font-medium">
                    From freelancers to founders from small ideas to global teams <br className="hidden md:block"/>
                    Ultra Hustle is redefining what it means to work, create, and thrive.
                </p>
            </div>

            {/* Global Movement Graphic */}
            {/* Global Movement Graphic */}
           <div className="relative w-full -ml-[-2%] overflow-hidden">

  {/* ROBOT BACK GLOW */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="robot-glow"></div>
  </div>

  {/* IMAGE */}
  <img 
    src="/global-movement-graphic.png" 
    alt="Global Movement of Hustlers" 
    className="relative z-10 w-full h-[600px] object-fill"
  />

  {/* Floating Pills */}
  <div className="absolute left-[8%] bottom-[25%] pill">
    <span>Transparency</span>
  </div>

  <div className="absolute left-[20%] top-[35%] pill">
    <span>Simplicity</span>
  </div>

  <div className="absolute right-[20%] top-[35%] pill">
    <span>Growth</span>
  </div>

  <div className="absolute right-[8%] bottom-[25%] pill">
    <span>Collaboration</span>
  </div>

</div>

        </div>
    </section>
  );
}
