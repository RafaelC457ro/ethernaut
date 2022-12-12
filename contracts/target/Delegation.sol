// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Delegate {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function pwn() public {
        console.log("pwn");
        console.log(msg.sender);
        owner = msg.sender;
    }
}

contract Delegation {
    address public owner;
    Delegate delegate;

    constructor(address _delegateAddress) {
        delegate = Delegate(_delegateAddress);
        owner = msg.sender;
    }

    fallback() external {
        console.log(msg.sender);
        (bool result, ) = address(delegate).delegatecall(msg.data);
        console.log(result);
        if (result) {
            this;
        }
    }
}
