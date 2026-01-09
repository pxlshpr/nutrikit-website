import Link from "next/link";
import VaporwaveBackground from "@/components/backgrounds/VaporwaveBackground";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Vaporwave Background - Floating sun + perspective grid */}
      <VaporwaveBackground />

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="text-center max-w-2xl">
          {/* App Icon with Neon Glow */}
          <div className="relative inline-block mb-12 animate-float">
            {/* Magenta + Cyan dual glow effect */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-primary/60 via-secondary/40 to-tertiary/30 rounded-full scale-150" />

            {/* Icon Container - Rounded like the old design */}
            <div className="relative glass-strong border-2 border-primary/30 rounded-[2rem] p-1 w-32 h-32 mx-auto transition-all duration-200 hover:border-secondary hover:shadow-glow-cyan" suppressHydrationWarning>
              <img
                src="/app-icon.png"
                alt="NutriKit"
                width={120}
                height={120}
                className="rounded-[1.75rem]"
              />
            </div>
          </div>

          {/* App Name - Gradient text with glow */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-6 gradient-text heading-glow">
            NUTRIKIT
          </h1>

          {/* Terminal-style tagline with cyan accent */}
          <p className="font-mono text-lg md:text-xl text-foreground mb-4 tracking-wide">
            <span className="text-secondary">&gt;</span> You can&apos;t control what you don&apos;t measure
          </p>

          {/* System status indicator */}
          <div className="flex items-center justify-center gap-2 mb-16">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            <span className="text-xs font-mono uppercase tracking-widest text-secondary/70">
              System Active
            </span>
          </div>

          {/* CTAs - Vaporwave buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Primary CTA - TestFlight */}
            <Link href="https://testflight.apple.com/join/tWZZUg57">
              <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[220px]">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.8 14.4l-3.6-3.6 1.272-1.272 2.328 2.328 5.328-5.328L16.8 9.8l-6.6 6.6z"/>
                </svg>
                Join TestFlight
              </Button>
            </Link>

            {/* Secondary CTA - Sprint */}
            <Link href="/block">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[220px]">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Track Development
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer - Terminal style */}
      <footer className="pt-8 pb-12 relative z-10">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 text-center">
          <span className="text-primary">[</span> &copy; {new Date().getFullYear()} NutriKit <span className="text-primary">]</span> <span className="text-secondary mx-2">|</span> All rights reserved
        </p>
      </footer>
    </div>
  );
}
