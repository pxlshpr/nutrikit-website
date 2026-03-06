"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState, type ReactNode } from "react";

/* ───────────────────────── Animation helpers ───────────────────────── */

function FadeUp({
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

function FadeIn({
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

function ScaleIn({
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

function SlideIn({
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

/* ─────────────────── Phone mockup components ─────────────────── */

function PhoneMockup({
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
      className={`relative rounded-[2.5rem] border-2 border-border-dark bg-bg-card overflow-hidden ${glow} ${className}`}
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

/** For tall stitched screenshots — auto-scrolls inside the phone frame */
function ScrollingPhoneMockup({
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
      className={`relative rounded-[2.5rem] border-2 border-border-dark bg-bg-card overflow-hidden ${glow} ${className}`}
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

function SectionLabel({
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

/* ═══════════════════════════════════════════════════════════════════ */
/*                           PAGE                                     */
/* ═══════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <SmartTargets />
      <DynamicTargets />
      <CalorieIntelligence />
      <FoodLogging />
      <AtAGlance />
      <ShareMeals />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ───────────────────────── Header ───────────────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-dark/80 backdrop-blur-xl border-b border-border-dark"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <span className="font-[family-name:var(--font-sora)] text-xl font-bold tracking-tight">
          NutriKit
        </span>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#logging"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#download"
            className="text-sm font-semibold bg-purple text-white px-5 py-2 rounded-lg hover:bg-purple/90 transition-colors"
          >
            Get the Beta
          </a>
        </nav>
        <a
          href="#download"
          className="md:hidden text-sm font-semibold bg-purple text-white px-4 py-2 rounded-lg"
        >
          Get Beta
        </a>
      </div>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-8">
        <FadeUp>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-soft border border-purple/20 text-green text-[13px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-green" />
            Beta Now Available on TestFlight
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="font-[family-name:var(--font-sora)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
            Not another
            <br />
            calorie counter.
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
            A nutrition system that adapts to your body, your goals, and your
            life.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#download"
              className="bg-purple hover:bg-purple/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Download the Beta
            </a>
            <a
              href="#features"
              className="border border-border-dark text-gray-400 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors hover:border-gray-600"
            >
              See Features
            </a>
          </div>
        </FadeUp>

        <ScaleIn delay={0.5} className="mt-4">
          <PhoneMockup
            src="/screenshots/calorie-reco.png"
            alt="NutriKit calorie recommendation"
            glow="glow-purple"
            className="w-64 md:w-72"
            priority
          />
        </ScaleIn>
      </div>
    </section>
  );
}

/* ───────────────────────── Smart Targets ───────────────────────── */

function SmartTargets() {
  return (
    <section
      id="features"
      className="relative py-24 md:py-32 bg-bg-dark-alt"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel color="#7C3AED">Smart Targets</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight mt-4">
              Targets built for YOUR body
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Every nutrient gets a recommended range &mdash; calculated from
              your age, sex, weight, body composition, and pregnancy status. Not
              generic RDAs. Real targets from 14+ scientific sources,
              personalized for you.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          <ScaleIn delay={0.1}>
            <ScrollingPhoneMockup
              src="/screenshots/reco-picker.jpg"
              alt="14+ scientific recommendation sources"
              glow="glow-purple"
              className="w-56 md:w-64"
              scrollDuration={12}
            />
          </ScaleIn>
          <ScaleIn delay={0.25} className="md:-mt-8">
            <PhoneMockup
              src="/screenshots/calorie-reco.png"
              alt="Personalized calorie recommendation"
              glow="glow-purple"
              className="w-60 md:w-72"
            />
          </ScaleIn>
          <ScaleIn delay={0.4}>
            <PhoneMockup
              src="/screenshots/protein-reco.png"
              alt="Protein recommendation"
              glow="glow-purple"
              className="w-56 md:w-64"
            />
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Dynamic Targets ───────────────────────── */

function DynamicTargets() {
  return (
    <section className="py-24 md:py-32 bg-bg-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel color="#D4A853">Dynamic Targets</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight mt-4">
              Targets that move with you
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Tapering down carbs over 6 weeks? Your targets adjust daily
              &mdash; linear, stepped, or curved. Workout day? Protein and carb
              targets scale up automatically based on calories burned.
            </p>
          </FadeUp>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Taper card */}
          <SlideIn from="left">
            <div className="bg-bg-card rounded-2xl border border-gold/15 p-6 md:p-8 flex flex-col gap-6">
              <div>
                <span className="text-3xl">&#9992;&#65039;</span>
                <h3 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-gold mt-3">
                  Tapered Targets
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Set a start and end target, pick a duration and curve shape
                  &mdash; linear, stepped, ease-in, or ease-out. Your daily
                  target interpolates smoothly. Pause, adjust, or override any
                  day.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <ScrollingPhoneMockup
                  src="/screenshots/taper-setup.jpg"
                  alt="Taper setup with curve preview"
                  glow="glow-gold"
                  className="w-44 md:w-48"
                  scrollDuration={14}
                />
                <PhoneMockup
                  src="/screenshots/protein-status.png"
                  alt="Active taper tracking"
                  glow="glow-gold"
                  className="w-44 md:w-48"
                />
              </div>
            </div>
          </SlideIn>

          {/* Workout bonus card */}
          <SlideIn from="right" delay={0.15}>
            <div className="bg-bg-card rounded-2xl border border-green/15 p-6 md:p-8 flex flex-col gap-6">
              <div>
                <span className="text-3xl">&#127947;&#65039;</span>
                <h3 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-green mt-3">
                  Workout Bonuses
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Burned 400 kcal? Your protein and carb targets scale up
                  automatically. Choose adaptive (per 100 kcal burned) or fixed
                  bonuses, with optional eating windows around your workout.
                </p>
              </div>
              <div className="flex justify-center">
                <PhoneMockup
                  src="/screenshots/protein-status.png"
                  alt="Workout bonus in action"
                  glow="glow-green"
                  className="w-52 md:w-56"
                />
              </div>
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Calorie Intelligence ───────────────────────── */

function CalorieIntelligence() {
  return (
    <section className="py-24 md:py-32 bg-bg-dark-alt">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel color="#D946EF">Calorie Intelligence</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight mt-4">
              Your perfect calorie target, automatically
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              NutriKit picks the smartest method available: energy balance from
              your weight and intake data, Apple Health active and resting
              energy, or the best BMR formula for your profile. Lose, maintain,
              or gain &mdash; with a slider from mild to aggressive.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          <ScaleIn delay={0.1}>
            <ScrollingPhoneMockup
              src="/screenshots/maintenance-calc.jpg"
              alt="Maintenance calorie calculation"
              glow="glow-pink"
              className="w-56 md:w-64"
              scrollDuration={10}
            />
          </ScaleIn>
          <ScaleIn delay={0.25} className="md:-mt-8">
            <PhoneMockup
              src="/screenshots/energy-balance-config.png"
              alt="Energy balance configuration"
              glow="glow-pink"
              className="w-60 md:w-72"
            />
          </ScaleIn>
          <ScaleIn delay={0.4}>
            <ScrollingPhoneMockup
              src="/screenshots/maintenance-health.jpg"
              alt="Apple Health integration"
              glow="glow-pink"
              className="w-56 md:w-64"
              scrollDuration={11}
            />
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Food Logging ───────────────────────── */

function FoodLogging() {
  return (
    <section id="logging" className="py-24 md:py-32 bg-bg-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel color="#60A5FA">Food Logging</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight mt-4">
              Precision when it matters.
              <br />
              Speed when you need it.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              NutriKit prioritizes accuracy &mdash; with USDA-verified foods and
              a state-of-the-art nutrition label scanner that lets you review
              every value before adding. When you need to log fast, AI does the
              heavy lifting.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Feature list */}
          <SlideIn from="left" className="flex-1">
            <div className="space-y-8">
              {[
                {
                  icon: "🔬",
                  title: "Nutrition Label Scanner",
                  desc: "Point at any label and instantly extract every nutrient. Review values before adding. Scan front labels too for typing-less food creation.",
                },
                {
                  icon: "🏛️",
                  title: "USDA Verified Foods",
                  desc: "Search thousands of verified foods with precise, lab-tested nutritional data you can trust.",
                },
                {
                  icon: "⚡",
                  title: "AI Quick Log",
                  desc: "Snap a photo, speak, or type what you ate. AI detects every item with macros. Edit, replace, or re-match anything before logging.",
                },
              ].map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.1}>
                  <div className="flex gap-4">
                    <span className="text-3xl shrink-0">{f.icon}</span>
                    <div>
                      <h3 className="font-[family-name:var(--font-sora)] text-lg font-bold">
                        {f.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </SlideIn>

          {/* Screenshots */}
          <SlideIn from="right" delay={0.2} className="flex gap-5">
            <PhoneMockup
              src="/screenshots/label-scanner.png"
              alt="Nutrition label scanner"
              glow="glow-blue"
              className="w-48 md:w-56"
            />
          </SlideIn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── At a Glance ───────────────────────── */

function AtAGlance() {
  return (
    <section className="py-24 md:py-32 bg-bg-dark-alt">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel color="#4ADE80">At a Glance</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight mt-4">
              See everything. Miss nothing.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              A clean dashboard that shows exactly where you stand on every
              nutrient &mdash; no clutter. See your progress, which meals
              contributed most, and which foods drove your numbers.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          <ScaleIn delay={0.1}>
            <PhoneMockup
              src="/screenshots/protein-status.png"
              alt="Protein status with active taper"
              glow="glow-green"
              className="w-56 md:w-64"
            />
          </ScaleIn>
          <ScaleIn delay={0.3}>
            <PhoneMockup
              src="/screenshots/protein-breakdown.png"
              alt="Meal and food breakdown"
              glow="glow-green"
              className="w-56 md:w-64"
            />
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Share Meals ───────────────────────── */

function ShareMeals() {
  return (
    <section className="py-24 md:py-32 bg-bg-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel color="#D946EF">Share Your Meals</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight mt-4">
              Beautiful meal stickers for your socials
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Generate stunning liquid glass stickers showing your meal or daily
              breakdown &mdash; calories, macros, and foods with emoji. Place
              them on photos or videos and share to Instagram, stories, or
              anywhere.
            </p>
          </FadeUp>
        </div>

        <ScaleIn className="flex justify-center">
          <PhoneMockup
            src="/screenshots/meal-sticker.png"
            alt="Meal sticker with liquid glass effect"
            glow="glow-pink"
            className="w-64 md:w-80"
          />
        </ScaleIn>
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */

function FinalCTA() {
  return (
    <section
      id="download"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(124,58,237,0.1),_transparent_60%)]" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <FadeUp>
          <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight">
            Ready to take control?
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-gray-400 text-lg mt-6 leading-relaxed">
            Join the beta and help shape the future of nutrition tracking.
          </p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <a
            href="https://testflight.apple.com/join/placeholder"
            className="inline-block mt-8 bg-purple hover:bg-purple/90 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get the Beta on TestFlight
          </a>
        </FadeUp>
        <FadeUp delay={0.3}>
          <p className="text-gray-500 text-sm mt-4">
            Free &middot; iOS 17+ &middot; No account required
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border-dark py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-[family-name:var(--font-sora)] text-sm font-bold text-gray-500">
          NutriKit
        </span>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Contact
          </a>
        </div>
        <span className="text-xs text-gray-600">
          &copy; 2026 pxlshpr. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
