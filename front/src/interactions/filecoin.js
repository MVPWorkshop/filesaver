import * as utils from "../utils";

const getFileList = async ({ userAddress }) => {
    await utils.delay(1400);

    return {
        fileList: [
            {
                name: "File01.sol",
                status: "Active",
                replicas: "2/2",
                duration: "321 days",
                download: "ipfs.io/...",
            },
            {
                name: "File02.sol",
                status: "Active",
                replicas: "1/2",
                duration: "21 days",
                download: "ipfs.io/...",
            },
            {
                name: "File13.sol",
                status: "Active",
                replicas: "1/2",
                duration: "321 days",
                download: "ipfs.io/...",
            },
            {
                name: "File01.sol",
                status: "Pending",
                replicas: "1/2",
                duration: "31 days",
                download: "ipfs.io/...",
            },
        ],
    };
};

const getFileInfo = async ({ cid }) => {
    await utils.delay(700 * Math.random());

    return {
        name: "File01.sol",
        status: "Active",
        replicas: "2/2",
        duration: "321 days",
        download: "ipfs.io/...",
    };
};

export { getFileList };
