#!/usr/bin/env node
import { ethers } from 'ethers';
import fs from 'fs';

const RPC = process.env.RPC || 'https://dapps.shardeum.org/';
const provider = new ethers.JsonRpcProvider(RPC);

async function main() {
  const addr = process.argv[2];
  if (!addr) {
    console.error('Usage: node scripts/check-token.mjs <token_address> [wallet_address]');
    process.exit(1);
  }

  console.log('Checking token address:', addr);
  const code = await provider.getCode(addr);
  console.log('getCode =>', code === '0x' ? '<no code found>' : `${code.slice(0, 50)}... (${code.length} bytes)`);

  if (code === '0x') {
    console.error('No contract deployed at this address. Do NOT use it as your token address.');
    process.exit(2);
  }

  // Try to read decimals and symbol
  const abi = ['function decimals() view returns (uint8)', 'function symbol() view returns (string)', 'function name() view returns (string)', 'function balanceOf(address) view returns (uint256)'];
  const token = new ethers.Contract(addr, abi, provider);

  try {
    const decimals = await token.decimals();
    const symbol = await token.symbol();
    const name = await token.name();
    console.log('Token name:', name);
    console.log('Token symbol:', symbol);
    console.log('Token decimals:', decimals);

    const maybeWallet = process.argv[3];
    if (maybeWallet) {
      const bal = await token.balanceOf(maybeWallet);
      console.log(`Balance of ${maybeWallet}:`, ethers.formatUnits(bal, decimals));
    }

    console.log('\nThis looks like an ERC-20 contract. You can set VITE_SHM_TOKEN_ADDRESS to this address.');
  } catch (err) {
    console.error('Failed to call ERC-20 methods (decimals/symbol/name). This may not be a standard ERC-20. Error:', err.message || err);
    process.exit(3);
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(99);
});
