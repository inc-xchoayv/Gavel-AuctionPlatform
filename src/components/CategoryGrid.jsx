import { useState } from "react";
import { Link } from "react-router-dom";
import categories from "../data/categories.json";
import { useI18n } from "../i18n/I18nContext";

// 4x4 ցանց՝ 15 կատեգորիա + 16-րդ «Տեսնել ավելին» քարտ
const INITIAL_VISIBLE = 15;

function CategoryCard({ cat, lang, t, reveal }) {
  const name = cat.name[lang] || cat.name.hy;
  return (
    <Link
      to={`/auctions?category=${encodeURIComponent(cat.id)}`}
      className={`cat-card cat-card-catawiki cat-theme-${cat.id}${reveal ? " cat-card-reveal" : ""}`}
    >
      <div className="cat-content">
        <div className="cat-title">{name}</div>
        <div className="cat-count">{cat.activeLots} {t("cat_active_lots")}</div>
      </div>
      <div className="cat-photo-cutout">
        <img className="cat-cutout-img" src={`/${cat.image}`} alt={name} loading="lazy" />
      </div>
      {cat.isNew && <span className="cat-new-badge">{t("badge_new")}</span>}
    </Link>
  );
}

export default function CategoryGrid() {
  const { t, lang } = useI18n();
  // expanded = true → ցուցադրվում են բոլոր կատեգորիաները
  const [expanded, setExpanded] = useState(false);

  const hasExtra = categories.length > INITIAL_VISIBLE;
  const visible = hasExtra && !expanded ? categories.slice(0, INITIAL_VISIBLE) : categories;
  const hiddenCount = categories.length - INITIAL_VISIBLE;

  return (
    <div className="cat-grid" id="category-grid">
      {visible.map((cat, index) => (
        <CategoryCard key={cat.id} cat={cat} lang={lang} t={t} reveal={expanded && index >= INITIAL_VISIBLE} />
      ))}

      {hasExtra && (
        <button
          type="button"
          className="cat-card cat-card-catawiki cat-card-more"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <div className="cat-content">
            <div className="cat-title">{expanded ? t("cat_show_less") : t("cat_see_more")}</div>
            {!expanded && (
              <div className="cat-count">
                +{hiddenCount} {t("cat_more_word")}
              </div>
            )}
          </div>
          <div className="cat-photo-cutout cat-more-cutout">
            <svg className="ico cat-more-ico" viewBox="0 0 24 24" aria-hidden="true">
              {expanded ? <path d="m18 15-6-6-6 6" /> : (<><path d="M12 5v14" /><path d="M5 12h14" /></>)}
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
