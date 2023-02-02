import { useEffect, useState } from "react";

import * as filecoin from "../interactions/filecoin";

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
                        el.name,
                        el.status,
                        el.replicas,
                        el.duration,
                        <img src="https://static.thenounproject.com/png/3554029-200.png" />,
                    ]}
                ></Row>
            ))}
        </div>
    );
};

export default FileList;
