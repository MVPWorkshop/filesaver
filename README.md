# FileSaver

[<img width="800" align="center" alt="Screenshot 2023-02-06 at 15 00 31" src="https://user-images.githubusercontent.com/114067274/216994548-313fb447-84f9-436b-93df-ff463dcad9f3.png">](https://www.figma.com/proto/OYH5x3RXwuVgYmULcqoXUQ/Filesaver?page-id=0%3A1&node-id=1%3A2&viewport=122%2C161%2C0.32&scaling=scale-down)

## Overview

**Store once and for all.**

FileSaver is the first fully decentralized drive designed for permanent file storage for both public and private use.

It is unlimited by time, decentralized, storage dApp run on Filecoin.

## Problem

Currently, Filecoin enables storage of files for a fixed amount of time (6-18\* months).

What happens when a user wants to store their files for larger amounts of time?

They would have to keep a copy of their files and start a new deal, or re-enter the negotiations with their current providers.

## Solution

[<img width="1382" alt="Screenshot 2023-02-06 at 14 58 15" src="https://user-images.githubusercontent.com/114067274/216994442-675f3cf1-349e-414f-a158-80a7059a71fa.png">](https://github.com/MVPWorkshop/filesaver/blob/master/docs/SequenceDiagram.md)

Perpetual storage is a concept of semi-automating this process through F(E)VM actors in which, after the end of the current deal’s duration has been reached, a new one can be started by providers without the user's involvement.

## Flow

[<img width="800" alt="7" src="https://user-images.githubusercontent.com/114067274/216995244-2b750ac4-16de-4e4c-af9a-d1ca5ed5d42a.png">](https://docs.google.com/presentation/d/1A1ISjl94Afdely1O80OnwtxOe8BwNQXaIIUZ3wX9-p0/edit#slide=id.g20496c628a4_1_7)

User connect wallet, sets conditions for the deal, upload file to IPFS via web3.storage.

User sends funds to contract for perpetual deal.

Provider downloads the file, reserves the spot and makes deal through FEVM actor(after FIP44).

Provider stores the file, publishes the deal and can claim funds.

[<img width="800" alt="9" src="https://user-images.githubusercontent.com/114067274/216995635-fd121521-3125-47f9-bcbe-b1ca95071a81.png">](https://docs.google.com/presentation/d/1A1ISjl94Afdely1O80OnwtxOe8BwNQXaIIUZ3wX9-p0/edit#slide=id.g20496c628a4_1_7)

## Project Vision

[<img width="800" alt="10" src="https://user-images.githubusercontent.com/114067274/216994936-799e3a8a-7dc4-47c9-b0f9-f9064286daa1.png">](https://docs.google.com/presentation/d/1A1ISjl94Afdely1O80OnwtxOe8BwNQXaIIUZ3wX9-p0/edit#slide=id.g20496c628a4_1_7)

Since complete funds are locked in the BountySC until the next deal when the part of it is claimed, they can be used inside DeFi applications. This can be part of the FileSaver’s business model.

## Built With

-   ReactJS (Frontend)
    -   Metamask wallet
-   NodeJS (Backend)
    -   Lotus
-   Solidity (Smart Contracts)
    -   FEVM Hardhat Kit
    -   Zondax Solidity API

Frontend is created using React and NodeJS is used for backend alongside with **web3.storage** for uploading files to IPFS. Smart contracts are written in Solidity and with **ethers** we are capable to interact with them on front and back.

## Getting started

This repo containts three main subfolders:

-   `back` - contains all backend logic that is being used by the providers
-   `front` - frontend being used for user interaction
-   `contracts` - used for developing and deploying FEVM actors

### Instructions

After cloning the repo, follow these steps:

#### Installation

To install all the dependencies, open three terminals and type:

1. `cd back && npm install`
2. `cd front && npm install`
3. `cd contracts && npm install`

#### Workflow

In the first terminal enter:

-   `npm start` which will start the React App

Split the second terminal, and enter:

-   `node back/modules/server` which will start the server that handles file upload requests
-   `node back/modules/service-provider` which will start one provider process

Finally the last terminal serves for actor development:

-   `yarn hardhat compile` which is used for compilation
-   `yarn hardhat deploy` which is used for deployment
