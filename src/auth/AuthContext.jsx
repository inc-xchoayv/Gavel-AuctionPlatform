import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import seedUsers from "../data/users.json";

const KEY_USERS = "gavel_users";     // գրանցված նոր օգտատերեր («կեղծ բազա»)
const KEY_SESSION = "gavel_session"; // ընթացիկ մուտք գործած օգտատեր

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

// users.json + localStorage-ում պահված նորերը (localStorage-ը թարմացնում է seedUsers-ին նույն id-ով)
export function getAllUsers() {
  const stored = readJson(KEY_USERS, []);
  const map = new Map();
  seedUsers.forEach((u) => map.set(String(u.id), u));
  stored.forEach((u) => {
    const existing = map.get(String(u.id)) || {};
    map.set(String(u.id), { ...existing, ...u });
  });
  return Array.from(map.values());
}

export function getUserById(userId) {
  if (!userId) return null;
  const all = getAllUsers();
  return (
    all.find((u) => String(u.id) === String(userId)) ||
    all.find(
      (u) =>
        `${u.firstName || ""} ${u.lastName || ""}`.trim().toLowerCase() ===
        String(userId).trim().toLowerCase()
    ) ||
    null
  );
}

function upsertStoredUser(updatedUser) {
  const users = readJson(KEY_USERS, []);
  const idx = users.findIndex((u) => String(u.id) === String(updatedUser.id));
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedUser };
  } else {
    users.push(updatedUser);
  }
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const s = readJson(KEY_SESSION, null);
    if (!s) return null;
    // ensure verification object exists
    if (!s.verification) {
      s.verification = {
        status: "unverified",
        idNumber: "",
        citizenship: "am",
        firstName: "",
        lastName: "",
        dob: "",
        phone: s.phone || "+374 94 552234",
        files: [],
      };
    }
    return s;
  });

  const [flash, setFlashState] = useState("");
  const flashTimer = useRef(null);

  // Կարճատև ծանուցում (toast), որը 4 վայրկյանից ինքն է անհետանում
  const setFlash = useCallback((message) => {
    setFlashState(message);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashState(""), 4000);
  }, []);
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const startSession = useCallback((user) => {
    const next = {
      ...user,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "+374 94 552234",
      role: user.role,
      avatar: user.avatar ? (user.avatar.startsWith("images/") ? `/${user.avatar}` : user.avatar) : "/images/avatar-winner.svg",
      verification: user.verification || {
        status: "unverified",
        idNumber: "",
        citizenship: "am",
        firstName: "",
        lastName: "",
        dob: "",
        phone: user.phone || "+374 94 552234",
        files: [],
      },
    };
    localStorage.setItem(KEY_SESSION, JSON.stringify(next));
    setSession(next);
    return next;
  }, []);

  // Վերադարձնում է { ok: true, user } կամ { ok: false, error: "բանալի" }
  const login = useCallback(
    (email, password) => {
      const user = getAllUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) return { ok: false, error: "err_wrong_credentials" };
      if (user.status === "blocked") return { ok: false, error: "err_account_blocked" };
      startSession(user);
      return { ok: true, user };
    },
    [startSession]
  );

  const register = useCallback(
    (data) => {
      if (getAllUsers().some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { ok: false, error: "err_email_exists" };
      }
      const newUser = {
        id: Date.now(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || "+374 94 552234",
        role: "user",
        status: "active",
        avatar: "/images/avatar-winner.svg",
        registeredAt: new Date().toISOString().slice(0, 10),
        address: "",
        city: "",
        zip: "",
        bio: "",
        balance: 0,
        freeBalance: 0,
        lockedBalance: 0,
        cards: [],
        verification: {
          status: "unverified",
          idNumber: "",
          citizenship: "am",
          firstName: "",
          lastName: "",
          dob: "",
          phone: data.phone || "+374 94 552234",
          files: [],
        },
      };
      upsertStoredUser(newUser);
      startSession(newUser);
      return { ok: true, user: newUser };
    },
    [startSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(KEY_SESSION);
    setSession(null);
  }, []);

  const updateAvatar = useCallback((newAvatar) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, avatar: newAvatar };
      localStorage.setItem(KEY_SESSION, JSON.stringify(updated));
      upsertStoredUser(updated);
      return updated;
    });
  }, []);

  const updateVerification = useCallback((verificationData) => {
    setSession((prev) => {
      if (!prev) return prev;
      const currentVerif = prev.verification || {};
      const nextVerif = { ...currentVerif, ...verificationData };
      const updated = { ...prev, verification: nextVerif };
      localStorage.setItem(KEY_SESSION, JSON.stringify(updated));
      upsertStoredUser(updated);
      return updated;
    });
  }, []);

  const updateProfile = useCallback((profileData) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...profileData };
      localStorage.setItem(KEY_SESSION, JSON.stringify(updated));
      upsertStoredUser(updated);
      return updated;
    });
  }, []);

  const currentUser = useMemo(() => {
    if (!session) return null;
    return {
      ...session,
      name: `${session.firstName || ""} ${session.lastName || ""}`.trim() || session.email,
    };
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      user: currentUser,
      role: session ? session.role : "guest",
      login,
      register,
      logout,
      flash,
      setFlash,
      updateAvatar,
      updateVerification,
      updateProfile,
      getAllUsers,
      getUserById,
    }),
    [session, currentUser, login, register, logout, flash, setFlash, updateAvatar, updateVerification, updateProfile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth-ը պետք է օգտագործվի AuthProvider-ի ներսում");
  return ctx;
}
