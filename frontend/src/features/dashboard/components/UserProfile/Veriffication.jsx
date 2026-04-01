import { useState } from "react";
import { Upload } from "lucide-react";

export default function Verification() {
  const [tab, setTab] = useState("government");

  return (
    <div
      className="
        verification-page
        w-full
        -mt-16 sm:-mt-32          /* ✅ mobile fix */
        from-gray-100 via-white to-lime-50
        rounded-xl
        p-4 sm:p-6 md:p-8
        min-h-[450px]
        flex flex-col
        overflow-x-hidden        /* ✅ STOP right overflow */
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold whitespace-nowrap">
          Verification
        </h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>

      {/* IDENTITY VERIFICATION */}
      <p className="text-[18px] sm:text-[20px] font-semibold text-slate-800 mb-4">
        Identity Verification
      </p>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 w-full">
        <TabButton
          label="Government ID"
          active={tab === "government"}
          onClick={() => setTab("government")}
        />
        <TabButton
          label="Selfie verification"
          active={tab === "selfie"}
          onClick={() => setTab("selfie")}
        />
        <TabButton
          label="Auto-verification result"
          active={tab === "auto"}
          onClick={() => setTab("auto")}
        />
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="flex-1 w-full overflow-x-hidden">
        {/* GOVERNMENT ID */}
        {tab === "government" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 w-full">
            <UploadBox title="Front Side" />
            <UploadBox title="Back Side" />
          </div>
        )}

        {/* SELFIE VERIFICATION */}
        {tab === "selfie" && (
          <div className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Selfie Verification
            </p>
            <UploadBox full />
          </div>
        )}

        {/* AUTO VERIFICATION RESULT */}
        {tab === "auto" && <div className="h-full" />}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 sm:mt-10 w-full">
        <button className="px-4 py-2 rounded-lg text-sm border border-black w-full sm:w-auto">
          Discard
        </button>
        <button className="px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black w-full sm:w-auto">
          Confirm
        </button>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4
        py-2
        text-[14px]
        font-medium
        rounded-lg
        border
        transition
        whitespace-nowrap
        ${active
          ? "bg-[#CEFF1B] border-black text-black"
          : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"
        }
      `}
    >
      {label}
    </button>
  );
}

function UploadBox({ title, full }) {
  return (
    <div className="w-full overflow-hidden">
      {title && (
        <p className="text-[14px] sm:text-[16px] font-medium text-slate-800 mb-3">
          {title}
        </p>
      )}

      <div
        className={`
          w-full
          border border-gray-200
          rounded-xl
          text-center
          bg-transparent
          hover:bg-gray-50
          transition
          cursor-pointer
          flex flex-col items-center justify-center
          gap-1
          ${full ? "p-6 sm:p-10 min-h-[180px]" : "p-4 sm:p-5 min-h-[150px]"}
        `}
      >
        <Upload className="text-slate-500 mb-1" size={24} strokeWidth={1.5} />

        <p className="text-[15px] sm:text-[16px] font-medium text-[#2563EB] m-0 leading-tight">
          Click to upload<span className="text-slate-500 font-normal"> or Drag or drop file</span>
        </p>

        <p className="text-[12px] sm:text-[13px] text-slate-500 m-0 text-center w-full leading-snug">
          PDF, JPG, JPEG, PNG less than 10MB.
        </p>
        
        <p className="text-[12px] sm:text-[13px] text-slate-500 m-0 text-center w-full max-w-[280px] leading-snug">
          Ensure your document are in good condition<br className="hidden sm:block" />
          and readable
        </p>
      </div>
    </div>
  );
}
