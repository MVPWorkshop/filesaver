const app = require('express')();
const http = require('http').Server(app);

module.exports = {
    app,
    http,
}