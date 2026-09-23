import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nourish — Your daily wellness companion",
  description: "A calm daily plan for breathing, movement, food, and mindful living.",
  applicationName: "Nourish",
  authors: [{ name: "Nourish" }],
  keywords: ["wellness", "breathing", "meditation", "exercise", "meal plan"],
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#eef3ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
