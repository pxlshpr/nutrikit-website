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
          <div className="flex items-center gap-4 max-w-xl">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-purple/40" />
            <p className="text-xl md:text-2xl text-fg font-medium tracking-wide whitespace-nowrap">
              You can&apos;t manage what you don&apos;t measure.
            </p>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-purple/40" />
          </div>
        }
      />
      <Sections />
      <SiteFooter />
    </main>
  );
}
