require('dotenv').config();
const app = require('express')();
const { io } = require("socket.io-client");
const socket = io.connect('http://localhost:3000', { reconnect: true });

const http = require('http').Server(app);

const address = process.env.SP_USERNAME;
const port = process.env.SP_PORT;

// Helper functions 
function checkOfferCriteria(offer_price, offer_length, offer_size) {
    // TODO Add checking service provider criteria
    return true;
}

function applyForOffer(socket, offer_cid) {
    console.log(`Applying for offer ${offer_cid}`);
    socket.emit('sp-apply', { address, offer_cid });
}

// Socket events
socket.on('fs-offer', function (data) {
    console.log('======= Detected new offer =======');
    const { offer_price, offer_length, offer_size, offer_cid } = data;
    console.log(`Offer ${offer_cid} price: ${offer_price}`);
    console.log(`Offer ${offer_cid} size:  ${offer_size}`);
    console.log(`Offer ${offer_cid} length: ${offer_length}`);

    const offerCriteriaPassed = checkOfferCriteria(offer_price, offer_length, offer_size);
    if (!offerCriteriaPassed) {
        console.log(`Offer ${offer_cid} does not meet node criteria, ignoring offer.`);
        return;
    }

    applyForOffer(socket, offer_cid);
})

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
