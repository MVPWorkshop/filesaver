import { Link, redirect, useNavigate } from "react-router-dom";

import * as utils from "../utils";
import LoginButton from "./LoginButton";

const shortAddress = (address) => {
    //creates a short string representation for a given `address`
    return `${address.slice(0, 7)}...${address.slice(address.length - 4)}`;
};

const Logo = () => {
    return (
        <div className="Logo">
            <h3>FILESAVER</h3>
        </div>
    );
};

const NavOptions = () => {
    const navigate = useNavigate();

    return (
        <div className="NavOptions">
            <div className="Option" onClick={() => navigate("/about")}>
                About
            </div>
            <div className="Option" onClick={() => navigate("/about")}>
                Contact
            </div>
        </div>
    );
};

const Navbar = ({ stateManager }) => {
    if (utils.isLoggedIn({ stateManager })) {
        return (
            <div className="Navbar">
                <Logo></Logo>
                <div className="Container">
                    <NavOptions></NavOptions>
                    <h4>
                        Account: {shortAddress(stateManager.state.userAccount)}
                    </h4>
                    <button
                        onClick={() => {
                            stateManager.resetState();
                            utils.redirect("/");
                        }}
                    >
                        Log out
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="Navbar">
                <Logo></Logo>
                <div className="Container">
                    <NavOptions></NavOptions>
                    <LoginButton stateManager={stateManager} />
                </div>
            </div>
        );
    }
};

export default Navbar;
