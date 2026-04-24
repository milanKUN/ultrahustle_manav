import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListingByUsername, getPublicUserListings } from "../api/listingApi";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
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
    X,
    Zap,
    Users,
} from "lucide-react";
import "./TeamServiceListing.css";
import Navbar from "../../../components/layout/Navbar";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
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

    const [activeItem, setActiveItem] = useState(null);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [favorites, setFavorites] = useState(new Set());
    const [mainTab, setMainTab] = useState("listings");
    const [filter, setFilter] = useState("All");
    const [activeFaq, setActiveFaq] = useState(null);
    const recommendedGridRef = useRef(null);
    const moreFromSarahGridRef = useRef(null);

    const navigate = useNavigate();
    const { listingusername } = useParams();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const isAuthenticated = !!(localStorage.getItem("uh_auth_token") || localStorage.getItem("token") || localStorage.getItem("auth_token"));

    useEffect(() => {
        if (!isAuthenticated) {
            setSidebarOpen(false);
        }
    }, [isAuthenticated]);

    const getRoutePrefix = (type) => {
        if (!type) return "service";
        const t = type.toLowerCase();
        if (t === "course") return "course";
        if (t === "webinar") return "webinar";
        if (t === "digital_product" || t === "digital-product") return "digital-product";
        return "service";
    };

    const isTeamListing = listing?.seller_mode === "Team" && !!listing?.team_name;
    const displayOwnerName = isTeamListing
        ? listing?.team_name
        : listing?.creator?.full_name || listing?.creator?.username || "Profile";

    const displayOwnerRole = isTeamListing
        ? "Team"
        : listing?.creator?.role || "Creator";

    const displayAvatar = isTeamListing
        ? listing?.team?.avatar_url || ""
        : listing?.creator?.avatar_url || "";

    const displayBio = isTeamListing
        ? listing?.team?.bio || listing?.team?.about || ""
        : listing?.creator?.bio || listing?.creator?.about || "";

    const displayLocation = isTeamListing
        ? listing?.team?.location || ""
        : listing?.creator?.location || "";

    const displayRating = isTeamListing
        ? listing?.team?.rating || 0
        : listing?.creator?.rating || 0;

    const displayReviewCount = isTeamListing
        ? listing?.team?.review_count || 0
        : listing?.creator?.review_count || 0;

    const displayLanguages = isTeamListing
        ? listing?.team?.languages || []
        : listing?.creator?.languages || [];

    const displaySkills = isTeamListing
        ? listing?.team?.skills || []
        : listing?.creator?.skills || listing?.tags || [];

    const displayMemberSince = isTeamListing
        ? listing?.team?.created_at || ""
        : listing?.creator?.created_at || listing?.creator?.member_since || "";

    const displayKarma = isTeamListing
        ? listing?.team?.karma || "—"
        : listing?.creator?.karma || "—";

    const displayProjectsCompleted = isTeamListing
        ? listing?.team?.projects_completed || "—"
        : listing?.creator?.projects_completed || "—";

    const displayResponseSpeed = isTeamListing
        ? listing?.team?.avg_response || listing?.team?.response_speed || "—"
        : listing?.creator?.avg_response || listing?.creator?.response_speed || "—";

    const profileRoute = isTeamListing
        ? listing?.team?.username || listing?.team_name
        : listing?.creator?.username || listing?.creator_username || listingusername;

    const profileBasePath = isTeamListing ? "/public-team-profile" : "/public-user-profile";

    useEffect(() => {
        if (!listingusername) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        getListingByUsername(listingusername)
            .then((res) => setListing(res?.listing || res?.data || res || null))
            .catch((e) => setFetchError(e?.message || "Failed to load listing."))
            .finally(() => setIsLoading(false));
    }, [listingusername]);

    useEffect(() => {
        if (listing?.details?.packages?.length) {
            setActiveTab(listing.details.packages[0].package_name || "Basic");
        }
    }, [listing]);

    const [creatorListings, setCreatorListings] = useState([]);
    useEffect(() => {
        const creatorUser = listing?.creator_username || listing?.creator?.username;
        if (!creatorUser) return;
        getPublicUserListings(creatorUser)
            .then((res) =>
                setCreatorListings(Array.isArray(res?.listings) ? res.listings : [])
            )
            .catch(() => { });
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

    const safeCopyToClipboard = async (text) => {
        if (navigator?.clipboard?.writeText && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
        } finally {
            document.body.removeChild(textArea);
        }

        return true;
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = listing?.title || "Service Listing";

        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: title,
                    url,
                });
                return;
            }

            await safeCopyToClipboard(url);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Link copied to clipboard!",
                showConfirmButton: false,
                timer: 1800,
                background: "#0b0b0b",
                color: "#fff",
            });
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "Copy this link",
                text: url,
                background: "#0b0b0b",
                color: "#ffffff",
            });
        }
    };

    const handleReport = () => {
        Swal.fire({
            title: "Report this listing?",
            text: "If this listing violates our terms, we will review and take action.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CEFF1B",
            cancelButtonColor: "#333",
            confirmButtonText:
                "<span style='color:#000;font-weight:700'>Yes, Report</span>",
            cancelButtonText: "Cancel",
            background: "#0b0b0b",
            color: "#ffffff",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Report submitted. We will review this listing.",
                    showConfirmButton: false,
                    timer: 2500,
                    background: "#0b0b0b",
                    color: "#fff",
                });
            }
        });
    };

    const handleChatFirst = () => {
        navigate("/messages", {
            state: {
                source: "service_listing",
                listingId: listing?.id || null,
                listingUsername: listing?.username || listingusername,
                listingTitle: listing?.title || "",
                listingType: listing?.listing_type || "service",
                sellerMode: listing?.seller_mode || "Solo",
                teamName: listing?.team_name || "",
                creatorUsername: listing?.creator?.username || listing?.creator_username || "",
                creatorName:
                    listing?.creator?.full_name || listing?.creator?.username || "",
                prefillMessage: `Hi, I'm interested in "${listing?.title || "your service"}".`,
            },
        });
    };

    const listingsData = [
        {
            image:
                "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            title: "Complete UI/UX Design for Mobile & Web more...",
            type: "Service",
            views: 3247,
            price: "$2,500",
        },
        {
            image:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80",
            title: "React & Frontend Development Course",
            type: "Course",
            views: 1890,
            price: "$99",
        },
        {
            image:
                "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=500&q=80",
            title: "E-commerce Website UI Kit",
            type: "Product",
            views: 2460,
            price: "$49",
        },
        {
            image:
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=80",
            title: "Growth Marketing Live Webinar",
            type: "Webinar",
            views: 870,
            price: "Free",
        },
        {
            image:
                "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=500&q=80",
            title: "Brand Identity & Logo Design",
            type: "Service",
            views: 1325,
            price: "$1,200",
        },
        {
            image:
                "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=500&q=80",
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

    const details = listing?.details || {};
    const rawPkgs = Array.isArray(details.packages) ? details.packages : [];
    const addOns = Array.isArray(details.add_ons) ? details.add_ons : [];
    const coverUrl = listing?.cover_media_url || "";
    const portfolio_api = Array.isArray(listing?.portfolio_projects)
        ? listing.portfolio_projects
        : [];

    const portfolioImages = portfolio_api.flatMap((p) =>
        Array.isArray(p.files)
            ? p.files.map((f) => f.url || f)
            : p.image_url
                ? [p.image_url]
                : []
    );
    const galleryImages = Array.isArray(listing?.gallery) ? listing.gallery : [];

    const combinedImages = [
        ...new Set([coverUrl, ...galleryImages, ...portfolioImages].filter(Boolean)),
    ];

    const images = combinedImages.length
        ? combinedImages
        : [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop",
        ];

    const PKG_TABS = rawPkgs.length
        ? rawPkgs.map((p) => p.package_name || "Basic")
        : ["Basic", "Standard", "Premium"];

    const packages = PKG_TABS.reduce((acc, tab) => {
        const p = rawPkgs.find((r) => (r.package_name || "Basic") === tab) || {};
        acc[tab] = {
            price: p.price ?? "",
            delivery: p.delivery_days
                ? `${p.delivery_days} day${p.delivery_days != 1 ? "s" : ""}`
                : "—",
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

    const comparisonData = [
        {
            feature: "Price",
            ...Object.fromEntries(
                PKG_TABS.map((t) => [t.toLowerCase(), packages[t].price ? `$${packages[t].price}` : "—"])
            ),
        },
        {
            feature: "Delivery time (days)",
            ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].delivery])),
        },
        {
            feature: "Number of revisions",
            ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), String(packages[t].revisions)])),
        },
        {
            feature: "Scope of work",
            ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].desc])),
        },
        {
            feature: "What's Included",
            ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].inclusions])),
        },
        {
            feature: "How it works",
            ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].howItWorks])),
        },
        {
            feature: "What's not included",
            ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].notIncluded])),
        },
        {
            feature: "Tools used",
            ...Object.fromEntries(
                PKG_TABS.map((t) => [t.toLowerCase(), (packages[t].toolsUsed || []).join(", ")])
            ),
        },
        {
            feature: "Delivery format",
            ...Object.fromEntries(PKG_TABS.map((t) => [t.toLowerCase(), packages[t].deliveryFormat])),
        },
    ];

    const faqData = (Array.isArray(listing?.faqs) ? listing.faqs : []).map((f) => ({
        question: f.q || f.question || "",
        answer: f.a || f.answer || "",
    }));

    const FALLBACK_IMG =
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

    const getProjectImage = (p) => {
        if (p?.cover_media?.url) return p.cover_media.url;
        if (p?.cover_media?.path) return `/storage/${p.cover_media.path}`;

        const media = Array.isArray(p?.media) ? p.media : [];
        if (media[0]?.url) return media[0].url;
        if (media[0]?.path) return `/storage/${media[0].path}`;

        const files = Array.isArray(p?.files) ? p.files : [];
        if (files[0]?.url) return files[0].url;

        if (p?.image_url) return p.image_url;
        return FALLBACK_IMG;
    };

    const getProjectAllMedia = (p) => {
        const media = Array.isArray(p?.media) ? p.media : [];
        const urls = media
            .map((m) => m?.url || (m?.path ? `/storage/${m.path}` : null))
            .filter(Boolean);
        if (urls.length) return urls;

        const files = Array.isArray(p?.files) ? p.files : [];
        const fileUrls = files.map((f) => f?.url || null).filter(Boolean);
        if (fileUrls.length) return fileUrls;

        if (p?.image_url) return [p.image_url];
        return [FALLBACK_IMG];
    };

    const formatCost = (p) => {
        let raw = "";
        if (p?.cost && String(p.cost).trim()) raw = String(p.cost).trim();
        else if (
            p?.cost_cents !== undefined &&
            p?.cost_cents !== null &&
            p?.cost_cents !== ""
        )
            raw = String(p.cost_cents).trim();
        if (!raw) return "";
        return raw.startsWith("$") ? raw : `$${raw}`;
    };

    const portfolioData = {
        featured: portfolio_api[0]
            ? {
                image: getProjectImage(portfolio_api[0]),
                allMedia: getProjectAllMedia(portfolio_api[0]),
                title: portfolio_api[0].title || "Portfolio",
                description: portfolio_api[0].description || "",
                cost: formatCost(portfolio_api[0]),
            }
            : {
                image: FALLBACK_IMG,
                allMedia: [FALLBACK_IMG],
                title: "Portfolio",
                description: "",
                cost: "",
            },
        items: portfolio_api.slice(1).map((p) => ({
            image: getProjectImage(p),
            allMedia: getProjectAllMedia(p),
            title: p.title || "",
            description: p.description || "",
            cost: formatCost(p),
        })),
    };

    const currentPkg = packages[activeTab] || packages[PKG_TABS[0]] || {
        price: "",
        delivery: "—",
        revisions: "—",
        desc: "",
        inclusions: [],
        howItWorks: [],
        notIncluded: [],
        toolsUsed: [],
        deliveryFormat: "",
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
                    {isAuthenticated ? (
                        <UserNavbar
                            toggleSidebar={() => setSidebarOpen((p) => !p)}
                            isSidebarOpen={sidebarOpen}
                            theme={theme}
                        />
                    ) : (
                        <Navbar />
                    )}

                    <div className="pt-[85px] flex relative z-10 transition-all duration-300">
                        {isAuthenticated && (
                            <Sidebar
                                expanded={sidebarOpen}
                                setExpanded={setSidebarOpen}
                                showSettings={showSettings}
                                setShowSettings={setShowSettings}
                                activeSetting={activeSetting}
                                onSectionChange={setActiveSetting}
                                theme={theme}
                                setTheme={setTheme}
                            />
                        )}
                        <div className="relative flex-1 min-w-0 overflow-hidden">
                            <div className="overflow-y-auto h-[calc(100vh-85px)]">
                                <div className={`tsl-page ${theme}`}>
                                    <div className="tsl-header">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <h1 className="tsl-title">{listing?.title || "Service Listing"}</h1>

                                            {listing?.ai_powered && (
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        background:
                                                            "linear-gradient(135deg, #CEFF1B 0%, #a8e600 100%)",
                                                        color: "#000",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        padding: "4px 10px",
                                                        borderRadius: "6px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <Zap size={12} fill="#000" /> AI Powered
                                                </span>
                                            )}

                                            {isTeamListing && (
                                                <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        background: "#111",
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        padding: "4px 10px",
                                                        borderRadius: "6px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <Users size={12} /> Team Listing
                                                </span>
                                            )}
                                        </div>

                                        <div className="tsl-header-actions">
                                            <button
                                                className="tsl-icon-btn"
                                                title="Share"
                                                onClick={handleShare}
                                            >
                                                <Share2 size={20} />
                                            </button>

                                            <button
                                                className="tsl-icon-btn"
                                                title="Report"
                                                onClick={handleReport}
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
                                                    <img
                                                        src={images[activeImg]}
                                                        alt="Service"
                                                        className="tsl-main-img"
                                                    />

                                                    <button
                                                        className="tsl-slider-btn left"
                                                        onClick={() =>
                                                            setActiveImg((prev) =>
                                                                prev === 0 ? images.length - 1 : prev - 1
                                                            )
                                                        }
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>

                                                    <button
                                                        className="tsl-slider-btn right"
                                                        onClick={() =>
                                                            setActiveImg((prev) =>
                                                                prev === images.length - 1 ? 0 : prev + 1
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
                                                            onClick={() => setActiveImg(idx)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="tsl-profile-mini-card">
                                                <div className="tsl-pmc-left">
                                                    <div className="tsl-pmc-avatar-wrap">
                                                        {displayAvatar ? (
                                                            <img
                                                                src={displayAvatar}
                                                                alt="Avatar"
                                                                className="tsl-pmc-avatar-img"
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    borderRadius: "50%",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="tsl-pmc-avatar-bg"></div>
                                                        )}
                                                         <div className="tsl-pmc-status-dot"></div>
                                                    </div>

                                                    <div className="tsl-pmc-info">
                                                        <div className="tsl-pmc-name-row">
                                                            <span className="tsl-pmc-name">{displayOwnerName}</span>
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
                                                            <span className="tsl-pmc-role">{displayOwnerRole}</span>
                                                            <div className="tsl-pmc-rating">
                                                                <Star size={14} fill="#CEFF1B" color="#CEFF1B" />
                                                                <span>
                                                                    {listing?.creator?.rating || 0} (
                                                                    {listing?.creator?.review_count || 0} reviews)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    className="tsl-pmc-view-btn"
                                                    onClick={() => navigate(`${profileBasePath}/${profileRoute}`)}
                                                >
                                                    View profile
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>

                                            <div className="tsl-section">
                                                <h2>Description</h2>
                                                <p>{listing?.short_description || ""}</p>
                                            </div>

                                            <div className="tsl-section">
                                                <h2>About This Service</h2>
                                                {(listing?.about || "")
                                                    .split("\n\n")
                                                    .filter(Boolean)
                                                    .map((para, i) => (
                                                        <p key={i}>{para}</p>
                                                    ))}
                                            </div>
                                        </div>

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
                                                        <span className="tsl-price-label">Price</span>
                                                        <span className="tsl-price">${currentPkg.price}</span>
                                                    </div>
                                                    <div className="tsl-delivery-info">
                                                        <span className="tsl-delivery-label">Delivery</span>
                                                        <span className="tsl-delivery-value">{currentPkg.delivery}</span>
                                                    </div>
                                                </div>

                                                <p className="tsl-pkg-desc">{currentPkg.desc}</p>
                                                <p className="tsl-revs">{currentPkg.revisions} Revisions</p>

                                                <h4 className="tsl-inclusions-title">What's included</h4>
                                                <div className="tsl-inclusions-list">
                                                    {(currentPkg.inclusions || []).map((item, idx) => (
                                                        <div key={idx} className="tsl-inclusion-item">
                                                            <div className="tsl-check-circle">
                                                                <Check size={12} strokeWidth={3} />
                                                            </div>
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="tsl-divider"></div>

                                                <h4 className="tsl-addons-title">Add-ons</h4>
                                                <div className="tsl-addons-list">
                                                    {addOns.length > 0 ? (
                                                        addOns.map((ao, i) => (
                                                            <div key={i} className="tsl-addon-item">
                                                                <div className="tsl-addon-left">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="tsl-addon-checkbox"
                                                                    />
                                                                    <div className="tsl-addon-info">
                                                                        <span className="tsl-addon-name">{ao.name}</span>
                                                                        {ao.days ? (
                                                                            <span className="tsl-addon-sub">
                                                                                +{ao.days} day(s)
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <span className="tsl-addon-price">+${ao.price}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm opacity-50 py-2">
                                                            No add-ons available.
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="tsl-pricing-actions">
                                                    <button
                                                        onClick={() =>
                                                            navigate("/contracts-listing", {
                                                                state: { listingId: listing?.id },
                                                            })
                                                        }
                                                        className="tsl-btn-primary"
                                                    >
                                                        Create Contract
                                                    </button>

                                                    <button className="tsl-btn-outline" onClick={handleChatFirst}>
                                                        Chat first
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <section className="portfolio-section">
                                        <div className="portfolio-header">
                                            <h3 className="portfolio-title">My Portfolio</h3>
                                            <div className="portfolio-header-line"></div>
                                        </div>

                                        <div className="portfolio-featured-card">
                                            <div className="portfolio-featured-image">
                                                <img
                                                    src={portfolioData.featured.image}
                                                    alt={portfolioData.featured.title}
                                                    onClick={() => {
                                                        const allItems = [portfolioData.featured, ...portfolioData.items];
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
                                                    <span className="cost-label">Project cost</span>
                                                    <span className="cost-value">{portfolioData.featured.cost}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {activeItem &&
                                            createPortal(
                                                <div
                                                    className="portfolio-modal-backdrop"
                                                    onClick={() => setActiveItem(null)}
                                                >
                                                    <div
                                                        className={`portfolio-modal-content ${theme}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="portfolio-modal-scroll">
                                                            <div className="portfolio-modal-topbar">
                                                                <div className="portfolio-modal-brand">
                                                                    <div className="portfolio-brand-circle"></div>
                                                                    <span>Made by Name</span>
                                                                </div>

                                                                <div className="flex items-center gap-4">
                                                                    <div className="portfolio-modal-nav">
                                                                        <button
                                                                            className="nav-arrow left"
                                                                            onClick={() => {
                                                                                const allItems = [
                                                                                    portfolioData.featured,
                                                                                    ...portfolioData.items,
                                                                                ];
                                                                                const prevIndex =
                                                                                    activeItemIndex > 0
                                                                                        ? activeItemIndex - 1
                                                                                        : allItems.length - 1;
                                                                                setActiveItemIndex(prevIndex);
                                                                                setActiveItem(allItems[prevIndex]);
                                                                            }}
                                                                        >
                                                                            ◀
                                                                        </button>
                                                                        <span className="portfolio-modal-counter">
                                                                            {activeItemIndex + 1} of{" "}
                                                                            {[portfolioData.featured, ...portfolioData.items].length}
                                                                        </span>
                                                                        <button
                                                                            className="nav-arrow right"
                                                                            onClick={() => {
                                                                                const allItems = [
                                                                                    portfolioData.featured,
                                                                                    ...portfolioData.items,
                                                                                ];
                                                                                const nextIndex =
                                                                                    activeItemIndex < allItems.length - 1
                                                                                        ? activeItemIndex + 1
                                                                                        : 0;
                                                                                setActiveItemIndex(nextIndex);
                                                                                setActiveItem(allItems[nextIndex]);
                                                                            }}
                                                                        >
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

                                                            <div className="portfolio-modal-thumbs">
                                                                {(activeItem.allMedia || [activeItem.image]).map((img, i) => (
                                                                    <img key={i} src={img} alt={`thumb-${i}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>,
                                                document.body
                                            )}

                                        <div className="portfolio-grid-card">
                                            <div className="portfolio-grid">
                                                {portfolioData.items.map((item, index) => (
                                                    <div key={index} className="portfolio-item">
                                                        <div className="portfolio-item-image">
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                onClick={() => {
                                                                    const allItems = [portfolioData.featured, ...portfolioData.items];
                                                                    setActiveItemIndex(index + 1);
                                                                    setActiveItem(allItems[index + 1]);
                                                                }}
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
                                    </section>
                                    <section className="compare-packages-section">
                                        <div className="compare-header">
                                            <h3 className="compare-title">Compare Packages</h3>
                                            <div className="compare-header-line"></div>
                                        </div>

                                        <div className="compare-table-container">
                                            <table className="compare-table">
                                                <thead>
                                                    <tr>
                                                        <th>Package Features</th>
                                                        {PKG_TABS.map((t) => (
                                                            <th key={t}>{t}</th>
                                                        ))}
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
                                                                                {val.map((item, i) => (
                                                                                    <li key={i}>{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            val || "—"
                                                                        )}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>

                                    {isTeamListing && listing?.team?.members?.length > 0 && (
                                        <section className="team-members-section">
                                            <div className="portfolio-header">
                                                <h3 className="portfolio-title">Members</h3>
                                                <div className="portfolio-header-line"></div>
                                            </div>
                                            <div className="team-members-grid">
                                                {listing.team.members.map((member) => (
                                                    <div key={member.id} className="member-card">
                                                        <div className="member-avatar-wrap">
                                                            {member.avatar_url ? (
                                                                <img src={member.avatar_url} alt={member.full_name} className="member-avatar-img" />
                                                            ) : (
                                                                <div className="member-avatar-placeholder"></div>
                                                            )}
                                                        </div>
                                                        <h4 className="member-name">{member.full_name}</h4>
                                                        <p className="member-role">{member.member_title || member.role || "Member"}</p>
                                                        <div className="member-actions">
                                                            <button className="member-btn-primary" onClick={() => navigate("/messages", { state: { receiverId: member.id } })}>Message</button>
                                                            <button className="member-btn-outline" onClick={() => navigate(`/public-user-profile/${member.username}`)}>Profile</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

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

                                            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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

                                        <div className="listings-grid">
                                            {(creatorListings.length ? creatorListings : [])
                                                .filter((l) => {
                                                    if (filter === "All") return true;
                                                    return (
                                                        (l.listing_type || l.type || "").toLowerCase() ===
                                                        filter.slice(0, -1).toLowerCase()
                                                    );
                                                })
                                                .slice(0, showMoreListings ? creatorListings.length : 6)
                                                .map((l, index) => (
                                                    <div key={l.id || index} className="listing-card">
                                                        <div className="listing-image">
                                                            <img
                                                                src={
                                                                    l.cover_media_url ||
                                                                    l.image ||
                                                                    "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                                                }
                                                                alt={l.title}
                                                            />
                                                        </div>
                                                        <div className="listing-info">
                                                            <div className="listing-title-row">
                                                                <h4 className="listing-title">{l.title}</h4>
                                                                <span className="listing-type">
                                                                    {l.listing_type || l.type || "Service"}
                                                                </span>
                                                            </div>
                                                            <div className="listing-meta">
                                                                <div className="listing-price">
                                                                    {l.details?.price ? `$${l.details.price}` : l.price ? `$${l.price}` : "—"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="listing-actions">
                                                            <button
                                                                className="btn-view-listing"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/${getRoutePrefix(l.listing_type || l.type)}/${l.slug || l.username || ""}`
                                                                    )
                                                                }
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
                                        teamName={displayOwnerName}
                                        avatarUrl={displayAvatar}
                                        location={displayLocation}
                                        rating={displayRating}
                                        reviewCount={displayReviewCount}
                                        description={displayBio}
                                        languages={displayLanguages}
                                        skills={displaySkills}
                                        memberSince={displayMemberSince}
                                        karma={displayKarma}
                                        projectsCompleted={displayProjectsCompleted}
                                        responseSpeed={displayResponseSpeed}
                                        buttonText={isTeamListing ? "View Team" : "View Profile"}
                                        onViewProfile={() => navigate(`${profileBasePath}/${profileRoute}`)}
                                    />

                                    <section className="faq-section">
                                        <div className="faq-header">
                                            <h3 className="faq-title">Frequently Asked Questions</h3>
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
                                                            setActiveFaq(activeFaq === index ? null : index)
                                                        }
                                                    >
                                                        <span>{faq.question}</span>
                                                        <ChevronDown
                                                            size={20}
                                                            style={{
                                                                transform:
                                                                    activeFaq === index ? "rotate(180deg)" : "rotate(0)",
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

                                    <section className="reviews-section">
                                        <div className="reviews-header">
                                            <h3 className="reviews-title">Reviews</h3>
                                            <div className="reviews-header-line"></div>
                                        </div>

                                        <div className="reviews-container">
                                            <div className="reviews-summary">
                                                <div className="rating-overview">
                                                    <span className="rating-score">{reviewsData.average}</span>
                                                    <div className="rating-stars">
                                                        {(() => {
                                                            const starColor =
                                                                theme === "dark" || theme === "dark-theme"
                                                                    ? "#ceff1b"
                                                                    : "#FFA500";
                                                            return [1, 2, 3, 4, 5].map((star) => (
                                                                <svg
                                                                    key={star}
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill={
                                                                        star <= Math.round(reviewsData.average)
                                                                            ? starColor
                                                                            : "none"
                                                                    }
                                                                    stroke={starColor}
                                                                    strokeWidth="2"
                                                                >
                                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                                </svg>
                                                            ));
                                                        })()}
                                                    </div>
                                                    <span className="review-count">
                                                        ({reviewsData.total} reviews)
                                                    </span>
                                                </div>

                                                <div className="rating-breakdown">
                                                    {[5, 4, 3, 2, 1].map((rating) => (
                                                        <div key={rating} className="rating-bar-row">
                                                            <span className="rating-label">
                                                                {rating}{" "}
                                                                <span
                                                                    style={{
                                                                        color:
                                                                            theme === "dark" || theme === "dark-theme"
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
                                                                {reviewsData.breakdown[rating]}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="reviews-list">
                                                {reviewsData.reviews.map((review, index) => (
                                                    <div key={index} className="review-item">
                                                        <div className="review-header">
                                                            <div className="reviewer-avatar"></div>
                                                            <div className="reviewer-info">
                                                                <span className="reviewer-name">{review.name}</span>
                                                                <div className="review-stars">
                                                                    {(() => {
                                                                        const starColor =
                                                                            theme === "dark" || theme === "dark-theme"
                                                                                ? "#ceff1b"
                                                                                : "#FFA500";
                                                                        return [1, 2, 3, 4, 5].map((star) => (
                                                                            <svg
                                                                                key={star}
                                                                                width="12"
                                                                                height="12"
                                                                                viewBox="0 0 24 24"
                                                                                fill={star <= review.rating ? starColor : "none"}
                                                                                stroke={starColor}
                                                                                strokeWidth="2"
                                                                            >
                                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                                            </svg>
                                                                        ));
                                                                    })()}
                                                                </div>
                                                            </div>
                                                            <span className="review-date">{review.date}</span>
                                                        </div>
                                                        <p className="review-text">{review.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    <div className="tsl-listing-container">
                                        <h2 className="tsl-sectionTitle">Recommended</h2>
                                        <div className="tsl-mp-grid" ref={recommendedGridRef}>
                                            {(listing?.recommended_listings?.length > 0
                                                ? listing.recommended_listings
                                                : []
                                            ).map((p, i) => (
                                                <article className="tsl-mp-card" key={p.id || i}>
                                                    <div className="tsl-mp-imgWrap">
                                                        <img
                                                            className="tsl-mp-img"
                                                            src={
                                                                p.cover_media_url ||
                                                                "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop"
                                                            }
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
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/${getRoutePrefix(p.listing_type)}/${p.listing_username || ""}`
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
                                            {!listing?.recommended_listings?.length && (
                                                <p style={{ opacity: 0.5, fontSize: 14, padding: "16px 0" }}>
                                                    No recommendations yet.
                                                </p>
                                            )}
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
                                            More from {displayOwnerName}
                                        </h2>
                                        <div className="tsl-mp-grid" ref={moreFromSarahGridRef}>
                                            {(listing?.more_from_user?.length > 0 ? listing.more_from_user : []).map(
                                                (p, i) => (
                                                    <article className="tsl-mp-card" key={p.id || i}>
                                                        <div className="tsl-mp-imgWrap">
                                                            <img
                                                                className="tsl-mp-img"
                                                                src={
                                                                    p.cover_media_url ||
                                                                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop"
                                                                }
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
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/${getRoutePrefix(p.listing_type)}/${p.listing_username || ""}`
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                    <ChevronRight size={12} className="tsl-mp-ctaIcon" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </article>
                                                )
                                            )}
                                            {!listing?.more_from_user?.length && (
                                                <p style={{ opacity: 0.5, fontSize: 14, padding: "16px 0" }}>
                                                    No other listings yet.
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            className="tsl-mp-floatArrow left"
                                            type="button"
                                            onClick={() => scrollGridRef(moreFromSarahGridRef, "left")}
                                        >
                                            <ChevronLeft size={24} />
                                        </button>

                                        <button
                                            className="tsl-mp-floatArrow right"
                                            type="button"
                                            onClick={() => scrollGridRef(moreFromSarahGridRef, "right")}
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showImageModal &&
                createPortal(
                    <div
                        className="portfolio-modal-backdrop"
                        onClick={() => setShowImageModal(false)}
                        style={{ zIndex: 99999 }}
                    >
                        <div
                            style={{
                                position: "relative",
                                maxWidth: "90vw",
                                maxHeight: "90vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowImageModal(false)}
                                style={{
                                    position: "absolute",
                                    top: -40,
                                    right: 0,
                                    background: "rgba(0,0,0,0.7)",
                                    border: "none",
                                    color: "#fff",
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 18,
                                    zIndex: 10,
                                }}
                            >
                                <X size={20} />
                            </button>

                            <button
                                onClick={() =>
                                    setModalImgIndex((p) => (p - 1 + images.length) % images.length)
                                }
                                style={{
                                    position: "absolute",
                                    left: -50,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "rgba(0,0,0,0.6)",
                                    border: "none",
                                    color: "#fff",
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <img
                                src={images[modalImgIndex]}
                                alt={`Fullscreen ${modalImgIndex + 1}`}
                                style={{
                                    maxWidth: "90vw",
                                    maxHeight: "85vh",
                                    objectFit: "contain",
                                    borderRadius: "12px",
                                    boxShadow: "0 0 40px rgba(0,0,0,0.5)",
                                }}
                            />

                            <button
                                onClick={() => setModalImgIndex((p) => (p + 1) % images.length)}
                                style={{
                                    position: "absolute",
                                    right: -50,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "rgba(0,0,0,0.6)",
                                    border: "none",
                                    color: "#fff",
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ChevronRight size={24} />
                            </button>

                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -35,
                                    color: "#fff",
                                    fontSize: 13,
                                    opacity: 0.8,
                                }}
                            >
                                {modalImgIndex + 1} / {images.length}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            <MobileBottomNav theme={theme} />
        </div>
    );
};

export default ServiceListing;