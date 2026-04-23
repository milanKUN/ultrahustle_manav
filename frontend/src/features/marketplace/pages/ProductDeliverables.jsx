import React, { useState, useEffect, useMemo } from 'react';
import { Package, Download, ExternalLink, FileText, Star, ChevronUp, ChevronDown, DollarSign } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDeliverables.css';
import UserNavbar from '../../../components/layout/UserNavbar';
import Sidebar from '../../../components/layout/Sidebar';
import DetailedTeamCard from '../components/DetailedTeamCard';
import OrderDetailsSection from '../components/OrderDetailsSection';
import NotesModal from '../components/NotesModal';
import { getOrderDigitalProduct } from '../api/orderApi';

const ProductDeliverables = ({ theme, setTheme }) => {
    const navigate = useNavigate();
    const { order_id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [activeFaq, setActiveFaq] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        let mounted = true;

        const run = async () => {
            try {
                setIsLoading(true);
                setFetchError('');
                const res = await getOrderDigitalProduct(order_id);
                if (!mounted) return;
                setPageData(res || null);
            } catch (err) {
                if (!mounted) return;
                setFetchError(err?.message || 'Failed to load digital product order.');
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        if (order_id) run();

        return () => {
            mounted = false;
        };
    }, [order_id]);

    const normalizeArray = (value) => Array.isArray(value) ? value.filter(Boolean) : [];

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    const formatMoney = (amount) => {
        const num = Number(amount || 0);
        return `$${num.toLocaleString()}`;
    };

    const payload = pageData || {};
    const order = payload.order || {};
    const listing = payload.listing || {};
    const creator = payload.creator || {};
    const review = payload.review || null;

    const resources = normalizeArray(payload.resources);
    const faqData = normalizeArray(payload.faqs);
    const orderDetailsBlocks = normalizeArray(payload.order_details_blocks);
    const packageSummary = payload.package_summary || null;

    const reviewRating = Number(review?.rating || 0);
    const reviewText = review?.comment || 'No review yet.';

    const ratingStars = useMemo(() => {
        return [1, 2, 3, 4, 5].map((s) => (
            <Star
                key={s}
                size={20}
                fill={
                    s <= reviewRating
                        ? theme === "dark"
                            ? "#CEFF1B"
                            : "#FFE100"
                        : "#444"
                }
                stroke={
                    s <= reviewRating
                        ? theme === "dark"
                            ? "#CEFF1B"
                            : "#FFE100"
                        : "#444"
                }
            />
        ));
    }, [reviewRating, theme]);

    const handleOpenResource = (item) => {
        if (!item?.url) return;
        window.open(item.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`user-page order-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
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
                            {isLoading ? (
                                <div className="od-header-card">
                                    <div className="od-header-content">
                                        <h1>Loading digital product...</h1>
                                        <p>Please wait while we fetch your order details.</p>
                                    </div>
                                </div>
                            ) : fetchError ? (
                                <div className="od-header-card">
                                    <div className="od-header-content">
                                        <h1>Failed to load product order</h1>
                                        <p>{fetchError}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="od-header-card">
                                        <div className="od-header-content">
                                            <h1>{listing.title || 'Digital Product Deliverables'}</h1>
                                            <p>
                                                Access your delivered files, notes, and purchase details.
                                            </p>
                                        </div>
                                        {resources.length > 0 && (
                                            <button
                                                className="od-download-all-btn"
                                                onClick={() => {
                                                    const firstDownload = resources.find((r) => r.type === 'download' && r.url);
                                                    if (firstDownload) handleOpenResource(firstDownload);
                                                }}
                                            >
                                                Download all
                                            </button>
                                        )}
                                    </div>

                                    <div className="od-info-grid">
                                        <div className="od-info-card">
                                            <div className="od-info-icon">
                                                <Package size={32} />
                                            </div>
                                            <div className="od-info-text">
                                                <span className="od-info-label">Order ID</span>
                                                <span className="od-info-value">
                                                    #{order.id || order_id}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="od-info-card">
                                            <div className="od-info-icon">
                                                <Package size={32} />
                                            </div>
                                            <div className="od-info-text">
                                                <span className="od-info-label">Purchased</span>
                                                <span className="od-info-value">
                                                    {order.created_at
                                                        ? new Date(order.created_at).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                        : '—'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="od-info-card">
                                            <div className="od-info-icon lime">
                                                <DollarSign size={32} />
                                            </div>
                                            <div className="od-info-text">
                                                <span className="od-info-label">Price</span>
                                                <span className="od-info-value">
                                                    {formatMoney(order.total_amount ?? order.price ?? listing.price ?? 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {packageSummary && (
                                        <div className="od-header-card" style={{ marginTop: 24 }}>
                                            <div className="od-header-content">
                                                <h1 style={{ fontSize: '22px' }}>
                                                    Selected Package: {packageSummary.package_name || 'Package'}
                                                </h1>
                                                <p>
                                                    {(packageSummary.included || []).length
                                                        ? packageSummary.included.join(' • ')
                                                        : 'No package items available.'}
                                                </p>
                                                {(packageSummary.delivery_format || []).length > 0 && (
                                                    <p>
                                                        Delivery format: {packageSummary.delivery_format.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="od-deliverables-section">
                                        <h2 className="od-section-title">Delivered Files</h2>

                                        <div className="od-files-list-container">
                                            <div className="od-files-list">
                                                {resources.length ? (
                                                    resources.map((item) => (
                                                        <div key={item.id} className="od-file-item">
                                                            <div className="od-file-info">
                                                                <h3>{item.title}</h3>
                                                                <div className="od-file-meta">
                                                                    <span>Updated {item.updated_at_display || '—'}</span>
                                                                    <span className="od-meta-dot">•</span>
                                                                    <span>{item.size_label || '—'}</span>
                                                                </div>
                                                                <div className="od-file-tags">
                                                                    {normalizeArray(item.tags).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className={`od-tag ${String(tag).toLowerCase()}`}
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="od-file-actions">
                                                                <button
                                                                    className="od-action-btn primary"
                                                                    onClick={() => handleOpenResource(item)}
                                                                    disabled={!item.url}
                                                                >
                                                                    {item.type === "download" ? (
                                                                        <Download size={18} />
                                                                    ) : (
                                                                        <ExternalLink size={18} />
                                                                    )}
                                                                    {item.type === "download" ? 'Download' : 'Open link'}
                                                                </button>

                                                                <button
                                                                    className="od-action-btn secondary"
                                                                    onClick={() =>
                                                                        setSelectedNote({
                                                                            title: item.title,
                                                                            content: item.note || 'No note available.',
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
                                                    <div className="od-file-item">
                                                        <div className="od-file-info">
                                                            <h3>No delivered files available</h3>
                                                            <div className="od-file-meta">
                                                                <span>Nothing has been attached yet.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: "40px" }}>
                                        <DetailedTeamCard
                                            teamName={creator.full_name || creator.username || 'Profile'}
                                            avatarUrl={creator.avatar_url || ''}
                                            location={creator.location || ''}
                                            rating={creator.rating || 0}
                                            reviewCount={creator.review_count || 0}
                                            description={creator.bio || creator.about || ''}
                                            languages={creator.languages || []}
                                            skills={creator.skills || []}
                                            memberSince={creator.member_since || ''}
                                            karma={creator.karma || '—'}
                                            projectsCompleted={creator.projects_completed || '—'}
                                            responseSpeed={creator.avg_response || '—'}
                                            buttonText={creator.username ? 'View Profile' : 'Profile Unavailable'}
                                            onViewProfile={() => {
                                                if (creator?.username) {
                                                    navigate(`/public-user-profile/${creator.username}`);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="od-faq-section">
                                        <div className="od-review-header">
                                            <h2>Frequently Asked Questions</h2>
                                            <div className="od-header-line"></div>
                                        </div>

                                        <div className="od-faq-list">
                                            {faqData.length ? (
                                                faqData.map((faq, index) => (
                                                    <div
                                                        key={faq.id || index}
                                                        className={`od-faq-item ${activeFaq === index ? "active" : ""}`}
                                                    >
                                                        <div
                                                            className="od-faq-question"
                                                            onClick={() => toggleFaq(index)}
                                                        >
                                                            <span>{faq.question}</span>
                                                            {activeFaq === index ? (
                                                                <ChevronUp size={24} />
                                                            ) : (
                                                                <ChevronDown size={24} />
                                                            )}
                                                        </div>
                                                        {activeFaq === index && (
                                                            <div className="od-faq-answer">
                                                                <p>{faq.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="od-faq-item active">
                                                    <div className="od-faq-question">
                                                        <span>No FAQs available</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="od-review-section">
                                        <div className="od-review-header">
                                            <h2>Review</h2>
                                            <div className="od-header-line"></div>
                                        </div>

                                        <div className="od-review-card">
                                            <div className="od-review-content">
                                                <p className="od-review-text">
                                                    {reviewText}
                                                </p>
                                                <div className="od-review-footer">
                                                    <div className="od-stars">
                                                        {ratingStars}
                                                    </div>
                                                    <button className="od-post-btn" disabled>
                                                        {review ? 'Posted' : 'No Review'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <OrderDetailsSection prefix="od" blocks={orderDetailsBlocks} />
                                </>
                            )}
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