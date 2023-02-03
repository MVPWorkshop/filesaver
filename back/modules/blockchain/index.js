import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import { URL } from 'url';
const __dirname = new URL('.', import.meta.url).pathname;

import { ethers } from "ethers";
const provider = ethers.getDefaultProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v1');

const private_key = process.env.SP_PRIVATE_KEY;
const signer = new ethers.Wallet(private_key, provider);

// Load smart contract
const bounty_contract_address = process.env.BOUNTY_CONTRACT_ADDRESS;
const bounty_abi_path = `${__dirname}abi.json`
const bounty_contract_abi = JSON.parse(fs.readFileSync(bounty_abi_path));
const bounty_contract_instance = new ethers.Contract(
    bounty_contract_address,
    bounty_contract_abi,
    signer,
)

// Create deal through the smart contract
async function createDeal(offer_cid) {
    console.log(`Submitting storage deal to FEVM Smart contract for offer ${offer_cid}`);
    // TODO Update createDeal call when new logic is applied
    return bounty_contract_instance.createDeal();
}

// Claim a bounty for a previous storage period through the smart contract
async function claimBounty(offer_cid) {
    console.log(`Claiming bounty through FEVM Smart contract for offer ${offer_cid}`);
    // TODO Update claimBounty call when new logic is applied
    return bounty_contract_instance.claimBounty(offer_cid);
}

// Helper function to check address balance
async function getBalance(address) {
    const balance = await provider.getBalance(address);
    console.log(balance);
}

export { getBalance, createDeal, claimBounty };