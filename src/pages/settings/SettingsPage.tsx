import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {useStyle} from "../../providers/StyleProvider";
import {useLanguage} from "../../providers/LanguageProvider";
import {useTranslation} from "react-i18next";
import {LanguageSelector} from "./LanguageSelector";
import {ThemeSelector} from "./ThemeSelector";


export const SettingsPage = () => {
    const {t} = useTranslation();
    const { resetTheme } = useStyle();
    const { resetLanguage } = useLanguage();

    const resetSettingsToDefaults = () => {
        resetTheme();
        resetLanguage();
    }

    return (
        <Box sx={{p: 4, maxWidth: 600, mx: "auto"}}>
            <Typography variant="h4" gutterBottom>
                {t('Settings')}
            </Typography>

            <ThemeSelector/>
            <LanguageSelector/>

            {/* Reset button */}
            <Box sx={{mt: 4}}>
                <Button variant="outlined" color="secondary" onClick={resetSettingsToDefaults}>
                    {t('Reset to Defaults')}
                </Button>
            </Box>
        </Box>
    );
};
