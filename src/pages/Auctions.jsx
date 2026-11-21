import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/auctions.css";
import { useI18n } from "../i18n/I18nContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";
import LotCard from "../components/LotCard";
import categoriesData from "../data/categories.json";

export default function Auctions() {
  const { t, lang } = useI18n();
  usePageTitle("title_auctions");
  const { lots } = useLots();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  // Ֆիլտրերի և սորտավորման վիճակները (React State)
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [activeSearch, setActiveSearch] = useState(initialQ);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);
  const [sortBy, setSortBy] = useState("ending");
  const [viewMode, setViewMode] = useState("grid"); // "grid" կամ "list"

  // Կատեգորիան նշել/հանել
  const handleCategoryToggle = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Գնային ֆիլտրի կիրառում
  const handleApplyPrice = (e) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice ? Number(minPrice) : null);
    setAppliedMaxPrice(maxPrice ? Number(maxPrice) : null);
  };

  // Որոնման ֆորմի ուղարկում
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchTerm.trim());
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Բոլոր ֆիլտրերի մաքրում (Clear All)
  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchTerm("");
    setActiveSearch("");
    setStatusFilter("all");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setSortBy("ending");
    setSearchParams({});
  };

  // Ֆիլտրված և սորտավորված լոտերի հաշվարկ (useMemo)
  const filteredLots = useMemo(() => {
    return lots
      .filter((lot) => {
        // 1. Կարգավիճակի ֆիլտր
        if (statusFilter === "live" && lot.status !== "active") return false;
        if (statusFilter === "soon" && (!lot.isHot || lot.status !== "active")) return false;
        if (statusFilter === "end" && lot.status !== "ended") return false;

        // 2. Կատեգորիայի ֆիլտր
        if (selectedCategories.length > 0 && !selectedCategories.includes(lot.categoryId)) {
          return false;
        }

        // 3. Որոնում անվան և նկարագրության մեջ
        if (activeSearch) {
          const q = activeSearch.toLowerCase();
          const matchTitle = lot.title?.toLowerCase().includes(q);
          const matchDesc = lot.description?.toLowerCase().includes(q);
          const matchCat = lot.categoryId?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        // 4. Գնային սահման
        const price = lot.currentBid || lot.startingPrice || 0;
        if (appliedMinPrice !== null && price < appliedMinPrice) return false;
        if (appliedMaxPrice !== null && price > appliedMaxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return (a.currentBid || 0) - (b.currentBid || 0);
        }
        if (sortBy === "price-desc") {
          return (b.currentBid || 0) - (a.currentBid || 0);
        }
        if (sortBy === "bids") {
          return (b.bidsCount || 0) - (a.bidsCount || 0);
        }
        // "ending" - առաջինը ամենաթեժերը
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return (b.id || 0) - (a.id || 0);
      });
  }, [lots, statusFilter, selectedCategories, activeSearch, appliedMinPrice, appliedMaxPrice, sortBy]);

  // Կատեգորիաներ ֆիլտրի ցուցակի համար (հաշվում ենք յուրաքանչյուրի քանակը)
  const availableCategories = useMemo(() => {
    return categoriesData.slice(0, 10).map((cat) => {
      const count = lots.filter((l) => l.categoryId === cat.id).length;
      return {
        ...cat,
        count,
      };
    });
  }, [lots]);

  // Կարգավիճակների քանակները
  const statusCounts = useMemo(() => {
    return {
      all: lots.length,
      live: lots.filter((l) => l.status === "active").length,
      soon: lots.filter((l) => l.status === "active" && l.isHot).length,
      end: lots.filter((l) => l.status === "ended").length,
    };
  }, [lots]);

  return (
    <main>
      <div className="w">
        <div className="breadcrumb">
          <Link to="/">{t("nav_home")}</Link>
          <span>›</span>
          <span>{t("footer_auctions_list")}</span>
        </div>

        <div className="catalog-layout">
          {/* Ձախ կողմի ֆիլտրերի վահանակ */}
          <aside className="filters-card">
            <div>
              <div className="filters-header">
                <h3>{t("flt_title")}</h3>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn sm clear-btn"
                >
                  {t("flt_clear")}
                </button>
              </div>

              {/* Կարգավիճակի ֆիլտր */}
              <div className="filter-sec">
                <div className="filter-title">{t("flt_status")}</div>
                <label className="ck-item">
                  <span>
                    <input
                      type="radio"
                      name="f-status"
                      value="all"
                      checked={statusFilter === "all"}
                      onChange={() => setStatusFilter("all")}
                    />
                    <span>{t("flt_all")}</span>
                  </span>
                  <small>{statusCounts.all}</small>
                </label>
                <label className="ck-item">
                  <span>
                    <input
                      type="radio"
                      name="f-status"
                      value="live"
                      checked={statusFilter === "live"}
                      onChange={() => setStatusFilter("live")}
                    />
                    <span>{t("flt_live")}</span>
                  </span>
                  <small>{statusCounts.live}</small>
                </label>
                <label className="ck-item">
                  <span>
                    <input
                      type="radio"
                      name="f-status"
                      value="soon"
                      checked={statusFilter === "soon"}
                      onChange={() => setStatusFilter("soon")}
                    />
                    <span>{t("flt_ending")}</span>
                  </span>
                  <small>{statusCounts.soon}</small>
                </label>
                <label className="ck-item">
                  <span>
                    <input
                      type="radio"
                      name="f-status"
                      value="end"
                      checked={statusFilter === "end"}
                      onChange={() => setStatusFilter("end")}
                    />
                    <span>{t("chip_ended")}</span>
                  </span>
                  <small>{statusCounts.end}</small>
                </label>
              </div>

              {/* Կատեգորիաների ֆիլտր */}
              <div className="filter-sec">
                <div className="filter-title">{t("flt_categories")}</div>
                <div>
                  {availableCategories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    const catName = cat.name?.[lang] || cat.name?.en || cat.id;
                    return (
                      <label key={cat.id} className="ck-item">
                        <span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(cat.id)}
                          />
                          <span>{catName}</span>
                        </span>
                        <small>{cat.count}</small>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Գնային միջակայք */}
              <div className="filter-sec">
                <div className="filter-title">{t("flt_price_range")}</div>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    className="form-input price-input-field"
                    placeholder={t("flt_price_from")}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>—</span>
                  <input
                    type="number"
                    className="form-input price-input-field"
                    placeholder={t("flt_price_to")}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyPrice}
                className="btn pri sm full filter-apply-btn"
              >
                {t("flt_apply")}
              </button>
            </div>
          </aside>

          {/* Աջ կողմի կատալոգ */}
          <section>
            {/* CSS Selector triggers for grid / list views */}
            <input
              type="radio"
              name="catalog-view"
              id="cview-grid"
              className="catalog-view-radio"
              checked={viewMode === "grid"}
              onChange={() => setViewMode("grid")}
            />
            <input
              type="radio"
              name="catalog-view"
              id="cview-list"
              className="catalog-view-radio"
              checked={viewMode === "list"}
              onChange={() => setViewMode("list")}
            />

            <div className="catalog-top">
              {/* Որոնում */}
              <form onSubmit={handleSearchSubmit} className="search-box">
                <div className="search-input-wrap">
                  <span className="search-icon">
                    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-input search-input-inner"
                    placeholder={t("flt_search_name_ph")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn sm pri search-submit-btn">
                  {t("search_aria")}
                </button>
              </form>

              {/* Վերահսկման կոճակներ */}
              <div className="catalog-right-controls">
                <span className="catalog-counter">
                  <span>{t("flt_found")}</span> <b>{filteredLots.length}</b>{" "}
                  <span>{t("flt_lots_word")}</span>
                </span>

                <select
                  className="form-select catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="ending">{t("flt_ending")}</option>
                  <option value="price-asc">{t("sort_price_asc")}</option>
                  <option value="price-desc">{t("sort_price_desc")}</option>
                  <option value="bids">{t("sort_bids")}</option>
                </select>

                <div className="view-toggle">
                  <button
                    type="button"
                    className={`view-btn view-btn-grid ${viewMode === "grid" ? "is-active" : ""}`}
                    title={t("view_grid_title") || "Ցանց"}
                    onClick={() => setViewMode("grid")}
                  >
                    ⊞
                  </button>
                  <button
                    type="button"
                    className={`view-btn view-btn-list ${viewMode === "list" ? "is-active" : ""}`}
                    title={t("view_list_title") || "Ցուցակ"}
                    onClick={() => setViewMode("list")}
                  >
                    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                      <line x1="8" x2="21" y1="6" y2="6" />
                      <line x1="8" x2="21" y1="12" y2="12" />
                      <line x1="8" x2="21" y1="18" y2="18" />
                      <line x1="3" x2="3.01" y1="6" y2="6" />
                      <line x1="3" x2="3.01" y1="12" y2="12" />
                      <line x1="3" x2="3.01" y1="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Լոտերի ցանց / ցուցակ */}
            {filteredLots.length > 0 ? (
              <div className="grid grid-3 lot-items-grid">
                {filteredLots.map((lot) => (
                  <LotCard key={lot.id} lot={lot} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="card catalog-empty-box">
                <p className="catalog-empty-msg">
                  {t("no_lots_matching") || "Համապատասխան լոտեր չեն գտնվել"}
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn sec sm"
                >
                  {t("flt_clear")}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
