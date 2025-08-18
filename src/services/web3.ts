import { ethers } from 'ethers';

// -- Runtime-config keys (localStorage keys)
const LS_TOKEN_KEY = 'RISKZAP_SHM_TOKEN_ADDRESS';
const LS_COMPANY_KEY = 'RISKZAP_COMPANY_WALLET';
const LS_POLICY_KEY = 'RISKZAP_POLICY_CONTRACT';
const shardeumLiberty = {
  chainName: 'Shardeum Unstablenet',
  rpcUrls: ['https://api-unstable.shardeum.org'],
  nativeCurrency: {
    name: 'SHM',
    symbol: 'SHM',
    decimals: 18,
  },
  blockExplorerUrls: ['https://explorer-unstable.shardeum.org/'],
};

// Policy contract key constant
// const POLICY_KEY = 'RISKZAP_POLICY_CONTRACT'; // removed duplicate

// Demo mode for development when contracts aren't deployed
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';


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

  const amount = ethers.utils.parseUnits(String(amountInShm), SHM_TOKEN_DECIMALS);

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

  console.log('🔌 Connecting to wallet...');
  console.log('🔍 Expected Chain ID:', EXPECTED_CHAIN_ID);

  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

  // Create provider with polling disabled to prevent network mismatch errors
  const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  console.log('👤 Connected address:', address);

  // Check if we're on the correct network
  if (EXPECTED_CHAIN_ID) {
    try {
      const network = await provider.getNetwork();
      const chainIdNum = Number(network.chainId);
      
      console.log('🌐 Current network:', network);
      console.log('🔗 Current Chain ID:', chainIdNum);
      
      if (chainIdNum !== EXPECTED_CHAIN_ID) {
        console.log('⚠️ Wrong network detected. Switching to Shardeum...');
        
        // Try to switch to the correct network
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}` }],
          });
          console.log('✅ Successfully switched network');
        } catch (switchError: any) {
          console.log('🔧 Network switch failed, trying to add network:', switchError);
          
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}`,
                chainName: 'Shardeum Unstablenet',
                rpcUrls: ['https://api-unstable.shardeum.org'],
                nativeCurrency: { name: 'Shardeum', symbol: 'SHM', decimals: 18 },
                blockExplorerUrls: ['https://explorer-unstable.shardeum.org/']
              }]
            });
            console.log('✅ Successfully added and switched to Shardeum network');
          } else {
            throw switchError;
          }
        }
        
        // Recreate provider after network switch
        const newProvider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
        const newSigner = newProvider.getSigner();
        const finalNetwork = await newProvider.getNetwork();
        console.log('🔄 Final network after switch:', finalNetwork);
        
        return { provider: newProvider, signer: newSigner, address };
      }
    } catch (networkError) {
      console.warn('Network check failed, but continuing:', networkError);
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
export async function getShmBalance(provider: ethers.providers.Provider, address: string) {
  if (!provider) {
    throw new Error('Provider is required to check SHM balance.');
  }

  console.log('🔍 Checking SHM balance for address:', address);
  console.log('🔍 Demo mode?', DEMO_MODE);

  // In demo mode, return a mock balance
  if (DEMO_MODE) {
    console.log('🎭 Demo mode: returning mock SHM balance of 1000');
    return "1000.0";
  }

  // For native SHM tokens, just get the native balance
  try {
    // First check if we can get network info
    let network;
    try {
      network = await provider.getNetwork();
      console.log('🌐 Provider network:', network);
    } catch (networkError) {
      console.warn('⚠️ Could not get network info:', networkError);
    }

    // Try to get balance with timeout
    const balance = await Promise.race([
      provider.getBalance(address),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Balance fetch timeout')), 10000)
      )
    ]) as ethers.BigNumber;

    const formattedBalance = ethers.utils.formatEther(balance);
    console.log('💰 Raw balance (wei):', balance.toString());
    console.log('💰 Formatted balance (SHM):', formattedBalance);
    return formattedBalance;
  } catch (error) {
    console.error('❌ Error getting SHM balance:', error);
    
    // Try with fallback RPC provider
    try {
      console.log('🔄 Trying fallback RPC provider...');
      const fallbackProvider = new ethers.providers.JsonRpcProvider('https://api-unstable.shardeum.org');
      const fallbackBalance = await fallbackProvider.getBalance(address);
      const formattedFallbackBalance = ethers.utils.formatEther(fallbackBalance);
      console.log('💰 Fallback balance (SHM):', formattedFallbackBalance);
      return formattedFallbackBalance;
    } catch (fallbackError) {
      console.error('❌ Fallback provider also failed:', fallbackError);
      // If we're connected but can't get balance, return 0 instead of throwing
      console.warn('⚠️ Returning 0 balance due to network error');
      return "0.0";
    }
  }
}

/**
 * Send SHM token to the configured company wallet.
 * Company wallet must be configured via env or settings; there is no hardcoded fallback.
 */
export async function sendShmToken(signer: ethers.Signer, amountInShm: string | number) {
  const provider = signer.provider;
  if (!provider) throw new Error('No provider found for signer.');

  const from = await signer.getAddress();

  // resolve configured company wallet
  const company = getConfiguredCompanyWallet();
  if (!company) {
    throw new Error('Company wallet not configured. Set VITE_COMPANY_WALLET or use AdminSettings to provide a company wallet address.');
  }

  // Skip network assertion to avoid circuit breaker issues
  try {
    console.log('🔍 Checking network compatibility...');
    await assertExpectedNetwork(signer);
  } catch (networkError) {
    console.warn('⚠️ Network check failed, continuing anyway:', networkError);
    // Continue with transaction anyway - MetaMask will handle network switching
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
  const amount = ethers.utils.parseEther(String(amountInShm));
  
  try {
    // Get current gas price from network
    let gasPrice;
    try {
      gasPrice = await provider.getGasPrice();
      console.log('⛽ Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');
    } catch (gasPriceError) {
      console.warn('⚠️ Could not get gas price, using fallback');
      gasPrice = ethers.utils.parseUnits("20", "gwei");
    }

    const tx = await signer.sendTransaction({
      to: company,
      value: amount,
      gasLimit: 21000, // Standard transfer gas limit
      gasPrice: gasPrice
    });

    console.log('📤 Transaction sent:', tx.hash);
    await tx.wait();
    console.log('✅ Transaction confirmed:', tx.hash);
    return tx;
  } catch (txError) {
    console.error('❌ Transaction failed:', txError);
    throw new Error(`Transaction failed: ${txError.message}`);
  }
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
  const amount = ethers.utils.parseEther(String(amountInShm));
  
  const tx = await companySigner.sendTransaction({
    to: userAddress,
    value: amount,
    gasLimit: 21000,
    gasPrice: ethers.utils.parseUnits("20", "gwei")
  });

  await tx.wait();
  return tx;
}

