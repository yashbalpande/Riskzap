import { ethers } from 'ethers';

// -- Runtime-config keys (localStorage keys)
const LS_TOKEN_KEY = 'RISKZAP_SHM_TOKEN_ADDRESS';
const LS_COMPANY_KEY = 'RISKZAP_COMPANY_WALLET';
const LS_POLICY_KEY = 'RISKZAP_POLICY_CONTRACT';

// Demo mode for development when contracts aren't deployed
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Keep an internal default token only for developer convenience. Company wallet
// must be configured at runtime (env OR localStorage) — there is no hardcoded
// company wallet in this file.
const DEFAULT_SHM_TOKEN_ADDRESS = (import.meta as any)?.env?.VITE_SHM_TOKEN_ADDRESS || '';

export const SHM_TOKEN_DECIMALS = import.meta.env.VITE_SHM_TOKEN_DECIMALS
  ? Number(import.meta.env.VITE_SHM_TOKEN_DECIMALS)
  : 18;

export const EXPECTED_CHAIN_ID: number | undefined = import.meta.env
  .VITE_SHM_CHAIN_ID
  ? Number(import.meta.env.VITE_SHM_CHAIN_ID)
  : undefined;

/* Simple runtime getters/setters. These prefer localStorage overrides, then env. */
export function getConfiguredTokenAddress(): string {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_TOKEN_KEY);
      if (stored) return stored;
    }
  } catch (e) {
    console.debug('getConfiguredTokenAddress read error', e);
  }
  return DEFAULT_SHM_TOKEN_ADDRESS;
}

export function setConfiguredTokenAddress(addr: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LS_TOKEN_KEY, addr);
    } catch (e) {
      console.debug('setConfiguredTokenAddress error', e);
    }
  }
}

export function getConfiguredCompanyWallet(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_COMPANY_KEY);
      if (stored) return stored;
      // fall back to env only if provided
      const env = (import.meta as any)?.env?.VITE_COMPANY_WALLET;
      if (env) return env;
    }
  } catch (e) {
    console.debug('getConfiguredCompanyWallet read error', e);
  }
  return null; // intentionally no hardcoded default
}

export function setConfiguredCompanyWallet(addr: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LS_COMPANY_KEY, addr);
    } catch (e) {
      console.debug('setConfiguredCompanyWallet error', e);
    }
  }
}

export function getConfiguredPolicyContract(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_POLICY_KEY);
      if (stored) return stored;
    }
  } catch (e) {
    console.debug('getConfiguredPolicyContract read error', e);
  }
  return null;
}

export function setConfiguredPolicyContract(addr: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LS_POLICY_KEY, addr);
    } catch (e) {
      console.debug('setConfiguredPolicyContract error', e);
    }
  }
}

// Minimal ABIs used by the client
const erc20Abi = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function balanceOf(address account) public view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const policyAbi = [
  'function purchase(uint256 policyId, uint256 amount, bytes data)',
  'function setToken(address tokenAddr)',
  'function setCompanyWallet(address _companyWallet)'
];

// Fee constants (basis points)
export const PURCHASE_FEE_BP = 500; // 5% platform fee on purchase
export const WITHDRAW_FEE_BP = 20; // 0.2% fee on withdrawal/claim pay

export function calculatePurchaseFee(amountInShm: number) {
  const fee = (amountInShm * PURCHASE_FEE_BP) / 10000;
  return { fee, net: amountInShm - fee };
}

export function calculateWithdrawFee(amountInShm: number) {
  const fee = (amountInShm * WITHDRAW_FEE_BP) / 10000;
  return { fee, net: amountInShm - fee };
}

/**
 * Approve token to the policy contract and call purchase(policyId, amount)
 */
export async function purchaseWithPolicyContract(
  signer: ethers.Signer,
  policyId: number,
  amountInShm: string | number
) { 
  const provider = signer.provider;
  if (!provider) throw new Error('Signer has no provider');

  const tokenAddr = getConfiguredTokenAddress();
  const policyAddr = getConfiguredPolicyContract();
  if (!policyAddr) throw new Error('Policy contract not configured. Set RISKZAP_POLICY_CONTRACT in settings or env.');
  if (!tokenAddr) throw new Error('Token address not configured. Set RISKZAP_SHM_TOKEN_ADDRESS.');

  const tokenContract = new ethers.Contract(tokenAddr, erc20Abi, signer);
  const policyContract = new ethers.Contract(policyAddr, policyAbi, signer);

  const amount = ethers.parseUnits(String(amountInShm), SHM_TOKEN_DECIMALS);

  // Approve then purchase
  const approveTx = await tokenContract.approve(policyAddr, amount);
  await approveTx.wait();

  const tx = await policyContract.purchase(policyId, amount, '0x');
  await tx.wait();
  return tx;
}

/**
 * Connect to wallet (Browser) and ensure correct network
 */
