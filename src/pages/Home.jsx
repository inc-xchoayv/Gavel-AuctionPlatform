import "../styles/index.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";
import CategoryGrid from "../components/CategoryGrid";

export default function Home() {
  const { t } = useI18n();
  usePageTitle("title_index");

  return (
    <>

        <section className="hero">
          <div className="w">
            <div className="hero-content">
              <div>
                <h1>{t("hero_title")}</h1>
                <p className="hero-desc">{t("hero_desc")}</p>
                <div className="hero-actions">
                  <Link to="/auctions" className="btn pri lg">{t("hero_btn_explore")}</Link>
                  <Link to="/add-lot" className="btn sec lg hero-sell-btn">{t("hero_btn_sell")}</Link>
                </div>
              </div>
              <div>

                <div className="recommended-carousel">
                  <div className="recommended-header">
                    <div className="rec-title-wrap">
                      <span className="rec-live-dot"></span>
                      <span className="rec-title">{t("rec_title")}</span>
                    </div>
                  </div>

                  <div className="recommended-slides-wrap">

                    <div className="hero-card recommended-card rcard-1">
                      <div className="hero-card-img-wrap">
                        <img src="/images/car-front.jpg" alt="2021 Porsche 911 Carrera 4S" className="hero-card-img" />
                        <span className="hero-card-badge"><span className="live-dot-pulse"></span><span>{t("rec_badge_top")}</span></span>
                      </div>
                      <h3>2021 Porsche 911 Carrera 4S</h3>
                      <p className="hero-card-meta"><span>{t("det_lot_word")}</span> #405 · 3.0L Twin-Turbo (443 hp) · 18,420 mi</p>
                      <div className="hero-card-price">$48,500</div>
                      <div className="hero-timer-box">
                        <span className="hero-timer-label">{t("rec_ends_in")}</span>
                        <span className="tm hot hero-timer-val">00:14</span>
                      </div>
                      <div className="hero-card-actions">
                        <Link to="/place-bid" className="btn pri full">{t("rec_join_btn")}</Link>
                        <Link to="/place-bid" className="btn sec">{t("lot_bid_btn")}</Link>
                      </div>
                    </div>

                    <div className="hero-card recommended-card rcard-2">
                      <div className="hero-card-img-wrap">
                        <img src="/images/lot-watch.jpg" alt="Հին շվեյցարական ժամացույց" className="hero-card-img" />
                        <span className="hero-card-badge"><span className="live-dot-pulse"></span><span>{t("rec_badge_rare")}</span></span>
                      </div>
                      <h3>Հին շվեյցարական ժամացույց</h3>
                      <p className="hero-card-meta"><span>{t("det_lot_word")}</span> #128 · <span>{t("idx_meta_watch")}</span></p>
                      <div className="hero-card-price">$1,250</div>
                      <div className="hero-timer-box">
                        <span className="hero-timer-label">{t("rec_ends_in")}</span>
                        <span className="tm hero-timer-val">02:41:08</span>
                      </div>
                      <div className="hero-card-actions">
                        <Link to="/auction-detail" className="btn pri full">{t("rec_join_btn")}</Link>
                        <Link to="/place-bid" className="btn sec">{t("lot_bid_btn")}</Link>
                      </div>
                    </div>

                    <div className="hero-card recommended-card rcard-3">
                      <div className="hero-card-img-wrap">
                        <img src="/images/lot-samovar.jpg" alt="19-րդ դարի արծաթապատ սամովար" className="hero-card-img" />
                        <span className="hero-card-badge"><span className="live-dot-pulse"></span><span>{t("rec_badge_antique")}</span></span>
                      </div>
                      <h3>19-րդ դարի արծաթապատ սամովար</h3>
                      <p className="hero-card-meta"><span>{t("det_lot_word")}</span> #219 · <span>{t("idx_meta_samovar")}</span></p>
                      <div className="hero-card-price">$800</div>
                      <div className="hero-timer-box">
                        <span className="hero-timer-label">{t("rec_starts_in")}</span>
                        <span className="tm hero-timer-val">{t("time_1d_4h")}</span>
                      </div>
                      <div className="hero-card-actions">
                        <Link to="/auction-detail" className="btn pri full">{t("rec_join_btn")}</Link>
                        <Link to="/auction-detail" className="btn sec">{t("lot_bid_btn")}</Link>
                      </div>
                    </div>

                    <div className="hero-card recommended-card rcard-4">
                      <div className="hero-card-img-wrap">
                        <img src="/images/lot-carpet.jpg" alt="Ղազախ ձեռագործ մետաքսե գորգ" className="hero-card-img" />
                        <span className="hero-card-badge"><span className="live-dot-pulse"></span><span>{t("rec_badge_museum")}</span></span>
                      </div>
                      <h3>Ղազախ ձեռագործ մետաքսե գորգ</h3>
                      <p className="hero-card-meta"><span>{t("det_lot_word")}</span> #104 · <span>{t("idx_meta_carpet")}</span></p>
                      <div className="hero-card-price">$3,400</div>
                      <div className="hero-timer-box">
                        <span className="hero-timer-label">{t("rec_ends_in")}</span>
                        <span className="tm hero-timer-val">08:15:30</span>
                      </div>
                      <div className="hero-card-actions">
                        <Link to="/auction-detail" className="btn pri full">{t("rec_join_btn")}</Link>
                        <Link to="/auction-detail" className="btn sec">{t("lot_bid_btn")}</Link>
                      </div>
                    </div>
                  </div>

                  <div className="recommended-dots">
                    <span className="rec-dot rdot-1"></span>
                    <span className="rec-dot rdot-2"></span>
                    <span className="rec-dot rdot-3"></span>
                    <span className="rec-dot rdot-4"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main>
          <div className="w">

            <div className="section-head">
              <div>
                <h2>{t("sec_categories_title")}</h2>
                <p>{t("sec_categories_desc")}</p>
              </div>
              <Link to="/auctions" className="btn sm">{t("sec_categories_all")}</Link>
            </div>

            <CategoryGrid />

            <div className="section-head">
              <div>
                <h2>{t("sec_ending_title")}</h2>
                <p>{t("sec_ending_desc")}</p>
              </div>
              <Link to="/auctions" className="btn sm">{t("sec_view_all")}</Link>
            </div>

            <div className="grid grid-3">

              <article className="card lot">
                <div className="im"><img src="/images/car-front.jpg" alt="2021 Porsche 911 Carrera 4S" />
                  <span className="chip live"><span className="live-dot-pulse"></span>Live</span>
                  <label className="remind-btn">
                    <input type="checkbox" className="remind-cb" defaultChecked />
                    <span className="remind-icon">
                      <svg className="remind-off" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 15"></polyline></svg>
                      <svg className="remind-on" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                  </label>
                </div>
                <div className="card-body">
                  <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #405 · <span>{t("cat_cars")}</span> · Run &amp; Drive</small>
                  <h3 className="lot-card-title"><Link to="/auction-detail">2021 Porsche 911 Carrera 4S</Link></h3>
                  <div className="lot-card-pricing">
                    <div>
                      <small className="lot-card-lbl">{t("lot_current_bid")}</small>
                      <span className="price">$48,500</span>
                    </div>
                    <div className="lot-card-timing">
                      <small className="lot-card-lbl">{t("lot_hammer_countdown")}</small>
                      <span className="tm hot">00:14 <span>{t("unit_sec")}</span></span>
                    </div>
                  </div>
                  <div className="lot-card-btns">
                    <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                    <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                  </div>
                </div>
              </article>

              <article className="card lot">
                <div className="im t2"><img src="/images/lot-carpet.jpg" alt="Ձեռագործ գորգ" />
                  <span className="chip live">{t("chip_live")}</span>
                  <label className="remind-btn">
                    <input type="checkbox" className="remind-cb" />
                    <span className="remind-icon">
                      <svg className="remind-off" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 15"></polyline></svg>
                      <svg className="remind-on" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                  </label>
                </div>
                <div className="card-body">
                  <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #211 · <span>{t("cat_carpets")}</span></small>
                  <h3 className="lot-card-title"><Link to="/auction-detail">Ձեռագործ գորգ</Link></h3>
                  <div className="lot-card-pricing">
                    <div>
                      <small className="lot-card-lbl">{t("lot_current_price")}</small>
                      <span className="price">$900</span>
                    </div>
                    <div className="lot-card-timing">
                      <small className="lot-card-lbl">{t("lot_time_left")}</small>
                      <span className="tm hot">00:08:30</span>
                    </div>
                  </div>
                  <div className="lot-card-btns">
                    <Link to="/auction-detail" className="btn pri sm full">{t("lot_details_btn")}</Link>
                    <Link to="/place-bid" className="btn sec sm">{t("lot_bid_action")}</Link>
                  </div>
                </div>
              </article>

              <article className="card lot">
                <div className="im t3"><img src="/images/lot-samovar.jpg" alt="Արծաթե սամովար" />
                  <span className="chip live">{t("chip_live")}</span>
                  <label className="remind-btn">
                    <input type="checkbox" className="remind-cb" defaultChecked />
                    <span className="remind-icon">
                      <svg className="remind-off" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 15"></polyline></svg>
                      <svg className="remind-on" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                  </label>
                </div>
                <div className="card-body">
                  <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #94 · <span>{t("cat_collectibles")}</span></small>
                  <h3 className="lot-card-title"><Link to="/auction-detail">Արծաթե սամովար</Link></h3>
                  <div className="lot-card-pricing">
                    <div>
                      <small className="lot-card-lbl">{t("lot_current_price")}</small>
                      <span className="price">$480</span>
                    </div>
                    <div className="lot-card-timing">
                      <small className="lot-card-lbl">{t("lot_time_left")}</small>
                      <span className="tm">05:12:40</span>
                    </div>
                  </div>
                  <div className="lot-card-btns">
                    <Link to="/auction-detail" className="btn pri sm full">{t("lot_details_btn")}</Link>
                    <Link to="/place-bid" className="btn sec sm">{t("lot_bid_action")}</Link>
                  </div>
                </div>
              </article>
            </div>

          </div>

          <section className="steps-section">
            <div className="w">
              <div className="steps-header">
                <h2>{t("how_title")}</h2>
                <p>{t("how_desc")}</p>
              </div>
              <div className="grid grid-4">
                <div className="step-card">
                  <div className="step-num">1</div>
                  <h3>{t("how_s1_t")}</h3>
                  <p>{t("how_s1_d")}</p>
                </div>
                <div className="step-card">
                  <div className="step-num">2</div>
                  <h3>{t("how_s2_t")}</h3>
                  <p>{t("how_s2_d")}</p>
                </div>
                <div className="step-card">
                  <div className="step-num">3</div>
                  <h3>{t("how_s3_t")}</h3>
                  <p>{t("how_s3_d")}</p>
                </div>
                <div className="step-card">
                  <div className="step-num">4</div>
                  <h3>{t("how_s4_t")}</h3>
                  <p>{t("how_s4_d")}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="w">

            <div className="banner-cta">
              <div>
                <h2>{t("cta_title")}</h2>
                <p>{t("cta_desc")}</p>
              </div>
              <Link to="/add-lot" className="btn lg banner-cta-btn">{t("cta_btn")}</Link>
            </div>
          </div>
        </main>


    </>
  );
}
