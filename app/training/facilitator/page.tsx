import type { Metadata } from "next";
import FacilitatorPortal from "@/components/training/FacilitatorPortal";

export const metadata: Metadata = {
  title: "Facilitator — Fieldwork AI",
  description: "Facilitator control room.",
  robots: { index: false, follow: false },
};

export default function FacilitatorPage() {
  return <FacilitatorPortal />;
}
