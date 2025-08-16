# Hardhat test & deploy

Install developer dependencies locally:

```powershell
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox chai @types/chai
npm install --save-dev @nomiclabs/hardhat-ethers ethers
npm install --save-dev @openzeppelin/contracts
```

Run tests:

```powershell
npx hardhat test
```

Deploy locally:

```powershell
npx hardhat run scripts/deploy.ts --network hardhat
```
