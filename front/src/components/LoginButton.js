import { Route, Routes, useNavigate } from "react-router-dom";

import * as metamask from "../interactions/metamask";
import * as utils from "../utils";

const login = async ({ stateManager, navigate }) => {
    const { err, account } = await metamask.connect();

    if (err == "") {
        stateManager.updateState({ userAccount: account });
        navigate(`/user/${account}`, { replace: true });
    }
};

const LoginButton = ({ stateManager }) => {
    const navigate = useNavigate();
    return (
        <button onClick={async () => await login({ stateManager, navigate })}>
            Connect Wallet
        </button>
    );
};

export default LoginButton;
