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
  Check,
  ChevronDown,
  Clock,
  X,
  Star,
  Award,
  Zap
} from "lucide-react";
import Swal from "sweetalert2";
import "./DigitalProductListing.css";
import Navbar from "../../../components/layout/Navbar";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "../../dashboard/pages/TeamProfileLight.css";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import DetailedTeamCard from "../components/DetailedTeamCard";
import FAQAccordion from "../components/FAQAccordion";
import { getListingByUsername } from "../api/listingApi";

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

const getPortfolioMedia = (project) => {
  const media = Array.isArray(project?.media) ? project.media : [];
  if (media.length) {
    return media
      .map((item) => ({
        url: item?.url || toMediaUrl(item?.path || ""),
        type: item?.type || "image",
      }))
      .filter((item) => item.url);
  }

  const fallback = getPortfolioImage(project);
  return fallback ? [{ url: fallback, type: "image" }] : [];
};

const currencyText = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return `$${numeric}`;
};

const normalizeFaqs = (faqs = []) =>
  (Array.isArray(faqs) ? faqs : [])
    .map((faq, index) => ({
      id: faq?.id ?? index,
      question: faq?.question || faq?.q || "",
      answer: faq?.answer || faq?.a || "",
    }))
    .filter((faq) => faq.question || faq.answer);

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

