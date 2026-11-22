import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/profile.css";
import "../styles/auctions.css";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { useLots } from "../context/LotContext";
import usePageTitle from "../hooks/usePageTitle";
import LotCard from "../components/LotCard";

export default function PublicProfile() {
  const { userId } = useParams();
  const { t } = useI18n();
  usePageTitle("title_profile");
  const { session, getUserById } = useAuth();
  const { lots } = useLots();
  const [tab, setTab] = useState("all"); // "all" | "active" | "ended"

  const decodedId = decodeURIComponent(userId || "");

  // Resolve user from registered users OR from lot seller metadata
  const profileUser = useMemo(() => {
    const foundUser = getUserById(decodedId);
    if (foundUser) {
      const fullName = `${foundUser.firstName || ""} ${foundUser.lastName || ""}`.trim();
      return {
        id: foundUser.id,
        name: fullName || foundUser.email,
        avatar: foundUser.avatar
          ? foundUser.avatar.startsWith("images/")
            ? `/${foundUser.avatar}`
            : foundUser.avatar
          : null,
        verified:
          foundUser.verification?.status === "verified" ||
          String(foundUser.id) === "1" ||
          foundUser.role === "admin",
        rating: 4.95,
        registeredAt: foundUser.registeredAt || "2026-01-14",
        city: foundUser.city || "Երևան, Հայաստան",
        bio:
          foundUser.bio ||
          "Gavel հարթակի գրանցված մասնակից և հավաքորդ:",
      };
    }

    // Check if it matches a seller on any lot
    const sellerLot = lots.find(
      (l) =>
        String(l.seller?.id).toLowerCase() === decodedId.toLowerCase() ||
        String(l.seller?.name).toLowerCase() === decodedId.toLowerCase()
    );

    if (sellerLot && sellerLot.seller) {
      return {
        id: sellerLot.seller.id,
        name: sellerLot.seller.name,
        avatar: sellerLot.seller.avatar || null,
        verified: Boolean(sellerLot.seller.verified),
        rating: sellerLot.seller.rating || 4.9,
        registeredAt: "2025-11-10",
        city: "Երևան, Հայաստան",
        bio: `${sellerLot.seller.name} — Վերիֆիկացված վաճառող և աճուրդային գործընկեր Gavel հարթակում:`,
      };
    }

    return {
      id: decodedId,
      name: decodedId || "Օգտատեր",
      avatar: null,
      verified: false,
      rating: 4.8,
      registeredAt: "2026-01-01",
      city: "Հայաստան",
      bio: "Gavel առցանց աճուրդների հարթակի մասնակից:",
    };
  }, [decodedId, getUserById, lots]);

  const isOwnProfile =
    session &&
    (String(session.id) === String(profileUser.id) ||
      `${session.firstName || ""} ${session.lastName || ""}`
        .trim()
        .toLowerCase() === String(profileUser.name).trim().toLowerCase());

  // Lots listed by this profile user
  const userLots = useMemo(() => {
    const isGarikProfile =
      String(profileUser.id) === "1" ||
      String(profileUser.name).toLowerCase().includes("գարիկ");

    return lots.filter((l) => {
      if (String(l.seller?.id).toLowerCase() === String(profileUser.id).toLowerCase()) {
        return true;
      }
      if (
        l.seller?.name &&
        String(l.seller.name).trim().toLowerCase() ===
          String(profileUser.name).trim().toLowerCase()
      ) {
        return true;
      }
      if (isGarikProfile && (l.seller?.id === "me" || [405, 128, 219].includes(Number(l.id)))) {
        return true;
      }
      return false;
    });
  }, [lots, profileUser]);

  // Active bids placed by this user across lots
  const userBidsCount = useMemo(() => {
    let count = 0;
    lots.forEach((l) => {
      const history = Array.isArray(l.bidHistory) ? l.bidHistory : [];
      history.forEach((b) => {
        if (
          String(b.bidderId) === String(profileUser.id) ||
          String(b.bidderName).toLowerCase() === String(profileUser.name).toLowerCase()
        ) {
          count += 1;
        }
      });
    });
    return count;
  }, [lots, profileUser]);

  const activeLots = userLots.filter((l) => l.status === "active" || l.status === "upcoming");
  const endedLots = userLots.filter((l) => l.status === "ended");
  const totalBidsReceived = userLots.reduce((sum, l) => sum + (Number(l.bidsCount) || 0), 0);

  const visibleLots =
    tab === "active" ? activeLots : tab === "ended" ? endedLots : userLots;

  return (
    <main>
      <div className="w">
        <div className="breadcrumb">
          <Link to="/">{t("nav_home")}</Link>
          <span>›</span>
          <Link to="/auctions">{t("nav_auctions")}</Link>
          <span>›</span>
          <span>{profileUser.name}</span>
        </div>

        <div className="public-profile-hero">
          <div className="public-profile-left">
            <div className="public-profile-avatar">
              {profileUser.avatar ? (
                <img src={profileUser.avatar} alt={profileUser.name} />
              ) : (
                profileUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="public-profile-name-row">
                <h1 className="public-profile-name">{profileUser.name}</h1>
                {profileUser.verified && (
                  <span className="trust-badge-pill">
                    ✓ {t("prof_verif_status_verified") || "Վերիֆիկացված"}
                  </span>
                )}
              </div>
              <div className="public-profile-meta">
                <span>★ {profileUser.rating} Վարկանիշ</span>
                {profileUser.city && <span>📍 {profileUser.city}</span>}
                <span>📅 Գրանցված է՝ {profileUser.registeredAt}</span>
              </div>
              {profileUser.bio && (
                <p className="public-profile-bio">{profileUser.bio}</p>
              )}
            </div>
          </div>

          <div className="public-profile-actions">
            {isOwnProfile ? (
              <>
                <Link to="/profile" className="btn sm">
                  ✎ Խմբագրել իմ պրոֆիլը
                </Link>
                <Link to="/add-lot" className="btn pri sm">
                  {t("ml_add_btn")}
                </Link>
              </>
            ) : (
              <label
                htmlFor="chat-widget-toggle"
                className="btn pri sm chat-open-label"
              >
                💬 Հաղորդագրություն ուղարկել
              </label>
            )}
          </div>
        </div>

        <div className="public-profile-kpis">
          <div className="public-kpi-box">
            <small className="public-kpi-lbl">Հրապարակված լոտեր</small>
            <div className="public-kpi-val">{userLots.length}</div>
          </div>
          <div className="public-kpi-box">
            <small className="public-kpi-lbl">Ակտիվ աճուրդներ</small>
            <div className="public-kpi-val">{activeLots.length}</div>
          </div>
          <div className="public-kpi-box">
            <small className="public-kpi-lbl">Ստացված հայտեր</small>
            <div className="public-kpi-val">{totalBidsReceived}</div>
          </div>
          <div className="public-kpi-box">
            <small className="public-kpi-lbl">Կատարած խաղադրույքներ</small>
            <div className="public-kpi-val">{userBidsCount}</div>
          </div>
        </div>

        <div className="public-tabs-bar">
          <button
            type="button"
            className={`btn sm ${tab === "all" ? "pri" : ""}`}
            onClick={() => setTab("all")}
          >
            {t("flt_all")} ({userLots.length})
          </button>
          <button
            type="button"
            className={`btn sm ${tab === "active" ? "pri" : ""}`}
            onClick={() => setTab("active")}
          >
            {t("flt_live")} ({activeLots.length})
          </button>
          <button
            type="button"
            className={`btn sm ${tab === "ended" ? "pri" : ""}`}
            onClick={() => setTab("ended")}
          >
            {t("chip_ended")} ({endedLots.length})
          </button>
        </div>

        {visibleLots.length > 0 ? (
          <div className="grid grid-3 lot-items-grid">
            {visibleLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        ) : (
          <div className="card catalog-empty-box">
            <p className="catalog-empty-msg">
              Այս օգտատիրոջ մոտ ընտրված բաժնում լոտեր չկան:
            </p>
            {isOwnProfile && (
              <Link to="/add-lot" className="btn pri sm">
                {t("ml_add_btn")}
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
