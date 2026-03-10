import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMe } from "../../api/meApi";
import {
  clearAuthToken,
  clearCurrentUserEmail,
  clearPendingVerificationEmail,
} from "../../../auth/api/authApi";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (confirmOpen) setTimeout(() => confirmBtnRef.current?.focus?.(), 0);
  }, [confirmOpen]);

  const dangerMessage = useMemo(() => {
    return "This will soft-delete your account and personal info. You will be logged out immediately.";
  }, []);

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await deleteMe();
      clearAuthToken();
      clearCurrentUserEmail();
      clearPendingVerificationEmail();
      navigate("/login", { replace: true });
    } catch (e) {
      setError(e?.message || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

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

      {error && (
        <div className="w-full border border-black rounded-md p-3 text-sm text-black bg-white mb-6" role="alert">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* DANGER BUTTON */}
      <div className="flex justify-end">
        <button
          className="w-full sm:w-[183px] px-6 py-2 border border-black bg-[#FF0000] text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
          onClick={() => {
            setError("");
            setConfirmOpen(true);
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete My Account"}
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/25 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-black bg-white text-black shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold">Confirm delete</p>
                  <p className="text-sm text-black/70 mt-1">{dangerMessage}</p>
                </div>
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl border border-black/20 grid place-items-center hover:bg-black/5"
                  onClick={() => setConfirmOpen(false)}
                  aria-label="Close"
                  title="Close"
                  disabled={isDeleting}
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm border border-black"
                  onClick={() => setConfirmOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  ref={confirmBtnRef}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-black bg-[#FF0000] text-white hover:bg-red-700 disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
