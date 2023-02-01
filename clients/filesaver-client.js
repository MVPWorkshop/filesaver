const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let usernames = {};
let ids = {};

// API Calls

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/store', (req, res) => {
    io.emit('new offer');
    res.send('done');
})

function addUserData(userID, username, socket) {
    usernames[userID] = username;
    ids[username] = userID;
}

// Socket calls

io.on('connection', async (socket) => {
    console.log(`User ${socket.client.id} attempting to connect...`);

    socket.on('set_username', msg => {
        console.log(`User ${socket.client.id} set their username to ${msg}`);

        addUserData(socket.client.id, msg, socket);

        socket.join(socket.client.id);

        io.to(ids[msg]).emit('confirm_username', usernames[socket.client.id]);
    })

    socket.on('sp-claim', data => {
        let { sp_address } = data;
    });

    socket.on('chat message', msg => {
        if (!usernames[socket.client.id]) {
            console.log('User not found, rejecting message');
            io.to(socket.client.id).emit('nousername', {});
            return;
        }

        console.log(`${usernames[socket.client.id]} sending message ${msg}`);

        io.emit('chat message', { value: msg, username: usernames[socket.client.id] });
    });

    socket.on('disconnect', () => {
        console.debug(`User ${usernames[socket.client.id]} disconnected`);
    });

});

http.listen(port, () => {
    console.log(`Filesaver server running at http://localhost:${port}/`);
});