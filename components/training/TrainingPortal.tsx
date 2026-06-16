"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPortalData,
  findSessionByCode,
  agendaFor,
  promptsFor,
  exercisesFor,
  type PortalData,
  type Session,
} from "@/lib/training";

type SignOn = { name: string; trackId: string };
type Step = "code" | "name" | "course";

const signonKey = (sessionId: string) => `fw_training_signons_${sessionId}`;

function readSignOns(sessionId: string): SignOn[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(signonKey(sessionId)) || "[]");
  } catch {
    return [];
  }
}

function writeSignOn(sessionId: string, entry: SignOn) {
  const existing = readSignOns(sessionId).filter(
    (e) => e.name.toLowerCase() !== entry.name.toLowerCase()
  );
  const next = [entry, ...existing].slice(0, 100);
  localStorage.setItem(signonKey(sessionId), JSON.stringify(next));
}

export default function TrainingPortal() {
  const [data, setData] = useState<PortalData | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [step, setStep] = useState<Step>("code");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [chosenTrack, setChosenTrack] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [trackId, setTrackId] = useState("");

  useEffect(() => {
    getPortalData().then(setData).catch(() => setLoadError(true));
  }, []);

  // Previously signed-on names = local sign-ons ∪ pre-loaded roster (for this session).
  const knownPeople: SignOn[] = useMemo(() => {
    if (!data || !session) return [];
    const local = readSignOns(session.id);
    const roster = data.roster;
    const seen = new Set(local.map((p) => p.name.toLowerCase()));
    const merged = [...local];
    for (const r of roster) {
      if (!seen.has(r.name.toLowerCase())) merged.push(r);
    }
    return merged;
  }, [data, session, step]);

  const rosterTrackFor = (n: string): string | null =>
    knownPeople.find((p) => p.name.toLowerCase() === n.trim().toLowerCase())?.trackId ?? null;

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    const found = findSessionByCode(data, codeInput);
    if (!found) {
      setCodeError("That code didn't match a training. Check it and try again.");
      return;
    }
    setCodeError("");
    setSession(found);
    setStep("name");
  }

  function selectExistingPerson(p: SignOn) {
    if (!session) return;
    setName(p.name);
    setTrackId(p.trackId);
    writeSignOn(session.id, { name: p.name, trackId: p.trackId });
    setStep("course");
  }

  function submitNewName(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    const n = nameInput.trim();
    if (!n) return;
    const known = rosterTrackFor(n);
    const finalTrack = known ?? chosenTrack;
    if (!finalTrack) return; // track picker shows until chosen
    setName(n);
    setTrackId(finalTrack);
    writeSignOn(session.id, { name: n, trackId: finalTrack });
    setStep("course");
  }

  function signOut() {
    setStep("code");
    setSession(null);
    setCodeInput("");
    setNameInput("");
    setChosenTrack(null);
    setName("");
    setTrackId("");
  }

  // ── States ────────────────────────────────────────────────────────────────

  if (loadError) {
    return (
      <Shell>
        <p className="font-inter text-bone/70">
          Couldn&apos;t load the training portal. Refresh, or email{" "}
          <a href="mailto:gabe@getfieldworkai.com" className="text-amber underline">
            gabe@getfieldworkai.com
          </a>
          .
        </p>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell>
        <p className="font-inter text-bone/40 animate-pulse">Loading…</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <AnimatePresence mode="wait">
        {step === "code" && (
          <Fade key="code">
            <CodeStep
              company={data.company.name}
              tagline={data.company.tagline}
              codeInput={codeInput}
              setCodeInput={setCodeInput}
              error={codeError}
              onSubmit={submitCode}
            />
          </Fade>
        )}

        {step === "name" && session && (
          <Fade key="name">
            <NameStep
              session={session}
              knownPeople={knownPeople}
              tracks={data.tracks}
              nameInput={nameInput}
              setNameInput={setNameInput}
              chosenTrack={chosenTrack}
              setChosenTrack={setChosenTrack}
              rosterTrackFor={rosterTrackFor}
              onSelectExisting={selectExistingPerson}
              onSubmitNew={submitNewName}
              onBack={signOut}
            />
          </Fade>
        )}

        {step === "course" && session && (
          <Fade key="course">
            <CourseView
              data={data}
              session={session}
              name={name}
              trackId={trackId}
              onSignOut={signOut}
            />
          </Fade>
        )}
      </AnimatePresence>
    </Shell>
  );
}

// ── Layout shell ──────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative bg-slate min-h-screen pt-28 pb-24 md:pt-36 overflow-hidden">
      <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 25%, transparent 45%, #0F1923 100%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">{children}</div>
    </section>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ── Step 1: access code ─────────────────────────────────────────────────────

