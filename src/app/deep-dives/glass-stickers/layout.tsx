import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glass Stickers — NutriKit Deep Dive",
  description:
    "How NutriKit renders real iOS 26 liquid glass effects on shareable meal stickers — for both images and frame-by-frame video export.",
  openGraph: {
    title: "Glass Stickers — NutriKit Deep Dive",
    description:
      "How we render iOS 26 liquid glass effects on shareable meal stickers — images and frame-by-frame video.",
    url: "https://getnutrikit.app/deep-dives/glass-stickers",
    siteName: "NutriKit",
    images: [
      {
        url: "https://getnutrikit.app/og-glass-stickers.png",
        width: 1200,
        height: 630,
        alt: "NutriKit Glass Stickers — Technical Deep Dive",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glass Stickers — NutriKit Deep Dive",
    description:
      "How we render iOS 26 liquid glass effects on shareable meal stickers — images and frame-by-frame video.",
    images: ["https://getnutrikit.app/og-glass-stickers.png"],
  },
};

export default function GlassStickersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
