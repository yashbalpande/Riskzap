import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  DollarSign, 
  User, 
  FileText, 
  Download, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Calendar,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/components/WalletConnector';

interface PolicyRecord {
  policyId: string;
  premium: number;
  platformFee: number;
  totalPaid: number;
  purchaseDate: string;
  userAddress: string;
  txHash: string;
  status: 'active' | 'expired' | 'claimed';
  policyName?: string;
  policyType?: string;
  coverageAmount?: number;
  expiryDate?: string;
}

const MyPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWallet();

  useEffect(() => {
    loadUserPolicies();
  }, [account]);

  const loadUserPolicies = () => {
    setLoading(true);
    try {
      const existingPolicies = JSON.parse(localStorage.getItem('USER_POLICIES') || '[]');
      
      // Filter policies for current user if wallet is connected
      const userPolicies = account 
        ? existingPolicies.filter((policy: PolicyRecord) => 
            policy.userAddress.toLowerCase() === account.toLowerCase()
          )
        : existingPolicies;
      
      // Enhance policies with additional info
      const enhancedPolicies = userPolicies.map((policy: PolicyRecord) => ({
        ...policy,
        policyName: getPolicyName(policy.policyId),
        policyType: getPolicyType(policy.policyId),
        coverageAmount: getCoverageAmount(policy.policyId, policy.premium),
        expiryDate: getExpiryDate(policy.purchaseDate, policy.policyId)
      }));

      setPolicies(enhancedPolicies);
    } catch (error) {
      console.error('Error loading policies:', error);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const getPolicyName = (policyId: string) => {
    const policyNames: { [key: string]: string } = {
      'device-protection': 'Device Protection Insurance',
      'travel-insurance': 'Travel Insurance',
      'health-micro': 'Health Micro-Insurance',
      'event-coverage': 'Event Coverage Insurance',
      'freelancer-protection': 'Freelancer Protection'
    };
    return policyNames[policyId] || 'Insurance Policy';
  };

  const getPolicyType = (policyId: string) => {
    const policyTypes: { [key: string]: string } = {
      'device-protection': 'Electronics',
      'travel-insurance': 'Travel',
      'health-micro': 'Health',
      'event-coverage': 'Event',
      'freelancer-protection': 'Professional'
    };
    return policyTypes[policyId] || 'General';
  };

  const getCoverageAmount = (policyId: string, premium: number) => {
    // Coverage is typically 10-20x the premium for micro-insurance
    const multiplier = policyId === 'health-micro' ? 20 : 15;
    return premium * multiplier;
  };

  const getExpiryDate = (purchaseDate: string, policyId: string) => {
    const purchase = new Date(purchaseDate);
    const daysToAdd = policyId === 'travel-insurance' ? 30 : 365; // Travel: 30 days, others: 1 year
    const expiry = new Date(purchase.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return expiry.toISOString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'expired': return 'text-red-500';
      case 'claimed': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      case 'claimed': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const downloadPolicyPDF = (policy: PolicyRecord) => {
    // Create a simple policy document text
    const policyDocument = `
RISKZAP INSURANCE POLICY CERTIFICATE
=====================================

Policy Details:
- Policy ID: ${policy.policyId}
- Policy Name: ${policy.policyName}
- Policy Type: ${policy.policyType}
- Status: ${policy.status.toUpperCase()}

Coverage Information:
- Coverage Amount: ${policy.coverageAmount} SHM 
- Premium Paid: ${policy.premium} SHM
- Platform Fee: ${policy.platformFee} SHM
--------------------------------------------
- Total Paid: ${policy.totalPaid} SHM

Policyholder:
- Wallet Address: ${policy.userAddress}

- Purchase Date: ${formatDate(policy.purchaseDate)}
- Expiry Date: ${formatDate(policy.expiryDate || '')}

Transaction:
- Transaction Hash: ${policy.txHash}
- Blockchain: Shardeum Testnet

Terms & Conditions:
This is a micro-insurance policy powered by blockchain technology.
Claims are subject to verification and approval.

Generated on: ${new Date().toLocaleString()}
Platform: RiskZap Insurance (Shardeum Testnet)
    `;

    // Create and download the file
    const blob = new Blob([policyDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RiskZap_Policy_${policy.policyId}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewOnExplorer = (txHash: string) => {
    window.open(`https://explorer-testnet.shardeum.org/transaction/${txHash}`, '_blank');
  };

  if (!account) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">My Policies</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Connect your wallet to view your insurance policies</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="text-xl font-bold">My Policies</h2>
        </div>
        <div className="space-y-4">   
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-background/50 border border-primary/10 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-primary particle-glow" />
        <h2 className="text-xl font-bold">My Policies</h2>
        <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-semibold">
          {policies.length} {policies.length === 1 ? 'Policy' : 'Policies'}
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.txHash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 ${getStatusColor(policy.status)}`}>
                    {getStatusIcon(policy.status)}
                    <span className="text-sm font-medium capitalize">{policy.status}</span>
                  </div>
                  <h3 className="font-semibold text-sm">{policy.policyName}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadPolicyPDF(policy)}
                    className="h-8 w-8 p-0"
                    title="Download Policy Document"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => viewOnExplorer(policy.txHash)}
                    className="h-8 w-8 p-0"
                    title="View Transaction"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>Coverage: {policy.coverageAmount} SHM</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>Premium: {policy.premium} SHM</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Purchased: {formatDate(policy.purchaseDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Expires: {formatDate(policy.expiryDate || '')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  <span>Policy: {policy.policyId}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{formatAddress(policy.userAddress)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {policies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">No insurance policies found</p>
            <p className="text-xs">Purchase a policy to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPolicies;
