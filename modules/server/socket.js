const { http } = require('../api');
const io = require('socket.io')(http);

const service_provider_data = {};

class SocketModule {
    static on(event, callback) {
        return io.on(event, callback);
    }

    static broadcastStorageOffer(offer_cid, offer_price, offer_size, offer_duration) {
        const payload = { offer_price, offer_length, offer_size, offer_cid };
        io.emit('fs-offer', payload);
    }

    static saveServiceProviderData(socket, sp_socket_id, sp_address) {
        if (service_provider_data[sp_socket_id]) {
            throw Error(`Data conflict, service provider data for user ${sp_socket_id} already exists`);
        }

        service_provider_data[sp_socket_id] = {
            address: sp_address,
            socket,
        }
    }

    static removeServiceProviderData(sp_socket_id) {
        delete service_provider_data[sp_socket_id];
    }

    static joinServiceProviderRoom(socket, sp_socket_id) {
        socket.join(sp_socket_id);
    }

    static getServiceProviderData(sp_socket_id) {
        return service_provider_data[sp_socket_id];
    }

    static sendAddressConfirmation(sp_socket_id, sp_address) {
        io.to(sp_socket_id).emit('fs-confirm-address', sp_address);
    }
}

module.exports = SocketModule;