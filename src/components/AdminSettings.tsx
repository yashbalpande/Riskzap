import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { setConfiguredTokenAddress, setConfiguredCompanyWallet, getConfiguredTokenAddress, getConfiguredCompanyWallet, connectWallet } from '@/services/web3';
import { ethers } from 'ethers';

const AdminSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        setToken(localStorage.getItem('RISKZAP_SHM_TOKEN_ADDRESS') || '');
        setCompany(localStorage.getItem('RISKZAP_COMPANY_WALLET') || '');
      }
    } catch (e) {}
  }, []);

  const checkToken = async () => {
    setStatus(null);
    setChecking(true);
    try {
      if (!(window as any).ethereum) throw new Error('No wallet found');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const code = await provider.getCode(token || getConfiguredTokenAddress());
      if (!code || code === '0x') throw new Error('No contract code at address');
      const abi = ['function decimals() view returns (uint8)', 'function symbol() view returns (string)'];
      const c = new ethers.Contract(token, abi, provider as any);
      const decimals = await c.decimals();
      const symbol = await c.symbol();
      setStatus(`OK — ${symbol} decimals=${decimals}`);
    } catch (err: any) {
      setStatus('Error: ' + (err?.message || String(err)));
    } finally {
      setChecking(false);
    }
  };

  const save = () => {
    if (token) setConfiguredTokenAddress(token);
    if (company) setConfiguredCompanyWallet(company);
    setStatus('Saved to local settings');
    setOpen(false);
  };

  const deployToken = async () => {
    setStatus(null);
    setChecking(true);
    try {
      const { signer, address } = await connectWallet();
      setStatus('Deploying ERC-20 token contract...');
      
      // For demo purposes, we'll generate a mock deployed address
      // In real implementation, you would deploy the actual contract
      const mockAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      setStatus(`✅ Mock deployment completed!\n📋 Token Address: ${mockAddress}\n\n⚠️ This is a demo address. For real deployment:\n1. Use the hardhat deployment script\n2. Or deploy manually to Shardeum testnet`);
      setToken(mockAddress);
      
    } catch (error: any) {
      setStatus(`❌ Deployment failed: ${error.message}`);
    }
    setChecking(false);
  };

  return (
    <div>
      <Button variant="ghost" onClick={() => setOpen(true)}>⚙️</Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card p-6 rounded max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Admin Settings (local only)</h3>
            <label className="block text-sm mb-1">SHM Token Address</label>
            <input className="w-full p-2 mb-3 border rounded" value={token} onChange={(e) => setToken(e.target.value)} placeholder={getConfiguredTokenAddress()} />
            <label className="block text-sm mb-1">Company Wallet</label>
            <input className="w-full p-2 mb-3 border rounded" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={getConfiguredCompanyWallet()} />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={deployToken} disabled={checking} className="bg-primary">
                {checking ? 'Deploying...' : 'Deploy New Token'}
              </Button>
              <Button onClick={checkToken} disabled={checking}>{checking ? 'Checking…' : 'Validate Token'}</Button>
              <Button onClick={save}>Save</Button>
            </div>
            {status && <div className="mt-3 text-sm">{status}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
