import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

async function deployToAlternativeTestnet() {
  console.log('🚀 Alternative Testnet Deployment');
  
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ Private key not found in .env file');
    return;
  }

  // Alternative testnets (since Shardeum is in coin-transfer-only mode)
  const networks = [
    {
      name: 'Sepolia',
      rpc: 'https://rpc.sepolia.org',
      chainId: 11155111,
      faucet: 'https://faucet.sepolia.dev/'
    },
    {
      name: 'Polygon Mumbai',
      rpc: 'https://rpc-mumbai.maticvigil.com',
      chainId: 80001,
      faucet: 'https://faucet.polygon.technology/'
    },
    {
      name: 'BNB Smart Chain Testnet',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      faucet: 'https://testnet.bnbchain.org/faucet-smart'
    }
  ];

  for (const network of networks) {
    try {
      console.log(`\n🔗 Trying ${network.name}...`);
      const provider = new ethers.providers.JsonRpcProvider(network.rpc);
      const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
      
      console.log('📋 Deployer address:', wallet.address);
      
      const balance = await provider.getBalance(wallet.address);
      console.log('💰 Current balance:', ethers.utils.formatEther(balance), 'ETH');
      
      if (balance.lt(ethers.utils.parseEther('0.01'))) {
        console.log(`❌ Insufficient balance on ${network.name}`);
        console.log(`🚰 Get testnet tokens from: ${network.faucet}`);
        continue;
      }

      // Check network
      const networkInfo = await provider.getNetwork();
      console.log('🌐 Connected to:', networkInfo.name, 'Chain ID:', networkInfo.chainId);

      if (networkInfo.chainId !== network.chainId) {
        console.log(`⚠️ Chain ID mismatch. Expected ${network.chainId}, got ${networkInfo.chainId}`);
        continue;
      }

      console.log(`✅ ${network.name} is ready for deployment!`);
      console.log('📝 To deploy your contracts:');
      console.log('1. Copy your contract code to Remix IDE');
      console.log('2. Connect MetaMask to this network');
      console.log('3. Deploy contracts manually');
      console.log('');
      console.log(`Network Details for MetaMask:`);
      console.log(`  Name: ${network.name}`);
      console.log(`  RPC URL: ${network.rpc}`);
      console.log(`  Chain ID: ${network.chainId}`);
      console.log(`  Currency Symbol: ETH (or MATIC for Polygon)`);
      
      return true;

    } catch (error) {
      console.log(`❌ Failed to connect to ${network.name}:`, error.message);
      continue;
    }
  }

  console.log('\n❌ Could not connect to any alternative testnet');
  console.log('💡 Recommendation: Use Remix IDE with Sepolia testnet');
}

deployToAlternativeTestnet()
  .then(() => {
    console.log('\n✅ Network check completed');
  })
  .catch((error) => {
    console.error('\n❌ Network check failed:', error.message);
  });
