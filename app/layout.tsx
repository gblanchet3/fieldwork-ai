import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

// Google Analytics 4 measurement ID (Fieldwork AI property → Fieldwork Site stream).
const GA_MEASUREMENT_ID = "G-GNCJRTKED3";

const syne = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fieldwork AI — AI fluency your team actually owns",
  description:
    "I train your team to be AI-native — and build the automations worth building, then hand them over running. Your fluency, not a subscription. Capability, not dependency.",
  openGraph: {
    title: "Fieldwork AI",
    description:
      "AI fluency your team actually owns. I train your people and build what's worth building — then hand it over. Capability, not dependency.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">{children}</body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
