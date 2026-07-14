// ─────────────────────────────────────────────────────────────────────────────
// Fieldwork live backend client
//
// The site is a static export (GitHub Pages) — no server, no place to hide an
// API key. Live Claude calls + input capture therefore go to an external
// Cloudflare Worker that holds the ANTHROPIC_API_KEY as a secret. See
// worker/README.md for deploy steps.
//
//   NEXT_PUBLIC_FW_WORKER  → the Worker base URL (e.g. https://fw-training.<sub>.workers.dev)
//   NEXT_PUBLIC_FW_TOKEN   → a shared, low-sensitivity token echoed on each call.
//                            NOT a secret (it ships in the bundle); the real
//                            guardrails are the Worker's origin allowlist + rate
//                            limiting. It just stops trivial drive-by scraping.
//
// If NEXT_PUBLIC_FW_WORKER is unset, liveEnabled() is false and callers fall
// back to a canned experience — so the portal is fully explorable offline and
// survives dead conference-room wifi.
// ─────────────────────────────────────────────────────────────────────────────

const WORKER = process.env.NEXT_PUBLIC_FW_WORKER?.replace(/\/$/, "");
const TOKEN = process.env.NEXT_PUBLIC_FW_TOKEN ?? "";

export const liveEnabled = (): boolean => Boolean(WORKER);

/** Raised when the live backend is unreachable or not configured. */
export class LiveUnavailable extends Error {
  constructor(msg = "Live backend unavailable") {
    super(msg);
    this.name = "LiveUnavailable";
  }
}

/**
 * Stream a Claude completion via the Worker. Calls onToken with each text
 * fragment as it arrives and resolves with the full text. Throws
 * LiveUnavailable if no Worker is configured or the request fails to open.
 */
export async function streamGenerate(opts: {
  sessionId: string;
  prompt: string;
  system?: string;
  onToken: (t: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  if (!WORKER) throw new LiveUnavailable("NEXT_PUBLIC_FW_WORKER not set");

  let res: Response;
  try {
    res = await fetch(`${WORKER}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: TOKEN,
        sessionId: opts.sessionId,
        prompt: opts.prompt,
        system: opts.system,
      }),
      signal: opts.signal,
    });
  } catch {
    throw new LiveUnavailable("Could not reach the Worker");
  }
  if (!res.ok || !res.body) throw new LiveUnavailable(`Worker ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  // The Worker re-emits Anthropic's stream as simple SSE lines: `data: {"text":"…"}`
  // plus a terminal `data: [DONE]`.
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let obj: { text?: string; error?: string };
      try {
        obj = JSON.parse(payload);
      } catch {
        continue; // ignore keep-alive / non-JSON lines
      }
      if (obj.error) throw new LiveUnavailable(obj.error);
      if (typeof obj.text === "string") {
        full += obj.text;
        opts.onToken(obj.text);
      }
    }
  }
  // A 200 with zero tokens is a transient upstream hiccup — treat it as failure
  // so the caller can retry / fall back instead of showing a blank box.
  if (!full) throw new LiveUnavailable("empty response");
  return full;
}

export type CaptureKind =
  | "icebreaker"
  | "wordcloud"
  | "context-file"
  | "prompt-builder"
  | "policy";

/**
 * Fire-and-forget capture of a participant submission for live facilitator
 * aggregation. Never throws — capture is best-effort and must not break the
 * learner's flow if the Worker is down.
 */
export async function capture(opts: {
  sessionId: string;
  kind: CaptureKind;
  name: string;
  trackId?: string;
  payload: Record<string, unknown>;
}): Promise<void> {
  if (!WORKER) return;
  try {
    await fetch(`${WORKER}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ token: TOKEN, ...opts }),
    });
  } catch {
    /* best-effort */
  }
}

export type CaptureRecord = {
  id: string;
  ts: number;
  kind: CaptureKind;
  name: string;
  trackId?: string;
  payload: Record<string, unknown>;
};

/** Facilitator: pull every capture for a session (newest first). */
export async function fetchSessionData(sessionId: string): Promise<CaptureRecord[]> {
  if (!WORKER) throw new LiveUnavailable("NEXT_PUBLIC_FW_WORKER not set");
  const res = await fetch(
    `${WORKER}/session-data?token=${encodeURIComponent(TOKEN)}&sessionId=${encodeURIComponent(sessionId)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new LiveUnavailable(`Worker ${res.status}`);
  const data = (await res.json()) as { records?: CaptureRecord[] };
  return data.records ?? [];
}
