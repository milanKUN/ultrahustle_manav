import { useEffect, useRef, useState } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import { Search, Lock, ShieldCheck, FileText } from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import "./HomePage.css";

const slides = [
    {
        text: "create.",
        bg: "/Create.jpeg",
    },
    {
        text: "connect.",
        bg: "/Connect.jpeg",
    },
    {
        text: "grow.",
        bg: "/Grow.jpeg",
    },
];

const buildAroundDomainCards = [
    {
        eyebrow: "SERVICES",
        title: "The core of every deal",
        description:
            "Creators list skills. Clients browse the marketplace and connect directly. Escrow protects every deal.",
        visualTheme: "emerald",
        image: "/services-card.png",
    },
    {
        eyebrow: "DIGITAL PRODUCTS",
        title: "Sell once, earn always",
        description:
            "Templates, presets, packs — passive income for creators, instant downloads for clients.",
        visualTheme: "sunset",
        image: "/products-card.png",
    },
    {
        eyebrow: "COURSES & WEBINARS",
        title: "Knowledge that compounds",
        description:
            "Creators teach. Clients learn. Skills that scale beyond any single project.",
        visualTheme: "gold",
        image: "/course-card.png",
    },
    {
        eyebrow: "TEAMS",
        title: "Bigger projects, built together",
        description:
            "Creators build squads. Clients get full-stack teams without the agency markup.",
        visualTheme: "violet",
        image: "/teams-card.png",
    },
    {
        eyebrow: "Client Payments",
        title: "Turn yes into revenue",
        description:
            "Create a smooth path from approved scope to invoice, deposit, and final payout without awkward back-and-forth.",
        visualTheme: "cyan",
        image: "",
    },
];

const buildAroundDomainRows = [
    [buildAroundDomainCards[0]],
    [buildAroundDomainCards[1], buildAroundDomainCards[2]],
    [buildAroundDomainCards[3]],
];

const bringTogetherPanels = [
    {
        eyebrow: "FOR CREATORS & FREELANCERS",
        title: "Imagine building a career on your terms. Now do it.",
        description:
            "Ultra Hustle is designed to make your talent visible to the clients who are already looking for it — so you spend less time pitching and more time doing what you do best.",
        bullets: [
            "List services, products, courses, webinars, and teams from one profile",
            "Your listings go live on the marketplace where clients are already browsing",
            "Escrow locks funds in before you start a single task",
            "Instant payout the moment your work is approved",
        ],
        cta: "Start earning free",
        tone: "light",
    },
    {
        eyebrow: "FOR CLIENTS & BUSINESSES",
        title:
            "Every creator you need is one search away.",
        description:
            "The marketplace puts verified talent in front of you — ranked by real reputation, real reviews, and real delivery history. Browse freely. Hire confidently. Pay only when work is done.",
        bullets: [
            "Browse verified creators on the marketplace and connect directly to the right fit",
            "Milestone escrow — you control every single payment release",
            "KYC-verified creators with real reputation scores, not fake reviews",
            "Smart contracts lock scope before work begins — no surprises",
        ],
        cta: "Browse the marketplace",
        tone: "dark",
    },
];

const howItWorksSteps = {
    creator: {
        bg: "/Creator.png",
        steps: [
            { num: "01", tag: "BUILD", title: "Set up your profile", desc: "Create your profile and list your services, products, or courses. Go from signup to live in under an hour." },
            { num: "02", tag: "LIST", title: "Publish everything you offer", desc: "Services, digital products, courses, webinars, or teams — all on one profile, one dashboard." },
            { num: "03", tag: "MATCH", title: "Clients come to you", desc: "Gig Matcher puts your listings in front of buyers who are ready. Stop cold pitching. Start receiving." },
            { num: "04", tag: "EARN", title: "Deliver. Get paid. Same day.", desc: "Escrow releases the moment your work is approved. Payout hits your wallet automatically." },
        ],
    },
    client: {
        bg: "/Client.png",
        steps: [
            { num: "01", tag: "BRIEF", title: "Describe your project", desc: "Post what you need, your timeline, and your budget. Gig Matcher does the rest." },
            { num: "02", tag: "MATCH", title: "Meet your top creators", desc: "Verified creators ranked by fit, reputation score, and delivery history. No scrolling through hundreds." },
            { num: "03", tag: "PROJECT", title: "Fund escrow. Work begins.", desc: "Your payment is held until you approve each milestone. You stay in control from first message to final delivery." },
            { num: "04", tag: "DONE", title: "Approve. Pay. Repeat.", desc: "Review the work, approve, funds release. No invoices. No wire transfers. No friction." },
        ],
    },
};

