import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, 
  Wallet, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { analyticsService } from '../services/analytics';

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  interface GlobalAnalytics {
    totalUsers: number;
    totalConnections: number;
    totalRevenue: number;
    averagePolicyValue: number;
    totalPoliciesSold: number;
    activePoliciesCount: number;
    claimedPoliciesCount: number;
    totalCoverageIssued: number;
  }

  const [globalData, setGlobalData] = useState<GlobalAnalytics | null>(null);
  interface RevenueItem {
    date: string;
    revenue: number;
    policies: number;
  }
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  interface PolicyTypeItem {
    type: string;
    count: number;
    revenue: number;
  }
  const [policyTypeData, setPolicyTypeData] = useState<PolicyTypeItem[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [global, revenue, policyTypes, userGrowth] = await Promise.all([
        analyticsService.getGlobalAnalytics(),
        analyticsService.getRevenueAnalytics('month'),
        analyticsService.getPolicyTypeAnalytics(),
        analyticsService.getUserGrowthAnalytics('day')
      ]);

      setGlobalData(global);
      setRevenueData(revenue);
      setPolicyTypeData(policyTypes);
      setUserGrowthData(userGrowth);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'claimed': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading && !globalData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌ Error loading analytics</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={fetchAnalytics} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(globalData?.totalUsers || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(globalData?.totalConnections || 0)} total connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(globalData?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(globalData?.averagePolicyValue || 0)} avg policy value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(globalData?.totalPoliciesSold || 0)}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {globalData?.activePoliciesCount || 0} active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {globalData?.claimedPoliciesCount || 0} claimed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(globalData?.totalCoverageIssued || 0)}</div>
            <p className="text-xs text-muted-foreground">Insurance coverage issued</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Policy Types Distribution
            </CardTitle>
            <CardDescription>Popular insurance categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {policyTypeData.map((type, index) => {
                const percentage = globalData?.totalPoliciesSold > 0 
                  ? (type.count / globalData.totalPoliciesSold) * 100 
                  : 0;
                
                return (
                  <div key={type.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{type.type}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{type.count}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(type.revenue)}
                        </div>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% of total policies
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Revenue Trend (30 Days)
            </CardTitle>
            <CardDescription>Daily revenue and policy sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.slice(-10).map((day, index) => (
                <div key={day.date} className="flex justify-between items-center">
                  <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">{formatCurrency(day.revenue)}</div>
                    <div className="text-xs text-muted-foreground">
                      {day.policies} policies
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            User Growth (30 Days)
          </CardTitle>
          <CardDescription>New user registrations over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {userGrowthData.slice(-14).map((day, index) => {
              const maxUsers = Math.max(...userGrowthData.map(d => d.newUsers));
              const height = maxUsers > 0 ? (day.newUsers / maxUsers) * 100 : 0;
              
              return (
                <div key={day.date} className="text-center">
                  <div className="bg-muted rounded p-2 mb-2 relative h-20 flex items-end justify-center">
                    <div 
                      className="bg-primary rounded w-8 transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium">{day.newUsers}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Policy Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Active Policies</span>
              <Badge className={getStatusColor('active')}>
                {globalData?.activePoliciesCount || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Claimed Policies</span>
              <Badge className={getStatusColor('claimed')}>
                {globalData?.claimedPoliciesCount || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Success Rate</span>
              <span className="font-medium">
                {globalData?.totalPoliciesSold > 0 
                  ? ((globalData.activePoliciesCount / globalData.totalPoliciesSold) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Avg Connections per User</span>
              <span className="font-medium">
                {globalData?.totalUsers > 0 
                  ? (globalData.totalConnections / globalData.totalUsers).toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Avg Policies per User</span>
              <span className="font-medium">
                {globalData?.totalUsers > 0 
                  ? (globalData.totalPoliciesSold / globalData.totalUsers).toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Avg Spend per User</span>
              <span className="font-medium">
                {formatCurrency(globalData?.totalUsers > 0 
                  ? globalData.totalRevenue / globalData.totalUsers
                  : 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Database Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Connected
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>API Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Healthy
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span className="text-sm text-muted-foreground">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
