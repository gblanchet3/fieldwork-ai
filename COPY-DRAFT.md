# Fieldwork AI — Copy Draft v1

> Status: First draft for Gabe's offline edit. Anything in `[brackets]` is a placeholder, decision point, or item to confirm. Voice tuned to GVB voice-draft.md.

---

## Site Architecture

```
/                          Home (single page, dense)
/services/coaching         AI Operator (1:1)
/services/implementation   Thesis Sprint + Build & Hand-off
/services/enablement       Team Cohort
/customers/founders        Founders & Executives
/customers/saas            SaaS / Software Companies
/customers/services        Service Businesses
/customers/investment      Investment Firms
/work                      Selected work + case studies
/about                     Who, why, principles
/contact                   Form + book a call
```

**Nav (desktop):** `Services ▾   Customers ▾   Work   About   Field Notes ↗   [Talk to me]`

`Field Notes` is an external link to gabeblanchet.substack.com. The home page also pulls the latest 3 posts via RSS.

---

# HOME

## Hero

**Eyebrow:** Personalized AI coaching & implementation

**Headline:**
You don't need another course.
You need someone in the trenches with you.

**Subhead:**
I help founders, operators, and investment teams use AI like the people who built it intended — not as a SaaS subscription, but as a portable advantage you actually own. We move fast. You keep everything we make.

**CTAs:**
- `[Find your level →]` (scrolls to the calculators)
- `Talk to me` (scrolls to contact)

---

## The Problem

**Eyebrow:** The problem

**Headline:**
The AI revolution is happening. Most people are watching it on a webinar.

**Body:**
Three things are true at once.

The tools are getting better every month. The cost of building is collapsing. And the gap between people who *use* AI and people who *operate* it is widening fast.

Most of what's on offer doesn't help you cross that gap. Online courses you'll never finish. SaaS wrappers that lock your data behind someone else's UI. Big-firm consultants who hand you a deck and disappear. Vibe-coded prototypes that nobody knows how to maintain.

You don't need any of that.

You need someone who sits beside you, builds *with* you, and leaves you with artifacts you own — your data, your prompts, your context, your code. Portable. Forkable. Yours.

That's what I do.

---

## Principles (the sovereignty section)

**Eyebrow:** What I believe

**Headline:**
Own your AI. Or someone else owns your business.

**Three principles, displayed as cards:**

**1. Sovereignty over subscriptions.**
SaaS is the old contract — you rent capability, they keep your data. AI is the new contract — you own the context, the prompts, the harness. Models will get smarter and cheaper every quarter. The companies that own their own scaffolding will compound. The ones who don't will be paying $60K/year forever.

**2. Hand-holding over hype.**
A course can't watch you struggle and adjust. A YouTube video doesn't know your business. I sit with you, in real time, on the actual work. You get my Signal. Weekly standups. A decision log you keep when we're done. The opposite of a $299 cohort.

**3. Build with you, not for you.**
The point isn't to make you dependent on me. It's to make your team capable. Every engagement is designed to leave you running — not waiting for the next invoice. If I do my job right, you'll need me less over time, not more.

---

## Calculators (the headline interactive)

**Eyebrow:** Find your level

**Headline:**
Where do you actually stand?

**Body:**
Two questions. Pick the level that fits. I'll show you what I'd work on with you next.

### Where do **I** stand? (personal)

| Lv | Name | One-liner |
|---|---|---|
| 0 | Skeptic | I haven't really tried ChatGPT or Claude. AI feels like hype |
| 1 | Curious | I use ChatGPT occasionally for one-off questions |
| 2 | Prompter | I use AI daily. I've gotten real value but it lives in browser tabs |
| 3 | Co-worker | I have AI in my workflow — research, drafting, summarizing — and I miss it when it's gone |
| 4 | Operator | I've built custom GPTs, Claude Projects, or repeatable prompt systems |
| 5 | AI-Native | I have a personal OS. Agents work for me. My context is portable |

**Sample focus bullets per level — to be shown when a card is clicked.**

*Level 0 — Skeptic:*
- 60-minute intro session: how AI actually works in 2026, what's hype, what's not
- One real workflow you do every week, rebuilt with AI in front of you
- Build the muscle of asking AI well — it's a skill, not a button
- *Together we'd start with a single AI Operator coaching block.*

