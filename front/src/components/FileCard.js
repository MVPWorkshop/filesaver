import { useNavigate, Link } from "react-router-dom";

import * as ipfs from "../interactions/ipfs";
import * as cfg from "../config";
import * as utils from "../utils";

const FileCard = ({ props }) => {
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
        activeReplicas,
    } = props;
    const navigate = useNavigate();
    return (
        <div className="FeedListCard">
            <div className="Title">
                <img src={cfg.IMAGES.generateRandomImage()}></img>
                <div className="Info">
                    <div className="Name">
                        {utils.shortStr(name.toString())}
                    </div>
                    <div className="CID">{utils.shortStr(cid)}</div>
                </div>
                <Link onClick={async () => await ipfs.download({ cid: "..." })}>
                    <img src={cfg.IMAGES.downloadButton}></img>
                </Link>
            </div>

            <div className="Entry">
                <div className="Label">Status:</div>
                <div className="Value">{status}</div>
            </div>
            <div className="Entry">
                <div className="Label">Replicas:</div>
                <div className="Value">{`${activeReplicas.toString()}/${replicas.toString()}`}</div>
            </div>
            <div className="Entry">
                <div className="Label">Uploaded at:</div>
                <div className="Value">{`6.02.2023.`}</div>
            </div>
            <div className="Entry">
                <div className="Label">Locked for:</div>
                <div className="Value">
                    {utils.randomDuration({
                        yearRange: 20,
                        monthRange: 11,
                    })}
                </div>
            </div>
            <div className="Entry">
                <div className="Label">Cycle ends in:</div>
                <div className="Value">{duration}</div>
            </div>
            <button onClick={() => navigate(`/file/${cid}`)}>Donate</button>
        </div>
    );
};

export default FileCard;
