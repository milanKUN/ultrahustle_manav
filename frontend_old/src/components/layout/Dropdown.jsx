import { useState, useRef, useEffect } from "react";

export default function TeamSizeDropdown({ teamSize, setTeamSize }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const options = [
        { value: "2-5", label: "2-5 people" },
        { value: "6-10", label: "6-10 people" },
        { value: "11-25", label: "11-25 people" },
        { value: "26-50", label: "26-50 people" },
        { value: "50+", label: "50+ people" },
    ];

    // close when click outside
    useEffect(() => {
        const close = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const selectedLabel =
        options.find((o) => o.value === teamSize)?.label || "Select one";

    return (
        <div className="flex-1 w-full max-w-[450px]" ref={ref}>
            <label className="block text-gray-800 font-semibold mb-3 text-lg">
                Team Size
            </label>

            {/* Trigger */}
            <div
                onClick={() => setOpen(!open)}
                className="w-full h-[41px] px-4 rounded-xl border border-black bg-gray-100/80 flex items-center justify-between cursor-pointer transition-all hover:border-[#CEFF1B]"
            >
                <span className={`${teamSize ? "text-gray-800" : "text-gray-400"}`}>
                    {selectedLabel}
                </span>

                <svg
                    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeWidth="2" d="M6 9l6 6 6-6" />
                </svg>
            </div>

            {/* Dropdown */}
            {open && (
                <ul className="mt-2 w-full rounded-xl border border-black bg-white shadow-lg overflow-hidden">
                    {options.map((opt) => {
                        const active = teamSize === opt.value;

                        return (
                            <li
                                key={opt.value}
                                onClick={() => {
                                    setTeamSize(opt.value);
                                    setOpen(false);
                                }}
                                className={`px-4 py-3 cursor-pointer transition-all ${active
                                        ? "bg-[#CEFF1B] text-black font-medium"
                                        : "hover:bg-[#CEFF1B]/40"
                                    }`}
                            >
                                {opt.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