*Level 1 — Curious:*
- Move past chat-as-Google. Learn to use AI as a thinking partner
- Build your first repeatable prompt template for a recurring task
- Get a personal context doc set up — the "About Me" AI uses every session
- *Together we'd run a 30-day AI Operator engagement.*

*Level 2 — Prompter:*
- Stop tab-hopping. Move into a Claude Project or custom GPT for your top 3 tasks
- Capture your context once, reuse it everywhere
- Pick one decision you make weekly and codify the framework
- *Together we'd build your starter OS in a Thesis Sprint.*

*Level 3 — Co-worker:*
- Codify your style: drafting, summarizing, decision-making, in your voice
- Connect your AI to your data — calendar, email, notes — without giving up sovereignty
- Identify the one workflow you'd save 5 hours a week on if it ran itself
- *Together we'd run a Sprint and ship your first agent.*

*Level 4 — Operator:*
- Audit your stack for vendor lock-in — what's portable, what's trapped?
- Move from custom GPTs to a real harness (Claude Code, repo-based context)
- Architect for the model swap — assume the LLM under you will change every 6 months
- *Together we'd build your portable OS and hand it off.*

*Level 5 — AI-Native:*
- You don't need a coach. You need a build partner for the things you don't have time to make
- Or a sparring partner for the next experiment
- Or a guide for your team — from your level to theirs
- *Together we'd talk Implementation or Team Enablement.*

### Where do **we** stand? (company)

| Lv | Name | One-liner |
|---|---|---|
| 0 | Banned / Blind | AI is banned, ignored, or invisible in our org |
| 1 | Shadow Use | Employees use ChatGPT on personal accounts. No org strategy |
| 2 | Sanctioned Tools | We license Copilot, Glean, ChatGPT Enterprise. Adoption is uneven |
| 3 | Workflow Redesign | Specific processes have been rebuilt around AI. Real productivity gains are visible |
| 4 | Internal Builders | We ship internal agents, custom artifacts, automated knowledge bases |
| 5 | AI-Native | AI is woven into product, ops, and culture. We own our context, prompts, and harnesses |

**Sample focus bullets — Level 2 (Sanctioned Tools):**
- Audit what your $60K/year in licenses actually delivers vs. what a portable artifact would
- Pick one workflow per team to rebuild — not retrofit — with AI
- Train your power users into internal champions, not Glean admins
- *Together we'd run a Thesis Sprint to scope your next AI build.*

**Sample focus bullets — Level 3 (Workflow Redesign):**
- Map vendor lock-in: which workflows depend on a SaaS you can't migrate off?
- Move sensitive context out of vendor wrappers and into artifacts you own
- Identify the next two high-leverage processes — internal ops vs. customer-facing
- *Together we'd run a Sprint and decide build vs. buy.*

*Level 4 — Operator:*
- Audit your stack for vendor lock-in — what's portable, what's trapped behind a SaaS API?
- Move from custom GPTs to a real harness (Claude Code, Cursor, repo-based context)
- Architect for the model swap — assume the LLM under you will change every 6 months
- Build evals so you can prove your prompts work, not just *feel* like they do
- *Together we'd build your portable OS, ship it to Git, and hand it off.*

**Sample focus bullets — Level 0 (Banned / Blind):**
- Get clear on what you're actually risking by waiting — competitors aren't
- Resolve compliance and data concerns with a real plan, not blanket fear
- Run one sanctioned 90-day pilot in a low-risk function (research, internal docs, hiring loops)
- Pick a champion: one senior leader who'll learn this in front of the org
- *Together we'd start with a 60-minute leadership briefing and a Thesis Sprint scoped to your risk tolerance.*

**Sample focus bullets — Level 1 (Shadow Use):**
- Acknowledge what's already happening — your team is using it, you're just not seeing it
- Survey actual usage anonymously. The answers will surprise you
- Sanction one tool officially, with a usage policy, and watch productivity step-change
- Identify your power users — they're your future internal champions
- *Together we'd run a leadership cohort and ship a sanctioned-tool rollout plan.*

