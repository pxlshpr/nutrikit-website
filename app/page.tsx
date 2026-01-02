import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-subtle">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold gradient-text-accent">
              NutriKit
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
            <Link
              href="https://apps.apple.com/app/nutrikit"
              className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 glass-subtle px-4 py-2 rounded-full text-sm font-medium text-accent mb-6">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                  Coming Soon to the App Store
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                  The Fastest Way to
                  <br />
                  <span className="gradient-text">Track Nutrition</span>
                </h1>

                <p className="text-lg md:text-xl text-muted mb-8 max-w-xl mx-auto lg:mx-0">
                  Voice logging, lightning-fast search, and a beautiful timeline view.
                  NutriKit makes tracking your macros effortless.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="https://apps.apple.com/app/nutrikit"
                    className="glass-button inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white rounded-full hover:glow-accent"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Download on the App Store
                  </Link>
                  <Link
                    href="#features"
                    className="glass inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full hover:bg-white/10 transition-colors"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>

              {/* Right: App Screenshot */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative animate-float-slow">
                  {/* Glow behind phone */}
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-accent/30 via-protein/20 to-fat/30 rounded-full scale-110" />

                  {/* Phone mockup */}
                  <div className="relative w-[280px] md:w-[320px] glass-strong rounded-[3rem] p-2">
                    <Image
                      src="/app-screenshot.png"
                      alt="NutriKit app showing daily nutrition tracking"
                      width={320}
                      height={693}
                      className="rounded-[2.5rem]"
                      priority
                    />
                  </div>
                </div>

                {/* Floating feature badges */}
                <div className="absolute -left-4 top-1/4 glass px-4 py-2 rounded-xl animate-float hidden lg:block">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎤</span>
                    <span className="text-sm font-medium">Voice Logging</span>
                  </div>
                </div>

                <div className="absolute -right-4 top-1/3 glass px-4 py-2 rounded-xl animate-float-delayed hidden lg:block">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍎</span>
                    <span className="text-sm font-medium">4.2M Foods</span>
                  </div>
                </div>

                <div className="absolute -left-8 bottom-1/4 glass px-4 py-2 rounded-xl animate-float hidden lg:block" style={{animationDelay: '1s'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    <span className="text-sm font-medium">Meal Timeline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-12 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-3xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">4.2M+</div>
                  <div className="text-sm text-muted">Foods in Database</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-protein mb-2">4</div>
                  <div className="text-sm text-muted">Ways to Log</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-carbs mb-2">30+</div>
                  <div className="text-sm text-muted">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-fat mb-2">100%</div>
                  <div className="text-sm text-muted">Privacy First</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Features,
                <span className="gradient-text-accent"> Effortless Tracking</span>
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Built for speed and simplicity. Log your meals in seconds, not minutes.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {/* Voice & Text Logging */}
              <div className="glass-protein feature-card rounded-3xl p-8 hover:glow-protein">
                <div className="text-5xl mb-6">🎤</div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  V O I C E & T E X T
                </h3>
                <p className="text-muted mb-6">
                  Log meals naturally by speaking or typing. Our AI understands what you ate and logs it instantly.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "🎤", label: "Speak" },
                    { icon: "⌨️", label: "Type" },
                    { icon: "📷", label: "Scan" },
                    { icon: "🔍", label: "Search" },
                  ].map((item) => (
                    <div key={item.label} className="glass-subtle rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lightning Fast Search */}
              <div className="glass-carbs feature-card rounded-3xl p-8 hover:glow-carbs">
                <div className="text-5xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  L I G H T N I N G  F A S T
                </h3>
                <p className="text-muted mb-6">
                  Search 4.2 million products instantly. Scan multiple barcodes at once. See images in results.
                </p>
                <div className="space-y-3">
                  {[
                    "Instant search results",
                    "Multi-barcode scanning",
                    "Product images & details",
                    "Works offline",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-carbs flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal Timeline */}
              <div className="glass-fat feature-card rounded-3xl p-8 hover:glow-fat">
                <div className="text-5xl mb-6">📅</div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  M E A L  T I M E L I N E
                </h3>
                <p className="text-muted mb-6">
                  See your day at a glance. Drag to reorder meals, copy to other days, visualize patterns.
                </p>
                <div className="glass-subtle rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-carbs" />
                    <div className="flex-1 h-1 bg-white/10 rounded-full">
                      <div className="w-1/3 h-full bg-carbs/60 rounded-full" />
                    </div>
                    <span className="text-xs text-muted">8am</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-protein" />
                    <div className="flex-1 h-1 bg-white/10 rounded-full">
                      <div className="w-1/2 h-full bg-protein/60 rounded-full" />
                    </div>
                    <span className="text-xs text-muted">12pm</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-fat" />
                    <div className="flex-1 h-1 bg-white/10 rounded-full">
                      <div className="w-2/3 h-full bg-fat/60 rounded-full" />
                    </div>
                    <span className="text-xs text-muted">7pm</span>
                  </div>
                </div>
              </div>

              {/* More Features */}
              <div className="glass-accent feature-card rounded-3xl p-8 hover:glow-accent">
                <div className="text-5xl mb-6">✨</div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  A N D  M U C H  M O R E
                </h3>
                <p className="text-muted mb-6">
                  A complete toolkit for reaching your nutrition goals.
                </p>
                <div className="space-y-3">
                  {[
                    "Guided onboarding wizard",
                    "Multilingual support",
                    "Apple Health sync",
                    "iCloud backup",
                    "Dark & light themes",
                    "Widget support",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Track in <span className="gradient-text-accent">Three Steps</span>
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Getting started takes less than a minute.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Set Your Goals",
                  description: "Tell us your targets and we'll calculate your daily macros automatically.",
                  icon: "🎯",
                },
                {
                  step: "02",
                  title: "Log Your Meals",
                  description: "Speak, type, scan, or search. Whatever works best for you.",
                  icon: "🍽️",
                },
                {
                  step: "03",
                  title: "Track Progress",
                  description: "Watch your patterns emerge and stay motivated with insights.",
                  icon: "📈",
                },
              ].map((item, index) => (
                <div key={item.step} className="glass feature-card rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-accent text-sm font-bold mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Macro Tracking Visual */}
        <section className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Beautiful <span className="gradient-text">Macro Tracking</span>
                </h2>
                <p className="text-lg text-muted mb-8">
                  See exactly where you stand at a glance. Track protein, carbs, fat, and calories with beautiful visualizations.
                </p>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-protein">Protein</span>
                      <span className="text-muted">112g / 150g</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-protein to-protein-light rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-carbs">Carbs</span>
                      <span className="text-muted">213g / 250g</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-carbs to-carbs-light rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-fat">Fat</span>
                      <span className="text-muted">63g / 70g</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[90%] bg-gradient-to-r from-fat to-fat-light rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="glass-strong rounded-3xl p-8 w-full max-w-sm">
                  <div className="text-center mb-6">
                    <div className="text-sm text-muted mb-1">Today&apos;s Calories</div>
                    <div className="text-4xl font-bold">1,847</div>
                    <div className="text-muted">of 2,000 kcal</div>
                  </div>

                  {/* Circular progress */}
                  <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${0.92 * 2 * Math.PI * 88} ${2 * Math.PI * 88}`}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--accent)" />
                          <stop offset="50%" stopColor="var(--protein)" />
                          <stop offset="100%" stopColor="var(--fat)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">92%</div>
                        <div className="text-xs text-muted">Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, <span className="gradient-text-accent">Fair Pricing</span>
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Start for free, upgrade when you need more.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="glass feature-card rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-muted mb-6">Everything you need to start</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted">/forever</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Unlimited food logging',
                    'Barcode scanning',
                    'Voice & text input',
                    'Basic progress charts',
                    'iCloud sync',
                    'Apple Health integration'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="https://apps.apple.com/app/nutrikit"
                  className="block w-full glass py-4 text-center font-semibold rounded-full hover:bg-white/10 transition-colors"
                >
                  Download Free
                </Link>
              </div>

              {/* Plus Tier */}
              <div className="glass-accent feature-card rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-accent px-3 py-1 text-xs font-bold rounded-full">
                  RECOMMENDED
                </div>
                <h3 className="text-2xl font-bold mb-2">NutriKit+</h3>
                <p className="text-muted mb-6">For serious tracking</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$4.99</span>
                  <span className="text-muted">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Everything in Free',
                    'AI-powered food recognition',
                    'Advanced analytics',
                    'Micronutrient tracking',
                    'Custom nutrition goals',
                    'Export data (CSV, JSON)',
                    'Priority support',
                    'Early access to features'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="https://apps.apple.com/app/nutrikit"
                  className="glass-button block w-full py-4 text-center font-semibold rounded-full hover:glow-accent"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-strong rounded-3xl p-12 md:p-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to <span className="gradient-text">Transform</span> Your Nutrition?
              </h2>
              <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
                Join thousands who track smarter, not harder. Download NutriKit today and take control of your health.
              </p>
              <Link
                href="https://apps.apple.com/app/nutrikit"
                className="glass-button inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white rounded-full hover:glow-accent"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download on the App Store
              </Link>
              <p className="mt-4 text-sm text-muted">Free to download. No credit card required.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-subtle py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-xl font-bold gradient-text-accent">
                NutriKit
              </Link>
              <p className="mt-2 text-sm text-muted">
                The fastest way to track your nutrition.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} NutriKit. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              <Link href="#" className="text-muted hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
