// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SolverDeployer {
    address public solver;

    function deploy(bytes memory _code) public returns (address addr) {
        assembly {
            // https://cryptoguide.dev/post/solidity-assembly-guide/#important-functions-and-opcodes%E2%80%A6
            // add(_code, 0x20) skip the first 32 bytes because the first 32 bytes contains the _code length
            // mload(_code) load _code length in to memory(see above)
            addr := create(0, add(_code, 0x20), mload(_code))
        }
        require(addr != address(0), "deploy failed");
        solver = addr;
    }

    function getSize() public view returns (uint256 size) {
        address _solver = address(solver);
        assembly {
            size := extcodesize(_solver)
        }
    }

    function getSignature() public pure returns (bytes4) {
        return bytes4(keccak256("whatIsTheMeaningOfLife()"));
    }

    function getData() public returns (uint256 value) {
        bytes32 payload;
        (, bytes memory data) = solver.call(abi.encodePacked(getSignature()));
        assembly {
            payload := mload(add(data, 0x20))
        }
        value = uint256(payload);
    }
}
