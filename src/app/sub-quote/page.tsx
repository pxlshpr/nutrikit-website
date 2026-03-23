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
          <div className="border-l-2 border-purple/50 pl-5 text-left">
            <p className="text-xl md:text-2xl text-fg/80 leading-relaxed">
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
