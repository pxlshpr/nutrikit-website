import type { Metadata } from "next";
import "./globals.css";

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
