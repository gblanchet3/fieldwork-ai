// ─────────────────────────────────────────────────────────────────────────────
// Training-portal data layer
//
// TODAY (mock mode): course content is imported from data/training-portal.json,
// baked into the static build. Works offline, no backend.
//
// TO GO LIVE (Google Sheet mode): store sessions / tracks / roster / modules as
// tabs and lesson content as a markdown column, deploy a free Google Apps Script
// Web App that returns this JSON shape, then set NEXT_PUBLIC_TRAINING_API to its
// URL. getPortalData() will fetch live instead of the mock — nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────

import mock from "@/data/training-portal.json";

export type Track = { id: string; label: string; audience: string };

export type Session = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  location: string;
  date: string;
};

export type RosterEntry = { name: string; trackId: string };

export type Module = { id: string; sessionId: string; title: string };

export type Block =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | {
      type: "callout";
      variant: "note" | "tip" | "warning" | "exercise";
      title?: string;
      text?: string;
      items?: string[];
    }
  | { type: "prompt"; title: string; text: string }
  | { type: "video"; url: string; label: string };

export type Lesson = {
  id: string;
  moduleId: string;
  trackId: string; // "all" = every track, else track-specific
  title: string;
  blocks: Block[];
};

export type PortalData = {
  company: { slug: string; name: string; tagline: string; contact: string };
  sessions: Session[];
  tracks: Track[];
  roster: RosterEntry[];
  modules: Module[];
  lessons: Lesson[];
};

/** A lesson flattened with its module + a stable index across the whole session. */
export type FlatLesson = Lesson & {
  moduleTitle: string;
  index: number;
};

/** A module with its track-filtered lessons, for sidebar rendering. */
export type ModuleWithLessons = { module: Module; lessons: FlatLesson[] };

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

export function findSessionByCode(data: PortalData, code: string): Session | null {
  const c = code.trim().toUpperCase();
  return data.sessions.find((s) => s.code.toUpperCase() === c) ?? null;
}

const visibleToTrack = (trackId: string) => (l: Lesson) =>
  l.trackId === "all" || l.trackId === trackId;

/**
 * Build the ordered curriculum for a session + track: modules in declaration
 * order, each holding only the lessons visible to this track, with a single
 * running index across the whole session (drives Previous/Next + progress).
 */
export function buildCurriculum(
  data: PortalData,
  sessionId: string,
  trackId: string
): { modules: ModuleWithLessons[]; lessons: FlatLesson[] } {
  const modules = data.modules.filter((m) => m.sessionId === sessionId);
  const flat: FlatLesson[] = [];
  const grouped: ModuleWithLessons[] = [];

  for (const m of modules) {
    const lessons = data.lessons
      .filter((l) => l.moduleId === m.id)
      .filter(visibleToTrack(trackId));
    const withMeta: FlatLesson[] = lessons.map((l) => ({
      ...l,
      moduleTitle: m.title,
      index: 0, // assigned below
    }));
    grouped.push({ module: m, lessons: withMeta });
    flat.push(...withMeta);
  }

  flat.forEach((l, i) => (l.index = i));
  return { modules: grouped, lessons: flat };
}
