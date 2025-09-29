import React, { createContext } from "react";
import {Alert, AlertColor, Snackbar} from "@mui/material";
import {ReactNode, useState} from "react";

export interface AlertContextType {
    showAlert: (message: string, sev: AlertColor, duration: number) => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("info");
    const [duration, setDuration] = useState<number>(4000);

    const showAlert = (message: string, sev: AlertColor, duration: number) => {
        setMessage(message);
        setSeverity(sev);
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
            <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} sx={{ width: '100%', margin: '0 auto'  }} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert elevation={6} variant="standard" onClose={handleClose} severity={severity} sx={{ width: '80%', margin: '0 auto' }}>
                    {message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};