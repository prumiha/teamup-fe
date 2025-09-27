import React from 'react';
import './App.css';
import {AlertProvider} from "./providers/AlertProvider";
import Test from "./Test";
import {StyleProvider} from "./providers/StyleProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SecureRoute} from "./components/SecureRoute";
import {Role} from "./hooks/useAuth";


const App = () => {
    return (
        <StyleProvider>
            <AlertProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Test/>} />

                        {/* Protected routes */}
                        <Route path="/profile" element={
                            <SecureRoute children={<Test/>} requiredRole={Role.USER} />
                        } />
                    </Routes>
                </BrowserRouter>
            </AlertProvider>
        </StyleProvider>
    );
}

export default App;
