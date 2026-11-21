import "../styles/add-lot.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AddLot() {
  const { t } = useI18n();
  usePageTitle("title_add_lot");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <Link to="/my-lots">{t("nav_my_lots")}</Link>
              <span>›</span>
              <span>{t("cta_btn")}</span>
            </div>

            <div className="wizard-box">

              <input type="radio" name="wizard-step" id="wstep-1" className="wizard-tab-radio" defaultChecked />
              <input type="radio" name="wizard-step" id="wstep-2" className="wizard-tab-radio" />
              <input type="radio" name="wizard-step" id="wstep-3" className="wizard-tab-radio" />
              <input type="radio" name="wizard-step" id="wstep-4" className="wizard-tab-radio" />

              <div className="wizard-steps">
                <label htmlFor="wstep-1" className="step-item step-nav-1"><span className="step-badge">1</span> Տվյալներ</label>
                <label htmlFor="wstep-2" className="step-item step-nav-2"><span className="step-badge">2</span> Լուսանկարներ</label>
                <label htmlFor="wstep-3" className="step-item step-nav-3"><span className="step-badge">3</span> Գին և չափսեր</label>
                <label htmlFor="wstep-4" className="step-item step-nav-4"><span className="step-badge">4</span> Աճուրդ</label>
              </div>

              <form className="wizard-body" action="/my-lots" method="get">

                <div className="wizard-pane wizard-pane-1">
                  <h2 className="wizard-pane-title">{t("al_s1_title")}</h2>
                  <p className="wizard-pane-desc">{t("al_s1_desc")}</p>

                  <div className="form-group">
                    <label className="form-label">{t("al_lbl_title")}</label>
                    <input type="text" className="form-input" defaultValue="Հին շվեյցարական գրպանի ժամացույց" required placeholder={t("al_ph_title")} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("al_lbl_cat")}</label>
                    <select className="form-select" defaultValue="0">
                      <option value="0">{t("cat_watches")}</option>
                      <option value="1">{t("cat_art")}</option>
                      <option value="2">{t("cat_carpets")}</option>
                      <option value="3">{t("cat_ceramics")}</option>
                      <option value="4">{t("cat_furniture")}</option>
                      <option value="5">{t("cat_books")}</option>
                      <option value="6">{t("cat_jewellery")}</option>
                      <option value="7">{t("cat_cars")}</option>
                      <option value="8">{t("cat_collectibles")}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("al_lbl_cond")}</label>
                    <select className="form-select" defaultValue="excellent">
                      <option value="excellent">{t("al_cond_exc")}</option>
                      <option value="good">{t("al_cond_good")}</option>
                      <option value="restored">{t("al_cond_rest")}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("al_lbl_desc")}</label>
                    <textarea className="form-textarea" required placeholder={t("al_ph_desc")} defaultValue={"Բացառիկ պահպանվածությամբ շվեյցարական գրպանի ժամացույց: Պատրաստված է 875 հարգի արծաթից, մեխանիկական լարով, աշխատող վիճակում:"}></textarea>
                  </div>

                  <div className="wizard-pane-nav">
                    <Link to="/my-lots" className="btn">{t("al_cancel")}</Link>
                    <label htmlFor="wstep-2" className="btn pri">{t("al_next_photos")}</label>
                  </div>
                </div>

                <div className="wizard-pane wizard-pane-2">
                  <h2 className="wizard-pane-title">{t("al_s2_title")}</h2>
                  <p className="wizard-pane-desc">{t("al_s2_desc")}</p>

                  <div className="dropzone">
                    <div className="dropzone-icon"><svg className="ico ico-lg" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>
                    <b>{t("al_drop_title")}</b>
                    <p className="dropzone-hint">{t("al_drop_hint")}</p>
                  </div>

                  <div className="photo-previews">
                    <div className="preview-card">
                      <input type="checkbox" id="del-p1" className="photo-del-cb" />
                      <img src="/images/lot-watch.jpg" alt="Գլխավոր նկար (Դիմացից)" />
                      <span>{t("al_photo_main")}</span>
                      <label htmlFor="del-p1" className="preview-remove-btn" title={t("btn_remove")}><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></label>
                    </div>
                    <div className="preview-card">
                      <input type="checkbox" id="del-p2" className="photo-del-cb" />
                      <img src="/images/watch-side.jpg" alt="Դետալ 1 (Կողքից)" />
                      <span>{t("al_photo_detail1")}</span>
                      <label htmlFor="del-p2" className="preview-remove-btn" title={t("btn_remove")}><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></label>
                    </div>
                    <div className="preview-card">
                      <input type="checkbox" id="del-p3" className="photo-del-cb" />
                      <img src="/images/watch-mech.jpg" alt="Մեխանիզմ" />
                      <span>{t("al_photo_mech")}</span>
                      <label htmlFor="del-p3" className="preview-remove-btn" title={t("btn_remove")}><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></label>
                    </div>
                  </div>

                  <div className="wizard-pane-nav">
                    <label htmlFor="wstep-1" className="btn">{t("al_prev")}</label>
                    <label htmlFor="wstep-3" className="btn pri">{t("al_next_price")}</label>
                  </div>
                </div>

                <div className="wizard-pane wizard-pane-3">
                  <h2 className="wizard-pane-title">{t("al_s3_title")}</h2>
                  <p className="wizard-pane-desc">{t("al_s3_desc")}</p>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{t("al_lbl_start_price")}</label>
                      <input type="number" className="form-input" defaultValue="1200" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t("al_lbl_step")}</label>
                      <input type="number" className="form-input" defaultValue="50" />
                    </div>
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{t("det_dims")}</label>
                      <input type="text" className="form-input" defaultValue="52 մմ տրամագիծ, 85 գրամ" placeholder={t("al_ph_dims")} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t("al_lbl_origin")}</label>
                      <input type="text" className="form-input" defaultValue="Ժնև, Շվեյցարիա" placeholder={t("al_ph_origin")} />
                    </div>
                  </div>

                  <div className="wizard-pane-nav">
                    <label htmlFor="wstep-2" className="btn">{t("al_prev")}</label>
                    <label htmlFor="wstep-4" className="btn pri">{t("al_next_auction")}</label>
                  </div>
                </div>

                <div className="wizard-pane wizard-pane-4">
                  <h2 className="wizard-pane-title">{t("al_s4_title")}</h2>
                  <p className="wizard-pane-desc">{t("al_s4_desc")}</p>

                  <div className="form-group">
                    <label className="form-label">{t("al_lbl_duration")}</label>
                    <select className="form-select" defaultValue="7">
                      <option value="3">{t("al_dur_3")}</option>
                      <option value="7">{t("al_dur_7")}</option>
                      <option value="14">{t("al_dur_14")}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("al_lbl_contact_phone")}</label>
                    <input type="tel" className="form-input" defaultValue="+374 91 123456" required />
                  </div>

                  <div className="moderation-note-box">
                    <h4 className="moderation-note-title"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> <span>{t("al_mod_title")}</span></h4>
                    <p className="moderation-note-desc">{t("al_mod_desc")}</p>
                  </div>

                  <div className="wizard-pane-nav">
                    <label htmlFor="wstep-3" className="btn">{t("al_prev")}</label>
                    <div className="wizard-nav-right">
                      <button type="submit" className="btn pri">Տեղադրել աճուրդի <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>


    </>
  );
}
