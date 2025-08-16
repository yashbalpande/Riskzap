# Smart Contract Deployment Instructions

## Current Status: Demo Mode Enabled ✅

Your insurance platform is currently running in **Demo Mode** with simulated transactions. Here's how to deploy real contracts when ready:

## Demo Mode Features
- ✅ Full UI functionality 
- ✅ Purchase flow with 5% platform fees
- ✅ Claim flow with 0.2% withdrawal fees
- ✅ Policy tracking and management
- ✅ Simulated blockchain transactions (2 second delays)
- ✅ Mock balance of 1000 SHM tokens

## To Deploy Real Contracts

### Option 1: Use Hardhat (Recommended)
1. **Fix ESM Configuration**:
   ```bash
   # Temporarily remove type module from root package.json
   # Or use hardhat-project subdirectory with CommonJS
   cd hardhat-project
   ```

2. **Deploy Contracts**:
   ```bash
   # Start local node
   npx hardhat node
   
   # In another terminal, deploy
   npx hardhat run scripts/deploy.ts --network localhost
   ```

3. **Update Configuration**:
   - Copy deployed contract addresses to `.env`
   - Set `VITE_DEMO_MODE=false`
   - Restart your dev server

### Option 2: Deploy to Shardeum Testnet
1. **Configure Network**:
   ```javascript
   // In hardhat.config.cjs
   networks: {
     shardeumTestnet: {
       url: "https://dapps.shardeum.org/",
       chainId: 8083,
       accounts: ["your-private-key"]
     }
   }
   ```

2. **Deploy**:
   ```bash
   npx hardhat run scripts/deploy.ts --network shardeumTestnet
   ```

### Option 3: Use Existing Testnet Tokens
Find existing ERC-20 tokens on Shardeum testnet and update:
- `VITE_SHM_TOKEN_ADDRESS` with real token address
- `VITE_DEMO_MODE=false`

## Environment Variables Reference

```env
# Demo mode (set to false for real contracts)
VITE_DEMO_MODE=true

# Real contract addresses (update after deployment)
VITE_SHM_TOKEN_ADDRESS=0x...
VITE_POLICY_CONTRACT=0x...
VITE_COMPANY_WALLET=0x...

# Network configuration
VITE_SHM_CHAIN_ID=8083
VITE_SHM_TOKEN_DECIMALS=18
```

## Your Current Setup
- 🎭 Demo mode active
- 🔧 Full insurance platform functionality
- 💰 5% purchase fees + 0.2% withdrawal fees
- 🔗 Shardeum testnet configuration ready
- ⚡ Real transaction logic (just needs real contracts)

Ready to go live? Just deploy contracts and update your configuration!
