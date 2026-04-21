import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { acceptTeamInvite, declineTeamInvite } from "../api/teamApi";
import { getAuthToken } from "../../auth/api/authApi";

const TeamInvitePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useMemo(() => {
    return String(searchParams.get("token") || "").trim();
  }, [searchParams]);

  const [loadingAction, setLoadingAction] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authToken = getAuthToken();
  const isLoggedIn = !!authToken;

  const redirectToLogin = () => {
    const redirectUrl = `${location.pathname}${location.search}`;
    navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleAccept = async () => {
    if (!token) {
      setError("Invalid invite token.");
      return;
    }

    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    try {
      setLoadingAction("accept");
      setError("");
      setMessage("");

      const res = await acceptTeamInvite(token);
      setMessage(res?.message || "Invite accepted successfully.");

      setTimeout(() => {
        navigate("/manage-team");
      }, 1200);
    } catch (e) {
      const msg = e?.message || "Failed to accept invite.";

      if (/unauthenticated|unauthorized/i.test(msg)) {
        redirectToLogin();
        return;
      }

      setError(msg);
    } finally {
      setLoadingAction("");
    }
  };

  const handleDecline = async () => {
    if (!token) {
      setError("Invalid invite token.");
      return;
    }

    try {
      setLoadingAction("decline");
      setError("");
      setMessage("");

      const res = await declineTeamInvite(token);
      setMessage(res?.message || "Invite declined.");
    } catch (e) {
      setError(e?.message || "Failed to decline invite.");
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-6">
        <h1 className="text-2xl font-bold mb-3">Team Invitation</h1>
        <p className="text-sm text-gray-600 mb-5">
          You have been invited to join a team.
        </p>

        {message && <div className="text-sm text-green-600 mb-4">{message}</div>}
        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {!isLoggedIn && (
          <div className="text-sm text-amber-600 mb-4">
            Please log in with the invited account before accepting.
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAccept}
            disabled={!token || loadingAction !== ""}
            className="flex-1 bg-[#B7E45D] border border-black rounded-xl px-4 py-2 font-medium"
          >
            {loadingAction === "accept" ? "Accepting..." : "Accept"}
          </button>

          <button
            type="button"
            onClick={handleDecline}
            disabled={!token || loadingAction !== ""}
            className="flex-1 bg-white border border-black rounded-xl px-4 py-2 font-medium"
          >
            {loadingAction === "decline" ? "Declining..." : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamInvitePage;
