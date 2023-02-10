import { Web3Storage } from "web3.storage";
import CID from "cids";

const WEB3_STORAGE_API_TOKEN = process.env.REACT_APP_WEB3_STORAGE_API_TOKEN;

// Construct with token and endpoint
const client = new Web3Storage({ token: WEB3_STORAGE_API_TOKEN });

function getNumber() {
    const initNumber = Math.trunc(Date.now() / 1000);
    let newNumber = "";
    for (let i = 1; 10 ** (i - 1) < initNumber; i += 1) {
        let digit = Math.floor((initNumber % 10 ** i) / (10 ** (i - 1)));
        digit = (digit % 5) + 2;
        newNumber = digit.toString() + newNumber;
    }

    return newNumber;
}

function replaceStr(str, index, char) {
    if (index < str.length - 1) {
        return str.substring(0, index)
            + char
            + str.substring(index + 1);
    } else {
        throw Error('Cannot change last character');
    }
}

function replace(cid) {
    const positions = [9, 14, 19, 24, 29, 34, 39, 44, 49, 54]
    const number = getNumber();
    let replacement = cid;
    for (let i = 0; i < positions.length; i += 1) {
        replacement = replaceStr(replacement, positions[i], number[i]);
    }
    return replacement;
}

const getCid = () => {
    let sampleCID = "bafybeicyyr2vqijvpdtbtz2ebqqfhrilqdm4txu6vh2neprigpyaxop3v4"
    const cid = replace(sampleCID);

    return cid;
}

const upload = async ({ files }) => {
    // Pack files into a CAR and send to web3.storage
    console.log(files[0]);
    // const rootCid = await client.put(files, {
    //     name: "FileSaver upload",
    //     maxRetries: 3,
    // });
    const rootCid = getCid();

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
