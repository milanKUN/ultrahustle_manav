import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Security() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="">
      {/* ================= Security ================= */}
      <div className="mb-8 -mt-14 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold whitespace-nowrap">
            Security
          </h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Password */}
          <div>
            <label className="block mb-1 font-medium">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium">New password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">
              Confirm New password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button className="ml-auto border border-black bg-[#CEFF1B] text-[#2B2B2B] text-sm px-6 py-2 rounded-md font-semibold">
              Confirm Password
            </button>
          </div>
        </div>
      </div>

      {/* ================= Active Devices ================= */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold whitespace-nowrap">
            Active Devices
          </h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>
        <p className="mb-4 text-[16px] ">Currently login</p>

        {/* Current Session */}
        <div className="flex bg-transparent border border-black items-center justify-between rounded-md p-4 mb-3">
          <div>
            <p className="text-[16px] font-medium">Windows</p>
            <p className="text-[16px] text-gray-500">Chennai, Tamil Nadu, India</p>
            <p className="text-[16px] text-black flex items-center gap-1 dark:text-white">
              <span className="text-[#0FB400]">●</span>
              Your Current Session
            </p>
          </div>
          <button className="bg-[#FF0000] border border-black text-white text-xs px-4 py-1.5 rounded-lg font-medium">
            Log out
          </button>
        </div>

        {/* Other Device */}
        <div className="flex bg-transparent border border-black items-center justify-between rounded-md p-4">
          <div>
            <p className="text-[16px] font-medium">1 session on iPhone16</p>
            <p className="text-[16px] text-gray-500">Chennai, Tamil Nadu, India</p>
            <p className="text-[16px] text-gray-400">30 minutes ago</p>
          </div>
          <button className="bg-[#FF0000] border border-black text-white text-xs px-4 py-1.5 rounded-lg font-medium">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
