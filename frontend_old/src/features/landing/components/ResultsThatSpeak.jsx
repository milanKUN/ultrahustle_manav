import React from 'react';

export default function ResultsThatSpeak() {
  const testimonials = [
    {
      quote: "“We scaled from one creator to a full team in under a month”",
      author: "Karan M., Startup Founder"
    },
    {
      quote: "“Finally, a platform that respects creators as partners, not profiles.”",
      author: "Tina R., Digital Artist"
    },
    {
      quote: "“My clients trust me more because Ultra Hustle keeps everything transparent.”",
      author: "Karan M., Startup Founder"
    }
  ];

  return (
    <section className="relative w-full py-24 z-10">
      <h2 className="text-4xl md:text-5xl font-normal text-gray-700 text-center mb-16">
        Results That Speak
      </h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            className="group relative bg-gradient-to-b from-gray-200/90 to-[#E8F5C8]/80 backdrop-blur-sm border-4 border-white/50 p-10 md:p-12 rounded-3xl shadow-lg flex flex-col justify-between items-center text-center h-full min-h-[400px]"
          >
            <p className="text-2xl text-gray-600 font-medium leading-relaxed mt-4 mb-8 max-w-xs mx-auto">
              {testimonial.quote}
            </p>
            
            <div className="w-full bg-[#CEFF1B] py-4 rounded-full border-2 border-white shadow-[0_0_20px_rgba(206,255,27,0.6)]">
              <span className="text-gray-900 font-medium text-xl">
                {testimonial.author}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
