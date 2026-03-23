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
          <p className="text-2xl md:text-3xl text-fg/40 max-w-xl leading-relaxed tracking-widest font-light">
            You can&apos;t manage what you don&apos;t measure.
          </p>
        }
      />
      <Sections />
      <SiteFooter />
    </main>
  );
}
