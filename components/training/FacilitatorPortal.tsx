"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Facilitator portal (/training/facilitator) — Gabe's control surface.
// Captures the out-loud exercises (icebreaker, one-word), aggregates everything
// participants submit in-app (context file, prompt gallery), runs the policy
// co-creation, and exports files to drop into Chris's deck.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPortalData, type PortalData, type Session } from "@/lib/training";
import {
  fetchSessionData,
  liveEnabled,
  streamGenerate,
  publishSharedContext,
  fetchSharedContext,
  resetSession,
  type CaptureRecord,
} from "@/lib/fw-live";

const FACILITATOR_CODE = process.env.NEXT_PUBLIC_FW_FACILITATOR_CODE || "FW-COACH";

type Tab = "icebreaker" | "wordcloud" | "context" | "prompts" | "setup" | "policy";

type SetupCfg = {
  steps: { id: string; label: string }[];
  missions: { id: string; label: string; icon?: string; tier?: string; track?: "pm" | "facilities" }[];
};

// ── download helper ─────────────────────────────────────────────────────────

function download(filename: string, content: string, type = "text/markdown;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── root ─────────────────────────────────────────────────────────────────────

export default function FacilitatorPortal() {
  const [data, setData] = useState<PortalData | null>(null);
  const [gate, setGate] = useState("");
  const [ok, setOk] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("icebreaker");

  const [records, setRecords] = useState<CaptureRecord[]>([]);
  const [pulledAt, setPulledAt] = useState<string>("");
  const [resetState, setResetState] = useState<"idle" | "confirm" | "working" | "done">("idle");

  useEffect(() => {
    getPortalData().then(setData).catch(() => {});
  }, []);

  const refresh = useCallback(async () => {
    if (!session) return;
    try {
      const recs = await fetchSessionData(session.id);
      setRecords(recs);
      setPulledAt(new Date().toLocaleTimeString());
    } catch {
      /* worker not configured / unreachable */
    }
  }, [session]);

  const doReset = useCallback(async () => {
    if (!session) return;
    setResetState("working");
    try {
      await resetSession(session.id);
      setRecords([]);
      setResetState("done");
      setTimeout(() => setResetState("idle"), 2500);
    } catch {
      setResetState("idle");
    }
  }, [session]);

  useEffect(() => {
    if (session) refresh();
  }, [session, refresh]);

  // Pull the setup-tour config (step/mission labels) from this session's lessons.
  const setupCfg = useMemo<SetupCfg | null>(() => {
    if (!data || !session) return null;
    const modIds = new Set(data.modules.filter((m) => m.sessionId === session.id).map((m) => m.id));
    for (const l of data.lessons) {
      if (!modIds.has(l.moduleId)) continue;
      for (const b of l.blocks) {
        if (b.type === "setup-tour") return { steps: b.steps, missions: b.missions };
      }
    }
    return null;
  }, [data, session]);

  if (!ok) {
    return (
      <Shell center>
        <div className="max-w-sm mx-auto text-center">
          <p className="section-label text-amber mb-3">Facilitator</p>
          <h1 className="font-syne font-semibold text-2xl text-slate mb-6">Control room</h1>
          <input
            autoFocus
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setOk(gate.trim().toUpperCase() === FACILITATOR_CODE)}
            placeholder="Facilitator code"
            className="w-full bg-white border border-dust focus:border-amber text-slate font-inter px-4 py-3 outline-none uppercase tracking-wide text-center"
          />
          <button
            onClick={() => setOk(gate.trim().toUpperCase() === FACILITATOR_CODE)}
            className="w-full mt-4 font-inter text-sm font-medium bg-slate text-bone px-5 py-3 hover:bg-olive transition-colors"
          >
            Enter
          </button>
        </div>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell center>
        <div className="max-w-md mx-auto">
          <p className="section-label text-amber mb-3">Pick a session</p>
          <div className="space-y-2">
            {data?.sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSession(s)}
                className="w-full text-left bg-white border border-dust hover:border-amber px-5 py-4 transition-colors"
              >
                <p className="font-inter font-medium text-slate">{s.title}</p>
                <p className="font-inter text-xs text-steel mt-0.5">{s.code}</p>
              </button>
            ))}
          </div>
          {!liveEnabled() && (
            <p className="font-inter text-xs text-amber mt-6">
              Live capture is off (NEXT_PUBLIC_FW_WORKER not set). Manual capture still works; aggregation of
              participant submissions needs the Worker.
            </p>
          )}
        </div>
      </Shell>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "icebreaker", label: "Icebreaker" },
    { id: "wordcloud", label: "Word cloud" },
    { id: "context", label: "Context file" },
    { id: "prompts", label: "Prompt gallery" },
    { id: "setup", label: "Setup board" },
    { id: "policy", label: "Policy" },
  ];

  return (
    <Shell>
      <header className="sticky top-0 z-20 bg-bone/90 backdrop-blur border-b border-dust">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-syne font-semibold text-slate">
              Fieldwork<span className="text-amber">.</span>AI
            </span>
            <span className="text-steel/50">·</span>
            <span className="font-inter text-sm text-steel truncate">Facilitator · {session.title}</span>
          </div>
          <button onClick={() => setSession(null)} className="font-inter text-sm text-steel hover:text-slate">
            Switch
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-inter text-sm px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id ? "border-amber text-slate font-medium" : "border-transparent text-steel hover:text-slate"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="font-inter text-xs text-steel">
            {liveEnabled() ? (
              <>
                Live capture on{pulledAt && ` · pulled ${pulledAt}`} · {records.length} submissions
              </>
            ) : (
              "Live capture off — manual entry only"
            )}
          </p>
          {liveEnabled() && (
            <div className="flex items-center gap-3">
              {resetState === "idle" && (
                <button
                  onClick={() => setResetState("confirm")}
                  className="font-inter text-xs text-steel/60 hover:text-red-500 transition-colors"
                >
                  Reset session data
                </button>
              )}
              {resetState === "confirm" && (
                <span className="flex items-center gap-2 font-inter text-xs">
                  <span className="text-slate">Wipe all data for {session.title}?</span>
                  <button onClick={doReset} className="font-medium text-red-500 hover:underline">Yes, wipe</button>
                  <button onClick={() => setResetState("idle")} className="text-steel hover:text-slate">cancel</button>
                </span>
              )}
              {resetState === "working" && <span className="font-inter text-xs text-steel">Wiping…</span>}
              {resetState === "done" && <span className="font-inter text-xs text-olive">Cleared ✓</span>}
              <button onClick={refresh} className="font-inter text-xs font-medium border border-amber/50 text-amber px-3 py-1.5 hover:bg-amber hover:text-white transition-colors">
                Refresh
              </button>
            </div>
          )}
        </div>

        {tab === "icebreaker" && <Icebreaker />}
        {tab === "wordcloud" && <WordCloud />}
        {tab === "context" && <ContextAggregate records={records} sessionId={session.id} sessionName={session.title} />}
        {tab === "prompts" && <PromptGallery records={records} />}
        {tab === "setup" && <SetupBoard records={records} config={setupCfg} />}
        {tab === "policy" && <Policy sessionName={session.title} />}
      </div>
    </Shell>
  );
}

