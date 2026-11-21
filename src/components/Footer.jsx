import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer>
        <div className="w">
          <div>
            <Link className="logo" to="/">
              <span className="logo-fallback">GAVEL</span>
            </Link>
            <p className="footer-desc">{t("footer_desc")}</p>
          </div>
          <div>
            <h4>{t("footer_modules")}</h4>
            <ul>
              <li><Link to="/auctions">{t("footer_auctions_list")}</Link></li>
              <li><Link to="/my-participations">{t("nav_participations")}</Link></li>
              <li><Link to="/my-lots">{t("nav_my_lots")}</Link></li>
              <li><Link to="/add-lot">{t("footer_add_lot")}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t("footer_management")}</h4>
            <ul>
              <li><Link to="/profile">{t("nav_profile")}</Link></li>
              <li><Link to="/admin-dashboard">{t("footer_admin_dash")}</Link></li>
              <li><Link to="/admin-users">{t("footer_users_list")}</Link></li>
              <li><Link to="/admin-reports">{t("footer_reports")}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t("footer_system")}</h4>
            <ul>
              <li><Link to="/login">{t("footer_login")}</Link></li>
              <li><Link to="/register">{t("nav_register")}</Link></li>
              <li><Link to="/404">{t("footer_404")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="w footer-bottom">
          <div>{t("footer_copy")}</div>
          <div>{t("footer_course")}</div>
        </div>
      </footer>
  );
}
