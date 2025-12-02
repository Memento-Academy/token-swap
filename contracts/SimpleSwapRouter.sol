// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SimpleSwapRouter
 * @dev A simple token swap router for testing gasless swaps
 * This is a simplified version for demo purposes - NOT for production use
 */
contract SimpleSwapRouter {
    using SafeERC20 for IERC20;

    // Events
    event Swap(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    // Simple 1:1 swap rate for demo purposes
    // In production, you'd integrate with a DEX like Uniswap
    uint256 public constant SWAP_RATE = 1e18; // 1:1 ratio

    /**
     * @dev Swap tokens with a simple 1:1 ratio
     * @param tokenIn Address of token to swap from
     * @param tokenOut Address of token to swap to
     * @param amountIn Amount of tokenIn to swap
     * @param amountOutMin Minimum amount of tokenOut expected (slippage protection)
     */
    function swapExactTokensForTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) external returns (uint256 amountOut) {
        require(tokenIn != tokenOut, "Cannot swap same token");
        require(amountIn > 0, "Amount must be greater than 0");

        IERC20 tokenInContract = IERC20(tokenIn);
        IERC20 tokenOutContract = IERC20(tokenOut);

        // Calculate output amount (accounting for different decimals)
        uint8 decimalsIn = _getDecimals(tokenIn);
        uint8 decimalsOut = _getDecimals(tokenOut);
        
        // Calculate output amount based on requested rate: 1 PEPE = 0.000011 USDC
        // PEPE has 18 decimals, USDC has 6 decimals
        // 1 PEPE (1e18 units) = 0.000011 USDC (11 units)
        
        if (decimalsIn == 18 && decimalsOut == 6) {
            // PEPE -> USDC
            // 1e18 in -> 11 out
            amountOut = (amountIn * 11) / 1e18;
        } else if (decimalsIn == 6 && decimalsOut == 18) {
            // USDC -> PEPE
            // 11 in -> 1e18 out
            amountOut = (amountIn * 1e18) / 11;
        } else {
            // Default 1:1 logic for other pairs
            if (decimalsIn > decimalsOut) {
                amountOut = amountIn / (10 ** (decimalsIn - decimalsOut));
            } else if (decimalsOut > decimalsIn) {
                amountOut = amountIn * (10 ** (decimalsOut - decimalsIn));
            } else {
                amountOut = amountIn;
            }
        }

        require(amountOut >= amountOutMin, "Insufficient output amount");

        // Transfer tokenIn from user to this contract
        tokenInContract.safeTransferFrom(msg.sender, address(this), amountIn);

        // Transfer tokenOut from this contract to user
        require(
            tokenOutContract.balanceOf(address(this)) >= amountOut,
            "Insufficient liquidity"
        );
        tokenOutContract.safeTransfer(msg.sender, amountOut);

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);

        return amountOut;
    }

    /**
     * @dev Add liquidity to the router (for testing)
     * @param token Token address
     * @param amount Amount to add
     */
    function addLiquidity(address token, uint256 amount) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    /**
     * @dev Get token decimals
     */
    function _getDecimals(address token) internal view returns (uint8) {
        // Try to get decimals, default to 18 if not available
        (bool success, bytes memory data) = token.staticcall(
            abi.encodeWithSignature("decimals()")
        );
        if (success && data.length >= 32) {
            return abi.decode(data, (uint8));
        }
        return 18;
    }

    /**
     * @dev Get router's balance of a token
     */
    function getReserve(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
