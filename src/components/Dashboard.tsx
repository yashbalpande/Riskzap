import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
      className="relative overflow-hidden rounded-xl card-elevated p-6"
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
          <div className="flex items-center gap-1 mt-3">
            <TrendingUp className={`h-4 w-4 ${trendColor}`} />
            <span className={`text-sm font-medium ${trendColor}`}>{change}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

interface UserPoliciesDisplayProps {}

const UserPoliciesDisplay: React.FC<UserPoliciesDisplayProps> = () => {
  const { isConnected, account } = useWallet();
  const [userPolicies, setUserPolicies] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected && account) {
      // Load user's policies from localStorage or generate sample data
      const policies = [
        {
          id: 'POL-001',
          type: 'Travel Insurance',
          premium: '0.25 SHM',
          coverage: '3.75 SHM',
          status: 'Active',
          expires: '2025-02-16'
        },
        {
          id: 'POL-002', 
          type: 'Phone Protection',
          premium: '0.15 SHM',
          coverage: '2.25 SHM',
          status: 'Active',
          expires: '2025-03-01'
        }
      ];
      setUserPolicies(policies);
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Connect your wallet to see your policies</p>
      </div>
    );
  }

  if (userPolicies.length === 0) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No policies yet</p>
        <p className="text-sm text-muted-foreground mt-2">Create your first policy to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userPolicies.map((policy, index) => (
        <motion.div
          key={policy.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-5 rounded-xl card-elevated border-subtle"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{policy.type}</h4>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>ID: {policy.id}</span>
                <span className="border-l border-border pl-3">Premium: {policy.premium}</span>
                <span className="border-l border-border pl-3">Coverage: {policy.coverage}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                policy.status === 'Active' 
                  ? 'bg-success/10 text-success border border-success/20' 
                  : 'bg-muted/10 text-muted border border-muted/20'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  policy.status === 'Active' ? 'bg-success' : 'bg-muted'
                }`} />
                {policy.status}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Expires: {policy.expires}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { isConnected, account } = useWallet();

  // Quick Action Handlers
  const handleCreatePolicy = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to create a policy');
      return;
    }
    
    // Simulate policy creation
    await ActivityService.logPolicyCreation(account!, 'Custom Micro-Policy');
    alert('🏗️ Policy creation started!\n\nType: Custom Micro-Policy\nStatus: Processing\nNext: Risk assessment\n\nCheck the activity feed for updates!');  
  };

  const handleProcessClaim = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to process claims');
      return;
    }

    // Simulate claim processing
    const claimAmount = (Math.random() * 3 + 1).toFixed(2); // Random amount 1-4 SHM
    await ActivityService.logPolicyClaim(account!, 'Travel Insurance', claimAmount);
    alert(`✅ Claim submitted!\n\nClaim ID: CL-${Date.now()}\nType: Travel Insurance\nAmount: ${claimAmount} SHM\nStatus: Under review\nProcessing: 24-48 hours\n\n📱 Check activity feed for updates!`);
  };

  const handleKYCVerification = async () => {
    if (!isConnected) {
      alert('Please connect your wallet for KYC verification');
      return;
    }

    // Simulate KYC verification
    await ActivityService.logKYCVerification(account!);
    alert(`🔒 ID verification complete!\n\nUser: ${account!.slice(0, 6)}...${account!.slice(-4)}\nStatus: Verified ✅\nLevel: Basic\nValid until: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}\n\n🔴 Logged to activity feed!`);
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
    alert(`🤖 Risk analysis complete!\n\nRisk score: ${riskScore}/10 (Low risk)\nSuggested premium: ${recommendedPremium} SHM\nMax coverage: ${(parseFloat(recommendedPremium) * 15).toFixed(1)} SHM\nValid for: 365 days\nAI confidence: 94.7%\n\n📊 Added to activity feed!`);
  };
  
  const stats = [
    {
      title: 'Active Policies',
      value: '1,247',
      change: '+12.5%',
      icon: () => null,
      trend: 'up' as const
    },
    {
      title: 'Total Premium (SHM)',
      value: '8,429.3',
      change: '+8.2%',
      icon: () => null,
      trend: 'up' as const
    },
    {
      title: 'Claims Processed',
      value: '342',
      change: '+15.7%',
      icon: () => null,
      trend: 'up' as const
    },
    {
      title: 'Avg. Response Time',
      value: '2.3s',
      change: '-22.1%',
      icon: () => null,
      trend: 'down' as const
    }
  ];

  return (
    <div className="w-full">
      {/* Curved Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="smooth-curve-header text-center relative"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full card-elevated border-success"
          >
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">Live on Shardeum Testnet</span>
          </motion.div>
          
          <h1 className="text-hero text-gradient-primary mb-6 leading-tight">
            Protect Everything<br />
            <span className="text-primary">You Love, Instantly</span>
          </h1>
          
          <p className="text-subhero max-w-2xl mx-auto mb-8">
            From your phone to your next trip – Riskzap brings lightning-fast, AI-powered insurance on Shardeum.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-8"
          >
            <Button
              className="btn-primary px-8 py-3 text-base"
              onClick={() => {/* Handle early access */}}
            >
              Join Beta
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 text-base border-subtle hover:border-primary/40 bg-background/50"
              onClick={() => {/* Handle demo */}}
            >
              Try Demo
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Instant payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Blockchain secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              <span>Sub-second claims</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto container-padding space-y-12">

      {/* Professional Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

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
          <div className="card-elevated rounded-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-warning/10">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <h2 className="text-2xl font-bold">Quick Actions</h2>
              {isConnected ? (
                <div className="ml-auto flex items-center gap-2 text-sm text-success font-medium">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Wallet Connected
                </div>
              ) : (
                <div className="ml-auto flex items-center gap-2 text-sm text-warning font-medium">
                  <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                  Connect Wallet
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePolicy}
                className="p-6 rounded-xl card-elevated border-highlight text-left group transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">New Policy</h3>
                    <p className="text-sm text-muted-foreground">Start a new insurance policy with AI risk assessment</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProcessClaim}
                className="p-6 rounded-xl card-elevated border-success text-left group transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/15 transition-colors">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">File Claim</h3>
                    <p className="text-sm text-muted-foreground">Quick claim verification and payout</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleKYCVerification}
                className="p-6 rounded-xl card-elevated border-subtle text-left group transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-verification/10 group-hover:bg-verification/15 transition-colors">
                    <Users className="h-6 w-6 text-verification" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Verify ID</h3>
                    <p className="text-sm text-muted-foreground">Complete identity verification for better coverage</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUnderwriting}
                className="p-6 rounded-xl card-elevated border-subtle text-left group transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
                    <Activity className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Risk Check</h3>
                    <p className="text-sm text-muted-foreground">Smart risk analysis powered by AI</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* User Policies Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-elevated rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-6 text-gradient-primary">Your Policies</h2>
          <UserPoliciesDisplay />
        </motion.div>
      </div>

      {/* Network Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-elevated rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="font-semibold text-lg">Network Status</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Block Height:</span>
              <span className="font-mono font-medium">2,847,392</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Gas Price:</span>
              <span className="font-mono font-medium">1.2 gwei</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Network Load:</span>
              <span className="text-success font-semibold">Low</span>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
