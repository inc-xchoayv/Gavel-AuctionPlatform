import "../styles/admin-dashboard.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AdminDashboard() {
  const { t } = useI18n();
  usePageTitle("title_admin_dash");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <span>{t("adm_bc")}</span>
              <span>›</span>
              <span>{t("adm_nav_dash")}</span>
            </div>

            <div className="page-title-row">
              <div>
                <h1>{t("footer_admin_dash")}</h1>
                <p>{t("adm_dash_desc")}</p>
              </div>
              <span className="chip admin-super-badge"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg> Super Admin Access</span>
            </div>

            <div className="admin-subnav">
              <Link to="/admin-dashboard" className="active">{t("adm_nav_dash")}</Link>
              <Link to="/admin-auctions">{t("adm_nav_auctions")}</Link>
              <Link to="/admin-users">{t("adm_nav_users")}</Link>
              <Link to="/admin-reports">{t("footer_reports")}</Link>
            </div>

            <div className="kpi-row">
              <div className="kpi-stat-card">
                <small className="kpi-stat-lbl">{t("adm_stat_turnover")}</small>
                <div className="kpi-stat-val rev">$84,250</div>
                <small className="kpi-stat-growth">{t("adm_stat_month")}</small>
              </div>
              <div className="kpi-stat-card">
                <small className="kpi-stat-lbl">{t("adm_stat_active_auc")}</small>
                <div className="kpi-stat-val">9</div>
                <small className="kpi-stat-lbl">{t("adm_stat_live_sub")}</small>
              </div>
              <div className="kpi-stat-card">
                <small className="kpi-stat-lbl">{t("adm_stat_users")}</small>
                <div className="kpi-stat-val">6</div>
                <small className="kpi-stat-growth">{t("adm_stat_active_sub")}</small>
              </div>
              <div className="kpi-stat-card pending-border">
                <small className="kpi-stat-lbl">{t("adm_stat_pending")}</small>
                <div className="kpi-stat-val pending">1</div>
                <small><Link to="/admin-auctions" className="kpi-stat-link">{t("adm_view_requests")}</Link></small>
              </div>
            </div>

            <div className="chart-box">
              <div className="chart-head-row">
                <div>
                  <h3 className="chart-title">{t("adm_chart_title")}</h3>
                  <p className="chart-subtitle">{t("adm_chart_desc")}</p>
                </div>
                <span className="chart-avg-val">{t("adm_avg_daily")}</span>
              </div>
              <svg viewBox="0 0 800 180" className="revenue-svg-chart">
                <line x1="0" y1="160" x2="800" y2="160" className="chart-baseline"/>
                <line x1="0" y1="110" x2="800" y2="110" className="chart-guideline"/>
                <line x1="0" y1="60" x2="800" y2="60" className="chart-guideline"/>

                <rect x="20" y="90" width="20" height="70" rx="3" className="bar-light"/>
                <rect x="60" y="70" width="20" height="90" rx="3" className="bar-med"/>
                <rect x="100" y="110" width="20" height="50" rx="3" className="bar-light"/>
                <rect x="140" y="60" width="20" height="100" rx="3" className="bar-med"/>
                <rect x="180" y="40" width="20" height="120" rx="3" className="bar-dark"/>
                <rect x="220" y="85" width="20" height="75" rx="3" className="bar-light"/>
                <rect x="260" y="55" width="20" height="105" rx="3" className="bar-med"/>
                <rect x="300" y="30" width="20" height="130" rx="3" className="bar-dark"/>
                <rect x="340" y="75" width="20" height="85" rx="3" className="bar-light"/>
                <rect x="380" y="50" width="20" height="110" rx="3" className="bar-med"/>
                <rect x="420" y="65" width="20" height="95" rx="3" className="bar-light"/>
                <rect x="460" y="45" width="20" height="115" rx="3" className="bar-med"/>
                <rect x="500" y="35" width="20" height="125" rx="3" className="bar-dark"/>
                <rect x="540" y="80" width="20" height="80" rx="3" className="bar-light"/>
                <rect x="580" y="50" width="20" height="110" rx="3" className="bar-med"/>
                <rect x="620" y="25" width="20" height="135" rx="3" className="bar-dark"/>
                <rect x="660" y="45" width="20" height="115" rx="3" className="bar-med"/>
                <rect x="700" y="30" width="20" height="130" rx="3" className="bar-dark"/>
                <rect x="740" y="20" width="20" height="140" rx="3" className="bar-med"/>
              </svg>
            </div>

            <div className="grid grid-2">
              <div className="table-card">
                <div className="table-card-head">
                  <h3>{t("adm_live_auctions")}</h3>
                  <Link to="/admin-auctions" className="table-head-link">{t("adm_manage_link")}</Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("det_lot_word")}</th>
                      <th>{t("lot_current_price")}</th>
                      <th>{t("tbl_bids")}</th>
                      <th>{t("tbl_action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Link to="/auction-detail" className="table-lot-title">Հին ժամացույց</Link>
                        <small className="table-lot-sub">#128</small>
                      </td>
                      <td><b>$1,250</b></td>
                      <td>14</td>
                      <td><Link to="/auction-detail" className="btn sm table-action-btn">{t("btn_view")}</Link></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="/auction-detail" className="table-lot-title">Ձեռագործ գորգ</Link>
                        <small className="table-lot-sub">#211</small>
                      </td>
                      <td><b>$900</b></td>
                      <td>9</td>
                      <td><Link to="/auction-detail" className="btn sm table-action-btn">{t("btn_view")}</Link></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="/auction-detail" className="table-lot-title">Արծաթե սամովար</Link>
                        <small className="table-lot-sub">#94</small>
                      </td>
                      <td><b>$480</b></td>
                      <td>6</td>
                      <td><Link to="/auction-detail" className="btn sm table-action-btn">{t("btn_view")}</Link></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="table-card">
                <div className="table-card-head">
                  <h3>{t("adm_recent_users")}</h3>
                  <Link to="/admin-users" className="table-head-link">{t("adm_all_users_link")}</Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("prof_role_user")}</th>
                      <th>{t("tbl_role")}</th>
                      <th>{t("flt_status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <b>Գարիկ Հարությունյան</b>
                        <small className="table-lot-sub">garik@example.com</small>
                      </td>
                      <td><span className="chip">{t("prof_role_user")}</span></td>
                      <td><span className="chip ok">{t("chip_active")}</span></td>
                    </tr>
                    <tr>
                      <td>
                        <b>Արմեն Սարգսյան</b>
                        <small className="table-lot-sub">armen.sargsyan@example.com</small>
                      </td>
                      <td><span className="chip">{t("prof_role_user")}</span></td>
                      <td><span className="chip ok">{t("chip_active")}</span></td>
                    </tr>
                    <tr>
                      <td>
                        <b>Աննա Գրիգորյան</b>
                        <small className="table-lot-sub">anna@example.com</small>
                      </td>
                      <td><span className="chip">{t("prof_role_user")}</span></td>
                      <td><span className="chip ok">{t("chip_active")}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>


    </>
  );
}
