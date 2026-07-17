"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Day-1 exercise blocks. Rendered by BlockView (default case).
// Each participates in the live backend (lib/fw-live) with a canned fallback so
// the portal is fully usable offline / on dead wifi.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { streamGenerate, capture, liveEnabled, fetchSharedContext } from "@/lib/fw-live";
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
        if (alive()) setStatus("done");
        return;
      } catch {
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
          <span className="font-inter text-[10px] uppercase tracking-wide text-steel/60">sample</span>
        )}
      </div>
      <pre className="whitespace-pre-wrap font-inter text-sm text-slate/80 leading-body px-4 py-3 flex-1">
        {text || <span className="text-steel/40">Run it to see the output.</span>}
      </pre>
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
const EFFORT_LABEL = process.env.NEXT_PUBLIC_FW_EFFORT_LABEL || "High";

function ModelBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 font-inter text-xs text-steel">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l2.4 6.8L21 11l-6.6 2.2L12 20l-2.4-6.8L3 11l6.6-2.2z" fill="#D97B2A" />
      </svg>
      <span className="font-medium text-slate/70">{MODEL_LABEL}</span>
      <span className="text-steel/40">·</span>
      <span>{EFFORT_LABEL} effort</span>
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
    rec.continuous = true;
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
          <RunButton onClick={() => bare.run(block.barePrompt, block.system, CANNED.contextBare)} busy={bare.status === "streaming"}>
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
          <RunButton onClick={() => rich.run(richPrompt, block.system, CANNED.contextRich)} busy={rich.status === "streaming"}>
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

