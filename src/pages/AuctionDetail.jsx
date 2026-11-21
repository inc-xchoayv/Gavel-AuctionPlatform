import "../styles/auction-detail.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AuctionDetail() {
  const { t } = useI18n();
  usePageTitle("title_detail");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <Link to="/auctions">{t("nav_auctions")}</Link>
              <span>›</span>
              <span>Հին ժամացույց</span>
            </div>

            <div className="detail-layout">

              <div>

                <div className="gallery-wrapper">
                  <input type="radio" name="gallery-view" id="gview-1" className="gallery-radio" defaultChecked />
                  <input type="radio" name="gallery-view" id="gview-2" className="gallery-radio" />
                  <input type="radio" name="gallery-view" id="gview-3" className="gallery-radio" />
                  <input type="radio" name="gallery-view" id="gview-4" className="gallery-radio" />

                  <div className="gallery-main-viewport">
                    <div className="gallery-slide slide-1"><img src="/images/lot-watch.jpg" alt="Հին շվեյցարական ժամացույց · Դիմացից" /></div>
                    <div className="gallery-slide slide-2"><img src="/images/watch-side.jpg" alt="Հին շվեյցարական ժամացույց · Կողքից" /></div>
                    <div className="gallery-slide slide-3"><img src="/images/watch-mech.jpg" alt="Հին շվեյցարական ժամացույց · Մեխանիզմ" /></div>
                    <div className="gallery-slide slide-4"><img src="/images/watch-case.jpg" alt="Հին շվեյցարական ժամացույց · Արծաթե կափարիչ" /></div>
                  </div>

                  <div className="gallery-thumbs">
                    <label htmlFor="gview-1" className="thumb-item thumb-btn-1" title="Տեսք 1 · Դիմացից">
                      <img src="/images/lot-watch.jpg" alt="Տեսք 1" />
                    </label>
                    <label htmlFor="gview-2" className="thumb-item thumb-btn-2" title="Տեսք 2 · Կողքից">
                      <img src="/images/watch-side.jpg" alt="Տեսք 2" />
                    </label>
                    <label htmlFor="gview-3" className="thumb-item thumb-btn-3" title="Տեսք 3 · Մեխանիզմ">
                      <img src="/images/watch-mech.jpg" alt="Տեսք 3" />
                    </label>
                    <label htmlFor="gview-4" className="thumb-item thumb-btn-4" title="Տեսք 4 · Կափարիչ">
                      <img src="/images/watch-case.jpg" alt="Տեսք 4" />
                    </label>
                  </div>
                </div>

                <div className="tabs-container">
                  <input type="radio" name="detail-tab" id="dtab-desc" className="detail-tab-radio" defaultChecked />
                  <input type="radio" name="detail-tab" id="dtab-spec" className="detail-tab-radio" />
                  <input type="radio" name="detail-tab" id="dtab-ship" className="detail-tab-radio" />

                  <div className="tab-nav">
                    <label htmlFor="dtab-desc" className="tab-btn dtab-btn-desc">{t("det_tab_desc")}</label>
                    <label htmlFor="dtab-spec" className="tab-btn dtab-btn-spec">{t("det_tab_specs")}</label>
                    <label htmlFor="dtab-ship" className="tab-btn dtab-btn-ship">{t("det_tab_ship")}</label>
                  </div>

                  <div className="tab-content-area">

                    <div id="pane-desc" className="detail-tab-pane">
                      <p className="desc-text">
                        Բացառիկ պահպանվածությամբ շվեյցարական գրպանի ժամացույց: Պատրաստված է 875 հարգի արծաթից, մեխանիկական լարով, աշխատող վիճակում: Իդեալական նմուշ հավաքորդների համար:
                      </p>
                      <div className="provenance-card">
                        <h4>{t("det_tab_prov")}</h4>
                        <p className="provenance-text">Մասնավոր հավաքածու, Ժնև, Շվեյցարիա (1910 թ.): 100% բնօրինակ մասեր, երբևէ չի ենթարկվել ոչ գործարանային միջամտության: Պատմական իսկության փաստաթուղթը տրամադրվում է:</p>
                      </div>
                    </div>

                    <div id="pane-spec" className="detail-tab-pane">
                      <table className="spec-table">
                        <tr><td>{t("det_lot_num")}</td><td>#128</td></tr>
                        <tr><td>{t("det_category")}</td><td>Ժամացույցներ (Watches)</td></tr>
                        <tr><td>{t("det_maker")}</td><td>Patek Philippe &amp; Co., Ժնև, Շվեյցարիա</td></tr>
                        <tr><td>{t("det_year")}</td><td>1910 թ.</td></tr>
                        <tr><td>{t("det_material")}</td><td>875 հարգի արծաթ (0.875 Silver)</td></tr>
                        <tr><td>{t("det_dims")}</td><td>52 մմ տրամագիծ, 85 գրամ</td></tr>
                        <tr><td>{t("det_mech")}</td><td>Մեխանիկական, 18 քարով (18 Jewels)</td></tr>
                        <tr><td>{t("det_cond")}</td><td>Գերազանց (Բնօրինակ, աշխատող)</td></tr>
                        <tr><td>{t("det_reserve")}</td><td><span>{t("det_reserve_met")}</span> <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></td></tr>
                      </table>
                    </div>

                    <div id="pane-ship" className="detail-tab-pane">
                      <div className="shipping-info-grid">
                        <div className="shipping-box">
                          <div className="shipping-box-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> <span>{t("det_ship_title")}</span></div>
                          <div className="shipping-box-desc">{t("det_ship_desc")}</div>
                        </div>
                        <div className="shipping-box">
                          <div className="shipping-box-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg> <span>{t("det_auth_title")}</span></div>
                          <div className="shipping-box-desc">{t("det_auth_desc")}</div>
                        </div>
                        <div className="shipping-box">
                          <div className="shipping-box-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> <span>{t("det_pay_title")}</span></div>
                          <div className="shipping-box-desc">{t("det_pay_desc")}</div>
                        </div>
                        <div className="shipping-box">
                          <div className="shipping-box-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> <span>{t("det_escrow_title")}</span></div>
                          <div className="shipping-box-desc">{t("det_escrow_desc")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bid-card">
                  <div className="bid-card-head">
                    <span className="chip live">{t("chip_live_air")}</span>
                    <span className="bid-card-lot-id">Լոտ <b>#128</b></span>
                  </div>

                  <h1 className="bid-card-title">Հին ժամացույց</h1>
                  <p className="bid-card-subtitle">Արծաթե գրպանի ժամացույց, 1910 թ., Շվեյցարիա</p>

                  <div className="bid-price-box">
                    <div className="bid-price-row">
                      <div>
                        <small className="bid-price-lbl">{t("det_current_max")}</small>
                        <div className="big-price">$1,250</div>
                      </div>
                      <div className="bid-timer-col">
                        <small className="bid-price-lbl">{t("lot_time_left")}</small>
                        <div className="tm bid-timer-val">02:41:08</div>
                      </div>
                    </div>

                    <div className="bid-price-meta">
                      <span><span>{t("det_start_price")}</span> <b>$800</b></span>
                      <span><span>{t("det_bids_count")}</span> <b>14</b></span>
                    </div>
                  </div>

                  <form action="/place-bid" method="get">
                    <div className="form-group">
                      <label className="form-label">{t("det_min_steps")}</label>
                      <div className="quick-bids">
                        <button type="submit" name="quick_bid" value="1300" className="quick-btn" title="Առաջարկել $1,300">+$50 ($1,300)</button>
                        <button type="submit" name="quick_bid" value="1350" className="quick-btn" title="Առաջարկել $1,350">+$100 ($1,350)</button>
                        <button type="submit" name="quick_bid" value="1500" className="quick-btn" title="Առաջարկել $1,500">+$250 ($1,500)</button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t("det_your_bid")}</label>
                      <div className="bid-input-group">
                        <input type="number" name="bid" className="form-input bid-input-field" defaultValue="1300" min="1300" step="50" />
                        <button type="submit" className="btn pri bid-submit-btn">{t("det_place_bid_btn")}</button>
                      </div>
                      <small className="form-hint">Նվազագույն թույլատրելի գին՝ $1,300 (քայլը՝ +$50)</small>
                    </div>

                    <Link to="/place-bid" className="btn pri lg full">{t("det_join_live")}</Link>
                  </form>

                  <div className="seller-box">
                    <div className="user-avatar seller-avatar-big">Ա</div>
                    <div className="seller-meta-col">
                      <div className="seller-name">Արմեն Սարգսյան</div>
                      <div className="seller-rating-txt">4.9 <svg className="ico ico-sm ico-fill" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> · 12 լոտ</div>
                    </div>
                    <label htmlFor="chat-widget-toggle" className="btn sm chat-open-label" title={t("det_open_chat_title")}><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> Կապ</label>
                  </div>

                  <div className="bid-history-section">
                    <div className="bid-history-head">
                      <h4>{t("det_bid_history")}</h4>
                      <span className="bid-history-live-pill">{t("det_live_badge")}</span>
                    </div>
                    <div className="bid-history-list">
                      <div className="bid-history-row highlight">
                        <div>
                          <b>Գարիկ Հ.</b> <small className="bid-me-tag">{t("det_you_leader")}</small>
                          <small className="bid-time-tag">2 րոպե առաջ</small>
                        </div>
                        <div className="bid-amount-tag">$1,250</div>
                      </div>
                      <div className="bid-history-row">
                        <div>
                          <b>Արամ Գ.</b>
                          <small className="bid-time-tag">14 րոպե առաջ</small>
                        </div>
                        <div className="bid-amount-tag">$1,200</div>
                      </div>
                      <div className="bid-history-row">
                        <div>
                          <b>Դավիթ Մ.</b>
                          <small className="bid-time-tag">35 րոպե առաջ</small>
                        </div>
                        <div className="bid-amount-tag">$1,150</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>


    </>
  );
}
