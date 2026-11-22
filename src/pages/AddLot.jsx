import React, { useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/add-lot.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";
import categoriesData from "../data/categories.json";

function compressImageFile(file, maxDim = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Ֆայլի ընթերցման սխալ"));
    reader.onload = () => {
      const dataUrl = reader.result;
      if (file.type === "image/svg+xml") {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDim && height <= maxDim && file.size < 350 * 1024) {
          resolve(dataUrl);
          return;
        }
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getNextSaturdayDateStr() {
  const d = new Date();
  const day = d.getDay();
  const diff = (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return toLocalDateStr(d);
}

const DURATION_LABELS = {
  hy: {
    opt_24h: "24 ժամ (Էքսպրես / Շտապ վաճառք)",
    opt_3d: "3 օր (Արագ աճուրդ)",
    opt_7d: "7 օր (Ստանդարտ — խորհուրդ է տրվում)",
    opt_14d: "14 օր (Երկարաժամկետ)",
    opt_custom: "Ընտրել հստակ ամսաթիվ և ժամ (Սեփական ժամկետ)",
    opt_live: "Կենդանի առցանց աճուրդ (Live Auction)",
    custom_box_title: "Ընտրեք աճուրդի ավարտի հստակ ամսաթիվը և ժամը",
    custom_date_lbl: "Օրացույց՝ Ընտրեք ամսաթիվը",
    custom_time_lbl: "Ժամը (օր.՝ 19:00)",
    err_pick_date: "Խնդրում ենք ընտրել ավարտի ամսաթիվը և ժամը:",
    err_min_24h: "Ավարտի ժամանակը պետք է լինի ընթացիկ պահից առնվազն 24 ժամ հետո:",
    err_max_30d: "Ավարտի ժամանակը չի կարող գերազանցել ընթացիկ պահից 30 օրը:",
    ok_custom_prefix: "Աճուրդը կավարտվի ընտրված ժամկետում",
    live_date_lbl: "Կենդանի եզրափակչի ամսաթիվը և ժամը",
    live_callout:
      "«Մինչև ուղիղ եթերի մեկնարկը օգտատերերը կկարողանան կատարել նախնական առաջարկներ (Pre-bid): Նշանակված ժամին լոտը կանցնի իրական ժամանակի ռեժիմի՝ յուրաքանչյուր քայլի արագ թայմերով:»",
    drop_btn: "Ընտրել նկարներ համակարգչից",
    main_photo: "Հիմնական նկար",
    make_main: "Դարձնել գլխավոր",
    no_photos: "Լուսանկարներ դեռ կցված չեն։ Սեղմեք վերևի դաշտին կամ քաշեք նկարները այստեղ։",
  },
  ru: {
    opt_24h: "24 часа (Экспресс / Срочная продажа)",
    opt_3d: "3 дня (Быстрый аукцион)",
    opt_7d: "7 дней (Стандартный — рекомендуется)",
    opt_14d: "14 дней (Длительный)",
    opt_custom: "Выбрать точную дату и время (Свой срок)",
    opt_live: "Живой онлайн-аукцион (Live Auction)",
    custom_box_title: "Выберите точную дату и время завершения",
    custom_date_lbl: "Календарь: Выберите дату",
    custom_time_lbl: "Время: 19:00",
    err_pick_date: "Пожалуйста, выберите дату и время окончания аукциона.",
    err_min_24h: "Время окончания должно быть не менее чем через 24 часа от текущего времени.",
    err_max_30d: "Максимальный срок аукциона — не более 30 дней от текущего момента.",
    ok_custom_prefix: "Срок корректен (от 24 часов до 30 дней)",
    live_date_lbl: "Дата и время живого финала",
    live_callout:
      "«До начала прямого эфира пользователи смогут делать предварительные ставки (Pre-bid). В назначенное время лот перейдет в режим реального времени с таймером на каждый шаг.»",
    drop_btn: "Выбрать фотографии",
    main_photo: "Главное фото",
    make_main: "Сделать главным",
    no_photos: "Фотографии еще не добавлены. Нажмите на область выше или перетащите файлы.",
  },
  en: {
    opt_24h: "24 hours (Express / Urgent Sale)",
    opt_3d: "3 days (Fast auction)",
    opt_7d: "7 days (Standard — recommended)",
    opt_14d: "14 days (Long duration)",
    opt_custom: "Choose exact date & time (Custom duration)",
    opt_live: "Live Online Auction (Live Auction)",
    custom_box_title: "Select exact end date and time",
    custom_date_lbl: "Calendar: Choose date",
    custom_time_lbl: "Time: 19:00",
    err_pick_date: "Please select an end date and time.",
    err_min_24h: "End time must be at least 24 hours from the current time.",
    err_max_30d: "End time cannot exceed 30 days from now.",
    ok_custom_prefix: "Valid custom duration (between 24 hours and 30 days)",
    live_date_lbl: "Live Finale Date & Time",
    live_callout:
      "“Before the live broadcast starts, users will be able to place pre-bids. At the scheduled time, the lot will enter real-time live mode with a step timer for every bid.”",
    drop_btn: "Browse image files",
    main_photo: "Cover Photo",
    make_main: "Set as cover",
    no_photos: "No photos uploaded yet. Click the box above or drag and drop image files.",
  },
};

export default function AddLot() {
  const { t, lang } = useI18n();
  usePageTitle("title_add_lot");
  const { session, user, setFlash } = useAuth();
  const { addLot } = useLots();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const L = DURATION_LABELS[lang] || DURATION_LABELS.hy;

  // Wizard Step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState("");

  // Step 1: Info State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("watches");
  const [condition, setCondition] = useState("excellent");
  const [description, setDescription] = useState("");

  // Step 2: Photos State
  const [photos, setPhotos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Step 3: Pricing & Dimensions
  const [startPrice, setStartPrice] = useState("500");
  const [stepPrice, setStepPrice] = useState("50");
  const [dimensions, setDimensions] = useState("");
  const [origin, setOrigin] = useState("");

  // Step 4: Auction Duration & Format Selector
  // Default selected: "7d"
  const [durationType, setDurationType] = useState("7d");
  const [customDate, setCustomDate] = useState(() => {
    const d = new Date(Date.now() + 3 * 86400000);
    return toLocalDateStr(d);
  });
  const [customTime, setCustomTime] = useState("19:00");

  const [liveDate, setLiveDate] = useState(() => getNextSaturdayDateStr());
  const [liveTime, setLiveTime] = useState("19:00");

  const [contactPhone, setContactPhone] = useState(session?.phone || "+374 91 123456");

  // Minimum and maximum date bounds for date input
  const minDateStr = useMemo(() => toLocalDateStr(new Date(Date.now() + 24 * 3600000)), []);
  const maxDateStr = useMemo(() => toLocalDateStr(new Date(Date.now() + 30 * 86400000)), []);

  // Custom date/time validation: >= 24h and <= 30d from now
  const customValidation = useMemo(() => {
    if (durationType !== "custom") return { valid: true, message: "" };
    if (!customDate || !customTime) {
      return { valid: false, message: L.err_pick_date };
    }
    const chosenMs = new Date(`${customDate}T${customTime}`).getTime();
    if (isNaN(chosenMs)) {
      return { valid: false, message: L.err_pick_date };
    }
    const now = Date.now();
    const minMs = now + 24 * 3600000 - 60000; // 1 min grace for typing
    const maxMs = now + 30 * 86400000 + 60000;
    if (chosenMs < minMs) {
      return { valid: false, message: L.err_min_24h };
    }
    if (chosenMs > maxMs) {
      return { valid: false, message: L.err_max_30d };
    }
    const diffHours = Math.round((chosenMs - now) / 3600000);
    const days = Math.floor(diffHours / 24);
    const remHours = diffHours % 24;
    return {
      valid: true,
      message: `${L.ok_custom_prefix} (${days}d ${remHours}h)`,
    };
  }, [durationType, customDate, customTime, L]);

  const processFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    try {
      const compressedList = await Promise.all(
        files.map(async (file, idx) => {
          const dataUrl = await compressImageFile(file);
          return {
            id: `${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
            src: dataUrl,
            name: file.name,
          };
        })
      );
      setPhotos((prev) => [...prev, ...compressedList]);
    } catch (err) {
      setFlash(err.message || "Նկարի բեռնման սխալ");
    }
  };

  const handleFileInputChange = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const makeMainPhoto = (photoId) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === photoId);
      if (!target) return prev;
      return [target, ...prev.filter((p) => p.id !== photoId)];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      const msg = "Խնդրում ենք Քայլ 1-ում մուտքագրել լոտի անվանումը:";
      setCurrentStep(1);
      setFormError(msg);
      setFlash(msg);
      return;
    }

    if (!Number(startPrice) || Number(startPrice) <= 0) {
      const msg = "Խնդրում ենք Քայլ 3-ում մուտքագրել վավեր մեկնարկային գին:";
      setCurrentStep(3);
      setFormError(msg);
      setFlash(msg);
      return;
    }

    if (durationType === "custom" && !customValidation.valid) {
      setCurrentStep(4);
      setFormError(customValidation.message);
      setFlash(customValidation.message);
      return;
    }

    if (!contactPhone.trim()) {
      const msg = "Խնդրում ենք մուտքագրել կոնտակտային հեռախոսահամար:";
      setCurrentStep(4);
      setFormError(msg);
      setFlash(msg);
      return;
    }

    const sellerName =
      user?.name ||
      (session ? `${session.firstName || ""} ${session.lastName || ""}`.trim() : "") ||
      "Վաճառող";

    const fallbackImageByCat =
      categoryId === "cars"
        ? "/images/car-front.jpg"
        : categoryId === "watches"
        ? "/images/lot-watch.jpg"
        : "/images/lot-painting.jpg";

    const mainImage = photos[0]?.src || fallbackImageByCat;
    const galleryImages = photos.length > 0 ? photos.map((p) => p.src) : [mainImage];

    const customEndsAt =
      durationType === "custom" && customDate && customTime
        ? new Date(`${customDate}T${customTime}`).toISOString()
        : null;

    const liveStartAt =
      durationType === "live" && liveDate && liveTime
        ? new Date(`${liveDate}T${liveTime}`).toISOString()
        : null;

    const created = addLot({
      title: title.trim(),
      categoryId,
      startingPrice: Number(startPrice) || 100,
      minIncrement: Number(stepPrice) || 20,
      image: mainImage,
      gallery: galleryImages,
      durationType,
      customEndsAt,
      liveStartAt,
      auctionFormat: durationType === "live" || categoryId === "cars" ? "live" : "timed",
      contactPhone,
      specs: {
        condition,
        ...(dimensions ? { dimensions } : {}),
        ...(origin ? { origin } : {}),
      },
      description: description.trim() || title.trim(),
      seller: {
        id: session?.id || user?.id || "u_seller",
        name: sellerName,
        avatar: session?.avatar || "/images/avatar-winner.svg",
        verified: session?.verification?.status === "verified",
        rating: 5.0,
      },
    });

    setFlash(t("al_mod_desc") || "Լոտը հաջողությամբ հրապարակվեց:");
    navigate(`/auction-detail?id=${created.id}`);
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
              className={`step-item step-nav-1 ${currentStep === 1 ? "active" : ""}`}
            >
              <span className="step-badge">1</span> {t("al_step1") || "Տվյալներ"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`step-item step-nav-2 ${currentStep === 2 ? "active" : ""}`}
            >
              <span className="step-badge">2</span> {t("al_step2") || "Լուսանկարներ"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`step-item step-nav-3 ${currentStep === 3 ? "active" : ""}`}
            >
              <span className="step-badge">3</span> {t("al_step3") || "Գին և չափսեր"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className={`step-item step-nav-4 ${currentStep === 4 ? "active" : ""}`}
            >
              <span className="step-badge">4</span> {t("al_step4") || "Աճուրդ"}
            </button>
          </div>

          <form className="wizard-body" onSubmit={handleSubmit} noValidate>
            {formError && (
              <div className="duration-validation-msg error">{formError}</div>
            )}
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
                  {categoriesData.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name?.[lang] || cat.name?.hy || cat.id}
                    </option>
                  ))}
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

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden-file-input"
                onChange={handleFileInputChange}
              />

              <div
                className={`dropzone ${isDragging ? "is-dragging" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="dropzone-icon">
                  <svg className="ico ico-lg" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <b>{t("al_drop_title")}</b>
                <p className="dropzone-hint">{t("al_drop_hint")}</p>
                <button
                  type="button"
                  className="btn sm pri dropzone-browse-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  + {L.drop_btn}
                </button>
              </div>

              {photos.length === 0 ? (
                <div className="photos-empty-note">{L.no_photos}</div>
              ) : (
                <div className="photo-previews">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className={`preview-card ${index === 0 ? "is-main-photo" : ""}`}
                    >
                      <img src={photo.src} alt={photo.name || `Photo ${index + 1}`} />
                      {index > 0 && (
                        <button
                          type="button"
                          className="preview-make-main-btn"
                          onClick={() => makeMainPhoto(photo.id)}
                        >
                          {L.make_main}
                        </button>
                      )}
                      <span>
                        {index === 0 ? L.main_photo : photo.name || `#${index + 1}`}
                      </span>
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
              )}

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
                    min="1"
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
                    min="1"
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

            {/* Step 4: Auction duration & format selector */}
            <div className="wizard-pane wizard-pane-4">
              <h2 className="wizard-pane-title">{t("al_s4_title")}</h2>
              <p className="wizard-pane-desc">{t("al_s4_desc")}</p>

              <div className="form-group">
                <label className="form-label">{t("al_lbl_duration")}</label>
                <select
                  className="form-select"
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                >
                  <option value="24h">{L.opt_24h}</option>
                  <option value="3d">{L.opt_3d}</option>
                  <option value="7d">{L.opt_7d}</option>
                  <option value="14d">{L.opt_14d}</option>
                  <option value="custom">{L.opt_custom}</option>
                  <option value="live">{L.opt_live}</option>
                </select>
              </div>

              {/* Case A: Custom Date & Time Picker with 24h - 30d Validation */}
              {durationType === "custom" && (
                <div className="duration-conditional-box">
                  <h4 className="duration-box-title">
                    <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span>{L.custom_box_title}</span>
                  </h4>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{L.custom_date_lbl}</label>
                      <input
                        type="date"
                        className="form-input"
                        value={customDate}
                        min={minDateStr}
                        max={maxDateStr}
                        onChange={(e) => setCustomDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{L.custom_time_lbl}</label>
                      <input
                        type="time"
                        className="form-input"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div
                    className={`duration-validation-msg ${
                      customValidation.valid ? "ok" : "error"
                    }`}
                  >
                    {customValidation.message}
                  </div>
                </div>
              )}

              {/* Case B: Live Online Auction Scheduling & Pre-bid Callout */}
              {durationType === "live" && (
                <div className="duration-conditional-box live-mode-box">
                  <h4 className="duration-box-title">
                    <span className="live-pulse-dot"></span>
                    <span>{L.live_date_lbl}</span>
                  </h4>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">{L.custom_date_lbl}</label>
                      <input
                        type="date"
                        className="form-input"
                        value={liveDate}
                        min={toLocalDateStr(new Date())}
                        onChange={(e) => setLiveDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{L.custom_time_lbl}</label>
                      <input
                        type="time"
                        className="form-input"
                        value={liveTime}
                        onChange={(e) => setLiveTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="live-auction-callout">{L.live_callout}</div>
                </div>
              )}

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
                  <button
                    type="submit"
                    className="btn pri"
                    disabled={durationType === "custom" && !customValidation.valid}
                  >
                    {t("al_submit_btn") || "Տեղադրել աճուրդի"}{" "}
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
