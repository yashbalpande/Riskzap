// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimplePolicyManager
 * @dev Simplified version for deployment testing
 */
contract SimplePolicyManager {
    address public owner;
    address public token;
    address public companyWallet;
    uint256 public constant PURCHASE_FEE_BP = 200; // 2.00% in basis points
    uint256 public constant WITHDRAW_FEE_BP = 50;  // 0.50% in basis points

    event PolicyPurchased(address indexed buyer, uint256 indexed policyId, uint256 amount, bytes data);
    event TokenUpdated(address indexed token);
    event CompanyUpdated(address indexed company);
    event Withdrawn(address indexed to, uint256 amount, uint256 fee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /**
     * @dev Constructor sets the token and company wallet addresses
     * @param tokenAddr Address of the ERC20 token to be used
     * @param _companyWallet Address where company fees will be sent
     */
    constructor(address tokenAddr, address _companyWallet) {
        owner = msg.sender;
        token = tokenAddr;
        companyWallet = _companyWallet;
    }

    function setToken(address tokenAddr) external onlyOwner {
        token = tokenAddr;
        emit TokenUpdated(tokenAddr);
    }

    function setCompanyWallet(address _companyWallet) external onlyOwner {
        companyWallet = _companyWallet;
        emit CompanyUpdated(_companyWallet);
    }

    function purchase(uint256 policyId, uint256 amount, bytes calldata data) external {
        require(amount > 0, "amount=0");
        // Simplified version - emit event only for now
        emit PolicyPurchased(msg.sender, policyId, amount, data);
    }

    function withdraw(uint256 amount, address to) external onlyOwner {
        require(amount > 0, "amount=0");
        // Simplified version - emit event only for now
        emit Withdrawn(to, amount, 0);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        owner = newOwner;
    }
}
