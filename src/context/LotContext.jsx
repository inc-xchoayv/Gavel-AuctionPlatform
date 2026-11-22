import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import initialLotsData from "../data/lots.json";

const STORAGE_KEY_LOTS = "gavel_lots";
const STORAGE_KEY_REMINDERS = "gavel_reminders";

const LotContext = createContext(null);

function normalizeLot(lot) {
  const categoryId = lot.categoryId === "classic-cars" ? "cars" : lot.categoryId;
  const isCar = categoryId === "cars";
  const auctionFormat =
    lot.auctionFormat ||
    (isCar || lot.badge === "copart-live" ? "live" : "timed");
  return {
    ...lot,
    categoryId,
    auctionFormat,
  };
}

function formatDurationLeft(ms) {
  if (!ms || ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (days >= 1) {
    return `${days}d ${String(hours).padStart(2, "0")}h`;
  }
  return [hours, mins, secs].map((n) => String(n).padStart(2, "0")).join(":");
}

export function LotProvider({ children }) {
  const [lots, setLots] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeLot);
        }
      }
    } catch (e) {
      console.warn("Failed to read lots from localStorage:", e);
    }
    return initialLotsData.map(normalizeLot);
  });

  const [onlineCount, setOnlineCount] = useState(1);
  const [lastLiveBidEvent, setLastLiveBidEvent] = useState(null);

  const [remindedLots, setRemindedLots] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REMINDERS);
      return stored ? JSON.parse(stored) : [405];
    } catch {
      return [405];
    }
  });

  // Load shared lots from Python FastAPI + SQLite backend on startup
  useEffect(() => {
    let active = true;
    fetch("/api/lots")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setLots(data.map(normalizeLot));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Real-time WebSocket connection for instant sync between PC and Phone
  const wsRef = useRef(null);
  useEffect(() => {
    let reconnectTimer = null;
    let pingTimer = null;
    let unmounted = false;

    const connect = () => {
      if (unmounted) return;
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${proto}//${window.location.host}/ws`;
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          pingTimer = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send("ping");
            }
          }, 25000);
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "online_count" && typeof msg.count === "number") {
              setOnlineCount(msg.count);
            } else if (msg.type === "bid_placed" && msg.lot) {
              const updated = normalizeLot(msg.lot);
              setLots((prev) => {
                const exists = prev.some((l) => Number(l.id) === Number(updated.id));
                return exists
                  ? prev.map((l) => (Number(l.id) === Number(updated.id) ? updated : l))
                  : [updated, ...prev];
              });
              setLastLiveBidEvent({ lotId: Number(updated.id), ts: Date.now() });
            } else if (msg.type === "lot_created" && msg.lot) {
              const created = normalizeLot(msg.lot);
              setLots((prev) => {
                const exists = prev.some((l) => Number(l.id) === Number(created.id));
                return exists ? prev : [created, ...prev];
              });
            }
          } catch {
            // ignore non-json
          }
        };

        ws.onclose = () => {
          clearInterval(pingTimer);
          if (!unmounted) {
            reconnectTimer = setTimeout(connect, 2500);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();
    return () => {
      unmounted = true;
      clearTimeout(reconnectTimer);
      clearInterval(pingTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOTS, JSON.stringify(lots));
    } catch (e) {
      console.warn("Failed to write lots to localStorage:", e);
    }
  }, [lots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(remindedLots));
    } catch (e) {
      console.warn("Failed to write reminders to localStorage:", e);
    }
  }, [remindedLots]);

  const toggleRemind = (lotId) => {
    const id = Number(lotId);
    setRemindedLots((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isReminded = (lotId) => remindedLots.includes(Number(lotId));

  const getLotById = (id) => {
    const numId = Number(id);
    return lots.find((l) => Number(l.id) === numId);
  };

  const addLot = async (newLot) => {
    try {
      const res = await fetch("/api/lots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLot),
      });
      if (res.ok) {
        const created = normalizeLot(await res.json());
        setLots((prev) => {
          const exists = prev.some((l) => Number(l.id) === Number(created.id));
          return exists ? prev : [created, ...prev];
        });
        return created;
      }
    } catch {
      // fallback to local creation below if backend is offline
    }

    const nextId =
      lots.length > 0 ? Math.max(...lots.map((l) => Number(l.id) || 0)) + 1 : 1001;
    const categoryId =
      newLot.categoryId === "classic-cars" ? "cars" : newLot.categoryId || "art";
    const isCar = categoryId === "cars";
    const durationType = newLot.durationType || "7d";
    const isLiveFormat = durationType === "live" || newLot.auctionFormat === "live" || isCar;

    let endsAtIso = "";
    let endsInLabel = "7d 00h";

    if (durationType === "24h") {
      endsAtIso = new Date(Date.now() + 24 * 3600000).toISOString();
      endsInLabel = "24:00:00";
    } else if (durationType === "3d") {
      endsAtIso = new Date(Date.now() + 3 * 86400000).toISOString();
      endsInLabel = "3d 00h";
    } else if (durationType === "7d") {
      endsAtIso = new Date(Date.now() + 7 * 86400000).toISOString();
      endsInLabel = "7d 00h";
    } else if (durationType === "14d") {
      endsAtIso = new Date(Date.now() + 14 * 86400000).toISOString();
      endsInLabel = "14d 00h";
    } else if (durationType === "custom" && newLot.customEndsAt) {
      const targetMs = new Date(newLot.customEndsAt).getTime();
      endsAtIso = new Date(targetMs).toISOString();
      endsInLabel = formatDurationLeft(targetMs - Date.now());
    } else if (durationType === "live" && newLot.liveStartAt) {
      const targetMs = new Date(newLot.liveStartAt).getTime();
      endsAtIso = new Date(targetMs).toISOString();
      endsInLabel = formatDurationLeft(targetMs - Date.now());
    } else {
      const days = Number(newLot.durationDays) || 7;
      endsAtIso = new Date(Date.now() + days * 86400000).toISOString();
      endsInLabel = `${days}d 00h`;
    }

    const coverImage =
      newLot.image ||
      (newLot.gallery && newLot.gallery[0]) ||
      (isCar ? "/images/car-front.jpg" : "/images/lot-painting.jpg");

    const createdLot = {
      id: nextId,
      title: newLot.title || "Untitled Lot",
      categoryId,
      image: coverImage,
      gallery:
        newLot.gallery && newLot.gallery.length > 0
          ? newLot.gallery
          : [coverImage],
      currentBid: Number(newLot.startingPrice) || 100,
      startingPrice: Number(newLot.startingPrice) || 100,
      minIncrement: Number(newLot.minIncrement) || 20,
      currency: "$",
      bidsCount: 0,
      bidHistory: [],
      status: "active",
      badge: isLiveFormat ? "copart-live" : "live",
      auctionFormat: isLiveFormat ? "live" : "timed",
      durationType,
      liveStartAt: newLot.liveStartAt || null,
      isHot: durationType === "24h" || isLiveFormat,
      featured: false,
      endsIn: endsInLabel,
      endsAt: endsAtIso,
      seller: newLot.seller || {
        id: "me",
        name: "Current User",
        verified: false,
        rating: 5.0,
      },
      specs: newLot.specs || {},
      description: newLot.description || "",
      contactPhone: newLot.contactPhone || "",
      createdAt: new Date().toISOString(),
    };

    setLots((prev) => [createdLot, ...prev]);
    return createdLot;
  };

  const placeBid = async (lotId, bidAmount, bidder) => {
    const numId = Number(lotId);
    const amount = Number(bidAmount);

    const bidderName =
      bidder?.name ||
      (bidder?.firstName
        ? `${bidder.firstName} ${bidder.lastName || ""}`.trim()
        : "Անանուն մասնակից");
    const bidderId = bidder?.id || "guest";

    try {
      const res = await fetch(`/api/lots/${numId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          bidderId,
          bidderName,
          bidderAvatar: bidder?.avatar || null,
        }),
      });
      if (res.ok) {
        const updated = normalizeLot(await res.json());
        setLots((prev) =>
          prev.map((l) => (Number(l.id) === numId ? updated : l))
        );
        return updated;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Խաղադրույքի սխալ:");
      }
    } catch (err) {
      if (err.message && !err.message.includes("fetch")) {
        throw err;
      }
      // Fallback to local state if backend is offline
    }

    const target = lots.find((l) => Number(l.id) === numId);
    if (!target) {
      throw new Error("Լոտը չի գտնվել:");
    }
    const curPrice = Number(target.currentBid) || Number(target.startingPrice) || 0;
    if (amount <= curPrice) {
      throw new Error(`Առաջարկը պետք է գերազանցի ընթացիկ գինը ($${curPrice.toLocaleString()})`);
    }

    const nowIso = new Date().toISOString();
    const newBidEntry = {
      id: "bid_" + Date.now(),
      bidderId,
      bidderName,
      bidderAvatar: bidder?.avatar || null,
      amount,
      time: nowIso,
    };

    let updatedLot = null;
    setLots((prev) =>
      prev.map((lot) => {
        if (Number(lot.id) === numId) {
          const prevHistory = Array.isArray(lot.bidHistory) ? lot.bidHistory : [];
          updatedLot = {
            ...lot,
            currentBid: amount,
            bidsCount: (lot.bidsCount || 0) + 1,
            lastBidder: bidderName,
            lastBidderId: bidderId,
            lastBidTime: nowIso,
            bidHistory: [newBidEntry, ...prevHistory],
          };
          return updatedLot;
        }
        return lot;
      })
    );

    return updatedLot;
  };

  return (
    <LotContext.Provider
      value={{
        lots,
        getLotById,
        addLot,
        placeBid,
        remindedLots,
        toggleRemind,
        isReminded,
        onlineCount,
        lastLiveBidEvent,
      }}
    >
      {children}
    </LotContext.Provider>
  );
}

export function useLots() {
  const ctx = useContext(LotContext);
  if (!ctx) {
    throw new Error("useLots must be used within a LotProvider");
  }
  return ctx;
}
