// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import "./sFil.sol";

contract BountySC {
    mapping(address => mapping(uint256 => uint256)) public providerPerpetualDealClaimed;
    event DealCreated(address client);

    function reserveSpot(bytes32 cid) external {}

    function createDeal(MarketTypes.PublishStorageDealsParams memory params) external payable {
        MarketAPI.addBalance(abi.encodePacked(msg.sender));
        MarketAPI.publishStorageDeals(params);

        //get perepetualDealID

        emit DealCreated(MarketAPI.getDealClient(perepetualDealID));
    }

    function getDealInfo(uint256 dealID) external {}

    function claimBounty(uint256 perepetualDealID, uint256 individualDealID) external {
        //update providerPerpetualDealClaimed
    }
}

