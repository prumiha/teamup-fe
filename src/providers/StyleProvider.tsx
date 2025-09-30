import React, {createContext, ReactNode, useContext, useMemo, useState} from "react";
import {Box, createTheme, PaletteMode, ThemeProvider} from "@mui/material";
import useLocalStorage, {LOCAL_STORAGE_THEME_KEY} from "../hooks/useLocalStorage";
import {DEFAULT_SETTINGS, Theme} from "../hooks/useSettings";

interface ThemeContextType {
    activeTheme: Theme;
    setTheme: (theme: Theme) => void;
    resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useStyle = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useStyle must be used within StyleProvider");
    }
    return context;
};

interface StyleProviderProps {
    children: ReactNode;
}

export const StyleProvider: React.FC<StyleProviderProps> = ({children}) => {
    const localStorage = useLocalStorage();
    const storedTheme = localStorage.get<Theme>(LOCAL_STORAGE_THEME_KEY);
    const [activeTheme, setActiveTheme] = useState<Theme>(storedTheme || DEFAULT_SETTINGS.theme);

    const setTheme = (theme: Theme) => {
        localStorage.set(LOCAL_STORAGE_THEME_KEY, theme);
        setActiveTheme(theme);
    };

    const resetTheme = () => {
        localStorage.remove(LOCAL_STORAGE_THEME_KEY);
        setTheme(DEFAULT_SETTINGS.theme);
    }

    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {mode: activeTheme as PaletteMode},
            }),
        [activeTheme]
    );

    return (
        <ThemeContext.Provider value={{activeTheme, setTheme, resetTheme}}>
            <ThemeProvider theme={muiTheme}>
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: (theme) => theme.palette.background.default,
                        color: (theme) => theme.palette.text.primary,
                    }}
                >
                    {children}
                </Box>

            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
