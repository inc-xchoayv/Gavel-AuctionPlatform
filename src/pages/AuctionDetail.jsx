import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/auction-detail.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AuctionDetail() {
  const { t } = useI18n();
  usePageTitle("title_detail");
  const { user, setFlash } = useAuth();
  const { lots, getLotById, placeBid } = useLots();
  const [searchParams] = useSearchParams();

  // Ընտրված լոտը URL-ից կամ առաջինը որպես լռելյայն
  const paramId = searchParams.get("id");
  const lot = (paramId ? getLotById(paramId) : null) || lots[0] || {};

  const minInc = Number(lot.minIncrement) || 50;
  const nextMinBid = (Number(lot.currentBid) || Number(lot.startingPrice) || 0) + minInc;

  const [customBid, setCustomBid] = useState(nextMinBid);
  const [activeTab, setActiveTab] = useState("desc"); // "desc" | "spec" | "ship"
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  const galleryList = (lot.gallery && lot.gallery.length > 0) ? lot.gallery : [lot.image || "/images/lot-watch.jpg"];

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const bidAmount = Number(customBid);
    if (!bidAmount || bidAmount < nextMinBid) {
      setFlash(`Նվազագույն առաջարկը պետք է լինի առնվազն $${nextMinBid.toLocaleString()}`);
      return;
    }

    try {
      placeBid(lot.id, bidAmount, user);
      setFlash(`Շնորհավորում ենք: Դուք հաջողությամբ առաջարկեցիք $${bidAmount.toLocaleString()}`);
      setCustomBid(bidAmount + minInc);
    } catch (err) {
      setFlash(err.message);
    }
  };

  const handleQuickBid = (increment) => {
    const amount = (Number(lot.currentBid) || Number(lot.startingPrice) || 0) + increment;
    try {
      placeBid(lot.id, amount, user);
      setFlash(`Շնորհավորում ենք: Դուք առաջարկեցիք $${amount.toLocaleString()}`);
      setCustomBid(amount + minInc);
    } catch (err) {
      setFlash(err.message);
    }
  };

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
                      className={`thumb-item ${selectedGalleryIdx === idx ? "active" : ""}`}
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
            <div className="tabs-container">
              <input
                type="radio"
                name="detail-tab"
                id="dtab-desc"
                className="detail-tab-radio"
                checked={activeTab === "desc"}
                onChange={() => setActiveTab("desc")}
              />
              <input
                type="radio"
                name="detail-tab"
                id="dtab-spec"
                className="detail-tab-radio"
                checked={activeTab === "spec"}
                onChange={() => setActiveTab("spec")}
              />
              <input
                type="radio"
                name="detail-tab"
                id="dtab-ship"
                className="detail-tab-radio"
                checked={activeTab === "ship"}
                onChange={() => setActiveTab("ship")}
              />

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
                          <td>{lot.categoryId}</td>
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
          </div>

          {/* Աջ կողմի վահանակ՝ Սակարկություն (Bidding card) */}
          <div>
            <div className="bid-card">
              <div className="bid-card-head">
                <span className="chip live">{t("chip_live_air")}</span>
                <span className="bid-card-lot-id">
                  {t("det_lot_word")} <b>#{lot.id}</b>
                </span>
              </div>

              <h1 className="bid-card-title">{lot.title}</h1>
              <p className="bid-card-subtitle">
                {lot.specs?.condition || "Բնօրինակ հավաքածու"} · {lot.categoryId}
              </p>

              <div className="bid-price-box">
                <div className="bid-price-row">
                  <div>
                    <small className="bid-price-lbl">{t("det_current_max")}</small>
                    <div className="big-price">
                      ${(lot.currentBid || lot.startingPrice || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bid-timer-col">
                    <small className="bid-price-lbl">{t("lot_time_left")}</small>
                    <div className="tm bid-timer-val">{lot.endsIn || "00:00"}</div>
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

              <form onSubmit={handleBidSubmit}>
                <div className="form-group">
                  <label className="form-label">{t("det_min_steps")}</label>
                  <div className="quick-bids">
                    <button
                      type="button"
                      onClick={() => handleQuickBid(minInc)}
                      className="quick-btn"
                    >
                      +${minInc} (${((lot.currentBid || 0) + minInc).toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBid(minInc * 2)}
                      className="quick-btn"
                    >
                      +${minInc * 2} (${((lot.currentBid || 0) + minInc * 2).toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBid(minInc * 5)}
                      className="quick-btn"
                    >
                      +${minInc * 5} (${((lot.currentBid || 0) + minInc * 5).toLocaleString()})
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

                <Link to={`/place-bid?id=${lot.id}`} className="btn pri lg full">
                  {t("det_join_live")}
                </Link>
              </form>

              <div className="seller-box">
                <div className="user-avatar seller-avatar-big">
                  {lot.seller?.name ? lot.seller.name.charAt(0).toUpperCase() : "Ա"}
                </div>
                <div className="seller-meta-col">
                  <div className="seller-name">{lot.seller?.name || "Արմեն Սարգսյան"}</div>
                  <div className="seller-rating-txt">
                    {lot.seller?.rating || 4.9}{" "}
                    <svg className="ico ico-sm ico-fill" viewBox="0 0 24 24" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>{" "}
                    · {lot.bidsCount || 0} {t("flt_lots_word")}
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

              {/* Սակարկությունների պատմություն */}
              <div className="bid-history-section">
                <div className="bid-history-head">
                  <h4>{t("det_bid_history")}</h4>
                  <span className="bid-history-live-pill">{t("det_live_badge")}</span>
                </div>
                <div className="bid-history-list">
                  <div className="bid-history-row highlight">
                    <div>
                      <b>{lot.lastBidder || "Գարիկ Հ."}</b>{" "}
                      <small className="bid-me-tag">{t("det_you_leader")}</small>
                      <small className="bid-time-tag">Քիչ առաջ</small>
                    </div>
                    <div className="bid-amount-tag">
                      ${(lot.currentBid || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bid-history-row">
                    <div>
                      <b>Արամ Գ.</b>
                      <small className="bid-time-tag">14 րոպե առաջ</small>
                    </div>
                    <div className="bid-amount-tag">
                      ${Math.max(0, (lot.currentBid || 0) - minInc).toLocaleString()}
                    </div>
                  </div>
                  <div className="bid-history-row">
                    <div>
                      <b>Դավիթ Մ.</b>
                      <small className="bid-time-tag">35 րոպե առաջ</small>
                    </div>
                    <div className="bid-amount-tag">
                      ${Math.max(0, (lot.currentBid || 0) - minInc * 2).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
