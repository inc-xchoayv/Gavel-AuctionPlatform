import React, { useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";

export default function HumanVerification({ onGoToPersonal }) {
  const { session, updateAvatar, updateVerification, setFlash } = useAuth();
  const { t } = useI18n();

  const avatarInputRef = useRef(null);
  const docInputRef = useRef(null);

  const verif = session?.verification || {};
  const [status, setStatus] = useState(verif.status || "unverified");
  const [idNumber, setIdNumber] = useState(verif.idNumber || "");
  const [citizenship, setCitizenship] = useState(verif.citizenship || "am");
  const [firstName, setFirstName] = useState(verif.firstName || session?.firstName || "");
  const [lastName, setLastName] = useState(verif.lastName || session?.lastName || "");
  const [dob, setDob] = useState(verif.dob || "");
  const [phone, setPhone] = useState(verif.phone || session?.phone || "+374 94 552234");
  const [files, setFiles] = useState(verif.files || []);

  // Completeness items
  const hasFiles = files.length > 0;
  const hasId = idNumber.trim().length > 0;
  const hasName = firstName.trim().length > 0;
  const hasSurname = lastName.trim().length > 0;
  const hasDob = dob.trim().length > 0;
  const hasPhone = phone.trim().length > 0;
  const isVerified = status === "verified";

  let progress = 0;
  if (hasFiles) progress += 10;
  if (hasId) progress += 14;
  if (hasName) progress += 14;
  if (hasSurname) progress += 14;
  if (hasDob) progress += 14;
  if (hasPhone) progress += 14;
  if (isVerified) progress += 20;

  // Donut SVG circumference calculation (r = 40)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const handleAvatarChange = (e) => {
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

  const handleDocUpload = (e) => {
    const uploaded = Array.from(e.target.files || []);
    if (uploaded.length === 0) return;

    if (files.length + uploaded.length > 5) {
      alert("Դուք կարող եք վերբեռնել առավելագույնը 5 ֆայլ:");
      return;
    }

    const newFiles = uploaded.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));

    const nextList = [...files, ...newFiles];
    setFiles(nextList);
    updateVerification({ files: nextList });
    setFlash("Փաստաթուղթը հաջողությամբ կցվեց");
  };

  const handleRemoveFile = (index) => {
    const nextList = files.filter((_, i) => i !== index);
    setFiles(nextList);
    updateVerification({ files: nextList });
  };

  const handleSaveAndSubmit = (e) => {
    e?.preventDefault();
    const nextStatus = "pending";
    setStatus(nextStatus);
    updateVerification({
      idNumber,
      citizenship,
      firstName,
      lastName,
      dob,
      phone,
      files,
      status: nextStatus,
    });
    setFlash("Տվյալները հաջողությամբ ուղարկվեցին ստուգման:");
  };

  const handleSimulateApprove = () => {
    const nextStatus = "verified";
    setStatus(nextStatus);
    updateVerification({
      idNumber: idNumber || "AN0942851",
      citizenship,
      firstName: firstName || session?.firstName || "Գարիկ",
      lastName: lastName || session?.lastName || "Հարությունյան",
      dob: dob || "1994-08-15",
      phone: phone || "+374 94 552234",
      files: files.length > 0 ? files : [{ name: "passport_scan.pdf", size: "2.4 MB" }],
      status: nextStatus,
      verifiedAt: new Date().toISOString(),
    });
    if (files.length === 0) {
      setFiles([{ name: "passport_scan.pdf", size: "2.4 MB" }]);
    }
    setFlash("Շնորհավորում ենք: Պրոֆիլը հաստատված է մոդերատորի կողմից:");
  };

  const currentAvatar = session?.avatar || "/images/avatar-winner.svg";

  return (
    <div className="verification-page-layout">
      {/* Left Main Column */}
      <div className="verification-main-col">
        {/* Avatar header row */}
        <div className="verification-avatar-header">
          <div className="verification-avatar-img">
            <img src={currentAvatar} alt={session?.firstName || "User"} />
          </div>
          <button
            type="button"
            className="btn-change-avatar"
            onClick={() => avatarInputRef.current?.click()}
          >
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            <span>{t("prof_verif_change_avatar") || "Փոխել ավատարը"}</span>
          </button>
          <input
            type="file"
            ref={avatarInputRef}
            accept="image/*"
            className="hidden-file-input"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Moderator notice banner */}
        <div className="verification-notice">
          {t("prof_verif_notice") ||
            "Ձեր տվյալները լրացնելու կամ փոփոխելուց հետո պրոֆիլը կստուգվի մոդերատորի կողմից: Հաստատումից հետո Դուք կստանաք ծանուցում:"}
        </div>

        {/* Section 1: Identity Document */}
        <div className="verification-doc-section">
          <h3 className="verification-section-heading">
            {t("prof_verif_doc_title") || "Անձը հաստատող փաստաթուղթ"}
          </h3>
          <p className="verification-section-sub">
            {t("prof_verif_doc_sub") ||
              "Դուք կարող եք վերբեռնել մինչև 5 ֆայլ: Յուրաքանչյուր ֆայլի չափը պետք է լինի մինչև 6 ՄԲ:"}
          </p>

          <div className="doc-upload-action-row">
            <button
              type="button"
              className="btn-doc-upload"
              onClick={() => docInputRef.current?.click()}
            >
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              <span>{t("prof_verif_upload_btn") || "Բեռնել ֆայլ"}</span>
            </button>
            <span className="doc-upload-hint">
              {t("prof_verif_upload_hint") || "(Առավելագույնը՝ 6ՄԲ, միայն .pdf)"}
            </span>
            <input
              type="file"
              ref={docInputRef}
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden-file-input"
              onChange={handleDocUpload}
            />
          </div>

          {files.length === 0 ? (
            <div className="doc-no-file-msg">
              {t("prof_verif_no_file") || "Ֆայլ կցված չէ"}
            </div>
          ) : (
            <div className="doc-attached-list">
              {files.map((f, i) => (
                <div key={i} className="doc-file-item">
                  <span>📄 {f.name} ({f.size})</span>
                  <button
                    type="button"
                    className="doc-file-remove"
                    onClick={() => handleRemoveFile(i)}
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info callout */}
          <div className="doc-callout-box">
            <span className="doc-callout-icon">
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="16" y2="12" />
                <line x1="12" x2="12.01" y1="8" y2="8" />
              </svg>
            </span>
            <span className="doc-callout-text">
              {t("prof_verif_callout") ||
                "Կցված փաստաթուղթը պետք է լինի հստակ, առանց փայլի, և ամբողջությամբ տեսանելի՝ առանց կտրած եզրերի:"}
            </span>
          </div>
        </div>

        {/* Section 2: Form Fields */}
        <form onSubmit={handleSaveAndSubmit}>
          <h3 className="verification-section-heading">
            {t("prof_verif_fields_title") || "Լրացրեք դաշտերը՝ ըստ անձը հաստատող տվյալների:"}
          </h3>
          <p className="verification-section-sub">
            {t("prof_verif_fields_sub") || "Այս դաշտերը պարտադիր են առաջարկ ներկայացնելու համար:"}
          </p>

          <div className="verification-fields-grid">
            <div className="form-group">
              <label className="form-label">{t("prof_verif_id_num") || "Անձնագրի / ID համարը"}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t("prof_verif_id_num") || "Անձնագրի / ID համարը"}
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value);
                  updateVerification({ idNumber: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("prof_verif_citizenship") || "Քաղաքացիություն"}</label>
              <select
                className="form-input"
                value={citizenship}
                onChange={(e) => {
                  setCitizenship(e.target.value);
                  updateVerification({ citizenship: e.target.value });
                }}
              >
                <option value="am">Հայաստան (Armenia)</option>
                <option value="us">ԱՄՆ (USA)</option>
                <option value="ru">Ռուսաստան (Russia)</option>
                <option value="fr">Ֆրանսիա (France)</option>
                <option value="de">Գերմանիա (Germany)</option>
                <option value="ge">Վրաստան (Georgia)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t("prof_verif_first_name") || "Անուն"}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t("prof_verif_first_name") || "Անուն"}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  updateVerification({ firstName: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("prof_verif_last_name") || "Ազգանուն"}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t("prof_verif_last_name") || "Ազգանուն"}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  updateVerification({ lastName: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("prof_verif_dob") || "Ծննդյան ամսաթիվ"}</label>
              <input
                type="date"
                className="form-input"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  updateVerification({ dob: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("prof_verif_phone") || "Հեռախոսահամար *"}</label>
              <div className="phone-select-field">
                <div className="phone-flag-box">
                  <span>🇦🇲</span>
                  <small>▾</small>
                </div>
                <input
                  type="tel"
                  placeholder="+374 94 552234"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    updateVerification({ phone: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="verification-action-bar">
            {status === "unverified" && (
              <button type="submit" className="btn pri">
                {t("prof_verif_submit_btn") || "Ուղարկել ստուգման"}
              </button>
            )}

            {status === "pending" && (
              <>
                <span className="trust-badge-pill pending">
                  {t("prof_verif_status_pending") || "⏳ Տվյալները ստուգման փուլում են"}
                </span>
                <button
                  type="button"
                  className="btn sm"
                  onClick={handleSimulateApprove}
                >
                  {t("prof_verif_simulate_btn") || "⚡ Սիմուլացնել մոդերատորի հաստատումը"}
                </button>
              </>
            )}

            {status === "verified" && (
              <span className="trust-badge-pill">
                {t("prof_verif_status_verified") || "✓ Ինքնությունը հաստատված է (100% Վստահություն)"}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Right Sidebar Column */}
      <div className="verification-side-col">
        {onGoToPersonal && (
          <button
            type="button"
            className="btn-personal-header"
            onClick={onGoToPersonal}
          >
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{t("prof_verif_personal_page") || "Անհատական էջ"}</span>
          </button>
        )}

        {/* Profile Completeness Card */}
        <div className="completeness-card">
          <h4 className="completeness-card-title">
            {t("prof_verif_completeness") || "Պրոֆիլի լրացվածություն"}
          </h4>

          <div className="completeness-donut-container">
            <svg viewBox="0 0 100 100" className="completeness-donut-svg">
              <circle
                className="completeness-donut-bg"
                cx="50"
                cy="50"
                r={radius}
              />
              <circle
                className={`completeness-donut-fill ${progress >= 80 ? "is-high" : ""}`}
                cx="50"
                cy="50"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>
            <span className="completeness-donut-pct">{progress}%</span>
          </div>

          <ul className="completeness-items-list">
            <li className={`completeness-list-row ${hasFiles ? "is-done" : ""}`}>
              <span className="item-status-icon">{hasFiles ? "✓" : "✕"}</span>
              <span>{t("prof_verif_check_doc") || "Կցել փաստաթուղթ 10%"}</span>
            </li>
            <li className={`completeness-list-row ${hasId ? "is-done" : ""}`}>
              <span className="item-status-icon">{hasId ? "✓" : "✕"}</span>
              <span>{t("prof_verif_check_id") || "Անձնագրի / ID համարը 14%"}</span>
            </li>
            <li className={`completeness-list-row ${hasName ? "is-done" : ""}`}>
              <span className="item-status-icon">{hasName ? "✓" : "✕"}</span>
              <span>{t("prof_verif_check_name") || "Անուն 14%"}</span>
            </li>
            <li className={`completeness-list-row ${hasSurname ? "is-done" : ""}`}>
              <span className="item-status-icon">{hasSurname ? "✓" : "✕"}</span>
              <span>{t("prof_verif_check_surname") || "Ազգանուն 14%"}</span>
            </li>
            <li className={`completeness-list-row ${hasDob ? "is-done" : ""}`}>
              <span className="item-status-icon">{hasDob ? "✓" : "✕"}</span>
              <span>{t("prof_verif_check_dob") || "Ծննդյան ամսաթիվ 14%"}</span>
            </li>
            <li className={`completeness-list-row ${hasPhone ? "is-done" : ""}`}>
              <span className="item-status-icon">{hasPhone ? "✓" : "✕"}</span>
              <span>{t("prof_verif_check_phone") || "Հեռախոսահամար 14%"}</span>
            </li>
            <li className={`completeness-list-row ${isVerified ? "is-done" : ""}`}>
              <span className="item-status-icon">{isVerified ? "✓" : "✕"}</span>
              <span>{t("prof_verif_check_approval") || "Փաստաթղթի հաստատում 20%"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
