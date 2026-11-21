import React, { createContext, useContext, useState, useEffect } from "react";
import initialLotsData from "../data/lots.json";

const STORAGE_KEY_LOTS = "gavel_lots";
const STORAGE_KEY_REMINDERS = "gavel_reminders";

const LotContext = createContext(null);

export function LotProvider({ children }) {
  // Load lots from localStorage or fall back to seed data
  const [lots, setLots] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read lots from localStorage:", e);
    }
    return initialLotsData;
  });

  // Reminders / Bookmarks (lot IDs)
  const [remindedLots, setRemindedLots] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REMINDERS);
      return stored ? JSON.parse(stored) : [405]; // 405 bookmarked by default in mock
    } catch {
      return [405];
    }
  });

  // Keep lots synced to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOTS, JSON.stringify(lots));
    } catch (e) {
      console.warn("Failed to write lots to localStorage:", e);
    }
  }, [lots]);

  // Keep reminders synced to localStorage
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

  const addLot = (newLot) => {
    const nextId = lots.length > 0 ? Math.max(...lots.map((l) => Number(l.id) || 0)) + 1 : 1001;
    const createdLot = {
      id: nextId,
      title: newLot.title || "Untitled Lot",
      categoryId: newLot.categoryId || "art",
      image: newLot.image || "/images/lot-painting.jpg",
      gallery: newLot.gallery && newLot.gallery.length > 0 ? newLot.gallery : [newLot.image || "/images/lot-painting.jpg"],
      currentBid: Number(newLot.startingPrice) || 100,
      startingPrice: Number(newLot.startingPrice) || 100,
      minIncrement: Number(newLot.minIncrement) || 20,
      currency: "$",
      bidsCount: 0,
      status: "active",
      badge: "live",
      isHot: false,
      featured: false,
      endsIn: newLot.durationDays ? `${newLot.durationDays}d 00h` : "3d 00h",
      endsAt: new Date(Date.now() + (newLot.durationDays || 3) * 86400000).toISOString(),
      seller: newLot.seller || {
        id: "me",
        name: "Current User",
        verified: false,
        rating: 5.0,
      },
      specs: newLot.specs || {},
      description: newLot.description || "",
      createdAt: new Date().toISOString(),
    };

    setLots((prev) => [createdLot, ...prev]);
    return createdLot;
  };

  const placeBid = (lotId, bidAmount, bidder) => {
    const numId = Number(lotId);
    const amount = Number(bidAmount);

    let updatedLot = null;
    setLots((prev) =>
      prev.map((lot) => {
        if (Number(lot.id) === numId) {
          if (amount <= lot.currentBid) {
            throw new Error(`Bid must be greater than current bid ($${lot.currentBid})`);
          }
          updatedLot = {
            ...lot,
            currentBid: amount,
            bidsCount: (lot.bidsCount || 0) + 1,
            lastBidder: bidder ? bidder.name : "Anonymous",
            lastBidTime: new Date().toISOString(),
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
