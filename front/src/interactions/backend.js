import axios from "axios";

import * as cfg from "../config";

const notify = async (args) => {
    console.log({ args });
    const res = await axios.post(`${cfg.BACKEND_URL}/store`, args);
    console.log({ res });
    return res;
};
export { notify };
