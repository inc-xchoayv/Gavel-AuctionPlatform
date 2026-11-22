import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/auction-detail.css";
import "../styles/place-bid.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";
import categoriesData from "../data/categories.json";

function computeCountdownString(endsAt, fallbackEndsIn) {
  if (!endsAt) return fallbackEndsIn || "02:41:08";
  const diff = new Date(endsAt).getTime() - Date.now();
  if (isNaN(diff) || diff <= 0) return fallbackEndsIn || "00:00:00";
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (days >= 1) {
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
  }
  return [hours, mins, secs].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function AuctionDetail() {
  const { t, lang } = useI18n();
  usePageTitle("title_detail");
  const { session, user, setFlash } = useAuth();
  const { lots, getLotById, placeBid } = useLots();
  const [searchParams] = useSearchParams();

  const paramId = searchParams.get("id");
  const lot = (paramId ? getLotById(paramId) : null) || lots[0] || {};

  const normCatId = lot.categoryId === "classic-cars" ? "cars" : lot.categoryId;
  const catObj = categoriesData.find((c) => c.id === normCatId);
  const categoryLabel = catObj?.name?.[lang] || catObj?.name?.en || normCatId;

  // Requirement 6: Copart-style live auction logic specifically for Car / Vehicle lots
  // and lots explicitly scheduled as 🔴 Живой онлайн-аукцион
  const isCarLot = normCatId === "cars";
  const isCopartLiveMode =
    isCarLot ||
    lot.auctionFormat === "live" ||
    lot.durationType === "live" ||
    lot.badge === "copart-live";

  const minInc = Number(lot.minIncrement) || (isCarLot ? 500 : 50);
  const currentPrice = Number(lot.currentBid) || Number(lot.startingPrice) || 0;
  const nextMinBid = currentPrice + minInc;

  const [customBid, setCustomBid] = useState(nextMinBid);
  const [autoBidAmount, setAutoBidAmount] = useState(nextMinBid + minInc * 4);
  const [activeTab, setActiveTab] = useState("desc"); // "desc" | "spec" | "ship"
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  // Rapid 15-second step timer for Copart Live Mode
  const [stepSeconds, setStepSeconds] = useState(14);
  const [forceLiveRoom, setForceLiveRoom] = useState(false);

  // Standard timed countdown for Classic eBay/Catawiki-style mode
  const [timedCountdown, setTimedCountdown] = useState(() =>
    computeCountdownString(lot.endsAt, lot.endsIn)
  );

  // Reset form states when switching lots
  useEffect(() => {
    setCustomBid(nextMinBid);
    setAutoBidAmount(nextMinBid + minInc * 4);
    setSelectedGalleryIdx(0);
    setStepSeconds(14);
  }, [lot.id, nextMinBid, minInc]);

  // Real-time ticking timers
  useEffect(() => {
    if (lot.status === "ended") return;
    const interval = setInterval(() => {
      if (isCopartLiveMode) {
        setStepSeconds((prev) => (prev <= 1 ? 15 : prev - 1));
      } else {
        setTimedCountdown(computeCountdownString(lot.endsAt, lot.endsIn));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isCopartLiveMode, lot.endsAt, lot.endsIn, lot.status]);

  const galleryList =
    lot.gallery && lot.gallery.length > 0
      ? lot.gallery
      : [lot.image || "/images/lot-watch.jpg"];

  const sellerId = lot.seller?.id || lot.seller?.name || "seller-1";
  const sellerName = lot.seller?.name || "Արմեն Սարգսյան";

  // Build dynamic bid history list combining real bids + seed history
  const bidHistoryRows = useMemo(() => {
    const realBids = Array.isArray(lot.bidHistory) ? lot.bidHistory : [];
    if (realBids.length > 0) {
      return realBids.map((b, idx) => ({
        id: b.id || idx,
        bidderId: b.bidderId || "1",
        bidderName: b.bidderName || "Մասնակից",
        amount: b.amount,
        isLeader: idx === 0,
        isMe: session && String(b.bidderId) === String(session.id),
        timeLabel: idx === 0 ? "Քիչ առաջ" : new Date(b.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
    }
    if ((lot.bidsCount || 0) === 0) {
      return [];
    }
    return [
      {
        id: "seed_1",
        bidderId: lot.lastBidderId || "1",
        bidderName: lot.lastBidder || "Գարիկ Հ.",
        amount: currentPrice,
        isLeader: true,
        isMe: session && String(lot.lastBidderId) === String(session.id),
        timeLabel: "Քիչ առաջ",
      },
      {
        id: "seed_2",
        bidderId: "2",
        bidderName: "Արմեն Ս.",
        amount: Math.max(lot.startingPrice || 0, currentPrice - minInc),
        isLeader: false,
        isMe: false,
        timeLabel: "14 րոպե առաջ",
      },
      {
        id: "seed_3",
        bidderId: "5",
        bidderName: "Դավիթ Ս.",
        amount: Math.max(lot.startingPrice || 0, currentPrice - minInc * 2),
        isLeader: false,
        isMe: false,
        timeLabel: "35 րոպե առաջ",
      },
    ];
  }, [lot.bidHistory, lot.bidsCount, lot.lastBidder, lot.lastBidderId, lot.startingPrice, currentPrice, minInc, session]);

  const executeBid = (amount) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < nextMinBid) {
      setFlash(`Նվազագույն առաջարկը պետք է լինի առնվազն $${nextMinBid.toLocaleString()}`);
      return;
    }
    try {
      placeBid(lot.id, numAmount, user || session);
      setFlash(`Շնորհավորում ենք: Դուք առաջարկեցիք $${numAmount.toLocaleString()}`);
      setCustomBid(numAmount + minInc);
      setAutoBidAmount(numAmount + minInc * 4);
      if (isCopartLiveMode) {
        setStepSeconds(15); // Reset rapid step countdown on new bid
      }
    } catch (err) {
      setFlash(err.message);
    }
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    executeBid(customBid);
  };

  const handleAutoBidSubmit = (e) => {
    e.preventDefault();
    executeBid(autoBidAmount);
  };

  const platformFee = Math.round(nextMinBid * 0.04);
  const depositIns = 250;
  const totalDue = nextMinBid + platformFee + depositIns;

  // Shared Lot Details Tabs (Description, Specs, Shipping & Guarantees)
  const renderDetailsTabs = () => (
    <div className="tabs-container copart-tabs-wrap">
      <div className="tab-nav">
        <button
          type="button"
          onClick={() => setActiveTab("desc")}
          className={`tab-btn dtab-btn-desc ${activeTab === "desc" ? "active" : ""}`}
        >
          {t("det_tab_desc")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("spec")}
          className={`tab-btn dtab-btn-spec ${activeTab === "spec" ? "active" : ""}`}
        >
          {t("det_tab_specs")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ship")}
          className={`tab-btn dtab-btn-ship ${activeTab === "ship" ? "active" : ""}`}
        >
          {t("det_tab_ship")}
        </button>
      </div>

      <div className="tab-content-area">
        {activeTab === "desc" && (
          <div id="pane-desc" className="detail-tab-pane">
            <p className="desc-text">{lot.description}</p>
            <div className="provenance-card">
              <h4>{t("det_tab_prov")}</h4>
              <p className="provenance-text">
                Բնօրինակ երաշխավորված հավաքածու: 100% բնօրինակ մասեր, փաստաթղթավորված ծագում: Պատմական իսկության փաստաթուղթը տրամադրվում է հաղթողին:
              </p>
            </div>
          </div>
        )}

        {activeTab === "spec" && (
          <div id="pane-spec" className="detail-tab-pane">
            <table className="spec-table">
              <tbody>
                <tr>
                  <td>{t("det_lot_num")}</td>
                  <td>#{lot.id}</td>
                </tr>
                <tr>
                  <td>{t("det_category")}</td>
                  <td>{categoryLabel}</td>
                </tr>
                {lot.specs &&
                  Object.entries(lot.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{String(val)}</td>
                    </tr>
                  ))}
                <tr>
                  <td>{t("det_reserve")}</td>
                  <td>
                    <span>{t("det_reserve_met")}</span>{" "}
                    <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "ship" && (
          <div id="pane-ship" className="detail-tab-pane">
            <div className="shipping-info-grid">
              <div className="shipping-box">
                <div className="shipping-box-title">
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7.5 4.27 9 5.15" />
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>{" "}
                  <span>{t("det_ship_title")}</span>
                </div>
                <div className="shipping-box-desc">{t("det_ship_desc")}</div>
              </div>
              <div className="shipping-box">
                <div className="shipping-box-title">
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>{" "}
                  <span>{t("det_auth_title")}</span>
                </div>
                <div className="shipping-box-desc">{t("det_auth_desc")}</div>
              </div>
              <div className="shipping-box">
                <div className="shipping-box-title">
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>{" "}
                  <span>{t("det_pay_title")}</span>
                </div>
                <div className="shipping-box-desc">{t("det_pay_desc")}</div>
              </div>
              <div className="shipping-box">
                <div className="shipping-box-title">
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>{" "}
                  <span>{t("det_escrow_title")}</span>
                </div>
                <div className="shipping-box-desc">{t("det_escrow_desc")}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Shared Seller Box with Clickable Link to Public Profile
  const renderSellerBox = () => (
    <div className="seller-box">
      <Link
        to={`/profile/${encodeURIComponent(sellerId)}`}
        className="user-avatar seller-avatar-big"
      >
        {lot.seller?.avatar ? (
          <img src={lot.seller.avatar} alt={sellerName} />
        ) : (
          sellerName.charAt(0).toUpperCase()
        )}
      </Link>
      <div className="seller-meta-col">
        <div className="seller-name">
          <Link
            to={`/profile/${encodeURIComponent(sellerId)}`}
            className="seller-profile-link"
          >
            {sellerName}
          </Link>{" "}
          {lot.seller?.verified && (
            <span className="user-verified-check" title="Վերիֆիկացված վաճառող">
              ✓
            </span>
          )}
        </div>
        <div className="seller-rating-txt">
          {lot.seller?.rating || 4.9}{" "}
          <svg className="ico ico-sm ico-fill" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>{" "}
          ·{" "}
          <Link
            to={`/profile/${encodeURIComponent(sellerId)}`}
            className="bidder-profile-link"
          >
            Դիտել պրոֆիլը →
          </Link>
        </div>
      </div>
      <label
        htmlFor="chat-widget-toggle"
        className="btn sm chat-open-label"
        title={t("det_open_chat_title")}
      >
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>{" "}
        Կապ
      </label>
    </div>
  );

  // ============================================================================
  // MODE 1: COPART-STYLE LIVE AUCTION (Cars / Vehicles & Scheduled Live Auctions)
  // ============================================================================
  if (isCopartLiveMode) {
    const isPreBidSchedule =
      lot.liveStartAt &&
      new Date(lot.liveStartAt).getTime() > Date.now() &&
      !forceLiveRoom;

    return (
      <main>
        <div className="w">
          <div className="breadcrumb">
            <Link to="/">{t("nav_home")}</Link>
            <span>›</span>
            <Link to="/auctions">{t("nav_auctions")}</Link>
            <span>›</span>
            <span>{lot.title}</span>
          </div>

          <div className="copart-arena">
            <div className="arena-live-banner">
              <div className="arena-live-left">
                <span className="copart-live-badge">
                  <span className="live-pulse-dot"></span> Ուղիղ եթեր · Live Arena
                </span>
                <span className="arena-lane-name">
                  {isCarLot ? t("bid_hall_a") : `Լոտ #${lot.id} · Live Finale`}
                </span>
              </div>
              <div className="arena-live-right">
                <span>
                  Առցանց մասնակիցներ՝{" "}
                  <b className="arena-participants-count">48 մասնակից</b>
                </span>
              </div>
            </div>

            <div className="arena-left-col">
              {/* Gallery */}
              <div className="vehicle-gallery-wrapper">
                <div className="vehicle-main-img-wrap">
                  <div className="car-slide">
                    <img
                      src={galleryList[selectedGalleryIdx] || galleryList[0]}
                      alt={lot.title}
                    />
                  </div>

                  <span className="vehicle-img-badge">
                    <span>{t("det_lot_word")}</span> #{lot.id} · {categoryLabel}
                  </span>
                  <div className="vehicle-copart-tags">
                    <span className="copart-tag">
                      <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>{" "}
                      {lot.specs?.condition || (isCarLot ? "Run & Drive" : "Verified Live")}
                    </span>
                    {lot.specs?.titleType && (
                      <span className="copart-tag blue">{lot.specs.titleType}</span>
                    )}
                    {isCarLot && <span className="copart-tag">Բանալիներ՝ Առկա են</span>}
                  </div>
                </div>

                {galleryList.length > 1 && (
                  <div className="vehicle-thumbs-row">
                    {galleryList.map((imgSrc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`vehicle-thumb-box ${
                          selectedGalleryIdx === idx ? "active" : ""
                        }`}
                        onClick={() => setSelectedGalleryIdx(idx)}
                        title={`Տեսք ${idx + 1}`}
                      >
                        <img src={imgSrc} alt={`Տեսք ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="vehicle-title-head">
                <h1 className="vehicle-headline">{lot.title}</h1>
                {isCarLot && (
                  <span className="vehicle-lot-pill">
                    VIN: {lot.specs?.vin || "WP0AB2A99MS12****"}
                  </span>
                )}
              </div>

              {isCarLot && (
                <div className="copart-specs-grid">
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_odometer")}</span>
                    <span className="spec-val">
                      {lot.specs?.mileage || "18,420 mi (29,644 կմ)"}
                    </span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_engine")}</span>
                    <span className="spec-val">
                      {lot.specs?.engine || "3.0L Twin-Turbo (443 hp)"}
                    </span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_trans")}</span>
                    <span className="spec-val">
                      {lot.specs?.transmission || "Automatic PDK"}
                    </span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_drive")}</span>
                    <span className="spec-val">AWD (Լիաքարշակ)</span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_damage")}</span>
                    <span className="spec-val">Առանց վթարի</span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_retail")}</span>
                    <span className="spec-val">
                      ${Math.round((currentPrice || 35000) * 1.45).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Live Bid Stream */}
              <div className="live-stream-box">
                <div className="live-stream-header">
                  <span className="stream-title">
                    <span className="stream-title-dot"></span> Հայտերի ուղիղ հոսք (Live Activity)
                  </span>
                  <small>{t("bid_instant_update")}</small>
                </div>
                <div className="live-stream-list">
                  {bidHistoryRows.length === 0 ? (
                    <div className="stream-row">
                      <span className="stream-buyer">
                        Դեռևս հայտեր չկան։ Եղեք առաջինը։
                      </span>
                      <span className="stream-amount">
                        ${currentPrice.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    bidHistoryRows.map((row) => (
                      <div
                        key={row.id}
                        className={`stream-row ${row.isLeader ? "leader" : ""}`}
                      >
                        <span className="stream-buyer">
                          <Link
                            to={`/profile/${encodeURIComponent(row.bidderId)}`}
                            className="bidder-profile-link"
                          >
                            {row.bidderName}
                          </Link>{" "}
                          · {row.timeLabel}{" "}
                          {row.isLeader && (
                            <span className="stream-badge">{t("bid_leader")}</span>
                          )}
                        </span>
                        <span className="stream-amount">
                          ${row.amount.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Unified Lot Details Tabs (Description, Specs, Shipping) */}
              {renderDetailsTabs()}
            </div>

            <div className="arena-right-col">
              {isPreBidSchedule && (
                <div className="prebid-schedule-banner">
                  <div className="prebid-schedule-head">
                    <span>
                      🔴 Pre-Bid ռեժիմ · Եզրափակիչ՝{" "}
                      {new Date(lot.liveStartAt).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      className="btn sm pri"
                      onClick={() => setForceLiveRoom(true)}
                    >
                      Միացնել Live թայմերը
                    </button>
                  </div>
                  <div>
                    Մինչև ուղիղ եթերի մեկնարկը կարող եք կատարել նախնական առաջարկներ (Pre-bid):
                  </div>
                </div>
              )}

              <div className="copart-hammer-card">
                <div className="hammer-label">
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" />
                    <path d="m16 16 6-6" />
                    <path d="m8 8 6-6" />
                    <path d="m9 7 8 8" />
                    <path d="m21 11-8-8" />
                  </svg>{" "}
                  <span>{t("bid_hammer_last")}</span>
                </div>
                <div className="hammer-clock">
                  00:{String(stepSeconds).padStart(2, "0")}
                </div>
                <div className="hammer-bar-wrap">
                  <div className={`hammer-bar-fill step-${stepSeconds}`}></div>
                </div>
                <div className="hammer-callout">
                  {stepSeconds <= 6 ? t("bid_going_once") : "Սպասում է հաջորդ քայլին..."}
                </div>
              </div>

              <div className="live-price-box">
                <div className="price-row-top">
                  <div>
                    <span className="current-bid-lbl">{t("bid_current_high")}</span>
                    <div className="current-bid-val">
                      ${currentPrice.toLocaleString()}
                    </div>
                  </div>
                  {bidHistoryRows[0] && (
                    <Link
                      to={`/profile/${encodeURIComponent(bidHistoryRows[0].bidderId)}`}
                      className="current-leader-tag bidder-profile-link"
                    >
                      <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>{" "}
                      {bidHistoryRows[0].bidderName}
                    </Link>
                  )}
                </div>
                <div className="next-bid-row">
                  <span>{t("bid_next_step")}</span>
                  <span className="next-bid-val">${nextMinBid.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => executeBid(nextMinBid)}
                  className="copart-bid-btn"
                >
                  <span>ԱՌԱՋԱՐԿԵԼ ${nextMinBid.toLocaleString()}</span>
                  <span className="copart-btn-sub">{t("bid_one_click")}</span>
                </button>

                <div className="quick-bid-title">{t("bid_quick_steps")}</div>
                <div className="quick-bid-grid">
                  {[1, 2, 5, 10].map((mult) => (
                    <button
                      key={mult}
                      type="button"
                      onClick={() => executeBid(currentPrice + minInc * mult)}
                      className="quick-bid-btn"
                    >
                      +${(minInc * mult).toLocaleString()}
                      <br />
                      <small>${(currentPrice + minInc * mult).toLocaleString()}</small>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAutoBidSubmit} className="proxy-bid-box">
                  <div className="proxy-bid-title">
                    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                    </svg>{" "}
                    <span>{t("chat_auto_badge")}</span> առաջարկ (Monster Max Bid)
                  </div>
                  <p className="proxy-bid-desc">{t("bid_auto_desc")}</p>
                  <div className="proxy-input-group">
                    <input
                      type="number"
                      className="form-input"
                      value={autoBidAmount}
                      onChange={(e) => setAutoBidAmount(e.target.value)}
                      min={nextMinBid}
                      step={minInc}
                    />
                    <button type="submit" className="btn sm">
                      {t("bid_set_btn")}
                    </button>
                  </div>
                </form>

                <div className="copart-fee-card">
                  <div className="copart-fee-row">
                    <span>{t("bid_offered_price")}</span>
                    <span>${nextMinBid.toLocaleString()}</span>
                  </div>
                  <div className="copart-fee-row">
                    <span>{t("bid_platform_fee")}</span>
                    <span>${platformFee.toLocaleString()}</span>
                  </div>
                  <div className="copart-fee-row">
                    <span>{t("bid_deposit_ins")}</span>
                    <span>${depositIns.toLocaleString()}</span>
                  </div>
                  <div className="copart-fee-row total">
                    <span>{t("bid_total_due")}</span>
                    <span className="copart-fee-total-num">
                      ${totalDue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {renderSellerBox()}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================================
  // MODE 2: CLASSIC EBAY / CATAWIKI-STYLE TIMED BIDDING (Standard Non-Car Lots)
  // ============================================================================
  return (
    <main>
      <div className="w">
        <div className="breadcrumb">
          <Link to="/">{t("nav_home")}</Link>
          <span>›</span>
          <Link to="/auctions">{t("nav_auctions")}</Link>
          <span>›</span>
          <span>{lot.title || t("title_detail")}</span>
        </div>

        <div className="detail-layout">
          <div>
            {/* Պատկերասրահ (Gallery) */}
            <div className="gallery-wrapper">
              <div className="gallery-main-viewport">
                <div className="gallery-slide">
                  <img
                    src={galleryList[selectedGalleryIdx] || galleryList[0]}
                    alt={lot.title}
                  />
                </div>
              </div>

              {galleryList.length > 1 && (
                <div className="gallery-thumbs">
                  {galleryList.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`thumb-item ${
                        selectedGalleryIdx === idx ? "active" : ""
                      }`}
                      onClick={() => setSelectedGalleryIdx(idx)}
                      title={`Տեսք ${idx + 1}`}
                    >
                      <img src={imgSrc} alt={`Thumb ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ներդիրներ (Tabs: Description, Specs, Shipping) */}
            {renderDetailsTabs()}
          </div>

          {/* Աջ կողմի վահանակ՝ Դասական ժամկետային սակարկություն (Classic Timed Bidding) */}
          <div>
            <div className="bid-card">
              <div className="bid-card-head">
                <span className={`chip ${lot.status === "ended" ? "chip-ended" : "chip-live"}`}>
                  <span className="chip-dot"></span>
                  {lot.status === "ended"
                    ? t("mode_ended") || "Ավարտված"
                    : t("mode_live") || "Ակտիվ աճուրդ"}
                </span>
                <span className="bid-card-lot-id">
                  {t("det_lot_word")} <b>#{lot.id}</b>
                </span>
              </div>

              <h1 className="bid-card-title">{lot.title}</h1>
              <p className="bid-card-subtitle">
                {lot.specs?.condition || "Բնօրինակ հավաքածու"} · {categoryLabel}
              </p>

              <div className="bid-price-box">
                <div className="bid-price-row">
                  <div>
                    <small className="bid-price-lbl">{t("det_current_max")}</small>
                    <div className="big-price">
                      ${currentPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="bid-timer-col">
                    <small className="bid-price-lbl">{t("lot_time_left")}</small>
                    <div className="tm bid-timer-val">
                      {lot.status === "ended" ? "00:00" : timedCountdown}
                    </div>
                  </div>
                </div>

                <div className="bid-price-meta">
                  <span>
                    <span>{t("det_start_price")}</span>{" "}
                    <b>${(lot.startingPrice || 0).toLocaleString()}</b>
                  </span>
                  <span>
                    <span>{t("det_bids_count")}</span>{" "}
                    <b>{lot.bidsCount || 0}</b>
                  </span>
                </div>
              </div>

              {lot.status !== "ended" && (
                <form onSubmit={handleBidSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t("det_min_steps")}</label>
                    <div className="quick-bids">
                      <button
                        type="button"
                        onClick={() => executeBid(currentPrice + minInc)}
                        className="quick-btn"
                      >
                        +${minInc} (${(currentPrice + minInc).toLocaleString()})
                      </button>
                      <button
                        type="button"
                        onClick={() => executeBid(currentPrice + minInc * 2)}
                        className="quick-btn"
                      >
                        +${minInc * 2} (${(currentPrice + minInc * 2).toLocaleString()})
                      </button>
                      <button
                        type="button"
                        onClick={() => executeBid(currentPrice + minInc * 5)}
                        className="quick-btn"
                      >
                        +${minInc * 5} (${(currentPrice + minInc * 5).toLocaleString()})
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("det_your_bid")}</label>
                    <div className="bid-input-group">
                      <input
                        type="number"
                        className="form-input bid-input-field"
                        value={customBid}
                        onChange={(e) => setCustomBid(e.target.value)}
                        min={nextMinBid}
                        step={minInc}
                      />
                      <button type="submit" className="btn pri bid-submit-btn">
                        {t("det_place_bid_btn")}
                      </button>
                    </div>
                    <small className="form-hint">
                      Նվազագույն թույլատրելի գին՝ ${nextMinBid.toLocaleString()} (քայլը՝ +${minInc})
                    </small>
                  </div>
                </form>
              )}

              {renderSellerBox()}

              {/* Սակարկությունների պատմություն */}
              <div className="bid-history-section">
                <div className="bid-history-head">
                  <h4>{t("det_bid_history")}</h4>
                  <span className="bid-history-live-pill">
                    {lot.bidsCount || 0} {t("tbl_bids") || "հայտ"}
                  </span>
                </div>
                <div className="bid-history-list">
                  {bidHistoryRows.length === 0 ? (
                    <div className="bid-history-row">
                      <div>Դեռևս հայտեր չկան։ Կատարեք առաջին առաջարկը։</div>
                    </div>
                  ) : (
                    bidHistoryRows.map((row) => (
                      <div
                        key={row.id}
                        className={`bid-history-row ${row.isLeader ? "highlight" : ""}`}
                      >
                        <div>
                          <Link
                            to={`/profile/${encodeURIComponent(row.bidderId)}`}
                            className="bidder-profile-link"
                          >
                            {row.bidderName}
                          </Link>{" "}
                          {row.isLeader && (
                            <small className="bid-me-tag">
                              {row.isMe ? t("det_you_leader") : t("bid_leader")}
                            </small>
                          )}{" "}
                          <small className="bid-time-tag">{row.timeLabel}</small>
                        </div>
                        <div className="bid-amount-tag">
                          ${row.amount.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
