import {Navigate} from 'react-router-dom';

import React, {ReactNode} from "react";
import {AlertType, useAlert} from "../providers/AlertProvider";
import {Role, useAuth} from "../providers/AuthProvider";
import {useTranslation} from "react-i18next";

type SecureRouteProps = {
    children: ReactNode;
    requiredRoles: Role[];
};

export const SecureRoute: React.FC<SecureRouteProps> = ({children, requiredRoles}: SecureRouteProps) => {
    const {user} = useAuth();
    const alert = useAlert();
    const {t} = useTranslation();
    const userRoles = user.roles;
    const missingRoles = requiredRoles.filter(role => !userRoles.includes(role));

    if (missingRoles.length === 0) {
        return <>{children}</>;
    }

    const firstMissing = missingRoles[0];
    switch (firstMissing) {
        case Role.USER:
            alert.showAlert(t("Sign in to access this page"), AlertType.WARNING, 4000);
            return <Navigate to="/login" replace/>;
        case Role.ADMIN:
            alert.showAlert(
                t("You are trying to access a page you should not be accessing"),
                AlertType.ERROR,
                4000
            );
            return <Navigate to="/" replace/>;
        default:
            alert.showAlert(t("You are not allowed to visit this site"), AlertType.WARNING, 4000);
            return <Navigate to="/" replace/>;
    }
};
