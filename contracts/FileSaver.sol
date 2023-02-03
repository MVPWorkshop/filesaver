// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./sFil.sol";

error InsufficientFunds();

contract FileSaver {
    mapping(uint256 => address) public perpetualDealClients;
    mapping(address => mapping(uint256 => uint256)) public balances;
    sFil internal immutable sFilToken;
    uint256 public perepetualDealID;
    

    event Deposit(address user, uint256 dealID, uint256 amount);
    event Withdrawal(address user, uint256 dealID, uint256 amount);
    event PerpetualDealCreated(address user, uint256 _perpetualDealID);

    constructor() {
        sFilToken = new sFil();
    }

    function deposit(uint256 perepetualDealID) external payable {
        if (msg.value <= 0) revert InsufficientFunds();

        sFilToken.mint(msg.sender, msg.value);

        balances[msg.sender][perepetualDealID] += msg.value;

        emit Deposit(msg.sender, perepetualDealID, msg.value);
    }

    function withdraw(uint256 perepetualDealID, uint256 amount) external {
        if (balances[msg.sender][perepetualDealID] < amount) revert InsufficientFunds();

        balances[msg.sender][perepetualDealID] -= amount;

        sFilToken.burn(msg.sender, amount);

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed.");

        emit Withdrawal(msg.sender, perepetualDealID, amount);
    }

    function createDealProposal(uint256 _time, uint256 _numberOfReplicas, uint256 _price) external payable {
        perpetualDealClients[perepetualDealID] = msg.sender;
        
        emit PerpetualDealCreated(msg.sender, perpetualDealID);
        
        perepetualDealID++;
    }
}
