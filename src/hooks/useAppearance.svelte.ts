import { usePlatformSDK } from "./usePlatformSDK";
import type {
  AppearanceState,
  LocaleState,
  ThemeState,
} from "@lizuz/mini-app-types";

const DEFAULT_STATE: AppearanceState = {
  locale: {
    locale: "en-LK",
    language: "en",
    direction: "ltr",
  },
  theme: {
    preference: "system",
    mode: "light",
  },
};

export interface UseAppearanceResult {
  locale: LocaleState;
  theme: ThemeState;
}

/**
 * Must be called during component initialisation — it opens an `$effect` that
 * subscribes to the host and tears the subscription down with the component.
 */
export function useAppearance(): UseAppearanceResult {
  const platform = usePlatformSDK();

  let state = $state<AppearanceState>(DEFAULT_STATE);

  $effect(() => {
    const sdk = platform.sdk;
    if (!sdk || !platform.isReady) return;

    state = sdk.appearance.state();

    const unsubscribe = sdk.appearance.subscribe((next) => {
      state = next;
    });

    return () => unsubscribe();
  });

  // Getters, not unwrapped values: the `$state` read happens at the call site,
  // inside whatever template or effect is consuming it, so updates keep flowing.
  return {
    get locale() {
      return state.locale;
    },
    get theme() {
      return state.theme;
    },
  };
}
