"use client";

import { useState, useEffect } from "react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [bottomClass, setBottomClass] = useState("bottom-2");

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS && /OPiOS/.test(ua)) {
      setBottomClass("bottom-1");
    } else if (isIOS && /CriOS|Instagram|FBAN/.test(ua)) {
      setBottomClass("bottom-4");
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const bottomThreshold = docHeight - viewHeight - 400;

      setVisible(scrollY > viewHeight * 0.8 && scrollY < bottomThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="#download"
      className={`fixed ${bottomClass} left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-white transition-all duration-500 whitespace-nowrap ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.8), rgba(217,70,239,0.6))",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1), 0 2px 6px rgba(124,58,237,0.25)",
      }}
    >
      <span className="text-sm tracking-wide">Download the Beta</span>
      <span className="text-xs opacity-60">&rarr;</span>
    </a>
  );
}
