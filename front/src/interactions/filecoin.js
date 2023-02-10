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
    // x.duration = utils.randomDuration({ monthRange: 5, dayRange: 30 });
    console.log({ x });
    return { ...x, cid };
};

const getUserFileList = async ({ userAddress }) => {
    const { filesaver } = await getContractInstances();

    const CID_Counter = await filesaver.user_to_CID_Counter(userAddress);

    let fileList = [];

    const threadFcn = async ({ userAddress, i }) => {
        const cid = await filesaver.user_to_CID(userAddress, i);

        return await getFileInfo({ cid });
    };
    for (let i = 0; i < CID_Counter; ++i) {
        fileList.push(threadFcn({ userAddress, i }));
    }

    fileList = await Promise.all(fileList);
    console.log({ fileList });
    return {
        fileList,
    };
};

const getFeedFileList = async () => {
    const userAddresses = ["0x754eeaE922e225D107714838850A366A2C97a589"]; //["0x275986f4F52a03A24C926616e53165bc27edF65e"];

    let list = [];

    for (const ua of userAddresses) {
        const { fileList } = await getUserFileList({ userAddress: ua });
        list = list.concat(fileList);
    }

    console.log({ feedList: list });

    let randomList = [];
    for (let i = 0; i < cfg.FEED_LIST_LENGTH; ++i) {
        randomList.push(list[Math.floor(Math.random() * list.length)]);
    }

    const cids = randomList.map((e) => e.cid);

    console.log({ cids });

    return { fileList: randomList };
};

export { getFileInfo, getUserFileList, getFeedFileList };
