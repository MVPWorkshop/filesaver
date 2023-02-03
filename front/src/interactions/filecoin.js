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

const getFileInfo = async ({ cid }) => {
    const { filesaver } = await getContractInstances();

    const perpetualDealInfo = await filesaver.CID_to_PerpertualDeal(cid);

    const x = { ...perpetualDealInfo };

    x.name = x.name.toString();
    x.activeReplicas = x.activeReplicas.toString();
    x.replicas = x.replicas.toString();
    x.amount = x.amount.toString();
    console.log({ x });
    return { ...x, cid };
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

export { getFileInfo, getUserFileList, getFeedFileList };
