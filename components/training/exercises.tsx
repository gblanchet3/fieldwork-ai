"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Day-1 exercise blocks. Rendered by BlockView (default case).
// Each participates in the live backend (lib/fw-live) with a canned fallback so
// the portal is fully usable offline / on dead wifi.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { streamGenerate, capture, liveEnabled, fetchSharedContext, fetchSessionData, type ChatTurn } from "@/lib/fw-live";
import type { Block } from "@/lib/training";

export type ExerciseCtx = {
  sessionId: string;
  name: string;
  trackId: string;
  sessionCode: string; // for the QR deep-link (skips the access-code gate)
  lessonId: string; // current lesson, so the QR reopens this page
};

// localStorage key for a person's own context-file contributions (reused in 4b).
const ctxFileKey = (sessionId: string, name: string) =>
  `fw_ctxfile_${sessionId}_${name.trim().toLowerCase()}`;

// ── shared streaming hook ──────────────────────────────────────────────────────

// alive() lets a superseded run stop its animation so two runs never interleave.
function typeOut(
  full: string,
  set: (fn: (p: string) => string) => void,
  alive: () => boolean
): Promise<void> {
  return new Promise((resolve) => {
    const parts = full.split(/(\s+)/);
    let i = 0;
    const tick = () => {
      if (!alive() || i >= parts.length) return resolve();
      set((p) => p + parts.slice(i, i + 3).join(""));
      i += 3;
      setTimeout(tick, 35);
    };
    tick();
  });
}

function useStream(sessionId: string) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done">("idle");
  const [canned, setCanned] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);

  async function run(
    prompt: string,
    system: string | undefined,
    cannedOutput: string,
    image?: { data: string; mediaType: string }
  ) {
    // Supersede any run already in flight — a new click wins, the old one goes quiet.
    const myId = ++runIdRef.current;
    const alive = () => runIdRef.current === myId;
    abortRef.current?.abort();
    setText("");
    setCanned(false);
    setStatus("streaming");

    if (!liveEnabled()) {
      setCanned(true);
      await typeOut(cannedOutput, setText, alive);
      if (alive()) setStatus("done");
      return;
    }
    // Live, with retries — upstream occasionally returns an empty stream,
    // more often under the concurrency of a full room. Empties fail fast, so
    // a couple of quick retries make it near-invisible.
    const MAX_ATTEMPTS = 4;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      if (!alive()) return;
      const ac = new AbortController();
      abortRef.current = ac;
      setText("");
      // A stream that stalls without dropping would otherwise show "generating…"
      // forever — abort it so the retry/fallback path takes over.
      const stallTimer = setTimeout(() => ac.abort(), 45_000);
      try {
        await streamGenerate({
          sessionId,
          prompt,
          system,
          image,
          signal: ac.signal,
          onToken: (t) => {
            if (alive()) setText((p) => p + t);
          },
        });
        clearTimeout(stallTimer);
        if (alive()) setStatus("done");
        return;
      } catch {
        clearTimeout(stallTimer);
        if (!alive()) return;
        if (attempt < MAX_ATTEMPTS - 1) {
          // Growing backoff (0.6s → 1.2s → 2.4s) rides out brief rate-limit windows.
          await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt)));
          continue; // retry
        }
        // Give up on live — show the canned version so the box is never blank.
        setCanned(true);
        setText("");
        await typeOut(cannedOutput, setText, alive);
        if (alive()) setStatus("done");
      }
    }
  }

  return { text, status, canned, run };
}

// ── presentational bits ─────────────────────────────────────────────────────

/** Inline markdown: **bold**, *italic* / _italic_, `code`. Unclosed markers
 *  (mid-stream) render literally until their partner arrives. */
function renderInline(s: string): React.ReactNode {
  const re = /(\*\*[^\n]+?\*\*|`[^`\n]+`|\*[^*\n]+?\*|_[^_\n]+?_)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`"))
      out.push(<code key={k++} className="font-mono text-[0.85em] bg-dust/60 rounded px-1 py-0.5">{tok.slice(1, -1)}</code>);
    else out.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** Lightweight markdown renderer for Claude output: bold/italic/code, headings,
 *  bullet + numbered lists, with line breaks preserved (for emails). */
function Rich({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;
  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{renderInline(it)}</li>);
    blocks.push(
      list.ordered ? (
        <ol key={key++} className="list-decimal ml-5 space-y-0.5">{items}</ol>
      ) : (
        <ul key={key++} className="list-disc ml-5 space-y-0.5">{items}</ul>
      )
    );
    list = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    const h = line.match(/^(#{1,4})\s+(.*)/);
    const b = line.match(/^\s*[-*]\s+(.*)/);
    const n = line.match(/^\s*\d+[.)]\s+(.*)/);
    if (h) {
      flush();
      blocks.push(<p key={key++} className="font-semibold text-slate mt-2 mb-0.5">{renderInline(h[2])}</p>);
    } else if (b) {
      if (!list || list.ordered) { flush(); list = { ordered: false, items: [] }; }
      list.items.push(b[1]);
    } else if (n) {
      if (!list || !list.ordered) { flush(); list = { ordered: true, items: [] }; }
      list.items.push(n[1]);
    } else if (line.trim() === "") {
      flush();
      blocks.push(<div key={key++} className="h-2" />);
    } else {
      flush();
      blocks.push(<div key={key++}>{renderInline(line)}</div>);
    }
  }
  flush();
  return <div className="leading-body">{blocks}</div>;
}

function OutputPanel({
  label,
  text,
  status,
  canned,
  tone = "amber",
}: {
  label: string;
  text: string;
  status: "idle" | "streaming" | "done";
  canned: boolean;
  tone?: "amber" | "steel";
}) {
  const border = tone === "amber" ? "border-amber/40" : "border-dust";
  return (
    <div className={`bg-white border ${border} flex flex-col min-h-[8rem]`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-dust">
        <span className="section-label text-steel">{label}</span>
        {status === "streaming" && <span className="font-inter text-xs text-amber animate-pulse">generating…</span>}
        {canned && status === "done" && (
          <span className="font-inter text-[10px] uppercase tracking-wide text-amber/80">example</span>
        )}
      </div>
      {canned && status === "done" && (
        <p className="font-inter text-xs text-amber/90 bg-amber/5 border-b border-amber/20 px-4 py-2">
          Live generation was busy just now, so this is a built-in example — hit Run again in a minute for the
          real thing.
        </p>
      )}
      <div className="font-inter text-sm text-slate/80 leading-body px-4 py-3 flex-1">
        {text ? <Rich text={text} /> : <span className="text-steel/40">Run it to see the output.</span>}
      </div>
    </div>
  );
}

function RunButton({
  onClick,
  disabled,
  busy,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || busy}
      className="font-inter text-sm font-medium bg-slate text-bone px-5 py-2.5 hover:bg-olive transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {busy ? "Running…" : children}
    </button>
  );
}

// ── Claude-style composer + model badge + dictation ─────────────────────────────

const MODEL_LABEL = process.env.NEXT_PUBLIC_FW_MODEL_LABEL || "Claude Sonnet 5";

function ModelBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 font-inter text-xs text-steel">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l2.4 6.8L21 11l-6.6 2.2L12 20l-2.4-6.8L3 11l6.6-2.2z" fill="#D97B2A" />
      </svg>
      <span className="font-medium text-slate/70">{MODEL_LABEL}</span>
    </span>
  );
}

