import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
  Share2,
  Flag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ChevronDown,
  Clock,
  X,
  Play,
  CheckCircle2 
} from "lucide-react";
import "./CourseListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import "../../../Darkuser.css";
import "../../dashboard/pages/TeamProfileLight.css";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import DetailedTeamCard from "../components/DetailedTeamCard";
import FAQAccordion from "../components/FAQAccordion";
import { getListingByUsername } from "../api/listingApi";
import axios from "axios";

// Fallback to get token from localStorage if authApi isn't exported correctly
const getAuthToken = () => localStorage.getItem("token") || localStorage.getItem("auth_token");

const toMediaUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage/")) return path;
  if (path.startsWith("storage/")) return `/${path}`;
  return `/storage/${path}`;
};

const getPortfolioImage = (project) => {
  if (project?.cover_media?.url) return project.cover_media.url;
  if (project?.cover_media?.path) return toMediaUrl(project.cover_media.path);

  const media = Array.isArray(project?.media) ? project.media : [];
  const first = media.find((m) => m?.url || m?.path);

  if (first?.url) return first.url;
  if (first?.path) return toMediaUrl(first.path);

  return "";
};

const currencyText = (value) => {
  if (value === null || value === undefined || value === "") return "Free";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return `$${numeric}`;
};

const listingTypeToRouteSlug = (type = "") => {
  switch (type) {
    case "digital_product":
      return "digital-product";
    case "service":
      return "service";
    case "course":
      return "course";
    case "webinar":
      return "webinar";
    default:
      return type || "listing";
  }
};

const normalizeFaqs = (faqs = []) =>
  (Array.isArray(faqs) ? faqs : [])
    .map((faq, index) => ({
      id: faq?.id ?? index,
      question: faq?.question || faq?.q || "",
      answer: faq?.answer || faq?.a || "",
    }))
    .filter((faq) => faq.question || faq.answer);

