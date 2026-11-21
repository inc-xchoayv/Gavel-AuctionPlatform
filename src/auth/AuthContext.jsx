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
  const [session, setSession] = useState(() => readJson(KEY_SESSION, null));
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
      role: user.role,
      avatar: user.avatar || null,
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
        phone: data.phone,
        role: "user",
        status: "active",
        avatar: null,
        registeredAt: new Date().toISOString().slice(0, 10),
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

  const value = useMemo(
    () => ({ session, role: session ? session.role : "guest", login, register, logout, flash, setFlash }),
    [session, login, register, logout, flash, setFlash]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth-ը պետք է օգտագործվի AuthProvider-ի ներսում");
  return ctx;
}
