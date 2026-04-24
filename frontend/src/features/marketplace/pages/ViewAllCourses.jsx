import React, { useState, useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import { getAllMarketplaceListings } from "../api/listingApi";
import "./TeamServiceListing.css"; /* Reusing card styles */
import "./AllListingPages.css"; /* Reusing layout styles */

const ProductCard = ({ p, navigate }) => (
    <article className="tsl-mp-card" style={{ margin: 0, width: "100%", maxWidth: "100%" }}>
        <div className="tsl-mp-imgWrap">
            <img 
                className="tsl-mp-img" 
                src={p.image} 
                alt={p.title} 
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop";
                }}
            />
        </div>
        <div className="tsl-mp-cardBody">
            <div className="tsl-mp-topLine">
                <div className="tsl-mp-user">
                    {p.avatar ? (
                        <img 
                            src={p.avatar} 
                            alt={p.name} 
                            className="tsl-mp-avatar" 
                            style={{ objectFit: "cover", borderRadius: "50%" }}
                            onError={(e) => {
                                e.currentTarget.outerHTML = `<div class="tsl-mp-avatar" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:700;font-size:0.7rem;">${(p.name || "?").charAt(0).toUpperCase()}</div>`;
                            }}
                        />
                    ) : (
                        <div className="tsl-mp-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontWeight: '700', fontSize: '0.7rem' }}>
                            {(p.name || "?").charAt(0).toUpperCase()}
                        </div>
                    )}
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
                    <span>{(p.rating || 4.5).toFixed(1)}</span>
                    <span className="tsl-mp-rev">({p.reviews || 0})</span>
                </div>
            </div>
            <div className="tsl-mp-bottomRow">
                <div className="tsl-mp-price">{p.priceLabel}</div>
                <button
                    className="tsl-mp-cta"
                    style={{ backgroundColor: "#ceff1b", color: "#000" }}
                    type="button"
                    onClick={() => navigate(`/course/${p.listing_username || p.username}`)}
                >
                    {p.cta || "Know More"}
                    <ChevronRight size={12} className="tsl-mp-ctaIcon" />
                </button>
            </div>
        </div>
    </article>
);

const ViewAllCourses = ({ theme, setTheme }) => {
    // State matching ActiveProjectPage
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllMarketplaceListings();
                if (data.success) {
                    const filtered = data.listings.filter(l => l.listing_type === 'course');
                    setCourses(filtered);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const isAuthenticated = !!(localStorage.getItem("uh_auth_token") || localStorage.getItem("token") || localStorage.getItem("auth_token"));

    useEffect(() => {
        if (!isAuthenticated) {
            setSidebarOpen(false);
        }
    }, [isAuthenticated]);

    return (
        <div className={`alp-layout-wrapper user-page ${theme || "light"} min-h-screen relative overflow-hidden`}>
            {isAuthenticated ? (
                <UserNavbar
                    toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    theme={theme}
                    onDropdownChange={setIsDropdownOpen}
                />
            ) : (
                <Navbar />
            )}

            <div className="pt-[72px] flex relative w-full">
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

                <div className="relative flex-1 min-w-0 overflow-hidden w-full">
                    <div className="relative overflow-y-auto h-[calc(100vh-72px)] w-full">
                        <main className={`alp-main-content ${isDropdownOpen ? "blurred" : ""}`}>
                            <div className="alp-page-container">
                                <h1 className="alp-page-title">All Courses</h1>
                                {isLoading ? (
                                    <p style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>Loading courses...</p>
                                ) : (
                                    <div className="alp-grid">
                                        {courses.map((item, idx) => (
                                            <ProductCard key={item.id} p={item} navigate={navigate} />
                                        ))}
                                    </div>
                                )}
                                {!isLoading && courses.length === 0 && (
                                    <p style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>No courses available.</p>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAllCourses;
