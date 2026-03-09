import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="
  fixed top-0 left-0 right-0 z-50
  border-b border-[#CEFF1B]
  shadow-[0_2px_12px_3px_rgba(206,255,27,0.35)]
  backdrop-blur-xl
  bg-gradient-to-r from-[#D9D9D9] via-[#CFCFCF] to-[#C6C6C6]
"

    >
      {/* MAIN BAR */}
      <div
        className="
          flex items-center justify-between
          px-4 sm:px-6
          py-3 sm:py-4
          max-w-7xl mx-auto
        "
      >
        {/* LEFT : Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="UltraHustle Logo"
            className="h-8 sm:h-9 object-contain"
          />
        </Link>

        {/* CENTER : Desktop Links + Search */}
        <div className="hidden md:flex flex-1 items-center justify-between pl-10">
          {/* Desktop Links */}
          <div className="flex items-center gap-10">
            <Link to="/" className="nav-item cursor-pointer">
              <span className="nav-pill"></span>
              <span className="nav-text">Home sss</span>
            </Link>

            <Link to="/marketplace" className="nav-item cursor-pointer">
              <span className="nav-pill"></span>
              <span className="nav-text">Marketplace</span>
            </Link>

            <Link to="/forum" className="nav-item cursor-pointer">
              <span className="nav-pill"></span>
              <span className="nav-text">Forum</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search here"
                className="
                  w-full h-11 rounded-full
                  bg-white/40 backdrop-blur-md
                  border border-black/10
                  pl-5 pr-10 text-sm text-gray-800 placeholder-gray-500
                  outline-none transition-all duration-200
                  hover:border-[#C6FF1A]
                  focus:border-[#C6FF1A]
                  focus:ring-2 focus:ring-[#C6FF1A]/40
                "
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT : Mobile Login/Signup + Desktop Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile: ONLY Login/Signup */}
          <Link
            to="/login"
            className="
              md:hidden
              px-4 py-1.5
              rounded-full border border-white
              text-gray-800 text-xs font-medium
              transition-all duration-300
              hover:bg-white/70 hover:border-[#CEFF1B]
            "
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="
              md:hidden
              px-4 py-1.5
              rounded-full border border-white
              text-gray-800 text-xs font-medium
              transition-all duration-300
              hover:bg-white/70 hover:border-[#CEFF1B]
            "
          >
            Signup
          </Link>

          {/* Desktop: all buttons */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="
                px-4 sm:px-6 py-1.5 sm:py-2
                rounded-full border border-white
                text-gray-800 text-xs sm:text-sm font-medium
                transition-all duration-300
                hover:bg-white/70 hover:border-[#CEFF1B]
              "
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="
                px-4 sm:px-6 py-1.5 sm:py-2
                rounded-full border border-white
                text-gray-800 text-xs sm:text-sm font-medium
                transition-all duration-300
                hover:bg-white/70 hover:border-[#CEFF1B]
              "
            >
              Sign up
            </Link>




          </div>
        </div>
      </div>
    </nav>
  );
}
