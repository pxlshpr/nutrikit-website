import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-accent">
              NutriKit
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#reviews" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Reviews
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                NutriKit+
              </Link>
              <Link href="#" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Help
              </Link>
            </div>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-full hover:bg-accent-light transition-colors shadow-lg shadow-accent/25"
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
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  A Simpler Way to
                  <br />
                  <span className="text-accent">Track Nutrition</span>
                </h1>
                <p className="text-lg md:text-xl text-muted mb-8 max-w-xl">
                  NutriKit helps you build healthy habits without the complexity.
                  Track your macros, monitor your progress, and achieve your goals with ease.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-accent rounded-full hover:bg-accent-light transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Download on the App Store
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground border-2 border-border-light rounded-full hover:bg-section-alt transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="relative flex justify-center">
                {/* App Screenshot */}
                <div className="relative w-[280px] md:w-[320px]">
                  <Image
                    src="/app-screenshot.png"
                    alt="NutriKit app showing daily nutrition tracking"
                    width={320}
                    height={693}
                    className="rounded-[2.5rem] shadow-2xl shadow-black/40"
                    priority
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-protein/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-carbs/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Logos Section */}
        <section className="border-y border-border bg-section-alt">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-sm text-muted mb-6">As featured in</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              {/* Placeholder logos */}
              {['MacStories', '9to5Mac', 'iMore', 'TechCrunch'].map((name) => (
                <div key={name} className="text-lg font-semibold text-muted">{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to
                <span className="text-accent"> succeed</span>
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Simple, powerful tools designed to help you understand and improve your nutrition.
              </p>
            </div>

            {/* Feature 1 - Macro Tracking */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-protein-soft text-protein text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Macro Tracking
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Track with confidence
                </h3>
                <p className="text-lg text-muted mb-6">
                  Log your meals and get instant breakdowns of protein, carbs, and fat.
                  Our comprehensive food database makes tracking effortless and accurate.
                </p>
                <ul className="space-y-3">
                  {['Detailed nutritional information', 'Custom food entries', 'Quick meal logging'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted">
                      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="w-full max-w-sm bg-section-alt rounded-2xl p-6 border border-border">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted">Daily Progress</p>
                        <p className="text-2xl font-bold">1,847 <span className="text-sm font-normal text-muted">/ 2,000 kcal</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-success">92%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-protein-soft/50 rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full border-4 border-protein flex items-center justify-center">
                          <span className="text-xs font-bold text-protein">75%</span>
                        </div>
                        <p className="text-xs font-medium text-protein">Protein</p>
                        <p className="text-xs text-muted">112g / 150g</p>
                      </div>
                      <div className="text-center p-3 bg-carbs-soft/50 rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full border-4 border-carbs flex items-center justify-center">
                          <span className="text-xs font-bold text-carbs">85%</span>
                        </div>
                        <p className="text-xs font-medium text-carbs">Carbs</p>
                        <p className="text-xs text-muted">213g / 250g</p>
                      </div>
                      <div className="text-center p-3 bg-fat-soft/50 rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full border-4 border-fat flex items-center justify-center">
                          <span className="text-xs font-bold text-fat">90%</span>
                        </div>
                        <p className="text-xs font-medium text-fat">Fat</p>
                        <p className="text-xs text-muted">63g / 70g</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Barcode Scanning */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
              <div className="flex justify-center">
                <div className="w-full max-w-sm bg-section-alt rounded-2xl p-6 border border-border">
                  <div className="aspect-square bg-gradient-to-br from-carbs/10 to-carbs/5 rounded-xl flex flex-col items-center justify-center">
                    <svg className="w-20 h-20 text-carbs mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="text-sm font-medium text-carbs">Scan Any Barcode</p>
                    <p className="text-xs text-muted mt-1">Instant nutrition data</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-carbs-soft text-carbs text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Scanning
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Scan barcodes & nutrition labels
                </h3>
                <p className="text-lg text-muted mb-6">
                  Point your camera at any barcode or nutrition label and get instant nutritional
                  information. No manual entry required.
                </p>
                <ul className="space-y-3">
                  {['Barcode scanning', 'Nutrition label recognition', 'Massive food database'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted">
                      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 - Goals & Insights */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fat-soft text-fat text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Insights
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Goals & progress tracking
                </h3>
                <p className="text-lg text-muted mb-6">
                  Set personalized nutrition goals and watch your progress over time with
                  beautiful charts and actionable insights.
                </p>
                <ul className="space-y-3">
                  {['Customizable macro goals', 'Weekly & monthly trends', 'Progress insights'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted">
                      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="w-full max-w-sm bg-section-alt rounded-2xl p-6 border border-border">
                  <p className="text-sm font-medium mb-4">Weekly Protein Intake</p>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[65, 80, 72, 90, 85, 78, 88].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-accent rounded-t-md transition-all"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-muted">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-20 md:py-32 bg-section-alt">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                People <span className="text-accent">love</span> NutriKit
              </h2>
              <p className="text-lg text-muted">
                See what our users are saying
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  text: "Finally, a nutrition tracker that doesn't feel like homework. NutriKit makes it so easy to stay on top of my macros.",
                  author: "Sarah M.",
                  role: "Fitness Enthusiast"
                },
                {
                  text: "The barcode scanner is incredibly fast and accurate. I've tried other apps but NutriKit's database is by far the most comprehensive.",
                  author: "Mike R.",
                  role: "Health Coach"
                },
                {
                  text: "I love the clean design and how it focuses on what matters. No ads, no clutter, just simple nutrition tracking.",
                  author: "Emily K.",
                  role: "Nutritionist"
                },
                {
                  text: "The macro tracking visualization is beautiful. I can see my protein, carbs, and fat at a glance. Game changer!",
                  author: "David L.",
                  role: "Personal Trainer"
                },
                {
                  text: "Been using NutriKit for 6 months now. It's helped me understand my eating habits and make better choices.",
                  author: "Jessica T.",
                  role: "App Store Review"
                },
                {
                  text: "Simple, elegant, and powerful. This is what a nutrition app should be. Worth every penny for the plus version.",
                  author: "Chris P.",
                  role: "App Store Review"
                }
              ].map((review, i) => (
                <div key={i} className="bg-background p-6 rounded-2xl border border-border">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-carbs" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground mb-4">&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <p className="text-sm text-muted">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Start for free, upgrade when you&apos;re ready for more.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="bg-section-alt p-8 rounded-2xl border border-border">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-muted mb-6">Everything you need to get started</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted">/forever</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Macro & calorie tracking',
                    'Barcode scanning',
                    'Food database access',
                    'Basic progress charts',
                    'iCloud sync',
                    'Apple Health integration'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className="block w-full py-3 text-center font-semibold border-2 border-border-light rounded-full hover:bg-background transition-colors"
                >
                  Download Free
                </Link>
              </div>

              {/* Plus Tier */}
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-8 rounded-2xl border-2 border-accent relative overflow-hidden">
                <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">NutriKit+</h3>
                <p className="text-muted mb-6">For serious nutrition tracking</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-muted">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Everything in Free',
                    'AI-powered food recognition',
                    'Advanced analytics & trends',
                    'Custom nutrition goals',
                    'Micronutrient tracking',
                    'Export data (CSV, JSON)',
                    'Priority support',
                    'Early access to new features'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className="block w-full py-3 text-center font-semibold text-white bg-accent rounded-full hover:bg-accent-light transition-colors shadow-lg shadow-accent/25"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-32 bg-section-alt">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to take control of your nutrition?
            </h2>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their health with NutriKit.
              Download now and start your journey today.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-accent rounded-full hover:bg-accent-light transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on the App Store
            </Link>
            <p className="mt-4 text-sm text-muted">Free to download. No credit card required.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-xl font-bold text-accent">
                NutriKit
              </Link>
              <p className="mt-2 text-sm text-muted">
                A simpler way to track your nutrition.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#reviews" className="hover:text-foreground transition-colors">Reviews</Link></li>
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
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
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
