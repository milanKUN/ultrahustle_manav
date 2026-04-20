import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateMyPassword } from "../../api/passwordApi";
import {
  getMyActivities,
  logoutCurrentDevice,
  logoutOtherDevice,
} from "../../api/personalInfoApi";

export default function Security() {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activityDates, setActivityDates] = useState([]);
  const [loggingOutId, setLoggingOutId] = useState(null);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    try {
      setIsSaving(true);

      await updateMyPassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully.");
    } catch (e) {
      setError(e?.message || "Request failed");
    } finally {
      setIsSaving(false);
    }
  };

  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);

      const res = await getMyActivities();
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      setActivityDates(data);
    } catch (e) {
      console.error("Failed to load activities", e);
      setActivityDates([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleLogoutDevice = async (activity) => {
    try {
      setError("");
      setSuccess("");
      setLoggingOutId(activity.id);

      if (activity.is_current) {
        await logoutCurrentDevice();

        // clear token/local auth
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      await logoutOtherDevice(activity.id);
      setSuccess("Device logged out successfully.");

      await loadActivities();
    } catch (e) {
      setError(e?.message || "Failed to logout device.");
    } finally {
      setLoggingOutId(null);
    }
  };

  return (
    <div className="">
      {/* ================= Security ================= */}
      <div className="mb-8 -mt-16">
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
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 focus:outline-none bg-transparent hover:bg-transparent !bg-transparent dynamic-yellow-icon"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 focus:outline-none bg-transparent hover:bg-transparent !bg-transparent dynamic-yellow-icon"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none focus:outline-none focus:!border-transparent focus:ring-0 focus:shadow-[0_0_15px_#CEFF1B]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 focus:outline-none bg-transparent hover:bg-transparent !bg-transparent dynamic-yellow-icon"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isSaving}
              className="ml-auto border border-black bg-[#CEFF1B] text-[#2B2B2B] text-sm px-6 py-2 rounded-md font-semibold disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Confirm Password"}
            </button>
          </div>
        </div>

        {(error || success) && (
          <div className="mt-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-700">{success}</p>}
          </div>
        )}
      </div>

      {/* ================= Active Devices ================= */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold whitespace-nowrap">
            Active Devices
          </h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>
        <p className="mb-4 text-[16px]">Currently login</p>

        {activitiesLoading ? (
          <p className="text-sm text-gray-500">Loading devices...</p>
        ) : activityDates.length === 0 ? (
          <p className="text-sm text-gray-500">No login activity found.</p>
        ) : (
          activityDates.slice(0, 3).map((activity) => (
            <div
              key={activity.id}
              className="flex bg-transparent border border-black items-center justify-between rounded-md p-4 mb-3"
            >
              <div>
                <p className="text-[16px] font-medium">
                  {activity.platform || "Unknown OS"}
                  {activity.browser ? ` • ${activity.browser}` : ""}
                  {activity.device ? ` • ${activity.device}` : ""}
                </p>

                <p className="text-[16px] text-gray-500">
                  • IP: {activity.location || activity.ip_address || "Unknown location"}
                </p>

                {activity.is_current ? (
                  <p className="text-[16px] text-black flex items-center gap-1 dark:text-white">
                    <span className="text-[#0FB400]">&nbsp;●</span>
                    Your Current Session • Active at{" "}
                    {activity?.last_active_at
                      ? new Date(activity.last_active_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </p>
                ) : (
                  <p className="text-[16px] text-gray-400">
                    • Last active at{" "}
                    {activity?.last_active_at
                      ? new Date(activity.last_active_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Recently active"}
                  </p>
                )}
              </div>
              {Number(activity.is_current) === 1 ? (
                <button
                  onClick={() => handleLogoutDevice(activity)}
                  disabled={loggingOutId === activity.id}
                  className="border border-black text-white text-xs px-4 py-1.5 rounded-lg font-medium bg-[#FF0000] disabled:opacity-60"
                >
                  {loggingOutId === activity.id ? "Logging out..." : "Log out"}
                </button>
              ) : (
                <span className="text-xs text-gray-500 font-medium">Logged out</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
