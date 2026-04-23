import React, { useState, useEffect, useMemo } from 'react';
import {
    Package,
    Download,
    ExternalLink,
    FileText,
    Star,
    ChevronUp,
    ChevronDown,
    Play,
    Check,
    DollarSign,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CourseDeliverables.css';
import UserNavbar from '../../../components/layout/UserNavbar';
import Sidebar from '../../../components/layout/Sidebar';
import DetailedTeamCard from '../components/DetailedTeamCard';
import OrderDetailsSection from '../components/OrderDetailsSection';
import NotesModal from '../components/NotesModal';
import { getOrderCourse, toggleOrderCourseLesson } from '../api/orderApi';

const CourseDeliverables = ({ theme, setTheme }) => {
    const { order_id } = useParams();
    const navigate = useNavigate();

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
    const [lessonLoadingId, setLessonLoadingId] = useState(null);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    const normalizeArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

    const formatMoney = (amount) => {
        const num = Number(amount || 0);
        return `$${num.toLocaleString()}`;
    };

    const formatDate = (value) => {
        if (!value) return '—';
        try {
            return new Date(value).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return value;
        }
    };

    const fetchCourseOrder = async () => {
        if (!order_id) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setFetchError('');
            const res = await getOrderCourse(order_id);
            setPageData(res || null);
        } catch (err) {
            setFetchError(err?.message || 'Failed to load course order.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    const handleLessonToggle = async (lessonId) => {
        try {
            setLessonLoadingId(lessonId);
            const res = await toggleOrderCourseLesson(order_id, lessonId);
            const watched = !!res?.item?.watched;

            setPageData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    lessons: normalizeArray(prev.lessons).map((lesson) =>
                        lesson.id === lessonId ? { ...lesson, watched } : lesson
                    ),
                };
            });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: watched ? 'Lesson marked as watched' : 'Lesson unmarked',
                showConfirmButton: false,
                timer: 1800,
                background: '#0b0b0b',
                color: '#fff',
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: err?.message || 'Could not update lesson progress.',
                background: '#0b0b0b',
                color: '#fff',
            });
        } finally {
            setLessonLoadingId(null);
        }
    };

    const handleOpenResource = (item) => {
        if (!item?.url) return;

        window.open(item.url, '_blank', 'noopener,noreferrer');
    };

    const payload = pageData || {};
    const order = payload.order || {};
    const listing = payload.listing || {};
    const creator = payload.creator || {};
    const review = payload.review || null;

    const resources = normalizeArray(payload.resources);
    const faqData = normalizeArray(payload.faqs);
    const lessonsData = normalizeArray(payload.lessons);

    const languages = normalizeArray(listing.languages);
    const tools = normalizeArray(listing.tools);
    const prerequisites = normalizeArray(listing.prerequisites);
    const learningPoints = normalizeArray(listing.learning_points);
    const courseIncludes = normalizeArray(listing.included);

    const orderDetailsBlocks = normalizeArray(payload.order_details_blocks);

    const previewVideoUrl = listing.preview_video_url || '';

    const reviewRating = Number(review?.rating || 0);
    const reviewComment = review?.comment || 'No review yet.';

    const profileButtonText = creator?.username ? 'View Profile' : 'Profile Unavailable';

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
                            {isLoading ? (
                                <div className="cd-header-card">
                                    <div className="cd-header-content">
                                        <h1>Loading course deliverables...</h1>
                                        <p>Please wait while we fetch your course order.</p>
                                    </div>
                                </div>
                            ) : fetchError ? (
                                <div className="cd-header-card">
                                    <div className="cd-header-content">
                                        <h1>Unable to load course</h1>
                                        <p>{fetchError}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="cd-header-card">
                                        <div className="cd-header-content">
                                            <h1>{listing.title || 'Course Deliverables'}</h1>
                                            <p>
                                                Access your delivered files, notes, and project chat.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="cd-info-grid">
                                        <div className="cd-info-card">
                                            <div className="cd-info-icon">
                                                <Package size={24} />
                                            </div>
                                            <div className="cd-info-card-text">
                                                <span className="cd-info-label">Order ID</span>
                                                <span className="cd-info-value">
                                                    #{order.id || order_id}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="cd-info-card">
                                            <div className="cd-info-icon">
                                                <Package size={24} />
                                            </div>
                                            <div className="cd-info-card-text">
                                                <span className="cd-info-label">Purchased</span>
                                                <span className="cd-info-value">
                                                    {formatDate(order.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="cd-info-card">
                                            <div className="cd-info-icon lime">
                                                <DollarSign size={32} />
                                            </div>
                                            <div className="cd-info-card-text">
                                                <span className="cd-info-label">Price</span>
                                                <span className="cd-info-value">
                                                    {formatMoney(
                                                        order.total_amount ?? order.price ?? listing.price ?? 0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cd-info-section">
                                        <div className="cd-info-block">
                                            <h2 className="cd-info-title">Description</h2>
                                            <p className="cd-info-text">
                                                {listing.short_description || listing.about || 'No description available.'}
                                            </p>
                                        </div>

                                        <div className="cd-info-block">
                                            <h2 className="cd-info-title">Tools needed</h2>
                                            <div className="cd-tools-list">
                                                {tools.length ? (
                                                    tools.map((tool) => (
                                                        <span key={tool} className="cd-tool-tag">
                                                            {tool}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="cd-info-text">No tools listed.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="cd-info-block">
                                            <h2 className="cd-info-title">Prerequisites</h2>
                                            {prerequisites.length ? (
                                                <div className="cd-info-grid-2">
                                                    <ul className="cd-learn-list">
                                                        {prerequisites.map((item, idx) => (
                                                            <li key={idx}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="cd-info-text">No prerequisites added.</p>
                                            )}
                                        </div>

                                        <div className="cd-info-block">
                                            <h2 className="cd-info-title">What you will learn</h2>
                                            {learningPoints.length ? (
                                                <div className="cd-info-grid-2">
                                                    <ul className="cd-learn-list">
                                                        {learningPoints.map((item, idx) => (
                                                            <li key={idx}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="cd-info-text">No learning points added.</p>
                                            )}
                                        </div>

                                        <div className="cd-info-block">
                                            <h2 className="cd-info-title">Course includes</h2>
                                            {courseIncludes.length ? (
                                                <div className="cd-info-grid-2">
                                                    {courseIncludes.map((item, idx) => (
                                                        <div key={idx} className="cd-include-item">
                                                            <Check size={18} />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="cd-info-text">No course includes added.</p>
                                            )}
                                        </div>

                                        <div className="cd-info-block">
                                            <h2 className="cd-info-title">Languages</h2>
                                            <p className="cd-languages-text">
                                                {languages.length ? (
                                                    languages.map((language) => (
                                                        <span key={language} className="cd-language-item">
                                                            {language}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="cd-language-item">Not specified</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="cd-video-section">
                                        <h2 className="cd-section-title">Course</h2>
                                        <div className="cd-video-container">
                                            {previewVideoUrl ? (
                                                <video
                                                    className="cd-video-placeholder"
                                                    controls
                                                    preload="metadata"
                                                    src={previewVideoUrl}
                                                />
                                            ) : (
                                                <div className="cd-video-placeholder">
                                                    <div className="cd-play-button">
                                                        <Play size={32} fill="#000" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="cd-lessons-section">
                                        {lessonsData.length ? (
                                            lessonsData.map((lesson) => (
                                                <div key={lesson.id} className="cd-lesson-card">
                                                    <div className="cd-lesson-content">
                                                        <div className="cd-lesson-badge">
                                                            {lesson.number || `Lesson ${lesson.id}`}
                                                        </div>

                                                        <h3 className="cd-lesson-title">
                                                            {lesson.title}
                                                        </h3>

                                                        <p className="cd-lesson-description">
                                                            {lesson.description || 'No description available.'}
                                                        </p>

                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                marginTop: '12px',
                                                                flexWrap: 'wrap',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    borderRadius: '999px',
                                                                    fontSize: '12px',
                                                                    fontWeight: 600,
                                                                    background: lesson.watched ? '#CEFF1B' : '#e9e9e9',
                                                                    color: '#000',
                                                                }}
                                                            >
                                                                {lesson.watched ? 'Watched' : 'Not watched'}
                                                            </span>

                                                            {lesson.media_type ? (
                                                                <span
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        borderRadius: '999px',
                                                                        fontSize: '12px',
                                                                        fontWeight: 600,
                                                                        background: '#f3f3f3',
                                                                        color: '#111',
                                                                    }}
                                                                >
                                                                    {lesson.media_type}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            flexWrap: 'wrap',
                                                        }}
                                                    >
                                                        <button
                                                            className="cd-watch-btn"
                                                            onClick={() => {
                                                                if (lesson.media_url) {
                                                                    window.open(
                                                                        lesson.media_url,
                                                                        '_blank',
                                                                        'noopener,noreferrer'
                                                                    );
                                                                }
                                                            }}
                                                            disabled={!lesson.media_url}
                                                        >
                                                            Watch
                                                        </button>

                                                        <button
                                                            className="cd-watch-btn"
                                                            type="button"
                                                            onClick={() => handleLessonToggle(lesson.id)}
                                                            disabled={lessonLoadingId === lesson.id}
                                                            style={{
                                                                background: lesson.watched ? '#111' : '#CEFF1B',
                                                                color: lesson.watched ? '#fff' : '#000',
                                                            }}
                                                        >
                                                            {lessonLoadingId === lesson.id
                                                                ? 'Saving...'
                                                                : lesson.watched
                                                                    ? 'Unmark'
                                                                    : 'Mark Watched'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="cd-lesson-card">
                                                <div className="cd-lesson-content">
                                                    <div className="cd-lesson-badge">Lesson</div>
                                                    <h3 className="cd-lesson-title">No lessons available</h3>
                                                    <p className="cd-lesson-description">
                                                        No lessons have been added for this course yet.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="cd-deliverables-section">
                                        <h2 className="cd-section-title">Resources</h2>

                                        <div className="cd-files-list-container">
                                            <div className="cd-files-list">
                                                {resources.length ? (
                                                    resources.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="cd-file-item"
                                                        >
                                                            <div className="cd-file-info">
                                                                <h3>{item.title}</h3>

                                                                <div className="cd-file-meta">
                                                                    <span>
                                                                        Updated {item.updated_at_display || '—'}
                                                                    </span>
                                                                    <span className="cd-meta-dot">•</span>
                                                                    <span>{item.size_label || '—'}</span>
                                                                </div>

                                                                <div className="cd-file-tags">
                                                                    {normalizeArray(item.tags).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className={`cd-tag ${String(tag).toLowerCase()}`}
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="cd-file-actions">
                                                                <button
                                                                    className="cd-action-btn primary"
                                                                    onClick={() => handleOpenResource(item)}
                                                                    disabled={!item.url}
                                                                >
                                                                    {item.type === 'link' ? (
                                                                        <ExternalLink size={18} />
                                                                    ) : (
                                                                        <Download size={18} />
                                                                    )}
                                                                    {item.type === 'link' ? 'Open link' : 'Download'}
                                                                </button>

                                                                <button
                                                                    className="cd-action-btn secondary"
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
                                                    <div className="cd-file-item">
                                                        <div className="cd-file-info">
                                                            <h3>No resources available</h3>
                                                            <div className="cd-file-meta">
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
                                            teamName={
                                                creator.full_name ||
                                                creator.username ||
                                                'Profile'
                                            }
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
                                            buttonText={profileButtonText}
                                            onViewProfile={() => {
                                                if (creator?.username) {
                                                    navigate(`/public-user-profile/${creator.username}`);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="cd-faq-section">
                                        <div className="cd-review-header">
                                            <h2>Frequently Asked Questions</h2>
                                            <div className="cd-header-line"></div>
                                        </div>

                                        <div className="cd-faq-list">
                                            {faqData.length ? (
                                                faqData.map((faq, index) => (
                                                    <div
                                                        key={faq.id || index}
                                                        className={`cd-faq-item ${activeFaq === index ? "active" : ""}`}
                                                    >
                                                        <div
                                                            className="cd-faq-question"
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
                                                            <div className="cd-faq-answer">
                                                                <p>{faq.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="cd-faq-item active">
                                                    <div className="cd-faq-question">
                                                        <span>No FAQs available</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="cd-review-section">
                                        <div className="cd-review-header">
                                            <h2>Review</h2>
                                            <div className="cd-header-line"></div>
                                        </div>

                                        <div className="cd-review-card">
                                            <div className="cd-review-content">
                                                <p className="cd-review-text">
                                                    {reviewComment}
                                                </p>

                                                <div className="cd-review-footer">
                                                    <div className="cd-stars">
                                                        {ratingStars}
                                                    </div>

                                                    <button className="cd-post-btn" disabled>
                                                        {review ? 'Posted' : 'No Review'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <OrderDetailsSection
                                        prefix="cd"
                                        blocks={orderDetailsBlocks}
                                    />
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

export default CourseDeliverables;