"use client";

import ArticleLayout, {
  Section,
  ArticleH2,
  Prose,
} from "@/components/article-layout";
import { ScaleIn, PhoneMockup } from "@/components/shared";

export default function AtAGlancePage() {
  return (
    <ArticleLayout
      breadcrumbLabel="At a Glance"
      breadcrumbColor="#4ADE80"
      sectionLabel="AT A GLANCE"
      accentColor="#4ADE80"
      gradientColor="#4ADE8010"
      title={"A dashboard designed to answer\nevery nutrition question instantly"}
      subtitle="Most nutrition dashboards show you a pie chart and a calorie number. NutriKit shows you where you stand on every nutrient, which meals moved the needle, which foods contributed most, and your full history — all without digging through menus."
      ctaText="See where you stand, instantly."
      ctaGradientColor="#4ADE8018"
      prev={{
        label: "Food Logging",
        href: "/how-it-works/food-logging",
        color: "#60A5FA",
      }}
      next={{
        label: "Share Your Meals",
        href: "/how-it-works/share-meals",
        color: "#D946EF",
      }}
    >
      <Section>
        <ArticleH2>Nutrient status at a glance</ArticleH2>
        <Prose>
          <p>
            The core of the dashboard is the nutrient status view. For every
            nutrient you track, you see a single bar showing:
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Your current intake for the day</li>
            <li>Your recommended range (lower and upper bounds)</li>
            <li>Whether you&apos;re below, within, or above the range</li>
            <li>
              If a taper is active, the taper-adjusted target for today
            </li>
          </ul>
          <p>
            The bars are color-coded: green when you&apos;re within range, amber
            when you&apos;re approaching the edges, red when you&apos;ve
            exceeded the upper limit. This visual language lets you scan 20+
            nutrients in seconds and know exactly where you stand.
          </p>
          <p>
            Nutrients are organized by category — macros, vitamins, minerals,
            fatty acids — so you can quickly focus on what matters to you. The
            dashboard also highlights any nutrients that have been consistently
            below range over the past week, surfacing patterns you might miss
            day-to-day.
          </p>
        </Prose>
      </Section>

      <ScaleIn className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <PhoneMockup
          src="/screenshots/protein-status.png"
          alt="Nutrient status dashboard"
          glow="glow-green"
          className="w-48 md:w-56"
        />
        <PhoneMockup
          src="/screenshots/protein-breakdown.png"
          alt="Meal and food breakdown"
          glow="glow-green"
          className="w-48 md:w-56"
        />
      </ScaleIn>

      <Section>
        <ArticleH2>Meal and food breakdown</ArticleH2>
        <Prose>
          <p>
            Tap any nutrient and NutriKit drills down to show you exactly where
            your intake came from:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-1">
            <li>
              <strong className="text-white">Meal breakdown</strong> — how much
              each meal (breakfast, lunch, dinner, snacks) contributed to the
              total. This answers &ldquo;why is my sodium so high today?&rdquo;
              instantly — oh, it was lunch.
            </li>
            <li>
              <strong className="text-white">Food breakdown</strong> — within
              each meal, which individual foods drove the numbers. If your
              protein is high, you can see it was the chicken at lunch and the
              Greek yogurt at breakfast — not an even spread.
            </li>
            <li>
              <strong className="text-white">Percentage contribution</strong> —
              each food shows what percentage of the day&apos;s total it
              represents, so you can identify your biggest dietary drivers at a
              glance.
            </li>
          </ul>
          <p>
            This drill-down works for every nutrient, not just macros. Want to
            know which foods contributed the most vitamin C today? Two taps.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>Your complete diary timeline</ArticleH2>
        <Prose>
          <p>
            NutriKit keeps your entire food diary — every day, every meal, every
            nutrient — and makes it all accessible from the timeline view. Scroll
            back to any date and see exactly what you ate, how it stacked up
            against your targets, and how your targets themselves may have
            changed over time (via tapers or recalculations).
          </p>
          <p>
            This isn&apos;t just a log — it&apos;s a longitudinal record of your
            nutrition. You can spot patterns across weeks and months: Are you
            consistently under on fiber? Does your protein drop on weekends? Is
            your sodium trending up since you started eating out more?
          </p>
          <p>
            The timeline also shows your weight data overlaid with your intake,
            making it easy to visually correlate dietary changes with body
            composition trends. This is particularly useful when running the
            energy balance algorithm — you can see the relationship between what
            you&apos;re eating and how your weight is responding.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>Designed for zero friction</ArticleH2>
        <Prose>
          <p>
            The dashboard is built on a principle: the most important information
            should require zero navigation. When you open NutriKit, you see
            today&apos;s status immediately. No loading screens, no tab
            switching, no buried menus.
          </p>
          <p>
            Every interaction follows a progressive disclosure pattern — summary
            first, detail on demand. The top level shows you where you stand. Tap
            to see which meals contributed. Tap again to see which foods within
            that meal. At no point do you need to remember where something is
            hidden.
          </p>
          <p>
            The interface adapts to what you care about. Nutrients you track
            frequently float to the top. Nutrients you&apos;ve never been out of
            range on stay collapsed. The dashboard learns your attention patterns
            and respects them.
          </p>
        </Prose>
      </Section>
    </ArticleLayout>
  );
}
