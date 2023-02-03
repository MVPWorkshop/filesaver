import axios from "axios";

import { ethers } from "ethers";

import * as cfg from "../config";

const notify = async (args) => {
    args.cid = ethers.utils.formatBytes32String(args.cid.rootCid);
    console.log({ args });
    const res = await axios.post(`${cfg.BACKEND_URL}/store`, args);
    console.log({ res });
    return res;
};
export { notify };
