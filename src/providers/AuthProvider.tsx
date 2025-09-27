import React, {createContext, ReactNode, useContext} from "react";
import useAuth, {DEFAULT_GUEST_USERNAME, UseAuth} from "../hooks/useAuth";
import {AlertType, useAlert} from "../hooks/useAlert";
import {Navigate, useLocation} from "react-router-dom";

interface RequireAuthProps {
    children: React.ReactNode;
}

interface AuthProviderProps {
    children: ReactNode;
}


const AuthContext = createContext<UseAuth | null>(null);

export const useAuthContext = (): UseAuth => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within AuthProvider");
    return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}


export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const auth = useAuthContext();
    const alert = useAlert();
    const location = useLocation();

    if (auth.user.username === DEFAULT_GUEST_USERNAME) {
        alert.showAlert("Sign in to access this page", AlertType.WARNING, 3000);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}