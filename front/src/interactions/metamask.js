import { ethers } from "ethers";

import * as utils from "../utils";
const connect = async () => {
    //requests connection from the user's wallet and returns account info
    await utils.delay(50);

    if (window.ethereum == null) {
        return { err: "You need to install Metamask" };
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();

    return { err: "", account };
};

export { connect };
