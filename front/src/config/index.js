const CONTRACT_ARTIFACTS = {};

const CONTRACT_ADDRESSES = {};

const DEFAULT_GLOBAL_APP_STATE = {
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

const UPLOAD_PRICE_CALCULATION = ({ period, replicas }) => {
    console.log({ period, replicas });
    return parseInt(period) * 2 + parseInt(replicas) * 3;
};

const BACKEND_URL = "http://localhost:3030";

export {
    CONTRACT_ARTIFACTS,
    CONTRACT_ADDRESSES,
    DEFAULT_GLOBAL_APP_STATE,
    IMAGES,
    UPLOAD_PRICE_CALCULATION,
    BACKEND_URL,
};
