import { ethers } from 'hardhat';

async function main() {
  const [deployer, user] = await ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const ERC20Mock = await ethers.getContractFactory('ERC20Mock');
  const initialSupply = ethers.parseUnits('1000000', 18);
  const token = await ERC20Mock.deploy('Shardeum Mock', 'SHM', initialSupply);
  await token.waitForDeployment();
  console.log('ERC20Mock deployed at', token.target);

  const PolicyManager = await ethers.getContractFactory('PolicyManager');
  const companyWallet = deployer.address; // for local testing
  const policy = await PolicyManager.deploy(token.target, companyWallet);
  await policy.waitForDeployment();
  console.log('PolicyManager deployed at', policy.target);

  await token.mint(user.address, ethers.parseUnits('1000', 18));
  console.log('Minted 1000 SHM to', user.address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
