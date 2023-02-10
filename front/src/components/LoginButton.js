import { Route, Routes, useNavigate } from "react-router-dom";

import * as metamask from "../interactions/metamask";
import * as utils from "../utils";

const login = async ({ stateManager, navigate }) => {
    const { err, account } = await metamask.connect();

    if (err == "") {
        stateManager.updateState({ userAccount: account });
    }
};

const LoginButton = ({ stateManager }) => {
    const navigate = useNavigate();
    return (
        <button
            className="LoginButton"
            onClick={async () => await login({ stateManager, navigate })}
        >
            Connect Wallet
        </button>
    );
};

export default LoginButton;
