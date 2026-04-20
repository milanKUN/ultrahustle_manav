import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListingByUsername, getPublicUserListings } from "../api/listingApi";
import { createPortal } from "react-dom";
import {
    Share2,
    Flag,
    Heart,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Check,
    Star,
    ChevronDown,
    Clock,
    Infinity,
    CheckCircle2,
    User,
    X,
} from "lucide-react";
import "./TeamServiceListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import "../../../Darkuser.css";
import "../../dashboard/pages/TeamProfileLight.css";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import DetailedTeamCard from "../components/DetailedTeamCard";


const ServiceListing = ({ theme, setTheme }) => {
    const [activeTab, setActiveTab] = useState("Basic");
    const [activeImg, setActiveImg] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [showMoreListings, setShowMoreListings] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImgIndex, setModalImgIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    // Portfolio & Listing State (same as UserProfile.jsx)
    const [activeItem, setActiveItem] = useState(null);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [favorites, setFavorites] = useState(new Set());
    const [mainTab, setMainTab] = useState("listings");
    const [filter, setFilter] = useState("All");
    const [activeFaq, setActiveFaq] = useState(null);
    const recommendedGridRef = useRef(null);
    const moreFromSarahGridRef = useRef(null);

    const navigate = useNavigate();
    const { username } = useParams();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const getRoutePrefix = (type) => {
        if (!type) return "service";
        const t = type.toLowerCase();
        if (t === "course") return "course";
        if (t === "webinar") return "webinar";
        if (t === "digital_product" || t === "digital-product") return "digital-product";
        return "service";
    };

    useEffect(() => {
        if (!username) { setIsLoading(false); return; }
        setIsLoading(true);
        getListingByUsername(username)
            .then((res) => setListing(res?.listing || res?.data || res || null))
            .catch((e) => setFetchError(e?.message || "Failed to load listing."))
            .finally(() => setIsLoading(false));
    }, [username]);

    // Sync activeTab to first real package once listing loads
    useEffect(() => {
        if (listing?.details?.packages?.length) {
            setActiveTab(listing.details.packages[0].package_name || "Basic");
        }
    }, [listing]);

    // Fetch the creator's public listings for the "Listings" section
    // (listing.more_from_user is limited to 8 and excludes current — use public endpoint for full grid)
    const [creatorListings, setCreatorListings] = useState([]);
    useEffect(() => {
        const creatorUser = listing?.creator_username || listing?.creator?.username;
        if (!creatorUser) return;
        getPublicUserListings(creatorUser)
            .then((res) => setCreatorListings(
                Array.isArray(res?.listings) ? res.listings : []
            ))
            .catch(() => {});
    }, [listing]);

    useEffect(() => {
        const shouldLockScroll = Boolean(activeItem || showImageModal);
        const { body, documentElement } = document;
        const previousBodyOverflow = body.style.overflow;
        const previousHtmlOverflow = documentElement.style.overflow;

        if (shouldLockScroll) {
            body.style.overflow = "hidden";
            documentElement.style.overflow = "hidden";
        }

        return () => {
            body.style.overflow = previousBodyOverflow;
            documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [activeItem, showImageModal]);

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



    const listingsData = [
        {
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            title: "Complete UI/UX Design for Mobile & Web more...",
            type: "Service",
            views: 3247,
            price: "$2,500",
        },
        {
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80",
            title: "React & Frontend Development Course",
            type: "Course",
            views: 1890,
            price: "$99",
        },
        {
            image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=500&q=80",
            title: "E-commerce Website UI Kit",
            type: "Product",
            views: 2460,
            price: "$49",
        },
        {
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=80",
            title: "Growth Marketing Live Webinar",
            type: "Webinar",
            views: 870,
            price: "Free",
        },
        {
            image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=500&q=80",
            title: "Brand Identity & Logo Design",
            type: "Service",
            views: 1325,
            price: "$1,200",
        },
        {
            image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=500&q=80",
            title: "Landing Page Conversion Template",
            type: "Product",
            views: 1640,
            price: "$29",
        },
    ];

    const reviewsData = {
        average: 4.9,
        total: 48,
        breakdown: { 5: 38, 4: 7, 3: 2, 2: 1, 1: 0 },
        reviews: [
            {
                name: "Emily Chen",
                date: "Nov 15, 2025",
                rating: 5,
                text: "Exceptional designer! Delivered beyond expectations with stunning visuals and perfect usability.",
            },
            {
                name: "James Miller",
                date: "Nov 10, 2025",
                rating: 5,
                text: "Incredible work ethic and communication throughout the project. Highly recommended!",
            },
            {
                name: "Sophia Lee",
                date: "Oct 28, 2025",
                rating: 5,
                text: "Professional, talented, and creative. The final product exceeded our goals completely.",
            },
            {
                name: "David Carter",
                date: "Oct 20, 2025",
                rating: 4,
                text: "Great collaboration, fast turnarounds, and very responsive. Would hire again for sure.",
            },
        ],
    };
    const members = [
        { id: 1, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
        { id: 2, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
        {
            id: 3,
            name: "Abigail Abigail",
            role: "Owner",
            tag: "Frontend Developer",
        },
        {
            id: 4,
            name: "Abigail Abigail",
            role: "Owner",
            tag: "Social Media Manager",
        },
        {
            id: 5,
            name: "Abigail Abigail",
            role: "Owner",
            tag: "Frontend Developer",
        },
        { id: 6, name: "Abigail Abigail", role: "Owner", tag: "Sales" },
        { id: 7, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
        { id: 8, name: "Abigail Abigail", role: "Owner", tag: "Designer" },
        {
            id: 9,
            name: "Abigail Abigail",
            role: "Owner",
            tag: "Social Media Manager",
        },
    ];

    const recommendedProducts = [
        {
            id: "r1",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: ₹ 24,000",
            cta: "Know More",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
        {
            id: "r2",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: ₹ 24,000",
            cta: "Buy Now",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
        {
            id: "r3",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: ₹ 24,000",
            cta: "Enroll Now",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
        {
            id: "r4",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: From ₹ 24,000",
            cta: "Know More",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
    ];

    const moreFromSarah = [
        {
            id: "m1",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: ₹ 24,000",
            cta: "Know More",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
        {
            id: "m2",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: ₹ 24,000",
            cta: "Buy Now",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
        {
            id: "m3",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: ₹ 24,000",
            cta: "Enroll Now",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
        {
            id: "m4",
            name: "Abigail",
            verified: true,
            ai: true,
            title: "Browse services, products, courses, and webinars tailored...",
            rating: 4.5,
            reviews: 123,
            priceLabel: "Price: From ₹ 24,000",
            cta: "Know More",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
        },
    ];

    // ── API-derived data ─────────────────────────────────────────────────
    const details = listing?.details || {};
    const rawPkgs = Array.isArray(details.packages) ? details.packages : [];
    const addOns  = Array.isArray(details.add_ons)  ? details.add_ons  : [];
    const coverUrl = listing?.cover_media_url || "";
    const portfolio_api = Array.isArray(listing?.portfolio_projects) ? listing.portfolio_projects : [];

    const portfolioImages = portfolio_api.flatMap((p) =>
        Array.isArray(p.files) ? p.files.map((f) => f.url || f) : (p.image_url ? [p.image_url] : [])
    );
    const galleryImages = Array.isArray(listing?.gallery) ? listing.gallery : [];
    
    const combinedImages = [...new Set([coverUrl, ...galleryImages, ...portfolioImages].filter(Boolean))];

    const images = combinedImages.length
        ? combinedImages
        : [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop",
          ];

    // Build keyed packages from API
    const PKG_TABS = rawPkgs.length ? rawPkgs.map((p) => p.package_name || "Basic") : ["Basic", "Standard", "Premium"];
    const packages = PKG_TABS.reduce((acc, tab) => {
        const p = rawPkgs.find((r) => (r.package_name || "Basic") === tab) || {};
        acc[tab] = {
            price: p.price ?? "",
            delivery: p.delivery_days ? `${p.delivery_days} day${p.delivery_days != 1 ? "s" : ""}` : "—",
            revisions: p.revisions ?? "—",
            desc: p.scope || "",
            inclusions: Array.isArray(p.included) ? p.included : [],
            howItWorks: Array.isArray(p.how_it_works) ? p.how_it_works : [],
            notIncluded: Array.isArray(p.not_included) ? p.not_included : [],
            toolsUsed: Array.isArray(p.tools_used) ? p.tools_used : [],
            deliveryFormat: p.delivery_format || "",
        };
        return acc;
    }, {});

    // Comparison table — dynamic columns from PKG_TABS
    const comparisonData = [
        { feature: "Price",                ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].price ? `$${packages[t].price}` : "—"])) },
        { feature: "Delivery time (days)", ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].delivery])) },
        { feature: "Number of revisions",  ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), String(packages[t].revisions)])) },
        { feature: "Scope of work",        ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].desc])) },
        { feature: "What's Included",      ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].inclusions])) },
        { feature: "How it works",         ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].howItWorks])) },
        { feature: "What's not included",  ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].notIncluded])) },
        { feature: "Tools used",           ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), (packages[t].toolsUsed || []).join(", ")])) },
        { feature: "Delivery format",      ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].deliveryFormat])) },
    ];

    // FAQ data from API
    const faqData = (Array.isArray(listing?.faqs) ? listing.faqs : []).map((f) => ({
        question: f.q || f.question || "",
        answer:   f.a || f.answer   || "",
    }));

    // Portfolio data from API
    const FALLBACK_IMG = "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    const portfolioData = {
        featured: portfolio_api[0]
            ? { image: portfolio_api[0].files?.[0]?.url || portfolio_api[0].image_url || coverUrl || FALLBACK_IMG, title: portfolio_api[0].title || "Portfolio", description: portfolio_api[0].description || "", cost: portfolio_api[0].cost || "" }
            : { image: FALLBACK_IMG, title: "Portfolio", description: "", cost: "" },
        items: portfolio_api.slice(1).map((p) => ({
            image: p.files?.[0]?.url || p.image_url || coverUrl || FALLBACK_IMG,
            title: p.title || "",
            description: p.description || "",
            cost: p.cost || "",
        })),
    };

    // Safe current package — falls back to first tab if activeTab isn't in packages yet
    const currentPkg = packages[activeTab] || packages[PKG_TABS[0]] || {
        price: "", delivery: "—", revisions: "—", desc: "",
        inclusions: [], howItWorks: [], notIncluded: [], toolsUsed: [], deliveryFormat: "",
    };

    return (
        <div className={`user-page ${theme} min-h-screen`}>

            {isLoading && (
                <div className="pt-[85px] flex items-center justify-center h-screen">
                    <p className="text-lg opacity-60">Loading service listing...</p>
                </div>
            )}
            {fetchError && (
                <div className="pt-[85px] flex items-center justify-center h-screen">
                    <p className="text-red-500">{fetchError}</p>
                </div>
            )}
            {!isLoading && !fetchError && (
            <>
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((p) => !p)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="pt-[72px] flex relative z-10 transition-all duration-300">
                {/* MAIN CONTENT */}
                <div className="relative flex-1 min-w-0 overflow-hidden">
                    <div className="overflow-y-auto h-[calc(100vh-72px)]">
                        <div className={`tsl-page ${theme}`}>
                            <div className="tsl-header">
                                <h1 className="tsl-title">
                                    {listing?.title || "Service Listing"}
                                </h1>
                                <div className="tsl-header-actions">
                                    <button className="tsl-icon-btn">
                                        <Share2 size={20} />
                                    </button>
                                    <button className="tsl-icon-btn">
                                        <Flag size={20} />
                                    </button>
                                    <button
                                        className="tsl-icon-btn"
                                        onClick={() => setIsLiked(!isLiked)}
                                    >
                                        <Heart
                                            size={20}
                                            fill={isLiked ? "red" : "none"}
                                            color={
                                                isLiked ? "red" : "currentColor"
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="tsl-container">
                                {/* Left Column */}
                                <div className="tsl-main">
                                    {/* Slider */}
                                    <div className="tsl-slider-wrap">
                                        <div className="tsl-main-img-box">
                                            <img
                                                src={images[activeImg]}
                                                alt="Service"
                                                className="tsl-main-img"
                                            />
                                            <button
                                                className="tsl-slider-btn left"
                                                onClick={() =>
                                                    setActiveImg((prev) =>
                                                        prev === 0
                                                            ? images.length - 1
                                                            : prev - 1,
                                                    )
                                                }
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                className="tsl-slider-btn right"
                                                onClick={() =>
                                                    setActiveImg((prev) =>
                                                        prev ===
                                                        images.length - 1
                                                            ? 0
                                                            : prev + 1,
                                                    )
                                                }
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                            <button
                                                className="tsl-expand-btn"
                                                onClick={() => {
                                                    setModalImgIndex(activeImg);
                                                    setShowImageModal(true);
                                                }}
                                            >
                                                <Maximize2 size={16} />
                                            </button>
                                        </div>
                                        <div className="tsl-thumbs">
                                            {images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt="Thumb"
                                                    className={`tsl-thumb ${activeImg === idx ? "active" : ""}`}
                                                    onClick={() =>
                                                        setActiveImg(idx)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Profile Card */}
                                    <div className="tsl-profile-mini-card">
                                        <div className="tsl-pmc-left">
                                            <div className="tsl-pmc-avatar-wrap">
                                                {listing?.creator?.avatar_url ? (
                                                    <img 
                                                        src={listing.creator.avatar_url} 
                                                        alt="Avatar" 
                                                        className="tsl-pmc-avatar-img"
                                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="tsl-pmc-avatar-bg"></div>
                                                )}
                                                <div className="tsl-pmc-status-dot"></div>
                                            </div>
                                            <div className="tsl-pmc-info">
                                                <div className="tsl-pmc-name-row">
                                                    <span className="tsl-pmc-name">
                                                        {listing?.creator?.full_name || listing?.creator?.username || "Profile"}
                                                    </span>
                                                    <div className="tsl-pmc-online-badge">
                                                        <div className="tsl-pmc-online-dot"></div>
                                                        <span>Online</span>
                                                    </div>
                                                </div>
                                                <div className="tsl-pmc-meta">
                                                    <Clock size={14} />
                                                    <span>
                                                        Avg response: {listing?.creator?.avg_response || "—"}
                                                    </span>
                                                </div>
                                                <div className="tsl-pmc-role-row">
                                                    <span className="tsl-pmc-role">
                                                        {listing?.creator?.role || "Creator"}
                                                    </span>
                                                    <div className="tsl-pmc-rating">
                                                        <Star
                                                            size={14}
                                                            fill="#CEFF1B"
                                                            color="#CEFF1B"
                                                        />
                                                        <span>
                                                            {listing?.creator?.rating || 0} ({listing?.creator?.review_count || 0} reviews)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="tsl-pmc-view-btn">
                                            View profile
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <div className="tsl-section">
                                        <h2>Description</h2>
                                        <p>{listing?.short_description || ""}</p>
                                    </div>

                                    <div className="tsl-section">
                                        <h2>About This Service</h2>
                                        {(listing?.about || "").split("\n\n").filter(Boolean).map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column (Sticky Pricing) */}
                                <div className="tsl-pricing-card">
                                    <div className="tsl-pricing-tabs">
                                        {PKG_TABS.map((tab) => (
                                            <button
                                                key={tab}
                                                className={`tsl-tab ${activeTab === tab ? "active" : ""}`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="tsl-pricing-content">
                                        <div className="tsl-price-row">
                                            <div className="tsl-price-info">
                                                <span className="tsl-price-label">
                                                    Price
                                                </span>
                                                <span className="tsl-price">
                                                    ${currentPkg.price}
                                                </span>
                                            </div>
                                            <div className="tsl-delivery-info">
                                                <span className="tsl-delivery-label">
                                                    Delivery
                                                </span>
                                                <span className="tsl-delivery-value">
                                                    {currentPkg.delivery}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="tsl-pkg-desc">
                                            {currentPkg.desc}
                                        </p>

                                        <p className="tsl-revs">
                                            {currentPkg.revisions}{" "}
                                            Revisions
                                        </p>

                                        <h4 className="tsl-inclusions-title">
                                            What's included
                                        </h4>
                                        <div className="tsl-inclusions-list">
                                            {(currentPkg.inclusions || []).map(
                                                (item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="tsl-inclusion-item"
                                                    >
                                                        <div className="tsl-check-circle">
                                                            <Check
                                                                size={12}
                                                                strokeWidth={3}
                                                            />
                                                        </div>
                                                        <span>{item}</span>
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <div className="tsl-divider"></div>

                                        <h4 className="tsl-addons-title">
                                            Add-ons
                                        </h4>
                                        <div className="tsl-addons-list">
                                            {addOns.length > 0 ? addOns.map((ao, i) => (
                                                <div key={i} className="tsl-addon-item">
                                                    <div className="tsl-addon-left">
                                                        <input type="checkbox" className="tsl-addon-checkbox" />
                                                        <div className="tsl-addon-info">
                                                            <span className="tsl-addon-name">{ao.name}</span>
                                                            {ao.days ? <span className="tsl-addon-sub">+{ao.days} day(s)</span> : null}
                                                        </div>
                                                    </div>
                                                    <span className="tsl-addon-price">+${ao.price}</span>
                                                </div>
                                            )) : (
                                                <p className="text-sm opacity-50 py-2">No add-ons available.</p>
                                            )}
                                        </div>

                                        <div className="tsl-pricing-actions">
                                            <button onClick={() => navigate("/contracts-listing")}
                                                className="tsl-btn-primary">
                                                Create Contract
                                            </button>
                                            <button className="tsl-btn-outline">
                                                Chat first
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* My Portfolio Section */}

                            <section className="portfolio-section">
                                <div className="portfolio-header">
                                    <h3 className="portfolio-title">
                                        My Portfolio
                                    </h3>
                                    <div className="portfolio-header-line"></div>
                                </div>

                                {/* ✅ Featured Portfolio Item */}
                                <div className="portfolio-featured-card">
                                    <div className="portfolio-featured-image">
                                        <img
                                            src={portfolioData.featured.image}
                                            alt={portfolioData.featured.title}
                                            onClick={() => {
                                                const allItems = [
                                                    portfolioData.featured,
                                                    ...portfolioData.items,
                                                ];
                                                setActiveItemIndex(0);
                                                setActiveItem(allItems[0]);
                                            }}
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
                                            <span className="cost-label">
                                                Project cost
                                            </span>
                                            <span className="cost-value">
                                                {portfolioData.featured.cost}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ POPUP MODAL */}
                                {activeItem &&
                                    createPortal(
                                        <div
                                            className="portfolio-modal-backdrop"
                                            onClick={() => setActiveItem(null)}
                                        >
                                            <div
                                                className={`portfolio-modal-content ${theme}`}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <div className="portfolio-modal-scroll">
                                                    {/* 🔝 Top Bar */}
                                                    <div className="portfolio-modal-topbar">
                                                        <div className="portfolio-modal-brand">
                                                            <div className="portfolio-brand-circle"></div>
                                                            <span>
                                                                Made by Name
                                                            </span>
                                                        </div>

                                                        {/* Right Actions: Arrows + Close */}
                                                        <div className="flex items-center gap-4">
                                                            <div className="portfolio-modal-nav">
                                                                <button
                                                                    className="nav-arrow left"
                                                                    onClick={() => {
                                                                        const allItems =
                                                                            [
                                                                                portfolioData.featured,
                                                                                ...portfolioData.items,
                                                                            ];
                                                                        const prevIndex =
                                                                            activeItemIndex >
                                                                            0
                                                                                ? activeItemIndex -
                                                                                  1
                                                                                : allItems.length -
                                                                                  1;
                                                                        setActiveItemIndex(
                                                                            prevIndex,
                                                                        );
                                                                        setActiveItem(
                                                                            allItems[
                                                                                prevIndex
                                                                            ],
                                                                        );
                                                                    }}
                                                                >
                                                                    ◀
                                                                </button>
                                                                <span className="portfolio-modal-counter">
                                                                    {activeItemIndex +
                                                                        1}{" "}
                                                                    of{" "}
                                                                    {
                                                                        [
                                                                            portfolioData.featured,
                                                                            ...portfolioData.items,
                                                                        ].length
                                                                    }
                                                                </span>
                                                                <button
                                                                    className="nav-arrow right"
                                                                    onClick={() => {
                                                                        const allItems =
                                                                            [
                                                                                portfolioData.featured,
                                                                                ...portfolioData.items,
                                                                            ];
                                                                        const nextIndex =
                                                                            activeItemIndex <
                                                                            allItems.length -
                                                                                1
                                                                                ? activeItemIndex +
                                                                                  1
                                                                                : 0;
                                                                        setActiveItemIndex(
                                                                            nextIndex,
                                                                        );
                                                                        setActiveItem(
                                                                            allItems[
                                                                                nextIndex
                                                                            ],
                                                                        );
                                                                    }}
                                                                >
                                                                    ▶
                                                                </button>
                                                            </div>

                                                            <button
                                                                className="portfolio-modal-close"
                                                                onClick={() =>
                                                                    setActiveItem(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* 📝 Info */}
                                                    <div className="portfolio-modal-info">
                                                        <div className="portfolio-info-header">
                                                            <h3>
                                                                {
                                                                    activeItem.title
                                                                }
                                                            </h3>
                                                        </div>
                                                        <p>
                                                            {
                                                                activeItem.description
                                                            }
                                                        </p>

                                                        <div className="portfolio-modal-cost">
                                                            <span className="cost-label">
                                                                Project cost
                                                            </span>
                                                            <span className="cost-value">
                                                                {
                                                                    activeItem.cost
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* 🖼 Main Image */}
                                                    <div className="portfolio-modal-image">
                                                        <img
                                                            src={
                                                                activeItem.image
                                                            }
                                                            alt={
                                                                activeItem.title
                                                            }
                                                        />
                                                    </div>

                                                    {/* 🧩 Thumbnails */}
                                                    <div className="portfolio-modal-thumbs">
                                                        {[
                                                            activeItem.image,
                                                            activeItem.image,
                                                            activeItem.image,
                                                            activeItem.image,
                                                            activeItem.image,
                                                            activeItem.image,
                                                        ].map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={img}
                                                                alt={`thumb-${i}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>,
                                        document.body,
                                    )}

                                {/* ✅ Portfolio Grid */}
                                <div className="portfolio-grid-card">
                                    <div className="portfolio-grid">
                                        {portfolioData.items.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="portfolio-item"
                                                >
                                                    <div className="portfolio-item-image">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            onClick={() => {
                                                                const allItems =
                                                                    [
                                                                        portfolioData.featured,
                                                                        ...portfolioData.items,
                                                                    ];
                                                                setActiveItemIndex(
                                                                    index + 1,
                                                                );
                                                                setActiveItem(
                                                                    allItems[
                                                                        index +
                                                                            1
                                                                    ],
                                                                );
                                                            }}
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="portfolio-item-info">
                                                        <div className="portfolio-item-left">
                                                            <span className="portfolio-item-title">
                                                                {item.title}
                                                            </span>
                                                            <span className="portfolio-item-desc">
                                                                {
                                                                    item.description
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="portfolio-item-right">
                                                            <span className="cost-label">
                                                                Project cost
                                                            </span>
                                                            <span className="cost-value">
                                                                {item.cost}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Compare Packages Section */}
                            <section className="compare-packages-section">
                                <div className="compare-header">
                                    <h3 className="compare-title">
                                        Compare Packages
                                    </h3>
                                    <div className="compare-header-line"></div>
                                </div>

                                <div className="compare-table-container">
                                    <table className="compare-table">
                                        <thead>
                                            <tr>
                                                <th>Package Features</th>
                                                {PKG_TABS.map((t) => <th key={t}>{t}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonData.map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="feature-name">{row.feature}</td>
                                                    {PKG_TABS.map((tab) => {
                                                        const val = row[tab.toLowerCase()];
                                                        return (
                                                            <td key={tab}>
                                                                {Array.isArray(val) ? (
                                                                    <ul className="compare-list">
                                                                        {val.map((item, i) => <li key={i}>{item}</li>)}
                                                                    </ul>
                                                                ) : (val || "—")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Listings Section */}
                            <section style={{ width: "100%" }}>
                                {/* ================= TOP CONTROLS ================= */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px",
                                        marginBottom: "24px",
                                    }}
                                >
                                    {/* Switch */}
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

                                    {/* Pills */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "16px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {[
                                            "All",
                                            "Services",
                                            "Products",
                                            "Courses",
                                            "Webinars",
                                        ].map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => setFilter(item)}
                                                style={{
                                                    padding: "12px 26px",
                                                    borderRadius: "999px",
                                                    border:
                                                        filter === item
                                                            ? "1px solid #ddd"
                                                            : "none",
                                                    cursor: "pointer",
                                                    background:
                                                        filter === item
                                                            ? "#fff"
                                                            : "linear-gradient(#f5f5f5,#e9e9e9)",
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

                                {/* ================= CONTENT ================= */}

                                <div className="listings-grid">
                                    {(creatorListings.length ? creatorListings : [])
                                        .filter((l) => {
                                            if (filter === "All") return true;
                                            return (l.listing_type || l.type || "").toLowerCase() === filter.slice(0, -1).toLowerCase();
                                        })
                                        .slice(0, showMoreListings ? creatorListings.length : 6)
                                        .map((l, index) => (
                                            <div key={l.id || index} className="listing-card">
                                                <div className="listing-image">
                                                    <img
                                                        src={l.cover_media_url || l.image || "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                                                        alt={l.title}
                                                    />
                                                </div>
                                                <div className="listing-info">
                                                    <div className="listing-title-row">
                                                        <h4 className="listing-title">{l.title}</h4>
                                                        <span className="listing-type">{l.listing_type || l.type || "Service"}</span>
                                                    </div>
                                                    <div className="listing-meta">
                                                        <div className="listing-price">
                                                            {l.details?.price ? `$${l.details.price}` : (l.price ? `$${l.price}` : "—")}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="listing-actions">
                                                    <button
                                                        className="btn-view-listing"
                                                        onClick={() => navigate(`/${getRoutePrefix(l.listing_type || l.type)}/${l.username || l.slug || ""}`)}
                                                    >
                                                        View Listing
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    {!creatorListings.length && (
                                        <p className="opacity-50 text-sm py-4">No listings found.</p>
                                    )}
                                </div>
                            </section>

                            {/* Show More Button */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "40px 0",
                                }}
                            >
                                <button
                                    onClick={() =>
                                        setShowMoreListings(!showMoreListings)
                                    }
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
                                        transform: showMoreListings
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                    }}
                                >
                                    <ChevronDown size={20} color="#000" />
                                </button>
                            </div>

                            {/* Detailed Team Card */}
                            <DetailedTeamCard
                                teamName={listing?.creator?.full_name || listing?.creator?.username || ""}
                                avatarUrl={listing?.creator?.avatar_url || ""}
                                location={listing?.creator?.location || ""}
                                rating={listing?.creator?.rating || 0}
                                reviewCount={listing?.creator?.review_count || 0}
                                description={listing?.creator?.bio || listing?.creator?.about || ""}
                                languages={listing?.creator?.languages || []}
                                skills={listing?.creator?.skills || listing?.tags || []}
                                memberSince={listing?.creator?.created_at || listing?.creator?.member_since || ""}
                                karma={listing?.creator?.karma || "—"}
                                projectsCompleted={listing?.creator?.projects_completed || "—"}
                                responseSpeed={listing?.creator?.avg_response || listing?.creator?.response_speed || "—"}
                                buttonText="View Profile"
                                onViewProfile={() => navigate(`/public-user-profile/${listing?.creator?.username || listing?.creator_username || username}`)}
                            />

                            {/* FAQ Section */}
                            <section className="faq-section">
                                <div className="faq-header">
                                    <h3 className="faq-title">
                                        Frequently Asked Questions
                                    </h3>
                                    <div className="faq-header-line"></div>
                                </div>

                                <div className="faq-container">
                                    {faqData.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={`faq-item ${activeFaq === index ? "active" : ""}`}
                                        >
                                            <button
                                                className="faq-question"
                                                onClick={() =>
                                                    setActiveFaq(
                                                        activeFaq === index
                                                            ? null
                                                            : index,
                                                    )
                                                }
                                            >
                                                <span>{faq.question}</span>
                                                <ChevronDown
                                                    size={20}
                                                    style={{
                                                        transform:
                                                            activeFaq === index
                                                                ? "rotate(180deg)"
                                                                : "rotate(0)",
                                                    }}
                                                />
                                            </button>
                                            {activeFaq === index && (
                                                <div className="faq-answer">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reviews Section */}
                            <section className="reviews-section">
                                <div className="reviews-header">
                                    <h3 className="reviews-title">Reviews</h3>
                                    <div className="reviews-header-line"></div>
                                </div>

                                <div className="reviews-container">
                                    {/* Left Side - Rating Summary */}
                                    <div className="reviews-summary">
                                        <div className="rating-overview">
                                            <span className="rating-score">
                                                {reviewsData.average}
                                            </span>
                                            <div className="rating-stars">
                                                {(() => {
                                                    const starColor =
                                                        theme === "dark" ||
                                                        theme === "dark-theme"
                                                            ? "#ceff1b"
                                                            : "#FFA500";
                                                    return [1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <svg
                                                                key={star}
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill={
                                                                    star <=
                                                                    Math.round(
                                                                        reviewsData.average,
                                                                    )
                                                                        ? starColor
                                                                        : "none"
                                                                }
                                                                stroke={
                                                                    starColor
                                                                }
                                                                strokeWidth="2"
                                                            >
                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                            </svg>
                                                        ),
                                                    );
                                                })()}
                                            </div>
                                            <span className="review-count">
                                                ({reviewsData.total} reviews)
                                            </span>
                                        </div>

                                        <div className="rating-breakdown">
                                            {[5, 4, 3, 2, 1].map((rating) => (
                                                <div
                                                    key={rating}
                                                    className="rating-bar-row"
                                                >
                                                    <span className="rating-label">
                                                        {rating}{" "}
                                                        <span
                                                            style={{
                                                                color:
                                                                    theme ===
                                                                        "dark" ||
                                                                    theme ===
                                                                        "dark-theme"
                                                                        ? "#ceff1b"
                                                                        : "#FFA500",
                                                            }}
                                                        >
                                                            ★
                                                        </span>
                                                    </span>
                                                    <div className="rating-bar">
                                                        <div
                                                            className="rating-bar-fill"
                                                            style={{
                                                                width: `${(reviewsData.breakdown[rating] / reviewsData.total) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="rating-count">
                                                        {
                                                            reviewsData
                                                                .breakdown[
                                                                rating
                                                            ]
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Side - Reviews List */}
                                    <div className="reviews-list">
                                        {reviewsData.reviews.map(
                                            (review, index) => (
                                                <div
                                                    key={index}
                                                    className="review-item"
                                                >
                                                    <div className="review-header">
                                                        <div className="reviewer-avatar"></div>
                                                        <div className="reviewer-info">
                                                            <span className="reviewer-name">
                                                                {review.name}
                                                            </span>
                                                            <div className="review-stars">
                                                                {(() => {
                                                                    const starColor =
                                                                        theme ===
                                                                            "dark" ||
                                                                        theme ===
                                                                            "dark-theme"
                                                                            ? "#ceff1b"
                                                                            : "#FFA500";
                                                                    return [
                                                                        1, 2, 3,
                                                                        4, 5,
                                                                    ].map(
                                                                        (
                                                                            star,
                                                                        ) => (
                                                                            <svg
                                                                                key={
                                                                                    star
                                                                                }
                                                                                width="12"
                                                                                height="12"
                                                                                viewBox="0 0 24 24"
                                                                                fill={
                                                                                    star <=
                                                                                    review.rating
                                                                                        ? starColor
                                                                                        : "none"
                                                                                }
                                                                                stroke={
                                                                                    starColor
                                                                                }
                                                                                strokeWidth="2"
                                                                            >
                                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                                            </svg>
                                                                        ),
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                        <span className="review-date">
                                                            {review.date}
                                                        </span>
                                                    </div>
                                                    <p className="review-text">
                                                        {review.text}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Recommended Section */}
                            <div className="tsl-listing-container">
                                <h2 className="tsl-sectionTitle">
                                    Recommended
                                </h2>
                                <div
                                    className="tsl-mp-grid"
                                    ref={recommendedGridRef}
                                >
                                    {(listing?.recommended_listings?.length > 0
                                        ? listing.recommended_listings
                                        : []
                                    ).map((p, i) => (
                                        <article className="tsl-mp-card" key={p.id || i}>
                                            <div className="tsl-mp-imgWrap">
                                                <img
                                                    className="tsl-mp-img"
                                                    src={p.cover_media_url || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop"}
                                                    alt={p.title || ""}
                                                />
                                            </div>
                                            <div className="tsl-mp-cardBody">
                                                <p className="tsl-mp-desc">{p.title}</p>
                                                <div className="tsl-mp-bottomRow">
                                                    <div className="tsl-mp-price">
                                                        {p.price != null ? `From $${p.price}` : ""}
                                                    </div>
                                                    <button
                                                        className="tsl-mp-cta"
                                                        type="button"
                                                        onClick={() => navigate(`/${getRoutePrefix(p.listing_type)}/${p.listing_username || ""}`)}
                                                    >
                                                        Know More
                                                        <ChevronRight size={12} className="tsl-mp-ctaIcon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                    {!listing?.recommended_listings?.length && (
                                        <p style={{opacity: 0.5, fontSize: 14, padding: "16px 0"}}>No recommendations yet.</p>
                                    )}
                                </div>
                                <button
                                    className="tsl-mp-floatArrow left"
                                    type="button"
                                    onClick={() =>
                                        scrollGridRef(
                                            recommendedGridRef,
                                            "left",
                                        )
                                    }
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    className="tsl-mp-floatArrow right"
                                    type="button"
                                    onClick={() =>
                                        scrollGridRef(
                                            recommendedGridRef,
                                            "right",
                                        )
                                    }
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* More from Sarah Anderson Section */}
                            <div
                                className="tsl-listing-container"
                                style={{ marginTop: "40px" }}
                            >
                                <h2 className="tsl-sectionTitle">
                                    More from {listing?.creator?.full_name || listing?.creator?.username || "this creator"}
                                </h2>
                                <div
                                    className="tsl-mp-grid"
                                    ref={moreFromSarahGridRef}
                                >
                                    {(listing?.more_from_user?.length > 0
                                        ? listing.more_from_user
                                        : []
                                    ).map((p, i) => (
                                        <article className="tsl-mp-card" key={p.id || i}>
                                            <div className="tsl-mp-imgWrap">
                                                <img
                                                    className="tsl-mp-img"
                                                    src={p.cover_media_url || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop"}
                                                    alt={p.title || ""}
                                                />
                                            </div>
                                            <div className="tsl-mp-cardBody">
                                                <p className="tsl-mp-desc">{p.title}</p>
                                                <div className="tsl-mp-bottomRow">
                                                    <div className="tsl-mp-price">
                                                        {p.price != null ? `From $${p.price}` : ""}
                                                    </div>
                                                    <button
                                                        className="tsl-mp-cta"
                                                        type="button"
                                                        onClick={() => navigate(`/${getRoutePrefix(p.listing_type)}/${p.listing_username || ""}`)}
                                                    >
                                                        View
                                                        <ChevronRight size={12} className="tsl-mp-ctaIcon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                    {!listing?.more_from_user?.length && (
                                        <p style={{opacity: 0.5, fontSize: 14, padding: "16px 0"}}>No other listings yet.</p>
                                    )}
                                </div>
                                <button
                                    className="tsl-mp-floatArrow left"
                                    type="button"
                                    onClick={() =>
                                        scrollGridRef(
                                            moreFromSarahGridRef,
                                            "left",
                                        )
                                    }
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    className="tsl-mp-floatArrow right"
                                    type="button"
                                    onClick={() =>
                                        scrollGridRef(
                                            moreFromSarahGridRef,
                                            "right",
                                        )
                                    }
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </> )} {/* end !isLoading && !fetchError */}
            <MobileBottomNav theme={theme} />
        </div>
    );
};

export default ServiceListing;
