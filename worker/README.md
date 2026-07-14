# Fieldwork Training Worker

The backend for the static training app: a Cloudflare Worker that (1) proxies
streaming Claude calls (holding the Anthropic key as a secret, never in the
repo) and (2) captures participant submissions for live facilitator aggregation.

## One-time deploy

```bash
cd "06-projects/Fieldwork AI/worker"
npm install

# 1. Create the KV namespace, then paste the printed id into wrangler.toml → kv_namespaces.id
npx wrangler kv namespace create FW_KV

# 2. Set the two secrets (never committed)
npx wrangler secret put ANTHROPIC_API_KEY      # your Anthropic API key
npx wrangler secret put FW_TOKEN               # any random string, e.g. `openssl rand -hex 16`

# 3. Ship it
npx wrangler deploy
```

`wrangler deploy` prints the Worker URL, e.g. `https://fw-training.<subdomain>.workers.dev`.

## Point the app at it

In the Fieldwork site (`06-projects/Fieldwork AI/`), create/update `.env.local`
for local dev — and set the same two vars in the GitHub Pages build environment
for production:

```
NEXT_PUBLIC_FW_WORKER=https://fw-training.<subdomain>.workers.dev
NEXT_PUBLIC_FW_TOKEN=<the same FW_TOKEN you set above>
```

`NEXT_PUBLIC_FW_TOKEN` is **not** a secret — it ships in the client bundle. The
real guardrails are the Worker's origin allowlist (`ALLOWED_ORIGINS` in
`wrangler.toml`) + per-IP rate limiting. The token only deters trivial scraping.

If `NEXT_PUBLIC_FW_WORKER` is unset, the app runs in **canned mode** — every
exercise still works with pre-written sample output, so the portal is fully
demoable offline and survives dead conference-room wifi.

## Endpoints

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| POST | `/generate` | `{ token, sessionId, prompt, system? }` | SSE stream of `data: {"text":"…"}` |
| POST | `/capture` | `{ token, sessionId, kind, name, trackId?, payload }` | `{ ok: true }` |
| GET | `/session-data` | `?token=&sessionId=` | `{ records: [...] }` |

Capture records auto-expire after 30 days.
