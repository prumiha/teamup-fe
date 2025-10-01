import React, {useEffect, useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    LinearProgress,
    Stack,
    Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {NavigationPaths} from "../navigation/Navigation";
import {AvatarImage} from "./components/AvatarImage";
import {useApi, UserProfilePersonalResponse} from "../settings/ApiProvider";
import {AlertType, useAlert} from "../../providers/AlertProvider";


export const ProfilePage = () => {
    const { t } = useTranslation();
    const api = useApi();
    const alert = useAlert();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfilePersonalResponse | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data: UserProfilePersonalResponse = await api.callPersonalProfileEndpoint();
                setProfile(data);
            } catch (e: any) {
                alert.showAlert(t("Failed to load profile"), AlertType.ERROR, 5000);
                setError(t("Failed to load profile"));
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [api, t]);

    if (loading) return <LinearProgress />;

    if (error || profile == null) return <Alert severity="error">{error}</Alert>;

    return (
        <Card sx={{ maxWidth: 720, mx: "auto" }}>
            <CardHeader title={t("Profile")} subheader={t("View your personal information")} />

            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, sm: 4}}>
                        <Stack alignItems="center" spacing={2}>
                            <AvatarImage src={profile.avatarUrl} size={96} fallbackText={profile.username?.[0]?.toUpperCase() ?? ""} />
                        </Stack>
                    </Grid>
                    <Grid size={{xs: 12, sm: 8}}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2">{t("Username")}</Typography>
                            <Typography variant="body1">{profile.username}</Typography>

                            {profile.fullName && (
                                <>
                                    <Typography variant="subtitle2">{t("Full Name")}</Typography>
                                    <Typography variant="body1">{profile.fullName}</Typography>
                                </>
                            )}

                            {profile.email && (
                                <>
                                    <Typography variant="subtitle2">{t("Email")}</Typography>
                                    <Typography variant="body1">{profile.email}</Typography>
                                </>
                            )}

                            {profile.phone && (
                                <>
                                    <Typography variant="subtitle2">{t("Phone")}</Typography>
                                    <Typography variant="body1">{profile.phone}</Typography>
                                </>
                            )}

                            {profile.bio && (
                                <>
                                    <Typography variant="subtitle2">{t("Bio")}</Typography>
                                    <Typography variant="body1">{profile.bio}</Typography>
                                </>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>

            <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(NavigationPaths.EDIT_PROFILE)}
                >
                    {t("Edit Profile")}
                </Button>
            </CardActions>
        </Card>
    );
};
