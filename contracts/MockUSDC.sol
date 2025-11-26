// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing purposes (6 decimals like real USDC)
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint initial supply to deployer (1 million USDC)
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    /**
     * @dev Override decimals to match real USDC (6 decimals)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
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
        require(amount <= 1000 * 10**decimals(), "Max 1000 USDC per faucet");
        _mint(msg.sender, amount);
    }
}
