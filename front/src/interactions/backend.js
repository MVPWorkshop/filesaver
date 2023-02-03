import axios from "axios";

import { ethers } from "ethers";

import * as cfg from "../config";

const notify = async (args) => {
    console.log({ args });
    args.cid = ethers.utils.formatBytes32String(args.cid);
    const res = await axios.post(`${cfg.BACKEND_URL}/store`, args);
    console.log({ res });
    return res;
};
export { notify };
