/* ==========================================================================
   js/auth.js — Gavel: սեսիա, էջերի պաշտպանություն (guard), navbar ըստ դերի
   Միացվում է ԲՈԼՈՐ էջերի <head>-ում՝ i18n.js-ից ՀԵՏՈ:
   ========================================================================== */

const Gavel = (function () {

  // ---------- 1. Կարգավորումներ ----------
  const USERS_URL      = "data/users.json";
  const KEY_USERS      = "gavel_users";
  const KEY_SESSION    = "gavel_session";
  const KEY_FLASH      = "gavel_flash";

  // Էջերի հասանելիությունն ըստ դերերի
  const PAGE_ACCESS = {
    "my-participations.html": "user",
    "my-lots.html":           "user",
    "add-lot.html":           "user",
    "profile.html":           "user",
    "place-bid.html":         "user",
    "admin-dashboard.html":   "admin",
    "admin-users.html":       "admin",
    "admin-auctions.html":    "admin",
    "admin-reports.html":     "admin"
  };
  const GUEST_ONLY = ["login.html", "register.html"];

  // ---------- 2. Սեսիա ----------
  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEY_SESSION)); }
    catch (e) { return null; }
  }
  function startSession(user) {
    const session = {
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, role: user.role, avatar: user.avatar || null
    };
    localStorage.setItem(KEY_SESSION, JSON.stringify(session));
    return session;
  }
  function logout() {
    localStorage.removeItem(KEY_SESSION);
    const msg = (typeof I18n !== "undefined")
      ? I18n.t("toast_logout_success", "Դուք դուրս եկաք համակարգից։")
      : "Դուք դուրս եկաք համակարգից։";
    setFlash(msg);
    window.location.href = "index.html";
  }

  // ---------- 3. Օգտատերերի բազա ----------
  function getRegisteredUsers() {
    try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; }
    catch (e) { return []; }
  }
  async function loadAllUsers() {
    const response = await fetch(USERS_URL);
    if (!response.ok) throw new Error("users.json-ը չբեռնվեց");
    const seedUsers = await response.json();
    return seedUsers.concat(getRegisteredUsers());
  }
  function saveRegisteredUser(user) {
    const list = getRegisteredUsers();
    list.push(user);
    localStorage.setItem(KEY_USERS, JSON.stringify(list));
  }

  // ---------- 4. Flash հաղորդագրություն ----------
  function setFlash(text) { sessionStorage.setItem(KEY_FLASH, text); }
  function showFlash() {
    const text = sessionStorage.getItem(KEY_FLASH);
    if (!text) return;
    sessionStorage.removeItem(KEY_FLASH);
    const box = document.createElement("div");
    box.className = "flash-toast";
    box.textContent = text;
    document.body.appendChild(box);
    setTimeout(function () { box.classList.add("is-hiding"); }, 3500);
    setTimeout(function () { box.remove(); }, 4000);
  }

  // ---------- 5. GUARD — էջի պաշտպանություն ----------
  function currentPage() {
    return window.location.pathname.split("/").pop() || "index.html";
  }
  function guardPage() {
    const page = currentPage();
    const need = PAGE_ACCESS[page];
    const session = getSession();

    if (need && !session) {
      const msg = (typeof I18n !== "undefined")
        ? I18n.t("toast_guard_login", "Այս էջը տեսնելու համար մուտք գործեք։")
        : "Այս էջը տեսնելու համար մուտք գործեք։";
      setFlash(msg);
      window.location.replace("login.html?next=" + encodeURIComponent(page));
      return;
    }
    if (need === "admin" && session.role !== "admin") {
      const msg = (typeof I18n !== "undefined")
        ? I18n.t("toast_guard_admin", "Այս էջը հասանելի է միայն ադմինիստրատորին։")
        : "Այս էջը հասանելի է միայն ադմինիստրատորին։";
      setFlash(msg);
      window.location.replace("index.html");
      return;
    }
    if (GUEST_ONLY.includes(page) && session) {
      window.location.replace("profile.html");
    }
  }

  // ---------- 6. NAVBAR ըստ դերի (ԱՌԱՆՑ Ելքի կոճակի և ԱՌԱՆՑ էմոջիների) ----------
  function buildNav() {
    const session = getSession();
    const role = session ? session.role : "guest";

    const lockedTooltip = (typeof I18n !== "undefined")
      ? I18n.t("nav_locked_tooltip", "Մուտք գործեք՝ այս բաժինն օգտագործելու համար")
      : "Մուտք գործեք՝ այս բաժինն օգտագործելու համար";

    // 6a. Հղումները nav-ում
    document.querySelectorAll("header nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      const need = PAGE_ACCESS[href];

      // Մաքրում ենք նախորդ կարգավիճակները
      link.classList.remove("is-hidden", "is-locked");
      link.removeAttribute("aria-disabled");
      link.removeAttribute("tabindex");
      link.removeAttribute("title");

      if (need === "admin" && role !== "admin") {
        link.classList.add("is-hidden");             // Ոչ ադմինից լիովին թաքցված
      } else if (need === "user" && role === "guest") {
        link.classList.add("is-locked");             // Հյուրին երևում է, բայց արգելափակված (առանց էմոջիի!)
        link.setAttribute("aria-disabled", "true");
        link.setAttribute("tabindex", "-1");
        link.title = lockedTooltip;
        link.onclick = function (e) { e.preventDefault(); };
      } else {
        link.onclick = null;
      }
    });

    // 6b. Աջ կողմի կոճակները (.header-actions)
    const actions = document.querySelector(".header-actions");
    if (!actions) return;

    // Մաքրում ենք միայն նախորդ հղումները/կոճակները, լեզվի ընտրիչը թողնում ենք
    actions.querySelectorAll(":scope > a, :scope > button:not(.lang-btn)").forEach(function (el) { el.remove(); });
    const lang = actions.querySelector(".lang-dropdown");

    const loginText = (typeof I18n !== "undefined") ? I18n.t("nav_login", "Մուտք") : "Մուտք";
    const regText   = (typeof I18n !== "undefined") ? I18n.t("nav_register", "Գրանցվել") : "Գրանցվել";

    if (!session) {
      actions.insertBefore(makeLink("login.html", "btn sm", loginText, "nav_login"), lang);
      actions.insertBefore(makeLink("register.html", "btn sm pri", regText, "nav_register"), lang);
      return;
    }

    // Մուտք գործած՝ ՄԻԱՅՆ օգտատիրոջ անունը և ավատարը (Ելքի կոճակը տեղափոխվել է Անձնական էջ)
    const userBtn = makeLink("profile.html", "user-menu-btn", "");
    const avatar = document.createElement("span");
    avatar.className = "user-avatar";
    if (session.avatar) {
      const img = document.createElement("img");
      img.src = session.avatar;
      img.alt = session.firstName;
      avatar.appendChild(img);
    } else {
      avatar.textContent = session.firstName.charAt(0);
    }
    const name = document.createElement("span");
    name.textContent = session.firstName + " " + session.lastName.charAt(0) + ".";
    userBtn.append(avatar, name);

    actions.insertBefore(userBtn, lang);
  }

  function makeLink(href, className, text, i18nKey) {
    const a = document.createElement("a");
    a.href = href;
    a.className = className;
    a.textContent = text;
    if (i18nKey) a.setAttribute("data-i18n", i18nKey);
    return a;
  }

  // ---------- 7. Կապել Profile-ի Logout կոճակը (Task 5) ----------
  function bindProfileLogout() {
    const btn = document.getElementById("btn-profile-logout");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const confirmMsg = (typeof I18n !== "undefined")
        ? I18n.t("logout_confirm", "Իսկապե՞ս ցանկանում եք դուրս գալ համակարգից:")
        : "Իսկապե՞ս ցանկանում եք դուրս գալ համակարգից:";
      if (window.confirm(confirmMsg)) {
        logout();
      }
    });
  }

  // ---------- 8. Գործարկում ----------
  guardPage();
  document.addEventListener("DOMContentLoaded", function () {
    buildNav();
    bindProfileLogout();
    showFlash();
  });

  window.addEventListener("gavelLanguageChanged", function () {
    buildNav();
  });

  return { getSession, startSession, logout, loadAllUsers, saveRegisteredUser, setFlash, buildNav };
})();
