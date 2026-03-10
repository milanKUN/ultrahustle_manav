import React, { useEffect, useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import Hero from "../components/Hero";
import ProblemSolution from "../components/ProblemSolution";
import NewWayToWork from "../components/NewWayToWork";
import WhyStandsApart from "../components/WhyStandsApart";
import UltraHustleAdvantage from "../components/UltraHustleAdvantage";
import GlobalMovement from "../components/GlobalMovement";
import ResultsThatSpeak from "../components/ResultsThatSpeak";
import VisionMeetsAction from "../components/VisionMeetsAction";
import Footer from "../../../components/layout/Footer";

import MobileBottomNav from "../../../components/layout/MobileBottomNav"; // ✅ ADD

export default function Home({ theme = "light" }) {
  // ✅ mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState("Marketplace");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 950);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const styleId = "hide-navbar-egg-loops";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.textContent = `
        .navbar-top-egg-green-loop,
        .navbar-top-egg-green-visible,
        .navbar-top-egg-green { display: none !important; }
        .navbar-anim-text-loop { animation: none !important; color: inherit !important; }
      `;
      document.head.appendChild(s);
    }

    const containerId = "global-green-glow-root";
    let root = document.getElementById(containerId);
    if (!root) {
      root = document.createElement("div");
      root.id = containerId;
      root.style.position = "fixed";
      root.style.inset = "0";
      root.style.pointerEvents = "none";
      root.style.zIndex = "999";
      document.body.appendChild(root);
    }

    const existingA = root.querySelector(".green-blob");
    const existingB = root.querySelector(".green-blob-2");
    if (existingA) existingA.remove();
    if (existingB) existingB.remove();

    const blob = document.createElement("div");
    blob.className = "green-blob green-hidden";
    root.appendChild(blob);

    const blob2 = document.createElement("div");
    blob2.className = "green-blob-2 green-hidden";
    root.appendChild(blob2);

    const positions = [
      { x: "12vw", y: "12vh" },
      { x: "78vw", y: "12vh" },
      { x: "78vw", y: "78vh" },
      { x: "12vw", y: "78vh" },
      { x: "50vw", y: "15vh" },
      { x: "18vw", y: "50vh" },
      { x: "82vw", y: "50vh" },
      { x: "50vw", y: "72vh" },
      { x: "50vw", y: "50vh" },
    ];

    let idx = 0;
    const intervalMs = 5200;
    const visibleHold = 2600;

    const showAt = (el, pos, delay = 0) => {
      setTimeout(() => {
        el.style.left = pos.x;
        el.style.top = pos.y;
        el.classList.remove("green-hidden");
        el.classList.add("green-visible");
      }, delay);
    };

    const hideAt = (el, delay = 0) => {
      setTimeout(() => {
        el.classList.remove("green-visible");
        el.classList.add("green-hidden");
      }, delay);
    };

    showAt(blob, positions[0], 200);
    showAt(blob2, positions[2], 500);
    hideAt(blob, visibleHold);
    hideAt(blob2, visibleHold + 400);

    const loopId = setInterval(() => {
      idx = (idx + 1) % positions.length;

      showAt(blob, positions[idx], 0);
      hideAt(blob, visibleHold);

      const idx2 = (idx + 3) % positions.length;
      showAt(blob2, positions[idx2], 900);
      hideAt(blob2, visibleHold + 500);
    }, intervalMs);

    return () => {
      clearInterval(loopId);
      if (root && root.parentNode) {
        const a = root.querySelector(".green-blob");
        const b = root.querySelector(".green-blob-2");
        if (a) a.remove();
        if (b) b.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed bg-gradient-to-br from-[#cfd3d6] via-[#d9dcde] to-[#e6e8e9]">
      <div className="relative z-30">
        <Navbar />
        <div className="h-32 bg-gradient-to-r from-[#D5D5D6] via-[#BBBCBC] to-[#A4A5A4]" />
        <Hero />
        <ProblemSolution />
        <NewWayToWork />
        <WhyStandsApart />
        <UltraHustleAdvantage />
        <GlobalMovement />
        <ResultsThatSpeak />
        <VisionMeetsAction />
        <Footer />

        {/* ✅ Bottom nav should be OUTSIDE content flow, but still inside z-30 */}
        {isMobile && (
          <MobileBottomNav
            active={activeBottomTab}
            setActive={setActiveBottomTab}
            theme={theme}
          />
        )}
      </div>

      {/* ✅ extra bottom padding so footer content nav ke neeche hide na ho */}
      {isMobile && <div className="h-20" />}
    </div>
  );
}
