import * as dotenv from "dotenv";
dotenv.config();
import * as fs from "fs";
import { URL } from "url";
const __dirname = new URL(".", import.meta.url).pathname;
import BN from "bn.js";
import { create, globSource } from "ipfs";
const ipfs = await create();
import { io } from "socket.io-client";
const socket = io.connect(`http://localhost:${process.env.SERVER_PORT}`, {
    reconnect: true,
});

import { http } from "../api.js";
import * as constants from "../constants.js";
import { exit } from "process";

import * as blockchain from "../blockchain/index.js";

const address = process.env.SP_ADDRESS;
const port = process.env.SP_PORT;

// Load saved offers
const offersPath = `${__dirname}offers.json`;
const dealsPath = `${__dirname}deals.json`;
if (!fs.existsSync(offersPath)) {
    fs.writeFileSync(offersPath, "{}");
}
if (!fs.existsSync(dealsPath)) {
    fs.writeFileSync(dealsPath, "{}");
}
const offers = JSON.parse(fs.readFileSync(offersPath));
const deals = JSON.parse(fs.readFileSync(dealsPath));

// Helper functions
function storeOffers() {
    fs.writeFileSync(offersPath, JSON.stringify(offers, null, 4));
}
function storeDeals() {
    fs.writeFileSync(dealsPath, JSON.stringify(deals, null, 4));
}

function saveOfferData(offer_cid, offer_price, offer_duration, offer_size) {
    console.log("Saving offer data");
    const offerData = {
        offer_price,
        offer_duration,
        offer_size,
    };

    offers[offer_cid] = offerData;
    storeOffers();
}

function deleteOfferData(offer_cid) {
    console.log("Deleting offer data");
    delete offers[offer_cid];
    storeOffers();
}

function saveStorageDealData(
    offer_cid,
    deal_price_per_cycle,
    deal_duration_per_cycle,
    cycle_expiration_timestamp
) {
    console.log("Saving storage deal data");
    const storageDealData = {
        deal_price_per_cycle,
        deal_duration_per_cycle,
        cycle_expiration_timestamp,
        status: "STORING",
    };
    deals[offer_cid] = storageDealData;
    storeDeals();
}

function deleteStorageDealData(offer_cid) {
    console.log("Deleting storage deal data");
    delete deals[offer_cid];
    storeDeals();
}

function calculateDealData(offer_data) {
    console.log("Calculating deal data");
    const { offer_price, offer_duration } = offer_data;

    // Offer duration is in months, we need the number of 6 month cycles
    const number_of_cycles = parseInt(offer_duration) / 6;

    // Offer price is for the entire durations, we need the price for one cycle
    let deal_price_per_cycle = new BN(offer_price);
    deal_price_per_cycle = deal_price_per_cycle.div(new BN(number_of_cycles));

    // The first cycle expiration period is 6 months from now
    const cycle_in_milliseconds = 6 * 30 * 24 * 60 * 60 * 1000;
    let cycle_expiration_timestamp = Date.now() + cycle_in_milliseconds;

    return {
        number_of_cycles,
        deal_price_per_cycle,
        cycle_expiration_timestamp,
    };
}

function checkOfferCriteria(offer_price, offer_length, offer_size) {
    // Future Feature: Add checking service provider criteria
    return true;
}

function applyForOffer(socket, offer_cid) {
    console.log(`Applying for offer ${offer_cid}`);
    socket.emit("sp-apply", { address, offer_cid });
}

async function renewStorageDeal(offer_cid) {
    const storage_deal_data = deals[offer_cid];
    if (storage_deal_data.status !== "STORING") {
        return;
    }

    console.log(`Storage deal ${offer_cid} should be renewed`);

    // Concurrency lock
    storage_deal_data.status = "RENEWING";

    await blockchain.claimBounty(offer_cid);
    await blockchain.createDeal(offer_cid);

    storage_deal_data.status = "STORING";
}

let renewalCheckStatus = "FINISHED";

async function checkForRenewals() {
    if (renewalCheckStatus !== "FINISHED") {
        return;
    }

    // Concurrency lock
    renewalCheckStatus = "STARTED";

    console.log("Checking if storage deals need to be renewed");

    for (const offer_cid in deals) {
        console.log(`Checking storage renewal for deal ${offer_cid}`);
        if (
            parseInt(deals[offer_cid].cycle_expiration_timestamp) < Date.now()
        ) {
            promises.push(renewStorageDeal());
        }
    }

    await Promise.all(promises);

    renewalCheckStatus = "FINISHED";
}

// Socket events
socket.on("fs-offer", async (data) => {
    console.log("======= Detected new offer =======");
    const { offer_price, offer_duration, offer_size, offer_cid } = data;
    console.log(`Offer ${offer_cid} price: ${offer_price}`);
    console.log(`Offer ${offer_cid} size:  ${offer_size}`);
    console.log(`Offer ${offer_cid} duration: ${offer_duration}`);

    const offerCriteriaPassed = checkOfferCriteria(
        offer_price,
        offer_duration,
        offer_size
    );
    if (!offerCriteriaPassed) {
        console.log(
            `Offer ${offer_cid} does not meet node criteria, ignoring offer.`
        );
        return;
    }

    const file = await ipfs.get(offer_cid);

    // TODO Save file downloaded from IPFS
    // fs.writeFileSync(`./savedFiles/${offer_cid}`, file);

    saveOfferData(offer_cid, offer_price, offer_duration, offer_size);

    applyForOffer(socket, offer_cid);
});

socket.on("fs-application-response", async (data) => {
    const { offer_cid, status } = data;
    if (status === constants.APPLICATION_RESPONSE.REJECTED) {
        console.log(
            `Application for offer ${offer_cid} rejected, removing offer`
        );
        deleteOfferData(offer_cid);
        return;
    }

    if (data.status !== constants.APPLICATION_RESPONSE.ACCEPTED) {
        throw Error(`Unexpected application response status ${data.status}`);
    }

    console.log(`Accepted to store offer ${offer_cid}, creating storage deal`);
    // TODO Calculate storage deal information per cycle
    const offerData = offers[offer_cid];
    const {
        deal_price_per_cycle,
        deal_duration_per_cycle,
        cycle_expiration_timestamp,
    } = calculateDealData(offerData);

    saveStorageDealData(
        offer_cid,
        deal_price_per_cycle,
        deal_duration_per_cycle,
        cycle_expiration_timestamp
    );

    // Call blockchain function to create deal
    const delay = (delayInms = 1000) => {
        return new Promise((resolve) => setTimeout(resolve, delayInms));
    };
    await delay(45000); //introducing artificial delay to capture both Pending and Active status
    const result = await blockchain.createDeal(offer_cid);

    console.log(`===================================================`);
    console.log(`===== Successfully created new storage deal =======`);
    console.log(`===================================================`);
});

socket.on("connect", function (connection) {
    console.log("Setting address...");
    socket.emit("sp-set-address", address);
});

socket.on("fs-confirm-address", function (confirmation_address) {
    if (confirmation_address === address) {
        console.log(`Successfully connected to server and set address!`);
    } else {
        throw Error(
            `Server connection failed! Received address ${confirmation_address}`
        );
    }
});

setInterval(checkForRenewals, 60 * 60 * 1000);

http.listen(port, () => {
    console.log(`Service Provider running at http://localhost:${port}/`);
});
