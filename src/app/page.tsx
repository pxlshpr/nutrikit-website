"use client";

import { ScannerHero } from "@/components/scanner-hero";
import { Sections } from "@/components/sections";
import { FloatingCTA } from "@/components/floating-cta";
import { SiteHeader, SiteFooter } from "@/components/shared";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <FloatingCTA />
      <ScannerHero
        tagline={
          <div className="px-6 py-3 rounded-full border border-edge bg-bg-card/50 backdrop-blur-sm whitespace-nowrap">
            <p className="text-sm sm:text-lg md:text-xl text-fg-secondary tracking-wide">
              You can&apos;t manage what you don&apos;t measure.
            </p>
          </div>
        }
      />
      <Sections />
      <SiteFooter />
    </main>
  );
}
