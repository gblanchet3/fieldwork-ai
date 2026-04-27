/**
 * Fieldwork AI — Automated Business Research Script
 *
 * Reads companies.json, picks the next N pending companies, fetches their
 * website, and calls Claude API to generate AI opportunity findings.
 * Writes results to data/pending/[slug].json.
 *
 * Usage:
 *   npm run research                    # process next 10 pending
 *   npm run research -- --slug acme     # process one specific slug
 *   npm run research -- --count 5       # process next 5 pending
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Company, Business, Opportunity } from "../lib/types.js";
import { CONFIG } from "../lib/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const client = new Anthropic();

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const slugArg = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const countArg = args.includes("--count") ? parseInt(args[args.indexOf("--count") + 1], 10) : 10;

// ─── File helpers ─────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

// ─── Web fetch helper ─────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FieldworkAI-research/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.slice(0, 50000); // cap at 50k chars
  } catch {
    return null;
  }
}

// ─── Website signal extraction ────────────────────────────────────────────────

interface WebsiteSignals {
  hasOnlineBooking: boolean;
  hasTeamPage: boolean;
  hasContactForm: boolean;
  hasPhoneOnly: boolean;
  detectedCrm: string[];
  detectedBookingTool: string[];
  lastCopyrightYear: number | null;
  metaDescription: string | null;
  ogTitle: string | null;
  themeColor: string | null;
  faviconUrl: string | null;
  phone: string | null;
  email: string | null;
  rawSnippet: string;
}

function extractWebsiteSignals(html: string, baseUrl: string): WebsiteSignals {
  const lower = html.toLowerCase();

  const bookingKeywords = ["book online", "book now", "schedule online", "request appointment", "book a service", "schedule service"];
  const bookingTools = ["jobber", "servicetitan", "housecall", "bookingkoala", "calendly", "acuity", "simplybook", "fieldrocket"];
  const crmTools = ["hubspot", "salesforce", "activecampaign", "mailchimp", "klaviyo", "drip", "constantcontact"];

  const hasOnlineBooking =
    bookingKeywords.some((k) => lower.includes(k)) ||
    bookingTools.some((t) => lower.includes(t));

  const hasTeamPage =
    lower.includes("/team") ||
    lower.includes("/about/team") ||
    lower.includes("/staff") ||
    lower.includes("meet the team") ||
    lower.includes("our team");

  const hasContactForm =
    lower.includes("<form") &&
    (lower.includes("contact") || lower.includes("request") || lower.includes("quote"));

  const detectedCrm = crmTools.filter((t) => lower.includes(t));
  const detectedBookingTool = bookingTools.filter((t) => lower.includes(t));

  const copyrightMatch = html.match(/©\s*(\d{4})|copyright\s+(\d{4})/i);
  const lastCopyrightYear = copyrightMatch
    ? parseInt(copyrightMatch[1] || copyrightMatch[2])
    : null;

  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const themeColor = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["'](#[0-9a-fA-F]{3,8})["']/i);
  const favicon = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i);

  let faviconUrl: string | null = null;
  if (favicon) {
    const href = favicon[1];
    faviconUrl = href.startsWith("http") ? href : new URL(href, baseUrl).href;
  } else {
    try {
      faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(baseUrl).hostname}&sz=128`;
    } catch {
      faviconUrl = null;
    }
  }

  // Phone: tel: links first, then common US formats
  const telLink = html.match(/href=["']tel:([^"']+)["']/i);
  let phone: string | null = null;
  if (telLink) {
    const digits = telLink[1].replace(/\D/g, "").replace(/^1/, ""); // strip country code
    if (digits.length === 10) {
      phone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      phone = telLink[1].trim();
    }
  } else {
    const phoneMatch = html.match(/\(?\b(\d{3})\)?[\s.\-](\d{3})[\s.\-](\d{4})\b/);
    if (phoneMatch) phone = `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}`;
  }

  // Email: mailto: links first, then common patterns
  const mailtoLink = html.match(/href=["']mailto:([^"'?]+)/i);
  let email: string | null = null;
  if (mailtoLink) {
    email = mailtoLink[1].trim();
  } else {
    const emailMatch = html.match(/\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/);
    if (emailMatch && !emailMatch[1].includes("example") && !emailMatch[1].includes("sentry")) {
      email = emailMatch[1];
    }
  }

  const rawSnippet = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);

  return {
    hasOnlineBooking,
    hasTeamPage,
    hasContactForm,
    hasPhoneOnly: !hasOnlineBooking && !hasContactForm,
    detectedCrm,
    detectedBookingTool,
    lastCopyrightYear,
    metaDescription: metaDesc ? metaDesc[1] : null,
    ogTitle: ogTitle ? ogTitle[1] : null,
    themeColor: themeColor ? themeColor[1] : null,
    faviconUrl,
    phone,
    email,
    rawSnippet,
  };
}

// ─── Brand color extraction ───────────────────────────────────────────────────

function extractBrandColor(html: string): string {
  // 1. meta theme-color
  const themeMatch = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["'](#[0-9a-fA-F]{6})["']/i);
  if (themeMatch) return themeMatch[1];

  // 2. CSS variables for brand/primary color
  const cssVarMatch = html.match(/--(?:brand|primary|accent|color-primary)[^:]*:\s*(#[0-9a-fA-F]{6})/i);
  if (cssVarMatch) return cssVarMatch[1];

  // 3. First non-black/white/gray hex color in a heading or button context
  const buttonMatch = html.match(/(?:btn|button|cta)[^>]*style[^>]*color[^:]*:\s*(#[0-9a-fA-F]{6})/i);
  if (buttonMatch) {
    const color = buttonMatch[1].toUpperCase();
    if (!["#FFFFFF", "#000000", "#333333", "#666666"].includes(color)) return color;
  }

  return "#D97B2A"; // Fieldwork AI amber fallback
}

// ─── Claude API: generate findings ───────────────────────────────────────────

const OPPORTUNITY_LIST = `
1. review-response-automation: Reviews with 0 owner responses → Manual reputation management being skipped
2. online-scheduling: No booking button on site or GMB → After-hours leads going to competitors
3. quote-proposal-generation: "How much?" reviews, slow turnaround complaints → Quoting is manual, slow, inconsistent
4. after-service-follow-up: No review-request patterns, no loyalty signals → No automated touchpoints post-job
5. intake-triage: "Hard to reach" reviews, mixed complaint types → Inbound calls handled manually, no routing
6. dispatch-routing: "Arrived late" or "no-show" reviews → Manual dispatch, no optimization
7. invoice-ar-follow-up: Billing complaints, slow-pay language in job postings → Manual AR process
8. preventive-maintenance-reminders: Seasonal service business, no email marketing evident → No recurring revenue automation
9. training-sop-documentation: Reposted roles, reviews praising one specific tech → Tribal knowledge, owner-dependent quality
10. job-costing-margin-analysis: Busy but not growing signals, price complaints → No visibility into which jobs make money
11. customer-reactivation: 5+ year old business, low review velocity vs review count → Large dormant customer base, no re-engagement
12. call-recording-crm-capture: No CRM evident, phone-tag reviews → Every unbooked call is lost forever
13. subcontractor-coordination: GC/remodeler, "delayed by subs" reviews → Manual sub management
14. seasonal-staffing-prediction: HVAC/landscaping, staffing posts spike seasonally → No data-driven staffing
15. key-person-risk: Owner name in most reviews, no team page, solo GMB photos → Key-person dependency
`.trim();

async function generateFindings(
  company: Company,
  signals: WebsiteSignals
): Promise<Opportunity[]> {
  const prompt = `You are analyzing a service business to identify AI automation opportunities.

Business: ${company.name}
Vertical: ${company.vertical}
Location: Boise, Idaho
Google Rating: ${company.googleRating ?? "unknown"} (${company.reviewCount ?? "unknown"} reviews)

Website signals:
- Has online booking: ${signals.hasOnlineBooking}
- Has team page: ${signals.hasTeamPage}
- Has contact form: ${signals.hasContactForm}
- Phone-only contact: ${signals.hasPhoneOnly}
- Detected booking tools: ${signals.detectedBookingTool.join(", ") || "none"}
- Detected CRM/marketing tools: ${signals.detectedCrm.join(", ") || "none"}
- Last copyright year: ${signals.lastCopyrightYear ?? "unknown"}
- Site description: ${signals.metaDescription ?? "not found"}

Website text snippet:
${signals.rawSnippet.slice(0, 800)}

Available opportunity types:
${OPPORTUNITY_LIST}

Select exactly 3 opportunity types that best fit this business based on the signals above.
For each, write concise findings that reference the specific data.

Return ONLY a valid JSON array of exactly 3 objects, each with:
- type: the slug from the list above (e.g. "review-response-automation")
- label: 2-4 word label (e.g. "Review Response Automation")
- signal: ONE sentence (max 20 words) citing the specific signal found
- observation: ONE sentence (max 20 words) on what this means for their business
- fix: ONE sentence (max 20 words) on the specific AI automation that solves it

Be specific to this business. Avoid generic statements. No markdown, no explanation — only the JSON array.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`No JSON array in Claude response: ${text.slice(0, 200)}`);

  const parsed: Opportunity[] = JSON.parse(jsonMatch[0]);
  return parsed.slice(0, 3);
}

// ─── Main research function ───────────────────────────────────────────────────

async function researchCompany(company: Company): Promise<void> {
  const pendingPath = path.join(ROOT, "data", "pending", `${company.slug}.json`);

  if (fs.existsSync(pendingPath)) {
    console.log(`  ⏭  ${company.name} — already researched, skipping`);
    return;
  }

  console.log(`  🔍 ${company.name} (${company.website})`);

  // Fetch website
  let signals: WebsiteSignals;
  const html = await fetchHtml(company.website);
  if (html) {
    signals = extractWebsiteSignals(html, company.website);
    console.log(`     Website fetched — booking: ${signals.hasOnlineBooking}, team page: ${signals.hasTeamPage}`);
  } else {
    console.log(`     Website unavailable — proceeding with GMB data only`);
    signals = {
      hasOnlineBooking: false,
      hasTeamPage: false,
      hasContactForm: false,
      hasPhoneOnly: true,
      detectedCrm: [],
      detectedBookingTool: [],
      lastCopyrightYear: null,
      metaDescription: null,
      ogTitle: null,
      themeColor: null,
      faviconUrl: null,
      rawSnippet: "",
    };
  }

  // Extract brand color
  const brandColor = html ? extractBrandColor(html) : "#D97B2A";

  // Logo: use favicon
  const logoUrl = signals.faviconUrl ?? "";

  // Generate findings with Claude
  let opportunities: Opportunity[];
  try {
    opportunities = await generateFindings(company, signals);
    console.log(`     Generated ${opportunities.length} findings`);
  } catch (e) {
    console.error(`     ❌ Claude API error: ${e instanceof Error ? e.message : e}`);
    return;
  }

  // Build business record
  const business: Business = {
    slug: company.slug,
    name: company.name,
    vertical: company.vertical as Business["vertical"],
    city: "Boise, ID",
    logoUrl,
    heroPhotoUrl: "",
    brandColor,
    googleRating: company.googleRating ?? 0,
    reviewCount: company.reviewCount ?? 0,
    opportunities,
    calendlyUrl: CONFIG.calendlyUrl,
    coachingUrl: CONFIG.coachingUrl,
    website: company.website || undefined,
    phone: signals.phone || undefined,
    email: signals.email || undefined,
    ownerName: company.ownerName || undefined,
  };

  writeJson(pendingPath, business);
  console.log(`     ✅ Written to data/pending/${company.slug}.json`);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main() {
  const companiesPath = path.join(ROOT, "data", "companies.json");
  const companies: Company[] = readJson(companiesPath);

  let targets: Company[];

  if (slugArg) {
    const found = companies.find((c) => c.slug === slugArg);
    if (!found) {
      console.error(`No company with slug "${slugArg}" found in companies.json`);
      process.exit(1);
    }
    targets = [found];
  } else {
    targets = companies.filter((c) => c.status === "pending").slice(0, countArg);
  }

  if (targets.length === 0) {
    console.log("No pending companies to research.");
    return;
  }

  console.log(`\nFieldwork AI Research — processing ${targets.length} companies\n`);

  for (const company of targets) {
    await researchCompany(company);
    // Update status in companies.json
    const idx = companies.findIndex((c) => c.slug === company.slug);
    if (idx !== -1) companies[idx].status = "researched";
  }

  // Write updated companies.json
  writeJson(companiesPath, companies);
  console.log(`\n✓ Done. Updated companies.json statuses.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
