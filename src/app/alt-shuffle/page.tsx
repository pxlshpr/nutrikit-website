"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FadeUp,
  ScaleIn,
  PhoneMockup,
  SiteHeader,
  SiteFooter,
} from "@/components/shared";
import { Sections } from "@/components/sections";

/* ───────────────────────── Shuffle Decode Hero ───────────────────────── */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

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

function ShuffleText() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState(MARQUEE_ITEMS[0].text);
  const [resolvedCount, setResolvedCount] = useState(MARQUEE_ITEMS[0].text.length);

  const scramble = useCallback((target: string, resolved: number) => {
    return target
      .split("")
      .map((ch, i) => {
        if (i < resolved) return ch;
        if (ch === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
  }, []);

  useEffect(() => {
    const holdTimer = setInterval(() => {
      const nextIndex = (index + 1) % MARQUEE_ITEMS.length;
      const target = MARQUEE_ITEMS[nextIndex].text;
      let resolved = 0;

      // Scramble phase: resolve one character at a time
      const resolveTimer = setInterval(() => {
        resolved++;
        setResolvedCount(resolved);
        setDisplayed(scramble(target, resolved));
        if (resolved >= target.length) {
          clearInterval(resolveTimer);
          setIndex(nextIndex);
        }
      }, 35);

      // Rapid scramble while resolving
      const flickerTimer = setInterval(() => {
        setDisplayed((prev) => {
          const target = MARQUEE_ITEMS[nextIndex].text;
          return scramble(target, resolved);
        });
      }, 50);

      // Clean up flicker when resolve is done
      setTimeout(() => {
        clearInterval(flickerTimer);
        setDisplayed(target);
      }, 35 * target.length + 100);

      return () => {
        clearInterval(resolveTimer);
        clearInterval(flickerTimer);
      };
    }, 2500);

    return () => clearInterval(holdTimer);
  }, [index, scramble]);

  const item = MARQUEE_ITEMS[index];
  return (
    <span
      className="block whitespace-nowrap my-2 md:my-3 font-mono"
      style={{ color: item.color }}
    >
      {displayed}
    </span>
  );
}

export default function ShufflePage() {
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
              <ShuffleText />
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg md:text-xl text-fg-secondary max-w-xl leading-relaxed">
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
