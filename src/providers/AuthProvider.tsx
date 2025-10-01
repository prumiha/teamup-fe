import React, {createContext, ReactNode, useContext, useState} from "react";
import useLocalStorage, {
    LOCAL_STORAGE_TOKEN_EXPIRATION_KEY,
    LOCAL_STORAGE_TOKEN_KEY,
    LOCAL_STORAGE_USER_KEY,
    UseLocalStorage
} from "../hooks/useLocalStorage";
import {Box} from "@mui/material";

interface AuthContextType {
    user: User;
    token: string | null;
    tokenExpiration: Date | null;
    login: (userData: User, token: string, tokenExpiration: Date) => void;
    logout: () => void;
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    GUEST = 'GUEST'
}

export interface User {
    id: number;
    username: string;
    roles: Role[];
}

export const DEFAULT_GUEST_USERNAME = "Guest";
export const DEFAULT_GUEST_ROLES = [Role.GUEST];
const DEFAULT_GUEST_USER: User = {
    id: 0,
    username: DEFAULT_GUEST_USERNAME,
    roles: DEFAULT_GUEST_ROLES,
};

const isUserLoadedSuccessfully = (u: User | null): u is User => {
    if (u == null) {
        return false;
    }

    const id = u.id;
    const username = u.username;
    const roles = u.roles;

    if (id == null || id <= 0) {
        return false;
    }

    if (username == null || username.length <= 0 || username.length > 30) {
        return false;
    }

    if (roles == null || roles.length <= 0) {
        return false;
    }

    if (!roles.every(role => Object.values(Role).includes(role as Role))) {
        return false;
    }

    return true;
}

const loadUserFromLocalStorageOrReturnGuest = (localStorage: UseLocalStorage) => {
    const storageUser = localStorage.get(LOCAL_STORAGE_USER_KEY) as User | null;
    if (isUserLoadedSuccessfully(storageUser)) {
        return {
            id: storageUser.id,
            username: storageUser.username,
            roles: storageUser.roles,
        };
    } else {
        return DEFAULT_GUEST_USER;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};


export const AuthProvider = ({children}: { children: ReactNode }) => {
    const localStorage = useLocalStorage();

    const storedAuthTokenExpirationString = localStorage.get<string>(LOCAL_STORAGE_TOKEN_EXPIRATION_KEY);
    const storedAuthTokenExpiration = storedAuthTokenExpirationString ? new Date(storedAuthTokenExpirationString) : null;
    const storedAuthToken = localStorage.get<string>(LOCAL_STORAGE_TOKEN_KEY);
    const storedUser = loadUserFromLocalStorageOrReturnGuest(localStorage);

    const [tokenExpiration, setTokenExpiration] = useState<Date | null>(storedAuthTokenExpiration);
    const [token, setToken] = useState<string | null>(storedAuthToken);
    const [user, setUserState] = useState<User>(storedUser);

    const login = (u: User, t: string, e: Date) => {
        setUserState(u);
        setToken(t);
        setTokenExpiration(e);
        localStorage.set(LOCAL_STORAGE_USER_KEY, u);
        localStorage.set(LOCAL_STORAGE_TOKEN_KEY, t);
        localStorage.set(LOCAL_STORAGE_TOKEN_EXPIRATION_KEY, e);
    };

    const logout = () => {
        setUserState(DEFAULT_GUEST_USER);
        setToken(null);
        setTokenExpiration(null);
        localStorage.remove(LOCAL_STORAGE_USER_KEY);
        localStorage.remove(LOCAL_STORAGE_TOKEN_KEY);
        localStorage.remove(LOCAL_STORAGE_TOKEN_EXPIRATION_KEY);
    };

    return (
        <AuthContext.Provider value={{user, token, tokenExpiration, login, logout}}>
            <Box>{children}</Box>
        </AuthContext.Provider>
    );
};