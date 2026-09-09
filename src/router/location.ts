import { writable } from "svelte/store";

/**
 * Single source of truth for the mini-app route, mirrored from
 * `window.location.hash` (the hash router owns the URL; this store is the
 * reactive view of it for the sidebar, host-sync and pages).
 *
 * Paths are normalized: always leading `/`, no trailing slash (except root).
 */
export function normalizePath(path: string): string {
  let p = path || "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

export function readHashPath(): string {
  if (typeof window === "undefined") return "/";
  const hash = window.location.hash || "#/";
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  // Drop any querystring (the router exposes it separately as querystring).
  return normalizePath((raw || "/").split("?")[0]);
}

export function isRootPath(path: string): boolean {
  return path === "/" || path === "";
}

export const currentPath = writable<string>(
  typeof window === "undefined" ? "/" : readHashPath(),
);

let listening = false;

function syncFromHash() {
  currentPath.set(readHashPath());
}

/** Start mirroring hash changes. Call once per app lifetime (see main.ts). */
export function startLocationSync(): void {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("hashchange", syncFromHash);
}

/** Stop mirroring hash changes. Call on app unmount (see main.ts). */
export function stopLocationSync(): void {
  if (!listening || typeof window === "undefined") return;
  listening = false;
  window.removeEventListener("hashchange", syncFromHash);
}

/**
 * Seed the hash from a host-provided `initialPath` using `replaceState`
 * (fires no events, so the host back-trap stays quiet). A host-set deep
 * link is left alone. The mirror is updated directly since no event fires.
 */
export function seedInitialPath(initialPath?: string): void {
  if (typeof window === "undefined" || !initialPath) return;
  const hash = window.location.hash;
  if (hash && hash !== "#" && hash.startsWith("#/")) return;
  const to = normalizePath(initialPath);
  const state = (history.state ?? {}) as Record<string, unknown>;
  history.replaceState({ ...state, idx: 0 }, "", `#${to}`);
  currentPath.set(to);
}
