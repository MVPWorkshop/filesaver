import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import User from "./pages/User";

import "./style/App.css";

const App = () => {
    return (
        <div className="App">
            <h1>FileSaver</h1>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user" element={<User />} />
                //TODO: all other paths redirect to `Home`
            </Routes>
        </div>
    );
};

export default App;
