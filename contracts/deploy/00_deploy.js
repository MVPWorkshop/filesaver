require("hardhat-deploy")
require("hardhat-deploy-ethers")

// const { networkConfig } = require("../helper-hardhat-config")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    //deploy sFIL
    const SFIL = await ethers.getContractFactory("sFIL", wallet)
    console.log("Deploying sFIL...")
    const sFIL = await SFIL.deploy()
    await sFIL.deployed()
    console.log("sFIL deployed to:", sFIL.address)

    //deploy FileSaver
    const FileSaver = await ethers.getContractFactory("FileSaver", wallet)
    console.log("Deploying FileSaver...")
    const fileSaver = await FileSaver.deploy(sFIL.address)
    await fileSaver.deployed()
    console.log("FileSaver deployed to:", fileSaver.address)
}
