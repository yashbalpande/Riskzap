import React, { useState, useEffect, createContext, useContext } from 'react';
import Web3 from 'web3';
import { Button } from '@/components/ui/button';
import { Wallet, Power, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletContextType {
  web3: Web3 | null;
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
  const [web3, setWeb3] = useState<Web3 | null>(null);
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
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        
        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setIsConnected(true);
          
          const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
          const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
          setBalance(parseFloat(balanceEth).toFixed(4));
          
          const networkId = await web3Instance.eth.getChainId();
          setChainId(Number(networkId));
        }
      } catch (error) {
        console.error('Error checking connection:', error);
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
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet');
    }
  };

  const disconnect = () => {
    setWeb3(null);
    setAccount(null);
    setBalance('0');
    setChainId(null);
    setIsConnected(false);
  };

  const value: WalletContextType = {
    web3,
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
    // Shardeum Unstablenet Chain ID is typically 1074 or similar
    setIsShardeum(chainId === 1074 || chainId === 1073);
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
              variant="payfi"
              onClick={connect}
              className="gap-2"
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
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
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