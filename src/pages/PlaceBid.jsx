import "../styles/place-bid.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function PlaceBid() {
  const { t } = useI18n();
  usePageTitle("title_place_bid");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <Link to="/auctions">{t("nav_auctions")}</Link>
              <span>›</span>
              <Link to="/auction-detail">{t("bid_bc_lot")}</Link>
              <span>›</span>
              <span>{t("bid_bc_cur")}</span>
            </div>

            <div className="copart-arena">

              <div className="arena-live-banner">
                <div className="arena-live-left">
                  <span className="copart-live-badge"><span className="live-pulse-dot"></span> Ուղիղ եթեր · Live Arena</span>
                  <span className="arena-lane-name">{t("bid_hall_a")}</span>
                </div>
                <div className="arena-live-right">
                  <span>Առցանց մասնակիցներ՝ <b className="arena-participants-count">48 մասնակից</b></span>
                </div>
              </div>

              <div className="arena-left-col">

                <div className="vehicle-gallery-wrapper">
                  <input type="radio" name="car-view" id="cview-1" className="vehicle-gallery-radio" defaultChecked />
                  <input type="radio" name="car-view" id="cview-2" className="vehicle-gallery-radio" />
                  <input type="radio" name="car-view" id="cview-3" className="vehicle-gallery-radio" />
                  <input type="radio" name="car-view" id="cview-4" className="vehicle-gallery-radio" />

                  <div className="vehicle-main-img-wrap">
                    <div className="car-slide cslide-1"><img src="/images/car-front.jpg" alt="2021 Porsche 911 Carrera 4S · Առջևից" /></div>
                    <div className="car-slide cslide-2"><img src="/images/car-side.jpg" alt="2021 Porsche 911 Carrera 4S · Կողքից" /></div>
                    <div className="car-slide cslide-3"><img src="/images/car-interior.jpg" alt="2021 Porsche 911 Carrera 4S · Սրահ և ղեկ" /></div>
                    <div className="car-slide cslide-4"><img src="/images/car-rear.jpg" alt="2021 Porsche 911 Carrera 4S · Հետևից" /></div>

                    <span className="vehicle-img-badge"><span>{t("det_lot_word")}</span> #405 · Դահլիճ A</span>
                    <div className="vehicle-copart-tags">
                      <span className="copart-tag"><svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> Run &amp; Drive</span>
                      <span className="copart-tag blue">Clean Title</span>
                      <span className="copart-tag">Բանալիներ՝ Առկա են</span>
                    </div>
                  </div>

                  <div className="vehicle-thumbs-row">
                    <label htmlFor="cview-1" className="vehicle-thumb-box cthumb-1" title="Տեսք 1 · Առջևից">
                      <img src="/images/car-front.jpg" alt="Առջևից" />
                    </label>
                    <label htmlFor="cview-2" className="vehicle-thumb-box cthumb-2" title="Տեսք 2 · Կողքից">
                      <img src="/images/car-side.jpg" alt="Կողքից" />
                    </label>
                    <label htmlFor="cview-3" className="vehicle-thumb-box cthumb-3" title="Տեսք 3 · Սրահ և ղեկ">
                      <img src="/images/car-interior.jpg" alt="Սրահ և ղեկ" />
                    </label>
                    <label htmlFor="cview-4" className="vehicle-thumb-box cthumb-4" title="Տեսք 4 · Հետևից">
                      <img src="/images/car-rear.jpg" alt="Հետևից" />
                    </label>
                  </div>
                </div>

                <div className="vehicle-title-head">
                  <h1 className="vehicle-headline">2021 Porsche 911 Carrera 4S</h1>
                  <span className="vehicle-lot-pill">VIN: WP0AB2A99MS12****</span>
                </div>

                <div className="copart-specs-grid">
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_odometer")}</span>
                    <span className="spec-val">18,420 mi (29,644 կմ) · Actual</span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_engine")}</span>
                    <span className="spec-val">3.0L Twin-Turbo Flat-6 (443 hp)</span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_trans")}</span>
                    <span className="spec-val">8-աստիճան PDK (Automatic)</span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_drive")}</span>
                    <span className="spec-val">AWD (Լիաքարշակ)</span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_damage")}</span>
                    <span className="spec-val">Առանց վթարի (Թեթև քերծվածքներ)</span>
                  </div>
                  <div className="copart-spec-cell">
                    <span className="spec-label">{t("bid_retail")}</span>
                    <span className="spec-val">$115,000</span>
                  </div>
                </div>

                <div className="live-stream-box">
                  <div className="live-stream-header">
                    <span className="stream-title"><span className="stream-title-dot"></span> Հայտերի ուղիղ հոսք (Live Activity)</span>
                    <small>{t("bid_instant_update")}</small>
                  </div>
                  <div className="live-stream-list">
                    <div className="stream-row leader">
                      <span className="stream-buyer">Մասնակից #8412 (Երևան, AM) <span className="stream-badge">{t("bid_leader")}</span></span>
                      <span className="stream-amount">$48,500</span>
                    </div>
                    <div className="stream-row">
                      <span className="stream-buyer">Մասնակից #2104 (Գլենդել, US) · 4 վրկ առաջ</span>
                      <span className="stream-amount">$48,000</span>
                    </div>
                    <div className="stream-row">
                      <span className="stream-buyer">Մասնակից #1198 (Գյումրի, AM) · 18 վրկ առաջ</span>
                      <span className="stream-amount">$47,500</span>
                    </div>
                    <div className="stream-row">
                      <span className="stream-buyer">Մասնակից #552 (Թբիլիսի, GE) · 35 վրկ առաջ</span>
                      <span className="stream-amount">$47,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="arena-right-col">

                <div className="copart-hammer-card">
                  <div className="hammer-label"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg> <span>{t("bid_hammer_last")}</span></div>
                  <div className="hammer-clock">00:14</div>
                  <div className="hammer-bar-wrap">
                    <div className="hammer-bar-fill"></div>
                  </div>
                  <div className="hammer-callout">{t("bid_going_once")}</div>
                </div>

                <div className="live-price-box">
                  <div className="price-row-top">
                    <div>
                      <span className="current-bid-lbl">{t("bid_current_high")}</span>
                      <div className="current-bid-val">$48,500</div>
                    </div>
                    <span className="current-leader-tag"><svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> Մասնակից #8412</span>
                  </div>
                  <div className="next-bid-row">
                    <span>{t("bid_next_step")}</span>
                    <span className="next-bid-val">$49,000</span>
                  </div>
                </div>

                <form action="/my-participations" method="get">

                  <button type="submit" className="copart-bid-btn">
                    <span>ԱՌԱՋԱՐԿԵԼ $49,000</span>
                    <span className="copart-btn-sub">{t("bid_one_click")}</span>
                  </button>

                  <div className="quick-bid-title">{t("bid_quick_steps")}</div>
                  <div className="quick-bid-grid">
                    <button type="submit" name="quick_bid" value="49000" className="quick-bid-btn">+$500<br /><small>$49,000</small></button>
                    <button type="submit" name="quick_bid" value="49500" className="quick-bid-btn">+$1,000<br /><small>$49,500</small></button>
                    <button type="submit" name="quick_bid" value="51000" className="quick-bid-btn">+$2,500<br /><small>$51,000</small></button>
                    <button type="submit" name="quick_bid" value="53500" className="quick-bid-btn">+$5,000<br /><small>$53,500</small></button>
                  </div>

                  <div className="proxy-bid-box">
                    <div className="proxy-bid-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg> <span>{t("chat_auto_badge")}</span> առաջարկ (Monster Max Bid)</div>
                    <p className="proxy-bid-desc">{t("bid_auto_desc")}</p>
                    <div className="proxy-input-group">
                      <input type="number" className="form-input" defaultValue="52000" min="49000" step="500" />
                      <button type="submit" className="btn sm">{t("bid_set_btn")}</button>
                    </div>
                  </div>

                  <div className="copart-fee-card">
                    <div className="copart-fee-row">
                      <span>{t("bid_offered_price")}</span>
                      <span>$49,000</span>
                    </div>
                    <div className="copart-fee-row">
                      <span>{t("bid_platform_fee")}</span>
                      <span>$1,960</span>
                    </div>
                    <div className="copart-fee-row">
                      <span>{t("bid_deposit_ins")}</span>
                      <span>$250</span>
                    </div>
                    <div className="copart-fee-row total">
                      <span>{t("bid_total_due")}</span>
                      <span className="copart-fee-total-num">$51,210</span>
                    </div>
                  </div>

                  <div className="copart-trust-badge">
                    <span><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg> Gavel Verified Live Platform · 100% ֆինանսական երաշխիք</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>


    </>
  );
}
