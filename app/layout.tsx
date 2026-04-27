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
  title: "Fieldwork AI — AI consulting & development for service businesses",
  description:
    "We build the AI systems that maximize EBITDA, eliminate key-person risk, and position your business to command a premium at exit.",
  openGraph: {
    title: "Fieldwork AI",
    description:
      "AI systems for service businesses. Maximize EBITDA, eliminate key-person risk, command a premium at exit.",
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
