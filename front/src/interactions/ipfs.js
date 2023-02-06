import { Web3Storage } from "web3.storage";
import CID from "cids";

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

    const x = new CID(rootCid).toString().slice(0, 26);

    console.log({ x, length: x.length });

    return { rootCid: x };
};

const download = async ({ cid }) => {
    // const url = `https://${cid}..ipfs.w3s.link`
    const urlStr =
        "https://bafybeiaoah4uzvp76ijxl2mt5z5eweywxlyoyank4222ehhqviw6o6ykja.ipfs.w3s.link/";
    let blob = await fetch(urlStr).then((r) => r.blob());
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FileSaver-Download.zip`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
};

export { upload, download };
