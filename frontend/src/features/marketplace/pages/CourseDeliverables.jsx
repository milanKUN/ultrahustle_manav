import React, { useState, useEffect } from 'react';
import { Package, Download, ExternalLink, FileText, ChevronLeft, Star, ChevronUp, ChevronDown, Play, Check, DollarSign } from 'lucide-react';
import './CourseDeliverables.css';
import UserNavbar from '../../../components/layout/UserNavbar';
import Sidebar from '../../../components/layout/Sidebar';
import DetailedTeamCard from '../components/DetailedTeamCard';
import OrderDetailsSection from '../components/OrderDetailsSection';
import NotesModal from '../components/NotesModal';

const CourseDeliverables = ({ theme, setTheme }) => {
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

    const lessonsData = [
        {
            id: 1,
            number: "Lesson 1",
            title: "Final Deliverables (ZIP) — UI Kit + Source",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        },
        {
            id: 2,
            number: "Lesson 2",
            title: "Final Deliverables (ZIP) — UI Kit + Source",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever more...",
        },
        {
            id: 3,
            number: "Lesson 3",
            title: "Final Deliverables (ZIP) — UI Kit + Source",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever more...",
        },
    ];

    const languages = ['English', 'Hindi', 'Tamil'];

    const [activeFaq, setActiveFaq] = useState(1);

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    return (
        <div
            className={`user-page course-deliverables-page ${theme} min-h-screen relative overflow-hidden`}
        >
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
                        <div className="cd-container">
                            {/* Main Header Card */}
                            <div className="cd-header-card">
                                <div className="cd-header-content">
                                    <h1>
                                        Online Course Cover + Digital Product
                                        Mockup Bundle
                                    </h1>
                                    <p>
                                        Access your delivered files, notes, and
                                        project chat.
                                    </p>
                                </div>
                                {/* <button className="cd-download-all-btn">
                                    Download all
                                </button> */}
                            </div>

                            {/* Info Cards Grid */}
                            <div className="cd-info-grid">
                                <div className="cd-info-card">
                                    <div className="cd-info-icon">
                                        <Package size={24} />
                                    </div>
                                    <div className="cd-info-card-text">
                                        <span className="cd-info-label">
                                            Order ID
                                        </span>
                                        <span className="cd-info-value">
                                            #PRJ-20419
                                        </span>
                                    </div>
                                </div>
                                <div className="cd-info-card">
                                    <div className="cd-info-icon">
                                        <Package size={24} />
                                    </div>
                                    <div className="cd-info-card-text">
                                        <span className="cd-info-label">
                                            Purchased
                                        </span>
                                        <span className="cd-info-value">
                                            Feb 12, 2025
                                        </span>
                                    </div>
                                </div>
                                <div className="cd-info-card">
                                    <div className="cd-info-icon lime">
                                        <DollarSign size={32} />
                                    </div>
                                    <div className="cd-info-card-text">
                                        <span className="cd-info-label">
                                            Price
                                        </span>
                                        <span className="cd-info-value">
                                            $2340
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Course Info Section */}
                            <div className="cd-info-section">
                                <div className="cd-info-block">
                                    <h2 className="cd-info-title">
                                        Description
                                    </h2>
                                    <p className="cd-info-text">
                                        He is the best in the game. Always have
                                        time to explain to me and made sure I
                                        was satisfied at every stage. Don't skip
                                        him if you want the best. He's great
                                    </p>
                                </div>

                                <div className="cd-info-block">
                                    <h2 className="cd-info-title">
                                        Tools needed
                                    </h2>
                                    <div className="cd-tools-list">
                                        {[
                                            "Notion",
                                            "Tailwind CSS",
                                            "Photoshop",
                                            "Figma",
                                            "Illustrator",
                                            "TypeScript",
                                            "Webflow",
                                        ].map((tool) => (
                                            <span
                                                key={tool}
                                                className="cd-tool-tag"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="cd-info-block">
                                    <h2 className="cd-info-title">
                                        Prerequisites
                                    </h2>
                                    <p className="cd-info-text">
                                        He is the best in the game. Always have
                                        time to explain to me and made sure I
                                        was satisfied at every stage. Don't skip
                                        him if you want the best. He's great
                                    </p>
                                </div>

                                <div className="cd-info-block">
                                    <h2 className="cd-info-title">
                                        What you will learn
                                    </h2>
                                    <div className="cd-info-grid-2">
                                        <ul className="cd-learn-list">
                                            <li>He is the best in the game.</li>
                                            <li>
                                                Always have time to explain to
                                                me and made sure.
                                            </li>
                                        </ul>
                                        <ul className="cd-learn-list">
                                            <li>
                                                I was satisfied at every stage.
                                            </li>
                                            <li>
                                                Don't skip him if you want the
                                                best. He's great
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="cd-info-block">
                                    <h2 className="cd-info-title">
                                        Course includes
                                    </h2>
                                    <div className="cd-info-grid-2">
                                        <div className="cd-include-item">
                                            <Check size={18} />
                                            <span>Up to 12 screens</span>
                                        </div>
                                        <div className="cd-include-item">
                                            <Check size={18} />
                                            <span>Interactive prototype</span>
                                        </div>
                                        <div className="cd-include-item">
                                            <Check size={18} />
                                            <span>
                                                Advanced wireframing &
                                                prototyping
                                            </span>
                                        </div>
                                        <div className="cd-include-item">
                                            <Check size={18} />
                                            <span>Source files included</span>
                                        </div>
                                        <div className="cd-include-item">
                                            <Check size={18} />
                                            <span>
                                                Custom color scheme & typography
                                            </span>
                                        </div>
                                        <div className="cd-include-item">
                                            <Check size={18} />
                                            <span>Commercial use</span>
                                        </div>
                                        <div className="cd-include-item">
                                            <Check size={18} />
                                            <span>
                                                Mobile & tablet responsive
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="cd-info-block">
                                    <h2 className="cd-info-title">Languages</h2>
                                    <p className="cd-languages-text">
                                        {languages.map((language) => (
                                            <span
                                                key={language}
                                                className="cd-language-item"
                                            >
                                                {language}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>

                            {/* Course Video Section */}
                            <div className="cd-video-section">
                                <h2 className="cd-section-title">Course</h2>
                                <div className="cd-video-container">
                                    <div className="cd-video-placeholder">
                                        <div className="cd-play-button">
                                            <Play size={32} fill="#000" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lessons Section */}
                            <div className="cd-lessons-section">
                                {lessonsData.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="cd-lesson-card"
                                    >
                                        <div className="cd-lesson-content">
                                            <div className="cd-lesson-badge">
                                                {lesson.number}
                                            </div>
                                            <h3 className="cd-lesson-title">
                                                {lesson.title}
                                            </h3>
                                            <p className="cd-lesson-description">
                                                {lesson.description}
                                            </p>
                                        </div>
                                        <button className="cd-watch-btn">
                                            Watch
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Resources Section */}
                            <div className="cd-deliverables-section">
                                <h2 className="cd-section-title">Resources</h2>

                                <div className="cd-files-list-container">
                                    <div className="cd-files-list">
                                        {deliverables.map((item) => (
                                            <div
                                                key={item.id}
                                                className="cd-file-item"
                                            >
                                                <div className="cd-file-info">
                                                    <h3>{item.title}</h3>
                                                    <div className="cd-file-meta">
                                                        <span>
                                                            Updated{" "}
                                                            {item.updated}
                                                        </span>
                                                        <span className="cd-meta-dot">
                                                            •
                                                        </span>
                                                        <span>{item.size}</span>
                                                    </div>
                                                    <div className="cd-file-tags">
                                                        {item.tags.map(
                                                            (tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className={`cd-tag ${tag.toLowerCase()}`}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="cd-file-actions">
                                                    <button className="cd-action-btn primary">
                                                        {item.type ===
                                                        "download" ? (
                                                            <Download
                                                                size={18}
                                                            />
                                                        ) : (
                                                            <ExternalLink
                                                                size={18}
                                                            />
                                                        )}
                                                        {item.buttonText}
                                                    </button>
                                                    <button
                                                        className="cd-action-btn secondary"
                                                        onClick={() =>
                                                            setSelectedNote({
                                                                title: item.title,
                                                                content:
                                                                    "This is a dummy note for the deliverable. You can add more details here.",
                                                            })
                                                        }
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

                            <div style={{ marginTop: "40px" }}>
                                <DetailedTeamCard />
                            </div>

                            {/* FAQ Section */}
                            <div className="cd-faq-section">
                                <div className="cd-review-header">
                                    <h2>Frequently Asked Questions</h2>
                                    <div className="cd-header-line"></div>
                                </div>

                                <div className="cd-faq-list">
                                    {faqData.map((faq) => (
                                        <div
                                            key={faq.id}
                                            className={`cd-faq-item ${activeFaq === faq.id ? "active" : ""}`}
                                        >
                                            <div
                                                className="cd-faq-question"
                                                onClick={() =>
                                                    toggleFaq(faq.id)
                                                }
                                            >
                                                <span>{faq.question}</span>
                                                {activeFaq === faq.id ? (
                                                    <ChevronUp size={24} />
                                                ) : (
                                                    <ChevronDown size={24} />
                                                )}
                                            </div>
                                            {activeFaq === faq.id && (
                                                <div className="cd-faq-answer">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Review Section */}
                            <div className="cd-review-section">
                                <div className="cd-review-header">
                                    <h2>Review</h2>
                                    <div className="cd-header-line"></div>
                                </div>

                                <div className="cd-review-card">
                                    <div className="cd-review-content">
                                        <p className="cd-review-text">
                                            Exceptional designer! Sovan
                                            delivered a comprehensive design
                                            system that transformed our product.
                                            His attention to detail and
                                            communication throughout the project
                                            was outstanding. Highly recommend
                                            for any serious design work!
                                        </p>
                                        <div className="cd-review-footer">
                                            <div className="cd-stars">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={20}
                                                        fill={
                                                            s <= 4
                                                                ? theme ===
                                                                  "dark"
                                                                    ? "#CEFF1B"
                                                                    : "#FFE100"
                                                                : "#444"
                                                        }
                                                        stroke={
                                                            s <= 4
                                                                ? theme ===
                                                                  "dark"
                                                                    ? "#CEFF1B"
                                                                    : "#FFE100"
                                                                : "#444"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <button className="cd-post-btn">
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Section */}
                            <OrderDetailsSection prefix="cd" />
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

export default CourseDeliverables;
