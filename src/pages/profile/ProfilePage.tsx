import {useTranslation} from "react-i18next";
import {Box, Card, CardContent, CardHeader, Collapse, IconButton} from "@mui/material";
import React, {useState} from "react";
import {SettingsPage} from "../settings/SettingsPage";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import EditProfile from "./EditProfile";

export const ProfilePage = () => {
    const {t} = useTranslation();

    const [expandSettings, setExpandSettings] = useState(true);

    const handleToggle = () => {
        setExpandSettings(prev => !prev);
    };

    return (
        <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
            <EditProfile />
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
                <CardHeader
                    title={t("Settings")}
                    action={
                        <IconButton onClick={handleToggle}>
                            {expandSettings ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    }
                />
                <Collapse in={expandSettings} timeout="auto" unmountOnExit>
                    <CardContent sx={{ p: 0 }}>
                        <SettingsPage />
                    </CardContent>
                </Collapse>
            </Card>
        </Box>
    );
};