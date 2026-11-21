import "../styles/admin-reports.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AdminReports() {
  const { t } = useI18n();
  usePageTitle("title_admin_reports");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <Link to="/admin-dashboard">{t("adm_bc")}</Link>
              <span>›</span>
              <span>{t("footer_reports")}</span>
            </div>

            <div className="page-title-row">
              <div>
                <h1>{t("adm_rep_title")}</h1>
                <p>{t("adm_rep_desc")}</p>
              </div>
              <Link to="/admin-reports" className="btn pri sm"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> <span>{t("adm_export_csv")}</span></Link>
            </div>

            <div className="admin-subnav">
              <Link to="/admin-dashboard">{t("adm_nav_dash")}</Link>
              <Link to="/admin-auctions">{t("adm_nav_auctions")}</Link>
              <Link to="/admin-users">{t("adm_nav_users")}</Link>
              <Link to="/admin-reports" className="active">{t("footer_reports")}</Link>
            </div>

            <div className="grid grid-2">

              <div className="report-card">
                <h3 className="report-card-title">{t("adm_sales_by_cat")}</h3>
                <p className="report-card-desc">{t("adm_sales_by_cat_desc")}</p>

                <div className="cat-bar-row">
                  <div className="cat-bar-header">
                    <span><b>{t("cat_art")}</b> (գեղանկարչություն)</span>
                    <span>$38,400 (45%)</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-art"></div></div>
                </div>

                <div className="cat-bar-row">
                  <div className="cat-bar-header">
                    <span><b>{t("cat_watches")}</b></span>
                    <span>$21,200 (25%)</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-watch"></div></div>
                </div>

                <div className="cat-bar-row">
                  <div className="cat-bar-header">
                    <span><b>{t("adm_cat_jewel_full")}</b></span>
                    <span>$12,800 (15%)</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-jewel"></div></div>
                </div>

                <div className="cat-bar-row">
                  <div className="cat-bar-header">
                    <span><b>{t("adm_cat_rugs_full")}</b></span>
                    <span>$8,500 (10%)</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-rug"></div></div>
                </div>

                <div className="cat-bar-row">
                  <div className="cat-bar-header">
                    <span><b>{t("adm_cat_other")}</b></span>
                    <span>$4,250 (5%)</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill fill-other"></div></div>
                </div>
              </div>

              <div className="report-card">
                <h3 className="report-card-title">{t("adm_monthly_summary")}</h3>
                <p className="report-card-desc">{t("adm_monthly_desc")}</p>

                <div className="monthly-stats-grid">
                  <div className="monthly-stat-box">
                    <small className="kpi-stat-lbl">{t("adm_succ_auctions")}</small>
                    <div className="monthly-stat-num ok">94.2%</div>
                  </div>
                  <div className="monthly-stat-box">
                    <small className="kpi-stat-lbl">{t("adm_avg_bids")}</small>
                    <div className="monthly-stat-num ink">11.4 <span>{t("unit_bids")}</span></div>
                  </div>
                  <div className="monthly-stat-box">
                    <small className="kpi-stat-lbl">{t("adm_comm_5")}</small>
                    <div className="monthly-stat-num b">$4,212</div>
                  </div>
                  <div className="monthly-stat-box">
                    <small className="kpi-stat-lbl">{t("adm_new_users")}</small>
                    <div className="monthly-stat-num ink">+18</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-card">
              <div className="table-card-head">
                <h3>{t("adm_top_lots")}</h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("tbl_lot_name")}</th>
                    <th>{t("det_category")}</th>
                    <th>{t("tbl_start_price")}</th>
                    <th>{t("tbl_final_price")}</th>
                    <th>{t("tbl_growth")}</th>
                    <th>{t("tbl_winner")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Յուղաներկ նկար «Աշունը Լոռիում»</b></td>
                    <td>{t("cat_art")}</td>
                    <td>$1,500</td>
                    <td><b className="report-final-price">$2,300</b></td>
                    <td><span className="chip ok">+53.3%</span></td>
                    <td>Գարիկ Հ.</td>
                  </tr>
                  <tr>
                    <td><b>Ոսկե մատանի բնական նռնաքարով</b></td>
                    <td>{t("cat_jewellery")}</td>
                    <td>$1,200</td>
                    <td><b className="report-final-price">$1,750</b></td>
                    <td><span className="chip ok">+45.8%</span></td>
                    <td>Աննա Գ.</td>
                  </tr>
                  <tr>
                    <td><b>Պարսկական մետաքսե գորգ Իսֆահան</b></td>
                    <td>{t("cat_carpets")}</td>
                    <td>$1,000</td>
                    <td><b className="report-final-price">$1,400</b></td>
                    <td><span className="chip ok">+40.0%</span></td>
                    <td>Դավիթ Մ.</td>
                  </tr>
                  <tr>
                    <td><b>Հին շվեյցարական ժամացույց</b></td>
                    <td>{t("cat_watches")}</td>
                    <td>$800</td>
                    <td><b className="report-final-price">$1,250</b></td>
                    <td><span className="chip ok">+56.2%</span></td>
                    <td>Գարիկ Հ.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>


    </>
  );
}