const CourseListing = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const { listingusername } = useParams();

  const [activeImg, setActiveImg] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMoreListings, setShowMoreListings] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImgIndex, setModalImgIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [activeItem, setActiveItem] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [filter, setFilter] = useState("All");

  const recommendedGridRef = useRef(null);
  const moreFromCreatorGridRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [listing, setListing] = useState(null);
  const [creator, setCreator] = useState(null);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [recommendedListings, setRecommendedListings] = useState([]);
  const [moreFromUserListings, setMoreFromUserListings] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledOrderId, setEnrolledOrderId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setPageError("");

        const res = await getListingByUsername(listingusername);

        const listingData =
          res?.listing ||
          res?.data?.listing ||
          res?.data ||
          null;

        if (!listingData) {
          throw new Error("Course listing not found.");
        }

        const creatorData =
          res?.creator ||
          res?.data?.creator ||
          listingData?.creator ||
          null;

        const portfolio =
          res?.portfolio_projects ||
          res?.data?.portfolio_projects ||
          listingData?.portfolio_projects ||
          [];

        const faqs =
          res?.faqs ||
          res?.data?.faqs ||
          listingData?.faqs ||
          [];

        const recommended =
          res?.recommended_listings ||
          res?.data?.recommended_listings ||
          listingData?.recommended_listings ||
          [];

        const moreFromUser =
          res?.more_from_user ||
          res?.data?.more_from_user ||
          listingData?.more_from_user ||
          [];

        setListing(listingData);
        setCreator(creatorData);
        setPortfolioProjects(Array.isArray(portfolio) ? portfolio : []);
        setFaqData(normalizeFaqs(faqs));
        setRecommendedListings(Array.isArray(recommended) ? recommended : []);
        setMoreFromUserListings(Array.isArray(moreFromUser) ? moreFromUser : []);
        
        // Assume listingData might contain enrollment status (has_purchased, is_enrolled)
        if (listingData?.is_enrolled || listingData?.has_purchased) {
            setIsEnrolled(true);
            setEnrolledOrderId(listingData?.order_id || listingData?.id);
        }

      } catch (err) {
        setPageError(err?.message || "Failed to load course listing.");
      } finally {
        setLoading(false);
      }
    };

    if (listingusername) {
      fetchListing();
    } else {
      setLoading(false);
      setPageError("Missing listing username.");
    }
  }, [listingusername]);

  const handleEnroll = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/orders/course`,
        { listing_id: listing?.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const orderId = res.data?.order_id || res.data?.id || listing?.id;
      navigate(`/dashboard/client/orders/${orderId}/course`);
    } catch (err) {
      console.error("Failed to enroll:", err);
      // If unauthorized, go to login
      if (err.response?.status === 401) {
          navigate("/login");
      } else {
          alert("Failed to enroll. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/cart`,
        { listing_id: listing?.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart successfully!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      if (err.response?.status === 401) {
          navigate("/login");
      } else {
          alert("Failed to add to cart. Please try again.");
      }
    }
  };

  const scrollGridRef = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 600;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const galleryImages = useMemo(() => {
    const fromGallery = Array.isArray(listing?.gallery) ? listing.gallery : [];
    const normalizedGallery = fromGallery
      .map((item) => item?.url || item?.path || item)
      .map((item) => toMediaUrl(String(item || "")))
      .filter(Boolean);

    const cover =
      listing?.cover_media_url ||
      listing?.cover_media_path ||
      listing?.cover ||
      "";
    const coverUrl = cover ? toMediaUrl(cover) : "";

    const portfolioImages = (Array.isArray(portfolioProjects) ? portfolioProjects : [])
      .map((p) => getPortfolioImage(p))
      .filter(Boolean);

    const combined = [...new Set([coverUrl, ...normalizedGallery, ...portfolioImages].filter(Boolean))];

    return combined.length ? combined : [];
  }, [listing, portfolioProjects]);

  const courseDetails = useMemo(() => listing?.details || {}, [listing]);

  const portfolioData = useMemo(() => {
    const items = (Array.isArray(portfolioProjects) ? portfolioProjects : []).map(
      (project) => ({
        id: project?.id,
        image: getPortfolioImage(project),
        title: project?.title || "Untitled Project",
        description: project?.description || "",
        cost: currencyText(project?.cost_cents ?? project?.cost),
      }),
    );

    return {
      featured: items[0] || null,
      items: items.slice(1),
    };
  }, [portfolioProjects]);

  const mapListingCard = (item) => ({
    id: item?.id,
    listingUsername: item?.listing_username || item?.username || "",
    creatorUsername: item?.creator_username || "",
    image: toMediaUrl(
      item?.cover_media_url ||
        item?.cover_media_path ||
        item?.cover ||
        "",
    ),
    title: item?.title || "Untitled Listing",
    type:
      item?.listing_type === "digital_product"
        ? "Products"
        : item?.listing_type === "service"
          ? "Services"
          : item?.listing_type === "course"
            ? "Courses"
            : item?.listing_type === "webinar"
              ? "Webinars"
              : "All",
    views: item?.views || item?.views_count || 0,
    price:
      item?.price !== undefined && item?.price !== null
        ? currencyText(item.price)
        : item?.price_text || "—",
    listingType: item?.listing_type || "course",
  });

  const listingsData = useMemo(
    () => (Array.isArray(moreFromUserListings) ? moreFromUserListings : []).map(mapListingCard),
    [moreFromUserListings],
  );

  const filteredListings = useMemo(() => {
    return listingsData.filter((l) => {
      if (filter === "All") return true;
      return l.type === filter;
    });
  }, [listingsData, filter]);

  const recommendedProducts = useMemo(
    () => (Array.isArray(recommendedListings) ? recommendedListings : []).map(mapListingCard),
    [recommendedListings],
  );

  const moreFromCreator = useMemo(
    () => (Array.isArray(moreFromUserListings) ? moreFromUserListings : []).map(mapListingCard),
    [moreFromUserListings],
  );

  const learningPoints = Array.isArray(courseDetails?.learning_points)
    ? courseDetails.learning_points
    : [];

  const courseIncludes = Array.isArray(courseDetails?.included)
    ? courseDetails.included
    : [];

  const languages = Array.isArray(courseDetails?.languages)
    ? courseDetails.languages
    : [];

  if (loading) {
    return (
      <div className={`user-page ${theme} min-h-screen`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />
        <div className="pt-[72px] flex relative z-10">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="overflow-y-auto h-[calc(100vh-72px)]">
              <div className="cl-page">
                <div className="content-card">
                  <p className="card-text">Loading course listing...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MobileBottomNav theme={theme} />
      </div>
    );
  }

  if (pageError || !listing) {
    return (
      <div className={`user-page ${theme} min-h-screen`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />
        <div className="pt-[72px] flex relative z-10">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="overflow-y-auto h-[calc(100vh-72px)]">
              <div className="cl-page">
                <div className="content-card">
                  <p className="card-text text-red-600">
                    {pageError || "Listing not found."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MobileBottomNav theme={theme} />
      </div>
    );
  }

  return (
    <div className={`user-page ${theme} min-h-screen`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className="pt-[72px] flex relative z-10 transition-all duration-300">
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div className="overflow-y-auto h-[calc(100vh-72px)]">
            <div className={`cl-page ${theme}`}>
              <div className="cl-header">
                <h1 className="cl-title">{listing?.title || "Course"}</h1>
                <div className="cl-header-actions">
                  <button className="cl-icon-btn">
                    <Share2 size={20} />
                  </button>
                  <button className="cl-icon-btn">
                    <Flag size={20} />
                  </button>
                  <button
                    className="cl-icon-btn"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      size={20}
                      fill={isLiked ? "red" : "none"}
                      color={isLiked ? "red" : "currentColor"}
                    />
                  </button>
                </div>
              </div>

              <div className="cl-container">
                <div className="cl-main">
                  <div className="cl-slider-wrap">
                    <div className="cl-main-img-box">
                      {galleryImages.length ? (
                        <img
                          src={galleryImages[activeImg]}
                          alt={listing?.title}
                          className="cl-main-img"
                        />
                      ) : (
                        <div className="cl-main-img" />
                      )}

                      {galleryImages.length > 1 && (
                        <>
                          <button
                            className="cl-slider-btn left"
                            onClick={() =>
                              setActiveImg((prev) =>
                                prev === 0 ? galleryImages.length - 1 : prev - 1,
                              )
                            }
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            className="cl-slider-btn right"
                            onClick={() =>
                              setActiveImg((prev) =>
                                prev === galleryImages.length - 1 ? 0 : prev + 1,
                              )
                            }
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      {galleryImages.length > 0 && (
                        <button
                          className="cl-expand-btn"
                          onClick={() => {
                            setModalImgIndex(activeImg);
                            setShowImageModal(true);
                          }}
                        >
                          <Maximize2 size={16} />
                        </button>
                      )}
                    </div>

                    {!!galleryImages.length && (
                      <div className="cl-thumbs">
                        {galleryImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Thumb"
                            className={`cl-thumb ${activeImg === idx ? "active" : ""}`}
                            onClick={() => setActiveImg(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="cl-profile-mini-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--cl-bg-secondary)', borderRadius: '12px', marginBottom: '24px' }}>
                    <div className="cl-pmc-left" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div className="cl-pmc-avatar-wrap" style={{ position: 'relative', width: '64px', height: '64px' }}>
                        {creator?.profile_image_url ? (
                            <img src={creator.profile_image_url} alt={creator?.name} className="cl-pmc-avatar-img" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                            <div className="cl-pmc-avatar-bg" style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }}>
                                <span className="cl-pmc-avatar-initials">{creator?.name?.charAt(0) || "C"}</span>
                            </div>
                        )}
                        <div className="cl-pmc-status-dot" style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', background: '#00FF00', border: '2px solid var(--cl-bg-secondary)', borderRadius: '50%' }}></div>
                      </div>
                      <div className="cl-pmc-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="cl-pmc-name-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="cl-pmc-name" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            {creator?.full_name || creator?.name || username}
                          </span>
                          {creator?.is_verified && <img src="/verified-badge.svg" alt="Verified" className="cl-pmc-verified-icon" style={{ width: 16, height: 16 }} />}
                          {listing?.ai_powered && (
                            <span style={{ padding: '2px 8px', background: '#e1e1e1', color: '#333', fontSize: '12px', borderRadius: '12px', fontWeight: 'bold' }}>AI Powered</span>
                          )}
                        </div>
                        <div className="cl-pmc-role-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="cl-pmc-role" style={{ color: '#aaa', fontSize: '14px' }}>
                            {creator?.title || "Creator"}
                          </span>
                          {creator?.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                              <span style={{ color: '#E1F304' }}>★</span>
                              <span style={{ fontWeight: 600 }}>{creator.rating}</span>
                              <span style={{ color: '#888' }}>({creator.reviews_count || 0} reviews)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className="cl-pmc-view-btn"
                      onClick={() =>
                        creator?.username
                          ? navigate(`/public-user-profile/${creator.username}`)
                          : null
                      }
                      style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #666', borderRadius: '8px', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      View profile
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="cl-section">
                    <h2>Description</h2>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{listing?.about || listing?.short_description || "No description added yet."}</p>
                  </div>

                  {learningPoints.length > 0 && (
                    <div className="cl-section">
                      <h2>What you will learn</h2>
                      <ul className="cl-bullet-list" style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {learningPoints.map((point, index) => (
                          <li key={`${point}-${index}`}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {listing?.details?.about_course && (
                    <div className="cl-section">
                      <h2>Prerequisites</h2>
                      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{listing.details.about_course}</p>
                    </div>
                  )}

                  {(Array.isArray(listing?.details?.tools) ? listing.details.tools : []).length > 0 && (
                    <div className="cl-section">
                      <h2>Tools needed</h2>
                      <div className="cl-tools-list" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {listing.details.tools.map((tool) => (
                          <span key={tool} style={{ padding: '6px 12px', background: 'var(--cl-bg-secondary)', border: '1px solid #444', borderRadius: '16px', fontSize: '14px' }}>{tool}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {languages.length > 0 && (
                    <div className="cl-section">
                      <h2>Languages</h2>
                      <div className="cl-languages-row" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', color: '#aaa' }}>
                        {languages.map((language) => <span key={language}>{language}</span>)}
                      </div>
                    </div>
                  )}

                  {courseDetails?.preview_video_url && (
                    <div className="cl-section">
                      <h2>Preview video</h2>
                      <div className="cl-video-card" style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
                        <video
                          src={courseDetails.preview_video_url}
                          controls
                          autoPlay
                          muted
                          style={{ width: "100%", maxHeight: '500px', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  )}

                  {Array.isArray(courseDetails?.lessons) && courseDetails.lessons.length > 0 && (
                    <div className="cl-section">
                      <h2>Lessons</h2>
                      <div className="cl-lessons-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {courseDetails.lessons.map((lesson, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '16px', background: 'var(--cl-bg-secondary)', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ width: '120px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
                                {lesson.media_path ? (
                                    lesson.media_type === 'video' ? (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}><Play size={32} /></div>
                                    ) : (
                                        <img src={`/storage/${lesson.media_path}`} alt={lesson.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Lesson {idx + 1}</div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{idx + 1}. {lesson.title}</h3>
                              <p style={{ margin: 0, fontSize: '14px', color: '#aaa', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lesson.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(206, 255, 27, 0.1)', color: '#CEFF1B', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>
                        {courseDetails.lessons.length} lessons included in this course.
                      </div>
                    </div>
                  )}
                </div>

                <div className="cl-pricing-card">
                  <div className="cl-pricing-content">
                    <div className="cl-price-row">
                      <div className="cl-price-info">
                        <span className="cl-price-label">Price</span>
                        <span className="cl-price">
                          ${listing?.price || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="cl-divider"></div>

                    <div className="cl-section">
                      <h2>Course Includes</h2>

                      {courseIncludes.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                          {courseIncludes.map((point, index) => (
                            <div key={`${point}-${index}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <CheckCircle2 size={18} color="#CEFF1B" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="cl-pricing-actions" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {isEnrolled ? (
                        <button onClick={() => navigate(`/dashboard/client/orders/${enrolledOrderId}/course`)} className="cl-btn-primary" style={{ width: '100%', padding: '14px', background: '#CEFF1B', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Go to Course</button>
                      ) : (
                        <>
                          <button onClick={handleEnroll} className="cl-btn-primary" style={{ width: '100%', padding: '14px', background: '#CEFF1B', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Enroll now</button>
                          <button onClick={handleAddToCart} className="cl-btn-outline" style={{ width: '100%', padding: '14px', background: 'transparent', color: 'inherit', border: '1px solid #444', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>Add to Cart</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <section style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "164.404px",
                      height: "60.002px",
                      background: "#CEFF1B",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "21px",
                        fontWeight: "400",
                        color: "#000",
                      }}
                    >
                      Listings
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    {["All", "Services", "Products", "Courses", "Webinars"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        style={{
                          padding: "12px 26px",
                          borderRadius: "999px",
                          border: filter === item ? "1px solid #ddd" : "none",
                          cursor: "pointer",
                          background:
                            filter === item ? "#fff" : "linear-gradient(#f5f5f5,#e9e9e9)",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,.9),0 2px 8px rgba(0,0,0,.06)",
                          fontSize: "15px",
                          fontWeight: "500",
                          color: "#000",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="listings-grid">
                  {filteredListings
                    .slice(0, showMoreListings ? filteredListings.length : 6)
                    .map((item, index) => (
                      <div key={item.id || index} className="listing-card">
                        <div className="listing-image">
                          <img src={item.image} alt={item.title} />
                        </div>

                        <div className="listing-info">
                          <div className="listing-title-row">
                            <h4 className="listing-title">{item.title}</h4>
                            <span className="listing-type">{item.type}</span>
                          </div>

                          <div className="listing-meta">
                            <div className="listing-views">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              <span>{item.views} views</span>
                            </div>
                            <div className="listing-price">{item.price}</div>
                          </div>
                        </div>

                        <div className="listing-actions">
                          <button
                            className="btn-view-listing"
                            onClick={() =>
                              navigate(`/${listingTypeToRouteSlug(item.listingType)}/${item.listingUsername}`)
                            }
                          >
                            View Listing
                          </button>
                          <button
                            className="btn-favorite"
                            onClick={() => toggleFavorite(index)}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill={favorites.has(index) ? "#ef4444" : "none"}
                              stroke={favorites.has(index) ? "#ef4444" : "currentColor"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "40px 0",
                }}
              >
                <button
                  onClick={() => setShowMoreListings(!showMoreListings)}
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "#CEFF1B",
                    borderRadius: "50%",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    transform: showMoreListings ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ChevronDown size={20} color="#000" />
                </button>
              </div>

              <DetailedTeamCard
                teamName={creator?.full_name || creator?.name || "Creator"}
                location={creator?.location || ""}
                rating={0}
                reviewCount={0}
                description={creator?.bio || ""}
                languages={creator?.languages || []}
                karma={creator?.karma || "—"}
                projectsCompleted={creator?.projects_completed || "—"}
                responseSpeed={creator?.avg_response || "1 hour"}
                memberSince={creator?.created_at || ""}
                skills={creator?.skills || []}
                avatarUrl={creator?.avatar_url || ""}
                onViewProfile={() => {
                  if (creator?.username) {
                    navigate(`/public-user-profile/${creator.username}`);
                  }
                }}
              />

              <FAQAccordion faqData={faqData} theme={theme} />

              {/* Reviews Section */}
              <div className="cl-listing-container" style={{ marginTop: "40px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 className="cl-sectionTitle" style={{ margin: 0 }}>Reviews</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#E1F304', fontSize: '20px' }}>★</span>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>4.9</span>
                    <span style={{ color: '#888', fontSize: '14px' }}>(420 reviews)</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[1, 2].map((review) => (
                    <div key={review} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--cl-border)', paddingBottom: '24px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#555', flexShrink: 0, overflow: 'hidden' }}>
                        <img src={`https://i.pravatar.cc/150?img=${review + 10}`} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold' }}>User Name {review}</span>
                          <span style={{ color: '#888', fontSize: '12px' }}>1 month ago</span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                          {[1,2,3,4,5].map(star => <span key={star} style={{ color: '#E1F304', fontSize: '14px' }}>★</span>)}
                        </div>
                        <p style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                          This course was exactly what I needed. The content is well-structured and the lessons are easy to follow. Highly recommended!
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: '24px', background: 'transparent', border: '1px solid #666', padding: '10px 20px', borderRadius: '8px', color: 'inherit', cursor: 'pointer', fontWeight: '500' }}>
                  See all reviews
                </button>
              </div>

              <div className="cl-listing-container">
                <h2 className="cl-sectionTitle">Recommended</h2>
                <div className="cl-mp-grid" ref={recommendedGridRef}>
                  {recommendedProducts.map((p, idx) => (
                    <article className="cl-mp-card" key={p.id || idx}>
                      <div className="cl-mp-imgWrap">
                        <img className="cl-mp-img" src={p.image} alt={p.title} />
                      </div>
                      <div className="cl-mp-cardBody">
                        <div className="cl-mp-topLine">
                          <div className="cl-mp-user">
                            <div className="cl-mp-avatar"></div>
                            <span className="cl-mp-userName">
                              {p.creatorUsername || p.listingUsername}
                            </span>
                          </div>
                        </div>
                        <p className="cl-mp-desc">{p.title}</p>
                        <div className="cl-mp-bottomRow">
                          <div className="cl-mp-price">Price: {p.price}</div>
                          <button
                            className="cl-mp-cta"
                            type="button"
                            onClick={() =>
                              navigate(`/${listingTypeToRouteSlug(p.listingType)}/${p.listingUsername}`)
                            }
                          >
                            Know More
                            <ChevronRight size={12} className="cl-mp-ctaIcon" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <button
                  className="cl-mp-floatArrow left"
                  type="button"
                  onClick={() => scrollGridRef(recommendedGridRef, "left")}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="cl-mp-floatArrow right"
                  type="button"
                  onClick={() => scrollGridRef(recommendedGridRef, "right")}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {moreFromCreator.length > 0 && (
                  <div className="cl-listing-container" style={{ marginTop: "40px" }}>
                    <h2 className="cl-sectionTitle">
                      More from {creator?.full_name || creator?.name || username}
                    </h2>
                    <div className="cl-mp-grid" ref={moreFromCreatorGridRef}>
                      {moreFromCreator.map((p, idx) => (
                        <article className="cl-mp-card" key={p.id || idx}>
                          <div className="cl-mp-imgWrap">
                            <img className="cl-mp-img" src={p.image} alt={p.title} />
                          </div>
                          <div className="cl-mp-cardBody">
                            <div className="cl-mp-topLine">
                              <div className="cl-mp-user">
                                <div className="cl-mp-avatar"></div>
                                <span className="cl-mp-userName">
                                  {p.creatorUsername || p.listingUsername}
                                </span>
                              </div>
                            </div>
                            <p className="cl-mp-desc">{p.title}</p>
                            <div className="cl-mp-bottomRow">
                              <div className="cl-mp-price">Price: {p.price}</div>
                              <button
                                className="cl-mp-cta"
                                type="button"
                                onClick={() =>
                                  navigate(`/${listingTypeToRouteSlug(p.listingType)}/${p.listingUsername}`)
                                }
                              >
                                Know More
                                <ChevronRight size={12} className="cl-mp-ctaIcon" />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    <button
                      className="cl-mp-floatArrow left"
                      type="button"
                      onClick={() => scrollGridRef(moreFromCreatorGridRef, "left")}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="cl-mp-floatArrow right"
                      type="button"
                      onClick={() => scrollGridRef(moreFromCreatorGridRef, "right")}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showImageModal &&
        createPortal(
          <div className="portfolio-modal-backdrop" onClick={() => setShowImageModal(false)}>
            <div
              className={`portfolio-modal-content ${theme}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="portfolio-modal-topbar">
                <div className="portfolio-modal-brand">
                  <div className="portfolio-brand-circle"></div>
                  <span>{listing?.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="portfolio-modal-nav">
                    <button
                      className="nav-arrow left"
                      onClick={() =>
                        setModalImgIndex((prev) =>
                          prev === 0 ? galleryImages.length - 1 : prev - 1,
                        )
                      }
                    >
                      ◀
                    </button>
                    <span className="portfolio-modal-counter">
                      {modalImgIndex + 1} of {galleryImages.length}
                    </span>
                    <button
                      className="nav-arrow right"
                      onClick={() =>
                        setModalImgIndex((prev) =>
                          prev === galleryImages.length - 1 ? 0 : prev + 1,
                        )
                      }
                    >
                      ▶
                    </button>
                  </div>
                  <button
                    className="portfolio-modal-close"
                    onClick={() => setShowImageModal(false)}
                  >
                    <X />
                  </button>
                </div>
              </div>

              <div className="portfolio-modal-image">
                <img src={galleryImages[modalImgIndex]} alt={listing?.title} />
              </div>
            </div>
          </div>,
          document.body,
        )}

      <MobileBottomNav theme={theme} />
    </div>
  );
};

export default CourseListing;
