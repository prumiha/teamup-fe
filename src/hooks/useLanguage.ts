import {useEffect} from "react";
import {initReactI18next} from "react-i18next";
import i18n from "i18next";
import useSettings from "./useSettings";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                "Login": "Login",
            }
        },
        hr: {
            translation: {
                "Login": "Prijava",
            }
        },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export const useLanguage = () => {
    const { settings } = useSettings();
    useEffect(() => {
        i18n.changeLanguage(settings.language);
    }, [settings.language]);
};