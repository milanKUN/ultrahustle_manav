import React, { useState, useEffect, useMemo } from "react";
import {
    Calendar,
    Clock,
    Globe,
    Download,
    ExternalLink,
    FileText,
    ChevronUp,
    ChevronDown,
    Star,
    MonitorPlay,
} from "lucide-react";
import { useParams } from "react-router-dom";
import "./WebinarDeliverables.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import DetailedTeamCard from "../components/DetailedTeamCard";
import OrderDetailsSection from "../components/OrderDetailsSection";
import NotesModal from "../components/NotesModal";
import {
    getOrderWebinar,
    toggleOrderWebinarAgenda,
} from "../api/orderApi";

const WebinarDeliverables = ({ theme, setTheme }) => {
    const { order_id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [activeFaq, setActiveFaq] = useState(null);

    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [payload, setPayload] = useState(null);
    const [togglingAgendaIds, setTogglingAgendaIds] = useState({});

    const handleAddToCalendar = () => {
        if (!order.webinar_date || !order.start_time) return;

        const start = new Date(`${order.webinar_date}T${order.start_time}`);
        const durationMinutes = Number(order.duration_minutes || 60);
        const end = new Date(start.getTime() + durationMinutes * 60000);

        const formatGoogleDate = (date) => {
            const yyyy = date.getUTCFullYear();
            const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
            const dd = String(date.getUTCDate()).padStart(2, "0");
            const hh = String(date.getUTCHours()).padStart(2, "0");
            const mi = String(date.getUTCMinutes()).padStart(2, "0");
            const ss = String(date.getUTCSeconds()).padStart(2, "0");
            return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
        };

        const title = listing.title || "Webinar";
        const details = [
            listing.short_description || "",
            listing.webinar_link ? `Join link: ${listing.webinar_link}` : "",
        ]
            .filter(Boolean)
            .join("\n\n");

        const location = listing.webinar_link || "";
        const dates = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;

        const googleUrl =
            `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(title)}` +
            `&dates=${encodeURIComponent(dates)}` +
            `&details=${encodeURIComponent(details)}` +
            `&location=${encodeURIComponent(location)}`;

        window.open(googleUrl, "_blank", "noopener,noreferrer");
    };
    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        const fetchPage = async () => {
            if (!order_id) {
                setPageError("Order ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setPageError("");
                const res = await getOrderWebinar(order_id);
                setPayload(res);
            } catch (err) {
                setPageError(err?.message || "Failed to load webinar order.");
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [order_id]);

    const order = payload?.order || {};
    const listing = payload?.listing || {};
    const creator = payload?.creator || {};
    const resources = Array.isArray(payload?.resources) ? payload.resources : [];
    const faqData = Array.isArray(payload?.faqs) ? payload.faqs : [];
    const sessions = Array.isArray(payload?.agenda) ? payload.agenda : [];
    const review = payload?.review || null;
    const orderDetailsBlocks = Array.isArray(payload?.order_details_blocks)
        ? payload.order_details_blocks
        : [];

    const eventDateTime = useMemo(() => {
        if (!order.webinar_date || !order.start_time) return null;

        const raw = `${order.webinar_date}T${order.start_time}`;
        const dt = new Date(raw);
        return Number.isNaN(dt.getTime()) ? null : dt;
    }, [order.webinar_date, order.start_time]);

    const isPastWebinar = useMemo(() => {
        if (!eventDateTime) return false;
        return eventDateTime.getTime() < Date.now();
    }, [eventDateTime]);

    const isUpcomingOrLive = !isPastWebinar;

    const formattedDate = useMemo(() => {
        if (!order.webinar_date) return "—";
        try {
            return new Date(order.webinar_date).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return order.webinar_date;
        }
    }, [order.webinar_date]);

    const formattedTime = useMemo(() => {
        if (!order.start_time) return "—";
        return `${order.start_time}${order.timezone ? ` (${order.timezone})` : ""}`;
    }, [order.start_time, order.timezone]);

    const timezoneDisplay = order.timezone_display || order.timezone || "—";

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    const handleAgendaToggle = async (itemId) => {
        try {
            setTogglingAgendaIds((prev) => ({ ...prev, [itemId]: true }));
            const res = await toggleOrderWebinarAgenda(order.id, itemId);

            setPayload((prev) => {
                if (!prev) return prev;
                const nextAgenda = (prev.agenda || []).map((item) =>
                    item.id === itemId
                        ? { ...item, watched: !!res?.item?.watched }
                        : item
                );
                return { ...prev, agenda: nextAgenda };
            });
        } catch (err) {
            setPageError(err?.message || "Failed to update agenda progress.");
        } finally {
            setTogglingAgendaIds((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    const handleGoToWebinar = () => {
        if (!listing.webinar_link) return;
        window.open(listing.webinar_link, "_blank", "noopener,noreferrer");
    };

    const downloadICS = () => {
        if (!order.webinar_date || !order.start_time) return;

        const start = new Date(`${order.webinar_date}T${order.start_time}`);
        const durationMinutes = Number(order.duration_minutes || 60);
        const end = new Date(start.getTime() + durationMinutes * 60000);

        const formatICSDate = (date) => {
            const yyyy = date.getUTCFullYear();
            const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
            const dd = String(date.getUTCDate()).padStart(2, "0");
            const hh = String(date.getUTCHours()).padStart(2, "0");
            const mi = String(date.getUTCMinutes()).padStart(2, "0");
            const ss = String(date.getUTCSeconds()).padStart(2, "0");
            return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
        };

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//UltraHustle//Webinar//EN",
            "BEGIN:VEVENT",
            `UID:webinar-order-${order.id}@ultrahustle`,
            `DTSTAMP:${formatICSDate(new Date())}`,
            `DTSTART:${formatICSDate(start)}`,
            `DTEND:${formatICSDate(end)}`,
            `SUMMARY:${listing.title || "Webinar"}`,
            `DESCRIPTION:${(listing.short_description || "").replace(/\n/g, "\\n")}`,
            `LOCATION:${listing.webinar_link || ""}`,
            "END:VEVENT",
            "END:VCALENDAR",
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `webinar-order-${order.id}.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className={`user-page webinar-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
                <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} theme={theme} />
                <div className="pt-[72px] flex relative z-10">
                    <Sidebar
                        expanded={sidebarOpen}
                        setExpanded={setSidebarOpen}
                        showSettings={showSettings}
                        setShowSettings={setShowSettings}
                        theme={theme}
                        setTheme={setTheme}
                    />
                    <div className="relative flex-1 min-w-5 overflow-hidden">
                        <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
                            <div className="wd-container">
                                <div className="wd-header-card">
                                    <div className="wd-header-content">
                                        <h1>Loading webinar access...</h1>
                                        <p>Please wait</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (pageError) {
        return (
            <div className={`user-page webinar-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
                <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} theme={theme} />
                <div className="pt-[72px] flex relative z-10">
                    <Sidebar
                        expanded={sidebarOpen}
                        setExpanded={setSidebarOpen}
                        showSettings={showSettings}
                        setShowSettings={setShowSettings}
                        theme={theme}
                        setTheme={setTheme}
                    />
                    <div className="relative flex-1 min-w-5 overflow-hidden">
                        <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
                            <div className="wd-container">
                                <div className="wd-header-card">
                                    <div className="wd-header-content">
                                        <h1>Unable to load webinar access</h1>
                                        <p>{pageError}</p>
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

            <div className="pt-[72px] flex relative z-10">
                <Sidebar
                    expanded={sidebarOpen}
                    setExpanded={setSidebarOpen}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    theme={theme}
                    setTheme={setTheme}
                />

                <div className="relative flex-1 min-w-5 overflow-hidden">
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
                        <div className="wd-container">
                            <div className="wd-header-card">
                                <div className="wd-header-content">
                                    <h1>{listing.title || "Webinar Access"}</h1>
                                    <p>{listing.short_description || "Access your webinar, progress, and resources."}</p>
                                </div>

                                <div className="wd-header-actions">
                                    {isUpcomingOrLive && listing.webinar_link ? (
                                        <button className="wd-webinar-btn" onClick={handleGoToWebinar}>
                                            <MonitorPlay size={18} />
                                            <span>Go to Webinar</span>
                                        </button>
                                    ) : null}

                                    {isUpcomingOrLive ? (
                                        <button className="wd-calendar-btn" onClick={handleAddToCalendar}>
                                            <ExternalLink size={18} />
                                            <span>Add to calendar</span>
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="wd-schedule-grid">
                                <div className="wd-schedule-card">
                                    <div className="wd-icon-box">
                                        <Calendar size={32} />
                                    </div>
                                    <div className="wd-schedule-info">
                                        <span className="wd-label">Date</span>
                                        <span className="wd-value">{formattedDate}</span>
                                    </div>
                                </div>

                                <div className="wd-schedule-card">
                                    <div className="wd-icon-box">
                                        <Clock size={32} />
                                    </div>
                                    <div className="wd-schedule-info">
                                        <span className="wd-label">Start Time</span>
                                        <span className="wd-value">{formattedTime}</span>
                                    </div>
                                </div>

                                <div className="wd-schedule-card">
                                    <div className="wd-icon-box">
                                        <Globe size={32} />
                                    </div>
                                    <div className="wd-schedule-info">
                                        <span className="wd-label">Timezone</span>
                                        <span className="wd-value">{timezoneDisplay}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="wd-info-section">
                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Description</h2>
                                    <p className="wd-info-text">{listing.short_description || "—"}</p>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Tools needed</h2>
                                    <div className="wd-tools-list">
                                        {(listing.tools || []).length ? (
                                            listing.tools.map((tool) => (
                                                <span key={tool} className="wd-tool-tag">{tool}</span>
                                            ))
                                        ) : (
                                            <span className="wd-info-text">—</span>
                                        )}
                                    </div>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Key outcomes</h2>
                                    <p className="wd-info-text">
                                        {(listing.key_outcomes || []).length
                                            ? listing.key_outcomes.join(", ")
                                            : "—"}
                                    </p>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">What you will learn</h2>
                                    <div className="wd-info-grid-2">
                                        <ul className="wd-learn-list">
                                            {(listing.learning_points || []).slice(0, Math.ceil((listing.learning_points || []).length / 2)).map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                        <ul className="wd-learn-list">
                                            {(listing.learning_points || []).slice(Math.ceil((listing.learning_points || []).length / 2)).map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Languages</h2>
                                    <p className="wd-languages-text">
                                        {(listing.languages || []).length ? listing.languages.join(" ") : "—"}
                                    </p>
                                </div>
                            </div>

                            {isPastWebinar ? (
                                <div className="wd-sessions-section">
                                    <h2 className="wd-section-title">Delivered session</h2>
                                    <div className="wd-sessions-container">
                                        {sessions.length ? (
                                            sessions.map((session) => (
                                                <div key={session.id} className="wd-session-card">
                                                    <div className="wd-session-content">
                                                        <div className="wd-session-header">
                                                            <div className="wd-session-badges">
                                                                <span className="wd-badge duration">
                                                                    {session.duration || session.time || "—"}
                                                                </span>
                                                                <span
                                                                    className={`wd-badge status ${session.watched ? "watched" : "segment"
                                                                        }`}
                                                                >
                                                                    {session.watched ? "Watched" : "Segment"}
                                                                </span>
                                                            </div>

                                                            <button
                                                                className={`wd-mark-btn ${session.watched ? "unmark" : "mark"}`}
                                                                onClick={() => handleAgendaToggle(session.id)}
                                                                disabled={!!togglingAgendaIds[session.id]}
                                                            >
                                                                {togglingAgendaIds[session.id]
                                                                    ? "Saving..."
                                                                    : session.watched
                                                                        ? "Unmark"
                                                                        : "Mark"}
                                                            </button>
                                                        </div>

                                                        <h3 className="wd-session-title">{session.topic || "Agenda item"}</h3>
                                                        <p className="wd-session-desc">{session.description || ""}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="wd-session-card">
                                                <div className="wd-session-content">
                                                    <h3 className="wd-session-title">No agenda items found.</h3>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}

                            <div className="wd-resources-section">
                                <h2 className="wd-section-title">Resources</h2>

                                <div className="wd-files-list-container">
                                    <div className="wd-files-list">
                                        {resources.length ? (
                                            resources.map((item) => (
                                                <div key={item.id} className="wd-file-item">
                                                    <div className="wd-file-info">
                                                        <h3>{item.title}</h3>
                                                        <div className="wd-file-meta">
                                                            <span>Updated {item.updated_at_display || "—"}</span>
                                                            <span className="wd-meta-dot">•</span>
                                                            <span>{item.size_label || "—"}</span>
                                                        </div>

                                                        <div className="wd-file-tags">
                                                            {(item.tags || []).map((tag) => (
                                                                <span key={tag} className={`wd-tag ${String(tag).toLowerCase()}`}>
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="wd-file-actions">
                                                        {item.type === "download" ? (
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="wd-action-btn primary"
                                                            >
                                                                <Download size={18} />
                                                                Download
                                                            </a>
                                                        ) : (
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="wd-action-btn primary"
                                                            >
                                                                <ExternalLink size={18} />
                                                                Open link
                                                            </a>
                                                        )}

                                                        {item.note ? (
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
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="wd-file-item">
                                                <div className="wd-file-info">
                                                    <h3>No resources available yet</h3>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "40px" }}>
                                <DetailedTeamCard
                                    teamName={creator.full_name || creator.username || listing.creator_name || ""}
                                    avatarUrl={creator.avatar_url || ""}
                                    location={creator.location || ""}
                                    rating={creator.rating || 0}
                                    reviewCount={creator.review_count || 0}
                                    description={creator.bio || creator.about || ""}
                                    languages={creator.languages || []}
                                    skills={creator.skills || []}
                                    memberSince={creator.member_since || creator.created_at || ""}
                                    karma={creator.karma || "—"}
                                    projectsCompleted={creator.projects_completed || "—"}
                                    responseSpeed={creator.avg_response || "—"}
                                    buttonText="View Profile"
                                    onViewProfile={() => {
                                        if (creator.username) {
                                            window.location.href = `/public-user-profile/${creator.username}`;
                                        }
                                    }}
                                />
                            </div>

                            <div className="wd-faq-section">
                                <div className="wd-header-row">
                                    <h2>Frequently Asked Questions</h2>
                                    <div className="wd-header-line"></div>
                                </div>

                                <div className="wd-faq-list">
                                    {faqData.length ? (
                                        faqData.map((faq, index) => {
                                            const faqId = faq.id || index;
                                            return (
                                                <div
                                                    key={faqId}
                                                    className={`wd-faq-item ${activeFaq === faqId ? "active" : ""}`}
                                                >
                                                    <div
                                                        className="wd-faq-question"
                                                        onClick={() => toggleFaq(faqId)}
                                                    >
                                                        <span>{faq.question || faq.q || "Question"}</span>
                                                        {activeFaq === faqId ? (
                                                            <ChevronUp size={24} />
                                                        ) : (
                                                            <ChevronDown size={24} />
                                                        )}
                                                    </div>
                                                    {activeFaq === faqId && (
                                                        <div className="wd-faq-answer">
                                                            <p>{faq.answer || faq.a || ""}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="wd-faq-item active">
                                            <div className="wd-faq-answer">
                                                <p>No FAQs available.</p>
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
                                            {review?.comment || "No review posted yet."}
                                        </p>
                                        <div className="wd-review-footer">
                                            <div className="wd-stars">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={20}
                                                        fill={
                                                            s <= Number(review?.rating || 0)
                                                                ? theme === "dark"
                                                                    ? "#CEFF1B"
                                                                    : "#FFE100"
                                                                : "#444"
                                                        }
                                                        stroke={
                                                            s <= Number(review?.rating || 0)
                                                                ? theme === "dark"
                                                                    ? "#CEFF1B"
                                                                    : "#FFE100"
                                                                : "#444"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <button className="wd-post-btn" disabled>
                                                {review ? "Posted" : "Post"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <OrderDetailsSection prefix="wd" blocks={orderDetailsBlocks} />
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