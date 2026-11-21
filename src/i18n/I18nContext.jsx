import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import hy from "../data/lang/hy.json";
import en from "../data/lang/en.json";
import ru from "../data/lang/ru.json";

// Բոլոր 3 բառարանները բեռնվում են build-ի ժամանակ (import), ուստի fetch պետք չէ
const DICTIONARIES = { hy, en, ru };
export const SUPPORTED_LANGS = ["hy", "en", "ru"];
const STORAGE_KEY = "gavel_lang";
const DEFAULT_LANG = "hy";

function readSavedLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
}

// Context = «ընդհանուր տուփ», որից ցանկացած կոմպոնենտ կարող է վերցնել լեզուն և t() ֆունկցիան
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  // useState = կոմպոնենտի «հիշողություն»: Երբ lang-ը փոխվում է, React-ը ինքն է վերանկարում էկրանը
  const [lang, setLangState] = useState(readSavedLang);

  const setLang = useCallback((next) => {
    if (!SUPPORTED_LANGS.includes(next)) return;
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }, []);

  // useEffect = «կողմնակի ազդեցություն»՝ <html lang="..."> ատրիբուտը թարմացնում ենք lang-ի հետ
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // t("key") — վերցնում է թարգմանությունը ընթացիկ լեզվով (կամ fallback, կամ բանալին)
  const t = useCallback(
    (key, fallback) => {
      const value = DICTIONARIES[lang][key];
      if (value !== undefined) return value;
      return fallback !== undefined ? fallback : key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// Custom hook՝ կոմպոնենտներում օգտագործելու համար՝ const { t, lang, setLang } = useI18n();
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n-ը պետք է օգտագործվի I18nProvider-ի ներսում");
  return ctx;
}
