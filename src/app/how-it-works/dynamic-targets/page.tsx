"use client";

import ArticleLayout, {
  Section,
  ArticleH2,
  ArticleH3,
  Prose,
} from "@/components/article-layout";
import { ScaleIn, PhoneMockup, ScrollingPhoneMockup } from "@/components/shared";

export default function DynamicTargetsPage() {
  return (
    <ArticleLayout
      breadcrumbLabel="Dynamic Targets"
      breadcrumbColor="#D4A853"
      sectionLabel="DYNAMIC TARGETS"
      accentColor="#D4A853"
      gradientColor="#D4A85310"
      title={"Targets that move with you —\ntapers, bonuses, and daily adaptation"}
      subtitle="Static targets assume your life never changes. NutriKit's targets can taper over time, respond to your workouts, and adjust day by day — so your nutrition plan keeps pace with your actual goals."
      ctaText="Nutrition that adapts with you."
      ctaGradientColor="#D4A85318"
      prev={{
        label: "Smart Targets",
        href: "/how-it-works/smart-targets",
        color: "#7C3AED",
      }}
      next={{
        label: "Calorie Intelligence",
        href: "/how-it-works/calorie-intelligence",
        color: "#D946EF",
      }}
    >
      <Section>
        <ArticleH2>Tapered Targets</ArticleH2>
        <Prose>
          <p>
            A taper lets you smoothly transition any nutrient target from one
            value to another over a period of time. Instead of abruptly switching
            from 250g carbs to 150g carbs, you define a start value, an end
            value, and a duration — and NutriKit interpolates your daily target
            across that window.
          </p>
          <p>
            This is how competitive athletes periodize their nutrition. It&apos;s
            how people gradually reduce calories during a cut. And it&apos;s how
            you can slowly increase protein intake without shocking your
            digestive system or your grocery budget.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#D4A853">Setting up a taper</ArticleH3>
        <Prose>
          <p>For any nutrient, you can create a taper by specifying:</p>
          <ol className="list-decimal list-inside space-y-1.5 ml-1">
            <li>
              Start value — where you are now (or any custom starting point)
            </li>
            <li>End value — where you want to be</li>
            <li>Start date — when the taper begins (defaults to today)</li>
            <li>Duration — how many days the taper runs</li>
            <li>
              Curve shape — how the interpolation behaves between start and end
            </li>
          </ol>
          <p>
            Once active, your daily target is automatically calculated based on
            where you are in the taper timeline. You don&apos;t have to think
            about it — just log your food and NutriKit tells you today&apos;s
            number.
          </p>
        </Prose>
      </Section>

      {/* Screenshots */}
      <ScaleIn className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <ScrollingPhoneMockup
          src="/screenshots/taper-setup.jpg"
          alt="Taper setup with curve preview"
          glow="glow-gold"
          className="w-48 md:w-56"
          scrollDuration={14}
        />
        <PhoneMockup
          src="/screenshots/protein-status.png"
          alt="Active taper tracking"
          glow="glow-gold"
          className="w-48 md:w-56"
        />
      </ScaleIn>

      <Section>
        <ArticleH3 color="#D4A853">Curve shapes explained</ArticleH3>
        <Prose>
          <p>
            The curve shape determines how the interpolation progresses between
            your start and end values. NutriKit offers four options:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-1">
            <li>
              <strong className="text-white">Linear</strong> — a straight line
              from start to end. Equal change every day. Simple and predictable.
              Best for moderate tapers where you don&apos;t need front-loading or
              back-loading.
            </li>
            <li>
              <strong className="text-white">Stepped</strong> — the taper
              divides into equal-length steps (e.g., weekly blocks). Your target
              drops at the start of each step and stays flat within it. This
              mimics how many coaches program nutrition phases.
            </li>
            <li>
              <strong className="text-white">Ease-in</strong> — changes slowly
              at first, then accelerates toward the end. Useful when you want to
              ease into a taper gently.
            </li>
            <li>
              <strong className="text-white">Ease-out</strong> — changes quickly
              at first, then decelerates. Useful when you want to make the big
              move early and fine-tune toward the end.
            </li>
          </ul>
          <p>
            All four curves arrive at the same end value on the same date. The
            difference is the path taken.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#D4A853">Managing active tapers</ArticleH3>
        <Prose>
          <p>
            Once a taper is running, you&apos;re not locked in. You can:
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              <strong className="text-white">Pause the taper</strong> — freezes
              your current interpolated value. The taper resumes from where it
              left off when you unpause.
            </li>
            <li>
              <strong className="text-white">
                Adjust the end value or duration mid-taper
              </strong>{" "}
              — the remaining days recalculate smoothly from today&apos;s value
              to the new end.
            </li>
            <li>
              <strong className="text-white">Override a single day</strong> — if
              you need a different target for just today, you can set a manual
              override without disrupting the taper.
            </li>
            <li>
              <strong className="text-white">Cancel the taper</strong> — your
              target reverts to whatever it would be without the taper.
            </li>
          </ul>
          <p>
            Multiple nutrients can have independent tapers running
            simultaneously. You might taper carbs down over 6 weeks while
            simultaneously tapering protein up over 4 weeks.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>Workout Bonuses</ArticleH2>
        <Prose>
          <p>
            On days you exercise, your nutritional needs change. You burn more
            energy, you break down more muscle protein, and you deplete more
            glycogen. NutriKit&apos;s workout bonuses let your targets respond to
            this automatically.
          </p>
          <p>
            When Apple Health reports active energy burned from a workout,
            NutriKit can increase your protein and carbohydrate targets for that
            day. The bonus is applied in real time — as your workout data syncs,
            your targets update.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#D4A853">Adaptive vs. fixed bonuses</ArticleH3>
        <Prose>
          <p>NutriKit offers two bonus modes:</p>
          <p>
            <strong className="text-white">Adaptive bonuses</strong> scale with
            how much you burned. You configure a bonus per 100 kcal of active
            energy. For example, +5g protein per 100 kcal burned means a 400
            kcal workout adds 20g to your protein target. A 200 kcal workout
            adds 10g. The bonus is proportional to the effort.
          </p>
          <p>
            <strong className="text-white">Fixed bonuses</strong> add a flat
            amount regardless of workout intensity. If you set +30g carbs as a
            fixed bonus, any workout day gets +30g — whether you did a 20-minute
            walk or a 90-minute lifting session.
          </p>
          <p>
            Adaptive is better for people with variable workout intensities.
            Fixed is simpler and works well when your workouts are consistent.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#D4A853">Eating windows around workouts</ArticleH3>
        <Prose>
          <p>
            Workout bonuses can be configured with an optional eating window.
            This means the bonus only applies to meals logged within a certain
            time range around your workout — for example, 1 hour before to 3
            hours after.
          </p>
          <p>
            This supports peri-workout nutrition strategies where you want to
            concentrate extra protein and carbs around training, rather than
            spreading the bonus across the whole day. If no eating window is set,
            the bonus applies to your full-day target.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>How it all stacks together</ArticleH2>
        <Prose>
          <p>
            Tapers and workout bonuses aren&apos;t mutually exclusive — they
            compose. Here&apos;s the order of operations for any given nutrient
            on any given day:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 ml-1">
            <li>
              Start with the base target — either the Smart Target (calculated
              from your profile) or a manual override
            </li>
            <li>
              If a taper is active, the base target is replaced by the
              interpolated taper value for today
            </li>
            <li>
              If a workout bonus is configured and you&apos;ve burned active
              energy today, the bonus is added on top
            </li>
          </ol>
          <p>
            This means you can run a 6-week carb taper from 300g to 200g, and on
            workout days within that taper, your carbs still get a bump. The
            system is composable by design.
          </p>
        </Prose>
      </Section>
    </ArticleLayout>
  );
}
