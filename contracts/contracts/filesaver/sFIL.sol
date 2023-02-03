// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './IsFIL.sol';

contract sFIL is ERC20, IsFIL {

    bool unwrapInitiated;
    uint balance;

    constructor() ERC20("Staked FIL", "sFIL") {}

    function wrap() external payable {

        _mint(msg.sender, msg.value);

        emit Wrap(msg.sender, msg.value);
    }

    function wrapForSomeone(address payable _someone) external payable {

        _mint(_someone, msg.value);

        emit Wrap(_someone, msg.value);
    }

    function unwrap(uint _amount) external {
       
        if(unwrapInitiated == true) { 
            require(false, "ERR: no, no... no reetrancy");
        }

        require(balanceOf(msg.sender) > _amount, "ERR: unsufficient funds!");

        unwrapInitiated = true;

        _burn(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "ERR: Transfer failed.");
        
        unwrapInitiated = false;

        emit UnWrap(msg.sender, _amount);
    }
}