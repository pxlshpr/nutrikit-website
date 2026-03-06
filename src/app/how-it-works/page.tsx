"use client";

import Link from "next/link";
import { FadeUp, SectionLabel, SiteHeader, SiteFooter } from "@/components/shared";

const features = [
  {
    emoji: "🎯",
    title: "Smart Targets",
    color: "#7C3AED",
    borderColor: "#7C3AED20",
    desc: "Every nutrient gets a recommended range — calculated from your age, sex, weight, body composition, and pregnancy status. Built from peer-reviewed papers, institutional guidelines, and verified sources — all cited so you can check them yourself.",
    href: "/how-it-works/smart-targets",
  },
  {
    emoji: "📈",
    title: "Dynamic Targets",
    color: "#D4A853",
    borderColor: "#D4A85320",
    desc: "Tapered targets that interpolate daily across any curve shape. Workout bonuses that scale protein and carbs based on calories burned. Your targets are never static.",
    href: "/how-it-works/dynamic-targets",
  },
  {
    emoji: "⚡",
    title: "Calorie Intelligence",
    color: "#D946EF",
    borderColor: "#D946EF20",
    desc: "NutriKit picks the smartest method available — energy balance from weight trends, Apple Health active energy, or the best BMR formula for your profile. A hierarchy of methods, automatically selected.",
    href: "/how-it-works/calorie-intelligence",
  },
  {
    emoji: "🔬",
    title: "Food Logging",
    color: "#60A5FA",
    borderColor: "#60A5FA20",
    desc: "A nutrition label scanner that extracts every value. A USDA-verified food database with lab-tested data. And an AI that can log meals from a photo, voice, or text. Precision and speed, together.",
    href: "/how-it-works/food-logging",
  },
  {
    emoji: "📊",
    title: "At a Glance",
    color: "#4ADE80",
    borderColor: "#4ADE8020",
    desc: "A dashboard that shows exactly where you stand on every nutrient — which meals contributed most, which foods drove your numbers, and your complete diary timeline. No clutter, no guessing.",
    href: "/how-it-works/at-a-glance",
  },
  {
    emoji: "✨",
    title: "Share Your Meals",
    color: "#D946EF",
    borderColor: "#D946EF20",
    desc: "Generate liquid glass stickers showing your meal or daily breakdown — calories, macros, and foods with emoji. Place them on photos or videos and share to Instagram, stories, or anywhere.",
    href: "/how-it-works/share-meals",
  },
];

export default function HowItWorksHub() {
  return (
    <main className="min-h-screen">
      <SiteHeader variant="article" />

      {/* Hero */}
      <section className="px-6 md:px-12 pt-28 pb-12 md:pt-32 md:pb-16 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.07)_0%,_transparent_70%)]">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <FadeUp>
            <SectionLabel color="#7C3AED">How NutriKit Works</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              The science behind
              <br />
              every recommendation
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-fg-secondary text-lg md:text-xl leading-relaxed max-w-2xl">
              NutriKit isn&apos;t a calorie counter with a food database bolted
              on. It&apos;s a nutrition engine &mdash; built on published
              research, real-time data from your body, and algorithms that adapt
              as you do. Here&apos;s exactly how each piece works.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 md:px-12 py-10 md:py-16">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
          {features.map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.08}>
              <Link
                href={card.href}
                className="group block bg-bg-card rounded-2xl p-10 border transition-all hover:border-opacity-40 hover:translate-y-[-2px] h-full"
                style={{ borderColor: card.borderColor }}
              >
                <span className="text-4xl">{card.emoji}</span>
                <h2
                  className="font-[family-name:var(--font-sora)] text-2xl font-bold mt-5"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h2>
                <p className="text-fg-secondary text-[15px] mt-4 leading-relaxed">
                  {card.desc}
                </p>
                <span
                  className="inline-block text-sm font-semibold mt-5 group-hover:translate-x-1 transition-transform"
                  style={{ color: card.color }}
                >
                  Read the deep dive &rarr;
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 px-6 bg-[linear-gradient(to_bottom,_rgba(124,58,237,0.09)_0%,_var(--color-bg-page)_100%)]">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold tracking-tight">
              Pick a topic and go deep.
            </h2>
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="text-fg-secondary text-lg">
              Or jump straight into the app.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              href="/#download"
              className="inline-block bg-purple hover:bg-purple/90 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get the Beta
            </Link>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-fg-muted text-sm">
              Free &middot; iOS 17+ &middot; No account required
            </p>
          </FadeUp>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
