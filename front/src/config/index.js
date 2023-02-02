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

export {
    CONTRACT_ARTIFACTS,
    CONTRACT_ADDRESSES,
    DEFAULT_GLOBAL_APP_STATE,
    IMAGES,
};