import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n, SUPPORTED_LANGS } from "../i18n/I18nContext";

// Դրոշների SVG-ները՝ փոքր կոմպոնենտներ (props-ով ընտրվում է լեզուն)
function Flag({ code }) {
  return (
    <svg className="lang-flag-svg" viewBox="0 0 21 15" aria-hidden="true">
      {code === "hy" && (
        <>
          <rect width="21" height="5" fill="#D90012" />
          <rect y="5" width="21" height="5" fill="#0033A0" />
          <rect y="10" width="21" height="5" fill="#F2A800" />
        </>
      )}
      {code === "en" && (
        <>
          <rect width="21" height="15" fill="#012169" />
          <path d="M0 0l21 15M21 0L0 15" stroke="#FFF" strokeWidth="2.6" />
          <path d="M0 0l21 15M21 0L0 15" stroke="#C8102E" strokeWidth="1.3" />
          <path d="M10.5 0v15M0 7.5h21" stroke="#FFF" strokeWidth="4" />
          <path d="M10.5 0v15M0 7.5h21" stroke="#C8102E" strokeWidth="2.2" />
        </>
      )}
      {code === "ru" && (
        <>
          <rect width="21" height="5" fill="#FFFFFF" />
          <rect y="5" width="21" height="5" fill="#0039A6" />
          <rect y="10" width="21" height="5" fill="#D52B1E" />
        </>
      )}
    </svg>
  );
}

const LANG_NAMES = { hy: "Հայերեն", en: "English", ru: "Русский" };

// Navbar-ի հղումները. need = ով կարող է տեսնել/օգտագործել
const NAV_ITEMS = [
  { to: "/", key: "nav_home", need: null },
  { to: "/auctions", key: "nav_auctions", need: null },
  { to: "/my-participations", key: "nav_participations", need: "user" },
  { to: "/my-lots", key: "nav_my_lots", need: "user" },
  { to: "/profile", key: "nav_profile", need: "user" },
  { to: "/admin-dashboard", key: "nav_admin", need: "admin" },
];

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const { session, role } = useAuth();
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q").toString().trim();
    navigate(q ? `/auctions?q=${encodeURIComponent(q)}` : "/auctions");
  }

  return (
    <header>
      <div className="w">
        <Link className="logo" to="/">
          <img src="/images/logo.png" alt="Gavel Logo" />
        </Link>

        <form className="srch" onSubmit={handleSearch}>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input type="search" name="q" placeholder={t("search_placeholder")} aria-label={t("search_aria")} />
        </form>

        <nav>
          {NAV_ITEMS.map((item) => {
            // Ադմինի հղումը ոչ-ադմինից լրիվ թաքցվում է
            if (item.need === "admin" && role !== "admin") return null;

            // Հյուրի համար «user» հղումները երևում են, բայց կողպված են
            if (item.need === "user" && role === "guest") {
              return (
                <a
                  key={item.to}
                  className="nav-link is-locked"
                  href={item.to}
                  aria-disabled="true"
                  tabIndex={-1}
                  title={t("nav_locked_tooltip")}
                  onClick={(e) => e.preventDefault()}
                >
                  {t(item.key)}
                </a>
              );
            }

            // NavLink-ն ինքն է ավելացնում active դասը ընթացիկ էջի համար
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                {t(item.key)}
              </NavLink>
            );
          })}
        </nav>

        <div className="header-actions">
          {!session ? (
            <>
              <Link to="/login" className="btn sm">{t("nav_login")}</Link>
              <Link to="/register" className="btn sm pri">{t("nav_register")}</Link>
            </>
          ) : (
            <Link to="/profile" className="user-menu-btn">
              <span className="user-avatar">
                {session.avatar ? <img src={session.avatar} alt={session.firstName} /> : session.firstName.charAt(0)}
              </span>
              <span>{session.firstName} {session.lastName.charAt(0)}.</span>
              {session.verification?.status === "verified" && (
                <span className="user-verified-check" title="Վերիֆիկացված օգտատեր">✓</span>
              )}
            </Link>
          )}

          {/* Լեզվի ընտրիչ. նույն CSS-ը, բայց radio-ները կառավարվում են React state-ով */}
          <div className="lang-dropdown">
            {SUPPORTED_LANGS.map((code) => (
              <input
                key={code}
                type="radio"
                name="site-lang"
                id={`lang-${code}`}
                className="lang-radio"
                checked={lang === code}
                onChange={() => setLang(code)}
              />
            ))}

            <button type="button" className="lang-btn" aria-label={t("lang_choose_aria")} title={t("lang_choose_title")}>
              {SUPPORTED_LANGS.map((code) => (
                <span key={code} className={`lang-flag flag-${code}${lang === code ? " is-active" : ""}`}>
                  <Flag code={code} />
                </span>
              ))}
            </button>

            <div className="lang-menu" role="menu">
              {SUPPORTED_LANGS.map((code) => (
                <label
                  key={code}
                  htmlFor={`lang-${code}`}
                  className={`lang-item item-${code}${lang === code ? " is-active" : ""}`}
                  onClick={() => setLang(code)}
                >
                  <span className="lang-flag">
                    <Flag code={code} />
                  </span>
                  <span className="lang-name">{LANG_NAMES[code]}</span>
                  <span className="lang-check">
                    <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
