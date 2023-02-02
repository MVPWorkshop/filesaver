import { useState } from "react";

import * as filecoin from "../interactions/filecoin";

import * as cfg from "../config";

const MainFileCard = () => {
    const [state, setState] = useState({
        name: null,
        status: null,
        replicas: null,
    });

    return (
        <div className="MainFileCard">
            <div className="Title">
                <img src={cfg.IMAGES.generateRandomImage()}></img>
                <div className="Info">
                    <div className="Name">{state.name}</div>
                    <div className="CID">{`0x31....323`}</div>
                </div>
                <img src={cfg.IMAGES.downloadButton}></img>
            </div>
            <div className="Container">
                <div className="Info">
                    <div className="Entry">
                        <div className="Label">Status:</div>
                        <div className="Value">{state.status}</div>
                    </div>
                    <div className="Entry">
                        <div className="Label">Replicas:</div>
                        <div className="Value">{state.replicas}</div>
                    </div>
                    <div className="Entry">
                        <div className="Label">Uploaded at:</div>
                        <div className="Value">{`21.01.2023.`}</div>
                    </div>
                </div>
                <div className="Info">
                    <div className="Entry">
                        <div className="Label">Locked for:</div>
                        <div className="Value">{`9 years, 11 months`}</div>
                    </div>
                    <div className="Entry">
                        <div className="Label">Cycle ends in:</div>
                        <div className="Value">{`5 months 9 days`}</div>
                    </div>
                </div>
            </div>
            <div className="Donation">
                <button>Donate</button>
            </div>
        </div>
    );
};

export default MainFileCard;
