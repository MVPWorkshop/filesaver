import { useEffect, useState } from "react";

import * as filecoin from "../interactions/filecoin";

import * as cfg from "../config";

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
        <div className="FeedListCard">
            <div className="Title">
                <img src={cfg.IMAGES.generateRandomImage()}></img>
                <div className="Info">
                    <div className="Name">{name}</div>
                    <div className="CID">{`0x31....323`}</div>
                </div>
                <img src={cfg.IMAGES.downloadButton}></img>
            </div>

            <div className="Entry">
                <div className="Label">Status:</div>
                <div className="Value">{status}</div>
            </div>
            <div className="Entry">
                <div className="Label">Replicas:</div>
                <div className="Value">{replicas}</div>
            </div>
            <div className="Entry">
                <div className="Label">Uploaded at:</div>
                <div className="Value">{`21.01.2023.`}</div>
            </div>
            <div className="Entry">
                <div className="Label">Locked for:</div>
                <div className="Value">{`9 years, 11 months`}</div>
            </div>
            <div className="Entry">
                <div className="Label">Cycle ends in:</div>
                <div className="Value">{`5 months 9 days`}</div>
            </div>
            <button>Donate</button>
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
            {state.list.map((el) => {
                return <FeedCard props={el}></FeedCard>;
            })}
        </div>
    );
};

export default FeedList;
