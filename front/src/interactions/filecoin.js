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
    x.status = x.activeReplicas == "0" ? "Pending" : "Active";
    console.log({ x });
    return { ...x, cid };
};

const getUserFileList = async ({ userAddress }) => {
    const { filesaver } = await getContractInstances();

    const CID_Counter = await filesaver.user_to_CID_Counter(userAddress);

    let fileList = [];
    for (let i = 0; i < CID_Counter; ++i) {
        const cid = await filesaver.user_to_CID(userAddress, i);
        // const perpetualDealInfo = await filesaver.CID_to_PerpertualDeal(cid);

        // fileList.push({ ...perpetualDealInfo, cid });

        fileList.push(getFileInfo({ cid }));
    }

    fileList = await Promise.all(fileList);
    console.log({ fileList });
    return {
        fileList,
    };
};

const getFeedFileList = async () => {
    const userAddresses = ["0x275986f4F52a03A24C926616e53165bc27edF65e"];

    let list = [];

    for (const ua of userAddresses) {
        const { fileList } = await getUserFileList({ userAddress: ua });
        list = list.concat(fileList);
    }

    console.log({ feedList: list });

    let randomList = [];
    for (let i = 0; i < 4; ++i) {
        randomList.push(list[Math.floor(Math.random() * list.length)]);
    }

    return { fileList: randomList };
};

export { getFileInfo, getUserFileList, getFeedFileList };
