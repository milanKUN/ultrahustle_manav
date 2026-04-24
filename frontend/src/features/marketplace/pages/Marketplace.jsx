import React, { useMemo, useState, useEffect, useRef } from "react";
import Navbar from "../../../components/layout/Navbar";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import heroImg from "../../../assets/marketplace-bg-light.jpeg";
import heroImgDark from "../../../assets/marketplace-bg-dark.jpeg";
import filterIcon from "../../../assets/filtericon.svg";
import { getAllMarketplaceListings, getMarketplaceCategories, getMarketplaceLanguages } from "../api/listingApi";
import { useNavigate } from "react-router-dom";
import "./Marketplace.css";


export default function Marketplace({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isMobileView, setIsMobileView] = useState(
        () => typeof window !== "undefined" && window.innerWidth < 950,
    );

    const [activeCat, setActiveCat] = useState("All");
    const [openChip, setOpenChip] = useState(null);
    const [dropdownTop, setDropdownTop] = useState(0);
    const gridRef = useRef(null);
    const chipRowRef = useRef(null);
    const filterRowRef = useRef(null);

    // filter panel state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterCats, setFilterCats] = useState([]);
    const [filterLangs, setFilterLangs] = useState([]);
    const [filterTags, setFilterTags] = useState([]);
    const [aiOnly, setAiOnly] = useState(false);
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [sortBy, setSortBy] = useState("most_relevant");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null);
    const [activeSetting, setActiveSetting] = useState("");
    const [activeChipFilter, setActiveChipFilter] = useState(null);

    const navigate = useNavigate();
    const [allListings, setAllListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dbListingTypes, setDbListingTypes] = useState([]);
    const [dbLanguages, setDbLanguages] = useState([]);

    const isAuthenticated = !!(localStorage.getItem("uh_auth_token") || localStorage.getItem("token") || localStorage.getItem("auth_token"));

    useEffect(() => {
        if (!isAuthenticated) {
            setSidebarOpen(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingsData, categoriesData, languagesData] = await Promise.all([
                    getAllMarketplaceListings(),
                    getMarketplaceCategories(),
                    getMarketplaceLanguages(),
                ]);
                if (listingsData.success) setAllListings(listingsData.listings);
                if (categoriesData.success) setDbListingTypes(categoriesData.listing_types);
                if (languagesData.success) setDbLanguages(languagesData.languages);
            } catch (err) {
                console.error("Error fetching marketplace data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
        setShowSettings(false);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const handleResize = () => {
            const mobile = window.innerWidth < 950;
            setIsMobileView(mobile);

            if (!mobile) {
                setSidebarOpen(false);
                setShowSettings(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Searchable Filter States
    const [langSearch, setLangSearch] = useState("");
    const [tagSearch, setTagSearch] = useState("");

    const allLanguages = useMemo(() => {
        if (dbLanguages.length > 0) {
            return dbLanguages.map(l => l.value);
        }
        return [
            "English", "Hindi", "Tamil", "Spanish", "French", "German", "Japanese",
            "Chinese", "Arabic", "Portuguese", "Russian", "Italian", "Korean", "Dutch",
            "Turkish", "Bengali", "Marathi", "Telugu", "Gujarati", "Punjabi"
        ];
    }, [dbLanguages]);

    const allTags = useMemo(() => [
        "Ai", "Automation", "Branding", "Web Dev", "Copywriting", "Design", "Video",
        "Voiceover", "3D Design", "SEO", "Marketing", "SaaS", "Mobile App", "BlockChain",
        "UX/UI", "Illustrations", "Social Media", "Cybersecurity", "E-commerce", "Consulting"
    ], []);

    const filteredLangSuggestions = useMemo(() => {
        if (!langSearch.trim()) return [];
        return allLanguages.filter(l =>
            l.toLowerCase().includes(langSearch.toLowerCase()) && !filterLangs.includes(l)
        );
    }, [langSearch, allLanguages, filterLangs]);

    const filteredTagSuggestions = useMemo(() => {
        if (!tagSearch.trim()) return [];
        return allTags.filter(t =>
            t.toLowerCase().includes(tagSearch.toLowerCase()) && !filterTags.includes(t)
        );
    }, [tagSearch, allTags, filterTags]);

    const sortOptions = useMemo(
        () => [
            { value: "most_relevant", label: "Most Relevant" },
            { value: "newest", label: "Newest" },
            { value: "price_low", label: "Price: Low to High" },
            { value: "price_high", label: "Price: High to Low" },
            { value: "top_rated", label: "Top Rated" },
        ],
        []
    );


    const selectedSortLabel =
        sortOptions.find((opt) => opt.value === sortBy)?.label || "Select Sort";

    // Outside click for sort dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        if (isSortOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSortOpen]);

    const toggleFilterCat = (cat) => {
        setFilterCats((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };


    const scrollChips = (direction) => {
        if (chipRowRef.current) {
            const scrollAmount = 300;
            chipRowRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // close chip dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                chipRowRef.current && !chipRowRef.current.contains(e.target) &&
                filterRowRef.current && !filterRowRef.current.contains(e.target)
            ) {
                setOpenChip(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // update dropdown top on scroll so it follows the filter row
    useEffect(() => {
        if (!openChip) return;
        const scrollEl = document.querySelector(".mp-scroll-area");
        if (!scrollEl) return;
        const onScroll = () => {
            if (filterRowRef.current) {
                const rect = filterRowRef.current.getBoundingClientRect();
                setDropdownTop(rect.bottom);
            }
        };
        scrollEl.addEventListener("scroll", onScroll);
        return () => scrollEl.removeEventListener("scroll", onScroll);
    }, [openChip]);

    const handleChipClick = (label) => {
        if (filterRowRef.current) {
            const rect = filterRowRef.current.getBoundingClientRect();
            setDropdownTop(rect.bottom);
        }
        setOpenChip((prev) => (prev === label ? null : label));
    };




    const courses = allListings.filter((l) => l.listing_type === "course");
    const webinars = allListings.filter((l) => l.listing_type === "webinar");
    const digitalProducts = allListings.filter((l) => l.listing_type === "digital_product");
    const services = allListings.filter((l) => l.listing_type === "service");

    // Dynamic category labels from DB
    const listingTypeLabel = useMemo(() => {
        const labels = {
            service: "Service",
            course: "Courses",
            webinar: "Webinars",
            digital_product: "Digital Products",
        };
        dbListingTypes.forEach(t => {
            labels[t.slug] = t.name;
        });
        return labels;
    }, [dbListingTypes]);

    const listingTypeOptions = useMemo(() => {
        // Only show types that have at least one listing
        const types = [...new Set(allListings.map((l) => l.listing_type).filter(Boolean))];
        return types;
    }, [allListings]);

    // Dynamic chips = unique sub_categories for active listing type
    const dynamicChips = useMemo(() => {
        const base = activeCat === "All" ? allListings : allListings.filter((l) => l.listing_type === activeCat);
        return [...new Set(base.map((l) => l.sub_category).filter(Boolean))];
    }, [allListings, activeCat]);

    // Product types inside an open chip (for dropdown)
    const chipProductTypes = useMemo(() => {
        if (!openChip) return [];
        const base = activeCat === "All" ? allListings : allListings.filter((l) => l.listing_type === activeCat);
        return [...new Set(base.filter((l) => l.sub_category === openChip).map((l) => l.product_type).filter(Boolean))];
    }, [allListings, activeCat, openChip]);

    // Filtered listings based on active category + chip selection
    const filteredListings = useMemo(() => {
        let result = allListings;
        if (activeCat !== "All") result = result.filter((l) => l.listing_type === activeCat);
        if (activeChipFilter) {
            result = result.filter(
                (l) => l.sub_category === activeChipFilter || l.product_type === activeChipFilter
            );
        }
        return result;
    }, [allListings, activeCat, activeChipFilter]);

    const randomProductTypes = useMemo(() => {
        const groups = {};
        allListings.forEach((item) => {
            const sub = item.product_type || item.sub_category || item.category || "Other";
            if (!groups[sub]) groups[sub] = [];
            groups[sub].push(item);
        });
        const groupArr = Object.entries(groups).map(([title, groupItems]) => ({
            title,
            items: groupItems,
        }));
        // Shuffle to get 2 random groups
        return groupArr.sort(() => 0.5 - Math.random()).slice(0, 2);
    }, [allListings]);

    const renderListingSection = (sectionTitle, items, viewAllPath) => {
        if (!items || items.length === 0) return null;

        return (
            <div key={sectionTitle} className="mp-dynamic-section mp-listing-container" style={{ marginBottom: "40px" }}>
                <h2 className="mp-sectionTitle" style={{ fontSize: "1.8rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginBottom: "20px" }}>{sectionTitle}</h2>
                <div className="mp-grid">
                    {items.map((p) => (
                        <article className="mp-card" key={p.id}>
                            <div className="mp-imgWrap">
                                <img
                                    className="mp-img"
                                    src={p.image}
                                    alt={p.title}
                                    onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop";
                                    }}
                                />
                            </div>

                            <div className="mp-cardBody">
                                <div className="mp-topLine">
                                    <div className="mp-user">
                                        {p.avatar ? (
                                            <img
                                                className="mp-avatar"
                                                src={p.avatar}
                                                alt={p.name}
                                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                                onError={(e) => {
                                                    e.currentTarget.outerHTML = `<div class="mp-avatar" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:700;font-size:0.7rem;">${(p.name || "?").charAt(0).toUpperCase()}</div>`;
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="mp-avatar"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                {(p.name || "?").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="mp-userName">{p.name}</span>
                                        {p.verified && (
                                            <svg className="mp-verifyIcon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path fill="#1DA1F2" d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.7.54-1.51.26-3.23-.97-4.46-1.23-1.23-2.95-1.51-4.46-.97C14.13 2.08 12.76 1.2 11.18 1.2c-1.58 0-2.95.88-3.7 2.18-1.51-.54-3.23-.26-4.46.97-1.23 1.23-1.51 2.95-.97 4.46C.88 9.55 0 10.92 0 12.5c0 1.58.88 2.95 2.18 3.7-.54 1.51-.26 3.23.97 4.46 1.23 1.23 2.95 1.51 4.46.97 0.74 1.3 2.11 2.18 3.69 2.18 1.58 0 2.95-.88 3.7-2.18 1.51.54 3.23.26 4.46-.97 1.23-1.23 1.51-2.95.97-4.46 1.3-.75 2.18-2.12 2.18-3.7z" />
                                                <path stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l3 3 5-5" />
                                            </svg>
                                        )}
                                    </div>

                                    {p.ai && (
                                        <span className="mp-aiBadge">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                                            </svg>
                                            Ai Powered
                                        </span>
                                    )}
                                </div>

                                <p className="mp-desc">{p.title}</p>

                                <div className="mp-metaRow">
                                    <div className="mp-rating">
                                        <span className="mp-star">★</span>
                                        <span>{p.rating?.toFixed(1)}</span>
                                        <span className="mp-rev">({p.reviews})</span>
                                    </div>
                                </div>

                                <div className="mp-bottomRow">
                                    <div className="mp-price">{p.priceLabel}</div>
                                    <button className="mp-cta" type="button" onClick={() => {
                                        const pathMap = {
                                            'course': '/course',
                                            'webinar': '/webinar',
                                            'digital_product': '/digital-product',
                                            'service': '/service'
                                        };
                                        const prefix = pathMap[p.listing_type] || '/service';
                                        navigate(`${prefix}/${p.listing_username || p.username}`);
                                    }}>
                                        {p.cta}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mp-ctaIcon">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <button className="mp-floatArrow left" type="button" aria-label="Previous" onClick={(e) => {
                    const grid = e.currentTarget.parentElement.querySelector('.mp-grid');
                    if (grid) grid.scrollBy({ left: -300, behavior: "smooth" });
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <button className="mp-floatArrow right" type="button" aria-label="Next" onClick={(e) => {
                    const grid = e.currentTarget.parentElement.querySelector('.mp-grid');
                    if (grid) grid.scrollBy({ left: 300, behavior: "smooth" });
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <div className="mp-viewAllRow">
                    <button className="mp-viewAllBtn" type="button" onClick={() => viewAllPath && navigate(viewAllPath)}>
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={`mp-page user-page ${theme} h-screen relative overflow-hidden`}>
                {/* NAVBAR */}
                {isAuthenticated ? (
                    <UserNavbar
                        toggleSidebar={() => setSidebarOpen((p) => !p)}
                        isSidebarOpen={sidebarOpen}
                        theme={theme}
                    />
                ) : (
                    <Navbar />
                )}

                <div className="mp-content-wrapper flex flex-1 relative z-10">
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

                    {/* MAIN CONTENT */}
                    <div className="relative flex-1 min-w-5 overflow-hidden">
                        <div className="mp-scroll-area relative z-10 overflow-y-auto h-full">
                            <section className="mp-hero">
                                <img
                                    src={theme === "dark" ? heroImgDark : heroImg}
                                    alt="Marketplace Hero"
                                    className="mp-heroImg"
                                />
                                <div className="mp-heroOverlay" />
                                <div className="mp-heroInner">
                                    <div className="mp-heroText">
                                        <h1 className="mp-heroTitle">Welcome back, Name!</h1>
                                        <h1 className="mp-heroSub">Your <span className="mp-highlight">hustle</span> starts here.</h1>
                                    </div>



                                </div>
                            </section>

                            <div className="mp-shell">
                                <div className="mp-catRow">
                                    <button
                                        key="All"
                                        className={`mp-pill ${activeCat === "All" ? "active" : ""}`}
                                        onClick={() => { setActiveCat("All"); setOpenChip(null); setActiveChipFilter(null); }}
                                        type="button"
                                    >
                                        All
                                    </button>
                                    {listingTypeOptions.map((type) => (
                                        <button
                                            key={type}
                                            className={`mp-pill ${activeCat === type ? "active" : ""}`}
                                            onClick={() => { setActiveCat(type); setOpenChip(null); setActiveChipFilter(null); }}
                                            type="button"
                                        >
                                            {listingTypeLabel[type] || type}
                                        </button>
                                    ))}
                                </div>

                                <div className="mp-filterRow" ref={filterRowRef}>
                                    <button className="mp-filterBtn" type="button" onClick={() => setIsFilterOpen(true)}>
                                        <span>Filter</span>
                                        <img src={filterIcon} alt="filtericon" />
                                    </button>

                                    <div className="mp-chipScroller-wrapper">
                                        <button
                                            className="chip-arrow left"
                                            type="button"
                                            onClick={() => scrollChips("left")}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </button>

                                        <div className="mp-chipScroller" ref={chipRowRef}>
                                            {dynamicChips.map((chip) => (
                                                <div className="mp-chipWrap" key={chip}>
                                                    <button
                                                        className={`mp-chip ${openChip === chip ? "active open" : ""} ${activeChipFilter === chip ? "active" : ""}`}
                                                        type="button"
                                                        onClick={() => handleChipClick(chip)}
                                                    >
                                                        {chip}
                                                        <svg className="mp-chipIcon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="6 9 12 15 18 9"></polyline>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            className="chip-arrow right"
                                            type="button"
                                            onClick={() => scrollChips("right")}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="mp-listing-container"><p style={{ color: '#fff', textAlign: 'center', margin: '40px 0' }}>Loading marketplace listings...</p></div>
                                ) : (
                                    <>
                                        {(activeCat === "All" && !activeChipFilter) ? (
                                            <>
                                                {renderListingSection("All Products", allListings, "/all-listings")}
                                                {renderListingSection("Services", services, "/view-all-services")}
                                                {renderListingSection("Courses", courses, "/view-all-courses")}
                                                {renderListingSection("Webinars", webinars, "/view-all-webinars")}
                                                {renderListingSection("Digital Products", digitalProducts, "/view-all-products")}
                                                {randomProductTypes.map((group) => renderListingSection(group.title, group.items))}
                                            </>
                                        ) : (
                                            renderListingSection(
                                                activeChipFilter
                                                    ? activeChipFilter
                                                    : (listingTypeLabel[activeCat] || activeCat),
                                                filteredListings
                                            )
                                        )}
                                        {allListings.length === 0 && (
                                            <div className="mp-listing-container"><p style={{ color: '#fff', textAlign: 'center', margin: '40px 0' }}>No listings available.</p></div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* CHIP FILTER MEGA DROPDOWN — product types from DB */}
                {openChip && chipProductTypes.length > 0 && (
                    <div
                        className="mp-megaDropdown"
                        style={{ top: dropdownTop }}
                        onWheel={(e) => {
                            const scrollEl = document.querySelector(".mp-scroll-area");
                            if (scrollEl) scrollEl.scrollTop += e.deltaY;
                        }}
                    >
                        <div className="mp-megaGrid">
                            <div className="mp-megaGroup">
                                <p className="mp-megaGroupTitle">{openChip}</p>
                                <button
                                    className={`mp-megaItem ${activeChipFilter === openChip ? "active" : ""}`}
                                    type="button"
                                    onClick={() => { setActiveChipFilter(prev => prev === openChip ? null : openChip); setOpenChip(null); }}
                                >
                                    All in {openChip}
                                </button>
                                {chipProductTypes.map((pt) => (
                                    <button
                                        key={pt}
                                        className={`mp-megaItem ${activeChipFilter === pt ? "active" : ""}`}
                                        type="button"
                                        onClick={() => { setActiveChipFilter(prev => prev === pt ? null : pt); setOpenChip(null); }}
                                    >
                                        {pt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {openChip && chipProductTypes.length === 0 && (() => {
                    // No product types — clicking chip directly sets it as filter
                    setActiveChipFilter(prev => prev === openChip ? null : openChip);
                    setOpenChip(null);
                    return null;
                })()}
            </div>

            {/* FILTER DRAWER */}
            {isFilterOpen && (
                <div className="mp-filterOverlay" onClick={() => setIsFilterOpen(false)}>
                    <div className="mp-filterDrawer" onClick={(e) => e.stopPropagation()}>
                        <div className="mp-filterHeader">
                            <span className="mp-filterTitle">Filters</span>
                            <div className="flex items-center gap-4">
                                <button
                                    className="mp-clearBtn"
                                    type="button"
                                    onClick={() => {
                                        setFilterCats([]);
                                        setFilterLangs([]);
                                        setFilterTags([]);
                                        setAiOnly(false);
                                        setPriceMin("");
                                        setPriceMax("");
                                    }}
                                >
                                    Clear All
                                </button>
                                <button className="mp-filterClose" type="button" onClick={() => setIsFilterOpen(false)}>✕</button>
                            </div>
                        </div>

                        <div className="mp-filter-scroll-body">
                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Product Categories</div>
                                <div className="mp-filterCatRow">
                                    {(dbListingTypes.length > 0 ? dbListingTypes : [{ slug: "service", name: "Service" }, { slug: "digital_product", name: "Digital Product" }, { slug: "course", name: "Course" }, { slug: "webinar", name: "Webinar" }]).map((cat) => (
                                        <button
                                            key={cat.slug}
                                            type="button"
                                            className={`mp-filterCatBtn ${filterCats.includes(cat.slug) ? "active" : ""}`}
                                            onClick={() => toggleFilterCat(cat.slug)}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Language</div>
                                <div className="mp-searchWrapper">
                                    <input
                                        type="text"
                                        placeholder="Search language..."
                                        className="mp-filterSearchInput"
                                        value={langSearch}
                                        onChange={(e) => setLangSearch(e.target.value)}
                                    />
                                    {filteredLangSuggestions.length > 0 && (
                                        <div className="mp-filterSuggestions">
                                            {filteredLangSuggestions.map(lang => (
                                                <div
                                                    key={lang}
                                                    className="mp-suggestionItem"
                                                    onClick={() => {
                                                        setFilterLangs(prev => [...prev, lang]);
                                                        setLangSearch("");
                                                    }}
                                                >
                                                    {lang}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mp-filterCatRow mt-3">
                                    {filterLangs.map((lang) => (
                                        <button
                                            key={lang}
                                            type="button"
                                            className="mp-filterCatBtn active"
                                            onClick={() => setFilterLangs((prev) => prev.filter((l) => l !== lang))}
                                        >
                                            {lang} ✕
                                        </button>
                                    ))}
                                    {!langSearch && filterLangs.length === 0 && (
                                        <div className="mp-searchHint"></div>
                                    )}
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Tags</div>
                                <div className="mp-searchWrapper">
                                    <input
                                        type="text"
                                        placeholder="Search tags..."
                                        className="mp-filterSearchInput"
                                        value={tagSearch}
                                        onChange={(e) => setTagSearch(e.target.value)}
                                    />
                                    {filteredTagSuggestions.length > 0 && (
                                        <div className="mp-filterSuggestions">
                                            {filteredTagSuggestions.map(tag => (
                                                <div
                                                    key={tag}
                                                    className="mp-suggestionItem"
                                                    onClick={() => {
                                                        setFilterTags(prev => [...prev, tag]);
                                                        setTagSearch("");
                                                    }}
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mp-filterCatRow mt-3">
                                    {filterTags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className="mp-filterCatBtn active"
                                            onClick={() => setFilterTags((prev) => prev.filter((t) => t !== tag))}
                                        >
                                            {tag} ✕
                                        </button>
                                    ))}
                                    {!tagSearch && filterTags.length === 0 && (
                                        <div className="mp-searchHint"></div>
                                    )}
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Trust Filter</div>
                                <div className="mp-filterToggleRow">
                                    <button type="button" className={`mp-toggle ${aiOnly ? "on" : ""}`} onClick={() => setAiOnly((p) => !p)} aria-pressed={aiOnly}><span className="mp-toggleKnob" /></button>
                                    <span className="mp-filterToggleLabel">AI-Powered only</span>
                                </div>

                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterHeaderPrice">
                                    <div className="mp-filterLabel">Price Range</div>
                                    <div className="mp-filterValueText">${priceMin || 0} — ${priceMax || 50000}</div>
                                </div>
                                <div className="mp-price-slider-container">
                                    <div
                                        className="mp-slider-track"
                                        style={{
                                            background: `linear-gradient(to right, 
                                            rgba(255, 255, 255, 0.1) ${((priceMin || 0) / 50000) * 100}%, 
                                            #ceff1b ${((priceMin || 0) / 50000) * 100}%, 
                                            #ceff1b ${((priceMax || 50000) / 50000) * 100}%, 
                                            rgba(255, 255, 255, 0.1) ${((priceMax || 50000) / 50000) * 100}%)`
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        value={priceMin || 0}
                                        onChange={(e) => {
                                            const value = Math.min(Number(e.target.value), (priceMax || 50000) - 100);
                                            setPriceMin(value);
                                        }}
                                        className="mp-range-input mp-range-min"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        value={priceMax || 50000}
                                        onChange={(e) => {
                                            const value = Math.max(Number(e.target.value), (priceMin || 0) + 100);
                                            setPriceMax(value);
                                        }}
                                        className="mp-range-input mp-range-max"
                                    />
                                </div>
                                <div className="mp-price-labels">
                                    <div className="mp-price-label-item">
                                        <span>Min</span>
                                        <div className="mp-price-label-box">${priceMin || 0}</div>
                                    </div>
                                    <div className="mp-price-label-item">
                                        <span>Max</span>
                                        <div className="mp-price-label-box">${priceMax || 50000}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Sort By</div>
                                <div className="mp-custom-select" ref={sortRef}>
                                    <div
                                        className={`mp-selected-option ${isSortOpen ? "open" : ""}`}
                                        onClick={() => setIsSortOpen((v) => !v)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") setIsSortOpen((v) => !v);
                                        }}
                                    >
                                        {selectedSortLabel}
                                        <span className="mp-arrow">▼</span>
                                    </div>

                                    {isSortOpen && (
                                        <ul className="mp-options-list">
                                            {sortOptions.map((option) => (
                                                <li
                                                    key={option.value}
                                                    className={sortBy === option.value ? "active" : ""}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mp-filterFooter">
                            <button type="button" className="mp-filterApply" onClick={() => setIsFilterOpen(false)}>Apply filters</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE BOTTOM NAV */}
            <MobileBottomNav theme={theme} />
        </>
    );
}
