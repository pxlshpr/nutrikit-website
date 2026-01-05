import Link from "next/link";
import BackgroundSwitcher from "@/components/backgrounds/BackgroundSwitcher";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Safe area cover - prevents Safari from sampling aurora colors */}
      <div className="safe-area-cover" />

      {/* Animated background with switcher */}
      <BackgroundSwitcher />

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* App Icon with Glow */}
          <div className="relative inline-block mb-8 animate-float-slow">
            {/* Glow effect behind icon */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-accent/50 via-protein/30 to-fat/40 rounded-full scale-150" />

            {/* App Icon */}
            <div className="relative glass-strong rounded-[2rem] p-1 w-32 h-32 mx-auto" suppressHydrationWarning>
              <img
                src="/app-icon.png"
                alt="NutriKit"
                width={120}
                height={120}
                className="rounded-[1.75rem]"
              />
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 gradient-text-accent">
            NutriKit
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted mb-12">
            You can&apos;t control what you don&apos;t measure
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary CTA - TestFlight */}
            <Link
              href="https://testflight.apple.com/join/tWZZUg57"
              className="gradient-button inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white rounded-full transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.8 14.4l-3.6-3.6 1.272-1.272 2.328 2.328 5.328-5.328L16.8 9.8l-6.6 6.6z"/>
              </svg>
              Join TestFlight
            </Link>

            {/* Secondary CTA - Sprint */}
            <Link
              href="/sprint"
              className="glass inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-foreground rounded-full hover:bg-foreground/5 dark:hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Track Development
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-8 safe-area-bottom">
        <p className="text-sm text-muted text-center mb-12">
          &copy; {new Date().getFullYear()} NutriKit. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
