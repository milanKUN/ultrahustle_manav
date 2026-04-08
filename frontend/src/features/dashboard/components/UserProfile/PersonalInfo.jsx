import { useState, useRef, useEffect, useMemo } from "react";
import "../../../onboarding/components/OnboardingSelect.css";
import {
  getMyPersonalInfo,
  putMyPersonalInfo,
  getCountries,
  getStates,
  getCities,
  getLanguages
} from "../../api/personalInfoApi";

export default function PersonalInformation() {
  const ABOUT_LIMIT = 700;
  const Hashtag_LIMIT = 100;
  const Availability_LIMIT = 100;
  const TITLE_LIMIT = 40;
  const BIO_LIMIT = 160;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [popup, setPopup] = useState({
    open: false,
    variant: "success", // success | error
    title: "",
    message: "",
    showProgress: false,
  });
  const [popupAnimateIn, setPopupAnimateIn] = useState(false);
  const [popupProgress, setPopupProgress] = useState(0);
  const popupOkRef = useRef(null);
  const popupAutoCloseRef = useRef(null);
  const popupHideRef = useRef(null);

  const lastLoadedRef = useRef(null);

  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  // const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [title, setTitle] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [about, setAbout] = useState("");
  const [availability, setAvailability] = useState("");
  const [open, setOpen] = useState(false);
  const [dob, setDob] = useState("");
  // const [country, setCountry] = useState("");
  // const [stateVal, setStateVal] = useState("");
  // const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [gender, setGender] = useState("");
  const [openGender, setOpenGender] = useState(false);

  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const availabilityRef = useRef(null);
  const genderRef = useRef(null);

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(""); // name (for display)
  const [countryId, setCountryId] = useState(""); // id (for API)

  const [states, setStates] = useState([]);
  const [stateVal, setStateVal] = useState("");
  const [stateId, setStateId] = useState("");

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [cityId, setCityId] = useState("");

  const [openCity, setOpenCity] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [openCountry, setOpenCountry] = useState(false);

  const [phoneCountry, setPhoneCountry] = useState(null);
  const [openPhoneCountry, setOpenPhoneCountry] = useState(false);
  const phoneCountryRef = useRef(null);
  const hasFetchedLanguages = useRef(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  //get counties
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getCountries();
        setCountries(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCountries();
  }, []);

  //get states from selected country
  useEffect(() => {
    const fetchStates = async () => {
      if (!countryId) {
        setStates([]);
        return;
      }

      try {
        const data = await getStates(countryId);
        setStates(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStates();
  }, [countryId]);
  //get cities
  useEffect(() => {
    const fetchCities = async () => {
      if (!stateId) {
        setCities([]);
        return;
      }

      try {
        const data = await getCities(stateId);
        setCities(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCities();
  }, [stateId]);

  //get languages
  useEffect(() => {
    if (hasFetchedLanguages.current) return;
    hasFetchedLanguages.current = true;
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();
        setLanguageOptions(res); // ✅ store full objects
      } catch (err) {
        console.error(err);
      }
    };

    fetchLanguages();
  }, []);

  //phone country // by default India will be selected
  useEffect(() => {
    if (countries.length > 0 && !phoneCountry) {
      const india = countries.find(c => c.name === "India");
      setPhoneCountry(india || countries[0]);
    }
  }, [countries]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) setOpenCountry(false);
      if (stateRef.current && !stateRef.current.contains(event.target)) setOpenState(false);
      if (cityRef.current && !cityRef.current.contains(event.target)) setOpenCity(false);
      if (availabilityRef.current && !availabilityRef.current.contains(event.target)) setOpen(false);
      if (genderRef.current && !genderRef.current.contains(event.target)) setOpenGender(false);
      if (phoneCountryRef.current && !phoneCountryRef.current.contains(event.target)) setOpenPhoneCountry(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closePopup = () => {
    if (popupAutoCloseRef.current) {
      clearTimeout(popupAutoCloseRef.current);
      popupAutoCloseRef.current = null;
    }
    if (popupHideRef.current) {
      clearTimeout(popupHideRef.current);
      popupHideRef.current = null;
    }

    setPopupAnimateIn(false);
    popupHideRef.current = setTimeout(() => {
      setPopup((p) => ({ ...p, open: false }));
      setPopupProgress(0);
      popupHideRef.current = null;
    }, 200);
  };

  const openPopup = ({ variant, title, message, showProgress, autoCloseMs }) => {
    const msg = String(message || "").trim();
    if (!msg) return;

    if (popupAutoCloseRef.current) {
      clearTimeout(popupAutoCloseRef.current);
      popupAutoCloseRef.current = null;
    }
    if (popupHideRef.current) {
      clearTimeout(popupHideRef.current);
      popupHideRef.current = null;
    }

    setPopupProgress(0);
    setPopupAnimateIn(false);
    setPopup({
      open: true,
      variant,
      title,
      message: msg,
      showProgress: !!showProgress,
    });

    requestAnimationFrame(() => {
      setPopupAnimateIn(true);
      if (showProgress) {
        requestAnimationFrame(() => setPopupProgress(100));
      }
      setTimeout(() => popupOkRef.current?.focus?.(), 0);
    });

    if (autoCloseMs) {
      popupAutoCloseRef.current = setTimeout(() => {
        closePopup();
      }, autoCloseMs);
    }
  };

  // Required helper: showSuccessPopup(message)
  const showSuccessPopup = (message) => {
    openPopup({
      variant: "success",
      title: "Save Changes",
      message: message || "Your personal information has been successfully saved.",
      showProgress: true,
      autoCloseMs: 3000,
    });
  };

  const showErrorPopup = (message) => {
    openPopup({
      variant: "error",
      title: "Save Changes",
      message: message || "Please fix the errors and try again.",
      showProgress: false,
      autoCloseMs: null,
    });
  };

  useEffect(() => {
    return () => {
      if (popupAutoCloseRef.current) clearTimeout(popupAutoCloseRef.current);
      if (popupHideRef.current) clearTimeout(popupHideRef.current);
    };
  }, []);

  const toDisplayDate = (iso) => {
    if (!iso || typeof iso !== "string") return "";
    const trimmed = iso.trim();
    const datePart = trimmed.length >= 10 ? trimmed.slice(0, 10) : trimmed;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return "";
    const [y, mo, d] = datePart.split("-");
    return `${d}-${mo}-${y}`;
  };

  const toIsoDate = (display) => {
    if (!display || typeof display !== "string") return null;
    const trimmed = display.trim();
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  };

  const normalizeAvailabilityForApi = (value) => {
    const v = String(value || "").trim().toLowerCase();
    if (v === "available") return "available";
    if (v === "unavailable") return "unavailable";
    if (v === "working on a project" || v === "working_on_a_project") return "working_on_a_project";
    return null;
  };

  const normalizeAvailabilityForUi = (value) => {
    const v = String(value || "").trim().toLowerCase();
    if (v === "available") return "Available";
    if (v === "unavailable") return "Unavailable";
    if (v === "working_on_a_project" || v === "working on a project") return "Working On A Project";
    return "";
  };

  const normalizeGenderForApi = (value) => {
    const v = String(value || "").trim().toLowerCase();
    if (v === "male") return "male";
    if (v === "female") return "female";
    if (v === "other" || v === "others") return "other";
    return null;
  };

  const normalizeGenderForUi = (value) => {
    const v = String(value || "").trim().toLowerCase();
    if (v === "male") return "Male";
    if (v === "female") return "Female";
    if (v === "other" || v === "others") return "Others";
    return "";
  };

  const normalizeStringArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((x) => String(x || "").trim())
        .filter(Boolean);
    }
    return [];
  };

  const sanitizeTagArray = (value, { maxItems = 50, maxLen = 50 } = {}) => {
    const arr = normalizeStringArray(value)
      .map((x) => x.slice(0, maxLen))
      .filter(Boolean);

    const seen = new Set();
    const out = [];
    for (const item of arr) {
      const key = item.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
      if (out.length >= maxItems) break;
    }
    return out;
  };

  const applyLoadedPersonalInfo = (info) => {
    const normalized = info?.data || info;

    // setFirstName(normalized?.first_name ?? normalized?.firstName ?? "");
    // setLastName(normalized?.last_name ?? normalized?.lastName ?? "");
    setUsername(normalized?.username ?? "");
    setFullName(normalized?.display_name ?? "");

    setEmail(normalized?.contact_email ?? normalized?.email ?? "");

    const phone = normalized?.phone_number ?? normalized?.phone ?? "";
    setPhoneNumber(phone ? String(phone) : "");

    setDob(toDisplayDate(normalized?.date_of_birth || normalized?.dob || ""));
    setGender(normalizeGenderForUi(normalized?.gender));

    setStreet(normalized?.street ?? "");
    setCity(normalized?.city ?? "");
    setCountry(normalized?.country ?? "");
    setStateVal(normalized?.state ?? normalized?.stateVal ?? "");
    setPincode(normalized?.pincode ?? "");

    setTitle(normalized?.title ?? "");
    setShortBio(normalized?.short_bio ?? normalized?.shortBio ?? "");
    setAbout(normalized?.about ?? "");
    setAvailability(normalizeAvailabilityForUi(normalized?.availability));

    const loadedHashtags = normalizeStringArray(normalized?.hashtags ?? normalized?.hashtag);
    const loadedSkills = normalizeStringArray(normalized?.skills);
    const loadedTools = normalizeStringArray(normalized?.tools);
    const loadedLanguages = normalizeStringArray(normalized?.languages);

    if (loadedHashtags.length > 0) setHashtag(loadedHashtags);
    if (loadedSkills.length > 0) setSkills(loadedSkills);
    if (loadedTools.length > 0) setTools(loadedTools);
    if (loadedLanguages.length > 0) setLanguages(loadedLanguages);

    setHashtagDraft("");
    setSkillsDraft("");
    setToolsDraft("");
  };

  const loadPersonalInfo = async () => {
    setIsLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const info = await getMyPersonalInfo();
      lastLoadedRef.current = info;
      applyLoadedPersonalInfo(info);
    } catch (err) {
      // If backend returns 404 when no record exists yet, treat it as empty.
      const message = err?.message || "Failed to load personal info.";
      setSubmitError(message);
      showErrorPopup(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPersonalInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // (skipping for brevety in replacement chunk but keeping logic)
  const [skills, setSkills] = useState([

  ]);
  const [hashtag, setHashtag] = useState([

  ]);
  const [hashtagDraft, setHashtagDraft] = useState("");
  const availabilityOptions = [
    "Available",
    "Unavailable",
    "Working On A Project",
  ];

  const [tools, setTools] = useState([

  ]);
  const [toolsDraft, setToolsDraft] = useState("");

  const [skillsDraft, setSkillsDraft] = useState("");

  const [languages, setLanguages] = useState([]);

  const [openCalendar, setOpenCalendar] = useState(false);

  /* ---------- TAG INPUT HANDLERS ---------- */
  const [focusedId, setFocusedId] = useState(null);

  const removeTag = (index, list, setList) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    setIsSaving(true);

    const finalHashtags = sanitizeTagArray([
      ...hashtag,
      String(hashtagDraft || "").trim(),
    ]);
    const finalSkills = sanitizeTagArray([
      ...skills,
      String(skillsDraft || "").trim(),
    ]);
    const finalTools = sanitizeTagArray([
      ...tools,
      String(toolsDraft || "").trim(),
    ]);
    const finalLanguages = languages.map((l) => l.value);

    const payload = {
      // first_name: String(firstName || "").trim() || null,
      // last_name: String(lastName || "").trim() || null,
      full_name: String(fullName || "").trim() || null,
      username: String(username || "").trim() || null,
      date_of_birth: toIsoDate(dob),
      contact_email: String(email || "").trim().toLowerCase() || null,
      phone_country: phoneCountry?.shortname || null,
      phone_country_code: phoneCountry?.phoneCode ? phoneCountry.phoneCode.startsWith("+") ? phoneCountry.phoneCode.trim() : `+${phoneCountry.phoneCode.trim()}` : null,
      phone_number: phoneNumber || null,
      gender: normalizeGenderForApi(gender),
      street: String(street || "").trim() || null,
      city: String(city || "").trim() || null,
      state: String(stateVal || "").trim() || null,
      country: String(country || "").trim() || null,
      pincode: String(pincode || "").trim() || null,
      title: String(title || "").trim() || null,
      short_bio: String(shortBio || "").trim() || null,
      about: String(about || "").trim() || null,
      availability: normalizeAvailabilityForApi(availability),
      hashtags: finalHashtags,
      skills: finalSkills,
      tools: finalTools,
      languages: finalLanguages,
    };

    console.log('payload', payload);

    try {
      // Keep UI in sync with what we send
      setHashtag(finalHashtags);
      setSkills(finalSkills);
      setTools(finalTools);
      setHashtagDraft("");
      setSkillsDraft("");
      setToolsDraft("");

      const res = await putMyPersonalInfo(payload);
      lastLoadedRef.current = res;
      setSubmitSuccess("Saved successfully.");
      showSuccessPopup("Your personal information has been successfully saved.");
    } catch (err) {
      const msg = err?.message || "Save failed.";
      setSubmitError(msg);
      showErrorPopup(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    if (lastLoadedRef.current) {
      applyLoadedPersonalInfo(lastLoadedRef.current);
      return;
    }

    await loadPersonalInfo();
  };

  return (
    <>
      <div className="w-full -mt-16">
        {/* ================= PERSONAL INFO ================= */}
        <Section title="Personal Information">
          <TwoCol>
            {/* <Input label="First Name" placeholder="First Name" value={firstName} onChange={setFirstName} />
            <Input label="Last Name" placeholder="Last Name" value={lastName} onChange={setLastName} /> */}
            <Input label="Full Name" placeholder="Full Name" value={fullName} onChange={setFullName} />

            {/* USERNAME */}
            <div>
              <Label>User Name</Label>
              <div
                className={`flex items-center w-full border border-black rounded-md px-3 py-2 text-sm transition-shadow ${focusedId === "username" ? "shadow-[0_0_15px_#CEFF1B] !border-transparent" : ""
                  }`}
              >
                <span className="text-gray-400 mr-1 select-none">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => {
                    const next = String(e.target.value || "")
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, "")
                      .slice(0, 30);
                    setUsername(next);
                  }}
                  onFocus={() => setFocusedId("username")}
                  onBlur={() => setFocusedId(null)}
                  className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 m-0 w-full text-sm"
                  readOnly
                />
              </div>
            </div>

            {/* DOB */}
            <div>
              <Label>Date of Birth</Label>

              <div className="relative w-full" style={{ position: 'relative', width: '100%', display: 'block' }}>
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={dob}
                  readOnly
                  className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                />

                <div
                  onClick={() => setOpenCalendar(true)}
                  className="cursor-pointer flex items-center justify-center p-1 bg-transparent hover:!bg-transparent text-gray-500 hover:text-black dynamic-yellow-icon"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
            </div>

            <Input label="Email Address" placeholder="example@gmail.com" value={email} onChange={setEmail} type="email" readOnly />

            {/* PHONE */}
            <div>
              <Label>Phone Number</Label>

              <div
                className={`flex items-center w-full border border-black rounded-md px-3 py-2 text-sm transition-shadow gap-2 ${focusedId === "phone"
                    ? "shadow-[0_0_15px_#CEFF1B] !border-transparent"
                    : ""
                  }`}
              >
                {/* COUNTRY SELECT */}
                <div
                  className="relative flex items-center gap-1 cursor-pointer"
                  ref={phoneCountryRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenPhoneCountry(!openPhoneCountry);
                  }}
                >
                  <span className="text-sm">
                    {phoneCountry?.shortname || "Country"}
                  </span>
                  <span className="text-gray-500 text-xs">▼</span>

                  {openPhoneCountry && (
                    <ul className="absolute top-10 left-0 bg-white border rounded-md shadow max-h-60 overflow-auto z-50 w-48">
                      {countries.map((c) => (
                        <li
                          key={c.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setPhoneCountry(c);
                            setOpenPhoneCountry(false);
                          }}
                        >
                          {c.shortname} ({c.phoneCode})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <span className="text-gray-400">|</span>

                {/* PHONE CODE */}
                <span className="text-sm min-w-[40px]">
                  {phoneCountry?.phoneCode || "+--"}
                </span>

                {/* INPUT */}
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="XXXXXXXXXX"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    const next = e.target.value.replace(/[^0-9]/g, "");
                    setPhoneNumber(next);
                  }}
                  onFocus={() => setFocusedId("phone")}
                  onBlur={() => setFocusedId(null)}
                  className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 m-0 w-full text-sm pl-2"
                />
              </div>
            </div>

            {/* GENDER */}
            <div>
              <Label>Gender</Label>
              <div className={`onboarding-custom-select ${openGender ? "active" : ""}`} ref={genderRef}>
                <div
                  className={`onboarding-selected-option ${openGender ? "open" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenGender(!openGender);
                  }}
                >
                  <span className={!gender ? "opacity-70" : ""}>{gender || "Select gender"}</span>
                  <span className="onboarding-arrow">▼</span>
                </div>

                {openGender && (
                  <ul className="onboarding-options-list">
                    {["Male", "Female", "Others"].map((g) => (
                      <li
                        key={g}
                        className={gender === g ? "active" : ""}
                        onClick={() => {
                          setGender(g);
                          setOpenGender(false);
                        }}
                      >
                        {g}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TwoCol>
        </Section>

        {/* ================= ADDRESS ================= */}
        <Section title="Address">
          <TwoCol>
            <Input label="Street" placeholder="Street" value={street} onChange={setStreet} />
            {/* <Input label="City" placeholder="City" value={city} onChange={setCity} /> */}
            <div
              className={`onboarding-custom-select ${openCountry ? "active" : ""}`}
              ref={countryRef}
            >
              <Label>Country</Label>

              <div
                className={`onboarding-selected-option ${openCountry ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCountry((prev) => !prev);

                  if (!openCountry) {
                    setCountrySearch("");
                  }
                }}
              >
                <input
                  type="text"
                  value={openCountry ? countrySearch : country}
                  placeholder="Select country"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCountry(true);
                  }}
                  onFocus={() => {
                    setOpenCountry(true);
                    setCountrySearch("");
                  }}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setOpenCountry(true);
                  }}
                  className="w-full bg-transparent outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent text-sm p-0 m-0"
                />
                <span className="onboarding-arrow">▼</span>
              </div>

              {openCountry && (
                <ul className="onboarding-options-list max-h-60 overflow-y-auto">
                  {countries?.filter((c) =>
                    c.name.toLowerCase().includes(countrySearch.toLowerCase())
                  ).length > 0 ? (
                    countries
                      .filter((c) =>
                        c.name.toLowerCase().includes(countrySearch.toLowerCase())
                      )
                      .map((c) => (
                        <li
                          key={c.id}
                          className={country === c.name ? "active" : ""}
                          onClick={() => {
                            setCountry(c.name);
                            setCountryId(c.id);
                            setCountrySearch(c.name);
                            setStateVal("");
                            setStateId("");
                            setCity("");
                            setCityId("");
                            setOpenCountry(false);
                          }}
                        >
                          {c.name}
                        </li>
                      ))
                  ) : (
                    <li className="opacity-70 cursor-not-allowed px-3 py-2">
                      No country found
                    </li>
                  )}
                </ul>
              )}
            </div>


            {/* STATE */}
            <div
              className={`onboarding-custom-select ${openState ? "active" : ""}`}
              ref={stateRef}
            >
              <Label>State</Label>

              <div
                className={`onboarding-selected-option ${openState ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!countryId) return;

                  setOpenState((prev) => !prev);

                  if (!openState) {
                    setStateSearch("");
                  }
                }}
              >
                <input
                  type="text"
                  value={openState ? stateSearch : stateVal}
                  placeholder={countryId ? "Select state" : "Select country first"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!countryId) return;
                    setOpenState(true);
                  }}
                  onFocus={() => {
                    if (!countryId) return;
                    setOpenState(true);
                    setStateSearch("");
                  }}
                  onChange={(e) => {
                    if (!countryId) return;
                    setStateSearch(e.target.value);
                    setOpenState(true);
                  }}
                  disabled={!countryId}
                  className="w-full bg-transparent outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed text-sm p-0 m-0"
                />
                <span className="onboarding-arrow">▼</span>
              </div>

              {openState && (
                <ul className="onboarding-options-list max-h-60 overflow-y-auto">
                  {states?.filter((s) =>
                    s.name.toLowerCase().includes(stateSearch.toLowerCase())
                  ).length > 0 ? (
                    states
                      .filter((s) =>
                        s.name.toLowerCase().includes(stateSearch.toLowerCase())
                      )
                      .map((s) => (
                        <li
                          key={s.id}
                          className={stateVal === s.name ? "active" : ""}
                          onClick={() => {
                            setStateVal(s.name);   // display selected state
                            setStateId(s.id);      // store selected state id
                            setStateSearch(s.name);
                            setCity("");           // reset city
                            setCityId("");
                            setCitySearch("");
                            setOpenState(false);
                          }}
                        >
                          {s.name}
                        </li>
                      ))
                  ) : (
                    <li className="opacity-70 cursor-not-allowed px-3 py-2">
                      No state found
                    </li>
                  )}
                </ul>
              )}
            </div>
            {/* CITY */}
            {/* <div
              className={`onboarding-custom-select ${openCity ? "active" : ""}`}
              ref={cityRef}
            >
              <Label>City</Label>

              <div
                className={`onboarding-selected-option ${openCity ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!stateId) return;

                  setOpenCity((prev) => !prev);

                  if (!openCity) {
                    setCitySearch("");
                  }
                }}
              >
                <input
                  type="text"
                  value={openCity ? citySearch : city}
                  placeholder={stateId ? "Select city" : "Select state first"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!stateId) return;
                    setOpenCity(true);
                  }}
                  onFocus={() => {
                    if (!stateId) return;
                    setOpenCity(true);
                    setCitySearch("");
                  }}
                  onChange={(e) => {
                    if (!stateId) return;
                    setCitySearch(e.target.value);
                    setOpenCity(true);
                  }}
                  disabled={!stateId}
                  className="w-full bg-transparent outline-none border-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <span className="onboarding-arrow">▼</span>
              </div>

              {openCity && (
                <ul className="onboarding-options-list max-h-60 overflow-y-auto">
                  {cities?.filter((c) =>
                    c.name.toLowerCase().includes(citySearch.toLowerCase())
                  ).length > 0 ? (
                    cities
                      .filter((c) =>
                        c.name.toLowerCase().includes(citySearch.toLowerCase())
                      )
                      .map((c) => (
                        <li
                          key={c.id}
                          className={city === c.name ? "active" : ""}
                          onClick={() => {
                            setCity(c.name);       // display selected city
                            setCityId(c.id);       // store selected city id
                            setCitySearch(c.name);
                            setOpenCity(false);
                          }}
                        >
                          {c.name}
                        </li>
                      ))
                  ) : (
                    <li className="opacity-70 cursor-not-allowed px-3 py-2">
                      No city found
                    </li>
                  )}
                </ul>
              )}
            </div> */}
            <Input label="City" placeholder="City" value={city} onChange={setCity} />
            <div>
              <Label>Pincode</Label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  const next = String(e.target.value || "").replace(/[^0-9]/g, "");
                  setPincode(next.slice(0, 6));
                }}
                className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
            </div>
          </TwoCol>
        </Section>

        {/* ================= BIO ================= */}
        <Section title="Bio">
          <TwoCol>
            {/* TITLE */}
            <div>
              <Label>Title</Label>
              <textarea
                placeholder="Enter your professional title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_LIMIT))}
                rows={3}
                className="w-full bg-transparent border border-black rounded-md p-3 text-sm
                   outline-none resize-none placeholder:text-gray-400 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <p className="text-xs text-red-500 mt-1">
                {title.length}/{TITLE_LIMIT} characters
              </p>
            </div>

            {/* SHORT BIO */}
            <div>
              <Label>Short Bio</Label>
              <textarea
                placeholder="Add your skills or a short introduction..."
                value={shortBio}
                onChange={(e) =>
                  setShortBio(e.target.value.slice(0, BIO_LIMIT))
                }
                rows={3}
                className="w-full bg-transparent border border-black rounded-md p-3 text-sm
                   outline-none resize-none placeholder:text-gray-400 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <p className="text-xs text-red-500 mt-1">
                {shortBio.length}/{BIO_LIMIT} characters
              </p>
            </div>
          </TwoCol>
        </Section>

        {/* ================= ABOUT ================= */}
        <Section title="About">
          <textarea
            placeholder="Write a detailed description about yourself..."
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value.slice(0, ABOUT_LIMIT))}
            className="w-full bg-transparent border border-black rounded-md p-3 text-sm
               outline-none resize-none placeholder:text-gray-400 focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
          />
          <p className="text-xs text-red-500 mt-1">
            {about.length}/{ABOUT_LIMIT} characters
          </p>
        </Section>

        <Section title="Hashtag">
          <TagInput
            placeholder="Add hashtags"
            tags={hashtag}
            setTags={setHashtag}
            draft={hashtagDraft}
            setDraft={setHashtagDraft}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= SKILLS ================= */}
        <Section title="Skills & Expertise">
          <TagInput
            placeholder="Add skills"
            tags={skills}
            setTags={setSkills}
            draft={skillsDraft}
            setDraft={setSkillsDraft}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= TOOLS ================= */}
        <Section title="Tools & Technologies">
          <TagInput
            placeholder="Add tools"
            tags={tools}
            setTags={setTools}
            draft={toolsDraft}
            setDraft={setToolsDraft}
            onRemove={removeTag}
          />
        </Section>

        <Section title="Availability">
          <div className={`onboarding-custom-select ${open ? "active" : ""}`} ref={availabilityRef}>
            <div
              className={`onboarding-selected-option ${open ? "open" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              <span className={!availability ? "opacity-70" : ""}>{availability || "Availability"}</span>
              <span className="onboarding-arrow">▼</span>
            </div>

            {open && (
              <ul className="onboarding-options-list">
                {availabilityOptions.map((item) => (
                  <li
                    key={item}
                    className={availability === item ? "active" : ""}
                    onClick={() => {
                      setAvailability(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {/* ================= LANGUAGES ================= */}
        <Section title="Languages">
          <TagSelect
            options={languageOptions}   // ✅ full objects
            tags={languages}
            setTags={setLanguages}
            onRemove={(id) => {
              setLanguages((prev) => prev.filter((t) => t.id !== id));
            }}
          />
        </Section>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            className="px-4 py-2 rounded-lg text-sm border border-black"
            onClick={handleDiscard}
            disabled={isLoading || isSaving}
          >
            Discard
          </button>
          <button
            className="px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black"
            onClick={handleSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <Toast
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        showProgress={popup.showProgress}
        progress={popupProgress}
        animateIn={popupAnimateIn}
        okRef={popupOkRef}
        onClose={closePopup}
      />

      {/* ================= CALENDAR MODAL ================= */}
      {openCalendar && (
        <Calendar
          onClose={() => setOpenCalendar(false)}
          onSelect={(date) => {
            setDob(date);
            setOpenCalendar(false);
          }}
        />
      )}
    </>
  );
}

function Toast({ open, variant, title, message, showProgress, progress, animateIn, okRef, onClose }) {
  if (!open) return null;

  const isSuccess = variant === "success";
  const YELLOW = "#CEFF1B";

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose?.();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/25 backdrop-blur-sm transition-opacity duration-200 ${animateIn ? "opacity-100" : "opacity-0"
        }`}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`w-full max-w-md transform transition-all duration-200 ${animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="toast-modal-card relative overflow-hidden rounded-2xl shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          {/* Top animated progress bar */}
          {showProgress && (
            <div className="toast-progress-track h-[3px] w-full">
              <div
                className="h-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: YELLOW,
                  transition: "width 3000ms linear",
                }}
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="toast-title text-lg font-semibold leading-6">{title}</p>

              <button
                type="button"
                className="toast-close-btn h-9 w-9 rounded-xl grid place-items-center"
                onClick={onClose}
                aria-label="Close"
                title="Close"
              >
                <span className="text-base leading-none">✕</span>
              </button>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center border border-black"
                style={{ backgroundColor: YELLOW }}
                aria-hidden="true"
              >
                {isSuccess ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="toast-message text-sm leading-6">{message}</p>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    ref={okRef}
                    className="toast-ok-btn px-5 py-2.5 rounded-xl text-sm font-semibold"
                    onClick={onClose}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CALENDAR ================= */

function Calendar({ onClose, onSelect }) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [openYear, setOpenYear] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const yearRef = useRef(null);

  // ✅ Show years only till current year
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => 1950 + i
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setOpenYear(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const changeMonth = (dir) => {
    if (dir === "prev") {
      if (month === 0) {
        if (year > 1950) {
          setMonth(11);
          setYear((y) => y - 1);
        }
      } else {
        setMonth((m) => m - 1);
      }
    } else {
      // ✅ Prevent going beyond current month/current year
      if (year === currentYear && month === currentMonth) return;

      if (month === 11) {
        if (year < currentYear) {
          setMonth(0);
          setYear((y) => y + 1);
        }
      } else {
        setMonth((m) => m + 1);
      }
    }
  };

  const formatDate = (d) =>
    `${String(d).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/20 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      {/* OUTER CARD */}
      <div
        className="bg-white dark:bg-[#2B2B2B] w-[95%] max-w-[335px] h-[350px] rounded-xl p-3 shadow-lg calendar-outer cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* INNER CARD */}
        <div className="bg-white dark:bg-[#2B2B2B] w-full h-full rounded-lg p-3 flex flex-col text-black dark:text-black calendar-inner">
          {/* YEAR DROPDOWN */}
          <div className="relative mb-6 z-20 w-full" ref={yearRef}>
            <div className={`onboarding-custom-select ${openYear ? "active" : ""}`}>
              <div
                className={`onboarding-selected-option expiry-year-dropdown ${openYear ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenYear(!openYear);
                }}
                style={{ background: "#CEFF1B", color: "black", fontWeight: "bold" }}
              >
                <span>{year}</span>
                <span className="onboarding-arrow">▼</span>
              </div>

              {openYear && (
                <ul className="onboarding-options-list dark:bg-[#1E1E1E]">
                  {years.map((y) => (
                    <li
                      key={y}
                      className={y === year ? "active" : ""}
                      onClick={() => {
                        setYear(y);

                        // ✅ If current year selected, don't allow future month
                        if (y === currentYear && month > currentMonth) {
                          setMonth(currentMonth);
                        }

                        setOpenYear(false);
                      }}
                    >
                      {y}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* MONTH HEADER */}
          <div className="flex justify-between items-center text-sm font-medium -mt-2 mb-2 px-1">
            <span
              onClick={() => changeMonth("prev")}
              className="cursor-pointer"
            >
              ‹
            </span>
            <span>
              {months[month]} {year}
            </span>
            <span
              onClick={() => changeMonth("next")}
              className={`cursor-pointer ${
                year === currentYear && month === currentMonth
                  ? "opacity-30 pointer-events-none"
                  : ""
              }`}
            >
              ›
            </span>
          </div>

          {/* WEEK */}
          <div className="grid grid-cols-7 text-[10px] text-gray-600 dark:text-gray-400 mb-2">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-2 text-sm flex-1">
            {/* PREVIOUS MONTH DAYS */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={i}
                className="text-center text-gray-400 dark:text-gray-600"
              >
                {prevMonthDays - firstDay + i + 1}
              </div>
            ))}

            {/* CURRENT MONTH DAYS */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const formatted = formatDate(day);
              const isSelected = selectedDate === formatted;

              // ✅ Disable future dates in current month/year
              const isFutureDate =
                year === currentYear &&
                month === currentMonth &&
                day > today.getDate();

              return (
                <div
                  key={day}
                  onClick={() => {
                    if (isFutureDate) return;
                    setSelectedDate(formatted);
                    onSelect(formatted);
                  }}
                  className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center transition
                    ${
                      isFutureDate
                        ? "text-gray-400 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "bg-[#CEFF1B] text-black font-bold cursor-pointer"
                        : "cursor-pointer hover:bg-[#CEFF1B] hover:!text-black"
                    }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-xl font-semibold whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label className="block mb-1 font-medium">{children}</label>;
}

function TwoCol({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  readOnly = false,
  disabled = false,
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]
          ${readOnly ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
      />
    </div>
  );
}

function TagInput({ placeholder, tags, setTags, draft, setDraft, onRemove }) {
  const clearAll = () => setTags([]);

  const addDraftToTags = () => {
    const value = String(draft || "").trim();
    if (!value) return;
    setTags([...(tags || []), value]);
    setDraft?.("");
  };

  return (
    <div className="space-y-3">
      {/* INPUT */}
      <input
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addDraftToTags();
          }
        }}
        onBlur={() => addDraftToTags()}
        className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
      />

      {/* CHIP CONTAINER (input-style) */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center w-full min-h-[56px] rounded-md px-2 py-2 bg-white dark:bg-[#232323] gap-y-2 gap-x-2 mb-2">
          {/* LEFT: CHIPS */}
          <div className="flex flex-wrap gap-2 flex-1">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="tag-chip flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-gray-100 dark:bg-[#232323]"
              >
                {tag}
                <button
                  onClick={() => onRemove(i, tags, setTags)}
                  className="text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* RIGHT: BIG CLOSE (container level) */}
          <button
            onClick={clearAll}
            className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
            title="Clear all"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}



const TagSelect = ({ options = [], tags = [], setTags, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  // ✅ close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    const exists = tags.some((t) => t.id === option.id);
    if (!exists) {
      setTags([...tags, option]);
    }
    setSearch("");
    setOpen(false);
  };

  // ✅ only show matching + unselected options
  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return options.filter((opt) => {
      const alreadySelected = tags.some((t) => t.id === opt.id);
      const label = String(opt?.value || "").toLowerCase();
      return !alreadySelected && label.includes(q);
    });
  }, [options, tags, search]);

  return (
    <div className="space-y-3 relative" ref={wrapperRef}>
      {/* Dropdown */}
      <div className={`onboarding-custom-select ${open ? "active" : ""}`}>
        <div
          className={`onboarding-selected-option ${open ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          <input
            type="text"
            value={search}
            placeholder="Select languages"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            className="w-full bg-transparent outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent text-sm p-0 m-0"
          />
          <span className="onboarding-arrow">▼</span>
        </div>

        {open && (
          <ul className="onboarding-options-list max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.value}
                </li>
              ))
            ) : (
              <li className="opacity-70 cursor-not-allowed">
                No options found
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Selected Tags */}
      {tags.length > 0 && (
        <div className="flex w-full rounded-lg bg-[#FEFEFE] flex-wrap items-center gap-2 p-2 border">
          <div className="flex flex-wrap gap-2 flex-1">
            {tags.map((tag, index) => (
              <span
                key={tag.id ?? `${tag.value}-${index}`}
                className="tag-chip flex items-center gap-2 px-3 py-1 rounded-md text-xs h-8"
              >
                {tag.value}
                <button
                  type="button"
                  onClick={() => onRemove(tag.id)}
                  className="text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTags([])}
            className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// function TagSelect({ options, tags, setTags, onRemove }) {
//   const [open, setOpen] = useState(false);

//   const addTag = (value) => {
//     if (!tags.includes(value)) {
//       setTags([...tags, value]);
//     }
//     setOpen(false);
//   };

//   return (
//     <div className="space-y-3">
//       {/* Input */}
//       <div className={`onboarding-custom-select ${open ? "active" : ""}`}>
//         <div
//           className={`onboarding-selected-option ${open ? "open" : ""}`}
//           onClick={(e) => {
//             e.stopPropagation();
//             setOpen(!open);
//           }}
//         >
//           <span className="opacity-70">Select languages</span>
//           <span className="onboarding-arrow">▼</span>
//         </div>

//         {/* Dropdown */}
//         {open && (
//           <ul className="onboarding-options-list">
//             {options.map((lang) => (
//               <li
//                 key={lang}
//                 className={tags.includes(lang) ? "active cursor-not-allowed opacity-50" : ""}
//                 onClick={() => {
//                   if (!tags.includes(lang)) addTag(lang);
//                 }}
//               >
//                 {lang}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Selected tags */}
//       {tags.length > 0 && (
//         <div className="flex w-full rounded-lg bg-[#FEFEFE] flex-wrap items-center gap-2 p-2 border">
//           <div className="flex flex-wrap gap-2 flex-1">
//             {tags.map((tag, i) => (
//               <span
//                 key={i}
//                 className="tag-chip flex items-center gap-2 px-3 py-1 rounded-md text-xs h-8"
//               >
//                 {tag}
//                 <button
//                   onClick={() => onRemove(i, tags, setTags)}
//                   className="text-xs"
//                 >
//                   ✕
//                 </button>
//               </span>
//             ))}
//           </div>

//           {/* CLEAR ALL */}
//           <button
//             onClick={() => setTags([])}
//             className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
//             title="Clear all"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
