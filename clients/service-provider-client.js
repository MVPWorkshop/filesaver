const app = require('express')();
const { io } = require("socket.io-client");
const socket = io.connect('http://localhost:3000', { reconnect: true });

const http = require('http').Server(app);

var args = process.argv.slice(2);

const username = args[0];
const port = args[1];

socket.on('fs-offer', function (data) {
    console.log('======= Detected new offer =======');
    const { offer_price, offer_length, offer_size, offer_cid } = data;
    console.log(`\tOffer CID: ${offer_cid}`);
    console.log(`\tOffer price: ${offer_price}`);
    console.log(`\tOffer size:  ${offer_size}`);
    console.log(`\tOffer length: ${offer_length}`);

})

socket.on('connect', function (connection) {
    console.log('Setting username...');
    socket.emit('set_username', username);
});

socket.on('confirm_username', function (server_username) {
    if (server_username === username) {
        console.log(`Successfully connected to server and set username!`);
    } else {
        throw Error(`Server connection failed! Received username ${server_username}`);
    }
})

http.listen(port, () => {
    console.log(`Service Provider running at http://localhost:${port}/`);
});
