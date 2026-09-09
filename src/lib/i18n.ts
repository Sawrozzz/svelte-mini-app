import { derived } from "svelte/store";
import en from "../i18n/en.json";
import si from "../i18n/si.json";
import ta from "../i18n/ta.json";
import { localeState } from "../stores/appearance.ts";

const DICTIONARIES: Record<string, Record<string, string>> = {
  en,
  si,
  ta,
};

function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export const language = derived(localeState, ($l) => $l.language);

export const tStore = derived(localeState, ($locale) => {
  const dict = DICTIONARIES[$locale.language] ?? DICTIONARIES.en;
  return (key: string, params?: Record<string, string | number>): string =>
    interpolate(dict[key] ?? DICTIONARIES.en[key] ?? key, params);
});
