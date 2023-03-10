import { useEffect, useState } from "react";

import FileCard from "./FileCard";

import * as filecoin from "../interactions/filecoin";

const FeedList = ({ stateManager }) => {
    const [state, setState] = useState({ loading: true, list: [] });

    const updateState = (newState) => setState({ ...state, ...newState });

    const refreshFcn = async () => {
        stateManager.updateState({ loaderActive: true });
        updateState({ loading: true });

        const { fileList } = await filecoin.getFeedFileList();

        updateState({ loading: false, list: fileList });
        stateManager.updateState({ loaderActive: false });
    };

    useEffect(() => {
        refreshFcn();
    }, []);

    return (
        <div className="FeedList">
            {state.list.map((el) => {
                return <FileCard props={el}></FileCard>;
            })}
        </div>
    );
};

export default FeedList;
