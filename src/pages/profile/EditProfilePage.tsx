import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, LinearProgress, Stack,} from "@mui/material";
import {Close as CloseIcon, Save as SaveIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import EditUsernameField from "./components/EditUsernameField";
import EditFullNameField from "./components/EditFullNameField";
import EditEmailField from "./components/EditEmailField";
import EditPhoneField from "./components/EditPhoneField";
import EditBioField from "./components/EditBioField";
import {EditAvatarImage} from "./components/EditAvatarImage";
import {useNavigate} from "react-router-dom";
import {NavigationPaths} from "../navigation/Navigation";

export type EditProfileValues = {
    username: string;
    fullName?: string;
    email?: string | null;
    phone?: string | null;
    bio?: string | null;
    avatarFile?: File | null;
    avatarUrl?: string | null;
};

export type EditProfileProps = {
    initialValues?: Partial<EditProfileValues>;
    onSubmit?: (values: EditProfileValues) => void | Promise<void>;
    loading?: boolean;
};

const DEFAULT_VALUES: EditProfileValues = {
    username: "",
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    avatarFile: null,
    avatarUrl: null,
};

export const EditProfilePage: React.FC<EditProfileProps> = ({
                                                            initialValues,
                                                            onSubmit,
                                                            loading
                                                        }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    // Separate states per field
    const [username, setUsername] = useState<string>(initialValues?.username ?? DEFAULT_VALUES.username);
    const [fullName, setFullName] = useState<string>(initialValues?.fullName ?? DEFAULT_VALUES.fullName ?? "");
    const [email, setEmail] = useState<string>(initialValues?.email ?? (DEFAULT_VALUES.email ?? ""));
    const [phone, setPhone] = useState<string>(initialValues?.phone ?? (DEFAULT_VALUES.phone ?? ""));
    const [bio, setBio] = useState<string>(initialValues?.bio ?? (DEFAULT_VALUES.bio ?? ""));
    const [avatarFile, setAvatarFile] = useState<File | null>(initialValues?.avatarFile ?? DEFAULT_VALUES.avatarFile ?? null);

    const [validUsername, setValidUsername] = useState<boolean>(false);
    const [validFullName, setValidFullName] = useState<boolean>(true);
    const [validEmail, setValidEmail] = useState<boolean>(true);
    const [validPhone, setValidPhone] = useState<boolean>(true);
    const [validBio, setValidBio] = useState<boolean>(true);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialValues?.avatarUrl ?? null);

    useEffect(() => {
        return () => {
            // Revoke any created object URLs on unmount
            if (avatarUrl && avatarUrl.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isValid = useMemo(() => (
        validUsername && validFullName && validEmail && validPhone && validBio
    ), [validUsername, validFullName, validEmail, validPhone, validBio]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // const eMap = validate();
        // if (Object.values(eMap).some(Boolean)) return;
        const payload: EditProfileValues = {
            username: username.trim(),
            fullName: fullName?.trim() || "",
            email: email?.trim() || "",
            phone: phone?.trim() || "",
            bio: bio ?? "",
            avatarFile,
            avatarUrl: avatarUrl,
        };
        await onSubmit?.(payload);
    };

    return (
        <Card component="form" onSubmit={handleSubmit} sx={{maxWidth: 720, mx: "auto"}}>
            {loading && <LinearProgress/>}
            <CardHeader title={t("Edit Profile")} subheader={t("Update your personal information")}/>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, sm: 4}}>
                        <EditAvatarImage
                            initialUrl={initialValues?.avatarUrl ?? null}
                            initialFile={initialValues?.avatarFile ?? null}
                            onChange={(file, url) => {
                                setAvatarFile(file);
                                setAvatarUrl(url);
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 8}}>
                        <Stack spacing={2}>
                            <EditUsernameField
                                value={username}
                                onChange={setUsername}
                                onValidChange={setValidUsername}
                                autoFocus
                            />
                            <EditFullNameField
                                value={fullName ?? ""}
                                onChange={setFullName}
                                onValidChange={setValidFullName}
                            />
                            <EditEmailField
                                value={email ?? ""}
                                onChange={setEmail}
                                onValidChange={setValidEmail}
                            />
                            <EditPhoneField
                                value={phone ?? ""}
                                onChange={setPhone}
                                onValidChange={setValidPhone}
                            />
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <EditBioField
                            value={bio ?? ""}
                            onChange={setBio}
                            onValidChange={setValidBio}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{justifyContent: 'flex-end', p: 2}}>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<CloseIcon/>}
                    onClick={() => navigate(NavigationPaths.PROFILE)}
                    size="small"
                    disabled={!!loading}
                    sx={{ minWidth: 100 }}
                >
                    {t("Cancel")}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon/>}
                    disabled={!!loading || !isValid}
                    sx={{ minWidth: 100 }}
                >
                    {t("Save")}
                </Button>
            </CardActions>
        </Card>
    );
};
