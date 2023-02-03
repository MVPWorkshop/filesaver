import { Link, redirect, useNavigate } from "react-router-dom";

import * as utils from "../utils";
import LoginButton from "./LoginButton";

const shortAddress = (address) => {
    //creates a short string representation for a given `address`
    return `${address.slice(0, 4)}...${address.slice(address.length - 4)}`;
};

const Logo = () => {
    const navigate = useNavigate();

    return (
        <div className="Logo">
            <h3 onClick={() => navigate(`/`)}>FILESAVER</h3>
        </div>
    );
};

const NavOptions = ({ stateManager }) => {
    const navigate = useNavigate();

    return (
        <div className="NavOptions">
            <div
                className="Option"
                onClick={() =>
                    navigate(`/user/${stateManager.state.userAccount}`)
                }
            >
                Profile
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
                    <NavOptions stateManager={stateManager}></NavOptions>

                    <h4 className="UserBalance">{231.2} FIL</h4>
                    <h4 className="UserAddress">
                        {shortAddress(stateManager.state.userAccount)}
                    </h4>
                    <h4
                        className="LogOutButton"
                        onClick={() => {
                            stateManager.resetState();
                            utils.redirect("/");
                        }}
                    >
                        Log out
                    </h4>
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
