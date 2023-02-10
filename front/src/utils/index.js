import * as cfg from "../config";

const delay = (delayInms = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const isLoggedIn = ({ stateManager }) => {
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

const randomDuration = ({ yearRange, monthRange, dayRange }) => {
    let dayStr = "";
    let monthStr = "";
    let yearStr = "";

    if (dayRange != undefined) {
        const days = 1 + Math.floor(Math.random() * (dayRange - 1));
        dayStr = `${days} days`;
    }

    if (monthRange != undefined) {
        const months = 1 + Math.floor(Math.random() * (monthRange - 1));
        monthStr = `${months} months`;
    }

    if (yearRange != undefined) {
        const year = 2 + Math.floor(Math.random() * (yearRange - 1));
        yearStr = `${year} years`;
    }

    return `${yearStr} ${monthStr} ${dayStr}`;
};

export { isLoggedIn, redirect, delay, shortStr, randomDuration };
