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

// users.json + localStorage-ում պահված նորերը
function getAllUsers() {
  return [...seedUsers, ...readJson(KEY_USERS, [])];
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
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "+374 94 552234",
      role: user.role,
      avatar: user.avatar || "/images/avatar-winner.svg",
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
        password: data.password, // ՈՒՇԱԴՐՈՒԹՅՈՒՆ՝ միայն ուսումնական նպատակով. իրական կայքում՝ երբեք
        phone: data.phone || "+374 94 552234",
        role: "user",
        status: "active",
        avatar: "/images/avatar-winner.svg",
        registeredAt: new Date().toISOString().slice(0, 10),
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
      localStorage.setItem(KEY_USERS, JSON.stringify([...readJson(KEY_USERS, []), newUser]));
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

      const users = readJson(KEY_USERS, []);
      const userIdx = users.findIndex((u) => u.id === prev.id);
      if (userIdx !== -1) {
        users[userIdx].avatar = newAvatar;
        localStorage.setItem(KEY_USERS, JSON.stringify(users));
      }
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

      const users = readJson(KEY_USERS, []);
      const userIdx = users.findIndex((u) => u.id === prev.id);
      if (userIdx !== -1) {
        users[userIdx].verification = nextVerif;
        localStorage.setItem(KEY_USERS, JSON.stringify(users));
      }
      return updated;
    });
  }, []);

  const updateProfile = useCallback((profileData) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...profileData };
      localStorage.setItem(KEY_SESSION, JSON.stringify(updated));

      const users = readJson(KEY_USERS, []);
      const userIdx = users.findIndex((u) => u.id === prev.id);
      if (userIdx !== -1) {
        users[userIdx] = { ...users[userIdx], ...profileData };
        localStorage.setItem(KEY_USERS, JSON.stringify(users));
      }
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      session,
      role: session ? session.role : "guest",
      login,
      register,
      logout,
      flash,
      setFlash,
      updateAvatar,
      updateVerification,
      updateProfile,
    }),
    [session, login, register, logout, flash, setFlash, updateAvatar, updateVerification, updateProfile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth-ը պետք է օգտագործվի AuthProvider-ի ներսում");
  return ctx;
}