function TrustSection() {
    return (
        <motion.section
            className="trust-section"
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{
                duration: 1.6,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <div className="trust-shell">
                <div className="trust-content">
                    <span className="trust-eyebrow">TRUST & SECURITY</span>
                    <h2 className="clash trust-headline">
                        Built on trust. <br />
                        Backed by structure.
                    </h2>
                    <p className="trust-description">
                        Every deal on Ultra Hustle is designed to feel safe — for the
                        creator delivering great work and the client investing in it.
                        Escrow, smart contracts, and KYC verification protect everyone.
                    </p>

                    <div className="trust-stats">
                        <div className="trust-stat">
                            <span className="trust-stat-val">100%</span>
                            <span className="trust-stat-label">
                                Escrow-protected transactions
                            </span>
                        </div>
                        {/* <div className="trust-stat">
                            <span className="trust-stat-val">₹0</span>
                            <span className="trust-stat-label">
                                Founding creator commission
                            </span>
                        </div> */}
                        <div className="trust-stat">
                            <span className="trust-stat-val">&lt;2hr</span>
                            <span className="trust-stat-label">
                                Average dispute resolution
                            </span>
                        </div>
                    </div>
                </div>

                <div className="trust-cards">
                    <div className="trust-card trust-card-light">
                        <div className="trust-card-icon-box">
                            <Lock size={20} className="text-orange-500" />
                        </div>
                        <div className="trust-card-body">
                            <span className="trust-card-eyebrow">FOR CREATORS</span>
                            <h3 className="trust-card-title">Get paid before it&apos;s too late</h3>
                            <p className="trust-card-desc">
                                Escrow locks client funds before you start. You deliver.
                                Funds release. No invoice chasing, no excuses.
                            </p>
                        </div>
                    </div>

                    <div className="trust-card trust-card-dark">
                        <div className="trust-card-icon-box">
                            <ShieldCheck size={20} className="text-blue-500" />
                        </div>
                        <div className="trust-card-body">
                            <span className="trust-card-eyebrow">FOR CLIENTS</span>
                            <h3 className="trust-card-title !text-[#fff]">Your money moves only when you approve</h3>
                            <p className="trust-card-desc">
                                Milestone-based escrow means you control every release.
                                KYC-verified creators and real support behind every deal.
                            </p>
                        </div>
                    </div>

                    <div className="trust-card trust-card-lime">
                        <div className="trust-card-icon-box">
                            <FileText size={20} className="text-black" />
                        </div>
                        <div className="trust-card-body">
                            <span className="trust-card-eyebrow">SMART CONTRACTS</span>
                            <h3 className="trust-card-title">Scope locked. Terms enforced.</h3>
                            <p className="trust-card-desc">
                                Auto-generated contracts based on your project. No ambiguity.
                                No scope creep. No &quot;but you said...&quot; moments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

function HowItWorksSection() {
    const [activeTab, setActiveTab] = useState("creator");
    const { bg, steps } = howItWorksSteps[activeTab];

    return (
        <motion.section
            className="hiw-section"
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{
                duration: 1.6,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {/* Background images — one per tab, cross-faded via opacity */}
            <div className="hiw-bg-layer">
                <div
                    className={`hiw-bg-img ${activeTab === "creator" ? "hiw-bg-img--active" : ""}`}
                    style={{ backgroundImage: "url('/Creator.png')" }}
                />
                <div
                    className={`hiw-bg-img ${activeTab === "client" ? "hiw-bg-img--active" : ""}`}
                    style={{ backgroundImage: "url('/Client.png')" }}
                />
                <div className="hiw-bg-overlay" />
            </div>

            <div className="hiw-shell">
                {/* Header */}
                <div className="hiw-header">
                    <span className="hiw-eyebrow">HOW IT WORKS</span>
                    <h2 className="clash hiw-headline">Your journey starts here</h2>

                    {/* Tab toggle */}
                    <div className="hiw-toggle">
                        <button
                            type="button"
                            className={`hiw-toggle-btn ${activeTab === "creator" ? "hiw-toggle-active" : ""}`}
                            onClick={() => setActiveTab("creator")}
                        >
                            I&apos;m a Creator
                        </button>
                        <button
                            type="button"
                            className={`hiw-toggle-btn ${activeTab === "client" ? "hiw-toggle-active" : ""}`}
                            onClick={() => setActiveTab("client")}
                        >
                            I&apos;m a Client
                        </button>
                    </div>
                </div>

                {/* Step cards */}
                <div className="hiw-cards">
                    {steps.map((step, i) => (
                        <motion.div
                            key={`${activeTab}-${step.num}`}
                            className="hiw-card"
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="hiw-card-num">{step.num}</span>
                            <span className="hiw-card-tag">{step.tag}</span>
                            <h3 className="hiw-card-title">{step.title}</h3>
                            <p className="hiw-card-desc">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}

const SCROLL_HEIGHT = `${slides.length * 120}vh`;

function ScrollSlide({ slide, index, total, progress, reduceMotion }) {
    const segment = 1 / total;
    const start = index * segment;
    const end = start + segment;
    const fadeStart = Math.max(0, start - segment * 0.32);
    const fadeInEnd = start + segment * 0.24;
    const fadeOutStart = end - segment * 0.24;
    const fadeEnd = Math.min(1, end + segment * 0.18);
    const isLast = index === total - 1;

    const layerOpacity = useTransform(
        progress,
        [fadeStart, fadeInEnd, fadeOutStart, fadeEnd],
        isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
    );
    const imageScale = useTransform(progress, [start, end], [1.5, 1]);
    const imageY = useTransform(progress, [start, end], [64, 30]);
    const copyOpacity = useTransform(
        progress,
        [fadeStart, fadeInEnd, fadeOutStart, fadeEnd],
        [0, 1, 1, 0],
    );
    const copyY = useTransform(progress, [start, end], [70, 0]);
    const copyScale = useTransform(progress, [start, end], [0.96, 1]);

    return (
        <motion.div
            className="absolute inset-0"
            style={{ opacity: layerOpacity, zIndex: total - index }}
        >
            <motion.div
                className="absolute inset-0"
                style={
                    reduceMotion
                        ? undefined
                        : {
                              scale: imageScale,
                              y: imageY,
                          }
                }
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.bg})` }}
                />
            </motion.div>

            <div className="scroll-story-overlay absolute inset-0" />

            <motion.div
                className="relative z-10 flex h-full items-center justify-center px-6 text-center"
                style={
                    reduceMotion
                        ? { opacity: 1 }
                        : {
                              opacity: copyOpacity,
                              y: copyY,
                              scale: copyScale,
                          }
                }
            >
                <div className="mx-auto max-w-6xl">
                    <h2 className="clash scroll-story-title text-[#CEFF1B] font-extrabold tracking-[-0.07em] flex items-center justify-center">
                        {slide.text}
                    </h2>
                </div>
            </motion.div>
        </motion.div>
    );
}


export default function HomePage() {
    const buildSectionRef = useRef(null);

    const { scrollYProgress: buildProgress } = useScroll({
        target: buildSectionRef,
        offset: ["start end", "start start"],
    });

    const buildScale = useTransform(buildProgress, [0, 1], [0.85, 1]);
    const buildY = useTransform(buildProgress, [0, 1], [120, 0]);
    const buildOpacity = useTransform(buildProgress, [0, 0.3, 1], [0, 1, 1]);

    const sectionRef = useRef(null);
    const [showNavbar, setShowNavbar] = useState(true);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 110,
        damping: 26,
        mass: 0.2,
    });
    const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 16) {
                setShowNavbar(true);
            } else if (currentScrollY < lastScrollY) {
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY) {
                setShowNavbar(false);
            }

            lastScrollY = currentScrollY;
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="relative z-30">
            <Navbar
                className={`transition-all duration-300 ${
                    showNavbar
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full opacity-0 pointer-events-none"
                }`}
            />
            <section
                className="homepage-hero relative flex min-h-screen items-start justify-start px-8 pt-24 sm:px-6 md:px-10 lg:px-20"
                style={{
                    backgroundImage: "url('/homepage-hero2.png')",
                    backgroundSize: "130%",
                    backgroundPosition: "100% center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="homepage-hero-overlay absolute left-0 top-0 h-full pointer-events-none">
                    <div className="h-full w-full bg-gradient-to-r from-white/30 to-transparent backdrop-blur-md" />
                </div>

                <div className="homepage-hero-copy relative z-10 max-w-[680px] lg:max-w-[500px]">
                    <h1 className="clash pt-4 text-[2.35rem] font-black leading-[1.08] tracking-[-0.04em] text-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)] sm:pt-8 sm:text-[3.6rem] md:text-[4.35rem] lg:pt-10 lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.02em]">
                        Where world class <br />
                        talent meets
                        <br />
                        <span className="inline-block bg-[#C6FF00] px-1 py-1">
                            clients who value it.
                        </span>
                    </h1>

                    <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-relaxed text-gray-700 sm:text-[1rem] md:text-[1.02rem] lg:text-[14px]">
                        Ultra Hustle is the marketplace where top creators sell
                        their skills and smart clients find exactly who they
                        need, protected, fast, and fair.
                    </p>

                    <div className="mt-4 w-full max-w-[580px] lg:w-[580px]">
                        <div className="homepage-search-shell flex items-center justify-between rounded-full border border-white/40 bg-white/70 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-md sm:px-5 md:px-6">
                            <input
                                type="text"
                                placeholder="Search here"
                                className="min-w-0 w-full border-none bg-transparent text-sm text-black outline-none placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-base"
                            />
                            <Search className="ml-3 h-4 w-4 shrink-0 text-gray-500 sm:h-5 sm:w-5" />
                        </div>
                    </div>

                    <div className="mt-4 flex w-full max-w-[650px] flex-wrap gap-2 lg:w-[650px]">
                        {[
                            "Service",
                            "Digital Products",
                            "Teams",
                            "Courses",
                            "Webinars",
                        ].map((item) => (
                            <button
                                key={item}
                                className="rounded-full border border-white/50 bg-white/40 px-3 py-2 text-xs text-gray-700 backdrop-blur-md transition-all duration-200 hover:bg-[#C6FF00]/80 hover:text-black sm:text-sm"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section
                ref={sectionRef}
                className="relative overflow-clip bg-[#040404]"
                style={{ height: SCROLL_HEIGHT }}
            >
                <div className="sticky top-0 h-screen overflow-hidden">
                    <div className="absolute inset-0 bg-white" />

                    {slides.map((slide, index) => (
                        <ScrollSlide
                            key={slide.text}
                            slide={slide}
                            index={index}
                            total={slides.length}
                            progress={smoothProgress}
                            reduceMotion={reduceMotion}
                        />
                    ))}
                </div>
            </section>

            <motion.section
                ref={buildSectionRef}
                className="build-domain-section"
                style={{
                    scale: buildScale,
                    y: buildY,
                    opacity: buildOpacity,
                    transformOrigin: "center bottom",
                }}
            >
                <div className="build-domain-shell">
                    <motion.div
                        className="build-domain-header"
                        initial={{ opacity: 0, y: 48 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{
                            duration: 0.75,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <h2 className="flex items-center justify-center text-[62px] text-black font-bold">
                            One platform. Every way to work.
                        </h2>
                    </motion.div>

                    <div className="build-domain-stack">
                        {buildAroundDomainRows.map((row, rowIndex) => (
                            <div
                                key={`row-${rowIndex}`}
                                className={`build-domain-row build-domain-row-${row.length}`}
                            >
                                {row.map((card, cardIndex) => {
                                    const animationIndex =
                                        rowIndex === 0
                                            ? 0
                                            : rowIndex === 1
                                              ? cardIndex + 1
                                              : 3;

                                    return (
                                        <motion.article
                                            key={card.title}
                                            className={`build-domain-card ${
                                                row.length === 1
                                                    ? "is-featured"
                                                    : ""
                                            }`}
                                            initial={{
                                                opacity: 0,
                                                scaleY: 0.78,
                                                y: 48,
                                            }}
                                            whileInView={{
                                                opacity: 1,
                                                scaleY: 1,
                                                y: 0,
                                            }}
                                            viewport={{
                                                once: false,
                                                amount: 0.2,
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                delay: animationIndex * 0.1,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            style={{
                                                transformOrigin:
                                                    "center bottom",
                                            }}
                                        >
                                            <div
                                                className={`build-domain-visual build-domain-visual-${card.visualTheme} ${
                                                    card.image
                                                        ? "has-custom-image"
                                                        : ""
                                                }`}
                                            >
                                                {card.image ? (
                                                    <>
                                                        <img
                                                            src={card.image}
                                                            alt={card.title}
                                                            className="build-domain-image"
                                                        />
                                                        <div className="build-domain-image-overlay" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="build-domain-orb build-domain-orb-one" />
                                                        <div className="build-domain-orb build-domain-orb-two" />
                                                        <div className="build-domain-block build-domain-block-top" />
                                                        <div className="build-domain-block build-domain-block-bottom" />
                                                    </>
                                                )}
                                            </div>

                                            <div className="build-domain-copy">
                                                <span className="build-domain-eyebrow">
                                                    {card.eyebrow}
                                                </span>
                                                <h3 className="build-domain-card-title">
                                                    {card.title}
                                                </h3>
                                                <p className="build-domain-card-description">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="bring-together-section"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                    duration: 1.6,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                }}
            >
                <div className="bring-together-shell">
                    {bringTogetherPanels.map((panel) => (
                        <article
                            key={panel.eyebrow}
                            className={`bring-together-panel bring-together-panel-${panel.tone}`}
                        >
                            <span className="bring-together-eyebrow">
                                {panel.eyebrow}
                            </span>

                            <h2 className="clash bring-together-title">
                                {panel.title}
                            </h2>

                            <p className="bring-together-description">
                                {panel.description}
                            </p>

                            <ul className="bring-together-list">
                                {panel.bullets.map((item) => (
                                    <li
                                        key={item}
                                        className="bring-together-list-item"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="bring-together-cta"
                            >
                                <span>{panel.cta}</span>
                                <span aria-hidden="true">→</span>
                            </button>
                        </article>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="tagline-section"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                    duration: 1.6,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                }}
            >

                <div className="tagline-shell">
                    <h2 className="clash tagline-headline tracking-[-0.07em] font-extrabold">
                        Great work <br /> happens when <br /> great talent <br />meets great <br />clients.
                    </h2>
                    <p className="tagline-sub">
                        Ultra Hustle is the place where both sides of that equation finally get what they came for — in one marketplace built for both.
                    </p>
                </div>
            </motion.section>

            <HowItWorksSection />

            <TrustSection />
        </div>
    );
}
