/* ==========================================================================
   js/categories.js — Գլխավոր էջի կատեգորիաները data/categories.json-ից
   Catawiki ոճի քարտեր՝ յուրահատուկ գույնով, աջ կիսաշրջան նկարով
   և 3 լեզվով ավտոմատ թարգմանությամբ (I18n.getLang())
   ========================================================================== */

let cachedCategories = null;

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
    cachedCategories.forEach(function (cat) {
      grid.appendChild(createCategoryCard(cat, currentLang));
    });
  } catch (error) {
    grid.innerHTML = "";
    const msg = document.createElement("p");
    msg.className = "cat-grid-msg";
    msg.textContent = (typeof I18n !== "undefined")
      ? I18n.t("err_categories_load", "Կատեգորիաները չբեռնվեցին։ Կայքը բացեք Live Server-ով:")
      : "Կատեգորիաները չբեռնվեցին։ Կայքը բացեք Live Server-ով:";
    grid.appendChild(msg);
    console.error("categories.json:", error);
  }
}

// Մեկ քարտ՝ Catawiki ոճով
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
  const activeLotsWord = (typeof I18n !== "undefined") ? I18n.t("cat_active_lots", "ակտիվ լոտ") : "ակտիվ լոտ";
  count.textContent = cat.activeLots + " " + activeLotsWord;

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
    badge.textContent = (typeof I18n !== "undefined") ? I18n.t("badge_new", "Նոր") : "Նոր";
    card.appendChild(badge);
  }

  return card;
}

// Երբ լեզուն փոխվում է navbar-ից, վերարտադրում ենք կատեգորիաները
window.addEventListener("gavelLanguageChanged", function () {
  renderCategories();
});

renderCategories();