**Sample focus bullets — Level 4 (Internal Builders):**
- Build an evals practice — without it, you're shipping AI on vibes
- Centralize your prompt library so engineers stop reinventing
- Pick the next strategic build vs. buy — most teams over-buy at this stage
- Train the next 20% of your org to operate at this level
- *Together we'd run a Team Cohort for the next-tier operators and a Sprint on the next strategic build.*

**Sample focus bullets — Level 5 (AI-Native):**
- You don't need a coach. You need a sparring partner for the experiments that haven't worked yet
- Or a build partner for the things you don't have time to make
- Or a guide for the rest of your org — most companies at Lv 5 in product are still Lv 2 in ops
- *Together we'd talk Implementation, Team Enablement, or just trade notes.*

**Footer of calculator section:**
*Want a written assessment and a proposal scoped to your level?*
`Send me your levels →` (prefilled email or form, no gate)

---

## Services overview (on home — abbreviated)

**Eyebrow:** What I do

**Headline:**
Three ways to work together.

**Three cards linking to the deep pages:**

**AI Operator** — *1:1 coaching*
Personal AI fluency. Custom OS. A weekly thinking partner.
Best for: founders, executives, individual operators.
**$1.5–3.5K/month →**

**Thesis Sprint + Build** — *implementation*
A 2-week sprint to find the right AI bet, prototype it, and validate it. Then we build it together — or hand you a plan to build in-house.
Best for: SaaS teams, service businesses, portfolio companies.
**Sprint $7.5–20K · Build scoped after →**

**Team Cohort** — *enablement*
A 4-week cohort that turns your team into AI operators. Workshop format, hands-on, every member leaves with their own working artifact.
Best for: deal teams, leadership groups, ops teams.
**$15–30K →**

**Below the cards (small text):**
*All deliverables are yours to keep — code, docs, prompts, configs. No retainer required after handoff.*

---

## Selected Work (preview on home)

**Eyebrow:** Selected work

**Headline:**
Real artifacts. Real businesses. Yours when we're done.

**Cards (3, linking to /work):**

**Rent A Pool Boise** — *home services startup*
Brand, marketing site, interactive estimator with Google Maps service-area validation, GA4 funnel, Google Sheets back-office connected via Apps Script. Zero to operational in weeks.

