import {Navigate, Route} from 'react-router-dom';

import useAuth, {DEFAULT_GUEST_ROLE, Role} from "../hooks/useAuth";
import React from "react";
import {AlertType, useAlert} from "../hooks/useAlert";

export const SecureRoute = (
    path: string,
    element: React.ReactNode,
    requiredRole: Role = Role.GUEST
) => {
    const auth = useAuth();
    const alert = useAlert();
    const userRole = auth.user.role;

    console.log(userRole);

    switch (requiredRole) {
        case Role.GUEST:
            return <Route path={path} element={element} />;

        case Role.USER:
            if (userRole === DEFAULT_GUEST_ROLE) {
                alert.showAlert("Sign in to access this page", AlertType.WARNING, 4000);
                return <Navigate to="/login" replace />;
            }
            return <Route path={path} element={element} />;

        case Role.ADMIN:
            if (userRole === DEFAULT_GUEST_ROLE) {
                alert.showAlert("Sign in to access this page", AlertType.WARNING, 4000);
                return <Navigate to="/login" replace />;
            }
            if (userRole !== Role.ADMIN) {
                alert.showAlert(
                    "You are trying to access a page you should not be accessing",
                    AlertType.ERROR,
                    4000
                );
            }
            return <Route path={path} element={element} />;

        default:
            return <Route path={path} element={element} />;
    }
};
