import React, { useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
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
import "./DigitalProductListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import "../../../Darkuser.css";
import "../../dashboard/pages/TeamProfileLight.css";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import FAQAccordion from "../components/FAQAccordion";

const DigitalProductListing = ({ theme, setTheme }) => {
    const navigate = useNavigate();
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
    const recommendedGridRef = useRef(null);
    const moreFromSarahGridRef = useRef(null);

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

    const portfolioData = {
        featured: {
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            title: "SalonSync - Revolutionary AI-Powered Salon App UI/UX",
            description:
                "This project involves designing a next-generation salon mobile application with AI-powered recommendations.",
            cost: "$600-$800",
        },
        items: [
            {
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                title: "Title",
                description: "Description",
                cost: "$",
            },
            {
                image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                title: "E-commerce Dashboard Redesign",
                description: "This project involves designing more...",
                cost: "$600-$800",
            },
            {
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                title: "E-commerce Dashboard Redesign",
                description: "This project involves designing more...",
                cost: "$600-$800",
            },
        ],
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

    const images = [
        "https://images.unsplash.com/photo-1586717791821-3f44a563fe4c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522542550221-31fd19250226?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1588&auto=format&fit=crop",
    ];

    const packages = {
        Basic: {
            price: 399,
            delivery: "5 days",
            revisions: 4,
            desc: "Most Popular for medium projects",
            inclusions: [
                "Up to 12 screens",
                "Advanced wireframing & prototyping",
                "Custom color scheme & typography",
                "Mobile & tablet responsive",
                "Interactive prototype",
                "Source files included",
                "Commercial use",
            ],
        },
        Standard: {
            price: 599,
            delivery: "7 days",
            revisions: 6,
            desc: "Recommended for large scale startups",
            inclusions: [
                "Up to 24 screens",
                "Advanced wireframing & prototyping",
                "Brand Identity guidelines",
                "Mobile & tablet responsive",
                "Interactive prototype",
                "Source files included",
                "Commercial use",
            ],
        },
        Premium: {
            price: 999,
            delivery: "10 days",
            revisions: "Unlimited",
            desc: "Enterprise grade design solution",
            inclusions: [
                "Unlimited screens",
                "Full brand design system",
                "High fidelity animation",
                "Mobile & tablet responsive",
                "Usability testing",
                "Source files included",
                "Commercial use",
            ],
        },
    };

    const comparisonData = [
        {
            feature: "Price",
            basic: "$49",
            standard: "$399",
            premium: "$799",
        },
        {
            feature: "Delivery time (days)",
            basic: "3",
            standard: "5 days delivery",
            premium: "3 days delivery",
        },
        {
            feature: "Number of revisions",
            basic: "1",
            standard: "6 screens",
            premium: "8 screens",
        },
        {
            feature: "Scope of work",
            basic: "Design of 1 core screen or section with clean layout, spacing, and basic interaction logic.",
            standard:
                "UI/UX design for up to 3 screens with consistent layout, components, and basic user flow.",
            premium:
                "End-to-end UI/UX for a small product flow including multiple screens, components, and UX logic.",
        },
        {
            feature: "What's Included",
            basic: [
                "1 UI screen",
                "Figma file access",
                "Clean layout and spacing",
            ],
            standard: [
                "Up to 3 UI screens",
                "Component consistency",
                "Figma source file",
            ],
            premium: [
                "Up to 6 screens",
                "Reusable components",
                "UX flow logic",
                "Developer-ready structure",
            ],
        },
        {
            feature: "How it works",
            basic: [
                "Client shares requirements",
                "I design and deliver the UI",
                "One revision included",
            ],
            standard: [
                "Requirement discussion",
                "Design + review cycles",
                "Final delivery",
            ],
            premium: [
                "Strategy discussion",
                "Structured design execution",
                "Review and final polish",
            ],
        },
        {
            feature: "What's not included",
            basic: ["Full design systems", "Prototyping", "Developer handoff"],
            standard: ["Full design system", "Advanced animations"],
            premium: ["Frontend development", "Copywriting"],
        },
        {
            feature: "Tools used",
            basic: "Figma, AI Design Assistants",
            standard: "Figma, Notion, AI Design Tools",
            premium: "Figma, Notion, AI UX Tools",
        },
        {
            feature: "Delivery format",
            basic: "Figma File",
            standard: "Figma File",
            premium: "Figma File",
        },
    ];

    const faqData = [
        {
            question: "What information do you need to get started?",
            answer: "I'll need your app concept, target audience details, any brand guidelines you have, competitor examples, and specific features you want included. The more details you provide, the better I can tailor the design to your needs.",
        },
        {
            question: "Do you provide the source files?",
            answer: "Yes, all packages include the source Figma files with well-organized layers and components ready for development.",
        },
        {
            question: "How many revisions are included?",
            answer: "The number of revisions varies by package: Basic includes 1, Standard includes 6 screens, and Premium offers unlimited revisions until you are completely satisfied.",
        },
    ];

    return (
        <div className={`user-page ${theme} min-h-screen`}>
            {/* NAVBAR */}
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((p) => !p)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="pt-[85px] flex relative z-10 transition-all duration-300">
                {/* MAIN CONTENT */}
                <div className="relative flex-1 min-w-0 overflow-hidden">
                    <div className="overflow-y-auto h-[calc(100vh-85px)]">
                        <div className={`tsl-page ${theme}`}>
                            <div className="tsl-header">
                                <div
                                    className="cl-back-link"
                                    onClick={() => navigate("/my-listings")}
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        color: "var(--mylis-muted)",
                                        marginBottom: "10px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <ChevronLeft size={16} /> Back to My
                                    Listings
                                </div>
                                <h1 className="tsl-title">
                                    I will design online course cover and
                                    digital product mockup bundle
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
                                                <div className="tsl-pmc-avatar-bg"></div>
                                                <div className="tsl-pmc-status-dot"></div>
                                            </div>
                                            <div className="tsl-pmc-info">
                                                <div className="tsl-pmc-name-row">
                                                    <span className="tsl-pmc-name">
                                                        Sarah Anderson
                                                    </span>
                                                    <div className="tsl-pmc-online-badge">
                                                        <div className="tsl-pmc-online-dot"></div>
                                                        <span>Online</span>
                                                    </div>
                                                </div>
                                                <div className="tsl-pmc-meta">
                                                    <Clock size={14} />
                                                    <span>
                                                        Avg response: 1 hour
                                                    </span>
                                                </div>
                                                <div className="tsl-pmc-role-row">
                                                    <span className="tsl-pmc-role">
                                                        Full Stack Developer
                                                    </span>
                                                    <div className="tsl-pmc-rating">
                                                        <Star
                                                            size={14}
                                                            fill="#CEFF1B"
                                                            color="#CEFF1B"
                                                        />
                                                        <span>
                                                            4.9(247 reviews)
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
                                        <p>
                                            He is the best in the game. Always
                                            have time to explain to me and made
                                            sure I was satisfied at every stage.
                                            Don't skip him if you want the best.
                                            He's great
                                        </p>

                                        {/* Tools & Tech */}
                                        <div className="tsl-tech-section">
                                            <h4 className="tsl-detail-title">
                                                Tools & Technologies
                                            </h4>
                                            <div className="tsl-tech-tags">
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
                                                        className="tsl-tech-tag"
                                                    >
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Delivery Format */}
                                        <div className="tsl-delivery-section">
                                            <h4 className="tsl-detail-title">
                                                Delivery Format
                                            </h4>
                                            <div className="tsl-delivery-tags">
                                                {["PNG", "PDF"].map((fmt) => (
                                                    <span
                                                        key={fmt}
                                                        className="tsl-delivery-tag"
                                                    >
                                                        {fmt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column (Sticky Pricing) */}
                                <div className="tsl-pricing-card">
                                    <div className="tsl-pricing-content">
                                        <div className="tsl-price-row">
                                            <div className="tsl-price-info">
                                                <span className="tsl-price-label">
                                                    Price
                                                </span>
                                                <span className="tsl-price">
                                                    ${packages[activeTab].price}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="tsl-divider"></div>

                                        <h4 className="tsl-inclusions-title">
                                            What's included
                                        </h4>
                                        <div className="tsl-inclusions-list">
                                            {packages[activeTab].inclusions.map(
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

                                        <div className="tsl-pricing-actions">
                                            <button className="tsl-btn-primary">
                                                Buy now
                                            </button>
                                            <button className="tsl-btn-outline">
                                                Add to cart
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

                                {/* ✅ IMAGE POPUP MODAL */}
                                {showImageModal &&
                                    createPortal(
                                        <div
                                            className={`tsl-image-modal-backdrop ${theme}`}
                                            onClick={() =>
                                                setShowImageModal(false)
                                            }
                                        >
                                            <button
                                                className="tsl-modal-close-btn"
                                                onClick={() =>
                                                    setShowImageModal(false)
                                                }
                                            >
                                                <X size={24} />
                                            </button>

                                            <div
                                                className="tsl-modal-content-wrap"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <button
                                                    className="tsl-modal-nav-btn left"
                                                    onClick={() =>
                                                        setModalImgIndex(
                                                            (prev) =>
                                                                prev === 0
                                                                    ? images.length -
                                                                    1
                                                                    : prev - 1,
                                                        )
                                                    }
                                                >
                                                    <ChevronLeft size={32} />
                                                </button>

                                                <div className="tsl-modal-img-container">
                                                    <img
                                                        src={
                                                            images[
                                                            modalImgIndex
                                                            ]
                                                        }
                                                        alt="Enlarged view"
                                                        className="tsl-modal-main-img"
                                                    />
                                                </div>

                                                <button
                                                    className="tsl-modal-nav-btn right"
                                                    onClick={() =>
                                                        setModalImgIndex(
                                                            (prev) =>
                                                                prev ===
                                                                    images.length -
                                                                    1
                                                                    ? 0
                                                                    : prev + 1,
                                                        )
                                                    }
                                                >
                                                    <ChevronRight size={32} />
                                                </button>
                                            </div>

                                            <div
                                                className="tsl-modal-thumbs-strip"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                {images.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`tsl-modal-thumb-item ${modalImgIndex === idx ? "active" : ""}`}
                                                        onClick={() =>
                                                            setModalImgIndex(
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`Thumb ${idx}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>,
                                        document.body,
                                    )}

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
                                                            {activeItem.title}
                                                        </h3>
                                                    </div>
                                                    <p>
                                                        {activeItem.description}
                                                    </p>

                                                    <div className="portfolio-modal-cost">
                                                        <span className="cost-label">
                                                            Project cost
                                                        </span>
                                                        <span className="cost-value">
                                                            {activeItem.cost}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 🖼 Main Image */}
                                                <div className="portfolio-modal-image">
                                                    <img
                                                        src={activeItem.image}
                                                        alt={activeItem.title}
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
                                    {listingsData
                                        .filter((l) => {
                                            if (filter === "All") return true;
                                            return (
                                                l.type === filter.slice(0, -1)
                                            );
                                        })
                                        .slice(
                                            0,
                                            showMoreListings
                                                ? listingsData.length
                                                : 6,
                                        )
                                        .map((listing, index) => (
                                            <div
                                                key={index}
                                                className="listing-card"
                                            >
                                                <div className="listing-image">
                                                    <img
                                                        src={listing.image}
                                                        alt={listing.title}
                                                    />

                                                    <button className="listing-nav-btn left">
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="m15 18-6-6 6-6" />
                                                        </svg>
                                                    </button>
                                                    <button className="listing-nav-btn right">
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="m9 18 6-6-6-6" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="listing-info">
                                                    <div className="listing-title-row">
                                                        <h4 className="listing-title">
                                                            {listing.title}
                                                        </h4>
                                                        <span className="listing-type">
                                                            {listing.type}
                                                        </span>
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
                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="3"
                                                                />
                                                            </svg>
                                                            <span>
                                                                {listing.views}{" "}
                                                                views
                                                            </span>
                                                        </div>
                                                        <div className="listing-price">
                                                            {listing.price}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="listing-actions">
                                                    <button className="btn-view-listing">
                                                        View Listing
                                                    </button>
                                                    <button
                                                        className="btn-favorite"
                                                        onClick={() =>
                                                            toggleFavorite(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill={
                                                                favorites.has(
                                                                    index,
                                                                )
                                                                    ? "#ef4444"
                                                                    : "none"
                                                            }
                                                            stroke={
                                                                favorites.has(
                                                                    index,
                                                                )
                                                                    ? "#ef4444"
                                                                    : "currentColor"
                                                            }
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
                            <div className="tsl-team-profile-card">
                                <div className="tsl-profile-left">
                                    <div className="tsl-profile-header">
                                        <div className="tsl-avatar-container">
                                            <img
                                                src="https://i.pravatar.cc/150?u=team"
                                                alt="Team"
                                                className="tsl-profile-avatar"
                                            />
                                            <div className="tsl-online-indicator"></div>
                                        </div>
                                        <div className="tsl-profile-title-box">
                                            <h3>Name of the team</h3>
                                            <p className="tsl-location">
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    style={{
                                                        marginRight: "4px",
                                                        verticalAlign: "middle",
                                                        color: "#ccc",
                                                    }}
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                    />
                                                </svg>
                                                San Francisco, CA
                                            </p>
                                            <div className="tsl-rating-row">
                                                <div className="tsl-stars">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (s) => (
                                                            <Star
                                                                key={s}
                                                                size={16}
                                                                fill="#CEFF1B"
                                                                color="#CEFF1B"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <span className="tsl-rating-text">
                                                    4.9(247 reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tsl-profile-details">
                                        <h4>About Me</h4>
                                        <p>
                                            Hi! I'm Sarah, a senior UI/UX
                                            designer with over 8 years of
                                            experience creating beautiful and
                                            functional mobile applications. I've
                                            worked with startups, agencies, and
                                            Fortune 500 companies to deliver
                                            exceptional user experiences.
                                        </p>

                                        <div className="tsl-languages-section">
                                            <h5>Languages</h5>
                                            <div className="tsl-lang-tags">
                                                <span>Spanish</span>
                                                <span>English</span>
                                            </div>
                                        </div>

                                        <button className="tsl-full-profile-btn">
                                            View Profile
                                        </button>
                                    </div>
                                </div>

                                <div className="tsl-profile-right">
                                    <div className="tsl-stats-grid">
                                        <div className="tsl-stat-card">
                                            <div className="stat-header">
                                                <Infinity
                                                    size={16}
                                                    className="stat-icon-svg"
                                                />
                                                <span className="stat-label">
                                                    Karma
                                                </span>
                                            </div>
                                            <span className="stat-value">
                                                1,284
                                            </span>
                                        </div>
                                        <div className="tsl-stat-card">
                                            <div className="stat-header">
                                                <CheckCircle2
                                                    size={16}
                                                    className="stat-icon-svg"
                                                />
                                                <span className="stat-label">
                                                    Projects Completed
                                                </span>
                                            </div>
                                            <span className="stat-value">
                                                98%
                                            </span>
                                        </div>
                                        <div className="tsl-stat-card">
                                            <div className="stat-header">
                                                <Clock
                                                    size={16}
                                                    className="stat-icon-svg"
                                                />
                                                <span className="stat-label">
                                                    Average Response Speed
                                                </span>
                                            </div>
                                            <span className="stat-value">
                                                1 hr
                                            </span>
                                        </div>
                                        <div className="tsl-stat-card">
                                            <div className="stat-header">
                                                <User
                                                    size={16}
                                                    className="stat-icon-svg"
                                                />
                                                <span className="stat-label">
                                                    Member Since
                                                </span>
                                            </div>
                                            <span className="stat-value">
                                                January 2018
                                            </span>
                                        </div>
                                    </div>

                                    <div className="tsl-skills-panel">
                                        <h4>Skills & Expertise</h4>
                                        <div className="tsl-skills-grid">
                                            {[
                                                "Agile/Scrum",
                                                "Accessibility",
                                                "Visual Design",
                                                "Front-end Development",
                                                "Product Design",
                                                "UI/UX Design",
                                                "Design Systems",
                                                "Mobile App Design",
                                                "User Research",
                                            ].map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="tsl-skill-tag"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FAQAccordion faqData={faqData} theme={theme} />

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
                                    {recommendedProducts.map((p) => (
                                        <article
                                            className="tsl-mp-card"
                                            key={p.id}
                                        >
                                            <div className="tsl-mp-imgWrap">
                                                <img
                                                    className="tsl-mp-img"
                                                    src={p.image}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="tsl-mp-cardBody">
                                                <div className="tsl-mp-topLine">
                                                    <div className="tsl-mp-user">
                                                        <div className="tsl-mp-avatar"></div>
                                                        <span className="tsl-mp-userName">
                                                            {p.name}
                                                        </span>
                                                        {p.verified && (
                                                            <svg
                                                                className="tsl-mp-verifyIcon"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                            >
                                                                <path
                                                                    fill="#1DA1F2"
                                                                    d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.7.54-1.51.26-3.23-.97-4.46-1.23-1.23-2.95-1.51-4.46-.97C14.13 2.08 12.76 1.2 11.18 1.2c-1.58 0-2.95.88-3.7 2.18-1.51-.54-3.23-.26-4.46.97-1.23 1.23-1.51 2.95-.97 4.46C.88 9.55 0 10.92 0 12.5c0 1.58.88 2.95 2.18 3.7-.54 1.51-.26 3.23.97 4.46 1.23 1.23 2.95 1.51 4.46.97 0.74 1.3 2.11 2.18 3.69 2.18 1.58 0 2.95-.88 3.7-2.18 1.51.54 3.23.26 4.46-.97 1.23-1.23 1.51-2.95.97-4.46 1.3-.75 2.18-2.12 2.18-3.7z"
                                                                />
                                                                <path
                                                                    stroke="#FFF"
                                                                    strokeWidth="3"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M8 12.5l3 3 5-5"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {p.ai && (
                                                        <span className="tsl-mp-aiBadge">
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                                                            </svg>
                                                            Ai Powered
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="tsl-mp-desc">
                                                    {p.title}
                                                </p>
                                                <div className="tsl-mp-metaRow">
                                                    <div className="tsl-mp-rating">
                                                        <span className="tsl-mp-star">
                                                            ★
                                                        </span>
                                                        <span>
                                                            {p.rating.toFixed(
                                                                1,
                                                            )}
                                                        </span>
                                                        <span className="tsl-mp-rev">
                                                            ({p.reviews})
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="tsl-mp-bottomRow">
                                                    <div className="tsl-mp-price">
                                                        {p.priceLabel}
                                                    </div>
                                                    <button
                                                        className="tsl-mp-cta"
                                                        type="button"
                                                    >
                                                        {p.cta}
                                                        <ChevronRight
                                                            size={12}
                                                            className="tsl-mp-ctaIcon"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
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
                                    More from Sarah Anderson
                                </h2>
                                <div
                                    className="tsl-mp-grid"
                                    ref={moreFromSarahGridRef}
                                >
                                    {moreFromSarah.map((p) => (
                                        <article
                                            className="tsl-mp-card"
                                            key={p.id}
                                        >
                                            <div className="tsl-mp-imgWrap">
                                                <img
                                                    className="tsl-mp-img"
                                                    src={p.image}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="tsl-mp-cardBody">
                                                <div className="tsl-mp-topLine">
                                                    <div className="tsl-mp-user">
                                                        <div className="tsl-mp-avatar"></div>
                                                        <span className="tsl-mp-userName">
                                                            {p.name}
                                                        </span>
                                                        {p.verified && (
                                                            <svg
                                                                className="tsl-mp-verifyIcon"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                            >
                                                                <path
                                                                    fill="#1DA1F2"
                                                                    d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.7.54-1.51.26-3.23-.97-4.46-1.23-1.23-2.95-1.51-4.46-.97C14.13 2.08 12.76 1.2 11.18 1.2c-1.58 0-2.95.88-3.7 2.18-1.51-.54-3.23-.26-4.46.97-1.23 1.23-1.51 2.95-.97 4.46C.88 9.55 0 10.92 0 12.5c0 1.58.88 2.95 2.18 3.7-.54 1.51-.26 3.23.97 4.46 1.23 1.23 2.95 1.51 4.46.97 0.74 1.3 2.11 2.18 3.69 2.18 1.58 0 2.95-.88 3.7-2.18 1.51.54 3.23.26 4.46-.97 1.23-1.23 1.51-2.95.97-4.46 1.3-.75 2.18-2.12 2.18-3.7z"
                                                                />
                                                                <path
                                                                    stroke="#FFF"
                                                                    strokeWidth="3"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M8 12.5l3 3 5-5"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {p.ai && (
                                                        <span className="tsl-mp-aiBadge">
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                                                            </svg>
                                                            Ai Powered
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="tsl-mp-desc">
                                                    {p.title}
                                                </p>
                                                <div className="tsl-mp-metaRow">
                                                    <div className="tsl-mp-rating">
                                                        <span className="tsl-mp-star">
                                                            ★
                                                        </span>
                                                        <span>
                                                            {p.rating.toFixed(
                                                                1,
                                                            )}
                                                        </span>
                                                        <span className="tsl-mp-rev">
                                                            ({p.reviews})
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="tsl-mp-bottomRow">
                                                    <div className="tsl-mp-price">
                                                        {p.priceLabel}
                                                    </div>
                                                    <button
                                                        className="tsl-mp-cta"
                                                        type="button"
                                                    >
                                                        {p.cta}
                                                        <ChevronRight
                                                            size={12}
                                                            className="tsl-mp-ctaIcon"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
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
            <MobileBottomNav theme={theme} />
        </div>
    );
};

export default DigitalProductListing;
