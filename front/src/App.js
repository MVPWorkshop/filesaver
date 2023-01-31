import { Route, Routes } from "react-router-dom";

import { useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import User from "./pages/User";

import * as cfg from "./config";

import "./style/App.css";

const App = () => {
    const [state, setState] = useState(cfg.DEFAULT_GLOBAL_APP_STATE);

    const updateState = (newState) => {
        setState({ ...state, ...newState });
    };

    const resetState = () => {
        setState(cfg.DEFAULT_GLOBAL_APP_STATE);
    };

    const stateManager = { state, updateState, resetState };

    return (
        <div className="App">
            <Navbar stateManager={stateManager}></Navbar>
            <h1>FileSaver</h1>

            <Routes>
                <Route
                    path="/"
                    element={<Home stateManager={stateManager} />}
                />
                <Route
                    path="/user"
                    element={<User stateManager={stateManager} />}
                />
                //TODO: all other paths redirect to `Home`
            </Routes>
        </div>
    );
};

export default App;
