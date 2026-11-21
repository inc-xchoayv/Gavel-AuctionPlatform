import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { useLots } from "../context/LotContext";
import categoriesData from "../data/categories.json";

export default function LotCard({ lot, viewMode = "grid" }) {
  const { t, lang } = useI18n();
  const { isReminded, toggleRemind } = useLots();

  const reminded = isReminded(lot.id);

  // Կատեգորիայի անվանումը ընթացիկ լեզվով
  const catObj = categoriesData.find((c) => c.id === lot.categoryId);
  const categoryLabel = catObj?.name?.[lang] || catObj?.name?.en || lot.categoryId;

  // 4 Action Modes:
  // 1. Live (Ուղիղ) -> lot.status === "active" && !isEndingSoon
  // 2. Ending soon / < 15m (Մնաց XX:XX) -> lot.status === "active" && isEndingSoon (pulsing red)
  // 3. Upcoming (Շուտով) -> lot.status === "upcoming"
  // 4. Ended (Ավարտված / Վաճառված) -> lot.status === "ended"
  const isEndingSoon = (() => {
    if (lot.status !== "active") return false;
    if (lot.isEndingSoon) return true;
    if (!lot.endsIn) return false;
    const raw = String(lot.endsIn).trim();
    const parts = raw.split(":").map((p) => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0])) {
      return parts[0] < 15;
    }
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] === 0 && parts[1] < 15;
    }
    return false;
  })();

  let badgeEl = null;
  if (lot.status === "ended" || lot.badge === "ended") {
    badgeEl = (
      <span className="chip chip-ended">
        <span className="chip-dot"></span>
        {t("mode_ended") || "Ավարտված / Վաճառված"}
      </span>
    );
  } else if (lot.status === "upcoming" || lot.badge === "upcoming") {
    badgeEl = (
      <span className="chip chip-upcoming">
        <span className="chip-dot"></span>
        {t("mode_upcoming") || "Շուտով"}
      </span>
    );
  } else if (isEndingSoon) {
    badgeEl = (
      <span className="chip chip-ending">
        <span className="chip-dot"></span>
        {t("mode_ending_prefix") || "Մնաց"} {lot.endsIn || "00:14"}
      </span>
    );
  } else {
    badgeEl = (
      <span className="chip chip-live">
        <span className="chip-dot"></span>
        {t("mode_live") || "Ուղիղ"}
      </span>
    );
  }

  return (
    <article className={`card lot ${viewMode === "list" ? "lot-card-list" : ""}`}>
      <div className="im card-img-wrap">
        <img src={lot.image} alt={lot.title} loading="lazy" />
        {badgeEl}
        <button
          type="button"
          className={`remind-btn ${reminded ? "is-reminded" : ""}`}
          aria-label={reminded ? "Remove reminder" : "Set reminder"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleRemind(lot.id);
          }}
        >
          <span className="remind-icon">
            <svg className="remind-off" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle>
              <polyline points="12 7 12 12 15 15"></polyline>
            </svg>
            <svg className="remind-on" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </button>
      </div>

      <div className="card-body">
        <small className="lot-card-cat">
          <span>{t("det_lot_word")}</span> #{lot.id} · <span>{categoryLabel}</span>
          {lot.specs?.condition ? ` · ${lot.specs.condition}` : ""}
        </small>

        <h3 className="lot-card-title">
          <Link to={`/auction-detail?id=${lot.id}`}>{lot.title}</Link>
        </h3>

        <div className="lot-card-info-row">
          <div>
            <small className="lot-card-lbl">
              {lot.status === "active" ? t("lot_current_price") : t("lot_starting_price") || t("lot_current_price")}
            </small>
            <span className="price">
              ${(lot.currentBid || lot.startingPrice || 0).toLocaleString()}
            </span>
          </div>
          <div className="lot-card-timing">
            <small className="lot-card-lbl">
              {lot.status === "upcoming" ? t("rec_starts_in") : t("lot_time_left")}
            </small>
            <span className={`tm ${lot.isHot ? "hot" : ""}`}>
              {lot.endsIn || "—"}
            </span>
          </div>
        </div>

        <div className="lot-card-action-btns">
          <Link to={`/auction-detail?id=${lot.id}`} className="btn sm">
            {t("lot_details_btn")}
          </Link>
          <Link to={`/place-bid?id=${lot.id}`} className="btn pri sm">
            {t("lot_join_btn")}
          </Link>
        </div>
      </div>
    </article>
  );
}
