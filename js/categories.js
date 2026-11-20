/* ==========================================================================
   js/categories.js — Գլխավոր էջի կատեգորիաները data/categories.json-ից
   4x4 ցանց՝ 15 կատեգորիա + 16-րդ «Տեսնել ավելին» քարտ, որը սեղմելիս
   բացում է մնացած կատեգորիաները և ավտոմատ թարգմանվում է 3 լեզվով (hy/en/ru):
   ========================================================================== */

const INITIAL_VISIBLE = 15; // 15 cards + 1 "See more" card = exact 4x4 grid (16 slots)
let cachedCategories = null;
let isExpanded = false;

function tr(key, fallback) {
  return (typeof I18n !== "undefined") ? I18n.t(key, fallback) : fallback;
}

async function renderCategories() {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  const currentLang = (typeof I18n !== "undefined") ? I18n.getLang() : "hy";

  try {
    if (!cachedCategories) {
      const response = await fetch("data/categories.json");
      if (!response.ok) throw new Error("HTTP " + response.status);
      cachedCategories = await response.json();
    }

    grid.innerHTML = "";
    const hasExtra = cachedCategories.length > INITIAL_VISIBLE;
    const listToShow = (hasExtra && !isExpanded)
      ? cachedCategories.slice(0, INITIAL_VISIBLE)
      : cachedCategories;

    listToShow.forEach(function (cat, idx) {
      const card = createCategoryCard(cat, currentLang);
      if (isExpanded && idx >= INITIAL_VISIBLE) {
        card.classList.add("cat-card-reveal");
      }
      grid.appendChild(card);
    });

    if (hasExtra) {
      const hiddenCount = cachedCategories.length - INITIAL_VISIBLE;
      grid.appendChild(createToggleCard(isExpanded, hiddenCount));
    }
  } catch (error) {
    grid.innerHTML = "";
    const msg = document.createElement("p");
    msg.className = "cat-grid-msg";
    msg.textContent = tr("err_categories_load", "Կատեգորիաները չբեռնվեցին։ Կայքը բացեք Live Server-ով:");
    grid.appendChild(msg);
    console.error("categories.json:", error);
  }
}

// Մեկ կատեգորիայի քարտ՝ Gavel Heritage պալիտրայով և աջ կիսաշրջան նկարով
function createCategoryCard(cat, lang) {
  const card = document.createElement("a");
  card.className = "cat-card cat-card-catawiki cat-theme-" + cat.id;
  card.href = "auctions.html?category=" + encodeURIComponent(cat.id);

  const content = document.createElement("div");
  content.className = "cat-content";

  const title = document.createElement("div");
  title.className = "cat-title";
  title.textContent = (cat.name && cat.name[lang]) ? cat.name[lang] : (cat.name ? cat.name.hy : cat.id);

  const count = document.createElement("div");
  count.className = "cat-count";
  count.textContent = cat.activeLots + " " + tr("cat_active_lots", "ակտիվ լոտ");

  content.append(title, count);

  const cutout = document.createElement("div");
  cutout.className = "cat-photo-cutout";

  const img = document.createElement("img");
  img.className = "cat-cutout-img";
  img.src = cat.image;
  img.alt = title.textContent;
  img.loading = "lazy";

  cutout.appendChild(img);
  card.append(content, cutout);

  if (cat.isNew) {
    const badge = document.createElement("span");
    badge.className = "cat-new-badge";
    badge.textContent = tr("badge_new", "Նոր");
    card.appendChild(badge);
  }

  return card;
}

// 16-րդ «Տեսնել ավելին» / «Թաքցնել» կոճակ-քարտը (առանց inline style-ի)
function createToggleCard(expanded, hiddenCount) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cat-card cat-card-catawiki cat-card-more" + (expanded ? " is-collapse" : "");
  btn.setAttribute("aria-expanded", expanded ? "true" : "false");

  const content = document.createElement("div");
  content.className = "cat-content";

  const title = document.createElement("div");
  title.className = "cat-title";
  title.textContent = expanded
    ? tr("cat_show_less", "Թաքցնել")
    : tr("cat_see_more", "Տեսնել ավելին");

  const count = document.createElement("div");
  count.className = "cat-count";
  count.textContent = expanded
    ? tr("cat_show_less_sub", "Վերադառնալ 4×4 տեսքին")
    : "+" + hiddenCount + " " + tr("cat_more_word", "կատեգորիա");

  content.append(title, count);

  const cutout = document.createElement("div");
  cutout.className = "cat-photo-cutout cat-more-cutout";
  cutout.innerHTML = expanded
    ? '<svg class="ico cat-more-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>'
    : '<svg class="ico cat-more-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';

  btn.append(content, cutout);

  btn.addEventListener("click", function () {
    isExpanded = !isExpanded;
    renderCategories();
  });

  return btn;
}

// Լեզուն փոխելիս թարմացնում ենք կատեգորիաները և «Տեսնել ավելին» քարտը
window.addEventListener("gavelLanguageChanged", function () {
  renderCategories();
});

renderCategories();
