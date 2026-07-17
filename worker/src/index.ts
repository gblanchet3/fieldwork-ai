// ─────────────────────────────────────────────────────────────────────────────
// Fieldwork Training — Cloudflare Worker
//
// The training web app is a static export with no backend. This Worker is the
// backend: it proxies streaming Claude calls (holding the Anthropic key as a
// secret, never in the repo) and captures participant submissions for live
// facilitator aggregation.
//
// Endpoints
//   POST /generate       { token, sessionId, prompt, system? }  → SSE stream of {"text":"…"}
//   POST /capture        { token, sessionId, kind, name, trackId?, payload }  → { ok: true }
//   GET  /session-data   ?token=&sessionId=                      → { records: [...] }
//
// Guardrails: origin allowlist + shared token + per-IP rate limit on /generate.
// See README.md for deploy.
// ─────────────────────────────────────────────────────────────────────────────

export interface Env {
  FW_KV: KVNamespace;
  ANTHROPIC_API_KEY: string;
  FW_TOKEN: string;
  ALLOWED_ORIGINS: string; // comma-separated
  MODEL?: string;
}

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const RATE_LIMIT = 30; // /generate calls per IP per window
const RATE_WINDOW_S = 60;
const RECORD_TTL_S = 60 * 60 * 24 * 30; // 30 days

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin") ?? "";
    const cors = corsHeaders(origin, env);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    try {
      if (url.pathname === "/generate" && req.method === "POST") return handleGenerate(req, env, cors);
      if (url.pathname === "/capture" && req.method === "POST") return handleCapture(req, env, cors);
      if (url.pathname === "/session-data" && req.method === "GET") return handleSessionData(url, env, cors);
      if (url.pathname === "/publish" && req.method === "POST") return handlePublish(req, env, cors);
      if (url.pathname === "/shared" && req.method === "GET") return handleShared(url, env, cors);
      return json({ error: "not found" }, 404, cors);
    } catch (err) {
      return json({ error: String(err) }, 500, cors);
    }
  },
};

// ── /generate ────────────────────────────────────────────────────────────────

async function handleGenerate(req: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as {
    token?: string;
    sessionId?: string;
    prompt?: string;
    system?: string;
    image?: { data: string; mediaType: string }; // base64 (no data: prefix) + media type
    model?: string; // per-request override (e.g. Opus for the context synthesis)
    maxTokens?: number;
  };
  if (body.token !== env.FW_TOKEN) return json({ error: "bad token" }, 401, cors);
  if (!body.prompt) return json({ error: "missing prompt" }, 400, cors);

  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  if (await isRateLimited(env, ip)) return json({ error: "rate limited" }, 429, cors);

  // Text-only or multimodal (image + text) message content.
  const content = body.image
    ? [
        { type: "image", source: { type: "base64", media_type: body.image.mediaType, data: body.image.data } },
        { type: "text", text: body.prompt },
      ]
    : body.prompt;

  const upstream = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || env.MODEL || "claude-sonnet-5",
      max_tokens: body.maxTokens || 1500,
      stream: true,
      system: body.system,
      messages: [{ role: "user", content }],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return json({ error: `anthropic ${upstream.status}`, detail }, 502, cors);
  }

  // Translate Anthropic's SSE into simple `data: {"text":"…"}` lines.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const evt of events) {
        const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
        if (!dataLine) continue;
        try {
          const parsed = JSON.parse(dataLine.slice(5).trim());
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`));
          } else if (parsed.type === "error") {
            // Anthropic can return 200 then an error event mid-stream (overload,
            // rate limit). Surface it so the client retries instead of hanging.
            const msg = parsed.error?.message || "upstream stream error";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          }
        } catch {
          /* skip non-JSON keep-alives */
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      ...cors,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

// ── /capture ─────────────────────────────────────────────────────────────────

async function handleCapture(req: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (body.token !== env.FW_TOKEN) return json({ error: "bad token" }, 401, cors);
  const sessionId = String(body.sessionId ?? "");
  if (!sessionId) return json({ error: "missing sessionId" }, 400, cors);

  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const record = {
    id: `${ts}-${rand}`,
    ts,
    kind: body.kind ?? "unknown",
    name: body.name ?? "",
    trackId: body.trackId ?? "",
    payload: body.payload ?? {},
  };
  // Prefix-listed keys — avoids read-modify-write clobbering under concurrency.
  await env.FW_KV.put(`rec:${sessionId}:${ts}:${rand}`, JSON.stringify(record), {
    expirationTtl: RECORD_TTL_S,
  });
  return json({ ok: true }, 200, cors);
}

// ── /session-data ──────────────────────────────────────────────────────────────

async function handleSessionData(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  if (url.searchParams.get("token") !== env.FW_TOKEN) return json({ error: "bad token" }, 401, cors);
  const sessionId = url.searchParams.get("sessionId") ?? "";
  if (!sessionId) return json({ error: "missing sessionId" }, 400, cors);

  const list = await env.FW_KV.list({ prefix: `rec:${sessionId}:` });
  const records = await Promise.all(
    list.keys.map(async (k) => {
      const v = await env.FW_KV.get(k.name);
      return v ? JSON.parse(v) : null;
    })
  );
  const clean = records.filter(Boolean).sort((a, b) => b.ts - a.ts);
  return json({ records: clean }, 200, cors);
}

// ── /publish + /shared — the facilitator-approved company context file ──────────

async function handlePublish(req: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as { token?: string; sessionId?: string; doc?: string };
  if (body.token !== env.FW_TOKEN) return json({ error: "bad token" }, 401, cors);
  const sessionId = String(body.sessionId ?? "");
  if (!sessionId) return json({ error: "missing sessionId" }, 400, cors);
  await env.FW_KV.put(`shared:${sessionId}:context`, String(body.doc ?? ""), { expirationTtl: RECORD_TTL_S });
  return json({ ok: true }, 200, cors);
}

async function handleShared(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  if (url.searchParams.get("token") !== env.FW_TOKEN) return json({ error: "bad token" }, 401, cors);
  const sessionId = url.searchParams.get("sessionId") ?? "";
  if (!sessionId) return json({ error: "missing sessionId" }, 400, cors);
  const doc = await env.FW_KV.get(`shared:${sessionId}:context`);
  return json({ doc: doc ?? null }, 200, cors);
}

// ── helpers ────────────────────────────────────────────────────────────────────

async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  const key = `rl:${ip}`;
  const current = parseInt((await env.FW_KV.get(key)) ?? "0", 10);
  if (current >= RATE_LIMIT) return true;
  await env.FW_KV.put(key, String(current + 1), { expirationTtl: RATE_WINDOW_S });
  return false;
}

function corsHeaders(origin: string, env: Env): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
  const ok = allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0] ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(obj: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
