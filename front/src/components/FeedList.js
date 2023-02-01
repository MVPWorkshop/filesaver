import { useEffect, useState } from "react";

import * as filecoin from "../interactions/filecoin";

const FeedCard = ({ props }) => {
    const {
        name,
        cid,
        type,
        status,
        uploadDate,
        duration,
        cycle,
        download,
        replicas,
    } = props;
    return (
        <div className="FeedCard">
            <div className="Entry">
                <div className="Label">File Name</div>
                <div className="Value">{name}</div>
            </div>
            <div className="Entry">
                <div className="Label">Status</div>
                <div className="Value">{status}</div>
            </div>
            <div className="Entry">
                <div className="Label">Replicas</div>
                <div className="Value">{replicas}</div>
            </div>
        </div>
    );
};

const FeedList = () => {
    const [state, setState] = useState({ loading: true, list: [] });

    const updateState = (newState) => setState({ ...state, ...newState });

    const refreshFcn = async () => {
        updateState({ loading: true });

        const { fileList } = await filecoin.getFeedFileList();

        updateState({ loading: false, list: fileList });
    };

    useEffect(() => {
        refreshFcn();
    }, []);

    return (
        <div className="FeedList">
            <h3>FeedList: {state.loading ? " Loading..." : ""}</h3>
            {state.list.map((el) => {
                return <FeedCard props={el}></FeedCard>;
            })}
        </div>
    );
};

export default FeedList;
