import "../styles/admin-users.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AdminUsers() {
  const { t } = useI18n();
  usePageTitle("title_admin_users");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <Link to="/admin-dashboard">{t("adm_bc")}</Link>
              <span>›</span>
              <span>{t("adm_nav_users")}</span>
            </div>

            <div className="page-title-row">
              <div>
                <h1>{t("adm_nav_users")}</h1>
                <p>{t("adm_users_desc")}</p>
              </div>
              <Link to="/register" className="btn pri sm">{t("adm_users_add")}</Link>
            </div>

            <div className="admin-subnav">
              <Link to="/admin-dashboard">{t("adm_nav_dash")}</Link>
              <Link to="/admin-auctions">{t("adm_nav_auctions")}</Link>
              <Link to="/admin-users" className="active">{t("adm_nav_users")}</Link>
              <Link to="/admin-reports">{t("footer_reports")}</Link>
            </div>

            <input type="radio" name="admin-user-filter" id="ufilter-all" className="admin-user-filter-radio" defaultChecked />
            <input type="radio" name="admin-user-filter" id="ufilter-users" className="admin-user-filter-radio" />
            <input type="radio" name="admin-user-filter" id="ufilter-admins" className="admin-user-filter-radio" />

            <div className="admin-users-filter-bar">
              <form action="/admin-users" method="get" className="search-box">
                <input type="text" name="q" className="form-input admin-users-search-inp" placeholder={t("adm_users_search_ph")} />
                <button type="submit" className="btn sm pri">{t("search_aria")}</button>
              </form>
              <div className="admin-users-btn-group">
                <label htmlFor="ufilter-all" className="btn sm ubtn-all">{t("flt_all")}</label>
                <label htmlFor="ufilter-users" className="btn sm ubtn-users">{t("adm_tab_users")}</label>
                <label htmlFor="ufilter-admins" className="btn sm ubtn-admins">{t("adm_tab_admins")}</label>
              </div>
            </div>

            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t("tbl_fullname")}</th>
                    <th>{t("lbl_email")}</th>
                    <th>{t("tbl_role")}</th>
                    <th>{t("tbl_activity")}</th>
                    <th>{t("tbl_balance")}</th>
                    <th>{t("flt_status")}</th>
                    <th>{t("tbl_action")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="role-user">
                    <td>#1</td>
                    <td><b>Գարիկ Հարությունյան</b></td>
                    <td>garik@example.com</td>
                    <td><span className="chip user-role-badge role-user-badge">{t("prof_role_user")}</span></td>
                    <td>28 հայտ · 2 լոտ</td>
                    <td><b>$4,200</b></td>
                    <td>
                      <span className="chip ok status-badge-active">{t("chip_active")}</span>
                      <span className="chip bad status-badge-blocked">{t("chip_blocked")}</span>
                    </td>
                    <td>
                      <label className="user-block-toggle-lbl" title={t("adm_toggle_status_title")}>
                        <input type="checkbox" className="user-block-cb" />
                        <span className="btn sm bad btn-block-action">{t("adm_btn_block")}</span>
                        <span className="btn sm ok btn-unblock-action">{t("adm_btn_activate")}</span>
                      </label>
                    </td>
                  </tr>
                  <tr className="role-user">
                    <td>#2</td>
                    <td><b>Արմեն Սարգսյան</b></td>
                    <td>armen.sargsyan@example.com</td>
                    <td><span className="chip user-role-badge role-user-badge">{t("prof_role_user")}</span></td>
                    <td>14 հայտ · 12 լոտ</td>
                    <td><b>$18,450</b></td>
                    <td>
                      <span className="chip ok status-badge-active">{t("chip_active")}</span>
                      <span className="chip bad status-badge-blocked">{t("chip_blocked")}</span>
                    </td>
                    <td>
                      <label className="user-block-toggle-lbl" title={t("adm_toggle_status_title")}>
                        <input type="checkbox" className="user-block-cb" />
                        <span className="btn sm bad btn-block-action">{t("adm_btn_block")}</span>
                        <span className="btn sm ok btn-unblock-action">{t("adm_btn_activate")}</span>
                      </label>
                    </td>
                  </tr>
                  <tr className="role-admin">
                    <td>#3</td>
                    <td><b>Ադմին Gavel</b></td>
                    <td>admin@gavel.am</td>
                    <td><span className="chip user-role-badge role-admin-badge">{t("nav_admin")}</span></td>
                    <td>{t("adm_super_admin")}</td>
                    <td><b>—</b></td>
                    <td><span className="chip ok status-badge-active">{t("chip_active")}</span></td>
                    <td><Link to="/profile" className="btn sm">{t("btn_view")}</Link></td>
                  </tr>
                  <tr className="role-user">
                    <td>#4</td>
                    <td><b>Աննա Գրիգորյան</b></td>
                    <td>anna@example.com</td>
                    <td><span className="chip user-role-badge role-user-badge">{t("prof_role_user")}</span></td>
                    <td>7 հայտ · 1 լոտ</td>
                    <td><b>$850</b></td>
                    <td>
                      <span className="chip ok status-badge-active">{t("chip_active")}</span>
                      <span className="chip bad status-badge-blocked">{t("chip_blocked")}</span>
                    </td>
                    <td>
                      <label className="user-block-toggle-lbl" title={t("adm_toggle_status_title")}>
                        <input type="checkbox" className="user-block-cb" />
                        <span className="btn sm bad btn-block-action">{t("adm_btn_block")}</span>
                        <span className="btn sm ok btn-unblock-action">{t("adm_btn_activate")}</span>
                      </label>
                    </td>
                  </tr>
                  <tr className="role-user">
                    <td>#5</td>
                    <td><b>Կարեն Պետրոսյան</b></td>
                    <td>karen@example.com</td>
                    <td><span className="chip user-role-badge role-user-badge">{t("prof_role_user")}</span></td>
                    <td>5 հայտ · 3 լոտ</td>
                    <td><b>$0</b></td>
                    <td>
                      <span className="chip ok status-badge-active">{t("chip_active")}</span>
                      <span className="chip bad status-badge-blocked">{t("chip_blocked")}</span>
                    </td>
                    <td>
                      <label className="user-block-toggle-lbl" title={t("adm_toggle_status_title")}>
                        <input type="checkbox" className="user-block-cb" defaultChecked />
                        <span className="btn sm bad btn-block-action">{t("adm_btn_block")}</span>
                        <span className="btn sm ok btn-unblock-action">{t("adm_btn_activate")}</span>
                      </label>
                    </td>
                  </tr>
                  <tr className="role-user">
                    <td>#6</td>
                    <td><b>Դավիթ Մանուկյան</b></td>
                    <td>david@example.com</td>
                    <td><span className="chip user-role-badge role-user-badge">{t("prof_role_user")}</span></td>
                    <td>15 հայտ · 4 լոտ</td>
                    <td><b>$2,100</b></td>
                    <td>
                      <span className="chip ok status-badge-active">{t("chip_active")}</span>
                      <span className="chip bad status-badge-blocked">{t("chip_blocked")}</span>
                    </td>
                    <td>
                      <label className="user-block-toggle-lbl" title={t("adm_toggle_status_title")}>
                        <input type="checkbox" className="user-block-cb" />
                        <span className="btn sm bad btn-block-action">{t("adm_btn_block")}</span>
                        <span className="btn sm ok btn-unblock-action">{t("adm_btn_activate")}</span>
                      </label>
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
