/* ==========================================================================
   js/i18n.js — Ամբողջական բազմալեզվության (i18n) համակարգ (hy, en, ru)
   Բեռնում է data/lang/hy.json, en.json, ru.json ֆայլերը, թարգմանում է
   data-i18n / placeholder / title / aria-label / <title> տարրերը,
   պահպանում է ընտրությունը localStorage-ում և չի դիպչում օգտատերերի (UGC) տեքստերին:
   ========================================================================== */

const I18n = (function () {
  const STORAGE_KEY = "gavel_lang";
  const DEFAULT_LANG = "hy";
  const SUPPORTED_LANGS = ["hy", "en", "ru"];

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = DEFAULT_LANG;

  const cache = {}; // { hy: {...}, en: {...}, ru: {...} }

  async function loadDict(lang) {
    if (cache[lang]) return cache[lang];
    const response = await fetch("data/lang/" + lang + ".json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    cache[lang] = await response.json();
    return cache[lang];
  }

  async function init() {
    bindSwitcher();
    try {
      await loadDict(currentLang);
      applyLanguage(currentLang);
      window.dispatchEvent(new CustomEvent("gavelLanguageChanged", { detail: { lang: currentLang } }));
    } catch (error) {
      console.warn("i18n: չհաջողվեց բեռնել data/lang/" + currentLang + ".json (բացեք Live Server-ով):", error);
    }
  }

  function getLang() {
    return currentLang;
  }

  function t(key, fallback) {
    const dict = cache[currentLang];
    if (dict && dict[key] !== undefined) return dict[key];
    return fallback !== undefined ? fallback : key;
  }

  async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const radio = document.getElementById("lang-" + lang);
    if (radio && !radio.checked) radio.checked = true;

    try {
      await loadDict(lang);
      applyLanguage(lang);
    } catch (error) {
      console.warn("i18n: չհաջողվեց բեռնել data/lang/" + lang + ".json:", error);
    }

    window.dispatchEvent(new CustomEvent("gavelLanguageChanged", { detail: { lang: lang } }));
  }

  function applyLanguage(lang) {
    const dict = cache[lang];
    if (!dict) return;

    // 1. Տեքստային տարրեր (ներառյալ <title data-i18n="...">)
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 2. Placeholder-ներ (որոնման դաշտ, ֆորմաներ, չաթ)
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // 3. Title հուշումներ (tooltip)
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-title");
      if (dict[key] !== undefined) {
        el.title = dict[key];
      }
    });

    // 4. Aria-label (հասանելիություն / screen readers)
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined) {
        el.setAttribute("aria-label", dict[key]);
      }
    });

    // 5. <html lang="...">
    document.documentElement.lang = lang;
  }

  function bindSwitcher() {
    const activeRadio = document.getElementById("lang-" + currentLang);
    if (activeRadio) activeRadio.checked = true;

    document.querySelectorAll('input[name="site-lang"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (radio.checked) {
          const lang = radio.id.replace("lang-", "");
          setLanguage(lang);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { init: init, getLang: getLang, setLanguage: setLanguage, t: t, applyLanguage: applyLanguage };
})();
