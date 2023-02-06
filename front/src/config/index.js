import { ethers } from "ethers";
import FILESAVER_ARTIFACT from "../interactions/artifacts/contracts/filesaver/FileSaver.sol/FileSaver.json";

const CONTRACT_ARTIFACTS = {};

const CONTRACT_ADDRESSES = {
    filesaver: "0x66e0e5994C1e4f5A6613827f06b7Fc4E6B37b609",
};

const DEFAULT_GLOBAL_APP_STATE = {
    loaderActive: false,
    userAccount: null,
    uploadInfo: {
        fileName: null,
        cid: null,
        numberOfReplicas: null,
        period: null,
        price: null,
    },
};

const IMAGES = {
    generateRandomImage: () => {
        //TODO: random image based on some argument
        return "https://thumbs.dreamstime.com/b/red-random-hexadecimal-numbers-black-background-lcd-texture-applied-random-hex-numbers-screen-red-184988658.jpg";
    },
    downloadButton: "https://static.thenounproject.com/png/3554029-200.png",
    addFile: "/images/addFile.png", //"http://cdn.onlinewebfonts.com/svg/img_51677.png",
    providerImage: "/images/providers.png",
};

const DEFAULT_HYPERSPACE_PROVIDER = ethers.getDefaultProvider(
    "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"
);

const UPLOAD_PRICE_CALCULATION = ({ period, replicas }) => {
    return `${(parseInt(period) * 2 + parseInt(replicas) * 3) / 100}`;
};

const BACKEND_URL = "http://localhost:3030";

export {
    CONTRACT_ARTIFACTS,
    CONTRACT_ADDRESSES,
    DEFAULT_GLOBAL_APP_STATE,
    IMAGES,
    UPLOAD_PRICE_CALCULATION,
    BACKEND_URL,
    DEFAULT_HYPERSPACE_PROVIDER,
    FILESAVER_ARTIFACT,
};
