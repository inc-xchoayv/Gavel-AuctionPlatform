import "../styles/admin-auctions.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AdminAuctions() {
  const { t } = useI18n();
  usePageTitle("title_admin_auctions");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <Link to="/admin-dashboard">{t("adm_bc")}</Link>
              <span>›</span>
              <span>{t("adm_nav_auctions")}</span>
            </div>

            <div className="page-title-row">
              <div>
                <h1>{t("adm_auc_title")}</h1>
                <p>{t("adm_auc_desc")}</p>
              </div>
            </div>

            <div className="admin-subnav">
              <Link to="/admin-dashboard">{t("adm_nav_dash")}</Link>
              <Link to="/admin-auctions" className="active">{t("adm_nav_auctions")}</Link>
              <Link to="/admin-users">{t("adm_nav_users")}</Link>
              <Link to="/admin-reports">{t("footer_reports")}</Link>
            </div>

            <div className="admin-auctions-tabs-bar">
              <Link to="/admin-auctions" className="btn sm pri">{t("flt_all")}</Link>
              <Link to="/admin-auctions" className="btn sm">{t("adm_tab_pending")}</Link>
              <Link to="/admin-auctions" className="btn sm">{t("chip_live_air")}</Link>
              <Link to="/admin-auctions" className="btn sm">{t("chip_ended")}</Link>
            </div>

            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("det_lot_word")}</th>
                    <th>{t("tbl_seller")}</th>
                    <th>{t("tbl_price_step")}</th>
                    <th>{t("tbl_bids")}</th>
                    <th>{t("flt_status")}</th>
                    <th>{t("lot_time_left")}</th>
                    <th>{t("tbl_mod_action")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Link to="/auction-detail"><b>Հին ժամացույց</b></Link>
                      <small className="table-lot-sub">#128</small>
                    </td>
                    <td>Արմեն Սարգսյան</td>
                    <td>
                      <b>$1,250</b>
                      <small className="table-lot-sub">+$50</small>
                    </td>
                    <td>14</td>
                    <td><span className="chip live">{t("chip_live")}</span></td>
                    <td><span className="tm">02:41:08</span></td>
                    <td>
                      <div className="table-btn-flex">
                        <Link to="/admin-auctions" className="btn sm bad table-sm-action-btn">{t("prof_end_session")}</Link>
                        <Link to="/auction-detail" className="btn sm table-sm-action-btn">{t("btn_view")}</Link>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link to="/auction-detail"><b>Ձեռագործ գորգ</b></Link>
                      <small className="table-lot-sub">#211</small>
                    </td>
                    <td>Կարինե Մարտիրոսյան</td>
                    <td>
                      <b>$900</b>
                      <small className="table-lot-sub">+$50</small>
                    </td>
                    <td>9</td>
                    <td><span className="chip live">{t("chip_live")}</span></td>
                    <td><span className="tm hot">00:08:30</span></td>
                    <td>
                      <div className="table-btn-flex">
                        <Link to="/admin-auctions" className="btn sm bad table-sm-action-btn">{t("prof_end_session")}</Link>
                        <Link to="/auction-detail" className="btn sm table-sm-action-btn">{t("btn_view")}</Link>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link to="/auction-detail"><b>Հնաոճ բրոնզե արձանիկ</b></Link>
                      <small className="table-lot-sub">#220</small>
                    </td>
                    <td>Արմեն Սարգսյան</td>
                    <td>
                      <b>$950</b>
                      <small className="table-lot-sub">+$50</small>
                    </td>
                    <td>0</td>
                    <td><span className="chip rv">{t("chip_review")}</span></td>
                    <td>—</td>
                    <td>
                      <div className="table-btn-flex">
                        <Link to="/admin-auctions" className="btn sm ok table-sm-action-btn"><svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> <span>{t("adm_btn_approve")}</span></Link>
                        <Link to="/admin-auctions" className="btn sm bad table-sm-action-btn"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> <span>{t("adm_btn_reject")}</span></Link>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link to="/auction-detail"><b>Պարսկական մետաքսե գորգ</b></Link>
                      <small className="table-lot-sub">#203</small>
                    </td>
                    <td>Արտո Դ.</td>
                    <td>
                      <b>$1,400</b>
                      <small className="table-lot-sub">+$100</small>
                    </td>
                    <td>13</td>
                    <td><span className="chip end">{t("chip_finished")}</span></td>
                    <td>—</td>
                    <td>
                      <div className="table-btn-flex">
                        <Link to="/auction-detail" className="btn sm table-sm-action-btn">{t("adm_btn_results")}</Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>


    </>
  );
}
