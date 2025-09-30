export enum Theme {
    LIGHT = "light",
    DARK = "dark",
}

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

