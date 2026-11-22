import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/my-lots.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";

export default function MyLots() {
  const { t } = useI18n();
  usePageTitle("title_my_lots");
  const { session, user } = useAuth();
  const { lots, remindedLots, toggleRemind } = useLots();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all"); // "all" | "live" | "review" | "ended" | "remind"

  const isDemoGarik =
    String(session?.id) === "1" || session?.email === "garik@example.com";
  const fullName = `${session?.firstName || ""} ${session?.lastName || ""}`
    .trim()
    .toLowerCase();

  // Lots created by the currently authenticated user
  const sellerLots = useMemo(() => {
    return lots.filter((l) => {
      if (session?.id && String(l.seller?.id) === String(session.id)) return true;
      if (user?.id && String(l.seller?.id) === String(user.id)) return true;
      if (fullName && l.seller?.name?.trim().toLowerCase() === fullName) return true;
      if (isDemoGarik && (l.seller?.id === "me" || [405, 128, 219].includes(Number(l.id)))) {
        return true;
      }
      return false;
    });
  }, [lots, session, user, fullName, isDemoGarik]);

  const liveLots = sellerLots.filter((l) => l.status === "active");
  const reviewLots = sellerLots.filter((l) => l.status === "upcoming");
  const endedLots = sellerLots.filter((l) => l.status === "ended");
  const bookmarkedLots = lots.filter((l) => remindedLots.includes(Number(l.id)));

  // Dynamic KPIs
  const totalLotsCount = sellerLots.length;
  const liveCount = liveLots.length;
  const reviewCount = reviewLots.length;
  const totalSales = endedLots.reduce(
    (sum, l) => sum + (Number(l.currentBid) || 0),
    isDemoGarik ? 18450 : 0
  );
  const remindersCount = bookmarkedLots.length;

  let displayList = sellerLots;
  if (activeTab === "live") displayList = liveLots;
  else if (activeTab === "review") displayList = reviewLots;
  else if (activeTab === "ended") displayList = endedLots;
  else if (activeTab === "remind") displayList = bookmarkedLots;

  return (
    <main>
      <div className="w">
        <div className="breadcrumb">
          <Link to="/">{t("nav_home")}</Link>
          <span>›</span>
          <span>{t("nav_my_lots")}</span>
        </div>

        <div className="page-title-row">
          <div>
            <h1>{t("nav_my_lots")}</h1>
            <p>{t("ml_subtitle")}</p>
          </div>
          <Link to="/add-lot" className="btn pri">
            {t("ml_add_btn")}
          </Link>
        </div>

        {/* Dynamic KPI row */}
        <div className="seller-kpi-grid">
          <div className="card kpi-card-content">
            <small className="seller-stat-lbl">{t("ml_stat_total")}</small>
            <div className="seller-stat-num">{totalLotsCount}</div>
          </div>
          <div className="card kpi-card-content live-border">
            <small className="seller-stat-lbl">{t("chip_live_air")}</small>
            <div className="seller-stat-num live">{liveCount}</div>
          </div>
          <div className="card kpi-card-content rv-border">
            <small className="seller-stat-lbl">{t("chip_review")}</small>
            <div className="seller-stat-num rv">{reviewCount}</div>
          </div>
          <div className="card kpi-card-content sales-border">
            <small className="seller-stat-lbl">{t("ml_stat_sales")}</small>
            <div className="seller-stat-num sales">${totalSales.toLocaleString()}</div>
          </div>
          <div className="card kpi-card-content remind-border">
            <small className="seller-stat-lbl">{t("ml_stat_reminders")}</small>
            <div className="seller-stat-num remind">{remindersCount}</div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="seller-tabs-bar">
          <button
            type="button"
            className={`btn sm ${activeTab === "all" ? "pri" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            {t("flt_all")} ({sellerLots.length})
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "live" ? "pri" : ""}`}
            onClick={() => setActiveTab("live")}
          >
            {t("chip_live")} ({liveCount})
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "review" ? "pri" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            {t("chip_review")} ({reviewCount})
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "ended" ? "pri" : ""}`}
            onClick={() => setActiveTab("ended")}
          >
            {t("ml_tab_sold")} ({endedLots.length})
          </button>
          <button
            type="button"
            className={`btn sm ${activeTab === "remind" ? "pri" : ""}`}
            onClick={() => setActiveTab("remind")}
          >
            {t("ml_tab_reminders")} ({remindersCount})
          </button>
        </div>

        <div className="my-lots-list">
          {displayList.length > 0 ? (
            displayList.map((lot) => {
              const isRem = remindedLots.includes(Number(lot.id));
              const targetUrl = `/auction-detail?id=${lot.id}`;
              return (
                <div
                  key={lot.id}
                  className="lot-manage-row clickable-lot-card"
                  onClick={(e) => {
                    if (!e.target.closest("a, button")) navigate(targetUrl);
                  }}
                >
                  <div className="lot-manage-thumb">
                    <img src={lot.image} alt={lot.title} />
                  </div>
                  <div className="lot-manage-info">
                    <div className="lot-manage-status-row">
                      <span
                        className={`chip ${
                          lot.status === "active" ? "chip-live" : "chip-ended"
                        }`}
                      >
                        <span className="chip-dot"></span>
                        {lot.status === "active"
                          ? t("mode_live") || "Ուղիղ"
                          : t("mode_ended") || "Ավարտված / Վաճառված"}
                      </span>
                      <small className="lot-manage-id-lbl">
                        <span>{t("det_lot_word")}</span> #{lot.id} · {lot.categoryId}
                      </small>
                    </div>
                    <h3 className="lot-manage-title">
                      <Link to={targetUrl}>{lot.title}</Link>
                    </h3>
                    <p className="lot-manage-desc">
                      {lot.description?.slice(0, 95)}
                      {lot.description?.length > 95 ? "..." : ""}
                    </p>
                  </div>
                  <div className="lot-manage-data">
                    <div>
                      <small className="lot-manage-lbl">{t("lot_current_price")}</small>
                      <span className="lot-manage-val">
                        ${(lot.currentBid || lot.startingPrice || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                      <span className="lot-manage-val sm">{lot.bidsCount || 0}</span>
                    </div>
                    <div>
                      <small className="lot-manage-lbl">{t("lot_time_left")}</small>
                      <span className={`tm ${lot.isHot ? "hot" : ""}`}>
                        {lot.endsIn || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="lot-manage-actions">
                    <Link to={targetUrl} className="btn pri sm">
                      {t("lot_details_btn")}
                    </Link>
                    {isRem && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRemind(lot.id);
                        }}
                        className="btn sm bad"
                        title={t("ml_cancel_rem_title")}
                      >
                        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>{" "}
                        <span>{t("ml_btn_cancel")}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card catalog-empty-box">
              <p className="catalog-empty-msg">
                Այս բաժնում դեռևս լոտեր չկան: Ավելացրեք ձեր առաջին լոտը:
              </p>
              <Link to="/add-lot" className="btn pri sm">
                {t("ml_add_btn")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
