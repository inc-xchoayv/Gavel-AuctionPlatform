import "../styles/404.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFound() {
  const { t } = useI18n();
  usePageTitle("title_404");

  return (
    <>
      <main>
          <div className="w">
            <div className="not-found-wrap">
              <div className="big-num">404</div>
              <h1 className="not-found-title">{t("err404_title")}</h1>
              <p className="not-found-desc">{t("err404_desc")}</p>

              <div className="not-found-btns">
                <Link to="/" className="btn pri lg">{t("err404_home_btn")}</Link>
                <Link to="/auctions" className="btn lg">{t("footer_auctions_list")}</Link>
              </div>
            </div>
          </div>
        </main>


    </>
  );
}
