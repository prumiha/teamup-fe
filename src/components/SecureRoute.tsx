import {Navigate} from 'react-router-dom';

import React, {ReactNode} from "react";
import {AlertType, useAlert} from "../providers/AlertProvider";
import {DEFAULT_GUEST_ROLE, Role, useAuth} from "../providers/AuthProvider";
import {useTranslation} from "react-i18next";

type SecureRouteProps = {
    children: ReactNode;
    requiredRole?: Role;
};

export const SecureRoute: React.FC<SecureRouteProps> = ({children, requiredRole = Role.GUEST}: SecureRouteProps) => {
    const auth = useAuth();
    const alert = useAlert();
    const { t } = useTranslation();
    const userRole = auth.user.role;

    if (requiredRole === Role.GUEST) {
        return <>{children}</>;
    }

    if (userRole === DEFAULT_GUEST_ROLE) {
        alert.showAlert(t("Sign in to access this page"), AlertType.WARNING, 4000);
        return <Navigate to="/login" replace/>;
    }

    if (requiredRole === Role.ADMIN && userRole !== Role.ADMIN) {
        alert.showAlert(
            t("You are trying to access a page you should not be accessing"),
            AlertType.ERROR,
            4000
        );
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};
