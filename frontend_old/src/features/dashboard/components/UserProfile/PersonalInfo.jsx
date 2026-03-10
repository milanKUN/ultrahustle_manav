import { useState, useRef, useEffect } from "react";
import "../../../onboarding/components/OnboardingSelect.css";

export default function PersonalInformation() {
  const ABOUT_LIMIT = 700;
  const Hashtag_LIMIT = 100;
  const Availability_LIMIT = 100;
  const TITLE_LIMIT = 40;
  const BIO_LIMIT = 160;

  const [title, setTitle] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [about, setAbout] = useState("");
  const [availability, setAvailability] = useState("");
  const [open, setOpen] = useState(false);
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [gender, setGender] = useState("");
  const [openGender, setOpenGender] = useState(false);

  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const availabilityRef = useRef(null);
  const genderRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) setOpenCountry(false);
      if (stateRef.current && !stateRef.current.contains(event.target)) setOpenState(false);
      if (availabilityRef.current && !availabilityRef.current.contains(event.target)) setOpen(false);
      if (genderRef.current && !genderRef.current.contains(event.target)) setOpenGender(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const countryOptions = ["India", "United States"];

  const stateOptions =
    country === "India"
      ? [
        "Maharashtra",
        "Delhi",
        "Gujarat",
        "Karnataka",
        "Tamil Nadu",
        "Uttar Pradesh",
        "West Bengal",
      ]
      : country === "United States"
        ? ["California", "Texas", "New York", "Florida"]
        : [];
  // ... (rest of the state and skills)
  // (skipping for brevety in replacement chunk but keeping logic)
  const [skills, setSkills] = useState([
    "Agile/Scrum",
    "Accessibility",
    "Front-end Development",
    "Product Design",
    "Design Systems",
  ]);
  const [hashtag, setHashtag] = useState([
    "Agile/Scrum",
    "Accessibility",
    "Front-end Development",
    "Product Design",
    "Design Systems",
  ]);
  const availabilityOptions = [
    "Available",
    "Unavailable",
    "Working On A Project",
  ];

  const [tools, setTools] = useState([
    "Figma",
    "Illustrator",
    "Photoshop",
    "Tailwind CSS",
  ]);

  const [languages, setLanguages] = useState([]);

  const [openCalendar, setOpenCalendar] = useState(false);

  /* ---------- TAG INPUT HANDLERS ---------- */
  const [focusedId, setFocusedId] = useState(null);

  const handleAddTag = (e, list, setList) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      setList([...list, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const removeTag = (index, list, setList) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="w-full -mt-14 pb-20">
        {/* ================= PERSONAL INFO ================= */}
        <Section title="Personal Information">
          <TwoCol>
            <Input label="First Name" placeholder="First Name" />
            <Input label="Last Name" placeholder="Last Name" />

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
                  onFocus={() => setFocusedId("username")}
                  onBlur={() => setFocusedId(null)}
                  className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* DOB */}
            <div>
              <Label>Date of Birth</Label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={dob}
                  readOnly
                  className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
                />

                <span
                  onClick={() => setOpenCalendar(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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
                </span>
              </div>
            </div>

            <Input label="Email Address" placeholder="example@gmail.com" />

            {/* PHONE */}
            <div>
              <Label>Phone Number</Label>
              <div
                className={`flex items-center border border-black rounded-md px-3 py-2 gap-2 transition-shadow ${focusedId === "phone" ? "shadow-[0_0_15px_#CEFF1B] !border-transparent" : ""
                  }`}
              >
                <span className="text-sm text-gray-700">India</span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-700">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="XXXXXXXXXX"
                  maxLength={10}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  onFocus={() => setFocusedId("phone")}
                  onBlur={() => setFocusedId(null)}
                  className="flex-1 outline-none border-none bg-transparent text-sm pl-2 focus:outline-none focus:ring-0"
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
            <Input label="Street" placeholder="Street" />
            <Input label="City" placeholder="City" />
            {/* COUNTRY */}
            <div>
              <Label>Country</Label>
              <div className={`onboarding-custom-select ${openCountry ? "active" : ""}`} ref={countryRef}>
                <div
                  className={`onboarding-selected-option ${openCountry ? "open" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCountry(!openCountry);
                  }}
                >
                  <span className={!country ? "opacity-70" : ""}>{country || "Select country"}</span>
                  <span className="onboarding-arrow">▼</span>
                </div>

                {openCountry && (
                  <ul className="onboarding-options-list">
                    {countryOptions.map((c) => (
                      <li
                        key={c}
                        className={country === c ? "active" : ""}
                        onClick={() => {
                          setCountry(c);
                          setStateVal("");
                          setOpenCountry(false);
                        }}
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* STATE */}
            <div>
              <Label>State</Label>
              <div className={`onboarding-custom-select ${openState ? "active" : ""}`} ref={stateRef}>
                <div
                  className={`onboarding-selected-option ${openState ? "open" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (country) setOpenState(!openState);
                  }}
                  style={{ cursor: country ? "pointer" : "not-allowed", opacity: country ? 1 : 0.6 }}
                >
                  <span className={!stateVal ? "opacity-70" : ""}>{stateVal || (country ? "Select state" : "Select country first")}</span>
                  <span className="onboarding-arrow">▼</span>
                </div>

                {openState && (
                  <ul className="onboarding-options-list">
                    {stateOptions.map((s) => (
                      <li
                        key={s}
                        className={stateVal === s ? "active" : ""}
                        onClick={() => {
                          setStateVal(s);
                          setOpenState(false);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <Label>Pincode</Label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Pincode"
                maxLength={6}
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
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
            onKeyDown={handleAddTag}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= SKILLS ================= */}
        <Section title="Skills & Expertise">
          <TagInput
            placeholder="Add skills"
            tags={skills}
            setTags={setSkills}
            onKeyDown={handleAddTag}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= TOOLS ================= */}
        <Section title="Tools & Technologies">
          <TagInput
            placeholder="Add tools"
            tags={tools}
            setTags={setTools}
            onKeyDown={handleAddTag}
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
            options={[
              "Hindi",
              "English",
              "Tamil",
              "Telugu",
              "Marathi",
              "Gujarati",
              "Punjabi",
              "Bengali",
              "Kannada",
              "Malayalam",
            ]}
            tags={languages}
            setTags={setLanguages}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-4 mt-10">
          <button className="px-4 py-2 rounded-lg text-sm border border-black">
            Discard
          </button>
          <button className="px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
            Save Changes
          </button>
        </div>
      </div>
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

/* ================= CALENDAR ================= */

function Calendar({ onClose, onSelect }) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [openYear, setOpenYear] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const yearRef = useRef(null);

  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

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
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    } else {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
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
                className={`onboarding-selected-option ${openYear ? "open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenYear(!openYear);
                }}
                style={{ background: "#CEFF1B", color: "black", fontWeight: "bold" }}
              >
                <span>{year} :</span>
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
              className="cursor-pointer"
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

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDate(formatted);
                    onSelect(formatted);
                  }}
                  className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition
                    ${isSelected
                      ? "bg-[#CEFF1B] text-black font-bold"
                      : "hover:bg-[#CEFF1B] hover:text-black"
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

function Input({ label, placeholder }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        // this is for the upper
        placeholder={placeholder}
        className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
      />
    </div>
  );
}

function TagInput({ placeholder, tags, setTags, onKeyDown, onRemove }) {
  const clearAll = () => setTags([]);

  return (
    <div className="space-y-3">
      {/* INPUT */}
      <input
        placeholder={placeholder}
        onKeyDown={(e) => onKeyDown(e, tags, setTags)}
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

function TagSelect({ options, tags, setTags, onRemove }) {
  const [open, setOpen] = useState(false);

  const addTag = (value) => {
    if (!tags.includes(value)) {
      setTags([...tags, value]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className={`onboarding-custom-select ${open ? "active" : ""}`}>
        <div
          className={`onboarding-selected-option ${open ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <span className="opacity-70">Select languages</span>
          <span className="onboarding-arrow">▼</span>
        </div>

        {/* Dropdown */}
        {open && (
          <ul className="onboarding-options-list">
            {options.map((lang) => (
              <li
                key={lang}
                className={tags.includes(lang) ? "active cursor-not-allowed opacity-50" : ""}
                onClick={() => {
                  if (!tags.includes(lang)) addTag(lang);
                }}
              >
                {lang}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected tags */}
      {tags.length > 0 && (
        <div className="flex w-full rounded-lg bg-[#FEFEFE] flex-wrap items-center gap-2 p-2 border">
          <div className="flex flex-wrap gap-2 flex-1">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="tag-chip flex items-center gap-2 px-3 py-1 rounded-md text-xs h-8"
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

          {/* CLEAR ALL */}
          <button
            onClick={() => setTags([])}
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
