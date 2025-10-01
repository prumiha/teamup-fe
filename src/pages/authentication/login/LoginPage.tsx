import React, {useMemo, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {LoginRequest, useApi} from "../../settings/ApiProvider";
import {useTranslation} from "react-i18next";
import {useAuth, User} from "../../../providers/AuthProvider";
import {AlertType, useAlert} from "../../../providers/AlertProvider";
import {useLocation, useNavigate} from "react-router-dom";

export const LoginPage = () => {
    const api = useApi();
    const auth = useAuth();
    const alert = useAlert();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigateOnSuccessfulAuthentication = (location.state as { from?: Location })?.from?.pathname || "/profile";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError(t("Please enter valid username and password"));
            return;
        }

        setLoading(true);
        try {
            const request: LoginRequest = { username, password };
            const response = await api.callLoginEndpoint(request);
            const user: User = {
                id: response.id,
                username: response.username,
                roles: response.roles
            }
            const expirationDate = new Date(response.tokenExpiration);
            auth.login(user, response.token, expirationDate);
            navigate(navigateOnSuccessfulAuthentication);
        } catch (e: any) {
            console.log(e);
            alert.showAlert(t("Authentication failed."), AlertType.ERROR, 3000);
            setError(t("Please enter valid username and password"));
        }  finally {
            setLoading(false);
        }
    };

    const hasError = useMemo(() => !username || !password || !!error, [username, password, error]);

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card sx={{ maxWidth: "400px", width: "100%", p: 2, boxShadow: 3 }}>
                <CardHeader
                    avatar={<LockOutlinedIcon color="primary" />}
                    title={
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h5">{t("Sign In")}</Typography>
                        </Stack>
                    }
                />
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label={t("Username")}
                                value={username}
                                onChange={(e) => {
                                    setError(null);
                                    setUsername(e.target.value)
                                }}
                                fullWidth
                                size="small"
                                required
                                error={!username && !!error}
                                helperText={!username && !!error ? t("Username is required") : ""}
                                autoFocus
                            />
                            <TextField
                                label={t("Password")}
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setError(null);
                                    setPassword(e.target.value)
                                }}
                                fullWidth
                                size="small"
                                required
                                error={!password && !!error}
                                helperText={!password && !!error ? t("Password is required") : ""}
                            />

                            {error && username && password && (
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={hasError || loading}
                                startIcon={loading ? <CircularProgress size={20} /> : undefined}
                            >
                                {loading ? t("Signing in...") : t("Sign In")}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};
