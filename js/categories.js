/* ==========================================================================
   js/categories.js — Գլխավոր էջի կատեգորիաները data/categories.json-ից
   Catawiki ոճի քարտեր՝ յուրահատուկ գույնով և կիսաշրջանաձև նկարով
   ========================================================================== */

const LANG = "hy";   // Հետագայում՝ "en" կամ "ru", երբ ավելացնենք 3 լեզուն

async function renderCategories() {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  try {
    const response = await fetch("data/categories.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const categories = await response.json();

    grid.innerHTML = "";                       // Հեռացնում ենք «Բեռնվում է...» տեքստը
    categories.forEach(function (cat) {
      grid.appendChild(createCategoryCard(cat));
    });
  } catch (error) {
    grid.innerHTML = "";
    const msg = document.createElement("p");
    msg.className = "cat-grid-msg";
    msg.textContent = "Կատեգորիաները չբեռնվեցին։ Կայքը բացեք Live Server-ով, ոչ թե կրկնակի սեղմումով։";
    grid.appendChild(msg);
    console.error("categories.json:", error);
  }
}

// Մեկ քարտ՝ Catawiki ոճով (տեքստը ձախից, կիսաշրջան նկարը աջից)
function createCategoryCard(cat) {
  const card = document.createElement("a");
  card.className = "cat-card cat-card-catawiki cat-theme-" + cat.id;
  card.href = "auctions.html?category=" + encodeURIComponent(cat.id);

  const content = document.createElement("div");
  content.className = "cat-content";

  const title = document.createElement("div");
  title.className = "cat-title";
  title.textContent = cat.name[LANG];

  const count = document.createElement("div");
  count.className = "cat-count";
  count.textContent = cat.activeLots + " ակտիվ լոտ";

  content.append(title, count);

  const cutout = document.createElement("div");
  cutout.className = "cat-photo-cutout";

  const img = document.createElement("img");
  img.className = "cat-cutout-img";
  img.src = cat.image;
  img.alt = cat.name[LANG];
  img.loading = "lazy";

  cutout.appendChild(img);
  card.append(content, cutout);

  if (cat.isNew) {
    const badge = document.createElement("span");
    badge.className = "cat-new-badge";
    badge.textContent = "Նոր";
    card.appendChild(badge);
  }

  return card;
}

renderCategories();
