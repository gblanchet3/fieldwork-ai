import type { Metadata } from "next";
import TrainingPortal from "@/components/training/TrainingPortal";

export const metadata: Metadata = {
  title: "Training Portal — Fieldwork AI",
  description: "Enter your training access code to open your personalized course.",
  robots: { index: false, follow: false },
};

export default function TrainingPage() {
  return <TrainingPortal />;
}
