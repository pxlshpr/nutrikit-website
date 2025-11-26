import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriKit - Your Nutrition Companion",
  description: "Track your nutrition, achieve your health goals",
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
