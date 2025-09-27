import {Navigate} from 'react-router-dom';

import useAuth, {DEFAULT_GUEST_ROLE, Role} from "../hooks/useAuth";
import React, {ReactNode} from "react";
import {AlertType, useAlert} from "../hooks/useAlert";

type SecureRouteProps = {
    children: ReactNode;
    requiredRole?: Role;
};

export const SecureRoute: React.FC<SecureRouteProps> = ({children, requiredRole = Role.GUEST}: SecureRouteProps) => {
    const auth = useAuth();
    const alert = useAlert();
    const userRole = auth.user.role;

    if (requiredRole === Role.GUEST) {
        return <>{children}</>;
    }

    if (userRole === DEFAULT_GUEST_ROLE) {
        alert.showAlert("Sign in to access this page", AlertType.WARNING, 4000);
        return <Navigate to="/login" replace/>;
    }

    if (requiredRole === Role.ADMIN && userRole !== Role.ADMIN) {
        alert.showAlert(
            "You are trying to access a page you should not be accessing",
            AlertType.ERROR,
            4000
        );
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};
