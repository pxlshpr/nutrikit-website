"use client";

import Link from "next/link";
import { SiteHeader, SiteFooter, FadeUp } from "../../components/shared";

const deepDives = [
  {
    slug: "glass-stickers",
    title: "Glass Stickers",
    subtitle:
      "How we render iOS 26 liquid glass effects on shareable meal stickers — for both images and frame-by-frame video.",
    color: "#60A5FA",
    tags: ["SwiftUI", "Metal", "AVFoundation"],
  },
];

export default function DeepDivesPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader variant="article" />

      <section className="pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
          <FadeUp>
            <span className="text-[11px] font-bold tracking-[3px] uppercase text-purple">
              Behind the Code
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Deep Dives
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-fg-secondary text-lg leading-relaxed max-w-xl">
              Technical breakdowns of how NutriKit features work under the hood
              — from GPU rendering to video encoding.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex flex-col gap-4">
          {deepDives.map((dive, i) => (
            <FadeUp key={dive.slug} delay={i * 0.08}>
              <Link href={`/deep-dives/${dive.slug}`} className="group block">
                <div className="bg-bg-card rounded-2xl p-6 md:p-8 border border-edge transition-all hover:border-opacity-60 hover:-translate-y-0.5"
                  style={{ borderColor: `${dive.color}20` }}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      {dive.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md"
                          style={{
                            background: `${dive.color}15`,
                            color: dive.color,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2
                      className="font-[family-name:var(--font-sora)] text-xl md:text-2xl font-bold group-hover:opacity-80 transition-opacity"
                      style={{ color: dive.color }}
                    >
                      {dive.title} &rarr;
                    </h2>
                    <p className="text-fg-secondary text-sm md:text-base leading-relaxed">
                      {dive.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
