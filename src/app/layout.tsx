import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriKit · Track what actually matters",
  description:
    "You can't control what you don't measure. Track calories, macros, and 20+ micronutrients with science-backed targets built for your body.",
  openGraph: {
    title: "NutriKit · Track what actually matters",
    description:
      "You can't control what you don't measure. Track calories, macros, and 20+ micronutrients with science-backed targets built for your body.",
    url: "https://getnutrikit.app",
    siteName: "NutriKit",
    images: [{ url: "https://getnutrikit.app/og-image.png?v=2", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriKit · Track what actually matters",
    description:
      "You can't control what you don't measure. Track calories, macros, and 20+ micronutrients with science-backed targets built for your body.",
    images: ["https://getnutrikit.app/og-image.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
