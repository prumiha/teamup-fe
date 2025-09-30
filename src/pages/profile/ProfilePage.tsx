import {useTranslation} from "react-i18next";
import {useStyle} from "../../providers/StyleProvider";
import {useLanguage} from "../../providers/LanguageProvider";
import {Box, Button, Typography} from "@mui/material";
import {ThemeSelector} from "../settings/ThemeSelector";
import {LanguageSelector} from "../settings/LanguageSelector";
import React from "react";

export const ProfilePage = () => {
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

            <Box sx={{mt: 4}}>
                <Button variant="outlined" onClick={resetSettingsToDefaults}>
                    {t('Reset to Defaults')}
                </Button>
            </Box>
        </Box>
    );
};