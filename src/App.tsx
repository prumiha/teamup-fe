import React from 'react';
import './App.css';
import {AlertProvider} from "./providers/AlertProvider";
import Test from "./Test";
import {StyleProvider} from "./providers/StyleProvider";
import {AuthProvider, RequireAuth} from "./providers/AuthProvider";
import {Route, Routes, BrowserRouter } from "react-router-dom";
import SecureRoute from "./components/SecureRoute";

const App = () => {
    return (
        <StyleProvider>
            <AlertProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Public routes */}
                            {/*<Route path="/login" element={<LoginPage/>}/>*/}
                            {/*<Route path="/register" element={<RegisterPage/>}/>*/}
                            <Route path="/" element={<Test/>}/>

                            {/* Protected route */}
                            <Route path="/profile" element={
                                <RequireAuth>
                                    <Test/>
                                </RequireAuth>
                            }
                            />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>

            </AlertProvider>
        </StyleProvider>
    );
}

export default App;
