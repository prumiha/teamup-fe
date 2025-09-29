import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import useLocalStorage, {LOCAL_STORAGE_LANGUAGE_KEY} from "../hooks/useLocalStorage";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {Box} from "@mui/material";
import {DEFAULT_SETTINGS} from "../hooks/useSettings";

export enum Language {
    ENGLISH = "english",
    CROATIAN = "croatian",
}

const DEFAULT_LANGUAGE = Language.ENGLISH;

const enumToI18nCode = (lang: Language) => {
    switch (lang) {
        case Language.ENGLISH:
            return "en";
        case Language.CROATIAN:
            return "hr";
    }
};

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: {
                "Login": "Login",
                // Navigation
                "Home": "Home",
                "Profile": "Profile",
                "Settings": "Settings",
                // Settings page
                "Theme": "Theme",
                "Light": "Light",
                "Dark": "Dark",
                "Language": "Language",
                "English": "English",
                "Croatian": "Croatian",
                "Reset to Defaults": "Reset to Defaults",
                // Test/demo page
                "Light Theme": "Light Theme",
                "Dark Theme": "Dark Theme",
                "Paste": "Paste",
                "Web Clipboard": "Web Clipboard",
                "Test message": "Test message"
            }},
        hr: {translation: {
                "Login": "Prijava",
                // Navigation
                "Home": "Početna",
                "Profile": "Profil",
                "Settings": "Postavke",
                // Settings page
                "Theme": "Tema",
                "Light": "Svijetla",
                "Dark": "Tamna",
                "Language": "Jezik",
                "English": "Engleski",
                "Croatian": "Hrvatski",
                "Reset to Defaults": "Vrati na zadano",
                // Test/demo page
                "Light Theme": "Svijetla tema",
                "Dark Theme": "Tamna tema",
                "Paste": "Zalijepi",
                "Web Clipboard": "Web međuspremnik",
                "Test message": "Test poruka"
            }},
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {escapeValue: false},
});


interface LanguageContextType {
    activeLanguage: Language;
    setLanguage: (lang: Language) => void;
    resetLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
};


export const LanguageProvider: React.FC<{ children: ReactNode; }> = ({children}) => {
    const localStorage = useLocalStorage();
    const storedLanguage = localStorage.get<Language>(LOCAL_STORAGE_LANGUAGE_KEY);
    const [activeLanguage, setActiveLanguageState] = useState<Language>(storedLanguage || DEFAULT_SETTINGS.language);

    const setLanguage = (lang: Language) => {
        const i18code = enumToI18nCode(lang);
        localStorage.set(LOCAL_STORAGE_LANGUAGE_KEY, lang);
        setActiveLanguageState(lang);
        i18n.changeLanguage(i18code);
    };

    const resetLanguage = () => {
        localStorage.remove(LOCAL_STORAGE_LANGUAGE_KEY);
        setLanguage(DEFAULT_LANGUAGE);
    };

    // Ensure i18n is aligned with stored or default language on mount
    useEffect(() => {
        setLanguage(activeLanguage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <LanguageContext.Provider value={{activeLanguage: activeLanguage, setLanguage, resetLanguage}}>
            <Box>{children}</Box>
        </LanguageContext.Provider>
    );
};
