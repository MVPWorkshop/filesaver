import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import * as filecoin from "../interactions/filecoin";
import * as ipfs from "../interactions/ipfs";

import * as cfg from "../config";
import * as utils from "../utils";

const Row = ({ values, bold }) => {
    const embed = (val) =>
        bold ? <strong>{val}</strong> : <div className="Value">{val}</div>;

    return (
        <div className="Row">
            {values.map((el) => {
                return <div className="Entry">{embed(el)}</div>;
            })}
        </div>
    );
};

const FirstRow = ({ values, bold }) => {
    const embed = (val) =>
        bold ? <strong>{val}</strong> : <div className="Value">{val}</div>;

    return (
        <div className="FirstRow">
            {values.map((el) => {
                return <div className="Entry">{embed(el)}</div>;
            })}
        </div>
    );
};

let mutexTaken = false;

const FileList = ({ stateManager }) => {
    const navigate = useNavigate();

    const [state, setState] = useState({ loading: true, list: [] });

    const updateState = (newState) => setState({ ...state, ...newState });

    const periodicFcn = async () => {
        if (mutexTaken) {
            return;
        }
        mutexTaken = true;
        const { fileList } = await filecoin.getUserFileList({
            userAddress: stateManager.state.userAccount,
        });

        console.log({ fileList });
        if (state.list.length != fileList.length) {
            updateState({ list: fileList });
        }
        mutexTaken = false;
        setTimeout(periodicFcn, 10000);
        stateManager.updateState({ loaderActive: false });
    };

    useEffect(() => {
        stateManager.updateState({ loaderActive: true });
        periodicFcn();
    }, []);

    return (
        <div className="FileList">
            <FirstRow
                bold={true}
                values={[
                    "Type",
                    "File Name",
                    "Status",
                    "Replicas",
                    "Duration",
                    "Download",
                ]}
            ></FirstRow>
            {state.list.map((el) => (
                <Row
                    values={[
                        <img
                            src="/images/image-icon.png"
                            onClick={() =>
                                navigate(`/file/${el.cid.toString()}`)
                            }
                        ></img>,
                        <div
                            className="FileLink"
                            onClick={() =>
                                navigate(`/file/${el.cid.toString()}`)
                            }
                        >
                            {el.name.toString()}
                        </div>,
                        el.activeReplicas.toString() == "0"
                            ? "Pending"
                            : "Active",
                        `${el.activeReplicas.toString()}/${el.replicas.toString()}`,
                        `${el.duration.toString()} months`,
                        <Link
                            onClick={async () =>
                                await ipfs.download({ cid: "..." })
                            }
                        >
                            <img src={cfg.IMAGES.downloadButton}></img>
                        </Link>,
                    ]}
                ></Row>
            ))}
        </div>
    );
};

export default FileList;
