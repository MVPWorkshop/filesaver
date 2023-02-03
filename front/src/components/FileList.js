import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import * as filecoin from "../interactions/filecoin";
import * as ipfs from "../interactions/ipfs";

import * as cfg from "../config";

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
        // updateState({ loading: true });
        const { fileList } = await filecoin.getUserFileList({
            userAddress: stateManager.state.userAddress,
        });

        console.log({ fileList });
        if (state.list.length != fileList.length) {
            updateState({ list: fileList });
        }
        mutexTaken = false;
        setTimeout(periodicFcn, 10000);
    };

    useEffect(() => {
        periodicFcn();
    }, []);

    return (
        <div className="FileList">
            <FirstRow
                bold={true}
                values={[
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
                        <div
                            className="FileLink"
                            onClick={() => navigate(`/file/${el.cid}`)}
                        >
                            {el.name}
                        </div>,
                        el.status,
                        el.replicas,
                        el.duration,
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
