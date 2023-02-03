import { ethers } from "ethers";

import * as utils from "../utils";
import * as cfg from "../config";

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
        cfg.FILESAVER_ARTIFACT.abi,
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

const fileUpload = async ({ cid, args, value }) => {
    console.log({ cid, args, value });

    console.log({ ROOT: cid.rootCid });

    cid = ethers.utils.formatBytes32String(cid.rootCid);

    await _contracts.filesaver.proposePerpetualDeal(cid, args, { value });
    return { err: "" };
};

export { connect, fileUpload };
