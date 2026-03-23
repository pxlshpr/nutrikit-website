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
          <p className="text-2xl md:text-3xl font-medium max-w-xl leading-relaxed bg-gradient-to-r from-white via-purple to-fg-muted bg-clip-text text-transparent">
            You can&apos;t manage what you don&apos;t measure.
          </p>
        }
      />
      <Sections />
      <SiteFooter />
    </main>
  );
}
