// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/GatekeeperOne.sol";

contract GatekeeperOneAttacker {
    GatekeeperOne gatekeeper;

    constructor(address _gatekeeper) {
        gatekeeper = GatekeeperOne(_gatekeeper);
    }

    function attack(bytes8 _gateKey) public {
        gatekeeper.enter(_gateKey);
    }
}
