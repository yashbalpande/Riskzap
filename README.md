# RiskZap - Decentralized Insurance Platform

> Simplifying insurance through blockchain technology on Shardeum Network

## 🌟 Overview

RiskZap is a revolutionary decentralized insurance platform that makes purchasing and managing insurance policies as simple as sending a text message. Built on the Shardeum blockchain, we're transforming the traditional insurance industry by eliminating intermediaries, reducing costs, and providing instant policy activation.

## 🚀 Why RiskZap?

**For Users:**
- **Instant Policy Activation** - No waiting periods, your coverage starts immediately
- **Transparent Pricing** - All fees clearly displayed (2% purchase fee, 0.5% withdrawal fee)
- **Wallet Integration** - Seamless MetaMask connection for easy payments
- **Real-time Analytics** - Track your policies and claims in one dashboard

**For the Industry:**
- **Cost Reduction** - Eliminate traditional insurance overhead
- **Fraud Prevention** - Blockchain immutability ensures claim authenticity
- **Global Accessibility** - Anyone with a wallet can purchase insurance
- **Smart Contracts** - Automated claim processing and payouts

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Blockchain**: Shardeum Shardeum Unstablenet  (Chain ID: 8083)
- **Smart Contracts**: Solidity with OpenZeppelin standards
- **Wallet Integration**: MetaMask with ethers.js
- **Styling**: Tailwind CSS for modern UI/UX
- **Development**: Hardhat for contract deployment

## 📱 Key Features

### 🔐 Secure Wallet Connection
Connect your MetaMask wallet to the Shardeum network with automatic network detection and switching.

### 📋 Policy Management
- Browse available insurance policies
- Purchase policies with SHM tokens
- Track policy status and coverage details
- View transaction history on blockchain explorer

### 💰 Transparent Fee Structure
- **Purchase Fee**: 2% (sent to company wallet)
- **Withdrawal Fee**: 0.5% (for contract maintenance)
- **Network Fees**: Standard Shardeum gas fees

### 📊 Real-time Analytics
Monitor your insurance portfolio with live data including:
- Active policies count
- Total coverage amount
- Recent transactions
- Policy performance metrics

## 🌐 Network Configuration

**Shardeum Unstablenet**
```
Network Name: Shardeum Unstablenet
RPC URL: https://api-unstable.shardeum.org
Chain ID: 8083
Currency Symbol: SHM
Block Explorer: https://explorer-unstable.shardeum.org/
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MetaMask browser extension
- SHM tokens for transactions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashbalpande/Riskzap.git
   cd Riskzap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### MetaMask Setup

1. Add Shardeum network to MetaMask using the configuration above
2. Import or fund your wallet with SHM tokens
3. Connect wallet to the RiskZap DApp
4. Start purchasing insurance policies!

## 📄 Smart Contracts

### Deployed Contracts on Shardeum

**ERC20 Mock Token (Test SHM)**
- Address: `0xaa2b86e1f9de4cbdeaf177e61ce0e2fc091f9f9e`
- [View on Explorer](https://explorer-unstable.shardeum.org/account/0xaa2b86e1f9de4cbdeaf177e61ce0e2fc091f9f9e)

**PolicyManager Contract**
- Address: `0x055682a1a8fa88ed10a56724d29bcd44215e04d5`
- [View on Explorer](https://explorer-unstable.shardeum.org/account/0x055682a1a8fa88ed10a56724d29bcd44215e04d5)

### Contract Features
- **ERC20 Integration** - Uses standard token transfers
- **Ownable Pattern** - Admin controls for policy management
- **Fee Collection** - Automated fee distribution
- **Event Logging** - Full transaction transparency

## 🏗️ Development

### Project Structure
```
src/
├── components/          # React components
├── contracts/          # Contract ABIs and configs
├── pages/             # Main application pages
└── services/          # Web3 and API services

contracts/             # Solidity smart contracts
scripts/              # Deployment scripts
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Deploy smart contracts
```

## 🛡️ Security Features

- **OpenZeppelin Standards** - Battle-tested smart contract libraries
- **Access Control** - Owner-only administrative functions
- **Input Validation** - Comprehensive parameter checking
- **Event Logging** - Full audit trail for all transactions
- **Network Verification** - Ensures correct chain interaction

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.
