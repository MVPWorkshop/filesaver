import * as dotenv from "dotenv";
dotenv.config();
import * as fs from "fs";
import { URL } from "url";
const __dirname = new URL(".", import.meta.url).pathname;
import { app, http } from "../api.js";
import multiparty from "multiparty";
import * as constants from "../constants.js";

const port = process.env.SERVER_PORT || 3001;

import SocketModule from "./socket.js";

let addresses = {};
let ids = {};

const offersPath = `${__dirname}offers.json`;
if (!fs.existsSync(offersPath)) {
    fs.writeFileSync(offersPath, "{}");
}
const offers = JSON.parse(fs.readFileSync(offersPath));

// Helper functions
function storeOffers() {
    fs.writeFileSync(offersPath, JSON.stringify(offers, null, 4));
}

function saveOfferData(
    offer_cid,
    offer_price,
    offer_duration,
    offer_size,
    offer_replications
) {
    const offerData = {
        offer_price,
        offer_duration,
        offer_size,
        required_replications: offer_replications,
        accepted_applications: [],
    };

    offers[offer_cid] = offerData;
    storeOffers();
}

function saveOfferApplicant(offer_cid, sp_address) {
    offers[offer_cid].accepted_applications.push(sp_address);
    storeOffers();
}

// API Calls
app.get("/status", (req, res) => {
    res.json({ status: "I am alive" }).status(200);
});
app.post("/store", (req, res) => {
    console.log({ route: "store", req });
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        console.log("Received storage request");

        const offer_cid = req.body.cid; //fields.cid[0];
        const offer_price = req.body.values; //fields.value[0];
        const offer_size = req.body.size; //fields.size[0];
        const offer_replications = parseInt(req.body.replications); //parseInt(fields.replications[0]);
        const offer_duration = req.body.duration; //fields.duration[0];

        saveOfferData(
            offer_cid,
            offer_price,
            offer_duration,
            offer_size,
            offer_replications
        );

        SocketModule.broadcastStorageOffer(
            offer_cid,
            offer_price,
            offer_size,
            offer_duration
        );

        res.sendStatus(200);
    });
});

// Socket calls
SocketModule.on("connection", async (socket) => {
    console.log(`User ${socket.client.id} attempting to connect...`);

    socket.on("sp-set-address", (sp_address) => {
        console.log(
            `User ${socket.client.id} set their address to ${sp_address}`
        );

        SocketModule.saveServiceProviderData(
            socket,
            socket.client.id,
            sp_address
        );

        SocketModule.joinServiceProviderRoom(socket, socket.client.id);

        const { socket: saved_socket, address: saved_address } =
            SocketModule.getServiceProviderData(socket.client.id);

        SocketModule.sendAddressConfirmation(socket.client.id, saved_address);
    });

    socket.on("sp-apply", (data) => {
        let { address: sp_address, offer_cid } = data;
        console.log(`User ${sp_address} is applying for offer ${offer_cid}`);

        const offer_data = offers[offer_cid];

        const response = {
            status: constants.APPLICATION_RESPONSE.REJECTED,
            offer_cid,
        };
        console.log(
            `Replications required ${offer_data.required_replications}`
        );
        console.log(
            `Replications done ${offer_data.accepted_applications.length}`
        );
        if (
            offer_data.required_replications <=
            offer_data.accepted_applications.length
        ) {
            response.status = constants.APPLICATION_RESPONSE.REJECTED;
        } else {
            saveOfferApplicant(offer_cid, sp_address);
            response.status = constants.APPLICATION_RESPONSE.ACCEPTED;
        }

        SocketModule.sendApplicationResponse(socket.client.id, response);
    });

    socket.on("disconnect", () => {
        console.debug(`User ${addresses[socket.client.id]} disconnected`);

        SocketModule.removeServiceProviderData(socket.client.id);
    });
});

http.listen(port, () => {
    console.log(`Filesaver server running at http://localhost:${port}/`);
});
