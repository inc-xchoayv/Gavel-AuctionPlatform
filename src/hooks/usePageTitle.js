import { useEffect } from "react";
import { useI18n } from "../i18n/I18nContext";

// Սահմանում է էջի վերնագիրը (<title>) ըստ ընթացիկ լեզվի
export default function usePageTitle(key) {
  const { t } = useI18n();
  useEffect(() => {
    document.title = t(key);
  }, [key, t]);
}
