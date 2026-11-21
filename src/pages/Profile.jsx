import "../styles/profile.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { t } = useI18n();
  usePageTitle("title_profile");
  const { logout } = useAuth();
  function handleLogout() {
    if (window.confirm(t("logout_confirm"))) logout();
  }

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

              <input type="radio" name="profile-tab" id="tab-info" className="tab-radio" defaultChecked />
              <input type="radio" name="profile-tab" id="tab-security" className="tab-radio" />
              <input type="radio" name="profile-tab" id="tab-payment" className="tab-radio" />
              <input type="radio" name="profile-tab" id="tab-notifications" className="tab-radio" />

              <aside>
                <div className="user-profile-card">
                  <div className="big-avatar"><img src="/images/avatar-user.jpg" alt="Գարիկ Հարությունյան" /></div>
                  <h3 className="profile-user-name">Գարիկ Հարությունյան</h3>
                  <p className="profile-user-email">garik@example.com</p>
                  <span className="chip profile-role-badge">{t("prof_role_user")}</span>

                  <div className="profile-nav">
                    <label htmlFor="tab-info" className="profile-nav-btn tab-btn-info">
                      <span className="tab-btn-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span> <span>{t("prof_tab_personal")}</span>
                    </label>
                    <label htmlFor="tab-security" className="profile-nav-btn tab-btn-security">
                      <span className="tab-btn-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> <span>{t("prof_tab_security")}</span>
                    </label>
                    <label htmlFor="tab-payment" className="profile-nav-btn tab-btn-payment">
                      <span className="tab-btn-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></span> <span>{t("prof_tab_payment")}</span>
                    </label>
                    <label htmlFor="tab-notifications" className="profile-nav-btn tab-btn-notifications">
                      <span className="tab-btn-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></span> <span>{t("prof_tab_notif")}</span>
                    </label>
                  </div>
                  <div className="profile-logout-box">
                    <button type="button" className="btn sm bad full profile-logout-btn" id="btn-profile-logout" onClick={handleLogout}>{t("btn_logout")}</button>
                  </div>
                </div>
              </aside>

              <section className="profile-content-card">

                <div id="pane-info" className="profile-tab-pane">
                  <h2 className="profile-section-title">{t("prof_tab_personal")}</h2>
                  <p className="profile-section-desc">{t("prof_personal_desc")}</p>

                  <form action="/profile" method="get">
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">{t("lbl_first_name_req")}</label>
                        <input type="text" className="form-input" defaultValue="Գարիկ" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("lbl_last_name_req")}</label>
                        <input type="text" className="form-input" defaultValue="Հարությունյան" required />
                      </div>
                    </div>

                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">{t("lbl_email_req")}</label>
                        <input type="email" className="form-input" defaultValue="garik@example.com" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("lbl_phone_req")}</label>
                        <input type="tel" className="form-input" defaultValue="+374 98 765432" required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t("prof_lbl_address")}</label>
                      <input type="text" className="form-input" defaultValue="ք. Երևան, Տերյան 105, բն. 24" required />
                    </div>

                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">{t("prof_lbl_city")}</label>
                        <input type="text" className="form-input" defaultValue="Երևան, Կենտրոն" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("prof_lbl_zip")}</label>
                        <input type="text" className="form-input" defaultValue="0009" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t("prof_lbl_bio")}</label>
                      <textarea className="form-textarea" placeholder={t("prof_ph_bio")} defaultValue={"Անտիկվարիատի, շվեյցարական ժամացույցների և հայկական արվեստի գործերի սիրահար ու հավաքորդ:"}></textarea>
                    </div>

                    <button type="submit" className="btn pri profile-save-btn">{t("prof_save_btn")}</button>
                  </form>
                </div>

                <div id="pane-security" className="profile-tab-pane">
                  <h2 className="profile-section-title">{t("prof_sec_title")}</h2>
                  <p className="profile-section-desc">{t("prof_sec_desc")}</p>

                  <form action="/profile" method="get">
                    <div className="form-group">
                      <label className="form-label">{t("prof_cur_pass")}</label>
                      <input type="password" className="form-input" placeholder="••••••••••••" />
                    </div>

                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">{t("prof_new_pass")}</label>
                        <input type="password" className="form-input" placeholder={t("prof_ph_new_pass")} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("prof_rep_pass")}</label>
                        <input type="password" className="form-input" placeholder={t("prof_ph_rep_pass")} />
                      </div>
                    </div>

                    <button type="submit" className="btn pri profile-save-btn">{t("prof_upd_pass_btn")}</button>
                  </form>

                  <div className="security-group-card">
                    <div className="security-card-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg> <span>{t("prof_2fa_title")}</span></div>
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
                    <div className="security-card-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg> <span>{t("prof_sessions_title")}</span></div>
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
                        <div className="session-meta">Երևան, Հայաստան · Վերջին ակտիվությունը՝ 2 ժամ առաջ</div>
                      </div>
                      <label className="session-term-toggle" title={t("prof_end_sess_title")}>
                        <input type="checkbox" className="session-term-cb" />
                        <span className="btn sm bad btn-term-act">{t("prof_end_session")}</span>
                        <span className="chip btn-term-done">{t("chip_ended")}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div id="pane-payment" className="profile-tab-pane">
                  <h2 className="profile-section-title">{t("prof_pay_title")}</h2>
                  <p className="profile-section-desc">{t("prof_pay_desc")}</p>

                  <div className="balance-overview-box">
                    <div>
                      <span className="balance-label">{t("prof_bal_title")}</span>
                      <div className="balance-amount">$4,200</div>
                      <small className="balance-meta"><span>{t("prof_bal_free")}</span> <b>$2,950</b> <span>{t("prof_bal_locked")}</span> <b>$1,250</b></small>
                    </div>
                    <a href="#new-card-form" className="btn pri sm">{t("prof_topup_btn")}</a>
                  </div>

                  <h3 className="security-card-title">{t("prof_cards_title")}</h3>

                  <div className="payment-card-box">
                    <div className="payment-card-left">
                      <span className="payment-card-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></span>
                      <div>
                        <b className="payment-card-num">Mastercard •••• 4242</b>
                        <small className="payment-card-sub">Ժամկետ՝ 12/28 · Հիմնական վճարման քարտ</small>
                      </div>
                    </div>
                    <div className="payment-card-actions">
                      <span className="chip ok">{t("prof_card_primary")}</span>
                      <label className="card-del-toggle" title={t("prof_rm_card_title")}>
                        <input type="checkbox" className="card-del-cb" />
                        <span className="btn sm bad"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Հեռացնել</span>
                      </label>
                    </div>
                  </div>

                  <div className="payment-card-box">
                    <div className="payment-card-left">
                      <span className="payment-card-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></span>
                      <div>
                        <b className="payment-card-num">Visa Gold •••• 8819</b>
                        <small className="payment-card-sub">Ժամկետ՝ 09/27 · Պահուստային քարտ</small>
                      </div>
                    </div>
                    <div className="payment-card-actions">
                      <label className="card-primary-toggle" title={t("prof_card_make_primary")}>
                        <input type="checkbox" className="card-primary-cb" />
                        <span className="btn sm btn-make-primary">{t("prof_card_make_primary")}</span>
                        <span className="chip ok chip-primary-now"><svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> Հիմնական</span>
                      </label>
                      <label className="card-del-toggle" title={t("prof_rm_card_title")}>
                        <input type="checkbox" className="card-del-cb" />
                        <span className="btn sm bad"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Հեռացնել</span>
                      </label>
                    </div>
                  </div>

                  <div className="add-card-section" id="new-card-form">
                    <h4 className="add-card-title">{t("prof_card_add_title")}</h4>
                    <form action="/profile" method="get">
                      <div className="form-group">
                        <label className="form-label">{t("prof_card_num")}</label>
                        <input type="text" className="form-input" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-2">
                        <div className="form-group">
                          <label className="form-label">{t("prof_card_exp")}</label>
                          <input type="text" className="form-input" placeholder="MM/YY" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV / CVC</label>
                          <input type="password" className="form-input" placeholder="•••" maxLength="4" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("prof_card_holder")}</label>
                        <input type="text" className="form-input" placeholder="GARIK HARUTYUNYAN" />
                      </div>
                      <button type="submit" className="btn pri sm">{t("prof_card_save")}</button>
                    </form>
                  </div>
                </div>

                <div id="pane-notifications" className="profile-tab-pane">
                  <h2 className="profile-section-title">{t("prof_notif_title")}</h2>
                  <p className="profile-section-desc">{t("prof_notif_desc")}</p>

                  <form action="/profile" method="get">
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
                          <b className="notification-name"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> <span>{t("prof_notif_ending")}</span></b>
                          <small className="notification-sub">{t("prof_notif_ending_d")}</small>
                        </div>
                      </label>

                      <label className="notification-row">
                        <input type="checkbox" defaultChecked className="notification-checkbox" />
                        <div className="notification-text-wrap">
                          <b className="notification-name"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg> Հաղթանակի ծանուցում</b>
                          <small className="notification-sub">{t("prof_notif_win_d")}</small>
                        </div>
                      </label>

                      <label className="notification-row">
                        <input type="checkbox" defaultChecked className="notification-checkbox" />
                        <div className="notification-text-wrap">
                          <b className="notification-name"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg> <span>{t("prof_notif_lots")}</span></b>
                          <small className="notification-sub">{t("prof_notif_lots_d")}</small>
                        </div>
                      </label>

                      <label className="notification-row">
                        <input type="checkbox" className="notification-checkbox" />
                        <div className="notification-text-wrap">
                          <b className="notification-name"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg> <span>{t("prof_notif_digest")}</span></b>
                          <small className="notification-sub">{t("prof_notif_digest_d")}</small>
                        </div>
                      </label>
                    </div>

                    <div className="notification-group">
                      <div className="notification-group-title">{t("prof_notif_channels")}</div>

                      <label className="notification-row">
                        <input type="checkbox" defaultChecked className="notification-checkbox" />
                        <div className="notification-text-wrap">
                          <b className="notification-name"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> <span>{t("lbl_email")}</span> (garik@example.com)</b>
                          <small className="notification-sub">{t("prof_notif_email_d")}</small>
                        </div>
                      </label>

                      <label className="notification-row">
                        <input type="checkbox" defaultChecked className="notification-checkbox" />
                        <div className="notification-text-wrap">
                          <b className="notification-name"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg> SMS հաղորդագրություն (+374 98 765432)</b>
                          <small className="notification-sub">{t("prof_notif_sms_d")}</small>
                        </div>
                      </label>

                      <label className="notification-row">
                        <input type="checkbox" defaultChecked className="notification-checkbox" />
                        <div className="notification-text-wrap">
                          <b className="notification-name"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> Բրաուզերի Push ծանուցումներ</b>
                          <small className="notification-sub">{t("prof_notif_push_d")}</small>
                        </div>
                      </label>
                    </div>

                    <button type="submit" className="btn pri profile-save-btn">{t("prof_notif_save")}</button>
                  </form>
                </div>

              </section>
            </div>
          </div>
        </main>


    </>
  );
}
