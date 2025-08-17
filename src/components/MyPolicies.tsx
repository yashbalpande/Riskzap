import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { localDatabaseService } from '@/services/localDatabase';
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
  claimDate?: string;
  claimAmount?: number;
  baseClaimAmount?: number;
  timeBonus?: number;
  claimPercentage?: number;
  daysSincePurchase?: number;
  withdrawalFee?: number;
  netPayout?: number;
}

const MyPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWallet();

  const calculatePotentialClaim = (policy: PolicyRecord) => {
    const purchaseDate = new Date(policy.purchaseDate);
    const currentDate = new Date();
    const daysSincePurchase = Math.floor((currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let claimPercentage = 0;
    let timeBonus = 0;
    
    if (daysSincePurchase <= 1) {
      claimPercentage = 0.5;
    } else if (daysSincePurchase <= 7) {
      claimPercentage = 5 + (daysSincePurchase * 0.5);
    } else if (daysSincePurchase <= 30) {
      const weeksHeld = Math.floor(daysSincePurchase / 7);
      claimPercentage = 10 + (weeksHeld * 1);
    } else if (daysSincePurchase <= 90) {
      const monthsHeld = Math.floor(daysSincePurchase / 30);
      claimPercentage = 25 + (monthsHeld * 2);
    } else if (daysSincePurchase <= 180) {
      const monthsHeld = Math.floor(daysSincePurchase / 30);
      claimPercentage = 50 + ((monthsHeld - 3) * 3);
    } else if (daysSincePurchase <= 365) {
      const monthsHeld = Math.floor(daysSincePurchase / 30);
      claimPercentage = 75 + ((monthsHeld - 6) * 2);
    } else {
      claimPercentage = 100;
      const yearsHeld = Math.floor(daysSincePurchase / 365);
      timeBonus = yearsHeld * 5;
    }
    
    claimPercentage = Math.min(claimPercentage, 100);
    const totalPercentage = claimPercentage + timeBonus;
    const potentialAmount = (policy.totalPaid * totalPercentage) / 100;
    
    return {
      claimPercentage: totalPercentage,
      potentialAmount,
      daysSincePurchase
    };
  };

  useEffect(() => {
    loadUserPolicies();
  }, [account]);

  const loadUserPolicies = async () => {
    setLoading(true);
    try {
      if (!account) {
        setPolicies([]);
        setLoading(false);
        return;
      }

      console.log('🔍 Starting to load user policies...');
      console.log('👤 Account:', account);
      
      
      await localDatabaseService.inspectLocalStorage();

      const dbPolicies = await localDatabaseService.getUserPolicies(account);
      
      console.log('📊 Raw policies from localStorage:', dbPolicies);
      console.log('📊 Number of raw policies:', dbPolicies.length);
      
        const enhancedPolicies = dbPolicies.map((policy: any) => {
        const policyId = policy.metadata?.policyId || policy.policy_type || 'general';
        console.log('🔧 Converting policy:', { originalPolicy: policy, policyId });
        
        return {
          policyId: policyId,
          premium: policy.premium,
          platformFee: policy.metadata?.platformFee || (policy.premium * 0.02), // 2% platform fee
          userAddress: policy.user_wallet_address,
          txHash: policy.metadata?.txHash || '',
          status: policy.status,
          coverage: policy.coverage,
          duration: policy.duration,
          features: policy.metadata?.features || [],
          purchaseDate: policy.purchase_date,
          totalPaid: policy.metadata?.totalPaid || policy.premium,
          claimAmount: policy.claim_amount,
          claimDate: policy.claim_date,
          policyName: getPolicyName(policyId),
          policyType: getPolicyType(policyId),
          coverageAmount: getCoverageAmount(policyId, policy.premium),
          expiryDate: getExpiryDate(policy.purchase_date, policyId)
        };
      });

      console.log('✅ Enhanced policies for UI:', enhancedPolicies);
      console.log('📊 Number of enhanced policies:', enhancedPolicies.length);

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
        
        {/* Debug Buttons */}
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={async () => {
              console.log('🔧 MANUAL DEBUG TRIGGERED');
              await localDatabaseService.inspectLocalStorage();
              await loadUserPolicies();
            }}
            size="sm"
            variant="outline"
          >
            🔧 Debug
          </Button>
          
          <Button
            onClick={async () => {
              console.log('🧪 TESTING POLICY CREATION WITH CORRECT FORMAT');
              try {
                const testPolicy = await localDatabaseService.createPolicy({
                  userWalletAddress: account || '0x1234567890abcdef',
                  policyType: 'Device Protection',
                  premium: 0.5,
                  coverage: 'Up to $500',
                  duration: '24 hours',
                  metadata: {
                    policyId: 'device-protection',
                    txHash: '0xtest123',
                    platformFee: 0.01,
                    totalPaid: 0.51,
                    features: ['Accidental damage', 'Theft protection'],
                    walletAddress: account || '0x1234567890abcdef'
                  }
                });
                console.log('✅ Test policy created:', testPolicy);
                await loadUserPolicies();
              } catch (error) {
                console.error('❌ Test policy creation failed:', error);
              }
            }}
            size="sm"
            variant="outline"
          >
            🧪 Test Create
          </Button>
          
          <Button
            onClick={async () => {
              console.log('🗑️ CLEARING ALL DATA');
              await localDatabaseService.clearAllData();
              await loadUserPolicies();
            }}
            size="sm"
            variant="destructive"
          >
            🗑️ Clear
          </Button>
        </div>
      </div>

      {/* Policy Summary */}
      {policies.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <h3 className="font-semibold mb-3 text-sm">Portfolio Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {policies.filter(p => p.status === 'active').length}
              </div>
              <div className="text-muted-foreground">Active Policies</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {policies.reduce((sum, p) => sum + p.totalPaid, 0).toFixed(4)} SHM
              </div>
              <div className="text-muted-foreground">Total Invested</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {policies
                  .filter(p => p.status === 'active')
                  .reduce((sum, p) => sum + calculatePotentialClaim(p).potentialAmount, 0)
                  .toFixed(4)} SHM
              </div>
              <div className="text-muted-foreground">Current Claim Value</div>
            </div>
          </div>
        </div>
      )}

      {/* Policies Grid - Updated to match pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.txHash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Policy Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{policy.policyName}</h3>
                  <div className={`flex items-center gap-1 ${getStatusColor(policy.status)}`}>
                    {getStatusIcon(policy.status)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{policy.policyType} Coverage</p>
              </div>

              {/* Premium Display */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {policy.premium}
                  <span className="text-lg font-normal text-gray-500 ml-1">SHM</span>
                </div>
                <div className="text-sm text-gray-500">Premium Paid</div>
              </div>

              {/* Policy Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700 text-sm">Coverage: {policy.coverageAmount} SHM</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700 text-sm">ID: {policy.policyId}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700 text-sm">Expires: {formatDate(policy.expiryDate || '')}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700 text-sm">Blockchain Secured</span>
                </div>
              </div>

              {/* Claim Potential for Active Policies */}
              {policy.status === 'active' && (() => {
                const claimInfo = calculatePotentialClaim(policy);
                return (
                  <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 mb-1">
                        {claimInfo.potentialAmount.toFixed(4)} SHM
                      </div>
                      <div className="text-sm text-green-700">Current Claim Value</div>
                      <div className="text-xs text-gray-600 mt-2">
                        {claimInfo.claimPercentage.toFixed(1)}% rate • Held {claimInfo.daysSincePurchase} days
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Claim Results for Claimed Policies */}
              {policy.status === 'claimed' && policy.claimAmount && (
                <div className="mb-6 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      {policy.claimAmount.toFixed(4)} SHM
                    </div>
                    <div className="text-sm text-blue-700">Claim Processed</div>
                    <div className="text-xs text-gray-600 mt-2">
                      {policy.claimPercentage?.toFixed(1)}% rate • Held {policy.daysSincePurchase} days
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {policy.status === 'active' && (
                  <button className="w-full bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200">
                    File Claim
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => downloadPolicyPDF(policy)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button 
                    onClick={() => viewOnExplorer(policy.txHash)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Explorer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {policies.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
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