/** A rounded, Claude-composer-style textarea with an optional model badge and a
 *  dictation mic (Web Speech API, shown only where the browser supports it). */
function Composer({
  value,
  onValueChange,
  placeholder,
  rows = 3,
  showModel = false,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  showModel?: boolean;
}) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const SR =
    typeof window !== "undefined"
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;

  function toggle() {
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    // iOS Safari duplicates final results in continuous mode — one utterance per
    // tap there; desktop keeps the hands-free continuous behavior.
    const isIOS = typeof navigator !== "undefined" && /iP(hone|ad|od)/.test(navigator.userAgent);
    rec.continuous = !isIOS;
    rec.interimResults = false;
    rec.lang = "en-US";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      const cur = valueRef.current;
      onValueChange((cur ? cur.trim() + " " : "") + t.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  return (
    <div className="rounded-2xl border border-dust bg-white focus-within:border-amber/70 transition-colors overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent text-slate font-inter text-sm px-4 pt-3 pb-1 outline-none resize-none placeholder:text-steel/40 leading-body"
      />
      <div className="flex items-center justify-between gap-2 px-3 pb-2.5 pt-1">
        <div className="min-w-0 truncate">{showModel && <ModelBadge />}</div>
        {SR && (
          <button
            type="button"
            onClick={toggle}
            title={listening ? "Stop dictation" : "Dictate"}
            aria-label="Dictate"
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              listening ? "bg-amber text-white animate-pulse" : "text-steel hover:text-amber hover:bg-amber/10"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ── #3 Context compare ─────────────────────────────────────────────────────────

function ContextCompare({ block, ctx }: { block: Extract<Block, { type: "context-compare" }>; ctx: ExerciseCtx }) {
  const bare = useStream(ctx.sessionId);
  const rich = useStream(ctx.sessionId);
  const canned = cannedFor(ctx.trackId);
  const [extra, setExtra] = useState("");
  const richPrompt = useMemo(
    () => `${block.contextBlock}${extra.trim() ? "\n" + extra.trim() : ""}\n\n${block.barePrompt}`,
    [block.contextBlock, block.barePrompt, extra]
  );

  return (
    <div className="space-y-4">
      <div className="border-l-2 border-olive/30 bg-olive/5 pl-4 pr-4 py-3">
        <p className="section-label text-olive mb-1">Your scenario</p>
        <p className="font-inter text-sm text-slate/80 leading-body">{block.scenario}</p>
      </div>

      <div className="flex items-center justify-end">
        <ModelBadge />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="font-inter text-xs text-steel">1 · Just the ask — no context</p>
          <pre className="whitespace-pre-wrap font-inter text-xs bg-dust/40 text-slate/70 px-3 py-2 border border-dust">
            {block.barePrompt}
          </pre>
          <RunButton onClick={() => bare.run(block.barePrompt, block.system, canned.contextBare)} busy={bare.status === "streaming"}>
            Run it
          </RunButton>
          <OutputPanel label="Output" text={bare.text} status={bare.status} canned={bare.canned} tone="steel" />
        </div>

        <div className="space-y-2">
          <p className="font-inter text-xs text-steel">2 · Same ask — with context</p>
          <Composer
            value={extra}
            onValueChange={setExtra}
            rows={2}
            placeholder="Optional: add a line of your own context…"
          />
          <p className="font-inter text-[11px] text-steel/60">This is what gets sent:</p>
          <pre className="whitespace-pre-wrap font-inter text-xs bg-amber/5 text-slate/70 px-3 py-2 border border-amber/30 max-h-32 overflow-y-auto">
            {richPrompt}
          </pre>
          <RunButton onClick={() => rich.run(richPrompt, block.system, canned.contextRich)} busy={rich.status === "streaming"}>
            Run it
          </RunButton>
          <OutputPanel label="Output" text={rich.text} status={rich.status} canned={rich.canned} />
        </div>
      </div>
      <p className="font-inter text-xs text-steel/70 italic">
        Same model, same ask. The only thing that changed is what it knew about you.
      </p>
    </div>
  );
}

// ── #4a Company context file — contribute ──────────────────────────────────────

function ContextFileContribute({ block, ctx }: { block: Extract<Block, { type: "context-file" }>; ctx: ExerciseCtx }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(ctxFileKey(ctx.sessionId, ctx.name)) || "{}");
    } catch {
      return {};
    }
  });
  const [saved, setSaved] = useState(false);

  const anyFilled = Object.values(values).some((v) => v.trim());

  function submit() {
    localStorage.setItem(ctxFileKey(ctx.sessionId, ctx.name), JSON.stringify(values));
    capture({
      sessionId: ctx.sessionId,
      kind: "context-file",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { sections: values },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-4">
      {block.intro && <p className="font-inter text-slate/80 leading-body">{block.intro}</p>}
      {block.sections.map((s) => (
        <div key={s.id}>
          <label className="font-inter text-sm font-medium text-slate block mb-1">{s.label}</label>
          <p className="font-inter text-xs text-steel mb-1.5">{s.hint}</p>
          <Composer
            value={values[s.id] ?? ""}
            onValueChange={(val) => setValues((v) => ({ ...v, [s.id]: val }))}
            placeholder={s.placeholder}
            rows={3}
          />
        </div>
      ))}
      <div className="flex items-center gap-3">
        <RunButton onClick={submit} disabled={!anyFilled}>
          Add to the company file
        </RunButton>
        {saved && <span className="font-inter text-sm text-olive">Added ✓ It&apos;s on the shared file.</span>}
      </div>
    </div>
  );
}

// ── #4b Prove it — your prompt with vs. without your context ────────────────────

// ── shared: the published company context file, threaded through post-build exercises ──

/** Load the facilitator-published company context file for this session. */
function usePublishedContext(sessionId: string) {
  const [context, setContext] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const reload = useCallback(async () => {
    setChecking(true);
    setContext(await fetchSharedContext(sessionId));
    setChecking(false);
  }, [sessionId]);
  useEffect(() => {
    reload();
  }, [reload]);
  return { context, checking, reload };
}

/** Prepend the company context file to a system prompt so every call uses it. */
function withCompanyContext(companyCtx: string | null | undefined, system?: string): string | undefined {
  const c = companyCtx?.trim();
  if (!c) return system;
  return `Use this company context file as background for everything you produce:\n\n${c}${system ? "\n\n" + system : ""}`;
}

/** A small "📎 context attached" cue meant to sit right next to a Run/Send/Start
 *  button — a reminder the file rides along, with a peek at the actual file. */
function ContextBadge({
  content,
  checking,
  onRefresh,
}: {
  content: string | null | undefined;
  checking: boolean;
  onRefresh: () => void;
}) {
  const [peek, setPeek] = useState(false);
  const loaded = !!content?.trim();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap font-inter text-[11px] leading-none">
        <span className={loaded ? "text-olive" : "text-steel/60"}>
          📎 {loaded ? "Company context attached" : "No company file yet"}
        </span>
        {loaded && (
          <button onClick={() => setPeek((p) => !p)} className="text-steel/70 hover:text-slate underline decoration-dotted underline-offset-2">
            {peek ? "hide" : "peek"}
          </button>
        )}
        <button onClick={onRefresh} className="text-steel/70 hover:text-amber underline decoration-dotted underline-offset-2">
          {checking ? "…" : "refresh"}
        </button>
      </div>
      {peek && loaded && (
        <pre className="whitespace-pre-wrap font-inter text-xs text-slate/70 bg-white border border-dust rounded-lg px-3 py-2 max-h-52 overflow-auto">
          {content}
        </pre>
      )}
    </div>
  );
}

function ContextFileTest({ block, ctx }: { block: Extract<Block, { type: "context-file-test" }>; ctx: ExerciseCtx }) {
  const [prompt, setPrompt] = useState(block.starterPrompt ?? "");
  const [peek, setPeek] = useState(false);
  const without = useStream(ctx.sessionId);
  const withCtx = useStream(ctx.sessionId);
  const canned = cannedFor(ctx.trackId);

  const myContext = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const v = JSON.parse(localStorage.getItem(ctxFileKey(ctx.sessionId, ctx.name)) || "{}") as Record<string, string>;
      return Object.values(v).filter(Boolean).join("\n");
    } catch {
      return "";
    }
  }, [ctx.sessionId, ctx.name]);

  // Prefer the facilitator-published company context file; else this person's own
  // contributions; else a representative sample so the contrast always lands.
  const [published, setPublished] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const loadShared = useCallback(async () => {
    setChecking(true);
    setPublished(await fetchSharedContext(ctx.sessionId));
    setChecking(false);
  }, [ctx.sessionId]);
  useEffect(() => {
    loadShared();
  }, [loadShared]);

  const source: "published" | "own" | "sample" | "none" =
    published && published.trim()
      ? "published"
      : myContext.trim()
        ? "own"
        : block.sampleContext
          ? "sample"
          : "none";
  const effectiveContext =
    source === "published"
      ? (published as string)
      : source === "own"
        ? myContext
        : source === "sample"
          ? (block.sampleContext as string)
          : "";

  return (
    <div className="space-y-4">
      <p className="font-inter text-slate/80 leading-body">{block.guidance}</p>
      <Composer value={prompt} onValueChange={setPrompt} rows={3} placeholder="Write a real prompt for your work…" showModel />

      <div
        className={`rounded-xl border px-4 py-3 ${
          source === "published"
            ? "border-olive/50 bg-olive/5"
            : source === "sample"
              ? "border-amber/40 bg-amber/5"
              : source === "own"
                ? "border-olive/30 bg-olive/5"
                : "border-dust bg-dust/30"
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base">📎</span>
          <span className="font-inter text-sm font-medium text-slate">
            {source === "published"
              ? "Company context file — attached"
              : source === "own"
                ? "Your context contributions — attached"
                : source === "sample"
                  ? "Sample R&N context — attached"
                  : "No context attached yet"}
          </span>
          <span className="flex-1" />
          {effectiveContext && (
            <button onClick={() => setPeek((p) => !p)} className="font-inter text-xs text-steel hover:text-slate">
              {peek ? "hide" : "peek"}
            </button>
          )}
          <button onClick={loadShared} className="font-inter text-xs text-amber hover:underline">
            {checking ? "checking…" : "↻ refresh company file"}
          </button>
        </div>
        <p className="font-inter text-xs text-steel/80 mt-1">
          {source === "published"
            ? "The right-hand run attaches this file — same as it will in your own Claude Project."
            : source === "sample"
              ? "Your team's file replaces this once Gabe publishes it."
              : source === "own"
                ? "Using what you added while we built the file."
                : "Add to the file above, or wait for the published version."}
        </p>
        {peek && effectiveContext && (
          <pre className="whitespace-pre-wrap font-inter text-xs text-slate/70 bg-white border border-dust rounded-lg px-3 py-2 mt-2 max-h-44 overflow-auto">
            {effectiveContext}
          </pre>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="font-inter text-xs text-steel">Without your context</p>
          <RunButton
            onClick={() => without.run(prompt, block.system, canned.testWithout)}
            disabled={!prompt.trim()}
            busy={without.status === "streaming"}
          >
            Run
          </RunButton>
          <OutputPanel label="Output" text={without.text} status={without.status} canned={without.canned} tone="steel" />
        </div>
        <div className="space-y-2">
          <p className="font-inter text-xs text-steel flex items-center gap-2">
            With your context
            <span className="font-inter text-[10px] uppercase tracking-wide text-olive border border-olive/40 rounded-full px-1.5 py-0.5">
              📎 attached
            </span>
          </p>
          <RunButton
            onClick={() => withCtx.run(`${effectiveContext}\n\n${prompt}`, block.system, canned.testWith)}
            disabled={!prompt.trim()}
            busy={withCtx.status === "streaming"}
          >
            Run
          </RunButton>
          <OutputPanel label="Output" text={withCtx.text} status={withCtx.status} canned={withCtx.canned} />
        </div>
      </div>
    </div>
  );
}

// ── #5 ⭐ More-is-More prompt-builder → guided multi-turn conversation ───────────

const PUSH_CHIPS = ["Make it shorter", "Warmer tone", "Lead with the ask", "More formal", "More specific"];

// Offline samples, indexed by how many assistant turns have already landed.
// Track-flavored: facilities gets a diagnostic/work-order arc, not a tenant email.
const CANNED_CONVO_FACILITIES = [
  "Happy to help — a couple of quick questions first:\n\n1. Which unit is it (location, make/model if you know it), and what exactly is it doing?\n2. What have you already checked or tried?\n3. Is it affecting tenants right now, or can it wait for a scheduled visit?\n\nAnswer in a few words each and I'll get you a plan. (Offline sample — live, Claude asks about your actual situation.)",
  "Here's a first pass:\n\n**Likely causes, most to least likely:**\n1. Dirty condenser coil or clogged filter — unit overheats and trips on high head pressure\n2. Failing run capacitor — the classic short-cycle in summer heat\n3. Low refrigerant charge — that one's a licensed-tech call\n\n**Safe checks before you call a vendor:**\n- Kill power, pull and check the filter\n- Inspect the condenser coil; rinse gently if it's caked\n- Look (don't touch) for a bulged or leaking capacitor\n- Time how long it runs before cutting out\n\nIf it points to the capacitor or charge, hand the vendor these notes — you'll save the diagnostic hour. (Offline sample — live, this is built from your answers.)",
  "Tightened into a vendor-ready ticket:\n\n**Work order — RTU, roof, short-cycling**\nSymptom: Cools 4–5 minutes on 90°+ afternoons, trips, restarts.\nAlready done: Filter checked, coil rinsed, capacitor visually OK.\nRequest: Diagnose capacitor / refrigerant charge; quote before repair.\nPriority: High — tenant comfort at risk this week.\n\n(Offline sample of a push-back rep.)",
  "One more pass — shorter and firmer:\n\n**RTU short-cycles above 90°.** Filter and coil already done, capacitor visual OK. Need diagnostic + quote this week; tenant-facing space. Please confirm an arrival window today.\n\n(Offline sample — two reps in, you can feel it converge.)",
];

const CANNED_CONVO = [
  "Happy to help — a couple of quick questions first:\n\n1. Who's the recipient, and what tone should I strike?\n2. What's the one outcome that matters most here?\n3. Any specifics I should include — a name, amount, or date?\n\nAnswer in a few words each and I'll draft it. (Offline sample — live, Claude asks about your actual task.)",
  "Here's a first draft:\n\nSubject: Quick follow-up on your account\n\nHi [name],\n\nHope you're doing well! I wanted to reach out about the balance on your account — our records show about [amount] outstanding, now a couple of weeks past due. I know these things slip through the cracks, so no worries at all.\n\nWould you be able to pick a day this week to get it settled? Happy to take it by check or ACH — whichever's easier on your end. As always, we really appreciate having you.\n\nBest,\n[you]\n\n(Offline sample — live, this is built from your answers.)",
  "Tightened it up per your note:\n\nSubject: Your account\n\nHi [name] — quick one: about [amount] is outstanding from the last reconciliation, ~2 weeks past due. What day this week works to close it out? Check or ACH both fine. Thanks so much!\n\n(Offline sample of a push-back rep.)",
  "One more pass — warmer open, the ask up top:\n\nHi [name], always a pleasure working with you. One small housekeeping item: about [amount] is still open from the last reconciliation. Could you pick a day this week to settle it? I'll send whichever's easiest — check or ACH. Appreciate you!\n\n(Offline sample — two reps in, you can feel it converge.)",
];

const BUILD_STEPS = ["Describe", "Answer", "Push back ×2"];

function PromptBuilder({ block, ctx }: { block: Extract<Block, { type: "prompt-builder" }>; ctx: ExerciseCtx }) {
  const [challengeId, setChallengeId] = useState<string>(block.challenges[0]?.id ?? "");
  const [chunks, setChunks] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const c of block.chunks) if (c.default) init[c.id] = c.default;
    return init;
  });
  const [phase, setPhase] = useState<"build" | "chat">("build");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [live, setLive] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [canned, setCanned] = useState(false);
  const [reply, setReply] = useState("");
  const [showLazy, setShowLazy] = useState(false);
  const cf = usePublishedContext(ctx.sessionId);

  const challenge = block.challenges.find((c) => c.id === challengeId);
  const filled = block.chunks.filter((c) => (chunks[c.id] ?? "").trim()).length;
  const ready = filled === block.chunks.length && !!challenge;

  const builtPrompt = useMemo(() => {
    const parts = [challenge?.text ?? ""];
    for (const c of block.chunks) {
      const v = (chunks[c.id] ?? "").trim();
      if (v) parts.push(`${c.prefix ?? ""}${v}`);
    }
    if (block.interviewInstruction) parts.push(block.interviewInstruction);
    return parts.filter(Boolean).join("\n\n");
  }, [challenge, chunks, block.chunks, block.interviewInstruction]);

  const assistantTurns = turns.filter((t) => t.role === "assistant").length;
  const done = assistantTurns >= 4;
  const step = phase === "build" || assistantTurns === 0 ? 1 : assistantTurns === 1 ? 2 : 3;

  async function send(userText: string) {
    if (streaming || !userText.trim()) return;
    const history: ChatTurn[] = [...turns, { role: "user", content: userText.trim() }];
    const convo = ctx.trackId === "facilities" ? CANNED_CONVO_FACILITIES : CANNED_CONVO;
    const cannedText = convo[Math.min(assistantTurns, convo.length - 1)];
    setTurns(history);
    setReply("");
    setStreaming(true);
    setLive("");
    let full = "";
    if (liveEnabled()) {
      const MAX = 4;
      for (let attempt = 0; attempt < MAX; attempt++) {
        full = "";
        setLive("");
        const ac = new AbortController();
        const stallTimer = setTimeout(() => ac.abort(), 45_000);
        try {
          await streamGenerate({
            sessionId: ctx.sessionId,
            messages: history,
            system: withCompanyContext(cf.context, block.system),
            signal: ac.signal,
            onToken: (t) => {
              full += t;
              setLive((p) => p + t);
            },
          });
          clearTimeout(stallTimer);
          break;
        } catch {
          clearTimeout(stallTimer);
          full = "";
          if (attempt < MAX - 1) {
            await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt)));
            continue;
          }
          setCanned(true);
          full = cannedText;
          setLive("");
          await typeOut(cannedText, setLive, () => true);
        }
      }
    } else {
      setCanned(true);
      full = cannedText;
      await typeOut(cannedText, setLive, () => true);
    }
    setTurns([...history, { role: "assistant", content: full }]);
    setLive("");
    setStreaming(false);
  }

  function startOver() {
    setPhase("build");
    setTurns([]);
    setLive("");
    setStreaming(false);
    setCanned(false);
    setReply("");
    setShowLazy(false);
  }

  function start() {
    if (!ready) return;
    capture({
      sessionId: ctx.sessionId,
      kind: "prompt-builder",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { challengeId, challenge: challenge?.label, prompt: builtPrompt },
    });
    setPhase("chat");
    send(builtPrompt);
  }

  const composer =
    assistantTurns === 1
      ? { label: "✍️ Answer Claude's questions — keep it brief", placeholder: "Answer each in a few words…", chips: [] as string[] }
      : assistantTurns === 2
        ? { label: "Now push back — be demanding & direct (rep 1 of 2)", placeholder: "e.g. shorter, lead with the ask, warmer", chips: PUSH_CHIPS }
        : assistantTurns === 3
          ? { label: "One more push — refine it further (rep 2 of 2)", placeholder: "Push on tone, length, specifics…", chips: PUSH_CHIPS }
          : null;

  const Bubble = ({ t }: { t: ChatTurn }) =>
    t.role === "user" ? (
      <div className="ml-6 bg-dust/50 border border-dust rounded-2xl px-4 py-2.5">
        <p className="section-label text-steel mb-1">You</p>
        <pre className="whitespace-pre-wrap font-inter text-sm text-slate/80 leading-body">{t.content}</pre>
      </div>
    ) : (
      <div className="mr-6 bg-white border border-amber/30 rounded-2xl px-4 py-2.5">
        <p className="section-label text-amber mb-1">Claude</p>
        <div className="font-inter text-sm text-slate/80 leading-body">
          <Rich text={t.content} />
        </div>
      </div>
    );

  return (
    <div className="space-y-5">
      {/* step tracker */}
      <div className="flex items-center gap-2 flex-wrap">
        {BUILD_STEPS.map((s, i) => {
          const n = i + 1;
          const state = done || n < step ? "done" : n === step ? "active" : "todo";
          return (
            <span
              key={s}
              className={`font-inter text-xs px-2.5 py-1 rounded-full border ${
                state === "active"
                  ? "border-amber bg-amber/10 text-slate font-medium"
                  : state === "done"
                    ? "border-olive/40 bg-olive/5 text-olive"
                    : "border-dust text-steel/50"
              }`}
            >
              {n}. {s}
            </span>
          );
        })}
      </div>

      {phase === "build" && (
        <>
          <div>
            <p className="section-label text-steel mb-2">Pick your challenge</p>
            <div className="flex flex-wrap gap-2">
              {block.challenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChallengeId(c.id)}
                  className={`font-inter text-sm px-3 py-2 border text-left transition-colors ${
                    c.id === challengeId ? "border-amber bg-amber/10 text-slate" : "border-dust bg-white text-steel hover:border-steel/50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {challenge && (
              <p className="font-inter text-sm text-slate/80 leading-body mt-3 bg-dust/40 px-3 py-2 border border-dust">{challenge.text}</p>
            )}
          </div>

          <div className="space-y-4">
            {block.chunks.map((c, i) => (
              <div key={c.id}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-syne text-amber text-sm">{i + 1}.</span>
                  <label className="font-inter text-sm font-medium text-slate">{c.label}</label>
                </div>
                <p className="font-inter text-xs text-steel mb-1.5 ml-5">{c.instruction}</p>
                <Composer
                  value={chunks[c.id] ?? ""}
                  onValueChange={(val) => setChunks((v) => ({ ...v, [c.id]: val }))}
                  placeholder={challenge?.hints?.[c.id] ?? c.placeholder}
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <RunButton onClick={start} disabled={!ready}>
              Start the conversation →
            </RunButton>
            <ModelBadge />
          </div>
          <ContextBadge content={cf.context} checking={cf.checking} onRefresh={cf.reload} />
          <p className="font-inter text-xs text-steel">Claude will interview you first, then draft — you take it from there.</p>
        </>
      )}

      {phase === "chat" && (
        <>
          {challenge && (
            <p className="font-inter text-xs text-steel flex items-center gap-3">
              <span>
                Working on: <span className="text-slate/70">{challenge.label}</span>
              </span>
              {!streaming && (
                <button onClick={startOver} className="text-steel/60 hover:text-amber transition-colors">
                  ↺ Start over
                </button>
              )}
            </p>
          )}

          <div className="space-y-3">
            {turns.map((t, i) => (
              <Bubble key={i} t={t} />
            ))}
            {streaming && (
              <div className="mr-6 bg-white border border-amber/30 rounded-2xl px-4 py-2.5">
                <p className="section-label text-amber mb-1 flex items-center gap-2">
                  Claude <span className="font-inter text-xs text-amber animate-pulse normal-case tracking-normal">generating…</span>
                </p>
                <div className="font-inter text-sm text-slate/80 leading-body">
                  {live ? <Rich text={live} /> : <span className="text-steel/40">…</span>}
                </div>
              </div>
            )}
          </div>

          {composer && !streaming && (
            <div className="space-y-2">
              <p className="font-inter text-sm font-medium text-slate">{composer.label}</p>
              {composer.chips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {composer.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setReply((r) => (r.trim() ? r.trim() + "; " + chip.toLowerCase() : chip))}
                      className="font-inter text-xs px-2.5 py-1 rounded-full border border-dust text-steel hover:border-amber hover:text-amber transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              <Composer value={reply} onValueChange={setReply} placeholder={composer.placeholder} rows={2} showModel />
              <div className="flex items-center gap-3 flex-wrap">
                <RunButton onClick={() => send(reply)} disabled={!reply.trim()}>
                  Send →
                </RunButton>
                <ContextBadge content={cf.context} checking={cf.checking} onRefresh={cf.reload} />
              </div>
            </div>
          )}

          {done && (
            <>
              <div className="border-l-2 border-olive/40 bg-olive/5 px-4 py-3">
                <p className="font-inter text-sm text-slate/80 leading-body">
                  ✓ You ran the whole loop — described the goal, let Claude interview you, answered, and pushed back twice. That back-and-forth is where the quality comes from.
                </p>
              </div>
              <button onClick={() => setShowLazy((v) => !v)} className="font-inter text-xs text-amber hover:underline w-fit">
                {showLazy ? "Hide the lazy version" : "See what a one-line prompt would've gotten you"}
              </button>
              {showLazy && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="font-inter text-xs text-steel">&ldquo;{block.genericPrompt}&rdquo;</p>
                    <OutputPanel label="Lazy output" text={block.genericOutput} status="done" canned tone="steel" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-inter text-xs text-steel">Your final version</p>
                    <OutputPanel
                      label="Your output"
                      text={turns.filter((t) => t.role === "assistant").slice(-1)[0]?.content ?? ""}
                      status="done"
                      canned={canned}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Iterate — run a real task, then push back once to refine ────────────────────

function IterateExercise({ block, ctx }: { block: Extract<Block, { type: "iterate" }>; ctx: ExerciseCtx }) {
  const [task, setTask] = useState(block.starterTask ?? "");
  const first = useStream(ctx.sessionId);
  const [refine, setRefine] = useState("");
  const refined = useStream(ctx.sessionId);
  const cf = usePublishedContext(ctx.sessionId);

  function runFirst() {
    capture({
      sessionId: ctx.sessionId,
      kind: "iterate",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { stage: "first", task },
    });
    first.run(task, withCompanyContext(cf.context, block.system), cannedFor(ctx.trackId).iterateFirst);
  }

  function runRefine() {
    const combined = `${task}\n\nYour first draft was:\n"""\n${first.text}\n"""\n\nRevise it based on this feedback: ${refine}`;
    capture({
      sessionId: ctx.sessionId,
      kind: "iterate",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { stage: "refine", task, refine },
    });
    refined.run(combined, withCompanyContext(cf.context, block.system), cannedFor(ctx.trackId).iterateRefined);
  }

  return (
    <div className="space-y-4">
      {block.intro && <p className="font-inter text-slate/80 leading-body">{block.intro}</p>}

      <div>
        <p className="section-label text-steel mb-2">1 · Your task</p>
        <Composer
          value={task}
          onValueChange={setTask}
          rows={3}
          placeholder="Describe a real task from your week and what a good result looks like…"
          showModel
        />
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <RunButton onClick={runFirst} disabled={!task.trim()} busy={first.status === "streaming"}>
            Get a first draft →
          </RunButton>
          <ContextBadge content={cf.context} checking={cf.checking} onRefresh={cf.reload} />
        </div>
        {first.status !== "idle" && (
          <div className="mt-3">
            <OutputPanel label="First draft" text={first.text} status={first.status} canned={first.canned} />
          </div>
        )}
      </div>

      {first.status === "done" && (
        <div className="border-t border-dust pt-4">
          <p className="section-label text-steel mb-2">2 · Push back — don&apos;t settle</p>
          <p className="font-inter text-xs text-steel mb-2">
            Tell it what to change. &ldquo;Too formal — warmer.&rdquo; &ldquo;You missed the timeline.&rdquo;
            &ldquo;Shorter, lead with the ask.&rdquo;
          </p>
          <Composer value={refine} onValueChange={setRefine} rows={2} placeholder="What should it change?" />
          <div className="mt-2">
            <RunButton onClick={runRefine} disabled={!refine.trim()} busy={refined.status === "streaming"}>
              Refine it →
            </RunButton>
          </div>
          {refined.status !== "idle" && (
            <div className="mt-3">
              <OutputPanel label="Revised draft" text={refined.text} status={refined.status} canned={refined.canned} />
            </div>
          )}
        </div>
      )}

      {refined.status === "done" && (
        <p className="font-inter text-xs text-steel/70 italic">
          That back-and-forth — describe, read, redirect — is the whole game. The first answer is a starting point,
          not the answer.
        </p>
      )}
    </div>
  );
}

// ── Setup tour — the desktop/mobile handoff (checklist + missions + QR + cheat sheet) ──

const setupKey = (sessionId: string, name: string) =>
  `fw_setup_${sessionId}_${name.trim().toLowerCase()}`;

type SetupMission = Extract<Block, { type: "setup-tour" }>["missions"][number];

function SetupTour({ block, ctx }: { block: Extract<Block, { type: "setup-tour" }>; ctx: ExerciseCtx }) {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(setupKey(ctx.sessionId, ctx.name)) || "{}");
    } catch {
      return {};
    }
  });
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      localStorage.setItem(setupKey(ctx.sessionId, ctx.name), JSON.stringify(next));
    },
    [ctx.sessionId, ctx.name]
  );

  // Cross-device resume: merge in this person's server-side progress on load.
  useEffect(() => {
    if (!liveEnabled()) return;
    fetchSessionData(ctx.sessionId)
      .then((recs) => {
        const mine = recs.find(
          (r) => r.kind === "setup" && r.name.trim().toLowerCase() === ctx.name.trim().toLowerCase()
        );
        const serverDone = (mine?.payload?.done ?? {}) as Record<string, boolean>;
        if (!Object.keys(serverDone).length) return;
        setDone((prev) => {
          const merged = { ...prev };
          for (const [k, v] of Object.entries(serverDone)) if (v) merged[k] = true;
          persist(merged);
          return merged;
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.sessionId, ctx.name]);

  const mobileUrl =
    block.mobileUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/training?code=${encodeURIComponent(ctx.sessionCode)}&to=${encodeURIComponent(ctx.lessonId)}`
      : "");

  useEffect(() => {
    if (!mobileUrl) return;
    QRCode.toDataURL(mobileUrl, { margin: 1, width: 240, color: { dark: "#0F1923", light: "#F0EBE1" } })
      .then(setQr)
      .catch(() => {});
  }, [mobileUrl]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      persist(next);
      capture({ sessionId: ctx.sessionId, kind: "setup", name: ctx.name, trackId: ctx.trackId, payload: { done: next } });
      return next;
    });
  }

  // Missions visible to this person (track-filtered), grouped by tier in order.
  const visible = block.missions.filter((m) => !m.track || m.track === ctx.trackId);
  const tiers: string[] = [];
  for (const m of visible) if (!tiers.includes(m.tier)) tiers.push(m.tier);

  const allIds = [...block.steps.map((s) => s.id), ...visible.map((m) => m.id)];
  const doneCount = allIds.filter((id) => done[id]).length;
  const pct = allIds.length ? Math.round((doneCount / allIds.length) * 100) : 0;

  function copyCheatsheet() {
    if (!block.cheatsheet) return;
    const text = "Claude cheat sheet\n\n" + block.cheatsheet.map((r) => `${r.q}\n  ${r.a}`).join("\n\n");
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }

  const Checkbox = ({ id }: { id: string }) => (
    <span
      className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
        done[id] ? "bg-olive" : "border border-steel/40"
      }`}
    >
      {done[id] && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5L5 9l4.5-5" stroke="#F0EBE1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );

  const StepRow = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => toggle(id)}
      className={`w-full flex items-start gap-3 text-left px-4 py-3 border rounded-xl transition-colors ${
        done[id] ? "border-olive/40 bg-olive/5" : "border-dust bg-white hover:border-amber/60"
      }`}
    >
      <Checkbox id={id} />
      <span className={`font-inter text-sm ${done[id] ? "text-slate/60 line-through" : "text-slate font-medium"}`}>{label}</span>
    </button>
  );

  const MissionCard = ({ m }: { m: SetupMission }) => (
    <div
      className={`border rounded-xl px-4 py-3 transition-colors ${
        done[m.id] ? "border-olive/40 bg-olive/5" : "border-dust bg-white"
      }`}
    >
      <button onClick={() => toggle(m.id)} className="w-full flex items-start gap-3 text-left">
        <Checkbox id={m.id} />
        <span className="flex-1 flex items-center flex-wrap gap-2">
          <span className={`font-inter text-sm font-medium ${done[m.id] ? "text-slate/60 line-through" : "text-slate"}`}>
            {m.icon ? `${m.icon} ` : ""}
            {m.label}
          </span>
          {m.connector && (
            <span className="font-inter text-[10px] uppercase tracking-wide text-amber border border-amber/40 rounded-full px-2 py-0.5">
              if enabled
            </span>
          )}
        </span>
      </button>
      <div className="pl-8 mt-1.5 space-y-1">
        {m.do && <p className="font-inter text-xs text-slate/70 leading-body">{m.do}</p>}
        {m.worked && <p className="font-inter text-xs text-olive">✓ {m.worked}</p>}
        {m.stuck && <p className="font-inter text-xs text-steel/70 italic">Stuck? {m.stuck}</p>}
        {m.sample && (
          <>
            <a
              href={m.sample.href}
              download
              className="inline-block font-inter text-xs font-medium text-amber hover:underline"
            >
              ↓ {m.sample.label}
            </a>
            <p className="font-inter text-[11px] text-steel/60">
              On iPhone it opens in a tab — press and hold the image, then &ldquo;Add to Photos.&rdquo;
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {block.intro && <p className="font-inter text-slate/80 leading-body">{block.intro}</p>}

      {/* progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="section-label text-steel">Your progress · {doneCount}/{allIds.length}</span>
          <span className="font-inter text-xs text-steel">{pct}%</span>
        </div>
        <div className="h-1.5 bg-dust rounded-full overflow-hidden">
          <div className="h-full bg-amber transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* install + QR */}
      <div className="grid md:grid-cols-[1fr_auto] gap-5 items-start">
        <div className="space-y-2">
          <p className="section-label text-steel mb-1">Install &amp; sign in</p>
          {block.steps.map((s) => (
            <StepRow key={s.id} id={s.id} label={s.label} />
          ))}
        </div>
        {qr && (
          <div className="text-center bg-slate rounded-2xl p-4 md:w-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Scan to open on your phone" className="w-40 h-40 mx-auto rounded-lg" />
            <p className="font-inter text-xs text-bone/70 mt-2">Scan to continue on your phone</p>
          </div>
        )}
      </div>

      {/* tiered missions */}
      {tiers.map((tier) => (
        <div key={tier} className="space-y-2">
          <p className="section-label text-amber mb-1">{tier}</p>
          {visible.filter((m) => m.tier === tier).map((m) => (
            <MissionCard key={m.id} m={m} />
          ))}
        </div>
      ))}

      {/* cheat sheet */}
      {block.cheatsheet && block.cheatsheet.length > 0 && (
        <div className="bg-white border border-dust rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-dust">
            <span className="section-label text-steel">Claude cheat sheet — keep this</span>
            <button
              onClick={copyCheatsheet}
              className="font-inter text-xs font-medium border border-amber/50 text-amber px-3 py-1.5 rounded-full hover:bg-amber hover:text-white transition-colors"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <dl className="divide-y divide-dust">
            {block.cheatsheet.map((r, i) => (
              <div key={i} className="px-4 py-3">
                <dt className="font-inter text-sm font-medium text-slate">{r.q}</dt>
                <dd className="font-inter text-sm text-slate/70 mt-0.5 leading-body">{r.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

// ── dispatcher ───────────────────────────────────────────────────────────────

// ── AI usage policy — facilitated mad-lib ────────────────────────────────────────

type PolicyFill = { id: string; before: string; after?: string; options: string[]; multi?: boolean; placeholder?: string };

function joinList(arr: string[]): string {
  if (arr.length <= 1) return arr[0] ?? "";
  return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
}

function PolicyMadlib({ block, ctx }: { block: Extract<Block, { type: "policy-madlib" }>; ctx: ExerciseCtx }) {
  const [picks, setPicks] = useState<Record<string, string[]>>({}); // fillId → chosen options
  const [custom, setCustom] = useState<Record<string, string>>({}); // fillId → free text
  const [removed, setRemoved] = useState<Record<string, boolean>>({}); // `${secId}:${i}` → excluded
  const [added, setAdded] = useState<Record<string, string[]>>({}); // secId → custom items
  const [addDraft, setAddDraft] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<"idle" | "agreed" | "asked">("idle");
  const [copied, setCopied] = useState(false);

  const fillValue = (f: PolicyFill): string => {
    const chosen = picks[f.id] ?? [];
    const c = (custom[f.id] ?? "").trim();
    return joinList([...chosen, ...(c ? [c] : [])]);
  };

  const toggleChip = (f: PolicyFill, o: string) =>
    setPicks((p) => {
      const cur = p[f.id] ?? [];
      if (f.multi) return { ...p, [f.id]: cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o] };
      return { ...p, [f.id]: cur.includes(o) ? [] : [o] };
    });

  function assembleMarkdown(): string {
    let md = `# ${block.docTitle}\n`;
    if (block.docSubtitle) md += `_${block.docSubtitle}_\n`;
    block.sections.forEach((s, i) => {
      md += `\n## ${i + 1}. ${s.title}\n`;
      if (s.kind === "statement") {
        for (const f of s.fills) md += `${f.before} ${fillValue(f) || "____"}${f.after ?? ""}\n`;
      } else if (s.kind === "checklist") {
        s.items.forEach((it, idx) => {
          if (!removed[`${s.id}:${idx}`]) md += `- ${it}\n`;
        });
        (added[s.id] ?? []).forEach((it) => (md += `- ${it}\n`));
      } else if (s.kind === "fixed") {
        for (const l of s.lines) md += `- ${l}\n`;
      } else {
        md += `${(notes[s.id] ?? "").trim() || "_(none yet)_"}\n`;
      }
    });
    if (block.ratify) md += `\n_${block.ratify}_\n`;
    return md;
  }

  function push(kind: "agree" | "question") {
    capture({
      sessionId: ctx.sessionId,
      kind: "policy",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { picks, custom, removed, added, notes, question: question.trim(), agreed: kind === "agree", doc: assembleMarkdown() },
    });
    setState(kind === "agree" ? "agreed" : "asked");
  }

  function copyDoc() {
    navigator.clipboard.writeText(assembleMarkdown()).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }

  const Chip = ({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`font-inter text-xs px-2.5 py-1 rounded-full border transition-colors ${
        on ? "border-amber bg-amber/10 text-slate" : "border-dust text-steel hover:border-amber/60"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-5">
      {block.intro && <p className="font-inter text-slate/80 leading-body">{block.intro}</p>}

      {/* the document */}
      <article className="bg-white border border-dust rounded-2xl shadow-sm px-5 md:px-8 py-6 md:py-8">
        <header className="border-b border-dust pb-4 mb-5">
          <h3 className="font-syne text-2xl text-slate leading-tight">{block.docTitle}</h3>
          {block.docSubtitle && <p className="font-inter text-xs text-steel mt-1">{block.docSubtitle}</p>}
        </header>

        <div className="space-y-7">
          {block.sections.map((s, i) => (
            <section key={s.id}>
              <h4 className="font-syne text-base text-slate mb-1.5">
                <span className="text-amber">{i + 1}.</span> {s.title}
              </h4>
              {"lead" in s && s.lead && <p className="font-inter text-sm text-slate/70 leading-body mb-3">{s.lead}</p>}

              {s.kind === "statement" && (
                <div className="space-y-4">
                  {s.fills.map((f) => (
                    <div key={f.id}>
                      <p className="font-inter text-[15px] text-slate leading-relaxed">
                        {f.before}{" "}
                        <span className="font-medium text-amber border-b border-amber/40">{fillValue(f) || "  ______  "}</span>
                        {f.after}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {f.options.map((o) => (
                          <Chip key={o} on={(picks[f.id] ?? []).includes(o)} label={o} onClick={() => toggleChip(f, o)} />
                        ))}
                      </div>
                      <input
                        value={custom[f.id] ?? ""}
                        onChange={(e) => setCustom((v) => ({ ...v, [f.id]: e.target.value }))}
                        placeholder={f.placeholder ?? "or type your own…"}
                        className="w-full mt-2 bg-transparent border-b border-dust focus:border-amber outline-none font-inter text-sm text-slate py-1 placeholder:text-steel/40"
                      />
                      {f.multi && <p className="font-inter text-[11px] text-steel/50 mt-1">Pick all that apply.</p>}
                    </div>
                  ))}
                </div>
              )}

              {s.kind === "checklist" && (
                <ul className="space-y-2">
                  {s.items.map((item, idx) => {
                    const key = `${s.id}:${idx}`;
                    const on = !removed[key];
                    return (
                      <li key={key}>
                        <button
                          onClick={() => setRemoved((r) => ({ ...r, [key]: !r[key] }))}
                          className="flex items-start gap-2.5 text-left w-full group"
                        >
                          <span className={`shrink-0 mt-0.5 w-4 h-4 rounded flex items-center justify-center ${on ? "bg-olive" : "border border-steel/40"}`}>
                            {on && (
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6.5L5 9l4.5-5" stroke="#F0EBE1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span className={`font-inter text-sm leading-body ${on ? "text-slate/80" : "text-steel/40 line-through"}`}>{item}</span>
                        </button>
                      </li>
                    );
                  })}
                  {(added[s.id] ?? []).map((item, idx) => (
                    <li key={`add-${idx}`} className="flex items-start gap-2.5">
                      <span className="shrink-0 mt-0.5 w-4 h-4 rounded bg-olive flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6.5L5 9l4.5-5" stroke="#F0EBE1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="font-inter text-sm text-slate/80 leading-body flex-1">{item}</span>
                      <button
                        onClick={() => setAdded((a) => ({ ...a, [s.id]: (a[s.id] ?? []).filter((_, j) => j !== idx) }))}
                        className="font-inter text-xs text-steel/50 hover:text-amber"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                  {s.allowAdd && (
                    <li className="flex items-center gap-2 pt-1">
                      <input
                        value={addDraft[s.id] ?? ""}
                        onChange={(e) => setAddDraft((d) => ({ ...d, [s.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (addDraft[s.id] ?? "").trim()) {
                            setAdded((a) => ({ ...a, [s.id]: [...(a[s.id] ?? []), addDraft[s.id].trim()] }));
                            setAddDraft((d) => ({ ...d, [s.id]: "" }));
                          }
                        }}
                        placeholder="add one of ours…"
                        className="flex-1 bg-transparent border-b border-dust focus:border-amber outline-none font-inter text-sm text-slate py-1 placeholder:text-steel/40"
                      />
                      <button
                        onClick={() => {
                          if (!(addDraft[s.id] ?? "").trim()) return;
                          setAdded((a) => ({ ...a, [s.id]: [...(a[s.id] ?? []), addDraft[s.id].trim()] }));
                          setAddDraft((d) => ({ ...d, [s.id]: "" }));
                        }}
                        className="font-inter text-xs text-amber hover:underline"
                      >
                        + add
                      </button>
                    </li>
                  )}
                </ul>
              )}

              {s.kind === "fixed" && (
                <ul className="space-y-1.5">
                  {s.lines.map((l, idx) => (
                    <li key={idx} className="font-inter text-sm text-slate/80 leading-body flex gap-2">
                      <span className="text-amber">•</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              )}

              {s.kind === "notes" && (
                <textarea
                  value={notes[s.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [s.id]: e.target.value }))}
                  rows={3}
                  placeholder={s.placeholder ?? "…"}
                  className="w-full bg-dust/30 border border-dust focus:border-amber rounded-lg px-3 py-2 outline-none font-inter text-sm text-slate leading-body placeholder:text-steel/40"
                />
              )}
            </section>
          ))}
        </div>

        {block.ratify && <p className="font-inter text-xs text-steel/60 italic border-t border-dust mt-6 pt-4">{block.ratify}</p>}
      </article>

      {/* agree · push back · copy */}
      <div className="space-y-3">
        <p className="font-inter text-xs text-steel">We&apos;re writing this together, out loud. Shape it above — and if you&apos;d change something, say it here.</p>
        <Composer value={question} onValueChange={setQuestion} placeholder="A question or something you'd push back on…" rows={2} />
        <div className="flex items-center gap-3 flex-wrap">
          <RunButton onClick={() => push("agree")}>I&apos;m on board ✓</RunButton>
          <button
            onClick={() => push("question")}
            disabled={!question.trim()}
            className="font-inter text-sm font-medium border border-amber/50 text-amber px-4 py-2 rounded hover:bg-amber hover:text-white transition-colors disabled:opacity-40"
          >
            Raise it →
          </button>
          <button onClick={copyDoc} className="font-inter text-xs text-steel hover:text-amber ml-auto">
            {copied ? "Copied ✓" : "Copy the draft"}
          </button>
          {state === "agreed" && <span className="font-inter text-sm text-olive">Logged ✓</span>}
          {state === "asked" && <span className="font-inter text-sm text-olive">Sent to the room ✓</span>}
        </div>
      </div>
    </div>
  );
}

export const INTERACTIVE_TYPES = new Set([
  "context-compare",
  "context-file",
  "context-file-test",
  "prompt-builder",
  "iterate",
  "setup-tour",
  "policy-madlib",
]);

export function ExerciseBlock({ block, ctx }: { block: Block; ctx: ExerciseCtx }) {
  switch (block.type) {
    case "context-compare":
      return <ContextCompare block={block} ctx={ctx} />;
    case "context-file":
      return <ContextFileContribute block={block} ctx={ctx} />;
    case "context-file-test":
      return <ContextFileTest block={block} ctx={ctx} />;
    case "prompt-builder":
      return <PromptBuilder block={block} ctx={ctx} />;
    case "iterate":
      return <IterateExercise block={block} ctx={ctx} />;
    case "setup-tour":
      return <SetupTour block={block} ctx={ctx} />;
    case "policy-madlib":
      return <PolicyMadlib block={block} ctx={ctx} />;
    default:
      return null;
  }
}

// ── canned fallbacks (used offline / if the Worker is down) ──────────────────────
// Track-flavored: a facilities engineer under a rate-limit hiccup should see a
// maintenance example, never a tenant collections email.

type CannedSet = {
  contextBare: string;
  contextRich: string;
  testWithout: string;
  testWith: string;
  iterateFirst: string;
  iterateRefined: string;
};

const ITERATE_CANNED = {
  iterateFirst:
    "Here's a first draft based on your task. It covers the basics and is a reasonable starting point — but it's a little generic, and there are a couple of spots you'll probably want to sharpen. Read it with a critical eye, then tell it what to fix.",
  iterateRefined:
    "Here's the revised version — retoned and tightened around exactly what you flagged. [Notice how one round of specific feedback moved it from \"fine\" to \"send-ready.\" That back-and-forth is where the real quality comes from.]",
};

const CANNED_PM: CannedSet = {
  contextBare:
    "Here's a general draft you could adapt:\n\nDear Tenant,\n\nWe wanted to reach out regarding your account. Please let us know if you have any questions.\n\nBest regards,\nManagement",
  contextRich:
    "Hi James,\n\nHope the team at Suite 400 is settling in well after the HVAC upgrade last month. I'm following up on the March CAM reconciliation — the $2,140 balance is now 15 days past due.\n\nI know invoicing can slip through the cracks this time of year, so no worries at all. Could you confirm a payment date this week? Happy to resend the itemized statement if useful.\n\nAppreciate you — and as always, let me know if there's anything Boise Plaza can do on our end.\n\nWarmly,\n[You]",
  testWithout:
    "Subject: Notice of Planned Maintenance\n\nDear Tenant,\n\nPlease be advised that maintenance will be performed in your building next week. We apologize for any inconvenience this may cause. Should you have any questions, please contact our office.\n\nSincerely,\nProperty Management",
  testWith:
    "Subject: Quick heads-up — planned maintenance at Boise Plaza next week\n\nHi James,\n\nWanted to give you plenty of notice: our maintenance team will be doing some planned upkeep in the building next week (likely Tuesday–Wednesday). You shouldn't see any disruption to your suite — you may just notice our crew in the common areas.\n\nIf there's a window that works better or worse for your team, let me know and we'll coordinate around you. As always, thanks for being a great part of Boise Plaza.\n\nWarmly,\n[You]",
  ...ITERATE_CANNED,
};

const CANNED_FACILITIES: CannedSet = {
  contextBare:
    "Here's a general summer checklist for commercial rooftop HVAC:\n\n1. Replace or clean air filters\n2. Inspect and clean condenser and evaporator coils\n3. Check refrigerant charge\n4. Test thermostat operation\n5. Inspect belts and pulleys\n6. Clear debris from around the unit\n7. Check electrical connections\n\nA licensed HVAC technician should perform a full inspection annually.",
  contextRich:
    "Here's a prioritized pre-summer walk-through for your older Carrier rooftop units:\n\n**Do first — highest failure risk for 10+ year units in Boise heat:**\n1. **Condenser coils — clean thoroughly.** Dusty, dry summers cake them, and dirty coils are the most likely cause of the short-cycling you saw last year. (Safe to do yourself.)\n2. **Capacitors & contactors** — heat kills aging capacitors; a $20 part fails as a $2,000 emergency call. Look for bulging, have your tech meter them.\n3. **Refrigerant charge + a short-cycle diagnosis** on the units that acted up — licensed tech only.\n\n**Safe to do yourself:**\n- Filters, belt tension and cracking, clear debris 3 ft around each unit, low-pressure coil rinse\n- Condensate drains — Boise's hard water plugs them; flush now, not in July\n\n**Book the tech for:**\n- Refrigerant work, electrical checks under load, compressor amp draw on the oldest units\n\nBudget tip: put the two units that short-cycled last summer at the front of the line — a repeat during a heat wave is your most likely emergency.",
  testWithout:
    "Work Order\n\nIssue: HVAC unit not functioning properly.\nAction: Technician to inspect unit and perform necessary repairs.\nPriority: Standard.\n\nPlease contact the office to schedule service.",
  testWith:
    "**Work order — Boise Plaza, RTU-3 (Carrier, ~10-ton)**\n\nSymptom: Short-cycling on hot afternoons — runs 4–5 minutes, trips, restarts.\nAlready done: Filter replaced, condenser coil rinsed, capacitor visually OK.\nRequested: Diagnostic on capacitor/refrigerant charge; quote before repair.\nPriority: High — tenant comfort at risk this week.\nAccess: Roof hatch by the east stairwell; on-site contact is the building engineer.\n\n(Notice the difference: the context version reads like it was written by someone who knows your buildings.)",
  ...ITERATE_CANNED,
};

const cannedFor = (trackId: string): CannedSet =>
  trackId === "facilities" ? CANNED_FACILITIES : CANNED_PM;
