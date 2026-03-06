"use client";

import ArticleLayout, {
  Section,
  ArticleH2,
  ArticleH3,
  Prose,
} from "@/components/article-layout";
import { ScaleIn, PhoneMockup, ScrollingPhoneMockup } from "@/components/shared";

export default function CalorieIntelligencePage() {
  return (
    <ArticleLayout
      breadcrumbLabel="Calorie Intelligence"
      breadcrumbColor="#D946EF"
      sectionLabel="CALORIE INTELLIGENCE"
      accentColor="#D946EF"
      gradientColor="#D946EF10"
      title={"How NutriKit finds your\nperfect calorie target"}
      subtitle="Your calorie target shouldn't be a guess. NutriKit uses a hierarchy of methods — from real-time energy balance to Apple Health data to validated BMR equations — automatically selecting the most accurate one available for your situation."
      ctaText="Smarter calories, automatically."
      ctaGradientColor="#D946EF18"
      prev={{
        label: "Dynamic Targets",
        href: "/how-it-works/dynamic-targets",
        color: "#D4A853",
      }}
      next={{
        label: "Food Logging",
        href: "/how-it-works/food-logging",
        color: "#60A5FA",
      }}
    >
      <Section>
        <ArticleH2>The method hierarchy</ArticleH2>
        <Prose>
          <p>
            NutriKit doesn&apos;t use one formula for everyone. It evaluates what
            data is available and selects the most accurate method it can. The
            hierarchy, from most to least accurate:
          </p>
        </Prose>
      </Section>

      {/* Hierarchy diagram */}
      <div className="space-y-0">
        <div className="bg-[#7C3AED20] border border-[#7C3AED40] rounded-t-2xl px-6 py-5 flex items-center gap-4">
          <span className="text-2xl font-bold text-purple font-[family-name:var(--font-sora)]">
            1
          </span>
          <div>
            <p className="font-semibold text-white">Energy Balance</p>
            <p className="text-gray-400 text-sm">
              Weight trends + food intake = real TDEE
            </p>
          </div>
        </div>
        <div className="bg-[#D946EF15] border-x border-[#D946EF30] px-6 py-5 flex items-center gap-4">
          <span className="text-2xl font-bold text-pink font-[family-name:var(--font-sora)]">
            2
          </span>
          <div>
            <p className="font-semibold text-white">Apple Health Energy</p>
            <p className="text-gray-400 text-sm">
              Resting + active energy from your device
            </p>
          </div>
        </div>
        <div className="bg-[#D4A85310] border border-[#D4A85325] rounded-b-2xl px-6 py-5 flex items-center gap-4">
          <span className="text-2xl font-bold text-gold font-[family-name:var(--font-sora)]">
            3
          </span>
          <div>
            <p className="font-semibold text-white">BMR Formulas</p>
            <p className="text-gray-400 text-sm">
              Katch-McArdle, Mifflin-St Jeor, or Schofield
            </p>
          </div>
        </div>
      </div>

      <Section>
        <ArticleH2>Method 1: Energy Balance</ArticleH2>
        <Prose>
          <p>
            This is the gold standard — and it&apos;s what sets NutriKit apart
            from apps that just plug your height and weight into a formula.
          </p>
          <p>
            Energy balance works on a simple thermodynamic principle: if
            you&apos;re losing weight, you&apos;re eating fewer calories than you
            burn. If you&apos;re gaining weight, you&apos;re eating more. By
            tracking both your food intake and your weight over time, NutriKit
            can calculate your actual total daily energy expenditure (TDEE) — not
            an estimate, but what your body is really doing.
          </p>
          <p>
            The algorithm uses a weighted moving average of your weight to smooth
            out daily fluctuations from water, sodium, and digestion. It then
            compares the caloric surplus or deficit implied by your weight trend
            against your logged intake to derive your expenditure.
          </p>
          <p>
            This method requires at least 2 weeks of consistent logging and
            weight data to produce reliable results. Once it kicks in, it&apos;s
            continuously refined as more data comes in — your TDEE estimate gets
            more accurate over time, not less.
          </p>
        </Prose>
      </Section>

      {/* Screenshots */}
      <ScaleIn className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <PhoneMockup
          src="/screenshots/energy-balance-config.png"
          alt="Energy balance configuration"
          glow="glow-pink"
          className="w-48 md:w-56"
        />
        <ScrollingPhoneMockup
          src="/screenshots/maintenance-calc.jpg"
          alt="Maintenance calorie calculation"
          glow="glow-pink"
          className="w-48 md:w-56"
          scrollDuration={10}
        />
      </ScaleIn>

      <Section>
        <ArticleH2>Method 2: Apple Health Energy</ArticleH2>
        <Prose>
          <p>
            If you don&apos;t have enough logging history for energy balance, but
            you wear an Apple Watch or use a device that writes energy data to
            Apple Health, NutriKit can use that instead.
          </p>
          <p>It reads two values:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              Resting energy (basal metabolic rate as measured/estimated by your
              device)
            </li>
            <li>
              Active energy (calories burned through movement and exercise)
            </li>
          </ul>
          <p>
            The sum gives your total expenditure for the day. This is less
            accurate than the energy balance method — device estimates have known
            error margins — but it&apos;s significantly better than a generic
            formula, because it accounts for your actual daily activity rather
            than a self-reported &ldquo;activity level&rdquo; dropdown.
          </p>
          <p>
            NutriKit uses a 7-day rolling average of Apple Health energy data to
            smooth out day-to-day variation.
          </p>
        </Prose>
      </Section>

      <ScaleIn className="flex justify-center">
        <ScrollingPhoneMockup
          src="/screenshots/maintenance-health.jpg"
          alt="Apple Health integration"
          glow="glow-pink"
          className="w-48 md:w-56"
          scrollDuration={11}
        />
      </ScaleIn>

      <Section>
        <ArticleH2>Method 3: BMR Formulas</ArticleH2>
        <Prose>
          <p>
            When neither energy balance data nor Apple Health energy is
            available, NutriKit falls back to validated BMR equations. But it
            doesn&apos;t just use one — it selects the best formula for your
            profile:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-1">
            <li>
              <strong className="text-white">Katch-McArdle</strong> — used when
              lean body mass is available. This is the most accurate formula for
              people who know their body composition, because it bases the
              calculation on metabolically active tissue rather than total weight.
            </li>
            <li>
              <strong className="text-white">Mifflin-St Jeor</strong> — used
              when only height, weight, age, and sex are available. Widely
              validated and considered the most accurate general-purpose BMR
              equation in the research literature.
            </li>
            <li>
              <strong className="text-white">Schofield</strong> — used as a
              fallback for populations where Mifflin-St Jeor may be less
              validated (e.g., certain age ranges or when height is unavailable).
            </li>
          </ul>
          <p>
            The BMR is then multiplied by an activity factor you select — from
            sedentary to very active — to estimate your TDEE. This is the least
            precise method, but it gives a reasonable starting point until better
            data accumulates.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>Goal adjustment</ArticleH2>
        <Prose>
          <p>
            Once NutriKit has your maintenance calories (from whichever method),
            it applies your goal:
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              <strong className="text-white">Lose weight</strong> — a caloric
              deficit is subtracted from your TDEE
            </li>
            <li>
              <strong className="text-white">Maintain</strong> — your target
              equals your TDEE
            </li>
            <li>
              <strong className="text-white">Gain weight</strong> — a caloric
              surplus is added to your TDEE
            </li>
          </ul>
          <p>
            The size of the deficit or surplus is controlled by a slider from
            mild to aggressive. A mild deficit might be 250 kcal/day (~0.5
            lb/week loss), while an aggressive deficit might be 750 kcal/day
            (~1.5 lb/week loss). The same range applies to surplus for gaining.
          </p>
          <p>
            Critically, NutriKit won&apos;t let you set a target below safe
            minimums. There&apos;s a floor based on your body weight and sex —
            the app will warn you and cap the deficit if your resulting calorie
            target would be dangerously low.
          </p>
        </Prose>
      </Section>
    </ArticleLayout>
  );
}
