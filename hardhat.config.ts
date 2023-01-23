import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config({ path: './.env' });

export enum ChainId {
	Filecoin = 314,
	Hyperspace = 3141, // https://chainlist.org/chain/3141
}

const privateKey = process.env.PRIVATE_KEY;

const hyperspaceRpcUrl =
	process.env.HYPERSPACE_RPC_URL !== undefined
		? process.env.HYPERSPACE_RPC_URL
		: `https://api.hyperspace.node.glif.io/rpc/v0`;

const filfoxHyperspaceExplorerUrl = `https://hyperspace.filfox.info/`;

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.16', // https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity
				settings: {
					optimizer: {
						enabled: true,
						runs: 1000000,
					},
				},
			},
		],
	},
	networks: {
		hardhat: {
			allowUnlimitedContractSize: false,
		},
		hyperspace: {
			chainId: ChainId.Hyperspace,
			url: hyperspaceRpcUrl,
			accounts: privateKey !== undefined ? [privateKey] : [],
		},
	},
	etherscan: {
		customChains: [
			{
				network: 'hyperspace',
				chainId: ChainId.Hyperspace,
				urls: {
					apiURL: '', // To be explored
					browserURL: filfoxHyperspaceExplorerUrl,
				},
			},
		],
	},
	typechain: {
		outDir: 'typechain',
		target: 'ethers-v5',
		externalArtifacts: ['abis/*.abi.json'],
	},
	paths: {
		sources: './contracts',
		tests: './test',
		cache: './cache',
		artifacts: './artifacts',
	},
	mocha: {
		timeout: 24000,
	},
};

export default config;
