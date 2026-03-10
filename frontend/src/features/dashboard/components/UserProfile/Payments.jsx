import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";
import "../../../onboarding/components/OnboardingSelect.css";

function Payments({ theme }) {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [showCardNumber, setShowCardNumber] = useState(false);

  return (
    <div className=" -mt-16 from-gray-100 to-lime-50 rounded-xl p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold whitespace-nowrap">
          Payments & Payouts
        </h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>

      <p className="text-[14px] sm:text-[16px] text-gray-500 mb-6">
        (For buying services/products/courses)
      </p>


      {/* ================= PAYMENT METHODS ================= */}
      <div className="mb-8">
        <p className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-3">
          Payment Methods
        </p>

        <div className="space-y-4">
          {/* ADD CARD */}
          <label className="flex items-start sm:items-center gap-2 text-[16px] sm:text-[18px] md:text-[20px]">
            <input type="radio" name="payment" className="mt-1 sm:mt-0" />
            <span>Add credit/debit card</span>
          </label>

          <div className="h-px bg-[#2B2B2B]" />

          {/* CARD ICONS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="border rounded-md px-3 py-2 bg-white">
              <img src="/visa.png" alt="Visa" className="h-5" />
            </div>

            <div className="border rounded-md px-3 py-2 bg-white">
              <img src="/mastercard.png" alt="Mastercard" className="h-5" />
            </div>

            <div className="border rounded-md px-3 py-2 bg-white">
              <img src="/paypal.svg" alt="PayPal" className="h-5" />
            </div>
          </div>

          {/* UPI */}
          <label className="flex items-start sm:items-center gap-2 text-[16px] sm:text-[18px] md:text-[20px]">
            <input type="radio" name="payment" className="mt-1 sm:mt-0" />
            <span className="flex items-center gap-2">
              Scan and Pay with <img src="/upi.png" alt="upi" className="h-5" />
            </span>
          </label>

          <div className="h-px bg-[#2B2B2B]" />

          <p className="text-[14px] sm:text-[16px] cursor-pointer">
            Click here to Scan
          </p>

          {/* SAVED CARD */}
          <label className="flex items-start sm:items-center gap-2 text-[16px] sm:text-[18px] md:text-[20px]">
            <input type="radio" name="payment" className="mt-1 sm:mt-0" />
            <span>Remove / Set default</span>
          </label>

          <div className="h-px bg-[#2B2B2B]" />

          <p className="text-[16px] sm:text-[18px] text-gray-600">
            abc Bank ****1234
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <button className="w-full sm:w-[204px] h-[36px] border border-black bg-[#CEFF1B] rounded text-xs font-medium">
              + Add Another Account
            </button>

            <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
              Discard
            </button>
          </div>
        </div>
      </div>


      <div className=" text-[20px]">
        <label className=" text-[20px] flex items-center gap-2">
          <input type="radio" name="payment" />
          Add another account
        </label>
      </div>
      <div className="h-px my-4 bg-[#2B2B2B] mb-8" />

      {/* ================= CARD DETAILS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block mb-1 font-medium">Card Number</label>
          <div className="relative">
            <input
              type={showCardNumber ? "text" : "password"}
              inputMode="numeric"
              maxLength={16}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              placeholder="**** **** **** 2345"
            />
            <button
              type="button"
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
            >
              {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">CVV</label>
          <input
            type="password"
            maxLength={4}
            className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            placeholder="CVV"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Name On Card</label>
          <input
            type="text"
            className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            placeholder="Name on card"
          />
        </div>

        {/* ✅ Expiry Date — SAME LINE & SAME DESIGN */}
        <div>
          <label className="block mb-1 font-medium">Expiry Date</label>

          <div className="relative">
            <input
              type="text"
              placeholder="MM / YY"
              value={expiryDate}
              readOnly
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />

            <span
              onClick={() => setOpenCalendar(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
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
      </div>

      {/* ✅ Calendar OUTSIDE grid (best practice) */}
      {openCalendar && createPortal(
        <div className={`user-page ${theme || 'light'}`}>
          <ExpiryCalendar
            onClose={() => setOpenCalendar(false)}
            onSelect={(value) => {
              setExpiryDate(value);
              setOpenCalendar(false);
            }}
          />
        </div>,
        document.body
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 mb-10">
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
          Discard
        </button>

        <button className="w-full sm:w-auto px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
          Confirm
        </button>
      </div>


      {/* ================= PAYOUT ACCOUNTS ================= */}
      {/* ================= PAYOUT ACCOUNTS ================= */}
      <div className="mb-6">
        <p className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-2">
          Payout Accounts
        </p>

        <p className="text-[14px] sm:text-[16px] md:text-[18px] mb-3 cursor-pointer">
          Add account
        </p>

        <div className="h-px my-4 bg-[#2B2B2B]" />

        {/* ICONS + ACTION */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/visa.png" alt="Visa" className="h-5" />
          </div>

          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/mastercard.png" alt="Mastercard" className="h-5" />
          </div>

          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/3card.png" alt="Card" className="h-5" />
          </div>

          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/4card.png" alt="Card" className="h-5" />
          </div>

          {/* SET PRIMARY */}
          <button className="border rounded-md px-4 py-2 bg-white text-[12px] sm:text-[14px] font-medium hover:bg-[#CEFF1B] transition">
            Set primary payout method
          </button>
        </div>
      </div>

      {/* ================= BILLING ADDRESS ================= */}
      <div className="mb-6">
        <p className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold mb-3">
          Billing Address
        </p>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              placeholder="First name"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email for Invoice
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <div className="flex items-center border border-black rounded-md px-3 py-2 gap-2 focus-within:shadow-[0_0_15px_#CEFF1B] focus-within:!border-transparent">
              <span className="text-sm text-gray-700">India</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-700">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="XXXXXXXXXX"
                maxLength={10}
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                className="flex-1 outline-none border-none bg-transparent text-sm pl-2 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* ADDRESS HEADER */}
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-xl font-semibold whitespace-nowrap">
            Address
          </h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>

        {/* ADDRESS DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Street Address</label>
            <input
              type="text"
              placeholder="Street, House No, Area"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              placeholder="City"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              type="text"
              placeholder="State"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input
              type="text"
              placeholder="Country"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Pincode</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
              placeholder="Pincode"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
            Discard
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpiryCalendar({ onClose, onSelect }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [openYear, setOpenYear] = useState(false);
  const yearRef = useRef(null);

  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setOpenYear(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      {/* OUTER CARD */}
      <div
        className="bg-[#F2F2F2] w-[95%] max-w-[335px] h-[380px] rounded-xl p-3 relative flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* INNER CARD */}
        <div className="bg-[#FEFEFE]/40 w-full h-full rounded-lg p-3 flex flex-col items-center">
          {/* YEAR DROPDOWN */}
          <div className="relative mb-4 w-full" ref={yearRef}>
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
                <ul className="onboarding-options-list">
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

          {/* MONTH GRID */}
          <div className="grid grid-cols-3 gap-3 flex-1 place-content-center w-full">
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() =>
                  onSelect(
                    `${String(i + 1).padStart(2, "0")} / ${String(year).slice(
                      -2,
                    )}`,
                  )
                }
                className="border border-black rounded-md py-3 text-sm font-medium text-black hover:bg-[#CEFF1B] hover:text-black transition-colors"
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-xs text-gray-500 hover:text-black underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payments;
