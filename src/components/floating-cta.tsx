"use client";

import { useState, useEffect } from "react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

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

  return (
    <div
      className={`fixed bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ willChange: "transform", filter: "drop-shadow(0 0 16px rgba(124,58,237,0.5))" }}
    >
      <a
        href="#download"
        className="relative flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.8), rgba(217,70,239,0.6))",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1)",
        }}
      >
        <span className="text-sm tracking-wide">Download the Beta</span>
        <span className="text-xs opacity-60">&rarr;</span>
      </a>
    </div>
  );
}
