import { CiSearch } from "react-icons/ci";

export default function Hero() {
  return (
    <div
      id="hero"
      className="relative min-h-screen bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div className="relative z-10 container mx-auto px-8 md:px-16 pt-32 md:pt-16 pb-10">
        <div className="max-w-xl px-16 lg:max-w-2xl">
          {/* Main Heading */}
          <h1
            className="text-3xl font-poppins sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold text-gray-500
        mx-auto leading-[1.2]"
          >
            One Home for <br />
            Your{" "}
            <span className="text-gray-500 underline decoration-lime-300">
              Whole{" "}
              <span className="text-gray-500 underline decoration-lime-300"></span>
            </span>{" "}
            <br />
            <span className="text-gray-500 underline decoration-lime-300">
              Hustle
            </span>
          </h1>

          {/* Subheading */}
          <div className="relative h-[52px] overflow-hidden mt-4 mb-4">
            <div className="vertical-slider">
              <h2 className="slider-text">Create</h2>
              <h2 className="slider-text">Sell</h2>
              <h2 className="slider-text">Teach</h2>
              {/* duplicate first for smooth loop */}
              <h2 className="slider-text">Create</h2>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-8 max-w-md font-medium leading-relaxed">
            All from one powerful platform designed for creators and clients who
            are tired of chaos.
          </p>

          {/* Search Bar */}
         {/* Search Bar */}
<div className="flex items-center gap-2 w-full sm:max-w-[420px] md:max-w-[500px]
px-4 sm:px-5 py-2.5 sm:py-3
rounded-full bg-white/30 backdrop-blur-md
border border-white/20 shadow-md
hover:border-[#bef264] transition-colors">

  <input
    type="text"
    placeholder="Search here"
    className="w-full bg-transparent outline-none
    text-sm sm:text-base
    text-gray-600 placeholder-gray-400"
  />

  <CiSearch className="text-gray-500 text-lg sm:text-xl cursor-pointer shrink-0" />
</div>


          {/* Tags/Pills */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              "Service",
              "Digital Products",
              "Teams",
              "Courses",
              "Webinars",
            ].map((tag) => (
              <button
                key={tag}
                className="px-4 py-1.5 rounded-full border border-white/40 bg-white/10 text-xs font-medium text-gray-800 backdrop-blur-sm transition-colors pill-hover"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
