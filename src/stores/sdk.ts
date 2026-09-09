import { derived, get, writable } from "svelte/store";
import { retry } from "../lib/retry.ts";

export type SdkPhase = "loading" | "ready" | "error";

export const sdkInstance = writable<MiniAppSdk | null>(null);
export const sdkUser = writable<SdkPlatformUser | null>(null);
export const sdkPhase = writable<SdkPhase>("loading");
export const sdkError = writable<Error | null>(null);

export const isSdkReady = derived(sdkPhase, ($p) => $p === "ready");

function getSDK(): MiniAppSdk {
  const instance = window.__GSA_SDK__ ?? null;
  if (!instance) throw new Error("SDK not available");
  return instance;
}

let started = false;

export async function initSdk(signal?: AbortSignal): Promise<void> {
  if (started) return;
  started = true;
  try {
    const instance = await retry(() => getSDK(), {
      maxAttempts: 30,
      delayMs: 500,
      signal,
    });
    await new Promise<void>((res) => {
      if (window.__GSA_SDK__) return res();
      window.addEventListener("__GSA_SDK_READY__", () => res(), { once: true });
    });
    const user = await instance.auth.getUser();
    if (signal?.aborted) return;
    sdkInstance.set(instance);
    sdkUser.set((user as SdkPlatformUser | undefined) ?? null);
    sdkPhase.set("ready");
  } catch (error) {
    if (signal?.aborted) return;
    sdkError.set(
      error instanceof Error ? error : new Error("SDK initialization failed"),
    );
    sdkPhase.set("error");
  }
}

export function getSdkOrThrow(): MiniAppSdk {
  const sdk = get(sdkInstance);
  if (!sdk) throw new Error("SDK not ready — use within initialized app");
  return sdk;
}
