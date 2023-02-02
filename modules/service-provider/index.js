import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import { URL } from 'url';
const __dirname = new URL('.', import.meta.url).pathname;
import { create, globSource } from 'ipfs';
const ipfs = await create();
import { io } from 'socket.io-client'
const socket = io.connect(`http://localhost:${process.env.SERVER_PORT}`, { reconnect: true });

import { http } from '../api.js';
import * as constants from '../constants.js';
import { exit } from 'process';

const address = process.env.SP_ADDRESS;
const port = process.env.SP_PORT;

// Load saved offers
const offersPath = `${__dirname}offers.json`
const dealsPath = `${__dirname}deals.json`
const offers = JSON.parse(fs.readFileSync(offersPath));
const deals = JSON.parse(fs.readFileSync(dealsPath));

// Helper functions
function storeOffers() {
    fs.writeFileSync(offersPath, JSON.stringify(offers, null, 4));
}
function storeDeals() {
    fs.writeFileSync(dealsPath, JSON.stringify(offers, null, 4));
}

function saveOfferData(offer_cid, offer_price, offer_duration, offer_size) {
    const offerData = {
        offer_price,
        offer_duration,
        offer_size,
    }

    offers[offer_cid] = offerData;
    storeOffers();
}

function deleteOfferData(offer_cid) {
    delete offers[offer_cid];
    storeOffers();
}

function saveStorageDealData(offer_cid) {
    const storageDealData = {
        deal_price_per_cycle,
        deal_duration_per_cycle,
        cycle_expiration_timestamp,
    }
    deals[offer_cid] = storageDealData;
    storeDeals();
}

function deleteStorageDealData(offer_cid) {
    delete deals[offer_cid];
    storeDeals();
}


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

    const file = await ipfs.get(offer_cid);

    // TODO Save file downloaded from IPFS 
    // fs.writeFileSync(`./savedFiles/${offer_cid}`, file);

    saveOfferData(offer_cid, offer_price, offer_duration, offer_size)

    applyForOffer(socket, offer_cid);
})

socket.on('fs-application-response', data => {
    const { offer_cid, status } = data;
    if (status === constants.APPLICATION_RESPONSE.REJECTED) {
        console.log(`Application for offer ${offer_cid} rejected, removing offer`);
        deleteOfferData(offer_cid);
    }

    if (data.status !== constants.APPLICATION_RESPONSE.ACCEPTED) {
        throw Error(`Unexpected application response status ${data.status}`);
    }

    // TODO Calculate storage deal information per cycle
    saveStorageDealData(offer_cid)

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
