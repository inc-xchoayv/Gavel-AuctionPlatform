import "../styles/my-lots.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function MyLots() {
  const { t } = useI18n();
  usePageTitle("title_my_lots");

  return (
    <>
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
              <Link to="/add-lot" className="btn pri">{t("ml_add_btn")}</Link>
            </div>

            <div className="seller-kpi-grid">
              <div className="card kpi-card-content">
                <small className="seller-stat-lbl">{t("ml_stat_total")}</small>
                <div className="seller-stat-num">5</div>
              </div>
              <div className="card kpi-card-content live-border">
                <small className="seller-stat-lbl">{t("chip_live_air")}</small>
                <div className="seller-stat-num live">3</div>
              </div>
              <div className="card kpi-card-content rv-border">
                <small className="seller-stat-lbl">{t("chip_review")}</small>
                <div className="seller-stat-num rv">1</div>
              </div>
              <div className="card kpi-card-content sales-border">
                <small className="seller-stat-lbl">{t("ml_stat_sales")}</small>
                <div className="seller-stat-num sales">$18,450</div>
              </div>
              <div className="card kpi-card-content remind-border">
                <small className="seller-stat-lbl">{t("ml_stat_reminders")}</small>
                <div className="seller-stat-num remind">3</div>
              </div>
            </div>

            <input type="radio" name="lot-status-filter" id="lsfilter-all" className="lot-status-filter-radio" defaultChecked />
            <input type="radio" name="lot-status-filter" id="lsfilter-live" className="lot-status-filter-radio" />
            <input type="radio" name="lot-status-filter" id="lsfilter-review" className="lot-status-filter-radio" />
            <input type="radio" name="lot-status-filter" id="lsfilter-ended" className="lot-status-filter-radio" />
            <input type="radio" name="lot-status-filter" id="lsfilter-remind" className="lot-status-filter-radio" />

            <div className="seller-tabs-bar">
              <label htmlFor="lsfilter-all" className="btn sm lsbtn-all">{t("flt_all")}</label>
              <label htmlFor="lsfilter-live" className="btn sm lsbtn-live">{t("chip_live")}</label>
              <label htmlFor="lsfilter-review" className="btn sm lsbtn-review">{t("chip_review")}</label>
              <label htmlFor="lsfilter-ended" className="btn sm lsbtn-ended">{t("ml_tab_sold")}</label>
              <label htmlFor="lsfilter-remind" className="btn sm lsbtn-remind">{t("ml_tab_reminders")}</label>
            </div>

            <div className="my-lots-list">

              <div className="lot-manage-row lot-remind">
                <div className="lot-manage-thumb"><img src="/images/car-front.jpg" alt="2021 Porsche 911 Carrera 4S" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip lead">{t("ml_rem_15m")}</span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #405 · Live Arena</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/place-bid">2021 Porsche 911 Carrera 4S</Link></h3>
                  <p className="lot-manage-desc">{t("ml_rem_sms")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("lot_current_price")}</small>
                    <span className="lot-manage-val">$48,500</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                    <span className="lot-manage-val sm">38</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("lot_time_left")}</small>
                    <span className="tm hot">00:14</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/place-bid" className="btn pri sm">{t("ml_btn_participate")}</Link>
                  <label className="remind-del-btn" title={t("ml_cancel_rem_title")}>
                    <input type="checkbox" className="remind-del-cb" />
                    <span className="btn sm bad"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> <span>{t("ml_btn_cancel")}</span></span>
                    <span className="chip btn-del-done">{t("ml_chip_canceled")}</span>
                  </label>
                </div>
              </div>

              <div className="lot-manage-row lot-remind">
                <div className="lot-manage-thumb t1"><img src="/images/lot-watch.jpg" alt="Արծաթե գրպանի ժամացույց" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip lead">{t("ml_rem_1h")}</span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #128 · Շվեյցարիա</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/auction-detail">Արծաթե գրպանի ժամացույց</Link></h3>
                  <p className="lot-manage-desc">{t("ml_rem_watch_mail")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("lot_current_price")}</small>
                    <span className="lot-manage-val">$1,250</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                    <span className="lot-manage-val sm">14</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("lot_time_left")}</small>
                    <span className="tm">02:41:08</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/auction-detail" className="btn pri sm">{t("det_place_bid_btn")}</Link>
                  <label className="remind-del-btn" title={t("ml_cancel_rem_title")}>
                    <input type="checkbox" className="remind-del-cb" />
                    <span className="btn sm bad"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> <span>{t("ml_btn_cancel")}</span></span>
                    <span className="chip btn-del-done">{t("ml_chip_canceled")}</span>
                  </label>
                </div>
              </div>

              <div className="lot-manage-row lot-remind">
                <div className="lot-manage-thumb t4"><img src="/images/lot-samovar.jpg" alt="Արծաթապատ սամովար" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip lead">{t("ml_rem_start")}</span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #219 · Անտիկվարիատ</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/auction-detail">19-րդ դարի արծաթապատ սամովար</Link></h3>
                  <p className="lot-manage-desc">{t("ml_rem_samovar_mail")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_start_price")}</small>
                    <span className="lot-manage-val">$800</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("flt_status")}</small>
                    <span className="lot-manage-lbl">{t("chip_upcoming")}</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("lot_time_left")}</small>
                    <span className="tm">{t("time_1d_4h")}</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/auction-detail" className="btn pri sm">{t("btn_view")}</Link>
                  <label className="remind-del-btn" title={t("ml_cancel_rem_title")}>
                    <input type="checkbox" className="remind-del-cb" />
                    <span className="btn sm bad"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> <span>{t("ml_btn_cancel")}</span></span>
                    <span className="chip btn-del-done">{t("ml_chip_canceled")}</span>
                  </label>
                </div>
              </div>

              <div className="lot-manage-row lot-live">
                <div className="lot-manage-thumb t1"><img src="/images/lot-watch.jpg" alt="Հին ժամացույց" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip live">{t("chip_live")}</span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #128</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/auction-detail">Արծաթե գրպանի ժամացույց</Link></h3>
                  <p className="lot-manage-desc">{t("ml_meta_watch")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("lot_current_price")}</small>
                    <span className="lot-manage-val">$1,250</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                    <span className="lot-manage-val sm">14</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("lot_time_left")}</small>
                    <span className="tm">02:41:08</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/auction-detail" className="btn sm">{t("btn_view")}</Link>
                  <Link to="/add-lot" className="btn sm">{t("ml_btn_edit")}</Link>
                </div>
              </div>

              <div className="lot-manage-row lot-live">
                <div className="lot-manage-thumb t5"><img src="/images/lot-desk.jpg" alt="Փայտե գրասեղան" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip live">{t("chip_live")}</span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #168</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/auction-detail">Փայտե գրասեղան</Link></h3>
                  <p className="lot-manage-desc">{t("ml_meta_desk")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("lot_current_price")}</small>
                    <span className="lot-manage-val">$650</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                    <span className="lot-manage-val sm">7</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("lot_time_left")}</small>
                    <span className="tm">12:30:00</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/auction-detail" className="btn sm">{t("btn_view")}</Link>
                  <Link to="/add-lot" className="btn sm">{t("ml_btn_edit")}</Link>
                </div>
              </div>

              <div className="lot-manage-row lot-live">
                <div className="lot-manage-thumb t6"><img src="/images/lot-ring.jpg" alt="Ոսկե մատանի" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip live">{t("chip_live")}</span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #189</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/auction-detail">Ոսկե մատանի</Link></h3>
                  <p className="lot-manage-desc">{t("ml_meta_ring")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("lot_current_price")}</small>
                    <span className="lot-manage-val">$1,750</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                    <span className="lot-manage-val sm">18</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("lot_time_left")}</small>
                    <span className="tm">00:55:00</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/auction-detail" className="btn sm">{t("btn_view")}</Link>
                  <Link to="/add-lot" className="btn sm">{t("ml_btn_edit")}</Link>
                </div>
              </div>

              <div className="lot-manage-row lot-review">
                <div className="lot-manage-thumb t4"><img src="/images/lot-samovar.jpg" alt="Հնաոճ բրոնզե արձանիկ" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip rv">{t("chip_review")}</span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #220</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/auction-detail">Հնաոճ բրոնզե արձանիկ</Link></h3>
                  <p className="lot-manage-desc">{t("ml_meta_bronze")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_start_price")}</small>
                    <span className="lot-manage-val">$950</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                    <span className="lot-manage-val sm">0</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("flt_status")}</small>
                    <span className="lot-manage-lbl">{t("ml_wait_admin")}</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/auction-detail" className="btn sm">{t("btn_view")}</Link>
                  <Link to="/add-lot" className="btn sm">{t("ml_btn_edit")}</Link>
                </div>
              </div>

              <div className="lot-manage-row lot-ended">
                <div className="lot-manage-thumb t2"><img src="/images/lot-carpet.jpg" alt="Ղազախ ձեռագործ գորգ" /></div>
                <div className="lot-manage-info">
                  <div className="lot-manage-status-row">
                    <span className="chip ok"><svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> <span>{t("ml_sold")}</span></span>
                    <small className="lot-manage-id-lbl"><span>{t("det_lot_word")}</span> #094</small>
                  </div>
                  <h3 className="lot-manage-title"><Link to="/auction-detail">Ղազախ ձեռագործ գորգ</Link></h3>
                  <p className="lot-manage-desc">{t("ml_meta_carpet")}</p>
                </div>
                <div className="lot-manage-data">
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_final_price")}</small>
                    <span className="lot-manage-val val-green">$2,800</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("tbl_bids")}</small>
                    <span className="lot-manage-val sm">23</span>
                  </div>
                  <div>
                    <small className="lot-manage-lbl">{t("flt_status")}</small>
                    <span className="lot-manage-lbl">{t("ml_paid")}</span>
                  </div>
                </div>
                <div className="lot-manage-actions">
                  <Link to="/auction-detail" className="btn sm">{t("ml_archive")}</Link>
                </div>
              </div>
            </div>
          </div>
        </main>


    </>
  );
}
