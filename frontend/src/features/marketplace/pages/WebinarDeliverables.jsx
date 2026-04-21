import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Globe,
    CalendarPlus,
    Video,
    Package,
    Download,
    ExternalLink,
    FileText,
    ChevronLeft,
    Star,
    ChevronUp,
    ChevronDown,
    Check,
    MonitorPlay
} from 'lucide-react';
import './WebinarDeliverables.css';
import UserNavbar from '../../../components/layout/UserNavbar';
import Sidebar from '../../../components/layout/Sidebar';
import DetailedTeamCard from '../components/DetailedTeamCard';
import OrderDetailsSection from '../components/OrderDetailsSection';
import NotesModal from '../components/NotesModal';

const WebinarDeliverables = ({ theme, setTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    const deliverables = [
        {
            id: 1,
            title: "Final Deliverables (ZIP) — UI Kit + Source",
            updated: "Nov 20, 2025",
            size: "128 MB",
            tags: ["ZIP", "Final"],
            type: "download",
            buttonText: "Download"
        },
        {
            id: 2,
            title: "Design Handoff",
            updated: "Nov 20, 2025",
            size: "128 MB",
            tags: ["PDF", "Final"],
            type: "download",
            buttonText: "Download"
        },
        {
            id: 3,
            title: "Figma Source (View-only link)",
            updated: "Nov 20, 2025",
            size: "128 MB",
            tags: ["Link", "Final"],
            type: "link",
            buttonText: "Open link"
        }
    ];

    const faqData = [
        {
            id: 1,
            question: "What information do you need to get started?",
            answer: "I'll need your app concept, target audience details, any brand guidelines you have, competitor examples, and specific features you want included. The more details you provide, the better I can tailor the design to your needs."
        },
        {
            id: 2,
            question: "Do you provide the source files?",
            answer: "Yes, once the final design is approved and the order is completed, I will provide all necessary source files, typically in Figma format, along with any assets used."
        }
    ];

    const [activeFaq, setActiveFaq] = useState(1);

    const [sessions, setSessions] = useState([
        {
            id: 1,
            title: "Welcome + setup",
            description: "What we'll cover, prerequisites, and files.",
            duration: "10 min",
            type: "Segment",
            watched: false
        },
        {
            id: 2,
            title: "Welcome + setup",
            description: "What we'll cover, prerequisites, and files.",
            duration: "25 min",
            type: "Watched",
            watched: true
        },
        {
            id: 3,
            title: "Welcome + setup",
            description: "What we'll cover, prerequisites, and files.",
            duration: "10 min",
            type: "Segment",
            watched: false
        }
    ]);

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    const toggleSessionMark = (id) => {
        setSessions(prev => prev.map(session =>
            session.id === id ? { ...session, watched: !session.watched } : session
        ));
    };

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
                            {/* Main Header Card */}
                            <div className="wd-header-card">
                                <div className="wd-header-content">
                                    <h1>Online Course Cover + Digital Product Mockup Bundle</h1>
                                    <p>Access your delivered files, notes</p>
                                </div>
                                <div className="wd-header-actions">
                                    <button className="wd-webinar-btn">
                                        <MonitorPlay size={18} />
                                        <span>Go to webinar</span>
                                    </button>
                                    <button className="wd-calendar-btn">
                                        <ExternalLink size={18} />
                                        <span>Add to calendar</span>
                                    </button>
                                </div>
                            </div>
                            {/* Schedule Grid */}
                            <div className="wd-schedule-grid">
                                <div className="wd-schedule-card">
                                    <div className="wd-icon-box">
                                        <Calendar size={32} />
                                    </div>
                                    <div className="wd-schedule-info">
                                        <span className="wd-label">Date</span>
                                        <span className="wd-value">2026-03-20</span>
                                    </div>
                                </div>
                                <div className="wd-schedule-card">
                                    <div className="wd-icon-box">
                                        <Clock size={32} />
                                    </div>
                                    <div className="wd-schedule-info">
                                        <span className="wd-label">Start</span>
                                        <span className="wd-value">18:00</span>
                                    </div>
                                </div>
                                <div className="wd-schedule-card">
                                    <div className="wd-icon-box">
                                        <Globe size={32} />
                                    </div>
                                    <div className="wd-schedule-info">
                                        <span className="wd-label">Time zone</span>
                                        <span className="wd-value">Asia/Kolkata (IST)</span>
                                    </div>
                                </div>
                            </div>


                            {/* Content Info Section */}
                            <div className="wd-info-section">
                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Description</h2>
                                    <p className="wd-info-text">He is the best in the game. Always have time to explain to me and made sure I was satisfied at every stage. Don't skip him if you want the best. He's great</p>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Tools needed</h2>
                                    <div className="wd-tools-list">
                                        {['Notion', 'Tailwind CSS', 'Photoshop', 'Figma', 'Illustrator', 'TypeScript', 'Webflow'].map(tool => (
                                            <span key={tool} className="wd-tool-tag">{tool}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Key outcomes</h2>
                                    <p className="wd-info-text">He is the best in the game. Always have time to explain to me and made sure I was satisfied at every stage. Don't skip him if you want the best. He's great</p>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">What you will learn</h2>
                                    <div className="wd-info-grid-2">
                                        <ul className="wd-learn-list">
                                            <li>He is the best in the game.</li>
                                            <li>Always have time to explain to me and made sure.</li>
                                        </ul>
                                        <ul className="wd-learn-list">
                                            <li>I was satisfied at every stage.</li>
                                            <li>Don't skip him if you want the best. He's great</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="wd-info-block">
                                    <h2 className="wd-info-title">Languages</h2>
                                    <p className="wd-languages-text">English Hindi Tamil</p>
                                </div>
                            </div>

                            {/* Delivered Session Section */}
                            <div className="wd-sessions-section">
                                <h2 className="wd-section-title">Delivered session</h2>
                                <div className="wd-sessions-container">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="wd-session-card">
                                            <div className="wd-session-content">
                                                <div className="wd-session-header">
                                                    <div className="wd-session-badges">
                                                        <span className="wd-badge duration">{session.duration}</span>
                                                        <span className={`wd-badge status ${session.watched ? 'watched' : 'segment'}`}>
                                                            {session.watched ? 'Watched' : 'Segment'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className={`wd-mark-btn ${session.watched ? 'unmark' : 'mark'}`}
                                                        onClick={() => toggleSessionMark(session.id)}
                                                    >
                                                        {session.watched ? 'Unmark' : 'Mark'}
                                                    </button>
                                                </div>
                                                <h3 className="wd-session-title">{session.title}</h3>
                                                <p className="wd-session-desc">{session.description}</p>
                                                {/* <button
                                                    className="wd-notes-btn"
                                                    onClick={() => setSelectedNote({ title: session.title, content: session.description })}
                                                >
                                                    View note
                                                </button> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resources Section */}
                            <div className="wd-resources-section">
                                <h2 className="wd-section-title">Resources</h2>

                                <div className="wd-files-list-container">
                                    <div className="wd-files-list">
                                        {deliverables.map((item) => (
                                            <div key={item.id} className="wd-file-item">
                                                <div className="wd-file-info">
                                                    <h3>{item.title}</h3>
                                                    <div className="wd-file-meta">
                                                        <span>Updated {item.updated}</span>
                                                        <span className="wd-meta-dot">•</span>
                                                        <span>{item.size}</span>
                                                    </div>
                                                    <div className="wd-file-tags">
                                                        {item.tags.map(tag => (
                                                            <span key={tag} className={`wd-tag ${tag.toLowerCase()}`}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="wd-file-actions">
                                                    <button className="wd-action-btn primary">
                                                        {item.type === 'download' ? <Download size={18} /> : <ExternalLink size={18} />}
                                                        {item.buttonText}
                                                    </button>
                                                    <button
                                                        className="wd-action-btn secondary"
                                                        onClick={() => setSelectedNote({ title: item.title, content: "This is a dummy note for the deliverable. You can add more details here.  " })}
                                                    >
                                                        <FileText size={18} />
                                                        View note
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Team Card */}
                            <div style={{ marginTop: '40px' }}>
                                <DetailedTeamCard />
                            </div>

                            {/* FAQ Section */}
                            <div className="wd-faq-section">
                                <div className="wd-header-row">
                                    <h2>Frequently Asked Questions</h2>
                                    <div className="wd-header-line"></div>
                                </div>

                                <div className="wd-faq-list">
                                    {faqData.map((faq) => (
                                        <div
                                            key={faq.id}
                                            className={`wd-faq-item ${activeFaq === faq.id ? 'active' : ''}`}
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
                                    ))}
                                </div>
                            </div>

                            {/* Review Section */}
                            <div className="wd-review-section">
                                <div className="wd-header-row">
                                    <h2>Review</h2>
                                    <div className="wd-header-line"></div>
                                </div>

                                <div className="wd-review-card">
                                    <div className="wd-review-content">
                                        <p className="wd-review-text">
                                            Exceptional designer! Sovan delivered a comprehensive design system that transformed our product.
                                            His attention to detail and communication throughout the project was outstanding.
                                            Highly recommend for any serious design work!
                                        </p>
                                        <div className="wd-review-footer">
                                            <div className="wd-stars">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star
                                                        key={s}
                                                        size={20}
                                                        fill={s <= 4 ? (theme === 'dark' ? "#CEFF1B" : "#FFE100") : "#444"}
                                                        stroke={s <= 4 ? (theme === 'dark' ? "#CEFF1B" : "#FFE100") : "#444"}
                                                    />
                                                ))}
                                            </div>
                                            <button className="wd-post-btn">
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Section */}
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
