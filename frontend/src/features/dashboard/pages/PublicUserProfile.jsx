import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";

import "../../../pages/InReviewLight.css";
import "./TeamProfileLight.css";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import NavbarLight from "../../../components/layout/Navbar";

import {
  getPublicUserProfile,
  getPublicUserFollowCounts,
} from "../api/personalInfoApi";
import { getPublicUserPortfolio } from "../api/portfolioApi";
import { getPublicUserListings } from "../../marketplace/api/listingApi";

const toMediaUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage/")) return path;
  if (path.startsWith("storage/")) return `/${path}`;
  return `/storage/${path}`;
};

const firstMediaUrl = (project) => {
  if (project?.cover_media?.url) return project.cover_media.url;
  if (project?.cover_media?.path) return toMediaUrl(project.cover_media.path);

  const media = Array.isArray(project?.media) ? project.media : [];
  const first = media.find((m) => m?.url || m?.path);

  if (first?.url) return first.url;
  if (first?.path) return toMediaUrl(first.path);

  return "";
};

const firstListingImage = (listing) => {
  if (listing?.cover_media_url) return listing.cover_media_url;
  if (listing?.cover_image_url) return listing.cover_image_url;
  if (listing?.thumbnail_url) return listing.thumbnail_url;
  if (listing?.image_url) return listing.image_url;

  if (listing?.cover_media?.url) return listing.cover_media.url;
  if (listing?.cover_media?.path) return toMediaUrl(listing.cover_media.path);

  if (listing?.cover_image?.url) return listing.cover_image.url;
  if (listing?.cover_image?.path) return toMediaUrl(listing.cover_image.path);

  if (listing?.featured_image?.url) return listing.featured_image.url;
  if (listing?.featured_image?.path) return toMediaUrl(listing.featured_image.path);

  if (listing?.thumbnail?.url) return listing.thumbnail.url;
  if (listing?.thumbnail?.path) return toMediaUrl(listing.thumbnail.path);

  const gallery = Array.isArray(listing?.gallery) ? listing.gallery : [];
  const media = Array.isArray(listing?.media) ? listing.media : [];
  const files = [...gallery, ...media];
  const first = files.find((m) => m?.url || m?.path);

  if (first?.url) return first.url;
  if (first?.path) return toMediaUrl(first.path);

  return "";
};

const toCurrencyText = (cost, currency = "USD") => {
  if (cost === null || cost === undefined || cost === "") return "—";
  const numeric = Number(cost);
  if (Number.isNaN(numeric)) return String(cost);
  return `${currency} ${numeric}`;
};

const toListingPriceText = (listing) => {
  const currency =
    listing?.currency ||
    listing?.price_currency ||
    listing?.pricing_currency ||
    "USD";

  const rawPrice =
    listing?.price ??
    listing?.starting_price ??
    listing?.base_price ??
    listing?.amount ??
    listing?.budget ??
    listing?.min_price;

  if (rawPrice === null || rawPrice === undefined || rawPrice === "") return "Price on request";

  const numeric = Number(rawPrice);
  if (Number.isNaN(numeric)) return String(rawPrice);

  return `${currency} ${numeric}`;
};

const splitParagraphs = (value) => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
};

const buildLocation = (data) => {
  const parts = [data?.city, data?.state, data?.country]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
  return parts.join(", ");
};

const normalizeTags = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((t) => String(t || "").trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
};

const formatJoinedDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
};

const truncateText = (text, max = 120) => {
  const value = String(text || "").trim();
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
};

const normalizeListingType = (value) => {
  const type = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
  return type || "listing";
};

const PublicTopbar = ({ theme, onGoHome, onGoLogin, onGoSignup }) => {
  return <NavbarLight></NavbarLight>;
};

