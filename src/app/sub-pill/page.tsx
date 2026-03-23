"use client";
import { ScannerHero } from "@/components/scanner-hero";
import { Sections } from "@/components/sections";
import { SiteHeader, SiteFooter } from "@/components/shared";

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <ScannerHero
        tagline={
          <div className="px-6 py-3 rounded-full border border-edge bg-bg-card/50 backdrop-blur-sm">
            <p className="text-lg md:text-xl text-fg-secondary tracking-wide">
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
