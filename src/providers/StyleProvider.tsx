import React, {createContext, ReactNode, useContext, useMemo, useState} from "react";
import {createTheme, PaletteMode, ThemeProvider} from "@mui/material";
import useSettings from "../hooks/useSettings";

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
}

interface ThemeContextType {
    activeAppTheme: PaletteMode;
    toggleTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useStyle = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useCustomTheme must be used within CustomThemeProvider');
    }
    return context;
};

interface CustomThemeProviderProps {
    children: ReactNode;
}

export const StyleProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
    const { settings } = useSettings();
    const [activeAppTheme, setActiveAppTheme] = useState<PaletteMode>(settings.theme);

    const changeActiveAppTheme = (theme: Theme) => {
        setActiveAppTheme(theme);
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: { mode: activeAppTheme },
            }),
        [activeAppTheme]
    );

    return (
        <ThemeContext.Provider value={{ activeAppTheme, toggleTheme: changeActiveAppTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};
