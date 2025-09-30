import React from 'react';
import {AlertProvider} from "./providers/AlertProvider";
import {StyleProvider} from "./providers/StyleProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SecureRoute} from "./components/SecureRoute";
import {SettingsPage} from "./pages/settings/SettingsPage";
import {Navigation, NavigationPaths} from "./pages/navigation/Navigation";
import {LanguageProvider} from "./providers/LanguageProvider";
import {AuthProvider, Role} from "./providers/AuthProvider";
import {ApiProvider} from "./pages/settings/ApiProvider";
import {ProfilePage} from "./pages/profile/ProfilePage";


const App = () => {
    return (
        <StyleProvider>
            <LanguageProvider>
                <AlertProvider>
                    <AuthProvider>
                        <ApiProvider>
                            <BrowserRouter>
                                <Navigation/>
                                <Routes>
                                    {/* Public routes */}
                                    <Route path={NavigationPaths.HOME} element={<ProfilePage/>}/>
                                    <Route path={NavigationPaths.SETTINGS} element={<SettingsPage/>}/>

                                    {/* Protected routes */}
                                    <Route path="/profile" element={
                                        <SecureRoute children={<ProfilePage/>} requiredRoles={[Role.USER]}/>
                                    }/>
                                </Routes>
                            </BrowserRouter>
                        </ApiProvider>
                    </AuthProvider>
                </AlertProvider>
            </LanguageProvider>
        </StyleProvider>
    );
}

export default App;
