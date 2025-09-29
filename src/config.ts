export interface AppSettings {
    apiBaseUrl: string;
    enableLogging: boolean;
    theme: 'light' | 'dark';
    featureFlags: {
        newDashboard: boolean;
        betaFeatures: boolean;
    };
}