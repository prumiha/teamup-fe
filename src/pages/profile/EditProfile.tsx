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
    TextField
} from "@mui/material";
import {Close as CloseIcon, Delete as DeleteIcon, Save as SaveIcon, Upload as UploadIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

// Validation patterns
const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
const PHONE_PATTERN = /^[0-9+\- ]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const FULL_NAME_PATTERN = /^[a-zA-Z0-9._\- ]+$/;

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

    const [errors, setErrors] = useState<Record<keyof EditProfileValues, string | undefined>>({} as any);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialValues?.avatarUrl ?? null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            // Revoke any created object URLs on unmount
            if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bioCount = bio?.length ?? 0;

    const buildDraft = (overrides: Partial<EditProfileValues> = {}): EditProfileValues => ({
        username,
        fullName,
        email,
        phone,
        bio,
        avatarFile,
        avatarUrl: avatarPreview,
        ...overrides,
    });

    const validate = (overrides: Partial<EditProfileValues> = {}) => {
        const draft = buildDraft(overrides);
        const e: Record<keyof EditProfileValues, string | undefined> = {} as any;

        // username: required, 3-20 chars, allowed pattern
        const u = draft.username?.trim() ?? "";
        if (!u) e.username = t("Username is required");
        else if (u.length < 3 || u.length > 20) e.username = t("Username must be 3-20 characters");
        else if (!USERNAME_PATTERN.test(u)) e.username = t("Username can include letters, numbers, dot, underscore, and hyphen only");

        // full name: max 50, allowed pattern (letters, numbers, dot, underscore, hyphen, space)
        const fn = draft.fullName?.trim() ?? "";
        if (fn) {
            if (fn.length > 50) e.fullName = t("Full name must be at most 50 characters");
            else if (!FULL_NAME_PATTERN.test(fn)) e.fullName = t("Full name contains invalid characters");
        }

        // email: optional, max 40, pattern
        const em = (draft.email ?? "").trim();
        if (em) {
            if (em.length > 40) e.email = t("Email must be at most 40 characters");
            else if (!EMAIL_PATTERN.test(em)) e.email = t("Enter a valid email");
        }

        // phone: optional, max 20, pattern
        const ph = (draft.phone ?? "").trim();
        if (ph) {
            if (ph.length > 20) e.phone = t("Phone must be at most 20 characters");
            else if (!PHONE_PATTERN.test(ph)) e.phone = t("Phone can contain digits, +, -, and spaces only");
        }

        // bio: optional, max 500
        const b = (draft.bio ?? "");
        if (b && b.length > 500) e.bio = t("Bio must be at most 500 characters");

        setErrors(e);
        return e;
    };

    // Run initial validation to populate errors state
    useEffect(() => {
        validate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isValid = useMemo(() => Object.values(errors).every((v) => !v), [errors]);

    const handleChange = (field: keyof Pick<EditProfileValues, 'username' | 'fullName' | 'email' | 'phone' | 'bio'>) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;
            switch (field) {
                case 'username':
                    setUsername(value);
                    break;
                case 'fullName':
                    setFullName(value);
                    break;
                case 'email':
                    setEmail(value);
                    break;
                case 'phone':
                    setPhone(value);
                    break;
                case 'bio':
                    setBio(value);
                    break;
            }
            validate({[field]: value} as Partial<EditProfileValues>);
        };

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
        const eMap = validate();
        if (Object.values(eMap).some(Boolean)) return;
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
                            <TextField
                                label={t("Username")}
                                value={username}
                                onChange={handleChange('username')}
                                error={!!errors.username}
                                helperText={errors.username}
                                inputProps={{maxLength: 20}}
                                required
                                fullWidth
                            />

                            <TextField
                                label={t("Full name")}
                                value={fullName}
                                onChange={handleChange('fullName')}
                                error={!!errors.fullName}
                                helperText={errors.fullName }
                                inputProps={{maxLength: 50}}
                                fullWidth
                            />

                            <TextField
                                label={t("Email")}
                                type="email"
                                value={email ?? ""}
                                onChange={handleChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                                inputProps={{maxLength: 40}}
                                fullWidth
                            />

                            <TextField
                                label={t("Phone")}
                                value={phone ?? ""}
                                onChange={handleChange('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                inputProps={{maxLength: 20}}
                                fullWidth
                            />
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label={t("Bio")}
                            value={bio ?? ""}
                            onChange={handleChange('bio')}
                            error={!!errors.bio}
                            helperText={errors.bio || `${bioCount}/500`}
                            inputProps={{maxLength: 500}}
                            multiline
                            minRows={4}
                            fullWidth
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
