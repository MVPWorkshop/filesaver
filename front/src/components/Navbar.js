import { Link, redirect } from "react-router-dom";

import * as utils from "../utils";
import LoginButton from "./LoginButton";

const shortAddress = (address) => {
    //creates a short string representation for a given `address`
    return `${address.slice(0, 7)}...${address.slice(address.length - 4)}`;
};

const NavigationOptions = () => {
    return (
        <div>
            <Link to="/feed">Feed</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
        </div>
    );
};

const Navbar = ({ stateManager }) => {
    if (utils.isLoggedIn({ stateManager })) {
        return (
            <div className="Navbar">
                <h2>Navbar</h2>
                <NavigationOptions></NavigationOptions>
                <h4>Account: {shortAddress(stateManager.state.userAccount)}</h4>
                <button
                    onClick={() => {
                        stateManager.resetState();
                        utils.redirect("/");
                    }}
                >
                    Log out
                </button>
            </div>
        );
    } else {
        return (
            <div className="Navbar">
                <h2>Navbar</h2>
                <NavigationOptions></NavigationOptions>
                <LoginButton stateManager={stateManager} />
            </div>
        );
    }
};

export default Navbar;
