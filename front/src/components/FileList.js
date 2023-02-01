import { useEffect, useState } from "react";

import * as filecoin from "../interactions/filecoin";

const Row = ({ values, bold }) => {
    const embed = (val) => (bold ? <strong>{val}</strong> : <div>{val}</div>);

    return (
        <div className="Row">
            {values.map((el) => {
                return <div className="Entry">{embed(el)}</div>;
            })}
        </div>
    );
};

const FileList = ({ stateManager }) => {
    const [state, setState] = useState({ loading: true, list: [] });

    const updateState = (newState) => setState({ ...state, ...newState });

    const periodicFcn = async () => {
        updateState({ loading: true });
        const { fileList } = await filecoin.getUserFileList({
            userAddress: stateManager.state.userAddress,
        });
        updateState({ loading: false, list: fileList });
    };

    useEffect(() => {
        setInterval(periodicFcn, 4000);
    }, []);

    return (
        <div className="FileList">
            <h3>FileList: {state.loading ? "loading..." : ""}</h3>
            <Row
                bold={true}
                values={[
                    "File Name",
                    "Status",
                    "Replicas",
                    "Duration",
                    "Download",
                ]}
            ></Row>
            {state.list.map((el) => (
                <Row
                    values={[
                        el.name,
                        el.status,
                        el.replicas,
                        el.duration,
                        el.download,
                    ]}
                ></Row>
            ))}
        </div>
    );
};

export default FileList;
