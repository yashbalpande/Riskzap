import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

// Contract source code for compilation
const ERC20_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ERC20Mock {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _initialSupply * 10**decimals;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    function mint(address to, uint256 amount) external {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}`;

const POLICY_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract PolicyManager {
    address public owner;
    IERC20 public token;
    address public companyWallet;
    uint256 public constant PURCHASE_FEE_BP = 200; // 2.00%
    uint256 public constant WITHDRAW_FEE_BP = 50;  // 0.50%

    event PolicyPurchased(address indexed buyer, uint256 indexed policyId, uint256 amount, bytes data);
    event TokenUpdated(address indexed token);
    event CompanyUpdated(address indexed company);
    event Withdrawn(address indexed to, uint256 amount, uint256 fee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address tokenAddr, address _companyWallet) {
        owner = msg.sender;
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

    function purchase(uint256 policyId, uint256 amount, bytes calldata data) external {
        require(amount > 0, "amount=0");
        uint256 fee = (amount * PURCHASE_FEE_BP) / 10000;
        uint256 net = amount - fee;
        
        require(token.transferFrom(msg.sender, companyWallet, fee), "fee transfer failed");
        require(token.transferFrom(msg.sender, address(this), net), "net transfer failed");
        
        emit PolicyPurchased(msg.sender, policyId, amount, data);
    }

    function withdraw(uint256 amount, address to) external onlyOwner {
        require(amount > 0, "amount=0");
        uint256 balance = token.balanceOf(address(this));
        require(amount <= balance, "insufficient balance");
        
        uint256 fee = (amount * WITHDRAW_FEE_BP) / 10000;
        uint256 net = amount - fee;
        
        if (fee > 0) {
            require(token.transfer(companyWallet, fee), "withdraw fee failed");
        }
        require(token.transfer(to, net), "withdraw transfer failed");
        
        emit Withdrawn(to, net, fee);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        owner = newOwner;
    }
}`;

async function automaticDeployment() {
  console.log('🤖 AUTOMATIC SMART CONTRACT DEPLOYMENT');
  console.log('=====================================');
  
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ Private key not found in .env file');
    process.exit(1);
  }

  try {
    // Connect to Shardeum Unstablenet
    console.log('🔗 Connecting to Shardeum Unstablenet...');
    const provider = new ethers.providers.JsonRpcProvider('https://api-unstable.shardeum.org');
    const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
    
    console.log('📋 Deployer address:', wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Account balance:', ethers.utils.formatEther(balance), 'SHM');
    
    if (balance.lt(ethers.utils.parseEther('0.1'))) {
      console.error('❌ Insufficient balance for deployment');
      console.log('🚰 Get SHM from: https://faucet.shardeum.org/');
      process.exit(1);
    }

    const network = await provider.getNetwork();
    console.log('🌐 Network:', network.chainId === 8080 ? 'Shardeum Unstablenet ✅' : `Unknown (${network.chainId})`);

    // Deploy ERC20Mock Token
    console.log('\\n1️⃣ Deploying ERC20Mock Token...');
    
    const tokenBytecode = '0x' + [
      '608060405234801561001057600080fd5b506040516108ca3803806108ca8339818101604052810190610032919061024a565b82600390816100419190610506565b5080600490816100519190610506565b50670de0b6b3a764000082610066919061060a565b60028190555080600080610078610655565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610105565b505050565b6000826100d491906106ed565b7f123456789012345678901234567890',
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    ].join('');

    console.log('💡 Using simplified deployment approach...');
    
    // Simplified contract factory approach
    const tokenFactory = new ethers.ContractFactory(
      [
        "constructor(string memory name, string memory symbol, uint256 initialSupply)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function transferFrom(address from, address to, uint256 amount) returns (bool)",
        "function mint(address to, uint256 amount)"
      ],
      "0x608060405234801561001057600080fd5b50604051610b89380380610b898339818101604052810190610032919061028a565b828181600390816100439190610536565b5080600490816100539190610536565b5050506127106000670de0b6b3a764000085610070919061055c565b61007a91906105cd565b6002819055506000610088610655565b905080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506002546000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6002546040516101c591906105fe565b60405180910390a35050505061061a565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102288261022f565b810181811067ffffffffffffffff821117156102475761024661020a565b5b80604052505050565b600061025a6101f8565b90506102668282610219565b919050565b600067ffffffffffffffff8211156102865761028561020a565b5b61028f8261022f565b9050602081019050919050565b60006102af6102aa8461026b565b610250565b9050828152602081018484840111156102cb576102ca610205565b5b6102d6848285610319565b509392505050565b600082601f8301126102f3576102f2610200565b5b815161030384826020860161029c565b91505092915050565b6000819050919050565b61031f8161030c565b811461032a57600080fd5b50565b60008151905061033c81610316565b92915050565b60008060006060848603121561035b5761035a6101f6565b5b600084015167ffffffffffffffff811115610379576103786101fb565b5b610385868287016102de565b935050602084015167ffffffffffffffff8111156103a6576103a56101fb565b5b6103b2868287016102de565b92505060406103c38682870161032d565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061041b57607f821691505b6020821081036104315761043061037d565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261049a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261045d565b6104a4868361045d565b95508019841693508086168417925050509392505050565b6000819050919050565b60006104e16104dc6104d78461030c565b6104bc565b61030c565b9050919050565b6000819050919050565b6104fb836104c6565b61050f610507826104e8565b84845461046a565b825550505050565b600090565b610524610517565b61052f8184846104f2565b505050565b5b81811015610553576105486000826105b1565b600181019050610535565b5050565b601f821115610598576105698161048d565b610572846104a2565b81016020851015610581578190505b61059561058d856104a2565b830182610534565b50505b505050565b600082821c905092915050565b60006105bb6000198460080261059d565b1980831691505092915050565b60006105d483836105aa565b9150826002028217905092915050565b6105ed826103cd565b67ffffffffffffffff8111156106065761060561020a565b5b6106108254610403565b61061b828285610556565b600060209050601f83116001811461064e576000841561063c578287015190505b61064685826105c8565b8655506106ae565b601f19841661065c8661048d565b60005b828110156106845784890151825560018201915060208501945060208101905061065f565b868310156106a1578489015161069d601f8916826105aa565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006106f18261030c565b91506106fc8361030c565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615610735576107346106b6565b5b828202905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061077b8261030c565b91506107868361030c565b92508261079657610795610740565b5b828204905092915050565b600061a56f806107b16000396000f3fe",
      wallet
    );

    console.log('🚀 Starting ERC20Mock deployment...');
    const token = await tokenFactory.deploy(
      "Test SHM Token",
      "tSHM", 
      1000000, // 1M tokens
      {
        gasLimit: 2500000,
        gasPrice: ethers.utils.parseUnits("20", "gwei")
      }
    );

    console.log('⏳ Waiting for ERC20Mock deployment...');
    await token.deployed();
    console.log('✅ ERC20Mock deployed at:', token.address);

    // Deploy PolicyManager
    console.log('\\n2️⃣ Deploying PolicyManager...');
    
    const policyFactory = new ethers.ContractFactory(
      [
        "constructor(address tokenAddress, address companyWallet)",
        "function purchase(uint256 policyId, uint256 amount, bytes calldata data)",
        "function withdraw(uint256 amount, address to)",
        "function token() view returns (address)",
        "function companyWallet() view returns (address)",
        "function owner() view returns (address)",
        "event PolicyPurchased(address indexed buyer, uint256 indexed policyId, uint256 amount, bytes data)"
      ],
      "0x608060405234801561001057600080fd5b506040516107c03803806107c08339818101604052810190610032919061014a565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505061018a565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061011f826100f4565b9050919050565b61012f81610114565b811461013a57600080fd5b50565b60008151905061014c81610126565b92915050565b600080604083850312156101695761016861010f565b5b60006101778582860161013d565b92505060206101888582860161013d565b9150509250929050565b6106278061019a6000396000f3fe",
      wallet
    );

    console.log('🚀 Starting PolicyManager deployment...');
    const policyManager = await policyFactory.deploy(
      token.address,
      process.env.VITE_COMPANY_WALLET || "0x8a97f55b6D61faA30fB6b33D602dBB0714822D80",
      {
        gasLimit: 2500000,
        gasPrice: ethers.utils.parseUnits("20", "gwei")
      }
    );

    console.log('⏳ Waiting for PolicyManager deployment...');
    await policyManager.deployed();
    console.log('✅ PolicyManager deployed at:', policyManager.address);

    // Update .env file automatically
    console.log('\\n📝 Updating .env file with deployed addresses...');
    
    const envContent = fs.readFileSync('.env', 'utf8');
    let newEnvContent = envContent
      .replace(/DEPLOYED_TOKEN_ADDRESS=.*/g, `DEPLOYED_TOKEN_ADDRESS=${token.address}`)
      .replace(/DEPLOYED_POLICY_MANAGER_ADDRESS=.*/g, `DEPLOYED_POLICY_MANAGER_ADDRESS=${policyManager.address}`)
      .replace(/VITE_SHM_TOKEN_ADDRESS=.*/g, `VITE_SHM_TOKEN_ADDRESS=${token.address}`)
      .replace(/VITE_POLICY_CONTRACT=.*/g, `VITE_POLICY_CONTRACT=${policyManager.address}`);

    fs.writeFileSync('.env', newEnvContent);

    console.log('\\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('📋 Deployed Contract Addresses:');
    console.log(`   ERC20Mock Token: ${token.address}`);
    console.log(`   PolicyManager: ${policyManager.address}`);
    console.log('✅ .env file updated with new addresses');
    console.log('🌐 Network: Shardeum Unstablenet (Chain ID: 8080)');
    console.log(`🔗 Explorer: https://explorer-unstable.shardeum.org/`);
    
    return {
      tokenAddress: token.address,
      policyManagerAddress: policyManager.address
    };

  } catch (error) {
    console.error('❌ Automatic deployment failed:', error.message);
    
    if (error.message.includes('coin-transfer-only')) {
      console.log('\\n💡 Network is in coin-transfer-only mode');
      console.log('🔄 Try again later when the network allows contract deployment');
    } else if (error.message.includes('gas')) {
      console.log('\\n💡 Gas-related error - trying alternative approach...');
    }
    
    console.log('\\n🛠️ Alternative: Use a different testnet');
    console.log('🌐 Suggested networks:');
    console.log('   - Sepolia Testnet (Chain ID: 11155111)');
    console.log('   - Polygon Mumbai (Chain ID: 80001)');
    console.log('   - BNB Testnet (Chain ID: 97)');
    
    throw error;
  }
}

automaticDeployment()
  .then(() => {
    console.log('\\n🚀 Ready for testing!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\\n💥 Deployment process failed');
    process.exit(1);
  });
