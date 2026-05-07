import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Fieldwork AI — Personalized AI coaching & implementation",
  description:
    "I help founders, operators, and investment teams use AI as a portable advantage they own. Sovereignty over subscriptions. Hand-holding over hype. Build with you, not for you.",
  openGraph: {
    title: "Fieldwork AI",
    description:
      "Personalized AI coaching & implementation. Sovereignty over subscriptions. Hand-holding over hype.",
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
    </html>
  );
}
