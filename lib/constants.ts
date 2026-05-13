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

export const CONTACT_EMAIL = "gblanchet3@gmail.com";
export const SUBSTACK_URL = "https://gabeblanchet.substack.com/";

// --- Navigation ---
// Top-level nav. Dropdowns rendered in Nav.tsx.
export const NAV_LINKS = [
  { label: "Services", href: "/services/coaching", dropdown: "services" },
  { label: "Customers", href: "/customers/founders", dropdown: "customers" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Field Notes", href: SUBSTACK_URL, external: true },
] as const;

export const SERVICES_DROPDOWN = [
  { label: "AI Operator", sub: "1:1 coaching", href: "/services/coaching" },
  { label: "Thesis Sprint + Build", sub: "Implementation", href: "/services/implementation" },
  { label: "Team Cohort", sub: "Enablement", href: "/services/enablement" },
] as const;

export const CUSTOMERS_DROPDOWN = [
  { label: "Founders & Executives", href: "/customers/founders" },
  { label: "SaaS / Software", href: "/customers/saas" },
  { label: "Service Businesses", href: "/customers/services" },
  { label: "Investment Firms", href: "/customers/investment" },
] as const;

// --- Home: Principles ---
export const PRINCIPLES = [
  {
    title: "Sovereignty.",
    body: "We teach the fundamentals — prompts, context, agents, harnesses — not which SaaS vendor has \"AI\" stickered on the box. Models get smarter and cheaper every quarter. Teams that own their fluency compound. Teams renting it forever don't.",
  },
  {
    title: "Coaching, not building.",
    body: "We try not to build for you — we coach you and co-build with you. The point is your team leaves with the skills, not a dependency on us. Otherwise we're just another vendor.",
  },
  {
    title: "Operator-rooted.",
    body: "We've been in the seat — built products, shipped to production, raised capital, sold companies. The coaching comes from scars, not slides.",
  },
] as const;

// --- Home: Methodology (replaces old HowItWorks) ---
export const METHODOLOGY_PHASES = [
  {
    number: "01",
    title: "Frame & Coach",
    description:
      "Week 1. We map your business, your stack, your data — and write an opinionated thesis with two or three candidate bets. You learn the frameworks while we write it. Coaching starts here, not later.",
  },
  {
    number: "02",
    title: "Build & Teach",
    description:
      "Weeks 2–3. Real code, real prompts, real configs — not slideware. You learn the tools while we ship: prompts, context, agents, harnesses. Cost of building has collapsed; we use that, and you learn how.",
  },
  {
    number: "03",
    title: "Read the Signal",
    description:
      "Week 4. Real users, real data. You learn to tell AI signal from noise. We size validation to risk — not to bill more hours.",
  },
  {
    number: "04",
    title: "Scale or Kill",
    description:
      "Week 5+. Three paths: build it together, hand off a plan your team owns, or kill it and bank the savings. By now you can make the next call without me in the room. That's the point.",
  },
] as const;

// --- Home: Services overview cards ---
export const SERVICES_OVERVIEW = [
  {
    title: "AI Operator",
    kicker: "1:1 coaching",
    description:
      "Personal AI fluency. Custom OS. A weekly thinking partner. Best for founders, executives, and individual operators.",
    pricing: "$1.5–3.5K / month",
    href: "/services/coaching",
  },
  {
    title: "Thesis Sprint + Build",
    kicker: "Implementation",
    description:
      "A 2-week sprint to find the right AI bet, prototype it, and validate it. Then we build it together — or hand you a plan to build in-house.",
    pricing: "Sprint $7.5–18K · Build scoped after",
    href: "/services/implementation",
  },
  {
    title: "Team Cohort",
    kicker: "Enablement",
    description:
      "A 4-week cohort that turns your team into AI operators. Workshop format, hands-on, every member leaves with their own working artifact.",
    pricing: "$12.5–30K",
    href: "/services/enablement",
  },
] as const;

// --- Home: Calculator levels ---
export type LevelData = {
  level: number;
  name: string;
  oneLiner: string;
  bullets: string[];
  callout: string;
};

export const PERSONAL_LEVELS: LevelData[] = [
  {
    level: 0,
    name: "Skeptic",
    oneLiner: "I haven't really tried ChatGPT or Claude. AI feels like hype.",
    bullets: [
      "60-minute intro session: how AI actually works in 2026, what's hype, what's not",
      "One real workflow you do every week, rebuilt with AI in front of you",
      "Build the muscle of asking AI well — it's a skill, not a button",
    ],
    callout: "Together we'd start with a single AI Operator coaching block.",
  },
  {
    level: 1,
    name: "Curious",
    oneLiner: "I use ChatGPT occasionally for one-off questions.",
    bullets: [
      "Move past chat-as-Google. Learn to use AI as a thinking partner",
      "Build your first repeatable prompt template for a recurring task",
      "Get a personal context doc set up — the \"About Me\" AI uses every session",
    ],
    callout: "Together we'd run a 30-day AI Operator engagement.",
  },
  {
    level: 2,
    name: "Prompter",
    oneLiner: "I use AI daily. I've gotten real value but it lives in browser tabs.",
    bullets: [
      "Stop tab-hopping. Move into a Claude Project or custom GPT for your top 3 tasks",
      "Capture your context once, reuse it everywhere",
      "Pick one decision you make weekly and codify the framework",
    ],
    callout: "Together we'd build your starter OS in a Thesis Sprint.",
  },
  {
    level: 3,
    name: "Co-worker",
    oneLiner: "I have AI in my workflow and miss it when it's gone.",
    bullets: [
      "Codify your style: drafting, summarizing, decision-making, in your voice",
      "Connect your AI to your data — calendar, email, notes — without giving up sovereignty",
      "Identify the one workflow you'd save 5 hours a week on if it ran itself",
    ],
    callout: "Together we'd run a Sprint and ship your first agent.",
  },
  {
    level: 4,
    name: "Operator",
    oneLiner: "I've built custom GPTs, Claude Projects, or repeatable prompt systems.",
    bullets: [
      "Audit your stack for vendor lock-in — what's portable, what's trapped behind a SaaS API?",
      "Move from custom GPTs to a real harness (Claude Code, Cursor, repo-based context)",
      "Architect for the model swap — assume the LLM under you will change every 6 months",
      "Build evals so you can prove your prompts work, not just feel like they do",
    ],
    callout: "Together we'd build your portable OS, ship it to Git, and hand it off.",
  },
  {
    level: 5,
    name: "AI-Native",
    oneLiner: "I have a personal OS. Agents work for me. My context is portable.",
    bullets: [
      "You don't need a coach. You need a sparring partner for the next experiment",
      "Or a build partner for the things you don't have time to make",
      "Or a guide for your team — from your level to theirs",
    ],
    callout: "Together we'd talk Implementation or Team Enablement.",
  },
];

export const COMPANY_LEVELS: LevelData[] = [
  {
    level: 0,
    name: "Banned / Blind",
    oneLiner: "AI is banned, ignored, or invisible in our org.",
    bullets: [
      "Get clear on what you're actually risking by waiting — competitors aren't",
      "Resolve compliance and data concerns with a real plan, not blanket fear",
      "Run one sanctioned 90-day pilot in a low-risk function (research, internal docs, hiring loops)",
      "Pick a champion: one senior leader who'll learn this in front of the org",
    ],
    callout: "Together we'd start with a leadership briefing and a Thesis Sprint scoped to your risk tolerance.",
  },
  {
    level: 1,
    name: "Shadow Use",
    oneLiner: "Employees use ChatGPT on personal accounts. No org strategy.",
    bullets: [
      "Acknowledge what's already happening — your team is using it, you're just not seeing it",
      "Survey actual usage anonymously. The answers will surprise you",
      "Sanction one tool officially, with a usage policy, and watch productivity step-change",
      "Identify your power users — they're your future internal champions",
    ],
    callout: "Together we'd run a leadership cohort and ship a sanctioned-tool rollout plan.",
  },
  {
    level: 2,
    name: "Sanctioned Tools",
    oneLiner: "We license Copilot, Glean, ChatGPT Enterprise. Adoption is uneven.",
    bullets: [
      "Audit what your $60K/year in licenses actually delivers vs. what a portable artifact would",
      "Pick one workflow per team to rebuild — not retrofit — with AI",
      "Train your power users into internal champions, not Glean admins",
    ],
    callout: "Together we'd run a Thesis Sprint to scope your next AI build.",
  },
  {
    level: 3,
    name: "Workflow Redesign",
    oneLiner: "Specific processes have been rebuilt around AI. Real productivity gains visible.",
    bullets: [
      "Map vendor lock-in: which workflows depend on a SaaS you can't migrate off?",
      "Move sensitive context out of vendor wrappers and into artifacts you own",
      "Identify the next two high-leverage processes — internal ops vs. customer-facing",
    ],
    callout: "Together we'd run a Sprint and decide build vs. buy.",
  },
  {
    level: 4,
    name: "Internal Builders",
    oneLiner: "We ship internal agents, custom artifacts, automated knowledge bases.",
    bullets: [
      "Build an evals practice — without it, you're shipping AI on vibes",
      "Centralize your prompt library so engineers stop reinventing",
      "Pick the next strategic build vs. buy — most teams over-buy at this stage",
      "Train the next 20% of your org to operate at this level",
    ],
    callout: "Together we'd run a Team Cohort for the next-tier operators and a Sprint on the next strategic build.",
  },
  {
    level: 5,
    name: "AI-Native",
    oneLiner: "AI is woven into product, ops, and culture. We own our context, prompts, harnesses.",
    bullets: [
      "You don't need a coach. You need a sparring partner for the experiments that haven't worked yet",
      "Or a build partner for the things you don't have time to make",
      "Or a guide for the rest of your org — most companies at Lv 5 in product are still Lv 2 in ops",
    ],
    callout: "Together we'd talk Implementation, Team Enablement, or just trade notes.",
  },
];

// --- Field Notes (manually curated; swap to RSS at build time later) ---
export const FIELD_NOTES = [
  {
    title: "Read the latest on Substack",
    excerpt: "Field Notes is hosted on my Substack. Subscribe there for new essays as they go out.",
    date: "",
    href: SUBSTACK_URL,
  },
] as const;

// --- Selected Work ---
export const SELECTED_WORK = [
  {
    slug: "rent-a-pool-boise",
    name: "Rent A Pool Boise",
    kicker: "Home services startup",
    summary:
      "Brand identity, marketing site, interactive estimator with Google Maps service-area validation, early-bird pricing, partial-lead capture, GA4 funnel, and a Sheets back-office on Apps Script. Zero to operational in weeks.",
    portable:
      "All built on tools the founder already understood — vanilla web, Sheets, Apps Script. He runs it himself.",
    url: "https://rentapoolboise.com",
    metrics: [
      { label: "Full brand identity", sub: "Name, mark, visual system" },
      { label: "Custom lead machine", sub: "Estimator + funnel + GA4" },
      { label: "Back-office ops system", sub: "Sheets + Apps Script" },
    ],
  },
  {
    slug: "azure-health",
    name: "Azure Health",
    kicker: "Integrative health practice, Boise",
    summary:
      "A practitioner launching a new integrative practice — combining nervous system regulation, energy work, and medically guided care — needed a strategy and a credibility-grade web presence that could speak to both clinical and energetic audiences without losing either one.",
    portable:
      "Practice positioning, full website implementation, and a voice/visual system she runs herself. Tools she can maintain without me.",
    url: "https://azurehealthco.com",
    metrics: [
      { label: "Practice positioning", sub: "Offer architecture + voice" },
      { label: "Full site build", sub: "Design, build, content" },
      { label: "Self-managed", sub: "She runs it without me" },
    ],
  },
  {
    slug: "personal-os",
    name: "Personal AI Operating System",
    kicker: "Built for myself, used daily",
    summary:
      "File-structured personal OS — identity, thinking models, voice, network CRM, projects, goals. A LinkedIn analyzer that reads 6,000+ connections and ranks them weekly. Automated lead generation surfacing 5–10 warm prospects. All in plain text, all in Git, all portable.",
    portable:
      "Live, running, every day. The artifact behind the methodology. The thing I help clients build versions of for themselves.",
    url: "",
    metrics: [
      { label: "Personal OS", sub: "Identity, CRM, projects, goals" },
      { label: "LinkedIn analyzer", sub: "6K+ connections, ranked weekly" },
      { label: "Weekly lead gen", sub: "5–10 warm prospects, automated" },
    ],
  },
] as const;

// Operator background — for /work and /about sidebar
export const OPERATOR_HISTORY = [
  { co: "LeanLaw", role: "Head of Product", note: "Led evolution from SaaS into payments / fintech" },
  { co: "Maxable", role: "CEO", note: "Marketplace platform" },
  { co: "Revonate", role: "Co-founder, CTO", note: "" },
  { co: "Imbellus", role: "Product", note: "Cognitive assessment startup" },
  { co: "Grove Labs", role: "Co-founder", note: "$6M raised. Acquired by LG" },
  { co: "GrabCAD", role: "Engineering", note: "Early team" },
] as const;
