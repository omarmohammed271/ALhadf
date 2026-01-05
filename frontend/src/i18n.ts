import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enTranslation from "./locales/en/translation.json"
import arTranslation from "./locales/ar/translation.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    lng: localStorage.getItem("lang") || "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: true
    }
  })

export default i18n
