"use client";

import { useState, useEffect, useRef } from "react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(8);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const bottomThreshold = docHeight - viewHeight - 400;

      setVisible(scrollY > viewHeight * 0.8 && scrollY < bottomThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use visualViewport to position at the true visible bottom
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // visualViewport gives the actual visible area
      // The gap between layoutViewport bottom and visualViewport bottom
      // is the browser chrome (toolbar, address bar)
      const layoutH = window.innerHeight;
      const visualH = vv.height;
      const visualTop = vv.offsetTop;
      // Position from CSS bottom: how far up from layout viewport bottom
      // we need to go to reach the visual viewport bottom
      const gap = layoutH - (visualTop + visualH);
      setBottomOffset(Math.max(gap + 8, 8));
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 pb-4 transition-opacity duration-500 ${
        visible
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ willChange: "transform", bottom: `${bottomOffset}px` }}
    >
      <a
        href="#download"
        className="relative flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.8), rgba(217,70,239,0.6))",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1), 0 0 16px rgba(124,58,237,0.5)",
        }}
      >
        <span className="text-sm tracking-wide">Download the Beta</span>
        <span className="text-xs opacity-60">&rarr;</span>
      </a>
    </div>
  );
}
