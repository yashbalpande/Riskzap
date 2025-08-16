// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolicyManager is Ownable {
    IERC20 public token;
    address public companyWallet;

    event PolicyPurchased(address indexed buyer, uint256 indexed policyId, uint256 amount, bytes data);
    event TokenUpdated(address indexed token);
    event CompanyUpdated(address indexed company);

    constructor(address tokenAddr, address _companyWallet) {
        token = IERC20(tokenAddr);
        companyWallet = _companyWallet;
    }

    function setToken(address tokenAddr) external onlyOwner {
        token = IERC20(tokenAddr);
        emit TokenUpdated(tokenAddr);
    }

    function setCompanyWallet(address _companyWallet) external onlyOwner {
        companyWallet = _companyWallet;
        emit CompanyUpdated(_companyWallet);
    }

    // Buyer must first approve this contract for `amount` tokens.
    function purchase(uint256 policyId, uint256 amount, bytes calldata data) external {
        require(amount > 0, "amount=0");
        bool ok = token.transferFrom(msg.sender, companyWallet, amount);
        require(ok, "transfer failed");
        emit PolicyPurchased(msg.sender, policyId, amount, data);
    }
}
