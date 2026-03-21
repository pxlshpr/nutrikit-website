"use client";

import Link from "next/link";
import {
  FadeUp,
  ScaleIn,
  SlideIn,
  SectionLabel,
  PhoneMockup,
  ScrollingPhoneMockup,
} from "@/components/shared";

/* Shared page sections — used by main page and alt hero variants */

export function Sections() {
  return (
    <>
      <FoodLogging />
      <AtAGlance />
      <SmartTargets />
      <CalorieIntelligence />
      <DynamicTargets />
      <ShareMeals />
      {/* <HowItWorks /> */}
      <FinalCTA />
    </>
  );
}

/* ───────────────────────── Smart Targets ───────────────────────── */

function SmartTargets() {
  return (
    <section className="relative py-24 md:py-32 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 max-w-5xl mx-auto">
          {/* Left: headline */}
          <div className="flex-1">
            <FadeUp><SectionLabel color="#7C3AED">Smart Goals</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-[family-name:var(--font-sora)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-4 leading-[1.05]">
                Built for
                <br />
                <span className="text-purple">your</span> body.
                <br />
                Not everyone&apos;s.
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-fg-secondary text-base md:text-lg mt-6 leading-relaxed max-w-sm">
                Personalized ranges for every nutrient, backed by real science.
              </p>
            </FadeUp>
          </div>

          {/* Right: UI snippet cards */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
            {/* Card 1: Personalization inputs */}
            <SlideIn from="right">
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">👤 &nbsp;Your profile</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2">
                  {[
                    { label: "Age", value: "32" },
                    { label: "Sex", value: "Male" },
                    { label: "Weight", value: "78 kg" },
                    { label: "Activity", value: "Moderate" },
                  ].map((f) => (
                    <div key={f.label} className="flex justify-between text-xs">
                      <span className="text-fg-secondary">{f.label}</span>
                      <span className="text-fg font-medium">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>

            {/* Card 2: Nutrient ranges */}
            <SlideIn from="right" delay={0.1}>
              <div className="bg-bg-card rounded-2xl border border-purple/20 p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-purple">🎯 &nbsp;Your goals</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2">
                  {[
                    { nutrient: "Protein", range: "82 – 120g" },
                    { nutrient: "Calories", range: "2,400 – 2,800" },
                    { nutrient: "Iron", range: "8 – 18mg" },
                    { nutrient: "Vitamin D", range: "15 – 50mcg" },
                  ].map((n) => (
                    <div key={n.nutrient} className="flex justify-between text-xs">
                      <span className="text-fg-secondary">{n.nutrient}</span>
                      <span className="text-fg font-medium">{n.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>

            {/* Card 3: Research sources */}
            <SlideIn from="right" delay={0.2}>
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">📚 &nbsp;Backed by research</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-1.5">
                  {[
                    "Institute of Medicine (IOM)",
                    "World Health Organization",
                    "European Food Safety Authority",
                    "Published meta-analyses",
                  ].map((s) => (
                    <div key={s} className="text-xs text-fg-secondary flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-purple shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Dynamic Targets ───────────────────────── */

function DynamicTargets() {
  return (
    <section className="py-24 md:py-32 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 max-w-5xl mx-auto">
          {/* Left: headline */}
          <div className="flex-1">
            <FadeUp><SectionLabel color="#D4A853">Dynamic Goals</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-[family-name:var(--font-sora)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-4 leading-[1.05]">
                Goals that
                <br />
                <span style={{ color: "#D4A853" }}>keep up</span>
                <br />
                with you.
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-fg-secondary text-base md:text-lg mt-6 leading-relaxed max-w-sm">
                Ramping down carbs? Burned extra calories? Your goals adjust automatically.
              </p>
            </FadeUp>
          </div>

          {/* Right: UI snippet cards */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
            {/* Card 1: Gradual goal */}
            <SlideIn from="right">
              <div className="bg-bg-card rounded-2xl border border-gold/20 p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-gold">📉 &nbsp;Gradual goal</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Carbs</span>
                    <span className="text-fg font-medium">300g → 70g</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Over</span>
                    <span className="text-fg font-medium">8 weeks</span>
                  </div>
                  <div className="h-8 mt-1 flex items-end">
                    <svg viewBox="0 0 200 32" className="w-full h-full" preserveAspectRatio="none">
                      <path d="M0,2 C50,2 150,28 200,30" fill="none" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="80" cy="12" r="4" fill="#D4A853" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-fg-faint">
                    <span>Week 1</span>
                    <span className="text-gold font-medium">Today: 156g</span>
                    <span>Week 6</span>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Card 2: Workout bonus */}
            <SlideIn from="right" delay={0.1}>
              <div className="bg-bg-card rounded-2xl border border-green/20 p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-green">🏋️ &nbsp;Workout bonus</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Workout</span>
                    <span className="text-fg font-medium">400 kcal burned</span>
                  </div>
                  <div className="border-t border-edge my-1" />
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Protein</span>
                    <span className="text-green font-medium">+20g</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Carbs</span>
                    <span className="text-green font-medium">+40g</span>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Card 3: Today's adjusted goal */}
            <SlideIn from="right" delay={0.2}>
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">📋 &nbsp;Today&apos;s carb goal</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Base goal</span>
                    <span className="text-fg font-medium">300g</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Gradual adjustment</span>
                    <span className="text-gold font-medium">-144g</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-fg-secondary">Workout bonus</span>
                    <span className="text-green font-medium">+40g</span>
                  </div>
                  <div className="border-t border-edge my-1" />
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-fg">Today</span>
                    <span className="text-fg">196g</span>
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Calorie Intelligence ───────────────────────── */

function CalorieIntelligence() {
  return (
    <section className="py-24 md:py-32 bg-bg-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row-reverse items-start gap-12 md:gap-20 max-w-5xl mx-auto">
          {/* Right: headline */}
          <div className="flex-1 md:text-right">
            <FadeUp><SectionLabel color="#D946EF">Calorie Intelligence</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-[family-name:var(--font-sora)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-4 leading-[1.05]">
                Your calorie goal.
                <br />
                <span style={{ color: "#D946EF" }}>Not a guess.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-fg-secondary text-base md:text-lg mt-6 leading-relaxed max-w-sm md:ml-auto">
                Set your direction. NutriKit figures out the number.
              </p>
            </FadeUp>
          </div>

          {/* Right: UI snippet cards */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
            {/* Card 1: Goal mode selector */}
            <SlideIn from="right">
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">🎚️ &nbsp;Your goal</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 flex flex-col gap-3">
                  <div className="flex gap-2">
                    {["Lose", "Maintain", "Gain"].map((g) => (
                      <span key={g} className={`flex-1 text-center text-xs font-semibold py-1.5 rounded-lg ${g === "Lose" ? "bg-pink/20 text-pink" : "text-fg-muted"}`}>{g}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-fg-muted">Mild</span>
                    <div className="flex-1 h-1.5 rounded-full bg-bg-page relative">
                      <div className="absolute left-0 top-0 h-full w-[40%] rounded-full" style={{ background: "#D946EF" }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-pink" style={{ left: "38%" }} />
                    </div>
                    <span className="text-[10px] text-fg-muted">Aggressive</span>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Card 2: Calculated number */}
            <SlideIn from="right" delay={0.1}>
              <div className="bg-bg-card rounded-2xl border border-pink/20 p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-pink">✨ &nbsp;Calculated for you</span>
                <div className="bg-bg-alt rounded-xl px-4 py-4 text-center">
                  <div className="text-3xl font-bold text-fg font-[family-name:var(--font-sora)]">2,480</div>
                  <div className="text-xs text-fg-muted mt-1">kcal / day</div>
                  <div className="text-[10px] text-fg-faint mt-2">Based on your weight trend &amp; intake</div>
                </div>
              </div>
            </SlideIn>

            {/* Card 3: Adapts over time */}
            <SlideIn from="right" delay={0.2}>
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">📅 &nbsp;Updates daily</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2">
                  {[
                    { day: "Mon", cal: "2,520", delta: "" },
                    { day: "Tue", cal: "2,490", delta: "-30" },
                    { day: "Wed", cal: "2,510", delta: "+20" },
                    { day: "Thu", cal: "2,480", delta: "-30" },
                    { day: "Today", cal: "2,480", delta: "—" },
                  ].map((d) => (
                    <div key={d.day} className="flex justify-between text-xs">
                      <span className={`${d.day === "Today" ? "text-pink font-semibold" : "text-fg-secondary"} w-10`}>{d.day}</span>
                      <span className="text-fg font-medium">{d.cal} kcal</span>
                      {d.delta && <span className={`w-8 text-right ${d.delta.startsWith("-") ? "text-pink" : d.delta.startsWith("+") ? "text-green" : "text-fg-muted"}`}>{d.delta}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Food Logging ───────────────────────── */

function FoodLogging() {
  return (
    <section id="features" className="py-24 md:py-32 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 max-w-5xl mx-auto">
          {/* Left: headline */}
          <div className="flex-1">
            <FadeUp><SectionLabel color="#60A5FA">Food Logging</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-[family-name:var(--font-sora)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-4 leading-[1.05]">
                Scan it.
                <br />
                Search it.
                <br />
                <span style={{ color: "#60A5FA" }}>Say it.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-fg-secondary text-base md:text-lg mt-6 leading-relaxed max-w-sm">
                Three ways to log. You always review before saving.
              </p>
            </FadeUp>
          </div>

          {/* Right: UI snippet cards */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
            <SlideIn from="right">
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">📷 &nbsp;Scan a label</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-1">
                  <div className="flex justify-between text-xs text-fg-secondary"><span>Calories</span><span className="text-fg font-medium">210 kcal</span></div>
                  <div className="flex justify-between text-xs text-fg-secondary"><span>Protein</span><span className="text-fg font-medium">12g</span></div>
                  <div className="flex justify-between text-xs text-fg-secondary"><span>Fat</span><span className="text-fg font-medium">8g</span></div>
                </div>
              </div>
            </SlideIn>

            <SlideIn from="right" delay={0.1}>
              <div className="bg-bg-card rounded-2xl border border-edge p-4 flex items-center gap-3">
                <span className="text-xl">🔍</span>
                <div>
                  <div className="text-sm font-semibold text-fg">Chicken Breast</div>
                  <div className="text-xs text-fg-muted">165 kcal &middot; 31g protein</div>
                </div>
              </div>
            </SlideIn>

            <SlideIn from="right" delay={0.2}>
              <div className="bg-bg-card rounded-2xl border border-blue/20 p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-blue">⚡ &nbsp;AI Quick Log</span>
                <div className="bg-bg-alt rounded-xl px-4 py-2.5">
                  <span className="text-sm text-fg-secondary italic">&ldquo;lamb shank and rice&rdquo;</span>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── At a Glance ───────────────────────── */

function AtAGlance() {
  return (
    <section className="py-24 md:py-32 bg-bg-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row-reverse items-start gap-12 md:gap-20 max-w-5xl mx-auto">
          {/* Right: headline */}
          <div className="flex-1 md:text-right">
            <FadeUp><SectionLabel color="#4ADE80">At a Glance</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-[family-name:var(--font-sora)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-4 leading-[1.05]">
                Every nutrient.
                <br />
                <span style={{ color: "#4ADE80" }}>One glance.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-fg-secondary text-base md:text-lg mt-6 leading-relaxed max-w-sm md:ml-auto">
                Tap any nutrient to see which meals and foods drove it.
              </p>
            </FadeUp>
          </div>

          {/* Right: UI snippet cards */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
            {/* Card 1: Nutrient overview bars */}
            <SlideIn from="right">
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">📊 &nbsp;Daily nutrients</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2.5">
                  {[
                    { name: "Protein", value: "82g", pct: 72, color: "#4ADE80" },
                    { name: "Calories", value: "2,640", pct: 85, color: "#4ADE80" },
                    { name: "Iron", value: "14mg", pct: 60, color: "#D4A853" },
                  ].map((n) => (
                    <div key={n.name} className="flex items-center gap-3">
                      <span className="text-xs text-fg-secondary w-16">{n.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-bg-page">
                        <div className="h-full rounded-full" style={{ width: `${n.pct}%`, background: n.color }} />
                      </div>
                      <span className="text-xs text-fg font-medium w-12 text-right">{n.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>

            {/* Card 2: Meal breakdown */}
            <SlideIn from="right" delay={0.1}>
              <div className="bg-bg-card rounded-2xl border border-green/20 p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-green">🍚 &nbsp;Carbs &middot; By meal</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2">
                  {[
                    { meal: "Lunch", value: "98g", pct: 52 },
                    { meal: "Late Dinner", value: "54g", pct: 29 },
                    { meal: "Breakfast", value: "36g", pct: 19 },
                  ].map((m) => (
                    <div key={m.meal} className="flex items-center gap-3">
                      <span className="text-xs text-fg-secondary w-20">{m.meal}</span>
                      <div className="flex-1 h-2 rounded-full bg-bg-page">
                        <div className="h-full rounded-full bg-green" style={{ width: `${m.pct}%` }} />
                      </div>
                      <span className="text-xs text-fg font-medium w-8 text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>

            {/* Card 3: Food breakdown */}
            <SlideIn from="right" delay={0.2}>
              <div className="bg-bg-card rounded-2xl border border-green/20 p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-green">🥩 &nbsp;Protein &middot; By food</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2.5">
                  {[
                    { food: "Lamb Shank", value: "48g", pct: 65 },
                    { food: "Eggs", value: "12g", pct: 16 },
                    { food: "Greek Yogurt", value: "10g", pct: 14 },
                    { food: "Bread", value: "4g", pct: 5 },
                  ].map((f) => (
                    <div key={f.food} className="flex items-center gap-3">
                      <span className="text-xs text-fg-secondary w-24">{f.food}</span>
                      <div className="flex-1 h-2 rounded-full bg-bg-page">
                        <div className="h-full rounded-full bg-green" style={{ width: `${f.pct}%` }} />
                      </div>
                      <span className="text-xs text-fg font-medium w-8 text-right">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Share Meals ───────────────────────── */

function ShareMeals() {
  return (
    <section className="py-24 md:py-32 bg-bg-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row-reverse items-start gap-12 md:gap-20 max-w-5xl mx-auto">
          {/* Right: headline */}
          <div className="flex-1 md:text-right">
            <FadeUp><SectionLabel color="#D946EF">Your Meals</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-[family-name:var(--font-sora)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-4 leading-[1.05]">
                Plan it.
                <br />
                Eat it.
                <br />
                <span style={{ color: "#D946EF" }}>Share it.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-fg-secondary text-base md:text-lg mt-6 leading-relaxed max-w-sm md:ml-auto">
                Build your meals in advance. Tick off as you go. Share stunning breakdowns anywhere.
              </p>
            </FadeUp>
          </div>

          {/* Right: UI snippet cards */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
            {/* Card 1: Meal plan checklist */}
            <SlideIn from="right">
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">📋 &nbsp;Lunch — planned</span>
                <div className="bg-bg-alt rounded-xl px-4 py-3 space-y-2.5">
                  {[
                    { food: "Chicken Breast", cal: "165", done: true },
                    { food: "Brown Rice", cal: "216", done: true },
                    { food: "Broccoli", cal: "55", done: false },
                    { food: "Greek Yogurt", cal: "100", done: false },
                  ].map((f) => (
                    <div key={f.food} className="flex items-center gap-3 text-xs">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${f.done ? "bg-pink/20 border-pink/40" : "border-edge"}`}>
                        {f.done && <span className="text-pink text-[10px]">✓</span>}
                      </span>
                      <span className={`flex-1 ${f.done ? "text-fg line-through opacity-60" : "text-fg"}`}>{f.food}</span>
                      <span className="text-fg-muted">{f.cal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>

            {/* Card 2: Meal sticker — glass effect over food image */}
            <SlideIn from="right" delay={0.1}>
              <div className="rounded-2xl overflow-hidden border border-pink/20 relative" style={{ background: "linear-gradient(135deg, #3a2a1a 0%, #2a1a0a 50%, #1a2a1a 100%)" }}>
                {/* Simulated food photo background */}
                <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at 60% 40%, #8B6914 0%, #2a1a0a 60%, #1a2a1a 100%)" }} />
                {/* Glass sticker overlay */}
                <div className="relative m-4 rounded-xl p-4 flex flex-col gap-2.5" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🍽️</span>
                      <span className="text-xs font-semibold text-white/90">Dinner</span>
                    </div>
                    <span className="text-[10px] text-white/50">🔥 536 kcal</span>
                  </div>
                  {/* Macro pills */}
                  <div className="flex gap-2">
                    {[
                      { label: "C", value: "42", color: "#FFCD34", pct: 35 },
                      { label: "F", value: "18", color: "#DF00FF", pct: 25 },
                      { label: "P", value: "52", color: "#47ACB1", pct: 55 },
                    ].map((m) => (
                      <div key={m.label} className="flex-1 rounded-lg py-1.5 px-2 text-center relative overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="absolute bottom-0 left-0 h-[3px] rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                        <span className="text-xs font-bold text-white/90">{m.value}</span>
                        <span className="text-[9px] text-white/40 ml-0.5">g</span>
                      </div>
                    ))}
                  </div>
                  {/* Food list with macro bars */}
                  <div className="space-y-1.5">
                    {[
                      { emoji: "🍗", name: "Chicken Breast", c: "#FFCD34", cw: 0, f: "#DF00FF", fw: 8, p: "#47ACB1", pw: 85 },
                      { emoji: "🍚", name: "Brown Rice", c: "#FFCD34", cw: 80, f: "#DF00FF", fw: 5, p: "#47ACB1", pw: 10 },
                      { emoji: "🥦", name: "Broccoli", c: "#FFCD34", cw: 60, f: "#DF00FF", fw: 5, p: "#47ACB1", pw: 30 },
                    ].map((f) => (
                      <div key={f.name} className="flex items-center gap-2">
                        <span className="text-[10px]">{f.emoji}</span>
                        <span className="text-[10px] text-white/60 flex-1">{f.name}</span>
                        <div className="flex h-[6px] w-16 rounded-full overflow-hidden">
                          <div style={{ width: `${f.cw}%`, background: f.c }} />
                          <div style={{ width: `${f.fw}%`, background: f.f }} />
                          <div style={{ width: `${f.pw}%`, background: f.p }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Card 3: Share targets */}
            <SlideIn from="right" delay={0.2}>
              <div className="bg-bg-card rounded-2xl border border-edge p-5 flex flex-col gap-3">
                <span className="text-sm font-semibold text-fg">📤 &nbsp;Share anywhere</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Instagram", icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg> },
                    { name: "Stories", icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" /><path d="M21.5 12a9.5 9.5 0 0 1-9.5 9.5" /><path d="M12 21.5A9.5 9.5 0 0 1 2.5 12" /><path d="M2.5 12A9.5 9.5 0 0 1 12 2.5" /><line x1="12" y1="9" x2="12" y2="15" /><line x1="9" y1="12" x2="15" y2="12" /></svg> },
                    { name: "Messages", icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 14a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9z" /></svg> },
                    { name: "Clipboard", icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> },
                  ].map((s) => (
                    <div key={s.name} className="bg-bg-alt rounded-xl px-3 py-3 flex flex-col items-center gap-2 border border-edge/50">
                      <span className="text-fg-muted">{s.icon}</span>
                      <span className="text-[11px] text-fg-secondary font-medium">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── How It Works ───────────────────────── */

const howItWorksCards: { emoji: string; title: string; color: string; borderColor: string; desc: string; href: string; snippet: React.ReactNode }[] = [
  {
    emoji: "📷", title: "Food Logging", color: "#60A5FA", borderColor: "#60A5FA20",
    desc: "Scan, search, or ask AI.",
    href: "/how-it-works/food-logging",
    snippet: (
      <div className="flex flex-col gap-1.5 mt-3">
        {[
          { icon: "📷", label: "Scan a label" },
          { icon: "🔍", label: "Search verified foods" },
          { icon: "⚡", label: "AI — photo, voice, or text" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs text-fg-secondary">
            <span>{s.icon}</span><span>{s.label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    emoji: "📊", title: "At a Glance", color: "#4ADE80", borderColor: "#4ADE8020",
    desc: "Every nutrient, one screen.",
    href: "/how-it-works/at-a-glance",
    snippet: (
      <div className="flex flex-col gap-2 mt-3">
        {[{ n: "Protein", w: "72%" }, { n: "Iron", w: "45%" }, { n: "Vit D", w: "60%" }].map((b) => (
          <div key={b.n} className="flex items-center gap-2">
            <span className="text-xs text-fg-muted w-12">{b.n}</span>
            <div className="flex-1 h-2 rounded-full bg-bg-page"><div className="h-full rounded-full bg-green" style={{ width: b.w }} /></div>
          </div>
        ))}
      </div>
    ),
  },
  {
    emoji: "🎯", title: "Smart Goals", color: "#7C3AED", borderColor: "#7C3AED20",
    desc: "Personalized ranges for every nutrient, from peer-reviewed research.",
    href: "/how-it-works/smart-targets",
    snippet: (
      <div className="flex flex-col gap-1.5 mt-3">
        {[
          { nutrient: "Protein", range: "82–120g" },
          { nutrient: "Iron", range: "8–18mg" },
          { nutrient: "Vit D", range: "15–50mcg" },
        ].map((s) => (
          <div key={s.nutrient} className="flex justify-between text-xs">
            <span className="text-fg-muted">{s.nutrient}</span>
            <span className="text-fg-secondary font-medium">{s.range}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    emoji: "🔥", title: "Calorie Intelligence", color: "#D946EF", borderColor: "#D946EF20",
    desc: "Derived from your real weight trend and food intake.",
    href: "/how-it-works/calorie-intelligence",
    snippet: (
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-fg-muted">
          <span>⚖️</span><span>7–14 day window of weight vs intake</span>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl font-bold text-fg font-[family-name:var(--font-sora)]">2,480</span>
            <span className="text-xs text-fg-muted ml-1">kcal/day</span>
          </div>
          <span className="text-[10px] text-fg-faint">auto-updated daily</span>
        </div>
      </div>
    ),
  },
  {
    emoji: "📉", title: "Dynamic Goals", color: "#D4A853", borderColor: "#D4A85320",
    desc: "Gradual adjustments and workout bonuses, applied daily.",
    href: "/how-it-works/dynamic-targets",
    snippet: (
      <div className="mt-3">
        <svg viewBox="0 0 200 40" className="w-full h-10" preserveAspectRatio="none">
          <path d="M0,4 C40,4 60,8 100,18 C140,28 170,36 200,38" fill="none" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="18" r="3.5" fill="#D4A853" />
        </svg>
        <div className="flex justify-between text-[10px] text-fg-muted mt-1">
          <span>300g</span>
          <span style={{ color: "#D4A853" }}>Today</span>
          <span>70g</span>
        </div>
      </div>
    ),
  },
  {
    emoji: "🍽️", title: "Meals & Sharing", color: "#D946EF", borderColor: "#D946EF20",
    desc: "Plan meals, tick off as you eat, share glass stickers.",
    href: "/how-it-works/share-meals",
    snippet: (
      <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white/80">🍽️ Dinner</span>
          <span className="text-[10px] text-white/40">536 kcal</span>
        </div>
        <div className="flex gap-1.5 mb-2">
          {[
            { v: "42", c: "#FFCD34" },
            { v: "18", c: "#DF00FF" },
            { v: "52", c: "#47ACB1" },
          ].map((m) => (
            <div key={m.c} className="flex-1 rounded py-0.5 text-center text-[10px] font-bold text-white/80 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="absolute bottom-0 left-0 h-[2px]" style={{ width: "60%", background: m.c }} />
              {m.v}
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 text-sm">
          <span>🍗</span><span>🍚</span><span>🥦</span>
        </div>
      </div>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <FadeUp><SectionLabel color="#7C3AED">How It Works</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight mt-4">Not just a tracker.<br />A <span style={{ color: "#7C3AED" }}>nutrition engine</span>.</h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-fg-secondary text-base md:text-lg mt-6 leading-relaxed">
              Built on published research, your real data, and algorithms that adapt as you do.
            </p>
          </FadeUp>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {howItWorksCards.map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.06}>
              <Link href={card.href} className="group flex flex-col bg-bg-card rounded-2xl p-6 border transition-all hover:border-opacity-40 hover:translate-y-[-2px] h-full min-h-[220px]" style={{ borderColor: card.borderColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.emoji}</span>
                  <h3 className="font-[family-name:var(--font-sora)] text-lg font-bold" style={{ color: card.color }}>{card.title}</h3>
                </div>
                <p className="text-fg-secondary text-sm mt-2">{card.desc}</p>
                <div className="flex-1">{card.snippet}</div>
                <div className="flex justify-end mt-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" style={{ background: `${card.color}15`, color: card.color }}>
                    &rarr;
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */

function FinalCTA() {
  return (
    <section id="download" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(124,58,237,0.1),_transparent_60%)]" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <FadeUp>
          <h2 className="font-[family-name:var(--font-sora)] text-4xl md:text-5xl font-bold tracking-tight">Ready to take control?</h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-fg-secondary text-lg mt-6 leading-relaxed">Join the beta and help shape the future of nutrition tracking.</p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <a href="https://testflight.apple.com/join/tWZZUg57" className="inline-block mt-8 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #7C3AED, #D946EF)" }}>Get the Beta on TestFlight</a>
        </FadeUp>
        <FadeUp delay={0.3}>
          <p className="text-fg-muted text-sm mt-4">Free beta via TestFlight &middot; iOS 26+ &middot; No account required</p>
        </FadeUp>
      </div>
    </section>
  );
}
