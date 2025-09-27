import {useContext} from "react";
import {AlertContext, AlertContextType} from "../provider/AlertProvider";

export enum AlertType {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info",
    WARNING = "warning",
}

const DEFAULT_ALERT_DURATION = 3000;
const DEFAULT_ALERT_TYPE = AlertType.INFO;

export const useAlert = () => {
    const context = useContext<AlertContextType | undefined>(AlertContext);
    if (!context) throw new Error("useAlert must be used within AlertProvider");

    const showAlert = (message: string, type: AlertType = DEFAULT_ALERT_TYPE, duration: number = DEFAULT_ALERT_DURATION) => {
        context.showAlert(message, type, duration);
    }

    return {
        showAlert: showAlert,
    };
};