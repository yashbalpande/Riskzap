import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Calendar, 
  Shield, 
  Plane, 
  Camera, 
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Heart
} from 'lucide-react';
import { connectWallet, sendShmToken, getConfiguredCompanyWallet, calculatePurchaseFee, calculateWithdrawFee } from '@/services/web3';

interface PolicyType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  basePremium: number;
  duration: string;
  coverage: string;
  popular: boolean;
  features: string[];
}

const initialPolicies: PolicyType[] = [
  {
    id: 'device',
    name: 'Device Protection',
    description: 'Instant coverage for smartphones, tablets, and electronics',
    icon: Smartphone,
    basePremium: 0.5,
    duration: '24 hours',
    coverage: 'Up to $500',
    popular: true,
    features: [
      'Accidental damage',
      'Theft protection',
      'Liquid damage',
      'Instant claim processing'
    ]
  },
  {
    id: 'event',
    name: 'Event Coverage',
    description: 'Quick insurance for concerts, sports events, and gatherings',
    icon: Calendar,
    basePremium: 1.2,
    duration: 'Single event',
    coverage: 'Up to $1,000',
    popular: false,
    features: [
      'Event cancellation',
      'Weather protection',
      'Travel delays',
      'Emergency medical'
    ]
  },
  {
    id: 'travel',
    name: 'Micro Travel',
    description: 'Short-term travel insurance for day trips and weekends',
    icon: Plane,
    basePremium: 2.0,
    duration: '1-7 days',
    coverage: 'Up to $2,500',
    popular: true,
    features: [
      'Trip interruption',
      'Baggage loss',
      'Medical emergency',
      'Flight delays'
    ]
  },
  {
    id: 'equipment',
    name: 'Equipment Rental',
    description: 'Coverage for rented cameras, tools, and equipment',
    icon: Camera,
    basePremium: 0.8,
    duration: 'Rental period',
    coverage: 'Full replacement',
    popular: false,
    features: [
      'Damage protection',
      'Theft coverage',
      'Loss replacement',
      'No deductible'
    ]
  },
  {
    id: 'Health',
  name: 'Health Insurance',
  description: 'Comprehensive coverage for medical emergencies and hospital visits',
  icon: Heart,
  basePremium: 1.2,
  duration: '1 year',
  coverage: 'Up to $50,000',
  popular: true,
  features: [
    'Hospitalization expenses',
    'Pre & post hospitalization cover',
    'Cashless treatments',
    'Ambulance charges covered'
    ]
  },
];

