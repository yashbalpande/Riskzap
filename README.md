# 🔥 RiskZap - Micro-Insurance DApp on Shardeum Unstablenet

## 🏆 **HACKATHON DELIVERABLES** ✅

### **📺 Live Deployed DApp**
🌐 **Frontend**: [http://localhost:8080](http://localhost:8080) *(Ready for production deployment)*  
🔗 **Verification API**: [http://localhost:3001/api/verify](http://localhost:3001/api/verify)  
📊 **Health Check**: [http://localhost:3001/health](http://localhost:3001/health)  

### **🔗 Deployed Smart Contracts on Shardeum Unstablenet**
🪙 **ERC20Mock Token**: [`0xaa2b86e1f9de4cbdeaf177e61ce0e2fc091f9f9e`](https://explorer-liberty20.shardeum.org/address/0xaa2b86e1f9de4cbdeaf177e61ce0e2fc091f9f9e)  
📋 **PolicyManager**: [`0x055682a1a8fa88ed10a56724d29bcd44215e04d5`](https://explorer-liberty20.shardeum.org/address/0x055682a1a8fa88ed10a56724d29bcd44215e04d5)  
🌐 **Network**: Shardeum Unstablenet (Chain ID: 8080)  
🔍 **Explorer**: https://explorer-liberty20.shardeum.org/  

### **📂 Complete GitHub Repository**
✅ **Full source code** with comprehensive documentation  
✅ **Smart contracts** with OpenZeppelin security standards  
✅ **Frontend DApp** with Web3 integration  
✅ **Backend API** for hackathon verification requirements  
✅ **Setup instructions** for local development and deployment  

### **📚 API Documentation**
✅ **Comprehensive API docs**: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)  
✅ **Verification endpoint** with pass/fail responses  
✅ **Full integration examples** and testing commands  
✅ **Security features** and error handling documentation  

---

## 🚀 Revolutionary Insurance Platform

A cutting-edge decentralized insurance platform built on Shardeum Unstablenet, offering instant micro-policies with SHM token payments. This DApp demonstrates the future of Web3 insurance with gamified UX, 3D animations, and smart contract automation.

## 🌟 Features

### Core Functionality
- **Instant Micro-Policies**: Device protection, event coverage, travel insurance, and equipment rental
- **PayFi Integration**: Seamless SHM token micropayments for instant coverage
- **Smart Contract Automation**: Trustless policy issuance and claim processing
- **Real-time Verification**: Blockchain-based action verification API
- **AI-Powered Underwriting**: Automated risk assessment and dynamic pricing

### Advanced UI/UX
- **3D Particle Effects**: Interactive particle systems representing policy flows
- **Gamified Navigation**: Progress bars as animated vines, holographic widgets
- **Warm Color Palette**: Vibrant reds, oranges, yellows, and greens (no blue/purple)
- **Responsive Design**: Optimized for desktop and mobile devices
- **Immersive Animations**: Fractal patterns, floating elements, and particle effects

### Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **Blockchain**: Web3.js + Shardeum Unstablenet
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Redux Toolkit + React Context
- **Smart Contracts**: Solidity (deployed on Shardeum)

## 🛠 **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Git

### **🚀 Run the Complete System**

#### **1. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/yashbalpande/Riskzap.git
cd Riskzap

# Install dependencies
npm install
```

#### **2. Start Backend API** *(Required for Hackathon)*
```bash
# Start verification server
cd backend
node server.js

# API will be available at http://localhost:3001
```

#### **3. Start Frontend DApp**
```bash
# In new terminal, start frontend
npm run dev

# DApp will be available at http://localhost:8080
```

#### **4. Connect to Shardeum Unstablenet**
The DApp automatically prompts users to add Shardeum Unstablenet:
- **Network Name**: Shardeum Unstablenet
- **RPC URL**: https://api-unstable.shardeum.org
- **Chain ID**: 8080
- **Currency**: SHM
- **Explorer**: https://explorer-liberty20.shardeum.org

### **🧪 Test the API Endpoint** *(Hackathon Requirement)*

```bash
# Test health check
curl http://localhost:3001/health

# Test verification endpoint
curl -X POST http://localhost:3001/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xFd3fBa510A135B5DE354B1d4b174208c343aaD42",
    "action": "policy_purchase",
    "transactionHash": "0x623ea944d12109ff40a580daa36054413bb0f54a040fa7386ed1add7949232e5"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "status": "pass",
  "message": "Wallet action verified successfully",
  "data": {
    "blockchainConfirmed": true,
    "verifiedAt": "2025-08-18T15:30:00.000Z"
  }
}
```

### Verifying the SHM token address (helper)

This repo includes a small script to validate a candidate ERC-20 token address before you set it in the environment.

Usage:

```bash
# (optional) set RPC if you need a custom endpoint
RPC=https://dapps.shardeum.org/ node scripts/check-token.mjs 0xCANDIDATE_ADDRESS [optional_wallet_address]
```

The script checks whether code exists at the address and attempts to call `decimals()`, `symbol()` and `name()` to confirm it's an ERC-20.

### Smart Contract Deployment

```bash
# Compile contracts
npx hardhat compile

# Deploy to Shardeum Unstablenet
npx hardhat run scripts/deploy.js --network shardeum-unstablenet

# Verify contracts
npx hardhat verify --network shardeum-unstablenet <CONTRACT_ADDRESS>
```

## 🔗 API Documentation

### Verification Endpoint

The backend provides a verification API that confirms wallet actions:

#### POST `/api/verify`

**Request Body:**
```json
{
  "walletAddress": "0x...",
  "action": "policy_creation",
  "transactionHash": "0x...",
  "timestamp": 1704067200000
}
```

**Response:**
```json
{
  "success": true,
  "status": "pass",
  "message": "Wallet action verified successfully",
  "data": {
    "verifiedAt": "2024-01-01T00:00:00.000Z",
    "blockchainConfirmed": true
  }
}
```

### Policy Management Endpoints

#### POST `/api/policies`
Create a new micro-policy

#### GET `/api/policies/user/:address`
Get all policies for a wallet address

#### POST `/api/claims`
Submit an insurance claim

#### POST `/api/kyc/verify`
Verify user identity for compliance

## 🌐 Shardeum Integration

### Network Configuration
- **Chain ID**: 1074 (Shardeum Unstablenet)
- **RPC URL**: https://dapps.shardeum.org/
- **Currency**: SHM (Shardeum)
- **Block Explorer**: https://explorer-dapps.shardeum.org/

### Adding Shardeum to MetaMask

The DApp automatically prompts users to add the Shardeum network when connecting their wallet.

## 🎮 Gamified Insurance Flow

The application visualizes the complete insurance backend flow:

1. **User Request** → Smart contract initiation
2. **Validation** → Input verification and eligibility
3. **KYC/AML** → Identity verification
4. **Underwriting** → AI risk assessment
5. **Quote Generation** → Dynamic pricing
6. **Policy Selection** → Coverage customization
7. **Riskzap Payment** → SHM token transaction
8. **Policy Creation** → NFT issuance
9. **Notification** → Real-time updates
10. **Dashboard Update** → Live management interface

## 🎨 Design System

### Color Palette (Warm Colors Only)
- **Primary**: Fiery Orange (`hsl(25 100% 55%)`)
- **Secondary**: Warm Red (`hsl(0 85% 45%)`)
- **Success**: Vibrant Green (`hsl(120 85% 45%)`)
- **Warning**: Golden Yellow (`hsl(45 100% 55%)`)

### Animation Features
- Holographic background effects
- Particle glow animations
- Floating elements with physics
- Fractal pattern generation
- Vine-like progress indicators

## 📱 Demo & Testing

### Test Scenarios
1. **Connect Wallet**: MetaMask integration with Shardeum
2. **Create Policy**: Device protection for 0.5 SHM
3. **View Analytics**: Real-time dashboard metrics
4. **Process Claim**: Automated smart contract execution
5. **Verification**: API endpoint testing

### Mock Data
The application includes comprehensive mock data for demonstration:
- Sample policies and claims
- Analytics charts and metrics
- User activity timelines
- Risk assessment data

## 🔐 Security Features

- **Smart Contract Auditing**: Automated security checks
- **KYC/AML Compliance**: Identity verification workflows
- **Secure Payments**: SHM token escrow mechanisms
- **Data Encryption**: End-to-end security protocols

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting platform
npm run deploy
```

### Backend Deployment
```bash
# Start production server
npm run start:prod

# Environment variables required:
# - DATABASE_URL
# - SHARDEUM_RPC_URL
# - JWT_SECRET
```

## 📊 Analytics & Monitoring

The platform includes comprehensive analytics:
- Policy creation and claim statistics
- Premium volume and success rates
- Network performance metrics
- AI underwriting accuracy
- User engagement tracking

## 🎥 Demo Video Script Outline

### Opening (30s)
- Showcase the immersive 3D interface
- Highlight warm color scheme and animations
- Demonstrate wallet connection to Shardeum

### Core Features (90s)
- Create a device protection micro-policy
- Show Riskzap payment with SHM tokens
- Navigate through the gamified flow visualization
- Display real-time analytics dashboard

### Technical Demo (60s)
- Smart contract interaction
- API verification endpoint
- Blockchain transaction confirmation
- Claims processing automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open-source under the MIT License.

## 🆘 Support

For technical support or questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation wiki

---

Built with ❤️ for the future of decentralized insurance on Shardeum.