import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Web3Storage } from "web3.storage";

const WEB3_STORAGE_API_TOKEN = process.env.REACT_APP_WEB3_STORAGE_API_TOKEN;

// Construct with token and endpoint
const client = new Web3Storage({ token: WEB3_STORAGE_API_TOKEN });

const upload = async ({ acceptedFiles }) => {
    // Pack files into a CAR and send to web3.storage
    console.log(acceptedFiles[0]);
    const rootCid = await client.put(acceptedFiles, {
        name: "cat pics",
        maxRetries: 3,
    });

    console.log(rootCid);

    return { rootCid };
};

const DragAndDrop = () => {
    const onDrop = useCallback(async (acceptedFiles) => {
        // Do something with the files
        console.log({ acceptedFiles });
        //TODO: IPFS upload
        console.log(await upload({ acceptedFiles }));
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )}
        </div>
    );
};

export default DragAndDrop;
