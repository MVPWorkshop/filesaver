import * as dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { create, globSource } from 'ipfs';
const ipfs = await create();
import { io } from 'socket.io-client'
const socket = io.connect(`http://localhost:${process.env.SERVER_PORT}`, { reconnect: true });

import { http } from '../api.js';
import * as constants from '../constants.js';

const address = process.env.SP_ADDRESS;
const port = process.env.SP_PORT;

// Helper functions 
function checkOfferCriteria(offer_price, offer_length, offer_size) {
    // Future Feature: Add checking service provider criteria
    return true;
}

function applyForOffer(socket, offer_cid) {
    console.log(`Applying for offer ${offer_cid}`);
    socket.emit('sp-apply', { address, offer_cid });
}

// Socket events
socket.on('fs-offer', async (data) => {
    console.log('======= Detected new offer =======');
    const { offer_price, offer_duration, offer_size, offer_cid } = data;
    console.log(`Offer ${offer_cid} price: ${offer_price}`);
    console.log(`Offer ${offer_cid} size:  ${offer_size}`);
    console.log(`Offer ${offer_cid} duration: ${offer_duration}`);

    const offerCriteriaPassed = checkOfferCriteria(offer_price, offer_duration, offer_size);
    if (!offerCriteriaPassed) {
        console.log(`Offer ${offer_cid} does not meet node criteria, ignoring offer.`);
        return;
    }

    //TODO Download file from IPFS
    const file = await ipfs.get(offer_cid);
    fs.writeFileSync(`./savedFiles/${offer_cid}`, file);

    //TOOD Store data about offer

    //TODO send application to server

    applyForOffer(socket, offer_cid);
})

socket.on('fs-application-response', data => {
    if (data.status === constants.APPLICATION_RESPONSE.REJECTED) {
        console.log(`Application for offer ${data.offer_cid} rejected, removing offer`);
        // TOOD Remove offer data
    }

    if (data.status !== constants.APPLICATION_RESPONSE.ACCEPTED) {
        throw Error(`Unexpected application response status ${data.status}`);
    }

    //TOOD Store data about offer

    //TODO Call blockchain function to create deal
});

socket.on('fs-application-rejected')

socket.on('connect', function (connection) {
    console.log('Setting address...');
    socket.emit('sp-set-address', address);
});

socket.on('fs-confirm-address', function (confirmation_address) {
    if (confirmation_address === address) {
        console.log(`Successfully connected to server and set address!`);
    } else {
        throw Error(`Server connection failed! Received address ${confirmation_address}`);
    }
})

http.listen(port, () => {
    console.log(`Service Provider running at http://localhost:${port}/`);
});
