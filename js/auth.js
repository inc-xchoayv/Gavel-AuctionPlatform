/* ==========================================================================
   js/auth.js — Gavel: սեսիա, էջերի պաշտպանություն (guard), navbar ըստ դերի
   Միացվում է ԲՈԼՈՐ էջերի <head>-ում՝ ԱՌԱՆՑ defer, որպեսզի guard-ը
   աշխատի էջի պարունակությունը ցույց տալուց ԱՌԱՋ։
   ========================================================================== */

const Gavel = (function () {

  // ---------- 1. Կարգավորումներ ----------
  const USERS_URL      = "data/users.json";  // «սկզբնական» օգտատերերը (read-only)
  const KEY_USERS      = "gavel_users";      // localStorage — նոր գրանցվածները
  const KEY_SESSION    = "gavel_session";    // localStorage — ով է մուտք գործած
  const KEY_FLASH      = "gavel_flash";      // sessionStorage — մեկանգամյա հաղորդագրություն

  // Ո՞ր էջին ո՞վ կարող է մտնել։  "user" = ցանկացած մուտք գործած, "admin" = միայն ադմին
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
  // Էջեր, որոնք մուտք գործածին պետք չեն (նրան ուղարկում ենք Անձնական էջ)
  const GUEST_ONLY = ["login.html", "register.html"];

  // ---------- 2. Սեսիա ----------
  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEY_SESSION)); }
    catch (e) { return null; }
  }
  function startSession(user) {
    // Գաղտնաբառը սեսիայում ՉԵՆՔ պահում
    const session = {
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, role: user.role, avatar: user.avatar || null
    };
    localStorage.setItem(KEY_SESSION, JSON.stringify(session));
    return session;
  }
  function logout() {
    localStorage.removeItem(KEY_SESSION);
    setFlash("Դուք դուրս եկաք համակարգից։");
    window.location.href = "index.html";
  }

  // ---------- 3. Օգտատերերի «բազա» ----------
  function getRegisteredUsers() {
    try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; }
    catch (e) { return []; }
  }
  // JSON ֆայլի օգտատերեր + localStorage-ի նոր գրանցվածներ = ամբողջ ցուցակը
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

  // ---------- 4. Flash հաղորդագրություն (ցույց է տրվում հաջորդ էջում) ----------
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
      setFlash("Այս էջը տեսնելու համար մուտք գործեք։");
      window.location.replace("login.html?next=" + encodeURIComponent(page));
      return;
    }
    if (need === "admin" && session.role !== "admin") {
      setFlash("Այս էջը հասանելի է միայն ադմինիստրատորին։");
      window.location.replace("index.html");
      return;
    }
    if (GUEST_ONLY.includes(page) && session) {
      window.location.replace("profile.html");
    }
  }

  // ---------- 6. NAVBAR ըստ դերի ----------
  function buildNav() {
    const session = getSession();
    const role = session ? session.role : "guest";

    // 6a. Հղումները nav-ում
    document.querySelectorAll("header nav a").forEach(function (link) {
      const need = PAGE_ACCESS[link.getAttribute("href")];
      if (need === "admin" && role !== "admin") {
        link.classList.add("is-hidden");             // Ադմին՝ ամբողջությամբ թաքցված
      } else if (need === "user" && role === "guest") {
        link.classList.add("is-locked");             // Հյուր՝ երևում է, բայց չի սեղմվում
        link.setAttribute("aria-disabled", "true");
        link.setAttribute("tabindex", "-1");
        link.title = "Մուտք գործեք՝ այս բաժինն օգտագործելու համար";
        link.addEventListener("click", function (e) { e.preventDefault(); });
      }
    });

    // 6b. Աջ կողմի կոճակները (.header-actions)։ Լեզվի ընտրիչը թողնում ենք։
    const actions = document.querySelector(".header-actions");
    if (!actions) return;
    actions.querySelectorAll(":scope > a, :scope > button").forEach(function (el) { el.remove(); });
    const lang = actions.querySelector(".lang-dropdown");

    if (!session) {
      actions.insertBefore(makeLink("login.html", "btn sm", "Մուտք"), lang);
      actions.insertBefore(makeLink("register.html", "btn sm pri", "Գրանցվել"), lang);
      return;
    }

    // Մուտք գործած՝ անուն + ավատար + Ելք
    const userBtn = makeLink("profile.html", "user-menu-btn", "");
    const avatar = document.createElement("span");
    avatar.className = "user-avatar";
    if (session.avatar) {
      const img = document.createElement("img");
      img.src = session.avatar;
      img.alt = session.firstName;
      avatar.appendChild(img);
    } else {
      avatar.textContent = session.firstName.charAt(0);   // Անվան առաջին տառը
    }
    const name = document.createElement("span");
    name.textContent = session.firstName + " " + session.lastName.charAt(0) + ".";
    userBtn.append(avatar, name);

    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className = "btn sm";
    logoutBtn.textContent = "Ելք";
    logoutBtn.addEventListener("click", logout);

    actions.insertBefore(userBtn, lang);
    actions.insertBefore(logoutBtn, lang);
  }

  function makeLink(href, className, text) {
    const a = document.createElement("a");
    a.href = href;
    a.className = className;
    a.textContent = text;
    return a;
  }

  // ---------- 7. Գործարկում ----------
  guardPage();                                  // Անմիջապես (head-ում)
  document.addEventListener("DOMContentLoaded", function () {
    buildNav();                                 // Երբ HTML-ը պատրաստ է
    showFlash();
  });

  // Այն, ինչ հասանելի է մյուս ֆայլերին (login.js, register.js)
  return { getSession, startSession, logout, loadAllUsers, saveRegisteredUser, setFlash };
})();
