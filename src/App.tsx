import React from 'react';
import './App.css';
import {AlertProvider} from "./provider/AlertProvider";
import Test from "./Test";
import {StyleProvider} from "./provider/StyleProvider";

const App = () => {
    return (
        <StyleProvider>
            <AlertProvider>
                <Test/>
            </AlertProvider>
        </StyleProvider>
    );
}

export default App;