function ContextFileTest({ block, ctx }: { block: Extract<Block, { type: "context-file-test" }>; ctx: ExerciseCtx }) {
  const [prompt, setPrompt] = useState(block.starterPrompt ?? "");
  const without = useStream(ctx.sessionId);
  const withCtx = useStream(ctx.sessionId);

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

      {source === "published" && (
        <p className="font-inter text-xs text-olive">Using the company context file we built together.</p>
      )}
      {source === "sample" && (
        <p className="font-inter text-xs text-steel">
          Using a sample R&amp;N context — your team&apos;s file will replace this once it&apos;s published.
        </p>
      )}
      <button onClick={loadShared} className="font-inter text-xs text-amber hover:underline w-fit">
        {checking ? "Checking…" : "↻ Refresh company file"}
      </button>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="font-inter text-xs text-steel">Without your context</p>
          <RunButton
            onClick={() => without.run(prompt, block.system, CANNED.testWithout)}
            disabled={!prompt.trim()}
            busy={without.status === "streaming"}
          >
            Run
          </RunButton>
          <OutputPanel label="Output" text={without.text} status={without.status} canned={without.canned} tone="steel" />
        </div>
        <div className="space-y-2">
          <p className="font-inter text-xs text-steel">With your context</p>
          <RunButton
            onClick={() => withCtx.run(`${effectiveContext}\n\n${prompt}`, block.system, CANNED.testWith)}
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

// ── #5 ⭐ More-is-More chunked prompt-builder ────────────────────────────────────

function PromptBuilder({ block, ctx }: { block: Extract<Block, { type: "prompt-builder" }>; ctx: ExerciseCtx }) {
  const [challengeId, setChallengeId] = useState<string>(block.challenges[0]?.id ?? "");
  const [chunks, setChunks] = useState<Record<string, string>>({});
  const out = useStream(ctx.sessionId);

  const challenge = block.challenges.find((c) => c.id === challengeId);

  const assembled = useMemo(() => {
    const parts = [challenge?.text ?? ""];
    for (const c of block.chunks) {
      const v = (chunks[c.id] ?? "").trim();
      if (v) parts.push(`${c.prefix ?? ""}${v}`);
    }
    return parts.filter(Boolean).join("\n\n");
  }, [challenge, chunks, block.chunks]);

  const filledCount = block.chunks.filter((c) => (chunks[c.id] ?? "").trim()).length;
  const ready = filledCount === block.chunks.length && !!challenge;

  function runMine() {
    capture({
      sessionId: ctx.sessionId,
      kind: "prompt-builder",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { challengeId, challenge: challenge?.label, prompt: assembled },
    });
    out.run(assembled, block.system, CANNED.builderRich);
  }

  return (
    <div className="space-y-5">
      {/* pick a challenge */}
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
        {challenge && <p className="font-inter text-sm text-slate/80 leading-body mt-3 bg-dust/40 px-3 py-2 border border-dust">{challenge.text}</p>}
      </div>

      {/* build it in chunks */}
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
              placeholder={c.placeholder}
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* assembled paragraph */}
      <div>
        <p className="section-label text-steel mb-2">Your prompt so far · {filledCount}/{block.chunks.length}</p>
        <pre className="whitespace-pre-wrap font-inter text-sm bg-amber/5 border border-amber/30 text-slate/80 px-4 py-3 leading-body min-h-[4rem]">
          {assembled || <span className="text-steel/40">Fill the steps above and watch your prompt build itself.</span>}
        </pre>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <RunButton onClick={runMine} disabled={!ready} busy={out.status === "streaming"}>
          Run my prompt →
        </RunButton>
        <ModelBadge />
      </div>

      {/* comparison */}
      {(out.status !== "idle") && (
        <div className="grid md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <p className="font-inter text-xs text-steel">The generic version: &ldquo;{block.genericPrompt}&rdquo;</p>
            <OutputPanel label="Generic output" text={block.genericOutput} status="done" canned tone="steel" />
          </div>
          <div className="space-y-1">
            <p className="font-inter text-xs text-steel">Your built prompt</p>
            <OutputPanel label="Your output" text={out.text} status={out.status} canned={out.canned} />
          </div>
        </div>
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

  function runFirst() {
    capture({
      sessionId: ctx.sessionId,
      kind: "iterate",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { stage: "first", task },
    });
    first.run(task, block.system, CANNED.iterateFirst);
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
    refined.run(combined, block.system, CANNED.iterateRefined);
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
        <div className="mt-2">
          <RunButton onClick={runFirst} disabled={!task.trim()} busy={first.status === "streaming"}>
            Get a first draft →
          </RunButton>
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
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem(setupKey(ctx.sessionId, ctx.name), JSON.stringify(next));
    capture({
      sessionId: ctx.sessionId,
      kind: "setup",
      name: ctx.name,
      trackId: ctx.trackId,
      payload: { done: next },
    });
  }

  const allIds = [...block.steps.map((s) => s.id), ...block.missions.map((m) => m.id)];
  const doneCount = allIds.filter((id) => done[id]).length;
  const pct = allIds.length ? Math.round((doneCount / allIds.length) * 100) : 0;

  function copyCheatsheet() {
    if (!block.cheatsheet) return;
    const text =
      "Claude cheat sheet\n\n" + block.cheatsheet.map((r) => `${r.q}\n  ${r.a}`).join("\n\n");
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }

  const CheckRow = ({ id, label, detail, icon }: { id: string; label: string; detail?: string; icon?: string }) => (
    <button
      onClick={() => toggle(id)}
      className={`w-full flex items-start gap-3 text-left px-4 py-3 border rounded-xl transition-colors ${
        done[id] ? "border-olive/40 bg-olive/5" : "border-dust bg-white hover:border-amber/60"
      }`}
    >
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
      <span className="min-w-0">
        <span className={`font-inter text-sm ${done[id] ? "text-slate/60 line-through" : "text-slate font-medium"}`}>
          {icon ? `${icon} ` : ""}
          {label}
        </span>
        {detail && <span className="block font-inter text-xs text-steel mt-0.5 no-underline">{detail}</span>}
      </span>
    </button>
  );

  return (
    <div className="space-y-6">
      {block.intro && <p className="font-inter text-slate/80 leading-body">{block.intro}</p>}

      {/* progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="section-label text-steel">Your setup · {doneCount}/{allIds.length}</span>
          <span className="font-inter text-xs text-steel">{pct}%</span>
        </div>
        <div className="h-1.5 bg-dust rounded-full overflow-hidden">
          <div className="h-full bg-amber transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* checklist + QR side by side */}
      <div className="grid md:grid-cols-[1fr_auto] gap-5 items-start">
        <div className="space-y-2">
          <p className="section-label text-steel mb-1">Get set up</p>
          {block.steps.map((s) => (
            <CheckRow key={s.id} id={s.id} label={s.label} />
          ))}
        </div>
        {qr && (
          <div className="text-center bg-slate rounded-2xl p-4 md:w-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Scan to open on your phone" className="w-40 h-40 mx-auto rounded-lg" />
            <p className="font-inter text-xs text-bone/70 mt-2">Scan to open this on your phone</p>
          </div>
        )}
      </div>

      {/* missions */}
      <div className="space-y-2">
        <p className="section-label text-steel mb-1">First missions — try these in your own Claude</p>
        {block.missions.map((m) => (
          <CheckRow key={m.id} id={m.id} label={m.label} detail={m.detail} icon={m.icon} />
        ))}
      </div>

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

export const INTERACTIVE_TYPES = new Set([
  "context-compare",
  "context-file",
  "context-file-test",
  "prompt-builder",
  "iterate",
  "setup-tour",
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
    default:
      return null;
  }
}

// ── canned fallbacks (used offline / if the Worker is down) ──────────────────────

const CANNED = {
  contextBare:
    "Here's a general draft you could adapt:\n\nDear Tenant,\n\nWe wanted to reach out regarding your account. Please let us know if you have any questions.\n\nBest regards,\nManagement",
  contextRich:
    "Hi James,\n\nHope the team at Suite 400 is settling in well after the HVAC upgrade last month. I'm following up on the March CAM reconciliation — the $2,140 balance is now 15 days past due.\n\nI know invoicing can slip through the cracks this time of year, so no worries at all. Could you confirm a payment date this week? Happy to resend the itemized statement if useful.\n\nAppreciate you — and as always, let me know if there's anything Boise Plaza can do on our end.\n\nWarmly,\n[You]",
  testWithout:
    "Subject: Notice of Planned Maintenance\n\nDear Tenant,\n\nPlease be advised that maintenance will be performed in your building next week. We apologize for any inconvenience this may cause. Should you have any questions, please contact our office.\n\nSincerely,\nProperty Management",
  testWith:
    "Subject: Quick heads-up — planned maintenance at Boise Plaza next week\n\nHi James,\n\nWanted to give you plenty of notice: our maintenance team will be doing some planned upkeep in the building next week (likely Tuesday–Wednesday). You shouldn't see any disruption to your suite — you may just notice our crew in the common areas.\n\nIf there's a window that works better or worse for your team, let me know and we'll coordinate around you. As always, thanks for being a great part of Boise Plaza.\n\nWarmly,\n[You]",
  builderRich:
    "Here's a first draft built to your spec:\n\n• Opens with the relationship, not the ask\n• States the specific issue (amount, days past due, property)\n• Firm but warm — preserves the tenant relationship\n• Ends with one clear call to action and a date\n\n[Because you described the end state, gave your reasoning, and let it ask clarifying questions, this landed far closer to send-ready than a one-line prompt ever would.]",
  iterateFirst:
    "Here's a first draft based on your task. It covers the basics and is a reasonable starting point — but it's a little generic, and there are a couple of spots you'll probably want to sharpen. Read it with a critical eye, then tell it what to fix.",
  iterateRefined:
    "Here's the revised version — retoned and tightened around exactly what you flagged. [Notice how one round of specific feedback moved it from \"fine\" to \"send-ready.\" That back-and-forth is where the real quality comes from.]",
};
