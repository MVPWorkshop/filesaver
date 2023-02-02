import * as dotenv from 'dotenv';
dotenv.config();
import { app, http } from '../api.js';
import multiparty from 'multiparty';

const port = process.env.SERVER_PORT || 3000;


import SocketModule from './socket.js';

let addresses = {};
let ids = {};

function createDealWithStorageProvider(socket, offer_cid, sp_address) {

}

// API Calls
app.post('/store', (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        console.log('Received storage request');

        const offer_cid = fields.cid[0];
        const offer_price = fields.value[0];
        const offer_size = fields.size[0];
        const offer_duration = fields.duration[0];

        SocketModule.broadcastStorageOffer(offer_cid, offer_price, offer_size, offer_duration)

        res.sendStatus(200);
    });
});

// Socket calls
SocketModule.on('connection', async (socket) => {
    console.log(`User ${socket.client.id} attempting to connect...`);

    socket.on('sp-set-address', sp_address => {
        console.log(`User ${socket.client.id} set their address to ${sp_address}`);

        SocketModule.saveServiceProviderData(socket, socket.client.id, sp_address);

        SocketModule.joinServiceProviderRoom(socket, socket.client.id);

        const { socket: saved_socket, address: saved_address } =
            SocketModule.getServiceProviderData(socket.client.id);

        SocketModule.sendAddressConfirmation(socket.client.id, saved_address);
    })

    socket.on('sp-apply', data => {
        let { address: sp_address, offer_cid } = data;
        console.log(`User ${sp_address} is applying for offer ${offer_cid}`);

        createDealWithStorageProvider(socket, offer_cid, sp_address)
    });

    socket.on('disconnect', () => {
        console.debug(`User ${addresses[socket.client.id]} disconnected`);

        SocketModule.removeServiceProviderData(socket.client.id);
    });

});

http.listen(port, () => {
    console.log(`Filesaver server running at http://localhost:${port}/`);
});