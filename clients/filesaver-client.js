const fs = require('fs');
const app = require('express')();
const multiparty = require('multiparty');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let addresses = {};
let ids = {};

// API Calls
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/store', (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        console.log('Received storage request');

        const offer_price = fields.value[0];
        const offer_length = fields.length[0];
        const offer_size = files.file[0].size;
        // TODO determine file CID and send correct value
        const offer_cid = Math.trunc(Math.random() * 10000000000);

        const payload = { offer_price, offer_length, offer_size, offer_cid };
        io.emit('fs-offer', payload);

        res.sendStatus(200);
    });
})

app.get('/filestatus', (req, res) => {
    let payload = {};

    res.status(200).send(JSON.stringify(payload));
})

function addUserData(sp_id, sp_address, socket) {
    addresses[sp_id] = sp_address;
    ids[sp_address] = sp_id;
}

// Socket calls

io.on('connection', async (socket) => {
    console.log(`User ${socket.client.id} attempting to connect...`);

    socket.on('sp-set-address', msg => {
        console.log(`User ${socket.client.id} set their address to ${msg}`);

        addUserData(socket.client.id, msg, socket);

        socket.join(socket.client.id);

        io.to(ids[msg]).emit('fs-confirm-address', addresses[socket.client.id]);
    })

    socket.on('sp-apply', data => {
        let { address: sp_address, offer_cid } = data;
        console.log(`User ${sp_address} is applying for offer ${offer_cid}`);

        createDealWithStorageProvider(socket, offer_cid, sp_address)
    });

    /* Reference for direct messages
    socket.on('chat message', msg => {
        if (!addresses[socket.client.id]) {
            console.log('User not found, rejecting message');
            io.to(socket.client.id).emit('no_username');
            return;
        }

        console.log(`${addresses[socket.client.id]} sending message ${msg}`);

        io.emit('chat message', { value: msg, username: addresses[socket.client.id] });
    });
    */

    socket.on('disconnect', () => {
        console.debug(`User ${addresses[socket.client.id]} disconnected`);
    });

});

http.listen(port, () => {
    console.log(`Filesaver server running at http://localhost:${port}/`);
});