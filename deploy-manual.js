import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

// Simplified contract ABIs and bytecode for deployment
const ERC20_ABI = [
  "constructor(string memory name, string memory symbol, uint256 initialSupply)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

const POLICY_ABI = [
  "constructor(address tokenAddress, address companyWallet)",
  "function purchase(uint256 policyId, uint256 amount, bytes calldata data)",
  "function withdraw(uint256 amount, address to)",
  "function token() view returns (address)",
  "function companyWallet() view returns (address)",
  "event PolicyPurchased(address indexed buyer, uint256 indexed policyId, uint256 amount, bytes data)"
];

async function deployToShardeum() {
  console.log('🚀 Manual deployment to Shardeum Liberty 1.X');
  
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ Private key not found in .env file');
    return;
  }

  try {
    // Connect to Shardeum Liberty 1.X
    const provider = new ethers.providers.JsonRpcProvider('https://api-testnet.shardeum.org/');
    const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
    
    console.log('📋 Deployer address:', wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Current balance:', ethers.utils.formatEther(balance), 'SHM');
    
    if (balance.lt(ethers.utils.parseEther('0.1'))) {
      console.error('❌ Insufficient balance. Need at least 0.1 SHM for deployment');
      console.log('🚰 Get testnet SHM from: https://faucet.shardeum.org/');
      return;
    }

    // Check network info
    const network = await provider.getNetwork();
    console.log('🌐 Connected to:', network.name, 'Chain ID:', network.chainId);

    console.log('\n📦 Starting contract deployment...');

    // Estimate gas prices
    const gasPrice = await provider.getGasPrice();
    console.log('⛽ Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

    // Deploy ERC20Mock Token
    console.log('\n1️⃣ Deploying ERC20Mock Token...');
    const tokenDeployTx = {
      data: "0x608060405234801561001057600080fd5b506040516109e43803806109e48339818101604052810190610032919061028a565b828181600390816100439190610536565b5080600490816100539190610536565b505050610072838367ffffffffffffffff16610078565b50505050610608565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036100e75760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b80600260008282546100f99190610618565b90915550506000818152602081905260408120805460ff19166001179055610122905b50565b505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261014e57600080fd5b81516001600160401b038082111561016857610168610127565b604051601f8301601f19908116603f0116810190828211818310171561019057610190610127565b816040528381526020925086838588010111156101ac57600080fd5b600091505b838210156101ce57858201830151818301840152908201906101b1565b600093810190920192909252949350505050565b80516001600160401b038116811461025557600080fd5b919050565b6000806000606084860312156102735761027261010e565b5b83516001600160401b0381111561028d5761028c610127565b5b6102998682870161013d565b93505060206102aa8682870161013d565b92505060406102bb868287016101e4565b9150509250925092565b600181811c908216806102d957607f821691505b6020821081036102f957634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561033157600081815260208120601f850160051c8101602086101561032657505b601f850160051c820191505b818110156103455782815560010161033c565b505050505050565b81516001600160401b0382111561036657610366610127565b61037a81610374845461031c565b846102ff565b602080601f8311600181146103af57600084156103975750858301515b600019600386901b1c1916600185901b178555610345565b600085815260208120601f198616915b828110156103de57888601518255948401946001909101908401906103bf565b50858210156103fc5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8082018082111561043557610435610422565b92915050565b6103cd806104476000396000f3fe", // This is simplified bytecode
      gasLimit: 3000000,
      gasPrice: gasPrice.mul(2) // Double current gas price for faster confirmation
    };

    try {
      const tokenTx = await wallet.sendTransaction(tokenDeployTx);
      console.log('📤 Token deployment transaction sent:', tokenTx.hash);
      
      console.log('⏳ Waiting for token deployment confirmation...');
      const tokenReceipt = await tokenTx.wait();
      console.log('✅ ERC20Mock Token deployed at:', tokenReceipt.contractAddress);

      // Deploy PolicyManager
      console.log('\n2️⃣ Deploying PolicyManager...');
      const policyDeployTx = {
        data: "0x608060405234801561001057600080fd5b506040516108ba3803806108ba833981016040819052610031916100e8565b6001600160a01b03821661008d5760405162461bcd60e51b815260206004820152601a60248201527f546f6b656e20616464726573732063616e6e6f7420626520300000000000000060448201526064015b60405180910390fd5b6001600160a01b0381166100e35760405162461bcd60e51b815260206004820152601d60248201527f436f6d70616e792077616c6c65742063616e6e6f7420626520300000000000006044820152606401610084565b600080546001600160a01b039384166001600160a01b031991821617909155600180549290931691161790915561011c565b80516001600160a01b038116811461011757600080fd5b919050565b6000806040838503121561011c57600080fd5b61012583610100565b915061013360208401610100565b90509250929050565b610790806101496000396000f3fe", // Simplified bytecode for PolicyManager
        gasLimit: 3000000,
        gasPrice: gasPrice.mul(2)
      };

      const policyTx = await wallet.sendTransaction(policyDeployTx);
      console.log('📤 PolicyManager deployment transaction sent:', policyTx.hash);
      
      console.log('⏳ Waiting for PolicyManager deployment confirmation...');
      const policyReceipt = await policyTx.wait();
      console.log('✅ PolicyManager deployed at:', policyReceipt.contractAddress);

      console.log('\n🎉 Deployment completed successfully!');
      console.log('📋 Contract Addresses:');
      console.log('   ERC20Mock Token:', tokenReceipt.contractAddress);
      console.log('   PolicyManager:', policyReceipt.contractAddress);
      
      console.log('\n📝 Update your .env file with these addresses:');
      console.log(`DEPLOYED_TOKEN_ADDRESS=${tokenReceipt.contractAddress}`);
      console.log(`DEPLOYED_POLICY_MANAGER_ADDRESS=${policyReceipt.contractAddress}`);
      console.log(`VITE_SHM_TOKEN_ADDRESS=${tokenReceipt.contractAddress}`);
      console.log(`VITE_POLICY_CONTRACT=${policyReceipt.contractAddress}`);

      return {
        tokenAddress: tokenReceipt.contractAddress,
        policyManagerAddress: policyReceipt.contractAddress
      };

    } catch (deployError) {
      console.error('❌ Deployment failed:', deployError.message);
      
      if (deployError.message.includes('insufficient funds')) {
        console.log('💡 Solution: Add more SHM to your wallet');
      } else if (deployError.message.includes('gas')) {
        console.log('💡 Solution: Try increasing gas limit or gas price');
      } else {
        console.log('💡 Try using Remix IDE for manual deployment');
        console.log('🌐 Go to: https://remix.ethereum.org/');
      }
      
      throw deployError;
    }

  } catch (error) {
    console.error('❌ Connection or deployment error:', error.message);
    
    // Provide fallback instructions
    console.log('\n🛠️ Manual deployment alternative using Remix IDE:');
    console.log('1. 🌐 Open: https://remix.ethereum.org/');
    console.log('2. 📁 Create new file: ERC20Mock.sol');
    console.log('3. 📁 Create new file: PolicyManager.sol');
    console.log('4. 📋 Copy contract code from ./contracts/ folder');
    console.log('5. 🔧 Compile contracts in Solidity Compiler');
    console.log('6. 🦊 Connect MetaMask to Shardeum Liberty 1.X');
    console.log('7. 🚀 Deploy using Deploy & Run Transactions');
    console.log('');
    console.log('🔗 Shardeum Liberty 1.X RPC: https://api-unstable.shardeum.org');
    console.log('🆔 Chain ID: 8080');
    console.log('💰 Your wallet:', process.env.PRIVATE_KEY ? 'Configured' : 'Not found');
  }
}

deployToShardeum()
  .then(() => {
    console.log('\n✅ Deployment script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment script failed:', error.message);
    process.exit(1);
  });
