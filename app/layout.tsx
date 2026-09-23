import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nourish — Your daily wellness companion",
  description: "A calm daily plan for breathing, movement, food, and mindful living.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
