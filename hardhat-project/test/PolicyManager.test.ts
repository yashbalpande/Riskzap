import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('PolicyManager', function () {
  it('applies purchase fee and holds net, and withdraw applies withdraw fee', async function () {
    const [owner, buyer, recipient] = await ethers.getSigners();

    const ERC20Mock = await ethers.getContractFactory('ERC20Mock');
    const initialSupply = ethers.parseUnits('1000000', 18);
    const token = await ERC20Mock.deploy('Shardeum Mock', 'SHM', initialSupply);
    await token.waitForDeployment();

    const PolicyManager = await ethers.getContractFactory('PolicyManager');
    const policy = await PolicyManager.deploy(token.target, owner.address);
    await policy.waitForDeployment();

    await token.mint(buyer.address, ethers.parseUnits('1000', 18));

    const amount = ethers.parseUnits('10', 18); // buyer pays 10 SHM
    await token.connect(buyer).approve(policy.target, amount);
    await policy.connect(buyer).purchase(1, amount, '0x');

    const companyBalance = await token.balanceOf(owner.address);
    expect(companyBalance).to.equal(ethers.parseUnits('0.2', 18));

    const contractBalance = await token.balanceOf(policy.target);
    expect(contractBalance).to.equal(ethers.parseUnits('9.8', 18));

    await policy.connect(owner).withdraw(ethers.parseUnits('9.8', 18), recipient.address);

    const companyAfter = await token.balanceOf(owner.address);
    expect(companyAfter).to.equal(ethers.parseUnits('0.249', 18));

    const recipientBalance = await token.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(ethers.parseUnits('9.751', 18));
  });
});
