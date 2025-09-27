import {useState} from "react";
import useLocalStorage, {LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_USER_KEY, UseLocalStorage} from "./useLocalStorage";

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    GUEST = 'GUEST'
}

interface User {
    id: number;
    username: string;
    role: Role;
}

interface StorageUser {
    id: number;
    username: string;
    role: Role;
}

export interface UseAuth {
    user: User;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

export const DEFAULT_GUEST_USERNAME = "Guest";
export const DEFAULT_GUEST_ROLE = Role.GUEST;
const DEFAULT_GUEST_USER: User = {
    id: 0,
    username: DEFAULT_GUEST_USERNAME,
    role: DEFAULT_GUEST_ROLE,
};

const isUserLoadedSuccessfully = (storageUser: StorageUser | null): storageUser is StorageUser => {
    if (storageUser == null) {
        return false;
    }

    const id = storageUser.id;
    const username = storageUser.username;
    const role = storageUser.role;

    if (id == null || id <= 0) {
        return false;
    }

    if (username == null || username.length <= 0 || username.length > 30) {
        return false;
    }

    if (role == null || role.length <= 0) {
        return false;
    }

    if (!Object.values(Role).includes(role as Role)){
        return false;
    }

    return true;
}

const loadUserFromLocalStorageOrReturnGuest = (localStorage: UseLocalStorage) => {
    const storageUser = localStorage.get(LOCAL_STORAGE_USER_KEY) as StorageUser | null;
    if (isUserLoadedSuccessfully(storageUser)) {
        return {
            id: storageUser.id,
            username: storageUser.username,
            role: storageUser.role,
        };
    } else {
        return DEFAULT_GUEST_USER;
    }
}

const useAuth = (): UseAuth => {
    const localStorage = useLocalStorage();

    const [user, setUserState] = useState<User>(() => {
        return loadUserFromLocalStorageOrReturnGuest(localStorage);
    });

    const [token, setTokenState] = useState<string | null>(() => {
        return localStorage.get(LOCAL_STORAGE_TOKEN_KEY) as string | null;
    });

    const login = (userData: User, token: string) => {
        setUserState(userData);
        setTokenState(token);
        localStorage.set(LOCAL_STORAGE_USER_KEY, userData);
        localStorage.set(LOCAL_STORAGE_TOKEN_KEY, token);
    };

    const logout = () => {
        setUserState(DEFAULT_GUEST_USER);
        setTokenState(null);
        localStorage.remove(LOCAL_STORAGE_USER_KEY);
        localStorage.remove(LOCAL_STORAGE_TOKEN_KEY);
    };

    return {user, token, login, logout};
};

export default useAuth;
