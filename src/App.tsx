import React from 'react';
import {AlertProvider} from "./providers/AlertProvider";
import Test from "./Test";
import {StyleProvider} from "./providers/StyleProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SecureRoute} from "./components/SecureRoute";
import {Role} from "./hooks/useAuth";
import {SettingsPage} from "./pages/settings/SettingsPage";
import {Navigation, NavigationPaths} from "./pages/navigation/Navigation";
import {LanguageProvider} from "./providers/LanguageProvider";


const App = () => {
    return (
        <StyleProvider>
            <AlertProvider>
                <LanguageProvider>
                    <BrowserRouter>
                        <Navigation/>
                        <Routes>
                            {/* Public routes */}
                            <Route path={NavigationPaths.HOME} element={<Test/>}/>
                            <Route path={NavigationPaths.SETTINGS} element={<SettingsPage/>}/>

                            {/* Protected routes */}
                            <Route path="/profile" element={
                                <SecureRoute children={<Test/>} requiredRole={Role.USER}/>
                            }/>
                        </Routes>
                    </BrowserRouter>
                </LanguageProvider>
            </AlertProvider>
        </StyleProvider>
    );
}

export default App;
