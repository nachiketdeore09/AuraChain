// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SoulToken is ERC20, Ownable {
    event TokensEarned(address indexed user, uint256 amount);
    event TokensUpdated(address indexed user, uint256 amount);

    IERC20 public pyusd;

    constructor(
        address initialOwner,
        address pyusdAddress
    ) ERC20("SoulToken", "SOUL") Ownable(initialOwner) {
        pyusd = IERC20(pyusdAddress);
        _mint(initialOwner, 1000 * 10);
    }

    function earnTokens() public {
        // Token earning logic

        _mint(msg.sender, 10);
        emit TokensEarned(msg.sender, 10);
        uint256 total = checkNoOfTokens(msg.sender) + 10;
        emit TokensUpdated(msg.sender, total);
    }

    function checkNoOfTokens(address user) public view returns (uint256) {
        return balanceOf(user);
    }

    function reduceTokens(uint256 token,uint256 amount) external {
        // Get the current balance of the user
        uint256 currentBalance = balanceOf(msg.sender);
        require(pyusd.balanceOf(msg.sender) >= amount, "Insufficient balance");
        // Check if the balance is less than the amount to reduce
        require(currentBalance >= token, "Insufficient balance");
        require(
            pyusd.transferFrom(msg.sender, owner() , amount),
            "Transaction Failed"
        );
        // Burn the specified amount of tokens from the user's balance
        _burn(msg.sender, token);
        // Emit the updated balance after burning tokens
        uint256 total = currentBalance - token;
        emit TokensUpdated(msg.sender, total);
    }
}
