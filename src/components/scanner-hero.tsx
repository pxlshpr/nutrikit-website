"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import {
  FadeUp,
  ScaleIn,
  PhoneMockup,
} from "@/components/shared";

const MARQUEE_ITEMS: { text: string; color: string }[] = [
  { text: "Nutrient Tracking", color: "#7C3AED" },
  { text: "Calorie Counting", color: "#4ADE80" },
  { text: "Protein Tracking", color: "#D4A853" },
  { text: "Label Scanning", color: "#D946EF" },
  { text: "Body Recomp", color: "#60A5FA" },
  { text: "Fat Loss", color: "#4ADE80" },
  { text: "Macro Hitting", color: "#D4A853" },
  { text: "Micro Tracking", color: "#D946EF" },
  { text: "Carb Tapering", color: "#60A5FA" },
  { text: "Muscle Building", color: "#4ADE80" },
];

function ScannerText() {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(100);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % MARQUEE_ITEMS.length;
      setNextIndex(next);
      setScanning(true);
      setScanProgress(0);
      const startTime = Date.now();
      const duration = 1500;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setScanProgress(eased * 100);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIndex(next);
          setScanning(false);
          setScanProgress(100);
        }
      };
      requestAnimationFrame(animate);
    }, 2500);
    return () => clearInterval(interval);
  }, [index]);

  const currentItem = MARQUEE_ITEMS[index];
  const nextItem = MARQUEE_ITEMS[nextIndex];

  return (
    <span className="block whitespace-nowrap my-2 md:my-3 relative">
      {scanning ? (
        <span className="relative inline-block" style={{ color: nextItem.color }}>
          <span style={{ clipPath: `inset(0 ${100 - scanProgress}% 0 0)` }}>{nextItem.text}</span>
          <span className="absolute inset-0" style={{ color: currentItem.color, clipPath: `inset(0 0 0 ${scanProgress}%)`, opacity: 0.4 }}>{currentItem.text}</span>
          <span className="absolute top-0 bottom-0 w-[2px] pointer-events-none" style={{ left: `${scanProgress}%`, background: `linear-gradient(to bottom, transparent, ${nextItem.color}, transparent)`, boxShadow: `0 0 12px ${nextItem.color}, 0 0 24px ${nextItem.color}40`, opacity: scanProgress > 0 && scanProgress < 100 ? 1 : 0 }} />
        </span>
      ) : (
        <span style={{ color: currentItem.color }}>{currentItem.text}</span>
      )}
    </span>
  );
}

function getVideoSrcs(isDark: boolean) {
  const theme = isDark ? "dark" : "light";
  const w = typeof window !== "undefined" ? window.innerWidth : 1024;
  const size = w >= 1024 ? "desktop" : "tablet";
  return {
    mov: `/videos/hero-${theme}-${size}.mov`,
    webm: `/videos/hero-${theme}-${size}.webm`,
  };
}

function HeroVideo() {
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [videoSrcs, setVideoSrcs] = useState<{ mov: string; webm: string }>({ mov: "", webm: "" });
  const [scale, setScale] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect and react to color scheme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const dark = mq.matches;
      setIsDark(dark);
      setLoaded(false);
      setVideoSrcs(getVideoSrcs(dark));
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrcs.mov) return;
    const onPlaying = () => setLoaded(true);
    video.addEventListener("playing", onPlaying);
    if (!video.paused) setLoaded(true);
    return () => video.removeEventListener("playing", onPlaying);
  }, [videoSrcs]);

  // Scale video based on scroll — only on mobile portrait
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const viewW = window.innerWidth;
      const viewH = window.innerHeight;

      // Only scale on mobile portrait (narrow + taller than wide)
      if (viewW >= 768 || viewW > viewH) {
        setScale(1);
        return;
      }

      const rect = container.getBoundingClientRect();
      const containerW = container.offsetWidth;

      const startY = viewH * 0.6;
      const endY = viewH * 0.1;
      const progress = Math.max(0, Math.min(1, (startY - rect.top) / (startY - endY)));

      const maxScale = viewW / containerW;
      const targetScale = 1 + progress * (maxScale - 1);
      setScale(targetScale);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-64 md:w-80 lg:w-[28rem] xl:w-[32rem]"
      style={{ aspectRatio: `1080/${1920 * scale}` }}
    >
      <div
        className="origin-top absolute top-0 left-0 w-full"
        style={{
          transform: `scale(${scale})`,
          aspectRatio: "1080/1920",
        }}
      >
        {/* Shimmer placeholder — inset to match phone position in video */}
        <div
          className={`absolute rounded-[2.5rem] overflow-hidden transition-opacity duration-700 ${
            loaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ top: "3%", bottom: "3%", left: "12%", right: "12%" }}
        >
          <div className="absolute inset-0 bg-bg-card/60" />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(124,58,237,0.08) 45%, rgba(124,58,237,0.15) 50%, rgba(124,58,237,0.08) 55%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "heroShimmer 2s ease-in-out infinite",
            }}
          />
        </div>
        {/* Video — responsive source */}
        <video
          ref={videoRef}
          key={videoSrcs.mov}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          <source src={videoSrcs.mov} type="video/quicktime" />
          <source src={videoSrcs.webm} type="video/webm" />
        </video>
      </div>
    </div>
  );
}

export function ScannerHero({ tagline }: { tagline: ReactNode }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-4 sm:pt-24 sm:pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)]" />
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-5 sm:gap-8">
        <FadeUp delay={0.1}>
          <h1 className="font-[family-name:var(--font-sora)] text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
            Your kit for
            <ScannerText />
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          {tagline}
        </FadeUp>
        <ScaleIn delay={0.4} className="mt-4">
          <HeroVideo />
        </ScaleIn>
        <FadeUp delay={0.5}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#download" className="text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #7C3AED, #D946EF)" }}>Download the Beta</a>
            <a href="#features" className="border border-edge text-fg-secondary hover:text-fg font-medium px-8 py-3.5 rounded-xl transition-colors hover:border-fg-muted">See Features</a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
