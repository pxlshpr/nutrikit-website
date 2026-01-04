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
        url: "/app-icon.png",
        width: 1024,
        height: 1024,
        alt: "NutriKit App Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NutriKit",
    description: "You can't control what you don't measure.",
    images: ["/app-icon.png"],
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
