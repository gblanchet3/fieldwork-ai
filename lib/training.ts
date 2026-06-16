// ─────────────────────────────────────────────────────────────────────────────
// Training-portal data layer
//
// TODAY (mock mode): portal content is imported from data/training-portal.json,
// baked into the static build. Everything works offline, no backend.
//
// TO GO LIVE (Google Sheet mode): create a Google Sheet with one tab per
// top-level array below (sessions, tracks, roster, agendaItems, prompts,
// exercises), deploy a free Google Apps Script Web App that returns the same
// JSON shape, then set NEXT_PUBLIC_TRAINING_API to its URL. getPortalData()
// will fetch live instead of using the mock — nothing else changes.
// See data/training-portal.json `_README` for the row mapping.
// ─────────────────────────────────────────────────────────────────────────────

import mock from "@/data/training-portal.json";

export type Track = {
  id: string;
  label: string;
  audience: string;
  description: string;
};

export type Session = {
  id: string;
  code: string;
  title: string;
  date: string;
  location: string;
  durationLabel: string;
  overview: string;
};

export type RosterEntry = { name: string; trackId: string };

export type AgendaItem = {
  sessionId: string;
  trackId: string; // "all" = shown to every track
  time: string;
  title: string;
  detail: string;
};

export type Prompt = {
  trackId: string; // "all" = shown to every track
  category: string;
  title: string;
  useCase: string;
  prompt: string;
};

export type Exercise = {
  sessionId: string;
  trackId: string; // "all" = shown to every track
  title: string;
  goal: string;
  steps: string[];
};

export type PortalData = {
  company: {
    slug: string;
    name: string;
    logo: string;
    tagline: string;
    contact: string;
  };
  sessions: Session[];
  tracks: Track[];
  roster: RosterEntry[];
  agendaItems: AgendaItem[];
  prompts: Prompt[];
  exercises: Exercise[];
};

const API_URL = process.env.NEXT_PUBLIC_TRAINING_API;

/** Single source of truth for portal content. Swap point for the live Sheet. */
export async function getPortalData(): Promise<PortalData> {
  if (API_URL) {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Training API ${res.status}`);
    return (await res.json()) as PortalData;
  }
  return mock as unknown as PortalData;
}

// ── Selectors ────────────────────────────────────────────────────────────────

/** Find a session by its access code (case-insensitive, trims whitespace). */
export function findSessionByCode(data: PortalData, code: string): Session | null {
  const c = code.trim().toUpperCase();
  return data.sessions.find((s) => s.code.toUpperCase() === c) ?? null;
}

const forTrack = <T extends { trackId: string }>(items: T[], trackId: string) =>
  items.filter((i) => i.trackId === "all" || i.trackId === trackId);

export function agendaFor(data: PortalData, sessionId: string, trackId: string) {
  return forTrack(
    data.agendaItems.filter((a) => a.sessionId === sessionId),
    trackId
  ).sort((a, b) => timeToMin(a.time) - timeToMin(b.time));
}

export function promptsFor(data: PortalData, trackId: string) {
  return forTrack(data.prompts, trackId);
}

export function exercisesFor(data: PortalData, sessionId: string, trackId: string) {
  return forTrack(
    data.exercises.filter((e) => e.sessionId === sessionId),
    trackId
  );
}

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
