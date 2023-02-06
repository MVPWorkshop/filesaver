import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import * as filecoin from "../interactions/filecoin";
import * as ipfs from "../interactions/ipfs";
import * as metamask from "../interactions/metamask";

import * as utils from "../utils";
import * as cfg from "../config";

const MainFileCard = ({ cid }) => {
    const [state, setState] = useState({
        name: null,
        status: null,
        replicas: null,
        amount: 0,
        donationAmount: 1,
    });
    const updateState = (newState) => setState({ ...state, ...newState });
    const fcn = async () => {
        console.log({ RELOAD: true });

        const perpetualDealInfo = await filecoin.getFileInfo({ cid });
        updateState(perpetualDealInfo);
    };
    useEffect(() => {
        fcn();
    }, [cid]);

    return (
        <div className="MainFileCard">
            <div className="Title">
                <img src={cfg.IMAGES.generateRandomImage()}></img>
                <div className="Info">
                    <div className="Name">{state.name}</div>
                    <div className="CID">{utils.shortStr(cid)}</div>
                </div>
                <Link onClick={async () => await ipfs.download({ cid: "..." })}>
                    <img src={cfg.IMAGES.downloadButton}></img>
                </Link>
            </div>
            <div className="Container">
                <div className="Info">
                    <div className="Entry">
                        <div className="Label">Status:</div>
                        <div className="Value">
                            {state.activeReplicas == "0" ? "Pending" : "Active"}
                        </div>
                    </div>
                    <div className="Entry">
                        <div className="Label">Replicas:</div>
                        <div className="Value">{`${state.activeReplicas}/${state.replicas}`}</div>
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
                <div className="Entry">
                    <div className="Label">Amount:</div>
                    <div className="Value">
                        <div className="slidecontainer">
                            <input
                                type="range"
                                min="1"
                                step="1"
                                class="slider"
                                id="myRange"
                                value={state.donationAmount}
                                onChange={(e) =>
                                    updateState({
                                        donationAmount: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="Selected">
                            <strong>{`${state.donationAmount} FIL`}</strong>
                        </div>
                    </div>
                </div>
                <button
                    onClick={async () =>
                        metamask.donate({ cid, value: state.donationAmount })
                    }
                >
                    Donate
                </button>
            </div>
        </div>
    );
};

export default MainFileCard;
