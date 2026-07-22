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
  | { type: "video"; url: string; label: string }
  // ── Interactive Day-1 exercise blocks (Fieldwork live app) ──────────────────
  // #3 — Context compare: run a bare prompt, then the same prompt with context.
  | {
      type: "context-compare";
      scenario: string; // the role-tailored CRE situation
      barePrompt: string; // the weak, context-free ask
      contextBlock: string; // the context to layer on
      system?: string; // optional system prompt for the live call
      closer?: string; // per-track takeaway line under the exercise
    }
  // #4a — Company context file: everyone contributes sections; captured live.
  | {
      type: "context-file";
      intro?: string;
      sections: { id: string; label: string; hint: string; placeholder?: string }[];
    }
  // #4b — Prove it: write a prompt, run it with vs. without your context.
  | {
      type: "context-file-test";
      guidance: string;
      starterPrompt?: string;
      system?: string;
      sampleContext?: string; // fallback R&N context so the contrast always lands
    }
  // #5 ⭐ — "More is More" chunked prompt-builder. The output that matters is the prompt.
  | {
      type: "prompt-builder";
      // predefined, pick one; `hints` gives per-challenge placeholder text keyed by chunk id
      challenges: { id: string; label: string; text: string; hints?: Record<string, string> }[];
      chunks: {
        id: string;
        label: string; // e.g. "Describe the end state"
        instruction: string;
        placeholder?: string;
        prefix?: string; // prepended when assembling the paragraph
        default?: string; // pre-filled value (e.g. the "interview me" move they should see)
      }[];
      interviewInstruction?: string; // auto-appended so Claude interviews the user first
      genericPrompt: string; // the weak prompt shown on the "before" side
      genericOutput: string; // fixed weak output to contrast against the live one
      system?: string;
    }
  // Iterate: run a real task, then push back once to refine it (the "best use" muscle).
  | {
      type: "iterate";
      intro?: string;
      starterTask?: string;
      system?: string;
    }
  // AI usage policy — a facilitated, document-style mad-lib (Chris drives out loud;
  // the page reads like the policy taking shape as the room fills it in).
  | {
      type: "policy-madlib";
      intro?: string; // facilitator framing, shown above the document
      docTitle: string;
      docSubtitle?: string;
      sections: (
        | {
            id: string;
            kind: "statement";
            title: string;
            lead?: string;
            fills: { id: string; before: string; after?: string; options: string[]; multi?: boolean; placeholder?: string }[];
          }
        | { id: string; kind: "checklist"; title: string; lead?: string; items: string[]; allowAdd?: boolean }
        | { id: string; kind: "fixed"; title: string; lead?: string; lines: string[] }
        | { id: string; kind: "notes"; title: string; lead?: string; placeholder?: string }
      )[];
      ratify?: string;
    }
  // Setup tour / walk-through: install checklist + tiered, self-guided missions
  // (mostly done as homework), captured to a live facilitator progress board.
  | {
      type: "setup-tour";
      intro?: string;
      steps: { id: string; label: string }[]; // install / sign-in checklist
      missions: {
        id: string;
        tier: string; // group heading (e.g. "1 · Set it up right")
        icon?: string;
        label: string; // the goal
        do?: string; // the steps
        worked?: string; // success signal ("you'll know it worked when…")
        stuck?: string; // fallback if they get stuck
        track?: "pm" | "facilities"; // shown only to that track (tracked per applicable)
        connector?: boolean; // shows an "if enabled" hint
        sample?: { href: string; label: string }; // downloadable fallback (e.g. a nameplate)
      }[];
      mobileUrl?: string; // QR target (defaults to this site's /training)
      cheatsheet?: { q: string; a: string }[];
    };

export type Lesson = {
  id: string;
  moduleId: string;
  trackId: string; // "all" = every track, else track-specific
  title: string;
  blocks: Block[];
  variantGroup?: string; // lessons sharing this are the same exercise across tracks
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

/**
 * The per-track variants of a lesson (same variantGroup), each paired with its
 * track, in track-declaration order. Empty when the lesson has no variants.
 * Powers the "peek at what other tracks are doing" toggle.
 */
export function variantSiblings(
  data: PortalData,
  lesson: Lesson
): { track: Track; lesson: Lesson }[] {
  if (!lesson.variantGroup) return [];
  const out: { track: Track; lesson: Lesson }[] = [];
  for (const track of data.tracks) {
    const l = data.lessons.find(
      (x) => x.variantGroup === lesson.variantGroup && x.trackId === track.id
    );
    if (l) out.push({ track, lesson: l });
  }
  return out;
}
