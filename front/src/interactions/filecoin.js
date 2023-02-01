import * as utils from "../utils";

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
    const fileList = await Promise.all(
        [0, 1, 2, 3, 4].map(async (el) => await _getFileInfo())
    );

    return {
        fileList,
    };
};

const getFeedFileList = async () => {
    await utils.delay(700 * Math.random());

    return await getUserFileList({ userAddr: "..." });
};

export { getUserFileList, getFeedFileList };
