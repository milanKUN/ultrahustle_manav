import React from "react";

export default function DeleteAccount() {
  return (
    <div
      className="
        w-full
        -mt-16 sm:-mt-32
        from-gray-100 via-white to-lime-50
        rounded-xl
        p-4 sm:p-6 md:p-8
        min-h-[300px]
        overflow-x-hidden
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold whitespace-nowrap">
          Delete Account
        </h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>

      {/* WARNING TITLE */}
      <p className="text-[16px] sm:text-[20px] font-semibold text-[#FF0000] mb-3">
        Delete Account Permanently
      </p>

      {/* WARNING BOX */}
   <div className="w-full border border-black dark:border-[#2a2f3a] rounded-md p-3 text-sm sm:text-[16px] text-black dark:text-white mb-8 sm:mb-10">
  <p>
    This will delete your profile, listings, messages, teams, and all
    associated data.
  </p>
</div>

      {/* DANGER BUTTON */}
      <div className="flex justify-end">
        <button className="w-full sm:w-[183px] px-6 py-2 border border-black bg-[#FF0000] text-white rounded-lg text-sm font-medium hover:bg-red-700">
          Delete My Account
        </button>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
          Discard
        </button>
        <button className="w-full sm:w-auto px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
          Save Changes
        </button>
      </div>
    </div>
  );
}
