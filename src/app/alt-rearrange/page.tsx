"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FadeUp,
  ScaleIn,
  PhoneMockup,
  SiteHeader,
  SiteFooter,
} from "@/components/shared";
import { Sections } from "@/components/sections";

/* ───────────────────────── Letter Rearrange Hero ───────────────────────── */

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

interface LetterState {
  char: string;
  key: string;
  opacity: number;
  y: number;
}

function RearrangeText() {
  const [index, setIndex] = useState(0);
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [color, setColor] = useState(MARQUEE_ITEMS[0].color);
  const [transitioning, setTransitioning] = useState(false);

  // Initialize
  useEffect(() => {
    const text = MARQUEE_ITEMS[0].text;
    setLetters(
      text.split("").map((ch, i) => ({
        char: ch,
        key: `${ch}-${i}-0`,
        opacity: 1,
        y: 0,
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      const nextIndex = (index + 1) % MARQUEE_ITEMS.length;
      const nextItem = MARQUEE_ITEMS[nextIndex];
      const nextText = nextItem.text;

      // Phase 1: fade out old letters
      setLetters((prev) =>
        prev.map((l) => ({ ...l, opacity: 0, y: -20 }))
      );

      // Phase 2: after fade out, set new letters (faded in)
      setTimeout(() => {
        setColor(nextItem.color);
        setLetters(
          nextText.split("").map((ch, i) => ({
            char: ch,
            key: `${ch}-${i}-${nextIndex}`,
            opacity: 0,
            y: 20,
          }))
        );

        // Phase 3: stagger fade in each letter
        nextText.split("").forEach((_, i) => {
          setTimeout(() => {
            setLetters((prev) =>
              prev.map((l, j) =>
                j === i ? { ...l, opacity: 1, y: 0 } : l
              )
            );
          }, i * 30);
        });

        setTimeout(() => {
          setIndex(nextIndex);
          setTransitioning(false);
        }, nextText.length * 30 + 200);
      }, 350);
    }, 3500);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <span
      className="block whitespace-nowrap my-2 md:my-3"
      style={{ color }}
      aria-label={MARQUEE_ITEMS[index].text}
    >
      {letters.map((l, i) => (
        <span
          key={l.key}
          className="inline-block transition-all duration-300"
          style={{
            opacity: l.opacity,
            transform: `translateY(${l.y}px)`,
            minWidth: l.char === " " ? "0.3em" : undefined,
          }}
        >
          {l.char === " " ? "\u00A0" : l.char}
        </span>
      ))}
    </span>
  );
}

export default function RearrangePage() {
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
              <RearrangeText />
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
