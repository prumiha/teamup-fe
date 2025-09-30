import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    IconButton,
    LinearProgress,
    Stack,
} from "@mui/material";
import {Close as CloseIcon, Delete as DeleteIcon, Save as SaveIcon, Upload as UploadIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import UsernameField from "../../components/profile/fields/UsernameField";
import FullNameField from "../../components/profile/fields/FullNameField";
import EmailField from "../../components/profile/fields/EmailField";
import PhoneField from "../../components/profile/fields/PhoneField";
import BioField from "../../components/profile/fields/BioField";

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
    onCancel?: () => void;
    loading?: boolean;
    title?: string;
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

export const EditProfile: React.FC<EditProfileProps> = ({
                                                            initialValues,
                                                            onSubmit,
                                                            onCancel,
                                                            loading,
                                                            title = "Edit Profile",
                                                        }) => {
    const {t} = useTranslation();
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
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialValues?.avatarUrl ?? null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            // Revoke any created object URLs on unmount
            if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isValid = useMemo(() => (
        validUsername && validFullName && validEmail && validPhone && validBio
    ), [validUsername, validFullName, validEmail, validPhone, validBio]);

    const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        setAvatarFile(file);
    };

    const removeAvatar = () => {
        if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
        setAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

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
            avatarUrl: avatarPreview,
        };
        await onSubmit?.(payload);
    };

    return (
        <Card component="form" onSubmit={handleSubmit} sx={{maxWidth: 720, mx: "auto"}}>
            {loading && <LinearProgress/>}
            <CardHeader title={t(title)} subheader={t("Update your personal information")}/>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack alignItems="center" spacing={2}>
                            <Avatar src={avatarPreview ?? undefined} sx={{width: 96, height: 96}}/>
                            <Stack direction="row" spacing={1}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarPick}
                                    style={{display: 'none'}}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<UploadIcon/>}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {t("Upload")}
                                </Button>
                                {avatarPreview && (
                                    <IconButton color="error" size="small" onClick={removeAvatar}
                                                aria-label={t("Remove avatar")}>
                                        <DeleteIcon/>
                                    </IconButton>
                                )}
                            </Stack>
                            {avatarFile && (
                                <Chip size="small" label={avatarFile.name} sx={{maxWidth: '100%'}}/>
                            )}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Stack spacing={2}>
                            <UsernameField
                                value={username}
                                onChange={setUsername}
                                onValidChange={setValidUsername}
                                autoFocus
                            />
                            <FullNameField
                                value={fullName ?? ""}
                                onChange={setFullName}
                                onValidChange={setValidFullName}
                            />
                            <EmailField
                                value={email ?? ""}
                                onChange={setEmail}
                                onValidChange={setValidEmail}
                            />
                            <PhoneField
                                value={phone ?? ""}
                                onChange={setPhone}
                                onValidChange={setValidPhone}
                            />
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <BioField
                            value = {bio ?? ""}
                            onChange = {setBio}
                            onValidChange = {setValidBio}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{justifyContent: 'flex-end', p: 2}}>
                {onCancel && (
                    <Button variant="text" color="inherit" startIcon={<CloseIcon/>} onClick={onCancel}
                            disabled={!!loading}>
                        {t("Cancel")}
                    </Button>
                )}
                <Button type="submit" variant="contained" startIcon={<SaveIcon/>} disabled={!!loading || !isValid}>
                    {t("Save")}
                </Button>
            </CardActions>
        </Card>
    );
};

export default EditProfile;
