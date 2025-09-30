import React, {createContext, ReactNode, useCallback, useContext} from "react";
import {useAuth, User} from "../../providers/AuthProvider";
import axios, {AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig} from "axios";

type LoginRequest = {
    username: string;
    password: string;
};

type RegisterRequest = {
    username: string;
    password: string;
    email?: string;
    phone?: string;
};

type LoginResponse = {
    token: string;
    tokenExpiration: number;
    user: User;
};

type RegisterResponse = {
    token: string;
    tokenExpiration: number;
    user: User;
};

type ApiContextType = {
    callLoginApi: (email: string, password: string) => Promise<LoginResponse>;
    callRegisterApi: (
        email: string,
        password: string
    ) => Promise<RegisterResponse>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = (): ApiContextType => {
    const context = useContext(ApiContext);
    if (!context) throw new Error("useApi must be used within ApiProvider");
    return context;
};

const isTokenValid = (token: string | null, expiration: number | null): boolean => {
    if (!token || !expiration) return false;
    const now = Date.now();
    return expiration > now;
};

export const ApiProvider = ({children}: { children: ReactNode }) => {
    const { login, token, tokenExpiration } = useAuth();
    const baseUrl = "http://localhost:8080";
    const api: AxiosInstance = useCallback(() => {
        const instance = axios.create({
            baseURL: baseUrl,
            headers: {"Content-Type": "application/json"},
        });

        instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const authHeader = (): Record<string, string> => {
                try {
                    if (isTokenValid(token, tokenExpiration)) {
                        return { Authorization: `Bearer ${token}` };
                    }
                } catch (e) {
                    // ignore parsing errors, treat as no token
                }
                return {};
            };
            const headers = AxiosHeaders.from(config.headers || {});
            const auth = authHeader();
            if (auth.Authorization) {
                headers.set("Authorization", auth.Authorization);
            }
            config.headers = headers;
            return config;
        });

        return instance;
    }, [token, tokenExpiration])();

    const callLoginApi = useCallback(
        async (email: string, password: string): Promise<LoginResponse> => {
            const payload: LoginRequest = {username: email, password};
            const res = await api.post<LoginResponse>(
                "/authentication/login",
                payload
            );
            const data = res.data;
            login(data.user, data.token, data.tokenExpiration);
            return data;
        },
        [api, login]
    );

    const callRegisterApi = useCallback(
        async (email: string, password: string): Promise<RegisterResponse> => {
            const payload: RegisterRequest = {username: email, password, email};
            const res = await api.post<RegisterResponse>(
                "/authentication/register",
                payload
            );
            const data = res.data;
            login(data.user, data.token, data.tokenExpiration);
            return data;
        },
        [api, login]
    );

    return (
        <ApiContext.Provider value={{callLoginApi, callRegisterApi}}>
            {children}
        </ApiContext.Provider>
    );
};