export async function connectWallet() {
  if (!(window as any).ethereum) {
    throw new Error('No web3 wallet found. Please install MetaMask or another provider.');
  }

  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // Check if we're on the correct network
  if (EXPECTED_CHAIN_ID) {
    const network = await provider.getNetwork();
    const chainIdNum = Number(network.chainId);
    
    if (chainIdNum !== EXPECTED_CHAIN_ID) {
      // Try to switch to the correct network
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}` }],
        });
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}`,
              chainName: 'Shardeum Unstablenet',
              rpcUrls: ['https://api-unstable.shardeum.org'],
              nativeCurrency: { name: 'Shardeum', symbol: 'SHM', decimals: 18 },
              blockExplorerUrls: ['https://explorer-dapps.shardeum.org/']
            }]
          });
        } else {
          throw switchError;
        }
      }
    }
  }

  return { provider, signer, address };
}

/**
 * Ensure correct chain (if EXPECTED_CHAIN_ID is set)
 */
async function assertExpectedNetwork(signer: ethers.Signer) {
  if (EXPECTED_CHAIN_ID === undefined) return;
  const provider = signer.provider;
  if (!provider) throw new Error('Signer has no provider attached.');

  const network = await provider.getNetwork();
  const chainIdNum = Number(network.chainId as any);
  if (chainIdNum !== EXPECTED_CHAIN_ID) {
    throw new Error(`Connected chainId=${chainIdNum} does not match expected=${EXPECTED_CHAIN_ID}`);
  }
}

/**
 * Get SHM token balance of a given address (using native SHM)
 */
export async function getShmBalance(provider: ethers.Provider, address: string) {
  if (!provider) {
    throw new Error('Provider is required to check SHM balance.');
  }

  console.log('🔍 Checking SHM balance for address:', address);
  console.log('🔍 Demo mode?', DEMO_MODE);
  console.log('🔍 Provider network:', await provider.getNetwork());

  // In demo mode, return a mock balance
  if (DEMO_MODE) {
    console.log('🎭 Demo mode: returning mock SHM balance of 1000');
    return "1000.0";
  }

  // For native SHM tokens, just get the native balance
  try {
    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.formatEther(balance);
    console.log('💰 Raw balance (wei):', balance.toString());
    console.log('💰 Formatted balance (SHM):', formattedBalance);
    return formattedBalance;
  } catch (error) {
    console.error('❌ Error getting SHM balance:', error);
    throw new Error('Failed to get SHM balance from network');
  }
}

/**
 * Send SHM token to the configured company wallet.
 * Company wallet must be configured via env or settings; there is no hardcoded fallback.
 */
export async function sendShmToken(signer: ethers.Signer, amountInShm: string | number) {
  await assertExpectedNetwork(signer);

  const provider = signer.provider;
  if (!provider) throw new Error('No provider found for signer.');

  const from = await signer.getAddress();

  // resolve configured company wallet
  const company = getConfiguredCompanyWallet();
  if (!company) {
    throw new Error('Company wallet not configured. Set VITE_COMPANY_WALLET or use AdminSettings to provide a company wallet address.');
  }

  const balance = await getShmBalance(provider, from);
  if (parseFloat(balance) < parseFloat(String(amountInShm))) {
    throw new Error(`Insufficient SHM balance. You have ${balance}, trying to send ${amountInShm}.`);
  }

  // In demo mode, simulate the transaction
  if (DEMO_MODE) {
    console.log(`🎭 Demo mode: simulating transfer of ${amountInShm} SHM to company wallet ${company}`);
    // Simulate a delay like a real transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      wait: async () => ({ status: 1 })
    };
  }

  // Send native SHM tokens directly
  const amount = ethers.parseEther(String(amountInShm));
  
  const tx = await signer.sendTransaction({
    to: company,
    value: amount,
    gasLimit: 21000, // Standard transfer gas limit
    gasPrice: ethers.parseUnits("20", "gwei")
  });

  await tx.wait();
  return tx;
}

/**
 * Send SHM token payout from company wallet to user (for claims)
 * This would typically be called by the company/admin, not the user
 */
export async function sendClaimPayout(companySigner: ethers.Signer, userAddress: string, amountInShm: string | number) {
  await assertExpectedNetwork(companySigner);

  const provider = companySigner.provider;
  if (!provider) throw new Error('No provider found for signer.');

  // In demo mode, simulate the claim payout
  if (DEMO_MODE) {
    console.log(`🎭 Demo mode: simulating claim payout of ${amountInShm} SHM to user ${userAddress}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      wait: async () => ({ status: 1 })
    };
  }

  // Send native SHM tokens directly
  const amount = ethers.parseEther(String(amountInShm));
  
  const tx = await companySigner.sendTransaction({
    to: userAddress,
    value: amount,
    gasLimit: 21000,
    gasPrice: ethers.parseUnits("20", "gwei")
  });

  await tx.wait();
  return tx;
}

