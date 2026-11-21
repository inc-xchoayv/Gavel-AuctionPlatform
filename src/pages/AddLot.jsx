import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/add-lot.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";

export default function AddLot() {
  const { t } = useI18n();
  usePageTitle("title_add_lot");
  const { user, setFlash } = useAuth();
  const { addLot } = useLots();
  const navigate = useNavigate();

  // Wizard Step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState("Հին շվեյցարական գրպանի ժամացույց");
  const [categoryId, setCategoryId] = useState("watches");
  const [condition, setCondition] = useState("excellent");
  const [description, setDescription] = useState(
    "Բացառիկ պահպանվածությամբ շվեյցարական գրպանի ժամացույց: Պատրաստված է 875 հարգի արծաթից, մեխանիկական լարով, աշխատող վիճակում:"
  );

  // Photos State
  const [photos, setPhotos] = useState([
    { id: 1, src: "/images/lot-watch.jpg", labelKey: "al_photo_main" },
    { id: 2, src: "/images/watch-side.jpg", labelKey: "al_photo_detail1" },
    { id: 3, src: "/images/watch-mech.jpg", labelKey: "al_photo_mech" },
  ]);

  // Pricing & Dimensions
  const [startPrice, setStartPrice] = useState("1200");
  const [stepPrice, setStepPrice] = useState("50");
  const [dimensions, setDimensions] = useState("52 մմ տրամագիծ, 85 գրամ");
  const [origin, setOrigin] = useState("Ժնև, Շվեյցարիա");

  // Auction Terms
  const [duration, setDuration] = useState("7");
  const [contactPhone, setContactPhone] = useState("+374 91 123456");

  const removePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const created = addLot({
      title: title.trim() || "Անանուն նոր լոտ",
      categoryId,
      startingPrice: Number(startPrice) || 100,
      minIncrement: Number(stepPrice) || 20,
      image: photos[0]?.src || "/images/lot-watch.jpg",
      gallery: photos.map((p) => p.src),
      durationDays: Number(duration) || 7,
      specs: {
        condition,
        dimensions,
        origin,
      },
      description,
      seller: {
        id: user?.id || "u_seller",
        name: user?.name || "Վաճառող",
        verified: true,
        rating: 5.0,
      },
    });

    setFlash(t("al_mod_desc") || "Լոտը հաջողությամբ ավելացվել է աճուրդների ցանկում:");
    navigate(`/auctions`);
  };

  return (
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
          {/* Radio triggers for CSS-based wizard styling */}
          <input
            type="radio"
            name="wizard-step"
            id="wstep-1"
            className="wizard-tab-radio"
            checked={currentStep === 1}
            onChange={() => setCurrentStep(1)}
          />
          <input
            type="radio"
            name="wizard-step"
            id="wstep-2"
            className="wizard-tab-radio"
            checked={currentStep === 2}
            onChange={() => setCurrentStep(2)}
          />
          <input
            type="radio"
            name="wizard-step"
            id="wstep-3"
            className="wizard-tab-radio"
            checked={currentStep === 3}
            onChange={() => setCurrentStep(3)}
          />
          <input
            type="radio"
            name="wizard-step"
            id="wstep-4"
            className="wizard-tab-radio"
            checked={currentStep === 4}
            onChange={() => setCurrentStep(4)}
          />

          <div className="wizard-steps">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="step-item step-nav-1"
            >
              <span className="step-badge">1</span> Տվյալներ
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="step-item step-nav-2"
            >
              <span className="step-badge">2</span> Լուսանկարներ
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="step-item step-nav-3"
            >
              <span className="step-badge">3</span> Գին և չափսեր
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="step-item step-nav-4"
            >
              <span className="step-badge">4</span> Աճուրդ
            </button>
          </div>

          <form className="wizard-body" onSubmit={handleSubmit}>
            {/* Step 1: Info */}
            <div className="wizard-pane wizard-pane-1">
              <h2 className="wizard-pane-title">{t("al_s1_title")}</h2>
              <p className="wizard-pane-desc">{t("al_s1_desc")}</p>

              <div className="form-group">
                <label className="form-label">{t("al_lbl_title")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder={t("al_ph_title")}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t("al_lbl_cat")}</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="watches">{t("cat_watches")}</option>
                  <option value="art">{t("cat_art")}</option>
                  <option value="interiors">{t("cat_carpets")}</option>
                  <option value="books">{t("cat_books")}</option>
                  <option value="jewellery">{t("cat_jewellery")}</option>
                  <option value="cars">{t("cat_cars")}</option>
                  <option value="classic-cars">{t("cat_classic_cars") || "Դասական մեքենաներ"}</option>
                  <option value="coins-stamps">{t("cat_collectibles")}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t("al_lbl_cond")}</label>
                <select
                  className="form-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="excellent">{t("al_cond_exc")}</option>
                  <option value="good">{t("al_cond_good")}</option>
                  <option value="restored">{t("al_cond_rest")}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t("al_lbl_desc")}</label>
                <textarea
                  className="form-textarea"
                  required
                  placeholder={t("al_ph_desc")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="wizard-pane-nav">
                <Link to="/my-lots" className="btn">
                  {t("al_cancel")}
                </Link>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn pri"
                >
                  {t("al_next_photos")}
                </button>
              </div>
            </div>

            {/* Step 2: Photos */}
            <div className="wizard-pane wizard-pane-2">
              <h2 className="wizard-pane-title">{t("al_s2_title")}</h2>
              <p className="wizard-pane-desc">{t("al_s2_desc")}</p>

              <div className="dropzone">
                <div className="dropzone-icon">
                  <svg className="ico ico-lg" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <b>{t("al_drop_title")}</b>
                <p className="dropzone-hint">{t("al_drop_hint")}</p>
              </div>

              <div className="photo-previews">
                {photos.map((photo) => (
                  <div key={photo.id} className="preview-card">
                    <img src={photo.src} alt={t(photo.labelKey)} />
                    <span>{t(photo.labelKey)}</span>
                    <button
                      type="button"
                      className="preview-remove-btn"
                      title={t("btn_remove")}
                      onClick={() => removePhoto(photo.id)}
                    >
                      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="wizard-pane-nav">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn"
                >
                  {t("al_prev")}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn pri"
                >
                  {t("al_next_price")}
                </button>
              </div>
            </div>

            {/* Step 3: Price & Dimensions */}
            <div className="wizard-pane wizard-pane-3">
              <h2 className="wizard-pane-title">{t("al_s3_title")}</h2>
              <p className="wizard-pane-desc">{t("al_s3_desc")}</p>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">{t("al_lbl_start_price")}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t("al_lbl_step")}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={stepPrice}
                    onChange={(e) => setStepPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">{t("det_dims")}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder={t("al_ph_dims")}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t("al_lbl_origin")}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder={t("al_ph_origin")}
                  />
                </div>
              </div>

              <div className="wizard-pane-nav">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn"
                >
                  {t("al_prev")}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="btn pri"
                >
                  {t("al_next_auction")}
                </button>
              </div>
            </div>

            {/* Step 4: Auction duration & confirmation */}
            <div className="wizard-pane wizard-pane-4">
              <h2 className="wizard-pane-title">{t("al_s4_title")}</h2>
              <p className="wizard-pane-desc">{t("al_s4_desc")}</p>

              <div className="form-group">
                <label className="form-label">{t("al_lbl_duration")}</label>
                <select
                  className="form-select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="3">{t("al_dur_3")}</option>
                  <option value="7">{t("al_dur_7")}</option>
                  <option value="14">{t("al_dur_14")}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t("al_lbl_contact_phone")}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>

              <div className="moderation-note-box">
                <h4 className="moderation-note-title">
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>{" "}
                  <span>{t("al_mod_title")}</span>
                </h4>
                <p className="moderation-note-desc">{t("al_mod_desc")}</p>
              </div>

              <div className="wizard-pane-nav">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn"
                >
                  {t("al_prev")}
                </button>
                <div className="wizard-nav-right">
                  <button type="submit" className="btn pri">
                    Տեղադրել աճուրդի{" "}
                    <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