function CodeStep({
  company,
  tagline,
  codeInput,
  setCodeInput,
  error,
  onSubmit,
}: {
  company: string;
  tagline: string;
  codeInput: string;
  setCodeInput: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="max-w-md mx-auto text-center pt-8">
      <p className="section-label text-amber mb-5">Training Portal</p>
      <h1 className="font-syne font-semibold text-3xl md:text-5xl tracking-tightest text-white leading-[1.05] mb-3">
        {company}
      </h1>
      <p className="font-inter text-bone/60 mb-10">{tagline}</p>

      <form onSubmit={onSubmit} className="text-left">
        <label className="section-label text-bone/40 block mb-2">Access code</label>
        <input
          autoFocus
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="e.g. RN-FOUNDATIONS"
          className="w-full bg-white/5 border border-white/15 focus:border-amber text-white font-inter tracking-wide px-4 py-3.5 outline-none transition-colors placeholder:text-bone/25 uppercase"
          aria-label="Access code"
        />
        {error && <p className="font-inter text-sm text-amber mt-3">{error}</p>}
        <button
          type="submit"
          className="w-full mt-5 font-inter text-sm font-medium bg-amber text-white px-5 py-3.5 hover:bg-[#C06A1F] transition-colors"
        >
          Enter
        </button>
      </form>
      <p className="font-inter text-xs text-bone/30 mt-6">
        No password needed. Your code came from your training invite.
      </p>
    </div>
  );
}

// ── Step 2: who are you ─────────────────────────────────────────────────────

