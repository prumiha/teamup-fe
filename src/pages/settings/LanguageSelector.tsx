import {useTranslation} from "react-i18next";
import React from "react";
import {FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Language, useLanguage} from "../../providers/LanguageProvider";


export const LanguageSelector = () => {
    const {t} = useTranslation();
    const {activeLanguage, setLanguage} = useLanguage();

    const handleLanguageChange = (event: SelectChangeEvent<Language>) => {
        setLanguage(event.target.value as Language);
    };

    return (
        <FormControl fullWidth sx={{mt: 2}}>
            <InputLabel id="language-label">{t("Language")}</InputLabel>
            <Select
                labelId="language-label"
                value={activeLanguage}
                label={t("Language")}
                onChange={handleLanguageChange}
                renderValue={(value) => {
                    const lang = value as Language;
                    const flag = lang === Language.ENGLISH ? "🇬🇧" : "🇭🇷";
                    const labelText = lang === Language.ENGLISH ? t("English") : t("Croatian");
                    return (
                        <span style={{display: "flex", alignItems: "center", gap: 8}}>
                            <span style={{fontSize: 18}}>{flag}</span>
                            {labelText}
                        </span>
                    );
                }}
            >
                <MenuItem value={Language.ENGLISH}>
                    <ListItemIcon>
                        <span style={{fontSize: 18}}>🇬🇧</span>
                    </ListItemIcon>
                    <ListItemText>{t("English")}</ListItemText>
                </MenuItem>
                <MenuItem value={Language.CROATIAN}>
                    <ListItemIcon>
                        <span style={{fontSize: 18}}>🇭🇷</span>
                    </ListItemIcon>
                    <ListItemText>{t("Croatian")}</ListItemText>
                </MenuItem>
            </Select>
        </FormControl>
    );
};
