import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import "./TeamServiceListing.css"; /* Reusing card styles */
import "./AllListingPages.css"; /* Reusing layout styles */

const mockProducts = Array(9).fill({
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
});

const ProductCard = ({ p }) => (
    <article className="tsl-mp-card" style={{ margin: 0, width: "100%", maxWidth: "100%" }}>
        <div className="tsl-mp-imgWrap">
            <img className="tsl-mp-img" src={p.image} alt="" />
        </div>
        <div className="tsl-mp-cardBody">
            <div className="tsl-mp-topLine">
                <div className="tsl-mp-user">
                    <div className="tsl-mp-avatar"></div>
                    <span className="tsl-mp-userName">{p.name}</span>
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
            <p className="tsl-mp-desc">{p.title}</p>
            <div className="tsl-mp-metaRow">
                <div className="tsl-mp-rating">
                    <span className="tsl-mp-star">★</span>
                    <span>{p.rating.toFixed(1)}</span>
                    <span className="tsl-mp-rev">({p.reviews})</span>
                </div>
            </div>
            <div className="tsl-mp-bottomRow">
                <div className="tsl-mp-price">{p.priceLabel}</div>
                <button
                    className="tsl-mp-cta"
                    style={{ backgroundColor: "#ceff1b", color: "#000" }}
                    type="button"
                >
                    {p.cta}
                    <ChevronRight size={12} className="tsl-mp-ctaIcon" />
                </button>
            </div>
        </div>
    </article>
);

const ViewAllProducts = ({ theme, setTheme }) => {
    // State matching ActiveProjectPage
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
        setShowSettings(false);
    }, []);

    return (
        <div className={`alp-layout-wrapper user-page ${theme || "light"} min-h-screen relative overflow-hidden`}>
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                theme={theme}
                onDropdownChange={setIsDropdownOpen}
            />

            <div className="pt-[72px] flex relative w-full">
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

                <div className="relative flex-1 min-w-0 overflow-hidden w-full">
                    <div className="relative overflow-y-auto h-[calc(100vh-72px)] w-full">
                        <main className={`alp-main-content ${isDropdownOpen ? "blurred" : ""}`}>
                            <div className="alp-page-container">
                                <h1 className="alp-page-title">All Products</h1>
                                <div className="alp-grid">
                                    {mockProducts.map((item, idx) => (
                                        <ProductCard key={"sp_" + idx} p={item} />
                                    ))}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAllProducts;
