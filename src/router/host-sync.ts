import { get, writable } from "svelte/store";
import { getSdkOrThrow, sdkInstance } from "../stores/sdk.ts";
import { currentPath, isRootPath } from "./location.ts";
import { consumeForwardFlag, stepBack } from "./navigation.ts";

export const NAVIGATION_EVENTS = {
  BACK_REQUESTED: "navigation.back.requested",
  ROUTE_CHANGED: "navigation.route.changed",
} as const;

/** Visible in the Router tab ("Bridge activity"). Newest first, max 50. */
export const routerLog = writable<string[]>([]);

function pushLog(line: string) {
  routerLog.update((lines) => [line, ...lines].slice(0, 50));
}

let wired = false;

/**
 * Keeps the host's back-button policy in sync with this app's history.
 *
 * Exact port of test-mini-app's `useHostRouter` semantics:
 * - emit ROUTE_CHANGED { previous, current, canGoBack } on every change;
 * - call the optional `navigation.router.push` bridge ONLY on forward (PUSH)
 *   navigations — never on POP, so the host stack can't desync;
 * - re-sync when the SDK becomes ready (pushes before the bridge existed);
 * - answer BACK_REQUESTED by popping exactly one in-app route.
 */
export function startHostSync(): () => void {
  if (wired || typeof window === "undefined") return () => {};
  wired = true;

  let previous = "";
  let first = true;
  let sdkReady = false;

  const emitRoute = (current: string, forward: boolean) => {
    let sdk: MiniAppSdk | null = null;
    try {
      sdk = getSdkOrThrow();
    } catch {
      previous = current;
      return;
    }
    const canGoBack = !isRootPath(current);
    try {
      sdk.emit(NAVIGATION_EVENTS.ROUTE_CHANGED, {
        previous,
        current,
        canGoBack,
      });
      if (forward && !isRootPath(current)) {
        void sdk.navigation.router?.push?.(true);
      }
      pushLog(`route.changed ${previous || "/"} -> ${current}`);
    } catch {
      // Mobile hosts may not implement the router bridge — never crash.
    }
    previous = current;
  };

  const unsubPath = currentPath.subscribe((current) => {
    if (first) {
      first = false;
      previous = current;
      // Deep link at mount: inform the host immediately (React parity).
      if (!isRootPath(current)) emitRoute(current, true);
      return;
    }
    emitRoute(current, consumeForwardFlag());
  });

  const unsubSdk = sdkInstance.subscribe((sdk) => {
    if (!sdk || sdkReady) return;
    sdkReady = true;
    // Pushes that happened before the bridge was ready never informed it.
    const current = get(currentPath);
    if (!isRootPath(current)) {
      try {
        sdk.emit(NAVIGATION_EVENTS.ROUTE_CHANGED, {
          previous,
          current,
          canGoBack: true,
        });
        void sdk.navigation.router?.push?.(true);
      } catch {
        // optional bridge — ignore
      }
      previous = current;
    }
    try {
      return sdk.on(NAVIGATION_EVENTS.BACK_REQUESTED, () => {
        void handleBackPress();
      });
    } catch {
      return;
    }
  });

  return () => {
    unsubPath();
    unsubSdk();
    wired = false;
  };
}

/**
 * Shared back path for host back-requests AND the in-app Back button:
 * answer the bridge, then pop exactly one route when one exists.
 */
export async function handleBackPress(): Promise<void> {
  const current = get(currentPath);
  const consumed = !isRootPath(current);
  let sdk: MiniAppSdk | null = null;
  try {
    sdk = getSdkOrThrow();
  } catch {
    sdk = null;
  }
  try {
    await sdk?.navigation.router?.back?.(consumed);
  } catch {
    // optional bridge — ignore
  }
  if (consumed) await stepBack();
}