const PolicyCards: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [policyTypes, setPolicyTypes] = useState<PolicyType[]>(initialPolicies);

  // KYC / modal state
  const [showKycModal, setShowKycModal] = useState<null | { type: 'claim' | 'create'; policyId?: string }>(null);
  const [kycForm, setKycForm] = useState({ fullName: '', idNumber: '' });
  const [kycVerified, setKycVerified] = useState<Record<string, boolean>>({}); // maps wallet address -> verified

  // create policy modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPolicyForm, setNewPolicyForm] = useState({ name: '', premium: '', duration: '', coverage: '' });

  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicy(policyId === selectedPolicy ? null : policyId);
  };

  // Preserve original purchasePolicy but extend to perform token transfer via SHM
  const purchasePolicy = async (policy: PolicyType) => {
    // This would integrate with the smart contract
    console.log('Purchasing policy:', policy.name);

    try {
      const { provider, signer, address } = await connectWallet() as any;

      // Ensure we pass a transaction-capable signer to sendShmToken.
      let txSigner: any = signer;
      try {
        const prov = provider;
        if ((!txSigner || typeof txSigner.sendTransaction !== 'function') && prov && typeof prov.getSigner === 'function') {
          const maybe = prov.getSigner();
          txSigner = typeof maybe.then === 'function' ? await maybe : maybe;
        }
      } catch (e) {
        // ignore and fallback to signer
      }

      if (!txSigner || typeof txSigner.sendTransaction !== 'function') {
        throw new Error('No transaction-capable signer available. Ensure you connected a wallet that can send transactions.');
      }

      // Calculate total amount: premium + 5% platform fee
      const feeCalculation = calculatePurchaseFee(policy.basePremium);
      const totalAmount = policy.basePremium + feeCalculation.fee;
      
      // Transfer total amount (premium + platform fee) to company wallet
      const tx = await sendShmToken(txSigner, totalAmount);
      console.log('Insurance purchase tx:', tx.hash);
      
      // Store policy purchase record
      const policyRecord = {
        policyId: policy.id,
        premium: policy.basePremium,
        platformFee: feeCalculation.fee,
        totalPaid: totalAmount,
        purchaseDate: new Date().toISOString(),
        userAddress: await txSigner.getAddress(),
        txHash: tx.hash,
        status: 'active'
      };
      
      // Save to localStorage (in real app, save to backend)
      const existingPolicies = JSON.parse(localStorage.getItem('USER_POLICIES') || '[]');
      existingPolicies.push(policyRecord);
      localStorage.setItem('USER_POLICIES', JSON.stringify(existingPolicies));
      
      const companyWallet = getConfiguredCompanyWallet() || 'configured wallet';
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
      const modeText = isDemoMode ? ' (Demo Mode - Simulated)' : ' 🚀 (LIVE - Real SHM Transaction!)';
      alert(`Policy purchased successfully!${modeText}\nPremium: ${policy.basePremium} SHM\nPlatform Fee (5%): ${feeCalculation.fee.toFixed(4)} SHM\nTotal Paid: ${totalAmount.toFixed(4)} SHM\nSent to: ${companyWallet}\nTx: ${tx.hash}`);
    } catch (err: any) {
      console.error('Purchase failed:', err);
      alert('Purchase failed: ' + (err?.message || err));
    }
  };

  // Quick buy helper bound to UI - keeps the same label and behavior expectations
  const handleQuickBuy = async (e: React.MouseEvent, policy: PolicyType) => {
    e.stopPropagation();
    await purchasePolicy(policy);
  };

  const openKycForClaim = (policyId: string) => {
    setShowKycModal({ type: 'claim', policyId });
  };

  const submitKyc = async () => {
    try {
      const { address } = await connectWallet();
      // In real app: send KYC documents to a trusted provider. Here we simulate approval.
      setKycVerified((s) => ({ ...s, [address]: true }));
      setShowKycModal(null);
      alert('KYC submitted and verified for ' + address);
    } catch (err: any) {
      alert('KYC failed: ' + (err?.message || err));
    }
  };

  const handleClaim = async (policyId: string) => {
    try {
      const { address } = await connectWallet();
      if (!kycVerified[address]) {
        // prompt KYC
        setShowKycModal({ type: 'claim', policyId });
        return;
      }

      // Get user's policy records
      const userPolicies = JSON.parse(localStorage.getItem('USER_POLICIES') || '[]');
      const policy = userPolicies.find((p: any) => p.policyId === policyId && p.userAddress === address);
      
      if (!policy) {
        alert('Policy not found or you are not the owner.');
        return;
      }

      if (policy.status === 'claimed') {
        alert('This policy has already been claimed.');
        return;
      }

      // For demo: assume claim is approved and payout equals the premium paid
      const claimAmount = policy.premium; // In real app, this would be determined by claim assessment
      
      // Calculate withdrawal fee (0.2%)
      const feeCalculation = calculateWithdrawFee(claimAmount);
      const netPayout = feeCalculation.net;
      
      // In real app: this would transfer from company wallet to user
      // For demo: we'll just simulate the transaction
      alert(`Claim approved!\nClaim Amount: ${claimAmount} SHM\nWithdrawal Fee (0.2%): ${feeCalculation.fee.toFixed(4)} SHM\nNet Payout: ${netPayout.toFixed(4)} SHM\n\nIn production, ${netPayout.toFixed(4)} SHM would be transferred to your wallet.`);
      
      // Update policy status
      policy.status = 'claimed';
      policy.claimDate = new Date().toISOString();
      policy.claimAmount = claimAmount;
      policy.withdrawalFee = feeCalculation.fee;
      policy.netPayout = netPayout;
      
      localStorage.setItem('USER_POLICIES', JSON.stringify(userPolicies));
      
    } catch (err: any) {
      alert('Claim failed: ' + (err?.message || err));
    }
  };

  const openCreatePolicy = () => {
    setShowCreateModal(true);
  };

  const submitCreatePolicy = async () => {
    // Simple client-side create flow (would normally go to backend / contract)
    const id = newPolicyForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newPolicy: PolicyType = {
      id,
      name: newPolicyForm.name || 'Custom Policy',
      description: 'User created policy',
      icon: Smartphone,
      basePremium: Number(newPolicyForm.premium) || 0.1,
      duration: newPolicyForm.duration || 'Custom',
      coverage: newPolicyForm.coverage || 'Custom',
      popular: false,
      features: ['User created policy']
    };
    setPolicyTypes((p) => [newPolicy, ...p]);
    setShowCreateModal(false);
    setNewPolicyForm({ name: '', premium: '', duration: '', coverage: '' });
    alert('Policy created locally. For production, persist this via backend or smart contract.');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient-fire mb-4">
          Micro-Policy Marketplace
        </h2>
        <p className="text-lg text-muted-foreground">
          Instant, affordable insurance for your immediate needs
        </p>
      </div>

      <div className="mb-6 text-right">
        <Button onClick={openCreatePolicy} variant="outline">Create New Policy</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {policyTypes.map((policy, index) => {
          const IconComponent = policy.icon;
          const isSelected = selectedPolicy === policy.id;

          return (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular Badge */}
              {policy.popular && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-bold particle-glow">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Popular
                  </div>
                </div>
              )}

              <motion.div
                className={`
                  relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
                  ${isSelected 
                    ? 'border-primary bg-card shadow-2xl shadow-primary/20 scale-105' 
                    : 'border-primary/20 bg-card/50 hover:border-primary/40 card-hover'
                  }
                `}
                onClick={() => handlePolicySelect(policy.id)}
                whileHover={{ y: -5 }}
                layout
              >
                {/* Holographic Background Effect */}
                <div className="absolute inset-0 holographic opacity-10" />

                <div className="relative p-6 backdrop-blur-sm">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10 particle-glow">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{policy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {policy.description}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <DollarSign className="h-5 w-5 text-success mx-auto mb-2" />
                      <div className="text-lg font-bold text-success">
                        {policy.basePremium} SHM
                      </div>
                      <div className="text-xs text-muted-foreground">Premium</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <Clock className="h-5 w-5 text-warning mx-auto mb-2" />
                      <div className="text-sm font-bold">{policy.duration}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                      <div className="text-sm font-bold">{policy.coverage}</div>
                      <div className="text-xs text-muted-foreground">Coverage</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <motion.div
                    initial={false}
                    animate={{ height: isSelected ? 'auto' : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Coverage Features:</h4>
                      <ul className="space-y-2">
                        {policy.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <div className="space-y-3">
                    <Button
                      variant={isSelected ? "hero" : "payfi"}
                      className="w-full gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickBuy(e, policy);
                      }}
                    >
                      <Zap className="h-4 w-4" />
                      {isSelected ? 'Purchase Now' : 'Quick Buy'}
                    </Button>

                    <div className="flex gap-3">
                      <Button onClick={(e) => { e.stopPropagation(); openKycForClaim(policy.id); }} variant="ghost" className="flex-1">Claim</Button>
                      <Button onClick={(e) => { e.stopPropagation(); alert('More details or manual purchase flow can be added here.'); }} variant="outline" className="flex-1">Details</Button>
                    </div>
                  </div>
                </div>

                {/* Animated Border Effect */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px hsl(var(--primary) / 0.5)',
                        '0 0 40px hsl(var(--primary) / 0.8)',
                        '0 0 20px hsl(var(--primary) / 0.5)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="fractal-bg p-8 rounded-2xl border border-primary/20">
          <h3 className="text-2xl font-bold text-gradient-success mb-4">
            Why Choose PayFi Micro-Policies?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Zap className="h-12 w-12 text-primary mx-auto mb-3 particle-glow" />
              <h4 className="font-bold mb-2">Instant Coverage</h4>
              <p className="text-sm text-muted-foreground">
                Get protected in seconds with smart contract automation
              </p>
            </div>
            <div>
              <DollarSign className="h-12 w-12 text-success mx-auto mb-3 particle-glow" />
              <h4 className="font-bold mb-2">Micro-Payments</h4>
              <p className="text-sm text-muted-foreground">
                Pay only for what you need with SHM tokens
              </p>
            </div>
            <div>
              <Shield className="h-12 w-12 text-warning mx-auto mb-3 particle-glow" />
              <h4 className="font-bold mb-2">Trustless Claims</h4>
              <p className="text-sm text-muted-foreground">
                Automated claim processing via blockchain verification
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KYC Modal (simple) */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">KYC Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">To proceed you must complete a quick KYC.</p>
            <input className="w-full p-2 mb-2 border rounded" placeholder="Full name" value={kycForm.fullName} onChange={(e) => setKycForm((s) => ({ ...s, fullName: e.target.value }))} />
            <input className="w-full p-2 mb-4 border rounded" placeholder="Government ID number" value={kycForm.idNumber} onChange={(e) => setKycForm((s) => ({ ...s, idNumber: e.target.value }))} />
            <div className="flex gap-3">
              <Button onClick={() => setShowKycModal(null)} variant="ghost">Cancel</Button>
              <Button onClick={submitKyc}>Submit & Verify</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Policy Modal (simple) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Policy</h3>
            <input className="w-full p-2 mb-2 border rounded" placeholder="Policy name" value={newPolicyForm.name} onChange={(e) => setNewPolicyForm((s) => ({ ...s, name: e.target.value }))} />
            <input className="w-full p-2 mb-2 border rounded" placeholder="Premium (SHM)" value={newPolicyForm.premium} onChange={(e) => setNewPolicyForm((s) => ({ ...s, premium: e.target.value }))} />
            <input className="w-full p-2 mb-2 border rounded" placeholder="Duration" value={newPolicyForm.duration} onChange={(e) => setNewPolicyForm((s) => ({ ...s, duration: e.target.value }))} />
            <input className="w-full p-2 mb-4 border rounded" placeholder="Coverage" value={newPolicyForm.coverage} onChange={(e) => setNewPolicyForm((s) => ({ ...s, coverage: e.target.value }))} />
            <div className="flex gap-3">
              <Button onClick={() => setShowCreateModal(false)} variant="ghost">Cancel</Button>
              <Button onClick={submitCreatePolicy}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyCards;