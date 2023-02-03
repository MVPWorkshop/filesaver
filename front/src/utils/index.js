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

export { isLoggedIn, redirect, delay };
