"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getPortalData,
  findSessionByCode,
  buildCurriculum,
  type Block,
  type FlatLesson,
  type ModuleWithLessons,
  type PortalData,
  type Session,
} from "@/lib/training";

type SignOn = { name: string; trackId: string };
type Step = "code" | "name" | "course";

// ── localStorage helpers ──────────────────────────────────────────────────────

const signonKey = (sessionId: string) => `fw_training_signons_${sessionId}`;
const progressKey = (sessionId: string, name: string) =>
  `fw_training_progress_${sessionId}_${name.trim().toLowerCase()}`;

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
  localStorage.setItem(signonKey(sessionId), JSON.stringify([entry, ...existing].slice(0, 100)));
}
function readProgress(sessionId: string, name: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(progressKey(sessionId, name)) || "[]");
  } catch {
    return [];
  }
}
function writeProgress(sessionId: string, name: string, ids: string[]) {
  localStorage.setItem(progressKey(sessionId, name), JSON.stringify(ids));
}

// ── Root ───────────────────────────────────────────────────────────────────────

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

  const knownPeople: SignOn[] = useMemo(() => {
    if (!data || !session) return [];
    const local = readSignOns(session.id);
    const seen = new Set(local.map((p) => p.name.toLowerCase()));
    return [...local, ...data.roster.filter((r) => !seen.has(r.name.toLowerCase()))];
  }, [data, session, step]);

  const rosterTrackFor = (n: string): string | null =>
    knownPeople.find((p) => p.name.toLowerCase() === n.trim().toLowerCase())?.trackId ?? null;

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    const found = findSessionByCode(data, codeInput);
    if (!found) return setCodeError("That code didn't match a training. Check it and try again.");
    setCodeError("");
    setSession(found);
    setStep("name");
  }

  function selectExisting(p: SignOn) {
    if (!session) return;
    setName(p.name);
    setTrackId(p.trackId);
    writeSignOn(session.id, p);
    setStep("course");
  }

  function submitNewName(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    const n = nameInput.trim();
    if (!n) return;
    const finalTrack = rosterTrackFor(n) ?? chosenTrack;
    if (!finalTrack) return;
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

  if (loadError) {
    return (
      <Page center>
        <p className="font-inter text-steel">
          Couldn&apos;t load the training portal. Refresh, or email{" "}
          <a href="mailto:gabe@getfieldworkai.com" className="text-amber underline">
            gabe@getfieldworkai.com
          </a>
          .
        </p>
      </Page>
    );
  }
  if (!data) {
    return (
      <Page center>
        <p className="font-inter text-steel animate-pulse">Loading…</p>
      </Page>
    );
  }

  if (step === "course" && session) {
    return (
      <CoursePlayer
        data={data}
        session={session}
        name={name}
        trackId={trackId}
        onSignOut={signOut}
      />
    );
  }

  return (
    <Page center>
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
              onSelectExisting={selectExisting}
              onSubmitNew={submitNewName}
              onBack={signOut}
            />
          </Fade>
        )}
      </AnimatePresence>
    </Page>
  );
}

// ── Light page shell (overrides the site's dark theme) ──────────────────────────

function Page({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className="min-h-screen bg-bone text-slate font-inter">
      <div
        className={`max-w-xl mx-auto px-6 ${center ? "min-h-screen flex flex-col justify-center py-16" : "py-16"}`}
      >
        {children}
      </div>
    </div>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const wordmark = (
  <span className="font-syne font-semibold text-lg tracking-tight text-slate">
    Fieldwork<span className="text-amber">.</span>AI
  </span>
);

// ── Step 1: access code ─────────────────────────────────────────────────────────

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
    <div className="text-center">
      <div className="mb-10">{wordmark}</div>
      <p className="section-label text-amber mb-4">Training Portal</p>
      <h1 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-2">
        {company}
      </h1>
      <p className="font-inter text-steel mb-10">{tagline}</p>

      <form onSubmit={onSubmit} className="text-left max-w-sm mx-auto">
        <label className="section-label text-steel block mb-2">Access code</label>
        <input
          autoFocus
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="e.g. RN-FOUNDATIONS"
          className="w-full bg-white border border-dust focus:border-amber text-slate font-inter px-4 py-3.5 outline-none transition-colors placeholder:text-steel/40 uppercase tracking-wide"
          aria-label="Access code"
        />
        {error && <p className="font-inter text-sm text-amber mt-3">{error}</p>}
        <button
          type="submit"
          className="w-full mt-5 font-inter text-sm font-medium bg-slate text-bone px-5 py-3.5 hover:bg-olive transition-colors"
        >
          Enter
        </button>
      </form>
      <p className="font-inter text-xs text-steel/70 mt-6">
        No password needed. Your code came from your training invite.
      </p>
    </div>
  );
}

