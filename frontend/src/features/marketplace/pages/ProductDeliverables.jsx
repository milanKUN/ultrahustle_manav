import React, { useState, useEffect } from 'react';
import { Package, Download, ExternalLink, FileText, ChevronLeft, Star, ChevronUp, ChevronDown, DollarSign } from 'lucide-react';
import './ProductDeliverables.css';
import UserNavbar from '../../../components/layout/UserNavbar';
import Sidebar from '../../../components/layout/Sidebar';
import DetailedTeamCard from '../components/DetailedTeamCard';
import OrderDetailsSection from '../components/OrderDetailsSection';
import NotesModal from '../components/NotesModal';

const ProductDeliverables = ({ theme, setTheme }) => {
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

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    return (
        <div
            className={`user-page order-deliverables-page ${theme} min-h-screen relative overflow-hidden`}
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
                        <div className="od-container">
                            {/* Main Header Card */}
                            <div className="od-header-card">
                                <div className="od-header-content">
                                    <h1>
                                        Online Course Cover + Digital Product
                                        Mockup Bundle
                                    </h1>
                                    <p>
                                        Access your delivered files, notes, and
                                        project chat.
                                    </p>
                                </div>
                                <button className="od-download-all-btn">
                                    Download all
                                </button>
                            </div>

                            {/* Info Cards Grid */}
                            <div className="od-info-grid">
                                <div className="od-info-card">
                                    <div className="od-info-icon">
                                        <Package size={32} />
                                    </div>
                                    <div className="od-info-text">
                                        <span className="od-info-label">
                                            Order ID
                                        </span>
                                        <span className="od-info-value">
                                            #PRJ-20419
                                        </span>
                                    </div>
                                </div>
                                <div className="od-info-card">
                                    <div className="od-info-icon">
                                        <Package size={32} />
                                    </div>
                                    <div className="od-info-text">
                                        <span className="od-info-label">
                                            Purchased
                                        </span>
                                        <span className="od-info-value">
                                            Feb 12, 2025
                                        </span>
                                    </div>
                                </div>
                                <div className="od-info-card">
                                    <div className="od-info-icon lime">
                                        <DollarSign size={32} />
                                    </div>
                                    <div className="od-info-text">
                                        <span className="od-info-label">
                                            Price
                                        </span>
                                        <span className="od-info-value">
                                            $2340
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Deliverables List Section */}
                            <div className="od-deliverables-section">
                                <h2 className="od-section-title">
                                    Delivered Files
                                </h2>

                                <div className="od-files-list-container">
                                    <div className="od-files-list">
                                        {deliverables.map((item) => (
                                            <div
                                                key={item.id}
                                                className="od-file-item"
                                            >
                                                <div className="od-file-info">
                                                    <h3>{item.title}</h3>
                                                    <div className="od-file-meta">
                                                        <span>
                                                            Updated{" "}
                                                            {item.updated}
                                                        </span>
                                                        <span className="od-meta-dot">
                                                            •
                                                        </span>
                                                        <span>{item.size}</span>
                                                    </div>
                                                    <div className="od-file-tags">
                                                        {item.tags.map(
                                                            (tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className={`od-tag ${tag.toLowerCase()}`}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="od-file-actions">
                                                    <button className="od-action-btn primary">
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
                                                        className="od-action-btn secondary"
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
                            <div className="od-faq-section">
                                <div className="od-review-header">
                                    <h2>Frequently Asked Questions</h2>
                                    <div className="od-header-line"></div>
                                </div>

                                <div className="od-faq-list">
                                    {faqData.map((faq) => (
                                        <div
                                            key={faq.id}
                                            className={`od-faq-item ${activeFaq === faq.id ? "active" : ""}`}
                                        >
                                            <div
                                                className="od-faq-question"
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
                                                <div className="od-faq-answer">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Review Section */}
                            <div className="od-review-section">
                                <div className="od-review-header">
                                    <h2>Review</h2>
                                    <div className="od-header-line"></div>
                                </div>

                                <div className="od-review-card">
                                    <div className="od-review-content">
                                        <p className="od-review-text">
                                            Exceptional designer! Sovan
                                            delivered a comprehensive design
                                            system that transformed our product.
                                            His attention to detail and
                                            communication throughout the project
                                            was outstanding. Highly recommend
                                            for any serious design work!
                                        </p>
                                        <div className="od-review-footer">
                                            <div className="od-stars">
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
                                            <button className="od-post-btn">
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Section */}
                            <OrderDetailsSection prefix="od" />
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

export default ProductDeliverables;
