"use client";

import { useEffect, useState, useCallback } from "react";
import { CONFIG } from "@/lib/config";
import { Business } from "@/lib/types";

// ─── GitHub API helpers ────────────────────────────────────────────────────────

const GH_API = "https://api.github.com";
const REPO = CONFIG.githubRepo;
const BRANCH = CONFIG.githubBranch;

async function ghGet(path: string, pat: string) {
  const res = await fetch(`${GH_API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${pat}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function ghPut(path: string, pat: string, content: string, sha: string, message: string) {
  const res = await fetch(`${GH_API}/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${pat}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content: btoa(unescape(encodeURIComponent(content))), sha, branch: BRANCH }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub PUT failed: ${res.status}`);
  }
  return res.json();
}

async function ghDelete(path: string, pat: string, sha: string, message: string) {
  const res = await fetch(`${GH_API}/repos/${REPO}/contents/${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `token ${pat}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub DELETE failed: ${res.status}`);
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PendingFile {
  name: string;
  path: string;
  sha: string;
  business: Business;
  rawContent: string;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SetupScreen({ onSave }: { onSave: (pat: string) => void }) {
  const [pat, setPat] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pat.trim()) return;
    try {
      const res = await fetch(`${GH_API}/repos/${REPO}`, {
        headers: { Authorization: `token ${pat.trim()}` },
      });
      if (!res.ok) { setError("Invalid token or repo not accessible."); return; }
      localStorage.setItem("fw_pat", pat.trim());
      onSave(pat.trim());
    } catch {
      setError("Could not connect. Check the token and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <p className="section-label text-amber mb-3">Fieldwork AI</p>
        <h1 className="font-syne font-semibold text-2xl text-white mb-2 tracking-tight">Review queue setup</h1>
        <p className="font-inter text-sm text-bone/50 leading-body mb-8">
          Enter a GitHub Personal Access Token with <code className="text-bone/70">contents: write</code> access to{" "}
          <code className="text-bone/70">{REPO}</code>. Stored locally, never sent anywhere else.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pat}
            onChange={(e) => { setPat(e.target.value); setError(""); }}
            placeholder="github_pat_..."
            className="w-full bg-white/5 border border-white/15 text-bone font-inter text-sm px-4 py-3 placeholder:text-bone/25 focus:outline-none focus:border-amber"
            autoFocus
          />
          {error && <p className="font-inter text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full bg-amber text-white font-inter text-sm font-medium py-3 hover:bg-[#C06A1F] transition-colors"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
}

function ApprovalCard({
  file,
  onApprove,
  onSkip,
  isLoading,
}: {
  file: PendingFile;
  onApprove: (file: PendingFile, edited?: string) => void;
  onSkip: (file: PendingFile) => void;
  isLoading: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(file.rawContent);
  const [copied, setCopied] = useState(false);
  const b = file.business;
  const accent = b.brandColor || "#D97B2A";

  const emailText = `Subject: Took a look at ${b.name}

Hi${b.opportunities[0] ? "" : ""},

Spent 20 minutes looking at ${b.name} before reaching out. Found a few specific places where AI could make a difference — put it on one page:

getfieldworkai.com/for/${b.slug}

${b.opportunities[0] ? b.opportunities[0].signal : ""}

Happy to talk through it in 30 minutes — free, no pitch.

— Gabe`;

  const copyEmail = async () => {
    await navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/10 bg-white/[0.02]" style={{ borderTopColor: accent, borderTopWidth: "3px" }}>
      {/* Header */}
      <div className="p-5 border-b border-white/8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {b.logoUrl ? (
            <img src={b.logoUrl} alt="" className="w-9 h-9 rounded object-contain bg-white/10 p-0.5 shrink-0" />
          ) : (
            <div
              className="w-9 h-9 rounded flex items-center justify-center text-white font-syne font-semibold text-sm shrink-0"
              style={{ backgroundColor: accent }}
            >
              {b.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-syne font-semibold text-white text-base leading-tight truncate">{b.name}</p>
            <p className="font-inter text-xs text-bone/40 mt-0.5">
              {b.city} · {b.vertical} · ★ {b.googleRating} ({b.reviewCount} reviews)
            </p>
          </div>
        </div>
        <a
          href={`/for/${b.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter text-xs text-bone/40 hover:text-bone/70 transition-colors shrink-0 underline"
        >
          Preview ↗
        </a>
      </div>

      {/* Opportunities preview */}
      <div className="p-5 space-y-3">
        {b.opportunities.map((opp) => (
          <div key={opp.type} className="text-sm">
            <p className="font-inter font-medium text-bone/70 mb-0.5" style={{ color: accent }}>
              {opp.label}
            </p>
            <p className="font-inter text-xs text-bone/50 leading-relaxed">{opp.signal}</p>
          </div>
        ))}
      </div>

      {/* Edit area */}
      {editing && (
        <div className="px-5 pb-5">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-64 bg-black/30 border border-white/10 text-bone/70 font-mono text-xs p-3 resize-none focus:outline-none focus:border-amber"
            spellCheck={false}
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-5 pb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => onApprove(file, editing ? editContent : undefined)}
          disabled={isLoading}
          className="font-inter text-sm font-medium bg-amber text-white px-4 py-2 hover:bg-[#C06A1F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Approving…" : "Approve"}
        </button>
        <button
          onClick={() => setEditing(!editing)}
          className="font-inter text-sm px-4 py-2 border border-white/15 text-bone/60 hover:border-white/30 hover:text-bone transition-colors"
        >
          {editing ? "Hide editor" : "Edit"}
        </button>
        <button
          onClick={() => onSkip(file)}
          disabled={isLoading}
          className="font-inter text-sm px-4 py-2 text-bone/35 hover:text-bone/60 transition-colors disabled:opacity-50"
        >
          Skip
        </button>
        <button
          onClick={copyEmail}
          className="ml-auto font-inter text-xs px-3 py-2 border border-white/10 text-bone/35 hover:text-bone/60 hover:border-white/20 transition-colors"
        >
          {copied ? "Copied ✓" : "Copy email"}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const [pat, setPat] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [approved, setApproved] = useState<Business[]>([]);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [loadingPending, setLoadingPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("fw_pat");
    if (stored) setPat(stored);
  }, []);

  const loadPending = useCallback(async (token: string) => {
    setLoadingPending(true);
    setError(null);
    try {
      const files: Array<{ name: string; path: string; sha: string }> = await ghGet("data/pending", token);
      const jsonFiles = files.filter((f) => f.name.endsWith(".json") && f.name !== ".gitkeep");
      const results = await Promise.all(
        jsonFiles.map(async (f) => {
          const detail = await ghGet(f.path, token);
          const decoded = decodeURIComponent(escape(atob(detail.content.replace(/\s/g, ""))));
          const business: Business = JSON.parse(decoded);
          return { name: f.name, path: f.path, sha: detail.sha, business, rawContent: decoded } as PendingFile;
        })
      );
      setPending(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pending queue.");
    } finally {
      setLoadingPending(false);
    }
  }, []);

  useEffect(() => {
    if (pat) loadPending(pat);
  }, [pat, loadPending]);

  const handleApprove = async (file: PendingFile, editedContent?: string) => {
    if (!pat) return;
    setLoadingSlug(file.business.slug);
    setError(null);
    try {
      const businessToAdd: Business = editedContent ? JSON.parse(editedContent) : file.business;

      // 1. Read current businesses.json
      const currentFile = await ghGet("data/businesses.json", pat);
      const currentContent = decodeURIComponent(escape(atob(currentFile.content.replace(/\s/g, ""))));
      const currentList: Business[] = JSON.parse(currentContent);

      // Skip if already exists
      if (!currentList.find((b) => b.slug === businessToAdd.slug)) {
        const newList = [...currentList, businessToAdd];
        await ghPut(
          "data/businesses.json",
          pat,
          JSON.stringify(newList, null, 2),
          currentFile.sha,
          `Add ${businessToAdd.name} analysis page`
        );
      }

      // 2. Delete the pending file
      await ghDelete(file.path, pat, file.sha, `Remove pending draft for ${file.business.slug}`);

      // Update UI
      setApproved((prev) => [...prev, businessToAdd]);
      setPending((prev) => prev.filter((f) => f.name !== file.name));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval failed.");
    } finally {
      setLoadingSlug(null);
    }
  };

  const handleSkip = async (file: PendingFile) => {
    if (!pat) return;
    setLoadingSlug(file.business.slug);
    try {
      await ghDelete(file.path, pat, file.sha, `Skip ${file.business.slug}`);
      setPending((prev) => prev.filter((f) => f.name !== file.name));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Skip failed.");
    } finally {
      setLoadingSlug(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("fw_pat");
    setPat(null);
    setPending([]);
    setApproved([]);
  };

  if (!pat) return <SetupScreen onSave={setPat} />;

  return (
    <div className="min-h-screen bg-slate">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="section-label text-amber">Fieldwork AI</p>
          <h1 className="font-syne font-semibold text-white text-lg tracking-tight mt-0.5">
            Review queue
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => pat && loadPending(pat)}
            disabled={loadingPending}
            className="font-inter text-xs text-bone/40 hover:text-bone/70 transition-colors disabled:opacity-50"
          >
            {loadingPending ? "Loading…" : "↺ Refresh"}
          </button>
          <button onClick={logout} className="font-inter text-xs text-bone/30 hover:text-bone/60 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="font-inter text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Pending */}
        <div>
          <p className="section-label text-bone/40 mb-4">
            Pending — {pending.length} to review
          </p>
          {loadingPending ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="font-inter text-sm text-bone/30">Loading queue…</p>
            </div>
          ) : pending.length === 0 ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="font-inter text-sm text-bone/30">Queue is empty. Check back after the 4pm research run.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((file) => (
                <ApprovalCard
                  key={file.name}
                  file={file}
                  onApprove={handleApprove}
                  onSkip={handleSkip}
                  isLoading={loadingSlug === file.business.slug}
                />
              ))}
            </div>
          )}
        </div>

        {/* Approved this session */}
        {approved.length > 0 && (
          <div>
            <p className="section-label text-bone/40 mb-4">Approved this session — {approved.length}</p>
            <div className="space-y-2">
              {approved.map((b) => (
                <div key={b.slug} className="flex items-center justify-between border border-white/8 px-4 py-3">
                  <div>
                    <p className="font-inter text-sm text-white">{b.name}</p>
                    <p className="font-inter text-xs text-bone/40 mt-0.5">
                      <a
                        href={`/for/${b.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-bone/60"
                      >
                        getfieldworkai.com/for/{b.slug} ↗
                      </a>
                    </p>
                  </div>
                  <span className="font-inter text-xs text-bone/30 border border-white/10 px-2 py-1">
                    deploying…
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
