import {useState} from "react";
import useLocalStorage, {LOCAL_STORAGE_SETTINGS_KEY} from "./useLocalStorage";
import {Theme} from "../providers/StyleProvider";


export enum Language {
    ENGLISH = "english",
    CROATIAN = "croatian",
}

export interface Settings {
    theme: Theme;
    language: Language;

    [key: string]: any;
}

export const DEFAULT_SETTINGS: Settings = {
    theme: Theme.DARK,
    language: Language.ENGLISH,
};

const useSettings = () => {
    const localStorage = useLocalStorage();

    const [settings, setSettingsState] = useState<Settings>(() => {
        return localStorage.get<Settings>(LOCAL_STORAGE_SETTINGS_KEY) || DEFAULT_SETTINGS;
    });

    const setTheme = (theme: Theme) => {
        const newSettings = {...settings, theme};
        setSettingsState(newSettings);
        localStorage.set(LOCAL_STORAGE_SETTINGS_KEY, newSettings);
    };

    const setLanguage = (language: Language) => {
        const newSettings = {...settings, language};
        setSettingsState(newSettings);
        localStorage.set(LOCAL_STORAGE_SETTINGS_KEY, newSettings);
    };

    const setSetting = (key: string, value: any) => {
        const newSettings = {...settings, [key]: value};
        setSettingsState(newSettings);
        localStorage.set(LOCAL_STORAGE_SETTINGS_KEY, newSettings);
    };

    const resetSettings = () => {
        setSettingsState(DEFAULT_SETTINGS);
        localStorage.set(LOCAL_STORAGE_SETTINGS_KEY, DEFAULT_SETTINGS);
    };

    return {settings, setTheme, setLanguage, setSetting, resetSettings};
};

export default useSettings;
