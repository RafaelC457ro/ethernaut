// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MagicNum {
    address public solver;

    constructor() {}

    function setSolver(address _solver) public {
        // my validation
        bytes32 payload;
        uint256 size;
        assembly {
            size := extcodesize(_solver)
        }

        if (size > 10) {
            revert("size should equal and less then 10");
        }

        (, bytes memory data) = _solver.call(
            abi.encodePacked(bytes4(keccak256("whatIsTheMeaningOfLife()")))
        );
        assembly {
            payload := mload(add(data, 0x20))
        }

        if (
            payload !=
            0x000000000000000000000000000000000000000000000000000000000000002a // 42
        ) {
            revert("not valid");
        }
        // my validation end here

        solver = _solver;
    }

    /*
    ____________/\\\_______/\\\\\\\\\_____        
     __________/\\\\\_____/\\\///////\\\___       
      ________/\\\/\\\____\///______\//\\\__      
       ______/\\\/\/\\\______________/\\\/___     
        ____/\\\/__\/\\\___________/\\\//_____    
         __/\\\\\\\\\\\\\\\\_____/\\\//________   
          _\///////////\\\//____/\\\/___________  
           ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
            ___________\///_____\///////////////__
  */
}
