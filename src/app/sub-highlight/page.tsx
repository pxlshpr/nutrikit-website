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
          <p className="text-xl md:text-2xl text-fg-secondary max-w-xl leading-relaxed">
            You can&apos;t{" "}
            <span className="text-fg bg-purple-soft px-2 py-0.5 rounded-md">manage</span>
            {" "}what you don&apos;t{" "}
            <span className="text-fg bg-purple-soft px-2 py-0.5 rounded-md">measure</span>.
          </p>
        }
      />
      <Sections />
      <SiteFooter />
    </main>
  );
}
