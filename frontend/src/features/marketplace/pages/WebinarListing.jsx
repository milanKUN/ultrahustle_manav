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
  Calendar,
  Globe,
  Ticket,
  CalendarPlus,
} from "lucide-react";
import "./WebinarListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import "../../../Darkuser.css";
import "../../dashboard/pages/TeamProfileLight.css";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import FAQAccordion from "../components/FAQAccordion";
import DetailedTeamCard from "../components/DetailedTeamCard";
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

const WebinarListing = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const { username } = useParams();

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

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setPageError("");

        const res = await getListingByUsername(username);

        const listingData =
          res?.listing ||
          res?.data?.listing ||
          res?.data ||
          null;

        if (!listingData) {
          throw new Error("Webinar listing not found.");
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
      } catch (err) {
        setPageError(err?.message || "Failed to load webinar listing.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchListing();
    } else {
      setLoading(false);
      setPageError("Missing listing username.");
    }
  }, [username]);

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

    if (normalizedGallery.length) return normalizedGallery;

    const cover =
      listing?.cover_media_url ||
      listing?.cover_media_path ||
      listing?.cover ||
      "";

    return cover ? [toMediaUrl(cover)] : [];
  }, [listing]);

  const webinarDetails = useMemo(() => listing?.details || {}, [listing]);

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
    listingType: item?.listing_type || "webinar",
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

  const learningPoints = Array.isArray(webinarDetails?.learning_points)
    ? webinarDetails.learning_points
    : [];

  const languages = Array.isArray(webinarDetails?.languages)
    ? webinarDetails.languages
    : [];

  const agendaItems = Array.isArray(webinarDetails?.agenda)
    ? webinarDetails.agenda
    : [];

  if (loading) {
    return (
      <div className={`user-page ${theme} min-h-screen`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />
        <div className="pt-[85px] flex relative z-10">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="overflow-y-auto h-[calc(100vh-85px)]">
              <div className="cl-page">
                <div className="content-card">
                  <p className="card-text">Loading webinar listing...</p>
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
        <div className="pt-[85px] flex relative z-10">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="overflow-y-auto h-[calc(100vh-85px)]">
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

      <div className="pt-[85px] flex relative z-10 transition-all duration-300">
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div className="overflow-y-auto h-[calc(100vh-85px)]">
            <div className={`cl-page ${theme}`}>
              <div className="cl-header">
                <h1 className="cl-title">{listing?.title || "Webinar"}</h1>
                <div className="cl-header-actions">
                  <button className="cl-icon-btn">
                    <Share2 size={20} />
                  </button>
                  <button className="cl-icon-btn">
                    <Flag size={20} />
                  </button>
                  <button className="cl-icon-btn" onClick={() => setIsLiked(!isLiked)}>
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

                  <div className="cl-profile-mini-card">
                    <div className="cl-pmc-left">
                      <div className="cl-pmc-avatar-wrap">
                        <div className="cl-pmc-avatar-bg"></div>
                        <div className="cl-pmc-status-dot"></div>
                      </div>
                      <div className="cl-pmc-info">
                        <div className="cl-pmc-name-row">
                          <span className="cl-pmc-name">
                            {creator?.full_name || creator?.name || username}
                          </span>
                          <div className="cl-pmc-online-badge">
                            <div className="cl-pmc-online-dot"></div>
                            <span>Online</span>
                          </div>
                        </div>
                        <div className="cl-pmc-meta">
                          <Clock size={14} />
                          <span>Avg response: {creator?.avg_response || "1 hour"}</span>
                        </div>
                        <div className="cl-pmc-role-row">
                          <span className="cl-pmc-role">
                            {creator?.title || "Creator"}
                          </span>
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
                    >
                      View profile
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="cl-section">
                    <h2>Description</h2>
                    <p>{listing?.short_description || listing?.about || "No description added yet."}</p>
                  </div>

                  <div className="cl-section">
                    <h2>What you will learn</h2>
                    {learningPoints.length ? (
                      <ul className="cl-bullet-list">
                        {learningPoints.map((point, index) => (
                          <li key={`${point}-${index}`}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No learning points added yet.</p>
                    )}
                  </div>

                  <div className="cl-section">
                    <h2>Tools needed</h2>
                    <div className="cl-tools-list">
                      {(Array.isArray(listing?.tools) ? listing.tools : []).length ? (
                        listing.tools.map((tool) => <span key={tool}>{tool}</span>)
                      ) : (
                        <span>No tools added</span>
                      )}
                    </div>
                  </div>

                  <div className="cl-section">
                    <h2>Languages</h2>
                    <div className="cl-languages-row">
                      {languages.length ? (
                        languages.map((language) => <strong key={language}>{language}</strong>)
                      ) : (
                        <strong>Not specified</strong>
                      )}
                    </div>
                  </div>
                </div>

                <div className="webinar-ticket-card">
                  <div className="ticket-header">
                    <span className="ticket-label">Ticket</span>
                    <div className="ticket-price-row">
                      <span className="ticket-price-symbol">$</span>
                      <h2 className="ticket-price">
                        {webinarDetails?.ticket_price ?? "Free"}
                      </h2>
                    </div>
                  </div>

                  <div className="ticket-divider"></div>

                  <div className="ticket-details-section">
                    <div className="ticket-row-split">
                      <div className="ticket-info-box">
                        <Calendar size={18} />
                        <span>{webinarDetails?.schedule_date || "—"}</span>
                      </div>
                      <div className="ticket-info-box">
                        <Clock size={18} />
                        <span>
                          {webinarDetails?.schedule_start_time || "—"} •{" "}
                          {webinarDetails?.schedule_duration || "—"} min
                        </span>
                      </div>
                    </div>

                    <div className="ticket-info-box full-width">
                      <Globe size={18} />
                      <span>{webinarDetails?.schedule_timezone || "—"}</span>
                    </div>
                  </div>

                  <div className="ticket-actions-group">
                    <button className="btn-get-ticket">
                      <Ticket size={20} />
                      Get ticket
                    </button>

                    <button className="btn-add-calendar">
                      <CalendarPlus size={20} />
                      Add to calendar
                    </button>
                  </div>
                </div>
              </div>

              <section className="cl-agenda-section">
                <h2 className="cl-section-title">Agenda</h2>
                <div className="cl-agenda-container">
                  {agendaItems.length ? (
                    agendaItems.map((item, index) => (
                      <div
                        key={item?.id || index}
                        className="cl-agenda-card"
                      >
                        <div className="cl-agenda-badge">
                          {item?.time || "—"}
                        </div>
                        <h3 className="cl-agenda-title">
                          {item?.topic || "Topic"}
                        </h3>
                        <p className="cl-agenda-desc">
                          {item?.description || "No description added yet."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="content-card">
                      <p className="card-text">No agenda added yet.</p>
                    </div>
                  )}
                </div>
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

export default WebinarListing;