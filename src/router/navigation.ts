import { pop, replace } from "svelte-spa-router";
import { currentPath, normalizePath } from "./location.ts";

/**
 * Programmatic navigation for the mini-app.
 *
 * Forward navigation uses `history.pushState` — NEVER `location.hash = ...`.
 *
 * Why: in Chrome, assigning `location.hash` fires a `popstate` event in
 * addition to `hashchange`. The host shell traps `popstate` for its
 * back-button sentinel (`useMiniAppBackButton`): the spurious pop arrives
 * while the host's `canGoBack` is still stale-false, so the shell treats the
 * click as a browser-back press, waits out a ~500ms trap-restore timeout,
 * asks the mini app to go back, and the mini app pops straight back to `/`.
 * React Router's hash history (`createHashHistory`) uses `pushState`, which
 * fires no events — that is why other frameworks are unaffected.
 *
 * `pushState` fires no events at all, so the in-app router (svelte-spa-router
 * listens to `hashchange` only) and the `currentPath` mirror are notified
 * manually — the same technique svelte-spa-router's own `replace()` uses.
 *
 * History entries carry an incrementing `idx` in state, mirroring
 * `createHashHistory`, which is what the host's sentinel logic expects.
 */
let forwardPending = 0;

/** Consumed by host-sync for each observed route change. */
export function consumeForwardFlag(): boolean {
  if (forwardPending > 0) {
    forwardPending -= 1;
    return true;
  }
  return false;
}

function readIndex(): number {
  const idx = (history.state as { idx?: unknown } | null)?.idx;
  return typeof idx === "number" ? idx : 0;
}

/** Seed `idx: 0` on the current entry, preserving URL and host state. */
function seedIndex(): void {
  const state = (history.state ?? {}) as Record<string, unknown>;
  if (typeof state.idx === "number") return;
  history.replaceState({ ...state, idx: 0 }, "");
}

/** Forward navigation (sidebar, cards, "push a route"). Notifies the host. */
export function goTo(path: string): void {
  const to = normalizePath(path);
  forwardPending += 1;
  seedIndex();
  const nextIdx = readIndex() + 1;
  history.pushState({ ...(history.state ?? {}), idx: nextIdx }, "", `#${to}`);
  // pushState fires no events: update the mirror + poke the hash router.
  currentPath.set(to);
  window.dispatchEvent(new Event("hashchange"));
}

/** Replace navigation (unknown-route redirect). Never notifies the host. */
export function replaceTo(path: string): Promise<void> {
  return replace(normalizePath(path));
}

/** Step back inside the mini-app router (host back-presses use this). */
export function stepBack(): Promise<void> {
  return pop();
}

/** Normalizes a runtime-supplied path ("camera", "/camera") to a route path. */
export function toRoutePath(path: string): string {
  return normalizePath(path);
}
