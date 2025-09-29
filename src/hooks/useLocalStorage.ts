export interface UseLocalStorage {
    get: <T = any>(key: string) => T | null;
    set: <T = any>(key: string, value: T) => void;
    remove: (key: string) => void;
    clearAll: () => void;
}

export const LOCAL_STORAGE_TOKEN_KEY = "teamup_auth_token";
export const LOCAL_STORAGE_USER_KEY = "teamup_user";
export const LOCAL_STORAGE_SETTINGS_KEY = "teamup_settings";
export const LOCAL_STORAGE_THEME_KEY = "teamup_theme";
export const LOCAL_STORAGE_LANGUAGE_KEY = "teamup_language";

const useLocalStorage = (): UseLocalStorage => {
    const get = <T = any>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : null;
        } catch (error) {
            console.error("useLocalStorage get error:", error);
            return null;
        }
    };

    const set = <T = any>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("useLocalStorage set error:", error);
        }
    };

    const remove = (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error("useLocalStorage remove error:", error);
        }
    };

    const clearAll = (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error("useLocalStorage clearAll error:", error);
        }
    };

    return { get, set, remove, clearAll };
};

export default useLocalStorage;
