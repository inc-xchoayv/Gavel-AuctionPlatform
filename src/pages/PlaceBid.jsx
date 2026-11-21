import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/place-bid.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";

export default function PlaceBid() {
  const { t } = useI18n();
  usePageTitle("title_place_bid");
  const { user, setFlash } = useAuth();
  const { lots, getLotById, placeBid } = useLots();
  const [searchParams] = useSearchParams();

  const paramId = searchParams.get("id");
  const lot = (paramId ? getLotById(paramId) : null) || getLotById(405) || lots[0] || {};

  const minInc = Number(lot.minIncrement) || 500;
  const currentPrice = Number(lot.currentBid) || Number(lot.startingPrice) || 0;
  const nextMinBid = currentPrice + minInc;

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [autoBidAmount, setAutoBidAmount] = useState(nextMinBid + minInc * 4);

  const galleryList =
    lot.gallery && lot.gallery.length > 0 ? lot.gallery : [lot.image || "/images/car-front.jpg"];

  const handleMakeBid = (amount) => {
    try {
      placeBid(lot.id, amount, user);
      setFlash(`Հաջողությամբ առաջարկվեց $${amount.toLocaleString()}: Դուք առաջատարն եք:`);
    } catch (err) {
      setFlash(err.message);
    }
  };

  const handleAutoBidSubmit = (e) => {
    e.preventDefault();
    const amount = Number(autoBidAmount);
    if (!amount || amount < nextMinBid) {
      setFlash(`Ավտոմատ առաջարկը պետք է լինի առնվազն $${nextMinBid.toLocaleString()}`);
      return;
    }
    handleMakeBid(amount);
  };

  const platformFee = Math.round(nextMinBid * 0.04);
  const depositIns = 250;
  const totalDue = nextMinBid + platformFee + depositIns;

  return (
    <main>
      <div className="w">
        <div className="breadcrumb">
          <Link to="/">{t("nav_home")}</Link>
          <span>›</span>
          <Link to="/auctions">{t("nav_auctions")}</Link>
          <span>›</span>
          <Link to={`/auction-detail?id=${lot.id}`}>{t("bid_bc_lot")}</Link>
          <span>›</span>
          <span>{t("bid_bc_cur")}</span>
        </div>

        <div className="copart-arena">
          <div className="arena-live-banner">
            <div className="arena-live-left">
              <span className="copart-live-badge">
                <span className="live-pulse-dot"></span> Ուղիղ եթեր · Live Arena
              </span>
              <span className="arena-lane-name">{t("bid_hall_a")}</span>
            </div>
            <div className="arena-live-right">
              <span>
                Առցանց մասնակիցներ՝ <b className="arena-participants-count">48 մասնակից</b>
              </span>
            </div>
          </div>

          <div className="arena-left-col">
            {/* Պատկերասրահ */}
            <div className="vehicle-gallery-wrapper">
              <div className="vehicle-main-img-wrap">
                <div className="car-slide">
                  <img
                    src={galleryList[selectedImgIdx] || galleryList[0]}
                    alt={lot.title}
                  />
                </div>

                <span className="vehicle-img-badge">
                  <span>{t("det_lot_word")}</span> #{lot.id} · Դահլիճ A
                </span>
                <div className="vehicle-copart-tags">
                  <span className="copart-tag">
                    <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>{" "}
                    {lot.specs?.condition || "Run & Drive"}
                  </span>
                  <span className="copart-tag blue">
                    {lot.specs?.titleType || "Clean Title"}
                  </span>
                  <span className="copart-tag">Բանալիներ՝ Առկա են</span>
                </div>
              </div>

              {galleryList.length > 1 && (
                <div className="vehicle-thumbs-row">
                  {galleryList.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`vehicle-thumb-box ${selectedImgIdx === idx ? "active" : ""}`}
                      onClick={() => setSelectedImgIdx(idx)}
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
              <span className="vehicle-lot-pill">
                VIN: {lot.specs?.vin || "WP0AB2A99MS12****"}
              </span>
            </div>

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
                  ${((currentPrice || 35000) * 1.6).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="live-stream-box">
              <div className="live-stream-header">
                <span className="stream-title">
                  <span className="stream-title-dot"></span> Հայտերի ուղիղ հոսք (Live Activity)
                </span>
                <small>{t("bid_instant_update")}</small>
              </div>
              <div className="live-stream-list">
                <div className="stream-row leader">
                  <span className="stream-buyer">
                    {lot.lastBidder || "Մասնակից #8412 (Երևան, AM)"}{" "}
                    <span className="stream-badge">{t("bid_leader")}</span>
                  </span>
                  <span className="stream-amount">${currentPrice.toLocaleString()}</span>
                </div>
                <div className="stream-row">
                  <span className="stream-buyer">Մասնակից #2104 (Գլենդել, US) · 4 վրկ առաջ</span>
                  <span className="stream-amount">
                    ${Math.max(0, currentPrice - minInc).toLocaleString()}
                  </span>
                </div>
                <div className="stream-row">
                  <span className="stream-buyer">Մասնակից #1198 (Գյումրի, AM) · 18 վրկ առաջ</span>
                  <span className="stream-amount">
                    ${Math.max(0, currentPrice - minInc * 2).toLocaleString()}
                  </span>
                </div>
                <div className="stream-row">
                  <span className="stream-buyer">Մասնակից #552 (Թբիլիսի, GE) · 35 վրկ առաջ</span>
                  <span className="stream-amount">
                    ${Math.max(0, currentPrice - minInc * 3).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="arena-right-col">
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
              <div className="hammer-clock">{lot.endsIn || "00:14"}</div>
              <div className="hammer-bar-wrap">
                <div className="hammer-bar-fill"></div>
              </div>
              <div className="hammer-callout">{t("bid_going_once")}</div>
            </div>

            <div className="live-price-box">
              <div className="price-row-top">
                <div>
                  <span className="current-bid-lbl">{t("bid_current_high")}</span>
                  <div className="current-bid-val">${currentPrice.toLocaleString()}</div>
                </div>
                <span className="current-leader-tag">
                  <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>{" "}
                  {lot.lastBidder || "Մասնակից #8412"}
                </span>
              </div>
              <div className="next-bid-row">
                <span>{t("bid_next_step")}</span>
                <span className="next-bid-val">${nextMinBid.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleMakeBid(nextMinBid)}
                className="copart-bid-btn"
              >
                <span>ԱՌԱՋԱՐԿԵԼ ${nextMinBid.toLocaleString()}</span>
                <span className="copart-btn-sub">{t("bid_one_click")}</span>
              </button>

              <div className="quick-bid-title">{t("bid_quick_steps")}</div>
              <div className="quick-bid-grid">
                <button
                  type="button"
                  onClick={() => handleMakeBid(currentPrice + minInc)}
                  className="quick-bid-btn"
                >
                  +${minInc}
                  <br />
                  <small>${(currentPrice + minInc).toLocaleString()}</small>
                </button>
                <button
                  type="button"
                  onClick={() => handleMakeBid(currentPrice + minInc * 2)}
                  className="quick-bid-btn"
                >
                  +${minInc * 2}
                  <br />
                  <small>${(currentPrice + minInc * 2).toLocaleString()}</small>
                </button>
                <button
                  type="button"
                  onClick={() => handleMakeBid(currentPrice + minInc * 5)}
                  className="quick-bid-btn"
                >
                  +${minInc * 5}
                  <br />
                  <small>${(currentPrice + minInc * 5).toLocaleString()}</small>
                </button>
                <button
                  type="button"
                  onClick={() => handleMakeBid(currentPrice + minInc * 10)}
                  className="quick-bid-btn"
                >
                  +${minInc * 10}
                  <br />
                  <small>${(currentPrice + minInc * 10).toLocaleString()}</small>
                </button>
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
                  <span className="copart-fee-total-num">${totalDue.toLocaleString()}</span>
                </div>
              </div>

              <div className="copart-trust-badge">
                <span>
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>{" "}
                  Gavel Verified Live Platform · 100% ֆինանսական երաշխիք
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
