import { useEffect, useRef, useState } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import { Search } from "lucide-react";
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
        eyebrow: "Web Hosting",
        title: "Powerfully simple",
        description:
            "Get everything for launching a successful creator website, from performance-ready hosting to easier client-ready management.",
    },
    {
        eyebrow: "Portfolio System",
        title: "Show your work beautifully",
        description:
            "Create a polished home for your services, proof, and offers so the right clients know exactly why to hire you.",
    },
    {
        eyebrow: "Business Email",
        title: "Look credible everywhere",
        description:
            "Send proposals, updates, and replies from a branded identity that feels trustworthy from the first message.",
    },
    {
        eyebrow: "Bookings",
        title: "Connect discovery to delivery",
        description:
            "Let clients move from interest to call, brief, payment, and project kickoff without broken handoffs.",
    },
];

const buildAroundDomainRows = [
    [buildAroundDomainCards[0]],
    [buildAroundDomainCards[1], buildAroundDomainCards[2]],
    [buildAroundDomainCards[3]],
];

const SCROLL_HEIGHT = `${slides.length * 120}vh`;

function ScrollSlide({ slide, index, total, progress, reduceMotion }) {
    const segment = 1 / total;
    const start = index * segment;
    const end = start + segment;
    const fadeStart = Math.max(0, start - segment * 0.32);
    const fadeInEnd = start + segment * 0.24;
    const fadeOutStart = end - segment * 0.24;
    const fadeEnd = Math.min(1, end + segment * 0.18);

    const layerOpacity = useTransform(
        progress,
        [fadeStart, fadeInEnd, fadeOutStart, fadeEnd],
        [0, 1, 1, 0],
    );
    const imageScale = useTransform(progress, [start, end], [1.14, 1]);
    const imageY = useTransform(progress, [start, end], [64, -48]);
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
                    <h2 className="clash scroll-story-title text-[#CEFF1B]">
                        {slide.text}
                    </h2>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function HomePage() {
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
                className="relative flex min-h-screen items-start justify-start overflow-hidden px-20 pt-20"
                style={{
                    backgroundImage: "url('/homepage-hero2.png')",
                    backgroundSize: "130%",
                    backgroundPosition: "100% center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute left-0 top-0 h-full w-[40%] pointer-events-none">
                    <div className="h-full w-full bg-gradient-to-r from-white/30 to-transparent backdrop-blur-md" />
                </div>

                <div className="relative z-10 max-w-[500px]">
                    <h1 className="clash text-[36px] font-black leading-[1.5] tracking-[-0.02em] text-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)] sm:text-[72px] md:text-[68px] lg:text-[40px]">
                        Where world class <br />
                        talent meets
                        <br />
                        <span className="inline-block bg-[#C6FF00] px-1 py-1">
                            clients who value it.
                        </span>
                    </h1>

                    <p className="mt-4 text-[14px] leading-relaxed text-gray-600 sm:text-[16px] md:text-[14px]">
                        Ultra Hustle is the marketplace where top creators sell
                        their skills and smart clients find exactly who they
                        need, protected, fast, and fair.
                    </p>

                    <div className="mt-4 w-full w-[580px]">
                        <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/70 px-6 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-md focus-within:border-[#C6FF00]">
                            <input
                                type="text"
                                placeholder="Search here"
                                className="w-full border-none bg-transparent text-black outline-none placeholder-gray-400 focus:outline-none focus:ring-0"
                            />
                            <Search className="ml-3 h-5 w-5 text-gray-500" />
                        </div>
                    </div>

                    <div className="mt-4 flex w-[650px] flex-wrap gap-2">
                        {[
                            "Service",
                            "Digital Products",
                            "Teams",
                            "Courses",
                            "Webinars",
                        ].map((item) => (
                            <button
                                key={item}
                                className="rounded-full border border-white/50 bg-white/40 px-3 py-2 text-sm text-gray-700 backdrop-blur-md transition-all duration-200 hover:bg-[#C6FF00]/80 hover:text-black"
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

            {/* <section className="build-domain-section">
                <div className="build-domain-shell">
                    <motion.div
                        className="build-domain-header"
                        initial={{ opacity: 0, y: 48 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.75,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <h2 className="clash build-domain-title">
                            Build around
                            <br />
                            your domain
                        </h2>
                        <p className="build-domain-intro">
                            Choose and connect exactly what you need to take
                            your brand, portfolio, and client experience to the
                            world.
                        </p>
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
                                                once: true,
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
                                            <div className="build-domain-visual">
                                                <div className="build-domain-orb build-domain-orb-one" />
                                                <div className="build-domain-orb build-domain-orb-two" />
                                                <div className="build-domain-block build-domain-block-top" />
                                                <div className="build-domain-block build-domain-block-bottom" />
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
            </section> */}
        </div>
    );
}
