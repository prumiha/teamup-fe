import React, {createContext, ReactNode, useContext, useState} from "react";
import {Alert, AlertColor, Snackbar} from "@mui/material";

export enum AlertType {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info",
    WARNING = "warning",
}

export const DEFAULT_ALERT_DURATION = 3000;
export const DEFAULT_ALERT_TYPE = AlertType.INFO;

export interface AlertContextType {
    showAlert: (message: string, type?: AlertType, duration?: number) => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<AlertType>(DEFAULT_ALERT_TYPE);
    const [duration, setDuration] = useState<number>(DEFAULT_ALERT_DURATION);

    const showAlert = (
        message: string,
        type: AlertType = DEFAULT_ALERT_TYPE,
        duration: number = DEFAULT_ALERT_DURATION
    ) => {
        setMessage(message);
        setSeverity(type);
        setDuration(duration);
        setOpen(true);
    };

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={duration}
                onClose={handleClose}
                sx={{ width: "100%" }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    elevation={10}
                    variant="standard"
                    onClose={handleClose}
                    severity={severity as AlertColor}
                    sx={{ width: "80%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextType => {
    const context = useContext<AlertContextType | undefined>(AlertContext);
    if (!context) throw new Error("useAlert must be used within AlertProvider");
    return context;
};