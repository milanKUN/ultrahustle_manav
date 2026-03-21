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
    <div className="min-h-[100svh] w-full flex flex-col min-[950px]:flex-row">

      {/* 🔵 LEFT SIDE (Branding / Illustration) */}
      <div className="w-full min-[950px]:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[45vh] min-[950px]:min-h-[100svh]">
        <div className="absolute inset-0 flex flex-col justify-between p-6 min-[701px]:p-8 min-[950px]:p-10">
          {/* Back Button - Mobile/Tablet Only */}
          <button
            onClick={handleBack}
            className="min-[950px]:hidden w-10 h-10 min-[701px]:w-12 min-[701px]:h-12 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: "linear-gradient(180deg, #FFFFFF, #9C9C9C)",
              padding: "2px",
            }}
          >
            <span className="w-full h-full rounded-full flex items-center justify-center bg-[#CEFF1B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 min-[701px]:h-6 min-[701px]:w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          </button>

          {/* QUESTION */}
          <div className="flex-1 flex flex-col justify-center min-[950px]:justify-start min-[950px]:pt-[clamp(40px,10vh,128px)] items-center min-[950px]:items-start text-center min-[950px]:text-left px-4 min-[950px]:px-0">
            <h2 className="text-3xl min-[701px]:text-4xl min-[950px]:text-4xl font-bold text-black leading-tight">
              How will you be
            </h2>

            <h2 className="text-3xl min-[701px]:text-4xl min-[950px]:text-4xl font-bold text-black -mt-1 leading-tight">
              using Ultra Hustle?
            </h2>

            <p className="text-black/60 text-base min-[701px]:text-lg min-[950px]:text-xl mt-4 min-[950px]:mt-6 max-w-md">
              This helps us tailor your dashboard
            </p>
          </div>

          {/* Step Indicators - Desktop Only */}
          <div className="hidden min-[950px]:flex items-center gap-3 ml-12">
            {[...Array(totalSteps)].map((_, index) =>
              index <= currentStep ? (
                <div
                  key={index}
                  onClick={() => index < currentStep && navigate(stepPaths[index])}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep
                    ? "bg-black w-4 h-4"
                    : "bg-white cursor-pointer"
                    }`}
                />
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* ⚪ RIGHT SIDE (Form) */}
      <div
        className="
          w-full min-[950px]:w-[70%]
          bg-[#E0E0E0]
          min-[950px]:bg-gradient-to-br min-[950px]:from-[#E8E8E8] min-[950px]:via-[#E0E0E0] min-[950px]:to-[#D8D8D8]

          rounded-t-[34px] max-[400px]:rounded-t-[28px]
          min-[701px]:rounded-t-[44px]
          min-[950px]:rounded-none

          -mt-10 max-[400px]:-mt-8
          min-[701px]:-mt-12
          min-[950px]:mt-0

          p-6 pt-8
          min-[701px]:p-10 min-[701px]:pt-10
          min-[950px]:p-[clamp(24px,4vh,48px)]

          flex flex-col justify-center items-center
          relative overflow-visible z-20
          min-h-[60vh] min-[701px]:min-h-[62vh] min-[950px]:min-h-[100svh]
        "
      >
        <div className="hidden min-[950px]:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0" />
        <div className="hidden min-[950px]:block absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0" />

        {/* Content */}
        <div className="hidden min-[950px]:block relative z-10 w-full max-w-[980px] px-4 login-card-glass forgot-password-card">
            <div className="forgot-password-header">
                <h2 className="text-2xl font-semibold mb-2">Create your username</h2>
                <p className="text-gray-500 mb-6">
                    This will be your public identity
                </p>
            </div>         

          {/* Input */}
          <input
            type="text"
            value={username}
            onChange={handleChange}
            placeholder="Enter username"
            className="w-full border rounded-lg px-4 py-3 text-lg"
          />

          {/* Status */}
          <div className="mt-2 text-sm h-5">
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
              <p className="text-sm text-gray-500 mb-2">
                Try one of these:
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setUsername(s)}
                    className="px-3 py-1 border rounded-full text-sm hover:bg-[#CEFF1B]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mt-3">{error}</p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-lg border-2 border-black text-gray-600 font-medium text-lg hover:bg-gray-100 transition-all"
            >
              Reset
            </button>
            <div className="flex gap-4">
                <button
                onClick={handleBack}
                className="px-10 py-3 rounded-lg border border-black text-black font-medium text-lg hover:bg-gray-100 transition-all"
                >
                Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={status !== "available"}
                    className={`px-10 py-3 rounded-lg font-medium text-lg transition-all ${status === "available"
                    ? "bg-[#CEFF1B] border-2 border-black text-black hover:bg-[#b8e617]"
                    : "bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    Continue
                </button>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}