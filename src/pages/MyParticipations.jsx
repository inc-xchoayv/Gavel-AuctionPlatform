import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/my-participations.css";
import { useI18n } from "../i18n/I18nContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";

export default function MyParticipations() {
  const { t } = useI18n();
  usePageTitle("title_participations");
  const { lots } = useLots();

  const [activeTab, setActiveTab] = useState("all"); // "all" | "lead" | "out"

  // Dynamic lots from context
  const porsche = lots.find((l) => l.id === 405) || lots[0];
  const carpet = lots.find((l) => l.id === 315) || lots[1];
  const samovar = lots.find((l) => l.id === 219) || lots[2];

  const participations = [
    {
      lot: porsche,
      userBid: porsche?.currentBid || 48500,
      currentPrice: porsche?.currentBid || 48500,
      status: "lead", // leader
      timeText: porsche?.endsIn || "00:14",
      isHot: true,
      desc: porsche?.specs?.engine || "3.0L Twin-Turbo (443 hp), 18,420 mi",
    },
    {
      lot: carpet,
      userBid: carpet?.currentBid || 3100,
      currentPrice: carpet?.currentBid || 3100,
      status: "lead",
      timeText: carpet?.endsIn || "05:40:10",
      isHot: false,
      desc: carpet?.description?.slice(0, 75) || "Handmade authentic carpet",
    },
    {
      lot: samovar,
      userBid: Math.max(0, (samovar?.currentBid || 800) - 50),
      currentPrice: samovar?.currentBid || 800,
      status: "out", // outbid
      timeText: samovar?.endsIn || "1d 4h",
      isHot: false,
      desc: samovar?.specs?.material || "Silver-plated brass samovar (1882)",
    },
  ];

  const filteredParts = participations.filter((p) => {
    if (activeTab === "lead") return p.status === "lead";
    if (activeTab === "out") return p.status === "out";
    return true;
  });

  return (
    <main>
      <div className="w">
        <div className="breadcrumb">
          <Link to="/">{t("nav_home")}</Link>
          <span>›</span>
          <span>{t("nav_participations")}</span>
        </div>

        <div className="page-title-row">
          <div>
            <h1>{t("nav_participations")}</h1>
            <p>{t("mp_subtitle")}</p>
          </div>
          <Link to="/auctions" className="btn pri sm">
            {t("mp_find_btn")}
          </Link>
        </div>

        <div className="part-kpi-grid">
          <div className="kpi-card">
            <small className="part-lot-lbl">{t("mp_stat_total")}</small>
            <div className="kpi-num">{participations.length}</div>
          </div>
          <div className="kpi-card lead-accent">
            <small className="part-lot-lbl">{t("mp_stat_lead")}</small>
            <div className="kpi-num lead">
              {participations.filter((p) => p.status === "lead").length}
            </div>
          </div>
          <div className="kpi-card out-accent">
            <small className="part-lot-lbl">{t("mp_stat_outbid")}</small>
            <div className="kpi-num out">
              {participations.filter((p) => p.status === "out").length}
            </div>
          </div>
          <div className="kpi-card">
            <small className="part-lot-lbl">{t("mp_stat_won")}</small>
            <div className="kpi-num won">1</div>
          </div>
        </div>

        <div className="part-tabs-bar">
          <button
            type="button"
            className={`btn sm ${activeTab === "all" ? "pri" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            {t("flt_all")}
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "lead" ? "pri" : ""}`}
            onClick={() => setActiveTab("lead")}
          >
            {t("mp_tab_lead")}
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "out" ? "pri" : ""}`}
            onClick={() => setActiveTab("out")}
          >
            {t("mp_tab_outbid")}
          </button>
        </div>

        <div className="my-parts-list">
          {filteredParts.map(({ lot, userBid, currentPrice, status, timeText, isHot, desc }) => (
            <div
              key={lot.id}
              className={`part-card ${status === "lead" ? "part-lead" : "part-out"}`}
            >
              <div className="part-thumb">
                <img src={lot.image} alt={lot.title} />
              </div>
              <div className="part-info">
                <div className="part-status-badge-row">
                  {status === "lead" ? (
                    <span className="chip lead">
                      <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>{" "}
                      <span>{t("mp_badge_lead")}</span>
                    </span>
                  ) : (
                    <span className="chip out">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>{" "}
                      <span>{t("mp_badge_outbid")}</span>
                    </span>
                  )}
                  <small className="part-lot-lbl">
                    <span>{t("det_lot_word")}</span> #{lot.id} · {lot.categoryId}
                  </small>
                </div>
                <h3 className="part-card-title">
                  <Link to={`/auction-detail?id=${lot.id}`}>{lot.title}</Link>
                </h3>
                <p className="part-card-desc">{desc}</p>
              </div>

              <div className="part-meta">
                <div className="meta-col">
                  <small>{t("mp_your_bid")}</small>
                  <span>${userBid.toLocaleString()}</span>
                </div>
                <div className="meta-col">
                  <small>{t("lot_current_price")}</small>
                  <span className="price-highlight">${currentPrice.toLocaleString()}</span>
                </div>
                <div className="meta-col">
                  <small>{t("lot_time_left")}</small>
                  <span className={`tm ${isHot ? "hot" : ""}`}>{timeText}</span>
                </div>
              </div>

              <div className="part-action-btns">
                <Link to={`/place-bid?id=${lot.id}`} className="btn sm pri">
                  {status === "lead" ? t("mp_join") : t("mp_raise_bid")}
                </Link>
                <Link to={`/auction-detail?id=${lot.id}`} className="btn sm">
                  {t("btn_view")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
