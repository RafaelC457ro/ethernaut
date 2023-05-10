// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/DoubleEntryPoint.sol";
import "hardhat/console.sol";

contract DoubleEntryPointAttacker is IDetectionBot {
    Forta public forta;

    constructor(address _forta) {
        forta = Forta(_forta);
    }

    function handleTransaction(address user, bytes calldata) external override {
        forta.raiseAlert(user);
    }
}
