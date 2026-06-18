import { useSettingsStore } from "../stores/settingsStore";
import zh, { type Translations } from "./zh";
import en from "./en";

const translations: Record<string, Translations> = { zh, en };

export function useT() {
  const locale = useSettingsStore((s) => s.locale);
  const t = translations[locale] || zh;

  function translate(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let result: unknown = t;
    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        result = key;
        break;
      }
    }
    if (typeof result === "string") {
      if (params) {
        return result.replace(/\{(\w+)\}/g, (_, p) => {
          const v = params[p];
          return v !== undefined ? String(v) : `{${p}}`;
        });
      }
      return result;
    }
    return key;
  }

  return { t: translate, locale, isZh: locale === "zh" };
}

export function getT(locale: string) {
  return (translations[locale] || zh) as Translations;
}

export type { Translations };
