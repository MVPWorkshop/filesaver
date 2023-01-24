// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract sFil is ERC20 {
    constructor() ERC20("Staked FIL", "stFil") {}

    function donate() external payable {
        _mint(msg.sender, msg.value);
    }

    function withdraw() external {
        address temp = msg.sender;
        uint256 amount = balanceOf(temp);

        (bool success, ) = temp.call{value: amount}("");
        require(success, "Failed to send FIL");

        _burn(temp, amount);
    }
}
