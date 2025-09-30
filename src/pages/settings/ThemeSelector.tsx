import React from "react";
import {FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Brightness4, Brightness7} from "@mui/icons-material";
import {useStyle} from "../../providers/StyleProvider";
import {Theme} from "../../hooks/useSettings";
import {useTranslation} from "react-i18next";

export const ThemeSelector = () => {
    const {t} = useTranslation();
    const {activeTheme, setTheme} = useStyle();

    const handleThemeChange = (event: SelectChangeEvent<Theme>) => {
        setTheme(event.target.value as Theme);
    };

    const renderSelectedOption = (theme: Theme) => {
        const icon = theme === Theme.DARK ? <Brightness4/> : <Brightness7/>;
        const labelText = theme === Theme.DARK ? t("Dark") : t("Light");

        return (
            <span style={{display: "flex", alignItems: "center", gap: 10}}>
                <span style={{display: "flex", alignItems: "center"}}>
                    {icon}
              </span>
                <span>{labelText}</span>
            </span>
        );
    };


    return (
        <FormControl fullWidth sx={{mt: 2}}>
            <InputLabel id="theme-label">{t("Theme")}</InputLabel>
            <Select
                labelId="theme-label"
                value={activeTheme}
                label={t("Theme")}
                onChange={handleThemeChange}
                renderValue={(theme) => {
                    return renderSelectedOption(theme);
                }}
            >
                <MenuItem value={Theme.LIGHT}>
                    <ListItemIcon>
                        <Brightness7 fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>{t("Light")}</ListItemText>
                </MenuItem>
                <MenuItem value={Theme.DARK}>
                    <ListItemIcon>
                        <Brightness4 fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>{t("Dark")}</ListItemText>
                </MenuItem>
            </Select>
        </FormControl>
    );
};
