import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../auth/api/authApi";
import { checkUserName, saveUserName } from "../api/onboardingApi";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = (res) => res?.data;

export default function UserUserName() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const currentStep = 1;
  const totalSteps = 9;

  // ✅ Username check (debounced)
  useEffect(() => {
    if (!username || username.length < 3) {
      setStatus("");
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setStatus("checking");

        const res = await checkUserName({ username });

        if (res.data.available) {
          setStatus("available");
          setSuggestions([]);
        } else {
          setStatus("taken");
          generateSuggestions(username);
        }
      } catch {
        setStatus("");
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [username]);

  // ✅ Suggestions
  const generateSuggestions = (base) => {
    const rand = Math.floor(Math.random() * 1000);

    setSuggestions([
      base + rand,
      base + "_official",
      base + "_hub",
      base + "123",
      base + "_01",
    ]);
  };

  // ✅ Input handler
  const handleChange = (e) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    setUsername(value);
    setError("");
  };

  // ✅ Continue
  const handleContinue = async () => {
    if (!username) return setError("Username is required");
    if (status !== "available")
      return setError("Please choose an available username");

    const onboarding = JSON.parse(localStorage.getItem("onboarding")) || {};
    await saveUserName({username});
    localStorage.setItem(
      "onboarding",
      JSON.stringify({ ...onboarding, username })
    );

    navigate("/role-selection"); // update route
  };

  const handleReset = () => navigate("/onboarding");
  const handleBack = () => navigate("/onboarding");

  return (
    <div
      className="min-h-[100vh] w-full flex items-center justify-end relative cursor-default overflow-hidden pr-[8%]"
      style={{ backgroundColor: 'transparent', isolation: 'isolate' }}
    >
      {/* Full Screen Background */}
      <img
        src="/usernameBG.png"
        alt="bg"
        className="fixed top-0 left-0 w-[100vw] h-[100vh] object-cover z-[-1] scale-[1.3] translate-x-[15%]"
        style={{ pointerEvents: "none" }}
      />

      {/* Centered Card */}
      <div
        className="relative z-10 w-full max-w-[480px] mx-4 bg-[#FEFEFE66] backdrop-blur-[20px] rounded-[26px] border-2 border-[rgba(206,255,27,0.9)] shadow-[0_18px_50px_rgba(0,0,0,0.18),0_0_0_6px_rgba(206,255,27,0.06)] flex flex-col px-6 py-8 sm:px-8 sm:py-10"
        style={{ transform: 'translateZ(0)', willChange: 'transform', cursor: 'default' }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-[20px] sm:text-2xl font-semibold text-[#2B2B2B] mb-2 sm:mb-3">Create your username</h2>
          <p className="text-[13px] sm:text-sm text-[#666]">
            This will be your public identity
          </p>
        </div>

        {/* Input */}
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Enter username"
          className="w-full h-[46px] border border-black/10 rounded-[12px] px-4 text-[14px] sm:text-base bg-[rgba(235,235,235,0.85)] focus:outline-none focus:border-[#CEFF1B] focus:shadow-[0_0_0_4px_rgba(206,255,27,0.25)] transition-all text-[#333] placeholder:text-[#888]"
        />

        {/* Status */}
        <div className="mt-2 text-sm h-5 font-medium">
          {status === "checking" && (
            <span className="text-gray-400">Checking...</span>
          )}
          {status === "available" && (
            <span className="text-green-600">✔ Available</span>
          )}
          {status === "taken" && (
            <span className="text-red-500">❌ Already taken</span>
          )}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              Try one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setUsername(s)}
                  className="px-3 py-1.5 border border-black/10 rounded-full text-xs sm:text-sm hover:bg-[#CEFF1B] hover:border-transparent transition-all bg-white/50 text-[#2B2B2B]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs sm:text-sm mt-3 ml-1 font-medium">{error}</p>
        )}

        {/* Buttons */}
        <div className="mt-8 pt-2 flex w-full flex-wrap items-center justify-between gap-y-4 gap-x-2">
          <button
            onClick={handleReset}
            className="h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] border border-black/20 bg-gradient-to-b from-white to-[#F4F4F4] text-black/50 text-[13px] sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:brightness-95 transition-all"
          >
            Reset
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleBack}
              className="h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] border border-black/30 bg-gradient-to-b from-white to-[#F4F4F4] text-black text-[13px] sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:brightness-95 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={status !== "available"}
              className={[
                "h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] border font-medium whitespace-nowrap text-[13px] sm:text-sm transition-all",
                status === "available"
                  ? "bg-[#E2FF82] border-black/40 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#CEFF1B] hover:border-black/60"
                  : "bg-[#E8E8E8] border-black/10 text-black/30 cursor-not-allowed shadow-none",
              ].join(" ")}
            >
              Continue
            </button>
          </div>
        </div>

        {/* Step dots */}
        <div className="mt-6 flex justify-center items-center gap-2">
          {[...Array(totalSteps)].map((_, index) =>
            index <= currentStep ? (
              <span
                key={index}
                className={[
                  "w-2 h-2 rounded-full",
                  index === currentStep ? "bg-black" : "bg-black/30",
                ].join(" ")}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
