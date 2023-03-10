import { Route, Routes } from "react-router-dom";

import { useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import User from "./pages/User";
import File from "./pages/File";

import * as cfg from "./config";

import "./style/css/App.css";

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
            {state.loaderActive ? (
                <div className="overlay">
                    <div class="overlay-content lds-ripple">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            ) : null}

            <Navbar stateManager={stateManager}></Navbar>

            <Routes>
                <Route
                    path="/"
                    element={<Home stateManager={stateManager} />}
                />
                <Route
                    path="/user/:address"
                    element={<User stateManager={stateManager} />}
                />
                <Route
                    path="/file/:cid"
                    element={<File stateManager={stateManager} />}
                />
                //TODO: all other paths redirect to `Home`
            </Routes>
        </div>
    );
};

export default App;
