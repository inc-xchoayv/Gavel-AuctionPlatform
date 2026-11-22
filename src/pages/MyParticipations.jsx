import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/my-participations.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";

export default function MyParticipations() {
  const { t } = useI18n();
  usePageTitle("title_participations");
  const { session } = useAuth();
  const { lots } = useLots();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all"); // "all" | "lead" | "out"

  const isDemoGarik =
    String(session?.id) === "1" || session?.email === "garik@example.com";

  // Dynamically compute participations from real bids placed by the user
  const participations = useMemo(() => {
    const userIdStr = String(session?.id || "");
    const realItems = [];

    lots.forEach((lot) => {
      const history = Array.isArray(lot.bidHistory) ? lot.bidHistory : [];
      const userBids = history.filter((b) => String(b.bidderId) === userIdStr);
      if (userBids.length > 0) {
        const highestUserBid = Math.max(...userBids.map((b) => Number(b.amount) || 0));
        const currentPrice = Number(lot.currentBid) || Number(lot.startingPrice) || 0;
        const isLeading =
          String(lot.lastBidderId) === userIdStr || highestUserBid >= currentPrice;

        realItems.push({
          lot,
          userBid: highestUserBid,
          currentPrice,
          status: isLeading ? "lead" : "out",
          timeText: lot.endsIn || "—",
          isHot: Boolean(lot.isHot),
          desc: lot.description?.slice(0, 80) || lot.title,
        });
      }
    });

    if (realItems.length > 0 || !isDemoGarik) {
      return realItems;
    }

    // Seed demo participations for Garik demo account if no custom bids placed yet
    const porsche = lots.find((l) => l.id === 405) || lots[0];
    const carpet = lots.find((l) => l.id === 315) || lots[1];
    const samovar = lots.find((l) => l.id === 219) || lots[2];

    return [
      porsche && {
        lot: porsche,
        userBid: porsche.currentBid || 48500,
        currentPrice: porsche.currentBid || 48500,
        status: "lead",
        timeText: porsche.endsIn || "00:14",
        isHot: true,
        desc: porsche.specs?.engine || "3.0L Twin-Turbo (443 hp), 18,420 mi",
      },
      carpet && {
        lot: carpet,
        userBid: carpet.currentBid || 3100,
        currentPrice: carpet.currentBid || 3100,
        status: "lead",
        timeText: carpet.endsIn || "05:40:10",
        isHot: false,
        desc: carpet.description?.slice(0, 75) || "Handmade authentic carpet",
      },
      samovar && {
        lot: samovar,
        userBid: Math.max(0, (samovar.currentBid || 800) - 50),
        currentPrice: samovar.currentBid || 800,
        status: "out",
        timeText: samovar.endsIn || "1d 4h",
        isHot: false,
        desc: samovar.specs?.material || "Silver-plated brass samovar (1882)",
      },
    ].filter(Boolean);
  }, [lots, session, isDemoGarik]);

  const filteredParts = participations.filter((p) => {
    if (activeTab === "lead") return p.status === "lead";
    if (activeTab === "out") return p.status === "out";
    return true;
  });

  const wonCount = participations.filter(
    (p) => p.status === "lead" && p.lot?.status === "ended"
  ).length || (isDemoGarik ? 1 : 0);

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
            <div className="kpi-num won">{wonCount}</div>
          </div>
        </div>

        <div className="part-tabs-bar">
          <button
            type="button"
            className={`btn sm ${activeTab === "all" ? "pri" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            {t("flt_all")} ({participations.length})
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "lead" ? "pri" : ""}`}
            onClick={() => setActiveTab("lead")}
          >
            {t("mp_tab_lead")} ({participations.filter((p) => p.status === "lead").length})
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "out" ? "pri" : ""}`}
            onClick={() => setActiveTab("out")}
          >
            {t("mp_tab_outbid")} ({participations.filter((p) => p.status === "out").length})
          </button>
        </div>

        <div className="my-parts-list">
          {filteredParts.length > 0 ? (
            filteredParts.map(
              ({ lot, userBid, currentPrice, status, timeText, isHot, desc }) => {
                const targetUrl = `/auction-detail?id=${lot.id}`;
                return (
                  <div
                    key={lot.id}
                    className={`part-card clickable-lot-card ${
                      status === "lead" ? "part-lead" : "part-out"
                    }`}
                    onClick={(e) => {
                      if (!e.target.closest("a, button")) navigate(targetUrl);
                    }}
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
                            <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
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
                        <Link to={targetUrl}>{lot.title}</Link>
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
                        <span className="price-highlight">
                          ${currentPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="meta-col">
                        <small>{t("lot_time_left")}</small>
                        <span className={`tm ${isHot ? "hot" : ""}`}>{timeText}</span>
                      </div>
                    </div>

                    <div className="part-action-btns">
                      <Link to={targetUrl} className="btn sm pri">
                        {status === "lead" ? t("mp_join") : t("mp_raise_bid")}
                      </Link>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div className="card catalog-empty-box">
              <p className="catalog-empty-msg">
                Դուք դեռ չեք մասնակցել որևէ աճուրդի։ Ընտրեք լոտ և կատարեք ձեր առաջին առաջարկը։
              </p>
              <Link to="/auctions" className="btn pri sm">
                {t("mp_find_btn")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
