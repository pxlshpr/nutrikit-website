"use client";

import Link from "next/link";
import { SiteHeader, SiteFooter, FadeUp } from "./shared";
import type { ReactNode } from "react";

interface NavLink {
  label: string;
  href: string;
  color: string;
  subtitle?: string;
}

interface ArticleLayoutProps {
  breadcrumbLabel: string;
  breadcrumbColor: string;
  sectionLabel: string;
  accentColor: string;
  gradientColor: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  ctaText: string;
  ctaGradientColor: string;
  prev?: NavLink;
  next?: NavLink;
}

export default function ArticleLayout({
  breadcrumbLabel,
  breadcrumbColor,
  sectionLabel,
  accentColor,
  gradientColor,
  title,
  subtitle,
  children,
  ctaText,
  ctaGradientColor,
  prev,
  next,
}: ArticleLayoutProps) {
  return (
    <main className="min-h-screen">
      <SiteHeader variant="article" />

      {/* Breadcrumb */}
      <div className="pt-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[13px]">
          <Link
            href="/how-it-works"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            How It Works
          </Link>
          <span className="text-gray-500">/</span>
          <span className="font-semibold" style={{ color: breadcrumbColor }}>
            {breadcrumbLabel}
          </span>
        </div>
      </div>

      {/* Article Hero */}
      <section
        className="px-6 md:px-12 pt-12 pb-16 md:pt-16 md:pb-20"
        style={{
          background: `radial-gradient(ellipse at center, ${gradientColor} 0%, transparent 70%)`,
        }}
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <FadeUp>
            <span
              className="text-[11px] font-bold tracking-[3px] uppercase"
              style={{ color: accentColor }}
            >
              {sectionLabel}
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight whitespace-pre-line">
              {title}
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-6 md:px-12 pb-16 space-y-12 md:space-y-16">
        {children}
      </article>

      {/* Prev / Next Navigation */}
      {(prev || next) && (
        <nav className="max-w-3xl mx-auto px-6 md:px-12 py-12 flex justify-between gap-4">
          {prev ? (
            <Link href={prev.href} className="group flex-1">
              <div
                className="bg-bg-card rounded-2xl p-6 border transition-colors hover:border-opacity-40"
                style={{ borderColor: `${prev.color}20` }}
              >
                <span className="text-[11px] font-bold tracking-[2px] text-gray-500 uppercase">
                  Previous
                </span>
                <p
                  className="font-[family-name:var(--font-sora)] text-lg font-bold mt-1 group-hover:opacity-80 transition-opacity"
                  style={{ color: prev.color }}
                >
                  &larr; {prev.label}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link href={next.href} className="group flex-1 text-right">
              <div
                className="bg-bg-card rounded-2xl p-6 border transition-colors hover:border-opacity-40"
                style={{ borderColor: `${next.color}20` }}
              >
                <span className="text-[11px] font-bold tracking-[2px] text-gray-500 uppercase">
                  Next
                </span>
                <p
                  className="font-[family-name:var(--font-sora)] text-lg font-bold mt-1 group-hover:opacity-80 transition-opacity"
                  style={{ color: next.color }}
                >
                  {next.label} &rarr;
                </p>
                {next.subtitle && (
                  <p className="text-gray-400 text-sm mt-1">{next.subtitle}</p>
                )}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      )}

      {/* CTA Section */}
      <section
        className="py-16 md:py-20 px-6"
        style={{
          background: `linear-gradient(to bottom, ${ctaGradientColor} 0%, #08080F 100%)`,
        }}
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold tracking-tight">
              {ctaText}
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              href="/#download"
              className="inline-block bg-purple hover:bg-purple/90 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get the Beta
            </Link>
          </FadeUp>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

/* ───── Article section components ───── */

export function ArticleH2({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-[family-name:var(--font-sora)] text-2xl md:text-[32px] font-bold tracking-tight leading-tight ${className}`}
    >
      {children}
    </h2>
  );
}

export function ArticleH3({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <h3
      className="font-[family-name:var(--font-sora)] text-xl md:text-2xl font-bold"
      style={{ color }}
    >
      {children}
    </h3>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-gray-400 text-base leading-[1.7] space-y-4">
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <FadeUp>
      <div className={`space-y-5 ${className}`}>{children}</div>
    </FadeUp>
  );
}
