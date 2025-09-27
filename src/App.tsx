import React from 'react';
import './App.css';
import {AlertProvider} from "./providers/AlertProvider";
import Test from "./Test";
import {StyleProvider} from "./providers/StyleProvider";
import {BrowserRouter, Routes} from "react-router-dom";
import {SecureRoute} from "./components/SecureRoute";
import {Role} from "./hooks/useAuth";


const App = () => {
    return (
        <StyleProvider>
            <AlertProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public routes */}
                        {SecureRoute("/", <Test/>)}

                        {/* Protected routes */}
                        {SecureRoute("/profile", <Test/>, Role.USER)}
                    </Routes>
                </BrowserRouter>
            </AlertProvider>
        </StyleProvider>
    );
}

export default App;