function NameStep({
  session,
  knownPeople,
  tracks,
  nameInput,
  setNameInput,
  chosenTrack,
  setChosenTrack,
  rosterTrackFor,
  onSelectExisting,
  onSubmitNew,
  onBack,
}: {
  session: Session;
  knownPeople: SignOn[];
  tracks: PortalData["tracks"];
  nameInput: string;
  setNameInput: (v: string) => void;
  chosenTrack: string | null;
  setChosenTrack: (v: string) => void;
  rosterTrackFor: (n: string) => string | null;
  onSelectExisting: (p: SignOn) => void;
  onSubmitNew: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  const [adding, setAdding] = useState(knownPeople.length === 0);
  const matchedTrack = rosterTrackFor(nameInput);
  const needsTrackPick = nameInput.trim().length > 0 && !matchedTrack;

  return (
    <div className="max-w-lg mx-auto pt-8">
      <button
        onClick={onBack}
        className="font-inter text-sm text-bone/40 hover:text-bone/80 transition-colors mb-6 inline-flex items-center gap-1.5"
      >
        ← Different code
      </button>

      <p className="section-label text-amber mb-3">{session.title}</p>
      <h2 className="font-syne font-semibold text-2xl md:text-3xl tracking-tighter text-white mb-8">
        Who&apos;s joining?
      </h2>

      {!adding && knownPeople.length > 0 && (
        <div className="space-y-2 mb-6">
          {knownPeople.map((p) => {
            const track = tracks.find((t) => t.id === p.trackId);
            return (
              <button
                key={p.name}
                onClick={() => onSelectExisting(p)}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber/50 px-5 py-4 transition-colors text-left group"
              >
                <span className="font-inter text-white">{p.name}</span>
                <span className="font-inter text-xs text-bone/40 group-hover:text-amber transition-colors">
                  {track?.label ?? "Choose track"} →
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setAdding(true)}
            className="w-full text-center font-inter text-sm text-bone/50 hover:text-amber transition-colors py-3"
          >
            + I&apos;m not on the list
          </button>
        </div>
      )}

      {adding && (
        <form onSubmit={onSubmitNew}>
          {knownPeople.length > 0 && (
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="font-inter text-sm text-bone/40 hover:text-bone/80 transition-colors mb-4 inline-block"
            >
              ← Back to the list
            </button>
          )}
          <label className="section-label text-bone/40 block mb-2">Your name</label>
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="First and last name"
            className="w-full bg-white/5 border border-white/15 focus:border-amber text-white font-inter px-4 py-3.5 outline-none transition-colors placeholder:text-bone/25"
          />

          {matchedTrack && (
            <p className="font-inter text-sm text-bone/50 mt-3">
              Welcome back — we&apos;ll open your{" "}
              <span className="text-amber">
                {tracks.find((t) => t.id === matchedTrack)?.label}
              </span>{" "}
              course.
            </p>
          )}

          {needsTrackPick && (
            <div className="mt-6">
              <label className="section-label text-bone/40 block mb-3">Pick your track</label>
              <div className="space-y-2">
                {tracks.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setChosenTrack(t.id)}
                    className={`w-full text-left px-4 py-3 border transition-colors ${
                      chosenTrack === t.id
                        ? "border-amber bg-amber/10"
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    }`}
                  >
                    <p className="font-inter text-white text-sm font-medium">{t.label}</p>
                    <p className="font-inter text-xs text-bone/40 mt-0.5">{t.audience}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!nameInput.trim() || (needsTrackPick && !chosenTrack)}
            className="w-full mt-6 font-inter text-sm font-medium bg-amber text-white px-5 py-3.5 hover:bg-[#C06A1F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Open my course →
          </button>
        </form>
      )}
    </div>
  );
}

// ── Step 3: the course ──────────────────────────────────────────────────────

function CourseView({
  data,
  session,
  name,
  trackId,
  onSignOut,
}: {
  data: PortalData;
  session: Session;
  name: string;
  trackId: string;
  onSignOut: () => void;
}) {
  const track = data.tracks.find((t) => t.id === trackId);
  const agenda = agendaFor(data, session.id, trackId);
  const prompts = promptsFor(data, trackId);
  const exercises = exercisesFor(data, session.id, trackId);
  const firstName = name.split(" ")[0];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-3">
        <div>
          <p className="section-label text-amber mb-3">{session.title}</p>
          <h1 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-white">
            Welcome, {firstName}.
          </h1>
        </div>
        <button
          onClick={onSignOut}
          className="font-inter text-sm text-bone/40 hover:text-bone/80 transition-colors self-start md:self-auto"
        >
          Sign out
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-8 font-inter text-sm text-bone/50">
        {track && (
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            {track.label} track
          </span>
        )}
        <span>·</span>
        <span>{session.durationLabel}</span>
        <span>·</span>
        <span>{session.location}</span>
        {session.date && session.date !== "TBD" && (
          <>
            <span>·</span>
            <span>{session.date}</span>
          </>
        )}
      </div>

      <p className="font-inter text-bone/70 leading-body max-w-2xl mb-12 border-l-2 border-amber/40 pl-4">
        {session.overview}
      </p>

      <Section label="Agenda" title="What we'll cover">
        <ol className="space-y-0 border-t border-white/10">
          {agenda.map((a, i) => (
            <li
              key={i}
              className="flex gap-5 md:gap-8 py-5 border-b border-white/10"
            >
              <span className="font-syne text-amber text-sm tabular-nums pt-0.5 w-12 shrink-0">
                {a.time}
              </span>
              <div>
                <p className="font-inter text-white font-medium">{a.title}</p>
                <p className="font-inter text-sm text-bone/50 mt-1 leading-body">{a.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="Prompt library" title="Copy, paste, make it yours">
        <p className="font-inter text-sm text-bone/50 -mt-3 mb-6 max-w-2xl">
          These are starting points tuned for your work. Replace anything in [brackets] with your
          real details.
        </p>
        <div className="space-y-3">
          {prompts.map((p, i) => (
            <PromptCard key={i} category={p.category} title={p.title} useCase={p.useCase} prompt={p.prompt} />
          ))}
        </div>
      </Section>

      <Section label="Hands-on" title="Try it before you leave">
        <div className="grid md:grid-cols-2 gap-4">
          {exercises.map((ex, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6">
              <p className="font-syne font-semibold text-white text-lg mb-1">{ex.title}</p>
              <p className="font-inter text-sm text-bone/50 mb-4 leading-body">{ex.goal}</p>
              <ol className="space-y-2">
                {ex.steps.map((s, j) => (
                  <li key={j} className="flex gap-3 font-inter text-sm text-bone/70">
                    <span className="text-amber font-syne shrink-0">{j + 1}.</span>
                    <span className="leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-16 pt-8 border-t border-white/10 text-center">
        <p className="font-inter text-sm text-bone/40">
          Stuck or want to go deeper? {data.company.contact}
        </p>
      </div>
    </div>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-14">
      <p className="section-label text-amber mb-2">{label}</p>
      <h2 className="font-syne font-semibold text-2xl tracking-tighter text-white mb-6">{title}</h2>
      {children}
    </div>
  );
}

function PromptCard({
  category,
  title,
  useCase,
  prompt,
}: {
  category: string;
  title: string;
  useCase: string;
  prompt: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="bg-white/5 border border-white/10">
      <div className="flex items-start justify-between gap-4 p-5">
        <button onClick={() => setOpen(!open)} className="text-left flex-1">
          <span className="section-label text-bone/30">{category}</span>
          <p className="font-inter text-white font-medium mt-1.5">{title}</p>
          <p className="font-inter text-sm text-bone/50 mt-1 leading-snug">{useCase}</p>
        </button>
        <button
          onClick={copy}
          className="shrink-0 font-inter text-xs font-medium border border-amber/50 text-amber px-3 py-2 hover:bg-amber hover:text-white transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 pb-2 text-left font-inter text-xs text-bone/40 hover:text-amber transition-colors"
      >
        {open ? "Hide prompt ▲" : "Show prompt ▼"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <code className="block whitespace-pre-wrap font-inter text-sm text-bone/70 leading-body bg-black/20 border-t border-white/10 px-5 py-4">
              {prompt}
            </code>
          </motion.pre>
        )}
      </AnimatePresence>
    </div>
  );
}
