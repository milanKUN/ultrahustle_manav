import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "./ResolutionCenter.css";

const REQUEST_OPTIONS = [
  {
    id: "extension",
    title: "Request extension",
    heading: "Extension request",
    cta: "Request extension",
    confirmation: {
      title: "Confirm action",
      description:
        "This will move the case forward with a timer and guaranteed outcome.",
    },
  },
  {
    id: "cancellation",
    title: "Request cancellation",
    heading: "Cancellation request",
    cta: "Request cancellation",
    confirmation: {
      title: "Confirm action",
      description:
        "This will move the case forward with a timer and guaranteed outcome.",
      highlight: "If you click confirm",
      note: "Cancellation enters Resolution Active (72h)",
    },
  },
];

const DAY_OPTIONS = ["1 day", "2 days", "3 days", "5 days", "7 days", "10 days", "14 days"];
const CANCELLATION_REASONS = [
  "The client is not responding or providing required inputs",
  "Requirements have changed beyond the original scope",
  "Repeated revisions outside the agreed terms",
  "Client has not approved milestones or next steps",
  "External dependency or blocker reported earlier",
  "Project expectations are no longer feasible within scope",
  "Communication issues are preventing progress",
  "Timeline constraints due to unforeseen circumstances",
];

export default function ResolutionCenter({ theme, setTheme }) {
  const location = useLocation();
  const requestMode = location.state?.requestMode;
  const availableOptions = useMemo(() => {
    if (requestMode === "cancellationOnly") {
      return REQUEST_OPTIONS.filter((item) => item.id === "cancellation");
    }

    return REQUEST_OPTIONS;
  }, [requestMode]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(
    requestMode === "cancellationOnly" ? "cancellation" : "extension",
  );
  const [extensionDays, setExtensionDays] = useState("");
  const [extensionReason, setExtensionReason] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedCancellationReason, setSelectedCancellationReason] = useState(
    CANCELLATION_REASONS[0],
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
    setShowSettings(false);
  }, []);

  const activeRequest = useMemo(
    () =>
      availableOptions.find((item) => item.id === selectedRequest) ?? availableOptions[0],
    [availableOptions, selectedRequest],
  );

  const isExtension = activeRequest.id === "extension";
  const isFormValid = isExtension
    ? Boolean(extensionDays && extensionReason.trim())
    : Boolean(cancellationReason.trim());

  const handleOpenForm = () => {
    if (selectedRequest === "cancellation") {
      setStep(3);
      return;
    }

    setStep(2);
  };

  const handlePrimaryAction = () => {
    if (!isFormValid) return;
    setShowConfirmModal(true);
  };

  const handleCancellationContinue = () => {
    setShowConfirmModal(true);
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedRequest(requestMode === "cancellationOnly" ? "cancellation" : "extension");
    setExtensionDays("");
    setExtensionReason("");
    setCancellationReason("");
    setSelectedCancellationReason(CANCELLATION_REASONS[0]);
    setShowConfirmModal(false);
  };

  useEffect(() => {
    if (!availableOptions.some((item) => item.id === selectedRequest)) {
      setSelectedRequest(availableOptions[0]?.id ?? "cancellation");
    }
  }, [availableOptions, selectedRequest]);

  return (
    <div className={`resolution-center-page user-page ${theme || "light"}`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        theme={theme}
        onDropdownChange={setIsDropdownOpen}
      />

      <div className="resolution-center-layout">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={setActiveSetting}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="resolution-center-contentWrap">
          <div className="resolution-center-scroll">
            <main className={`resolution-center-main ${isDropdownOpen ? "blurred" : ""}`}>
              <section className="resolution-center-shell">
                <header className="resolution-center-head">
                  <h1 className="resolution-center-title">UltraHustle Resolution Center</h1>
                  <p className="resolution-center-subtitle">
                    Predictable outcomes. Timer-driven. No hidden actions.
                  </p>
                </header>

                {step === 1 ? (
                  <section className="resolution-center-stepOne">
                    <div className="resolution-center-optionGrid">
                      {availableOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedRequest(option.id)}
                          className={`resolution-center-optionCard ${
                            selectedRequest === option.id ? "active" : ""
                          }`}
                        >
                          <span>{option.title}</span>
                        </button>
                      ))}
                    </div>

                    <div className="resolution-center-actions">
                      <button
                        type="button"
                        onClick={handleOpenForm}
                        className="resolution-center-btn resolution-center-btn-primary"
                      >
                        Confirm
                      </button>
                    </div>
                  </section>
                ) : step === 2 ? (
                  <section className="resolution-center-card">
                    <div className="resolution-center-formHead">
                      <h2>{activeRequest.heading}</h2>
                    </div>

                    <div className="resolution-center-formPanel">
                      {isExtension ? (
                        <>
                          <div className="resolution-center-field">
                            <label htmlFor="resolution-extension-days">Days</label>
                            <select
                              id="resolution-extension-days"
                              value={extensionDays}
                              onChange={(event) => setExtensionDays(event.target.value)}
                              className="resolution-center-input"
                            >
                              <option value="">Days</option>
                              {DAY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="resolution-center-field">
                            <label htmlFor="resolution-extension-reason">
                              Why is extension needed?
                            </label>
                            <textarea
                              id="resolution-extension-reason"
                              value={extensionReason}
                              onChange={(event) => setExtensionReason(event.target.value)}
                              placeholder="Be specific"
                              rows={5}
                              className="resolution-center-input resolution-center-textarea"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="resolution-center-field">
                          <label htmlFor="resolution-cancellation-reason">
                            Why are you requesting cancellation?
                          </label>
                          <textarea
                            id="resolution-cancellation-reason"
                            value={cancellationReason}
                            onChange={(event) => setCancellationReason(event.target.value)}
                            placeholder="Explain the issue, missed scope, or blocker"
                            rows={6}
                            className="resolution-center-input resolution-center-textarea"
                          />
                        </div>
                      )}
                    </div>

                    <div className="resolution-center-submitRow">
                      <button
                        type="button"
                        onClick={handlePrimaryAction}
                        disabled={!isFormValid}
                        className="resolution-center-btn resolution-center-btn-primary resolution-center-submitBtn"
                      >
                        {activeRequest.cta}
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className="resolution-center-card resolution-center-cancelCard">
                    <div className="resolution-center-formHead">
                      <h2>Cancellation Reason</h2>
                    </div>

                    <div className="resolution-center-cancelPanel">
                      <div className="resolution-center-cancelHeader">Reasons</div>

                      <div className="resolution-center-reasonList" role="listbox" aria-label="Cancellation reasons">
                        {CANCELLATION_REASONS.map((reason) => (
                          <button
                            key={reason}
                            type="button"
                            className={`resolution-center-reasonItem ${
                              selectedCancellationReason === reason ? "active" : ""
                            }`}
                            onClick={() => setSelectedCancellationReason(reason)}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="resolution-center-field resolution-center-cancelOther">
                      <label htmlFor="resolution-cancellation-other">Other</label>
                      <textarea
                        id="resolution-cancellation-other"
                        value={cancellationReason}
                        onChange={(event) => setCancellationReason(event.target.value)}
                        placeholder="Optional input field"
                        rows={4}
                        className="resolution-center-input resolution-center-textarea"
                      />
                    </div>

                    <div className="resolution-center-submitRow">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="resolution-center-btn resolution-center-btn-secondary resolution-center-cancelAction"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCancellationContinue}
                        className="resolution-center-btn resolution-center-btn-primary resolution-center-cancelAction"
                      >
                        Confirm
                      </button>
                    </div>
                  </section>
                )}
              </section>
            </main>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="resolution-center-modalOverlay">
          <div
            className="resolution-center-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resolution-confirm-title"
          >
            <h3 id="resolution-confirm-title">{activeRequest.confirmation.title}</h3>
            <p className="resolution-center-modalText">
              {activeRequest.confirmation.description}
            </p>

            {activeRequest.confirmation.highlight && (
              <div className="resolution-center-modalNote">
                <p className="resolution-center-modalWarning">
                  {activeRequest.confirmation.highlight}
                </p>
                <p>{activeRequest.confirmation.note}</p>
              </div>
            )}

            <div className="resolution-center-modalActions">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="resolution-center-btn resolution-center-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={resetFlow}
                className="resolution-center-btn resolution-center-btn-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
