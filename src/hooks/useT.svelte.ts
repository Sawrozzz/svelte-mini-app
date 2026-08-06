import { useAppearance } from "./useAppearance.svelte";
import en from "../i18n/en.json";
import si from "../i18n/si.json";
import tam from "../i18n/tam.json";

const DICTIONARIES: Record<string, Record<string, string>> = { en, si, ta: tam };

export interface UseTResult {
  language: string;
  t(key: string, params?: Record<string, string | number>): string;
}

export function useT(): UseTResult {
  const appearance = useAppearance();
  const language = () => appearance.locale.language;

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = DICTIONARIES[language()] ?? DICTIONARIES.en;
    const template = dict[key] ?? DICTIONARIES.en[key] ?? key;

    if (!params) return template;

    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
  };

  return {
    get language() {
      return language();
    },
    t,
  };
}
