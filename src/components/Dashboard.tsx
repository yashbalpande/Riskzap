import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  DollarSign,
  Clock,
  Activity,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import { ActivityService } from '@/services/activityService';
import { useWallet } from '@/components/WalletConnector';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'stable';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: IconComponent, trend }) => {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-warning';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 card-hover"
    >
      <div className="absolute inset-0 fractal-bg opacity-16" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className={`h-4 w-4 ${trendColor}`} />
            <span className={`text-sm ${trendColor}`}>{change}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 particle-glow">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

const UserPoliciesDisplay: React.FC = () => {
  const [userPolicies, setUserPolicies] = useState<any[]>([]);

  useEffect(() => {
    const policies = JSON.parse(localStorage.getItem('USER_POLICIES') || '[]');
    setUserPolicies(policies);
  }, []);

  if (userPolicies.length === 0) {
    return (
      <div className="text-center py-8">
        <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No insurance policies purchased yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Go to the Policies section to purchase your first policy!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userPolicies.map((policy, index) => (
        <motion.div
          key={policy.policyId + policy.purchaseDate}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-primary/20 rounded-lg p-4 bg-card/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold capitalize">{policy.policyId.replace(/-/g, ' ')}</h3>
                  <p className="text-sm text-muted-foreground">
                    Purchased: {new Date(policy.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Premium:</span>
                  <p className="font-semibold">{policy.premium} SHM</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <p className="font-semibold">{policy.platformFee?.toFixed(4)} SHM</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Paid:</span>
                  <p className="font-semibold">{policy.totalPaid?.toFixed(4)} SHM</p>
                </div>
                {policy.status === 'claimed' && (
                  <div>
                    <span className="text-muted-foreground">Net Payout:</span>
                    <p className="font-semibold text-success">{policy.netPayout?.toFixed(4)} SHM</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {policy.status === 'active' && (
                <>
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-success font-semibold">Active</span>
                </>
              )}
              {policy.status === 'claimed' && (
                <>
                  <Award className="h-5 w-5 text-warning" />
                  <span className="text-warning font-semibold">Claimed</span>
                </>
              )}
            </div>
          </div>
          
          {policy.txHash && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <span className="text-xs text-muted-foreground">
                Transaction: {policy.txHash}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { account, isConnected } = useWallet();

  // Quick Action Handlers
  const handleCreatePolicy = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to create a policy');
      return;
    }
    
    // Simulate policy creation
    await ActivityService.logPolicyCreation(account!, 'Custom Micro-Policy');
    alert('🏗️ Policy Creation Process Started!\n\nPolicy Type: Custom Micro-Policy\nStatus: Initiated\nNext Step: Risk Assessment\n\nCheck the Live Activity Feed for updates!');
  };

  const handleProcessClaim = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to process claims');
      return;
    }

    // Simulate claim processing
    const claimAmount = (Math.random() * 3 + 1).toFixed(2); // Random amount 1-4 SHM
    await ActivityService.logPolicyClaim(account!, 'Travel Insurance', claimAmount);
    alert(`✅ Claim Process Initiated!\n\nClaim ID: CL-${Date.now()}\nPolicy Type: Travel Insurance\nClaim Amount: ${claimAmount} SHM\nStatus: Under Review\nExpected Processing: 24-48 hours\n\n📱 Watch the Live Activity Feed for real-time updates!`);
  };

  const handleKYCVerification = async () => {
    if (!isConnected) {
      alert('Please connect your wallet for KYC verification');
      return;
    }

    // Simulate KYC verification
    await ActivityService.logKYCVerification(account!);
    alert(`🔒 KYC Verification Completed!\n\nUser: ${account!.slice(0, 6)}...${account!.slice(-4)}\nStatus: Verified ✅\nLevel: Basic KYC\nValid Until: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}\n\n🔴 Activity logged to Live Feed!`);
  };

  const handleUnderwriting = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to start underwriting');
      return;
    }

    // Simulate AI underwriting with random values
    const riskScore = (Math.random() * 3 + 1).toFixed(1); // 1.0-4.0
    const recommendedPremium = (Math.random() * 0.5 + 0.3).toFixed(2); // 0.3-0.8 SHM
    
    await ActivityService.logUnderwritingActivity(account!, riskScore, recommendedPremium);
    alert(`🤖 AI Underwriting Analysis Complete!\n\nRisk Score: ${riskScore}/10 (Low Risk)\nRecommended Premium: ${recommendedPremium} SHM\nMax Coverage: ${(parseFloat(recommendedPremium) * 15).toFixed(1)} SHM\nValidity: 365 days\nAI Confidence: 94.7%\n\n📊 Results added to Live Activity Feed!`);
  };
  const stats = [
    {
      title: 'Active Policies',
      value: '1,247',
      change: '+12.5%',
      icon: Shield,
      trend: 'up' as const
    },
    {
      title: 'Total Premium (SHM)',
      value: '8,429.3',
      change: '+8.2%',
      icon: DollarSign,
      trend: 'up' as const
    },
    {
      title: 'Claims Processed',
      value: '342',
      change: '+15.7%',
      icon: Award,
      trend: 'up' as const
    },
    {
      title: 'Avg. Response Time',
      value: '2.3s',
      change: '-22.1%',
      icon: Zap,
      trend: 'down' as const
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gradient-fire mb-4">
          Riskzap Insurance Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time micro-policy analytics on Shardeum Testnet
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LiveActivityFeed maxItems={8} />
        </motion.div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-warning particle-glow" />
              <h2 className="text-xl font-bold">Quick Actions</h2>
              {isConnected ? (
                <div className="ml-auto flex items-center gap-1 text-xs text-green-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Connected
                </div>
              ) : (
                <div className="ml-auto flex items-center gap-1 text-xs text-orange-500">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  Connect Wallet
                </div>
              )}
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePolicy}
                className="w-full p-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-warning/10 text-left hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold">Create Policy</h3>
                    <p className="text-xs text-muted-foreground">Start new micro-policy</p>
                  </div>
                  <div className="ml-auto text-xs text-primary/60">Click to start</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProcessClaim}
                className="w-full p-4 rounded-lg border border-success/20 bg-gradient-to-r from-success/10 to-accent/10 text-left hover:border-success/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-success group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold">Process Claim</h3>
                    <p className="text-xs text-muted-foreground">Handle insurance claim</p>
                  </div>
                  <div className="ml-auto text-xs text-success/60">Instant processing</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleKYCVerification}
                className="w-full p-4 rounded-lg border border-warning/20 bg-gradient-to-r from-warning/10 to-secondary/10 text-left hover:border-warning/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-warning group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold">KYC Verification</h3>
                    <p className="text-xs text-muted-foreground">Verify user identity</p>
                  </div>
                  <div className="ml-auto text-xs text-warning/60">Quick verify</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUnderwriting}
                className="w-full p-4 rounded-lg border border-secondary/20 bg-gradient-to-r from-secondary/10 to-destructive/10 text-left hover:border-secondary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold">Underwriting</h3>
                    <p className="text-xs text-muted-foreground">AI risk assessment</p>
                  </div>
                  <div className="ml-auto text-xs text-secondary/60">AI powered</div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Policies Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6"
      >
        <h2 className="text-xl font-bold mb-4 text-gradient-fire">My Insurance Policies</h2>
        <UserPoliciesDisplay />
      </motion.div>

      {/* Network Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success floating" />
            <span className="font-semibold">Shardeum Testnet Status</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Block Height:</span>
              <span className="font-mono">2,847,392</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Gas Price:</span>
              <span className="font-mono">1.2 gwei</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Network Load:</span>
              <span className="text-success font-semibold">Low</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;