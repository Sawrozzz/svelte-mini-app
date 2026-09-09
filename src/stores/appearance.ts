import type { AppearanceState } from "@lizuz/mini-app-types";
import { derived, writable } from "svelte/store";
import { sdkInstance } from "./sdk.ts";

const DEFAULT_STATE: AppearanceState = {
  locale: { locale: "en-LK", language: "en", direction: "ltr" },
  theme: { preference: "system", mode: "light" },
};

export const appearanceState = writable<AppearanceState>(DEFAULT_STATE);

sdkInstance.subscribe((sdk) => {
  if (!sdk) return;
  try {
    appearanceState.set(sdk.appearance.state());
  } catch {
    // keep defaults when host bridge is unavailable
  }
  const unsubscribe = sdk.appearance.subscribe((s: AppearanceState) =>
    appearanceState.set(s),
  );
  void unsubscribe;
});

export const localeState = derived(appearanceState, ($s) => $s.locale);
export const themeState = derived(appearanceState, ($s) => $s.theme);
