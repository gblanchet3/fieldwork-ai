export const BRAND = {
  colors: {
    slate: "#0F1923",
    amber: "#D97B2A",
    bone: "#F0EBE1",
    olive: "#1A3A2A",
    steel: "#4A5568",
    dust: "#E2DDD6",
    white: "#FFFFFF",
  },
} as const;

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const PAIN_POINTS = [
  {
    title: "Your margins are leaving money on the table",
    description:
      "Every inefficiency in scheduling, estimating, and ops is a direct tax on your EBITDA. Most service businesses are running at 60–70% of their margin potential.",
    icon: "chart",
  },
  {
    title: "Your business only runs because you're in it",
    description:
      "If you or a key employee stepped away, operations would degrade within weeks. That's not a business — that's a job you can't sell.",
    icon: "person",
  },
  {
    title: "Buyers discount what they can't verify",
    description:
      "A business that runs on tribal knowledge and spreadsheets gets a lower multiple than one with documented, auditable systems. The gap is real and measurable.",
    icon: "scale",
  },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Diagnose",
    description:
      "We map your ops, find every margin leak and key-person dependency, and quantify the exit value gap.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "We design and deploy proprietary AI systems — scheduling, estimating, customer management, knowledge codification — built around how your business actually works.",
  },
  {
    number: "03",
    title: "Compound",
    description:
      "Systems generate data. Data becomes proprietary insight. Proprietary insight becomes a defensible asset that buyers pay a premium for.",
  },
] as const;

export const SERVICES = [
  {
    title: "EBITDA Optimization Systems",
    description:
      "AI-powered scheduling, estimating, and job management that reduces labor overhead and increases throughput.",
  },
  {
    title: "Knowledge Codification",
    description:
      "Your SOPs, pricing logic, and operational know-how encoded into systems that train new hires, guide decisions, and survive employee turnover.",
  },
  {
    title: "Customer Retention Systems",
    description:
      "Automated follow-up, service history intelligence, and proactive communication that cuts churn and increases lifetime value.",
  },
  {
    title: "Exit Readiness Package",
    description:
      "A full audit of your AI systems, data assets, and operational documentation — formatted for buyers, lenders, and M&A advisors.",
  },
] as const;

export const CONTACT_EMAIL = "hello@fieldwork.ai";
