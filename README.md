# My Enthernaut project

This project is my learning environment to study how to hack Solidity smart contracts. I've attempted to solve all the challenges in the OpenZeppelin Ethernaut challenge. Please try to do it by yourself. I just created this repo
as personal notes.

Things that I learned:

1. Hello Ethernaut - Not a big deal. You only need to know how to interact with the contract. (files not included in this repo).

2. Fallback - Just know how wei, gwei, ethers works, and fallback function. (I included the file but not the attack file, I used the remix editor).

3. Fallout -I learned that before version [0.4.22](https://github.com/ethereum/solidity/blob/develop/Changelog.md#0422-2018-04-16) constructors have the same contract name, which caused some problems in the past when people changed the contract name and forgot the rename the constructor.

4. Coin Flip - I learned how to use another contract to predict the state of the target contract and how a contract calls another contract function.

5. Telephone - I learned that `tx.origin` changes when the contract is called by another contract, `tx.origin` will be the victim's address (while msg.sender will be the malicious contract's address).

6. Token - I learned about `uint` overflow.

7. Delegation -The usage of `delegatecall` is particularly risky and has been used as an attack vector on multiple historic hacks. With it, your contract is practically saying "here, -other contracts- or -other library-, do whatever you want with my state". Delegates have complete access to your contract's state. e.g https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7/

8. Force - I learned one of the ways to force the transfer of funds to a contract. One of the ways is to create another contract and `selfdestruct` with the address of the target contract. source: https://solidity-by-example.org/hacks/self-destruct/

9. Vaull - I learned a lot about Ethereum storage layout here: https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-12-reading-the-storage/topic/the-storage-layout/

10. King - I learned how a contract fallback function can be used to hack the state in another contract.

11. Re-entrancy - I learned how Re-entrancy works and how it can be used to hack contracts.

12. Elevator - I learned Why/when I should use pure and view functions.

13. Privacy - I learned more about the Ethereum storage layout and how it handles an array of bytes.

14. Gatekeeper One - This one was difficult. My workflow to solve was the following:
    The first gate was easy. You should make sure to call the target contract from another contract.
    The second gate was trickier. The only way that I've found to pass this gate was by brute-forcing the gas Limit because the Remix Lodom environment gives a different fee amount than the Hardhat node and Goerli testnet.
    The third gate was relatively easy because You need to know about `uint` overflow, and how bytes were converted to uint in Solidity.

15. Gatekeeper Two - My workflow to solve this challenge was:
    The first gate is the same as Gatekeeper One.
    Second Gate, I googled a little bit and found that `extcodesize` returns 0 when the function was called from a contract constructor. e.g https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/extcodesize-checks/
    The third gate was difficult. But, at end of the day, It was just a bitwise mask operation.

16. NaughtCoin - It was easy. Make sure You know how ERC20 allowance works.

17. Preservation -This example demonstrates why the library keyword should be used for building libraries, as it prevents the libraries from storing and accessing state variables.

18. Recovery -I solved this in a different way than the intended solution. I took a look into the transactions in the network and find the contract address that was used to solve the challenge. But the correct way to solve this should be calculate the contract address by calculating keccak256(address, nonce) where the address is the address of the contract (or ethereum address that created the transaction) and nonce is the number of contracts the spawning contract has created (or the transaction nonce, for regular transactions).

19. MagicNumber - In order to solve this challange it was necessary learn about EVM asssembly
    sources: https://mirror.xyz/0xB38709B8198d147cc9Ff9C133838a044d78B064B/Hh69VJWM5eiFYFINxYWrIYWcRRtPm8tw3VFjpdpx6T8
    after that I coded a yul file that run the initial contract init and the runtime that returns 42. (see utils/Solver.yul)
    and compiled using solc compiler command: `solc --strict-assembly --optimize --optimize-runs 200 Solver.yul > dump`
    which generated the bytecode: 0x600a80600c6000396000f3fe602a60805260206080f3

20. Alien Codex - I learned about how the storage layout works in Solidity, and how to exploit uint overflow in older versions of Solidity.

21. Denial - This level demonstrates that external calls to unknown contracts can still create denial of service attack vectors if a fixed amount of gas is not specified.

22. Shop - It's unsafe to change the state based on external and untrusted contracts logic.

23. Dex - I learned that getting prices or any sort of data from any single source is a massive attack vector in smart contracts. It's better to use a decentralized oracle to get the price of an asset.

24. Dex Two - Same as Dex.

25. Puzzle Wallet - I learned about storage collisions, datacall bytes, arrays of bytes and how msg.sender and msg.value behave in the delegatecall.

26. Motorbike - O learned about how storage behaves in UUPS proxies.

27. Double Entry Point - I just follow through the code and found the vulnerability by using the legacy token.

28. Good Samaritan - I used a custom error to trigger the transfer of funds.

29. Gatekeeper Three - Not a big deal, I just followed the code and found the vulnerability.

30. Switch - This one was tricky. I learned about how to use abi.encodePacked and abi.encode to assembly a calldata, and how bytes are shapped in a calldata.
