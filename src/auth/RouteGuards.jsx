import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useI18n } from "../i18n/I18nContext";

// Պաշտպանված էջ. role="user"՝ պետք է մուտք գործած լինի, role="admin"՝ միայն ադմին
// ԿԱՐԵՎՈՐ՝ սա միայն UI պաշտպանություն է. իրական անվտանգությունը backend-ի գործն է
export function ProtectedRoute({ role = "user", children }) {
  const { session, setFlash } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  const needsLogin = !session;
  const notAdmin = role === "admin" && session && session.role !== "admin";

  useEffect(() => {
    if (needsLogin) setFlash(t("toast_guard_login"));
    else if (notAdmin) setFlash(t("toast_guard_admin"));
  }, [needsLogin, notAdmin, setFlash, t]);

  if (needsLogin) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  if (notAdmin) return <Navigate to="/" replace />;
  return children;
}

// Login / Register էջեր՝ միայն հյուրերի համար
export function GuestOnlyRoute({ children }) {
  const { session } = useAuth();
  if (session) return <Navigate to="/profile" replace />;
  return children;
}
