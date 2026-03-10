import React from "react";

export default function ConnectedApps() {
  return (
    <div
      className="
        w-full
        -mt-12 sm:-mt-28
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
          Connected Apps
        </h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>

      {/* TITLE */}
      <p className="text-[16px] sm:text-[20px] font-semibold text-black dark:text-white mb-6">
        Social Login Connections
      </p>

      {/* ROWS */}
      <div className="space-y-5 w-full">
        {/* GOOGLE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <p className="text-[14px] sm:text-[20px] text-black dark:text-white">
            Continue with Google
          </p>

          <div className="sm:ml-auto">
            <button className="w-full sm:w-auto px-6 py-2 bg-[#CEFF1B] border border-black rounded-md text-sm font-medium">
              Connect
            </button>
          </div>
        </div>

        {/* FACEBOOK */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <p className="text-[14px] sm:text-[20px] text-black dark:text-white">
            Continue with Facebook
          </p>

          <div className="sm:ml-auto">
            <button className="w-full sm:w-auto px-6 py-2 bg-[#CEFF1B] border border-black rounded-md text-sm font-medium">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
