import { useParams } from "react-router-dom";
import FeedList from "../components/FeedList";

import MainFileCard from "../components/MainFileCard";

const File = ({ stateManager }) => {
    console.log({ stateManager });
    let { cid } = useParams();
    return (
        <div className="Page File">
            <h1>File Information:</h1>
            <MainFileCard cid={cid}></MainFileCard>
            <div className="FeedListContainer">
                <br></br>
                <h2>Popular files which expire soon:</h2>
                <FeedList></FeedList> <FeedList></FeedList>
            </div>
        </div>
    );
};

export default File;
