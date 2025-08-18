# 🔐 PRIVATE KEY SETUP INSTRUCTIONS

## ⚠️ SECURITY WARNING
Never share your private key or commit it to GitHub!

## 📋 Steps to add your private key:

1. Open MetaMask browser extension
2. Click on your account name at the top
3. Click "Account Details"
4. Click "Export Private Key"
5. Enter your MetaMask password
6. Copy the private key (it looks like: abc123def456...)
7. Replace "your_private_key_here_without_0x_prefix" in .env file

## 📝 Example .env file:
```
PRIVATE_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

## 💰 Fund Your Wallet
Before deployment, get test SHM tokens from:
🚰 https://faucet.shardeum.org/

## 🚀 Deploy Command
After setting up your private key and getting SHM tokens:
```bash
npx tsx scripts/deploy.ts
```
