import * as cfg from "../config";

const delay = (delayInms = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const isLoggedIn = ({ stateManager }) => {
    console.log({ stateManager });
    return (
        stateManager.state.userAccount !=
        cfg.DEFAULT_GLOBAL_APP_STATE.userAccount
    );
};

const redirect = (url) => {
    // window.location.href = url;
    window.location.replace("http://localhost:3000" + url);
};

const shortStr = (str) => {
    //creates a short string representation for a given `str`
    if (str == null) return "...loading...";
    return `${str.slice(0, 4)}...${str.slice(str.length - 4)}`;
};

export { isLoggedIn, redirect, delay, shortStr };
