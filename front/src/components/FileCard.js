import { useNavigate, Link } from "react-router-dom";

import * as ipfs from "../interactions/ipfs";
import * as cfg from "../config";

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
    } = props;
    const navigate = useNavigate();
    return (
        <div className="FeedListCard">
            <div className="Title">
                <img src={cfg.IMAGES.generateRandomImage()}></img>
                <div className="Info">
                    <div className="Name">{name}</div>
                    <div className="CID">{`0x31....323`}</div>
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
            <button onClick={() => navigate(`/file/${cid}`)}>Donate</button>
        </div>
    );
};

export default FileCard;
