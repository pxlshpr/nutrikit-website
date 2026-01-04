import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0612" },
    { media: "(prefers-color-scheme: light)", color: "#f8f5fc" },
  ],
};

export const metadata: Metadata = {
  title: "NutriKit",
  description: "You can't control what you don't measure.",
  openGraph: {
    title: "NutriKit",
    description: "You can't control what you don't measure.",
    url: "https://getnutrikit.app",
    siteName: "NutriKit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutriKit App Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriKit",
    description: "You can't control what you don't measure.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
