import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OnboardingSelect.css';

export default function BusinessDetails() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    employees: '',
    industry: '',
    otherIndustry: '',
    website: '',
    taxId: '',
    country: '',
    state: '',
    city: ''
  });

  const [isPersonalAccount, setIsPersonalAccount] = useState(false);

  // Custom Dropdown State
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const industryRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (industryRef.current && !industryRef.current.contains(event.target)) {
        setIsIndustryOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const currentStep = 5; // Step 5 (0-indexed was 4 previously)
  const totalSteps = 8;
  const stepPaths = [
    "/onboarding",
    "/client-role-selection",
    "/client-work-type-selection",
    "/client-goals-selection",
    "/client-needs",
    "/client-business-details",
    "/client-setup-workspace",
    "/client-profile-setup"
  ];

  const industries = [
    'Technology',
    'Marketing',
    'Design',
    'E-commerce',
    'Education',
    'Healthcare',
    'Real Estate',
    'Entertainment',
    'Finance',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Numeric validation for employees
    if (name === 'employees' && value && !/^\d*$/.test(value)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate('/client-needs');
  };

  const handleContinue = () => {
    // Navigate to next step
    if (isFormValid()) {
      navigate('/client-setup-workspace');
    }
  };

  const handleReset = () => navigate("/onboarding");

  // Validation: 
  // If personal: always valid.
  // If business: Name, Employees, Industry, Country, State, City required? 
  // Images show "Optional" on Website and GST. Implies others are required.
  const isFormValid = () => {
    if (isPersonalAccount) return true;
    return (
      formData.businessName.trim() !== '' &&
      formData.employees.trim() !== '' &&
      formData.industry.trim() !== '' &&
      (formData.industry !== 'Other' || formData.otherIndustry.trim() !== '') &&
      formData.country.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.city.trim() !== ''
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col min-[950px]:flex-row">
      {/* Top Section on Mobile / Left Side on Desktop - Acid Green Panel */}
      <div className="w-full min-[950px]:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[30vh] min-[950px]:min-h-screen">
        <div className="absolute inset-0 flex flex-col justify-between p-6 min-[950px]:p-10">
          {/* Back Button - Mobile Only */}
          <button
            onClick={handleBack}
            className="min-[950px]:hidden w-10 h-10 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF, #9C9C9C)',
              padding: '2px',
            }}
          >
            <span
              className="w-full h-full rounded-full flex items-center justify-center bg-[#CEFF1B]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </button>

          {/* Title */}
          <div className="flex-1 flex flex-col justify-center min-[950px]:justify-start min-[950px]:pt-32 items-center min-[950px]:items-start text-center min-[950px]:text-left px-4 min-[950px]:px-0">
            <h2 className="text-3xl min-[950px]:text-4xl font-bold text-black mb-1 leading-tight">
              Organization &
            </h2>
            <h2 className="text-4xl min-[950px]:text-4xl font-bold text-black mb-4 leading-tight">
              Business Details
            </h2>
            <h2 className="hidden min-[950px]:block text-black text-3xl font-bold">

            </h2>
          </div>

          {/* Step Indicators - Desktop Only */}
          <div className="hidden min-[950px]:flex items-center gap-3 ml-12">
            {[...Array(totalSteps)].map((_, index) => (
              index <= currentStep && (
                <div
                  key={index}
                  onClick={() => index < currentStep && navigate(stepPaths[index])}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep ? "bg-black w-4 h-4" : "bg-white cursor-pointer"
                    }`}
                />
              )
            ))}
          </div>



        </div>
      </div>

      {/* Bottom Section on Mobile / Right Side on Desktop - Content */}
      <div className="w-full min-[950px]:w-[70%] bg-[#E0E0E0] rounded-t-[50px] min-[950px]:rounded-none -mt-12 min-[950px]:mt-0 px-3 py-6 min-[950px]:p-12 flex flex-col justify-start min-[950px]:pt-32 items-center relative overflow-visible min-h-[60vh] min-[950px]:min-h-screen z-20">

        {/* Main Content Area */}
        <div className="relative z-10 w-full max-w-[1200px]">
          {/* Main Card */}
          <div className={`bg-white/40 min-[950px]:bg-white/40 backdrop-blur-md border-1 border-[#CEFF1B] min-[950px]:border min-[950px]:border-[#CEFF1B] rounded-[24px] min-[950px]:rounded-[30px] p-4 min-[950px]:p-8 shadow-xl mb-6 min-[950px]:mb-8 flex flex-col transition-all duration-300`}>

            {isPersonalAccount ? (
              /* Personal Account View */
              <div className="text-center animate-fade-in-up w-full py-10 min-[950px]:py-0">
                <h3 className="text-xl min-[950px]:text-2xl font-bold text-gray-700">No business details required</h3>
              </div>
            ) : (
              /* Business Details Form */
              <div className="w-full grid grid-cols-2 gap-3 min-[950px]:gap-x-8 min-[950px]:gap-y-6 animate-fade-in-up relative z-20">
                {/* Business Name */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">Business / Brand Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                {/* Number of Employees */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">Number of Employees</label>
                  <input
                    type="text"
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    placeholder="Type here (only numeric)"
                    className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">Industry</label>
                  <div className={`onboarding-custom-select ${isIndustryOpen ? "active" : ""}`} ref={industryRef}>
                    <div
                      className={`onboarding-selected-option ${isIndustryOpen ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsIndustryOpen(!isIndustryOpen);
                      }}
                    >
                      <span className={!formData.industry ? "opacity-70" : ""}>
                        {formData.industry || "Type here"}
                      </span>
                      <span className="onboarding-arrow">▼</span>
                    </div>


                    {isIndustryOpen && (
                      <ul className="onboarding-options-list">

                        {industries.map((ind) => (
                          <li
                            key={ind}
                            className={formData.industry === ind ? "active" : ""}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, industry: ind }));
                              setIsIndustryOpen(false);
                            }}
                          >
                            {ind}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Other Industry - shows when Other is selected */}
                {formData.industry === 'Other' ? (
                  <div>
                    <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">Industry</label>
                    <input
                      type="text"
                      name="otherIndustry"
                      value={formData.otherIndustry}
                      onChange={handleInputChange}
                      placeholder="Type your industry"
                      className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                    />
                  </div>
                ) : (
                  /* Website - shows when Other is NOT selected */
                  <div>
                    <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">Website (optional)</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Type here"
                      className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                    />
                  </div>
                )}

                {/* Website - always shows */}
                {formData.industry === 'Other' && (
                  <div>
                    <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">Website (optional)</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Type here"
                      className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                    />
                  </div>
                )}

                {/* GST */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">GST / VAT / Tax ID (optional)</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 min-[950px]:mb-2 text-sm min-[950px]:text-base">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full h-10 rounded-xl border border-black bg-transparent px-3 text-sm text-black/70 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Toggle - outside container */}
          <div className="flex items-center gap-3 min-[950px]:gap-4 mb-6">
            <button
              onClick={() => setIsPersonalAccount(!isPersonalAccount)}
              className={`w-12 h-6 min-[950px]:w-16 min-[950px]:h-8 rounded-full p-0.5 min-[950px]:p-1 transition-all duration-300 border ${isPersonalAccount
                ? 'bg-black border-black'
                : 'bg-white border-[#2B2B2B]'
                }`}
            >
              <div className={`w-5 h-5 min-[950px]:w-6 min-[950px]:h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPersonalAccount ? 'translate-x-6 min-[950px]:translate-x-8' : 'translate-x-0 bg-[#F0F0F0]'
                }`} >
                {!isPersonalAccount && <div className="w-full h-full bg-[#2B2B2B] rounded-full" />}
              </div>
            </button>
            <span className="text-sm min-[950px]:text-xl text-gray-600 font-medium">This is a personal account</span>
          </div>

          <div className="flex flex-wrap justify-center items-center w-full gap-2 min-[950px]:gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 min-[950px]:px-8 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg border-1 border-[#2B2B2B] text-gray-600 font-medium text-sm min-[950px]:text-lg hover:bg-gray-100 transition-all"
            >
              Reset
            </button>

            <div className="flex gap-2 min-[950px]:gap-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 min-[950px]:px-10 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg border-1 border-[#2B2B2B] text-gray-700 font-medium text-sm min-[950px]:text-lg hover:bg-gray-100 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleContinue}
                disabled={!isFormValid()}
                className={`px-4 py-2 min-[950px]:px-10 min-[950px]:py-3 rounded-md min-[950px]:rounded-lg font-medium text-sm min-[950px]:text-lg transition-all whitespace-nowrap ${isFormValid()
                  ? 'bg-[#CEFF1B] border border-black text-black hover:bg-[#b8e617]'
                  : 'bg-[#CEFF1B]/50 border-1 border-[#2B2B2B] text-gray-400 cursor-not-allowed'
                  }`}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Step Indicators - Mobile */}
          <div className="flex justify-center items-center gap-2 mt-8 min-[950px]:hidden">
            {[...Array(totalSteps)].map((_, index) => (
              index <= currentStep && (
                <div
                  key={index}
                  onClick={() => index < currentStep && navigate(stepPaths[index])}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                    ? 'bg-[#C3FF00] w-2.5 h-2.5 shadow-md shadow-[#C3FF00]/40'
                    : 'bg-black/60 cursor-pointer'
                    }`}
                />
              )
            ))}
          </div>




        </div>
      </div>
    </div>
  );
}
