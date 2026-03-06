"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, type ReactNode } from "react";

/* ───────────────────────── Animation helpers ───────────────────────── */

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  from = "left",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  from?: "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const x = from === "left" ? -60 : 60;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────────── Phone mockup components ───────────────────────── */

export function PhoneMockup({
  src,
  alt,
  glow = "",
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  glow?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[2.5rem] border-2 border-edge bg-bg-card overflow-hidden ${glow} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={300}
        height={650}
        className="w-full h-full object-cover object-top"
        priority={priority}
      />
    </div>
  );
}

export function ScrollingPhoneMockup({
  src,
  alt,
  glow = "",
  className = "",
  scrollDuration = 10,
}: {
  src: string;
  alt: string;
  glow?: string;
  className?: string;
  scrollDuration?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scrollEnd, setScrollEnd] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;
    const handleLoad = () => {
      const diff = img.offsetHeight - container.offsetHeight;
      if (diff > 0) setScrollEnd(-diff);
    };
    img.addEventListener("load", handleLoad);
    if (img.complete) handleLoad();
    return () => img.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-[2.5rem] border-2 border-edge bg-bg-card overflow-hidden ${glow} ${className}`}
      style={{ aspectRatio: "9/19.5" }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute top-0 left-0 w-full"
        style={{
          animation: `scrollPhone ${scrollDuration}s ease-in-out infinite alternate`,
          animationPlayState: visible ? "running" : "paused",
          ["--scroll-end" as string]: `${scrollEnd}px`,
        }}
      />
    </div>
  );
}

/* ───────────────────────── Section label ───────────────────────── */

export function SectionLabel({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      className="text-[11px] font-bold tracking-[3px] uppercase"
      style={{ color }}
    >
      {children}
    </span>
  );
}

/* ───────────────────────── Header ───────────────────────── */

export function SiteHeader({ variant = "landing" }: { variant?: "landing" | "article" }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const featuresHref = variant === "landing" ? "#features" : "/#features";
  const howItWorksHref = "/how-it-works";
  const ctaHref = variant === "landing" ? "#download" : "/#download";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-page/80 backdrop-blur-xl border-b border-edge"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-sora)] text-xl font-bold tracking-tight"
        >
          NutriKit
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={featuresHref}
            className="text-sm text-fg-secondary hover:text-fg transition-colors"
          >
            Features
          </Link>
          <Link
            href={howItWorksHref}
            className={`text-sm transition-colors ${
              variant === "article"
                ? "text-purple font-semibold"
                : "text-fg-secondary hover:text-fg"
            }`}
          >
            How It Works
          </Link>
          <Link
            href={ctaHref}
            className="text-sm font-semibold bg-purple text-white px-5 py-2 rounded-lg hover:bg-purple/90 transition-colors"
          >
            Get the Beta
          </Link>
        </nav>
        <Link
          href={ctaHref}
          className="md:hidden text-sm font-semibold bg-purple text-white px-4 py-2 rounded-lg"
        >
          Get Beta
        </Link>
      </div>
    </header>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

export function SiteFooter() {
  return (
    <footer className="border-t border-edge py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-sora)] text-sm font-bold text-fg-muted"
        >
          NutriKit
        </Link>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Contact
          </a>
        </div>
        <span className="text-xs text-fg-faint">
          &copy; 2026 pxlshpr. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
