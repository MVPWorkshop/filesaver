import { ethers } from "ethers";

import * as utils from "../utils";
import * as cfg from "../config";

import FILESAVER_ARTIFACT from "./artifacts/contracts/filesaver/FileSaver.sol/FileSaver.json";

const _contracts = {
    filesaver: null,
    sFIL: null,
};

const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    _contracts.filesaver = new ethers.Contract(
        cfg.CONTRACT_ADDRESSES.filesaver,
        FILESAVER_ARTIFACT.abi,
        signer
    );
};

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

    await init();

    return { err: "", account };
};

const fileUpload = async ({ cid, price, duration }) => {
    cid = ethers.utils.formatBytes32String(cid);
    await _contracts.filesaver.proposePerpetualDeal(cid, [1, 2, 3, 4, 5]);
    return { err: "" };
};

export { connect, fileUpload };
