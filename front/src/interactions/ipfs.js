import { Web3Storage } from "web3.storage";

const WEB3_STORAGE_API_TOKEN = process.env.REACT_APP_WEB3_STORAGE_API_TOKEN;

// Construct with token and endpoint
const client = new Web3Storage({ token: WEB3_STORAGE_API_TOKEN });

const upload = async ({ files }) => {
    // Pack files into a CAR and send to web3.storage
    console.log(files[0]);
    const rootCid = await client.put(files, {
        name: "FileSaver upload",
        maxRetries: 3,
    });

    console.log(rootCid);

    return { rootCid };
};

export { upload };
