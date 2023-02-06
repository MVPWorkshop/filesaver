import * as dotenv from "dotenv";
dotenv.config();
import * as fs from "fs";
import { URL } from "url";
const __dirname = new URL(".", import.meta.url).pathname;

import { ethers } from "ethers";
const provider = ethers.getDefaultProvider(
    "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"
);

const private_key = process.env.SP_PRIVATE_KEY;
const signer = new ethers.Wallet(private_key, provider);

// Load smart contract
const filesaver_contract_address = process.env.filesaver_CONTRACT_ADDRESS;
const filesaver_abi_path = `${__dirname}artifacts/contracts/filesaver/FileSaver.sol/FileSaver.json`;
const filesaver_contract_abi = JSON.parse(
    fs.readFileSync(filesaver_abi_path)
).abi;

console.log({ filesaver_contract_abi });
const filesaver_contract_instance = new ethers.Contract(
    filesaver_contract_address,
    filesaver_contract_abi,
    signer
);

// Create deal through the smart contract
async function createDeal(offer_cid) {
    console.log(
        `Submitting storage deal to FEVM Smart contract for offer ${offer_cid}`
    );
    // TODO Update createDeal call when new logic is applied
    return filesaver_contract_instance.reserve(offer_cid, {
        gasLimit: 200000000,
    });
}

// Claim a filesaver for a previous storage period through the smart contract
async function claimfilesaver(offer_cid) {
    console.log(
        `Claiming bounty through FEVM Smart contract for offer ${offer_cid}`
    );
    // TODO Update claimfilesaver call when new logic is applied
    return filesaver_contract_instance.claim(offer_cid, 1);
}

// Helper function to check address balance
async function getBalance(address) {
    const balance = await provider.getBalance(address);
    console.log(balance);
}

export { getBalance, createDeal, claimfilesaver };
