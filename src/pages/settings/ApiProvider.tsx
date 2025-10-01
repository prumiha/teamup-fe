import React, {createContext, ReactNode, useCallback, useContext} from "react";
import {Role, useAuth, User} from "../../providers/AuthProvider";
import axios, {AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig} from "axios";

export type LoginRequest = {
    username: string;
    password: string;
};

export type RegisterRequest = {
    username: string;
    password: string;
    email?: string;
    phone?: string;
};

export type LoginResponse = {
    id: number;
    username: string;
    roles: Role[];

    token: string;
    tokenExpiration: string;
};

export type RegisterResponse = {
    token: string;
    tokenExpiration: number;
    user: User;
};

export type UserProfilePersonalResponse = {
    // from user
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;

    // from user profile
    bio: string;
    avatarUrl: string;

    // from user stats
    activitiesLocked: number;
    activitiesLateUnlocks: number;
    activitiesAttended: number;
    activitiesNoShows: number;
    activitiesOrganized: number;
    activitiesCancelled: number;
    rating: number;
};

type ApiContextType = {
    callLoginEndpoint: (loginRequest: LoginRequest) => Promise<LoginResponse>;
    callRegisterEndpoint: (email: string, password: string) => Promise<RegisterResponse>;
    callPersonalProfileEndpoint: () => Promise<UserProfilePersonalResponse>;
};


const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = (): ApiContextType => {
    const context = useContext(ApiContext);
    if (!context) throw new Error("useApi must be used within ApiProvider");
    return context;
};

const isTokenValid = (token: string | null, expiration: Date | null): boolean => {
    if (!token || !expiration) return false;
    console.log(token, expiration.getMilliseconds());
    return expiration.getTime() > Date.now();
};

export const ApiProvider = ({children}: { children: ReactNode }) => {
    const { token, tokenExpiration } = useAuth();
    const baseUrl = "http://localhost:8080";
    const api: AxiosInstance = useCallback(() => {
        const instance = axios.create({
            baseURL: baseUrl,
            headers: {"Content-Type": "application/json"},
        });

        instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const authHeader = (): Record<string, string> => {
                try {
                    console.log(tokenExpiration?.getTime());
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

    const callLoginEndpoint = useCallback(
        async (loginRequest: LoginRequest): Promise<LoginResponse> => {
            const res = await api.post<LoginResponse>(
                "/authentication/login",
                loginRequest
            );
            return res.data;
        },
        [api]
    );

    const callRegisterEndpoint = useCallback(
        async (email: string, password: string): Promise<RegisterResponse> => {
            const payload: RegisterRequest = {username: email, password, email};
            const res = await api.post<RegisterResponse>(
                "/authentication/register",
                payload
            );
            return res.data;
        },
        [api]
    );

    const callPersonalProfileEndpoint = useCallback(
        async (): Promise<any> => {

            const res = await api.get<UserProfilePersonalResponse>(
                "/user/profile"
            );
            console.log(res);
            return res.data;
        },
        [api]
    );

    return (
        <ApiContext.Provider value={{
            callLoginEndpoint,
            callRegisterEndpoint,
            callPersonalProfileEndpoint
        }}>
            {children}
        </ApiContext.Provider>
    );
};