const PublicUserProfile = (props) => {
  const navigate = useNavigate();
  const { username } = useParams();

  const [theme, setTheme] =
    typeof props.theme === "string" && typeof props.setTheme === "function"
      ? [props.theme, props.setTheme]
      : useState("light");

  const [activeItem, setActiveItem] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [openFollowModal, setOpenFollowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [profileData, setProfileData] = useState(null);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [portfolioData, setPortfolioData] = useState({
    featured: null,
    items: [],
  });
  const [listingData, setListingData] = useState([]);

  const toolsContainerRef = useRef(null);
  const languagesContainerRef = useRef(null);
  const skillsContainerRef = useRef(null);

  const scrollHorizontal = (ref, direction) => {
    if (!ref?.current) return;
    ref.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  useEffect(() => {
    if (!username) return;

    let mounted = true;

    const loadPublicProfile = async () => {
      try {
        setLoading(true);
        setPageError("");

        const [profileRes, followRes, portfolioRes, listingsRes] = await Promise.allSettled([
          getPublicUserProfile(username),
          getPublicUserFollowCounts(username),
          getPublicUserPortfolio(username),
          getPublicUserListings(username),
        ]);

        if (!mounted) return;

        if (profileRes.status === "rejected") {
          throw new Error(profileRes.reason?.message || "Failed to load profile.");
        }

        const profile =
          profileRes.value?.user ||
          profileRes.value?.data?.user ||
          profileRes.value?.data ||
          profileRes.value;

        setProfileData(profile || null);

        if (followRes.status === "fulfilled") {
          const data = followRes.value?.data || followRes.value || {};
          setFollowCounts({
            followers: Number(data?.followers || data?.followers_count || 0) || 0,
            following: Number(data?.following || data?.following_count || 0) || 0,
          });
        } else {
          setFollowCounts({ followers: 0, following: 0 });
        }

        if (portfolioRes.status === "fulfilled") {
          const rawProjects =
            portfolioRes.value?.projects ||
            portfolioRes.value?.data?.projects ||
            [];

          const sorted = Array.isArray(rawProjects)
            ? [...rawProjects].sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
            : [];

          if (sorted.length > 0) {
            const mapped = sorted.map((p) => ({
              image: firstMediaUrl(p),
              title: p?.title ?? "",
              description: p?.description ?? "",
              cost: toCurrencyText(p?.cost_cents, p?.currency || "USD"),
            }));

            setPortfolioData({
              featured: mapped[0] || null,
              items: mapped.slice(1),
            });
          } else {
            setPortfolioData({
              featured: null,
              items: [],
            });
          }
        } else {
          setPortfolioData({
            featured: null,
            items: [],
          });
        }

        if (listingsRes.status === "fulfilled") {
          const rawListings =
            listingsRes.value?.listings ||
            listingsRes.value?.data?.listings ||
            listingsRes.value?.data ||
            [];

          const mappedListings = Array.isArray(rawListings)
            ? rawListings.map((listing, index) => ({
                id: listing?.id ?? index,
                title: String(listing?.title || listing?.name || "Untitled listing").trim(),
                username: String(
                  listing?.username ||
                    listing?.listing_username ||
                    listing?.slug ||
                    ""
                ).trim(),
                listingType: normalizeListingType(
                  listing?.listing_type || listing?.type || listing?.category
                ),
                image: firstListingImage(listing),
                description: String(
                  listing?.short_description ||
                    listing?.description ||
                    listing?.excerpt ||
                    ""
                ).trim(),
                priceText: toListingPriceText(listing),
                raw: listing,
              }))
            : [];

          setListingData(mappedListings);
        } else {
          setListingData([]);
        }
      } catch (e) {
        if (!mounted) return;
        setPageError(e?.message || "Failed to load public user profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPublicProfile();

    return () => {
      mounted = false;
    };
  }, [username]);

  const userData = useMemo(() => {
    const data = profileData || {};

    const name =
      String(data?.display_name || "").trim() ||
      String(data?.full_name || "").trim() ||
      [String(data?.first_name || "").trim(), String(data?.last_name || "").trim()]
        .filter(Boolean)
        .join(" ") ||
      "User";

    const rawUsername = String(data?.username || username || "").trim();
    const formattedUsername = rawUsername
      ? rawUsername.startsWith("@")
        ? rawUsername
        : `@${rawUsername}`
      : "";

    return {
      id: data?.id ?? null,
      name,
      username: formattedUsername,
      title: String(data?.title || "").trim(),
      location: buildLocation(data),
      description: String(data?.short_bio || data?.bio || "").trim(),
      availability: String(data?.availability || "").trim(),
      stats: {
        karma: Number(data?.karma || 0) || 0,
        projectsCompleted:
          (portfolioData.featured ? 1 : 0) + (portfolioData.items?.length || 0),
        averageRating: Number(data?.average_rating || 0) || 0,
        followers: Number(followCounts.followers || 0) || 0,
      },
      badges: Array.isArray(data?.badges) ? data.badges.filter(Boolean) : [],
      hashtags: normalizeTags(data?.hashtags),
      about: splitParagraphs(data?.about),
      skills: Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [],
      tools: Array.isArray(data?.tools) ? data.tools.filter(Boolean) : [],
      languages: Array.isArray(data?.languages) ? data.languages.filter(Boolean) : [],
      avatarUrl: String(data?.avatar_url || data?.avatar || "").trim(),
      joinedText: formatJoinedDate(data?.created_at),
    };
  }, [profileData, username, followCounts, portfolioData]);

  const allPortfolioItems = useMemo(() => {
    return portfolioData.featured
      ? [portfolioData.featured, ...(portfolioData.items || [])]
      : [];
  }, [portfolioData]);

  const openViewer = (index) => {
    if (!allPortfolioItems[index]) return;
    setActiveItemIndex(index);
    setActiveItem(allPortfolioItems[index]);
  };

  const prevProject = () => {
    if (!allPortfolioItems.length) return;
    const prevIndex = activeItemIndex > 0 ? activeItemIndex - 1 : allPortfolioItems.length - 1;
    setActiveItemIndex(prevIndex);
    setActiveItem(allPortfolioItems[prevIndex]);
  };

  const nextProject = () => {
    if (!allPortfolioItems.length) return;
    const nextIndex = activeItemIndex < allPortfolioItems.length - 1 ? activeItemIndex + 1 : 0;
    setActiveItemIndex(nextIndex);
    setActiveItem(allPortfolioItems[nextIndex]);
  };

  const openListing = (listing) => {
    if (!listing) return;

    const type = normalizeListingType(listing.listingType);
    const slug = String(listing.username || "").trim();

    if (!slug) return;

    navigate(`/${type}/${slug}`);
  };

  return (
    <div
      className={`team-profile-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}
    >
      <PublicTopbar
        theme={theme}
        onGoHome={() => navigate("/")}
        onGoLogin={() => navigate("/login")}
        onGoSignup={() => navigate("/signup")}
      />

      <div className="pt-[85px] relative z-10">
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <main className={`inreview-main ${activeItem ? "blurred" : ""} w-full min-w-0`}>
              {loading ? (
                <section className="content-card">
                  <h3 className="card-title">Loading</h3>
                  <p className="card-text">Loading public profile...</p>
                </section>
              ) : pageError ? (
                <section className="content-card">
                  <h3 className="card-title">Error</h3>
                  <p className="card-text">{pageError}</p>
                </section>
              ) : (
                <>
                  <section className="profile-card">
                    <div className="profile-left">
                      <div className="profile-avatar">
                        {userData.avatarUrl ? (
                          <img
                            src={userData.avatarUrl}
                            alt={userData.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : null}
                      </div>

                      <div className="profile-info">
                        <h1 className="profile-name">{userData.name}</h1>
                        <span className="profile-username">{userData.username}</span>

                        <div className="profile-meta-line">
                          <span
                            style={{ cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => setOpenFollowModal(true)}
                          >
                            {followCounts.followers} Followers
                          </span>

                          {userData.joinedText ? (
                            <>
                              <span className="meta-separator">•</span>
                              <span>Joined {userData.joinedText}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        className="btn-message"
                        type="button"
                        onClick={() => navigate("/login")}
                      >
                        Message
                      </button>

                      <button
                        className="btn-join"
                        type="button"
                        onClick={() => navigate("/login")}
                      >
                        Follow
                      </button>
                    </div>
                  </section>

                  <section className="title-badges-section">
                    <div className="title-left">
                      <h2 className="section-title">{userData.title || "No title added yet"}</h2>
                      <p className="section-description">
                        {userData.description || "No description available."}
                      </p>
                    </div>

                    <div className="title-center">
                      <div className="info-stack">
                        {userData.location ? (
                          <div className="profile-info-item">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="info-icon"
                            >
                              <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <div className="info-badge location-badge">
                              <span className="info-label">Location:</span> {userData.location}
                            </div>
                          </div>
                        ) : null}

                        {userData.availability ? (
                          <div className="profile-info-item">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="info-icon"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <div className="availability-badge">{userData.availability}</div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="title-right">
                      <div className="trust-badges">
                        {userData.badges.map((badge, index) => (
                          <span key={index} className="trust-badge">
                            {badge}
                          </span>
                        ))}
                      </div>

                      <div className="hashtags">
                        {userData.hashtags.map((tag, index) => (
                          <span key={index} className="hashtag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="stats-section">
                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{userData.stats.karma}</span>
                        <span className="stat-label">Karma</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{userData.stats.projectsCompleted}</span>
                        <span className="stat-label">Projects Completed</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{userData.stats.averageRating}</span>
                        <span className="stat-label">Average Rating</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{userData.stats.followers}</span>
                        <span className="stat-label">Followers</span>
                      </div>
                    </div>
                  </section>

                  <section className="content-card">
                    <h3 className="card-title">About</h3>
                    {userData.about.length ? (
                      userData.about.map((paragraph, index) => (
                        <p key={index} className="card-text">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="card-text">No about information available.</p>
                    )}
                  </section>

                  <section className="skills-section">
                    <h3 className="section-heading">Skills & Expertise</h3>
                    <div className="skills-wrapper">
                      <button
                        className="scroll-btn left"
                        onClick={() => scrollHorizontal(skillsContainerRef, "left")}
                      >
                        ◀
                      </button>
                      <div className="skills-container scrollable" ref={skillsContainerRef}>
                        {userData.skills.length ? (
                          userData.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="skill-tag">No skills added</span>
                        )}
                      </div>
                      <button
                        className="scroll-btn right"
                        onClick={() => scrollHorizontal(skillsContainerRef, "right")}
                      >
                        ▶
                      </button>
                    </div>
                  </section>

                  <section className="tools-section">
                    <h3 className="section-heading">Tools & Technologies</h3>
                    <div className="skills-wrapper">
                      <button
                        className="scroll-btn left"
                        onClick={() => scrollHorizontal(toolsContainerRef, "left")}
                      >
                        ◀
                      </button>
                      <div className="tools-container scrollable" ref={toolsContainerRef}>
                        {userData.tools.length ? (
                          userData.tools.map((tool, index) => (
                            <span key={index} className="tool-tag">
                              {tool}
                            </span>
                          ))
                        ) : (
                          <span className="tool-tag">No tools added</span>
                        )}
                      </div>
                      <button
                        className="scroll-btn right"
                        onClick={() => scrollHorizontal(toolsContainerRef, "right")}
                      >
                        ▶
                      </button>
                    </div>
                  </section>

                  <section className="languages-section">
                    <h3 className="section-heading">Languages</h3>
                    <div className="skills-wrapper">
                      <button
                        className="scroll-btn left"
                        onClick={() => scrollHorizontal(languagesContainerRef, "left")}
                      >
                        ◀
                      </button>
                      <div className="languages-list scrollable" ref={languagesContainerRef}>
                        {userData.languages.length ? (
                          userData.languages.map((lang, index) => (
                            <span key={index} className="language-item">
                              {lang}
                            </span>
                          ))
                        ) : (
                          <span className="language-item">No languages added</span>
                        )}
                      </div>
                      <button
                        className="scroll-btn right"
                        onClick={() => scrollHorizontal(languagesContainerRef, "right")}
                      >
                        ▶
                      </button>
                    </div>
                  </section>

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
                              onClick={() => openViewer(0)}
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
                              <span className="cost-value">
                                {portfolioData.featured.cost}
                              </span>
                            </div>
                          </div>
                        </div>

                        {activeItem &&
                          createPortal(
                            <div className="portfolio-modal-backdrop" onClick={() => setActiveItem(null)}>
                              <div
                                className={`portfolio-modal-content ${theme}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="portfolio-modal-topbar">
                                  <div className="portfolio-modal-brand">
                                    <div className="portfolio-brand-circle"></div>
                                    <span>Made by {userData.name}</span>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <div className="portfolio-modal-nav">
                                      <button className="nav-arrow left" onClick={prevProject}>
                                        ◀
                                      </button>
                                      <span className="portfolio-modal-counter">
                                        {activeItemIndex + 1} of {allPortfolioItems.length}
                                      </span>
                                      <button className="nav-arrow right" onClick={nextProject}>
                                        ▶
                                      </button>
                                    </div>

                                    <button
                                      className="portfolio-modal-close"
                                      onClick={() => setActiveItem(null)}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>

                                <div className="portfolio-modal-info">
                                  <div className="portfolio-info-header">
                                    <h3>{activeItem.title}</h3>
                                  </div>
                                  <p>{activeItem.description}</p>

                                  <div className="portfolio-modal-cost">
                                    <span className="cost-label">Project cost</span>
                                    <span className="cost-value">{activeItem.cost}</span>
                                  </div>
                                </div>

                                <div className="portfolio-modal-image">
                                  <img src={activeItem.image} alt={activeItem.title} />
                                </div>
                              </div>
                            </div>,
                            document.body
                          )}

                        {portfolioData.items.length > 0 ? (
                          <div className="portfolio-grid-card">
                            <div className="portfolio-grid">
                              {portfolioData.items.map((item, index) => (
                                <div key={index} className="portfolio-item">
                                  <div className="portfolio-item-image">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      onClick={() => openViewer(index + 1)}
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
                        ) : null}
                      </>
                    ) : (
                      <div className="content-card">
                        <p className="card-text">No portfolio items found.</p>
                      </div>
                    )}
                  </section>

                  <section style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "24px",
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 28px",
                          background: "#CEFF1B",
                          borderRadius: "15px",
                          fontSize: "18px",
                          fontWeight: "500",
                          color: "#222",
                        }}
                      >
                        Listings
                      </div>
                    </div>

                    {listingData.length > 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                          gap: "20px",
                          width: "100%",
                        }}
                      >
                        {listingData.map((listing) => (
                          <div
                            key={listing.id}
                            className="content-card"
                            style={{
                              cursor: "pointer",
                              overflow: "hidden",
                              padding: "0",
                            }}
                            onClick={() => openListing(listing)}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "220px",
                                background: "#f3f3f3",
                                overflow: "hidden",
                              }}
                            >
                              {listing.image ? (
                                <img
                                  src={listing.image}
                                  alt={listing.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#777",
                                    fontSize: "14px",
                                  }}
                                >
                                  No image available
                                </div>
                              )}
                            </div>

                            <div style={{ padding: "18px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "12px",
                                  marginBottom: "10px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    textTransform: "capitalize",
                                    background: "#f5f5f5",
                                    padding: "6px 10px",
                                    borderRadius: "999px",
                                  }}
                                >
                                  {String(listing.listingType || "").replace(/-/g, " ")}
                                </span>

                                <span
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#222",
                                  }}
                                >
                                  {listing.priceText}
                                </span>
                              </div>

                              <h4
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "700",
                                  marginBottom: "8px",
                                  color: "#111",
                                  lineHeight: "1.35",
                                }}
                              >
                                {listing.title}
                              </h4>

                              <p
                                className="card-text"
                                style={{
                                  marginBottom: "14px",
                                  color: "#666",
                                }}
                              >
                                {truncateText(listing.description, 120) || "No description available."}
                              </p>

                              <button
                                type="button"
                                className="btn-join"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openListing(listing);
                                }}
                              >
                                View Listing
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="content-card">
                        <p className="card-text">No public listings connected yet.</p>
                      </div>
                    )}
                  </section>

                  <section className="reviews-section">
                    <div className="reviews-header">
                      <h3 className="reviews-title">Reviews</h3>
                      <div className="reviews-header-line"></div>
                    </div>

                    <div className="content-card">
                      <p className="card-text">No public reviews connected yet.</p>
                    </div>
                  </section>
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      {openFollowModal && (
        <PublicFollowModal
          onClose={() => setOpenFollowModal(false)}
          theme={theme}
          followers={followCounts.followers}
          following={followCounts.following}
        />
      )}
    </div>
  );
};