const DigitalProductListing = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const { listingusername } = useParams();

  const [activeImg, setActiveImg] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMoreListings, setShowMoreListings] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImgIndex, setModalImgIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [activePortfolioProject, setActivePortfolioProject] = useState(null);
  const [activePortfolioProjectIndex, setActivePortfolioProjectIndex] = useState(0);
  const [activePortfolioMediaIndex, setActivePortfolioMediaIndex] = useState(0);

  const [favorites, setFavorites] = useState(new Set());
  const [filter, setFilter] = useState("All");

  const recommendedGridRef = useRef(null);
  const moreFromCreatorGridRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const isAuthenticated = !!(localStorage.getItem("uh_auth_token") || localStorage.getItem("token") || localStorage.getItem("auth_token"));

  useEffect(() => {
    if (!isAuthenticated) {
      setSidebarOpen(false);
    }
  }, [isAuthenticated]);

  const [listing, setListing] = useState(null);
  const [creator, setCreator] = useState(null);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [recommendedListings, setRecommendedListings] = useState([]);
  const [moreFromUserListings, setMoreFromUserListings] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setPageError("");

        const res = await getListingByUsername(listingusername);

        const listingData = res?.listing || res?.data?.listing || res?.data || null;

        if (!listingData) {
          throw new Error("Digital product listing not found.");
        }

        const creatorData =
          res?.creator || res?.data?.creator || listingData?.creator || null;

        const portfolio =
          res?.portfolio_projects ||
          res?.data?.portfolio_projects ||
          listingData?.portfolio_projects ||
          [];

        const faqs =
          res?.faqs || res?.data?.faqs || listingData?.faqs || [];

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
      } catch (err) {
        setPageError(err?.message || "Failed to load digital product listing.");
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

    const combined = [...new Set([coverUrl, ...normalizedGallery].filter(Boolean))];

    return combined.length ? combined : [];
  }, [listing]);

  const details = listing?.details || {};
  const detailIncluded = Array.isArray(details?.included) ? details.included : [];
  const detailTools = Array.isArray(listing?.tools)
    ? listing.tools
    : Array.isArray(details?.tools)
      ? details.tools
      : [];
  const deliveryFormats = details?.delivery_format
    ? [details.delivery_format]
    : [];

  const portfolioData = useMemo(() => {
    const items = (Array.isArray(portfolioProjects) ? portfolioProjects : []).map(
      (project) => ({
        id: project?.id,
        image: getPortfolioImage(project),
        media: getPortfolioMedia(project),
        title: project?.title || "Untitled Project",
        description: project?.description || "",
        cost: currencyText(project?.cost_cents ?? project?.cost),
      }),
    );

    return {
      featured: items[0] || null,
      items: items.slice(1),
      all: items,
    };
  }, [portfolioProjects]);

  const openPortfolioModal = (index) => {
    const items = portfolioData.all || [];
    if (!items[index]) return;
    setActivePortfolioProjectIndex(index);
    setActivePortfolioProject(items[index]);
    setActivePortfolioMediaIndex(0);
  };

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
    listingType: item?.listing_type || "digital_product",
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

  if (loading) {
    return (
      <div className={`user-page ${theme} min-h-screen`}>
        {isAuthenticated ? (
          <UserNavbar
            toggleSidebar={() => setSidebarOpen((p) => !p)}
            isSidebarOpen={sidebarOpen}
            theme={theme}
          />
        ) : (
          <Navbar />
        )}
        <div className="pt-[72px] flex relative z-10">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="overflow-y-auto h-[calc(100vh-72px)]">
              <div className="tsl-page">
                <div className="content-card">
                  <p className="card-text">Loading digital product listing...</p>
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
        {isAuthenticated ? (
          <UserNavbar
            toggleSidebar={() => setSidebarOpen((p) => !p)}
            isSidebarOpen={sidebarOpen}
            theme={theme}
          />
        ) : (
          <Navbar />
        )}
        <div className="pt-[72px] flex relative z-10">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="overflow-y-auto h-[calc(100vh-72px)]">
              <div className="tsl-page">
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
      {isAuthenticated ? (
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />
      ) : (
        <Navbar />
      )}

      <div className="pt-[72px] flex relative z-10 transition-all duration-300">
        {isAuthenticated && (
          <Sidebar
            expanded={sidebarOpen}
            setExpanded={setSidebarOpen}
            showSettings={false}
            setShowSettings={() => {}}
            activeSetting="dashboard"
            onSectionChange={() => {}}
            theme={theme}
            setTheme={setTheme}
          />
        )}
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div className="overflow-y-auto h-[calc(100vh-72px)]">
            <div className={`tsl-page ${theme}`}>
              <div className="tsl-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h1 className="tsl-title">{listing?.title || "Digital Product"}</h1>
                  {listing?.ai_powered && (
                    <div className="tsl-mp-aiBadge" style={{ marginBottom: '8px' }}>
                      <Zap size={12} fill="#b060ff" color="#b060ff" />
                      <span>AI POWERED</span>
                    </div>
                  )}
                </div>
                <div className="tsl-header-actions">
                  <button
                    className="tsl-icon-btn"
                    title="Share"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Link copied to clipboard!",
                        showConfirmButton: false,
                        timer: 2000,
                        background: "#CEFF1B",
                        color: "#000",
                      });
                    }}
                  >
                    <Share2 size={20} />
                  </button>
                  <button
                    className="tsl-icon-btn"
                    title="Report"
                    onClick={() => {
                      Swal.fire({
                        title: "Report Listing",
                        text: "Reason for reporting:",
                        input: "select",
                        inputOptions: {
                          inappropriate: "Inappropriate Content",
                          misleading: "Misleading Information",
                          spam: "Spam",
                          other: "Other",
                        },
                        background: "#0b0b0b",
                        color: "#fff",
                        confirmButtonColor: "#CEFF1B",
                        confirmButtonText: "<span style='color:#000'>Submit Report</span>",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire({
                            title: "Reported!",
                            text: "Our team will review this listing.",
                            icon: "success",
                            background: "#0b0b0b",
                            color: "#fff",
                            confirmButtonColor: "#CEFF1B",
                            confirmButtonText: "<span style='color:#000'>OK</span>",
                          });
                        }
                      });
                    }}
                  >
                    <Flag size={20} />
                  </button>
                  <button
                    className="tsl-icon-btn"
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

              <div className="tsl-container">
                <div className="tsl-main">
                  <div className="tsl-slider-wrap">
                    <div className="tsl-main-img-box">
                      {galleryImages.length ? (
                        <img
                          src={galleryImages[activeImg]}
                          alt={listing?.title}
                          className="tsl-main-img"
                        />
                      ) : (
                        <div className="tsl-main-img" />
                      )}

                      {galleryImages.length > 1 && (
                        <>
                          <button
                            className="tsl-slider-btn left"
                            onClick={() =>
                              setActiveImg((prev) =>
                                prev === 0 ? galleryImages.length - 1 : prev - 1,
                              )
                            }
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            className="tsl-slider-btn right"
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
                          className="tsl-expand-btn"
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
                      <div className="tsl-thumbs">
                        {galleryImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Thumb"
                            className={`tsl-thumb ${activeImg === idx ? "active" : ""}`}
                            onClick={() => setActiveImg(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="tsl-profile-mini-card">
                    <div className="tsl-pmc-left">
                      <div className="tsl-pmc-avatar-wrap">
                        <div className="tsl-pmc-avatar-bg">
                          {creator?.avatar_url ? (
                            <img
                              src={creator.avatar_url}
                              alt={creator?.full_name || "user"}
                              className="tsl-pmc-avatar-img"
                            />
                          ) : (
                            <span className="tsl-avatar-fallback">
                              {(creator?.full_name || "U")[0].toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="tsl-pmc-status-dot"></div>
                      </div>
                      <div className="tsl-pmc-info">
                        <div className="tsl-pmc-name-row">
                          <span className="tsl-pmc-name">
                            {creator?.full_name || creator?.name || username}
                          </span>
                          {creator?.verified && (
                            <div className="tsl-verified-badge" title="Verified Creator">
                              <Award size={14} fill="#CEFF1B" color="#000" />
                            </div>
                          )}
                          <div className="tsl-pmc-online-badge">
                            <div className="tsl-pmc-online-dot"></div>
                            <span>Online</span>
                          </div>
                        </div>
                        <div className="tsl-pmc-meta-row" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div className="tsl-pmc-rating">
                            <Star size={14} fill="#CEFF1B" color="#CEFF1B" />
                            <span>{creator?.rating || "5.0"}</span>
                            <span className="tsl-pmc-rev-count">({creator?.review_count || "24"})</span>
                          </div>
                          <div className="tsl-pmc-meta">
                            <Clock size={14} />
                            <span>Avg response: {creator?.avg_response || "1 hour"}</span>
                          </div>
                        </div>
                        <div className="tsl-pmc-role-row">
                          <span className="tsl-pmc-role">
                            {creator?.title || "Creator"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="tsl-pmc-view-btn"
                      onClick={() =>
                        creator?.username
                          ? navigate(`/public-user-profile/${creator.username}`)
                          : null
                      }
                    >
                      View profile
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="tsl-section">
                    <h2>Description</h2>
                    <p>{listing?.short_description || listing?.about || "No description added yet."}</p>



                    <div className="tsl-tech-section">
                      <h4 className="tsl-detail-title">Tools & Technologies</h4>
                      <div className="tsl-tech-tags">
                        {detailTools.length ? (
                          detailTools.map((tool) => (
                            <span key={tool} className="tsl-tech-tag">
                              {tool}
                            </span>
                          ))
                        ) : (
                          <span className="tsl-tech-tag">No tools added</span>
                        )}
                      </div>
                    </div>

                    <div className="tsl-delivery-section">
                      <h4 className="tsl-detail-title">Delivery Format</h4>
                      <div className="tsl-delivery-tags">
                        {deliveryFormats.length ? (
                          deliveryFormats.map((fmt) => (
                            <span key={fmt} className="tsl-delivery-tag">
                              {fmt}
                            </span>
                          ))
                        ) : (
                          <span className="tsl-delivery-tag">No delivery format added</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tsl-pricing-card">
                  <div className="tsl-pricing-content">
                    <div className="tsl-price-row">
                      <div className="tsl-price-info">
                        <span className="tsl-price-label">Price</span>
                        <span className="tsl-price">
                          {currencyText(details?.price)}
                        </span>
                      </div>
                    </div>

                    <div className="tsl-divider"></div>

                    <h4 className="tsl-inclusions-title">What's included</h4>
                    <div className="tsl-inclusions-list">
                      {detailIncluded.length ? (
                        detailIncluded.map((item, idx) => (
                          <div key={idx} className="tsl-inclusion-item">
                            <div className="tsl-check-circle">
                              <Check size={12} strokeWidth={3} />
                            </div>
                            <span>{item}</span>
                          </div>
                        ))
                      ) : (
                        <div className="tsl-inclusion-item">
                          <span>No inclusions added yet.</span>
                        </div>
                      )}
                    </div>



                    <div className="tsl-pricing-actions">
                      <button className="tsl-btn-primary">Buy now</button>
                      <button className="tsl-btn-outline">Add to cart</button>
                    </div>
                  </div>
                </div>
              </div>

              <section className="portfolio-section">
                <div className="portfolio-header">
                  <h3 className="portfolio-title">My Portfolio</h3>
                  <div className="portfolio-header-line"></div>
                </div>

                {portfolioData.featured ? (
                  <>
                    <div className="portfolio-featured-card">
                      <div className="portfolio-featured-image">
                        <img
                          src={portfolioData.featured.image}
                          alt={portfolioData.featured.title}
                          onClick={() => openPortfolioModal(0)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>

                      <div className="portfolio-featured-content">
                        <h4 className="portfolio-featured-title">
                          {portfolioData.featured.title}
                        </h4>
                        <p className="portfolio-featured-desc">
                          {portfolioData.featured.description}
                        </p>
                        <div className="portfolio-featured-cost">
                          <span className="cost-label">Project cost</span>
                          <span className="cost-value">{portfolioData.featured.cost}</span>
                        </div>
                      </div>
                    </div>

                    {activePortfolioProject &&
                      createPortal(
                        <div
                          className="portfolio-modal-backdrop"
                          onClick={() => setActivePortfolioProject(null)}
                        >
                          <div
                            className={`portfolio-modal-content ${theme}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="portfolio-modal-scroll">
                              <div className="portfolio-modal-topbar">
                                <div className="portfolio-modal-brand">
                                  <div className="portfolio-brand-circle"></div>
                                  <span>Made by {creator?.full_name || creator?.name || username}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="portfolio-modal-nav">
                                    <button
                                      className="nav-arrow left"
                                      onClick={() => {
                                        const allItems = portfolioData.all || [];
                                        const prevIndex =
                                          activePortfolioProjectIndex > 0
                                            ? activePortfolioProjectIndex - 1
                                            : allItems.length - 1;
                                        setActivePortfolioProjectIndex(prevIndex);
                                        setActivePortfolioProject(allItems[prevIndex]);
                                        setActivePortfolioMediaIndex(0);
                                      }}
                                    >
                                      ◀
                                    </button>
                                    <span className="portfolio-modal-counter">
                                      {activePortfolioProjectIndex + 1} of {portfolioData.all.length}
                                    </span>
                                    <button
                                      className="nav-arrow right"
                                      onClick={() => {
                                        const allItems = portfolioData.all || [];
                                        const nextIndex =
                                          activePortfolioProjectIndex < allItems.length - 1
                                            ? activePortfolioProjectIndex + 1
                                            : 0;
                                        setActivePortfolioProjectIndex(nextIndex);
                                        setActivePortfolioProject(allItems[nextIndex]);
                                        setActivePortfolioMediaIndex(0);
                                      }}
                                    >
                                      ▶
                                    </button>
                                  </div>

                                  <button
                                    className="portfolio-modal-close"
                                    onClick={() => setActivePortfolioProject(null)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              <div className="portfolio-modal-info">
                                <div className="portfolio-info-header">
                                  <h3>{activePortfolioProject.title}</h3>
                                </div>
                                <p>{activePortfolioProject.description}</p>

                                <div className="portfolio-modal-cost">
                                  <span className="cost-label">Project cost</span>
                                  <span className="cost-value">{activePortfolioProject.cost}</span>
                                </div>
                              </div>

                              <div className="portfolio-modal-image">
                                <img
                                  src={
                                    activePortfolioProject.media?.[activePortfolioMediaIndex]?.url ||
                                    activePortfolioProject.image
                                  }
                                  alt={activePortfolioProject.title}
                                />
                              </div>

                              {(activePortfolioProject.media || []).length > 1 && (
                                <div className="tsl-thumbs" style={{ marginTop: "16px" }}>
                                  {activePortfolioProject.media.map((item, idx) => (
                                    <img
                                      key={idx}
                                      src={item.url}
                                      alt={`${activePortfolioProject.title}-${idx}`}
                                      className={`tsl-thumb ${activePortfolioMediaIndex === idx ? "active" : ""}`}
                                      onClick={() => setActivePortfolioMediaIndex(idx)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>,
                        document.body,
                      )}

                    {!!portfolioData.items.length && (
                      <div className="portfolio-grid-card">
                        <div className="portfolio-grid">
                          {portfolioData.items.map((item, index) => (
                            <div key={item.id || index} className="portfolio-item">
                              <div className="portfolio-item-image">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  onClick={() => openPortfolioModal(index + 1)}
                                  style={{ cursor: "pointer" }}
                                />
                              </div>

                              <div className="portfolio-item-info">
                                <div className="portfolio-item-left">
                                  <span className="portfolio-item-title">{item.title}</span>
                                  <span className="portfolio-item-desc">{item.description}</span>
                                </div>

                                <div className="portfolio-item-right">
                                  <span className="cost-label">Project cost</span>
                                  <span className="cost-value">{item.cost}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="content-card">
                    <p className="card-text">No portfolio projects found.</p>
                  </div>
                )}
              </section>

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
                              navigate(
                                `/${listingTypeToRouteSlug(item.listingType)}/${item.listingUsername}`,
                              )
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
                rating={creator?.rating || 5.0}
                reviewCount={creator?.review_count || 24}
                description={creator?.about || creator?.bio || ""}
                languages={Array.isArray(creator?.languages) ? creator.languages : []}
                karma={creator?.karma || "—"}
                projectsCompleted={creator?.projects_completed || "—"}
                responseSpeed={creator?.avg_response || "1 hour"}
                memberSince={creator?.member_since || creator?.created_at || ""}
                skills={Array.isArray(creator?.skills) ? creator.skills : []}
                avatarUrl={creator?.avatar_url || ""}
                onViewProfile={() => {
                  if (creator?.username) {
                    navigate(`/public-user-profile/${creator.username}`);
                  }
                }}
              />

              <FAQAccordion faqData={faqData} theme={theme} />

              <section className="reviews-section">
                <div className="reviews-header">
                  <h3 className="reviews-title">Reviews</h3>
                  <div className="reviews-header-line"></div>
                </div>
                <div className="reviews-container">
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <span className="rating-score">4.9</span>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill={i < 4 ? "#CEFF1B" : "none"} color="#CEFF1B" />
                        ))}
                      </div>
                      <span className="review-count">24 reviews</span>
                    </div>
                    <div className="rating-breakdown">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="rating-bar-row">
                          <span className="rating-label">{star}</span>
                          <div className="rating-bar">
                            <div
                              className="rating-bar-fill"
                              style={{ width: star === 5 ? "85%" : star === 4 ? "10%" : "2%" }}
                            ></div>
                          </div>
                          <span className="rating-count">{star === 5 ? "20" : star === 4 ? "3" : "0"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="reviews-list">
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-avatar"></div>
                        <div className="reviewer-info">
                          <span className="reviewer-name">Alex Johnson</span>
                          <div className="review-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill="#CEFF1B" color="#CEFF1B" />
                            ))}
                          </div>
                        </div>
                        <span className="review-date">2 weeks ago</span>
                      </div>
                      <p className="review-text">
                        Excellent product! The quality is top-notch and it saved me hours of work.
                        Highly recommended for anyone looking for professional assets.
                      </p>
                    </div>
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-avatar"></div>
                        <div className="reviewer-info">
                          <span className="reviewer-name">Sarah Miller</span>
                          <div className="review-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < 4 ? "#CEFF1B" : "none"} color="#CEFF1B" />
                            ))}
                          </div>
                        </div>
                        <span className="review-date">1 month ago</span>
                      </div>
                      <p className="review-text">
                        Great value for money. Some minor issues with the documentation but the
                        creator was very helpful in resolving them.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="tsl-listing-container">
                <h2 className="tsl-sectionTitle">Recommended</h2>
                <div className="tsl-mp-grid" ref={recommendedGridRef}>
                  {recommendedProducts.map((p, idx) => (
                    <article className="tsl-mp-card" key={p.id || idx}>
                      <div className="tsl-mp-imgWrap">
                        <img className="tsl-mp-img" src={p.image} alt={p.title} />
                      </div>
                      <div className="tsl-mp-cardBody">
                        <div className="tsl-mp-topLine">
                          <div className="tsl-mp-user">
                            <div className="tsl-mp-avatar">
                              {creator?.avatar_url ? (
                                <img
                                  src={creator.avatar_url}
                                  alt={creator?.full_name || "user"}
                                  className="tsl-avatar-img"
                                />
                              ) : (
                                <span className="tsl-avatar-fallback">
                                  {(creator?.full_name || "U")[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="tsl-mp-userName">
                              {p.creatorUsername || creator?.username || ""}
                            </span>
                          </div>
                        </div>
                        <p className="tsl-mp-desc">{p.title}</p>
                        <div className="tsl-mp-bottomRow">
                          <div className="tsl-mp-price">Price: {p.price}</div>
                          <button
                            className="tsl-mp-cta"
                            type="button"
                            onClick={() =>
                              navigate(
                                `/${listingTypeToRouteSlug(p.listingType)}/${p.listingUsername}`,
                              )
                            }
                          >
                            Know More
                            <ChevronRight size={12} className="tsl-mp-ctaIcon" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <button
                  className="tsl-mp-floatArrow left"
                  type="button"
                  onClick={() => scrollGridRef(recommendedGridRef, "left")}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="tsl-mp-floatArrow right"
                  type="button"
                  onClick={() => scrollGridRef(recommendedGridRef, "right")}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="tsl-listing-container" style={{ marginTop: "40px" }}>
                <h2 className="tsl-sectionTitle">
                  More from {creator?.full_name || creator?.name || username}
                </h2>
                <div className="tsl-mp-grid" ref={moreFromCreatorGridRef}>
                  {moreFromCreator.map((p, idx) => (
                    <article className="tsl-mp-card" key={p.id || idx}>
                      <div className="tsl-mp-imgWrap">
                        <img className="tsl-mp-img" src={p.image} alt={p.title} />
                      </div>
                      <div className="tsl-mp-cardBody">
                        <div className="tsl-mp-topLine">
                          <div className="tsl-mp-user">
                            <div className="tsl-mp-avatar">
                              {creator?.avatar_url ? (
                                <img
                                  src={creator.avatar_url}
                                  alt={creator?.full_name || "user"}
                                  className="tsl-avatar-img"
                                />
                              ) : (
                                <span className="tsl-avatar-fallback">
                                  {(creator?.full_name || "U")[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="tsl-mp-userName">
                              {p.creatorUsername || creator?.username || ""}
                            </span>
                          </div>
                        </div>
                        <p className="tsl-mp-desc">{p.title}</p>
                        <div className="tsl-mp-bottomRow">
                          <div className="tsl-mp-price">Price: {p.price}</div>
                          <button
                            className="tsl-mp-cta"
                            type="button"
                            onClick={() =>
                              navigate(
                                `/${listingTypeToRouteSlug(p.listingType)}/${p.listingUsername}`,
                              )
                            }
                          >
                            Know More
                            <ChevronRight size={12} className="tsl-mp-ctaIcon" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <button
                  className="tsl-mp-floatArrow left"
                  type="button"
                  onClick={() => scrollGridRef(moreFromCreatorGridRef, "left")}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="tsl-mp-floatArrow right"
                  type="button"
                  onClick={() => scrollGridRef(moreFromCreatorGridRef, "right")}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageModal &&
        createPortal(
          <div className="tsl-image-modal-backdrop" onClick={() => setShowImageModal(false)}>
            <button className="tsl-modal-close-btn" onClick={() => setShowImageModal(false)}>
              <X size={24} />
            </button>

            <div className="tsl-modal-content-wrap" onClick={(e) => e.stopPropagation()}>
              <button
                className="tsl-modal-nav-btn"
                onClick={() =>
                  setModalImgIndex((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1,
                  )
                }
              >
                <ChevronLeft size={32} />
              </button>

              <div className="tsl-modal-img-container">
                <img
                  src={galleryImages[modalImgIndex]}
                  alt={listing?.title}
                  className="tsl-modal-main-img"
                />
              </div>

              <button
                className="tsl-modal-nav-btn"
                onClick={() =>
                  setModalImgIndex((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1,
                  )
                }
              >
                <ChevronRight size={32} />
              </button>
            </div>

            <div className="tsl-modal-thumbs-strip" onClick={(e) => e.stopPropagation()}>
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`tsl-modal-thumb-item ${modalImgIndex === idx ? "active" : ""}`}
                  onClick={() => setModalImgIndex(idx)}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}

      <MobileBottomNav theme={theme} />
    </div>
  );
};

export default DigitalProductListing;
