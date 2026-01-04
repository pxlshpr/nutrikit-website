import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#ff0000" },
    { media: "(prefers-color-scheme: light)", color: "#00ff00" },
  ],
};

export default function TestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ff0000",
      }}
    />
  );
}