**[Azure Health]** — *integrative health practice*
[CONFIRM specifics — what was built and what shifted. Currently I have web/brand work; if there's an AI component to highlight, fill in here.]

**Personal AI Operating System** — *built for myself, used daily*
File-structured identity, thinking models, CRM, projects, goals. A LinkedIn analyzer that reads 6,000 connections and ranks them weekly. Automated lead generation. Live, running, every day.

`See all work →`

---

## Field Notes (home pull)

**Eyebrow:** Field Notes

**Headline:**
Things I'm thinking about. Posted occasionally. Read at your leisure.

**Body:** [Auto-pull latest 3 posts from gabeblanchet.substack.com via RSS — title, date, 1-line excerpt, link out.]

`Read Field Notes ↗` (links out to substack)

---

## Contact / CTA

**Eyebrow:** Get started

**Headline:**
Two ways in.

**Body:**
**1. Run the calculator above.** Pick your level, see what I'd focus on, send me your levels with a sentence about your business.

**2. Just book a call.** 30 minutes, no slides, no pitch. We'll find your biggest AI leverage in one conversation.

**Form fields:**
- Name
- Email
- I'm a... *(Founder/Exec, SaaS team, Service business, Investment firm, Other)*
- Engagement type *(Coaching, Implementation, Team Enablement, Not sure yet)*
- One sentence about what you're trying to do
- *(optional)* Your levels: I'm at Lv \_\_, We're at Lv \_\_

**Button:** `Send →`

**Below form:** Or email me directly: gblanchet3@gmail.com

---

# /SERVICES/COACHING — AI Operator

## Hero

**Eyebrow:** AI Operator

**Headline:**
Become the person on your team everyone goes to with the AI question.

**Subhead:**
A 1:1 engagement. We build your personal AI operating system together — your context, your prompts, your workflows. You leave with fluency you didn't have, and artifacts that compound.

## Who this is for

You're a founder, executive, or senior operator. You see what AI is doing and don't want to fall behind. You've tried ChatGPT and felt the gap between "I used it once" and "I have it baked into how I think." You want a guide, not a course.

## What we do, week by week

**Week 1: Diagnostic + first wins.** I learn your business, your style, your goals. We pick 2-3 recurring workflows and rebuild them with AI in front of you. By the end of week 1 you're saving real hours.

**Weeks 2-4: Build your OS.** Identity doc, decision frameworks, project structures, key-people CRM. The same architecture I run my own life on, customized to yours.

**Weeks 5-8: Compound.** We work on whatever's live in your week. Memos, decisions, hiring, board prep, strategy. AI becomes a co-worker, not a tool.

**Ongoing.** Monthly cadence after the intensive. New problems, new prompts, new artifacts.

## What you get

- Weekly 60–90 minute working session
- Async access between sessions (Signal, weekday hours)
- Your personal AI OS — yours forever, portable, forkable
- A decision log of every recommendation, every rationale
- Office hours during onboarding

## Pricing

**Intensive (first 4 weeks):** $4,000/month
**Ongoing (monthly):** $1,500–$2,500/month depending on cadence
**One-time setup option:** Two weeks, $5,000 fixed, leaves you with a working personal OS and weekly habits.

*All artifacts are yours to keep. Cancel any time. No retainer trap.*

`Book a coaching intro →`

---

# /SERVICES/IMPLEMENTATION — Thesis Sprint + Build & Hand-off

## Hero

**Eyebrow:** Implementation

**Headline:**
Find the bet worth making. Build the thing that makes it. Or hand you the plan and let your team ship it.

**Subhead:**
Most AI consulting jumps straight to "let's build a chatbot." I don't. The biggest leverage usually shows up two questions earlier — *what should we be building, and have we proven it works?* The Thesis Sprint answers those. The Build phase ships them.

## The Method: Thesis → Prototype → Validate → Scale

**Phase 1: Thesis (week 1).**
What problem are we actually solving? Internal ops or product? Where does AI move the needle and where is it noise? We map your business, your stack, your data, your moats. By Friday you have a written, opinionated thesis with two or three candidate bets.

**Phase 2: Prototype (week 2).**
The thesis is real because we can show it working. We build a real prototype — not a slideware mockup. Code, prompts, configs, working calls. Cost of building has collapsed. We use that.

**Phase 3: Validate.**
Real users, real data, real signal. Sometimes 1 hour of testing is enough. Sometimes a 2-week pilot. We size validation to risk — not to bill more hours.

**Phase 4: Scale (your call).**
Three paths from here:
- **We build it with you** — 4–8 week project. You own everything.
- **We hand you a plan** — your team builds. We're available for spot consulting.
- **You don't build it** — and saved yourself $200K. (This happens. We celebrate when it does.)

## Why this method

**Cost of building has collapsed.** A working AI prototype that took a team a quarter in 2023 takes a builder a week now. So we don't validate before building — we build *to* validate. Faster, cheaper, more honest.

**Sovereignty by default.** Every artifact — code, prompts, prompts library, configs, infra — lives in a repo *you* own. We use vanilla tools (Claude Code, GitHub, your cloud) so you can swap models, harnesses, or vendors as the market evolves. No proprietary middleware.

**The exit is the offer.** I don't optimize for retainer expansion. The cleanest engagement is one that ends with you running.

## What you get

- Written thesis document (yours, branded with your context)
- Working prototype (repo, deployed somewhere your team can poke at it)
- Validation report with quantitative signal where possible
- Scale plan: cost, time, team needs, vendor recommendations, what to build vs. buy
- Decision log

## Pricing

**Thesis Sprint:** $7,500–$20,000 fixed. Scope set on intro call.
**Build & Hand-off:** Scoped after the Sprint. Typical engagements run $30,000–$100,000.
**Plan-only hand-off:** $0 additional — included in Sprint deliverables.

*All deliverables are yours to keep. We bring the muscle. You keep the artifact.*

`Start with a Thesis Sprint →`

---

# /SERVICES/ENABLEMENT — Team Cohort

## Hero

**Eyebrow:** Team Enablement

**Headline:**
Train your team to build their own AI artifacts. Not consume someone else's.

**Subhead:**
A 4-week, hands-on cohort. Every team member leaves with a working AI artifact built for their own job — not a watched video, not a certificate, a *thing they made*. Designed for deal teams, leadership groups, and ops teams that need to move fast together.

## Who this is for

- **PE / VC firms** — deal teams that want AI as a sourcing and diligence advantage
- **Leadership teams** — execs who want shared fluency before pushing AI down through the org
- **Ops teams** — operators who need the muscle to ship internal automations themselves

## What happens

**Week 1: Foundations.** What AI actually is in 2026. How to talk to models. Personal context. Everyone leaves with their first custom prompt system.

**Week 2: Workflow rebuild.** Each participant picks a real recurring task from their own job. We rebuild it together. Live.

**Week 3: Build & ship.** Each participant ships an artifact — a memo generator, a sourcing helper, a diligence summarizer, a writing assistant. Working code, deployed.

**Week 4: Compounding & ownership.** How to keep going. How to share artifacts across the team. How to evaluate vendors. Your team's own AI playbook, written together, yours forever.

## What you get

- 4 weekly 90-minute live sessions (recorded)
- Async support channel (Slack/Signal) between sessions
- Each participant: their own AI artifact, in a repo they own
- Team playbook — shared standards, shared prompts, shared tooling
- Optional follow-up coaching block at preferred rate

## Pricing

- **4–8 person cohort:** $15,000
- **8–16 person cohort:** $25,000
- **Full deal team / leadership team (custom scope):** $35,000+

*Includes all materials, recordings, and team artifacts. Materials are yours to keep and reuse.*

`Talk to me about a cohort →`

---

# /CUSTOMERS/FOUNDERS — Founders & Executives

## Hero

**Eyebrow:** For founders & executives

**Headline:**
The fastest way to stop falling behind.

**Subhead:**
You're running a company, a fund, or a team. You don't have time to take a course. You also don't have time to *not* know this stuff. I sit with you, on your real work, and make you fluent in the thing that's about to define the next decade.

## What I see again and again

You've tried ChatGPT. Maybe you have a paid Claude subscription. You know smart people who post about it constantly. But your *own* day still looks the same as it did 18 months ago. Same email, same memos, same hiring loops, same decisions.

The gap isn't access. It's reps with a guide.

## How working with me looks

**Discovery week.** I learn your business, your week, your style. We pick the workflows where AI would actually move you.

**Working sessions.** Weekly. We work on whatever's live — board prep, hiring, fundraising, strategy memos, market research, decision-making. AI is in front of us the whole time.

**Your own OS.** By month two you have a personal operating system — file-structured identity, decision frameworks, CRM, project tracking, voice tuning — that runs in vanilla AI tools. Portable. Yours. Forkable.

**The exit.** You don't need me forever. We dial down to monthly, then quarterly, then "text me when something's weird."

## What changes

- Memos that read like you, drafted in 20 minutes
- Hiring loops with AI-assisted candidate prep and reference work
- Board materials drafted from raw data, in your voice
- Recurring decisions codified so you stop relitigating
- A weekly digest that surfaces what you'd otherwise miss

## Selected client outcomes

[CONFIRM — current real examples to use here. Possibilities: weekly digest savings, faster memo drafting, hours/week recovered. Need real numbers or anonymized stories Gabe is comfortable putting in writing.]

## Pricing

**Intensive month:** $4,000
**Ongoing:** $1,500–$2,500/month
**Standalone setup:** $5,000 fixed for a 2-week build of your personal OS

`Start with a coaching intro →`

---

# /CUSTOMERS/SAAS — SaaS / Software Companies

## Hero

**Eyebrow:** For SaaS & software companies

**Headline:**
Your AI roadmap shouldn't be your competitor's roadmap with a logo swap.

**Subhead:**
Most software companies are bolting AI onto existing UIs because everyone else is. The ones that win are the ones rebuilding their core workflows around what AI actually makes possible. I've been head of product at a venture-backed legal SaaS through this exact transition. I know where the leverage is — and where the traps are.

## Where I tend to add value

**Product strategy & thesis.** What should you actually build? Where does AI compress the workflow vs. just decorate it? Where does it eat your moat?

**Internal AI operations.** Your engineers, designers, PMs, and CSMs all need fluency. The companies whose teams ship AI-augmented work daily move 3x faster than the ones who don't.

**Build with the right scaffolding.** Most "AI features" are SaaS wrappers around someone else's API. We build with sovereignty in mind — your context, your prompts, your evals — so when the model market shifts (and it will, every 6 months), you swap engines without rebuilding.

## My background here

- **Head of Product at LeanLaw** through the pivot from SaaS billing into payments and financial services
- **CTO/co-founder at Revonate**
- **Co-founder at Grove Labs** — $6M raised, acquired by LG
- **Earlier:** Imbellus, GrabCAD

I've shipped product at venture scale, run engineering teams, and seen how AI gets adopted — and rejected — inside real software orgs.

## How we'd typically engage

- **Coaching block** for founder/CEO/CPO — 1:1, 30–60 days, $4,000/mo
- **Thesis Sprint** for the product or engineering team — 2 weeks, $7.5–20K, ends with a written AI strategy + working prototype
- **Team Cohort** for product, eng, or CS leadership — 4 weeks, $15–30K
- **Build & Hand-off** for a specific high-leverage feature — scoped after Sprint

`Talk to me about your AI roadmap →`

---

# /CUSTOMERS/SERVICES — Service Businesses

## Hero

**Eyebrow:** For service businesses

**Headline:**
The single highest-leverage hire you can make right now isn't a person.

**Subhead:**
Service businesses — real estate, construction, professional services, home services — are sitting on top of the most automatable workflows in the economy. Quoting, scheduling, knowledge capture, client comms, lead gen. I build the systems that turn those workflows from labor into leverage. And I leave them with you when we're done.

## Where I tend to add value

**Knowledge capture before it walks out the door.** Senior people — admins, project managers, estimators — carry 20 years of context in their heads. When they retire or leave, that context goes with them. We codify it into a system your team can query forever.

**Sales hubs and account intelligence.** AI-powered briefs on your top customers, suppliers, prospects — pulled together automatically, updated weekly. The kind of thing your top rep does manually, scaled across the team.

**Quote / estimate / scope automation.** Interactive estimators, service-area validation, dynamic pricing logic — the stuff that turns a 2-hour quote process into a 10-minute one.

**Lead gen and back-office plumbing.** Funnel tracking, automated follow-ups, Sheets-based ops dashboards. Boring, high-leverage, often the highest-ROI work in the engagement.

## My background here

I grew up around general contracting and have spent years working with service businesses. I built **Rent A Pool Boise** from a business idea to a fully operational service business in weeks — brand, marketing site, interactive estimator with Google Maps service-area validation, early-bird pricing logic, GA4 funnel, and a Google Sheets back-office on Apps Script. The whole thing runs on tools the owner already understood.

That's the pattern: I build the system, *they* keep running it.

## How we'd typically engage

- **Thesis Sprint** — 2 weeks, $7.5–20K. Map the highest-leverage automation in your business, prototype it, prove it works
- **Build & Hand-off** — scoped after Sprint, typical $30–80K
- **Coaching for the owner/operator** — $1.5–3.5K/mo for ongoing fluency

`Start with a Sprint →`

---

# /CUSTOMERS/INVESTMENT — Investment Firms

## Hero

**Eyebrow:** For PE, VC & investment firms

**Headline:**
AI fluency for the deal team. AI uplift for the portfolio.

**Subhead:**
Investment firms have two AI problems: making the deal team faster, and getting portfolio companies adopted without a $60K/year SaaS bill per company. I work on both.

## What I do for deal teams

- **Sourcing** — AI-augmented research, target lists, market maps. Cuts hours off the weekly motion
- **Diligence** — memo drafting, document review, market sizing, expert call prep
- **IC prep** — automated brief generation in your fund's voice and template
- **Personal coaching for partners and principals** — same pattern as founders/execs

## What I do for portfolio companies

- **Drop-in coaching for portfolio CEOs** — 30–60 day blocks, $4,000/mo
- **Thesis Sprints** for portfolio companies trying to figure out where AI applies
- **Implementation builds** for portfolio companies that need execution muscle
- **Team cohorts** for ops teams or leadership groups inside portfolio companies

The model is portable. The artifacts stay with the company. When the company exits, your AI investment doesn't walk away with a vendor.

## Why this works for funds

- **Block-hours pricing** for repeated portfolio support — predictable, recurring, billable to fund or LP-friendly
- **No vendor lock-in** for portfolio cos — sovereignty is the default, which matters at exit
- **One operator, multiple portcos** — consistent quality, consistent playbook

## How we'd typically start

A 30-minute call to map your deal team's current AI use, your portfolio's appetite, and 2–3 candidate engagements. From there, either a deal-team cohort, a coaching block for a portfolio CEO, or a Thesis Sprint with a portco that's ready.

`Talk to me about a fund engagement →`

---

# /WORK — Selected Work

## Hero

**Eyebrow:** Selected work

**Headline:**
Real artifacts. Real businesses. Yours when we're done.

**Body:**
A short list. Most of my work is under NDA or in-flight. These are the ones I can show. If you want to see something specific to your industry, ask — I usually have something I can share over a call.

---

### Rent A Pool Boise — *home services startup*

**The brief:** A founder came to us with a business idea — temporary pool rental and install in the Boise market — and no technical infrastructure.

**What we built:** Brand identity. Consumer marketing site. Interactive estimator with Google Maps service-area validation, early-bird pricing logic, partial-lead capture, and GA4 funnel tracking. Back-office ops system on Google Sheets, connected via Apps Script. Zero to fully operational in weeks.

**What's portable:** The brand, the site, the estimator, the back-office logic — all tools the founder already understood (Sheets, Apps Script, vanilla web). No proprietary lock-in. He runs it himself.

`rentapoolboise.com ↗`

---

### Azure Health — *integrative health practice, Boise*

**The brief:** A practitioner — Amanda Blanchet, PA-C and Reiki Master — was launching an integrative practice in Boise combining nervous system regulation, energy work, and medically guided care. She needed a strategy and a credibility-grade web presence that could speak to two very different audiences (clinical and energetic) without losing either one.

**What I delivered:**
- Practice positioning and offer architecture — how to package services, how to talk about them, how to differentiate from both conventional medicine and the broader wellness market
- Full website implementation — design, build, content architecture, copy support
- Voice and visual system that holds clinical credibility and energetic warmth in the same breath

**What's portable:** A site she runs herself. A clear positioning her referrers and patients both understand. The whole practice was built on tools she could maintain without me.

`azurehealthco.com ↗`

---

### Personal AI Operating System — *built for myself, used daily*

**The brief:** I wanted a personal operating system that ran in vanilla AI tools — Claude, Markdown, Git — that I'd own forever and could fork into client work.

**What I built:**
- A file-structured personal OS — identity, thinking models, voice, network CRM, projects, goals
- A LinkedIn analyzer that reads 6,000+ connections and ranks them weekly for outreach
- Automated weekly lead generation surfacing 5–10 warm prospects
- A network warmth system tied to the CRM
- All in plain text, all in Git, all portable

**Why it matters:** This is the artifact behind the methodology. It's the thing I built first, that I dogfood every day, and that I help clients build versions of for themselves. If you want to see what an "AI-Native Lv 5" personal setup actually looks like, this is it.

---

### Operator background

Before Fieldwork, I was on the building side of:

- **LeanLaw** — Head of Product. Legal SaaS. Led evolution into payments / fintech
- **Maxable** — CEO. Marketplace platform
- **Revonate** — Co-founder, CTO
- **Imbellus** — Cognitive assessment startup
- **Grove Labs** — Co-founder. $6M raised. Acquired by LG
- **GrabCAD** — Engineering at the early team

Forbes 30 Under 30 (2015). MIT Mechanical Engineering.

This isn't a portfolio of consulting wins — it's the ops résumé behind the consulting. When I tell a SaaS CEO what to do with their roadmap, I've sat in their chair. When I tell a service business owner what to automate, I've built the systems myself.

---

# /ABOUT

## Hero

**Eyebrow:** About

**Headline:**
I'm Gabe. I build with people, not for them.

**Subhead:**
This is a one-person business with a small bench of senior operators when projects need depth. No agency overhead. No consultancy bloat. Direct access, fast cycles, portable artifacts.

## The longer version

I trained as a mechanical engineer at MIT, then spent the next decade building software companies. I co-founded Grove Labs out of school — we raised $6M, built a hardware-software product for indoor farming, and got acquired by LG. From there: Imbellus, Revonate (as CTO), Maxable (as CEO), and most recently LeanLaw, where I led product through the company's pivot from SaaS billing into payments and financial services.

Somewhere in there I walked the Appalachian Trail. 2,181 miles. Six months. It taught me a lot of things I still use, but the most useful one was this: the right pack is the one you can actually carry.

I think about software the same way. The right system is the one you can actually run.

## Why Fieldwork

The AI revolution is real, but most of what's being sold against it is bad — courses you won't finish, SaaS that locks your data behind someone else's UI, big-firm consultants who hand you a deck and disappear. None of that helps an operator actually use this stuff well.

What does help is sitting with someone, on their real work, and building artifacts they own. That's what I do.

## Principles

**Sovereignty over subscriptions.** Models are getting smarter and cheaper every quarter. Companies that own their context, prompts, and harness will compound. Companies that rent capability won't.

**Hand-holding over hype.** A course can't watch you struggle. I can. Every engagement involves real-time work on real problems, with someone who actually knows you.

**Build with you, not for you.** I'm not trying to be your AI department forever. I'm trying to make you the AI department you didn't know you could be.

**Ship the artifact, not the deck.** If you can't run it without me on Monday, I haven't done my job.

## How I work with others

I'm a one-person business by design — direct access, no overhead. When projects need specialized depth, I bring in a small bench of senior operators I've worked with for years: ex-product, ex-engineering, ex-PE, depending on the engagement. Right-sized teams, no consultancy bloat. You always know who's doing the work.

## Outside work

Boise, Idaho. Married to Amanda. Two kids — Winter (2) and Brooks (newborn) — and a dog named Kavu. I try to live what I write about: minimal noise, real artifacts, things you can actually use.

`Talk to me →`

---

# /CONTACT

## Hero

**Eyebrow:** Talk to me

**Headline:**
Two ways in.

**Body:**

**1. Run the calculator.** Find your level, send me your bullets. I'll come back with a written assessment and a proposal scoped to where you actually are. No template, no slides.

**2. Just book a 30-minute call.** No pitch deck. We'll find your biggest leverage in one conversation. If we're a fit, we'll talk about how to start. If we're not, I'll point you to someone who is.

## Form

- **Name**
- **Email**
- **I'm a...** *(Founder / Executive · SaaS team · Service business · Investment firm · Other)*
- **What I'm exploring** *(AI Operator coaching · Thesis Sprint · Build & Hand-off · Team Cohort · Not sure yet)*
- **One sentence about what you're trying to do**
- *(optional)* **My level / our level** — Lv \_\_ personal, Lv \_\_ company

**Button:** `Send →`

**Below form:**
Or email me directly at gblanchet3@gmail.com
Or text me — number on request after intro email.

---

# Footer

**Left:** Fieldwork AI — Personalized AI coaching & implementation. Boise, Idaho.

**Center (links):** Services · Customers · Work · About · Field Notes ↗ · Contact

**Right:** © 2026 Fieldwork AI. All artifacts owned by their respective clients.

---

# Open items / things I need from you

1. **Azure Health framing** — written as a real client engagement (which it is). Currently does NOT mention Amanda is your wife. My take: leave it off the public site — it reads more credibly as a standalone client. But flagging in case you want it disclosed somewhere (About page, footnote, etc.).
2. **Real outcome numbers** — for any engagement, even one anonymized line of "saved X hours/week" or "shipped in Y weeks" sharpens the case studies dramatically. Open question for you to fill in.
3. **Customer page outcomes** — each customer page has a "Selected client outcomes" placeholder (currently only on the Founders page). Do you want testimonials, anonymized stories, or just confidence statements? Affects how hard I lean into specific results.
4. **Coaching pricing structure** — kept tiered (Intensive $4K + Ongoing $1.5–2.5K + Setup $5K). Easy to collapse to flat if you want it simpler post-review.
5. **The "we" / "I" mix** — I used **I** on the home and About, **we** on Implementation & Enablement (where the bench framing kicks in), **I** on Coaching & Founders (1:1). Calibrate to taste.
6. **Should the home page show the calculator inline, or link out to /assess?** Currently designed inline. Inline = high engagement, more code. Linked page = cleaner home, dedicated URL to share. Default: inline.

---

*End of v1 draft. Ready for redline.*
