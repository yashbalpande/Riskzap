# PayFi Insurance - Micro-Policy DApp on Shardeum

## 🚀 Revolutionary PayFi Insurance Platform

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

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Git

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd payfi-insurance-dapp

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

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
7. **PayFi Payment** → SHM token transaction
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
- Show PayFi payment with SHM tokens
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