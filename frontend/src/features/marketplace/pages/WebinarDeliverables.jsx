import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Globe,
  Download,
  ExternalLink,
  FileText,
  Star,
  ChevronUp,
  ChevronDown,
  MonitorPlay,
} from "lucide-react";
import { useParams } from "react-router-dom";
import "./WebinarDeliverables.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import DetailedTeamCard from "../components/DetailedTeamCard";
import OrderDetailsSection from "../components/OrderDetailsSection";
import NotesModal from "../components/NotesModal";
import { getListingByUsername } from "../api/listingApi";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  if (/^\d{2}:\d{2}/.test(value)) {
    const [hours, minutes] = value.split(":");
    const h = Number(hours);
    const m = Number(minutes);

    if (!Number.isNaN(h) && !Number.isNaN(m)) {
      const date = new Date();
      date.setHours(h, m, 0, 0);

      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  return value;
};

const formatFileSize = (bytes) => {
  const size = Number(bytes);
  if (!size || Number.isNaN(size)) return "—";

  if (size >= 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${size} B`;
};

const getFileNameFromPath = (path = "") => {
  if (!path) return "Resource File";
  const parts = path.split("/");
  return parts[parts.length - 1] || "Resource File";
};

const getTagFromFile = (item) => {
  const mime = String(item?.file_mime || "").toLowerCase();
  const fileName = String(item?.file_name || "").toLowerCase();

  if (mime.includes("pdf") || fileName.endsWith(".pdf")) return "PDF";
  if (mime.includes("zip") || fileName.endsWith(".zip")) return "ZIP";
  if (mime.includes("image")) return "Image";
  if (mime.includes("video")) return "Video";
  if (mime.includes("json")) return "JSON";
  if (mime.includes("text")) return "Text";
  if (fileName.includes(".")) return fileName.split(".").pop().toUpperCase();

  return "File";
};

const WebinarDeliverables = ({ theme, setTheme }) => {
  const { username } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getListingByUsername(username);
        const item = res?.listing || null;

        if (!item) {
          setListing(null);
          setError("Listing not found.");
          return;
        }

        if (item.listing_type !== "webinar") {
          setListing(null);
          setError("This listing is not a webinar.");
          return;
        }

        setListing(item);

        if (Array.isArray(item.faqs) && item.faqs.length > 0) {
          setActiveFaq(item.faqs[0].id || 1);
        } else {
          setActiveFaq(null);
        }
      } catch (e) {
        setListing(null);
        setError(e?.message || "Failed to load webinar.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadListing();
    }
  }, [username]);

  const toggleFaq = (id) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  const agendaSessions = useMemo(() => {
    const agenda = Array.isArray(listing?.details?.agenda) ? listing.details.agenda : [];

    return agenda.map((item, index) => ({
      id: index + 1,
      title: item.topic || `Agenda item ${index + 1}`,
      description: item.description || "No description available.",
      duration: item.time || "—",
      watched: false,
    }));
  }, [listing]);

  const deliverables = useMemo(() => {
    const raw = Array.isArray(listing?.deliverables) ? listing.deliverables : [];

    return raw.map((item, index) => {
      const title =
        item.file_name ||
        getFileNameFromPath(item.file_path) ||
        `Resource ${index + 1}`;

      return {
        id: item.id || index + 1,
        title,
        updated: formatDate(item.updated_at || item.created_at || listing?.updated_at),
        size: formatFileSize(item.file_size),
        tags: [getTagFromFile(item), item.notes ? "Note" : "Final"],
        type: item.file_url ? "download" : "link",
        buttonText: item.file_url ? "Download" : "Open link",
        fileUrl: item.file_url || "",
        note: item.notes || "No note available for this resource.",
      };
    });
  }, [listing]);

  const faqData = useMemo(() => {
    const raw = Array.isArray(listing?.faqs) ? listing.faqs : [];

    return raw.map((faq, index) => ({
      id: faq.id || index + 1,
      question: faq.q || "Question",
      answer: faq.a || "Answer not available.",
    }));
  }, [listing]);

  const tools = Array.isArray(listing?.details?.tools) ? listing.details.tools : [];
  const learningPoints = Array.isArray(listing?.details?.learning_points)
    ? listing.details.learning_points
    : [];
  const languages = Array.isArray(listing?.details?.languages)
    ? listing.details.languages
    : [];

  const handleOpenFile = (fileUrl) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenWebinar = () => {
    const webinarLink = listing?.details?.webinar_link;
    if (!webinarLink) return;
    window.open(webinarLink, "_blank", "noopener,noreferrer");
  };

  const handleAddToCalendar = () => {
    const webinarLink = listing?.details?.webinar_link;
    if (webinarLink) {
      window.open(webinarLink, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className={`user-page webinar-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} theme={theme} />

        <div className="pt-[85px] flex relative z-10">
          <Sidebar
            expanded={sidebarOpen}
            setExpanded={setSidebarOpen}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            theme={theme}
            setTheme={setTheme}
          />

          <div className="relative flex-1 min-w-5 overflow-hidden">
            <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
              <div className="wd-container">
                <div className="wd-header-card">
                  <div className="wd-header-content">
                    <h1>Loading webinar...</h1>
                    <p>Please wait while webinar details are being loaded.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className={`user-page webinar-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} theme={theme} />

        <div className="pt-[85px] flex relative z-10">
          <Sidebar
            expanded={sidebarOpen}
            setExpanded={setSidebarOpen}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            theme={theme}
            setTheme={setTheme}
          />

          <div className="relative flex-1 min-w-5 overflow-hidden">
            <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
              <div className="wd-container">
                <div className="wd-header-card">
                  <div className="wd-header-content">
                    <h1>Unable to load webinar</h1>
                    <p>{error || "Webinar not found."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-page webinar-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
      />

      <div className="pt-[85px] flex relative z-10">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-5 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="wd-container">
              <div className="wd-header-card">
                <div className="wd-header-content">
                  <h1>{listing.title || "Webinar"}</h1>
                  <p>{listing.short_description || "Access your webinar resources and details."}</p>
                </div>

                <div className="wd-header-actions">
                  <button
                    className="wd-webinar-btn"
                    onClick={handleOpenWebinar}
                    disabled={!listing?.details?.webinar_link}
                  >
                    <MonitorPlay size={18} />
                    <span>Go to webinar</span>
                  </button>

                  <button
                    className="wd-calendar-btn"
                    onClick={handleAddToCalendar}
                    disabled={!listing?.details?.webinar_link}
                  >
                    <ExternalLink size={18} />
                    <span>Add to calendar</span>
                  </button>
                </div>
              </div>

              <div className="wd-schedule-grid">
                <div className="wd-schedule-card">
                  <div className="wd-icon-box">
                    <Calendar size={32} />
                  </div>
                  <div className="wd-schedule-info">
                    <span className="wd-label">Date</span>
                    <span className="wd-value">
                      {formatDate(listing?.details?.schedule_date)}
                    </span>
                  </div>
                </div>

                <div className="wd-schedule-card">
                  <div className="wd-icon-box">
                    <Clock size={32} />
                  </div>
                  <div className="wd-schedule-info">
                    <span className="wd-label">Start</span>
                    <span className="wd-value">
                      {formatTime(listing?.details?.schedule_start_time)}
                    </span>
                  </div>
                </div>

                <div className="wd-schedule-card">
                  <div className="wd-icon-box">
                    <Globe size={32} />
                  </div>
                  <div className="wd-schedule-info">
                    <span className="wd-label">Time zone</span>
                    <span className="wd-value">
                      {listing?.details?.schedule_timezone || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="wd-info-section">
                <div className="wd-info-block">
                  <h2 className="wd-info-title">Description</h2>
                  <p className="wd-info-text">
                    {listing.about || listing.short_description || "No description available."}
                  </p>
                </div>

                <div className="wd-info-block">
                  <h2 className="wd-info-title">Tools needed</h2>
                  <div className="wd-tools-list">
                    {tools.length > 0 ? (
                      tools.map((tool) => (
                        <span key={tool} className="wd-tool-tag">
                          {tool}
                        </span>
                      ))
                    ) : (
                      <p className="wd-info-text">No tools listed.</p>
                    )}
                  </div>
                </div>

                <div className="wd-info-block">
                  <h2 className="wd-info-title">Key outcomes</h2>
                  <p className="wd-info-text">
                    {learningPoints.length > 0
                      ? learningPoints.join(", ")
                      : "No key outcomes added yet."}
                  </p>
                </div>

                <div className="wd-info-block">
                  <h2 className="wd-info-title">What you will learn</h2>
                  {learningPoints.length > 0 ? (
                    <div className="wd-info-grid-2">
                      <ul className="wd-learn-list">
                        {learningPoints
                          .slice(0, Math.ceil(learningPoints.length / 2))
                          .map((point, index) => (
                            <li key={`left-${index}`}>{point}</li>
                          ))}
                      </ul>
                      <ul className="wd-learn-list">
                        {learningPoints
                          .slice(Math.ceil(learningPoints.length / 2))
                          .map((point, index) => (
                            <li key={`right-${index}`}>{point}</li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="wd-info-text">No learning points added yet.</p>
                  )}
                </div>

                <div className="wd-info-block">
                  <h2 className="wd-info-title">Languages</h2>
                  <p className="wd-languages-text">
                    {languages.length > 0 ? languages.join(" ") : "No languages listed."}
                  </p>
                </div>
              </div>

              <div className="wd-sessions-section">
                <h2 className="wd-section-title">Delivered session</h2>
                <div className="wd-sessions-container">
                  {agendaSessions.length > 0 ? (
                    agendaSessions.map((session) => (
                      <div key={session.id} className="wd-session-card">
                        <div className="wd-session-content">
                          <div className="wd-session-header">
                            <div className="wd-session-badges">
                              <span className="wd-badge duration">{session.duration}</span>
                              <span className="wd-badge status segment">Segment</span>
                            </div>
                          </div>

                          <h3 className="wd-session-title">{session.title}</h3>
                          <p className="wd-session-desc">{session.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="wd-session-card">
                      <div className="wd-session-content">
                        <h3 className="wd-session-title">No session agenda added yet</h3>
                        <p className="wd-session-desc">
                          Agenda items will appear here once they are added.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="wd-resources-section">
                <h2 className="wd-section-title">Resources</h2>

                <div className="wd-files-list-container">
                  <div className="wd-files-list">
                    {deliverables.length > 0 ? (
                      deliverables.map((item) => (
                        <div key={item.id} className="wd-file-item">
                          <div className="wd-file-info">
                            <h3>{item.title}</h3>
                            <div className="wd-file-meta">
                              <span>Updated {item.updated}</span>
                              <span className="wd-meta-dot">•</span>
                              <span>{item.size}</span>
                            </div>

                            <div className="wd-file-tags">
                              {item.tags.map((tag) => (
                                <span key={tag} className={`wd-tag ${tag.toLowerCase()}`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="wd-file-actions">
                            <button
                              className="wd-action-btn primary"
                              onClick={() => handleOpenFile(item.fileUrl)}
                              disabled={!item.fileUrl}
                            >
                              {item.type === "download" ? <Download size={18} /> : <ExternalLink size={18} />}
                              {item.buttonText}
                            </button>

                            <button
                              className="wd-action-btn secondary"
                              onClick={() =>
                                setSelectedNote({
                                  title: item.title,
                                  content: item.note,
                                })
                              }
                            >
                              <FileText size={18} />
                              View note
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="wd-file-item">
                        <div className="wd-file-info">
                          <h3>No resources uploaded yet</h3>
                          <div className="wd-file-meta">
                            <span>Files will appear here when added.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "40px" }}>
                <DetailedTeamCard />
              </div>

              <div className="wd-faq-section">
                <div className="wd-header-row">
                  <h2>Frequently Asked Questions</h2>
                  <div className="wd-header-line"></div>
                </div>

                <div className="wd-faq-list">
                  {faqData.length > 0 ? (
                    faqData.map((faq) => (
                      <div
                        key={faq.id}
                        className={`wd-faq-item ${activeFaq === faq.id ? "active" : ""}`}
                      >
                        <div
                          className="wd-faq-question"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <span>{faq.question}</span>
                          {activeFaq === faq.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </div>

                        {activeFaq === faq.id && (
                          <div className="wd-faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="wd-faq-item active">
                      <div className="wd-faq-question">
                        <span>No FAQs added yet</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="wd-review-section">
                <div className="wd-header-row">
                  <h2>Review</h2>
                  <div className="wd-header-line"></div>
                </div>

                <div className="wd-review-card">
                  <div className="wd-review-content">
                    <p className="wd-review-text">
                      {listing.about || "No review content available yet."}
                    </p>
                    <div className="wd-review-footer">
                      <div className="wd-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={20}
                            fill={theme === "dark" ? "#CEFF1B" : "#FFE100"}
                            stroke={theme === "dark" ? "#CEFF1B" : "#FFE100"}
                          />
                        ))}
                      </div>
                      <button className="wd-post-btn">Post</button>
                    </div>
                  </div>
                </div>
              </div>

              <OrderDetailsSection prefix="wd" />
            </div>
          </div>
        </div>
      </div>

      <NotesModal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title={selectedNote?.title}
        content={selectedNote?.content}
        theme={theme}
      />
    </div>
  );
};

export default WebinarDeliverables;