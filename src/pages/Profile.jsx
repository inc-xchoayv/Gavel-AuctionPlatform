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

  const newCardFormRef = useRef(null);
  const cardNumInputRef = useRef(null);
  const [highlightCardForm, setHighlightCardForm] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState(500);
  const [topupCardId, setTopupCardId] = useState("");

  const [cards, setCards] = useState(() => {
    if (session?.cards && Array.isArray(session.cards)) return session.cards;
    if (session && session.email && session.email !== "garik@example.com") {
      return [];
    }
    return [
      {
        id: "card_mc_4242",
        brand: "Mastercard",
        num: "•••• 4242",
        last4: "4242",
        exp: "12/28",
        holder: `${session?.firstName || "GARIK"} ${session?.lastName || "HARUTYUNYAN"}`.toUpperCase(),
        isPrimary: true,
      },
      {
        id: "card_visa_8819",
        brand: "Visa Gold",
        num: "•••• 8819",
        last4: "8819",
        exp: "09/27",
        holder: `${session?.firstName || "GARIK"} ${session?.lastName || "HARUTYUNYAN"}`.toUpperCase(),
        isPrimary: false,
      },
    ];
  });

  useEffect(() => {
    if (session?.cards && Array.isArray(session.cards)) {
      setCards(session.cards);
    } else if (session && session.email && session.email !== "garik@example.com") {
      setCards([]);
    }
  }, [session]);

  const [cardForm, setCardForm] = useState({
    number: "",
    exp: "",
    cvv: "",
    holder: "",
    isPrimary: false,
  });

  const getCardBrand = (num) => {
    const cleaned = (num || "").replace(/\s+/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(cleaned)) return "Mastercard";
    if (/^(9051|9)/.test(cleaned)) return "ArCa";
    if (/^3[47]/.test(cleaned)) return "Amex";
    return "";
  };
  const detectedBrand = getCardBrand(cardForm.number);

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardForm((prev) => ({ ...prev, number: formatted }));
  };

  const handleCardExpChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length > 2) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    setCardForm((prev) => ({ ...prev, exp: raw }));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const rawNum = cardForm.number.replace(/\s+/g, "");
    if (rawNum.length < 16) {
      alert(t("prof_card_invalid_num"));
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.exp)) {
      alert(t("prof_card_invalid_exp"));
      return;
    }
    if (cardForm.cvv.length < 3) {
      alert(t("prof_card_invalid_cvv"));
      return;
    }
    if (!cardForm.holder.trim()) {
      alert(t("prof_card_invalid_holder"));
      return;
    }

    const last4 = rawNum.slice(-4);
    const brand = detectedBrand || "Bank Card";
    const isFirst = cards.length === 0;
    const shouldBePrimary = isFirst || cardForm.isPrimary;

    const newCard = {
      id: "card_" + Date.now(),
      brand,
      num: `•••• ${last4}`,
      last4,
      exp: cardForm.exp,
      holder: cardForm.holder.trim().toUpperCase(),
      isPrimary: shouldBePrimary,
    };

    const updatedCards = shouldBePrimary
      ? [newCard, ...cards.map((c) => ({ ...c, isPrimary: false }))]
      : [...cards, newCard];

    setCards(updatedCards);
    updateProfile({ cards: updatedCards });
    setFlash(t("prof_card_added") || "Քարտը հաջողությամբ կցվեց:");
    setCardForm({ number: "", exp: "", cvv: "", holder: "", isPrimary: false });
  };

  const handleMakePrimary = (cardId) => {
    const updated = cards.map((c) => ({
      ...c,
      isPrimary: c.id === cardId,
    }));
    setCards(updated);
    updateProfile({ cards: updated });
    setFlash(t("prof_card_made_primary") || "Հիմնական քարտը փոխվեց:");
  };

  const handleRemoveCard = (cardId) => {
    const filtered = cards.filter((c) => c.id !== cardId);
    if (filtered.length > 0 && !filtered.some((c) => c.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setCards(filtered);
    updateProfile({ cards: filtered });
    setFlash(t("prof_card_removed") || "Քարտը հեռացվեց:");
  };

  const scrollToCardForm = () => {
    if (newCardFormRef.current) {
      newCardFormRef.current.scrollIntoView({ behavior: "smooth" });
      setHighlightCardForm(true);
      setTimeout(() => setHighlightCardForm(false), 2000);
      cardNumInputRef.current?.focus();
    }
  };

  const handleTopupClick = () => {
    if (cards.length === 0) {
      setFlash(t("prof_topup_need_card"));
      scrollToCardForm();
    } else {
      setShowTopup((prev) => !prev);
    }
  };

  const handleExecuteTopup = (e) => {
    e.preventDefault();
    const amt = Number(topupAmount);
    if (!amt || amt <= 0) return;
    const curBalance = session?.balance ?? 4200;
    const curFree = session?.freeBalance ?? 2950;
    const nextBalance = curBalance + amt;
    const nextFree = curFree + amt;

    updateProfile({ balance: nextBalance, freeBalance: nextFree });
    setShowTopup(false);
    setFlash(`${t("prof_topup_done")}${amt.toLocaleString()}`);
  };

  const [notifForm, setNotifForm] = useState(() => ({
    outbid: session?.notifications?.outbid ?? true,
    ending: session?.notifications?.ending ?? true,
    win: session?.notifications?.win ?? true,
    lots: session?.notifications?.lots ?? true,
    digest: session?.notifications?.digest ?? false,
    email: session?.notifications?.email ?? true,
    sms: session?.notifications?.sms ?? true,
    push: session?.notifications?.push ?? true,
  }));

  useEffect(() => {
    if (session?.notifications) {
      setNotifForm((prev) => ({ ...prev, ...session.notifications }));
    }
  }, [session]);

  const handleNotifToggle = (key) => {
    setNotifForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    updateProfile({ notifications: notifForm });
    setFlash(t("prof_notif_saved") || "Ծանուցումների կարգավորումները պահպանվեցին:");
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
                    <div className="balance-amount">
                      ${(session?.balance ?? 4200).toLocaleString()}
                    </div>
                    <small className="balance-meta">
                      <span>{t("prof_bal_free")}</span>{" "}
                      <b>${(session?.freeBalance ?? 2950).toLocaleString()}</b>{" "}
                      <span>{t("prof_bal_locked")}</span>{" "}
                      <b>${(session?.lockedBalance ?? 1250).toLocaleString()}</b>
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn pri sm"
                    onClick={handleTopupClick}
                  >
                    {t("prof_topup_btn")}
                  </button>
                </div>

                {showTopup && (
                  <div className="topup-expand-panel">
                    <h4 className="topup-panel-title">{t("prof_topup_panel_title")}</h4>
                    <form onSubmit={handleExecuteTopup}>
                      <div className="topup-preset-row">
                        {[100, 500, 1000, 2500].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            className={`topup-preset-btn ${topupAmount === preset ? "active" : ""}`}
                            onClick={() => setTopupAmount(preset)}
                          >
                            +${preset.toLocaleString()}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-2">
                        <div className="form-group">
                          <label className="form-label">{t("prof_topup_amount_lbl")}</label>
                          <input
                            type="number"
                            min="10"
                            step="10"
                            className="form-input"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(Number(e.target.value))}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">{t("prof_topup_card_lbl")}</label>
                          <select
                            className="form-select"
                            value={topupCardId || (cards.find((c) => c.isPrimary)?.id || cards[0]?.id || "")}
                            onChange={(e) => setTopupCardId(e.target.value)}
                          >
                            {cards.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.brand} •••• {c.last4} {c.isPrimary ? `(${t("prof_card_primary")})` : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="topup-actions-row">
                        <button type="submit" className="btn pri sm">
                          {t("prof_topup_confirm_btn")}
                        </button>
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => setShowTopup(false)}
                        >
                          {t("prof_topup_cancel_btn")}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="add-card-header">
                  <h3 className="security-card-title">{t("prof_cards_title")}</h3>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={scrollToCardForm}
                  >
                    {t("prof_card_add_title")}
                  </button>
                </div>

                {cards.length === 0 ? (
                  <div className="empty-cards-state">
                    {t("prof_no_cards_yet")}
                  </div>
                ) : (
                  cards.map((card) => (
                    <div key={card.id} className="payment-card-box">
                      <div className="payment-card-left">
                        <span className="payment-card-icon">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                        </span>
                        <div>
                          <b className="payment-card-num">{card.brand} {card.num}</b>
                          <small className="payment-card-sub">
                            {t("prof_card_exp")}՝ {card.exp} · {card.holder}
                          </small>
                        </div>
                      </div>
                      <div className="payment-card-actions">
                        {card.isPrimary ? (
                          <span className="chip ok">{t("prof_card_primary")}</span>
                        ) : (
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => handleMakePrimary(card.id)}
                            title={t("prof_card_make_primary")}
                          >
                            {t("prof_card_make_primary")}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn sm bad"
                          onClick={() => handleRemoveCard(card.id)}
                          title={t("prof_rm_card_title")}
                        >
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                          {" "}
                          <span>{t("prof_rm_card_title")}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* ADD NEW CARD FORM */}
                <div
                  className={`add-card-section ${highlightCardForm ? "highlight-target" : ""}`}
                  id="new-card-form"
                  ref={newCardFormRef}
                >
                  <div className="add-card-header">
                    <h4 className="add-card-title">{t("prof_card_add_title")}</h4>
                    <div className="card-brand-preview-badges">
                      <span className={`brand-pill ${detectedBrand === "Mastercard" ? "active" : ""}`}>
                        Mastercard
                      </span>
                      <span className={`brand-pill ${detectedBrand === "Visa" ? "active" : ""}`}>
                        Visa
                      </span>
                      <span className={`brand-pill ${detectedBrand === "ArCa" ? "active" : ""}`}>
                        ArCa
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleAddCard}>
                    <div className="form-group">
                      <label className="form-label">{t("prof_card_num")}</label>
                      <div className="card-input-wrapper">
                        <input
                          ref={cardNumInputRef}
                          type="text"
                          className="form-input"
                          placeholder="0000 0000 0000 0000"
                          value={cardForm.number}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          required
                        />
                        {detectedBrand && (
                          <span className="card-detected-brand">{detectedBrand}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">{t("prof_card_exp")}</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YY"
                          value={cardForm.exp}
                          onChange={handleCardExpChange}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV / CVC</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="•••"
                          value={cardForm.cvv}
                          onChange={(e) =>
                            setCardForm((prev) => ({
                              ...prev,
                              cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                            }))
                          }
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t("prof_card_holder")}</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder={
                          `${session?.firstName || "KHACHATUR"} ${session?.lastName || "AYVAZYAN"}`.toUpperCase()
                        }
                        value={cardForm.holder}
                        onChange={(e) =>
                          setCardForm((prev) => ({
                            ...prev,
                            holder: e.target.value.toUpperCase(),
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="notification-row">
                        <input
                          type="checkbox"
                          className="notification-checkbox"
                          checked={cardForm.isPrimary}
                          onChange={(e) =>
                            setCardForm((prev) => ({
                              ...prev,
                              isPrimary: e.target.checked,
                            }))
                          }
                        />
                        <div className="notification-text-wrap">
                          <b className="notification-name">{t("prof_card_make_primary_label")}</b>
                        </div>
                      </label>
                    </div>

                    <button type="submit" className="btn pri profile-save-btn">
                      {t("prof_card_save")}
                    </button>
                  </form>
                </div>
              </div>

              {/* PANE 5: NOTIFICATIONS */}
              <div
                id="pane-notifications"
                className={`profile-tab-pane ${activeTab === "notifications" ? "active" : ""}`}
              >
                <h2 className="profile-section-title">{t("prof_notif_title")}</h2>
                <p className="profile-section-desc">{t("prof_notif_desc")}</p>

                <form onSubmit={handleSaveNotifications}>
                  {/* GROUP 1: AUCTION EVENTS */}
                  <div className="notification-group">
                    <div className="notification-group-title">{t("prof_notif_events")}</div>

                    {/* 1. Outbid alert */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.outbid}
                        onChange={() => handleNotifToggle("outbid")}
                      />
                      <div className="notification-text-wrap">
                        <b className="notification-name">{t("prof_notif_outbid")}</b>
                        <small className="notification-sub">{t("prof_notif_outbid_d")}</small>
                      </div>
                    </label>

                    {/* 2. Auction ending reminder */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.ending}
                        onChange={() => handleNotifToggle("ending")}
                      />
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

                    {/* 3. Winning bid notification */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.win}
                        onChange={() => handleNotifToggle("win")}
                      />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                            <circle cx="12" cy="8" r="6" />
                          </svg>{" "}
                          <span>{t("prof_notif_win")}</span>
                        </b>
                        <small className="notification-sub">{t("prof_notif_win_d")}</small>
                      </div>
                    </label>

                    {/* 4. New lots in favorite categories */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.lots}
                        onChange={() => handleNotifToggle("lots")}
                      />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                          </svg>{" "}
                          <span>{t("prof_notif_lots")}</span>
                        </b>
                        <small className="notification-sub">{t("prof_notif_lots_d")}</small>
                      </div>
                    </label>

                    {/* 5. Gavel weekly digest */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.digest}
                        onChange={() => handleNotifToggle("digest")}
                      />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                            <path d="M18 14h-8" />
                            <path d="M15 18h-5" />
                            <path d="M10 6h8v4h-8V6Z" />
                          </svg>{" "}
                          <span>{t("prof_notif_digest")}</span>
                        </b>
                        <small className="notification-sub">{t("prof_notif_digest_d")}</small>
                      </div>
                    </label>
                  </div>

                  {/* GROUP 2: NOTIFICATION CHANNELS */}
                  <div className="notification-group">
                    <div className="notification-group-title">{t("prof_notif_channels")}</div>

                    {/* Channel 1: Email */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.email}
                        onChange={() => handleNotifToggle("email")}
                      />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>{" "}
                          <span>{t("lbl_email")}</span> ({session?.email || "garik@example.com"})
                        </b>
                        <small className="notification-sub">{t("prof_notif_email_d")}</small>
                      </div>
                    </label>

                    {/* Channel 2: SMS */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.sms}
                        onChange={() => handleNotifToggle("sms")}
                      />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                          </svg>{" "}
                          <span>{t("prof_notif_sms")}</span> ({session?.phone || "+374 98 765432"})
                        </b>
                        <small className="notification-sub">{t("prof_notif_sms_d")}</small>
                      </div>
                    </label>

                    {/* Channel 3: Browser Push */}
                    <label className="notification-row">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={notifForm.push}
                        onChange={() => handleNotifToggle("push")}
                      />
                      <div className="notification-text-wrap">
                        <b className="notification-name">
                          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                          </svg>{" "}
                          <span>{t("prof_notif_push")}</span>
                        </b>
                        <small className="notification-sub">{t("prof_notif_push_d")}</small>
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
