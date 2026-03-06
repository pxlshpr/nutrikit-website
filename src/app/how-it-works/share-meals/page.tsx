"use client";

import ArticleLayout, {
  Section,
  ArticleH2,
  Prose,
} from "@/components/article-layout";
import { ScaleIn, PhoneMockup } from "@/components/shared";

export default function ShareMealsPage() {
  return (
    <ArticleLayout
      breadcrumbLabel="Share Your Meals"
      breadcrumbColor="#D946EF"
      sectionLabel="SHARE YOUR MEALS"
      accentColor="#D946EF"
      gradientColor="#D946EF10"
      title={"Liquid glass stickers that make\nyour nutrition look beautiful"}
      subtitle="NutriKit generates stunning translucent stickers showing your meal or daily nutrition breakdown — calories, macros, and foods with emoji. Place them on your photos or videos and share anywhere."
      ctaText="Share meals that look as good as they taste."
      ctaGradientColor="#D946EF18"
      prev={{
        label: "At a Glance",
        href: "/how-it-works/at-a-glance",
        color: "#4ADE80",
      }}
    >
      <Section>
        <ArticleH2>What are meal stickers?</ArticleH2>
        <Prose>
          <p>
            Meal stickers are translucent, glass-effect overlays that display
            your nutrition data in a visually striking format. They&apos;re
            designed to look beautiful on top of food photos — like a premium UI
            widget floating over your meal.
          </p>
          <p>Each sticker shows:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Total calories for the meal (or the full day)</li>
            <li>Macro breakdown — protein, carbs, and fat in grams</li>
            <li>A list of foods you ate, each with an auto-assigned emoji</li>
            <li>The meal name and date</li>
          </ul>
          <p>
            The glass effect uses blur and transparency to blend naturally with
            whatever photo or background it&apos;s placed on. It&apos;s not a
            flat graphic pasted on top — it genuinely looks like a frosted glass
            panel hovering over your content.
          </p>
        </Prose>
      </Section>

      <ScaleIn className="flex justify-center">
        <PhoneMockup
          src="/screenshots/meal-sticker.png"
          alt="Meal sticker with liquid glass effect"
          glow="glow-pink"
          className="w-56 md:w-64"
        />
      </ScaleIn>

      <Section>
        <ArticleH2>Sticker types</ArticleH2>
        <Prose>
          <p>NutriKit offers two sticker modes:</p>
          <p>
            <strong className="text-white">Meal stickers</strong> show data for
            a single meal — what you ate at lunch, for example. These are perfect
            for Instagram stories or messages to friends showing what you had.
          </p>
          <p>
            <strong className="text-white">Daily stickers</strong> show your
            full-day nutrition summary — all meals combined, total macros, and a
            complete food list. These work well for end-of-day recaps and
            accountability posts.
          </p>
          <p>
            Both types are generated instantly from your diary data. There&apos;s
            nothing to configure or design — NutriKit composes the sticker
            automatically from what you&apos;ve already logged.
          </p>
        </Prose>
      </Section>

      <Section>
        <ArticleH2>Sharing and placement</ArticleH2>
        <Prose>
          <p>Once generated, stickers can be:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              <strong className="text-white">
                Placed on a photo from your camera roll
              </strong>{" "}
              — drag and resize the sticker over your food photo, then export the
              combined image
            </li>
            <li>
              <strong className="text-white">
                Shared directly to Instagram Stories
              </strong>
              , where the sticker appears as a draggable overlay
            </li>
            <li>
              <strong className="text-white">Copied to clipboard</strong> and
              pasted into any app — iMessage, WhatsApp, social media
            </li>
            <li>
              <strong className="text-white">
                Saved as a standalone transparent PNG
              </strong>{" "}
              for use anywhere
            </li>
          </ul>
          <p>
            The sticker is rendered at high resolution with transparency, so it
            works on any background — light, dark, or busy. The glass effect
            adapts to the underlying content, always remaining readable.
          </p>
          <p>
            This feature exists because sharing is a natural part of the
            nutrition tracking experience. People share their meals, their
            progress, and their daily logs. NutriKit makes that sharing look
            effortless and professional.
          </p>
        </Prose>
      </Section>
    </ArticleLayout>
  );
}
