import { ethers } from "ethers";

import * as utils from "../utils";

import * as cfg from "../config";

const getContractInstances = async () => {
    const filesaver = new ethers.Contract(
        cfg.CONTRACT_ADDRESSES.filesaver,
        cfg.FILESAVER_ARTIFACT.abi,
        cfg.DEFAULT_HYPERSPACE_PROVIDER
    );

    return { filesaver };
};

const _getFileInfo = async () => {
    await utils.delay(400);

    return {
        name: `File0${Math.floor(Math.random() * 100)}.sol`,
        status: "Active",
        replicas: `1/${Math.floor(Math.random() * 10)}`,
        duration: `${Math.floor(Math.random() * 100)} days`,
        download: "ipfs.io/...",
    };
};

const getUserFileList = async ({ userAddress }) => {
    const { filesaver } = await getContractInstances();

    const CID_Counter = await filesaver.user_to_CID_Counter(userAddress);

    const fileList = [];
    for (let i = 0; i < CID_Counter; ++i) {
        const cid = await filesaver.user_to_CID(userAddress, i);
        const perpetualDealInfo = await filesaver.CID_to_PerpertualDeal(cid);

        fileList.push({ ...perpetualDealInfo, cid });
    }
    console.log({ fileList });
    return {
        fileList,
    };
};

const getFeedFileList = async () => {
    await utils.delay(700 * Math.random());

    return await getUserFileList({ userAddr: "..." });
};

export { getUserFileList, getFeedFileList };
