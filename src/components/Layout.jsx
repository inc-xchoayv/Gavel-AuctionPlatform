import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import { useAuth } from "../auth/AuthContext";

// Էջը փոխելիս ոլորում ենք դեպի վերև
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

// Ծանուցում (flash toast)՝ ցուցադրվում է, երբ AuthContext-ում flash կա
function FlashToast() {
  const { flash } = useAuth();
  return flash ? <div className="flash-toast">{flash}</div> : null;
}

// Layout = ընդհանուր կմախք. Header + (ընթացիկ էջը <Outlet/>-ում) + Footer + Chat
// Սա փոխարինում է 15 HTML-ում կրկնվող header/footer/chat կոդին
export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
      <ChatWidget />
      <FlashToast />
    </>
  );
}
