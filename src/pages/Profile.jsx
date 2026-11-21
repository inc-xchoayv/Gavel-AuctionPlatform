import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/profile.css";
import { useAuth } from "../auth/AuthContext";
import HumanVerification from "../components/HumanVerification";
import usePageTitle from "../hooks/usePageTitle";
import { useI18n } from "../i18n/I18nContext";

export default function Profile({ initialTab = "info" }) {
  const { t } = useI18n();
  usePageTitle("title_profile");
  const { session, logout, updateAvatar, updateProfile, setFlash } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(urlTab || initialTab || "info");
  const avatarInputRef = useRef(null);

  const [personalForm, setPersonalForm] = useState({
    firstName: session?.firstName || "",
    lastName: session?.lastName || "",
    email: session?.email || "",
    phone: session?.phone || "",
    address: session?.address || "",
    city: session?.city || "",
    zip: session?.zip || "",
    bio: session?.bio || "",
  });

  useEffect(() => {
    if (session) {
      setPersonalForm({
        firstName: session.firstName || "",
        lastName: session.lastName || "",
        email: session.email || "",
        phone: session.phone || "",
        address: session.address || "",
        city: session.city || "",
        zip: session.zip || "",
        bio: session.bio || "",
      });
    }
  }, [session]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    updateProfile(personalForm);
    setFlash(t("prof_personal_saved") || "Անձնական տվյալները հաջողությամբ պահպանվեցին:");
  };

  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab, activeTab]);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setSearchParams({ tab });
  }

  function handleLogout() {
    if (window.confirm(t("logout_confirm"))) logout();
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      alert("Ֆայլի առավելագույն չափը 6 ՄԲ է:");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateAvatar(reader.result);
      setFlash(t("prof_avatar_updated") || "Ավատարը հաջողությամբ թարմացվեց");
    };
    reader.readAsDataURL(file);
  };

  const currentAvatar = session?.avatar || "/images/avatar-winner.svg";
  const verifStatus = session?.verification?.status || "unverified";

  return (
    <>
      <main>
        <div className="w">
          <div className="breadcrumb">
            <Link to="/">{t("nav_home")}</Link>
            <span>›</span>
            <span>{t("nav_profile")}</span>
          </div>

          <div className="profile-layout">
            <aside>
              <div className="user-profile-card">
                <div className="big-avatar">
                  <img
                    src={currentAvatar}
                    alt={`${session?.firstName || "User"} ${session?.lastName || ""}`}
                  />
                </div>
                <button
                  type="button"
                  className="btn-change-avatar-side"
                  onClick={() => avatarInputRef.current?.click()}
                  title={t("prof_verif_change_avatar") || "Փոխել ավատարը"}
                >
                  ✎ {t("prof_verif_change_avatar") || "Փոխել ավատարը"}
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  className="hidden-file-input"
                  onChange={handleAvatarUpload}
                />

                <h3 className="profile-user-name">
                  {session?.firstName || "Գարիկ"} {session?.lastName || "Հարությունյան"}
                </h3>
                <p className="profile-user-email">
                  {session?.email || "garik@example.com"}
                </p>

                <div className="profile-badge-row">
                  <span className="chip profile-role-badge">
                    {session?.role === "admin" ? t("prof_role_admin") || "Ադմին" : t("prof_role_user")}
                  </span>
                  {verifStatus === "verified" ? (
                    <span className="trust-badge-pill">
                      ✓ {t("prof_verif_status_verified")}
                    </span>
                  ) : verifStatus === "pending" ? (
                    <span className="trust-badge-pill pending">
                      {t("prof_verif_status_pending")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="trust-badge-pill unverified"
                      onClick={() => handleTabChange("verification")}
                      title="Սեղմեք վերիֆիկացիա անցնելու համար"
                    >
                      ⚠️ {t("prof_tab_verification")} (14%)
                    </button>
                  )}
                </div>

                <div className="profile-nav">
                  <button
                    type="button"
                    className={`profile-nav-btn tab-btn-info ${activeTab === "info" ? "active" : ""}`}
                    onClick={() => handleTabChange("info")}
                  >
                    <span className="tab-btn-icon">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <span>{t("prof_tab_personal")}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-nav-btn tab-btn-verification ${activeTab === "verification" ? "active" : ""}`}
                    onClick={() => handleTabChange("verification")}
                  >
                    <span className="tab-btn-icon">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </span>
                    <span>{t("prof_tab_verification") || "Ինքնության հաստատում"}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-nav-btn tab-btn-security ${activeTab === "security" ? "active" : ""}`}
                    onClick={() => handleTabChange("security")}
                  >
                    <span className="tab-btn-icon">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <span>{t("prof_tab_security")}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-nav-btn tab-btn-payment ${activeTab === "payment" ? "active" : ""}`}
                    onClick={() => handleTabChange("payment")}
                  >
                    <span className="tab-btn-icon">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </span>
                    <span>{t("prof_tab_payment")}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-nav-btn tab-btn-notifications ${activeTab === "notifications" ? "active" : ""}`}
                    onClick={() => handleTabChange("notifications")}
                  >
                    <span className="tab-btn-icon">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                    </span>
                    <span>{t("prof_tab_notif")}</span>
                  </button>
                </div>

                <div className="profile-logout-box">
                  <button
                    type="button"
                    className="btn sm bad full profile-logout-btn"
                    id="btn-profile-logout"
                    onClick={handleLogout}
                  >
                    {t("btn_logout")}
                  </button>
                </div>
              </div>
            </aside>

            <section className="profile-content-card">
              {/* PANE 1: PERSONAL INFO */}
              <div id="pane-info" className={`profile-tab-pane ${activeTab === "info" ? "active" : ""}`}>
                <h2 className="profile-section-title">{t("prof_tab_personal")}</h2>
                <p className="profile-section-desc">{t("prof_personal_desc")}</p>

                <form onSubmit={handleSavePersonal}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{t("lbl_first_name_req")}</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-input"
                        value={personalForm.firstName}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t("lbl_last_name_req")}</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-input"
                        value={personalForm.lastName}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{t("lbl_email_req")}</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={personalForm.email}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t("lbl_phone_req")}</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={personalForm.phone}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("prof_lbl_address")}</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      placeholder={t("prof_ph_address")}
                      value={personalForm.address}
                      onChange={handlePersonalChange}
                    />
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{t("prof_lbl_city")}</label>
                      <input
                        type="text"
                        name="city"
                        className="form-input"
                        placeholder={t("prof_ph_city")}
                        value={personalForm.city}
                        onChange={handlePersonalChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t("prof_lbl_zip")}</label>
                      <input
                        type="text"
                        name="zip"
                        className="form-input"
                        placeholder={t("prof_ph_zip")}
                        value={personalForm.zip}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("prof_lbl_bio")}</label>
                    <textarea
                      name="bio"
                      className="form-textarea"
                      placeholder={t("prof_ph_bio")}
                      value={personalForm.bio}
                      onChange={handlePersonalChange}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn pri profile-save-btn">
                    {t("prof_save_btn")}
                  </button>
                </form>
              </div>

              {/* PANE 2: HUMAN VERIFICATION (Matches uploaded reference image) */}
              <div
                id="pane-verification"
                className={`profile-tab-pane ${activeTab === "verification" ? "active" : ""}`}
              >
                <HumanVerification onGoToPersonal={() => handleTabChange("info")} />
              </div>

              {/* PANE 3: SECURITY */}
              <div
                id="pane-security"
                className={`profile-tab-pane ${activeTab === "security" ? "active" : ""}`}
              >
                <h2 className="profile-section-title">{t("prof_sec_title")}</h2>
                <p className="profile-section-desc">{t("prof_sec_desc")}</p>

                <form onSubmit={(e) => { e.preventDefault(); setFlash("Գաղտնաբառը թարմացվեց"); }}>
                  <div className="form-group">
                    <label className="form-label">{t("prof_cur_pass")}</label>
                    <input type="password" className="form-input" placeholder="••••••••••••" />
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{t("prof_new_pass")}</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder={t("prof_ph_new_pass")}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t("prof_rep_pass")}</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder={t("prof_ph_rep_pass")}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn pri profile-save-btn">
                    {t("prof_upd_pass_btn")}
                  </button>
                </form>

                <div className="security-group-card">
                  <div className="security-card-title">
                    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                    </svg>
                    <span>{t("prof_2fa_title")}</span>
                  </div>
                  <p className="security-card-desc">{t("prof_2fa_desc")}</p>
                  <div className="session-item">
                    <div>
                      <div className="session-title">{t("prof_2fa_sms")}</div>
                      <div className="session-meta">Միացված է համարին՝ +374 98 ••••32</div>
                    </div>
                    <span className="chip ok">{t("prof_enabled")}</span>
                  </div>
                </div>

                <div className="security-group-card">
                  <div className="security-card-title">
                    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                      <rect width="20" height="14" x="2" y="3" rx="2" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                    <span>{t("prof_sessions_title")}</span>
                  </div>
                  <p className="security-card-desc">{t("prof_sessions_desc")}</p>
                  <div className="session-item">
                    <div>
                      <div className="session-title">Chrome 122 (Windows 11)</div>
                      <div className="session-meta">Երևան, Հայաստան · Ընթացիկ սարք (Ակտիվ)</div>
                    </div>
                    <span className="chip ok">{t("prof_this_device")}</span>
                  </div>
                  <div className="session-item">
                    <div>
                      <div className="session-title">Mobile Safari (Apple iPhone 15)</div>
                      <div className="session-meta">
                        Երևան, Հայաստան · Վերջին ակտիվությունը՝ 2 ժամ առաջ
                      </div>
                    </div>
                    <label className="session-term-toggle" title={t("prof_end_sess_title")}>
                      <input type="checkbox" className="session-term-cb" />
                      <span className="btn sm bad btn-term-act">{t("prof_end_session")}</span>
                      <span className="chip btn-term-done">{t("chip_ended")}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* PANE 4: PAYMENT */}
              <div
                id="pane-payment"
                className={`profile-tab-pane ${activeTab === "payment" ? "active" : ""}`}
              >
                <h2 className="profile-section-title">{t("prof_pay_title")}</h2>
                <p className="profile-section-desc">{t("prof_pay_desc")}</p>

                <div className="balance-overview-box">
                  <div>
                    <span className="balance-label">{t("prof_bal_title")}</span>
                    <div className="balance-amount">$4,200</div>
                    <small className="balance-meta">
                      <span>{t("prof_bal_free")}</span> <b>$2,950</b>{" "}
                      <span>{t("prof_bal_locked")}</span> <b>$1,250</b>
                    </small>
                  </div>
                  <a href="#new-card-form" className="btn pri sm">
                    {t("prof_topup_btn")}
                  </a>
                </div>

                <h3 className="security-card-title">{t("prof_cards_title")}</h3>

                <div className="payment-card-box">
                  <div className="payment-card-left">
                    <span className="payment-card-icon">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </span>
                    <div>
                      <b className="payment-card-num">Mastercard •••• 4242</b>
                      <small className="payment-card-sub">
                        Ժամկետ՝ 12/28 · Հիմնական վճարման քարտ
                      </small>
                    </div>
                  </div>
                  <div className="payment-card-actions">
                    <span className="chip ok">{t("prof_card_primary")}</span>
                  </div>
                </div>

                <div className="payment-card-box">
                  <div className="payment-card-left">
                    <span className="payment-card-icon">
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </span>
                    <div>
                      <b className="payment-card-num">Visa Gold •••• 8819</b>
                      <small className="payment-card-sub">
                        Ժամկետ՝ 09/27 · Պահուստային քարտ
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANE 5: NOTIFICATIONS */}
              <div
                id="pane-notifications"
                className={`profile-tab-pane ${activeTab === "notifications" ? "active" : ""}`}
              >
                <h2 className="profile-section-title">{t("prof_notif_title")}</h2>
                <p className="profile-section-desc">{t("prof_notif_desc")}</p>

                <form onSubmit={(e) => { e.preventDefault(); setFlash("Ծանուցումների կարգավորումները պահպանվեցին"); }}>
                  <div className="notification-group">
                    <div className="notification-group-title">{t("prof_notif_events")}</div>

                    <label className="notification-row">
                      <input type="checkbox" defaultChecked className="notification-checkbox" />
                      <div className="notification-text-wrap">
                        <b className="notification-name">{t("prof_notif_outbid")}</b>
                        <small className="notification-sub">{t("prof_notif_outbid_d")}</small>
                      </div>
                    </label>

                    <label className="notification-row">
                      <input type="checkbox" defaultChecked className="notification-checkbox" />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>{" "}
                          <span>{t("prof_notif_ending")}</span>
                        </b>
                        <small className="notification-sub">{t("prof_notif_ending_d")}</small>
                      </div>
                    </label>

                    <label className="notification-row">
                      <input type="checkbox" defaultChecked className="notification-checkbox" />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                            <circle cx="12" cy="8" r="6" />
                          </svg>{" "}
                          Հաղթանակի ծանուցում
                        </b>
                        <small className="notification-sub">{t("prof_notif_win_d")}</small>
                      </div>
                    </label>
                  </div>

                  <button type="submit" className="btn pri profile-save-btn">
                    {t("prof_notif_save")}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
