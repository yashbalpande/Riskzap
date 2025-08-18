import fs from 'fs';
import { ethers } from 'ethers';

// Function to update .env file with deployed contract addresses
function updateContractAddresses(tokenAddress, policyManagerAddress, network = 'Shardeum Unstablenet') {
  console.log('📝 Updating .env file with deployed contract addresses...');
  
  // Validate addresses
  if (!ethers.utils.isAddress(tokenAddress)) {
    throw new Error('Invalid token address');
  }
  
  if (!ethers.utils.isAddress(policyManagerAddress)) {
    throw new Error('Invalid policy manager address');
  }
  
  // Read current .env file
  let envContent = fs.readFileSync('.env', 'utf8');
  
  // Update contract addresses
  envContent = envContent
    .replace(/DEPLOYED_TOKEN_ADDRESS=.*/g, `DEPLOYED_TOKEN_ADDRESS=${tokenAddress}`)
    .replace(/DEPLOYED_POLICY_MANAGER_ADDRESS=.*/g, `DEPLOYED_POLICY_MANAGER_ADDRESS=${policyManagerAddress}`)
    .replace(/VITE_SHM_TOKEN_ADDRESS=.*/g, `VITE_SHM_TOKEN_ADDRESS=${tokenAddress}`)
    .replace(/VITE_POLICY_CONTRACT=.*/g, `VITE_POLICY_CONTRACT=${policyManagerAddress}`)
    .replace(/CONTRACTS_READY=.*/g, 'CONTRACTS_READY=true')
    .replace(/HACKATHON_MODE=.*/g, 'HACKATHON_MODE=false');
  
  // Add deployment info if not exists
  if (!envContent.includes('DEPLOYMENT_NETWORK=')) {
    envContent += `\n# Deployment Information\nDEPLOYMENT_NETWORK=${network}\nDEPLOYMENT_DATE=${new Date().toISOString()}\n`;
  }
  
  // Write updated .env file
  fs.writeFileSync('.env', envContent);
  
  console.log('✅ .env file updated successfully!');
  console.log(`📋 Token Address: ${tokenAddress}`);
  console.log(`📋 PolicyManager Address: ${policyManagerAddress}`);
  console.log(`🌐 Network: ${network}`);
  
  return {
    tokenAddress,
    policyManagerAddress,
    network,
    updatedAt: new Date().toISOString()
  };
}

// Export for use
export { updateContractAddresses };

// If run directly, expect command line arguments
if (process.argv.length >= 4) {
  const tokenAddress = process.argv[2];
  const policyManagerAddress = process.argv[3];
  const network = process.argv[4] || 'Shardeum Unstablenet';
  
  try {
    updateContractAddresses(tokenAddress, policyManagerAddress, network);
    console.log('🎉 Contract addresses updated successfully!');
  } catch (error) {
    console.error('❌ Error updating addresses:', error.message);
    process.exit(1);
  }
} else if (process.argv.length === 3 && process.argv[2] === '--help') {
  console.log('📖 Usage: node update-contracts.js <tokenAddress> <policyManagerAddress> [network]');
  console.log('📖 Example: node update-contracts.js 0x742d35... 0x1234567... "Shardeum Unstablenet"');
}
