import { useState, useEffect, useRef  } from "react";
import {
  getUserNotification,
  putUserNotification,
} from "../../api/userNotification";

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`w-[55px] h-[24px] rounded-full relative transition duration-200 flex items-center bg-[#5C5C5CA8]`}
    style={{ minWidth: 48, minHeight: 28 }}
  >
    <span
      className={`absolute left-1 w-6 h-6 rounded-full shadow-md transition-transform duration-200 ${enabled
          ? "translate-x-full bg-[#CEFF1B]"
          : "translate-x-0 bg-[#5B5B5B]"
        }`}
      style={{ minWidth: 24, minHeight: 24 }}
    />
  </button>
);


export default function Notification() {
  const [state, setState] = useState({
    messages: true,
    order: false,
    reviews: true,
    payment: false,
    boost: true,
    listing: false,
    system: true,

    project: false,
    comments: true,
    forum: false,
    team: true,

    marketing: true,
    product: false,
  });

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [popup, setPopup] = useState({
    open: false,
    variant: "success", // success | error
    title: "",
    message: "",
    showProgress: false,
  });
  const [popupAnimateIn, setPopupAnimateIn] = useState(false);
  const [popupProgress, setPopupProgress] = useState(0);
  const popupOkRef = useRef(null);
  const popupAutoCloseRef = useRef(null);
  const popupHideRef = useRef(null);

  const closePopup = () => {
    if (popupAutoCloseRef.current) {
      clearTimeout(popupAutoCloseRef.current);
      popupAutoCloseRef.current = null;
    }
    if (popupHideRef.current) {
      clearTimeout(popupHideRef.current);
      popupHideRef.current = null;
    }

    setPopupAnimateIn(false);
    popupHideRef.current = setTimeout(() => {
      setPopup((p) => ({ ...p, open: false }));
      setPopupProgress(0);
      popupHideRef.current = null;
    }, 200);
  };

  const openPopup = ({ variant, title, message, showProgress, autoCloseMs }) => {
    const msg = String(message || "").trim();
    if (!msg) return;

    if (popupAutoCloseRef.current) {
      clearTimeout(popupAutoCloseRef.current);
      popupAutoCloseRef.current = null;
    }
    if (popupHideRef.current) {
      clearTimeout(popupHideRef.current);
      popupHideRef.current = null;
    }

    setPopupProgress(0);
    setPopupAnimateIn(false);
    setPopup({
      open: true,
      variant,
      title,
      message: msg,
      showProgress: !!showProgress,
    });

    requestAnimationFrame(() => {
      setPopupAnimateIn(true);
      if (showProgress) {
        requestAnimationFrame(() => setPopupProgress(100));
      }
      setTimeout(() => popupOkRef.current?.focus?.(), 0);
    });

    if (autoCloseMs) {
      popupAutoCloseRef.current = setTimeout(() => {
        closePopup();
      }, autoCloseMs);
    }
  };

  // Required helper: showSuccessPopup(message)
  const showSuccessPopup = (message) => {
    openPopup({
      variant: "success",
      title: "Save Changes",
      message: message || "Your personal information has been successfully saved.",
      showProgress: true,
      autoCloseMs: 3000,
    });
  };

  const showErrorPopup = (message) => {
    openPopup({
      variant: "error",
      title: "Save Changes",
      message: message || "Please fix the errors and try again.",
      showProgress: false,
      autoCloseMs: null,
    });
  };

  useEffect(() => {
    return () => {
      if (popupAutoCloseRef.current) clearTimeout(popupAutoCloseRef.current);
      if (popupHideRef.current) clearTimeout(popupHideRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserNotification();
        setState(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await putUserNotification(state);
      setSubmitSuccess("Saved successfully.");
      showSuccessPopup("Your Notification are updated successfully.");
      console.log("Saved successfully");
    } catch (err) {
      const msg = err?.message || "Save failed.";
      console.error(err.message);
      setSubmitError(msg);
      showErrorPopup(msg);
    }
  };


  const toggle = (key) =>
    setState({ ...state, [key]: !state[key] });

  return (
    <div className="from-gray-100 to-lime-50 rounded-xl -mt-32 md:-mt-32 p-4 sm:p-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold whitespace-nowrap">
          Notification
        </h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>

      {/* ================= EMAIL ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="block mb-1 font-medium">
            Email Notifications
          </p>
          <p className="text-[14px] sm:text-[20px] text-gray-500 mt-1">
            Get emails to find out what's going on when you're not online.
            You can turn these off
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["Messages", "messages"],
            ["Order updates", "order"],
            ["New reviews", "reviews"],
            ["Payment updates", "payment"],
            ["Boost promotions", "boost"],
            ["Listing tips & growth insights", "listing"],
            ["System alerts", "system"],
          ].map(([label, key]) => (
            <div
              key={key}
              className="flex justify-between items-center gap-4"
            >
              <span className="text-[16px] font-medium">
                {label}
              </span>
              <Toggle
                enabled={state[key]}
                onChange={() => toggle(key)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-300 mb-8" />

      {/* ================= PUSH ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="block mb-1 font-medium">
            Push Notifications
          </p>
          <p className="text-[14px] sm:text-[20px] text-gray-500 mt-1">
            Get push notifications in-app to find out what's going on when
            you're online.
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["Project updates", "project"],
            ["Comments / Replies", "comments"],
            ["Forum interactions", "forum"],
            ["Team invites", "team"],
          ].map(([label, key]) => (
            <div
              key={key}
              className="flex justify-between items-center gap-4"
            >
              <span className="text-[16px] font-medium">
                {label}
              </span>
              <Toggle
                enabled={state[key]}
                onChange={() => toggle(key)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-300 mb-8" />

      {/* ================= MARKETING ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="block mb-1 font-medium">
            Marketing Emails
          </p>
          <p className="text-[14px] sm:text-[20px] text-gray-500 mt-1">
            Get push notifications in-app to find out what's going on when
            you're online.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <span className="text-[16px] font-medium">
              Allow marketing
            </span>
            <Toggle
              enabled={state.marketing}
              onChange={() => toggle("marketing")}
            />
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-[16px] font-medium">
              Allow product updates
            </span>
            <Toggle
              enabled={state.product}
              onChange={() => toggle("product")}
            />
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
          Discard
        </button>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black"
        >
          Confirm
        </button>
      </div>

      <Toast
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        showProgress={popup.showProgress}
        progress={popupProgress}
        animateIn={popupAnimateIn}
        okRef={popupOkRef}
        onClose={closePopup}
      />
    </div>
  );
}

function Toast({ open, variant, title, message, showProgress, progress, animateIn, okRef, onClose }) {
  if (!open) return null;

  const isSuccess = variant === "success";
  const YELLOW = "#CEFF1B";

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose?.();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/25 backdrop-blur-sm transition-opacity duration-200 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`w-full max-w-md transform transition-all duration-200 ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="relative overflow-hidden rounded-2xl bg-white text-black border border-black/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          {/* Top animated progress bar */}
          {showProgress && (
            <div className="h-[3px] w-full bg-black/10">
              <div
                className="h-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: YELLOW,
                  transition: "width 3000ms linear",
                }}
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-semibold leading-6">{title}</p>

              <button
                type="button"
                className="h-9 w-9 rounded-xl border border-black/20 grid place-items-center hover:bg-black/5"
                onClick={onClose}
                aria-label="Close"
                title="Close"
              >
                <span className="text-base leading-none">✕</span>
              </button>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center border border-black"
                style={{ backgroundColor: YELLOW }}
                aria-hidden="true"
              >
                {isSuccess ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm leading-6 text-black/80">{message}</p>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    ref={okRef}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-black"
                    style={{ backgroundColor: YELLOW, color: "#000" }}
                    onClick={onClose}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
