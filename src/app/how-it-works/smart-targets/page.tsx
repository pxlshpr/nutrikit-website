"use client";

import ArticleLayout, {
  Section,
  ArticleH2,
  ArticleH3,
  Prose,
} from "@/components/article-layout";
import { ScaleIn, PhoneMockup, ScrollingPhoneMockup } from "@/components/shared";

export default function SmartTargetsPage() {
  return (
    <ArticleLayout
      breadcrumbLabel="Smart Targets"
      breadcrumbColor="#7C3AED"
      sectionLabel="SMART TARGETS"
      accentColor="#7C3AED"
      gradientColor="#7C3AED10"
      title={"How NutriKit builds personalized\nnutrient targets for your body"}
      subtitle="Most nutrition apps give you the same targets as everyone else. NutriKit calculates individual recommended ranges for every nutrient — drawing from peer-reviewed research papers and institutional guidelines — based on who you actually are."
      ctaText="See your targets in action."
      ctaGradientColor="#7C3AED18"
      next={{
        label: "Dynamic Targets",
        href: "/how-it-works/dynamic-targets",
        color: "#D4A853",
        subtitle: "Tapers, workout bonuses, and targets that move with you",
      }}
    >
      <Section>
        <ArticleH2>The problem with generic targets</ArticleH2>
        <Prose>
          <p>
            Most nutrition apps use a single set of recommended daily values —
            the same ones printed on food labels. These are based on a
            2,000-calorie diet for a generic adult. They don&apos;t account for
            your age, sex, body weight, lean mass, activity level, or whether
            you&apos;re pregnant or breastfeeding.
          </p>
          <p>
            The result? A 22-year-old female athlete and a 55-year-old sedentary
            male get the same protein target, the same iron target, the same
            vitamin D target. That&apos;s not personalization — it&apos;s a
            lookup table.
          </p>
          <p>
            NutriKit takes a fundamentally different approach. Instead of one
            fixed number per nutrient, it calculates a recommended range — a
            lower bound and an upper bound — using the best available evidence
            for your specific profile. And every recommendation shows its source,
            so you always know where the numbers come from.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>How your targets are calculated</ArticleH2>
        <Prose>
          <p>
            When you set up NutriKit, you provide your biological sex, date of
            birth, body weight, and optionally your body fat percentage or lean
            body mass. If you&apos;re pregnant or breastfeeding, that&apos;s
            captured too.
          </p>
          <p>
            From these inputs, NutriKit calculates personalized targets for
            every tracked nutrient. The calculation isn&apos;t a simple formula —
            it&apos;s a decision tree that selects the right recommendation
            source for each nutrient based on your profile.
          </p>
        </Prose>
      </Section>

      {/* Screenshots */}
      <ScaleIn className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <ScrollingPhoneMockup
          src="/screenshots/reco-picker.jpg"
          alt="Nutrient recommendation picker"
          glow="glow-purple"
          className="w-48 md:w-56"
          scrollDuration={12}
        />
        <PhoneMockup
          src="/screenshots/protein-reco.png"
          alt="Personalized protein recommendation"
          glow="glow-purple"
          className="w-48 md:w-56"
        />
      </ScaleIn>

      <Section>
        <ArticleH2>The scientific sources</ArticleH2>
        <Prose>
          <p>
            NutriKit doesn&apos;t rely on a single recommendation framework.
            Different nutrients have different best sources. For some, the
            Institute of Medicine&apos;s Dietary Reference Intakes (DRIs) are
            the gold standard. For others, the World Health Organization, the
            European Food Safety Authority, or recent meta-analyses provide
            better, more current guidance.
          </p>
          <p>
            Every recommendation in NutriKit cites its source — so you can
            verify exactly where your targets come from.
          </p>
          <p>
            Here&apos;s how the source selection works for key nutrient
            categories:
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#7C3AED">Protein</ArticleH3>
        <Prose>
          <p>
            The generic RDA for protein is 0.8 g/kg — a value established to
            prevent deficiency, not to optimize health or body composition.
            NutriKit uses a more nuanced approach:
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              Base recommendation scales with body weight (not a flat number)
            </li>
            <li>
              If lean body mass is available, the calculation uses that instead —
              giving more accurate targets for people with higher or lower body
              fat
            </li>
            <li>
              Age-adjusted: adults over 65 get a higher per-kg recommendation
              based on research showing increased protein needs in aging
              populations
            </li>
            <li>
              Pregnancy and breastfeeding adjustments are additive on top of the
              base calculation
            </li>
            <li>
              The upper bound is informed by the literature on the maximum
              beneficial intake — beyond which additional protein shows
              diminishing returns
            </li>
          </ul>
          <p>
            The result is a range like 95–155g rather than a single
            &ldquo;46g&rdquo; that ignores your weight entirely.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#7C3AED">Vitamins &amp; Minerals</ArticleH3>
        <Prose>
          <p>
            For micronutrients — vitamins A, C, D, E, K, and the B-complex, plus
            minerals like iron, calcium, zinc, magnesium, and potassium —
            NutriKit pulls from the IOM Dietary Reference Intakes,
            cross-referenced with EFSA and WHO guidelines where they diverge.
          </p>
          <p>Each micronutrient target is adjusted for:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              Age bracket (the DRIs define different values for 19–30, 31–50,
              51–70, and 70+)
            </li>
            <li>
              Sex (iron requirements differ dramatically between males and
              pre/post-menopausal females)
            </li>
            <li>Pregnancy trimester and lactation status</li>
            <li>
              Tolerable Upper Intake Levels (ULs) form the upper bound — these
              are the amounts above which adverse effects become more likely
            </li>
          </ul>
          <p>
            For nutrients where the science is evolving — like vitamin D, where
            many researchers argue the current RDA of 600 IU is too low —
            NutriKit&apos;s range reflects the broader evidence base, not just
            the most conservative guideline.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#7C3AED">Fats &amp; Fatty Acids</ArticleH3>
        <Prose>
          <p>
            Total fat, saturated fat, monounsaturated fat, polyunsaturated fat,
            omega-3, and omega-6 all get separate targets.
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              Total fat range is calculated as a percentage of your calorie
              target (typically 20–35% of calories), converted to grams
            </li>
            <li>
              Saturated fat upper bound follows the American Heart Association
              guideline of &lt;10% of calories
            </li>
            <li>
              Omega-3 (ALA, EPA, DHA) targets use the IOM Adequate Intake plus
              supplemental guidance from the AHA for cardiovascular benefit
            </li>
            <li>
              The balance between omega-6 and omega-3 is considered — NutriKit
              flags when your ratio is heavily skewed
            </li>
          </ul>
          <p>
            Because fat targets depend on your calorie target, they
            automatically update when your calories change — whether from a
            manual adjustment, a taper, or a recalculation from the energy
            balance algorithm.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#7C3AED">Carbohydrates &amp; Fiber</ArticleH3>
        <Prose>
          <p>
            Carbohydrate targets are derived from your calorie and fat/protein
            targets — they fill the remaining caloric budget. This means carb
            targets are always internally consistent with your other macros.
          </p>
          <p>
            Fiber gets its own independent target based on the IOM Adequate
            Intake: 14g per 1,000 calories consumed, with age and sex
            adjustments. Added sugar has an upper bound based on WHO and AHA
            guidelines (typically &lt;10% of calories, with a stricter &lt;6%
            option available).
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>Why ranges, not single numbers</ArticleH2>
        <Prose>
          <p>
            A single target number creates a pass/fail dynamic. You either hit
            it or you didn&apos;t. This leads to unnecessary stress and
            doesn&apos;t reflect nutritional reality — your body doesn&apos;t
            have a cliff at exactly 46g of protein.
          </p>
          <p>
            Ranges are more honest. The lower bound represents the minimum for
            preventing deficiency and supporting basic function. The upper bound
            represents either the point of diminishing returns or the tolerable
            upper limit.
          </p>
          <p>
            Anywhere within the range is good. NutriKit&apos;s dashboard shows
            your intake as a position within this range — green when you&apos;re
            inside it, with clear visual feedback when you&apos;re below or
            above.
          </p>
        </Prose>
      </Section>

      <ScaleIn className="flex justify-center">
        <PhoneMockup
          src="/screenshots/calorie-reco.png"
          alt="Nutrient recommendation with range"
          glow="glow-purple"
          className="w-56 md:w-64"
        />
      </ScaleIn>

      <Section>
        <ArticleH2>Full control when you want it</ArticleH2>
        <Prose>
          <p>
            Smart Targets are the default — but you&apos;re never locked in.
            Every nutrient target can be manually overridden. Set a custom lower
            bound, upper bound, or both. Your override persists until you clear
            it, at which point the calculated value returns.
          </p>
          <p>
            This is useful for athletes following specific macro protocols,
            people with medical dietary restrictions, or anyone who&apos;s
            received guidance from a dietitian that differs from the general
            population recommendations.
          </p>
          <p>
            When you override a target, NutriKit shows it with a distinct
            indicator so you always know which targets are calculated and which
            are custom.
          </p>
        </Prose>
      </Section>
    </ArticleLayout>
  );
}