// ── Step 2: who are you ───────────────────────────────────────────────────────

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
    <div>
      <button
        onClick={onBack}
        className="font-inter text-sm text-steel hover:text-slate transition-colors mb-6"
      >
        ← Different code
      </button>
      <p className="section-label text-amber mb-2">{session.title}</p>
      <h2 className="font-syne font-semibold text-2xl md:text-3xl tracking-tighter text-slate mb-8">
        Who&apos;s joining?
      </h2>

      {!adding && knownPeople.length > 0 && (
        <div className="space-y-2 mb-4">
          {knownPeople.map((p) => {
            const track = tracks.find((t) => t.id === p.trackId);
            return (
              <button
                key={p.name}
                onClick={() => onSelectExisting(p)}
                className="w-full flex items-center justify-between bg-white border border-dust hover:border-amber px-5 py-4 transition-colors text-left group"
              >
                <span className="font-inter text-slate">{p.name}</span>
                <span className="font-inter text-xs text-steel group-hover:text-amber transition-colors">
                  {track?.label ?? "Choose track"} →
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setAdding(true)}
            className="w-full text-center font-inter text-sm text-steel hover:text-amber transition-colors py-3"
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
              className="font-inter text-sm text-steel hover:text-slate transition-colors mb-4 inline-block"
            >
              ← Back to the list
            </button>
          )}
          <label className="section-label text-steel block mb-2">Your name</label>
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="First and last name"
            className="w-full bg-white border border-dust focus:border-amber text-slate font-inter px-4 py-3.5 outline-none transition-colors placeholder:text-steel/40"
          />
          {matchedTrack && (
            <p className="font-inter text-sm text-steel mt-3">
              Welcome back — opening your{" "}
              <span className="text-amber font-medium">
                {tracks.find((t) => t.id === matchedTrack)?.label}
              </span>{" "}
              course.
            </p>
          )}
          {needsTrackPick && (
            <div className="mt-6">
              <label className="section-label text-steel block mb-3">Pick your track</label>
              <div className="space-y-2">
                {tracks.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setChosenTrack(t.id)}
                    className={`w-full text-left px-4 py-3 border transition-colors ${
                      chosenTrack === t.id
                        ? "border-amber bg-amber/10"
                        : "border-dust bg-white hover:border-steel/50"
                    }`}
                  >
                    <p className="font-inter text-slate text-sm font-medium">{t.label}</p>
                    <p className="font-inter text-xs text-steel mt-0.5">{t.audience}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={!nameInput.trim() || (needsTrackPick && !chosenTrack)}
            className="w-full mt-6 font-inter text-sm font-medium bg-slate text-bone px-5 py-3.5 hover:bg-olive transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start the course →
          </button>
        </form>
      )}
    </div>
  );
}

// ── Step 3: the course player ────────────────────────────────────────────────

function CoursePlayer({
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
  const { modules, lessons } = useMemo(
    () => buildCurriculum(data, session.id, trackId),
    [data, session.id, trackId]
  );
  const track = data.tracks.find((t) => t.id === trackId);

  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Resume where the learner left off.
  useEffect(() => {
    const done = readProgress(session.id, name);
    setCompleted(new Set(done));
    const firstUndone = lessons.findIndex((l) => !done.includes(l.id));
    setActiveIndex(firstUndone === -1 ? 0 : firstUndone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id, name]);

  const active = lessons[activeIndex];

  // Mark the lesson complete once viewed.
  useEffect(() => {
    if (!active) return;
    setCompleted((prev) => {
      if (prev.has(active.id)) return prev;
      const next = new Set(prev).add(active.id);
      writeProgress(session.id, name, Array.from(next));
      return next;
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [active, session.id, name]);

  function go(i: number) {
    if (i < 0 || i >= lessons.length) return;
    setActiveIndex(i);
    setSidebarOpen(false);
  }

  const doneCount = lessons.filter((l) => completed.has(l.id)).length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const finished = doneCount === lessons.length && lessons.length > 0;

  return (
    <div className="min-h-screen bg-bone text-slate font-inter flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-bone/90 backdrop-blur border-b border-dust">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden text-slate p-1 -ml-1"
              aria-label="Toggle contents"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            {wordmark}
            <span className="hidden md:inline text-steel/50">·</span>
            <span className="hidden md:inline font-inter text-sm text-steel truncate">
              {session.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-inter text-sm text-steel">{name}</span>
            <button
              onClick={onSignOut}
              className="font-inter text-sm text-steel hover:text-slate transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-dust">
          <div className="h-full bg-amber transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          modules={modules}
          activeId={active?.id}
          completed={completed}
          onPick={go}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          trackLabel={track?.label}
          pct={pct}
        />

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto px-6 md:px-10 py-10 md:py-14">
            {active && (
              <AnimatePresence mode="wait">
                <motion.article
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="section-label text-amber mb-3">{active.moduleTitle}</p>
                  <h1 className="font-syne font-semibold text-3xl md:text-4xl tracking-tighter text-slate mb-8 leading-[1.1]">
                    {active.title}
                  </h1>
                  <div className="space-y-5">
                    {active.blocks.map((b, i) => (
                      <BlockView key={i} block={b} />
                    ))}
                  </div>
                </motion.article>
              </AnimatePresence>
            )}

            {finished && (
              <div className="mt-12 border border-olive/30 bg-olive/5 px-6 py-8 text-center">
                <p className="font-syne font-semibold text-2xl text-olive mb-1">Session complete ★</p>
                <p className="font-inter text-sm text-steel">
                  You&apos;ve finished every lesson in {session.title.replace(/^Session \d+ — /, "")}.
                </p>
              </div>
            )}

            {/* Footer nav */}
            <div className="mt-12 pt-6 border-t border-dust flex items-center justify-between">
              <button
                onClick={() => go(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="font-inter text-sm text-steel hover:text-slate transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ‹ Previous
              </button>
              <span className="font-inter text-xs text-steel/70">
                {activeIndex + 1} / {lessons.length}
              </span>
              <button
                onClick={() => go(activeIndex + 1)}
                disabled={activeIndex >= lessons.length - 1}
                className="font-inter text-sm font-medium bg-slate text-bone px-5 py-2.5 hover:bg-olive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next ›
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  modules,
  activeId,
  completed,
  onPick,
  open,
  onClose,
  trackLabel,
  pct,
}: {
  modules: ModuleWithLessons[];
  activeId?: string;
  completed: Set<string>;
  onPick: (i: number) => void;
  open: boolean;
  onClose: () => void;
  trackLabel?: string;
  pct: number;
}) {
  const body = (
    <nav className="p-5" aria-label="Course contents">
      <div className="mb-5">
        <p className="section-label text-steel">Your track</p>
        <p className="font-inter text-sm font-medium text-slate mt-1">{trackLabel}</p>
        <p className="font-inter text-xs text-steel mt-2">{pct}% complete</p>
      </div>
      {modules.map((m) => (
        <div key={m.module.id} className="mb-5">
          <p className="font-syne font-semibold text-sm text-slate mb-1.5">{m.module.title}</p>
          <ul>
            {m.lessons.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => onPick(l.index)}
                  className={`w-full flex items-start gap-2.5 text-left py-2 pl-1 pr-2 transition-colors ${
                    l.id === activeId ? "text-slate" : "text-steel hover:text-slate"
                  }`}
                >
                  <Check done={completed.has(l.id)} active={l.id === activeId} />
                  <span
                    className={`font-inter text-sm leading-snug ${
                      l.id === activeId ? "font-medium" : ""
                    }`}
                  >
                    {l.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-dust bg-dust/30 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        {body}
      </aside>
      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-slate/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-bone border-r border-dust overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex justify-end p-3">
                <button onClick={onClose} aria-label="Close contents" className="text-steel p-1">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {body}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Check({ done, active }: { done: boolean; active: boolean }) {
  if (done) {
    return (
      <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-olive flex items-center justify-center">
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5L5 9l4.5-5" stroke="#F0EBE1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className={`shrink-0 mt-0.5 w-4 h-4 rounded-full border ${
        active ? "border-amber" : "border-steel/40"
      }`}
    />
  );
}

// ── Block renderer ─────────────────────────────────────────────────────────────

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="font-syne font-semibold text-xl text-slate tracking-tight pt-3">
          {block.text}
        </h2>
      );
    case "text":
      return <p className="font-inter text-slate/80 leading-body">{block.text}</p>;
    case "list":
      return block.ordered ? (
        <ol className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 font-inter text-slate/80 leading-snug">
              <span className="font-syne text-amber shrink-0">{i + 1}.</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 font-inter text-slate/80 leading-snug">
              <span className="text-amber shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout block={block} />;
    case "prompt":
      return <PromptBlock title={block.title} text={block.text} />;
    case "video":
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white border border-dust hover:border-amber px-5 py-4 transition-colors group"
        >
          <span className="shrink-0 w-9 h-9 rounded-full bg-amber/10 flex items-center justify-center group-hover:bg-amber/20 transition-colors">
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M3 2l7 4-7 4V2z" fill="#D97B2A" />
            </svg>
          </span>
          <span className="font-inter text-sm font-medium text-slate">{block.label}</span>
        </a>
      );
  }
}

const CALLOUT_STYLES: Record<
  string,
  { border: string; bg: string; label: string; tone: string; dot: string }
> = {
  note: { border: "border-steel/30", bg: "bg-steel/5", label: "Note", tone: "text-steel", dot: "bg-steel" },
  tip: { border: "border-amber/40", bg: "bg-amber/5", label: "Tip", tone: "text-amber", dot: "bg-amber" },
  warning: { border: "border-amber/50", bg: "bg-amber/10", label: "Important", tone: "text-amber", dot: "bg-amber" },
  exercise: { border: "border-olive/30", bg: "bg-olive/5", label: "Exercise", tone: "text-olive", dot: "bg-olive" },
};

function Callout({
  block,
}: {
  block: Extract<Block, { type: "callout" }>;
}) {
  const s = CALLOUT_STYLES[block.variant] ?? CALLOUT_STYLES.note;
  return (
    <div className={`border-l-2 ${s.border} ${s.bg} pl-4 pr-4 py-4`}>
      <p className={`section-label ${s.tone} mb-2`}>{block.title || s.label}</p>
      {block.text && <p className="font-inter text-sm text-slate/80 leading-body">{block.text}</p>}
      {block.items && (
        <ul className="space-y-1.5 mt-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 font-inter text-sm text-slate/80 leading-snug">
              <span className={`shrink-0 mt-1.5 w-1 h-1 rounded-full ${s.dot}`} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PromptBlock({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }
  return (
    <div className="bg-white border border-dust">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-dust">
        <span className="section-label text-steel">{title}</span>
        <button
          onClick={copy}
          className="font-inter text-xs font-medium border border-amber/50 text-amber px-3 py-1.5 hover:bg-amber hover:text-white transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-inter text-sm text-slate/80 leading-body px-4 py-3">
        {text}
      </pre>
    </div>
  );
}
