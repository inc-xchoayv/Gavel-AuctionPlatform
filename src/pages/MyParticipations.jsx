import "../styles/my-participations.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function MyParticipations() {
  const { t } = useI18n();
  usePageTitle("title_participations");

  return (
    <>
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
              <Link to="/auctions" className="btn pri sm">{t("mp_find_btn")}</Link>
            </div>

            <div className="part-kpi-grid">
              <div className="kpi-card">
                <small className="part-lot-lbl">{t("mp_stat_total")}</small>
                <div className="kpi-num">3</div>
              </div>
              <div className="kpi-card lead-accent">
                <small className="part-lot-lbl">{t("mp_stat_lead")}</small>
                <div className="kpi-num lead">2</div>
              </div>
              <div className="kpi-card out-accent">
                <small className="part-lot-lbl">{t("mp_stat_outbid")}</small>
                <div className="kpi-num out">1</div>
              </div>
              <div className="kpi-card">
                <small className="part-lot-lbl">{t("mp_stat_won")}</small>
                <div className="kpi-num won">1</div>
              </div>
            </div>

            <input type="radio" name="part-filter" id="pfilter-all" className="part-filter-radio" defaultChecked />
            <input type="radio" name="part-filter" id="pfilter-lead" className="part-filter-radio" />
            <input type="radio" name="part-filter" id="pfilter-out" className="part-filter-radio" />

            <div className="part-tabs-bar">
              <label htmlFor="pfilter-all" className="btn sm pbtn-all">{t("flt_all")}</label>
              <label htmlFor="pfilter-lead" className="btn sm pbtn-lead">{t("mp_tab_lead")}</label>
              <label htmlFor="pfilter-out" className="btn sm pbtn-out">{t("mp_tab_outbid")}</label>
            </div>

            <div className="my-parts-list">

              <div className="part-card part-lead">
                <div className="part-thumb"><img src="/images/car-front.jpg" alt="2021 Porsche 911 Carrera 4S" /></div>
                <div className="part-info">
                  <div className="part-status-badge-row">
                    <span className="chip lead"><svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> <span>{t("mp_badge_lead")}</span></span>
                    <small className="part-lot-lbl"><span>{t("det_lot_word")}</span> #405 · Live</small>
                  </div>
                  <h3 className="part-card-title"><Link to="/auction-detail">2021 Porsche 911 Carrera 4S</Link></h3>
                  <p className="part-card-desc">3.0L Twin-Turbo (443 hp), 18,420 mi, Run &amp; Drive Verified</p>
                </div>
                <div className="part-meta">
                  <div className="meta-col">
                    <small>{t("mp_your_bid")}</small>
                    <span>$49,000</span>
                  </div>
                  <div className="meta-col">
                    <small>{t("lot_current_price")}</small>
                    <span className="price-highlight">$49,000</span>
                  </div>
                  <div className="meta-col">
                    <small>{t("lot_time_left")}</small>
                    <span className="tm hot">00:14 <span>{t("unit_sec")}</span></span>
                  </div>
                </div>
                <div className="part-action-btns">
                  <Link to="/place-bid" className="btn sm pri">{t("mp_join")}</Link>
                  <label htmlFor="chat-widget-toggle" className="btn sm sec chat-open-label" title={t("mp_msg_seller_title")}><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> <span>{t("mp_msg_seller")}</span></label>
                </div>
              </div>

              <div className="part-card part-lead">
                <div className="part-thumb t2"><img src="/images/lot-carpet.jpg" alt="Ձեռագործ գորգ" /></div>
                <div className="part-info">
                  <div className="part-status-badge-row">
                    <span className="chip lead"><svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> <span>{t("mp_badge_lead")}</span></span>
                    <small className="part-lot-lbl"><span>{t("det_lot_word")}</span> #211</small>
                  </div>
                  <h3 className="part-card-title"><Link to="/auction-detail">Ձեռագործ գորգ</Link></h3>
                  <p className="part-card-desc">{t("mp_meta_carpet")}</p>
                </div>
                <div className="part-meta">
                  <div className="meta-col">
                    <small>{t("mp_your_bid")}</small>
                    <span>$900</span>
                  </div>
                  <div className="meta-col">
                    <small>{t("lot_current_price")}</small>
                    <span className="price-highlight">$900</span>
                  </div>
                  <div className="meta-col">
                    <small>{t("lot_time_left")}</small>
                    <span className="tm hot">00:08:30</span>
                  </div>
                </div>
                <div className="part-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("btn_view")}</Link>
                </div>
              </div>

              <div className="part-card part-out">
                <div className="part-thumb t3"><img src="/images/lot-samovar.jpg" alt="Արծաթե սամովար" /></div>
                <div className="part-info">
                  <div className="part-status-badge-row">
                    <span className="chip out"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> <span>{t("mp_badge_outbid")}</span></span>
                    <small className="part-lot-lbl"><span>{t("det_lot_word")}</span> #94</small>
                  </div>
                  <h3 className="part-card-title"><Link to="/auction-detail">Արծաթե սամովար</Link></h3>
                  <p className="part-card-desc">{t("mp_meta_samovar")}</p>
                </div>
                <div className="part-meta">
                  <div className="meta-col">
                    <small>{t("mp_your_bid")}</small>
                    <span>$450</span>
                  </div>
                  <div className="meta-col">
                    <small>{t("lot_current_price")}</small>
                    <span className="price-highlight">$480</span>
                  </div>
                  <div className="meta-col">
                    <small>{t("lot_time_left")}</small>
                    <span className="tm">05:12:40</span>
                  </div>
                </div>
                <div className="part-action-btns">
                  <Link to="/place-bid" className="btn pri sm">{t("mp_raise_bid")}</Link>
                  <Link to="/auction-detail" className="btn sm">{t("btn_view")}</Link>
                </div>
              </div>
            </div>
          </div>
        </main>


    </>
  );
}
