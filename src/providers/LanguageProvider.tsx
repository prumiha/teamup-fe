import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import useLocalStorage, {LOCAL_STORAGE_LANGUAGE_KEY} from "../hooks/useLocalStorage";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {Box} from "@mui/material";
import {DEFAULT_SETTINGS, Language} from "../hooks/useSettings";

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
                // Alerts / SecureRoute
                "Sign in to access this page": "Sign in to access this page",
                "You are trying to access a page you should not be accessing": "You are trying to access a page you should not be accessing",
                "You are not allowed to visit this site": "You are not allowed to visit this site",
                // Test/demo page
                "Light Theme": "Light Theme",
                "Dark Theme": "Dark Theme",
                "Paste": "Paste",
                "Web Clipboard": "Web Clipboard",
                "Test message": "Test message",
                // EditProfile
                "Edit Profile": "Edit Profile",
                "Update your personal information": "Update your personal information",
                "Upload": "Upload",
                "Remove avatar": "Remove avatar",
                "Cancel": "Cancel",
                "Save": "Save",
                "Username": "Username",
                "Full name": "Full name",
                "Email": "Email",
                "Phone": "Phone",
                "Bio": "Bio",
                "Note: Email and phone are optional. Bio is a short description (max 500 characters).": "Note: Email and phone are optional. Bio is a short description (max 500 characters).",
                "Username is required": "Username is required",
                "Username must be 3-20 characters": "Username must be 3-20 characters",
                "Username can include letters, numbers, dot, underscore, and hyphen only": "Username can include letters, numbers, dot, underscore, and hyphen only",
                "Full name must be at most 50 characters": "Full name must be at most 50 characters",
                "Full name contains invalid characters": "Full name contains invalid characters",
                "Email must be at most 40 characters": "Email must be at most 40 characters",
                "Enter a valid email": "Enter a valid email",
                "Phone must be at most 20 characters": "Phone must be at most 20 characters",
                "Phone can contain digits, +, -, and spaces only": "Phone can contain digits, +, -, and spaces only",
                "Bio must be at most 500 characters": "Bio must be at most 500 characters"
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
                // Alerts / SecureRoute
                "Sign in to access this page": "Prijavite se za pristup ovoj stranici",
                "You are trying to access a page you should not be accessing": "Pokušavate pristupiti stranici za koju nemate prava pristupa",
                "You are not allowed to visit this site": "Niste ovlašteni za pristup ovoj stranici",
                // Test/demo page
                "Light Theme": "Svijetla tema",
                "Dark Theme": "Tamna tema",
                "Paste": "Zalijepi",
                "Web Clipboard": "Web međuspremnik",
                "Test message": "Test poruka",
                // EditProfile
                "Edit Profile": "Uredi profil",
                "Update your personal information": "Ažurirajte svoje osobne podatke",
                "Upload": "Učitaj",
                "Remove avatar": "Ukloni avatar",
                "Cancel": "Odustani",
                "Save": "Spremi",
                "Username": "Korisničko ime",
                "Full name": "Puno ime",
                "Email": "E-mail",
                "Phone": "Telefon",
                "Bio": "Bio",
                "Note: Email and phone are optional. Bio is a short description (max 500 characters).": "Napomena: E-mail i telefon su opcionalni. Bio je kratak opis (najviše 500 znakova).",
                "Username is required": "Korisničko ime je obavezno",
                "Username must be 3-20 characters": "Korisničko ime mora imati 3–20 znakova",
                "Username can include letters, numbers, dot, underscore, and hyphen only": "Korisničko ime može sadržavati samo slova, brojke, točku, donju crtu i crticu",
                "Full name must be at most 50 characters": "Puno ime može imati najviše 50 znakova",
                "Full name contains invalid characters": "Puno ime sadrži nedozvoljene znakove",
                "Email must be at most 40 characters": "E-mail može imati najviše 40 znakova",
                "Enter a valid email": "Unesite valjanu e-mail adresu",
                "Phone must be at most 20 characters": "Telefon može imati najviše 20 znakova",
                "Phone can contain digits, +, -, and spaces only": "Telefon može sadržavati samo znamenke, +, - i razmake",
                "Bio must be at most 500 characters": "Bio može imati najviše 500 znakova"
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