function Shell({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className="min-h-screen bg-bone text-slate font-inter">
      {center ? <div className="min-h-screen flex flex-col justify-center px-6 py-16">{children}</div> : children}
    </div>
  );
}

function Btn({ onClick, children, ghost }: { onClick: () => void; children: React.ReactNode; ghost?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={
        ghost
          ? "font-inter text-sm font-medium border border-amber/50 text-amber px-4 py-2 hover:bg-amber hover:text-white transition-colors"
          : "font-inter text-sm font-medium bg-slate text-bone px-4 py-2 hover:bg-olive transition-colors"
      }
    >
      {children}
    </button>
  );
}

// ── #1 Icebreaker (manual capture) ─────────────────────────────────────────────

function Icebreaker() {
  const [home, setHome] = useState<string[]>([]);
  const [work, setWork] = useState<string[]>([]);
  const [hv, setHv] = useState("");
  const [wv, setWv] = useState("");

  const add = (list: string[], set: (v: string[]) => void, v: string, clear: () => void) => {
    if (v.trim()) {
      set([...list, v.trim()]);
      clear();
    }
  };

  function exportTxt() {
    const md = `# Icebreaker — tasks to hand off\n\n## At home\n${home.map((t) => `- ${t}`).join("\n")}\n\n## At work\n${work.map((t) => `- ${t}`).join("\n")}\n`;
    download("icebreaker.md", md);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[
        { title: "At HOME — dreaded chore", list: home, set: setHome, v: hv, setV: setHv },
        { title: "At WORK — task you'd hand off", list: work, set: setWork, v: wv, setV: setWv },
      ].map((col) => (
        <div key={col.title}>
          <p className="section-label text-steel mb-2">{col.title}</p>
          <div className="flex gap-2 mb-3">
            <input
              value={col.v}
              onChange={(e) => col.setV(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add(col.list, col.set, col.v, () => col.setV(""))}
              placeholder="Type what they said, Enter to add"
              className="flex-1 bg-white border border-dust focus:border-amber px-3 py-2 outline-none text-sm"
            />
            <Btn onClick={() => add(col.list, col.set, col.v, () => col.setV(""))}>Add</Btn>
          </div>
          <ul className="space-y-1.5">
            {col.list.map((t, i) => (
              <li key={i} className="flex justify-between items-center bg-white border border-dust px-3 py-2 text-sm">
                <span>{t}</span>
                <button onClick={() => col.set(col.list.filter((_, j) => j !== i))} className="text-steel/50 hover:text-amber">×</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="md:col-span-2">
        <Btn onClick={exportTxt} ghost>Export icebreaker.md</Btn>
      </div>
    </div>
  );
}

// ── #2 Word cloud (manual capture + PNG export) ─────────────────────────────────

function WordCloud() {
  const [words, setWords] = useState<string[]>([]);
  const [v, setV] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase();
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [words]);

  const max = counts[0]?.[1] ?? 1;

  function exportPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 1280, H = 720;
    canvas.width = W;
    canvas.height = H;
    ctx.fillStyle = "#0F1923";
    ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = "middle";
    // simple wrapped-rows layout, largest first
    let x = 60, y = 140, rowH = 0;
    counts.forEach(([word, c], i) => {
      const size = 28 + (c / max) * 90;
      ctx.font = `700 ${size}px Inter, sans-serif`;
      ctx.fillStyle = i % 3 === 0 ? "#D97B2A" : "#F0EBE1";
      const w = ctx.measureText(word).width;
      if (x + w > W - 60) {
        x = 60;
        y += rowH + 24;
        rowH = 0;
      }
      ctx.fillText(word, x, y + size / 2);
      x += w + 40;
      rowH = Math.max(rowH, size);
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "word-cloud.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div>
      <p className="section-label text-steel mb-2">One word — how you feel about AI</p>
      <div className="flex gap-2 mb-5 max-w-md">
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && v.trim()) {
              setWords([...words, v.trim()]);
              setV("");
            }
          }}
          placeholder="Type a word, Enter to add"
          className="flex-1 bg-white border border-dust focus:border-amber px-3 py-2 outline-none text-sm"
        />
        <Btn onClick={() => { if (v.trim()) { setWords([...words, v.trim()]); setV(""); } }}>Add</Btn>
      </div>

      <div className="bg-slate rounded p-8 min-h-[16rem] flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4">
        {counts.length === 0 && <span className="text-bone/40 font-inter text-sm">Words appear here as you add them.</span>}
        {counts.map(([word, c], i) => (
          <span
            key={word}
            className={i % 3 === 0 ? "text-amber font-syne font-bold" : "text-bone font-syne font-bold"}
            style={{ fontSize: `${1 + (c / max) * 2.2}rem`, lineHeight: 1 }}
          >
            {word}
          </span>
        ))}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <Btn onClick={exportPng} ghost>Export word-cloud.png</Btn>
      <p className="font-inter text-xs text-steel/70 mt-3">Re-run this at the end of Day 2 to show the before/after shift.</p>
    </div>
  );
}

// ── #4 Context file aggregation ────────────────────────────────────────────────

const CTX_SECTIONS: { id: string; label: string }[] = [
  { id: "who", label: "Who we are" },
  { id: "what", label: "What we do" },
  { id: "market", label: "What makes us different" },
  { id: "culture", label: "Our culture & voice" },
  { id: "always", label: "What AI should always know" },
];

function ContextAggregate({
  records,
  sessionId,
  sessionName,
}: {
  records: CaptureRecord[];
  sessionId: string;
  sessionName: string;
}) {
  const contribs = records.filter((r) => r.kind === "context-file");

  const bySection = useMemo(() => {
    const out: Record<string, { name: string; text: string }[]> = {};
    for (const s of CTX_SECTIONS) out[s.id] = [];
    for (const r of contribs) {
      const sections = (r.payload?.sections ?? {}) as Record<string, string>;
      for (const s of CTX_SECTIONS) {
        const t = (sections[s.id] ?? "").trim();
        if (t) out[s.id].push({ name: r.name || "Someone", text: t });
      }
    }
    return out;
  }, [contribs]);

  const [draft, setDraft] = useState("");
  const [gen, setGen] = useState<"idle" | "running" | "done">("idle");
  const [pub, setPub] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasPublished, setHasPublished] = useState(false);

  // Load any already-published version so the facilitator can see / re-edit it.
  useEffect(() => {
    fetchSharedContext(sessionId).then((d) => {
      if (d) {
        setHasPublished(true);
        setDraft((cur) => cur || d);
      }
    });
  }, [sessionId]);

  const rawContributions = useMemo(
    () =>
      CTX_SECTIONS.map((s) => {
        const items = bySection[s.id];
        return `## ${s.label}\n` + (items.length ? items.map((i) => `- ${i.text}`).join("\n") : "- (none)");
      }).join("\n\n"),
    [bySection]
  );

  async function synthesize() {
    setGen("running");
    setDraft("");
    setPub("idle");
    const prompt = `You are assembling the company "context file" for ${sessionName} from raw notes the team contributed during an AI training. Synthesize the notes below into ONE clear, well-organized markdown company context file — the background you'd paste at the top of every AI conversation so it understands the company. Keep it concrete and faithful to the inputs; de-duplicate, resolve overlaps sensibly, and write in a confident, useful voice. Cover: who we are, what we do, what makes us different, our culture & voice, what we run day to day, and what AI should always know. Output only the markdown file.\n\nRAW CONTRIBUTIONS:\n\n${rawContributions}`;
    try {
      await streamGenerate({
        sessionId,
        prompt,
        system: "You write crisp, well-structured company context documents that make an AI assistant instantly useful. Output clean markdown only — no preamble.",
        model: "claude-opus-4-8",
        maxTokens: 3000,
        onToken: (t) => setDraft((p) => p + t),
      });
    } catch {
      /* leave whatever streamed */
    }
    setGen("done");
  }

  async function publish() {
    if (!draft.trim()) return;
    setPub("saving");
    try {
      await publishSharedContext(sessionId, draft);
      setPub("saved");
      setHasPublished(true);
    } catch {
      setPub("error");
    }
  }

  return (
    <div className="space-y-6">
      {/* what came in */}
      <div>
        <p className="section-label text-steel mb-2">{contribs.length} contribution(s) — what came in</p>
        <div className="space-y-3">
          {CTX_SECTIONS.map((s) => (
            <div key={s.id} className="bg-white border border-dust">
              <p className="section-label text-amber px-4 py-2 border-b border-dust">{s.label}</p>
              <ul className="px-4 py-3 space-y-2">
                {bySection[s.id].length === 0 && <li className="text-sm text-steel/40">No input yet.</li>}
                {bySection[s.id].map((i, idx) => (
                  <li key={idx} className="text-sm text-slate/80">
                    {i.text} <span className="text-steel/50 text-xs">— {i.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* synthesize → edit → publish */}
      <div className="border-t border-dust pt-5 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Btn onClick={synthesize}>{gen === "running" ? "Synthesizing (Opus)…" : "Synthesize with Opus"}</Btn>
          <span className="font-inter text-xs text-steel">
            Builds one company file from everything above (plus anything you type). Edit it, then publish.
          </span>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={14}
          placeholder="Synthesize from the contributions, or paste / type the company context file here…"
          className="w-full bg-white border border-dust focus:border-amber px-4 py-3 outline-none text-sm leading-body rounded font-mono"
        />
        <div className="flex items-center gap-3 flex-wrap">
          <Btn onClick={publish}>Publish to the room →</Btn>
          {pub === "saved" && (
            <span className="font-inter text-sm text-olive">Published ✓ — this now feeds &ldquo;Prove it works.&rdquo;</span>
          )}
          {pub === "error" && <span className="font-inter text-sm text-amber">Couldn&apos;t publish — try again.</span>}
          {pub === "idle" && hasPublished && (
            <span className="font-inter text-xs text-steel">A published version exists — publishing replaces it.</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── #5 Prompt gallery ──────────────────────────────────────────────────────────

function PromptGallery({ records }: { records: CaptureRecord[] }) {
  const prompts = records.filter((r) => r.kind === "prompt-builder");

  function exportMd() {
    let md = `# Prompt gallery\n\n`;
    for (const r of prompts) {
      md += `## ${r.name || "Someone"} — ${(r.payload?.challenge as string) ?? ""}\n\n${(r.payload?.prompt as string) ?? ""}\n\n---\n\n`;
    }
    download("prompt-gallery.md", md);
  }

  return (
    <div>
      <p className="font-inter text-sm text-steel mb-4">{prompts.length} prompt(s) built. Pull a few onto the screen and ask what surprised them.</p>
      <div className="space-y-3">
        {prompts.map((r) => (
          <div key={r.id} className="bg-white border border-dust">
            <div className="flex items-center justify-between px-4 py-2 border-b border-dust">
              <span className="font-inter text-sm font-medium text-slate">{r.name || "Someone"}</span>
              <span className="font-inter text-xs text-steel">{(r.payload?.challenge as string) ?? ""}</span>
            </div>
            <pre className="whitespace-pre-wrap font-inter text-sm text-slate/80 px-4 py-3 leading-body">
              {(r.payload?.prompt as string) ?? ""}
            </pre>
          </div>
        ))}
        {prompts.length === 0 && <p className="text-sm text-steel/40">No prompts submitted yet.</p>}
      </div>
      {prompts.length > 0 && (
        <div className="mt-5">
          <Btn onClick={exportMd} ghost>Export prompt-gallery.md</Btn>
        </div>
      )}
    </div>
  );
}

// ── Setup board — live room progress (projector-friendly) ──────────────────────

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-dust rounded-xl px-4 py-3 min-w-[7rem]">
      <p className="font-syne font-semibold text-2xl text-slate leading-none">{value}</p>
      <p className="font-inter text-xs text-steel mt-1">{label}</p>
    </div>
  );
}

function SetupBoard({ records, config }: { records: CaptureRecord[]; config: SetupCfg | null }) {
  const byName = new Map<string, { done: Record<string, boolean>; trackId: string }>();
  for (const r of records) {
    if (r.kind !== "setup") continue;
    if (!byName.has(r.name))
      byName.set(r.name, { done: (r.payload?.done as Record<string, boolean>) || {}, trackId: (r.trackId as string) || "" });
  }
  const people = Array.from(byName.entries());

  if (!config) {
    return <p className="font-inter text-sm text-steel">No setup section found in this session&apos;s content.</p>;
  }
  if (people.length === 0) {
    return (
      <p className="font-inter text-sm text-steel/60">
        No one has started yet. This lights up as the room sets up and works the walk-through (incl. homework).
      </p>
    );
  }

  // Missions this person can actually do (steps are all-track).
  const applicable = (trackId: string) => [
    ...config.steps,
    ...config.missions.filter((m) => !m.track || m.track === trackId),
  ];
  const progress = (p: { done: Record<string, boolean>; trackId: string }) => {
    const items = applicable(p.trackId);
    return { items, n: items.filter((it) => p.done[it.id]).length, total: items.length };
  };
  const fullyDone = people.filter(([, p]) => {
    const { n, total } = progress(p);
    return total > 0 && n === total;
  }).length;
  const trackLabel = (t: string) => (t === "pm" ? "PM" : t === "facilities" ? "Fac" : "—");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Metric label="In the room" value={`${people.length}`} />
        <Metric label="Fully done" value={`${fullyDone}/${people.length}`} />
        {config.steps.map((s) => (
          <Metric key={s.id} label={s.label} value={`${people.filter(([, p]) => p.done[s.id]).length}/${people.length}`} />
        ))}
      </div>

      <div className="space-y-2">
        {people
          .slice()
          .sort((a, b) => {
            const A = progress(a[1]);
            const B = progress(b[1]);
            return B.n / (B.total || 1) - A.n / (A.total || 1);
          })
          .map(([name, p]) => {
            const { items, n, total } = progress(p);
            const complete = total > 0 && n === total;
            return (
              <div
                key={name}
                className={`flex items-center gap-3 px-4 py-2.5 border rounded-xl ${
                  complete ? "border-olive/40 bg-olive/5" : "border-dust bg-white"
                }`}
              >
                <span className="font-inter text-sm font-medium text-slate w-36 truncate">
                  {name} <span className="text-steel/50 text-xs">· {trackLabel(p.trackId)}</span>
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {items.map((it) => (
                    <span
                      key={it.id}
                      title={it.label}
                      className={`w-3.5 h-3.5 rounded-full ${p.done[it.id] ? "bg-olive" : "bg-dust"}`}
                    />
                  ))}
                </div>
                <span className={`font-inter text-xs shrink-0 ${complete ? "text-olive font-medium" : "text-steel"}`}>
                  {complete ? "ready ✓" : `${n}/${total}`}
                </span>
              </div>
            );
          })}
      </div>
      <p className="font-inter text-xs text-steel/60">
        Green dots = done, track-aware. Your between-sessions homework tracker — hit Refresh to update.
      </p>
    </div>
  );
}

// ── #6 Policy co-creation (group, facilitator-led) ─────────────────────────────

const POLICY_FIELDS: { id: string; label: string; help: string }[] = [
  { id: "why", label: "Why we use AI", help: "We use AI to ______. A human is always accountable for the result." },
  { id: "tools", label: "Our tools", help: "Our sanctioned AI: ______. We don't put company or client info into unapproved tools." },
  { id: "use", label: "What we use AI for", help: "Approved tasks — one per line." },
  { id: "human", label: "What stays human", help: "Work AI never does alone / decisions that always need a person — one per line." },
  { id: "data", label: "Our data & access rules", help: "OK to put in / never put in / what AI can read vs. change vs. send." },
  { id: "accountable", label: "How we stay accountable", help: "Humans own output. We verify ______. Transparent when AI shaped client work. Point person: ______. When something's wrong, we ______." },
];

function Policy({ sessionName }: { sessionName: string }) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [risks, setRisks] = useState<string[]>([]);
  const [openQs, setOpenQs] = useState<string[]>([]);
  const [rv, setRv] = useState("");
  const [ov, setOv] = useState("");

  function exportMd() {
    let md = `# ${sessionName} — AI Usage Policy (DRAFT)\n\n> Drafted with the team on Day 1. Fieldwork to resolve open questions with Scott & Justin. Full team ratifies Day 2.\n\n`;
    if (risks.length) md += `**Risks we named:** ${risks.join("; ")}\n\n`;
    for (const f of POLICY_FIELDS) {
      md += `## ${f.label}\n${(fields[f.id] ?? "").trim() || "_(to complete)_"}\n\n`;
    }
    md += `## Open questions (to ratify Day 2)\n${openQs.length ? openQs.map((q) => `- ${q}`).join("\n") : "_(none captured)_"}\n\n`;
    md += `## Ratification\nSigned by ______ on ______.\n`;
    download("ai-usage-policy-draft.md", md);
  }

  const addTo = (list: string[], set: (v: string[]) => void, v: string, clear: () => void) => {
    if (v.trim()) { set([...list, v.trim()]); clear(); }
  };

  return (
    <div className="space-y-6">
      <div className="border-l-2 border-olive/30 bg-olive/5 pl-4 pr-4 py-3">
        <p className="section-label text-olive mb-1">Group exercise — out loud</p>
        <p className="font-inter text-sm text-slate/80">Capture the discussion here as the team talks it through. Park the hard debates as open questions — don&apos;t resolve them in the room.</p>
      </div>

      {/* risk brainstorm */}
      <div>
        <p className="section-label text-steel mb-2">Risks we brainstormed</p>
        <div className="flex gap-2 mb-2 max-w-lg">
          <input value={rv} onChange={(e) => setRv(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTo(risks, setRisks, rv, () => setRv(""))}
            placeholder="e.g. our leases leak to a competitor"
            className="flex-1 bg-white border border-dust focus:border-amber px-3 py-2 outline-none text-sm" />
          <Btn onClick={() => addTo(risks, setRisks, rv, () => setRv(""))}>Add</Btn>
        </div>
        <div className="flex flex-wrap gap-2">
          {risks.map((r, i) => (
            <span key={i} className="text-xs bg-white border border-dust px-2 py-1">{r}
              <button onClick={() => setRisks(risks.filter((_, j) => j !== i))} className="ml-2 text-steel/50 hover:text-amber">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* the fill-in template */}
      <div className="space-y-4">
        {POLICY_FIELDS.map((f) => (
          <div key={f.id}>
            <label className="font-inter text-sm font-medium text-slate block mb-1">{f.label}</label>
            <p className="font-inter text-xs text-steel mb-1.5">{f.help}</p>
            <textarea
              value={fields[f.id] ?? ""}
              onChange={(e) => setFields((v) => ({ ...v, [f.id]: e.target.value }))}
              rows={2}
              className="w-full bg-white border border-dust focus:border-amber px-3 py-2 outline-none text-sm leading-body"
            />
          </div>
        ))}
      </div>

      {/* open questions */}
      <div>
        <p className="section-label text-steel mb-2">Key open questions</p>
        <div className="flex gap-2 mb-2 max-w-lg">
          <input value={ov} onChange={(e) => setOv(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTo(openQs, setOpenQs, ov, () => setOv(""))}
            placeholder="Something that sparked debate — park it here"
            className="flex-1 bg-white border border-dust focus:border-amber px-3 py-2 outline-none text-sm" />
          <Btn onClick={() => addTo(openQs, setOpenQs, ov, () => setOv(""))}>Add</Btn>
        </div>
        <ul className="space-y-1.5">
          {openQs.map((q, i) => (
            <li key={i} className="flex justify-between items-center bg-white border border-dust px-3 py-2 text-sm">
              <span>{q}</span>
              <button onClick={() => setOpenQs(openQs.filter((_, j) => j !== i))} className="text-steel/50 hover:text-amber">×</button>
            </li>
          ))}
        </ul>
      </div>

      <Btn onClick={exportMd} ghost>Export ai-usage-policy-draft.md</Btn>
    </div>
  );
}
