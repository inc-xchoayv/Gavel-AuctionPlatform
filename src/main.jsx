import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { I18nProvider } from "./i18n/I18nContext";
import { AuthProvider } from "./auth/AuthContext";
import "./styles/common.css";

// Մուտքի կետ. React-ը «նկարում» է <App/>-ը index.html-ի #root div-ում
// Provider-ները «փաթաթում» են ամբողջ կայքը, որպեսզի լեզուն և սեսիան հասանելի լինեն ամենուր
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);
