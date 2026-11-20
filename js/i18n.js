/* ==========================================================================
   js/i18n.js — Բազմալեզվության (i18n) համակարգ (hy, en, ru)
   Կարդում է data/translations.json-ը, թարգմանում է data-i18n տարրերը,
   պահպանում է ընտրված լեզուն localStorage-ում և համաժամեցնում navbar-ի դրոշը:
   ========================================================================== */

const I18n = (function () {
  const STORAGE_KEY = "gavel_lang";
  const DEFAULT_LANG = "hy";
  const SUPPORTED_LANGS = ["hy", "en", "ru"];

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = DEFAULT_LANG;

  let translations = null;
  let isLoaded = false;

  // 1. Բեռնում ենք translations.json-ը
  async function init() {
    try {
      const response = await fetch("data/translations.json");
      if (!response.ok) throw new Error("HTTP " + response.status);
      translations = await response.json();
      isLoaded = true;

      // Կիրառում ենք ընտրված լեզուն
      applyLanguage(currentLang);
    } catch (error) {
      console.warn("i18n: translations.json չբեռնվեց (բացեք Live Server-ով):", error);
    }

    bindSwitcher();
  }

  // 2. Ստանալ ընթացիկ լեզուն
  function getLang() {
    return currentLang;
  }

  // 3. Թարգմանել մեկ բանալի (JS կոդի մեջ օգտագործելու համար)
  function t(key, fallback) {
    if (translations && translations[currentLang] && translations[currentLang][key]) {
      return translations[currentLang][key];
    }
    return fallback !== undefined ? fallback : key;
  }

  // 4. Փոխել լեզուն
  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Թարմացնում ենք HTML էլեմենտները
    applyLanguage(lang);

    // Համաժամեցնում ենք navbar-ի radio-ն
    const radio = document.getElementById("lang-" + lang);
    if (radio && !radio.checked) {
      radio.checked = true;
    }

    // Ուղարկում ենք իրադարձություն, որպեսզի այլ մոդուլներ (օր.՝ categories.js) իմանան
    window.dispatchEvent(new CustomEvent("gavelLanguageChanged", { detail: { lang: lang } }));
  }

  // 5. Կիրառել լեզուն բոլոր data-i18n տարրերի վրա
  function applyLanguage(lang) {
    if (!translations || !translations[lang]) return;
    const dict = translations[lang];

    // a. Տեքստային տարրեր
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // b. Placeholder-ներ (որոնման դաշտ, ինփութներ)
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // c. Title ատրիբուտներ
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-title");
      if (dict[key] !== undefined) {
        el.title = dict[key];
      }
    });

    // d. HTML tag-ի lang ատրիբուտը (SEO / Accessibility)
    document.documentElement.lang = lang;
  }

  // 6. Կապել navbar-ի radio կոճակները (🇦🇲, 🇬🇧, 🇷🇺)
  function bindSwitcher() {
    // Էջը բացելիս նշում ենք պահպանված լեզվի radio-ն
    const activeRadio = document.getElementById("lang-" + currentLang);
    if (activeRadio) activeRadio.checked = true;

    // Լսում ենք radio-ի փոփոխությունները
    document.querySelectorAll('input[name="site-lang"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (radio.checked) {
          const lang = radio.id.replace("lang-", "");
          setLanguage(lang);
        }
      });
    });
  }

  // Գործարկում, երբ DOM-ը պատրաստ է
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { init: init, getLang: getLang, setLanguage: setLanguage, t: t, applyLanguage: applyLanguage };
})();
