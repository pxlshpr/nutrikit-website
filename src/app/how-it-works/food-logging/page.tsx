"use client";

import ArticleLayout, {
  Section,
  ArticleH2,
  ArticleH3,
  Prose,
} from "@/components/article-layout";
import { ScaleIn, PhoneMockup } from "@/components/shared";

export default function FoodLoggingPage() {
  return (
    <ArticleLayout
      breadcrumbLabel="Food Logging"
      breadcrumbColor="#60A5FA"
      sectionLabel="FOOD LOGGING"
      accentColor="#60A5FA"
      gradientColor="#60A5FA10"
      title={"Three ways to log, each built\nfor a different moment"}
      subtitle="When accuracy matters, scan the label. When speed matters, let AI handle it. When you want verified data, search the USDA database. NutriKit gives you the right tool for every situation — and lets you review everything before it hits your diary."
      ctaText="Log smarter, not harder."
      ctaGradientColor="#60A5FA18"
      prev={{
        label: "Calorie Intelligence",
        href: "/how-it-works/calorie-intelligence",
        color: "#D946EF",
      }}
      next={{
        label: "At a Glance",
        href: "/how-it-works/at-a-glance",
        color: "#4ADE80",
      }}
    >
      <Section>
        <ArticleH2>The Nutrition Label Scanner</ArticleH2>
        <Prose>
          <p>
            Point your camera at any nutrition facts panel and NutriKit extracts
            every value — calories, all macros, every micronutrient listed. But
            unlike most scanner apps, it doesn&apos;t just dump the numbers into
            your diary. It shows you exactly what it read, so you can verify and
            correct before saving.
          </p>
          <p>
            This matters because OCR isn&apos;t perfect. Glare, curved surfaces,
            small print, and unusual label layouts can all cause misreads.
            NutriKit&apos;s review step catches these errors before they corrupt
            your data.
          </p>
          <p>
            The scanner also works on the front of packages — the marketing
            panel with claims like &ldquo;12g protein&rdquo; or &ldquo;130
            calories.&rdquo; Point at that and NutriKit creates a partial food
            entry with whatever values are visible, which you can then complete
            manually or by scanning the back label.
          </p>
        </Prose>
      </Section>

      <ScaleIn className="flex justify-center">
        <PhoneMockup
          src="/screenshots/label-scanner.png"
          alt="Nutrition label scanner"
          glow="glow-blue"
          className="w-56 md:w-64"
        />
      </ScaleIn>

      <Section>
        <ArticleH3 color="#60A5FA">What the scanner captures</ArticleH3>
        <Prose>
          <p>
            From a standard US nutrition facts label, the scanner reads:
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Serving size and servings per container</li>
            <li>Calories</li>
            <li>Total fat, saturated fat, trans fat</li>
            <li>Cholesterol, sodium</li>
            <li>
              Total carbohydrate, dietary fiber, total sugars, added sugars
            </li>
            <li>Protein</li>
            <li>Vitamin D, calcium, iron, potassium</li>
            <li>Any additional vitamins or minerals listed</li>
          </ul>
          <p>
            All values are captured per serving. When you log the food, you
            specify how many servings you had, and NutriKit scales everything
            proportionally.
          </p>
          <p>
            The scanner uses on-device vision processing — your label images are
            never uploaded to a server. Privacy is preserved by default.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>The USDA Verified Database</ArticleH2>
        <Prose>
          <p>
            Most nutrition apps rely on user-submitted food databases. The
            problem? Users make mistakes. They round numbers, skip
            micronutrients, and create duplicate entries with conflicting data.
            Over time, the database becomes unreliable.
          </p>
          <p>
            NutriKit includes the USDA FoodData Central database — thousands of
            foods with laboratory-tested nutritional profiles. These aren&apos;t
            user-submitted approximations. They&apos;re measured values from
            analytical chemistry, covering a comprehensive nutrient profile per
            food.
          </p>
          <p>
            When you search for a food in NutriKit, USDA-verified results are
            clearly marked. You can trust that &ldquo;chicken breast,
            roasted&rdquo; has accurate protein, fat, B-vitamin, and mineral
            values — because they were measured in a lab, not typed in by a
            random user.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#60A5FA">Why lab-tested data matters</ArticleH3>
        <Prose>
          <p>
            Consider vitamin K. Most user-submitted databases don&apos;t include
            it at all. But the USDA database measures it for thousands of foods.
            If you&apos;re on blood thinners and need to monitor vitamin K
            intake, user-submitted data is useless — you need verified values.
          </p>
          <p>
            The same applies to minerals like selenium, manganese, and
            phosphorus. To micronutrients like folate, choline, and vitamin E. To
            fatty acid breakdowns (saturated vs. mono vs. poly). The USDA
            database captures all of these. User databases typically capture only
            calories and the big three macros.
          </p>
          <p>
            NutriKit makes the full nutrient profile available and trackable —
            not just the headline numbers.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>AI Quick Log</ArticleH2>
        <Prose>
          <p>
            Sometimes you just need to log fast. You&apos;re at a restaurant,
            you&apos;re eating at a friend&apos;s house, or you just don&apos;t
            have a label to scan. AI Quick Log handles these moments.
          </p>
          <p>You can input your meal three ways:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              <strong className="text-fg">Photo</strong> — take a picture of
              your plate and AI identifies the foods, estimates portions, and
              calculates macros
            </li>
            <li>
              <strong className="text-fg">Voice</strong> — say &ldquo;I had a
              grilled chicken salad with ranch dressing and a bread roll&rdquo;
              and AI parses it into individual food items with estimated
              quantities
            </li>
            <li>
              <strong className="text-fg">Text</strong> — type a quick
              description and get the same AI parsing
            </li>
          </ul>
          <p>
            In every case, AI returns a structured list of detected items, each
            with estimated calories, protein, carbs, and fat. But here&apos;s
            the critical difference from other AI logging apps: you review
            everything before it&apos;s saved.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH3 color="#60A5FA">
          The review-before-saving philosophy
        </ArticleH3>
        <Prose>
          <p>
            AI estimation is fast but imperfect. Portion sizes are guessed.
            Similar-looking foods can be confused. A &ldquo;grilled chicken
            breast&rdquo; might be 4oz or 8oz — the AI can&apos;t weigh it for
            you.
          </p>
          <p>
            That&apos;s why NutriKit always shows you what AI detected and lets
            you:
          </p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Edit any item&apos;s quantity or nutritional values</li>
            <li>
              Replace a detected item with a different food from the database
            </li>
            <li>Remove items that were incorrectly detected</li>
            <li>Re-run the AI with a different prompt if the result was off</li>
            <li>Add items that were missed</li>
          </ul>
          <p>
            This gives you the speed of AI with the accuracy of manual review.
            It&apos;s a fundamentally different approach from apps that auto-log
            AI results and silently accumulate errors in your diary.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>Accuracy hierarchy</ArticleH2>
        <Prose>
          <p>
            NutriKit&apos;s logging methods form an accuracy spectrum:
          </p>
          <ol className="list-decimal list-inside space-y-3 ml-1">
            <li>
              <strong className="text-fg">Label scanner</strong> — highest
              accuracy. You&apos;re reading the manufacturer&apos;s own declared
              values. Short of sending food to a lab, this is as precise as
              consumer nutrition data gets.
            </li>
            <li>
              <strong className="text-fg">USDA database</strong> — high
              accuracy. Lab-tested values for generic food items. Excellent for
              whole foods, produce, meats, and staples.
            </li>
            <li>
              <strong className="text-fg">AI Quick Log</strong> — moderate
              accuracy. Good for quick estimates and hard-to-measure meals, but
              inherently imprecise for portion sizes.
            </li>
          </ol>
          <p>
            NutriKit is opinionated about this hierarchy. When precision matters
            — tracking micronutrients, maintaining a strict deficit, or
            monitoring specific nutrients for medical reasons — it nudges you
            toward the scanner and database. When you just need to capture a meal
            before you forget it, AI is there.
          </p>
          <p>
            The goal is to make accurate logging easy, and fast logging available
            — without pretending they&apos;re the same thing.
          </p>
        </Prose>
      </Section>
    </ArticleLayout>
  );
}
