// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPEPE
 * @dev Mock PEPE token for testing purposes (18 decimals)
 */
contract MockPEPE is ERC20, Ownable {
    constructor() ERC20("Mock PEPE", "PEPE") Ownable(msg.sender) {
        // Mint initial supply to deployer (1 billion tokens)
        _mint(msg.sender, 1_000_000_000 * 10**decimals());
    }

    /**
     * @dev Mint tokens to a specific address (only owner)
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Allows anyone to mint tokens for testing
     * @param amount Amount of tokens to mint
     */
    function faucet(uint256 amount) external {
        require(amount <= 100_000_000 * 10**decimals(), "Max 100M tokens per faucet");
        _mint(msg.sender, amount);
    }
}
