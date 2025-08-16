import { ethers } from 'ethers';

export const DEFAULT_COMPANY_WALLET =
  (import.meta as any)?.env?.VITE_COMPANY_WALLET ||
  '0x8a97f55b6D61faA30fB6b33D602dBB0714822D80';

// Keep the SHM default as an internal constant so runtime code goes through
// `getConfiguredTokenAddress()` and consumers cannot accidentally import a
// build-time value. This fallback is for local/dev convenience only.
const DEFAULT_SHM_TOKEN_ADDRESS =
  import.meta.env.VITE_SHM_TOKEN_ADDRESS ||
  '0x8a8dcf87ad6bc786744e663296191c39f88de12b';

export const SHM_TOKEN_DECIMALS = import.meta.env.VITE_SHM_TOKEN_DECIMALS
  ? Number(import.meta.env.VITE_SHM_TOKEN_DECIMALS)
  : 18;

export const EXPECTED_CHAIN_ID: number | undefined = import.meta.env
  .VITE_SHM_CHAIN_ID
  ? Number(import.meta.env.VITE_SHM_CHAIN_ID)
  : undefined;

// Resolve configured values at runtime; localStorage overrides env values.
export function getConfiguredTokenAddress(): string {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('RISKZAP_SHM_TOKEN_ADDRESS');
      if (stored) return stored;
    }
  } catch (e) {
    console.debug('getConfiguredTokenAddress read error', e);
  }
  return DEFAULT_SHM_TOKEN_ADDRESS;
}

export function getConfiguredCompanyWallet(): string {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('RISKZAP_COMPANY_WALLET');
      if (stored) return stored;
    }
  } catch (e) {
    console.debug('getConfiguredCompanyWallet read error', e);
  }
  return DEFAULT_COMPANY_WALLET;
}

export function setConfiguredTokenAddress(addr: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('RISKZAP_SHM_TOKEN_ADDRESS', addr);
    } catch (e) {}
  }
}

export function setConfiguredCompanyWallet(addr: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('RISKZAP_COMPANY_WALLET', addr);
    } catch (e) {}
  }
}

export function getConfiguredPolicyContract(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('RISKZAP_POLICY_CONTRACT');
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
      localStorage.setItem('RISKZAP_POLICY_CONTRACT', addr);
    } catch (e) {}
  }
}

const erc20Abi = [
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function balanceOf(address account) public view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const policyAbi = [
  'function purchase(uint256 policyId, uint256 amount, bytes data)',
  'function setToken(address tokenAddr)',
  'function setCompanyWallet(address _companyWallet)'
];

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

  // Create contract instances
  const tokenContract = new ethers.Contract(tokenAddr, erc20Abi, signer);
  const policyContract = new ethers.Contract(policyAddr, policyAbi, signer);

  const amount = ethers.parseUnits(String(amountInShm), SHM_TOKEN_DECIMALS);

  // Approve
  const approveTx = await tokenContract.approve(policyAddr, amount);
  await approveTx.wait();

  // Purchase
  const tx = await policyContract.purchase(policyId, amount, '0x');
  await tx.wait();

  return tx;
}

/**
 * Connect to wallet
 */
export async function connectWallet() {
  if (!(window as any).ethereum) {
    throw new Error('No web3 wallet found. Please install MetaMask.');
  }

  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
}

/**
 * Ensure correct chain
 */
async function assertExpectedNetwork(signer: ethers.Signer) {
  if (EXPECTED_CHAIN_ID === undefined) return;

  const provider = signer.provider;
  if (!provider) throw new Error('Signer has no provider attached.');

  const network = await provider.getNetwork();
  if (network.chainId !== BigInt(EXPECTED_CHAIN_ID)) {
    throw new Error(
      `Connected chainId=${network.chainId} does not match expected=${EXPECTED_CHAIN_ID}`
    );
  }
}

/**
 * Get SHM token balance of a given address
 */
export async function getShmBalance(
  provider: ethers.Provider,
  address: string
) {
  // Ensure the configured token address has code (is a deployed contract)
  if (!provider || typeof (provider as any).getCode !== 'function') {
    throw new Error('Provider does not support getCode. Cannot verify SHM token contract.');
  }

  const tokenAddr = getConfiguredTokenAddress();
  const code = await (provider as any).getCode(tokenAddr);
  if (!code || code === '0x') {
    throw new Error(
      `No contract found at ${tokenAddr}. Please set VITE_SHM_TOKEN_ADDRESS (or use the app settings) to the correct ERC-20 contract address.`
    );
  }

  const token = new ethers.Contract(tokenAddr, erc20Abi, provider);
  const raw = await token.balanceOf(address);
  return ethers.formatUnits(raw, SHM_TOKEN_DECIMALS);
}

/**
 * Send SHM token to the company wallet
 */
export async function sendShmToken(
  signer: ethers.Signer,
  amountInShm: string | number
) {
  const tokenAddr = getConfiguredTokenAddress();
  if (!tokenAddr || tokenAddr === '0x0000000000000000000000000000000000000000') {
    throw new Error('SHM token contract address not configured.');
  }

  await assertExpectedNetwork(signer);

  const provider = signer.provider;
  if (!provider) throw new Error('No provider found for signer.');
  const from = await signer.getAddress();

  // Check balance before sending
  const balance = await getShmBalance(provider, from);
  if (parseFloat(balance) < parseFloat(String(amountInShm))) {
    throw new Error(
      `Insufficient SHM balance. You have ${balance}, trying to send ${amountInShm}.`
    );
  }

  const tokenContract = new ethers.Contract(tokenAddr, erc20Abi, signer);
  const amount = ethers.parseUnits(String(amountInShm), SHM_TOKEN_DECIMALS);

  // Double-check the token address has contract code (defensive)
  const code = await (provider as any).getCode(tokenAddr);
  if (!code || code === '0x') {
    throw new Error(
      `Configured SHM token address ${tokenAddr} does not appear to be a contract. Set VITE_SHM_TOKEN_ADDRESS (or use the app settings) to the correct ERC-20 contract address.`
    );
  }

  // Send without manual gas override
  const company = getConfiguredCompanyWallet();
  const tx = await tokenContract.transfer(company, amount);
  console.log('Transaction sent:', tx.hash);

  await tx.wait();
  console.log('Transaction confirmed:', tx.hash);

  return tx;
}
