import "../styles/login.css";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Դեմո հաշիվներ դասախոսի համար
const DEMOS = [
  { email: "garik@example.com", pass: "garik123", key: "demo_user", icon: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
  { email: "admin@gavel.am", pass: "admin123", key: "demo_admin", icon: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></> },
  { email: "mariam@example.com", pass: "mariam123", key: "demo_blocked", icon: <><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></> },
];

export default function Login() {
  const { t } = useI18n();
  const { login, setFlash } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  usePageTitle("title_login");

  // Ֆորմայի դաշտերի արժեքները՝ React state-ում («կառավարվող» input-ներ)
  const [form, setForm] = useState({ email: "", password: "" });
  // Սխալներում պահում ենք ԲԱՆԱԼԻՆԵՐ, ոչ թե տեքստ՝ որպեսզի լեզուն փոխելիս սխալը ևս թարգմանվի
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function attemptLogin(emailRaw, password) {
    const email = emailRaw.trim().toLowerCase();
    const next = {};
    if (email === "") next.email = "err_email_required";
    else if (!EMAIL_RE.test(email)) next.email = "err_email_invalid";
    if (password === "") next.password = "err_password_required";
    if (Object.keys(next).length) return setErrors(next);

    const result = await login(email, password);
    if (!result.ok) return setErrors({ form: result.error });

    setErrors({});
    setFlash(t("toast_welcome") + result.user.firstName + "։");
    const nextPage = searchParams.get("next");
    const fallback = result.user.role === "admin" ? "/admin-dashboard" : "/profile";
    navigate(nextPage && /^\/[a-z0-9-]+$/.test(nextPage) ? nextPage : fallback, { replace: true });
  }

  function handleSubmit(event) {
    event.preventDefault();
    attemptLogin(form.email, form.password);
  }

  function handleDemo(demo) {
    setForm({ email: demo.email, password: demo.pass });
    attemptLogin(demo.email, demo.pass);
  }

  return (
    <main>
      <div className="w">
        <div className="auth-container">
          <Link className="logo auth-logo-center" to="/">
            <img src="/images/logo.png" alt="Gavel" />
          </Link>
          <h1 className="auth-title">{t("login_title")}</h1>
          <p className="auth-subtitle">{t("login_subtitle")}</p>

          <form className="auth-form" id="login-form" onSubmit={handleSubmit} noValidate>
            {errors.form && <div className="form-alert">{t(errors.form)}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">{t("lbl_email")}</label>
              <input
                type="email"
                id="login-email"
                name="email"
                className={"form-input" + (errors.email ? " is-invalid" : "")}
                placeholder="name@example.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <small className="form-error">{t(errors.email)}</small>}
            </div>

            <div className="form-group">
              <div className="auth-pass-row">
                <label className="form-label auth-pass-label" htmlFor="login-password">{t("lbl_password")}</label>
                <Link to="/login" className="auth-forgot-link">{t("lbl_forgot")}</Link>
              </div>
              <input
                type="password"
                id="login-password"
                name="password"
                className={"form-input" + (errors.password ? " is-invalid" : "")}
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <small className="form-error">{t(errors.password)}</small>}
            </div>

            <button type="submit" className="btn pri full lg auth-submit-btn">{t("footer_login")}</button>
          </form>

          <p className="auth-footer-prompt">
            <span>{t("login_no_account")}</span> <Link to="/register">{t("login_register_now")}</Link>
          </p>

          <div className="demo-login-box">
            <span className="demo-login-title">{t("demo_title")}</span>
            {DEMOS.map((demo) => (
              <button key={demo.email} type="button" className="demo-pill-btn" onClick={() => handleDemo(demo)}>
                <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">{demo.icon}</svg>{" "}
                <span>{t(demo.key)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
