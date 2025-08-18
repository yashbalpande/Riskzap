import React, { useState, useEffect, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Power, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectWallet, getShmBalance } from '@/services/web3';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log('👛 Checking wallet connection, accounts:', accounts);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Create provider for balance checking (using ethers v5 syntax)
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log('🔗 Created provider, checking balance...');
          
          // Get network info safely
          try {
            const network = await provider.getNetwork();
            console.log('🌐 Network info:', network);
            setChainId(Number(network.chainId));
          } catch (networkError) {
            console.warn('⚠️ Could not get network info:', networkError);
            // Fallback to getting chain ID directly from ethereum
            try {
              const networkId = await window.ethereum.request({ method: 'eth_chainId' });
              const chainId = parseInt(networkId, 16);
              console.log('🌐 Chain ID (fallback):', chainId);
              setChainId(chainId);
            } catch (chainError) {
              console.error('❌ Could not get chain ID:', chainError);
              setChainId(null);
            }
          }
          
          // Get balance safely
          try {
            const balanceStr = await getShmBalance(provider, accounts[0]);
            console.log('💰 Balance returned:', balanceStr);
            setBalance(parseFloat(balanceStr).toFixed(4));
          } catch (balanceError) {
            console.error('❌ Error getting balance:', balanceError);
            setBalance('0.0000');
            toast({
              title: "Balance Fetch Failed",
              description: "Connected to wallet but couldn't fetch balance. Please check network connection.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('❌ Error checking connection:', error);
      }
    }
  };

  const connect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await checkConnection();
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast({
          title: "Connection Failed",
          description: "Unable to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Wallet Required",
        description: "Please install MetaMask or another Web3 wallet to continue.",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
    setIsConnected(false);
  };

  const value: WalletContextType = {
    account,
    isConnected,
    balance,
    connect,
    disconnect,
    chainId
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

const WalletConnector: React.FC = () => {
  const { account, isConnected, balance, connect, disconnect, chainId } = useWallet();
  const [isShardeum, setIsShardeum] = useState(false);

  useEffect(() => {
  
    setIsShardeum(chainId === 8083);
  }, [chainId]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-4">
      <AnimatePresence mode="wait">
    {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button
      variant="floating"
      onClick={connect}
      className="gap-2 px-3 py-2"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-4"
          >
            {/* Network Status */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-navbar/50 backdrop-blur-sm border border-border shadow-soft">
              {isShardeum ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-warning" />
              )}
              <span className="text-sm">
                {isShardeum ? 'Shardeum Unstablenet' : `Chain ${chainId}`}
              </span>
            </div>

            {/* Account Info */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-navbar/50 backdrop-blur-sm border border-border shadow-soft">
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {formatAddress(account!)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {balance} SHM
                </span>
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              variant="floating"
              size="sm"
              onClick={disconnect}
              className="gap-2"
            >
              <Power className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletConnector;