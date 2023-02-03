// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import "./sFil.sol";

contract BountySC {
    event DealCreated(address client);

    function reserveSpot(bytes32 cid) external {}

    function createDeal(MarketTypes.PublishStorageDealsParams memory params) external payable {
        MarketAPI.addBalance(abi.encodePacked(msg.sender));
        MarketAPI.publishStorageDeals(params);

        //get dealID

        emit DealCreated(MarketAPI.getDealClient(dealID));
    }

    function getDealInfo(uint256 dealID) external {}

    function claimBounty(uint256 dealID) external {}
}

