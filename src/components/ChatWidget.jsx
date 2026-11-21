import { useI18n } from "../i18n/I18nContext";

export default function ChatWidget() {
  const { t } = useI18n();

  return (
    <div className="chat-widget-wrapper">

        <input type="checkbox" id="chat-widget-toggle" className="chat-widget-toggle-cb" />

        <label htmlFor="chat-widget-toggle" className="chat-fab-btn" title={t("chat_fab_title")}>
          <span className="chat-fab-icon chat-fab-open">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </span>
          <span className="chat-fab-icon chat-fab-close"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span>
          <span className="chat-fab-pulse"></span>
          <span className="chat-fab-badge">1</span>
        </label>

        <aside className="chat-widget-window" aria-label="Gavel Live Chat">

          <div className="chat-widget-header">
            <div className="chat-header-main">
              <div className="chat-avatar-wrap">
                <span className="chat-header-avatar"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg></span>
                <span className="chat-status-dot"></span>
              </div>
              <div className="chat-header-info">
                <h4 className="chat-header-title">{t("chat_header_title")}</h4>
                <span className="chat-header-status"><span className="status-dot-online"></span><span>{t("chat_online_status")}</span></span>
              </div>
            </div>
            <label htmlFor="chat-widget-toggle" className="chat-close-btn" title={t("chat_close_title")}><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></label>
          </div>

          <input type="radio" name="chat-tab" id="chat-tab-ai" className="chat-tab-radio" defaultChecked />
          <input type="radio" name="chat-tab" id="chat-tab-seller" className="chat-tab-radio" />

          <div className="chat-tabs-bar">
            <label htmlFor="chat-tab-ai" className="chat-tab-btn chat-tab-btn-ai">
              <span className="chat-tab-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg></span>
              <span>{t("chat_tab_ai")}</span>
            </label>
            <label htmlFor="chat-tab-seller" className="chat-tab-btn chat-tab-btn-seller">
              <span className="chat-tab-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></span>
              <span>{t("chat_tab_seller")}</span>
              <span className="chat-unread-dot"></span>
            </label>
          </div>

          <div className="chat-tab-content chat-content-ai">
            <div className="chat-messages-scroll">
              <div className="chat-msg chat-msg-bot">
                <div className="chat-msg-avatar"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg></div>
                <div className="chat-msg-bubble">
                  <div className="chat-msg-sender">Gavel AI Bot · <small>{t("chat_auto_badge")}</small></div>
                  <p><span>{t("chat_hello")}</span> <b>Արմեն</b> <span>{t("chat_ai_intro_full")}</span></p>
                </div>
              </div>

              <div className="chat-faq-section">
                <small className="chat-faq-title"><span>{t("chat_faq_title")}</span></small>

                <input type="checkbox" id="faq-toggle-1" className="chat-faq-cb" />
                <label htmlFor="faq-toggle-1" className="chat-faq-chip">
                  <span>{t("chat_faq_q1")}</span>
                  <span className="faq-chip-arrow">▼</span>
                </label>
                <div className="chat-faq-answer">
                  <p>{t("chat_faq_a1_full")}</p>
                </div>

                <input type="checkbox" id="faq-toggle-2" className="chat-faq-cb" />
                <label htmlFor="faq-toggle-2" className="chat-faq-chip">
                  <span>{t("chat_faq_q2")}</span>
                  <span className="faq-chip-arrow">▼</span>
                </label>
                <div className="chat-faq-answer">
                  <p>{t("chat_faq_a2_full")}</p>
                </div>

                <input type="checkbox" id="faq-toggle-3" className="chat-faq-cb" />
                <label htmlFor="faq-toggle-3" className="chat-faq-chip">
                  <span>{t("chat_faq_q3")}</span>
                  <span className="faq-chip-arrow">▼</span>
                </label>
                <div className="chat-faq-answer">
                  <p><span>{t("chat_faq_a3_p1")}</span> <b>{t("chat_tab_seller")}</b> <span>{t("chat_faq_a3_p2")}</span></p>
                </div>
              </div>
            </div>

            <div className="chat-input-bar">
              <input type="text" className="chat-input-field" placeholder={t("chat_ai_placeholder")} />
              <button type="button" className="chat-send-btn" title={t("chat_send_title")}>
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </button>
            </div>
          </div>

          <div className="chat-tab-content chat-content-seller">

            <div className="chat-deal-context">
              <div className="chat-deal-img"><img src="/images/car-front.jpg" alt="Porsche 911" /></div>
              <div className="chat-deal-info">
                <div className="chat-deal-badge"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg> <span>{t("chat_won_lot_badge")}</span></div>
                <div className="chat-deal-title">2021 Porsche 911 Carrera 4S</div>
                <small className="chat-deal-seller"><span>{t("chat_seller_label")}</span> <b>Copart Armenia</b> (Դավիթ Ս.)</small>
              </div>
            </div>

            <div className="chat-messages-scroll">

              <div className="chat-msg chat-msg-seller">
                <div className="chat-msg-avatar seller-av">Դ</div>
                <div className="chat-msg-bubble">
                  <div className="chat-msg-sender">Copart Armenia (Դավիթ Ս.)</div>
                  <p>Շնորհավորում ենք աճուրդը շահելու կապակցությամբ։ Լոտի մաքսային փաստաթղթերը և Run &amp; Drive սերտիֆիկատը պատրաստ են։ Ե՞րբ կկարողանաք մոտենալ կենտրոնական ավտոկայան։</p>
                  <span className="chat-msg-time">16:40</span>
                </div>
              </div>

              <div className="chat-msg chat-msg-me">
                <div className="chat-msg-bubble">
                  <div className="chat-msg-sender">Դուք (Արմեն Ս.)</div>
                  <p>Բարև Ձեզ, շնորհակալություն։ Վաղը ժամը 14:00-ին հարմա՞ր կլինի մոտենալ մեքենան զննելու և տեղափոխելու համար։</p>
                  <span className="chat-msg-time"><span>{t("chat_read_status")}</span> <svg className="ico ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>
                </div>
              </div>

              <div className="chat-msg chat-msg-seller">
                <div className="chat-msg-avatar seller-av">Դ</div>
                <div className="chat-msg-bubble">
                  <div className="chat-msg-sender">Copart Armenia (Դավիթ Ս.)</div>
                  <p>Այո, սիրով, ժամը 14:00-ին ձեզ կսպասենք։ Ձեզ հետ վերցրեք անձնագիրը և Gavel համակարգի վճարման անդորրագիրը։</p>
                  <span className="chat-msg-time">16:43</span>
                </div>
              </div>
            </div>

            <div className="chat-input-bar">
              <input type="text" className="chat-input-field" placeholder={t("chat_seller_placeholder")} />
              <button type="button" className="chat-send-btn" title={t("chat_send_title")}>
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </button>
            </div>
          </div>
        </aside>
      </div>
  );
}
