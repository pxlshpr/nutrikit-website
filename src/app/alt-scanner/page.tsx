"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FadeUp,
  ScaleIn,
  PhoneMockup,
  SiteHeader,
  SiteFooter,
} from "@/components/shared";
import { Sections } from "@/components/sections";

/* ───────────────────────── Underline Scanner Hero ───────────────────────── */

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
  const [scanProgress, setScanProgress] = useState(100); // 0-100, percentage of text revealed
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % MARQUEE_ITEMS.length;
      setNextIndex(next);
      setScanning(true);
      setScanProgress(0);

      // Animate scan from 0 to 100
      const startTime = Date.now();
      const duration = 1500;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
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
        <>
          {/* Next text revealed by clip */}
          <span
            className="relative inline-block"
            style={{ color: nextItem.color }}
          >
            <span
              style={{
                clipPath: `inset(0 ${100 - scanProgress}% 0 0)`,
              }}
            >
              {nextItem.text}
            </span>
            {/* Old text fading behind */}
            <span
              className="absolute inset-0"
              style={{
                color: currentItem.color,
                clipPath: `inset(0 0 0 ${scanProgress}%)`,
                opacity: 0.4,
              }}
            >
              {currentItem.text}
            </span>
            {/* Scanner line */}
            <span
              className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
              style={{
                left: `${scanProgress}%`,
                background: `linear-gradient(to bottom, transparent, ${nextItem.color}, transparent)`,
                boxShadow: `0 0 12px ${nextItem.color}, 0 0 24px ${nextItem.color}40`,
                opacity: scanProgress > 0 && scanProgress < 100 ? 1 : 0,
              }}
            />
          </span>
        </>
      ) : (
        <span style={{ color: currentItem.color }}>
          {currentItem.text}
        </span>
      )}
    </span>
  );
}

export default function ScannerPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)]" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-8">
          <FadeUp>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-soft border border-purple/20 text-green text-[13px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-green" />
              Beta Now Available on TestFlight
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-[family-name:var(--font-sora)] text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
              Your kit for
              <ScannerText />
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-xl md:text-2xl text-fg-secondary max-w-xl leading-relaxed italic tracking-wide">
              You can&apos;t control what you don&apos;t measure.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#download" className="bg-purple hover:bg-purple/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                Download the Beta
              </a>
              <a href="#features" className="border border-edge text-fg-secondary hover:text-fg font-medium px-8 py-3.5 rounded-xl transition-colors hover:border-fg-muted">
                See Features
              </a>
            </div>
          </FadeUp>
          <ScaleIn delay={0.5} className="mt-4">
            <PhoneMockup src="/screenshots/home-screen.png" alt="NutriKit home screen" glow="glow-purple" className="w-64 md:w-72" priority />
          </ScaleIn>
        </div>
      </section>
      <Sections />
      <SiteFooter />
    </main>
  );
}
