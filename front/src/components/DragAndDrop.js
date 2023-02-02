import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import * as ipfs from "../interactions/ipfs";
import * as metamask from "../interactions/metamask";

import * as cfg from "../config";

const shortStr = (str) => {
    return `${str.slice(0, 10)}...${str.slice(str.length - 4)}`;
};

const DragAndDrop = () => {
    const [state, setState] = useState({
        files: [],
        fileName: null,
        period: "6",
        replicas: "1",
    });

    const updateState = (newState) => setState({ ...state, ...newState });

    const onDrop = useCallback(async (files) => {
        updateState({ fileName: files[0].name, files });
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    if (state.fileName == null) {
        return (
            <div className="DragAndDrop" {...getRootProps()}>
                <input {...getInputProps()} />
                <img src={cfg.IMAGES.addFile}></img>
                <button>Drop Your File</button>
            </div>
        );
    } else {
        return (
            <div className="DragAndDrop">
                <div className="Entry">
                    <div className="Label">File:</div>
                    <div className="Value">
                        <div className="X">{`${shortStr(state.fileName)}`}</div>
                    </div>
                </div>
                <div className="Entry">
                    <div className="Label">Period:</div>
                    <div className="Value">
                        <div className="slidecontainer">
                            <input
                                type="range"
                                min="6"
                                max="240"
                                step="6"
                                class="slider"
                                id="myRange"
                                onChange={(e) =>
                                    updateState({ period: e.target.value })
                                }
                            />
                        </div>
                        <div className="Selected">{`${state.period} months`}</div>
                    </div>
                </div>
                <div className="Entry">
                    <div className="Label">Replicas:</div>
                    <div className="Value">
                        <div className="slidecontainer">
                            <input
                                type="range"
                                min="1"
                                max="15"
                                class="slider"
                                id="myRange"
                                onChange={(e) =>
                                    updateState({ replicas: e.target.value })
                                }
                            />
                        </div>
                        <div className="Selected">{state.replicas}</div>
                    </div>
                </div>
                <div className="Entry">
                    <div className="Label">Providers:</div>
                    <div className="Value">
                        <img
                            className="Selected"
                            src={cfg.IMAGES.providerImage}
                        ></img>
                    </div>
                </div>
                <div className="Entry">
                    <div className="Label">Price:</div>
                    <div className="Value">
                        <b>~13.4 FIL</b>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        await ipfs.upload({ files: state.files });
                        const { err } = await metamask.fileUpload({
                            cid: "....",
                        });
                        if (err == "") {
                            //sucessfull transaction
                            updateState({ fileName: null });
                        }
                    }}
                >
                    Upload File
                </button>
            </div>
        );
    }
};

export default DragAndDrop;
