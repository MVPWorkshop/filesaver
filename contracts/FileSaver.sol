// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./sFil.sol";

error InsufficientFunds();

contract FileSaver {
    mapping(address => mapping(uint64 => uint256)) public balances;
    sFil internal immutable sFilToken;

    event Deposit(address user, uint64 dealID, uint256 amount);
    event Withdrawal(address user, uint64 dealID, uint256 amount);

    constructor() {
        sFilToken = new sFil();
    }

    function deposit(uint64 dealID) external payable {
        if (msg.value <= 0) revert InsufficientFunds();

        sFilToken.mint(msg.sender, msg.value);

        balances[msg.sender][dealID] += msg.value;

        emit Deposit(msg.sender, dealID, msg.value);
    }

    function withdraw(uint64 dealID, uint256 amount) external {
        if (balances[msg.sender][dealID] < amount) revert InsufficientFunds();

        balances[msg.sender][dealID] -= amount;

        sFilToken.burn(msg.sender, amount);

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed.");

        emit Withdrawal(msg.sender, dealID, amount);
    }
}
