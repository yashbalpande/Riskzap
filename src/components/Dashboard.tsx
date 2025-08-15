import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  DollarSign, 
  Clock,
  Activity,
  Award
} from 'lucide-react';

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
      <div className="absolute inset-0 fractal-bg opacity-20" />
      
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

const Dashboard: React.FC = () => {
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
      trend: 'up' as const
    }
  ];

  const recentActivities = [
    { id: 1, type: 'policy', message: 'Device protection policy created', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'payment', message: 'Premium payment of 0.5 SHM received', time: '5 minutes ago', status: 'success' },
    { id: 3, type: 'claim', message: 'Travel insurance claim approved', time: '8 minutes ago', status: 'success' },
    { id: 4, type: 'kyc', message: 'KYC verification completed for user 0x4a2b...', time: '12 minutes ago', status: 'success' },
    { id: 5, type: 'underwriting', message: 'Risk assessment completed for event coverage', time: '15 minutes ago', status: 'success' }
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
          PayFi Insurance Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time micro-policy analytics on Shardeum Unstablenet
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="h-6 w-6 text-primary particle-glow" />
              <h2 className="text-xl font-bold">Live Activity Feed</h2>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-primary/10"
                >
                  <div className="w-2 h-2 rounded-full bg-success floating" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-success" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-warning particle-glow" />
              <h2 className="text-xl font-bold">Quick Actions</h2>
            </div>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-warning/10 text-left hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Create Policy</h3>
                    <p className="text-xs text-muted-foreground">Start new micro-policy</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 rounded-lg border border-success/20 bg-gradient-to-r from-success/10 to-accent/10 text-left hover:border-success/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-success" />
                  <div>
                    <h3 className="font-semibold">Process Claim</h3>
                    <p className="text-xs text-muted-foreground">Handle insurance claim</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 rounded-lg border border-warning/20 bg-gradient-to-r from-warning/10 to-secondary/10 text-left hover:border-warning/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-warning" />
                  <div>
                    <h3 className="font-semibold">KYC Verification</h3>
                    <p className="text-xs text-muted-foreground">Verify user identity</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 rounded-lg border border-secondary/20 bg-gradient-to-r from-secondary/10 to-destructive/10 text-left hover:border-secondary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-secondary" />
                  <div>
                    <h3 className="font-semibold">Underwriting</h3>
                    <p className="text-xs text-muted-foreground">AI risk assessment</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

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
            <span className="font-semibold">Shardeum Unstablenet Status</span>
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