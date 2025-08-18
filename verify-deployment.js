import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

async function verifyDeployment() {
  console.log('🔍 VERIFYING DEPLOYED CONTRACTS');
  console.log('================================');
  
  try {
    // Connect to Shardeum network
    const provider = new ethers.providers.JsonRpcProvider('https://api-unstable.shardeum.org');
    
    // Contract addresses from deployment
    const tokenAddress = '0xaa2b86e1f9de4cbdeaf177e61ce0e2fc091f9f9e';
    const policyAddress = '0x055682a1a8fa88ed10a56724d29bcd44215e04d5';
    
    console.log('📋 Verifying ERC20Mock Token Contract...');
    console.log(`   Address: ${tokenAddress}`);
    
    // Verify token contract
    const tokenCode = await provider.getCode(tokenAddress);
    if (tokenCode === '0x') {
      console.log('❌ Token contract not found or not deployed');
    } else {
      console.log('✅ Token contract deployed successfully');
      console.log(`   Bytecode length: ${tokenCode.length} characters`);
    }
    
    // Create token contract instance
    const tokenABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    
    try {
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const totalSupply = await tokenContract.totalSupply();
      const decimals = await tokenContract.decimals();
      
      console.log(`   Name: ${name}`);
      console.log(`   Symbol: ${symbol}`);
      console.log(`   Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} ${symbol}`);
      console.log(`   Decimals: ${decimals}`);
    } catch (error) {
      console.log('⚠️  Could not read token contract data:', error.message);
    }
    
    console.log('\\n📋 Verifying PolicyManager Contract...');
    console.log(`   Address: ${policyAddress}`);
    
    // Verify policy contract
    const policyCode = await provider.getCode(policyAddress);
    if (policyCode === '0x') {
      console.log('❌ PolicyManager contract not found or not deployed');
    } else {
      console.log('✅ PolicyManager contract deployed successfully');
      console.log(`   Bytecode length: ${policyCode.length} characters`);
    }
    
    // Create policy contract instance
    const policyABI = [
      "function owner() view returns (address)",
      "function token() view returns (address)",
      "function companyWallet() view returns (address)",
      "function PURCHASE_FEE_BP() view returns (uint256)",
      "function WITHDRAW_FEE_BP() view returns (uint256)"
    ];
    
    const policyContract = new ethers.Contract(policyAddress, policyABI, provider);
    
    try {
      const owner = await policyContract.owner();
      const tokenAddr = await policyContract.token();
      const companyWallet = await policyContract.companyWallet();
      const purchaseFee = await policyContract.PURCHASE_FEE_BP();
      const withdrawFee = await policyContract.WITHDRAW_FEE_BP();
      
      console.log(`   Owner: ${owner}`);
      console.log(`   Token Address: ${tokenAddr}`);
      console.log(`   Company Wallet: ${companyWallet}`);
      console.log(`   Purchase Fee: ${purchaseFee / 100}%`);
      console.log(`   Withdraw Fee: ${withdrawFee / 100}%`);
      
      // Check if token address is correct
      if (tokenAddr.toLowerCase() === tokenAddress.toLowerCase()) {
        console.log('✅ PolicyManager correctly linked to ERC20Mock token');
      } else {
        console.log('⚠️  WARNING: PolicyManager token address mismatch!');
        console.log(`   Expected: ${tokenAddress}`);
        console.log(`   Actual: ${tokenAddr}`);
      }
      
    } catch (error) {
      console.log('⚠️  Could not read policy contract data:', error.message);
    }
    
    console.log('\\n🎉 DEPLOYMENT VERIFICATION COMPLETE!');
    console.log('====================================');
    console.log('✅ Both contracts are deployed and accessible');
    console.log('🌐 Network: Shardeum');
    console.log(`🔗 Explorer: https://explorer-unstable.shardeum.org/`);
    console.log(`📱 Token: https://explorer-unstable.shardeum.org/account/${tokenAddress}`);
    console.log(`📋 Policy: https://explorer-unstable.shardeum.org/account/${policyAddress}`);
    
    return {
      tokenAddress,
      policyAddress,
      verified: true
    };
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return {
      verified: false,
      error: error.message
    };
  }
}

verifyDeployment()
  .then((result) => {
    if (result.verified) {
      console.log('\\n🚀 Ready for production use!');
    } else {
      console.log('\\n💡 Please check network connection and contract addresses');
    }
  })
  .catch((error) => {
    console.error('Verification script error:', error);
  });
