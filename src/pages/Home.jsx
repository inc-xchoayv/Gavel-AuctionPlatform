import "../styles/index.css";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";
import CategoryGrid from "../components/CategoryGrid";
import LotCard from "../components/LotCard";

export default function Home() {
  const { t } = useI18n();
  usePageTitle("title_index");
  const { lots } = useLots();
  const navigate = useNavigate();

  const endingSoonLots = lots
    .filter((l) => l.status === "active")
    .slice(0, 3);

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

                    <div
                      className="hero-card recommended-card rcard-1 clickable-lot-card"
                      onClick={() => navigate("/auction-detail?id=405")}
                    >
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
                        <Link to="/auction-detail?id=405" className="btn pri full" onClick={(e) => e.stopPropagation()}>{t("rec_join_btn")}</Link>
                      </div>
                    </div>

                    <div
                      className="hero-card recommended-card rcard-2 clickable-lot-card"
                      onClick={() => navigate("/auction-detail?id=128")}
                    >
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
                        <Link to="/auction-detail?id=128" className="btn pri full" onClick={(e) => e.stopPropagation()}>{t("rec_join_btn")}</Link>
                      </div>
                    </div>

                    <div
                      className="hero-card recommended-card rcard-3 clickable-lot-card"
                      onClick={() => navigate("/auction-detail?id=219")}
                    >
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
                        <Link to="/auction-detail?id=219" className="btn pri full" onClick={(e) => e.stopPropagation()}>{t("rec_join_btn")}</Link>
                      </div>
                    </div>

                    <div
                      className="hero-card recommended-card rcard-4 clickable-lot-card"
                      onClick={() => navigate("/auction-detail?id=315")}
                    >
                      <div className="hero-card-img-wrap">
                        <img src="/images/lot-carpet.jpg" alt="Ղազախ ձեռագործ մետաքսե գորգ" className="hero-card-img" />
                        <span className="hero-card-badge"><span className="live-dot-pulse"></span><span>{t("rec_badge_museum")}</span></span>
                      </div>
                      <h3>Ղազախ ձեռագործ մետաքսե գորգ</h3>
                      <p className="hero-card-meta"><span>{t("det_lot_word")}</span> #315 · <span>{t("idx_meta_carpet")}</span></p>
                      <div className="hero-card-price">$3,100</div>
                      <div className="hero-timer-box">
                        <span className="hero-timer-label">{t("rec_ends_in")}</span>
                        <span className="tm hero-timer-val">05:40:10</span>
                      </div>
                      <div className="hero-card-actions">
                        <Link to="/auction-detail?id=315" className="btn pri full" onClick={(e) => e.stopPropagation()}>{t("rec_join_btn")}</Link>
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
              {endingSoonLots.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
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
