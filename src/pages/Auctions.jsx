import "../styles/auctions.css";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import usePageTitle from "../hooks/usePageTitle";

export default function Auctions() {
  const { t } = useI18n();
  usePageTitle("title_auctions");

  return (
    <>
      <main>
          <div className="w">
            <div className="breadcrumb">
              <Link to="/">{t("nav_home")}</Link>
              <span>›</span>
              <span>{t("footer_auctions_list")}</span>
            </div>

            <div className="catalog-layout">

              <aside className="filters-card">
                <form action="/auctions" method="get">
                  <div className="filters-header">
                    <h3>{t("flt_title")}</h3>
                    <Link to="/auctions" className="btn sm clear-btn">{t("flt_clear")}</Link>
                  </div>

                  <div className="filter-sec">
                    <div className="filter-title">{t("flt_status")}</div>
                    <label className="ck-item">
                      <span><input type="radio" name="f-status" value="all" defaultChecked /> <span>{t("flt_all")}</span></span>
                      <small>15</small>
                    </label>
                    <label className="ck-item">
                      <span><input type="radio" name="f-status" value="live" /> <span>{t("flt_live")}</span></span>
                      <small>9</small>
                    </label>
                    <label className="ck-item">
                      <span><input type="radio" name="f-status" value="soon" /> <span>{t("flt_ending")}</span></span>
                      <small>3</small>
                    </label>
                    <label className="ck-item">
                      <span><input type="radio" name="f-status" value="end" /> <span>{t("chip_ended")}</span></span>
                      <small>3</small>
                    </label>
                  </div>

                  <div className="filter-sec">
                    <div className="filter-title">{t("flt_categories")}</div>
                    <div>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_auto" value="1" defaultChecked /> <span>{t("cat_cars")}</span></span>
                        <small>2</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_watches" value="1" defaultChecked /> <span>{t("cat_watches")}</span></span>
                        <small>3</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_art" value="1" defaultChecked /> <span>{t("cat_art")}</span></span>
                        <small>4</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_rugs" value="1" defaultChecked /> <span>{t("cat_carpets")}</span></span>
                        <small>2</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_ceramics" value="1" defaultChecked /> <span>{t("cat_ceramics")}</span></span>
                        <small>2</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_furniture" value="1" defaultChecked /> <span>{t("cat_furniture")}</span></span>
                        <small>1</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_books" value="1" defaultChecked /> <span>{t("cat_books")}</span></span>
                        <small>1</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_jewelry" value="1" defaultChecked /> <span>{t("cat_jewellery")}</span></span>
                        <small>1</small>
                      </label>
                      <label className="ck-item">
                        <span><input type="checkbox" name="cat_collections" value="1" defaultChecked /> <span>{t("cat_collectibles")}</span></span>
                        <small>1</small>
                      </label>
                    </div>
                  </div>

                  <div className="filter-sec">
                    <div className="filter-title">{t("flt_price_range")}</div>
                    <div className="price-range-inputs">
                      <input type="number" name="min_price" className="form-input price-input-field" placeholder={t("flt_price_from")} />
                      <span>—</span>
                      <input type="number" name="max_price" className="form-input price-input-field" placeholder={t("flt_price_to")} />
                    </div>
                  </div>

                  <button type="submit" className="btn pri sm full filter-apply-btn">{t("flt_apply")}</button>
                </form>
              </aside>

              <section>

                <input type="radio" name="catalog-view" id="cview-grid" className="catalog-view-radio" defaultChecked />
                <input type="radio" name="catalog-view" id="cview-list" className="catalog-view-radio" />

                <div className="catalog-top">
                  <form action="/auctions" method="get" className="search-box">
                    <span className="search-icon"><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
                    <input type="text" name="q" className="form-input search-input-inner" placeholder={t("flt_search_name_ph")} />
                    <button type="submit" className="btn sm pri search-submit-btn">{t("search_aria")}</button>
                  </form>

                  <div className="catalog-right-controls">
                    <span className="catalog-counter"><span>{t("flt_found")}</span> <b>15</b> <span>{t("flt_lots_word")}</span></span>
                    <select className="form-select catalog-sort-select">
                      <option value="ending">{t("flt_ending")}</option>
                      <option value="price-asc">{t("sort_price_asc")}</option>
                      <option value="price-desc">{t("sort_price_desc")}</option>
                      <option value="bids">{t("sort_bids")}</option>
                    </select>
                    <div className="view-toggle">
                      <label htmlFor="cview-grid" className="view-btn view-btn-grid" title={t("view_grid_title")}>⊞</label>
                      <label htmlFor="cview-list" className="view-btn view-btn-list" title={t("view_list_title")}><svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg></label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-3 lot-items-grid">

                  <article className="card lot">
                    <div className="im"><img src="/images/car-front.jpg" alt="2021 Porsche 911 Carrera 4S" />
                      <span className="chip copart-live"><span className="copart-dot"></span> Live</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" defaultChecked />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #405 · <span>{t("cat_cars")}</span> · Run &amp; Drive</small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">2021 Porsche 911 Carrera 4S</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_bid_live")}</small>
                          <span className="price">$48,500</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_hammer_countdown")}</small>
                          <span className="tm hot">00:14 <span>{t("unit_sec")}</span></span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im"><img src="/images/lot-classic-car.jpg" alt="1968 Ford Mustang Shelby GT" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #412 · <span>{t("cat_classic_cars")}</span> · Clean Title</small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">1968 Ford Mustang Fastback</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$62,000</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm">01:24:00</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im t1"><img src="/images/lot-watch.jpg" alt="Հին ժամացույց" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" defaultChecked />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #128 · <span>{t("cat_watches")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Հին ժամացույց</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$1,250</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm">02:41:08</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im t2"><img src="/images/lot-carpet.jpg" alt="Ձեռագործ գորգ" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #211 · <span>{t("cat_carpets")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Ձեռագործ գորգ</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$900</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm hot">00:08:30</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im t3"><img src="/images/lot-samovar.jpg" alt="Արծաթե սամովար" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" defaultChecked />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #94 · <span>{t("cat_collectibles")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Արծաթե սամովար</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$480</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm">05:12:40</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im t4"><img src="/images/lot-painting.jpg" alt="Յուղաներկ նկար" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #142 · <span>{t("cat_art")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Յուղաներկ նկար</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$2,300</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm">09:00:00</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im t5"><img src="/images/lot-desk.jpg" alt="Փայտե գրասեղան" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #168 · <span>{t("cat_furniture")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Փայտե գրասեղան</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$650</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm">12:30:00</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im t6"><img src="/images/lot-ring.jpg" alt="Ոսկե մատանի" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #189 · <span>{t("cat_jewellery")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Ոսկե մատանի նռնաքարով</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$1,750</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm hot">00:55:00</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im"><img src="/images/lot-vase.jpg" alt="Հնաոճ ճենապակյա սկահակ" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #215 · <span>{t("cat_ceramics")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Հնաոճ ճենապակյա սկահակ</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$820</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm">04:15:30</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im"><img src="/images/lot-sculpture.jpg" alt="Բրոնզե քանդակ «Հեծյալը»" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #220 · <span>{t("cat_art")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Բրոնզե քանդակ «Հեծյալը»</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$950</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm hot">01:45:10</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im"><img src="/images/lot-book.jpg" alt="Կաշվեպատ հնատիպ գիրք" />
                      <span className="chip live">{t("chip_live")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #242 · <span>{t("cat_books")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Կաշվեպատ հնատիպ գիրք, 1785 թ.</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("lot_current_price")}</small>
                          <span className="price">$640</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("lot_time_left")}</small>
                          <span className="tm">07:20:00</span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>

                  <article className="card lot">
                    <div className="im"><img src="/images/lot-coins.jpg" alt="Անտիկ մետաղադրամներ" />
                      <span className="chip end">{t("chip_finished")}</span>
                      <label className="remind-btn">
                        <input type="checkbox" className="remind-cb" />
                        <span className="remind-icon">
                          <svg className="remind-off" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <polyline points="12 7 12 12 15 15"></polyline>
                          </svg>
                          <svg className="remind-on" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      </label>
                    </div>
                    <div className="card-body">
                      <small className="lot-card-cat"><span>{t("det_lot_word")}</span> #301 · <span>{t("cat_collectibles")}</span></small>
                      <h3 className="lot-card-title"><Link to="/auction-detail">Անտիկ մետաղադրամներ</Link></h3>
                      <div className="lot-card-info-row">
                        <div>
                          <small className="lot-card-lbl">{t("tbl_final_price")}</small>
                          <span className="price">$1,150</span>
                        </div>
                        <div className="lot-card-timing">
                          <small className="lot-card-lbl">{t("tbl_bids")}</small>
                          <span className="tm">22 <span>{t("unit_bids")}</span></span>
                        </div>
                      </div>
                      <div className="lot-card-action-btns">
                  <Link to="/auction-detail" className="btn sm">{t("lot_details_btn")}</Link>
                  <Link to="/place-bid" className="btn pri sm">{t("lot_join_btn")}</Link>
                </div>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </main>


    </>
  );
}
