import "../styles/register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s-]{8,16}$/;
const EMPTY = { firstName: "", lastName: "", email: "", phone: "", password: "", password2: "", terms: false };

// Ստուգում է ֆորմայի տվյալները և վերադարձնում սխալների օբյեկտ { դաշտ: "թարգմանության-բանալի" }
function validate(data) {
  const errors = {};
  if (data.firstName.trim().length < 2) errors.firstName = "err_first_name_short";
  if (data.lastName.trim().length < 2) errors.lastName = "err_last_name_short";

  const email = data.email.trim();
  if (email === "") errors.email = "err_email_required";
  else if (!EMAIL_RE.test(email)) errors.email = "err_email_invalid";

  if (data.phone.trim() !== "" && !PHONE_RE.test(data.phone.trim())) errors.phone = "err_phone_invalid";

  if (data.password.length < 8) errors.password = "err_password_short";
  else if (!/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)) errors.password = "err_password_weak";

  if (data.password2 !== data.password) errors.password2 = "err_password_mismatch";
  if (!data.terms) errors.form = "err_terms_required";
  return errors;
}

export default function Register() {
  const { t } = useI18n();
  const { register, setFlash } = useAuth();
  const navigate = useNavigate();
  usePageTitle("title_register");

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Մեկ ֆունկցիա՝ բոլոր դաշտերի համար (text input-ներ և checkbox)
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length) return setErrors(found);

    const result = register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
    });
    if (!result.ok) return setErrors({ email: result.error });

    setFlash(t("toast_register_success") + result.user.firstName + "։");
    navigate("/profile", { replace: true });
  }

  // Օգնականներ՝ input-ի className-ը և սխալի տեքստը (կրկնությունից խուսափելու համար)
  const cls = (name) => "form-input" + (errors[name] ? " is-invalid" : "");
  const err = (name) => errors[name] && <small className="form-error">{t(errors[name])}</small>;

  return (
    <main>
      <div className="w">
        <div className="reg-container">
          <div className="reg-header">
            <Link className="logo reg-logo-center" to="/">
              <img src="/images/logo.png" alt="Gavel" />
            </Link>
            <h1 className="reg-title">{t("reg_title")}</h1>
            <p className="reg-subtitle">{t("reg_subtitle")}</p>
          </div>

          <form id="register-form" onSubmit={handleSubmit} noValidate>
            {errors.form && <div className="form-alert">{t(errors.form)}</div>}

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-firstName">{t("lbl_first_name_req")}</label>
                <input type="text" id="reg-firstName" name="firstName" className={cls("firstName")} placeholder={t("ph_first_name")} value={form.firstName} onChange={handleChange} />
                {err("firstName")}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-lastName">{t("lbl_last_name_req")}</label>
                <input type="text" id="reg-lastName" name="lastName" className={cls("lastName")} placeholder={t("ph_last_name")} value={form.lastName} onChange={handleChange} />
                {err("lastName")}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">{t("lbl_email_req")}</label>
              <input type="email" id="reg-email" name="email" className={cls("email")} placeholder="arman@example.com" autoComplete="email" value={form.email} onChange={handleChange} />
              {err("email")}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">{t("lbl_phone")}</label>
              <input type="tel" id="reg-phone" name="phone" className={cls("phone")} placeholder="+374 91 000000" value={form.phone} onChange={handleChange} />
              {err("phone")}
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">{t("lbl_password_req")}</label>
                <input type="password" id="reg-password" name="password" className={cls("password")} placeholder="••••••••" autoComplete="new-password" value={form.password} onChange={handleChange} />
                {err("password")}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password2">{t("lbl_password2_req")}</label>
                <input type="password" id="reg-password2" name="password2" className={cls("password2")} placeholder="••••••••" autoComplete="new-password" value={form.password2} onChange={handleChange} />
                {err("password2")}
              </div>
            </div>

            <label className="reg-terms-row">
              <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} />
              <span>
                <span>{t("reg_terms_p1")}</span> <Link to="/404">{t("reg_terms_link")}</Link> <span>{t("reg_terms_p2")}</span>
              </span>
            </label>

            <button type="submit" className="btn pri full lg">{t("nav_register")}</button>
          </form>

          <p className="reg-footer-prompt">
            <span>{t("reg_have_account")}</span> <Link to="/login">{t("footer_login")}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
