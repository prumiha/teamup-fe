import React, {useEffect, useRef, useState} from "react";
import {Avatar, Box, Button, Chip, Stack} from "@mui/material";
import {Delete as DeleteIcon, Upload as UploadIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

export type AvatarSelectorProps = {
    initialUrl?: string | null;
    initialFile?: File | null;
    onChange?: (file: File | null, previewUrl: string | null) => void;
};

export const EditAvatarImage = ({ initialUrl, initialFile, onChange }: AvatarSelectorProps) => {
    const { t } = useTranslation();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl ?? null);
    const [avatarFile, setAvatarFile] = useState<File | null>(initialFile ?? null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            if (avatarUrl && avatarUrl.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
        };
    }, [avatarUrl]);

    const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (avatarUrl && avatarUrl.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
        setAvatarFile(file);
        onChange?.(file, url);
    };

    const removeAvatar = () => {
        if (avatarUrl && avatarUrl.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
        setAvatarUrl(null);
        setAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onChange?.(null, null);
    };

    return (
        <Stack alignItems="center" spacing={2} direction={"column"} sx={{ width: "100%" }}>
            <Avatar src={avatarUrl ?? undefined} sx={{ width: 96, height: 96 }} />
            <Box sx={{ minHeight: 20, display: "flex", alignItems: "center" }}>
                {avatarFile ? (
                    <Chip size="small" label={avatarFile.name} sx={{ maxWidth: "100%" }} />
                ) : (
                    <Chip size="small" label={t("No file selected")} sx={{ maxWidth: "100%", opacity: 0.6 }} />
                )}
            </Box>
            <Button
                variant="outlined"
                size="small"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ width: "100%" }}
            >
                {avatarFile ? t("Change") : t("Upload")}
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarPick}
                />
            </Button>
            <Button
                variant="contained"
                color="error"
                size="small"
                disabled={!avatarFile}
                onClick={removeAvatar}
                startIcon={<DeleteIcon />}
                sx={{ width: "100%" }}
            >
                {t("Remove")}
            </Button>
        </Stack>
    );
};
