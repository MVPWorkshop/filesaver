import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as ipfs from "../interactions/ipfs";

const DragAndDrop = () => {
    const [state, setState] = useState({ fileName: null, files: [] });

    const onDrop = useCallback(async (files) => {
        setState({ fileName: files[0].name, files });
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    if (state.fileName == null) {
        return (
            <div className="DragAndDrop" {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>
                        Drag 'n' drop some files here, or click to select files
                    </p>
                )}
            </div>
        );
    } else {
        return (
            <div className="DragAndDrop">
                <div>FileName: {state.fileName}</div>
                <div>
                    Period
                    <div className="slidecontainer">
                        <input
                            type="range"
                            min="1"
                            max="100"
                            class="slider"
                            id="myRange"
                        />
                    </div>
                </div>
                <button
                    onClick={async () =>
                        await ipfs.upload({ files: state.files })
                    }
                >
                    Upload File
                </button>
            </div>
        );
    }
};

export default DragAndDrop;
