import * as cfg from "../config";

const isLoggedIn = ({ stateManager }) => {
    return (
        stateManager.state.userAccount !=
        cfg.DEFAULT_GLOBAL_APP_STATE.userAccount
    );
};

export { isLoggedIn };
