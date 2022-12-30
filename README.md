# My Enthernaut project

This project is my learning environment to study how to hack Solidity smart contracts. I've attempted to solve all the challenges in the OpenZeppelin Ethernaut challenge. Please try to do it by yourself. I just created this repo
as personal notes.

Things that I learned:

1. Hello Ethernaut
   Not a big deal. You only need to know how to interact with the contract. (files not included in this repo).

2. Fallback
   Just know how wei, gwei, ethers works, and fallback function. (I included the file but not the attack file, I used the remix editor).

3. Fallout
   I learned that before version [0.4.22](https://github.com/ethereum/solidity/blob/develop/Changelog.md#0422-2018-04-16) constructors have the same contract name, which caused some problems in the past
   when people changed the contract name and forgot the rename the constructor.

4. Coin Flip
   I learned how to use a another contract to predict the state of the target contract and how a contract call another contract function.

5. Telephone
   I learned that `tx.origin` changes when the contract is called by another contract, `tx.origin` will be the victim's address (while msg.sender will be the malicious contract's address).

6. Token
   I learned abount `uint` overflow basically.

7. Delegation
   Usage of delegatecall is particularly risky and has been used as an attack vector on multiple historic hacks. With it, your contract is practically saying "here, -other contract- or -other library-, do whatever you want with my state". Delegates have complete access to your contract's state. e.g https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7/

8. Force
   I learned that one of the way to force transfer funds to a contract is created another contract and selfdestruct wiht the address of the target contract. source: https://solidity-by-example.org/hacks/self-destruct/

9. Vault
   I learnet a lot about Ethereum storage layout more here: https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-12-reading-the-storage/topic/the-storage-layout/

10. King
    I learned how a contract fallback function can be used to hack the state in another contract.

11. Re-entrancy
    I learned how Re-entrancy works and how it can be used to hack contracts.

12. Elevator
    Why use pure and view functions

13. Privacy
    More about the Ethereum storage layout and how it handle array of bytes
