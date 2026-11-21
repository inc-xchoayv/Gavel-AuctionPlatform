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

  // Բեյջի տեսակը
  let badgeEl = null;
  if (lot.badge === "copart-live") {
    badgeEl = (
      <span className="chip copart-live">
        <span className="copart-dot"></span> Live
      </span>
    );
  } else if (lot.status === "upcoming" || lot.badge === "upcoming") {
    badgeEl = <span className="chip upcoming">{t("rec_badge_antique") || "Upcoming"}</span>;
  } else if (lot.status === "ended" || lot.badge === "ended") {
    badgeEl = <span className="chip ended">{t("hist_ended") || "Ended"}</span>;
  } else if (lot.badge === "rare") {
    badgeEl = <span className="chip rare">{t("rec_badge_rare") || "Rare"}</span>;
  } else {
    badgeEl = <span className="chip live">{t("chip_live") || "Live"}</span>;
  }

  return (
    <article className={`card lot ${viewMode === "list" ? "lot-card-list" : ""}`}>
      <div className="im card-img-wrap">
        <img src={lot.image} alt={lot.title} loading="lazy" />
        {badgeEl}
        <button
          type="button"
          className="remind-btn"
          aria-label={reminded ? "Remove reminder" : "Set reminder"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleRemind(lot.id);
          }}
        >
          <input
            type="checkbox"
            className="remind-cb"
            checked={reminded}
            readOnly
          />
          <span className="remind-icon">
            <svg className="remind-off" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9"></circle>
              <polyline points="12 7 12 12 15 15"></polyline>
            </svg>
            <svg className="remind-on" viewBox="0 0 24 24">
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