function PublicFollowModal({ onClose, theme, followers = 0, following = 0 }) {
  const [tab, setTab] = useState("followers");

  return (
    <div
      className="z-50 flex md:mt-20 p-4 md:p-0 bg-black/60 backdrop-blur-sm fixed inset-0 items-center justify-center friend-modal"
      onClick={onClose}
    >
      <div
        className={`w-[95%] max-w-[620px] max-h-[90vh] p-5 md:p-8 rounded-[16px] flex flex-col friend-modal-card relative bg-white dark:bg-[#121212] border-2 border-[#CEFF1B] shadow-[0_0_40px_rgba(206,255,27,0.5)] transition-colors ${
          theme === "dark" || theme === "dark-theme" ? "dark" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-gray-600 text-lg absolute top-4 right-4">
          ✕
        </button>

        <div className="flex flex-wrap mb-3 font-semibold justify-center gap-4 md:gap-16">
          <button
            onClick={() => setTab("followers")}
            className={`px-5 py-1.5 rounded-lg ${tab === "followers" ? "bg-[#CEFF1B] text-black" : ""}`}
          >
            Followers
          </button>
          <button
            onClick={() => setTab("following")}
            className={`px-5 py-1.5 rounded-lg ${tab === "following" ? "bg-[#CEFF1B] text-black" : ""}`}
          >
            Following
          </button>
        </div>

        <div className="h-[1px] mb-4 bg-[#000000] divider" />

        <div className="content-card">
          <p className="card-text">
            {tab === "followers" ? `${followers} followers` : `${following} following`}
          </p>
          <p className="card-text">Login to see the full list.</p>
        </div>
      </div>
    </div>
  );
}

export default PublicUserProfile;